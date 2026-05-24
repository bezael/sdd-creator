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
