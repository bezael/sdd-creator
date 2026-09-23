# Spec: {{TITLE}}

> The contract (CBRM light contract). Sign it **before** writing code.
> For small Issues only: a bug with a clear repro or a single-file change.
> If it does not fit on two pages, the task is too large: use the full SDD spec instead.

**Issue:** {{ISSUE_LINK}}
**Date:** {{DATE}}

## What is wanted

{{Two or three sentences. The observable result, not the implementation.}}

## What is out of scope

{{What someone might assume is included but is not. This section prevents
80% of unnecessary code. If it is empty, you have not thought hard enough.}}

## Acceptance criteria

Each criterion needs a command that proves it. A criterion that cannot be
verified with a command is an opinion, and opinions are reviewed manually —
which is exactly what we are trying to avoid.

| # | Criterion | How it is verified |
|---|-----------|--------------------|
| 1 | {{Observable behavior}} | `{{command}}` |
| 2 | {{Observable behavior}} | `{{command}}` |
| 3 | {{Observable behavior}} | `{{command}}` |

## Change scope

The files expected to be touched. This list narrows the lane in `AGENTS.md` for this task:
if the agent needs to leave it, stop and ask.

- `{{path}}`
- `{{path}}`

## Risks

{{What could break that works today, and which harness command would detect it.
If the answer is "none would detect it," you have found a harness gap.}}

---

## Verdict

> Fill this in when finished. This is what you read instead of the diff.

Status: PASS | CHANGES REQUIRED
Alignment: Exact | Tangling | Missing | Missing and Tangling

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | | | |
| 2 | | | |
| 3 | | | |

**Long loop:** {{summarized output}}
**Out-of-scope changes:** {{none / list with justification}}
