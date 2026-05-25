"""
Family repository — handles family records and plan state.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.db.models import Family, Senior, User
from app.db.repositories.base import BaseRepository


class FamilyRepository(BaseRepository[Family]):
    model = Family

    async def create_with_trial(
        self,
        timezone_name: str = "Asia/Kolkata",
    ) -> Family:
        """Create a new family in 14-day trial state."""
        trial_ends_at = datetime.now(timezone.utc) + timedelta(days=14)
        family = Family(
            plan="trial_family",
            plan_status="active",
            trial_ends_at=trial_ends_at,
            timezone=timezone_name,
        )
        self.db.add(family)
        await self.db.flush()
        await self.db.refresh(family)
        return family

    async def get_with_users_and_seniors(
        self,
        family_id: uuid.UUID,
    ) -> Family | None:
        """Eager-load users and seniors in one query."""
        result = await self.db.execute(
            select(Family)
            .where(Family.id == family_id)
            .options(
                selectinload(Family.users),
                selectinload(Family.seniors),
            )
        )
        return result.scalar_one_or_none()

    async def update_plan(
        self,
        family_id: uuid.UUID,
        new_plan: str,
        plan_status: str = "active",
    ) -> Family | None:
        family = await self.get_by_id(family_id)
        if family is None:
            return None
        family.plan = new_plan
        family.plan_status = plan_status
        await self.db.flush()
        return family

    async def list_expiring_trials(self, hours_ahead: int = 24) -> list[Family]:
        """Find trials ending in the next N hours — used by trial conversion worker."""
        now = datetime.now(timezone.utc)
        cutoff = now + timedelta(hours=hours_ahead)
        result = await self.db.execute(
            select(Family)
            .where(Family.plan == "trial_family")
            .where(Family.plan_status == "active")
            .where(Family.trial_ends_at <= cutoff)
            .where(Family.trial_ends_at > now)
        )
        return list(result.scalars().all())