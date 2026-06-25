# Worked example — Invoice generator for freelancers

> This is a real, complete spec designed to show you how to fill in the 6 sections without abstractions. Use it as your calibration bar.

---

## SECTION 1 — Product Vision

A web tool for freelancers to manage projects and generate invoices from a single place, without having to maintain separate spreadsheets.

---

## SECTION 2 — Users and Use Cases

**Freelancer user:** creates projects, logs worked hours, generates PDF invoices and marks them as paid.

**Client user (read-only):** accesses a public invoice via a shared link, views it and downloads the PDF.

---

## SECTION 3 — Features

**Projects module:**
- The user can create projects with name, client and hourly rate.
- The user can edit and archive projects.
- The user can view the history of logged hours per project.

**Hours module:**
- The user can log worked hours with date, duration and description.
- The system automatically calculates the accumulated total for the project.
- The user can edit or delete hour entries.

**Invoicing module:**
- The user can create an invoice by selecting a project and a date range.
- The system automatically fills in client, hours and total.
- The user can generate the invoice as a PDF.
- The user can mark an invoice as paid or pending.
- The system generates a public read-only link for each invoice.

---

## SECTION 4 — User Flows

**Flow — Log hours:**
1. The user goes to the project from the dashboard.
2. Clicks "Add hours".
3. Enters date, duration (in hours) and an optional description.
4. The system saves the entry and updates the project total.
- **Error:** if the duration is 0 or negative, the system shows "Duration must be greater than 0" and does not save the entry.

**Flow — Create an invoice:**
1. The user goes to "Invoices" in the menu.
2. Clicks "New invoice".
3. Selects the project; the system automatically fills in client, unbilled hours and total.
4. The user reviews the total and can edit it manually.
5. Clicks "Generate PDF".
6. The system produces the PDF and generates a public link.
- **Error:** if the project has no hours logged in the range, the system warns "No hours to invoice" and does not allow generating the invoice.

**Flow — Client accesses a public invoice:**
1. The client receives a link by email.
2. Opens the link in the browser.
3. The system shows the invoice in HTML and a "Download PDF" button.
- **Error:** if the link was revoked by the freelancer, the system shows "This invoice is no longer available".

---

## SECTION 5 — Architecture

- **Frontend:** Next.js (App Router) — SSR for public invoice links and basic SEO.
- **Backend:** Next.js API Routes — sufficient for v1, no separate server.
- **Database:** PostgreSQL on Supabase — includes auth and storage in the same provider.
- **Authentication:** Supabase Auth (email + Google OAuth).
- **Hosting:** Vercel for the app, Supabase for data.
- **PDF generation:** `@react-pdf/renderer` on the server.

---

## SECTION 6 — Non-functional Requirements

- **Performance:** initial dashboard load < 2s on a 4G connection; PDF generation < 5s.
- **Security:** each freelancer sees only their own projects, hours and invoices (RLS in Supabase). Public invoice links use UUID v4 tokens, not incremental IDs.
- **Scalability:** designed for up to 500 active users in v1; PDF is generated on demand, not stored.
- **Language:** English in v1, Spanish in v2.
- **Accessibility:** forms with associated labels and keyboard navigation in the create-invoice flow.
- **Compliance:** GDPR — "Export my data" and "Delete my account" buttons in settings.

---

## Open questions

- [ ] Are multi-currency invoices allowed in v1, or only USD? — owner: Bezael, deadline: before starting the Invoicing module.

---

## Notes on why this spec works

- **Section 1**: a single sentence, identifies product + user + problem.
- **Section 3**: every bullet starts with "The user can" or "The system". No mention of technology (no "component", "table", "endpoint"). That lives in the plan.
- **Section 4**: every flow has an error path. The public client flow may seem to need no errors, but "revoked link" covers the real case.
- **Section 5**: concrete stack with a 1-line justification per decision.
- **Section 6**: every NFR is **measurable**. "Fast" is not an NFR; "< 2s on 4G" is.
- **Open question** has an owner and deadline — it doesn't just float.

