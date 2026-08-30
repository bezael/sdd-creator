# End-to-end example — vote and unvote a feedback item

> This compact example shows the complete lifecycle. It is documentation, not a sample application and not a second artifact system.

## 1. Source Issue

```text
Repository: acme/feedback
Issue: #123 — Let signed-in users vote on feedback
Request: A user can vote for an item and remove their vote. Show the current count.
```

The Issue provides provenance and initial context. It does not yet answer enough questions to implement safely.

## 2. Understand / clarification grill

Questions and resolved answers:

1. Can anonymous visitors vote? **No; they can see counts but must sign in to vote.**
2. Can one user add multiple votes to one item? **No; at most one active vote per user/item.**
3. What happens when two users vote concurrently? **Both unique votes count; duplicate requests from the same user remain idempotent.**
4. Is unvote a delete or a toggle endpoint? **Use explicit vote and unvote actions; the UI may render one toggle control.**
5. What happens if the item does not exist? **Return not found and do not create a vote.**

## 3. Spec

````markdown
# Spec — Feedback voting

## Source (optional)

```yaml
source:
  type: github_issue
  repository: acme/feedback
  issue: 123
  url: https://github.com/acme/feedback/issues/123
```

## SECTION 1 — Product Vision

Signed-in users can support a feedback item with one vote and remove that vote, while everyone can see an accurate count.

## SECTION 2 — Users and Use Cases

**Signed-in user:** views vote counts, votes once, removes their own vote.
**Visitor:** views vote counts and is prompted to sign in before voting.

## SECTION 3 — Features

**Feedback voting:**
- The user can vote for a feedback item once.
- The user can remove their vote from a feedback item.
- The system shows the current vote count for each item.
- The system requires authentication before changing a vote.

## SECTION 4 — User Flows

**Flow — Vote:**
1. The signed-in user selects Vote.
2. The system stores one vote and increments the visible count.
- **Error:** if the item does not exist, the system returns not found and changes nothing.

**Flow — Unvote:**
1. The user selects the active Vote control.
2. The system removes that user's vote and decrements the count.
- **Error:** if no vote exists, the operation remains successful and the count does not go below zero.

**Flow — Visitor attempts to vote:**
1. The visitor selects Vote.
2. The system does not change data and asks the visitor to sign in.
- **Error:** if sign-in is unavailable, the current count remains visible and unchanged.

## SECTION 5 — Architecture

- Extend the existing feedback API, database and authentication conventions.
- Add a unique `(feedback_item_id, user_id)` vote constraint.
- Expose explicit vote/unvote handlers and return the resulting count.

## SECTION 6 — Non-functional Requirements

- **Performance:** vote/unvote API p95 < 300 ms under the existing expected load.
- **Security:** only an authenticated user may create or remove their own vote.
- **Consistency:** duplicate vote/unvote requests are idempotent; count never becomes negative.
- **Language:** reuse the application's existing UI language and messages.
````

## 4. Plan

```markdown
# Technical Plan — Feedback voting

## Data model
- `FeedbackVote(feedbackItemId, userId, createdAt)` with a unique composite key.

## Contracts
- `PUT /feedback/:id/vote` — authenticated, idempotently creates the caller's vote; returns `{ voted: true, count }`.
- `DELETE /feedback/:id/vote` — authenticated, idempotently removes the caller's vote; returns `{ voted: false, count }`.
- `VoteButton` — renders count and state; asks visitors to sign in.

## Risks
- Concurrent duplicate votes inflate counts. Mitigation: database uniqueness plus count from persisted rows.
- A user removes another user's vote. Mitigation: delete scoped by item and authenticated user.

## Build order
1. Persistence constraint and service behavior.
2. API authorization/contracts.
3. UI state and flows.
```

The plan reuses the project's existing stack and runner detected during codebase inspection; it does not introduce a parallel framework.

## 5. Tasks and coverage

