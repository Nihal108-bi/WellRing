# WellRing — Project Context for Claude

## What is WellRing

WellRing is an AI-powered daily check-in service for elderly seniors living alone or away from family. The product places a warm, personalised phone call to a senior every morning — optionally using a voice clone of their family member — and delivers a concise mood summary and smart alerts to the family via a dashboard.

Target market: Indian families with a senior relative living separately (in another city or abroad).

---

## Repository Structure

```
WellRing/
├── frontend/        ← Next.js 14 app (all UI)
├── backend/         ← FastAPI app (API, AI pipeline, call orchestration)
├── wellring_blueprint.pdf
└── wellring_business_plan.pdf
```

**Critical rule: never cross package managers between workspaces.**
- Run `npm` / `npx` / `node` commands only inside `frontend/`
- Run `pip` / `python` / `uvicorn` / `alembic` commands only inside `backend/`
- Installing a frontend package with pip or a Python package with npm will break the project.

---

## Frontend

**Location:** `frontend/`
**Framework:** Next.js 14 (App Router, TypeScript)
**Styling:** Tailwind CSS 3 with custom config
**UI lib:** shadcn/ui components, lucide-react icons
**Theme:** next-themes (light/dark, class strategy)

### Dev server

```bash
cd frontend
npm run dev       # http://localhost:3000
npm run build     # production build
npx tsc --noEmit  # type-check only
```

### Design system

| Token | Value | Usage |
|---|---|---|
| Primary / brand | `#1a6b55` | Buttons, links, active states, headings |
| Primary dark | `#134d3d` | Hover on primary buttons |
| Primary light | `#e1f5ee` | Tinted backgrounds, icon wells |
| Accent / coral | `#d85a30` | CTA buttons ("Get Started", "Start Trial") |
| Accent hover | `#c24e28` | Hover on coral buttons |
| Dark bg | `#111210` | Page background in dark mode |
| Dark card | `#1c1d1b` | Card background in dark mode |
| Dark surface | `#222321` | Inputs, muted sections in dark mode |
| Muted text | `#888884` | Captions, secondary labels |
| Body text | `#555550` | Paragraphs, descriptions |

**Typography**
- Headings (`h1`–`h4`): **DM Serif Display** — loaded via Google Fonts in `globals.css`, referenced as `var(--font-dm-serif)` or `style={{ fontFamily: "var(--font-dm-serif)" }}`
- Body / UI text: **DM Sans** — loaded via Google Fonts, referenced as `var(--font-dm-sans)`, set as the default `body` font

**Card radius:** `14px` (`rounded-[14px]`)
**Input radius:** `10px` (`rounded-[10px]`)
**Button shape:** pill (`rounded-full`)

**Custom Tailwind animations** (defined in `tailwind.config.ts`):
- `animate-fade-in` — opacity fade, 0.3s
- `animate-slide-up` — slide + fade from below, 0.3s
- `animate-pulse-dot` — pulsing live indicator dot
- `animate-waveform` — audio waveform bars

**Custom CSS utilities** (defined in `globals.css`):
- `.card-base` — standard card shell
- `.card-metric` — metric/stat card
- `.nav-active` — active sidebar nav item (left border + tint)
- `.mood-happy/neutral/low/sad` — mood chip colour variants
- `.alert-high/medium/info` — alert severity left-border styles
- `.waveform-bar` — animated audio bar element
- `.brand-tint` — green tinted background box

### Pages built

| Route | File | Status |
|---|---|---|
| `/` | `src/app/page.tsx` | ✅ Redirects to `/landing` |
| `/landing` | `src/app/landing/page.tsx` | ✅ Nav, Hero, Features, How It Works, Pricing (3 plans), Testimonials, Footer |
| `/onboarding` | `src/app/onboarding/page.tsx` | ✅ 5-step wizard: Senior Info → Choose Plan → Voice Clone* → Video Avatar* → All Set — steps 3/4 conditional on plan |
| `/login` | `src/app/login/page.tsx` | ✅ Sign in / sign up toggle, password visibility, Google SSO placeholder, error state |
| `/dashboard` | `src/app/dashboard/page.tsx` | ✅ Overview: metrics strip, 7-day mood chart, latest call summary, unread alerts, features active |
| `/dashboard/calls` | `src/app/dashboard/calls/page.tsx` | ✅ Filter tabs (All/Voice/Video/Missed), expandable rows with summary, topics, concern warnings, play button |
| `/dashboard/alerts` | `src/app/dashboard/alerts/page.tsx` | ✅ Severity filters (All/High/Medium/Info/Resolved), mark-resolved toggle with undo, empty state |
| `/dashboard/profile` | `src/app/dashboard/profile/page.tsx` | ✅ Senior identity card, personality notes grid, editable family notes, voice/video status, timeline |
| `/dashboard/baseline` | `src/app/dashboard/baseline/page.tsx` | ✅ Today vs baseline dual progress bars per metric, 30-day mood bar chart |
| `/dashboard/settings` | `src/app/dashboard/settings/page.tsx` | ✅ Call schedule (time + day toggles), voice clone management, consent vault, plan & billing |

