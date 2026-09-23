# bezael/sdd-creator — Dominicode Skills

> [🇪🇸 Versión en español](./README.es.md)

> Generates specs following the **Spec-Driven Development** methodology, as adapted by Dominicode (Bezael Pérez), in any AI agent: Claude, Codex, Gemini, Cursor, Aider, Continue.
>
> Before generating code, the agent produces `spec.md` (6 sections plus optional Issue provenance), `plan.md` (technical decisions) and `tasks.md` (TDD-ordered tasks with objective completion evidence) under `specs/<feature-slug>/`.
>
> It then drives Implement → Verify → Fix, requirements-first Code Review and Final Verification before PR/handoff. It keeps **`specs/INDEX.md` as project memory**, preserves end-to-end traceability and remains plain Markdown, tool-agnostic and dependency-free.
>
> Both skills together implement the **Contract Based Review Method (CBRM)**: `Issue → Contract → Lane → Verdict → PR`. `dominicode-sdd-creator` writes the contract (acceptance criteria with the command that proves each one), `dominicode-harness-init` sets up the lane (the repo's `AGENTS.md` with real verification commands), and the review delivers a verdict backed by evidence instead of "it looks right".

---

## Skills catalog

### Engineering

| Skill | Description |
|-------|-------------|
| `dominicode-sdd-creator` | Full Spec-Driven Development lifecycle — Issue/understanding, spec/plan/tasks, evidence-based implementation, review, final verification and PR/handoff. |
| `dominicode-harness-init` | Sets up the lane for agent work: audits the repo's real verification commands and generates an `AGENTS.md` with Contract, Lane and Verdict sections, plus spec and PR templates. |

---

## Quick install (recommended)

```bash
npx skills@latest add bezael/sdd-creator
```

The CLI asks which skills to install and for which agents (Claude Code, Cursor, Codex, etc.) and configures everything automatically.

> 💡 **How to update:** To update an existing installation to the latest version, simply run the command above again. For manual installations, re-run their respective copy commands.
>
> **Upgrading a non-Claude install from 1.7.x:** 1.8.0 moves the skills to `.agents/<skill>/`. Re-running the copy commands does not remove the old files, so delete (or move into `.agents/dominicode-sdd-creator/`) the root `AGENTS.md` copied from the SDD skill, `GEMINI.md`, `.cursor/rules/dominicode-sdd-creator.mdc`, `./templates` and `./references`. Then follow [Other agents](#other-agents-codex-cursor-gemini-cli-aider-continue) to build the lane.
>
> Note: the version number the `skills` CLI prints on startup is the CLI's own version, not this skill's. Check the installed skill version in `CHANGELOG.md` or the GitHub releases.

---

## Manual install (per-agent fallback)

### Claude Code (Anthropic)

**Option A — Global skill (recommended):**

```bash
# Copy the skill to your personal skills directory
cp -r skills/engineering/dominicode-sdd-creator ~/.claude/skills/
cp -r skills/engineering/dominicode-harness-init ~/.claude/skills/

# Verify
ls ~/.claude/skills/dominicode-sdd-creator/SKILL.md
ls ~/.claude/skills/dominicode-harness-init/SKILL.md
```

From that point on, every Claude Code session will have both skills available.

**Option B — Per-project skill:**

```bash
mkdir -p .claude/skills
cp -r skills/engineering/dominicode-sdd-creator .claude/skills/
cp -r skills/engineering/dominicode-harness-init .claude/skills/
```

### Claude.ai (web/desktop)

1. Bundle each skill:
   - `zip -r dominicode-sdd-creator.skill skills/engineering/dominicode-sdd-creator/`
   - `zip -r dominicode-harness-init.skill skills/engineering/dominicode-harness-init/`
2. In Claude.ai → Settings → Skills → Upload skill → select each `.skill` file.

### Other agents (Codex, Cursor, Gemini CLI, Aider, Continue…)

Non-Claude agents read one instruction file from the project root. With CBRM, that root `AGENTS.md` belongs to the **lane** (your repo's harness, conventions and boundaries), so the skills live in their own folder and the root file points to them:

```bash
# In the project root: install both skills side by side, never over the root
mkdir -p .agents
cp -r skills/engineering/dominicode-sdd-creator .agents/
cp -r skills/engineering/dominicode-harness-init .agents/
```

1. **Build the lane first.** Ask your agent to follow `.agents/dominicode-harness-init/AGENTS.md`. It audits the repo and proposes the root `AGENTS.md` (Contract / Lane / Verdict). If you already have one, it proposes a diff instead of overwriting it.
2. **Point the lane at the SDD skill.** The generated Contract section references `.agents/dominicode-sdd-creator/AGENTS.md` for feature work. If you write the root file by hand, add that line yourself.
3. **Wire your agent to the root file:**
   - **Codex CLI, Aider, Continue:** they read `AGENTS.md` from the root. Nothing else to do.
   - **Cursor:** create `.cursor/rules/dominicode.mdc` with the frontmatter below, and a body that says: `Follow AGENTS.md at the project root.`
   - **Gemini CLI:** create `GEMINI.md` with a single line: `@AGENTS.md`

```markdown
---
description: Dominicode CBRM — contract, lane, verdict
alwaysApply: true
---
```

Each skill's `templates/` and `references/` stay inside its own `.agents/<skill>/` folder, so the two skills never overwrite each other.

### Agents without instruction-file support

Paste the contents of `.agents/dominicode-harness-init/references/generic-prompt.md` to build the lane. For feature work, paste `.agents/dominicode-sdd-creator/AGENTS.md` at the beginning of your system prompt.

---

## Repo structure

```
bezael/sdd-creator
├── .claude-plugin/
│   └── plugin.json               ← read by the npx skills CLI and Claude Code
├── skills/
│   └── engineering/
│       ├── README.md
│       ├── dominicode-harness-init/
│       │   ├── SKILL.md           ← Claude Code
│       │   ├── AGENTS.md          ← other agents
│       │   ├── templates/
│       │   │   ├── AGENTS.template.md
│       │   │   ├── spec.template.md
│       │   │   └── pr.template.md
│       │   └── references/
│       │       └── generic-prompt.md
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
│               ├── cbrm.md
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

**Once per repository — set up the lane.** Ask the agent to run `dominicode-harness-init` ("set up the harness", "prepare my repo for agents"). It runs your real build, type check, test and lint commands, then proposes an `AGENTS.md` with Contract, Lane and Verdict sections and reports your harness level (0–4) and the next gap to close.

**For every feature — write the contract and build against it.** Describe what you want to build:

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
12. Open the PR with the **verdict**: status, alignment and a criterion → evidence table, so the reviewer opens the diff only where it is red.

For a small Issue (a bug with a clear repro, a single-file change), the full spec is overkill: the agent copies the light contract template to `.dominicode/specs/<issue-number>-<slug>.md` and delivers the same verdict.

---

## Contract Based Review Method (CBRM)

You don't trust AI-generated code because it looks right. You review it against a contract.

```
Issue  ->  Contract  ->  Lane  ->  Verdict  ->  PR
          (criteria)   (harness)  (evidence)
```

- **Contract**: the spec's acceptance criteria, each with the command that proves it. `dominicode-sdd-creator` writes it for non-trivial features, and a light template covers small Issues.
- **Lane**: where the agent may work and how it checks itself, meaning the harness (short and long loop), known reds, conventions and boundaries. `dominicode-harness-init` generates it as the repo's `AGENTS.md`, using only commands it actually ran.
- **Verdict**: per-criterion evidence and an alignment verdict (`Exact`, `Tangling`, `Missing`, `Missing and Tangling`), delivered in the PR. You read the contract and the verdict, and open the diff only where the verdict is red.

Full method: [`references/cbrm.md`](./skills/engineering/dominicode-sdd-creator/references/cbrm.md).

---

## If you don't want tests

You can decide that — but you have to **say** it. Ask for no tests in your own words ("sin tests", "no quiero tests") and the agent switches to **no-TDD mode**: same `spec.md`, same `plan.md`, same coverage matrix, and a `tasks.md` where every acceptance criterion is verified by hand (Given / When / Then) instead of by a runner.

Two things the agent will never do: propose that mode on its own, or infer it because you said "hazlo rápido" or "es un prototipo". Speed pressure is a reason to cut scope, not verification.

The degraded file is written to be converted, not thrown away: add a runner later and every manual check becomes a failing test, one to one, without rewriting the spec.

---

## Philosophy

> **Understand → Spec → Plan → Tasks → Implement → Verify → Review → Final Verify → PR.** Durable decisions stay in spec, plan and tasks; completion is evidence-based.
>
> **Issue → Contract → Lane → Verdict → PR.** You don't trust the agent's code because it looks right; you check it against a contract.

The Dominicode adaptation of SDD is documented in the book and in Dominicode courses:

- **Online course** — [Build with AI: from idea to product with Claude Code](https://www.udemy.com/course/construye-con-ia-de-la-idea-al-producto-con-claude-code/?referralCode=AECD9EA3796054DEDD5D) (Udemy)
- **Digital book** — [SDD: Build with control](https://leanpub.com/sdd-spec-driven-development) (Leanpub)
- **Physical book** — [Spec-Driven Development: construir agentes proyecto](https://www.amazon.es/-/en/Spec-Driven-Development-construir-agentes-proyecto/dp/B0GW6HN48K/ref=tmm_pap_swatch_0?_encoding=UTF8&dib_tag=AUTHOR&dib=eyJ2IjoiMSJ9.8_Nr_CREQqyDdShal8UyRqcr3ftdcpnEePLWr8CRp8lfNCG-sv6OjDTMbGd3G2MP.d4mvOV0abTcNYbavuQe615dpMa41i88elPTIhzy2yRk) (Amazon)

---

## Credits

SDD adaptation: **Bezael Pérez** · [Dominicode](https://dominicode.com) · [YouTube](https://youtube.com/@dominicode)

CBRM (Contract Based Review Method) by **Bezael Pérez** · [Dominicode](https://dominicode.com)

Freely distributed under the MIT license. If you adapt it for your team or product, a mention is welcome.