```markdown
**Status:** Not Started

- [ ] TASK-10 — 🔴 Test: one vote per user/item

  Criterion: spec.md §3 → "The user can vote for a feedback item once."

  Files:
  - tests/feedback/vote.test.ts

  Verify: npm test -- feedback/vote

  Done when: the new behavior test fails because vote persistence is not implemented, not because the runner is broken

  Evidence: [expected Red failure]

- [ ] TASK-11 — 🟢 Implement idempotent vote

  Criterion: spec.md §3 → "The user can vote for a feedback item once."

  Files:
  - src/feedback/vote-service.ts
  - tests/feedback/vote.test.ts

  Verify: npm test -- feedback/vote

  Done when: the command exits 0 for first vote and duplicate-vote cases

  Evidence: [PASS result]

- [ ] TASK-20 — 🔴 Test: user removes only their vote
  Criterion: spec.md §3 → "The user can remove their vote from a feedback item."
  Files: `tests/feedback/unvote.test.ts`
  Verify: `npm test -- feedback/unvote`
  Done when: it fails for the expected missing unvote behavior
  Evidence: [expected Red failure]

- [ ] TASK-21 — 🟢 Implement idempotent unvote
  Criterion: spec.md §3 → "The user can remove their vote from a feedback item."
  Files: `src/feedback/vote-service.ts`, `tests/feedback/unvote.test.ts`
  Verify: `npm test -- feedback/unvote`
  Done when: the command exits 0 and repeated unvote keeps count at zero
  Evidence: [PASS result]

## Coverage matrix

| spec §3 feature | plan contract/entity | task IDs (build + verification) |
|---|---|---|
| Vote once | `FeedbackVote` / `PUT .../vote` | TASK-10, TASK-11 |
| Remove own vote | `DELETE .../vote` | TASK-20, TASK-21 |
| Show current count | vote/unvote responses / `VoteButton` | TASK-11, TASK-21, TASK-30 |
| Require authentication | API auth guard / `VoteButton` | TASK-40, TASK-41 |
```

The remaining API/UI tasks use the same contract. The matrix is built from every Section 3 bullet, so no requirement is silently dropped.

When implementation begins, the header changes to `Status: In Progress`. It does not become `Completed` merely because all task checkboxes are checked.

## 6. Implementation loop

Session scratch selects `TASK-21` and copies its contract into `.work/implementation.md`.

1. The implementer scopes deletion by `feedbackItemId` but forgets `userId`.
2. `npm test -- feedback/unvote` returns FAIL: user A can remove user B's vote.
3. The task remains unchecked; evidence is not recorded as PASS.
4. The implementer applies the minimum fix: delete by both item and authenticated user.
5. The same Verify command passes, relevant vote regression tests also pass, and concise evidence is written into `TASK-21`.

If the failure had exposed an undecided rule—such as whether moderators may remove votes—implementation would stop and reflow `spec.md` → `plan.md` → `tasks.md` before continuing.

## 7. Code Review

```markdown
# Code Review

Status: PASS

## Critical
- None.

## Important
- None unresolved. The first diff allowed cross-user deletion; fixed in TASK-21 and covered by behavior test.

## Suggestions
- Consider a shared response type for vote/unvote handlers.

## Acceptance criteria coverage
- 4/4 criteria map to implementation and executed evidence.

## Verification gaps
- Performance NFR still requires the planned load check before Final Verify.
```

The reviewer used Issue #123, spec, plan, tasks/evidence, the real diff and test results, and was independent from the implementation context.

## 8. Final Verify

Later UI work touched shared vote state, so previously passed service and API evidence is rechecked.

```markdown
Final Verification: PASS

- Task-level evidence rechecked: PASS
- Unit tests: PASS
- Integration tests: PASS
- E2E: PASS
- Lint: PASS
- Typecheck: PASS
- Build: PASS
- Relevant NFR checks: PASS
- Acceptance criteria: 4/4 covered
- Orphan requirements: 0
- Critical review findings: 0
- Evidence: CI run linked from the Pull Request
```

## 9. Pull Request / handoff

The PR links Issue #123, `spec.md`, `plan.md`, `tasks.md`, the review and final-verification result. The PR description summarizes evidence; it does not copy full test logs into the repository. The feature is complete only after the final gate is PASS.

At that point, and only then, `tasks.md` changes to `Status: Completed` and the `specs/INDEX.md` row mirrors `completed`.