**Dashboard shell:** `src/app/dashboard/layout.tsx` — shared sidebar with `usePathname` active detection, mobile drawer, topbar. Wraps all `/dashboard/*` routes.

### Pricing plans (frontend data)

| ID | Name | Price | Voice clone | Video avatar |
|---|---|---|---|---|
| `basic` | Basic | ₹599/mo | No | No |
| `family` | Family | ₹1,499/mo | Yes (1 member) | No |
| `family_plus` | Family+ | ₹1,999/mo | Yes | Yes |
| `premium` | Premium | ₹2,999/mo | Yes (multiple) | Yes (daily) |

### Key frontend dependencies

```json
"next": "14.2.35",
"react": "^18",
"next-themes": "^0.4.6",
"lucide-react": "^1.16.0",
"tailwindcss": "^3.4.1",
"class-variance-authority": "^0.7.1",
"tailwind-merge": "^3.6.0",
"shadcn": "^4.7.0"
```

---

## Backend

**Status: Not started.**

**Location:** `backend/` (not yet created)
**Framework:** FastAPI (Python)
**Intended responsibilities:**
- User auth (JWT)
- Senior & family profile management
- Call scheduling and orchestration (integrate with Twilio / telephony)
- Voice clone pipeline (ElevenLabs or similar)
- Video avatar pipeline
- Post-call AI summary and mood analysis (LLM)
- Alert generation and push notifications
- Dashboard data API

### When backend is scaffolded, expected structure

```
backend/
├── main.py            ← FastAPI app entry point
├── requirements.txt   ← Python deps (pip install -r requirements.txt)
├── .env               ← secrets (never commit)
├── routers/           ← API route modules
├── models/            ← SQLAlchemy / Pydantic models
├── services/          ← business logic (calls, AI, alerts)
└── alembic/           ← DB migrations
```

**Dev server (once scaffolded):**
```bash
cd backend
uvicorn main:app --reload   # http://localhost:8000
```

---

## Current status

### Completed (as of 21 May 2025)
- All frontend pages built and TypeScript-verified (zero errors)
- Full dashboard with shared layout (`dashboard/layout.tsx`) and 5 sub-pages: calls, alerts, profile, baseline, settings
- Landing page, onboarding wizard, login/signup page
- Landing page visual enhancement v1: two-column hero with real photo + floating UI cards, live feature card mockups, stats band, glass testimonial cards with real avatars, background blob decorations, Unsplash remote image support in next.config.mjs
- Landing page v2 (22 May 2026): logo upgrade, animated video avatar badge, Savitri floating card, SeniorFaces strip (6 portraits), AI Video Avatar feature card with live mockup, infinite marquee testimonials (2 rows, 12 reviews each), count-up stats, scroll-reveal fade-ups, pricing video avatar sync with 🎥 NEW badge, float animation on hero overlays — split into src/components/landing/ sub-components

### Not started
- Backend (`backend/`) — FastAPI scaffold, database, auth, call orchestration, AI pipeline, real API integration

### Next up
- Scaffold `backend/` with FastAPI, Pydantic models, and a basic auth router
- Wire frontend dashboard to real API endpoints (replace mock data)
- Integrate Twilio for call scheduling
- Integrate ElevenLabs (or equivalent) for voice clone pipeline

---

## Coding conventions

- **No comments** unless the reason is non-obvious — well-named identifiers explain themselves.
- **No extra abstractions** beyond what the task requires — three similar lines beats a premature helper.
- **Dark mode always** — every new component must handle both light and dark mode using the existing CSS variables and Tailwind dark: variants.
- **No inline magic colours** — use the design system tokens listed above.
- **Client components** — mark with `"use client"` only when hooks or browser APIs are needed; prefer server components otherwise.
- **TypeScript strict** — no `any`, no suppressed errors without a documented reason.
- **File size** — keep files under 200 lines where possible; extract sub-components into `src/components/` rather than growing a single file.
- **Reuse over copy-paste** — use existing shared components and the utility classes in `globals.css` (`.card-base`, `.nav-active`, `.mood-*`, `.alert-*`, etc.) before writing new styles inline.

---

## Environment

- Node 18+, npm (frontend)
- Python 3.11+, pip/venv (backend — when created)
- Windows 11 dev machine, PowerShell terminal
- Claude Code CLI used for all AI-assisted development
