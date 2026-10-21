---
slug: claude-verified-done
status: in-progress
source:
  - type: intent
    summary: "The verified-done check of pi-verified-done, for Claude Code, shipped by the dominicode-sdd-creator plugin"
---

# Verified done for Claude Code

## 1. Vision

`pi-verified-done` made the lane's short loop unskippable in Pi. Most CBRM users work in Claude Code, so the same check ships with the `dominicode-sdd-creator` plugin as hooks: Claude may not stop with the short loop red. Both agents run one implementation, so they cannot drift.

## 2. Users

Developers with the `dominicode-sdd-creator` plugin installed in Claude Code, on a repo whose `AGENTS.md` has the lane `dominicode-harness-init` writes. This repo is the first one: its own `AGENTS.md` now has that lane.

## 3. Features and acceptance criteria

1. **Shared core.** The parser, the shell runner, the git snapshot and the stop decision live in `extensions/verified-done-core.mjs` (plain JavaScript); the Pi extension and the Claude hook only wire events to it.
   - Proof: `npm test` → the Pi suite still passes against the refactored extension; Pi e2e unchanged.
2. **Plugin hooks.** `hooks/hooks.json` runs `hooks/verified-done.mjs` on `UserPromptSubmit`, `PostToolUse` (`Edit|Write|NotebookEdit`) and `Stop`.
   - Proof: `claude plugin validate .` passes with no hook warning; `check.mjs` fails if a script in `hooks.json` is missing.
3. **A red short loop blocks the stop.** On `Stop` after a change, a red command prints `{"decision":"block","reason":…}` with the failure, so Claude keeps working.
   - Proof: `npm test`; real Claude Code run (see Verdict).
4. **Same limits as Pi.** At most 3 blocks per prompt, then Claude may stop and the user gets a `systemMessage`; known reds never block; no change, no lane or `DOMINICODE_VERIFIED_DONE=off` → nothing.
   - Proof: `npm test`.
5. **Silent where stdout matters.** `UserPromptSubmit` and `PostToolUse` print nothing, since `UserPromptSubmit` stdout would reach Claude's context.
   - Proof: `npm test`.
6. **A broken hook never traps Claude.** Invalid input or an internal error exits 0 without blocking.
   - Proof: `npm test` (process test with invalid input).
7. **Visible verdict.** A green check after a change prints `systemMessage: "verified-done: ✓ short loop N/N"`.
   - Proof: real Claude Code run.

## 4. Flows

UserPromptSubmit → state file reset (attempts 0, git baseline) · PostToolUse on an edit → `edited` · Stop → `onStop()` → block with the failure | systemMessage ✓ | systemMessage "still red, over to you" | nothing.

## 5. Architecture

- Every hook call is a new process, so the per-session state lives in `<os tmp>/dominicode-verified-done/<session_id>.json`; files untouched for 7 days are pruned on the next prompt.
- Claude Code's own cap (8 consecutive stop-hook continuations) sits above ours (3).

## 6. NFRs

- No dependencies; runs on the Node that runs Claude Code (the hook is plain ESM, no type stripping needed).
- `Stop` hook timeout 1200 s, above the core's 10-minute per-command timeout.
