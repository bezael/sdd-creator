# Reference — Reading the CHANGELOG

The source of truth for an announcement is `CHANGELOG.md` at the repo root. This repo follows the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) convention.

## Expected structure

```markdown
# Changelog

## [Unreleased]

## [1.2.0] - 2026-06-10
### Added
- Nueva categoría devrel con la skill release-announcer.
### Changed
- README actualizado con el catálogo.
### Fixed
- Enlace roto en la sección de instalación.

## [1.1.0] - 2026-05-20
...
```

## How to extract the target version

1. Find the heading `## [x.y.z]` for the target version (the user's version, or the **topmost one that isn't `[Unreleased]`**).
2. Read every line until the next `## [` heading.
3. Group lines under their `### Category` subheading.
4. Note the date in the heading if present (useful for the post, not required).

> Tip with the file tools: `Grep` for `^## \[` to list all version headings and their line numbers, then `Read` the slice between the target heading and the next one.

## Category → benefit mapping

Reframe the raw line as what the reader *gains*. Never paste the raw line.

| Changelog category | How to frame it | Example |
|--------------------|-----------------|---------|
| **Added** | "Ahora puedes…" / "Ya puedes…" | `Added: export to PDF` → "Ya puedes exportar a PDF" |
| **Changed** | "… ahora más rápido / simple / claro" | `Changed: faster parser` → "El parseo ahora vuela" |
| **Deprecated** | Heads-up, sin alarmar | "X queda en desuso; usa Y a partir de ahora" |
| **Removed** | Simplificación, no pérdida | `Removed: legacy flag` → "Menos config: fuera el flag heredado" |
| **Fixed** | Solo si era un dolor visible | `Fixed: crash on empty input` → "Ya no peta con entrada vacía" |
| **Security** | Mención plana, sin miedo | "Parche de seguridad en la dependencia X" |

## Selecting highlights

- Pick the **3 strongest** for the short copy.
- **Drop internal noise** unless it affects users: CI changes, lint, formatting, dependency bumps without user impact, refactors.
- If you dropped something a reader might care about, tell the user ("dejé fuera el bump de deps por ruido; dímelo si lo quieres dentro").

## Fallback — no CHANGELOG.md (or no entry for the version)

**Stop. Do not invent changes.** Offer, in order:

1. **Derive from git** and confirm before announcing:
   - List tags: `git tag --sort=-v:refname`
   - Diff range: `git log <prev-tag>..<tag> --pretty=format:'%s'` (or `<prev-tag>..HEAD` if the tag isn't created yet).
   - Group the commit subjects into Added/Changed/Fixed, draft a `## [x.y.z]` block, and **show it to the user for confirmation**. Optionally offer to write it into `CHANGELOG.md`.
2. **Ask the user** to paste the 3–5 highlights of the release.

Only announce once you have a confirmed, real list of changes.
