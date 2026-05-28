"""
Schedule a call 2 minutes from now → walk away → phone rings automatically.

This proves the full autonomous loop: scheduler → DB → Beat → worker → Twilio → phone.
"""
import asyncio
import uuid
from datetime import datetime, timezone, timedelta

from app.core.config import settings
from app.db.session import get_db_context
from app.db.repositories.families import FamilyRepository
from app.db.repositories.users import UserRepository
from app.db.repositories.seniors import SeniorRepository


async def main() -> None:
    target_phone = settings.test_target_phone
    if not target_phone:
        print("❌ TEST_TARGET_PHONE not set in .env")
        return

    fire_at = datetime.now(timezone.utc) + timedelta(minutes=2)
    fire_at = fire_at.replace(second=0, microsecond=0)
    fire_at_hhmm = fire_at.strftime("%H:%M")

    weekday_idx = fire_at.weekday()
    weekday = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"][weekday_idx]

    print(f"📅 Scheduling call to: {target_phone}")
    print(f"   Will fire at:       {fire_at_hhmm} UTC  ({weekday})")
    print(f"   That's in:          ~2 minutes from now\n")

    fake_clerk_id = f"clerk_sched_{uuid.uuid4().hex[:8]}"

    async with get_db_context() as db:
        family_repo = FamilyRepository(db)
        user_repo = UserRepository(db)
        senior_repo = SeniorRepository(db)

        family = await family_repo.create_with_trial()
        user = await user_repo.create(
            family_id=family.id,
            clerk_user_id=fake_clerk_id,
            email="scheduled@wellring.test",
            name="Sched Tester",
        )
        senior = await senior_repo.create(
            family_id=family.id,
            name="Auto-Dial Senior",
            phone=target_phone,
            cloned_from_user_id=user.id,
            call_schedule={
                "time": fire_at_hhmm,
                "days": [weekday],
            },
        )

        print(f"✓ Senior created: {senior.id}")
        print(f"  Family ID:      {family.id}")
        print(f"  Schedule:       {senior.call_schedule}\n")

    print("⏳ Now WAIT — Celery Beat will fire morning_dial_sweep every minute.")
    print(f"   At {fire_at_hhmm} UTC, your phone will ring automatically.\n")
    print("   Watch your terminals:")
    print("   - Beat terminal:   should log 'Sending due task morning_dial_sweep'")
    print("   - Worker terminal: should log 'dial_senior_dispatched'")
    print("   - Uvicorn terminal:should log 'twiml_callback_hit'")
    print("   - Your phone:      should ring 🎉")


if __name__ == "__main__":
    asyncio.run(main())