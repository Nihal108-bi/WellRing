"""
User repository — bridges Clerk JWT claims to our users table.
"""
from __future__ import annotations

import uuid

from sqlalchemy import select

from app.db.models import User
from app.db.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    model = User

    async def create(
        self,
        family_id: uuid.UUID,
        clerk_user_id: str,
        email: str,
        name: str,
        phone: str | None = None,
        role: str = "primary_contact",
    ) -> User:
        user = User(
            family_id=family_id,
            clerk_user_id=clerk_user_id,
            email=email,
            name=name,
            phone=phone,
            role=role,
        )
        self.db.add(user)
        await self.db.flush()
        await self.db.refresh(user)
        return user

    async def get_by_clerk_id(self, clerk_user_id: str) -> User | None:
        """The single most important query in this repo — runs on every auth check."""
        result = await self.db.execute(
            select(User).where(User.clerk_user_id == clerk_user_id)
        )
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> User | None:
        result = await self.db.execute(
            select(User).where(User.email == email.lower())
        )
        return result.scalar_one_or_none()

    async def list_by_family(self, family_id: uuid.UUID) -> list[User]:
        result = await self.db.execute(
            select(User)
            .where(User.family_id == family_id)
            .order_by(User.created_at)
        )
        return list(result.scalars().all())

    async def update_voice_clone(
        self,
        user_id: uuid.UUID,
        voice_clone_id: str,
    ) -> User | None:
        """Set ElevenLabs voice clone ID (used in Phase 2)."""
        user = await self.get_by_id(user_id)
        if user is None:
            return None
        user.voice_clone_id = voice_clone_id
        await self.db.flush()
        return user

    async def update_avatar_replica(
        self,
        user_id: uuid.UUID,
        replica_id: str,
    ) -> User | None:
        """Set Tavus avatar replica ID (used in Phase 3)."""
        user = await self.get_by_id(user_id)
        if user is None:
            return None
        user.avatar_replica_id = replica_id
        await self.db.flush()
        return user