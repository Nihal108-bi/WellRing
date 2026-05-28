"""
Twilio handler — outbound call orchestration and TwiML generation.

The Twilio REST client is synchronous (no async version exists), so we wrap
all calls in asyncio.to_thread() to avoid blocking the event loop.
"""
from __future__ import annotations

from functools import lru_cache

from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse

from app.core.config import settings
from app.core.logging import get_logger

log = get_logger(__name__)


@lru_cache
def get_twilio_client() -> Client:
    """Singleton Twilio REST client — credentials read once at startup."""
    return Client(
        settings.twilio_account_sid.get_secret_value(),
        settings.twilio_auth_token.get_secret_value(),
    )


def build_test_twiml(message: str = "Hello! This is your WellRing test call. Goodbye.") -> str:
    """
    Build TwiML that just speaks a message and hangs up.
    Used to verify Twilio integration before we wire up the full pipeline.
    """
    response = VoiceResponse()
    response.say(message, voice="Polly.Joanna", language="en-US")
    response.pause(length=1)
    response.hangup()
    return str(response)


def build_stream_twiml(websocket_url: str) -> str:
    """
    Build TwiML that connects the call to our WebSocket for bidirectional audio.

    Used in Batch 1.2+ once the full pipeline is wired. Not used yet in 1.1.
    """
    response = VoiceResponse()
    connect = response.connect()
    connect.stream(url=websocket_url)
    return str(response)

def build_call_twiml(websocket_url: str, greeting: str | None = None) -> str:
    """
    Build TwiML that:
    1. Optionally speaks a greeting first (so caller knows it's connecting)
    2. Then connects the call to our WebSocket for bidirectional audio.

    Args:
        websocket_url: Full wss:// URL where Twilio should stream audio
        greeting: Optional message to play before connecting the stream

    Used in Batch 1.2+ for the actual conversation flow.
    """
    response = VoiceResponse()

    if greeting:
        response.say(greeting, voice="Polly.Joanna", language="en-US")
        response.pause(length=1)

    connect = response.connect()
    connect.stream(url=websocket_url)
    return str(response)