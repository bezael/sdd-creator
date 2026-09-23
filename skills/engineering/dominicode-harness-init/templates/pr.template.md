## Contract

**Issue:** #{{NUMBER}}
**Spec:** {{SPEC_LINK}}

## Lane

- [ ] Short loop is green (type check, lint, unit tests)
- [ ] Long loop is green (build, full tests, e2e)
- [ ] No new reds compared with those known in `AGENTS.md`
- [ ] The diff does not touch files outside the scope declared in the spec
- [ ] No dependencies were added or updated without agreement

## Verdict

Status: PASS | CHANGES REQUIRED
Alignment: Exact | Tangling | Missing | Missing and Tangling

| # | Acceptance criterion | Status | Evidence |
|---|----------------------|--------|----------|
| 1 | | | `command` -> output |
| 2 | | | `command` -> output |
| 3 | | | `command` -> output |

**Out-of-scope changes:** {{none / list with justification}}
**Not run:** {{none / checks that were not executed, and why}}

## For the reviewer

{{The only thing they need to inspect manually, and why. If you write "everything",
this PR is not ready for review: it is asking someone to do the work the lane
was supposed to do.}}