This is the bar. If your spec falls short in any section, that section is not done.

---

## How the surrounding steps look on this example

The spec above is the heart of the flow. These are the artifacts the other steps produce around it.

### Step 0.5 — Project Context Snapshot

This invoice tool is a new project, so the snapshot is the greenfield case:

> **Project Context Snapshot:** greenfield — no existing manifest or specs detected. `specs/INDEX.md` is empty. Stack will be proposed from scratch in `plan.md` with trade-offs and confirmed with you.

Had this been added to an existing repo, the snapshot would instead read something like *"Next.js 14 + TypeScript app, already uses Supabase and Tailwind, Jest installed with tests in `__tests__/` — I'll anchor the architecture on this"*, and Section 5 would inherit those choices rather than re-decide them.

### Project memory — the `specs/INDEX.md` entry written at hand-off

After this spec is confirmed, the skill records it in `specs/INDEX.md` (from `templates/specs-index.md`). The Shared decisions made here become reusable defaults for the next feature:

```markdown
## Shared decisions

| Decision    | Value                    | Rationale (1 line)                         | First decided in    |
|-------------|--------------------------|--------------------------------------------|---------------------|
| Database    | PostgreSQL on Supabase   | auth + storage + DB in one provider        | `invoice-generator` |
| Auth        | Supabase Auth            | email + Google OAuth out of the box        | `invoice-generator` |
| Test runner | Vitest                   | fast, native TS, Jest-compatible API       | `invoice-generator` |
| Hosting     | Vercel                   | first-class Next.js deploys                 | `invoice-generator` |

## Specs

| Slug                | Vision (1 line)                                          | Status | Key stack          | Related specs |
|---------------------|----------------------------------------------------------|--------|--------------------|---------------|
| `invoice-generator` | Freelancers manage projects and generate invoices in one place | active | Next.js + Supabase | —             |
```

When a later feature (say `expense-tracker`) starts, Step 0.5 reads this and proposes Supabase + Vitest as the default instead of re-litigating them — and flags `invoice-generator` as a related spec.

### Coverage matrix — the hand-off gate (lives at the end of `tasks.md`)

Every feature from Section 3 traced forward to a contract and to tasks. No empty task cell = no orphan feature:

| spec §3 feature | plan contract/entity | task IDs (🔴/🟢) |
|---|---|---|
| The user can create projects with name, client, rate | `POST /projects` / `Project` | Phase 1 🔴+🟢 |
| The user can edit and archive projects | `PATCH /projects/:id` / `Project.archivedAt` | Phase 1 🔴+🟢 |
| The user can view logged-hours history per project | `GET /projects/:id/hours` / `HourEntry` | Phase 1 🔴+🟢 |
| The user can log worked hours (date, duration, desc) | `POST /hours` / `HourEntry` | Phase 2 🔴+🟢 |
| The system auto-calculates the project total | `Project.total` (derived) | Phase 2 🔴+🟢 |
| The user can edit or delete hour entries | `PATCH/DELETE /hours/:id` / `HourEntry` | Phase 2 🔴+🟢 |
| The user can create an invoice (project + range) | `POST /invoices` / `Invoice` | Phase 3 🔴+🟢 |
| The system auto-fills client, hours, total | `Invoice` fill logic | Phase 3 🔴+🟢 |
| The user can generate the invoice PDF | `GET /invoices/:id/pdf` | Phase 3 🔴+🟢 |
| The user can mark an invoice paid/pending | `PATCH /invoices/:id` / `Invoice.status` | Phase 3 🔴+🟢 |
| The system generates a public read-only link | `GET /i/:token` / `Invoice.token` | Phase 3 🔴+🟢 |

**Also confirmed:** the 3 flows in Section 4 each get an E2E task with their error path (zero-duration, no-hours-to-invoice, revoked-link), and the measurable NFRs in Section 6 (dashboard < 2s, PDF < 5s, RLS isolation) each get a verification task. Every Section 3 bullet has a task → the list is ready to hand off.
