# Spec — [Feature/Product Name]

> Dominicode Spec-First template (Bezael Pérez).
> Fill each section **in order**. Do not move to `plan.md` until all 6 sections are closed.

---

## SECTION 1 — Product Vision

> The shortest, clearest description of what you are building. **One or two sentences maximum**. If you cannot explain it in two sentences, it's not clear yet — think it through before continuing.

**Guiding questions:**
- What exactly does this product / feature do?
- Who is it for?
- What problem does it solve in one sentence?

**Vision:**
[Write here — 1 or 2 sentences, no more]

---

## SECTION 2 — Users and Use Cases

> Who uses the product and what for. **No marketing personas** — concrete actions each type of user performs.

**Guiding questions:**
- Who is the primary user?
- Are there users with different roles? (admin, standard user, visitor, system)
- What are the 3 main actions each one performs?

**Users:**

**User [role 1]:** [action 1], [action 2], [action 3].

**User [role 2]:** [action 1], [action 2], [action 3].

---

## SECTION 3 — Features

> The complete list of what the system does, organized by modules. **Always** use the form "The user can..." or "The system allows/performs...". This forces you to think from behavior, not from code.

**Guiding questions:**
- What modules does the system have?
- What can the user do in each module?
- What does the system do automatically?

**Module [name]:**
- The user can [action].
- The user can [action].
- The system allows [automatic action].

**Module [name]:**
- The user can [action].
- The system automatically calculates [something].
- The user can [action].

> Add as many modules as needed. If a module has fewer than 2 features, it should probably be merged with another.

---

## SECTION 4 — User Flows

> The exact steps a user follows to complete each main action. **Every flow must include at least one error case**, not just the happy path.

**Guiding questions:**
- What are the 3–5 most important actions in the product?
- What steps does the user follow to complete each one?
- What happens if something goes wrong at each step?

**Flow — [name of main action]:**
1. The user [initial action].
2. The system [response].
3. The user [next step].
4. The system [final result].
- **Error:** if [failure condition], the system [error behavior].

**Flow — [another main action]:**
1. ...
2. ...
- **Error:** ...

> Minimum 3 flows, maximum 5. If you have more than 5 main flows, the scope is too large for a single spec — split it.

---

## SECTION 5 — Architecture

> The technical structure of the system. What components it needs, how they communicate, what technologies to use. If you have no prior technical decisions, write **"To be decided with the agent"** and plan.md will resolve it with explicit trade-offs.

**Guiding questions:**
- Is it a web app, mobile, CLI, or multiple?
- Does it need its own backend or can it use external services (BaaS)?
- How is data stored?
- Is there user authentication?
- Does it integrate with other services or APIs?

**Proposed architecture:**

- **Frontend:** [framework + why, or "to be decided"]
- **Backend:** [framework / serverless / BaaS, or "to be decided"]
- **Database:** [type + product, or "to be decided"]
- **Authentication:** [provider, or "to be decided"]
- **Hosting:** [where it deploys, or "to be decided"]
- **Integrations:** [required external APIs]

---

## SECTION 6 — Non-functional Requirements

> The constraints the system must meet even if the user doesn't see them directly. Many projects ignore these until the problem appears in production.

**Guiding questions:**
- How many concurrent users must it support?
- Is there sensitive data? (PII, payments, health)
- Does it need to work offline?
- In what languages?
- Are there accessibility or compliance requirements? (GDPR, WCAG)

**Requirements:**

- **Performance:** [e.g. initial load < 3s, API response < 500ms]
- **Security:** [e.g. each user's data is isolated; encryption in transit; no passwords stored in plaintext]
- **Scalability:** [e.g. designed for up to 1,000 users in v1]
- **Language:** [e.g. English in v1, Spanish in v2]
- **Accessibility:** [e.g. WCAG 2.1 AA on critical forms, or "not applicable in v1"]
- **Compliance / privacy:** [e.g. GDPR if there are EU users, or "not applicable"]

---

## Open questions

> If there are decisions that cannot be made now, list them here. **Every open question must have an owner and a date**, or it stays in limbo.

- [ ] [Open question] — owner: [who], deadline: [date]
- [ ] ...

---

*When all sections are closed and open questions resolved (or explicitly deferred), move to `plan.md`.*
