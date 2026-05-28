"""
Dial manager — async wrapper around Twilio's synchronous REST client.

Wraps blocking SDK calls with asyncio.to_thread() so they don't freeze
the FastAPI event loop or block other Celery tasks.
"""
from __future__ import annotations

import asyncio
from dataclasses import dataclass

from twilio.base.exceptions import TwilioRestException

from app.core.config import settings
from app.core.logging import get_logger
from app.telephony.twilio_handler import get_twilio_client

log = get_logger(__name__)


@dataclass(frozen=True)
class DialResult:
    success: bool
    call_sid: str | None
    error: str | None


async def place_test_call(to_phone: str, twiml: str) -> DialResult:
    """
    Place a one-shot test call that plays static TwiML then hangs up.

    Args:
        to_phone: E.164 format phone number (e.g. +919876543210)
        twiml: TwiML XML string (built via twilio_handler helpers)

    Returns:
        DialResult with call_sid on success, or error message on failure
    """
    client = get_twilio_client()

    def _sync_create() -> str:
        call = client.calls.create(
            to=to_phone,
            from_=settings.twilio_phone_number,
            twiml=twiml,
        )
        return call.sid

    try:
        call_sid = await asyncio.to_thread(_sync_create)
        log.info(
            "test_call_placed",
            to=to_phone,
            from_=settings.twilio_phone_number,
            call_sid=call_sid,
        )
        return DialResult(success=True, call_sid=call_sid, error=None)

    except TwilioRestException as exc:
        log.error(
            "twilio_error",
            code=exc.code,
            status=exc.status,
            message=exc.msg,
            to=to_phone,
        )
        return DialResult(
            success=False,
            call_sid=None,
            error=f"Twilio error [{exc.code}]: {exc.msg}",
        )

    except Exception as exc:
        log.exception("dial_unexpected_error", error=str(exc))
        return DialResult(
            success=False,
            call_sid=None,
            error=f"Unexpected error: {exc}",
        )