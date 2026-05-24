<p align="center">
  <img src="https://raw.githubusercontent.com/Nihal108-bi/WellRing/main/docs/assets/wellring_logo.png" alt="WellRing Logo" width="120" height="120" style="border-radius: 50%;" />
</p>

<h1 align="center">WellRing</h1>

<p align="center">
  <strong>AI-Powered Daily Check-In Ecosystem for Isolated Seniors</strong><br/>
  <em>Proactive Care · Consented Family Presence · Behavioral Baselines · Timely Alerts</em>
</p>

<p align="center">
  <a href="mailto:nihaljaisawal1@gmail.com">📩 Email</a> • 
  <a href="https://github.com/Nihal108-bi">🖥️ GitHub</a> • 
  <a href="https://www.linkedin.com/in/nihal-jaiswal-908b52257/">💼 LinkedIn</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Pre--Seed%20%7C%20MVP%20Build-blueviolet?style=for-the-badge" alt="Status"/>
  <img src="https://img.shields.io/badge/Market-Elder%20Care%20%2B%20AI-1a6b55?style=for-the-badge" alt="Market"/>
  <img src="https://img.shields.io/badge/Ethics-Echo%20Mode%20%7C%20Full%20Disclosure-d85a30?style=for-the-badge" alt="Ethics"/>
</p>

---

## 📑 Master Table of Contents

