# Tasks — [Feature/Product Name]

**Status:** Not Started

> Allowed values: **Not Started** · **In Progress** · **Completed**.
> This is the canonical implementation status for this spec. `specs/INDEX.md` mirrors it for project-level discovery.
>
> - **Not Started:** the task list is ready, but no implementation task has been executed.
> - **In Progress:** implementation has started and at least one task has been attempted or completed, but the final completion gate has not passed.
> - **Completed:** every required task has objective PASS evidence, the Coverage Matrix has no orphans, Code Review has no blocking findings, and Final Verification is PASS.
>
> A failed Verify after work starts still means **In Progress**. Do not use **Completed** as an agent assertion or from checkbox count alone.

> Derived from `spec.md` + `plan.md`. **Execute tasks in strict order.**
> For each feature: 🔴 failing test → 🟢 minimal implementation → 🔵 refactor (if it adds value).
> If a task reveals something missing in the spec → **go back to the spec first**, don't improvise in code.

---

## Conventions

- **Checkbox** `[ ]` → pending / `[x]` → done
- **Emojis** mark the TDD phase:
  - ⚙️ Setup (no test required)
  - 🔴 Red — write a failing test
  - 🟢 Green — minimal implementation that makes the test pass
  - 🔵 Refactor — cleanup without changing behavior
  - 🔗 Integration — test that crosses modules
- **Task IDs** use `TASK-XX` and remain stable when tasks are checked or reordered
- **Each verifiable task carries a completion contract:** Criterion, Files, Verify, Done when and a short Evidence record
- Not every field applies to pure coordination or documentation tasks. Any task that changes observable behavior, code, configuration or data **must** define objective verification.
- Valid verification includes tests, lint, typecheck, build, commands, queries, HTTP requests, observable behavior, or a precisely defined manual check when automation is not practical.
- `[x]` means the stated verification was executed and produced the expected result. It never means “the agent says it is finished.”

---

## Phase 0 — Project setup and runner verification

> **Mandatory gate:** without a verified test runner, Phase 1 cannot start.
> Before generating this phase, Step 3.5 (runner detection) has already been done. Choose **one** of the two routes based on the result.

### Route A — Runner already exists in the project

- [x] TASK-00 — ⚙️ **Runner detected:** [name and version] in `[manifest]`. (Discovery evidence: [where it was found].)
- [ ] TASK-01 — ⚙️ **Confirm the runner executes**

  Criterion: Phase 0 runner gate

  Files: none

  Verify: `[command]`

  Done when: the command starts the intended runner and exits with the expected success status (including a valid “no tests” result when the runner defines one)

  Evidence: [command + concise result + date/CI link]

### Route B — Runner needs to be installed

- [ ] TASK-01 — ⚙️ **Install runner** — `[install command]`. Verify: `[runner version command or manifest query]`. Done when: the installed runner is resolvable. Evidence: [result].
- [ ] TASK-02 — ⚙️ **Configure runner** — Files: `[config and manifest files]`. Verify: `[config/list command]`. Done when: the runner loads the project configuration without error. Evidence: [result].
- [ ] TASK-03 — ⚙️ **Smoke test the runner** — Files: `tests/smoke.test.[ts|py|...]`. Verify: `[test command scoped to smoke test]`. Done when: the smoke test exits 0. Evidence: [result].

### Rest of setup (common to both routes)

- [ ] TASK-04 — ⚙️ **Initialize project if greenfield** — Files: `[manifests]`. Verify: `[manifest/tool query]`. Done when: the project tool recognizes the manifest. Evidence: [result].
- [ ] TASK-05 — ⚙️ **Configure linter / formatter** — Files: `[config files]`. Verify: `[lint command]`. Done when: lint exits 0 on the current repo. Evidence: [result].
- [ ] TASK-06 — ⚙️ **Create folder structure per `plan.md` §3** — Files: `[paths]`. Verify: `[tree/list/import command]`. Done when: required paths exist and any module-resolution check exits 0. Evidence: [result].

> **Do not advance to Phase 1 until the runner smoke test passes green** (Route B) or the existing runner executes without errors (Route A).

---

## Phase 1 — Module [first module from build order in plan.md]

### Feature: [copy literal from Section 3 of the spec]

- [ ] TASK-10 — 🔴 **Test: [behavioral test name]**

  Criterion: `spec.md §3 → "The user can [X]"`

  Files:
  - `tests/[module]/[case].test.ts`

  Verify: `[command scoped to this test]`

  Done when: the test fails for the expected missing behavior, not because of syntax, imports, environment or configuration

  Evidence: [expected failure summary]

- [ ] TASK-11 — 🟢 **Implement [X]**

  Criterion: `spec.md §3 → "The user can [X]"`

  Files:
  - `src/[module]/[file].ts`
  - `tests/[module]/[case].test.ts`

  Verify: `[command scoped to this behavior]`

  Done when: verification exits 0 and the implementation adds no behavior beyond the criterion

  Evidence: [command + concise PASS result + date/CI link]

- [ ] TASK-12 — 🔵 **Refactor [optional]**

  Criterion: N/A — behavior must remain unchanged

  Files:
  - `src/[module]/[file].ts`

  Verify: `[module or full regression command]`

  Done when: verification exits 0 before and after the refactor

  Evidence: [command + concise PASS result]

