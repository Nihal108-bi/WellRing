"""
Senior router — CRUD, schedule management, profile updates.

Every endpoint enforces family-scoping — you can only see your own family's seniors.
"""
from __future__ import annotations

from datetime import datetime
from typing import Any, Literal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Response
from pydantic import BaseModel, Field, field_validator
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import CurrentContext, get_current_context
from app.core.logging import get_logger
from app.db.repositories.seniors import SeniorRepository
from app.db.session import get_db

router = APIRouter(prefix="/seniors", tags=["seniors"])
log = get_logger(__name__)


VALID_DAYS = {"mon", "tue", "wed", "thu", "fri", "sat", "sun"}


class CallSchedule(BaseModel):
    time: str = Field(description="HH:MM 24-hour")
    days: list[Literal["mon", "tue", "wed", "thu", "fri", "sat", "sun"]] = Field(
        min_length=1,
        max_length=7,
    )
    video_day: Literal["mon", "tue", "wed", "thu", "fri", "sat", "sun"] | None = None

    @field_validator("time")
    @classmethod
    def validate_time_format(cls, v: str) -> str:
        """Enforce HH:MM where HH is 00-23 and MM is 00-59."""
        import re
        if not re.match(r"^\d{2}:\d{2}$", v):
            raise ValueError("Time must be in HH:MM format")
        hours, minutes = v.split(":")
        h, m = int(hours), int(minutes)
        if not (0 <= h <= 23):
            raise ValueError(f"Hours must be 0-23, got {h}")
        if not (0 <= m <= 59):
            raise ValueError(f"Minutes must be 0-59, got {m}")
        return v

class SeniorCreate(BaseModel):
    name: str = Field(min_length=1, max_length=128)
    preferred_name: str | None = Field(default=None, max_length=64)
    phone: str = Field(min_length=8, max_length=32)
    locale: str = Field(default="en-IN", pattern=r"^[a-z]{2}-[A-Z]{2}$")
    timezone: str = Field(default="Asia/Kolkata", max_length=64)
    call_schedule: CallSchedule | None = None
    cloned_from_user_id: UUID | None = None
    medications: dict[str, Any] = Field(default_factory=dict)
    doctor_info: dict[str, Any] = Field(default_factory=dict)
    family_notes: str | None = None


class SeniorUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=128)
    preferred_name: str | None = Field(default=None, max_length=64)
    phone: str | None = Field(default=None, min_length=8, max_length=32)
    locale: str | None = Field(default=None, pattern=r"^[a-z]{2}-[A-Z]{2}$")
    timezone: str | None = Field(default=None, max_length=64)
    medications: dict[str, Any] | None = None
    doctor_info: dict[str, Any] | None = None
    family_notes: str | None = None
    profile_summary: str | None = None


class SeniorOut(BaseModel):
    id: UUID
    family_id: UUID
    name: str
    preferred_name: str | None
    phone: str
    locale: str
    timezone: str
    call_schedule: dict[str, Any]
    medications: dict[str, Any]
    doctor_info: dict[str, Any]
    family_notes: str | None
    profile_summary: str | None
    cloned_from_user_id: UUID | None
    is_active: bool
    created_at: datetime


@router.post("", response_model=SeniorOut, status_code=status.HTTP_201_CREATED)
async def create_senior(
    payload: SeniorCreate,
    ctx: CurrentContext = Depends(get_current_context),
    db: AsyncSession = Depends(get_db),
) -> SeniorOut:
    """Create a senior under the current user's family."""
    senior_repo = SeniorRepository(db)

    if payload.cloned_from_user_id is not None:
        from app.db.repositories.users import UserRepository
        user_repo = UserRepository(db)
        clone_user = await user_repo.get_by_id(payload.cloned_from_user_id)
        if clone_user is None or clone_user.family_id != ctx.family.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="cloned_from_user_id must belong to your family",
            )

    senior = await senior_repo.create(
        family_id=ctx.family.id,
        name=payload.name,
        preferred_name=payload.preferred_name,
        phone=payload.phone,
        locale=payload.locale,
        timezone_name=payload.timezone,
        cloned_from_user_id=payload.cloned_from_user_id,
        call_schedule=payload.call_schedule.model_dump() if payload.call_schedule else None,
        medications=payload.medications,
        doctor_info=payload.doctor_info,
    )

    if payload.family_notes:
        await senior_repo.update_profile(senior.id, family_notes=payload.family_notes)

    log.info("senior_created", senior_id=str(senior.id), family_id=str(ctx.family.id))
    return SeniorOut.model_validate(senior, from_attributes=True)


