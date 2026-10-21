---
slug: pi-verified-done
status: completed
source:
  - type: intent
    summary: "A Pi extension that refuses to let the agent finish with the lane's short loop red"
---

# Verified done for Pi

## 1. Vision

An agent says "done" with red tests more often than any other failure. The lane that `dominicode-harness-init` writes already names the commands that prove a change (the **short loop**), but only the prompt asks the agent to run them. This extension makes Pi run them itself when the agent stops, and sends the agent back to work when they fail.

## 2. Users

- A developer using Pi on a repo prepared with `dominicode-harness-init` (CBRM level 4).
- Bezael, demoing CBRM: the agent says "done", the contract fails, the agent fixes it without a human.

## 3. Features and acceptance criteria

1. **Reads the short loop from the lane.** The commands are the lines of the first `bash` fence under the `Short loop` heading of `AGENTS.md` in the session's working directory, without blank lines, comment lines or trailing `# comments`.
   - Proof: `node --test tests/` → parser cases pass.
2. **Runs it when the agent stops after changing files.** On `agent_before_settle` with outcome `completed`, if the run edited or wrote a file, or `git status` changed since the prompt, every command runs in the working directory.
   - Proof: e2e with a scripted model, where the edit triggers a run and a pure answer does not.
3. **A red short loop sends the agent back.** When a command fails, the extension appends a message with each failing command, its exit code and the tail of its output, then asks Pi for one more model request.
   - Proof: e2e → the scripted model receives the failure and its fix turns the loop green.
4. **Bounded retries.** After 3 consecutive red checks in one prompt, the extension stops pushing back and says so (status and notification). The counter resets on every user prompt.
   - Proof: `node --test tests/` → the fourth red check returns no continuation.
5. **Known reds are honoured.** A command annotated `known red` in the lane runs and is reported, but its failure does not send the agent back.
   - Proof: `node --test tests/`.
6. **Visible verdict.** The footer status shows the last result: green with the count, red with the failing commands, or "gave up".
   - Proof: unit test on the status text.
7. **Manual control.** `/verify` runs the short loop now and shows the result; `/verify off` and `/verify on` toggle the automatic check for the session.
   - Proof: unit test on the command handler.
8. **Inert without a lane.** No `AGENTS.md`, or no `Short loop` section: nothing runs, nothing is shown.
   - Proof: `node --test tests/`.

## 4. Flows

User prompt → agent edits → agent stops → extension runs the short loop → green: status ✓, Pi settles | red: failure appended, one more model request → … → green, or 3 reds → status "gave up", Pi settles.

## 5. Architecture

- `extensions/dominicode-verified-done.ts`, loaded by Pi through the root `package.json` `"pi"."extensions"`.
- Pure helpers (`parseShortLoop`, `failureMessage`, `statusText`) exported for tests; the default export wires Pi events.
- Commands run through the platform shell (`spawn(..., { shell: true })`), the way a developer would type them.
- Tests: `node --test` with Node's built-in type stripping, no dependencies, run by CI next to `scripts/check.mjs`.

## 6. NFRs

- No runtime dependencies.
- A command times out after 10 minutes; a timeout counts as red.
- Failure output sent to the model is capped (last 4,000 characters per command) so a noisy test run cannot fill the context.
- Long loop is out of scope: it is for before the PR, not every stop.
