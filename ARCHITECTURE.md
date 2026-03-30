# Architecture

This project follows a **ports and adapters** (hexagonal) architecture to keep concerns cleanly separated and the domain free from infrastructure dependencies.

## Layers

```
┌─────────────────────────────────────────────┐
│                   React UI                  │  app/src/
│         (components, hooks, pages)          │
└────────────────────┬────────────────────────┘
                     │ calls
┌────────────────────▼────────────────────────┐
│             Application Layer               │  src/application/
│   (use cases, orchestration, port definitions)  │
└──────────┬──────────────────────┬───────────┘
           │ drives               │ depends on (ports)
┌──────────▼──────────┐  ┌───────▼───────────────────┐
│    Domain Layer     │  │   Infrastructure Layer     │
│  src/domain/        │  │   src/infrastructure/      │
│                     │  │                            │
│  Business logic,    │  │  Adapters that implement   │
│  entities, rules.   │  │  the ports defined in the  │
│  No framework or    │  │  application layer.        │
│  I/O dependencies.  │  │  (API clients, storage,    │
│                     │  │   data loaders, etc.)      │
└─────────────────────┘  └────────────────────────────┘
```

## Rules

### React UI → Application layer
The UI imports and calls application-layer services only. It never reaches into the domain or infrastructure directly.

### Application layer → Domain
The application layer orchestrates use cases by calling domain logic. Dependency flows inward: the application layer depends on the domain, never the reverse.

### Ports (application layer)
Interfaces for any external dependency — data fetching, storage, external APIs — are defined as TypeScript interfaces in the application layer. The application layer depends on these abstractions, not on concrete implementations.

### Adapters (infrastructure layer)
Concrete implementations of ports live in the infrastructure layer. They are injected into the application at startup (composition root), keeping the application and domain layers free of infrastructure concerns.

### Domain layer
Pure business logic. No framework imports, no I/O, no knowledge of HTTP or storage. Entities and rules here should be testable with plain Jest without any mocking of infrastructure.

## Directory structure

```
src/
├── domain/            # Entities, value objects, domain rules
├── application/       # Use cases, port interfaces, application services
│   └── ports/         # TypeScript interfaces for external dependencies
└── infrastructure/    # Adapter implementations of ports

app/src/               # React components and hooks (UI layer)
```

## Startup / composition root

Adapters are instantiated and wired to the application layer at startup — in `app/src/main.tsx` or a dedicated bootstrap module. Nothing outside the composition root should instantiate a concrete adapter directly.
