"""
TTS factory — Cartesia Sonic for standard tier (default voice).
"""
from __future__ import annotations

from pipecat.services.cartesia.tts import CartesiaTTSService

from app.core.config import settings
from app.pipeline.components.config import PipelineConfig


def build_tts(config: PipelineConfig) -> CartesiaTTSService:
    voice = config.voice_id or settings.cartesia_default_voice_id

    return CartesiaTTSService(
        api_key=settings.cartesia_api_key.get_secret_value(),
        settings=CartesiaTTSService.Settings(voice=voice),
        sample_rate=8000,
    )