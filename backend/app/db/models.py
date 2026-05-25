"""
SQLAlchemy ORM models for WellRing.

All tables are defined upfront — phase-gated columns use sensible defaults
so Phase 0/1 code doesn't need to know about Phase 2/3/4 fields.
"""
from __future__ import annotations

import uuid
from datetime import datetime, time
from typing import Any

from pgvector.sqlalchemy import Vector
from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.sql import func


class Base(DeclarativeBase):
    """Base class for all ORM models with shared metadata."""

    type_annotation_map = {
        dict[str, Any]: JSONB,
        list[str]: ARRAY(Text),
    }


class Family(Base):
    """A paying account — one or more users, one or more seniors."""

    __tablename__ = "families"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    plan: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
        default="trial_family",
    )
    plan_status: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
        default="active",
    )
    trial_ends_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    timezone: Mapped[str] = mapped_column(String(64), default="Asia/Kolkata")
    stripe_customer_id: Mapped[str | None] = mapped_column(String(128))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    users: Mapped[list[User]] = relationship(
        back_populates="family",
        cascade="all, delete-orphan",
    )
    seniors: Mapped[list[Senior]] = relationship(
        back_populates="family",
        cascade="all, delete-orphan",
    )


class User(Base):
    """A family member — the paying buyer, NOT the senior."""

    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    family_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("families.id", ondelete="CASCADE"),
        nullable=False,
    )
    clerk_user_id: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(32))
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    role: Mapped[str] = mapped_column(String(32), default="primary_contact")

    # Phase 2+ fields — populated when family records voice/likeness
    voice_clone_id: Mapped[str | None] = mapped_column(String(128))
    avatar_replica_id: Mapped[str | None] = mapped_column(String(128))

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    family: Mapped[Family] = relationship(back_populates="users")
    consent_records: Mapped[list[ConsentRecord]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        Index("ix_users_family_id", "family_id"),
    )


class Senior(Base):
    """The elderly person being called."""

    __tablename__ = "seniors"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    family_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("families.id", ondelete="CASCADE"),
        nullable=False,
    )
    cloned_from_user_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
    )

    name: Mapped[str] = mapped_column(String(128), nullable=False)
    preferred_name: Mapped[str | None] = mapped_column(String(64))
    phone: Mapped[str] = mapped_column(String(32), nullable=False)
    timezone: Mapped[str] = mapped_column(String(64), default="Asia/Kolkata")
    locale: Mapped[str] = mapped_column(String(16), default="en-IN")

    # Call schedule: {"time": "09:00", "days": ["mon","tue",...], "video_day": "sun"}
    call_schedule: Mapped[dict[str, Any]] = mapped_column(
        JSONB,
        default=lambda: {"time": "09:00", "days": ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]},
    )

    # Profile: medications, doctor, notes, preferences
    profile_summary: Mapped[str | None] = mapped_column(Text)
    medications: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict)
    doctor_info: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict)
    family_notes: Mapped[str | None] = mapped_column(Text)

    # Phase 2+ fields
    baseline_metrics: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict)
    alert_thresholds: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict)
    disclosure_state: Mapped[dict[str, Any]] = mapped_column(
        JSONB,
        default=lambda: {"calls_since_disclosure": 0, "last_disclosed_at": None},
    )

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    family: Mapped[Family] = relationship(back_populates="seniors")
    cloned_from_user: Mapped[User | None] = relationship()
    calls: Mapped[list[Call]] = relationship(
        back_populates="senior",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        Index("ix_seniors_family_id", "family_id"),
        Index("ix_seniors_phone", "phone"),
    )


class ConsentRecord(Base):
    """Immutable record of voice/likeness/data consent."""

    __tablename__ = "consent_records"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    senior_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("seniors.id", ondelete="CASCADE"),
    )

    consent_type: Mapped[str] = mapped_column(String(32), nullable=False)
    scope: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict)
    recording_url: Mapped[str | None] = mapped_column(Text)
    verification_phrase: Mapped[str | None] = mapped_column(Text)
    legal_basis: Mapped[str | None] = mapped_column(String(64))

    granted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    user: Mapped[User] = relationship(back_populates="consent_records")

    __table_args__ = (
        Index("ix_consent_user_id", "user_id"),
        Index("ix_consent_senior_id", "senior_id"),
    )


