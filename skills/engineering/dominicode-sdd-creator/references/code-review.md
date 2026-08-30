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

### 1. Requirements compliance

- Does the implementation satisfy every acceptance criterion?
- Is required functionality or an error path missing?
- Was behavior added outside the agreed scope?
- Does the Issue source disagree with the current spec, and if so was the change explicitly resolved in the spec?

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

Do not bury requirements or correctness findings under style suggestions. Findings should cite the affected criterion/task and file or diff location when possible.

## Recommended output

```markdown
# Code Review

Status: PASS | CHANGES REQUIRED

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

`PASS` means there are no Critical blockers and no unresolved Important finding that invalidates an acceptance criterion or required verification. A review result is derived evidence, not a new source of product requirements. If a finding exposes a durable requirement or architecture gap, reflow `spec.md` → `plan.md` → `tasks.md` before fixing it.

Keep the output in the repository's existing review channel (for example a PR review or check) or in the agent handoff. Do not create a new committed review artifact unless project policy requires one; link the stable result from the PR when available.
