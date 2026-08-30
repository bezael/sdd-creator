# Verification loop — evidence-based completion

> A task is complete because its expected result was observed, not because an implementer says the work is finished. This reference defines the execution discipline behind the task contracts in `templates/tasks.md` and `templates/tasks-no-tdd.md`.

## Evidence-based completion

Every verifiable task defines four things before implementation starts:

1. **Criterion** — the requirement or technical invariant being satisfied.
2. **Files** — the expected implementation scope.
3. **Verify** — an executable command or precisely defined observation.
4. **Done when** — the expected outcome of that verification.

Evidence is the concise record that Verify was actually executed and Done when was observed. A checkbox without evidence is a claim, not completion.

The expected outcome is task-specific. A Green task commonly expects exit code 0. A Red task expects a controlled failure caused by the missing behavior; a syntax error, broken import or unavailable service is not valid Red evidence.

## The loop

1. Select one unchecked task.
2. Read its completion contract before changing files.
3. Implement only its stated scope.
4. Execute Verify exactly as written.
5. On PASS, record evidence and mark the task done.
6. On FAIL, leave it unchecked, diagnose, apply the smallest in-scope fix and repeat the same Verify.

Never edit the command, lower a threshold, delete an assertion or reinterpret an observation merely to turn FAIL into PASS. If Verify is invalid, treat that as a planning problem.

## When to fix and when to stop

Attempt a fix when the expected behavior is clear, the architecture supports it, and the failure is caused by an implementation defect or local configuration within the task's scope.

Stop execution when any of these is true:

- the criterion is ambiguous or contradicts another requirement;
- the minimal fix requires a new contract, entity, dependency or architectural decision absent from `plan.md`;
- the required behavior expands or changes scope;
- the verification cannot distinguish success from failure;
- repeated failure shows that the planned approach cannot satisfy the requirement safely.

On stop, reflow durable decisions in order: `spec.md` → `plan.md` → `tasks.md`. Then regenerate `.work/implementation.md` and resume from the first affected unchecked task. Do not preserve a durable decision only in a log, comment or scratch file.

## Three verification levels

| Level | Purpose | Typical timing | Examples |
|---|---|---|---|
| **Task verification** | Prove one task's Done when condition | after each task | scoped test, query, lint target, HTTP request, manual behavior |
| **Module verification** | Prove completed tasks still work together | at module/phase close | module suite, integration test, component walkthrough |
| **Final verification** | Detect regressions across the whole feature and enforce release gates | after code review, before PR/handoff | full tests, E2E, lint, typecheck, build, NFRs, coverage and review status |

A task passing does not imply its module passes. A module passing before later work does not imply the feature still passes. Final verification must therefore **recheck previously passed evidence** where later tasks could have invalidated it.

## Avoiding false positives

- Confirm a Red test fails for the intended missing behavior.
- Use the real command and environment that the task contract names.
- Do not rely only on mocks when the criterion concerns an integration boundary.
- Check exit status and meaningful output; “the command ran” is not a pass.
- Use deterministic fixtures and explicit thresholds where possible.
- Include negative/error behavior from the spec, not only happy paths.
- Re-run relevant regressions after fixes and refactors.
- Treat skipped, filtered-out, quarantined or silently ignored checks as gaps unless explicitly accepted in the plan.

## Manual verification

Manual verification is valid when automation is impractical, disproportionately expensive or cannot observe the relevant human outcome. It must still be reproducible:

- preconditions and test data;
- exact actions;
- expected observable result;
- environment or build identifier;
- date and verifier;
- PASS/FAIL plus a short observation.

“Looks good” is not a manual check. Prefer Given / When / Then or an equally precise sequence. A manual failure follows the same Fix → Verify loop and must not be checked off from code inspection alone.

## Recording evidence without repository noise

Keep durable evidence concise in `tasks.md`: command/check, PASS result and date or a stable CI/PR URL. Do not paste full logs, screenshots, generated reports or transient diagnostics into the spec artifacts.

Use CI artifacts, PR checks or external test reports for large evidence and link to them. Use `.work/implementation.md` for retry notes during the session; it is disposable. Commit a dedicated evidence artifact only when regulation, audit policy or the plan explicitly requires it.
