"""
Pipeline configuration model.

Built fresh before each call dials, serialized to JSON, stored in Redis
with 10-min TTL so the WebSocket endpoint can load it instantly when
the senior picks up.
"""
from __future__ import annotations

from typing import Literal
from uuid import UUID

from pydantic import BaseModel


class PipelineConfig(BaseModel):
    call_id: UUID
    senior_id: UUID
    tier: Literal["standard", "family", "premium"] = "standard"
    telephony_provider: Literal["twilio", "exotel", "telnyx"] = "twilio"

    # Locale + language routing
    locale: str = "en-IN"
    stt_language: str = "en"

    # Voice clone (None in Phase 1 — used in Phase 2+)
    voice_id: str | None = None
    tts_provider: Literal["elevenlabs", "cartesia"] = "cartesia"

    # Video (Phase 3+)
    tavus_replica_id: str | None = None

    # Twilio identifiers — populated by parse_telephony_websocket at WS open
    twilio_stream_sid: str = ""
    twilio_call_sid: str = ""

    # System prompt — frozen at dial time (Phase 2 adds full RAG)
    system_instruction: str = (
        "You are a warm daily check-in companion calling a senior. "
        "Keep responses to 1-2 sentences. Speak slowly with natural pauses. "
        "Ask open questions about their day, their feelings, and how they're doing. "
        "Listen far more than you talk. Never give medical advice."
    )

    call_index: int = 1
    disclosure_due: bool = False