# Test runner — detección y decisión

> **Sin runner de tests no hay TDD.** Antes de generar `tasks.md`, verifica si el proyecto tiene una herramienta de tests instalada y funcional. Si no la tiene, instalarla es la **primera tarea**, no algo que se hace "después".

---

## Protocolo de detección

Ejecuta este protocolo entre `plan.md` y `tasks.md`. Si estás en un agente con acceso a filesystem (Claude Code, Cursor, Codex), inspecciona los archivos. Si no, pídele al usuario que te diga qué hay.

### Paso 1 — Detectar el ecosistema

Mira la raíz del proyecto:

| Archivo | Ecosistema |
|---|---|
| `package.json` | Node / JavaScript / TypeScript |
| `pyproject.toml`, `requirements.txt`, `setup.py` | Python |
| `Cargo.toml` | Rust |
| `go.mod` | Go |
| `Gemfile` | Ruby |
| `pom.xml`, `build.gradle` | Java / Kotlin |
| `composer.json` | PHP |
| `pubspec.yaml` | Dart / Flutter |
| `*.csproj`, `*.sln` | C# / .NET |
| _(nada — proyecto vacío)_ | Greenfield → se decide en `plan.md` |

### Paso 2 — Buscar runner instalado

Para cada ecosistema, comprueba estas señales:

#### Node / JavaScript / TypeScript

En `package.json`, busca en `devDependencies` o `dependencies`:
- `vitest`, `jest`, `mocha`, `ava`, `tap`, `node --test` (Node 20+)
- E2E: `@playwright/test`, `cypress`, `webdriverio`
- React: `@testing-library/react`

Y un script en `package.json`:
```json
"scripts": { "test": "..." }
```

Carpetas/archivos típicos: `tests/`, `__tests__/`, `*.test.ts`, `*.spec.ts`.

#### Python

En `pyproject.toml` (sección `[tool.poetry.dev-dependencies]` o `[project.optional-dependencies.dev]`) o en `requirements-dev.txt`:
- `pytest`, `unittest` (built-in pero suele requerir setup), `nose2`, `hypothesis`

Carpetas/archivos: `tests/`, `test_*.py`, `*_test.py`, `conftest.py`.

#### Rust

`cargo test` viene **built-in**. Si hay `Cargo.toml`, hay runner. Verifica si hay tests:
- `tests/` (integration tests)
- `#[cfg(test)]` en archivos `src/*.rs`

#### Go

`go test` viene **built-in**. Si hay `go.mod`, hay runner. Verifica:
- Archivos `*_test.go`

#### Ruby

En `Gemfile`:
- `rspec`, `minitest` (built-in en Ruby moderno)

Carpetas: `spec/`, `test/`.

#### Java / Kotlin

En `pom.xml` o `build.gradle`:
- JUnit (`junit`, `junit-jupiter`), TestNG, Spock (Groovy)

Carpetas: `src/test/java/`, `src/test/kotlin/`.

#### PHP

En `composer.json`:
- `phpunit/phpunit`, `pest`, `behat`

Carpetas: `tests/`.

#### Dart / Flutter

En `pubspec.yaml` (`dev_dependencies`):
- `test`, `flutter_test`, `mockito`

Carpetas: `test/`.

#### C# / .NET

Archivos de proyecto referenciando:
- `xunit`, `nunit`, `mstest`

Proyectos `*.Tests.csproj`.

### Paso 3 — Clasificar el resultado

