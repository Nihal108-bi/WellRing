"""
Twilio webhook handlers.

Twilio POSTs to /webhooks/twilio/status when the call's state changes:
    initiated → ringing → answered → completed/failed

We update our Call row to match. This is how missed calls and busy signals
get correctly recorded in our DB.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Form, status
from fastapi.responses import Response

from app.core.logging import get_logger
from app.db.repositories.calls import CallRepository
from app.db.session import AsyncSessionLocal

router = APIRouter(prefix="/webhooks", tags=["webhooks"])
log = get_logger(__name__)


_TWILIO_TO_STATUS = {
    "initiated": "in_progress",
    "ringing": "in_progress",
    "answered": "in_progress",
    "in-progress": "in_progress",
    "completed": "completed",
    "busy": "missed",
    "no-answer": "missed",
    "failed": "failed",
    "canceled": "failed",
}


@router.post("/twilio/status", status_code=status.HTTP_204_NO_CONTENT)
async def twilio_status_callback(
    CallSid: Annotated[str, Form()],
    CallStatus: Annotated[str, Form()],
    CallDuration: Annotated[str | None, Form()] = None,
    ErrorCode: Annotated[str | None, Form()] = None,
    ErrorMessage: Annotated[str | None, Form()] = None,
) -> Response:
    """
    Twilio posts here when call status changes.

    Status flow:  initiated → ringing → answered → completed
    Failed flow:  initiated → busy / no-answer / failed
    """
    mapped_status = _TWILIO_TO_STATUS.get(CallStatus.lower())

    log.info(
        "twilio_status_received",
        twilio_sid=CallSid,
        twilio_status=CallStatus,
        mapped_status=mapped_status,
        duration=CallDuration,
        error_code=ErrorCode,
    )

    if mapped_status is None:
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    async with AsyncSessionLocal() as db:
        call_repo = CallRepository(db)

        from sqlalchemy import select
        from app.db.models import Call

        result = await db.execute(
            select(Call).where(Call.twilio_call_sid == CallSid)
        )
        call = result.scalar_one_or_none()

        if call is None:
            log.warning("twilio_callback_call_not_found", twilio_sid=CallSid)
            return Response(status_code=status.HTTP_204_NO_CONTENT)

        if mapped_status == "completed":
            await call_repo.mark_ended(call.id)
        elif mapped_status == "missed":
            await call_repo.mark_missed(call.id)
        elif mapped_status == "failed":
            reason = ErrorMessage or f"Twilio status: {CallStatus}"
            if ErrorCode:
                reason = f"[{ErrorCode}] {reason}"
            await call_repo.mark_failed(call.id, reason=reason)

        await db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)