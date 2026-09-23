# bezael/sdd-creator — Dominicode Skills

> [🇪🇸 Versión en español](./README.es.md)

> Generates specs following the **Spec-Driven Development** methodology, as adapted by Dominicode (Bezael Pérez), in any AI agent: Claude, Codex, Gemini, Cursor, Aider, Continue.
>
> Before generating code, the agent produces `spec.md` (6 sections plus optional Issue provenance), `plan.md` (technical decisions) and `tasks.md` (TDD-ordered tasks with objective completion evidence) under `specs/<feature-slug>/`.
>
> It then drives Implement → Verify → Fix, requirements-first Code Review and Final Verification before PR/handoff. It keeps **`specs/INDEX.md` as project memory**, preserves end-to-end traceability and remains plain Markdown, tool-agnostic and dependency-free.

---

## Skills catalog

### Engineering

| Skill | Description |
|-------|-------------|
| `dominicode-sdd-creator` | Full Spec-Driven Development lifecycle — Issue/understanding, spec/plan/tasks, evidence-based implementation, review, final verification and PR/handoff. |

---

## Quick install (recommended)

```bash
npx skills@latest add bezael/sdd-creator
```

The CLI asks which skills to install and for which agents (Claude Code, Cursor, Codex, etc.) and configures everything automatically.

> 💡 **How to update:** To update an existing installation to the latest version, simply run the command above again. For manual installations, re-run their respective copy commands.
>
> Note: the version number the `skills` CLI prints on startup is the CLI's own version, not this skill's. Check the installed skill version in `CHANGELOG.md` or the GitHub releases.

---

## Manual install (per-agent fallback)

### Claude Code (Anthropic)

**Option A — Global skill (recommended):**

```bash
# Copy the skill to your personal skills directory
cp -r skills/engineering/dominicode-sdd-creator ~/.claude/skills/

# Verify
ls ~/.claude/skills/dominicode-sdd-creator/SKILL.md
```

From that point on, every Claude Code session will have the skill available.

**Option B — Per-project skill:**

```bash
mkdir -p .claude/skills
cp -r skills/engineering/dominicode-sdd-creator .claude/skills/
```

### Claude.ai (web/desktop)

1. Bundle the skill: `zip -r dominicode-sdd-creator.skill skills/engineering/dominicode-sdd-creator/`
2. In Claude.ai → Settings → Skills → Upload skill → select the `.skill` file.

### Codex CLI (OpenAI)

```bash
# In the project root
cp skills/engineering/dominicode-sdd-creator/AGENTS.md ./AGENTS.md
cp -r skills/engineering/dominicode-sdd-creator/templates ./templates
cp -r skills/engineering/dominicode-sdd-creator/references ./references
```

### Cursor

```bash
mkdir -p .cursor/rules
cp skills/engineering/dominicode-sdd-creator/AGENTS.md .cursor/rules/dominicode-sdd-creator.mdc
cp -r skills/engineering/dominicode-sdd-creator/templates ./templates
cp -r skills/engineering/dominicode-sdd-creator/references ./references
```

Add the Cursor frontmatter at the top of the `.mdc` file:

```markdown
---
description: Dominicode SDD Creator — write spec before code
alwaysApply: true
---
```

### Gemini CLI (Google)

```bash
cp skills/engineering/dominicode-sdd-creator/AGENTS.md ./GEMINI.md
cp -r skills/engineering/dominicode-sdd-creator/templates ./templates
cp -r skills/engineering/dominicode-sdd-creator/references ./references
```

### Aider, Continue and other AGENTS.md-compatible tools

Copy `AGENTS.md` to the project root together with `templates/` and `references/`.

### Agents without instruction-file support

Paste the contents of `AGENTS.md` at the beginning of your system prompt.

---

## Repo structure

