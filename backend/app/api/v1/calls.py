"""
Calls router — handles:
- POST /calls/test-dial   → trigger a real Twilio call (dev only)
- GET  /calls/twiml/{id}  → TwiML callback Twilio fetches when the call connects
- WS   /ws/call/{id}      → bidirectional audio stream during the live call

In Batch 1.2, the WebSocket handler is a SKELETON — it accepts the connection,
logs audio frames, and hangs up after 30 seconds. Batch 1.3 plugs in the
actual Pipecat pipeline.
"""
from __future__ import annotations

import asyncio
from datetime import datetime, timezone
from uuid import UUID
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request, WebSocket, WebSocketDisconnect, status
from fastapi.responses import Response
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import CurrentContext, get_current_context
from app.core.config import settings
from app.core.logging import get_logger
from app.db.repositories.calls import CallRepository
from app.db.repositories.seniors import SeniorRepository
from app.db.session import AsyncSessionLocal, get_db
from app.telephony.dial_manager import place_test_call
from app.telephony.twilio_handler import build_call_twiml

router = APIRouter(prefix="/calls", tags=["calls"])
log = get_logger(__name__)


class TestDialRequest(BaseModel):
    senior_id: UUID


class TestDialResponse(BaseModel):
    call_id: UUID
    twilio_call_sid: str | None
    message: str


@router.post("/test-dial", response_model=TestDialResponse)
async def test_dial(
    payload: TestDialRequest,
    request: Request,
    ctx: CurrentContext = Depends(get_current_context),
    db: AsyncSession = Depends(get_db),
) -> TestDialResponse:
    """
    Place a real Twilio call to a senior using the streaming WebSocket flow.

    Dev-only endpoint — production calls come from Celery Beat (Batch 1.4).
    """
    senior_repo = SeniorRepository(db)
    senior = await senior_repo.get_by_id(payload.senior_id)
    if senior is None or senior.family_id != ctx.family.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Senior not found",
        )

    call_repo = CallRepository(db)
    call = await call_repo.create_scheduled(
        senior_id=senior.id,
        scheduled_at=datetime.now(timezone.utc),
        channel="voice",
        tier="standard",
    )

    # Build the public URL Twilio fetches for TwiML instructions.
    # In dev, this is the ngrok URL. In prod, this is your real domain.
    base_url = str(request.base_url).rstrip("/")
    twiml_url = f"{base_url}/api/v1/calls/twiml/{call.id}"

    log.info(
        "test_dial_initiating",
        call_id=str(call.id),
        senior_id=str(senior.id),
        to=senior.phone,
        twiml_url=twiml_url,
    )

    # Twilio will fetch TwiML from this URL when the call connects
    from twilio.twiml.voice_response import VoiceResponse
    from twilio.rest import Client

    client = Client(
        settings.twilio_account_sid.get_secret_value(),
        settings.twilio_auth_token.get_secret_value(),
    )

    def _sync_create() -> str:
        twilio_call = client.calls.create(
            to=senior.phone,
            from_=settings.twilio_phone_number,
            url=twiml_url,
            method="GET",
        )
        return twilio_call.sid

    try:
        twilio_call_sid = await asyncio.to_thread(_sync_create)
        await call_repo.mark_started(call.id, twilio_call_sid=twilio_call_sid)
        return TestDialResponse(
            call_id=call.id,
            twilio_call_sid=twilio_call_sid,
            message=f"Call placed to {senior.phone}. Your phone should ring shortly.",
        )
    except Exception as exc:
        log.exception("test_dial_failed", error=str(exc))
        await call_repo.mark_failed(call.id, reason=str(exc))
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Twilio call failed: {exc}",
        ) from exc


@router.get("/twiml/{call_id}", include_in_schema=False)
async def twilio_twiml_callback(
    call_id: UUID,
    request: Request,
) -> Response:
    """
    Twilio fetches this URL when the call connects.
    We return TwiML telling Twilio to open a WebSocket back to us.

    NOTE: This endpoint is called BY TWILIO, not by the frontend.
    It does NOT require auth — Twilio doesn't send our JWT.
    For production, validate Twilio's signature header (X-Twilio-Signature).
    """
    # Build the wss:// URL — convert http:// → ws:// or https:// → wss://
    host = request.url.hostname
    scheme = "wss" if request.url.scheme == "https" else "ws"

    # ngrok exposes our local server, so the WS URL should use the same host
    ws_url = f"{scheme}://{host}/api/v1/calls/ws/{call_id}"

    log.info(
        "twiml_callback_hit",
        call_id=str(call_id),
        ws_url=ws_url,
    )

    twiml = build_call_twiml(
        websocket_url=ws_url,
        greeting="Hello! Connecting you now.",
    )

    return Response(content=twiml, media_type="application/xml")

