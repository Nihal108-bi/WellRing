"""
Celery application factory.

Defines two priority queues:
- dial_out  → outbound call orchestration (high priority, time-sensitive)
- post_call → post-call summarization + embedding (background, async)

Beat schedule fires morning_sweep every 60 seconds to check for due seniors.
"""
from celery import Celery
from celery.schedules import crontab

from app.core.config import settings

celery_app = Celery(
    "wellring",
    broker=settings.redis_url.get_secret_value(),
    backend=settings.redis_url.get_secret_value(),
    include=[
        "app.workers.tasks",
        "app.workers.post_call",
    ],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=300,
    task_soft_time_limit=270,
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=100,
    task_routes={
        "app.workers.tasks.dial_senior": {"queue": "dial_out"},
        "app.workers.tasks.morning_dial_sweep": {"queue": "dial_out"},
        "app.workers.post_call.run_post_call_pipeline": {"queue": "post_call"},
    },
    task_default_queue="default",
    task_acks_late=True,
    task_reject_on_worker_lost=True,
)

celery_app.conf.beat_schedule = {
    "morning-dial-sweep": {
        "task": "app.workers.tasks.morning_dial_sweep",
        "schedule": crontab(minute="*"),
    },
}