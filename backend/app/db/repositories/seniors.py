"""
Senior repository — the most-used queries in the system.

Powers: profile lookups, schedule queries, morning sweep, RAG context build.
"""
from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.db.models import Family, Senior, User
from app.db.repositories.base import BaseRepository


class SeniorRepository(BaseRepository[Senior]):
    model = Senior

    async def create(
        self,
        family_id: uuid.UUID,
        name: str,
        phone: str,
        locale: str = "en-IN",
        timezone_name: str = "Asia/Kolkata",
        preferred_name: str | None = None,
        cloned_from_user_id: uuid.UUID | None = None,
        call_schedule: dict[str, Any] | None = None,
        medications: dict[str, Any] | None = None,
        doctor_info: dict[str, Any] | None = None,
    ) -> Senior:
        senior = Senior(
            family_id=family_id,
            name=name,
            phone=phone,
            locale=locale,
            timezone=timezone_name,
            preferred_name=preferred_name,
            cloned_from_user_id=cloned_from_user_id,
            call_schedule=call_schedule or {
                "time": "09:00",
                "days": ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
            },
            medications=medications or {},
            doctor_info=doctor_info or {},
        )
        self.db.add(senior)
        await self.db.flush()
        await self.db.refresh(senior)
        return senior

    async def get_with_family(self, senior_id: uuid.UUID) -> Senior | None:
        """Used by every dial task — eager-loads family + cloned-from user."""
        result = await self.db.execute(
            select(Senior)
            .where(Senior.id == senior_id)
            .options(
                selectinload(Senior.family),
                selectinload(Senior.cloned_from_user),
            )
        )
        return result.scalar_one_or_none()

    async def list_by_family(self, family_id: uuid.UUID) -> list[Senior]:
        result = await self.db.execute(
            select(Senior)
            .where(Senior.family_id == family_id)
            .where(Senior.is_active.is_(True))
            .order_by(Senior.created_at)
        )
        return list(result.scalars().all())

    async def fetch_due_for_call(
        self,
        current_time_hhmm: str,
        current_weekday: str,
    ) -> list[Senior]:
        """
        Morning sweep query — runs every 60 seconds.

        Finds active seniors whose schedule says:
        - call_schedule.time == current_time_hhmm  (e.g. "09:00")
        - current_weekday in call_schedule.days     (e.g. "mon")

        Uses JSONB operators which Postgres indexes well.
        """
        result = await self.db.execute(
            select(Senior)
            .where(Senior.is_active.is_(True))
            .where(Senior.call_schedule["time"].astext == current_time_hhmm)
            .where(Senior.call_schedule["days"].contains([current_weekday]))
            .options(selectinload(Senior.family))
        )
        return list(result.scalars().all())

    async def update_schedule(
        self,
        senior_id: uuid.UUID,
        schedule: dict[str, Any],
    ) -> Senior | None:
        senior = await self.get_by_id(senior_id)
        if senior is None:
            return None
        senior.call_schedule = schedule
        await self.db.flush()
        return senior

    async def update_profile(
        self,
        senior_id: uuid.UUID,
        **fields: Any,
    ) -> Senior | None:
        """Generic profile updater — only allow whitelisted fields."""
        allowed = {
            "name",
            "preferred_name",
            "phone",
            "timezone",
            "locale",
            "profile_summary",
            "medications",
            "doctor_info",
            "family_notes",
        }
        senior = await self.get_by_id(senior_id)
        if senior is None:
            return None

        for key, value in fields.items():
            if key in allowed:
                setattr(senior, key, value)

        await self.db.flush()
        return senior

    async def deactivate(self, senior_id: uuid.UUID) -> bool:
        """Soft-delete — keeps history, stops calls."""
        senior = await self.get_by_id(senior_id)
        if senior is None:
            return False
        senior.is_active = False
        await self.db.flush()
        return True

    async def increment_disclosure_counter(
        self,
        senior_id: uuid.UUID,
    ) -> Senior | None:
        """Increments calls_since_disclosure — used by disclosure scheduler (Phase 2)."""
        senior = await self.get_by_id(senior_id)
        if senior is None:
            return None
        state = senior.disclosure_state or {}
        state["calls_since_disclosure"] = state.get("calls_since_disclosure", 0) + 1
        senior.disclosure_state = state
        await self.db.flush()
        return senior

    async def reset_disclosure_counter(
        self,
        senior_id: uuid.UUID,
        disclosed_at: datetime,
    ) -> Senior | None:
        senior = await self.get_by_id(senior_id)
        if senior is None:
            return None
        senior.disclosure_state = {
            "calls_since_disclosure": 0,
            "last_disclosed_at": disclosed_at.isoformat(),
        }
        await self.db.flush()
        return senior