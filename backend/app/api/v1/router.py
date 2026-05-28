"""
API v1 router — mounts all sub-routers under /api/v1.
"""
from fastapi import APIRouter

from app.api.v1 import auth, calls, families, seniors, webhooks 

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router)
api_router.include_router(families.router)
api_router.include_router(seniors.router)
api_router.include_router(calls.router)
api_router.include_router(webhooks.router)


@api_router.get("/health", tags=["health"])
async def health_check() -> dict[str, str]:
    """Liveness probe — used by Railway/AWS healthchecks."""
    return {"status": "ok"}