class Call(Base):
    """Every call attempt — completed, missed, or failed."""

    __tablename__ = "calls"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    senior_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("seniors.id", ondelete="CASCADE"),
        nullable=False,
    )

    scheduled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    ended_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    duration_seconds: Mapped[int | None] = mapped_column(Integer)

    channel: Mapped[str] = mapped_column(String(16), default="voice")
    status: Mapped[str] = mapped_column(String(32), default="scheduled")
    tier: Mapped[str] = mapped_column(String(16), default="standard")

    # Provider call identifiers
    twilio_call_sid: Mapped[str | None] = mapped_column(String(64))
    failure_reason: Mapped[str | None] = mapped_column(Text)

    # Phase 2+ fields — populated by post-call worker
    transcript_url: Mapped[str | None] = mapped_column(Text)
    recording_url: Mapped[str | None] = mapped_column(Text)
    summary: Mapped[dict[str, Any] | None] = mapped_column(JSONB)
    sentiment_score: Mapped[float | None] = mapped_column(Float)
    risk_score: Mapped[float | None] = mapped_column(Float)
    behavioral_deltas: Mapped[dict[str, Any] | None] = mapped_column(JSONB)
    disclosure_given: Mapped[bool] = mapped_column(Boolean, default=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    senior: Mapped[Senior] = relationship(back_populates="calls")

    __table_args__ = (
        Index("ix_calls_senior_id", "senior_id"),
        Index("ix_calls_scheduled_at", "scheduled_at"),
        Index("ix_calls_status", "status"),
        Index("ix_calls_twilio_sid", "twilio_call_sid"),
    )


class MemoryChunk(Base):
    """Long-term semantic memory — embedded transcript chunks (Phase 2+)."""

    __tablename__ = "memory_chunks"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    senior_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("seniors.id", ondelete="CASCADE"),
        nullable=False,
    )
    call_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("calls.id", ondelete="CASCADE"),
        nullable=False,
    )
    content: Mapped[str] = mapped_column(Text, nullable=False)
    embedding: Mapped[list[float]] = mapped_column(Vector(3072))
    tags: Mapped[list[str]] = mapped_column(ARRAY(Text), default=list)
    importance_score: Mapped[float] = mapped_column(Float, default=0.5)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    __table_args__ = (
        Index("ix_memory_senior_id", "senior_id"),
        Index("ix_memory_call_id", "call_id"),
    )


class RecurringTopic(Base):
    """Topics mentioned across multiple calls (Phase 2+)."""

    __tablename__ = "recurring_topics"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    senior_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("seniors.id", ondelete="CASCADE"),
        nullable=False,
    )
    topic: Mapped[str] = mapped_column(String(255), nullable=False)
    first_mentioned: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    last_mentioned: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    mention_count: Mapped[int] = mapped_column(Integer, default=1)
    importance_score: Mapped[float] = mapped_column(Float, default=0.5)
    sentiment_trend: Mapped[list[float]] = mapped_column(ARRAY(Float), default=list)

    __table_args__ = (
        UniqueConstraint("senior_id", "topic", name="uq_senior_topic"),
        Index("ix_topics_senior_id", "senior_id"),
    )


class Alert(Base):
    """Risk alerts dispatched to family (Phase 2+)."""

    __tablename__ = "alerts"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    senior_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("seniors.id", ondelete="CASCADE"),
        nullable=False,
    )
    call_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("calls.id", ondelete="SET NULL"),
    )

    severity: Mapped[str] = mapped_column(String(16), nullable=False)
    category: Mapped[str] = mapped_column(String(32), nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    triggered_signals: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict)
    notified_users: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict)

    acknowledged_by: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
    )
    acknowledged_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    __table_args__ = (
        Index("ix_alerts_senior_id", "senior_id"),
        Index("ix_alerts_created_at", "created_at"),
        Index("ix_alerts_severity", "severity"),
    )


class Baseline(Base):
    """Per-senior behavioral baseline (Phase 2+)."""

    __tablename__ = "baselines"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    senior_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("seniors.id", ondelete="CASCADE"),
        nullable=False,
    )

    sample_size: Mapped[int] = mapped_column(Integer, default=0)
    metrics: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    computed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    __table_args__ = (
        Index("ix_baselines_senior_id", "senior_id"),
    )