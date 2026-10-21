# Plan — claude-verified-done

## Phase 1 — Dogfood
Apply CBRM to this repo with `dominicode-harness-init`: Contract, Lane (short loop `node scripts/check.mjs` + `npm test`) and Verdict in `AGENTS.md`, light contract and PR templates.

## Phase 2 — Shared core
Move the pure logic of `extensions/dominicode-verified-done.ts` to `extensions/verified-done-core.mjs`, with `onStop()` holding the stop decision. The Pi suite and e2e must pass unchanged.

## Phase 3 — Claude Code hook
`hooks/verified-done.mjs` + `hooks/hooks.json`; per-session state file. Unit tests on `handle()`, process tests on the script, `claude plugin validate`, one real Claude Code run on a repo with a hidden bug.

## Phase 4 — Package and docs
`check.mjs` validates `hooks.json`; READMEs, repo `AGENTS.md`, `CHANGELOG.md`, `specs/INDEX.md`, harness-init's note on the `Short loop` format.
