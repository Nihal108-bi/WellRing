"""
FastAPI application entry point.

Lifespan hooks open the DB pool on startup and close it on shutdown.
Sentry is enabled in production. CORS is configured for the Next.js frontend.
"""
from __future__ import annotations

from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration

from app import __version__
from app.api.v1.router import api_router
from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import configure_logging, get_logger
from app.db.session import close_engine

configure_logging()
log = get_logger(__name__)


def _init_sentry() -> None:
    if not settings.sentry_dsn or settings.is_development:
        return
    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        environment=settings.app_env,
        integrations=[
            FastApiIntegration(),
            SqlalchemyIntegration(),
        ],
        traces_sample_rate=0.1,
        profiles_sample_rate=0.1,
    )
    log.info("sentry_initialised", env=settings.app_env)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Startup + shutdown hooks."""
    log.info(
        "app_starting",
        env=settings.app_env,
        version=__version__,
        telephony=settings.telephony_provider,
    )
    _init_sentry()

    yield

    log.info("app_shutting_down")
    await close_engine()


def create_app() -> FastAPI:
    app = FastAPI(
        title="WellRing API",
        version=__version__,
        description="AI daily check-in companion for isolated seniors.",
        docs_url="/docs" if not settings.is_production else None,
        redoc_url="/redoc" if not settings.is_production else None,
        openapi_url="/openapi.json" if not settings.is_production else None,
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
        expose_headers=["X-Request-ID"],
    )

    register_exception_handlers(app)

    app.include_router(api_router)

    @app.get("/", tags=["root"], include_in_schema=False)
    async def root() -> dict[str, str]:
        return {
            "service": "wellring-backend",
            "version": __version__,
            "docs": "/docs",
        }

    return app


app = create_app()