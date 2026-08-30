# Tasks — [Feature/Product Name] · MODE: NO TDD

**Status:** Not Started

> Allowed values: **Not Started** · **In Progress** · **Completed**.
> This is the canonical implementation status for this spec. `specs/INDEX.md` mirrors it.
>
> - **Not Started:** no Build or manual Verify task has been executed.
> - **In Progress:** implementation or manual verification has started, but the final completion gate has not passed.
> - **Completed:** every required Build/Verify pair has recorded PASS evidence, the Coverage Matrix has no orphans, Code Review has no blocking findings, and Final Verification is PASS.
>
> A failed or pending manual check keeps the status **In Progress**. Never infer **Completed** from Build checkboxes alone.

> ⚠️ **DEGRADED MODE — NO AUTOMATED TESTS.**
> The user explicitly requested no tests on `[YYYY-MM-DD]`. This is **not** full Dominicode SDD.
> **What is lost:** the safety net. No regression detection, no confident refactoring, no proof
> that something that worked yesterday still works today.
> **What is preserved:** every unit of work still carries its acceptance criterion from
> `spec.md §3`, every criterion is still verified — by hand instead of by a runner — and the
> coverage matrix still gates hand-off.
>
> This mode is never proposed by the agent. It exists only because it was asked for.
> To go back to full SDD, see § **Upgrade path to TDD** at the end of this file.

---

## Conventions

- **Checkbox** `[ ]` → pending / `[x]` → done
- **Emojis** mark the type of work (note: **no** 🔴/🟢 — those belong to TDD mode only):
  - ⚙️ Setup — scaffolding, no criterion attached
  - 🔨 Build — implement one feature from `spec.md §3`
  - ✅ Verify — **manual** check of the acceptance criterion, written as Given / When / Then
  - 🔵 Refactor — cleanup without changing behavior
  - 🔗 Integration check — manual check that crosses modules
- **🔨 and ✅ always travel in pairs.** A Build task is never checked off on its own.
- **Task IDs** use `TASK-XX` and remain stable when tasks are checked or reordered
- **Each verifiable task carries:** Criterion, Files, Verify, Done when and Evidence
- `Verify` may be an automated command or a precisely defined manual Given / When / Then check. `[x]` always means the check was executed and passed, never that an agent asserted completion.

---

## Phase 0 — Project setup

> There is no test runner in this mode. That makes the linter, the type checker and the boot
> smoke check the **only automated feedback left** — so they are mandatory here, not optional.

- [ ] TASK-01 — ⚙️ **Initialize project if greenfield** — Criterion: Phase 0. Files: `[manifests]`. Verify: `[tool query]`. Done when: the manifest is recognized. Evidence: [...].
- [ ] TASK-02 — ⚙️ **Configure linter / formatter** — Criterion: Phase 0. Files: `[config]`. Verify: `[lint command]`. Done when: lint exits 0. Evidence: [...].
- [ ] TASK-03 — ⚙️ **Enable strict type checking** — Criterion: Phase 0, when applicable. Files: `[config]`. Verify: `[typecheck command]`. Done when: typecheck exits 0. Evidence: [...].
- [ ] TASK-04 — ⚙️ **Create folder structure per `plan.md` §3** — Criterion: Phase 0. Files: `[paths]`. Verify: `[tree/import command]`. Done when: required paths resolve. Evidence: [...].
- [ ] TASK-05 — ⚙️ **Boot smoke check** — Criterion: Phase 0. Files: [if changed]. Verify: `[start/import command]`. Done when: the app/module starts without errors. Evidence: [...].

> Do not advance to Phase 1 until lint, typecheck and boot all pass.

---

## Phase 1 — Module [first module from build order in plan.md]

### Feature: [copy literal from Section 3 of the spec]

- [ ] TASK-10 — 🔨 **Build: [feature]**

  Criterion: `spec.md §3 → "The user can [X]"`

  Files:
  - `src/[module]/[file].ts`

  Verify: execute `TASK-11` immediately after the change

  Done when: `TASK-11` has been executed and passed; the Build task is never closed independently

  Evidence: see `TASK-11`

- [ ] TASK-11 — ✅ **Verify: [feature]**

  Criterion: `spec.md §3 → "The user can [X]"`

  Files: none, unless the check produces an approved fixture or script

  Verify: perform the following manual observation
  - **Given:** [starting state — e.g. logged-in user, empty database]
  - **When:** [exact action — e.g. submits the form with amount `0`]
  - **Then:** [observable result — e.g. inline error "Amount must be greater than 0", no record created]

  Done when: the observed result matches Then exactly and no contradictory behavior is observed

  Evidence: `PASS / FAIL` — checked on `[YYYY-MM-DD]` by `[who]`; [short observation or link]

### Feature: [error path from the same flow]

> Section 4 of the spec requires at least one failure path per flow. In this mode that path
> still gets its own ✅ — an unverified error path is the first thing that breaks in production.

- [ ] TASK-12 — ✅ **Verify: [error case]** — Criterion: `spec.md §4 → flow "[name]", error branch`. Files: none. Verify: perform the Given / When / Then below.
  - **Given:** [...]
  - **When:** [...]
  - **Then:** [...]
  - Done when: Then is observed exactly.
  - Evidence: `PASS / FAIL` — checked on `[YYYY-MM-DD]` by `[who]`; [observation/link]

### Module close

- [ ] TASK-19 — 🔗 **Integration check: [module]** — Criterion: covered `spec.md §3/§4` behaviors. Files: none. Verify: execute the listed Given / When / Then sequence. Done when: all module behaviors pass together. Evidence: [date/verifier/result].

