"""
Family router — plan info, family roster, member management.
"""
from __future__ import annotations

from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import CurrentContext, get_current_context
from app.db.repositories.families import FamilyRepository
from app.db.repositories.users import UserRepository
from app.db.session import get_db

router = APIRouter(prefix="/families", tags=["families"])


class FamilyMemberOut(BaseModel):
    id: UUID
    name: str
    email: str
    role: str
    has_voice_clone: bool
    has_avatar_replica: bool


class FamilyDetailOut(BaseModel):
    id: UUID
    plan: str
    plan_status: str
    trial_ends_at: datetime | None
    timezone: str
    created_at: datetime
    members: list[FamilyMemberOut]
    senior_count: int


@router.get("/me", response_model=FamilyDetailOut)
async def get_my_family(
    ctx: CurrentContext = Depends(get_current_context),
    db: AsyncSession = Depends(get_db),
) -> FamilyDetailOut:
    """Returns the full family record with all members and senior count."""
    family_repo = FamilyRepository(db)
    family = await family_repo.get_with_users_and_seniors(ctx.family.id)
    assert family is not None

    members = [
        FamilyMemberOut(
            id=u.id,
            name=u.name,
            email=u.email,
            role=u.role,
            has_voice_clone=u.voice_clone_id is not None,
            has_avatar_replica=u.avatar_replica_id is not None,
        )
        for u in family.users
    ]

    return FamilyDetailOut(
        id=family.id,
        plan=family.plan,
        plan_status=family.plan_status,
        trial_ends_at=family.trial_ends_at,
        timezone=family.timezone,
        created_at=family.created_at,
        members=members,
        senior_count=len(family.seniors),
    )