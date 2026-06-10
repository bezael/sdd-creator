# AGENTS.md — Release Announcer

> Mirror of `SKILL.md` for agents that adopt the [AGENTS.md](https://agents.md) standard (Codex CLI, Cursor, Gemini CLI, Aider, Continue…). Same content, without the Anthropic-specific YAML frontmatter.
>
> Voice by **Bezael Pérez · Dominicode**. Project-local skill — announces new versions of *this* repo.

---

## Purpose

Turn a **CHANGELOG entry** into ready-to-publish announcement copy: a tweet / X thread and a LinkedIn post, both in **Spanish**, in the Dominicode voice.

## The one rule that matters

**Every claim in the announcement must trace back to a real line in `CHANGELOG.md`** (or a source the user explicitly provides). Summarize and reframe as benefits — never invent features, fixes, or numbers.

## When to activate

- "anuncia la versión 1.2.0", "genera el mensaje de la release", "saca el tweet de la nueva versión"
- "tengo una versión nueva", "mensaje para el changelog", "announce the release"
- A new `## [x.y.z]` section was just added to `CHANGELOG.md`

**Do not** activate for: writing the changelog itself, generic marketing copy, or sales/landing copy.

## Output contract

In this order, all copy in **Spanish**, shown ready to copy:

1. **X / Twitter** — 3 single-tweet variants (≤280 chars): *directo/técnico*, *enfocado al problema*, *con recursos*. Offer a numbered `1/n` thread if the release has 5+ highlights.
2. **LinkedIn** — one post: one-line hook + short benefit body + single CTA.

Only write to a file (`announcements/v<version>.md`) if the user asks.

## Workflow

1. **Resolve version** — use the one the user named, else the topmost released `## [x.y.z]` in `CHANGELOG.md` (skip `[Unreleased]`). State it first.
2. **Read changes** from `CHANGELOG.md` (Keep a Changelog format: Added/Changed/Deprecated/Removed/Fixed/Security). See `references/changelog.md`.
   - **No changelog / no entry?** Stop. Offer to (a) derive a draft from `git log <prev-tag>..<tag>` and confirm it before announcing, or (b) ask the user for 3–5 highlights. Never guess.
3. **Reframe as benefits** — `Added`→"Ahora puedes…", `Changed`→"… ahora más rápido/simple", `Fixed`→"… ya no falla cuando…", `Removed`→simplification, `Security`→plain mention. Pick the 3 strongest; drop chore/CI noise (and say so if you did).
4. **Write copy** with `templates/tweet.md` + `templates/linkedin.md`, applying `references/voice.md`. Project links only in the "con recursos" variant and LinkedIn. Respect ≤280 chars/tweet.
5. **Hand off** — present variants, refine, optionally save.

## Hard rules

- ❌ Never state a change absent from `CHANGELOG.md` / user source
- ❌ Never exceed 280 characters in a tweet
- ❌ Never dump raw changelog lines — reframe as benefit
- ❌ Never stuff every link into every variant
- ❌ Never write the announcement in English (output is Spanish)
- ✅ State the version first; confirm any git-log-derived changelog before announcing; report dropped highlights

## Referenced resources

- `templates/tweet.md` — X variants + thread skeleton
- `templates/linkedin.md` — LinkedIn post structure
- `references/changelog.md` — parsing + category→benefit mapping + fallback
- `references/voice.md` — voice rules + project links

Load them only when needed (progressive disclosure).

---

*Skill by **Bezael Pérez · Dominicode** — Spec first. Code after.*