```
bezael/sdd-creator
├── .claude-plugin/
│   └── plugin.json               ← read by the npx skills CLI and Claude Code
├── skills/
│   └── engineering/
│       ├── README.md
│       └── dominicode-sdd-creator/
│           ├── SKILL.md           ← Claude Code
│           ├── AGENTS.md          ← other agents
│           ├── templates/
│           │   ├── spec.md
│           │   ├── plan.md
│           │   ├── tasks.md
│           │   ├── tasks-no-tdd.md
│           │   ├── implementation.md
│           │   └── specs-index.md
│           └── references/
│               ├── examples.md
│               ├── codebase-inspection.md
│               ├── tdd-workflow.md
│               ├── test-runner-detection.md
│               ├── traceability.md
│               ├── verification-loop.md
│               ├── code-review.md
│               └── final-verification.md
├── announcements/                ← release announcement copy (Spanish)
├── AGENTS.md                     ← project instructions for any agent
├── CHANGELOG.md
├── CLAUDE.md                     ← imports AGENTS.md for Claude Code
├── LICENSE
├── README.md
└── README.es.md
```

---

## How to use

Once installed, describe what you want to build:

```
"I want to build an app for freelancers to manage invoices"
"let's create a metrics dashboard for my store"
"design an authentication feature with magic links"
```

The agent will:
1. Detect the context level (high / medium / low)
2. Ground the spec in your project — detect the stack in use, conventions and prior specs (a "Project Context Snapshot")
3. Interview you or produce a draft accordingly
4. Generate `specs/<feature>/spec.md` with the 6 sections
5. After your confirmation, generate `plan.md`
6. After your confirmation, generate `tasks.md` with TDD — including a coverage matrix so no feature is left without a task
   - `tasks.md` carries the spec's implementation status: **Not Started**, **In Progress**, or **Completed**. Completion requires evidence, review and Final Verification PASS.
7. Record the spec in `specs/INDEX.md` (project memory) and reuse its shared decisions next time
8. **Only then** start coding, selecting your preferred execution strategy:
   * **Turn-based (Paso a Paso):** Guide the agent task-by-task.
   * **Autonomous Loop (Bucle Autónomo):** Use the host agent's loop/goal capability when available.
9. For each task, execute its `Verify`; on failure apply the smallest valid fix and verify again. A checkbox requires evidence.
10. Run an independent, requirements-first Code Review against the Issue, artifacts, real diff and verification results.
11. Run Final Verification, including rechecking previously passed evidence, before PR/handoff.

---

## If you don't want tests

You can decide that — but you have to **say** it. Ask for no tests in your own words ("sin tests", "no quiero tests") and the agent switches to **no-TDD mode**: same `spec.md`, same `plan.md`, same coverage matrix, and a `tasks.md` where every acceptance criterion is verified by hand (Given / When / Then) instead of by a runner.

Two things the agent will never do: propose that mode on its own, or infer it because you said "hazlo rápido" or "es un prototipo". Speed pressure is a reason to cut scope, not verification.

The degraded file is written to be converted, not thrown away: add a runner later and every manual check becomes a failing test, one to one, without rewriting the spec.

---

## Philosophy

> **Understand → Spec → Plan → Tasks → Implement → Verify → Review → Final Verify → PR.** Durable decisions stay in spec, plan and tasks; completion is evidence-based.

The Dominicode adaptation of SDD is documented in the book and in Dominicode courses:

- **Online course** — [Build with AI: from idea to product with Claude Code](https://www.udemy.com/course/construye-con-ia-de-la-idea-al-producto-con-claude-code/?referralCode=AECD9EA3796054DEDD5D) (Udemy)
- **Digital book** — [SDD: Build with control](https://leanpub.com/sdd-spec-driven-development) (Leanpub)
- **Physical book** — [Spec-Driven Development: construir agentes proyecto](https://www.amazon.es/-/en/Spec-Driven-Development-construir-agentes-proyecto/dp/B0GW6HN48K/ref=tmm_pap_swatch_0?_encoding=UTF8&dib_tag=AUTHOR&dib=eyJ2IjoiMSJ9.8_Nr_CREQqyDdShal8UyRqcr3ftdcpnEePLWr8CRp8lfNCG-sv6OjDTMbGd3G2MP.d4mvOV0abTcNYbavuQe615dpMa41i88elPTIhzy2yRk) (Amazon)

---

## Credits

SDD adaptation: **Bezael Pérez** · [Dominicode](https://dominicode.com) · [YouTube](https://youtube.com/@dominicode)

Freely distributed under the MIT license. If you adapt it for your team or product, a mention is welcome.
