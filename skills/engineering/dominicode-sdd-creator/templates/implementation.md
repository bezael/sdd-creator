# Ephemeral Implementation Plan — [Feature/Product Name] · [module/phase or session scope]

> **Agent scratch — NOT documentation.** This file lives in `specs/<feature-slug>/.work/`, is **gitignored**, and is regenerated at the start of each implementation session from `tasks.md`. Never commit it, never maintain it, never treat it as a source of truth — the truth lives in `spec.md`, `plan.md` and `tasks.md`.
>
> Write one of these per **session or module/phase**, not per micro-task. Skip it entirely for trivial tasks.

---

## 1. Target task(s)

> The unchecked tasks from `tasks.md` this session will execute, copied literally (checkbox included).

- [ ] 🔴 **[task title]** — `tasks.md` Phase [N]
- [ ] 🟢 **[task title]** — `tasks.md` Phase [N]

---

## 2. Files to touch

> Concrete paths, in attack order. Note for each whether it is created or modified.

1. `tests/[module]/[case].test.ts` — create
2. `src/[module]/[file].ts` — modify

---

## 3. Execution order

> The steps within this session: which test first, which implementation after, what to check between steps.

1. Write the failing test for [criterion] and run it — must FAIL.
2. Implement the minimum in [file] to make it pass.
3. Run the full suite — must stay green.

---

## 4. Verification command

> The exact test command, inherited from Phase 0 of `tasks.md`.

```
[e.g. npm test / pytest / cargo test]
```

---

> **Reflow rule:** if planning or executing this session surfaces a durable decision — a spec gap, a missing endpoint, a new risk — **stop and update `spec.md` → `plan.md` → `tasks.md` first**, then regenerate this file. A durable decision must never live only here.
