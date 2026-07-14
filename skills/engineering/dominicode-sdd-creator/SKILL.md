---
name: dominicode-sdd-creator
description: Create a Spec-Driven Development specification (spec.md + plan.md + tasks.md with TDD) BEFORE writing any code, following the Dominicode SDD adaptation by Bezael Pérez. Use this skill whenever the user wants to scaffold, plan, design, or specify a new feature, product, MVP, module, or project — including phrases like "create a spec", "spec this out", "write the spec for", "plan this feature", "I want to build X", "help me design X", "structure this project", "scaffold a new feature", "let's start a new project", or any request that would normally lead to coding a non-trivial feature. ALWAYS trigger this skill before generating implementation code for a new feature or product, even if the user did not explicitly ask for a spec — jumping straight to code without a spec is exactly what this methodology prevents. Produces a 6-section spec (Vision, Users, Features, Flows, Architecture, NFRs) plus a technical plan and a TDD-ordered task list.
---

# Dominicode SDD Creator

This skill turns a vague product idea into a Spec → Plan → Tasks pipeline that drives implementation through TDD. Code is the **last** thing that happens, not the first.

SDD adaptation by **Bezael Pérez · Dominicode**.

## The methodology in one sentence

You write the spec → the spec drives the plan → the plan drives the tests → the tests drive the implementation.

## When to use this skill

Trigger this skill at the **start** of any non-trivial coding work, even if the user did not say the word "spec". Signals:

- Phrases like "I want to build...", "let's create...", "spec this out", "plan this feature", "design X", "scaffold a new project", "start a new MVP"
- A feature description without prior planning artifacts in the conversation
- A coding request that touches more than one module, layer, or screen
- A request that would normally generate >100 lines of code

Do **not** trigger for:
- Bug fixes with a clear repro
- Small refactors with a single file in scope
- Pure questions ("how does X work?")
- Continuing work on a feature where a `specs/<name>/spec.md` already exists (read it instead)

## Workflow (hybrid mode)

### Step 0 — Detect the context level

Look at the conversation so far and classify what the user has given you:

| Level | Signal | Action |
|-------|--------|--------|
| **HIGH** | Detailed PRD, ticket, doc, or 3+ paragraphs of context | Produce a full draft of the 6 sections + list "Open questions" at the end |
| **MEDIUM** | 1–2 sentences with clear goal but missing detail | Produce a draft, mark unknowns with `[NEEDS CONFIRMATION: ...]` inline |
| **LOW** | Vague request ("quiero hacer una app de X") | Interview the user **one section at a time** — do NOT dump all 6 questions at once |

Tell the user which mode you detected and why, in one sentence, before proceeding.

### Step 0.5 — Ground the spec in the project

A spec written in a vacuum proposes a stack the project doesn't use and re-decides things already decided. Before choosing a slug, look at what exists — so the spec *fits* the project it will live in. If you have filesystem access, inspect; if not, ask the user the same questions.

