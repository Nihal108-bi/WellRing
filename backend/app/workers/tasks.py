"""
Celery tasks for outbound call orchestration.

morning_dial_sweep — fires every 60s via Beat
  ↓ queries DB for seniors due RIGHT NOW
  ↓ fans out one dial_senior task per match

dial_senior — per-senior dial task
  ↓ creates Call row in DB
  ↓ calls Twilio REST API
  ↓ Twilio dials the senior's phone
  ↓ WebSocket opens → Pipecat pipeline takes over
"""
from __future__ import annotations

import asyncio
from datetime import datetime, timezone
from uuid import UUID

from celery import shared_task
from twilio.rest import Client

from app.core.celery_app import celery_app
from app.core.config import settings
from app.core.logging import configure_logging, get_logger
from app.db.repositories.calls import CallRepository
from app.db.repositories.seniors import SeniorRepository
from app.db.session import get_worker_db_context as get_db_context

configure_logging()
log = get_logger(__name__)

_WEEKDAY_NAMES = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]


@celery_app.task(name="app.workers.tasks.morning_dial_sweep", queue="dial_out")
def morning_dial_sweep() -> dict[str, int]:
    """
    Beat-scheduled task. Runs every 60 seconds.

    Returns {found, queued} counts for observability.
    """
    return asyncio.run(_async_morning_sweep())


async def _async_morning_sweep() -> dict[str, int]:
    now = datetime.now(timezone.utc)
    current_hhmm = now.strftime("%H:%M")
    current_weekday = _WEEKDAY_NAMES[now.weekday()]

    log.info("morning_sweep_started", time=current_hhmm, weekday=current_weekday)

    async with get_db_context() as db:
        senior_repo = SeniorRepository(db)
        due_seniors = await senior_repo.fetch_due_for_call(
            current_time_hhmm=current_hhmm,
            current_weekday=current_weekday,
        )

    if not due_seniors:
        log.info("morning_sweep_no_seniors_due", time=current_hhmm)
        return {"found": 0, "queued": 0}

    queued = 0
    for senior in due_seniors:
        try:
            dial_senior.apply_async(
                args=[str(senior.id)],
                queue="dial_out",
            )
            queued += 1
            log.info(
                "dial_task_queued",
                senior_id=str(senior.id),
                phone=senior.phone,
            )
        except Exception as exc:
            log.exception(
                "dial_task_queue_failed",
                senior_id=str(senior.id),
                error=str(exc),
            )

    log.info(
        "morning_sweep_complete",
        found=len(due_seniors),
        queued=queued,
        time=current_hhmm,
    )
    return {"found": len(due_seniors), "queued": queued}


@celery_app.task(
    name="app.workers.tasks.dial_senior",
    queue="dial_out",
    bind=True,
    max_retries=2,
    default_retry_delay=10,
)
def dial_senior(self, senior_id: str) -> dict[str, str | None]:
    """
    Place an outbound call to one senior.

    Creates a Call row in DB, then calls Twilio REST API.
    On Twilio failure, retries up to 2 times with 10s delay.
    """
    try:
        return asyncio.run(_async_dial_senior(UUID(senior_id)))
    except Exception as exc:
        log.exception("dial_senior_failed", senior_id=senior_id, error=str(exc))
        raise self.retry(exc=exc)


async def _async_dial_senior(senior_id: UUID) -> dict[str, str | None]:
    async with get_db_context() as db:
        senior_repo = SeniorRepository(db)
        call_repo = CallRepository(db)

        senior = await senior_repo.get_with_family(senior_id)
        if senior is None:
            log.warning("dial_senior_not_found", senior_id=str(senior_id))
            return {"call_id": None, "twilio_sid": None, "error": "senior_not_found"}

        if not senior.is_active:
            log.info("dial_senior_inactive_skip", senior_id=str(senior_id))
            return {"call_id": None, "twilio_sid": None, "error": "senior_inactive"}

        call = await call_repo.create_scheduled(
            senior_id=senior.id,
            scheduled_at=datetime.now(timezone.utc),
            channel="voice",
            tier="standard",
        )
        call_id = call.id

    # Build the TwiML URL — this is what Twilio fetches when senior picks up
    # In production this would be your real domain. For dev we use the ngrok URL.
    base_url = str(settings.base_url).rstrip("/")
    twiml_url = f"{base_url}/api/v1/calls/twiml/{call_id}"

    log.info(
        "dial_senior_initiating",
        call_id=str(call_id),
        senior_id=str(senior_id),
        to=senior.phone,
        twiml_url=twiml_url,
    )

    twilio_client = Client(
        settings.twilio_account_sid.get_secret_value(),
        settings.twilio_auth_token.get_secret_value(),
    )

    def _sync_create_call() -> str:
        twilio_call = twilio_client.calls.create(
            to=senior.phone,
            from_=settings.twilio_phone_number,
            url=twiml_url,
            method="GET",
            status_callback=f"{base_url}/api/v1/webhooks/twilio/status",
            status_callback_method="POST",
            status_callback_event=["initiated", "ringing", "answered", "completed"],
        )
        return twilio_call.sid

    try:
        twilio_call_sid = await asyncio.to_thread(_sync_create_call)
    except Exception as exc:
        log.exception("twilio_create_failed", call_id=str(call_id), error=str(exc))
        async with get_db_context() as db:
            call_repo = CallRepository(db)
            await call_repo.mark_failed(call_id, reason=str(exc))
        raise

    async with get_db_context() as db:
        call_repo = CallRepository(db)
        await call_repo.mark_started(call_id, twilio_call_sid=twilio_call_sid)

    log.info(
        "dial_senior_dispatched",
        call_id=str(call_id),
        twilio_sid=twilio_call_sid,
    )

    return {
        "call_id": str(call_id),
        "twilio_sid": twilio_call_sid,
        "error": None,
    }