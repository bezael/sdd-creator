# CBRM — Contract Based Review Method

> From a GitHub Issue to a verified PR, with agents doing the work and evidence doing the review.
>
> CBRM by **Bezael Pérez · Dominicode**. It combines Spec-Driven Development (the contract) with Harness Engineering (the lane) and agentic review (the verdict).

## The idea

You don't trust AI-generated code because it looks right. Reading a plausible diff and approving it is trusting the agent's confidence, not its result.

CBRM replaces that with a review against a **contract**: the acceptance criteria of the spec, each with the command that proves it. The agent works inside a **lane** that limits what it may touch and gives it a harness to check itself. It closes the task with a **verdict**, which is per-criterion evidence. The human reads the contract and the verdict, and opens the diff only where the verdict is red.

```
Issue  ->  Contract  ->  Lane  ->  Verdict  ->  PR
          (criteria)   (harness)  (evidence)
```

## The three pieces

| Piece | Question it answers | What it contains |
|---|---|---|
| **Contract** | What must be true when this is done? | Acceptance criteria, each with its verification command; what is out of scope |
| **Lane** | Where may the agent work, and how does it check itself? | Stack, harness (short loop after every change, long loop before the PR), known reds, conventions, boundaries, change scope |
| **Verdict** | Is it done, and how do we know? | Status, alignment (`Exact` / `Tangling` / `Missing` / `Missing and Tangling`), criterion → status → evidence table, out-of-scope changes, checks *not run* |

A repository's `AGENTS.md` carries the three pieces as its top-level sections: **Contract** (where criteria live, definition of done), **Lane** (the permanent rules and harness) and **Verdict** (the report format). The `dominicode-harness-init` skill audits the repo and generates it with real, executed commands.

## How the SDD lifecycle maps onto CBRM

| CBRM piece | SDD artifact or step |
|---|---|
| Contract | `spec.md` §3 (behaviors), §4 (flows with error paths), §6 (measurable NFRs) → `tasks.md` Criterion + Verify + Done when, and the coverage matrix |
| Lane | `AGENTS.md` (repo-wide: harness, conventions, boundaries) + `plan.md` (stack, contracts, build order) + each task's `Files` (per-task scope) |
| Verdict | Task Evidence → Code Review (`references/code-review.md`) → Final Verify (`references/final-verification.md`) → PR description |

SDD produces the contract; the lane constrains the implementation; review and final verification issue the verdict. None of the three becomes a new source of requirements. If the verdict exposes a gap, the contract is updated first (`spec.md` → `plan.md` → `tasks.md`), then the code.

## Issue → PR sequence

1. **Issue.** The source record. Preserve its repository, number and URL in the spec's `source` block.
2. **Contract.** Write and approve the contract before any code. Non-trivial work gets the full SDD spec, plan and tasks. Small work gets the light contract (see below).
3. **Lane.** Confirm the repository has one: an `AGENTS.md` with a harness whose commands were actually run. If it doesn't, run `dominicode-harness-init` first. Without a lane, the verdict has to be issued by hand, which is the problem CBRM exists to solve.
4. **Implement inside the lane.** One task at a time, short loop after every change, no files outside the declared scope without asking.
5. **Verdict.** Each task records evidence. Code Review compares the real diff with the contract and closes with an alignment verdict. Final Verify re-runs the long loop and rechecks earlier evidence.
6. **PR.** The PR description carries the verdict: status, alignment and the criterion → evidence table. It also names the one thing the reviewer should inspect by hand. A PR whose answer is "everything" is not ready.

## Full contract or light contract

| Use | When |
|---|---|
| **Full SDD contract** (`specs/<slug>/spec.md` + `plan.md` + `tasks.md`) | Any non-trivial feature: more than one module, layer or screen, or more than ~100 lines of change. The SDD skill's own trigger rules decide. |
| **Light contract** (`.dominicode/spec.template.md` from harness-init) | Work the SDD skill explicitly skips: a bug with a clear repro, a single-file refactor, a small change with obvious scope. |

Never write both for the same Issue. If a light contract grows past two pages or starts needing architecture decisions, promote it to a full SDD spec.

## Rules

- **No contract, no code.** A criterion without a verification command is an opinion, and opinions get reviewed by hand.
- **Never put a command in the lane that has not been run.** A fake green harness is worse than an honest red one.
- **The verdict is derived from evidence, never from the implementer's summary.** A check that was not executed is reported as *not run*.
- **Only `Exact` alignment passes**, unless the deviation was accepted and written into the contract first. Extra code is code without a contract.
- **The reviewer reads the verdict first**, and inspects the diff where the verdict is red, evidence is missing, or the change touches a boundary.
