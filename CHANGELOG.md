# Changelog

All notable changes to this project, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [SemVer](https://semver.org/).

## [Unreleased]

## [1.5.0] - 2026-08-14

### Added

- **No-TDD mode (case E), opt-in only:** a user who explicitly asks for no tests now gets a complete, executable task list instead of being left with `spec.md` + `plan.md` and nothing to run. New template `templates/tasks-no-tdd.md`: each Section 3 criterion becomes a 🔨 Build task paired with a ✅ Verify task written as **Given / When / Then**, with a line to record the result. Phase 0 replaces the runner with lint + typecheck + boot smoke — the only automated signals left. The file carries a banner with the date and the fact that the user requested it.
- **Case E gate (Step 3.5) — three conditions, all required:** the user says it in their own words, unprompted; the agent never offers the mode; the agent never infers it from `hazlo rápido`, `es un prototipo`, a deadline, or a repo with no runner. Plus one mandatory question separating *"not now"* (stay in TDD, defer the 🔴 tasks) from *"never"* (case E), the cost stated once without moralizing, and a single explicit confirmation — anything hedged keeps TDD. Full protocol in `references/test-runner-detection.md` § "Case E".
- **Step 4-bis** in `SKILL.md` and `AGENTS.md`: how to write the degraded task list, plus the hand-off note that an autonomous `/goal` loop **cannot close a ✅** — its stop condition is "all tests pass" and there are none, so turn-based is the recommendation.
- **Upgrade path** at the end of `tasks-no-tdd.md`: every ✅ converts 1:1 into a 🔴 (Given = fixture, When = call, Then = assertion) without rewriting the spec. The 🔴 tasks that don't go green immediately are the bugs shipped while there were no tests.

### Changed

- **Case E stops being an exit and becomes a mode.** Until now it declared the skill inapplicable and dropped `tasks.md` entirely, which pushed the user into improvising exactly the execution this methodology exists to prevent. The acceptance criteria now survive; only who verifies them changes.
- **The coverage matrix still gates hand-off in no-TDD mode** (task column reads 🔨/✅) and gains one rule: a checked 🔨 whose ✅ was never run is also an orphan. With no runner, that matrix is the only completeness signal left. Reflected in `references/traceability.md`.
- `specs/INDEX.md` rows carry a `· no-TDD` marker on their status, so project memory remembers which specs shipped without a safety net.
- `templates/plan.md` § "Stack final → CI / Tests" accepts `none — no tests, requested by the user on [date]` as the only alternative to a runner: a recorded decision, never a blank.
- Three new hard rules in `SKILL.md` and `AGENTS.md`: never propose/offer/infer the mode, never ship a `tasks.md` without 🔴/🟢 and without the banner, never drop a criterion or the coverage matrix.

## [1.4.0] - 2026-07-14

### Added

- **Loop execution option:** The user can now choose between **Turn-based (Paso a Paso)** and **Autonomous Loop (Bucle Autónomo)** execution strategy for implementing tasks.
- **Plan strategy mapping:** Added the `Execution strategy` section in `plan.md` (Step 3) to explicitly document this choice.
- **Handoff choice:** Modified Step 5 (Hand-off) in `SKILL.md` and `AGENTS.md` to recommend `/goal` command for autonomous execution.

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
