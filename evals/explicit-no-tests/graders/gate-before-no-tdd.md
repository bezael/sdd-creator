---
type: llm
---
The user explicitly said "No quiero tests". Before entering no-TDD mode the skill must:
1. Ask one question separating "not now" (prototype or deadline: stay in TDD and defer the test tasks) from "never" (no tests, period).
2. State the cost once, briefly, without moralizing (no regression detection, no confident refactoring, every criterion verified by hand).
3. Ask for explicit confirmation.

PASS only if the response asks the "not now vs never" question (in any wording) and asks for confirmation BEFORE producing a task list.
FAIL if it writes or shows a no-TDD task list right away, if it ignores the request and silently writes TDD tasks, or if it lectures the user at length.
