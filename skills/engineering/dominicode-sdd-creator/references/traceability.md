# Traceability — closing the spec → plan → tasks loop

> **The silent failure of SDD is a feature in the spec that never becomes a task.** Three documents, written in sequence, drift: a feature gets dropped between `spec.md` and `plan.md`, or a contract in `plan.md` never gets a test. Traceability is the check that catches this *before* hand-off, while it's cheap to fix.

The mechanism is a **coverage matrix**: one row per feature in Section 3 of the spec, traced forward to a plan element and then to concrete tasks. It lives at the end of `tasks.md` (template section `## Coverage matrix`) and is filled in Step 4, verified at the Step 5 gate.

---

## Building the matrix

Work **from the spec, not from the tasks** — the spec is the source of truth, so it defines the rows. For each bullet in `spec.md` Section 3 (every `The user can …` / `The system …`):

| Column | What goes in it |
|---|---|
| **spec §3 feature** | the literal feature bullet (compressed) |
| **plan contract/entity** | the `plan.md` §3 endpoint/component or §2 entity that realizes it |
| **task IDs** | the `tasks.md` tasks that build + test it — at minimum one 🔴 and one 🟢 |

Example:

| spec §3 feature | plan contract/entity | task IDs (🔴/🟢) |
|---|---|---|
| "The user can create projects with name, client, rate" | `POST /projects` / `Project` | Phase 1 🔴+🟢 |
| "The system generates a public read-only link" | `GET /i/:token` / `Invoice.token` | Phase 3 🔴+🟢 |

---

## Detecting gaps — check both directions

**Forward (the one that matters most): every spec feature has a task.**
Walk the rows. Any feature with an empty "task IDs" cell is an **orphan feature** — it's in the spec but nobody will build it. The `tasks.md` is **not done** until every Section 3 feature traces to at least one 🔴→🟢 pair. This is the hand-off gate.

**Backward: every task traces to a feature.**
Walk the tasks. A task that implements behavior with no matching spec feature is **scope creep** (or a missing spec feature). Either drop the task or — if the behavior is genuinely needed — go back and add it to `spec.md` Section 3 first (the reflow rule). Setup (⚙️), refactor (🔵), and NFR tasks are exempt: they trace to Phase 0, Section 6, or "N/A", not to a Section 3 feature.

**Also confirm flows and NFRs are covered:**
- Each flow in `spec.md` Section 4 should have an E2E task (happy path **and** its error path) in the tasks' E2E phase.
- Each measurable NFR in Section 6 should have a verification task in the final phase.

---

## The hand-off gate

Before telling the user the spec is ready to implement (Step 5):

1. The coverage matrix is filled.
2. **No orphan features** — every Section 3 bullet has task IDs.
3. Section 4 flows and measurable Section 6 NFRs have their tasks.

If any check fails, **do not hand off**. Name the gap to the user and close it by going back to the right document — usually `tasks.md`, but if a feature was genuinely missed, back to `spec.md` → `plan.md` → `tasks.md` in order (never patch only the downstream file).

---

## Relationship to the other gates

- `plan.md` §7 "Definition of done" already asserts *"every Section 3 feature maps to a data-model entity or a contract"* — that is the **spec → plan** half. The coverage matrix extends it with the **plan → tasks** half and makes the mapping explicit instead of asserted.
- This does not replace the reflow rule (update `spec.md` first when a gap appears). It's the check that *surfaces* the gap in the first place.

---

## Rules

- ✅ Rows come from the spec. The spec defines what must exist; tasks must rise to meet it.
- ✅ A feature with no task is a blocker, not a footnote — fix it before hand-off.
- ✅ Setup / refactor / NFR / E2E tasks are exempt from the backward check; they trace to phases, not to Section 3 bullets.
- ❌ Never close the matrix by deleting a feature from the spec to make it "covered" — that hides the decision. Drop scope explicitly, with the user.
