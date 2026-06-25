# Tasks — [Feature/Product Name]

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
- **Each task lists** the files it touches and the criterion it satisfies

---

## Phase 0 — Project setup and runner verification

> **Mandatory gate:** without a verified test runner, Phase 1 cannot start.
> Before generating this phase, Step 3.5 (runner detection) has already been done. Choose **one** of the two routes based on the result.

### Route A — Runner already exists in the project

- [x] ⚙️ **Runner verified:** [name, e.g. vitest 1.6.0] detected in `[file, e.g. package.json]`. Command: `[e.g. npm test]`. (No installation required.)
- [ ] ⚙️ **Confirm the runner executes** — run `[command]` in the current repo. Must complete without error (there may be no tests yet).

### Route B — Runner needs to be installed

- [ ] ⚙️ **Install runner** — `[install command, e.g. npm install -D vitest @vitest/ui]`.
- [ ] ⚙️ **Configure runner** — `[config files, e.g. vitest.config.ts + script "test": "vitest" in package.json]`.
- [ ] ⚙️ **Smoke test the runner** — create `tests/smoke.test.[ts|py|...]` with a trivial test (`expect(true).toBe(true)` or equivalent). Run `[command]` and verify it **passes**. This validates the config works before starting real TDD.

### Rest of setup (common to both routes)

- [ ] ⚙️ **Initialize project if greenfield** — `package.json`, `tsconfig.json` or other manifests. Test: N/A.
- [ ] ⚙️ **Configure linter / formatter** — [eslint, prettier, biome, ruff, rustfmt...]. Test: the linter command passes on the current repo.
- [ ] ⚙️ **Create folder structure per `plan.md` section 3** — Test: N/A.

> **Do not advance to Phase 1 until the runner smoke test passes green** (Route B) or the existing runner executes without errors (Route A).

---

## Phase 1 — Module [first module from build order in plan.md]

### Feature: [copy literal from Section 3 of the spec]

- [ ] 🔴 **Test: [test name]** — files: `tests/[module]/[case].test.ts`. Criterion: `spec.md §3 → "The user can [X]"`. Must FAIL when run.
- [ ] 🟢 **Implement [X]** — files: `src/[module]/[file].ts`. Makes the red test pass. Do NOT add code the test doesn't require.
- [ ] 🔵 **Refactor [optional]** — files: `src/[module]/[file].ts`. Only if it improves clarity. Tests stay green.

### Feature: [next one in the same module]

- [ ] 🔴 **Test: [...]** — ...
- [ ] 🟢 **Implement [...]** — ...
- [ ] 🔵 **Refactor** — ...

### Module close

- [ ] 🔗 **Module integration test** — verifies that the module's features work together. Files: `tests/[module]/integration.test.ts`.

---

## Phase 2 — Module [second module from build order in plan.md]

### Feature: [...]

- [ ] 🔴 **Test: [...]** — ...
- [ ] 🟢 **Implement [...]** — ...
- [ ] 🔵 **Refactor** — ...

> Repeat the red → green → refactor pattern for each feature of each module, in the order defined in `plan.md` section 6.

---

## Phase N — End-to-end flows

> After all modules are done, write one E2E test per flow from Section 4 of the spec.

- [ ] 🔗 **E2E flow: [flow name]** — happy path. Files: `tests/e2e/[flow].test.ts`.
- [ ] 🔗 **E2E flow: [flow name]** — error case defined in the spec. Files: `tests/e2e/[flow]-error.test.ts`.

---

## Final phase — Non-functional requirements

> For each verifiable NFR from Section 6 of the spec, one task.

- [ ] 🔗 **NFR performance: [criterion]** — files: `tests/perf/[case].test.ts` or benchmark tool.
- [ ] 🔗 **NFR security: [criterion]** — files: `tests/security/[case].test.ts` or manual audit.
- [ ] ⚙️ **NFR language: [criterion]** — i18n configured, strings extracted.

---

## Coverage matrix

> **The hand-off gate.** One row per feature in Section 3 of the spec, traced forward to a plan element and then to tasks. Build this **last, before hand-off**. If any feature's task cell is empty, it's an **orphan** — the task list is not done. Full method and the two-way gap check in `references/traceability.md`.

| spec §3 feature | plan contract/entity | task IDs (🔴/🟢) |
|---|---|---|
| [literal feature from spec §3] | [`plan.md` §3 endpoint/component or §2 entity] | [e.g. Phase 1 🔴+🟢] |
| [...] | [...] | [...] |

**Also confirm:** every Section 4 flow has an E2E task (happy path **and** its error path), and every measurable Section 6 NFR has a verification task. Setup (⚙️), refactor (🔵), E2E and NFR tasks don't need a Section 3 row — they trace to phases, not to feature bullets.

---

## Execution rules

1. **One task at a time.** Do not open two in parallel in the same session.
2. **Before marking 🟢 done:** run the tests and verify the corresponding test passes.
3. **Before marking 🔵 done:** run ALL tests and verify they stay green.
4. **If a task reveals ambiguity in the spec:** stop execution, update `spec.md` and `plan.md`, and regenerate the affected tasks. Do not improvise in code.
5. **Commits:** one per completed task. Suggested message: `[phase] feat(module): description — task #N`.
6. **Do not hand off with an orphan feature:** the coverage matrix above must have a task for every Section 3 feature before implementation starts.
