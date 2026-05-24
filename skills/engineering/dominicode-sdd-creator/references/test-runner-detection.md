# Test runner — detection and decision

> **Without a test runner there is no TDD.** Before generating `tasks.md`, verify that the project has a testing tool installed and working. If it doesn't, installing one is the **first task** — not something done "later".

---

## Detection protocol

Run this protocol between `plan.md` and `tasks.md`. If you are in an agent with filesystem access (Claude Code, Cursor, Codex), inspect the files. If not, ask the user what's there.

### Step 1 — Detect the ecosystem

Look at the project root:

| File | Ecosystem |
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
| _(nothing — empty project)_ | Greenfield → decided in `plan.md` |

### Step 2 — Look for an installed runner

For each ecosystem, check these signals:

#### Node / JavaScript / TypeScript

In `package.json`, look in `devDependencies` or `dependencies`:
- `vitest`, `jest`, `mocha`, `ava`, `tap`, `node --test` (Node 20+)
- E2E: `@playwright/test`, `cypress`, `webdriverio`
- React: `@testing-library/react`

And a script in `package.json`:
```json
"scripts": { "test": "..." }
```

Typical folders/files: `tests/`, `__tests__/`, `*.test.ts`, `*.spec.ts`.

#### Python

In `pyproject.toml` (section `[tool.poetry.dev-dependencies]` or `[project.optional-dependencies.dev]`) or in `requirements-dev.txt`:
- `pytest`, `unittest` (built-in but usually needs setup), `nose2`, `hypothesis`

Folders/files: `tests/`, `test_*.py`, `*_test.py`, `conftest.py`.

#### Rust

`cargo test` is **built-in**. If there is a `Cargo.toml`, there is a runner. Check for tests:
- `tests/` (integration tests)
- `#[cfg(test)]` in `src/*.rs` files

#### Go

`go test` is **built-in**. If there is a `go.mod`, there is a runner. Check for:
- `*_test.go` files

#### Ruby

In `Gemfile`:
- `rspec`, `minitest` (built-in in modern Ruby)

Folders: `spec/`, `test/`.

#### Java / Kotlin

In `pom.xml` or `build.gradle`:
- JUnit (`junit`, `junit-jupiter`), TestNG, Spock (Groovy)

Folders: `src/test/java/`, `src/test/kotlin/`.

#### PHP

In `composer.json`:
- `phpunit/phpunit`, `pest`, `behat`

Folders: `tests/`.

#### Dart / Flutter

In `pubspec.yaml` (`dev_dependencies`):
- `test`, `flutter_test`, `mockito`

Folders: `test/`.

#### C# / .NET

Project files referencing:
- `xunit`, `nunit`, `mstest`

`*.Tests.csproj` projects.

### Step 3 — Classify the result

| Result | Meaning | Action |
|---|---|---|
| **A. Runner installed and configured** | Package exists + tests are passing (or "no tests" without error) | Use that runner. Don't propose another. |
| **B. Runner installed but no tests yet** | It's in `package.json`/`Cargo.toml`/etc. but no `*.test.*` files exist | Use that runner. The first 🔴 task creates the test structure. |
| **C. No runner, with existing project** | There is a `package.json` or other manifest but no runner | **Stop before continuing.** Propose the standard runner for that ecosystem (see matrix below) and add Setup tasks in Phase 0 of `tasks.md`. Confirm with the user. |
| **D. Greenfield (empty project)** | No manifests | The decision must already be in `plan.md` section "Final stack → CI / Tests". If it's not, **go back to `plan.md`** and close it before continuing. |
| **E. User refuses to have a runner** | Rare but possible | **Stop.** SDD-TDD cannot be done without tests. Tell the user the skill doesn't apply and offer a fallback: spec without TDD (generate spec.md + plan.md, no tasks.md). |

---

## Recommended defaults matrix

When you are in case **C** or **D** and must propose a runner, use these defaults per ecosystem. **Always propose with a 1-line justification** — don't impose.

| Ecosystem | Recommended default | Why |
|---|---|---|
| **Modern Node + TS** | Vitest | fast, native TS support, Jest-compatible API |
| **Legacy Node / CRA** | Jest | the historical standard, maximum compatibility |
| **Frontend React/Vue/Svelte** | Vitest + Testing Library | most common combo in 2025+ |
| **Node E2E** | Playwright | better DX than Cypress today, multi-browser |
| **Python** | pytest | de facto standard, far better DX than unittest |
| **Rust** | `cargo test` (built-in) | no addition needed |
| **Go** | `go test` (built-in) | no addition needed |
| **Ruby** | RSpec | majority community; Minitest if the team prefers the built-in |
| **Modern Java** | JUnit 5 (Jupiter) | current standard |
| **Kotlin** | JUnit 5 or Kotest | Kotest if they prefer the idiomatic DSL |
| **PHP** | PHPUnit | standard; Pest if the team wants Jest-like syntax |
| **Dart/Flutter** | `flutter_test` (built-in) | comes with Flutter |
| **C# / .NET** | xUnit | Microsoft's official recommendation |

---

## How it reflects in the artifacts

### In `plan.md`

The "Final stack → CI / Tests" section **is not optional**. It must be closed with:
- Unit runner chosen + why
- E2E runner if applicable + why
- How they are run (`npm test`, `pytest`, etc.)
- If going to CI: where (GitHub Actions, GitLab CI, etc.)

### In `tasks.md`, Phase 0

Two possible paths — **choose one** based on the detection result:

**Route A — Runner already exists:**
```markdown
- [x] ⚙️ Test runner verified: [name] — command: `[command]`. (No installation required.)
```

**Route B — Needs to be installed:**
```markdown
- [ ] ⚙️ **Install [runner]** — `npm install -D vitest @vitest/ui` (or equivalent).
- [ ] ⚙️ **Configure [runner]** — add `vitest.config.ts`, script `"test": "vitest"` in `package.json`.
- [ ] ⚙️ **Smoke test the runner** — create `tests/smoke.test.ts` with an `expect(true).toBe(true)`, run `npm test`, verify it passes.
```

The **runner smoke test** is not optional. If you don't verify the runner executes before starting TDD, the first 🔴 task may fail due to broken config and you won't know whether the implementation works.

---

## Rules

- ❌ Never assume there is a runner. Verify.
- ❌ Never change an existing runner without asking. If the project uses Jest and you prefer Vitest, **that's your problem, not the project's**.
- ✅ If you add Setup tasks in Phase 0, the runner smoke test goes **before** the first 🔴 Red task of any feature.
- ✅ If the user refuses to have tests, explicitly offer the exit: "this skill produces spec + plan, not tasks; TDD is left out".
