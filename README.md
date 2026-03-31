# Conveyancing AI

A client-facing assistant that guides home buyers through the conveyancing process with clarity, timeliness, and calm. It translates legal and procedural complexity into plain English, surfaces relevant updates proactively, and maintains a reassuring tone throughout.

---

## Install and run

### Prerequisites

- Node.js 20+
- npm 10+

### 1. Install dependencies

From the repo root:

```bash
npm install
cd app && npm install
```

### 2. Configure the OpenAI API key

The AI assistant uses OpenAI to generate plain-English explanations. Without a valid key the app falls back to mock responses automatically.

```bash
cp app/.env app/.env.local
```

Then open `app/.env.local` and set your key:

```
VITE_OPENAI_API_KEY=your-openai-api-key-here
```

Get a key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys).

### 3. Start the dev server

```bash
cd app && npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Run unit tests (Jest)

Domain logic tests, from the repo root:

```bash
npm test
```

### 5. Run functional tests (Playwright)

End-to-end tests against the running app. Playwright starts the dev server automatically:

```bash
cd app && npx playwright test
```

To run with the interactive UI:

```bash
cd app && npx playwright test --ui
```

---

## Reviewing the app

Start the dev server (`cd app && npm run dev`) then open these URLs to exercise the key scenarios:

| Scenario | URL |
|---|---|
| Valid case — happy path | `http://localhost:5173/case/CASE-2024-0847` |
| Invalid case ID — case not found | `http://localhost:5173/case/CASE-INVALID` |
| Missing case ID — no ID provided | `http://localhost:5173/case/` |

The valid case (`CASE-2024-0847`) shows the full experience: AI-generated summary, task board, and event timeline. The error cases verify that the app handles bad input gracefully with clear, user-friendly messaging.

---

## Capabilities

- **AI-generated case summaries** — converts raw case data into a friendly, conversational explanation of where things stand and what happens next.
- **Live task tracking** — displays the current state of all conveyancing tasks, organised by stage, with clear status indicators.
- **Event timeline** — shows the history of case events in chronological order so clients always know what has happened.
- **Jargon-free language** — all terminology is translated into plain English; no legal background required.
- **Proactive updates** — relevant information is surfaced before the client needs to ask.
- **Mobile-friendly** — the interface adapts to small screens without loss of functionality.
- **Graceful degradation** — if the OpenAI key is missing or invalid, the app falls back to mock AI responses automatically.

---

## Architecture and design decisions

The project follows a **hexagonal (ports and adapters)** architecture, enforcing a strict separation between business logic, application orchestration, and infrastructure concerns.

```
React UI  (app/src/)
    ↓
Application layer  (src/application/)   ← use cases + port interfaces
    ↓
Domain layer       (src/domain/)        ← pure business logic, no I/O
Infrastructure     (src/infrastructure/) ← adapter implementations
```

**Dependency inversion via ports** — external concerns (data access, AI calls) are expressed as TypeScript interfaces in `src/application/ports/`. The domain and application layers never import concrete implementations; they depend only on the interfaces.

**Composition root** — `app/src/main.tsx` is the single place where adapters are instantiated and injected into the React app. The UI never creates repositories or AI agents directly.

**Lazy-loaded OpenAI client** — the OpenAI SDK is dynamically imported at startup based on environment variables (`VITE_OPENAI_API_KEY`, `VITE_USE_MOCK_AI`), keeping the development build free of hard AI dependencies.

**Outside-in TDD** — Playwright functional tests define expected behaviour at the UI level; Jest unit tests cover domain logic in isolation. The test boundary matches the architectural boundary.

**Mock adapter parity** — `MockCaseExplainerAgent` and the JSON-based repositories provide deterministic behaviour for tests and for running the app without external services, making the full test suite runnable offline.

### Project structure

```
conveyancing_ai/
├── data/               # Case, task, and event data (JSON + schema)
├── src/
│   ├── domain/         # Pure domain entities and business rules
│   ├── application/    # Use cases and port interfaces
│   └── infrastructure/ # Adapter implementations (JSON repos, OpenAI agent)
├── app/
│   ├── src/            # React UI components
│   └── tests/          # Playwright functional tests
└── AGENTS.md           # Development approach and TDD guidelines
```

---

## Domain design

The domain models the conveyancing lifecycle as a set of collaborating entities with no framework or I/O dependencies.

**`ConveyancingCase`** — the aggregate root. Holds the case reference, property address, parties involved, current stage, and overall status.

**`CaseTask`** — a single unit of work within the conveyancing process (e.g. "Draft contract", "Run searches"). Each task carries a status (`pending`, `in_progress`, `completed`, `blocked`) and belongs to a named stage.

**`TaskGraph`** — models inter-task dependencies as a directed acyclic graph. Tasks are topologically sorted into levels so the UI can display which work is currently active, which is blocked, and which is yet to start. Cycles are detected and rejected at construction time.

**`CaseEvent`** — an immutable record of something that happened on the case (e.g. a document received, a milestone reached). Events are append-only and drive both the timeline view and the context fed to the AI agent.

**`CaseExplainerAgent`** (port) — takes a snapshot of the case, its tasks, and its recent events, and returns a human-friendly explanation. The OpenAI adapter (`OpenAICaseExplainerAgent`) sends this context to GPT-4o-mini; the mock adapter returns deterministic copy for tests.

The domain layer has no knowledge of React, Vite, OpenAI, or JSON. All runtime wiring happens at the composition root.
