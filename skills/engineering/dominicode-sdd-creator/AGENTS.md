# AGENTS.md — Dominicode SDD Creator

> Mirror version of `SKILL.md` for agents that adopt the [AGENTS.md](https://agents.md) standard: Codex CLI, Cursor, Gemini CLI, Aider, Continue, and others. Equivalent content, without the Anthropic-specific YAML frontmatter.
>
> SDD adaptation by **Bezael Pérez · Dominicode**.

---

## Purpose

This file instructs the agent to run the complete Dominicode Spec-Driven Development lifecycle for non-trivial work: Understand → Spec → Plan → Tasks → Implement → Verify (Fix → Verify on failure) → Code Review → Final Verify → PR / Handoff.

The durable sources of truth remain `spec.md`, `plan.md` and `tasks.md`. Evidence and review prove completion; `.work/implementation.md` remains disposable scratch.

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

Use the template at `templates/spec.md`. If the feature comes from a GitHub Issue, preserve repository, issue number and URL in the optional `source` block, then express the accepted requirements in the six sections. A link does not replace the spec. Strict rules:

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
   - **E. The user explicitly asked for no tests** → **no-TDD mode** (degraded). See the gate below. Cases A–D are the only outcomes you may reach on your own; E is reached **only** because the user asked for it.

Tell the user the result in one sentence before proceeding to Step 4 ("Detected pytest in `pyproject.toml`, using it" / "No runner found — proposing Vitest, please confirm").

Full detail and per-ecosystem matrix in `references/test-runner-detection.md`.

#### Case E gate — no-TDD mode

No-TDD mode is **opt-in by the user and by nobody else.** Three conditions, all required:

1. **The user said it, in their own words, unprompted** — "no quiero tests", "sin tests", "skip the tests", "don't write tests". If the words never appeared, the mode does not exist.
2. **You never offered it.** Do not mention it as an option, do not list it among alternatives, do not hint at it when the project has no runner. Case C is "propose a runner", not "propose skipping tests".
3. **You never inferred it.** Not from `hazlo rápido`, `es un prototipo`, `no hay tiempo`, `es solo una demo`, not from silence, and not from a repo with no runner. Speed pressure is not a request to drop tests.

When all three hold:

- **Separate "not now" from "never" with one question.** If the user means *not yet* (prototype, spike, deadline), that is **not** case E — stay in TDD mode, keep the runner in Phase 0, offer to defer the 🔴 tasks.
- **State the cost once**, in one sentence, without moralizing: no regression detection, no confident refactoring, every criterion verified by hand.
- **Ask for one explicit confirmation.** Hedged or ambiguous answer → you stay in TDD mode.
- Record the decision and its date in `plan.md` § "Final stack → CI / Tests" — that section is closed with "no tests, requested by the user on [date]", never left blank.

### Step 4 — Write `tasks.md` (TDD)

> **Branch:** with case E confirmed, use `templates/tasks-no-tdd.md` and follow Step 4-bis. Otherwise continue here — the default, and the only mode you may choose by yourself.

Template at `templates/tasks.md`. For each feature in Section 3:

1. ⚙️ Setup (if needed)
2. 🔴 Red — failing test
3. 🟢 Green — minimal implementation
4. 🔵 Refactor (optional, only if it adds clarity)
5. 🔗 Integration (when it crosses modules or closes a module)

Full detail and anti-patterns in `references/tdd-workflow.md`.

Every task that changes observable behavior, code, configuration or data uses a stable `TASK-XX` ID and an explicit completion contract: Criterion, Files, Verify, Done when and Evidence. Never check a task because the implementer claims it is finished; execute the stated test, lint, typecheck, build, command, query, HTTP request, observable behavior or precise manual check first. TDD stays the default where it adds value.

Initialize `tasks.md` with `Status: Not Started`. Change it to `In Progress` when the first implementation task is actually attempted. Use `Completed` only after every required task has PASS evidence, the Coverage Matrix has no orphans, Code Review has no blockers and Final Verification is PASS.

**Before hand-off — fill the coverage matrix.** At the end of `tasks.md`, build the `## Coverage matrix`: one row per Section 3 feature → its `plan.md` contract/entity → the task IDs that build and test it. If any feature has no task, it is an **orphan** — the task list is not done; close the gap before Step 5. See `references/traceability.md`.

### Step 4-bis — `tasks.md` in no-TDD mode (only after the Case E gate)

Template at `templates/tasks-no-tdd.md`. Same spec, same plan, same build order, same coverage matrix — the tests are replaced by written manual verifications, nothing else is dropped.

1. ⚙️ Setup (if needed)
2. 🔨 Build — implement the feature, carrying its criterion from `spec.md §3`
3. ✅ Verify — the manual check of that criterion, written as **Given / When / Then**, with a line to record the result
4. 🔵 Refactor — only if it adds clarity, and it re-runs every ✅ of the touched module
5. 🔗 Integration check — manual, when it crosses modules

Rules for this mode:

- **Never use 🔴 or 🟢** — those emojis mean "there is a test"
- **Every criterion still gets a ✅**, error paths from Section 4 included
- **Given / When / Then, concrete enough to execute without thinking** — that is what makes each ✅ convertible into a 🔴 later, one-to-one
- **Keep the banner** at the top with the date and who asked for the mode
- **The coverage matrix is still mandatory** (task column reads 🔨/✅), and a checked 🔨 whose ✅ never ran counts as an orphan
- Phase 0 has no runner: lint, typecheck and a boot smoke check become mandatory instead

### Step 5 — Implement, verify and close the lifecycle

**Gate before hand-off:** the coverage matrix is filled and has **no orphan features** (every Section 3 bullet traces to a task), and Section 4 flows + measurable Section 6 NFRs have their tasks. If not, don't hand off — close the gap first.

**Update project memory.** Create or update `specs/INDEX.md` (from `templates/specs-index.md` if it doesn't exist yet): add or refresh this spec's row and shared decisions. Once `tasks.md` exists, its status is canonical and the index mirrors `not started`, `in progress` or `completed`. In no-TDD mode, append `· no-TDD`.

Then tell the user that:
1. The 3 files are in `specs/<feature-slug>/`, and `specs/INDEX.md` is updated
2. The options to start implementation:
   - **Turn-based (Paso a Paso):** Tell you (or the next agent run) to pick a specific unchecked task in `tasks.md` and execute it (e.g. "Implementa la tarea T1").
   - **Autonomous Loop (Bucle Autónomo):** Use the host agent's loop/goal capability, when available, to implement pending tasks and stop only when verification passes.
3. If a task surfaces a missing spec decision: update `spec.md` first, don't paper over it in code

**In no-TDD mode, the hand-off changes:**

4. 🔨 and ✅ are one unit — a Build task is not done until its Verify has been **run**, not read
5. **An autonomous loop cannot close a human-only ✅.** With no tests, the most it can prove automatically is lint + typecheck + boot. Recommend turn-based; otherwise automation must stop at 🔨 tasks and leave human-only checks for a person.
6. The upgrade path at the end of `tasks.md` converts every ✅ into a 🔴 if a runner is added later

#### Ephemeral implementation plan (`.work/`)

The three SDD artifacts document **decisions**; execution deserves a plan too — but a disposable one. At the start of each implementation session, before touching code:

1. Create `specs/<feature-slug>/.work/implementation.md` from `templates/implementation.md`: which tasks from `tasks.md` this session covers, files to touch in attack order, execution order, and the exact test command.
2. Ensure `specs/**/.work/` is in the project's `.gitignore` — add it if missing. This file is agent scratch, **never committed**: if persisted it goes stale and starts competing with `plan.md` as a source of truth.
3. Granularity: one per **session or module/phase**, never per 🔴→🟢→🔵 micro-task. Skip it for trivial tasks — the task entry already says what to do.
4. **Reflow rule:** if planning execution surfaces a durable decision (spec gap, missing contract, new risk), update `spec.md` → `plan.md` → `tasks.md` first, then regenerate the ephemeral plan.

The benefit: the plan survives context compaction within the session, and is cheap to regenerate in the next one because it derives from `tasks.md`.

### Implement → Verify → Fix

For each pending task, read Criterion, Files, Verify and Done when; set status to `In Progress` when implementation actually starts; implement only that scope; execute Verify; and record evidence before checking it off. On FAIL, leave it unchecked and keep `In Progress`, diagnose, apply the smallest in-scope fix and run the same Verify again. If the failure reveals a durable requirement or architecture gap, stop and reflow `spec.md` → `plan.md` → `tasks.md`, then regenerate `.work/implementation.md`. Full rules: `references/verification-loop.md`.

### Code Review

Review the source Issue when present, `spec.md`, `plan.md`, `tasks.md`, the real implementation diff, tests and verification results. Review in this order: requirements compliance, correctness, security, performance, tests, maintainability. The reviewer must be conceptually independent from the implementer. Use `references/code-review.md` and resolve blockers before the final gate.

### Final Verify

Before PR/handoff, follow `references/final-verification.md`: recheck previously passed evidence that later work may have invalidated; run every applicable test, integration/E2E, lint, typecheck, build and NFR check; confirm all acceptance criteria are covered, the Coverage Matrix has no orphans and review has zero Critical blockers. Only then set `tasks.md` to `Completed` and mirror it in `specs/INDEX.md`.

### PR / Handoff

Only after Final Verification is PASS, create or hand off the Pull Request with the source Issue, SDD artifacts, concise evidence and review result linked. GitHub automation is optional. The methodology must remain usable in Claude Code, Codex, Gemini, Cursor and other agents without depending on host-specific syntax.

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
- ❌ **Never propose, offer, hint at, or infer no-TDD mode** — it activates only when the user asks for it in their own words
- ❌ Never silently drop the TDD emojis: a `tasks.md` without 🔴/🟢 must carry the no-TDD banner saying who asked for it and when
- ❌ Never drop an acceptance criterion or the coverage matrix in no-TDD mode — the criteria survive, only their verification changes hands
- ❌ Never hand off with an orphan feature — every Section 3 feature must trace to a task in the coverage matrix
- ❌ Never commit `.work/` — the ephemeral implementation plan is agent scratch, not documentation
- ❌ Never mark a task complete without executing Verify and recording evidence
- ❌ Never set status to `Completed` from checkbox count or implementer assertion alone
- ❌ Never use review or final verification as a competing requirements source
- ✅ Confirm with the user between Step 2, Step 3, Step 3.5, and Step 4
- ✅ Always update `specs/INDEX.md` at hand-off and reuse its Shared decisions instead of re-deciding them
- ✅ If implementation reveals a gap: update `spec.md` → `plan.md` → `tasks.md` → then code — a durable decision must never live only in `.work/implementation.md`
- ✅ Review the real diff against the Issue/spec/plan/tasks and current evidence
- ✅ Recheck applicable previously passed evidence during Final Verify before PR/handoff
- ✅ Keep `tasks.md` status and the corresponding `specs/INDEX.md` row synchronized
- ✅ Always present Turn-based and Autonomous Loop options at implementation hand-off, treating host-specific commands as optional examples.

---

## Referenced resources

- `templates/spec.md` — the 6-section spec template
- `templates/plan.md` — technical plan template
- `templates/tasks.md` — TDD task list template (includes the coverage matrix) — **the default**
- `templates/tasks-no-tdd.md` — degraded task list: manual Given/When/Then verifications instead of tests. Only after the Case E gate
- `templates/implementation.md` — ephemeral implementation plan template (gitignored, per session)
- `templates/specs-index.md` — project memory index template (`specs/INDEX.md`: shared decisions + specs table)
- `references/examples.md` — fully worked example
- `references/codebase-inspection.md` — how to ground the spec in the existing project (Step 0.5): what to read per ecosystem, the snapshot, the no-conflicting-stack rule
- `references/tdd-workflow.md` — TDD detail and anti-patterns
- `references/test-runner-detection.md` — how to verify the test runner, defaults per ecosystem, smoke test, full Case E protocol
- `references/traceability.md` — the coverage matrix method (spec §3 → plan → tasks) and the hand-off gate
- `references/verification-loop.md` — evidence-based completion, Fix/retry and reflow rules
- `references/code-review.md` — requirements-first review using artifacts, diff and results
- `references/final-verification.md` — final regression gate before PR/handoff

Load them only when needed (progressive disclosure), not all at once.

---

*Skill by **Bezael Pérez · Dominicode** — Build with AI: From Idea to Product with Claude and Specs.*
