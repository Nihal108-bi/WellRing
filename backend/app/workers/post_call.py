"""
Post-call worker — verifies the transcript was saved + logs call stats.

Phase 1 implementation: minimal. Phase 2 adds:
- Claude Haiku summary generation
- OpenAI embeddings into pgvector
- Risk scoring + alert dispatch
"""
from __future__ import annotations

import asyncio
import json
from pathlib import Path
from uuid import UUID

from app.core.celery_app import celery_app
from app.core.logging import get_logger
from app.db.repositories.calls import CallRepository
from app.db.session import get_worker_db_context as get_db_context

log = get_logger(__name__)


@celery_app.task(
    name="app.workers.post_call.run_post_call_pipeline",
    queue="post_call",
    bind=True,
    max_retries=3,
    default_retry_delay=30,
)
def run_post_call_pipeline(self, call_id: str) -> dict[str, str | int]:
    """
    Verify the transcript file exists, log call stats, update DB.

    Phase 2 will extend this to generate AI summaries and embeddings.
    """
    try:
        return asyncio.run(_async_post_call_pipeline(UUID(call_id)))
    except Exception as exc:
        log.exception("post_call_failed", call_id=call_id, error=str(exc))
        raise self.retry(exc=exc)


async def _async_post_call_pipeline(call_id: UUID) -> dict[str, str | int]:
    async with get_db_context() as db:
        call_repo = CallRepository(db)
        call = await call_repo.get_by_id(call_id)

        if call is None:
            log.warning("post_call_call_not_found", call_id=str(call_id))
            return {"call_id": str(call_id), "status": "call_not_found", "messages": 0}

        if not call.transcript_url:
            log.info(
                "post_call_no_transcript",
                call_id=str(call_id),
                call_status=call.status,
            )
            return {"call_id": str(call_id), "status": "no_transcript", "messages": 0}

        transcript_path = Path(call.transcript_url)
        if not transcript_path.exists():
            log.warning(
                "post_call_transcript_missing",
                call_id=str(call_id),
                path=str(transcript_path),
            )
            return {"call_id": str(call_id), "status": "file_missing", "messages": 0}

        try:
            payload = json.loads(transcript_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            log.exception(
                "post_call_transcript_invalid_json",
                call_id=str(call_id),
                error=str(exc),
            )
            return {"call_id": str(call_id), "status": "invalid_json", "messages": 0}

        messages = payload.get("messages", [])
        user_turns = sum(1 for m in messages if m.get("role") == "user")
        assistant_turns = sum(1 for m in messages if m.get("role") == "assistant")

        log.info(
            "post_call_processed",
            call_id=str(call_id),
            total_messages=len(messages),
            user_turns=user_turns,
            assistant_turns=assistant_turns,
            duration_seconds=call.duration_seconds,
            transcript_size_bytes=transcript_path.stat().st_size,
        )

        return {
            "call_id": str(call_id),
            "status": "processed",
            "messages": len(messages),
            "user_turns": user_turns,
            "assistant_turns": assistant_turns,
        }