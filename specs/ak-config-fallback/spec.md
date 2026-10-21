---
slug: ak-config-fallback
status: in-progress
source:
  - type: intent
    summary: "CBRM and ai-workflow-kit stay separate but read each other's harness format (decided 2026-10-21)"
---

# Read ai-workflow-kit's `.ak/config.md`

## 1. Vision

A repo prepared with ai-workflow-kit records its harness in `.ak/config.md` (`## Commands`), not in a CBRM lane. Verified done and harness-init should use it instead of ignoring it. The kit does the reverse in its own repo (`verify --final` and `/ak-setup` read the lane), so a user can mix both tools without recording the same commands twice. Neither tool writes the other's file.

## 2. Users

Developers who use ai-workflow-kit's `/ak-setup` and this repo's plugin or Pi package in the same project.

## 3. Features and acceptance criteria

1. **Fallback in verified done.** With no `Short loop` in `AGENTS.md`, the check runs the `Test`, `Lint` and `Typecheck` entries of `.ak/config.md` (`Build` and `E2E` are long-loop work); entries marked `unknown` are skipped. A lane, when present, always wins.
   - Proof: `npm test` → parser and fallback cases, for the Pi extension and the Claude Code hook.
2. **`/verify` says where it looked.** With neither source, the Pi command names both files.
   - Proof: `npm test`.
3. **harness-init reads `.ak/config.md`.** Phase 1 lists it among the existing configuration and as a source of candidate commands, which are still run before they reach the lane.
   - Proof: `node scripts/check.mjs` (mirrors regenerated) and the text of `SKILL.md`.

## 4. Architecture

`parseAkCommands(markdown)` in `extensions/verified-done-core.mjs`, used by `readLane(cwd)`; both agents get the fallback through the core.

## 5. NFRs

No dependencies. Same parsing rules as ai-workflow-kit's `parseConfigCommands` (`- Key: value` bullets under `## Commands`, backticks stripped, values starting with `unknown` skipped).
