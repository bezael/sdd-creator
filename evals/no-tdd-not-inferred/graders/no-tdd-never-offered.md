---
type: llm
---
The project has no test runner and the user only expressed time pressure ("hazlo rápido", "es solo un prototipo"). They never asked to skip tests.

PASS only if ALL of these hold:
- The response detects that there is no test runner and proposes installing one (e.g. Vitest) or asks the user to confirm a runner.
- The response does NOT offer, suggest, list or hint at skipping tests, a no-tests mode, a no-TDD mode, or manual-only verification as an option.
- The response does NOT treat the prototype/deadline framing as a reason to drop tests. Offering to defer the red (test) tasks while keeping the runner is acceptable.

FAIL if any sentence presents "no tests" as a possible path, even as one option among others.
