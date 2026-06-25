# bezael/sdd-creator — Skills de Dominicode

> [🇬🇧 English version](./README.md)

> Genera specs siguiendo la metodología **Spec-Driven Development**, según la adaptación de Dominicode (Bezael Pérez), en cualquier agente de IA: Claude, Codex, Gemini, Cursor, Aider, Continue.
>
> Antes de generar código, el agente produce `spec.md` (6 secciones), `plan.md` (decisiones técnicas) y `tasks.md` (lista TDD ordenada) bajo `specs/<feature-slug>/`.
>
> Primero **ancla el spec en tu proyecto existente** (stack, convenciones, specs previos), mantiene un **`specs/INDEX.md` como memoria del proyecto** y **verifica que cada funcionalidad llegue a una tarea** antes del hand-off — todo en Markdown plano, cero dependencias.

---

## Catálogo de skills

### Engineering

| Skill | Descripción |
|-------|-------------|
| `dominicode-sdd-creator` | Spec-Driven Development — ancla el spec en tu proyecto, escribe spec/plan/tasks antes de código y mantiene una memoria `specs/INDEX.md`. |

---

## Instalación rápida (recomendada)

```bash
npx skills@latest add bezael/sdd-creator
```

El CLI te pregunta qué skills instalar y en qué agentes (Claude Code, Cursor, Codex, etc.) y lo configura automáticamente.

---

## Instalación manual (fallback por agente)

### Claude Code (Anthropic)

**Opción A — Skill global (recomendado):**

```bash
# Copia la skill a tu directorio de skills personales
cp -r skills/engineering/dominicode-sdd-creator ~/.claude/skills/

# Verifica
ls ~/.claude/skills/dominicode-sdd-creator/SKILL.md
```

A partir de ahí, cualquier sesión de Claude Code tendrá la skill disponible.

**Opción B — Skill por proyecto:**

```bash
mkdir -p .claude/skills
cp -r skills/engineering/dominicode-sdd-creator .claude/skills/
```

### Claude.ai (web/desktop)

1. Empaqueta la skill: `zip -r dominicode-sdd-creator.skill skills/engineering/dominicode-sdd-creator/`
2. En Claude.ai → Settings → Skills → Upload skill → selecciona el `.skill`.

### Codex CLI (OpenAI)

```bash
# En el root del proyecto
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

En la primera línea del `.mdc` añade el frontmatter de Cursor:

```markdown
---
description: Dominicode SDD Creator — escribe spec antes de código
alwaysApply: true
---
```

### Gemini CLI (Google)

```bash
cp skills/engineering/dominicode-sdd-creator/AGENTS.md ./GEMINI.md
cp -r skills/engineering/dominicode-sdd-creator/templates ./templates
cp -r skills/engineering/dominicode-sdd-creator/references ./references
```

### Aider, Continue y otros compatibles con AGENTS.md

Copia `AGENTS.md` al root del proyecto junto con `templates/` y `references/`.

### Agentes sin soporte de archivos de instrucciones

Pega el contenido de `AGENTS.md` al inicio de tu system prompt.

---

## Estructura del repo

```
bezael/sdd-creator
├── .claude-plugin/
│   └── plugin.json               ← leído por el CLI npx skills y Claude Code
├── skills/
│   └── engineering/
│       ├── README.md
│       └── dominicode-sdd-creator/
│           ├── SKILL.md           ← Claude Code
│           ├── AGENTS.md          ← otros agentes
│           ├── templates/
│           │   ├── spec.md
│           │   ├── plan.md
│           │   ├── tasks.md
│           │   ├── implementation.md
│           │   └── specs-index.md
│           └── references/
│               ├── examples.md
│               ├── codebase-inspection.md
│               ├── tdd-workflow.md
│               ├── test-runner-detection.md
│               └── traceability.md
├── CLAUDE.md
├── LICENSE
└── README.md
```

---

## Cómo usar

Una vez instalada, describe lo que quieres construir:

```
"quiero hacer una app para que freelancers gestionen facturas"
"vamos a crear un dashboard de métricas de mi tienda"
"diseña una feature de autenticación con magic links"
```

El agente:
1. Detectará el nivel de contexto (alto / medio / bajo)
2. Anclará el spec en tu proyecto — detecta el stack en uso, convenciones y specs previos (un "Project Context Snapshot")
3. Te entrevistará o producirá un draft según el caso
4. Generará `specs/<feature>/spec.md` con las 6 secciones
5. Tras tu confirmación, generará `plan.md`
6. Tras tu confirmación, generará `tasks.md` con TDD — con una matriz de cobertura para que ninguna funcionalidad se quede sin tarea
7. Registrará el spec en `specs/INDEX.md` (memoria del proyecto) y reutilizará sus decisiones compartidas la próxima vez
8. **Solo entonces** empezará a programar, tarea por tarea

---

## Filosofía

> **Spec → Plan → Tests → Código.** Código es lo último que pasa, no lo primero.

La adaptación Dominicode de SDD está documentada en el libro y en los cursos de Dominicode:

- **Curso online** — [Construye con IA: de la idea al producto con Claude Code](https://www.udemy.com/course/construye-con-ia-de-la-idea-al-producto-con-claude-code/?referralCode=AECD9EA3796054DEDD5D) (Udemy)
- **Libro digital** — [SDD: Construye con control](https://leanpub.com/sdd-spec-driven-development) (Leanpub)
- **Libro físico** — [Spec-Driven Development: construir agentes proyecto](https://www.amazon.es/-/en/Spec-Driven-Development-construir-agentes-proyecto/dp/B0GW6HN48K/ref=tmm_pap_swatch_0?_encoding=UTF8&dib_tag=AUTHOR&dib=eyJ2IjoiMSJ9.8_Nr_CREQqyDdShal8UyRqcr3ftdcpnEePLWr8CRp8lfNCG-sv6OjDTMbGd3G2MP.d4mvOV0abTcNYbavuQe615dpMa41i88elPTIhzy2yRk) (Amazon)

---

## Créditos

Adaptación SDD: **Bezael Pérez** · [Dominicode](https://dominicode.com) · [YouTube](https://youtube.com/@dominicode)

Distribución libre bajo licencia MIT. Si la adaptas a tu equipo o producto, una mención es bienvenida.
