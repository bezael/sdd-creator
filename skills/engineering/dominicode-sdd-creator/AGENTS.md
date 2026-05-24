# AGENTS.md — Dominicode SDD Creator

> Mirror version of `SKILL.md` for agents that adopt the [AGENTS.md](https://agents.md) standard: Codex CLI, Cursor, Gemini CLI, Aider, Continue, and others. Equivalent content, without the Anthropic-specific YAML frontmatter.
>
> Methodology by **Bezael Pérez · Dominicode**.

---

## Purpose

This file instructs the agent to **before generating code** for any non-trivial feature or product, execute the Dominicode Spec-Driven Development flow: produce `spec.md`, `plan.md` and `tasks.md` (with TDD) under `specs/<feature-slug>/`.

## When to activate this flow

Activate the SDD flow at the **start** of any non-trivial coding work, even if the user did not say the word "spec". Signals:

- Phrases like "I want to build...", "let's make an app for...", "design X", "scaffold...", "start an MVP of..."
- A feature description without prior planning artifacts
- A request that touches more than one module, layer, or screen
- A request that would normally generate >100 lines of code

**Do not** activate for:
- Bug fixes with a clear repro
- Small refactors in a single file
- Pure questions ("how does X work?")
- Continuing work where `specs/<name>/spec.md` already exists → read it instead

---

## Hybrid workflow

### Step 0 — Detect the context level

| Level | Signal | Action |
|-------|-------|--------|
| **HIGH** | Detailed PRD, ticket, or 3+ paragraphs | Full draft + "Open questions" list |
| **MEDIUM** | 1–2 sentences with a clear goal | Draft with `[NEEDS CONFIRMATION: ...]` on unknowns |
| **LOW** | "I want to make an app for X" | Interview the user **one section at a time** — do NOT dump all 6 questions at once |

Tell the user which mode you detected before starting.

### Step 1 — Choose the feature slug

Ask for or infer a kebab-case name (e.g. `invoice-generator`). All artifacts go under `specs/<feature-slug>/`.

### Step 2 — Write `spec.md` (6 sections, in order)

Use the template at `templates/spec.md`. Strict rules:

1. **Vision** — Maximum 2 sentences. If it doesn't fit, the idea is not clear yet.
2. **Users** — Concrete actions per role, not marketing personas. Format: `User [role]: action 1, action 2, action 3`.
3. **Features** — Phrases like `The user can ...` / `The system allows ...`. Organized by module. **Non-negotiable.**
4. **Flows** — 3–5 main actions with exact steps. **Every flow must include at least one error/failure path.**
5. **Architecture** — If the user has no preference, write `To be decided with the agent` and propose 2–3 stacks with trade-offs in `plan.md`. Don't silently invent one.
6. **NFRs** — Minimum: performance, security, scalability, language. Add more if relevant.

**Stop and ask the user to confirm before continuing.**

### Step 3 — Write `plan.md`

Template at `templates/plan.md`. Covers: final stack with rationale, data model, contracts (API or components), external dependencies, risks + mitigations, build order.

**Confirm with the user before moving to Step 3.5.**

### Step 3.5 — Verify the test runner (gate before TDD)

**Without a working test runner there is no TDD.** Before writing `tasks.md`, verify that the project has a test runner — or that installing one is the first task.

Inspect the project root (or ask the user if you have no filesystem access):

1. **Detect ecosystem**: `package.json` → Node, `pyproject.toml`/`requirements.txt` → Python, `Cargo.toml` → Rust, `go.mod` → Go, `Gemfile` → Ruby, `pom.xml`/`build.gradle` → Java/Kotlin, `composer.json` → PHP, `pubspec.yaml` → Dart, `*.csproj` → .NET.
2. **Look for an installed runner** in the manifest's dev dependencies AND test files/folders (`tests/`, `__tests__/`, `*.test.*`, `*_test.go`, `spec/`, etc).
3. **Classify**:
   - **A. Runner installed + tests exist** → use it. Don't propose another.
   - **B. Runner installed but no tests yet** → use it; the first 🔴 task creates the test scaffold.
   - **C. Project exists but no runner** → **stop**. Propose the ecosystem default (Vitest for Node-TS, pytest for Python, RSpec for Ruby, JUnit 5 for Java, xUnit for .NET — `cargo test` and `go test` are built-in). Confirm with the user. Setup tasks go in Phase 0 of `tasks.md`.
   - **D. Greenfield** → the runner must already be decided in `plan.md` § "Final stack → CI / Tests". If not, go back and close it before continuing.
   - **E. User refuses to have tests** → **the skill does not apply.** Be honest with the user: SDD without TDD is half the methodology. Offer the fallback: produce `spec.md` + `plan.md` and skip `tasks.md`. Don't silently switch to non-TDD tasks.

Tell the user the result in one sentence before proceeding to Step 4 ("Detected pytest in `pyproject.toml`, using it" / "No runner found — proposing Vitest, please confirm").

Full detail and per-ecosystem matrix in `references/test-runner-detection.md`.

### Step 4 — Write `tasks.md` (TDD)

Template at `templates/tasks.md`. For each feature in Section 3:

1. ⚙️ Setup (if needed)
2. 🔴 Red — failing test
3. 🟢 Green — minimal implementation
4. 🔵 Refactor (optional, only if it adds clarity)
5. 🔗 Integration (when it crosses modules or closes a module)

Full detail and anti-patterns in `references/tdd-workflow.md`.

### Step 5 — Hand off

Tell the user that:
1. The 3 files are in `specs/<feature-slug>/`
2. To implement, execute the first unchecked task in `tasks.md`, nothing else
3. If a task surfaces a missing spec decision: update `spec.md` first, don't paper over it in code

---

## Output structure

```
specs/
└── <feature-slug>/
    ├── spec.md
    ├── plan.md
    └── tasks.md
```

If `specs/<feature-slug>/` already exists, **read it first** and propose changes rather than overwriting.

---

## Hard rules

- ❌ Never write implementation code in the same turn that the spec is created
- ❌ Never skip Section 1 (Vision) or accept a Vision longer than 2 sentences
- ❌ Never write a flow with only the happy path
- ❌ Never silently pick a stack if the user gave no preference
- ❌ Never write a Green task before its Red task
- ❌ Never skip Step 3.5 (test runner verification) — without a runner there is no TDD
- ✅ Confirm with the user between Step 2, Step 3, Step 3.5, and Step 4
- ✅ If implementation reveals a gap: update `spec.md` → `plan.md` → `tasks.md` → then code

---

## Referenced resources

- `templates/spec.md` — the 6-section spec template
- `templates/plan.md` — technical plan template
- `templates/tasks.md` — TDD task list template
- `references/examples.md` — fully worked example
- `references/tdd-workflow.md` — TDD detail and anti-patterns
- `references/test-runner-detection.md` — how to verify the test runner, defaults per ecosystem, smoke test

Load them only when needed (progressive disclosure), not all at once.

---

*Skill by **Bezael Pérez · Dominicode** — Build with AI: From Idea to Product with Claude and Specs.*
