"""
Base repository pattern.

Each repository owns one or more tables and exposes typed async methods.
Repositories NEVER commit — that's the session's job (handled by get_db).
"""
from __future__ import annotations

import uuid
from typing import Generic, TypeVar

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import Base

ModelT = TypeVar("ModelT", bound=Base)


class BaseRepository(Generic[ModelT]):
    """Generic base — provides common get-by-id, list, exists helpers."""

    model: type[ModelT]

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_by_id(self, entity_id: uuid.UUID) -> ModelT | None:
        result = await self.db.execute(
            select(self.model).where(self.model.id == entity_id)  # type: ignore[attr-defined]
        )
        return result.scalar_one_or_none()

    async def exists(self, entity_id: uuid.UUID) -> bool:
        result = await self.db.execute(
            select(self.model.id).where(self.model.id == entity_id)  # type: ignore[attr-defined]
        )
        return result.scalar_one_or_none() is not None

    async def delete(self, entity: ModelT) -> None:
        await self.db.delete(entity)
        await self.db.flush()