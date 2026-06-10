---
name: release-announcer
description: Generate ready-to-publish announcement messages (an X/Twitter thread or single tweet + a LinkedIn post, written in Spanish) for a new release of this project, based on its CHANGELOG.md. Use this skill whenever the user is about to ship, publish, or announce a new version — phrases like "nueva versión", "anuncia la versión", "genera el mensaje de la release", "saca el tweet de la nueva versión", "tengo una versión nueva", "mensaje del changelog", "announce the release", or "post about the new version". Reads the latest (or a specified) version section from CHANGELOG.md, turns the changes into benefit-led copy in the Dominicode voice, and NEVER invents changes that are not in the changelog.
---

# Release Announcer

This skill turns a **CHANGELOG entry** into copy that's ready to publish: a tweet / X thread and a LinkedIn post, both in **Spanish**, in the Dominicode voice.

It is a **project-local** skill (lives in `.claude/skills/`, not in the distributable plugin). It exists to announce new versions of **this** repo.

Methodology & voice by **Bezael Pérez · Dominicode**.

## The one rule that matters

**Every claim in the announcement must trace back to a real line in `CHANGELOG.md`** (or another source the user explicitly hands you). You summarize and reframe as benefits — you never invent features, fixes, or numbers.

## When to use this skill

Trigger when the user is about to communicate a new version. Signals:

- "anuncia la versión 1.2.0", "genera el mensaje de la release", "saca el tweet de la nueva versión"
- "tengo una versión nueva", "ya publiqué la v1.3", "mensaje para el changelog"
- "announce the release", "post about the new version", "release announcement"
- A new `## [x.y.z]` section was just added to `CHANGELOG.md`

Do **not** trigger for:
- Writing the changelog itself (that's a different task — though you can offer it as a prerequisite, see Step 2 fallback)
- Generic marketing copy unrelated to a version bump
- Sales emails or landing copy (those have their own skills)

## Output contract

By default produce, in this order:

1. **X / Twitter** — 3 short single-tweet variants (≤280 chars each): *directo/técnico*, *enfocado al problema*, *con recursos*. If the release is large (5+ meaningful highlights), also offer a numbered thread (`1/n`).
2. **LinkedIn** — one post: a one-line hook (the only thing visible before "ver más"), a short benefit-led body, and a single CTA.

All copy in **Spanish**. Show it in the chat ready to copy. Only write it to a file if the user asks (suggested path: `announcements/v<version>.md`).

## Workflow

### Step 1 — Resolve the target version

- If the user named a version, use it.
- Otherwise, target the **topmost released entry** in `CHANGELOG.md` (the most recent `## [x.y.z]`, ignoring `## [Unreleased]`).
- State which version you're announcing in one sentence before generating anything.

### Step 2 — Read the changes from `CHANGELOG.md`

Read `CHANGELOG.md` at the repo root and extract the section for the target version. The repo follows [Keep a Changelog](https://keepachangelog.com): categories are `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`. See `references/changelog.md` for parsing detail and the category→benefit mapping.

**If `CHANGELOG.md` does not exist or has no entry for the version:** stop and tell the user. Do not guess. Offer, in this order:
1. Derive a draft changelog from `git log <prev-tag>..<tag>` (or `<prev-tag>..HEAD`) and confirm it with the user **before** announcing.
2. Or ask the user to paste the 3–5 highlights of the release.

Never announce a version whose changes you cannot see.

### Step 3 — Turn changes into benefits

Don't paste raw changelog lines. Reframe each meaningful change as what the user *gains*:

- `Added: X` → "Ahora puedes X" / "Ya puedes X sin Y"
- `Changed: X` → "X ahora es más rápido/simple/claro"
- `Fixed: X` → "X ya no falla cuando…" (only if it was a visible pain)
- `Removed: X` → frame as simplification, not loss
- `Security: X` → mention plainly, no fear-mongering

Pick the **3 strongest** highlights. Drop internal/chore noise (CI tweaks, lint, dep bumps) unless they matter to users. If you dropped notable items, say so to the user.

### Step 4 — Write the copy

- Use the templates: `templates/tweet.md` and `templates/linkedin.md`.
- Apply the voice rules in `references/voice.md` (direct, anti-hype, short sentences, Spanish).
- Use the project links from `references/voice.md` **only in the "con recursos" variant** and in LinkedIn — keep the other tweet variants clean.
- Respect platform limits: ≤280 chars per tweet (count them); LinkedIn's first line is the hook.

### Step 5 — Hand off

Present the variants and ask which to publish / refine. If the user wants it saved, write `announcements/v<version>.md` with the chosen copy. Offer to also update the root `tweet.md` if they keep using it as their scratchpad.

## Hard rules (never violate)

- ❌ Never state a change that isn't in `CHANGELOG.md` (or user-provided source)
- ❌ Never exceed 280 characters in a single tweet — count and trim
- ❌ Never dump raw changelog lines as the announcement — always reframe as benefit
- ❌ Never stuff every project link into every variant
- ❌ Never write the announcement in English — the output is Spanish (instructions here are English by repo convention)
- ✅ Always state which version you're announcing first
- ✅ Always confirm a derived/git-log changelog with the user before announcing it
- ✅ Always tell the user if you dropped highlights to fit

## Resources

- `templates/tweet.md` — X/Twitter single-tweet variants + thread skeleton (Spanish)
- `templates/linkedin.md` — LinkedIn post structure (Spanish)
- `references/changelog.md` — how to parse `CHANGELOG.md`, category→benefit mapping, no-changelog fallback
- `references/voice.md` — Dominicode voice rules + canonical project links

---

*Skill by **Bezael Pérez · Dominicode** — Spec first. Code after.*