### Feature: [next one in the same module]

- [ ] TASK-20 — 🔴 **Test: [...]** — Criterion: [...]. Files: [...]. Verify: `[scoped command]`. Done when: expected Red failure is observed. Evidence: [...].
- [ ] TASK-21 — 🟢 **Implement [...]** — Criterion: [...]. Files: [...]. Verify: `[scoped + regression command]`. Done when: commands exit 0. Evidence: [...].
- [ ] TASK-22 — 🔵 **Refactor [optional]** — Criterion: N/A. Files: [...]. Verify: `[module command]`. Done when: behavior remains green. Evidence: [...].

### Module close

- [ ] TASK-19 — 🔗 **Module integration verification** — Criterion: `spec.md §3/§4 [covered behaviors]`. Files: `tests/[module]/integration.test.ts`. Verify: `[module command]`. Done when: all module behaviors pass together. Evidence: [result].

---

## Phase 2 — Module [second module from build order in plan.md]

### Feature: [...]

- [ ] TASK-30 — 🔴 **Test: [...]** — Criterion: [...]. Files: [...]. Verify: `[scoped command]`. Done when: expected Red failure is observed. Evidence: [...].
- [ ] TASK-31 — 🟢 **Implement [...]** — Criterion: [...]. Files: [...]. Verify: `[scoped + regression command]`. Done when: commands exit 0. Evidence: [...].
- [ ] TASK-32 — 🔵 **Refactor [optional]** — Criterion: N/A. Files: [...]. Verify: `[module command]`. Done when: behavior remains green. Evidence: [...].

> Repeat the red → green → refactor pattern for each feature of each module, in the order defined in `plan.md` section 6.

---

## Phase N — End-to-end flows

> After all modules are done, write one E2E test per flow from Section 4 of the spec.

- [ ] TASK-90 — 🔗 **E2E flow: [flow name] — happy path** — Criterion: `spec.md §4 [flow]`. Files: `tests/e2e/[flow].test.ts`. Verify: `[E2E command]`. Done when: the flow exits 0 and asserts the observable outcome. Evidence: [...].
- [ ] TASK-91 — 🔗 **E2E flow: [flow name] — error path** — Criterion: `spec.md §4 [error]`. Files: `tests/e2e/[flow]-error.test.ts`. Verify: `[E2E command]`. Done when: the defined error behavior passes. Evidence: [...].

---

## Final phase — Non-functional requirements

> For each verifiable NFR from Section 6 of the spec, one task.

- [ ] TASK-95 — 🔗 **NFR performance: [criterion]** — Criterion: `spec.md §6`. Files: `tests/perf/[case].test.ts` or benchmark config. Verify: `[benchmark command]`. Done when: the measured threshold passes. Evidence: [...].
- [ ] TASK-96 — 🔗 **NFR security: [criterion]** — Criterion: `spec.md §6`. Files: `tests/security/[case].test.ts` or audit scope. Verify: `[security check/manual procedure]`. Done when: the defined security expectation passes. Evidence: [...].
- [ ] TASK-97 — ⚙️ **NFR language: [criterion]** — Criterion: `spec.md §6`. Files: `[i18n paths]`. Verify: `[extraction/missing-key command or defined observation]`. Done when: no required string is missing. Evidence: [...].

---

## Coverage matrix

> **The hand-off gate.** One row per feature in Section 3 of the spec, traced forward to a plan element and then to tasks. Build this **last, before hand-off**. If any feature's task cell is empty, it's an **orphan** — the task list is not done. Full method and the two-way gap check in `references/traceability.md`.

| spec §3 feature | plan contract/entity | task IDs (build + verification) |
|---|---|---|
| [literal feature from spec §3] | [`plan.md` §3 endpoint/component or §2 entity] | [e.g. TASK-10 + TASK-11] |
| [...] | [...] | [...] |

**Also confirm:** every Section 4 flow has an E2E task (happy path **and** its error path), and every measurable Section 6 NFR has a verification task. Setup (⚙️), refactor (🔵), E2E and NFR tasks don't need a Section 3 row — they trace to phases, not to feature bullets.

---

## Execution rules

1. **Update status on evidence, not intention.** Keep **Not Started** until the first implementation task is actually attempted; then set **In Progress**. Set **Completed** only after the final completion gate passes.
2. **One task at a time.** Do not open two in parallel in the same session.
3. **Evidence before checkbox.** Never mark a task done until its `Verify` has been executed and its `Done when` condition observed.
4. **If Verify fails:** leave the task unchecked, keep status **In Progress**, diagnose, apply the smallest in-scope fix and run the same verification again. See `references/verification-loop.md`.
5. **Before marking 🟢 done:** run the scoped test and the relevant regression set.
6. **Before marking 🔵 done:** run ALL affected tests and verify they stay green.
7. **If a task reveals ambiguity in the spec:** stop execution, update `spec.md` → `plan.md` → `tasks.md`, then regenerate `.work/implementation.md`. Do not improvise in code.
8. **Commits:** one per completed task when the repository workflow calls for it. Suggested message: `[phase] feat(module): description — TASK-XX`.
9. **Do not hand off with an orphan feature:** the coverage matrix above must have a task for every Section 3 feature before implementation starts.
