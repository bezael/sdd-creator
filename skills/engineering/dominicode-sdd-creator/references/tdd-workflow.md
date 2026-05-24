# TDD Workflow — chaining Spec → Plan → Tests → Code

> Detail for Step 4 of the workflow. Defines how the features from Section 3 of the spec are translated into executable TDD tasks.

---

## Principle

**One spec feature = at least one Red → Green → Refactor cycle.**

If a feature needs more than one cycle (because it has sub-behaviors), it is broken down into multiple task rows, **but all share the same source feature** from the spec. Maintain traceability by citing the exact bullet from the spec in each test.

---

## The cycle, concretely

### 🔴 Red — write the failing test

- The test name is a literal translation of the spec bullet: `"The user can create projects with name, client and rate"` → `it("creates a project with name, client and rate", ...)`.
- The test must fail for the right reason (the logic doesn't exist yet), not due to syntax errors or broken imports.
- Verify it fails **before** marking the task as advanced to the next step.
- If you don't know how to write the test, **the spec bullet is ambiguous**. Go back to the spec.

### 🟢 Green — minimal implementation that passes the test

- "Minimal" for real. If the test asks you to add 2 + 2 and return 4, `return 4` is allowed in green.
- Duplication and hardcodes are resolved in refactor, not in green.
- Don't anticipate future features. If the next test will force you to generalize, good — that's TDD working.

### 🔵 Refactor — optional cleanup

- Only if it **improves clarity or removes real duplication**. "Refactor for its own sake" is not a task.
- All tests green before and after. If you break something, go back — don't patch.
- Rename, extract function/method, move file, separate concerns. Do NOT add behavior.

---

## Test naming

Recommended convention (aligns with the "The user can…" form from the spec):

```
describe('[Module] — [Spec feature]', () => {
  it('[expected behavior in natural language]', () => { ... });
  it('fails if [error precondition from Section 4]', () => { ... });
});
```

Real example:

```ts
describe('Hours module — log worked hours', () => {
  it('saves an entry with date, duration and description', () => { /* ... */ });
  it('updates the project total after saving', () => { /* ... */ });
  it('rejects durations <= 0 with a specific message', () => { /* ... */ });
});
```

Notice that **the third test** comes directly from the error path in Section 4 of the spec. That is why SDD requires error paths: each one becomes a test.

---

## When to add an integration test (🔗)

Three situations:

1. **Module close:** a test that exercises 2–3 features of the module together, verifying they fit.
2. **End-to-end flow:** one per flow in Section 4 of the spec. The happy path and at least one error path.
3. **Verifiable NFR:** performance, security, accessibility. Not all NFRs are automatically tested; those that are go here.

Unit tests cover isolated features. Integration tests cover flows. **Don't confuse them** — if a "unit" test spins up a database, it's no longer a unit test.

---

## Common anti-patterns

| Anti-pattern | Why it fails | What to do instead |
|---|---|---|
| Writing the test after the code | That's "test-after", not TDD. The psychological pressure of already-written code biases the test toward confirming what exists, not toward the desired behavior. | Test first, always. If you already have code, delete it or ignore it until you have a red test. |
| A test that never fails | You're testing a mock or a tautology. | Before implementing, run the test and confirm it fails for the right reason. |
| Skipping refactor "because we're in a hurry" | Debt accumulates silently. In 5 tasks the code is unreadable. | Refactor is optional **per task**, but the team should review debt at every module close. |
| Test with multiple unrelated asserts | One assert fails and you don't know what actually broke. | One behavior per test. If you need multiple asserts, they must all describe the same behavior. |
| Implementing without the corresponding spec bullet | You're adding out-of-scope functionality. | If the implementation requires it, go back to the spec and add the bullet first. |
| E2E tests for everything | Slow, fragile, expensive to maintain. | E2E only for critical flows. Most behavior is covered by unit tests. |
| Marking 🟢 without running all tests | The new test passes but you broke another one 2 tasks ago. | Before marking green, run `npm test` (or equivalent) in full. |

---

## TDD task template

Each task in `tasks.md` follows this format:

```markdown
- [ ] 🔴 **Test: the user logs hours with date, duration and description**
      Files: `tests/hours/register.test.ts`
      Criterion: spec.md §3 → "The user can log worked hours with date, duration and description"
      Must fail when the test is run.

- [ ] 🟢 **Implement hour logging**
      Files: `src/hours/register.ts`, `src/hours/types.ts`
      Makes the previous red test pass. Do not add validation the test doesn't require.

- [ ] 🔵 **Refactor: extract validation to `validators.ts`**  (optional)
      Files: `src/hours/register.ts`, `src/hours/validators.ts`
      Only if the next red test (duration <= 0 validation) will duplicate logic.
```

Three non-negotiable fields: files it touches, criterion it satisfies (with spec citation), and the expected state when run.

---

## When to stop the TDD cycle and go back to the spec

These signals indicate the problem **is not a code problem — it's a spec problem**:

- The red test cannot be written because the expected behavior is ambiguous
- Two tests from the same module contradict each other
- The minimal implementation requires an architectural decision not present in `plan.md`
- An error path doesn't appear in Section 4 but clearly should exist

When this happens: **stop coding**. Update `spec.md` → confirm with the user → update `plan.md` if it's affected → regenerate the affected tasks in `tasks.md` → resume TDD from where you stopped.
