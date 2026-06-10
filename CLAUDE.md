# CLAUDE.md — bezael/sdd-creator

This repo is a Claude Code plugin with Dominicode skills. SDD (Spec-Driven Development) is an industry methodology — this repo distributes the **Dominicode adaptation** by Bezael Pérez, not the methodology's invention. Keep that framing in all docs and credits ("SDD adaptation by", never "methodology by").

## Structure

```
skills/
└── <category>/
    ├── README.md                  ← category index
    └── <skill-name>/
        ├── SKILL.md               ← instructions for Claude Code
        ├── AGENTS.md              ← instructions for other agents (Codex, Cursor, Gemini…)
        ├── templates/             ← templates used by the skill
        └── references/            ← reference material
```

`.claude-plugin/plugin.json` lists the paths of all active skills.

## Adding a new skill

1. Create `skills/<category>/<skill-name>/` with at least `SKILL.md`.
2. Add `"./skills/<category>/<skill-name>"` to the `skills` array in `.claude-plugin/plugin.json`.
3. If it's a new category, also create `skills/<category>/README.md`.
4. Update the catalog in the root `README.md`.

## Current categories

- `engineering` — software development skills
- *(planned)* `marketing` — copywriting and offer skills (sales-email, hormozi)
