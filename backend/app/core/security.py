"""
Authentication via Clerk JWT validation.

Clerk issues JWTs on the frontend. Our backend validates them using Clerk's
public JWKS endpoint. The get_current_user dependency injects the validated
user info into route handlers.
"""
from dataclasses import dataclass
from functools import lru_cache
from typing import Any

import httpx
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWKClient

from app.core.config import settings
from app.core.logging import get_logger

log = get_logger(__name__)

security_scheme = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class AuthenticatedUser:
    """Validated user identity extracted from a Clerk JWT."""
    clerk_user_id: str
    email: str | None
    raw_claims: dict[str, Any]


@lru_cache
def _get_jwks_client() -> PyJWKClient:
    """Cached JWKS client — Clerk's public keys rotate rarely."""
    return PyJWKClient(settings.clerk_jwks_url, cache_keys=True)


def _decode_jwt(token: str) -> dict[str, Any]:
    try:
        jwks_client = _get_jwks_client()
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        claims = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            options={"verify_aud": False},
        )
        return claims
    except jwt.ExpiredSignatureError as exc:
        log.warning("jwt_expired", error=str(exc))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
        ) from exc
    except jwt.InvalidTokenError as exc:
        log.warning("jwt_invalid", error=str(exc))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        ) from exc
    except httpx.HTTPError as exc:
        log.error("jwks_fetch_failed", error=str(exc))
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Auth service unavailable",
        ) from exc


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme),
) -> AuthenticatedUser:
    """
    FastAPI dependency for protected routes.

    Usage:
        @router.get("/me")
        async def me(user: AuthenticatedUser = Depends(get_current_user)):
            return {"clerk_id": user.clerk_user_id}
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    claims = _decode_jwt(credentials.credentials)

    clerk_user_id = claims.get("sub")
    if not clerk_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing subject claim",
        )

    email = claims.get("email") or claims.get("primary_email")

    return AuthenticatedUser(
        clerk_user_id=clerk_user_id,
        email=email,
        raw_claims=claims,
    )


async def get_optional_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme),
) -> AuthenticatedUser | None:
    """Same as get_current_user but returns None instead of 401 if no token."""
    if credentials is None:
        return None
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None