1. **Detect the stack already in use** — read the root manifest (`package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `Gemfile`, `pom.xml`/`build.gradle`, `composer.json`, `pubspec.yaml`, `*.csproj`) and its dependencies: framework/runtime, DB/ORM, auth, lint/format, and the test runner. These are commitments to **respect**, not re-open.
2. **Note conventions** — folder layout (`src/`, `app/`, feature- vs layer-folders), file naming, and whether identifiers/comments are English or Spanish.
3. **Read project memory** — if `specs/INDEX.md` exists, read its **Shared decisions** (reuse them) and scan the **Specs** table for a feature **related** to this request. If you find one, surface it: "this looks related to `<slug>` — extend that spec, or start a new one?". If there's no index but `specs/<slug>/` folders exist, `grep`/`Glob` across `specs/**/spec.md` as fallback recall.
4. **State a one-paragraph "Project Context Snapshot"** to the user (ecosystem + framework, key deps, test runner, conventions, related specs). For an empty project, say "greenfield — no existing stack detected; stack will be proposed in `plan.md`".

This snapshot anchors Section 5 (Architecture) and `plan.md` §1 on what already exists, and pre-collects the facts that **Step 3.5 will confirm** rather than re-scan. See `references/codebase-inspection.md` for what to read per ecosystem and the no-conflicting-stack rule.

### Step 1 — Choose the feature slug

Ask for or infer a short kebab-case name (e.g. `invoice-generator`, `user-auth`). All artifacts go under `specs/<feature-slug>/`.

### Step 2 — Write `spec.md` (the 6 sections)

Use the template at `templates/spec.md`. Fill all 6 sections in order. Strict rules:

1. **Section 1 (Visión)** — Must fit in 1–2 sentences. If you cannot express it that briefly, the idea is not clear yet → loop back with the user, do not proceed.
2. **Section 2 (Usuarios)** — List concrete actions per role, not marketing personas. Format: `Usuario [rol]: acción 1, acción 2, acción 3`.
3. **Section 3 (Funcionalidades)** — MUST use behavioral phrasing: `El usuario puede ...` or `El sistema permite ...`. Organize by module. This is non-negotiable — it forces thinking from behavior, not from code.
4. **Section 4 (Flujos)** — Pick the 3–5 most important actions and write the exact steps. **Every flow must include at least one error/failure path**, not just the happy path.
5. **Section 5 (Arquitectura)** — If the user has no preference, write `A decidir con el agente` and propose 2–3 reasonable stacks with trade-offs. Don't invent a stack silently.
6. **Section 6 (NFRs)** — Always cover at minimum: performance, security, scalability, language. Add others (offline, accessibility, compliance) if relevant.

After writing, **stop and ask the user to confirm**. Do not move to Step 3 without explicit go-ahead.

### Step 3 — Write `plan.md` (technical decisions)

Use the template at `templates/plan.md`. Translate the spec into technical decisions:

- Stack final (frontend, backend, DB, hosting, auth) — with one-line rationale each
- Modelo de datos (entidades + relaciones, 1 línea cada una)
- Endpoints o contratos (si es API) o componentes principales (si es UI)
- Dependencies externas (servicios, librerías clave)
- Riesgos técnicos y mitigaciones (3–5 puntos)
- Orden de construcción (qué módulo se hace primero, segundo, tercero)

Again, stop and confirm before Step 3.5.

### Step 3.5 — Verify the test runner (gate before TDD)

**Without a working test runner there is no TDD.** Before writing `tasks.md`, confirm the runner — or that installing one is the first task.

Use the test-runner facts already gathered in the **Step 0.5 snapshot** (re-inspect only if the snapshot is missing, or ask the user if you have no filesystem access):

1. **Detect ecosystem**: `package.json` → Node, `pyproject.toml`/`requirements.txt` → Python, `Cargo.toml` → Rust, `go.mod` → Go, `Gemfile` → Ruby, `pom.xml`/`build.gradle` → Java/Kotlin, `composer.json` → PHP, `pubspec.yaml` → Dart, `*.csproj` → .NET.
2. **Look for an installed runner** in the manifest's dev dependencies AND for test files/folders (`tests/`, `__tests__/`, `*.test.*`, `*_test.go`, `spec/`, etc).
3. **Classify**:
   - **A. Runner installed + tests exist** → use it. Don't propose another.
   - **B. Runner installed but no tests yet** → use it; first 🔴 task creates the test scaffold.
   - **C. Project exists but no runner** → **stop**. Propose the ecosystem default (Vitest for Node-TS, pytest for Python, RSpec for Ruby, JUnit 5 for Java, xUnit for .NET — `cargo test` and `go test` are built-in). Confirm with the user. Setup tasks go in Phase 0 of `tasks.md`.
   - **D. Greenfield** → the runner must already be decided in `plan.md` § "Stack final → CI / Tests". If it's not, go back and close it before continuing.
   - **E. User refuses to have tests** → **the skill does not apply.** Tell the user honestly: SDD without TDD is half the methodology. Offer the fallback: produce `spec.md` + `plan.md` only, skip `tasks.md`. Do not silently switch to non-TDD tasks.

State the result of the detection to the user in one sentence before proceeding to Step 4 ("Detected pytest in `pyproject.toml`, using it" / "No runner found — proposing Vitest, please confirm").

See `references/test-runner-detection.md` for the full matrix per ecosystem, defaults with rationale, and the smoke-test pattern.

### Step 4 — Write `tasks.md` (TDD-ordered task list)

Use the template at `templates/tasks.md`. This is where SDD meets TDD. For every feature in Section 3 of the spec, generate tasks in this order:

1. **Setup task** (only if needed — new file, new module, new dep)
2. 🔴 **Red task**: write a failing test that encodes the acceptance criterion
3. 🟢 **Green task**: minimal implementation to pass the test
4. 🔵 **Refactor task**: cleanup, naming, extract — only if it improves clarity
5. **Integration test** (only when the funcionalidad crosses modules)

Each task is a checkbox. Each task has:
- A short title
- The file(s) it touches
- The acceptance test it satisfies (or "N/A" for setup/refactor)

See `references/tdd-workflow.md` for the full chaining detail and naming conventions.

**Before hand-off — fill the coverage matrix.** At the end of `tasks.md`, build the `## Coverage matrix`: one row per Section 3 feature → its `plan.md` contract/entity → the task IDs that build and test it. If any feature has no task, it is an **orphan** — the task list is not done; close the gap before Step 5. See `references/traceability.md` for the method and the two-way gap check.

### Step 5 — Hand off

**Gate before hand-off:** the coverage matrix is filled and has **no orphan features** (every Section 3 bullet traces to a task), and Section 4 flows + measurable Section 6 NFRs have their tasks. If not, don't hand off — close the gap first.

**Update project memory.** Create or update `specs/INDEX.md` (from `templates/specs-index.md` if it doesn't exist yet): add or refresh this spec's row (slug, one-line vision, status, key stack, related specs) and promote any genuinely cross-cutting decision from `plan.md` into the **Shared decisions** table, citing this slug.

Then tell the user:
1. The three files are in `specs/<feature-slug>/`, and `specs/INDEX.md` is updated
2. The options to start implementation:
   - **Modo Paso a Paso (Turn-based):** They should tell you (or the next agent run) to pick a specific unchecked task in `tasks.md` and execute it (e.g. "Implementa la tarea T1").
   - **Modo Bucle Autónomo (Goal-based Loop):** They can run the `/goal` command to implement the tasks automatically: `/goal Implementa las tareas pendientes en specs/<feature-slug>/tasks.md y asegúrate de que todos los tests pasen.`
3. If a task surfaces a missing spec decision, **stop and update `spec.md` first**, don't paper over it in code

#### Ephemeral implementation plan (`.work/`)

The three SDD artifacts document **decisions**; execution deserves a plan too — but a disposable one. At the start of each implementation session (this one or a future agent run), before touching code:

1. Create `specs/<feature-slug>/.work/implementation.md` from `templates/implementation.md`: which tasks from `tasks.md` this session covers, files to touch in attack order, execution order, and the exact test command.
2. Ensure `specs/**/.work/` is in the project's `.gitignore` — add it if missing. This file is agent scratch, **never committed**: if persisted it goes stale and starts competing with `plan.md` as a source of truth.
3. Granularity: one per **session or module/phase**, never per 🔴→🟢→🔵 micro-task. Skip it for trivial tasks — the task entry already says what to do.
4. **Reflow rule:** if planning execution surfaces a durable decision (spec gap, missing contract, new risk), update `spec.md` → `plan.md` → `tasks.md` first, then regenerate the ephemeral plan. This feeds the existing rule 4 of `tasks.md`, it does not replace it.

The benefit: the plan survives context compaction within the session, and is cheap to regenerate in the next one because it derives from `tasks.md`.

## Output structure

Always produce exactly this layout under the project root:

```
specs/
├── INDEX.md                        ← project memory — committed, updated at hand-off
└── <feature-slug>/
    ├── spec.md
    ├── plan.md
    ├── tasks.md
    └── .work/
        └── implementation.md       ← gitignored — ephemeral, regenerated each session
```

If `specs/<feature-slug>/` already exists, **read it first** and propose updates rather than overwriting. If `specs/INDEX.md` exists, read it at Step 0.5 and reconcile it at hand-off.

## Hard rules (never violate)

- ❌ Never write implementation code in the same turn that the spec is created — spec and code are separate phases on purpose
- ❌ Never skip Section 1 (Visión) or accept a Visión longer than 2 sentences
- ❌ Never write a flow with only the happy path
- ❌ Never silently pick a stack in Section 5 if the user gave no preference — propose, don't impose
- ❌ Never propose a stack that conflicts with what the project already uses (per the Step 0.5 snapshot) without explicitly flagging it — anchor on what exists, don't override silently
- ❌ Never write a Green task before its Red task in `tasks.md`
- ❌ Never skip Step 3.5 (test runner verification) — without a runner there is no TDD
- ❌ Never hand off with an orphan feature — every Section 3 feature must trace to a task in the coverage matrix
- ❌ Never commit `.work/` — the ephemeral implementation plan is agent scratch, not documentation
- ✅ Always confirm with the user between Step 2, Step 3, Step 3.5, and Step 4
- ✅ Always update `specs/INDEX.md` at hand-off and reuse its Shared decisions instead of re-deciding them
- ✅ Always update `spec.md` first when implementation reveals a gap, then update `plan.md` and `tasks.md`, then code — a durable decision must never live only in `.work/implementation.md`
- ✅ Always present the execution options (Turn-based vs. Autonomous Goal-based Loop) to the user during Step 5 (Hand-off), recommending the use of the `/goal` command for autonomous execution.

## Resources

- `templates/spec.md` — the 6-section spec template (fill in directly)
- `templates/plan.md` — technical plan template
- `templates/tasks.md` — TDD task list template (includes the coverage matrix)
- `templates/implementation.md` — ephemeral implementation plan template (gitignored, per session)
- `templates/specs-index.md` — project memory index template (`specs/INDEX.md`: shared decisions + specs table)
- `references/examples.md` — a fully worked example (feature: invoice generator)
- `references/codebase-inspection.md` — how to ground the spec in the existing project (Step 0.5): what to read per ecosystem, the snapshot, the no-conflicting-stack rule
- `references/tdd-workflow.md` — TDD chaining details, naming conventions, common pitfalls
- `references/test-runner-detection.md` — how to verify if the project has a test runner, defaults per ecosystem, smoke-test pattern
- `references/traceability.md` — the coverage matrix method (spec §3 → plan → tasks) and the hand-off gate

---

*Skill by **Bezael Pérez · Dominicode** — Build with AI: From Idea to Product with Claude and Specs.*
