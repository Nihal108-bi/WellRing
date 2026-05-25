"""
Shared FastAPI dependencies.

The auth chain:
    1. JWT validates (security.py)
    2. We look up the User by clerk_user_id (this file)
    3. Routes get both User and Family injected
"""
from __future__ import annotations

from dataclasses import dataclass

from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import AuthenticatedUser, get_current_user
from app.db.models import Family, User
from app.db.repositories.families import FamilyRepository
from app.db.repositories.users import UserRepository
from app.db.session import get_db


@dataclass(frozen=True)
class CurrentContext:
    """The authenticated user + their family, both fully loaded.

    Inject this into protected routes:

        @router.get("/something")
        async def handler(ctx: CurrentContext = Depends(get_current_context)):
            ctx.user.family_id  # always safe
    """
    auth: AuthenticatedUser
    user: User
    family: Family


async def get_current_context(
    auth: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CurrentContext:
    """Resolves Clerk identity → our User → their Family."""
    user_repo = UserRepository(db)
    family_repo = FamilyRepository(db)

    user = await user_repo.get_by_clerk_id(auth.clerk_user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found. Complete onboarding first.",
        )

    family = await family_repo.get_by_id(user.family_id)
    if family is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Family record missing for this user.",
        )

    return CurrentContext(auth=auth, user=user, family=family)


def require_active_plan() -> CurrentContext:
    """Placeholder for future tier gating — currently passes through."""
    raise NotImplementedError("Use get_current_context for now")