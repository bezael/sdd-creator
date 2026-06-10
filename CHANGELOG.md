# Changelog

All notable changes to this project, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [SemVer](https://semver.org/).

## [Unreleased]

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
