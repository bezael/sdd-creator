# Ephemeral Implementation Plan — [Feature/Product Name] · [module/phase or session scope]

> **Agent scratch — NOT documentation.** This file lives in `specs/<feature-slug>/.work/`, is gitignored, and is regenerated from `tasks.md` at the start of each implementation session. Never commit or maintain it as a source of truth. Durable decisions live only in `spec.md`, `plan.md` and `tasks.md`.
>
> Write one per session or module/phase, not per micro-task. Skip it for trivial tasks whose execution is already obvious from `tasks.md`.

---

## 1. Target task(s)

> Copy the next unchecked task(s) literally, including their IDs and completion contracts. Execute one at a time.

- [ ] TASK-XX — [task title]
  - Criterion: [citation]
  - Files: [paths]
  - Verify: `[exact command or manual check]`
  - Done when: [objective expected result]

---

## 2. Files to touch

> Concrete paths in attack order. Stay inside the selected task's declared scope.

1. `[path]` — create / modify — [why TASK-XX needs it]
2. `[path]` — create / modify — [why TASK-XX needs it]

---

## 3. Implement → Verify → Fix loop

For each selected task:

1. Select the next unchecked task from `tasks.md`.
2. If this is the first implementation attempt, change `tasks.md` status from `Not Started` to `In Progress` and mirror it in `specs/INDEX.md`.
3. Read its Criterion, Files, Verify and Done when fields.
4. Implement only that task's scope. Under TDD, preserve 🔴 Red → 🟢 Green → 🔵 Refactor.
5. Execute the task's exact Verify instruction.
6. If it **passes**:
   - record concise evidence in the task;
   - mark the task completed;
   - continue to the next task.
7. If it **fails**:
   - leave the task unchecked;
   - diagnose whether the failure comes from the change, the verification environment, or an invalid expectation;
   - apply the smallest in-scope fix;
   - run the same Verify instruction again.
8. Repeat until PASS or until the failure exposes a durable problem in the requirements or technical plan.
9. When a durable problem appears, stop implementation and reflow in order: update `spec.md`, then `plan.md`, then `tasks.md`, and finally regenerate this scratch file. Status remains `In Progress`.

Do not weaken or replace `Verify` merely to obtain a pass. If the verification instruction itself is wrong, that is a task-definition problem and requires reflow.

---

## 4. Verification and evidence log

> Keep this short. The durable checkbox and concise evidence belong in `tasks.md`; this table is session scratch and may include diagnostic retries.

| Task | Attempt | Verify | Result | Diagnostic / evidence |
|---|---:|---|---|---|
| TASK-XX | 1 | `[command/check]` | FAIL | [cause] |
| TASK-XX | 2 | `[same command/check]` | PASS | [concise result or CI URL] |

---

## 5. Module/session close

- [ ] Every selected task has objective PASS evidence before its checkbox is marked.
- [ ] The relevant module verification has been re-run after the last task.
- [ ] No durable decision exists only in this file.
- [ ] Any spec/plan gap triggered a full `spec.md` → `plan.md` → `tasks.md` reflow.

See `references/verification-loop.md` for stopping rules and the distinction between task, module and final verification.
