# Tasks — [Feature/Product Name] · MODE: NO TDD

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
- **Each task lists** the files it touches and the criterion it satisfies

---

## Phase 0 — Project setup

> There is no test runner in this mode. That makes the linter, the type checker and the boot
> smoke check the **only automated feedback left** — so they are mandatory here, not optional.

- [ ] ⚙️ **Initialize project if greenfield** — `package.json`, `tsconfig.json` or other manifests.
- [ ] ⚙️ **Configure linter / formatter** — [eslint, prettier, biome, ruff, rustfmt...]. Verify: the lint command exits clean on the current repo.
- [ ] ⚙️ **Enable strict type checking** (typed languages only) — [`strict: true`, mypy, sorbet...]. Verify: the typecheck command exits clean.
- [ ] ⚙️ **Create folder structure per `plan.md` section 3.**
- [ ] ⚙️ **Boot smoke check** — start the app / import the module. It must come up without errors. This is the floor of "it works" in this mode.

> Do not advance to Phase 1 until lint, typecheck and boot all pass.

---

## Phase 1 — Module [first module from build order in plan.md]

### Feature: [copy literal from Section 3 of the spec]

- [ ] 🔨 **Build: [feature]** — files: `src/[module]/[file].ts`. Criterion: `spec.md §3 → "The user can [X]"`.
- [ ] ✅ **Verify: [feature]** — criterion: `spec.md §3 → "The user can [X]"`.
  - **Given:** [starting state — e.g. logged-in user, empty database]
  - **When:** [exact action — e.g. submits the form with amount `0`]
  - **Then:** [observable result — e.g. inline error "Amount must be greater than 0", no record created]
  - Result: `pass / fail` — checked on `[YYYY-MM-DD]` by `[who]`

### Feature: [error path from the same flow]

> Section 4 of the spec requires at least one failure path per flow. In this mode that path
> still gets its own ✅ — an unverified error path is the first thing that breaks in production.

- [ ] ✅ **Verify: [error case]** — criterion: `spec.md §4 → flow "[name]", error branch`.
  - **Given:** [...]
  - **When:** [...]
  - **Then:** [...]
  - Result: `pass / fail` — checked on `[YYYY-MM-DD]` by `[who]`

### Module close

- [ ] 🔗 **Integration check: [module]** — manually exercise the module's features end to end in one sitting. List the steps as Given / When / Then, same format as ✅.

---

## Phase 2 — Module [second module from build order in plan.md]

### Feature: [...]

- [ ] 🔨 **Build: [...]** — ...
- [ ] ✅ **Verify: [...]** — ...

> Repeat build → verify for each feature of each module, in the order defined in `plan.md` section 6.

---

## Phase N — End-to-end flows

> One manual walkthrough per flow from Section 4 of the spec — happy path **and** its error branch.

- [ ] 🔗 **Flow: [name]** — happy path. Given / When / Then. Result: `pass / fail`
- [ ] 🔗 **Flow: [name]** — error case defined in the spec. Given / When / Then. Result: `pass / fail`

---

## Final phase — Non-functional requirements

> For each verifiable NFR from Section 6 of the spec, one manual check.

- [ ] 🔗 **NFR performance: [criterion]** — how it is measured: [devtools, `time`, load tool]. Threshold: [...]
- [ ] 🔗 **NFR security: [criterion]** — how it is checked: [manual audit, `npm audit`, headers review]
- [ ] ⚙️ **NFR language: [criterion]** — i18n configured, strings extracted.

---

## Coverage matrix

> **The hand-off gate — unchanged in this mode.** Dropping the runner does not drop traceability.
> One row per feature in Section 3 of the spec, traced forward to a plan element and then to tasks.
> Build this **last, before hand-off**. If any feature's task cell is empty, it's an **orphan** — the
> task list is not done. Full method and the two-way gap check in `references/traceability.md`.

| spec §3 feature | plan contract/entity | task IDs (🔨/✅) |
|---|---|---|
| [literal feature from spec §3] | [`plan.md` §3 endpoint/component or §2 entity] | [e.g. Phase 1 🔨+✅] |
| [...] | [...] | [...] |

**Also confirm:** every Section 4 flow has a 🔗 walkthrough (happy path **and** its error path), and every measurable Section 6 NFR has a verification task. Setup (⚙️), refactor (🔵), flow and NFR tasks don't need a Section 3 row — they trace to phases, not to feature bullets.

**Extra gate for this mode:** a feature whose ✅ has never been run is *also* an orphan. A checked 🔨 with an unchecked ✅ means "written, never verified" — in TDD mode the runner would have caught that; here nothing does except this matrix.

---

## Execution rules

1. **One task at a time.** Do not open two in parallel in the same session.
2. **🔨 and ✅ are one unit.** Never check a Build task until its Verify task has actually been run.
3. **Never check ✅ from reading the code.** Run it. In this mode, reading the code and believing it works is precisely the failure mode that tests exist to prevent.
4. **Write the result down.** There is no CI log here — the `Result:` line in each ✅ is the only record that the criterion was ever checked.
5. **Refactor costs more here.** Before checking a 🔵, re-run **every ✅ of the touched module**. If that feels like too much work, that is the actual price of having no tests — pay it or skip the refactor; do not skip the re-verification.
6. **If a task reveals ambiguity in the spec:** stop, update `spec.md` and `plan.md`, regenerate the affected tasks. Do not improvise in code.
7. **Commits:** one per completed task. Suggested message: `[phase] feat(module): description — task #N`.
8. **Do not hand off with an orphan feature** — or with a 🔨 whose ✅ was never run.

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
