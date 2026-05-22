# CLAUDE.md — bezael/sdd-creator

Este repo es un plugin de Claude Code con las skills de metodología Dominicode.

## Estructura

```
skills/
└── <categoría>/
    ├── README.md                  ← índice de la categoría
    └── <nombre-skill>/
        ├── SKILL.md               ← instrucciones para Claude Code
        ├── AGENTS.md              ← instrucciones para otros agentes (Codex, Cursor, Gemini…)
        ├── templates/             ← plantillas que la skill usa
        └── references/            ← material de referencia
```

`.claude-plugin/plugin.json` lista las rutas de todas las skills activas.

## Añadir una skill nueva

1. Crea `skills/<categoría>/<nombre-skill>/` con al menos `SKILL.md`.
2. Añade `"./skills/<categoría>/<nombre-skill>"` al array `skills` de `.claude-plugin/plugin.json`.
3. Si es una categoría nueva, crea también `skills/<categoría>/README.md`.
4. Actualiza el catálogo en el `README.md` raíz.

## Categorías actuales

- `engineering` — skills de desarrollo de software
- *(prevista)* `marketing` — skills de copywriting y ofertas (sales-email, hormozi)
