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
| **E. The user explicitly asked for no tests** | Only when they said so themselves | **No-TDD mode** — `spec.md` + `plan.md` + a degraded `tasks.md` from `templates/tasks-no-tdd.md`. See § "Case E" below for the gate. Never reachable on your own. |

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
- [x] TASK-00 — ⚙️ Runner detected: [name] in [manifest]. Evidence: [discovery].
- [ ] TASK-01 — ⚙️ Confirm runner execution. Verify: `[command]`. Done when: the runner exits successfully. Evidence: [result].
```

**Route B — Needs to be installed:**
```markdown
- [ ] TASK-01 — ⚙️ **Install [runner]** — Verify: `[version/manifest query]`. Done when: the runner resolves. Evidence: [...].
- [ ] TASK-02 — ⚙️ **Configure [runner]** — Files: `[config + manifest]`. Verify: `[config command]`. Done when: configuration loads. Evidence: [...].
- [ ] TASK-03 — ⚙️ **Smoke test the runner** — Files: `tests/smoke.test.ts`. Verify: `[scoped test command]`. Done when: it exits 0. Evidence: [...].
```

The **runner smoke test** is not optional. If you don't verify the runner executes before starting TDD, the first 🔴 task may fail due to broken config and you won't know whether the implementation works.

---

## Case E — no-TDD mode

The user gets to decide. What is not negotiable is that **the decision has to be theirs**, stated out loud, and written down in the artifact.

### The gate — three conditions, all required

1. **Stated by the user, in their own words, unprompted.** "no quiero tests", "sin tests", "skip the tests", "don't write tests". If the phrase never appeared in the conversation, this mode does not exist.
2. **Never offered by the agent.** Do not present it as an option, do not put it in a list of alternatives, do not float it as a shortcut when the repo has no runner. Case C's answer is "here is the runner I propose" — never "or we could skip tests".
3. **Never inferred.** `hazlo rápido`, `es un prototipo`, `es solo una demo`, `no hay tiempo`, an empty `devDependencies`, or a user who simply didn't mention testing: **none of these are case E.** Time pressure is a reason to cut scope, not to cut verification.

### Before switching modes

- **"Not now" is not "never".** Ask once. If the user means *later* — spike, prototype, demo with a date — stay in TDD mode: keep the runner in Phase 0 and offer to defer the 🔴 tasks. Case E is only for "no tests, period".
- **State the cost once**, in one sentence, then drop it: no regression detection, no confident refactoring, every acceptance criterion verified by hand. Say it once — repeating it is nagging, and the decision was already made.
- **Take one explicit confirmation.** Hedged, joking, or ambiguous → you stay in TDD mode.

### What changes in the artifacts

`spec.md` and `plan.md` do not change at all. The `plan.md` § "Final stack → CI / Tests" section records the decision and the date instead of a runner. Only `tasks.md` changes shape:

| | TDD mode | No-TDD mode |
|---|---|---|
| Template | `templates/tasks.md` | `templates/tasks-no-tdd.md` |
| Phase 0 | install + configure + smoke-test the runner | lint + typecheck + boot smoke (the only automated signal left) |
| Per feature | 🔴 Red → 🟢 Green → 🔵 Refactor | 🔨 Build → ✅ Verify → 🔵 Refactor |
| Criterion from `spec.md §3` | encoded in a test | written as Given / When / Then, verified by a human |
| Error paths from `spec.md §4` | one test each | one ✅ each — **not** dropped |
| Refactor safety | run the suite | re-run every ✅ of the touched module |
| Record of verification | CI log | the `Result:` line inside each ✅ |
| Coverage matrix | required | required, plus: a 🔨 whose ✅ never ran is also an orphan |
| `specs/INDEX.md` row | normal status | status carries a `· no-TDD` marker |

### Non-negotiable in this mode

- **The banner stays at the top of `tasks.md`**, with the date and the fact that the user asked for it. Six months later nobody remembers whose call it was, and the file must answer that on its own.
- **No 🔴 or 🟢 anywhere.** Those emojis are a claim that a test exists. Mixing them with manual checks produces a file nobody can trust.
- **Every criterion keeps a check.** Dropping the runner is the user's decision; dropping the acceptance criteria is not on the table — that is the line between degraded SDD and no methodology at all.
- **The coverage matrix still gates hand-off.** It is the only completeness signal left once the runner is gone, so it gets *more* important here, not less.
- **Each ✅ is written to be convertible.** Given = fixture, When = call, Then = assertion. If a runner shows up later, the conversion to 🔴 is mechanical and the spec never gets rewritten.

---

## Rules

- ❌ Never assume there is a runner. Verify.
- ❌ Never change an existing runner without asking. If the project uses Jest and you prefer Vitest, **that's your problem, not the project's**.
- ❌ Never propose, offer, hint at, or infer no-TDD mode. Case E is opt-in by the user and by nobody else.
- ✅ If you add Setup tasks in Phase 0, the runner smoke test goes **before** the first 🔴 Red task of any feature.
- ✅ If the user explicitly asks for no tests, switch to no-TDD mode after the gate above — state the cost once, confirm once, and write the banner into `tasks.md`.
