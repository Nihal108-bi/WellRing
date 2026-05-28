"""
LLM factory — Groq Llama-3.3-70B for standard/family tier.

System instruction goes into Settings — survives context summarization.
"""
from __future__ import annotations

from pipecat.services.groq.llm import GroqLLMService

from app.core.config import settings
from app.pipeline.components.config import PipelineConfig


def build_llm(config: PipelineConfig) -> GroqLLMService:
    return GroqLLMService(
        api_key=settings.groq_api_key.get_secret_value(),
        settings=GroqLLMService.Settings(
            model=settings.llm_tier1_model,
            max_completion_tokens=120,
            temperature=0.72,
        ),
    )