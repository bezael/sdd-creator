# AGENTS.md

> Template. Everything between `{{ }}` is filled with data **verified in Phase 1**.
> If a datum could not be verified, do not write it: leave it out and report it as a gap.
>
> Structure follows the Contract Based Review Method (CBRM): **Contract** (what must be true),
> **Lane** (where the agent works and how it checks itself), **Verdict** (how it proves the result).

---

# {{PROJECT_NAME}}

{{ONE_SENTENCE: what this project is and who it is for}}

## Contract

Work starts from a contract, never from a vague request. The contract is the list of
acceptance criteria in the task's spec, and each criterion has the command that proves it.

- **Where the contract lives:**
  - Features: `specs/<slug>/spec.md` + `tasks.md` (Dominicode SDD){{SDD_SKILL_POINTER: non-Claude installs: ", following `.agents/dominicode-sdd-creator/AGENTS.md`"; Claude Code installs: ", using the `dominicode-sdd-creator` skill"; omit if the SDD skill is not installed}}
  - Small Issues (clear bug, single-file change): a copy of `.dominicode/spec.template.md` at `.dominicode/specs/<issue-number>-<slug>.md`. Never fill the template in place.
- **No contract, no code.** If the task has no acceptance criteria, write them and get them approved before touching code.
- **The contract is the only source of scope.** If implementing it requires a decision the contract does not make, stop and update the contract first.

A task is done when:

1. Every acceptance criterion has evidence: which command proves it and what its output was.
2. The short loop and the long loop of the Lane pass, with no new reds.
3. The diff contains nothing the contract did not request.

Point 3 is the one most often missed. Extra code is code without a contract.

## Lane

The lane is where the agent is allowed to work and the harness it uses to check itself.
Leaving the lane requires explicit permission.

### Stack

- **Language:** {{LANGUAGE_AND_VERSION}}
- **Framework:** {{FRAMEWORK_AND_VERSION}}
- **Package manager:** {{MANAGER}} — derived from `{{LOCKFILE}}`. Do not use another.
- **Runtime / version:** {{RUNTIME}}

### Harness

These commands have been run and checked. If one fails, the work is not done.

#### Short loop — after every change

```bash
{{TYPECHECK_COMMAND}}   # {{TIME}}
{{LINT_COMMAND}}        # {{TIME}}
{{UNIT_TESTS_COMMAND}}  # {{TIME}}
```

#### Long loop — before opening the PR

```bash
{{BUILD_COMMAND}}       # {{TIME}}
{{FULL_TESTS_COMMAND}}  # {{TIME}}
{{E2E_COMMAND}}         # {{TIME}}
```

> If a command in either loop is red today for reasons that predate the agent, say so on the
> command itself: `{{COMMAND}}  # {{TIME}}, known red: {{N}} of {{TOTAL}}`. A loop command that
> fails without that annotation reads as a broken promise, not as an honest red.

#### Known reds

{{LIST of commands that currently fail for causes predating the agent, with the number of failures.
This lets the agent distinguish what it broke from what was already broken.
If there are none, write: "None. The entire harness is green as of {{DATE}}."}}

### Conventions

Detected by reading existing code, not imposed from outside:

- {{CONVENTION_1}}
- {{CONVENTION_2}}
- {{CONVENTION_3}}

### Boundaries

What the agent must not touch without explicit permission:

- Files outside the change scope declared in the contract
- Database migrations and schema
- Deployment and infrastructure configuration files
- Dependencies: do not add or update packages without asking first
- Secrets, `.env` files, and credentials
- {{PROJECT_SPECIFIC_BOUNDARY}}

## Verdict

The verdict is what the reviewer reads instead of the diff. The agent does not say "done";
it delivers a verdict, and the verdict is only as good as its evidence.

Report it in the PR (or the hand-off) in this format:

```markdown
Status: PASS | CHANGES REQUIRED
Alignment: Exact | Tangling | Missing | Missing and Tangling

| # | Acceptance criterion | Status | Evidence |
|---|----------------------|--------|----------|
| 1 | ...                  | PASS   | `command` -> output |

Long loop: {{summarized output}}
New reds: none | {{list}}
Out-of-scope changes: none | {{list with justification}}
Not run: none | {{checks that were not executed, and why}}
```

- **Exact**: the change covers every criterion and nothing else. **Tangling**: it includes code no criterion asks for. **Missing**: a criterion is not satisfied. **Missing and Tangling**: both.
- Only `Exact` can be `PASS`, unless the deviation was accepted and written into the contract first.
- A check that was not executed is reported as *not run*, never as PASS.
- The reviewer inspects the diff only where the verdict is red or the evidence is missing.
