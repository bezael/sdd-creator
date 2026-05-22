# AGENTS.md — Dominicode SDD Creator

> Versión espejo del `SKILL.md` para agentes que adoptan el estándar [AGENTS.md](https://agents.md): Codex CLI, Cursor, Gemini CLI, Aider, Continue, y otros. Contenido equivalente, sin el frontmatter YAML específico de Anthropic.
>
> Metodología por **Bezael Pérez · Dominicode**.

---

## Propósito

Este archivo instruye al agente para que **antes de generar código** de cualquier feature o producto no trivial, ejecute el flujo Spec-Driven Development de Dominicode: producir `spec.md`, `plan.md` y `tasks.md` (con TDD) bajo `specs/<feature-slug>/`.

## Cuándo activar este flujo

Activa el flujo SDD al **inicio** de cualquier trabajo de código no trivial, incluso si el usuario no dijo la palabra "spec". Señales:

- Frases como "quiero construir...", "vamos a hacer una app de...", "diseña X", "scaffold de...", "empieza un MVP de..."
- Una descripción de feature sin artefactos previos de planificación
- Un pedido que toca más de un módulo, capa o pantalla
- Un pedido que normalmente generaría >100 líneas de código

**No** actives para:
- Bug fixes con repro clara
- Refactors pequeños en un solo archivo
- Preguntas puras ("¿cómo funciona X?")
- Continuación de trabajo donde ya existe `specs/<name>/spec.md` → léelo en su lugar

---

## Workflow híbrido

### Paso 0 — Detectar nivel de contexto

| Nivel | Señal | Acción |
|-------|-------|--------|
| **ALTO** | PRD detallado, ticket, o 3+ párrafos | Draft completo + lista "Open questions" |
| **MEDIO** | 1–2 frases con goal claro | Draft con `[NEEDS CONFIRMATION: ...]` en lo incierto |
| **BAJO** | "quiero hacer una app de X" | Entrevistar **una sección a la vez**, no las 6 de golpe |

Anuncia al usuario qué modo detectaste antes de empezar.

### Paso 1 — Elegir slug del feature

Pide o infiere un kebab-case (ej. `invoice-generator`). Los artefactos van bajo `specs/<feature-slug>/`.

### Paso 2 — Escribir `spec.md` (6 secciones, en orden)

Usa el template en `templates/spec.md`. Reglas estrictas:

1. **Visión** — Máximo 2 oraciones. Si no entra, la idea no está clara.
2. **Usuarios** — Acciones concretas por rol, no marketing personas. Formato: `Usuario [rol]: acción 1, acción 2, acción 3`.
3. **Funcionalidades** — Frases tipo `El usuario puede ...` / `El sistema permite ...`. Organizadas por módulo. **No negociable.**
4. **Flujos** — 3–5 acciones principales con pasos exactos. **Cada flujo lleva al menos un caso de error.**
5. **Arquitectura** — Si el usuario no tiene preferencia, escribe `A decidir con el agente` y propone 2–3 stacks con trade-offs en `plan.md`. No inventes silenciosamente.
6. **NFRs** — Mínimo: rendimiento, seguridad, escalabilidad, idioma. Más si aplica.

**Detente y pide confirmación al usuario antes de seguir.**

### Paso 3 — Escribir `plan.md`

Template en `templates/plan.md`. Cubre: stack final con justificación, modelo de datos, contratos (API o componentes), dependencias externas, riesgos + mitigaciones, orden de construcción.

**Confirma con el usuario antes de seguir al Paso 3.5.**

### Paso 3.5 — Verificar el test runner (puerta antes del TDD)

**Sin runner de tests no hay TDD.** Antes de escribir `tasks.md`, verifica que el proyecto tenga runner — o que instalarlo sea la primera tarea.

Inspecciona la raíz del proyecto (o pregunta al usuario si no tienes filesystem):

1. **Detecta ecosistema**: `package.json` → Node, `pyproject.toml`/`requirements.txt` → Python, `Cargo.toml` → Rust, `go.mod` → Go, `Gemfile` → Ruby, `pom.xml`/`build.gradle` → Java/Kotlin, `composer.json` → PHP, `pubspec.yaml` → Dart, `*.csproj` → .NET.
2. **Busca runner instalado** en las dev dependencies del manifiesto Y archivos/carpetas de tests (`tests/`, `__tests__/`, `*.test.*`, `*_test.go`, `spec/`, etc).
3. **Clasifica**:
   - **A. Runner instalado + hay tests** → úsalo. No propongas otro.
   - **B. Runner instalado pero no hay tests aún** → úsalo; la primera tarea 🔴 crea el scaffold.
   - **C. Proyecto existe pero sin runner** → **detente**. Propón el default del ecosistema (Vitest para Node-TS, pytest para Python, RSpec para Ruby, JUnit 5 para Java, xUnit para .NET — `cargo test` y `go test` son built-in). Confirma con el usuario. Las tareas de instalación van en Fase 0 de `tasks.md`.
   - **D. Greenfield** → el runner debe estar decidido en `plan.md` § "Stack final → CI / Tests". Si no está, vuelve y ciérralo antes de continuar.
   - **E. El usuario rechaza tener tests** → **la skill no aplica.** Sé honesto con el usuario: SDD sin TDD es media metodología. Ofrécele el fallback: producir `spec.md` + `plan.md` y omitir `tasks.md`. No cambies silenciosamente a tareas sin TDD.

Comunica el resultado al usuario en una frase antes de seguir al Paso 4 ("Detecté pytest en `pyproject.toml`, lo uso" / "No hay runner — te propongo Vitest, confirma").

Detalle completo y matriz por ecosistema en `references/test-runner-detection.md`.

### Paso 4 — Escribir `tasks.md` (TDD)

Template en `templates/tasks.md`. Para cada funcionalidad de la Sección 3:

1. ⚙️ Setup (si necesario)
2. 🔴 Red — test que falla
3. 🟢 Green — implementación mínima
4. 🔵 Refactor (opcional, solo si aporta)
5. 🔗 Integración (cuando cruza módulos o cierra módulo)

Detalle completo y anti-patterns en `references/tdd-workflow.md`.

### Paso 5 — Handoff

Indica al usuario que:
1. Los 3 archivos están en `specs/<feature-slug>/`
2. Para implementar, ejecutar la primera tarea no marcada de `tasks.md`, nada más
3. Si una tarea revela una decisión faltante: actualizar `spec.md` primero, no improvisar en código

---

## Estructura de salida

```
specs/
└── <feature-slug>/
    ├── spec.md
    ├── plan.md
    └── tasks.md
```

Si `specs/<feature-slug>/` ya existe, **léelo primero** y propón cambios en lugar de sobrescribir.

---

## Reglas duras

- ❌ Nunca escribir código de implementación en el mismo turno en que se crea la spec
- ❌ Nunca saltar la Sección 1 ni aceptar una Visión de más de 2 oraciones
- ❌ Nunca escribir un flujo solo con happy path
- ❌ Nunca elegir stack en silencio si el usuario no dio preferencia
- ❌ Nunca escribir una tarea 🟢 antes de su 🔴
- ❌ Nunca saltar el Paso 3.5 (verificación del runner) — sin runner no hay TDD
- ✅ Confirmar con el usuario entre Paso 2, Paso 3, Paso 3.5 y Paso 4
- ✅ Si la implementación revela un gap: actualizar `spec.md` → `plan.md` → `tasks.md` → entonces código

---

## Recursos referenciados

- `templates/spec.md` — plantilla de las 6 secciones
- `templates/plan.md` — plantilla del plan técnico
- `templates/tasks.md` — plantilla TDD
- `references/examples.md` — ejemplo trabajado completo
- `references/tdd-workflow.md` — detalle TDD y anti-patterns
- `references/test-runner-detection.md` — cómo verificar si el proyecto tiene runner, defaults por ecosistema, smoke test

Cárgalos solo cuando los necesites (progressive disclosure), no todos a la vez.

---

*Skill by **Bezael Pérez · Dominicode** — Construye con IA: De la Idea al Producto con Claude y Specs.*
