---
name: dominicode-sdd-creator
description: Create a Spec-Driven Development specification (spec.md + plan.md + tasks.md with TDD) BEFORE writing any code, following the Dominicode SDD methodology by Bezael Pérez. Use this skill whenever the user wants to scaffold, plan, design, or specify a new feature, product, MVP, module, or project — including phrases like "create a spec", "spec this out", "write the spec for", "plan this feature", "I want to build X", "help me design X", "structure this project", "scaffold a new feature", "let's start a new project", or any request that would normally lead to coding a non-trivial feature. ALWAYS trigger this skill before generating implementation code for a new feature or product, even if the user did not explicitly ask for a spec — jumping straight to code without a spec is exactly what this methodology prevents. Produces a 6-section spec (Visión, Usuarios, Funcionalidades, Flujos, Arquitectura, NFRs) plus a technical plan and a TDD-ordered task list.
---

# Dominicode SDD Creator

This skill turns a vague product idea into a Spec → Plan → Tasks pipeline that drives implementation through TDD. Code is the **last** thing that happens, not the first.

Methodology by **Bezael Pérez · Dominicode**.

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

### Step 1 — Choose the feature slug

Ask for or infer a short kebab-case name (e.g. `invoice-generator`, `user-auth`). All artifacts go under `specs/<feature-slug>/`.

### Step 2 — Write `spec.md` (the 6 sections)

Use the template at `templates/spec.md`. Fill all 6 sections in order. Strict rules:

1. **Section 1 (Visión)** — Must fit in 1–2 sentences. If you cannot express it that briefly, the idea is not clear yet → loop back with the user, do not proceed.
2. **Section 2 (Usuarios)** — List concrete actions per role, not marketing personas. Format: `Usuario [rol]: acción 1, acción 2, acción 3`.
3. **Section 3 (Funcionalidades)** — MUST use behavioral phrasing: `El usuario puede ...` or `El sistema permite ...`. Organize by module. This is non-negotiable — it forces thinking from behavior, not from code.
4. **Section 4 (Flujos)** — Pick the 3–5 most important actions and write the exact steps. **Every flow must include at least one error/failure path**, not just the happy path.
5. **Section 5 (Arquitectura)** — If the user has no preference, write `A decidir con el agente` and propose 2–3 reasonable stacks with trade-offs. Don't invent a stack silently.
6. **Section 6 (NFRs)** — Always cover at minimum: rendimiento, seguridad, escalabilidad, idioma. Add others (offline, accesibilidad, compliance) if relevant.

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

**Without a working test runner there is no TDD.** Before writing `tasks.md`, verify that the project has a test runner — or that installing one is the first task.

Inspect the project root (or ask the user if you have no filesystem access):

1. **Detect ecosystem**: `package.json` → Node, `pyproject.toml`/`requirements.txt` → Python, `Cargo.toml` → Rust, `go.mod` → Go, `Gemfile` → Ruby, `pom.xml`/`build.gradle` → Java/Kotlin, `composer.json` → PHP, `pubspec.yaml` → Dart, `*.csproj` → .NET.
2. **Look for an installed runner** in the manifest's dev dependencies AND for test files/folders (`tests/`, `__tests__/`, `*.test.*`, `*_test.go`, `spec/`, etc).
3. **Classify**:
   - **A. Runner installed + tests exist** → use it. Don't propose another.
   - **B. Runner installed but no tests yet** → use it; first 🔴 task creates the test scaffold.
   - **C. Project exists but no runner** → **stop**. Propose the ecosystem default (Vitest for Node-TS, pytest for Python, RSpec for Ruby, JUnit 5 for Java, xUnit for .NET — `cargo test` and `go test` are built-in). Confirm with the user. Setup tasks go in Fase 0 of `tasks.md`.
   - **D. Greenfield** → the runner must already be decided in `plan.md` § "Stack final → CI / Tests". If it's not, go back and close it before continuing.
   - **E. User refuses to have tests** → **the skill does not apply.** Tell the user honestly: SDD without TDD is half the methodology. Offer the fallback: produce `spec.md` + `plan.md` only, skip `tasks.md`. Do not silently switch to non-TDD tasks.

State the result of the detection to the user in one sentence before proceeding to Step 4 ("Detected pytest in `pyproject.toml`, using it" / "No runner found — proposing Vitest, please confirm").

See `references/test-runner-detection.md` for the full matrix per ecosystem, defaults with rationale, and the smoke-test pattern.

### Step 4 — Write `tasks.md` (TDD-ordered task list)

Use the template at `templates/tasks.md`. This is where SDD meets TDD. For every funcionalidad in Section 3 of the spec, generate tasks in this order:

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

### Step 5 — Hand off

Tell the user:
1. The three files are in `specs/<feature-slug>/`
2. To start implementation, they (or the next agent run) should pick the first unchecked task in `tasks.md` and execute it — nothing else
3. If a task surfaces a missing spec decision, **stop and update `spec.md` first**, don't paper over it in code

## Output structure

Always produce exactly this layout under the project root:

```
specs/
└── <feature-slug>/
    ├── spec.md
    ├── plan.md
    └── tasks.md
```

If `specs/<feature-slug>/` already exists, **read it first** and propose updates rather than overwriting.

## Hard rules (never violate)

- ❌ Never write implementation code in the same turn that the spec is created — spec and code are separate phases on purpose
- ❌ Never skip Section 1 (Visión) or accept a Visión longer than 2 sentences
- ❌ Never write a flow with only the happy path
- ❌ Never silently pick a stack in Section 5 if the user gave no preference — propose, don't impose
- ❌ Never write a Green task before its Red task in `tasks.md`
- ❌ Never skip Step 3.5 (test runner verification) — sin runner no hay TDD, y SDD-TDD pierde sentido
- ✅ Always confirm with the user between Step 2, Step 3, Step 3.5, and Step 4
- ✅ Always update `spec.md` first when implementation reveals a gap, then update `plan.md` and `tasks.md`, then code

## Resources

- `templates/spec.md` — the 6-section spec template (fill in directly)
- `templates/plan.md` — technical plan template
- `templates/tasks.md` — TDD task list template
- `references/examples.md` — a fully worked example (feature: invoice generator)
- `references/tdd-workflow.md` — TDD chaining details, naming conventions, common pitfalls
- `references/test-runner-detection.md` — how to verify if the project has a test runner, defaults per ecosystem, smoke-test pattern

---

*Skill by **Bezael Pérez · Dominicode** — Construye con IA: De la Idea al Producto con Claude y Specs.*
