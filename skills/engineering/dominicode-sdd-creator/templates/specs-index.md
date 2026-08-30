# Specs Index — [Project Name]

> Dominicode SDD project memory. **One file, version-controlled, maintained by the agent.**
> Lives at `specs/INDEX.md`, above the per-feature folders. The agent reads it at Step 0.5 (to avoid duplicating work and to reuse decisions) and updates it at hand-off (Step 5).
> This file is **committed** — unlike `specs/**/.work/`, it is durable memory, not scratch.

---

## Shared decisions

> Project-wide technical choices that any new spec should reuse instead of re-deciding. Each row records the decision, a one-line rationale, and the spec where it was first made. Promote a decision here the moment a second feature would otherwise re-litigate it — including durable learnings surfaced by code review or final verification (decision confirmed or overturned, alternative rejected, risk materialized).

| Decision | Value | Rationale (1 line) | First decided in |
|----------|-------|--------------------|------------------|
| Database | [e.g. PostgreSQL on Supabase] | [why] | `[slug]` |
| Auth | [e.g. Supabase Auth] | [why] | `[slug]` |
| Test runner | [e.g. Vitest] | [why] | `[slug]` |
| Hosting | [e.g. Vercel] | [why] | `[slug]` |
| Language(s) | [e.g. English v1, Spanish v2] | [why] | `[slug]` |

> Add or remove rows freely. Only record decisions that are genuinely cross-cutting — a choice local to a single feature stays in that feature's `plan.md`.

---

## Specs

> One row per feature spec under `specs/`. `status` mirrors the lifecycle of the work, not the quality of the document.
> Before `tasks.md` exists, use **draft** for a spec that is not yet confirmed. Once tasks exist, mirror the canonical status from that feature's `tasks.md`: **not started**, **in progress**, or **completed**. Use **archived** only for abandoned or superseded work.
> Append `· no-TDD` when the spec uses no-TDD mode — e.g. `in progress · no-TDD`. The suffix does not change the status transition rules.

| Slug | Vision (1 line) | Status | Key stack | Related specs |
|------|-----------------|--------|-----------|---------------|
| `[feature-slug]` | [the Section 1 vision, compressed to one line] | not started | [e.g. Next.js + Supabase] | [`other-slug`, or `—`] |

---

*Maintained by the **dominicode-sdd-creator** skill (Bezael Pérez · Dominicode). Do not hand-edit during an active spec session — let the skill reconcile it at hand-off.*
