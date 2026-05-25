"""
Call repository — manages call lifecycle from scheduled → completed.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import desc, select
from sqlalchemy.orm import selectinload

from app.db.models import Call, Senior
from app.db.repositories.base import BaseRepository


class CallRepository(BaseRepository[Call]):
    model = Call

    async def create_scheduled(
        self,
        senior_id: uuid.UUID,
        scheduled_at: datetime,
        channel: str = "voice",
        tier: str = "standard",
    ) -> Call:
        """Create a Call row before Twilio dials. ID is returned for the WS URL."""
        call = Call(
            senior_id=senior_id,
            scheduled_at=scheduled_at,
            channel=channel,
            tier=tier,
            status="scheduled",
        )
        self.db.add(call)
        await self.db.flush()
        await self.db.refresh(call)
        return call

    async def get_with_senior(self, call_id: uuid.UUID) -> Call | None:
        result = await self.db.execute(
            select(Call)
            .where(Call.id == call_id)
            .options(
                selectinload(Call.senior).selectinload(Senior.family),
                selectinload(Call.senior).selectinload(Senior.cloned_from_user),
            )
        )
        return result.scalar_one_or_none()

    async def mark_started(
        self,
        call_id: uuid.UUID,
        twilio_call_sid: str | None = None,
    ) -> Call | None:
        call = await self.get_by_id(call_id)
        if call is None:
            return None
        call.status = "in_progress"
        call.started_at = datetime.now(timezone.utc)
        if twilio_call_sid:
            call.twilio_call_sid = twilio_call_sid
        await self.db.flush()
        return call

    async def mark_ended(
        self,
        call_id: uuid.UUID,
    ) -> Call | None:
        call = await self.get_by_id(call_id)
        if call is None or call.started_at is None:
            return call
        ended_at = datetime.now(timezone.utc)
        call.ended_at = ended_at
        call.duration_seconds = int((ended_at - call.started_at).total_seconds())
        call.status = "completed"
        await self.db.flush()
        return call

    async def mark_failed(
        self,
        call_id: uuid.UUID,
        reason: str,
    ) -> Call | None:
        call = await self.get_by_id(call_id)
        if call is None:
            return None
        call.status = "failed"
        call.failure_reason = reason[:1000]
        call.ended_at = datetime.now(timezone.utc)
        await self.db.flush()
        return call

    async def mark_missed(self, call_id: uuid.UUID) -> Call | None:
        call = await self.get_by_id(call_id)
        if call is None:
            return None
        call.status = "missed"
        call.ended_at = datetime.now(timezone.utc)
        await self.db.flush()
        return call

    async def list_by_senior(
        self,
        senior_id: uuid.UUID,
        limit: int = 50,
        status_filter: str | None = None,
    ) -> list[Call]:
        """Powers the /dashboard/calls page."""
        stmt = (
            select(Call)
            .where(Call.senior_id == senior_id)
            .order_by(desc(Call.scheduled_at))
            .limit(limit)
        )
        if status_filter:
            stmt = stmt.where(Call.status == status_filter)

        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def count_completed(self, senior_id: uuid.UUID) -> int:
        """Used to determine call_index for disclosure scheduling (Phase 2)."""
        from sqlalchemy import func

        result = await self.db.execute(
            select(func.count(Call.id))
            .where(Call.senior_id == senior_id)
            .where(Call.status == "completed")
        )
        return result.scalar_one() or 0

    async def fetch_recent_completed(
        self,
        senior_id: uuid.UUID,
        n: int = 3,
    ) -> list[Call]:
        """Pre-call RAG context — last N completed calls with summaries."""
        result = await self.db.execute(
            select(Call)
            .where(Call.senior_id == senior_id)
            .where(Call.status == "completed")
            .where(Call.summary.is_not(None))
            .order_by(desc(Call.ended_at))
            .limit(n)
        )
        return list(result.scalars().all())

    async def update_post_call(
        self,
        call_id: uuid.UUID,
        summary: dict[str, Any] | None = None,
        sentiment_score: float | None = None,
        risk_score: float | None = None,
        behavioral_deltas: dict[str, Any] | None = None,
        transcript_url: str | None = None,
        recording_url: str | None = None,
    ) -> Call | None:
        """Called by post-call worker — updates everything AI-derived."""
        call = await self.get_by_id(call_id)
        if call is None:
            return None
        if summary is not None:
            call.summary = summary
        if sentiment_score is not None:
            call.sentiment_score = sentiment_score
        if risk_score is not None:
            call.risk_score = risk_score
        if behavioral_deltas is not None:
            call.behavioral_deltas = behavioral_deltas
        if transcript_url is not None:
            call.transcript_url = transcript_url
        if recording_url is not None:
            call.recording_url = recording_url
        await self.db.flush()
        return call