@router.get("", response_model=list[SeniorOut])
async def list_seniors(
    ctx: CurrentContext = Depends(get_current_context),
    db: AsyncSession = Depends(get_db),
) -> list[SeniorOut]:
    """List all active seniors in the current family."""
    senior_repo = SeniorRepository(db)
    seniors = await senior_repo.list_by_family(ctx.family.id)
    return [SeniorOut.model_validate(s, from_attributes=True) for s in seniors]


@router.get("/{senior_id}", response_model=SeniorOut)
async def get_senior(
    senior_id: UUID,
    ctx: CurrentContext = Depends(get_current_context),
    db: AsyncSession = Depends(get_db),
) -> SeniorOut:
    senior_repo = SeniorRepository(db)
    senior = await senior_repo.get_by_id(senior_id)
    if senior is None or senior.family_id != ctx.family.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Senior not found",
        )
    return SeniorOut.model_validate(senior, from_attributes=True)


@router.patch("/{senior_id}", response_model=SeniorOut)
async def update_senior(
    senior_id: UUID,
    payload: SeniorUpdate,
    ctx: CurrentContext = Depends(get_current_context),
    db: AsyncSession = Depends(get_db),
) -> SeniorOut:
    senior_repo = SeniorRepository(db)
    senior = await senior_repo.get_by_id(senior_id)
    if senior is None or senior.family_id != ctx.family.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Senior not found",
        )

    update_fields = payload.model_dump(exclude_unset=True)
    updated = await senior_repo.update_profile(senior_id, **update_fields)
    assert updated is not None
    log.info("senior_updated", senior_id=str(senior_id), fields=list(update_fields))
    return SeniorOut.model_validate(updated, from_attributes=True)


@router.patch("/{senior_id}/schedule", response_model=SeniorOut)
async def update_schedule(
    senior_id: UUID,
    schedule: CallSchedule,
    ctx: CurrentContext = Depends(get_current_context),
    db: AsyncSession = Depends(get_db),
) -> SeniorOut:
    """Update only the call schedule — used by the settings page."""
    senior_repo = SeniorRepository(db)
    senior = await senior_repo.get_by_id(senior_id)
    if senior is None or senior.family_id != ctx.family.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Senior not found",
        )

    updated = await senior_repo.update_schedule(senior_id, schedule.model_dump())
    assert updated is not None
    log.info("schedule_updated", senior_id=str(senior_id), schedule=schedule.model_dump())
    return SeniorOut.model_validate(updated, from_attributes=True)



@router.delete("/{senior_id}", status_code=status.HTTP_204_NO_CONTENT, response_class=Response) # <--- ADD response_class=Response
async def deactivate_senior(
    senior_id: UUID,
    ctx: CurrentContext = Depends(get_current_context),
    db: AsyncSession = Depends(get_db),
):
    senior_repo = SeniorRepository(db)
    senior = await senior_repo.get_by_id(senior_id)
    if senior is None or senior.family_id != ctx.family.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Senior not found",
        )
    await senior_repo.deactivate(senior_id)
    log.info("senior_deactivated", senior_id=str(senior_id))
    
    return Response(status_code=status.HTTP_204_NO_CONTENT) # <--- Explicitly return a blank Response object instead of letting it default