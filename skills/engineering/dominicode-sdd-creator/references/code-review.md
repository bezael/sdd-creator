# Code review — requirements before style

> Code review is a lifecycle gate, not a replacement for task verification. It evaluates the implemented change against the issue and SDD artifacts as well as the real diff. The reviewer should be conceptually independent from the implementer: use a different person or agent/context where practical, and do not rely on the implementer's summary as evidence.

## Inputs

Review all available inputs:

- source GitHub Issue or other source record, when present;
- `spec.md`;
- `plan.md`;
- `tasks.md`, including its coverage matrix and evidence;
- the real implementation diff against the intended base;
- tests and verification results.

If a required input is unavailable, record it as a verification gap. The diff is mandatory: reviewing only a description cannot detect out-of-scope implementation.

## Review order

When git history is available, prioritize review depth by churn and fix history — files with many past fix commits are where defects cluster, so they get the deep read first. A file with no history is new code: unknown risk, not low risk. The signal orders the review; it is never itself a finding.

### 1. Requirements compliance

- Does the implementation satisfy every acceptance criterion?
- Is required functionality or an error path missing?
- Was behavior added outside the agreed scope?
- Does the Issue source disagree with the current spec, and if so was the change explicitly resolved in the spec?

Close this section with an explicit **alignment verdict**, using the PR-issue alignment taxonomy from agentic code review research (Isik et al., cited in "Rethinking Code Review in the Age of AI"):

- **Exact** — the change fully addresses the requirements, with nothing unrelated.
- **Tangling** — the change includes code no criterion asks for.
- **Missing** — the change fails to fully address the requirements.
- **Missing and Tangling** — both deviations at once.

Tangling code creates noise that hides defects and can block approval of the valid part; Missing work is technical debt wearing a green checkmark. Name the deviation and cite its evidence (files, lines, criteria) — don't just imply it in prose.

### 2. Correctness

- logical bugs and invalid state transitions;
- boundary and edge cases;
- concurrency, race conditions and idempotency where relevant;
- error handling and recovery behavior.

### 3. Security

- authentication and authorization boundaries;
- injection and unsafe parsing/execution;
- data leaks, logging and secret exposure;
- input validation and trust boundaries.

### 4. Performance

- N+1 queries or repeated remote calls;
- unnecessary renders, loops or allocations;
- unbounded work or data access;
- regressions against measurable NFRs.

### 5. Tests

- missing tests or checks for criteria and error paths;
- tests coupled to implementation details instead of behavior;
- weak assertions, false-positive mocks, skipped checks;
- gaps between the coverage matrix and executed evidence.

### 6. Maintainability

- avoidable complexity and duplication;
- excessive coupling or unclear responsibility;
- important divergence from the architecture in `plan.md`;
- changes that make future verification materially harder.

Do not bury requirements or correctness findings under style suggestions. Every finding must cite the affected criterion/task and a file or diff location — a claim that cannot be anchored to the diff is an observation, not a finding. Report any verification you did not execute as *not run*; never assume PASS.

## Recommended output

```markdown
# Code Review

Status: PASS | CHANGES REQUIRED
Alignment: Exact | Tangling | Missing | Missing and Tangling

## Critical
- [blocking correctness, security, data-loss or unmet requirement]

## Important
- [material issue that should be fixed before final verification]

## Suggestions
- [non-blocking improvement]

## Acceptance criteria coverage
- [criterion → implementation/tests/evidence]

## Verification gaps
- [missing, stale, skipped or non-reproducible evidence]
```

`PASS` means there are no Critical blockers and no unresolved Important finding that invalidates an acceptance criterion or required verification. An alignment verdict other than **Exact** cannot be `PASS` unless the user explicitly accepted the deviation and it was reflowed into the spec first — out-of-scope code is removed or specced, missing work is completed or descoped in writing. A review result is derived evidence, not a new source of product requirements. If a finding exposes a durable requirement or architecture gap, reflow `spec.md` → `plan.md` → `tasks.md` before fixing it.

Keep the output in the repository's existing review channel (for example a PR review or check) or in the agent handoff. Do not create a new committed review artifact unless project policy requires one; link the stable result from the PR when available.

## Review retrospective (feeds project memory)

A review is not finished when the findings are written; it is finished when the durable part of what it taught lives somewhere the next session will read. Before closing the review, list what it surfaced that outlives this diff:

- a cross-cutting decision confirmed or overturned;
- an alternative that was considered and rejected, with the reason;
- a risk that materialized (or was confirmed absent) in a specific module.

Hand this list to the Step 5 hand-off, which promotes genuinely cross-cutting items into `specs/INDEX.md` § Shared decisions, citing the slug. Findings that are pure code fixes stay in the review — only durable knowledge is promoted. A review whose lessons evaporate forces the next review to rediscover them.
