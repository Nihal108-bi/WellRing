"""
Auth router — session validation and first-login user creation.

Flow:
    1. User signs up on frontend with Clerk
    2. Clerk redirects to /onboarding with a JWT
    3. Frontend calls POST /auth/session with that JWT
    4. Backend either finds the existing user OR creates a new
       Family + User in trial state
"""
from __future__ import annotations

from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.core.security import AuthenticatedUser, get_current_user
from app.db.repositories.families import FamilyRepository
from app.db.repositories.users import UserRepository
from app.db.session import get_db

router = APIRouter(prefix="/auth", tags=["auth"])
log = get_logger(__name__)


class SessionRequest(BaseModel):
    name: str = Field(min_length=1, max_length=128)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=32)
    timezone: str = Field(default="Asia/Kolkata", max_length=64)


class FamilyOut(BaseModel):
    id: UUID
    plan: str
    plan_status: str
    trial_ends_at: datetime | None
    timezone: str
    created_at: datetime


class UserOut(BaseModel):
    id: UUID
    family_id: UUID
    email: str
    name: str
    phone: str | None
    role: str


class SessionResponse(BaseModel):
    user: UserOut
    family: FamilyOut
    is_new_user: bool


@router.post("/session", response_model=SessionResponse)
async def get_or_create_session(
    payload: SessionRequest,
    auth: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> SessionResponse:
    """
    First-login handshake.

    If the Clerk user already exists in our DB → return their User + Family.
    If not → create a Family in 14-day trial state + a User for them.
    """
    user_repo = UserRepository(db)
    family_repo = FamilyRepository(db)

    existing = await user_repo.get_by_clerk_id(auth.clerk_user_id)
    if existing is not None:
        family = await family_repo.get_by_id(existing.family_id)
        if family is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Orphaned user — family missing",
            )
        log.info("session_resumed", user_id=str(existing.id))
        return SessionResponse(
            user=UserOut.model_validate(existing, from_attributes=True),
            family=FamilyOut.model_validate(family, from_attributes=True),
            is_new_user=False,
        )

    family = await family_repo.create_with_trial(timezone_name=payload.timezone)
    user = await user_repo.create(
        family_id=family.id,
        clerk_user_id=auth.clerk_user_id,
        email=payload.email,
        name=payload.name,
        phone=payload.phone,
        role="primary_contact",
    )

    log.info(
        "session_created",
        user_id=str(user.id),
        family_id=str(family.id),
        plan=family.plan,
    )

    return SessionResponse(
        user=UserOut.model_validate(user, from_attributes=True),
        family=FamilyOut.model_validate(family, from_attributes=True),
        is_new_user=True,
    )


@router.get("/me", response_model=SessionResponse)
async def get_me(
    auth: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> SessionResponse:
    """Return the current user + family — used by frontend on page load."""
    user_repo = UserRepository(db)
    family_repo = FamilyRepository(db)

    user = await user_repo.get_by_clerk_id(auth.clerk_user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    family = await family_repo.get_by_id(user.family_id)
    if family is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Family record missing",
        )

    return SessionResponse(
        user=UserOut.model_validate(user, from_attributes=True),
        family=FamilyOut.model_validate(family, from_attributes=True),
        is_new_user=False,
    )