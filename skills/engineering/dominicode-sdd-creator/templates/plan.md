# Technical Plan — [Feature/Product Name]

> Derived from `spec.md`. **Do not start this file until the spec is confirmed by the user.**
> If the spec changes, this file is rewritten — not patched.

---

## 1. Final stack

> Closed decisions, with one line of rationale each. If Section 5 of the spec said "to be decided with the agent", this is where you decide — with explicit trade-offs.

- **Frontend:** [technology] — [why, in 1 line]
- **Backend / API:** [technology] — [why]
- **Database:** [technology] — [why]
- **Authentication:** [provider / pattern] — [why]
- **Hosting:** [where] — [why]
- **Test runner (unit):** [vitest / jest / pytest / rspec / cargo test / go test / junit / xunit / ...] — [why]. **Mandatory decision — without a runner there is no TDD.**
- **Test runner (E2E, if applicable):** [playwright / cypress / ...] — [why]
- **CI:** [GitHub Actions / GitLab CI / none for now] — [when it connects]

### Discarded stacks

> Briefly document what was considered and why NOT. This prevents revisiting the same decision in 3 months.

- **[Alternative stack]:** discarded because [reason].

---

## 2. Data model

> The main entities and how they relate. One line per entity.

- **[Entity]** — key fields: [field1, field2]. Relationship: [belongs to / has many ...].
- **[Entity]** — key fields: [...]. Relationship: [...].

> If the model is complex (>6 entities), add a diagram or ASCII in an appendix.

---

## 3. Contracts (API or components)

> If it's backend: list the main endpoints or handlers.
> If it's frontend only: list the main components and their responsibility.

**Backend / API:**
- `[METHOD] /route` — [what it does] — input: [...], output: [...]
- `[METHOD] /route` — [what it does] — ...

**Frontend / components:**
- `<ComponentName>` — [responsibility in 1 line]
- `<ComponentName>` — [...]

---

## 4. External dependencies

> Key services and libraries. For each: why it was chosen and what the fallback is if it fails.

- **[Service / library]** — usage: [...]. Fallback if it fails: [...].

---

## 5. Technical risks and mitigations

> List 3–5 things that could go wrong. For each: the mitigation.

- **Risk:** [description]. **Mitigation:** [concrete action].
- **Risk:** [description]. **Mitigation:** [concrete action].

---

## 6. Build order

> Which module is built first, second, third. Justify the order.

1. **Module [X]** — first because [it's the base everything else needs / highest technical risk / enables earlier demo].
2. **Module [Y]** — second because [depends on X / unlocks the main flow].
3. **Module [Z]** — last because [it's marginal / depends on the above].

---

## 7. Definition of done for the plan

- [ ] **Every Section 3 feature maps to a data-model entity or a contract** — list any feature that does NOT map here; an unmapped feature is a gap to close, not a footnote (this is the spec → plan half of traceability; `tasks.md` closes the plan → tasks half)
- [ ] Every risk has a mitigation
- [ ] The build order is clear and has no cycles
- [ ] **The test runner (unit, and E2E if applicable) is decided and justified**
- [ ] The stack is consistent with what the project already uses (per the Step 0.5 snapshot), or any divergence is stated explicitly
- [ ] The user has confirmed the stack

*When all 6 points are checked, move to Step 3.5 (runner verification) and then to `tasks.md`.*
