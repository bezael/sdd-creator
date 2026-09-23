# bezael/sdd-creator — Skills de Dominicode

> [🇬🇧 English version](./README.md)

> Genera specs siguiendo la metodología **Spec-Driven Development**, según la adaptación de Dominicode (Bezael Pérez), en cualquier agente de IA: Claude, Codex, Gemini, Cursor, Aider, Continue.
>
> Antes de generar código, el agente produce `spec.md` (6 secciones y provenance opcional del Issue), `plan.md` (decisiones técnicas) y `tasks.md` (tareas TDD con evidencia objetiva de finalización) bajo `specs/<feature-slug>/`.
>
> Después dirige Implement → Verify → Fix, Code Review contra requisitos y Final Verification antes del PR/hand-off. Mantiene **`specs/INDEX.md` como memoria del proyecto**, conserva la trazabilidad completa y sigue siendo Markdown plano, agnóstico de herramienta y sin dependencias.

---

## Catálogo de skills

### Engineering

| Skill | Descripción |
|-------|-------------|
| `dominicode-sdd-creator` | Lifecycle completo de Spec-Driven Development — Issue/understanding, spec/plan/tasks, implementación con evidencia, review, verificación final y PR/hand-off. |
| `dominicode-harness-init` | Prepara el carril para trabajar con agentes: audita los comandos de verificación reales del repo y genera un `AGENTS.md` con las secciones Contract, Lane y Verdict, más plantillas de spec y PR. |

---

## Instalación rápida (recomendada)

```bash
npx skills@latest add bezael/sdd-creator
```

El CLI te pregunta qué skills instalar y en qué agentes (Claude Code, Cursor, Codex, etc.) y lo configura automáticamente.

> 💡 **Cómo actualizar:** Para actualizar una instalación existente a la última versión, simplemente vuelve a ejecutar el comando de arriba. Para instalaciones manuales, vuelve a ejecutar los comandos de copia respectivos.
>
> Nota: el número de versión que imprime el CLI `skills` al arrancar es la versión del propio CLI, no la de esta skill. La versión de la skill instalada se comprueba en `CHANGELOG.md` o en las releases de GitHub.

---

## Instalación manual (fallback por agente)

### Claude Code (Anthropic)

**Opción A — Skill global (recomendado):**

```bash
# Copia la skill a tu directorio de skills personales
cp -r skills/engineering/dominicode-sdd-creator ~/.claude/skills/
cp -r skills/engineering/dominicode-harness-init ~/.claude/skills/

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
│       ├── dominicode-harness-init/
│       │   ├── SKILL.md           ← Claude Code
│       │   ├── AGENTS.md          ← otros agentes
│       │   ├── templates/
│       │   │   ├── AGENTS.template.md
│       │   │   ├── spec.template.md
│       │   │   └── pr.template.md
│       │   └── references/
│       │       └── generic-prompt.md
│       └── dominicode-sdd-creator/
│           ├── SKILL.md           ← Claude Code
│           ├── AGENTS.md          ← otros agentes
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
├── announcements/                ← copy de anuncios de releases (español)
├── AGENTS.md                     ← instrucciones del proyecto para cualquier agente
├── CHANGELOG.md
├── CLAUDE.md                     ← importa AGENTS.md para Claude Code
├── LICENSE
├── README.md
└── README.es.md
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
   - `tasks.md` incluye el estado de implementación del spec: **Not Started**, **In Progress** o **Completed**. Para completarse exige evidencia, review y Final Verification PASS.
7. Registrará el spec en `specs/INDEX.md` (memoria del proyecto) y reutilizará sus decisiones compartidas la próxima vez
8. **Solo entonces** empezará a programar, seleccionando tu estrategia de ejecución preferida:
   * **Turn-based (Paso a Paso):** Guías al agente tarea por tarea.
   * **Bucle Autónomo (Goal-based Loop):** Usa la capacidad de loop/goal del agente anfitrión cuando exista.
9. Para cada tarea, ejecutará `Verify`; si falla aplicará el fix mínimo válido y verificará otra vez. Un checkbox exige evidencia.
10. Ejecutará un Code Review independiente, empezando por requisitos y usando Issue, artefactos, diff real y resultados.
11. Ejecutará Final Verification, incluida la revalidación de evidencia previamente aprobada, antes del PR/hand-off.

---

## Contract Based Review Method (CBRM)

No te fías del código de la IA porque te parezca bien. Lo revisas contra un contrato.

```
Issue  ->  Contrato  ->  Carril  ->  Veredicto  ->  PR
          (criterios)  (harness)   (evidencia)
