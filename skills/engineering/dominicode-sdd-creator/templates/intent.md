# Intent — [Short name of the idea]

> Dominicode SDD template (Bezael Pérez). Adapted from the `intent.md` artifact in Anthropic's *AI-Native SDLC Playbook*.
> The idea in the originator's own words, **before** any spec. It captures what is wanted, why, and under which constraints, not how to build it.
> Short on purpose: if it runs past one screen, it's already a spec.

```yaml
author: [who had the idea]
date: [YYYY-MM-DD]
origin: idea | issue | incident | follow-up   # follow-up: out-of-scope finding from another spec
from: [issue URL, incident ID, or `other-slug` — omit for a plain idea]
status: draft   # draft → accepted (starts spec.md) | rejected (reason below)
```

---

## Problem

> What can't be done today, or what hurts. In plain words, with a number if there is one. No solution yet.

[Write here]

## Proposed outcome

> What "better" looks like from the user's side. Observable, not technical.

[Write here]

## Affected users and systems

> Who notices the change, and what existing parts of the product it touches.

- Users: [roles]
- Systems: [modules, services, APIs]

## Constraints

> What the solution must respect: existing auth, data that can't leave, budget, deadline, stack already decided.

- [constraint]

## Out of scope

> What this idea is **not**, so the spec doesn't grow into it.

- [item]

## Open questions

> What nobody knows yet. Each one gets answered in `spec.md` or carried forward there, never dropped.

- [question]

---

## Decision

> Filled by whoever accepts or rejects the idea. An accepted intent is what starts `spec.md`.
> The status itself lives only in the YAML header above; this section records who decided, when, and why.

- By / date: [name, YYYY-MM-DD]
- Reason (if rejected): [one line]