| Resultado | Significado | Acción |
|---|---|---|
| **A. Runner instalado y configurado** | Existe el paquete + hay tests pasando (o "no tests" sin error) | Usa ese runner. No propongas otro. |
| **B. Runner instalado pero sin tests todavía** | Está en `package.json`/`Cargo.toml`/etc. pero no hay archivos `*.test.*` | Usa ese runner. La primera tarea 🔴 crea la estructura de tests. |
| **C. Sin runner, con proyecto existente** | Hay `package.json` u otro manifiesto pero ningún runner | **Para antes de seguir.** Propone el runner estándar de ese ecosistema (ver matriz abajo) y añade tareas de Setup en Fase 0 de `tasks.md`. Confirma con el usuario. |
| **D. Greenfield (proyecto vacío)** | No hay manifiestos | La decisión ya debe estar en `plan.md` sección "Stack final → CI / Tests". Si no está, **vuelve a `plan.md`** y ciérralo antes de seguir. |
| **E. Usuario rechaza tener runner** | Caso raro pero posible | **Detente.** No se puede hacer SDD-TDD sin tests. Explica al usuario que la skill no aplica y ofrécele un fallback: spec sin TDD (genera spec.md + plan.md, no tasks.md). |

---

## Matriz de defaults recomendados

Cuando estás en caso **C** o **D** y debes proponer un runner, usa estos defaults por ecosistema. **Propón siempre con justificación de 1 línea**, no impongas.

| Ecosistema | Default recomendado | Por qué |
|---|---|---|
| **Node moderno + TS** | Vitest | rápido, soporta TS nativo, API compatible con Jest |
| **Node legacy / CRA** | Jest | el estándar histórico, máxima compatibilidad |
| **Frontend React/Vue/Svelte** | Vitest + Testing Library | combo más común en 2025+ |
| **Node E2E** | Playwright | mejor DX que Cypress hoy, multi-browser |
| **Python** | pytest | de facto estándar, mucho mejor DX que unittest |
| **Rust** | `cargo test` (built-in) | no añadir más |
| **Go** | `go test` (built-in) | no añadir más |
| **Ruby** | RSpec | comunidad mayoritaria; Minitest si el equipo prefiere lo built-in |
| **Java moderno** | JUnit 5 (Jupiter) | estándar actual |
| **Kotlin** | JUnit 5 o Kotest | Kotest si prefieren DSL idiomático |
| **PHP** | PHPUnit | estándar; Pest si el equipo quiere sintaxis tipo Jest |
| **Dart/Flutter** | `flutter_test` (built-in) | viene con Flutter |
| **C# / .NET** | xUnit | recomendación oficial de Microsoft |

---

## Cómo se refleja en los artefactos

### En `plan.md`

La sección "Stack final → CI / Tests" **no es opcional**. Debe quedar cerrada con:
- Runner unitario elegido + por qué
- Runner E2E si aplica + por qué
- Cómo se ejecutan (`npm test`, `pytest`, etc.)
- Si va a CI: dónde (GitHub Actions, GitLab CI, etc.)

### En `tasks.md`, Fase 0

Dos rutas posibles, **escoge una** según el resultado de la detección:

**Ruta A — Runner ya existe:**
```markdown
- [x] ⚙️ Runner de tests verificado: [nombre] — comando: `[comando]`. (No requiere instalación.)
```

**Ruta B — Hay que instalarlo:**
```markdown
- [ ] ⚙️ **Instalar [runner]** — `npm install -D vitest @vitest/ui` (o equivalente).
- [ ] ⚙️ **Configurar [runner]** — añadir `vitest.config.ts`, script `"test": "vitest"` en `package.json`.
- [ ] ⚙️ **Smoke test del runner** — crear `tests/smoke.test.ts` con un `expect(true).toBe(true)`, correr `npm test`, verificar que pasa.
```

El **smoke test** del runner no es opcional. Si no verificas que el runner ejecuta antes de empezar TDD, la primera tarea 🔴 puede fallar por configuración rota y no sabrás si la implementación funciona.

---

## Reglas

- ❌ Nunca asumas que hay runner. Verifica.
- ❌ Nunca cambies un runner existente sin pedirlo. Si el proyecto usa Jest y tú prefieres Vitest, **es problema tuyo, no del proyecto**.
- ✅ Si añades tareas de Setup en Fase 0, el smoke test del runner va **antes** de la primera 🔴 Red task de cualquier funcionalidad.
- ✅ Si el usuario rechaza tener tests, ofrécele explícitamente la salida: "esta skill produce spec + plan, no tasks; el TDD lo dejamos fuera".
