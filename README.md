# Conveyancing AI

A client-facing assistant that guides home buyers through the conveyancing process with clarity, timeliness, and calm.

## Principles

### Simple interface
The UI the user interacts with should be simple and direct. Every screen, element, and interaction must earn its place. Complexity is hidden behind the scenes — never surfaced to the client.

### Jargon-free
Conveyancing is filled with legal and procedural terminology that is opaque to most clients. This system translates those concepts and processes into plain, clear language that anyone can understand without a legal background.

### Up-to-date information
Clients should never be left wondering whether what they are seeing is current. Information must reflect the latest known state of the case at all times.

### Proactiveness
Clients should not have to ask questions to find out what is happening. The system surfaces relevant updates and next steps before the client needs to chase, reducing uncertainty and the anxiety that comes with it.

### Emotional tone awareness
Buying a home is one of the most stressful experiences in a person's life. Every piece of information — status updates, delays, requests for action — must be presented in a tone that is calm, clear, and reassuring. The system should never make a client feel alarmed or lost.

---

## Running locally

### Prerequisites

- Node.js 20+
- npm 10+

### 1. Install dependencies

From the repo root, install domain dependencies:

```bash
npm install
```

Then install the React app dependencies:

```bash
cd app && npm install
```

### 2. Start the dev server

```bash
cd app && npm run dev
```

The app will be available at `http://localhost:5173`.

### 3. Run unit tests (Jest)

Domain logic tests, from the repo root:

```bash
npm test
```

### 4. Run functional tests (Playwright)

End-to-end tests against the running app. Playwright starts the dev server automatically:

```bash
cd app && npx playwright test
```

To run with the interactive UI:

```bash
cd app && npx playwright test --ui
```

### Project structure

```
conveyancing_ai/
├── data/               # Case and event data (JSON + schema)
├── src/                # Domain logic and unit tests (*.test.ts)
├── app/                # React frontend (Vite + TypeScript)
│   ├── src/            # UI components
│   └── tests/          # Playwright functional tests
├── AGENTS.md           # Development approach and TDD guidelines
└── README.md
```
