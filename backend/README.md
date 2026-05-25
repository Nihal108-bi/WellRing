# WellRing Backend

FastAPI backend for the WellRing AI daily check-in companion.

## Setup

### Prerequisites
- Python 3.12+
- uv (`pip install uv`)
- Docker Desktop (for local Postgres + Redis)

### First-time setup

```powershell
# From backend/ folder
cd backend

# Create virtual env + install all deps
uv sync

# Activate it
.venv\Scripts\activate

# Copy env template and fill in values
copy .env.example .env

# Start Postgres + Redis
docker-compose up -d

# Run migrations (coming in Batch 0.3)
alembic upgrade head

# Start the API server
uvicorn app.main:app --reload --port 8000
```

API available at http://localhost:8000
API docs: http://localhost:8000/docs

### Start Celery worker (in a second terminal)

```powershell
celery -A app.core.celery_app worker --loglevel=info -P solo
```

`-P solo` is required on Windows since Celery's prefork pool doesn't work there.

### Start Celery beat (in a third terminal)

```powershell
celery -A app.core.celery_app beat --loglevel=info
```

## Project structure

```
backend/
├── app/
│   ├── main.py              FastAPI app entry
│   ├── core/                Config, logging, security, celery
│   ├── api/v1/              REST + WebSocket routes
│   ├── db/                  SQLAlchemy models + repositories
│   ├── pipeline/            Pipecat live call pipeline
│   ├── telephony/           Twilio / Exotel handlers
│   ├── rag/                 Pre-call context builder
│   ├── safety/              Risk engine, baselines, alerts
│   ├── consent/             Voice/likeness consent vault
│   ├── services/            Summaries, notifications, billing
│   ├── workers/             Celery tasks (dial, post-call)
│   └── voice_clone/         ElevenLabs / Cartesia clients
├── alembic/                 DB migrations
├── tests/                   Test suite
├── pyproject.toml           Dependencies
└── docker-compose.yml       Local Postgres + Redis
```

## Build phases

- ✅ Phase 0 — Foundation
- 🚧 Phase 1 — Basic tier (standard voice call)
- ⏳ Phase 2 — Family tier (voice clone + memory)
- ⏳ Phase 3 — Family+ tier (weekly video)
- ⏳ Phase 4 — Premium tier (daily video + multilingual)