---

## Phase 2 — Module [second module from build order in plan.md]

### Feature: [...]

- [ ] TASK-20 — 🔨 **Build: [...]** — Criterion: [...]. Files: [...]. Verify: execute TASK-21. Done when: TASK-21 passes. Evidence: see TASK-21.
- [ ] TASK-21 — ✅ **Verify: [...]** — Criterion: [...]. Files: none. Verify: [Given / When / Then]. Done when: Then is observed. Evidence: [date/verifier/result].

> Repeat build → verify for each feature of each module, in the order defined in `plan.md` section 6.

---

## Phase N — End-to-end flows

> One manual walkthrough per flow from Section 4 of the spec — happy path **and** its error branch.

- [ ] TASK-90 — 🔗 **Flow: [name] — happy path** — Criterion: `spec.md §4`. Files: none. Verify: [Given / When / Then]. Done when: Then is observed. Evidence: [date/verifier/result].
- [ ] TASK-91 — 🔗 **Flow: [name] — error path** — Criterion: `spec.md §4`. Files: none. Verify: [Given / When / Then]. Done when: the defined error result is observed. Evidence: [date/verifier/result].

---

## Final phase — Non-functional requirements

> For each verifiable NFR from Section 6 of the spec, one manual check.

- [ ] TASK-95 — 🔗 **NFR performance: [criterion]** — Criterion: `spec.md §6`. Files: [if any]. Verify: [measurement procedure]. Done when: threshold passes. Evidence: [measurement].
- [ ] TASK-96 — 🔗 **NFR security: [criterion]** — Criterion: `spec.md §6`. Files: [if any]. Verify: [audit/command]. Done when: defined expectation passes. Evidence: [result].
- [ ] TASK-97 — ⚙️ **NFR language: [criterion]** — Criterion: `spec.md §6`. Files: `[i18n paths]`. Verify: [command/observation]. Done when: no required string is missing. Evidence: [result].

---

## Coverage matrix

> **The hand-off gate — unchanged in this mode.** Dropping the runner does not drop traceability.
> One row per feature in Section 3 of the spec, traced forward to a plan element and then to tasks.
> Build this **last, before hand-off**. If any feature's task cell is empty, it's an **orphan** — the
> task list is not done. Full method and the two-way gap check in `references/traceability.md`.

| spec §3 feature | plan contract/entity | task IDs (🔨/✅) |
|---|---|---|
| [literal feature from spec §3] | [`plan.md` §3 endpoint/component or §2 entity] | [e.g. TASK-10 + TASK-11] |
| [...] | [...] | [...] |

**Also confirm:** every Section 4 flow has a 🔗 walkthrough (happy path **and** its error path), and every measurable Section 6 NFR has a verification task. Setup (⚙️), refactor (🔵), flow and NFR tasks don't need a Section 3 row — they trace to phases, not to feature bullets.

**Extra gate for this mode:** a feature whose ✅ has never been run is *also* an orphan. A checked 🔨 with an unchecked ✅ means "written, never verified" — in TDD mode the runner would have caught that; here nothing does except this matrix.

---

## Execution rules

1. **Update status on evidence.** Keep **Not Started** until the first Build/manual Verify is attempted; then set **In Progress**. Set **Completed** only after the final completion gate passes.
2. **One task at a time.** Do not open two in parallel in the same session.
3. **🔨 and ✅ are one unit.** Never check a Build task until its Verify task has actually been run.
4. **Never check ✅ from reading the code.** Run it. In this mode, reading the code and believing it works is precisely the failure mode that tests exist to prevent.
5. **Write the result down.** There is no CI log here — the `Evidence:` line in each ✅ is the only record that the criterion was ever checked.
6. **Refactor costs more here.** Before checking a 🔵, re-run **every ✅ of the touched module**. If that feels like too much work, that is the actual price of having no tests — pay it or skip the refactor; do not skip the re-verification.
7. **If Verify fails:** keep both 🔨 and ✅ unchecked, keep status **In Progress**, diagnose, apply the smallest in-scope fix, and repeat the defined check. If the expected behavior or architecture is unclear, reflow `spec.md` → `plan.md` → `tasks.md` before continuing.
8. **Commits:** one per completed task when the repository workflow calls for it. Suggested message: `[phase] feat(module): description — TASK-XX`.
9. **Do not hand off with an orphan feature** — or with a 🔨 whose ✅ was never run.

---

## Upgrade path to TDD

This file is written so it can be converted, not thrown away.

Every ✅ task is already a test case in prose: its **Given** is the fixture, its **When** is the call
or interaction, its **Then** is the assertion. The conversion is 1:1 and mechanical.

To upgrade:

1. Re-run **Step 3.5** of the skill (test runner detection) and install the ecosystem's runner.
2. Add the Phase 0 runner tasks from `templates/tasks.md` (install → configure → smoke test).
3. Turn each ✅ into a 🔴 Red task, in the same order, keeping the Given/When/Then verbatim as the test body.
4. Swap the `task IDs (🔨/✅)` column of the coverage matrix for `task IDs (🔴/🟢)` — the rows themselves don't change, which is the point.
5. The code already exists, so most 🔴 tasks will go green immediately — the ones that **don't** are the bugs that were shipped while there were no tests. Those are the point of the exercise.

Then update the spec's row in `specs/INDEX.md`: drop the `· no-TDD` marker from its status.

---

*Template by **Bezael Pérez · Dominicode** — degraded mode. The default is `templates/tasks.md`.*