```

- **Contrato**: los criterios de aceptación de la spec, cada uno con el comando que lo prueba. Para features no triviales lo escribe `dominicode-sdd-creator`, y para Issues pequeños basta una plantilla ligera.
- **Carril**: dónde puede trabajar el agente y cómo se comprueba a sí mismo, es decir, el harness (loop corto y loop largo), los rojos conocidos, las convenciones y los límites. Lo genera `dominicode-harness-init` como el `AGENTS.md` del repo, solo con comandos que ha ejecutado de verdad.
- **Veredicto**: evidencia por criterio y un veredicto de alineación (`Exact`, `Tangling`, `Missing`) que se entrega en la PR. Tú lees el contrato y el veredicto, y solo abres el diff donde el veredicto está en rojo.

Método completo: [`references/cbrm.md`](./skills/engineering/dominicode-sdd-creator/references/cbrm.md).

---

## Si no quieres tests

Puedes decidirlo — pero tienes que **pedirlo**. Di con tus palabras que no quieres tests ("sin tests", "no quiero tests") y el agente cambia a **modo sin TDD**: el mismo `spec.md`, el mismo `plan.md`, la misma matriz de cobertura, y un `tasks.md` donde cada criterio de aceptación se verifica a mano (Given / When / Then) en vez de con un runner.

Dos cosas que el agente nunca hará: proponerte ese modo por su cuenta, o inferirlo porque dijiste "hazlo rápido" o "es un prototipo". La prisa es motivo para recortar alcance, no verificación.

El archivo degradado está escrito para convertirse, no para tirarse: añade un runner más adelante y cada comprobación manual se convierte en un test que falla, una a una, sin reescribir el spec.

---

## Filosofía

> **Understand → Spec → Plan → Tasks → Implement → Verify → Review → Final Verify → PR.** Las decisiones durables permanecen en spec, plan y tasks; la finalización exige evidencia.

La adaptación Dominicode de SDD está documentada en el libro y en los cursos de Dominicode:

- **Curso online** — [Construye con IA: de la idea al producto con Claude Code](https://www.udemy.com/course/construye-con-ia-de-la-idea-al-producto-con-claude-code/?referralCode=AECD9EA3796054DEDD5D) (Udemy)
- **Libro digital** — [SDD: Construye con control](https://leanpub.com/sdd-spec-driven-development) (Leanpub)
- **Libro físico** — [Spec-Driven Development: construir agentes proyecto](https://www.amazon.es/-/en/Spec-Driven-Development-construir-agentes-proyecto/dp/B0GW6HN48K/ref=tmm_pap_swatch_0?_encoding=UTF8&dib_tag=AUTHOR&dib=eyJ2IjoiMSJ9.8_Nr_CREQqyDdShal8UyRqcr3ftdcpnEePLWr8CRp8lfNCG-sv6OjDTMbGd3G2MP.d4mvOV0abTcNYbavuQe615dpMa41i88elPTIhzy2yRk) (Amazon)

---

## Créditos

Adaptación SDD: **Bezael Pérez** · [Dominicode](https://dominicode.com) · [YouTube](https://youtube.com/@dominicode)

Distribución libre bajo licencia MIT. Si la adaptas a tu equipo o producto, una mención es bienvenida.
