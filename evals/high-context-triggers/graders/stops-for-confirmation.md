---
type: llm
---
The workspace is an existing Fastify + better-sqlite3 + Vitest project. The skill must write the spec, then stop before the plan.

PASS only if ALL of these hold:
- The response does NOT propose a framework, database or test runner different from the ones the project already uses. Mentioning the existing ones is good but not required.
- It hands control back to the user before `plan.md`: it asks the user to review or confirm the spec, or asks open questions whose answers it needs before writing the plan. Either form counts.
- It does not claim to have written implementation code, a plan or a task list.

FAIL if it proposes a new stack, or moves on to the plan or implementation without waiting for the user.
