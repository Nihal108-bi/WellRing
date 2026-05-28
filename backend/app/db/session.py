"""
Async database session management.

Uses asyncpg driver for non-blocking Postgres queries.
Session lifecycle is tied to FastAPI request scope via get_db dependency.
"""
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.pool import NullPool   
from app.core.config import settings
from app.core.logging import get_logger

log = get_logger(__name__)


def _create_engine() -> AsyncEngine:
    """Create the async engine with production-tuned pool settings."""
    return create_async_engine(
        settings.database_url.get_secret_value(),
        echo=settings.is_development,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True,
        pool_recycle=3600,
    )


engine: AsyncEngine = _create_engine()

AsyncSessionLocal: async_sessionmaker[AsyncSession] = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency that yields an AsyncSession.

    Usage:
        @router.get("/families/me")
        async def get_family(db: AsyncSession = Depends(get_db)):
            ...
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


@asynccontextmanager
async def get_db_context() -> AsyncGenerator[AsyncSession, None]:
    """
    Context manager for use outside FastAPI requests (e.g. Celery workers).

    Usage:
        async with get_db_context() as db:
            ...
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def close_engine() -> None:
    """Called on app shutdown to release connection pool."""
    await engine.dispose()
    log.info("db_engine_disposed")


@asynccontextmanager
async def get_worker_db_context() -> AsyncGenerator[AsyncSession, None]:
    """
    DB session for Celery workers — creates a fresh engine per call.

    Required because asyncio.run() in each Celery task creates a new event loop,
    but the module-level engine's pool holds connections bound to the first loop.
    NullPool means no pooling — every session opens a fresh connection that
    lives only as long as the task. Adds ~5ms latency but eliminates cross-loop
    failures completely.
    """
    worker_engine = create_async_engine(
        settings.database_url.get_secret_value(),
        echo=False,
        poolclass=NullPool,
    )
    worker_session_factory = async_sessionmaker(
        bind=worker_engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autoflush=False,
    )
    try:
        async with worker_session_factory() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise
    finally:
        await worker_engine.dispose()    