# Agent Guidelines

## Development Approach

All new capabilities must be introduced using **outside-in TDD** following a strict red-green-refactor cycle at both levels:

### 1. Functional level (Playwright)

Start with a failing Playwright test that describes the user-visible behaviour from the outside. This test should fail before any implementation exists.

```
red   → write a Playwright test that captures the desired user interaction
green → implement the minimum code to make it pass
refactor → clean up without breaking the test
```

Playwright tests live in `app/tests/`. Run with:
```
cd app && npx playwright test
```

### 2. Unit level (Jest)

Once the functional test is red, drive the domain logic inward using failing Jest unit tests. Each unit test should cover a single piece of domain behaviour.

```
red   → write a Jest test for the domain concept
green → implement the minimum domain code to make it pass
refactor → clean up without breaking any tests
```

Jest tests live in `src/` alongside domain code as `*.test.ts`. Run with:
```
npm test
```

### Cycle

```
[Playwright red] → [Jest red] → [Jest green] → [Jest refactor] → [Playwright green] → [Playwright refactor]
```

Never write implementation code without a failing test that demands it. Never skip the refactor step.
