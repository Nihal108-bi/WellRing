"""
Pipeline builder — assembles the live conversation pipeline.

Imports verified against the official Pipecat 1.2.1 quickstart.
TranscriptCapture is our own tiny FrameProcessor that captures every
user STT finalization and every assistant TTS sentence into a buffer.
"""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import UUID

from fastapi import WebSocket
from pipecat.audio.vad.silero import SileroVADAnalyzer
from pipecat.frames.frames import Frame, TranscriptionFrame, TTSTextFrame
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.task import PipelineParams, PipelineTask
from pipecat.processors.aggregators.llm_context import LLMContext
from pipecat.processors.aggregators.llm_response_universal import (
    LLMContextAggregatorPair,
    LLMUserAggregatorParams,
)
from pipecat.processors.frame_processor import FrameDirection, FrameProcessor
from pipecat.serializers.twilio import TwilioFrameSerializer
from pipecat.transports.websocket.fastapi import (
    FastAPIWebsocketParams,
    FastAPIWebsocketTransport,
)

from app.core.config import settings
from app.core.logging import get_logger
from app.pipeline.components.llm import build_llm
from app.pipeline.components.stt import build_stt
from app.pipeline.components.tts import build_tts
from app.pipeline.components.config import PipelineConfig

log = get_logger(__name__)

TRANSCRIPT_DIR = Path("storage/transcripts")
TRANSCRIPT_DIR.mkdir(parents=True, exist_ok=True)


class TranscriptCapture(FrameProcessor):
    """Capture finalized user STT + assistant TTS sentences into a buffer."""

    def __init__(self, buffer: list[dict[str, Any]]) -> None:
        super().__init__()
        self._buffer = buffer

    async def process_frame(self, frame: Frame, direction: FrameDirection) -> None:
        await super().process_frame(frame, direction)

        if isinstance(frame, TranscriptionFrame):
            self._buffer.append({
                "role": "user",
                "content": frame.text,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })
        elif isinstance(frame, TTSTextFrame):
            self._buffer.append({
                "role": "assistant",
                "content": frame.text,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })

        await self.push_frame(frame, direction)


def _transcript_path(call_id: UUID) -> Path:
    return TRANSCRIPT_DIR / f"{call_id}.json"


async def save_transcript(
    call_id: UUID,
    messages: list[dict[str, Any]],
    config: PipelineConfig,
) -> Path:
    """Write the full transcript to disk as JSON."""
    path = _transcript_path(call_id)
    payload = {
        "call_id": str(call_id),
        "senior_id": str(config.senior_id),
        "tier": config.tier,
        "locale": config.locale,
        "saved_at": datetime.now(timezone.utc).isoformat(),
        "message_count": len(messages),
        "messages": messages,
    }
    path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    log.info(
        "transcript_saved",
        call_id=str(call_id),
        path=str(path),
        messages=len(messages),
    )
    return path


def build_pipeline_task(config: PipelineConfig, websocket: WebSocket) -> PipelineTask:
    """Assemble the full Pipecat pipeline for one live call."""
    serializer = TwilioFrameSerializer(
        stream_sid=config.twilio_stream_sid,
        call_sid=config.twilio_call_sid,
        account_sid=settings.twilio_account_sid.get_secret_value(),
        auth_token=settings.twilio_auth_token.get_secret_value(),
    )

    # NOTE: VAD analyzer is NOT here — it goes on LLMUserAggregatorParams below
    transport = FastAPIWebsocketTransport(
        websocket=websocket,
        params=FastAPIWebsocketParams(
            audio_in_enabled=True,
            audio_out_enabled=True,
            add_wav_header=False,
            serializer=serializer,
        ),
    )

    stt = build_stt(config)
    llm = build_llm(config)
    tts = build_tts(config)

    transcript_buffer: list[dict[str, Any]] = []
    transcript_capture = TranscriptCapture(transcript_buffer)

    context = LLMContext(
        messages=[
            {"role": "system", "content": config.system_instruction},
            {
                "role": "assistant",
                "content": "Hello! How are you feeling today?",
            },
        ],
    )

    # VAD lives here, per official Pipecat 1.2.1 quickstart
    user_aggregator, assistant_aggregator = LLMContextAggregatorPair(
        context,
        user_params=LLMUserAggregatorParams(vad_analyzer=SileroVADAnalyzer()),
    )

    pipeline = Pipeline([
        transport.input(),
        stt,
        user_aggregator,
        llm,
        tts,
        transcript_capture,
        transport.output(),
        assistant_aggregator,
    ])

    task = PipelineTask(
        pipeline,
        params=PipelineParams(
            audio_in_sample_rate=8000,
            audio_out_sample_rate=8000,
            enable_metrics=True,
            allow_interruptions=True,
        ),
    )

    task.transcript_buffer = transcript_buffer  # type: ignore[attr-defined]

    log.info(
        "pipeline_built",
        call_id=str(config.call_id),
        tier=config.tier,
        voice_id=config.voice_id or settings.cartesia_default_voice_id,
    )

    return task