@router.get("/{call_id}/transcript")
async def get_call_transcript(
    call_id: UUID,
    ctx: CurrentContext = Depends(get_current_context),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """
    Return the full transcript JSON for a completed call.

    Family-scoped — you can only see your own family's transcripts.
    """
    from pathlib import Path

    call_repo = CallRepository(db)
    senior_repo = SeniorRepository(db)

    call = await call_repo.get_by_id(call_id)
    if call is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Call not found",
        )

    senior = await senior_repo.get_by_id(call.senior_id)
    if senior is None or senior.family_id != ctx.family.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Call not found",
        )

    if not call.transcript_url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transcript not yet available",
        )

    transcript_path = Path(call.transcript_url)
    if not transcript_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transcript file missing",
        )

    import json as _json
    payload = _json.loads(transcript_path.read_text(encoding="utf-8"))
    return payload

@router.websocket("/ws/{call_id}")
async def call_websocket(
    websocket: WebSocket,
    call_id: UUID,
) -> None:
    """
    WebSocket endpoint Twilio connects to during the live call.

    Builds and runs a Pipecat pipeline: Twilio audio → STT → LLM → TTS → Twilio audio.
    """
    from pipecat.pipeline.runner import PipelineRunner
    from pipecat.runner.utils import parse_telephony_websocket

    from app.pipeline.builder import build_pipeline_task
    from app.pipeline.components.config import PipelineConfig

    await websocket.accept()
    log.info("ws_connected", call_id=str(call_id))

    async with AsyncSessionLocal() as db:
        call_repo = CallRepository(db)
        senior_repo = SeniorRepository(db)

        call = await call_repo.get_by_id(call_id)
        if call is None:
            log.warning("ws_call_not_found", call_id=str(call_id))
            await websocket.close(code=1008, reason="Call not found")
            return

        senior = await senior_repo.get_by_id(call.senior_id)
        if senior is None:
            log.warning("ws_senior_not_found", call_id=str(call_id))
            await websocket.close(code=1008, reason="Senior not found")
            return

        try:
            transport_type, call_data = await parse_telephony_websocket(websocket)
            log.info(
                "ws_telephony_parsed",
                call_id=str(call_id),
                transport_type=transport_type,
                stream_sid=call_data.get("stream_id"),
            )
        except Exception as exc:
            log.exception("ws_telephony_parse_failed", call_id=str(call_id), error=str(exc))
            await websocket.close()
            return

        config = PipelineConfig(
            call_id=call_id,
            senior_id=senior.id,
            tier="standard",
            telephony_provider="twilio",
            locale=senior.locale,
            stt_language="multi" if senior.locale.startswith("hi") else "en",
            twilio_stream_sid=call_data.get("stream_id", ""),
            twilio_call_sid=call_data.get("call_id", ""),
            system_instruction=(
                f"You are a warm daily check-in companion calling {senior.name}. "
                f"Keep responses to 1-2 short sentences. Speak slowly with natural pauses. "
                f"Ask open questions about their day, their feelings, and how they're doing. "
                f"Listen far more than you talk. Never give medical advice."
            ),
        )

        await db.commit()
    
    task = None
    try:
        task = build_pipeline_task(config, websocket)

        @task.event_handler("on_client_disconnected")
        async def on_disconnected(task, client) -> None:
            log.info("ws_client_disconnected", call_id=str(call_id))
            await task.cancel()

        runner = PipelineRunner(handle_sigint=False)
        log.info("ws_pipeline_starting", call_id=str(call_id))
        await runner.run(task)
        log.info("ws_pipeline_ended", call_id=str(call_id))

    except WebSocketDisconnect:
        log.info("ws_disconnected_cleanly", call_id=str(call_id))

    except Exception as exc:
        log.exception("ws_pipeline_error", call_id=str(call_id), error=str(exc))

    finally:
            transcript_path: str | None = None
            if task is not None and hasattr(task, "transcript_buffer"):
                try:
                    from app.pipeline.builder import save_transcript
                    path = await save_transcript(
                        call_id=call_id,
                        messages=task.transcript_buffer,
                        config=config,
                    )
                    transcript_path = str(path)
                except Exception as exc:
                    log.exception("transcript_save_failed", call_id=str(call_id), error=str(exc))

            async with AsyncSessionLocal() as db:
                call_repo = CallRepository(db)
                await call_repo.mark_ended(call_id)
                if transcript_path:
                    await call_repo.update_post_call(
                        call_id=call_id,
                        transcript_url=transcript_path,
                    )
                await db.commit()

            # Queue the post-call worker (summarization + embeddings come in Phase 2)
            try:
                from app.workers.post_call import run_post_call_pipeline
                run_post_call_pipeline.apply_async(
                    args=[str(call_id)],
                    queue="post_call",
                    countdown=2,
                )
                log.info("post_call_task_queued", call_id=str(call_id))
            except Exception as exc:
                log.exception("post_call_queue_failed", call_id=str(call_id), error=str(exc))

            log.info("ws_closed", call_id=str(call_id))