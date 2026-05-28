"""
Application configuration via Pydantic Settings.

Loads from .env file, validates types, fails fast on missing required vars.
Every secret uses SecretStr to prevent accidental logging.
"""
from functools import lru_cache
from typing import Literal

from pydantic import AnyHttpUrl, Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # --- Application ---
    app_env: Literal["development", "staging", "production"] = "development"
    base_url: AnyHttpUrl = Field(default="http://localhost:8000")
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = "INFO"

    # --- Database ---
    database_url: SecretStr

    # --- Redis ---
    redis_url: SecretStr

    # --- Telephony ---
    twilio_account_sid: SecretStr
    twilio_auth_token: SecretStr
    twilio_phone_number: str
    telephony_provider: Literal["twilio", "exotel", "telnyx"] = "twilio" 
    test_target_phone: str = "" 
    
    # --- Auth (Clerk) ---
    clerk_secret_key: SecretStr
    clerk_jwks_url: str

    # --- Telephony ---
    twilio_account_sid: SecretStr
    twilio_auth_token: SecretStr
    twilio_phone_number: str
    telephony_provider: Literal["twilio", "exotel", "telnyx"] = "twilio"

    # --- Exotel (optional until India scale) ---
    exotel_account_sid: SecretStr = SecretStr("")
    exotel_api_key: SecretStr = SecretStr("")
    exotel_api_token: SecretStr = SecretStr("")

    # --- AI Services (filled in during Phase 1) ---
    deepgram_api_key: SecretStr = SecretStr("")
    deepgram_model: str = "nova-3-general"

    groq_api_key: SecretStr = SecretStr("")
    anthropic_api_key: SecretStr = SecretStr("")

    llm_tier1_model: str = "llama-3.3-70b-versatile"
    llm_tier2_model: str = "llama-3.3-70b-versatile"
    llm_tier3_model: str = "claude-sonnet-4-5-20250929"
    llm_post_call_model: str = "claude-haiku-4-5"

    elevenlabs_api_key: SecretStr = SecretStr("")
    cartesia_api_key: SecretStr = SecretStr("")
    cartesia_default_voice_id: str = "156fb8d2-335b-4950-9cb3-a2d33befec77"  
    tts_primary: Literal["elevenlabs", "cartesia"] = "cartesia"

    # --- Observability ---
    sentry_dsn: str = ""

    # --- CORS ---
    cors_origins: list[str] = Field(
        default_factory=lambda: [
            "http://localhost:3000",
            "http://localhost:3001",
        ]
    )

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @property
    def is_development(self) -> bool:
        return self.app_env == "development"

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"


@lru_cache
def get_settings() -> Settings:
    """Cached singleton — Settings() reads .env only once."""
    return Settings()


settings = get_settings()