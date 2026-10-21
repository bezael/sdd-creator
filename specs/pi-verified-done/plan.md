# Plan — pi-verified-done

## Phase 1 — Pure core
`parseShortLoop(markdown)` → `{ command, knownRed }[]`; `failureMessage(results)`; `statusText(state)`. Unit tests first.

## Phase 2 — Pi wiring
Default export: track edits (`tool_call` edit/write) and a `git status` snapshot (`before_agent_start`, user prompts only, which also reset the attempt counter); on `agent_before_settle` run the loop and return `{ entries, continue }`; `/verify` command. Unit tests with a fake `pi`, as `ai-workflow-kit` does for its hooks.

## Phase 3 — Real Pi
E2e with the SDK and a scripted (faux) model: an edit that breaks a test, then a fix. Load check via RPC `get_commands`.

## Phase 4 — Package and docs
`package.json` `"pi"."extensions"` and `files`; `check.mjs` verifies the extension path exists; CI runs `node --test tests/`; READMEs, repo `AGENTS.md`, `CHANGELOG.md`, `specs/INDEX.md`.
