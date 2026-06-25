# Codebase inspection — grounding the spec in the real project

> **A spec written in a vacuum proposes a stack the project doesn't use.** Before writing `spec.md`, look at what already exists. The goal is not to redesign the project — it's to make sure the spec and plan *fit* the project they will live in.

This is run as **Step 0.5**, right after detecting the context level and before choosing the slug. It is broader than the test-runner check (`references/test-runner-detection.md`), which is now a subset of it: Step 0.5 gathers the raw facts once, and Step 3.5 reuses them to **confirm** the runner instead of re-scanning.

If you have filesystem access (Claude Code, Cursor, Codex), inspect the files. If not (Claude.ai web, a pasted system prompt), ask the user the same questions and proceed with what they tell you.

---

## What to read

### 1. The stack already in use

Detect the ecosystem from the root manifest (full table in `references/test-runner-detection.md` § "Detect the ecosystem"): `package.json` → Node/TS, `pyproject.toml`/`requirements.txt` → Python, `Cargo.toml` → Rust, `go.mod` → Go, `Gemfile` → Ruby, `pom.xml`/`build.gradle` → Java/Kotlin, `composer.json` → PHP, `pubspec.yaml` → Dart, `*.csproj` → .NET.

Then read the manifest's dependencies to learn what the project **already committed to** — these are decisions you must respect, not re-open:

- **Framework / runtime** — e.g. `next`, `react`, `express`, `fastapi`, `django`, `axum`, `rails`, `spring-boot`.
- **Database / ORM client** — e.g. `@supabase/supabase-js`, `prisma`, `drizzle-orm`, `pg`, `mongoose`, `sqlalchemy`, `diesel`.
- **Auth** — e.g. `@clerk/*`, `next-auth`, `@supabase/auth-helpers`, `passport`, `devise`.
- **Test runner** — see `references/test-runner-detection.md` (this is the data Step 3.5 will confirm).
- **Lint / format / typecheck** — `eslint`, `biome`, `prettier`, `ruff`, `tsconfig.json` strictness.
- **Config files** that pin a host or platform — `vercel.json`, `netlify.toml`, `Dockerfile`, `fly.toml`, `serverless.yml`.

### 2. Conventions

- **Folder structure** — `src/`, `app/`, `lib/`, `packages/` (monorepo?), feature-folders vs layer-folders.
- **Naming** — kebab vs camel for files, how existing modules are named (mirror it in `tasks.md` file paths).
- **Language** — comments and identifiers in English or Spanish (match Section 6 of the spec to reality).

### 3. Prior specs (project memory)

Read `specs/INDEX.md` if it exists (template: `templates/specs-index.md`):

- **Shared decisions** — reuse these instead of re-deciding. If the index says `Database: Supabase Postgres`, the new spec inherits it unless there's a concrete reason to diverge (state the reason if so).
- **Specs table** — scan for a feature **related** to this request. If you find one, the request may be an extension of an existing spec, not a new one. Surface it: *"This looks related to `user-auth` — extend that spec, or start a new one?"*
- If `specs/INDEX.md` does not exist but `specs/<slug>/` folders do, `grep`/`Glob` across `specs/**/spec.md` for overlapping vocabulary as a fallback recall (this is the zero-dependency stand-in for semantic search — a curated small index plus text search, no embeddings).

---

## The Project Context Snapshot

Compress what you found into **one short paragraph** and state it to the user before Step 1. Template:

> **Project Context Snapshot:** [ecosystem + framework detected, e.g. "Next.js 14 + TypeScript app"]. Already uses [key deps, e.g. "Supabase (DB + Auth), Tailwind"]. Test runner: [e.g. "Jest installed with tests in `__tests__/`"]. Conventions: [e.g. "feature-folders under `src/features/`, English identifiers"]. Existing specs: [e.g. "`user-auth` (active) looks related"]. — I will anchor the architecture on this; flag if you want to diverge.

For a greenfield or no-filesystem case:

> **Project Context Snapshot:** greenfield — no existing manifest or specs detected. Stack will be proposed from scratch in `plan.md` with trade-offs and confirmed with you.

---

## How the snapshot feeds the rest of the flow

| Snapshot fact | Where it lands |
|---|---|
| Framework / runtime in use | `spec.md` Section 5 and `plan.md` §1 **anchor on it** — don't propose an alternative silently |
| DB / Auth in use | reused as defaults; if `specs/INDEX.md` has them under Shared decisions, cite that |
| Test runner installed | carried into **Step 3.5**, which now *confirms* rather than re-scans |
| Conventions (folders, naming) | `tasks.md` file paths mirror them |
| Related prior spec | offered to the user as "extend vs new" before Step 1 |

---

## Rules

- ✅ **Anchor, don't override.** If the project uses Jest, the spec uses Jest. If you believe a different choice is better, say so explicitly and let the user decide — never swap it silently. (Same rule as `test-runner-detection.md`, generalized to the whole stack.)
- ✅ **Reuse shared decisions.** A choice already in `specs/INDEX.md` is the default for the new spec; diverging requires a stated reason.
- ✅ **Surface related specs.** Duplicating an existing spec is the failure mode this step exists to prevent.
- ❌ **Never let inspection block a greenfield project.** No manifest is a valid, common state — say "greenfield" and move on; the stack gets decided in `plan.md`.
- ❌ **Never invent facts about the project.** If you can't read the filesystem, ask — don't assume a stack.