- [1. Executive Summary & Vision](#1-executive-summary--vision)
- [Canonical Documents](#canonical-documents)
- [2. The Ethical Foundation: Echo Mode](#2-the-ethical-foundation-echo-mode)
- [3. Product Loop & Value Proposition](#3-product-loop--value-proposition)
- [4. Feature Matrix & Pricing Tiers](#4-feature-matrix--pricing-tiers)
- [5. Advanced Tech Stack Matrix](#5-advanced-tech-stack-matrix)
- [6. Complete System Architecture](#6-complete-system-architecture)
  - [6.1 Frontend Architecture](#61-frontend-architecture)
  - [6.2 Backend Architecture](#62-backend-architecture)
  - [6.3 Full System Connectivity](#63-full-system-connectivity)
  - [6.4 Component Glossary](#64-component-glossary)
  - [6.5 API Contracts](#65-api-contracts)
  - [6.6 Live Call Pipeline](#66-live-call-pipeline-sequence-diagram)
  - [6.7 Post-Call Pipeline](#67-post-call-pipeline-sequence-diagram)
  - [6.8 When Each Function Runs](#68-when-each-function-runs)
  - [6.9 Tech Stack Summary](#69-tech-stack-summary)
- [7. Production Backend Blueprint (v2 Verified)](#7-production-backend-blueprint-v2-verified)
  - [7.1 Core Framework & Runtime Architecture](#71-core-framework--runtime-architecture)
  - [7.2 Audio Pipeline Lifecycle & Verified Frame Flow](#72-audio-pipeline-lifecycle--verified-frame-flow)
  - [7.3 Telephony & Provider Architecture](#73-telephony--provider-architecture)
  - [7.4 Verified Pipeline Code Implementations](#74-verified-pipeline-code-implementations)
- [8. AI Engine & Risk Detection](#8-ai-engine--risk-detection)
  - [8.1 LLM Conversational Engine](#81-llm-conversational-engine)
  - [8.2 Risk Detection & Behavioral Baselines](#82-risk-detection--behavioral-baselines)
- [9. Database Schema & Data Model](#9-database-schema--data-model)
- [10. Installation, Configuration & Setup](#10-installation-configuration--setup)
  - [10.1 Environment & Prerequisites](#101-environment--prerequisites)
  - [10.2 Backend Setup (FastAPI + Workers)](#102-backend-setup-fastapi--workers)
  - [10.3 Frontend Setup (Next.js 14)](#103-frontend-setup-nextjs-14)
  - [10.4 Environment Variables (`.env`)](#104-environment-variables-env)
- [11. API Endpoints & WebSocket Contracts](#11-api-endpoints--websocket-contracts)
  - [11.1 REST API Reference](#111-rest-api-reference)
  - [11.2 WebSocket Connection Paths](#112-websocket-connection-paths)
  - [11.3 JSON Request/Response Bodies](#113-json-requestresponse-bodies)
- [12. Business Thesis & Go-To-Market](#12-business-thesis--go-to-market)
- [13. Compliance, Privacy & Legal](#13-compliance-privacy--legal)
- [14. Founding & Contact](#14-founding--contact)

---

## 1. Executive Summary & Vision

**WellRing** exists because modern elder care is fundamentally reactive. Families discover problems only *after* a fall, a missed medication, a hospital visit, or a long silence. The emotional burden sits with adult children who cannot call every day but desperately want to know their parent is okay. 

WellRing turns that daily anxiety into a calm loop. We call an elderly parent every day, hold a warm contextual conversation using an approved family voice, remember what matters, update the family dashboard, and alert adult children only when something changes.

### The Market Context
We are targeting the highest-willingness-to-pay demographic in global elder care: **Indian families and Non-Resident Indians (NRIs) with isolated elder relatives.** 
- **347 million** seniors projected in India by 2050.
- **35+ million** NRIs globally earning in USD/GBP/AED, suffering from extreme guilt-distance ratios, paying for parents living in INR-cost cities.
- The current stack (panic buttons, sensors, weekly human companions) is reactive, hardware-heavy, and emotionally hollow.

### The Vision
WellRing is not a chatbot. It is a **trusted family-care operating layer**:
1. **Proactive Check-ins:** Scheduled outbound calls over PSTN.
2. **Consented Family Presence:** "Echo Mode"—the AI uses a family member's voice/face with full disclosure and periodic reminders, never deceptive impersonation.
3. **Memory & Baselines:** Tracking behavioral shifts against *their own normal*, not a generic metric.
4. **Actionable Intelligence:** Escalating alerts to families only when needed, avoiding alert fatigue.

---

## Canonical Documents

These documents are the source of truth for the startup, product, business model, and implementation path.

| Document | Purpose |
|---|---|
| [wellring_architecture.md](./wellring_architecture.md) | Complete system architecture. This README now includes its full architecture content in section 6. |
| [wellring_backend_architecture_v2.md](./wellring_backend_architecture_v2.md) | Production backend blueprint with corrected Pipecat, telephony, STT, LLM, TTS, and video implementation notes. |
| [wellring_blueprint.md](./wellring_blueprint.md) | Technical/product blueprint covering Echo Mode, voice/video stack, memory, risk, compliance, cost model, and MVP plan. |
| [wellring_business_plan.md](./wellring_business_plan.md) | Business plan covering problem, market, personas, competition, pricing, GTM, financial projections, risks, and funding. |
| [wellring_architecture.pdf](./wellring_architecture.pdf) | PDF export of the complete architecture. |
| [wellring_backend_architecture_v2.pdf](./wellring_backend_architecture_v2.pdf) | PDF export of the backend blueprint. |
| [wellring_blueprint.pdf](./wellring_blueprint.pdf) | PDF export of the technical blueprint. |
| [wellring_business_plan.pdf](./wellring_business_plan.pdf) | PDF export of the business plan. |

---

## 2. The Ethical Foundation: Echo Mode

We explicitly reject deceptive impersonation. Building a product that tricks a cognitively vulnerable senior into believing they are talking to their real daughter creates catastrophic legal, regulatory, and brand risk. 

**The Echo Mode Protocol:**
- The AI speaks with a cloned family voice but identifies itself as a helper set up by the family member.
- **Periodic Re-disclosure:** Baked into the LLM system prompt. Every ~10th call, the AI explicitly states: *"Just a reminder, this is your daily check-in helper using Sarah's voice—Sarah set this up so I could keep her company on her behalf."*
- **Hard Escape Hatch:** The senior can say "I want to talk to a real person" or "Call my daughter," triggering an immediate live transfer via Twilio.
- **Consent Vault:** Family consent is recorded, scope-limited, revocable, and encrypted at rest.

---

## 3. Product Loop & Value Proposition

| Step | Owner | Output |
|---|---|---|
| **Family Onboarding** | Frontend + API | Family profile, senior identity, consent records, plan, schedule |
| **Pre-Call Context** | Backend RAG layer | Frozen prompt and pipeline config for the call |
| **Outbound Dial** | Celery worker + Twilio/Exotel | Senior receives scheduled phone call |
| **Live Conversation** | Pipecat pipeline | STT -> LLM -> TTS conversational loop (< 350ms round-trip) |
| **Post-Call Processing** | Background worker | Summary, mood, topics, embeddings, risk score, baseline update |
| **Family Update** | Dashboard + Notifications | Summary, trend, alerts, and next actions |

---

## 4. Feature Matrix & Pricing Tiers

WellRing is priced to be an impulse "Netflix-tier" purchase, not a "healthcare-tier" deliberation.

| Feature | Basic Tier (`₹599 / $19`) | Family Tier (`₹1,499 / $39`) | Family+ / Premium (`₹1,999-2,999 / $49-$79`) |
|---|---|---|---|
| **Automated Health Check-ins** | ✅ Daily voice loops | ✅ Daily voice loops | ✅ Daily voice + video loops |
| **Family Dashboard** | ✅ Summaries & alerts | ✅ Summaries, trends, alerts | ✅ Advanced baselines & doctor exports |
| **Voice Cloning** | ❌ Pre-trained AI voice | ✅ 1 Family Member Voice Clone (ElevenLabs PVC) | ✅ Multiple Family Voices |
| **Video Avatar** | ❌ | ❌ Weekly video call | ✅ Real-time lip-synced avatars (Tavus CVI) via WebRTC |
| **Behavioral Baselines** | ❌ Standard risk scoring | ✅ Per-senior z-score baselines | ✅ Advanced cognitive/mood trend analysis |
| **Multilingual Support** | EN-IN / EN-US | ✅ Hinglish / Hindi (Deepgram Multi) | ✅ Regional languages + Priority Support |

---

## 5. Advanced Tech Stack Matrix

<table>
  <thead>
    <tr>
      <th>Layer</th>
      <th>Technology</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Frontend</strong></td>
      <td>
        <img src="https://img.shields.io/badge/Next.js-14-000?logo=nextdotjs" alt="Next.js"/> 
        <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript"/>
        <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss" alt="Tailwind"/>
        <img src="https://img.shields.io/badge/shadcn/ui-✓-000" alt="shadcn"/>
      </td>
      <td>App Router, Server Components, Family Dashboard, Themeing</td>
    </tr>
    <tr>
      <td><strong>Backend API</strong></td>
      <td>
        <img src="https://img.shields.io/badge/FastAPI-0.111+-009688?logo=fastapi" alt="FastAPI"/>
        <img src="https://img.shields.io/badge/Python-3.12-3776AB?logo=python" alt="Python"/>
        <img src="https://img.shields.io/badge/Pydantic-2-9B3AEE?logo=pydantic" alt="Pydantic"/>
        <img src="https://img.shields.io/badge/Uvicorn-✓-499848?logo=uvicorn" alt="Uvicorn"/>
      </td>
      <td>Async REST + WebSocket entry, Pydantic validation, Auth routing</td>
    </tr>
    <tr>
      <td><strong>AI Pipeline</strong></td>
      <td>
        <img src="https://img.shields.io/badge/Pipecat_AI-✓-FF6F00" alt="Pipecat"/> 
        <img src="https://img.shields.io/badge/Groq-Llama_3.3_70B-F55036?logo=groq" alt="Groq"/>
        <img src="https://img.shields.io/badge/Anthropic-Claude_4.5-191919?logo=anthropic" alt="Anthropic"/>
      </td>
      <td>Live conversation orchestration, Sub-350ms turn-around, Context aggregation</td>
    </tr>
    <tr>
      <td><strong>Telephony & STT/TTS</strong></td>
      <td>
        <img src="https://img.shields.io/badge/Twilio-✓-F22F46?logo=twilio" alt="Twilio"/>
        <img src="https://img.shields.io/badge/Exotel-✓-E65325" alt="Exotel"/>
        <img src="https://img.shields.io/badge/Deepgram-Nova--3-13EFED?logo=deepgram" alt="Deepgram"/>
        <img src="https://img.shields.io/badge/ElevenLabs-Turbo_v2.5-000?logo=elevenlabs" alt="ElevenLabs"/>
        <img src="https://img.shields.io/badge/Cartesia-Sonic_3-6366F1" alt="Cartesia"/>
      </td>
      <td>PSTN dialing, Streaming STT, Voice Cloning TTS, Fallback routing</td>
    </tr>
    <tr>
      <td><strong>Data Store</strong></td>
      <td>
        <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql" alt="Postgres"/>
        <img src="https://img.shields.io/badge/pgvector-✗-4169E1" alt="pgvector"/>
        <img src="https://img.shields.io/badge/Redis-7-DC382D?logo=redis" alt="Redis"/>
      </td>
      <td>Relational + Vector (HNSW), Celery queues, Frozen Pipeline configs</td>
    </tr>
    <tr>
      <td><strong>DevOps & Obs</strong></td>
      <td>
        <img src="https://img.shields.io/badge/Docker-✓-2496ED?logo=docker" alt="Docker"/>
        <img src="https://img.shields.io/badge/Sentry-✓-362D59?logo=sentry" alt="Sentry"/>
        <img src="https://img.shields.io/badge/Logfire-✓-000" alt="Logfire"/>
        <img src="https://img.shields.io/badge/PostHog-✓-F9BD2B" alt="PostHog"/>
      </td>
      <td>Containerization, LLM tracing, Error tracking, Product analytics</td>
    </tr>
  </tbody>
</table>

---

## 6. Complete System Architecture

This section is the complete architecture reference from [wellring_architecture.md](./wellring_architecture.md), placed directly inside the README so engineers, collaborators, and investors can understand the product architecture without opening another file. All Mermaid diagrams from the architecture document are preserved here.

> **Document Purpose:** End-to-end architectural reference for WellRing. Three Mermaid diagrams (frontend, backend, full connectivity) plus a glossary explaining every component, every API call, and exactly when each function runs in the pipeline.

---

### 6.1 Frontend Architecture

This diagram shows the complete Next.js 14 frontend — routes, components, state, theme, and the API client layer that talks to the backend.

```mermaid
flowchart TB
    subgraph USER["👤 Family Member (Buyer)"]
        Browser["Browser / Mobile Browser"]
    end

    subgraph NEXTJS["🟦 Next.js 14 App Router (frontend/)"]
        direction TB

        subgraph PUBLIC["Public Routes"]
            Landing["/landing<br/>page.tsx"]
            Login["/login<br/>page.tsx"]
            Onboarding["/onboarding<br/>page.tsx<br/>5-step wizard"]
        end

        subgraph PROTECTED["Protected Routes (under DashboardLayout)"]
            DashLayout["dashboard/layout.tsx<br/>Sidebar + Topbar + Drawer"]
            DashHome["/dashboard<br/>Overview + metrics"]
            DashCalls["/dashboard/calls<br/>Call history + filters"]
            DashAlerts["/dashboard/alerts<br/>Severity inbox"]
            DashProfile["/dashboard/profile<br/>Senior identity"]
            DashBaseline["/dashboard/baseline<br/>30-day trends"]
            DashSettings["/dashboard/settings<br/>Schedule + billing"]
        end

        subgraph LANDING_COMP["Landing Sub-components<br/>(src/components/landing/)"]
            LNav["LandingNav.tsx"]
            LHero["LandingHero.tsx"]
            LFeatures["LandingFeatures.tsx"]
            LPrev["FeatureCardPreviews.tsx"]
            LHow["LandingHowItWorks.tsx"]
            LStats["LandingStatsBand.tsx"]
            LPricing["LandingPricing.tsx"]
            LTest["LandingTestimonials.tsx"]
            LFaces["SeniorFaces.tsx"]
            LFooter["LandingFooter.tsx"]
        end

        subgraph SHARED["Shared UI Layer"]
            ShadCN["shadcn/ui components<br/>Button, Card, Dialog, Tabs"]
            Lucide["lucide-react icons"]
            Themes["next-themes<br/>light/dark toggle"]
            Tokens["Design tokens<br/>Primary #1a6b55<br/>Accent #d85a30<br/>DM Serif + DM Sans"]
        end

        subgraph STATE["Client State"]
            ReactState["React useState/useReducer"]
            ContextAPI["Auth + Theme Context"]
            SWR["SWR / React Query<br/>(planned)"]
        end

        subgraph APIC["API Client Layer<br/>(planned: src/lib/api/)"]
            ApiClient["apiClient.ts<br/>fetch wrapper with JWT"]
            AuthAPI["authApi.ts<br/>login, signup"]
            SeniorAPI["seniorApi.ts<br/>CRUD seniors"]
            CallAPI["callApi.ts<br/>list, get, schedule"]
            AlertAPI["alertApi.ts<br/>list, acknowledge"]
            DashAPI["dashboardApi.ts<br/>aggregated views"]
        end
    end

    subgraph EXTERNAL["External"]
        Backend["🟩 FastAPI Backend<br/>localhost:8000 / api.wellring.com"]
        Clerk["🔐 Clerk Auth<br/>(JWT issuance)"]
    end

    Browser --> Landing
    Browser --> Login
    Landing -->|"Get Started"| Onboarding
    Login -->|"Authenticated"| DashHome
    Onboarding -->|"Complete"| DashHome

    DashLayout --> DashHome
    DashLayout --> DashCalls
    DashLayout --> DashAlerts
    DashLayout --> DashProfile
    DashLayout --> DashBaseline
    DashLayout --> DashSettings

    Landing --> LNav
    Landing --> LHero
    Landing --> LFeatures
    LFeatures --> LPrev
    Landing --> LHow
    Landing --> LStats
    Landing --> LPricing
    Landing --> LTest
    Landing --> LFaces
    Landing --> LFooter

    DashHome --> ShadCN
    DashCalls --> ShadCN
    DashAlerts --> ShadCN
    ShadCN --> Tokens
    ShadCN --> Lucide
    DashLayout --> Themes

    DashHome --> ReactState
    DashCalls --> SWR
    Login --> ContextAPI

    SWR --> ApiClient
    Login --> AuthAPI
    DashProfile --> SeniorAPI
    DashCalls --> CallAPI
    DashAlerts --> AlertAPI
    DashHome --> DashAPI

    ApiClient -->|"Bearer JWT<br/>HTTPS"| Backend
    AuthAPI -->|"JWT validation"| Clerk

    classDef public fill:#e1f5ee,stroke:#1a6b55,color:#134d3d
    classDef protected fill:#fff,stroke:#1a6b55,color:#134d3d
    classDef external fill:#fef3c7,stroke:#d85a30,color:#92400e
    classDef shared fill:#f3f4f6,stroke:#555,color:#222

    class Landing,Login,Onboarding public
    class DashHome,DashCalls,DashAlerts,DashProfile,DashBaseline,DashSettings,DashLayout protected
    class Backend,Clerk external
    class ShadCN,Lucide,Themes,Tokens shared
```

#### Frontend Flow Logic

- **Entry:** User hits `/` → redirects to `/landing` → either signs up (`/onboarding`) or logs in (`/login`).
- **Auth:** Clerk issues JWT on successful auth, stored in HttpOnly cookie. Every subsequent API call attaches it via `apiClient.ts`.
- **Dashboard:** `dashboard/layout.tsx` wraps every `/dashboard/*` route with sidebar + topbar + mobile drawer. `usePathname()` highlights the active nav item.
- **Data fetching:** SWR/React Query hooks call typed functions in `src/lib/api/*.ts` which call the FastAPI backend over HTTPS with the JWT.
- **Theme:** `next-themes` class strategy — every component already supports `dark:` modifier styling.

---

### 6.2 Backend Architecture

This is the complete FastAPI + Celery + Pipecat backend. Five distinct layers: API, services, repositories, workers, and the Pipecat pipeline that runs during live calls.

```mermaid
flowchart TB
    subgraph CLIENT["Inbound Traffic"]
        FE["Frontend<br/>(Next.js)"]
        TwilioWH["Twilio Webhooks<br/>status callbacks"]
        StripeWH["Stripe Webhooks<br/>billing"]
        TwilioWS["Twilio Media<br/>Streams (WebSocket)"]
    end

    subgraph FASTAPI["🟩 FastAPI App (backend/app/)"]
        direction TB

        subgraph MAIN["Entry"]
            App["main.py<br/>FastAPI() + lifespan"]
            Config["core/config.py<br/>Pydantic Settings"]
            Security["core/security.py<br/>JWT decode (Clerk)"]
            Logging["core/logging.py<br/>structlog + Logfire"]
        end

        subgraph ROUTERS["api/v1/ (REST + WebSocket)"]
            RAuth["auth.py<br/>session validation"]
            RFam["families.py<br/>plan management"]
            RSen["seniors.py<br/>CRUD seniors"]
            RCall["calls.py<br/>REST + WS /ws/call/{id}"]
            RAlert["alerts.py<br/>list, ack, resolve"]
            RDash["dashboard.py<br/>aggregated views"]
            RConsent["consent.py<br/>voice/likeness upload"]
            RWeb["webhooks.py<br/>Twilio + Stripe"]
        end

        subgraph SERVICES["services/ (Business Logic)"]
            SvcSummary["summaries.py<br/>Claude Haiku 4.5<br/>structured extraction"]
            SvcNotif["notifications.py<br/>SMS / Email / Push"]
            SvcBilling["billing.py<br/>Stripe integration"]
        end

        subgraph SAFETY["safety/ (Risk Engine)"]
            SafeHard["hard_flags.py<br/>regex pattern matching"]
            SafeBaseline["baseline_engine.py<br/>z-score computation"]
            SafeRisk["risk_engine.py<br/>combined scoring"]
            SafeAlert["alert_router.py<br/>severity → channel"]
        end

        subgraph RAG["rag/ (Pre-Call Context)"]
            RAGEng["engine.py<br/>build_call_context()"]
            RAGPrompt["prompt_builder.py<br/>render_system_prompt()"]
            RAGVec["vector_store.py<br/>pgvector HNSW search"]
            RAGCal["calendar_context.py<br/>anniversaries, appts"]
        end

        subgraph PIPELINE["pipeline/ (Pipecat — live call)"]
            PipeBuild["builder.py<br/>PipelineBuilder.build()"]
            PipeConf["config.py<br/>PipelineConfig"]
            PipeSTT["components/stt.py<br/>DeepgramSTTService"]
            PipeLLM["components/llm.py<br/>Groq / Anthropic"]
            PipeTTS["components/tts.py<br/>ElevenLabs / Cartesia"]
            PipeCtx["components/context.py<br/>LLMContextAggregator"]
        end

        subgraph TELEPHONY["telephony/"]
            TwilioH["twilio_handler.py<br/>TwilioFrameSerializer"]
            ExotelH["exotel_handler.py<br/>ExotelFrameSerializer"]
            DialMgr["dial_manager.py<br/>provider routing"]
        end

        subgraph VIDEO["video/ (Tier 3)"]
            TavusC["tavus_client.py<br/>Replica + Conv API"]
            VideoP["video_pipeline.py<br/>TavusTransport"]
        end

        subgraph VOICE["voice_clone/"]
            ElevenC["elevenlabs_client.py<br/>PVC creation"]
            CartesiaC["cartesia_client.py<br/>Sonic-3 fallback"]
        end

        subgraph CONSENT["consent/"]
            Vault["vault.py<br/>encrypted at rest"]
            Disclosure["disclosure_scheduler.py<br/>every 10th call"]
        end

        subgraph REPOS["db/repositories/ (Data Access)"]
            RepoSen["seniors.py"]
            RepoCall["calls.py"]
            RepoMem["memory.py"]
            RepoAlert["alerts.py"]
            RepoFam["families.py"]
        end

        subgraph DB_LAYER["db/"]
            Session["session.py<br/>asyncpg engine"]
            Models["models.py<br/>SQLAlchemy ORM"]
        end

        subgraph WORKERS["workers/ (Celery)"]
            CelBeat["celery beat<br/>(every 60s)"]
            CelSweep["morning_sweep.py<br/>find due seniors"]
            CelDial["dial_senior task<br/>RAG + Twilio call"]
            CelPost["post_call task<br/>summarise + embed + score"]
            CelAlert["alert_dispatch task"]
        end
    end

    subgraph DATA["💾 Data Layer"]
        PG["PostgreSQL 16<br/>+ pgvector HNSW<br/>(Supabase)"]
        Redis["Redis<br/>Celery queue +<br/>frozen PipelineConfig"]
        S3["S3 / Supabase Storage<br/>transcripts + consent recordings"]
    end

    subgraph EXT["🌐 External AI Services"]
        TwilioAPI["Twilio REST<br/>+ PSTN"]
        DG["Deepgram Nova-3<br/>(STT WebSocket)"]
        GroqAPI["Groq Llama-3.3-70B<br/>(LLM)"]
        AnthAPI["Anthropic Claude<br/>Sonnet 4.5 + Haiku 4.5"]
        EL["ElevenLabs<br/>turbo_v2_5 + PVC"]
        Cart["Cartesia Sonic-3"]
        Tavus["Tavus CVI<br/>(video avatar)"]
        OAI["OpenAI<br/>text-embedding-3-large"]
    end

    FE --> RAuth
    FE --> RFam
    FE --> RSen
    FE --> RCall
    FE --> RAlert
    FE --> RDash
    FE --> RConsent
    TwilioWH --> RWeb
    StripeWH --> RWeb
    TwilioWS --> RCall

    RAuth --> Security
    Security -.->|"validates"| App
    RCall --> PipeBuild
    RConsent --> Vault
    RConsent --> ElevenC
    RConsent --> TavusC

    RSen --> RepoSen
    RCall --> RepoCall
    RAlert --> RepoAlert
    RDash --> RepoCall
    RDash --> RepoAlert
    RFam --> RepoFam

    RepoSen --> Session
    RepoCall --> Session
    RepoMem --> Session
    Session --> Models
    Models --> PG

    CelBeat --> CelSweep
    CelSweep --> RepoSen
    CelSweep -->|"fan out"| CelDial
    CelDial --> RAGEng
    RAGEng --> RAGVec
    RAGEng --> RAGCal
    RAGEng --> RepoSen
    RAGEng --> RepoCall
    RAGEng --> RepoMem
    RAGVec --> PG
    RAGEng --> RAGPrompt
    CelDial --> Redis
    CelDial --> DialMgr
    DialMgr --> TwilioAPI

    RCall --> Redis
    PipeBuild --> PipeConf
    PipeBuild --> TwilioH
    PipeBuild --> ExotelH
    PipeBuild --> PipeSTT
    PipeBuild --> PipeLLM
    PipeBuild --> PipeTTS
    PipeBuild --> PipeCtx
    PipeSTT --> DG
    PipeLLM --> GroqAPI
    PipeLLM --> AnthAPI
    PipeTTS --> EL
    PipeTTS --> Cart

    VideoP --> Tavus
    VideoP --> DG
    VideoP --> AnthAPI
    VideoP --> EL

    RCall -->|"on call end"| CelPost
    CelPost --> SvcSummary
    SvcSummary --> AnthAPI
    CelPost --> RAGVec
    RAGVec --> OAI
    CelPost --> SafeRisk
    SafeRisk --> SafeHard
    SafeRisk --> SafeBaseline
    SafeBaseline --> RepoCall
    CelPost --> SafeAlert
    SafeAlert --> CelAlert
    CelAlert --> SvcNotif
    SvcNotif --> TwilioAPI

    Vault --> S3
    RepoCall -->|"transcripts"| S3
    ElevenC --> EL
    TavusC --> Tavus

    SvcBilling --> StripeWH

    Disclosure --> RAGPrompt

    classDef api fill:#dbeafe,stroke:#1e40af,color:#1e3a8a
    classDef svc fill:#fef3c7,stroke:#d97706,color:#92400e
    classDef worker fill:#fce7f3,stroke:#be185d,color:#9f1239
    classDef data fill:#dcfce7,stroke:#15803d,color:#14532d
    classDef ext fill:#f3e8ff,stroke:#7c3aed,color:#5b21b6
    classDef pipe fill:#fed7aa,stroke:#ea580c,color:#9a3412

    class RAuth,RFam,RSen,RCall,RAlert,RDash,RConsent,RWeb api
    class SvcSummary,SvcNotif,SvcBilling,SafeHard,SafeBaseline,SafeRisk,SafeAlert,RAGEng,RAGPrompt,RAGVec,RAGCal svc
    class CelBeat,CelSweep,CelDial,CelPost,CelAlert worker
    class PG,Redis,S3 data
    class TwilioAPI,DG,GroqAPI,AnthAPI,EL,Cart,Tavus,OAI ext
    class PipeBuild,PipeConf,PipeSTT,PipeLLM,PipeTTS,PipeCtx pipe
```

#### Backend Layer Responsibilities

| Layer | Responsibility | Latency Sensitivity |
|---|---|---|
| **API Routers** | HTTP/WebSocket entry, Pydantic validation, auth | High — must respond < 200ms |
| **Services** | Business logic (summarise, notify, bill) | Low — async background |
| **Safety** | Risk scoring, baseline computation | Low — post-call only |
| **RAG** | Pre-call context assembly | High — < 150ms (parallel reads) |
| **Pipeline** | Live conversation loop (Pipecat) | Critical — < 350ms round-trip |
| **Repositories** | Async DB access (no business logic) | High — must be fast |
| **Workers** | Async tasks (dial, post-call, alerts) | Low — runs in background |

---

### 6.3 Full System Connectivity

This is the complete end-to-end view — how the frontend, backend, databases, and external services all connect. The numbered flows show the four primary scenarios.

```mermaid
flowchart LR
    subgraph FRONTEND["🟦 Frontend (Vercel)"]
        FE_Dash["Family Dashboard<br/>Next.js 14"]
        FE_Onb["Onboarding Wizard"]
    end

    subgraph BACKEND["🟩 Backend (Railway / AWS)"]
        API["FastAPI<br/>REST + WebSocket"]
        Beat["Celery Beat<br/>(60s interval)"]
        WDial["Dial Worker"]
        WPost["Post-Call Worker"]
        Pipe["Pipecat Pipeline<br/>(per active call)"]
    end

    subgraph STORE["💾 Persistence"]
        PG[("PostgreSQL<br/>+ pgvector")]
        RD[("Redis<br/>queue + cache")]
        S3[("S3<br/>transcripts + audio")]
    end

    subgraph TELCO["📞 Telephony"]
        Twilio["Twilio PSTN"]
        Phone["☎️ Senior's Phone"]
    end

    subgraph AISVC["🤖 AI Services"]
        DGS["Deepgram"]
        LLM_S["Groq / Anthropic"]
        TTS_S["ElevenLabs / Cartesia"]
        TavS["Tavus (video)"]
        EMB["OpenAI Embeddings"]
    end

    subgraph NOTIF["📨 Notifications"]
        SMS["SMS via Twilio"]
        Mail["Email via Resend"]
        Push["Push via OneSignal"]
    end

    FE_Onb -->|"1️⃣ Sign up & create senior profile<br/>POST /api/v1/seniors"| API
    FE_Dash -->|"2️⃣ View dashboard / set schedule<br/>GET /api/v1/dashboard<br/>PATCH /api/v1/seniors/{id}/schedule"| API
    API <--> PG

    Beat -->|"3️⃣ Every minute"| WDial
    WDial -->|"Query seniors due now"| PG
    WDial -->|"Build RAG context"| PG
    WDial -->|"Store frozen config"| RD
    WDial -->|"calls.create()"| Twilio
    Twilio -->|"Dials"| Phone
    Twilio -->|"WebSocket /ws/call/{id}<br/>(audio stream)"| API
    API -->|"Load config"| RD
    API --> Pipe
    Pipe <-->|"Stream PCM"| DGS
    Pipe <-->|"Stream tokens"| LLM_S
    Pipe <-->|"Stream audio"| TTS_S
    Pipe -->|"For Tier 3 only"| TavS
    Pipe -->|"audio frames"| Twilio
    Twilio -->|"audio"| Phone

    Pipe -->|"4️⃣ On call end:<br/>queue post_call task"| RD
    WPost -->|"Read transcript"| S3
    WPost -->|"Generate summary (Claude Haiku)"| LLM_S
    WPost -->|"Generate embeddings"| EMB
    WPost -->|"Insert chunks"| PG
    WPost -->|"Risk score + baseline update"| PG
    WPost -->|"If alert > 30"| NOTIF
    NOTIF --> SMS
    NOTIF --> Mail
    NOTIF --> Push
    SMS -->|"Notification to family"| FE_Dash
    Push -->|"Notification to family"| FE_Dash

    FE_Dash -->|"Poll alerts / poll new calls<br/>GET /api/v1/alerts<br/>GET /api/v1/calls"| API

    classDef fe fill:#dbeafe,stroke:#1e40af
    classDef be fill:#dcfce7,stroke:#15803d
    classDef store fill:#fef3c7,stroke:#d97706
    classDef ext fill:#f3e8ff,stroke:#7c3aed
    classDef telco fill:#fee2e2,stroke:#dc2626

    class FE_Dash,FE_Onb fe
    class API,Beat,WDial,WPost,Pipe be
    class PG,RD,S3 store
    class DGS,LLM_S,TTS_S,TavS,EMB,SMS,Mail,Push ext
    class Twilio,Phone telco
```

#### The Four Primary Flows

| # | Flow | Trigger | Path |
|---|---|---|---|
| 1️⃣ | **Onboarding** | User completes wizard | Frontend → POST `/api/v1/seniors` → Postgres |
| 2️⃣ | **Dashboard view** | User opens any `/dashboard/*` page | Frontend → GET `/api/v1/...` → Postgres |
| 3️⃣ | **Outbound call** | Celery Beat (every minute) | Worker → RAG → Redis → Twilio → WebSocket → Pipecat → Senior's phone |
| 4️⃣ | **Post-call processing** | Pipecat fires on call end | Worker → Summary → Embeddings → Risk scoring → Alerts → Notifications |

---

### 6.4 Component Glossary

Use this section as a quick lookup for what each file or service owns. The glossary is grouped by layer first, then by component type, so the compiled PDF/HTML is easier to scan.

#### 4.1 Frontend Components

#### Route Pages

**`frontend/src/app/landing/page.tsx`**

The public marketing page. Server component. Imports every sub-component from `src/components/landing/`. No state. No API calls. Renders once at build time, revalidates on push.

**`frontend/src/app/onboarding/page.tsx`**

5-step wizard. Client component (`"use client"`). Local React state holds wizard step + form data. On final step, calls `POST /api/v1/families` then `POST /api/v1/seniors` then redirects to `/dashboard`.

**`frontend/src/app/dashboard/layout.tsx`**

Shared shell for all dashboard pages. Renders sidebar (with `usePathname()` active detection), topbar, and mobile drawer. Uses Clerk's `<SignedIn>` guard to redirect unauthenticated users to `/login`.

**`frontend/src/app/dashboard/page.tsx`**

Overview page. Fetches `/api/v1/dashboard/overview` on mount. Shows metrics strip, 7-day mood chart, latest call summary, unread alerts. Auto-refreshes every 60 seconds (SWR `refreshInterval: 60000`).

**`frontend/src/app/dashboard/calls/page.tsx`**

Call history. Fetches `/api/v1/calls?limit=50`. Filter tabs (All/Voice/Video/Missed) drive query params. Expandable rows show summary, topics, concern warnings. Play button hits `/api/v1/calls/{id}/audio` returning a signed S3 URL.

**`frontend/src/app/dashboard/alerts/page.tsx`**

Alert inbox. Fetches `/api/v1/alerts?status=unresolved`. Mark-as-resolved button issues `PATCH /api/v1/alerts/{id}` with `{status: "resolved"}` and shows an undo toast for 5 seconds.

**`frontend/src/app/dashboard/baseline/page.tsx`**

Behavioral baseline view. Fetches `/api/v1/seniors/{id}/baseline` returning today's metrics vs baseline mean/std. Renders dual progress bars + 30-day mood bar chart (recharts).

**`frontend/src/app/dashboard/settings/page.tsx`**

Schedule management + consent vault + billing. Time picker + day toggles write to `PATCH /api/v1/seniors/{id}/schedule`. Voice clone re-record button opens a modal that uploads to `POST /api/v1/consent/voice-clone`.

#### API Client

**`src/lib/api/apiClient.ts`** *(to be created)*

Single source of truth for backend calls. Wraps `fetch()`, attaches JWT from Clerk, retries on 401 with token refresh, normalises errors. Every other `*Api.ts` file imports this.

---

#### 4.2 Backend Components

#### App Core

**`backend/app/main.py`**

FastAPI app factory. Mounts all `/v1` routers, configures CORS for the frontend domain, sets up lifespan hooks (open DB pool on startup, close on shutdown). Loads Sentry + Logfire integration.

**`backend/app/core/config.py`**

Pydantic `BaseSettings` class. Reads from `.env`. Every secret is typed as `SecretStr`. Used everywhere via `from app.core.config import settings`.

**`backend/app/core/security.py`**

JWT validation. Uses Clerk's public key to decode tokens. `get_current_user()` is a FastAPI dependency injected into every protected route.

#### API Routers

**`backend/app/api/v1/calls.py`**

Two responsibilities:

- **REST endpoints:** GET `/calls`, GET `/calls/{id}`, POST `/calls/schedule`.
- **WebSocket endpoint:** `/ws/call/{call_id}` - opened by Twilio Media Streams when a senior picks up. Reads frozen `PipelineConfig` from Redis, builds the Pipecat pipeline, runs it until disconnect.

**`backend/app/api/v1/seniors.py`**

CRUD for senior profiles. Schedule updates write to `seniors.call_schedule` JSONB column. Baseline endpoint returns computed metrics from `baselines` table.

**`backend/app/api/v1/webhooks.py`**

Twilio status callbacks (`call.completed`, `call.failed`), Stripe billing events. Verifies signatures before processing.

#### RAG Context

**`backend/app/rag/engine.py`**

`build_call_context(senior_id)` fires 6 async DB reads in parallel via `asyncio.gather()`. Target latency < 150ms total. Returns a frozen `CallContext` dataclass.

**`backend/app/rag/prompt_builder.py`**

`render_system_prompt(context)` translates `CallContext` into a natural-language system prompt. Includes the persona, disclosure rule, recent summaries, top recurring topics, today's context, and behavioral directives.

**`backend/app/rag/vector_store.py`**

pgvector wrapper. `search(senior_id, query, k, threshold)` pre-filters by `senior_id` then runs HNSW cosine search. `batch_insert(senior_id, call_id, chunks)` generates embeddings via OpenAI and bulk-inserts to `memory_chunks`.

#### Live Call Pipeline

**`backend/app/pipeline/builder.py`**

`PipelineBuilder.build(config, websocket)` assembles the Pipecat pipeline:

```
transport.input() -> STT -> user_aggregator -> LLM -> TTS -> transport.output() -> assistant_aggregator
```

Returns a `PipelineTask` ready to run via `PipelineRunner`.

**`backend/app/pipeline/config.py`**

`PipelineConfig` Pydantic model. Frozen at dial time, serialized to JSON, stored in Redis. Contains tier, telephony provider, voice ID, Tavus replica ID, frozen system_instruction string, disclosure state.

#### Safety

**`backend/app/safety/risk_engine.py`**

`compute_risk(senior_id, transcript, summary)` combines hard flags + per-senior z-scores + protective factors into a single 0-100 score.

**`backend/app/safety/baseline_engine.py`**

`update_baseline(senior_id, transcript, summary)` computes today's metrics, updates rolling 7-day window, recomputes 30-day baseline mean/std, writes to `baselines` table.

**`backend/app/safety/alert_router.py`**

`dispatch_alert(senior_id, call_id, risk)` maps severity to channels:

- 31-60: push notification only
- 61-85: push + SMS + email
- 86-100: push + SMS + email + phone call to primary contact

#### Workers

**`backend/app/workers/morning_sweep.py`**

Celery Beat target. Runs every 60 seconds. Queries `seniors` table for rows where `call_schedule.time` matches current minute + day matches current weekday. Fans out one `dial_senior(senior_id, call_id)` task per match.

**`backend/app/workers/tasks.py` - `dial_senior`**

Builds RAG context, renders frozen prompt, stores `PipelineConfig` in Redis with 10-min TTL, calls `twilio_client.calls.create()` with the WebSocket URL as TwiML stream target.

**`backend/app/workers/post_call.py`**

Triggered by the WebSocket endpoint when the call disconnects. Reads transcript from S3, calls Claude Haiku 4.5 for structured summary, chunks transcript and embeds via OpenAI, updates baseline, computes risk, dispatches alerts if warranted.

---

#### 4.3 Data Layer

#### Storage Services

**PostgreSQL 16 + pgvector**

Single database for relational + vector. Tables: `families`, `users`, `seniors`, `consent_records`, `calls`, `memory_chunks`, `recurring_topics`, `alerts`, `baselines`. HNSW index on `memory_chunks.embedding`.

**Redis**

Two roles:

- **Celery queue:** `dial_out` priority lane and `post_call` lane.
- **Frozen call config:** `SETEX call_config:{call_id} 600 {json}` so WebSocket endpoint doesn't hit Postgres during live call.

**S3 / Supabase Storage**

Encrypted at rest. Stores: full transcripts (90-day TTL), consent recordings (active for life of consent), call audio recordings (only if family opted in).

---

### 6.5 API Contracts

| Method | Path | Purpose | Called By |
|---|---|---|---|
| POST | `/api/v1/auth/session` | Validate Clerk JWT, return user record | Login flow |
| POST | `/api/v1/families` | Create family + initial user | Onboarding step 1 |
| GET | `/api/v1/families/me` | Current family + plan | Dashboard layout |
| POST | `/api/v1/seniors` | Create senior profile | Onboarding step 2 |
| GET | `/api/v1/seniors/{id}` | Senior profile + cards | Profile page |
| PATCH | `/api/v1/seniors/{id}` | Update profile fields | Profile editor |
| PATCH | `/api/v1/seniors/{id}/schedule` | Update call schedule | Settings page |
| GET | `/api/v1/seniors/{id}/baseline` | Today vs baseline metrics | Baseline page |
| GET | `/api/v1/calls` | List calls (paginated) | Calls page |
| GET | `/api/v1/calls/{id}` | Single call + transcript URL | Expandable row |
| GET | `/api/v1/calls/{id}/audio` | Signed S3 URL for playback | Play button |
| GET | `/api/v1/alerts` | List alerts (filtered) | Alerts page |
| PATCH | `/api/v1/alerts/{id}` | Mark resolved / acknowledged | Resolve button |
| GET | `/api/v1/dashboard/overview` | Aggregated home view | Dashboard home |
| POST | `/api/v1/consent/voice-clone` | Upload consent recording | Voice clone modal |
| POST | `/api/v1/consent/likeness` | Upload likeness recording | Avatar modal |
| WS | `/ws/call/{call_id}` | Live call audio (Twilio) | Twilio Media Streams |
| POST | `/api/v1/webhooks/twilio/status` | Twilio call status callback | Twilio |
| POST | `/api/v1/webhooks/stripe` | Stripe billing events | Stripe |

---

### 6.6 Live Call Pipeline (Sequence Diagram)

This is exactly what happens during one 5-minute voice call, from the moment Celery Beat fires to the moment the senior hangs up.

```mermaid
sequenceDiagram
    autonumber
    participant Beat as Celery Beat
    participant Worker as Dial Worker
    participant PG as Postgres
    participant RD as Redis
    participant Twilio as Twilio
    participant Phone as Senior Phone
    participant API as FastAPI WS
    participant Pipe as Pipecat
    participant DG as Deepgram
    participant LLM as LLM (Groq/Claude)
    participant TTS as ElevenLabs

    Beat->>Worker: morning_dial_sweep() (every 60s)
    Worker->>PG: SELECT seniors WHERE call_schedule.time = NOW().minute
    PG-->>Worker: [senior_1, senior_2, ...]
    Worker->>Worker: For each senior, queue dial_senior task

    Note over Worker: dial_senior(senior_id, call_id)
    Worker->>PG: build_call_context() - 6 parallel reads
    PG-->>Worker: profile + summaries + memory + baseline + topics
    Worker->>Worker: render_system_prompt(context)
    Worker->>RD: SETEX call_config:{call_id} 600 {json}
    Worker->>Twilio: calls.create(to, TwiML stream URL)
    Twilio-->>Worker: 201 Created (call.sid)

    Twilio->>Phone: dials senior's number
    Phone-->>Twilio: picks up
    Twilio->>API: opens WebSocket /ws/call/{call_id}
    API->>RD: GET call_config:{call_id}
    RD-->>API: PipelineConfig JSON
    API->>Pipe: PipelineBuilder.build(config, ws)
    Pipe->>Pipe: assemble input -> STT -> ctx -> LLM -> TTS -> output -> ctx
    API->>Pipe: PipelineRunner.run(task)

    loop Every conversational turn (~3-5s each)
        Phone->>Twilio: audio frame (mulaw 8kHz)
        Twilio->>Pipe: stream JSON envelope
        Pipe->>DG: PCM frame (WebSocket)
        DG-->>Pipe: TranscriptionFrame (interim + final)
        Pipe->>Pipe: VAD detects turn end (Silero)
        Pipe->>LLM: LLMContext with frozen system + history
        LLM-->>Pipe: streaming tokens
        Pipe->>TTS: sentence boundary, send to ElevenLabs
        TTS-->>Pipe: audio chunks (PCM)
        Pipe->>Twilio: audio frame (mulaw)
        Twilio->>Phone: plays AI response
    end

    Phone->>Twilio: hangs up
    Twilio->>API: WebSocket close
    API->>Pipe: task.cancel()
    API->>RD: queue post_call task
    API->>PG: mark call ended
```

#### Key Latency Budget (per turn)

| Step | Target | Why |
|---|---|---|
| Audio in → STT final | < 100ms | Deepgram streaming |
| STT → LLM first token | < 150ms | Frozen prompt + caching |
| LLM token → TTS first byte | < 75ms | ElevenLabs Flash/Turbo |
| TTS → audio out | < 50ms | Pipecat serializer |
| **Total round-trip** | **< 350ms** | Natural conversation feel |

---

### 6.7 Post-Call Pipeline (Sequence Diagram)

What happens after the senior hangs up — runs entirely async, doesn't affect any user.

```mermaid
sequenceDiagram
    autonumber
    participant API as FastAPI WS
    participant Worker as Post-Call Worker
    participant S3 as S3
    participant PG as Postgres
    participant Haiku as Claude Haiku 4.5
    participant Embed as OpenAI Embeddings
    participant Vec as pgvector
    participant Risk as Risk Engine
    participant Alert as Alert Router
    participant Notif as Notifications

    API->>Worker: queue post_call task (call_id)
    Worker->>S3: download full transcript
    S3-->>Worker: transcript text

    Worker->>Haiku: generate_call_summary(transcript)
    Haiku-->>Worker: {mood, topics, concerns, quotes, ...}
    Worker->>PG: UPDATE calls SET summary, sentiment_score

    Worker->>Worker: chunk_transcript(transcript, 300 tokens)
    loop For each chunk
        Worker->>Embed: embeddings.create(chunk)
        Embed-->>Worker: 3072-dim vector
    end
    Worker->>Vec: batch INSERT memory_chunks
    Vec-->>Worker: ok

    Worker->>PG: update_baseline(senior_id, summary)
    PG-->>Worker: behavioral_deltas (z-scores)

    Worker->>Risk: compute_risk(transcript, summary, baseline)
    Risk-->>Worker: risk_score (0-100)

    alt risk_score > 30
        Worker->>Alert: dispatch_alert(senior_id, risk)
        Alert->>PG: INSERT alerts row
        Alert->>Notif: route by severity
        alt severity = critical
            Notif->>Notif: SMS + Email + Push + Phone
        else severity = high
            Notif->>Notif: SMS + Email + Push
        else severity = medium
            Notif->>Notif: Push only
        end
    end

    Worker->>PG: UPDATE calls SET risk_score, behavioral_deltas
```

---

### 6.8 When Each Function Runs

This is the cheat sheet — what gets called and exactly when.

#### Continuous (always running)
| Component | Runs |
|---|---|
| FastAPI Uvicorn workers | Always — 4-8 processes serving HTTP + WS |
| Celery Beat | Always — fires `morning_dial_sweep` every 60s |
| Celery workers | Always — listen on `dial_out` and `post_call` queues |

#### Triggered by user (frontend → backend)
| Action | What runs |
|---|---|
| User opens dashboard | GET `/api/v1/dashboard/overview` → Postgres → response |
| User updates schedule | PATCH `/api/v1/seniors/{id}/schedule` → Postgres |
| User uploads voice clone | POST `/api/v1/consent/voice-clone` → S3 + ElevenLabs PVC API |
| User resolves alert | PATCH `/api/v1/alerts/{id}` → Postgres |

#### Triggered by clock (Celery Beat)
| Time | What runs |
|---|---|
| Every 60s | `morning_dial_sweep` checks who's due, fans out `dial_senior` tasks |
| For each due senior | `dial_senior` → RAG → Redis → Twilio.calls.create() |

#### Triggered by phone (Twilio → backend)
| Event | What runs |
|---|---|
| Senior picks up | Twilio opens WebSocket → FastAPI builds Pipecat pipeline |
| Per conversation turn | Pipecat: STT → LLM → TTS → audio frame back to Twilio |
| Senior hangs up | WebSocket closes → `post_call` task queued |

#### Triggered by call end (post-call worker)
| Step | What runs |
|---|---|
| 1 | Read transcript from S3 |
| 2 | Claude Haiku 4.5 → structured summary |
| 3 | OpenAI embeddings → pgvector insert |
| 4 | Baseline engine → z-score update |
| 5 | Risk engine → 0-100 score |
| 6 | If score > 30 → alert router → notifications |

---

### 6.9 Tech Stack Summary

| Layer | Tech | Purpose |
|---|---|---|
| Frontend framework | Next.js 14 (App Router) | UI + routing |
| Frontend styling | Tailwind CSS 3 + shadcn/ui | Components + tokens |
| Frontend theme | next-themes | Light/dark mode |
| Backend framework | FastAPI (Python 3.12) | Async REST + WebSocket |
| Database | PostgreSQL 16 + pgvector | Relational + vector |
| Cache / Queue | Redis | Celery + frozen config |
| Object storage | S3 / Supabase Storage | Transcripts + audio |
| Task queue | Celery + Celery Beat | Scheduled + async tasks |
| Auth | Clerk | JWT issuance + frontend SDK |
| Pipeline | Pipecat AI | Live conversation orchestration |
| Telephony | Twilio (MVP) → Exotel (India scale) | PSTN dialing |
| STT | Deepgram Nova-3 | Speech to text |
| LLM (live) | Groq Llama-3.3-70B | Tier 1/2 live conversation |
| LLM (live, premium) | Anthropic Claude Sonnet 4.5 | Tier 3 video calls |
| LLM (post-call) | Anthropic Claude Haiku 4.5 | Summarisation |
| TTS | ElevenLabs Turbo v2.5 + PVC | Voice clone synthesis |
| TTS fallback | Cartesia Sonic-3 | Cost / latency fallback |
| Embeddings | OpenAI text-embedding-3-large | Memory chunks |
| Video | Tavus CVI | Real-time avatar (Tier 3) |
| Notifications | Twilio SMS + Resend + OneSignal | Multi-channel alerts |
| Observability | Sentry + Logfire + PostHog | Errors + LLM traces + analytics |
| Hosting (frontend) | Vercel | Static + edge functions |
| Hosting (backend) | Railway (MVP) → AWS (scale) | Compute + workers |

---

**Document version:** 1.0 · Generated 24 May 2026 · Companion to WellRing Blueprint + Business Plan + Backend Architecture v2

## 7. Production Backend Blueprint (v2 Verified)

*Verified against live Pipecat documentation — May 2026. All deprecated APIs (`LiveOptions`, direct `voice_id=` args, etc.) have been corrected to the current `Settings(...)` pattern.*

### 7.1 Core Framework & Runtime Architecture

**Settings Schema (`app/core/config.py`):**
```python
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import SecretStr, AnyHttpUrl

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_env: str = "development"
    base_url: AnyHttpUrl

    # Database
    database_url: SecretStr           # asyncpg DSN
    redis_url: SecretStr

    # Telephony
    twilio_account_sid: SecretStr
    twilio_auth_token: SecretStr
    twilio_phone_number: str
    telephony_provider: str = "twilio" # "twilio" | "exotel" | "telnyx"

    # Exotel (India production)
    exotel_account_sid: SecretStr = ""
    exotel_api_key: SecretStr = ""
    exotel_api_token: SecretStr = ""

    # STT
    deepgram_api_key: SecretStr
    deepgram_model: str = "nova-3-general"

    # LLM
    groq_api_key: SecretStr
    anthropic_api_key: SecretStr
    llm_tier1_model: str = "llama-3.3-70b-versatile"
    llm_tier2_model: str = "llama-3.3-70b-versatile"
    llm_tier3_model: str = "claude-sonnet-4-5-20250929"
    llm_post_call_model: str = "claude-haiku-4-5"

    # TTS
    elevenlabs_api_key: SecretStr
    cartesia_api_key: SecretStr
    tts_primary: str = "elevenlabs" # "elevenlabs" | "cartesia"

    # Video (Tier 3)
    tavus_api_key: SecretStr

    # Auth
    clerk_secret_key: SecretStr

    # Notifications
    resend_api_key: SecretStr
    onesignal_app_id: str
    onesignal_api_key: SecretStr

settings = Settings()
```

### 7.2 Audio Pipeline Lifecycle & Verified Frame Flow

This is the exact order Pipecat processes frames, verified against pipeline and speech-input docs.

1. **Inbound:** `FastAPIWebsocketTransport.input()` + `TwilioFrameSerializer` deserializes Twilio JSON → `AudioRawFrame` (mulaw → PCM). Auto hang-up requires `call_sid`, `account_sid`, `auth_token` set directly on `TwilioFrameSerializer`.
2. **STT:** `DeepgramSTTService` streams PCM to Nova-3 over persistent WS. Emits `TranscriptionFrame` (interim + final). VAD is no longer passed here.
3. **Context Aggregation (User):** `context_aggregator.user()` collects `TranscriptionFrame` → adds user message to `LLMContext`. Hosts `SileroVADAnalyzer` via `LLMUserAggregatorParams(vad_analyzer=...)`.
4. **LLM:** `GroqLLMService` / `AnthropicLLMService` receives `LLMContext` (with frozen `system_instruction` injected at call-start via Settings). Streams `LLMTextFrame` tokens.
5. **TTS:** `ElevenLabsTTSService` / `CartesiaTTSService` buffers tokens until sentence boundary, sends to TTS WebSocket. Streams `AudioRawFrame` chunks back. Emits `TTSTextFrame` alongside audio.
6. **Outbound:** `FastAPIWebsocketTransport.output()` + `TwilioFrameSerializer` converts PCM → mulaw, wraps in Twilio JSON, pushes over WebSocket.
7. **Context Aggregation (Assistant):** `context_aggregator.assistant()` (MUST be placed after `transport.output()`) collects `TTSTextFrame` → adds assistant message to `LLMContext`.

### 7.3 Telephony & Provider Architecture

**Provider Comparison (Verified):**

| Dimension | Twilio | Telnyx | Exotel | Plivo |
|---|---|---|---|---|
| **Pipecat Serializer** | `TwilioFrameSerializer` | `TelnyxFrameSerializer` | `ExotelFrameSerializer` | `PlivoFrameSerializer` |
| **Call Data Parsing** | `parse_telephony_websocket(ws)` | `parse_telephony_websocket(ws)` | `parse_telephony_websocket(ws)` | `parse_telephony_websocket(ws)` |
| **TRAI DLT Compliance** | Manual | Manual | Native (Voicebot applet) | Manual |

**Recommendation:** MVP → $1M ARR: **Twilio**. India domestic scale (post Series A): **Exotel** (4× cheaper, TRAI DLT handled natively). `TelephonyConfig.provider` field abstracts the switch as a config change.

**Exotel Specifics:** Uses App Bazaar flows instead of TwiML. Setup: `Call Start → [Voicebot applet: wss://your-server.com/ws] → [Hangup applet]`. Exotel auto-embeds `from`, `to`, `stream_id` inside WebSocket messages.

### 7.4 Verified Pipeline Code Implementations

**Pipeline Configuration Model (`app/pipeline/config.py`):**
```python
from pydantic import BaseModel, model_validator
from typing import Literal

class PipelineConfig(BaseModel):
    call_id: str
    senior_id: str
    tier: Literal["standard", "family", "premium"]
    telephony_provider: Literal["twilio", "exotel", "telnyx"] = "twilio"

    # Pre-rendered system prompt (frozen before dial)
    system_instruction: str

    # Voice clone (None for tier=standard)
    voice_id: str | None = None
    tts_provider: Literal["elevenlabs", "cartesia"] = "elevenlabs"

    # Video (Tier 3 only)
    tavus_replica_id: str | None = None

    # Twilio call identifiers (needed for auto hang-up)
    twilio_stream_sid: str = ""
    twilio_call_sid: str = ""

    # Exotel call identifiers
    exotel_stream_id: str = ""
    exotel_call_id: str = ""
    exotel_account_sid: str = ""

    # Language
    locale: str = "en-IN"
    stt_language: str = "en" # "en" | "multi" (Hinglish)
    call_index: int = 1
    disclosure_due: bool = False

    @model_validator(mode="after")
    def replica_required_for_premium(self) -> "PipelineConfig":
        if self.tier == "premium" and not self.tavus_replica_id:
            raise ValueError("tavus_replica_id required for premium tier")
        return self
```

**Modular Pipeline Builder (`app/pipeline/builder.py`):**
```python
import aiohttp
from fastapi import WebSocket

from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.task import PipelineTask, PipelineParams
from pipecat.transports.network.fastapi_websocket import (
    FastAPIWebsocketTransport,
    FastAPIWebsocketParams,
)
from pipecat.serializers.twilio import TwilioFrameSerializer
from pipecat.serializers.exotel import ExotelFrameSerializer
from pipecat.audio.vad.silero import SileroVADAnalyzer
from pipecat.services.deepgram.stt import DeepgramSTTService
from pipecat.services.groq import GroqLLMService
from pipecat.services.anthropic import AnthropicLLMService
from pipecat.services.elevenlabs.tts import ElevenLabsTTSService
from pipecat.services.cartesia.tts import CartesiaTTSService
from pipecat.processors.aggregators.llm_response_universal import (
    LLMContext,
    LLMContextAggregatorPair,
    LLMUserAggregatorParams,
)
from app.core.config import settings
from app.pipeline.config import PipelineConfig

class PipelineBuilder:
    @staticmethod
    async def build(config: PipelineConfig, websocket: WebSocket) -> PipelineTask:
        transport = PipelineBuilder._build_transport(config, websocket)
        stt = PipelineBuilder._build_stt(config)
        llm = PipelineBuilder._build_llm(config)
        tts = PipelineBuilder._build_tts(config)

        context = LLMContext()
        vad = SileroVADAnalyzer()
        user_agg, assistant_agg = LLMContextAggregatorPair(
            context,
            user_params=LLMUserAggregatorParams(vad_analyzer=vad),
        )

        # Correct pipeline order per docs:
        # assistant_agg MUST be placed after transport.output()
        pipeline = Pipeline([
            transport.input(),
            stt,
            user_agg,
            llm,
            tts,
            transport.output(),
            assistant_agg,
        ])

        # audio_in/out sample rate goes on PipelineParams, not transport params
        return PipelineTask(
            pipeline,
            params=PipelineParams(
                audio_in_sample_rate=8000,
                audio_out_sample_rate=8000,
                enable_metrics=True,
            ),
        )

    @staticmethod
    def _build_transport(config: PipelineConfig, websocket: WebSocket):
        match config.telephony_provider:
            case "twilio":
                serializer = TwilioFrameSerializer(
                    stream_sid=config.twilio_stream_sid,
                    call_sid=config.twilio_call_sid,
                    account_sid=settings.twilio_account_sid.get_secret_value(),
                    auth_token=settings.twilio_auth_token.get_secret_value(),
                )
            case "exotel":
                serializer = ExotelFrameSerializer(
                    stream_id=config.exotel_stream_id,
                    call_id=config.exotel_call_id,
                    account_sid=config.exotel_account_sid,
                    api_key=settings.exotel_api_key.get_secret_value(),
                    api_token=settings.exotel_api_token.get_secret_value(),
                )
            case _:
                raise NotImplementedError(f"Provider {config.telephony_provider} not wired")

        return FastAPIWebsocketTransport(
            websocket=websocket,
            params=FastAPIWebsocketParams(
                audio_in_enabled=True,
                audio_out_enabled=True,
                add_wav_header=False,
                serializer=serializer,
            ),
        )

    @staticmethod
    def _build_stt(config: PipelineConfig) -> DeepgramSTTService:
        lang = "multi" if config.stt_language == "multi" else "en"
        return DeepgramSTTService(
            api_key=settings.deepgram_api_key.get_secret_value(),
            settings=DeepgramSTTService.Settings(
                model=settings.deepgram_model,   # default: "nova-3-general"
                language=lang,
                punctuate=True,
                smart_format=True,
                interim_results=True,
                endpointing=300,
                utterance_end_ms=1000,
            ),
        )

    @staticmethod
    def _build_llm(config: PipelineConfig):
        # system_instruction injected here survives context summarization
        match config.tier:
            case "premium":
                return AnthropicLLMService(
                    api_key=settings.anthropic_api_key.get_secret_value(),
                    settings=AnthropicLLMService.Settings(
                        model=settings.llm_tier3_model,
                        system_instruction=config.system_instruction,
                        enable_prompt_caching=True,
                        max_tokens=120,
                    ),
                )
            case _:
                return GroqLLMService(
                    api_key=settings.groq_api_key.get_secret_value(),
                    settings=GroqLLMService.Settings(
                        model=settings.llm_tier2_model if config.tier == "family" else settings.llm_tier1_model,
                        system_instruction=config.system_instruction,
                        max_completion_tokens=120,
                        temperature=0.72,
                    ),
                )

    @staticmethod
    def _build_tts(config: PipelineConfig):
        # Tier 1: no voice clone — use default Cartesia voice
        if config.tier == "standard" or config.voice_id is None:
            return CartesiaTTSService(
                api_key=settings.cartesia_api_key.get_secret_value(),
                settings=CartesiaTTSService.Settings(
                    voice="a0e99841-438c-4a64-b679-ae501e7d6091",  # warm default voice
                    model="sonic-3",
                ),
            )
        # Tiers 2+3: cloned voice
        match config.tts_provider:
            case "elevenlabs":
                return ElevenLabsTTSService(
                    api_key=settings.elevenlabs_api_key.get_secret_value(),
                    settings=ElevenLabsTTSService.Settings(
                        voice=config.voice_id,
                        model="eleven_turbo_v2_5",
                    ),
                )
            case "cartesia":
                return CartesiaTTSService(
                    api_key=settings.cartesia_api_key.get_secret_value(),
                    settings=CartesiaTTSService.Settings(
                        voice=config.voice_id,
                        model="sonic-3",
                    ),
                )
            case _:
                raise NotImplementedError(f"TTS provider {config.tts_provider} not wired")
```

---

## 8. AI Engine & Risk Detection

### 8.1 LLM Conversational Engine

Model selection is tier-aware:
- **Tier 1/2 (Live):** Groq Llama-3.3-70B. Optimized for cost and sub-120ms TTFT.
- **Tier 3 (Live Video):** Anthropic Claude Sonnet 4.5. Superior persona adherence; prompt caching offsets cost.
- **Post-Call:** Claude Haiku 4.5. Cheap, fast, structured extraction.

**System Prompt Architecture (`system_instruction=`):**
The recommended approach is `system_instruction=` in LLM Settings — this survives context summarization and full context replacement. For a product where the senior's disclosure state, persona, and guardrails must never drop out, `system_instruction=` is non-negotiable.

```python
SYSTEM_PROMPT = """
You are {persona_name}, a warm daily check-in companion calling {senior_name}.

# Who you are
You are an AI helper that {family_member_name} set up. {senior_name} knows this.
You speak with {family_member_name}'s voice (cloned with consent) so the call
feels familiar, but you are NOT {family_member_name}. If asked directly
"Are you really my daughter/son?" you say: "No, I'm a helper Sarah set up
to call you every day — but I'm here so we can chat and I can tell her how
you're doing."

# What you DON'T do
- You do not give medical advice. If they describe symptoms, you say
"that sounds like something to mention to Dr. {doctor_name}" and flag it.
- You do not discuss money, legal matters, or anything that would require
the real {family_member_name}'s judgment.
- If they want to talk to {family_member_name} directly, you say
"Let me see if she can pick up" and trigger the live-transfer flow.

# Disclosure rule
Every 10th call, in the first 30 seconds, you remind them:
"Just so you know, this is your daily check-in helper using Sarah's voice."

# About them
{senior_profile}

# Recent context
{last_3_call_summaries}

# Recurring themes they've raised
{long_term_memory_snippets}

# Today's date and any special context
{today_context}
"""
```

### 8.2 Risk Detection & Behavioral Baselines

The moat is not generic sentiment analysis; it is **per-senior anomaly detection**.

**Layer 1: Universal rule-based signals (Hard Flags):**
```python
HARD_FLAGS = {
    "fall_mention": {"weight": 40, "patterns": ["i fell", "i slipped", "couldn't get up"]},
    "chest_pain": {"weight": 50, "patterns": ["chest pain", "chest is tight"]},
    "suicidal_ideation": {"weight": 100, "patterns": [...]},  # immediate escalation
    "medication_skipped": {"weight": 25, "patterns": ["didn't take my", "forgot my pill"]},
    "wandering_disorientation": {"weight": 35, "patterns": ["don't know where", "can't find my way"]},
}
```

**Layer 2: Per-senior anomaly detection (Z-Scores):**
For each senior, after ~30 calls, baselines are computed on:
- Average sentence length, Words per minute, Hesitation rate, Vocabulary diversity, Emotional valence, Topic distribution.

```python
risk_score = (
    sum(hard_flags_triggered_weights)
    + 30 * z_score(mood_today, baseline_mood)
    + 20 * z_score(hesitation_rate_today, baseline_hesitation)
    + 15 * z_score(vocab_diversity_today, baseline_vocab)
    - 10 * mentions_positive_event  # protective factors
)
```

**Alert Routing Matrix:**
| Score | Action |
|---|---|
| 0–30 | Daily summary in dashboard |
| 31–60 | Push notification to family |
| 61–85 | SMS + email to primary family contact |
| 86–100 | Phone call to family + push to secondary contacts |
| **Hard flag: suicidal ideation** | Immediate call to family + locale-appropriate emergency resources |

---

## 9. Database Schema & Data Model

**PostgreSQL 16 + pgvector** is used as the single source of truth for relational + vector data.

```sql
-- Family unit
CREATE TABLE families (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan TEXT NOT NULL,  -- 'basic', 'family', 'premium'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    timezone TEXT NOT NULL
);

-- Family members (the paying users)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES families(id),
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    name TEXT NOT NULL,
    role TEXT,  -- 'primary_contact', 'secondary'
    voice_clone_id TEXT,  -- ElevenLabs voice ID
    avatar_replica_id TEXT,  -- Tavus replica ID
    consent_records JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- The seniors (the people being called)
CREATE TABLE seniors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES families(id),
    name TEXT NOT NULL,
    preferred_name TEXT,
    phone TEXT NOT NULL,
    timezone TEXT NOT NULL,
    locale TEXT,  -- 'en-IN', 'hi-IN', 'en-US'
    call_schedule JSONB,  -- {time: '09:00', days: [...]}
    cloned_from_user_id UUID REFERENCES users(id),
    profile_summary TEXT,
    baseline_metrics JSONB,
    alert_thresholds JSONB,
    medications JSONB,
    doctor_info JSONB,
    disclosure_state JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consent records (immutable legal cover)
CREATE TABLE consent_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    senior_id UUID REFERENCES seniors(id),
    consent_type TEXT,  -- 'voice_clone', 'likeness_clone', 'data_processing'
    scope JSONB,
    recording_url TEXT,
    verification_phrase TEXT,
    granted_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    legal_basis TEXT
);

-- Calls
CREATE TABLE calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    senior_id UUID REFERENCES seniors(id),
    scheduled_at TIMESTAMPTZ NOT NULL,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    duration_seconds INT,
    channel TEXT,  -- 'voice', 'video'
    status TEXT,  -- 'scheduled', 'in_progress', 'completed', 'missed', 'failed'
    transcript_url TEXT,
    recording_url TEXT,
    summary JSONB,
    sentiment_score FLOAT,
    risk_score FLOAT,
    behavioral_deltas JSONB,
    disclosure_given BOOLEAN DEFAULT FALSE
);

-- Long-term semantic memory
CREATE TABLE memory_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    senior_id UUID REFERENCES seniors(id),
    call_id UUID REFERENCES calls(id),
    content TEXT NOT NULL,
    embedding VECTOR(3072),
    tags TEXT[],
    importance_score FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX memory_chunks_embedding_idx ON memory_chunks
USING hnsw (embedding vector_cosine_ops);

-- Behavioral baseline (computed daily)
CREATE TABLE baselines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    senior_id UUID REFERENCES seniors(id),
    computed_at TIMESTAMPTZ DEFAULT NOW(),
    sample_size INT,
    metrics JSONB,
    is_active BOOLEAN DEFAULT TRUE
);
```

---

## 10. Installation, Configuration & Setup

### 10.1 Environment & Prerequisites
- Python 3.12+
- Node.js 18+ & npm
- PostgreSQL 16 (with pgvector extension)
- Redis 7+
- Docker & Docker Compose (optional but recommended)

### 10.2 Backend Setup (FastAPI + Workers)

```bash
# Clone the repository
git clone https://github.com/Nihal108-bi/WellRing.git
cd WellRing/backend

# Create a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Fill in your .env file with API keys (see Section 10.4)

# Run database migrations
alembic upgrade head

# Start the FastAPI server (Development)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Start Celery Worker (in a separate terminal)
celery -A app.core.celery_app worker --loglevel=info -Q dial_out,post_call,alerts

# Start Celery Beat (in a separate terminal)
celery -A app.core.celery_app beat --loglevel=info
```

### 10.3 Frontend Setup (Next.js 14)

```bash
cd ../frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local
# Add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, NEXT_PUBLIC_API_URL, etc.

# Run development server
npm run dev
```
The application will be available at `http://localhost:3000`.

### 10.4 Environment Variables (`.env`)

```env
# App
APP_ENV=development
BASE_URL=http://localhost:8000

# Database
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/wellring
REDIS_URL=redis://localhost:6379/0

# Auth (Clerk)
CLERK_SECRET_KEY=sk_test_...

# Telephony
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890
TELEPHONY_PROVIDER=twilio

# STT
DEEPGRAM_API_KEY=...

# LLM
GROQ_API_KEY=gsk_...
ANTHROPIC_API_KEY=sk-ant-...

# TTS
ELEVENLABS_API_KEY=...
CARTESIA_API_KEY=...

# Video
TAVUS_API_KEY=...
```

---

## 11. API Endpoints & WebSocket Contracts

### 11.1 REST API Reference

| Method | Path | Purpose | Called By |
|---|---|---|---|
| `POST` | `/api/v1/auth/session` | Validate Clerk JWT, return user record | Login flow |
| `POST` | `/api/v1/families` | Create family + initial user | Onboarding step 1 |
| `GET` | `/api/v1/families/me` | Current family + plan | Dashboard layout |
| `POST` | `/api/v1/seniors` | Create senior profile | Onboarding step 2 |
| `GET` | `/api/v1/seniors/{id}` | Senior profile + cards | Profile page |
| `PATCH` | `/api/v1/seniors/{id}/schedule` | Update call schedule | Settings page |
| `GET` | `/api/v1/calls` | List calls (paginated) | Calls page |
| `GET` | `/api/v1/calls/{id}/audio` | Signed S3 URL for playback | Play button |
| `GET` | `/api/v1/alerts` | List alerts (filtered) | Alerts page |
| `PATCH`| `/api/v1/alerts/{id}` | Mark resolved / acknowledged | Resolve button |
| `POST` | `/api/v1/consent/voice-clone`| Upload consent recording | Voice clone modal |

### 11.2 WebSocket Connection Paths

**`WS /ws/call/{call_id}`**
Opened by Twilio/Exotel Media Streams when a senior picks up. Reads frozen `PipelineConfig` from Redis, builds the Pipecat pipeline, runs it until disconnect.

### 11.3 JSON Request/Response Bodies

**POST /api/v1/seniors**
```json
// Request
{
  "name": "Kamala Sharma",
  "preferred_name": "Mom",
  "phone": "+919876543210",
  "timezone": "Asia/Kolkata",
  "locale": "hi-IN",
  "call_schedule": {
    "time": "09:00",
    "days": ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
  },
  "cloned_from_user_id": "usr_2xY9z..."
}

// Response (201 Created)
{
  "id": "sen_1aB2cD...",
  "family_id": "fam_9z8y...",
  "name": "Kamala Sharma",
  "status": "active",
  "created_at": "2026-05-24T09:00:00Z"
}
```

**GET /api/v1/dashboard/overview**
```json
// Response (200 OK)
{
  "family_id": "fam_9z8y...",
  "seniors": [
    {
      "id": "sen_1aB2cD...",
      "preferred_name": "Mom",
      "latest_call_summary": {
        "one_line_summary": "Sounded cheerful, discussed gardening and upcoming doctor appointment.",
        "mood": "happy",
        "risk_score": 12
      },
      "unread_alerts_count": 0
    }
  ]
}
```

**PATCH /api/v1/alerts/{id}**
```json
// Request
{
  "status": "resolved",
  "acknowledged_by": "usr_2xY9z..."
}

// Response (200 OK)
{
  "id": "alr_4kL5mN...",
  "senior_id": "sen_1aB2cD...",
  "severity": "high",
  "status": "resolved",
  "acknowledged_at": "2026-05-24T10:15:00Z"
}
```

---

## 12. Business Thesis & Go-To-Market

**The Buyer:** "Anxious Anita" (38-52) or "Diaspora Dev" (30-48). They pay for *one less daily worry*, not AI minutes.
**The Wedge:** India + NRI families. NRI buyers earn in USD/GBP, parents live in INR-cost cities. Highest gross margin customer globally.
**GTM Strategy:**
1. **Months 1-4 (Concierge MVP):** 5-15 hand-selected families. Founder on every WhatsApp group.
2. **Months 4-12 (Storytelling Growth):** Product Hunt, TikTok ("AI calls my grandma"), Reddit r/AgingParents. Target 500 families.
3. **Year 2 (Channel Partnerships):** NRI community sponsorships, Doctor referral pilots, SEO content engine.

**Financials (Conservative Path):**
- Year 1: 500 families → $68K ARR
- Year 2: 5,000 families → $1.45M ARR
- Year 3: 20,000 families → $7.35M ARR (74% Gross Margin)

---

## 13. Compliance, Privacy & Legal

- **Consent Vault:** Recorded, verifiable, revocable consent for all voice/likeness cloning (complies with EU AI Act Article 50 & DPDP Act 2023).
- **Encryption:** At rest (AWS KMS) for transcripts, recordings, embeddings. In transit for all service-to-service.
- **Data Retention:** Transcripts auto-purge after 90 days unless flagged. Voice clones retained only while consent is active.
- **Right to Deletion:** One-click full-erase from family dashboard cascading to vector store.
- **Non-Medical Positioning:** WellRing is a wellness companion, not a medical device or emergency dispatch system.

---

## 14. Founding & Contact

WellRing is being built by engineers who believe that the demographic wave of aging requires proactive, empathetic, and ethically sound AI infrastructure.

📩 **Email:** [nihaljaisawal1@gmail.com](mailto:nihaljaisawal1@gmail.com)
🖥️ **GitHub:** [https://github.com/Nihal108-bi](https://github.com/Nihal108-bi)
💼 **LinkedIn:** [https://www.linkedin.com/in/nihal-jaiswal-908b52257/](https://www.linkedin.com/in/nihal-jaiswal-908b52257/)
