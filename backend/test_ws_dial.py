"""
Test the WebSocket dial flow.
Creates a real senior in the DB, then triggers a call.
"""
import asyncio
import uuid

from httpx import ASGITransport, AsyncClient

from app.api.deps import get_current_context, CurrentContext
from app.core.security import AuthenticatedUser, get_current_user
from app.db.repositories.families import FamilyRepository
from app.db.repositories.users import UserRepository
from app.db.repositories.seniors import SeniorRepository
from app.db.session import get_db_context
from app.core.config import settings
from app.main import app


FAKE_CLERK_ID = f"clerk_dial_{uuid.uuid4().hex[:8]}"


def _mock_auth() -> AuthenticatedUser:
    return AuthenticatedUser(
        clerk_user_id=FAKE_CLERK_ID,
        email="dial@wellring.test",
        raw_claims={"sub": FAKE_CLERK_ID},
    )


async def cleanup() -> None:
    async with get_db_context() as db:
        user_repo = UserRepository(db)
        family_repo = FamilyRepository(db)
        existing = await user_repo.get_by_clerk_id(FAKE_CLERK_ID)
        if existing is not None:
            family = await family_repo.get_by_id(existing.family_id)
            if family is not None:
                await family_repo.delete(family)


async def main() -> None:
    await cleanup()

    target_phone = settings.test_target_phone
    if not target_phone:
        print("❌ TEST_TARGET_PHONE not set in .env")
        return

    print(f"📞 Will dial: {target_phone}")
    print(f"   IMPORTANT: ngrok must be running and your server")
    print(f"   must be running uvicorn on port 8000\n")

    ngrok_url = input("Paste your ngrok HTTPS URL (e.g. https://abc.ngrok-free.app): ").strip()
    if not ngrok_url.startswith("https://"):
        print("❌ Must be an HTTPS ngrok URL")
        return

    # Override the base URL so TwiML callback points to ngrok
    app.dependency_overrides[get_current_user] = _mock_auth

    async with get_db_context() as db:
        user_repo = UserRepository(db)
        family_repo = FamilyRepository(db)
        senior_repo = SeniorRepository(db)

        family = await family_repo.create_with_trial()
        user = await user_repo.create(
            family_id=family.id,
            clerk_user_id=FAKE_CLERK_ID,
            email="dial@wellring.test",
            name="Dial Tester",
        )
        senior = await senior_repo.create(
            family_id=family.id,
            name="Test Senior",
            phone=target_phone,
            cloned_from_user_id=user.id,
        )
        senior_id = senior.id
        print(f"✓ Test senior created: {senior_id}\n")

    transport = ASGITransport(app=app)
    async with AsyncClient(
        transport=transport,
        base_url=ngrok_url,  # critical — TwiML uses this base
    ) as client:
        r = await client.post(
            "/api/v1/calls/test-dial",
            json={"senior_id": str(senior_id)},
        )
        if r.status_code != 200:
            print(f"❌ Dial failed: {r.status_code}\n{r.text}")
            return

        body = r.json()
        print(f"✅ Call placed!")
        print(f"   Call ID:       {body['call_id']}")
        print(f"   Twilio SID:    {body['twilio_call_sid']}")
        print(f"   Message:       {body['message']}")
        print(f"\nWatch your uvicorn terminal for WebSocket logs.")
        print(f"Your phone should ring in 1-3 seconds.")
        print(f"Pick up, then watch the logs as you speak.")

    app.dependency_overrides.clear()


if __name__ == "__main__":
    asyncio.run(main())