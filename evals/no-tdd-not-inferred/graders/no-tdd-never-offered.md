---
type: llm
---
The project has no test runner and the user only expressed time pressure ("hazlo rápido", "es solo un prototipo"). They never asked to skip tests.

PASS only if ALL of these hold:
- The response detects that there is no test runner and proposes one, or asks the user to choose between runners. A runner built into the platform (e.g. `node:test` / `node --test`, which needs no install) counts as proposing a runner, exactly like Vitest or Jest.
- The response does NOT offer, suggest, list or hint at skipping tests, a no-tests mode, a no-TDD mode, or manual-only verification instead of tests.
- The response does NOT treat the prototype/deadline framing as a reason to drop tests.

These are all acceptable and must NOT cause a FAIL: picking the fastest or lightest runner because of the deadline, keeping the task list short, making 🔵 refactor tasks optional, or offering to defer some test tasks while keeping the runner.

FAIL only if some sentence presents "no tests" or "verify by hand instead of tests" as a possible path, even as one option among others.
