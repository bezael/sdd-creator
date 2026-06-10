# bezael/sdd-creator — Dominicode Skills

> [🇪🇸 Versión en español](./README.es.md)

> Generates specs following the **Spec-Driven Development** methodology, as adapted by Dominicode (Bezael Pérez), in any AI agent: Claude, Codex, Gemini, Cursor, Aider, Continue.
>
> Before generating code, the agent produces `spec.md` (6 sections), `plan.md` (technical decisions) and `tasks.md` (TDD-ordered task list) under `specs/<feature-slug>/`.

---

## Skills catalog

### Engineering

| Skill | Description |
|-------|-------------|
| `dominicode-sdd-creator` | Spec-Driven Development — write the spec before writing code. |

---

## Quick install (recommended)

```bash
npx skills@latest add bezael/sdd-creator
```

The CLI asks which skills to install and for which agents (Claude Code, Cursor, Codex, etc.) and configures everything automatically.

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
│           │   └── implementation.md
│           └── references/
│               ├── examples.md
│               ├── tdd-workflow.md
│               └── test-runner-detection.md
├── CLAUDE.md
├── LICENSE
└── README.md
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
2. Interview you or produce a draft accordingly
3. Generate `specs/<feature>/spec.md` with the 6 sections
4. After your confirmation, generate `plan.md`
5. After your confirmation, generate `tasks.md` with TDD
6. **Only then** start coding, task by task

---

## Philosophy

> **Spec → Plan → Tests → Code.** Code is the last thing that happens, not the first.

The Dominicode adaptation of SDD is documented in the book and in Dominicode courses:

- **Online course** — [Build with AI: from idea to product with Claude Code](https://www.udemy.com/course/construye-con-ia-de-la-idea-al-producto-con-claude-code/?referralCode=AECD9EA3796054DEDD5D) (Udemy)
- **Digital book** — [SDD: Build with control](https://leanpub.com/sdd-spec-driven-development) (Leanpub)
- **Physical book** — [Spec-Driven Development: construir agentes proyecto](https://www.amazon.es/-/en/Spec-Driven-Development-construir-agentes-proyecto/dp/B0GW6HN48K/ref=tmm_pap_swatch_0?_encoding=UTF8&dib_tag=AUTHOR&dib=eyJ2IjoiMSJ9.8_Nr_CREQqyDdShal8UyRqcr3ftdcpnEePLWr8CRp8lfNCG-sv6OjDTMbGd3G2MP.d4mvOV0abTcNYbavuQe615dpMa41i88elPTIhzy2yRk) (Amazon)

---

## Credits

SDD adaptation: **Bezael Pérez** · [Dominicode](https://dominicode.com) · [YouTube](https://youtube.com/@dominicode)

Freely distributed under the MIT license. If you adapt it for your team or product, a mention is welcome.
