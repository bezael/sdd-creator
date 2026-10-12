# icp-community-research

Skill portable para convertir comentarios de comunidades online en:

1. Un veredicto de ICP con evidencia literal
2. Un ranking de dolores de cliente
3. Borradores de respuesta humanos y muy breves

Plataformas: grupos de Facebook, Reddit, LinkedIn, X/Twitter, Instagram, YouTube, Discord, Telegram y foros.

## Idea central

Reddit te dice **qué duele**. LinkedIn te dice **a quién le duele**. Facebook e Instagram dan volumen y lenguaje, no conclusiones. Un dolor que aparece en tres plataformas es un patrón; en una, una hipótesis.

## Instalación

Formato abierto SKILL.md. Copia la carpeta completa:

| Entorno | Ruta |
|---|---|
| Claude Code (proyecto) | `.claude/skills/icp-community-research/` |
| Claude Code (global) | `~/.claude/skills/icp-community-research/` |
| Claude.ai / Cowork | Sube el `.skill` y pulsa "Save skill" |
| Codex | `.agents/skills/icp-community-research/` |
| Antigravity (workspace) | `.agents/skills/icp-community-research/` |
| Antigravity (global) | carpeta global de skills del producto |

`AGENTS.md` en la raíz del proyecto hace que Codex y Antigravity la apliquen aunque no descubran la skill por descripción.

## Primer uso

1. `cp config/icp.template.md config/icp.md` y rellénalo con la hipótesis actual.
2. Captura 30-60 comentarios reales de 2 plataformas distintas.
3. Pide: "analiza estos comentarios con icp-community-research".

## Nota

Todo el material de entrada lo captura el usuario a mano. La skill no scrapea ni publica: eso incumple las condiciones de casi todas las plataformas y pone en riesgo la cuenta desde la que vendes.
