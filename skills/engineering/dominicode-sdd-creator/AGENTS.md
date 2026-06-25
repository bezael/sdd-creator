# AGENTS.md — Dominicode SDD Creator

> Mirror version of `SKILL.md` for agents that adopt the [AGENTS.md](https://agents.md) standard: Codex CLI, Cursor, Gemini CLI, Aider, Continue, and others. Equivalent content, without the Anthropic-specific YAML frontmatter.
>
> SDD adaptation by **Bezael Pérez · Dominicode**.

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

### Step 0.5 — Ground the spec in the project

A spec written in a vacuum proposes a stack the project doesn't use and re-decides things already decided. Before choosing a slug, look at what exists — so the spec *fits* the project it will live in. If you have filesystem access, inspect; if not, ask the user the same questions.

1. **Detect the stack already in use** — read the root manifest (`package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `Gemfile`, `pom.xml`/`build.gradle`, `composer.json`, `pubspec.yaml`, `*.csproj`) and its dependencies: framework/runtime, DB/ORM, auth, lint/format, and the test runner. These are commitments to **respect**, not re-open.
2. **Note conventions** — folder layout (`src/`, `app/`, feature- vs layer-folders), file naming, and whether identifiers/comments are English or Spanish.
3. **Read project memory** — if `specs/INDEX.md` exists, read its **Shared decisions** (reuse them) and scan the **Specs** table for a feature **related** to this request. If you find one, surface it: "this looks related to `<slug>` — extend that spec, or start a new one?". If there's no index but `specs/<slug>/` folders exist, `grep`/`Glob` across `specs/**/spec.md` as fallback recall.
4. **State a one-paragraph "Project Context Snapshot"** to the user (ecosystem + framework, key deps, test runner, conventions, related specs). For an empty project, say "greenfield — no existing stack detected; stack will be proposed in `plan.md`".

This snapshot anchors Architecture (spec Section 5 and `plan.md` §1) on what already exists, and pre-collects the facts that **Step 3.5 will confirm** rather than re-scan. See `references/codebase-inspection.md` for what to read per ecosystem and the no-conflicting-stack rule.

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

**Without a working test runner there is no TDD.** Before writing `tasks.md`, confirm the runner — or that installing one is the first task.

Use the test-runner facts already gathered in the **Step 0.5 snapshot** (re-inspect only if the snapshot is missing, or ask the user if you have no filesystem access):

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

**Before hand-off — fill the coverage matrix.** At the end of `tasks.md`, build the `## Coverage matrix`: one row per Section 3 feature → its `plan.md` contract/entity → the task IDs that build and test it. If any feature has no task, it is an **orphan** — the task list is not done; close the gap before Step 5. See `references/traceability.md`.

### Step 5 — Hand off

**Gate before hand-off:** the coverage matrix is filled and has **no orphan features** (every Section 3 bullet traces to a task), and Section 4 flows + measurable Section 6 NFRs have their tasks. If not, don't hand off — close the gap first.

**Update project memory.** Create or update `specs/INDEX.md` (from `templates/specs-index.md` if it doesn't exist yet): add or refresh this spec's row (slug, one-line vision, status, key stack, related specs) and promote any genuinely cross-cutting decision from `plan.md` into the **Shared decisions** table, citing this slug.

Then tell the user that:
1. The 3 files are in `specs/<feature-slug>/`, and `specs/INDEX.md` is updated
2. To implement, execute the first unchecked task in `tasks.md`, nothing else
3. If a task surfaces a missing spec decision: update `spec.md` first, don't paper over it in code

#### Ephemeral implementation plan (`.work/`)

The three SDD artifacts document **decisions**; execution deserves a plan too — but a disposable one. At the start of each implementation session, before touching code:

1. Create `specs/<feature-slug>/.work/implementation.md` from `templates/implementation.md`: which tasks from `tasks.md` this session covers, files to touch in attack order, execution order, and the exact test command.
2. Ensure `specs/**/.work/` is in the project's `.gitignore` — add it if missing. This file is agent scratch, **never committed**: if persisted it goes stale and starts competing with `plan.md` as a source of truth.
3. Granularity: one per **session or module/phase**, never per 🔴→🟢→🔵 micro-task. Skip it for trivial tasks — the task entry already says what to do.
4. **Reflow rule:** if planning execution surfaces a durable decision (spec gap, missing contract, new risk), update `spec.md` → `plan.md` → `tasks.md` first, then regenerate the ephemeral plan.

The benefit: the plan survives context compaction within the session, and is cheap to regenerate in the next one because it derives from `tasks.md`.

---

## Output structure

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

If `specs/<feature-slug>/` already exists, **read it first** and propose changes rather than overwriting. If `specs/INDEX.md` exists, read it at Step 0.5 and reconcile it at hand-off.

---

## Hard rules

- ❌ Never write implementation code in the same turn that the spec is created
- ❌ Never skip Section 1 (Vision) or accept a Vision longer than 2 sentences
- ❌ Never write a flow with only the happy path
- ❌ Never silently pick a stack if the user gave no preference
- ❌ Never propose a stack that conflicts with what the project already uses (per the Step 0.5 snapshot) without explicitly flagging it — anchor on what exists, don't override silently
- ❌ Never write a Green task before its Red task
- ❌ Never skip Step 3.5 (test runner verification) — without a runner there is no TDD
- ❌ Never hand off with an orphan feature — every Section 3 feature must trace to a task in the coverage matrix
- ❌ Never commit `.work/` — the ephemeral implementation plan is agent scratch, not documentation
- ✅ Confirm with the user between Step 2, Step 3, Step 3.5, and Step 4
- ✅ Always update `specs/INDEX.md` at hand-off and reuse its Shared decisions instead of re-deciding them
- ✅ If implementation reveals a gap: update `spec.md` → `plan.md` → `tasks.md` → then code — a durable decision must never live only in `.work/implementation.md`

---

## Referenced resources

- `templates/spec.md` — the 6-section spec template
- `templates/plan.md` — technical plan template
- `templates/tasks.md` — TDD task list template (includes the coverage matrix)
- `templates/implementation.md` — ephemeral implementation plan template (gitignored, per session)
- `templates/specs-index.md` — project memory index template (`specs/INDEX.md`: shared decisions + specs table)
- `references/examples.md` — fully worked example
- `references/codebase-inspection.md` — how to ground the spec in the existing project (Step 0.5): what to read per ecosystem, the snapshot, the no-conflicting-stack rule
- `references/tdd-workflow.md` — TDD detail and anti-patterns
- `references/test-runner-detection.md` — how to verify the test runner, defaults per ecosystem, smoke test
- `references/traceability.md` — the coverage matrix method (spec §3 → plan → tasks) and the hand-off gate

Load them only when needed (progressive disclosure), not all at once.

---

*Skill by **Bezael Pérez · Dominicode** — Build with AI: From Idea to Product with Claude and Specs.*
