# Changelog

All notable changes to this project, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [SemVer](https://semver.org/).

## [Unreleased]

## [1.3.0] - 2026-06-10

### Added

- **Project grounding (Step 0.5):** before writing the spec, the agent inspects the existing project — stack in use, conventions and prior specs — and states a one-paragraph "Project Context Snapshot". Architecture proposals now anchor on what already exists instead of inventing a stack, and Step 3.5 *confirms* the test runner from this snapshot rather than re-scanning. New reference `references/codebase-inspection.md`.
- **Project memory (`specs/INDEX.md`):** a new committed index — a `Shared decisions` table (reusable cross-cutting choices) plus a per-spec table — maintained by the skill and read at Step 0.5 to avoid duplicating work and to reuse prior decisions. New template `templates/specs-index.md`. This is the zero-dependency, file-based stand-in for persistent semantic memory: no server and no embeddings, recall via the curated index plus `grep`/`Glob`.
- **Completeness validation (coverage matrix):** `tasks.md` now ends with a `## Coverage matrix` tracing every Section 3 feature → plan contract/entity → tasks, and hand-off is gated on having no orphan features. `plan.md` §7 reinforces the spec → plan half. New reference `references/traceability.md`.

### Changed

- `SKILL.md` and `AGENTS.md` gained Step 0.5, the pre-hand-off coverage gate and the `specs/INDEX.md` update at hand-off, three new hard rules, and the new resource links. Step 3.5 reworded to confirm the runner from the Step 0.5 snapshot.

## [1.2.0] - 2026-06-10

### Added

- Ephemeral implementation plan: new `templates/implementation.md` template plus Step 5 instructions in `SKILL.md` and `AGENTS.md`. At the start of each implementation session, the agent writes `specs/<feature>/.work/implementation.md` (gitignored, disposable) with the session's tasks, files to touch, execution order and test command. Includes the reflow rule: every durable decision goes back to `spec.md`/`plan.md`/`tasks.md`.
- Project-local `release-announcer` skill: generates the announcement copy for each release (X thread + LinkedIn post, in Spanish) from `CHANGELOG.md`, never inventing changes.

### Changed

- Attribution corrected across all documentation: SDD is an industry methodology; this repo distributes the **Dominicode adaptation** by Bezael Pérez. Credits change from "Methodology by" to "SDD adaptation by".

## [1.1.0] - 2026-05-24

### Added

- Spanish README (`README.es.md`).

### Changed

- All skill documentation translated to English (`SKILL.md`, `AGENTS.md`, templates and references); `CLAUDE.md` expanded.

## [1.0.0] - 2026-05-22

### Added

- Initial release: repo restructured as an installable plugin collection (`npx skills@latest add bezael/sdd-creator` + Claude Code plugin) with the `dominicode-sdd-creator` skill, which generates `spec.md` + `plan.md` + `tasks.md` (TDD) before writing any code.
