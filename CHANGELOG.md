# Changelog

Todas las novedades de este proyecto, siguiendo [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) y [SemVer](https://semver.org/).

## [Unreleased]

## [1.2.0] - 2026-06-10

### Added

- Plan de implementación efímero: nuevo template `templates/implementation.md` e instrucciones en el Step 5 de `SKILL.md` y `AGENTS.md`. Al empezar cada sesión de implementación, el agente escribe `specs/<feature>/.work/implementation.md` (gitignored, desechable) con las tareas de la sesión, archivos a tocar, orden de ejecución y comando de test. Incluye regla de reflujo: toda decisión duradera vuelve a `spec.md`/`plan.md`/`tasks.md`.
- Skill local `release-announcer`: genera el anuncio de cada release (hilo de X + post de LinkedIn, en español) a partir del `CHANGELOG.md`, sin inventar cambios.

### Changed

- Atribución corregida en toda la documentación: SDD es una metodología de la industria; este repo distribuye la **adaptación de Dominicode** (Bezael Pérez). Los créditos pasan de "Methodology by" a "SDD adaptation by".

## [1.1.0] - 2026-05-24

### Added

- README en español (`README.es.md`).

### Changed

- Toda la documentación del skill traducida al inglés (`SKILL.md`, `AGENTS.md`, templates y references) y `CLAUDE.md` ampliado.

## [1.0.0] - 2026-05-22

### Added

- Versión inicial: repo reestructurado como colección de plugins instalable (`npx skills@latest add bezael/sdd-creator` + plugin de Claude Code) con el skill `dominicode-sdd-creator`, que genera `spec.md` + `plan.md` + `tasks.md` (TDD) antes de escribir código.
