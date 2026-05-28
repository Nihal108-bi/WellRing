"""
STT factory — builds DeepgramSTTService.

Returns interim + final transcripts. Multilingual mode for Hindi/Hinglish.
"""
from __future__ import annotations

from pipecat.services.deepgram.stt import DeepgramSTTService

from app.core.config import settings
from app.pipeline.components.config import PipelineConfig


def build_stt(config: PipelineConfig) -> DeepgramSTTService:
    language = "multi" if config.stt_language == "multi" else "en"

    return DeepgramSTTService(
        api_key=settings.deepgram_api_key.get_secret_value(),
        model=settings.deepgram_model,
        language=language,
    )