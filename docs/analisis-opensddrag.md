# Análisis: OpenSddRag vs. SDD-CREATOR

> Nota interna. Análisis del repo [`jjefersonad/OpenSddRag`](https://github.com/jjefersonad/OpenSddRag) y de los aprendizajes aplicados a `sdd-creator` en la v1.3.0.
> Fecha: 2026-06-10. Hechos verificados directamente contra GitHub (API + raw README).

---

## 1. Qué es OpenSddRag

Proyecto **muy reciente** (creado 2026-06-07, 0 estrellas, lenguaje principal Python, sin licencia ni descripción al momento del análisis) que aborda el **mismo problema que SDD-CREATOR — Spec-Driven Development para agentes de IA — pero con filosofía opuesta**: en lugar de markdown portable, monta **infraestructura** para dar memoria persistente con RAG.

### Arquitectura (verificada)

Dos paquetes independientes:

- **`mcp-server/` (Python)** — servidor MCP sobre **PostgreSQL + pgvector**. Modo `stdio` (local) o `SSE/HTTP` (remoto/Docker, puerto 8000).
- **`client/` (Node.js)** — CLI que conecta proyectos al servidor e instala configuración + skills.

**Memoria en 3 capas (tablas en Postgres):**

| Capa | Tabla | Contenido |
|------|-------|-----------|
| Semántica | `artifacts` | proposals, specs, designs, tasks — cada uno con embedding `vector(384)` |
| Episódica | `execution_traces` | log de acciones del agente, con embeddings para recall |
| Contexto | `sessions` | artefactos activos + JSON del proyecto |
| Relaciones | `artifact_relationships` | grafo de dependencias entre artefactos |
| Skills | `skills` | plantillas SDD (globales o por proyecto) |

- **RAG nativo:** embeddings `all-MiniLM-L6-v2` (384 dims) + índices **HNSW** en pgvector. Búsqueda semántica, no por keyword.
- Se levanta con `docker compose up` (Postgres :54326, server :8000). API keys con expiración/revocación para el modo remoto.

### Flujo SDD y comandos

Flujo de 8 fases: **propose → spec → design → tasks → apply → verify → sync deltas → archive**.

**13 comandos** `/opsr:*`: `propose`, `spec`, `design`, `tasks`, `apply`, `verify`, `sync`, `archive`, `explore` (investigar sin codear), `continue` (retomar trabajo), `status` (cambios activos), `flow` (guía interactiva), `search` (búsqueda semántica sobre todos los artefactos).

---

## 2. Sus ventajas reales

1. **Memoria persistente entre sesiones y proyectos** — recuerda specs/decisiones pasadas; un skill stateless empieza de cero cada vez.
2. **Búsqueda semántica** (`/search`) — encuentra artefactos relacionados por significado.
3. **Ciclo de vida más completo** — `explore`, `status`, `verify`, `archive` + grafo de dependencias.
4. **Trazas de ejecución** — auditoría de lo que hizo el agente (episodic memory).
5. **Multi-herramienta vía MCP** — Claude Code, OpenCode, cualquier cliente MCP.

---

## 3. La tensión central: dos filosofías opuestas

| | **SDD-CREATOR** (nuestro) | **OpenSddRag** |
|---|---|---|
| Dependencias | **Cero** (markdown puro) | Docker + Postgres + Python + Node |
| Distribución | `npx skills add` — instantáneo | Levantar servidor + DB |
| Memoria | (era) ninguna, stateless | Persistente + RAG |
| Multi-agente | Sí, vía `AGENTS.md` | Sí, vía MCP |
| Fricción de adopción | Mínima | Alta |
| Portabilidad / Git | Total (texto plano, diffeable) | Estado en base de datos |

**Conclusión:** la fortaleza de SDD-CREATOR es la **simplicidad y portabilidad**. Copiar la infraestructura de OpenSddRag (servidor + pgvector) traicionaría eso. Lo que vale la pena son los **conceptos** (memoria, contexto, ciclo de vida), capturados **sin romper el zero-dependency**.

---

## 4. Qué aprendimos y aplicamos (SDD-CREATOR v1.3.0)

Tres conceptos de OpenSddRag, reimplementados como **archivos versionables** (sin servidor, sin embeddings). Recall = leer un índice curado pequeño + `grep`/`Glob`, en lugar de búsqueda por embeddings.

### a) Memoria de proyecto → `specs/INDEX.md`
Equivalente file-based de la tabla `artifacts` + `artifact_relationships`. Índice committeado con tabla `Shared decisions` (decisiones transversales reutilizables) + tabla de specs (slug, visión, status, stack, specs relacionados). El skill lo lee en **Step 0.5** y lo reconcilia en hand-off.
- Nuevo: `templates/specs-index.md`.

### b) Inspección de codebase → nuevo **Step 0.5** (grounding)
Generaliza la detección que vivía solo en Step 3.5. Antes de escribir el spec, el agente inspecciona stack en uso, convenciones y specs previos, y emite un **"Project Context Snapshot"**. La arquitectura **ancla** en lo que ya existe en vez de inventar; Step 3.5 pasó a **confirmar** el test runner desde el snapshot.
- Nuevo: `references/codebase-inspection.md`.

### c) Validación de completitud → **coverage matrix**
`tasks.md` termina con una matriz que rastrea cada feature de spec §3 → contrato del plan → tasks. El hand-off se bloquea si hay **features huérfanas**. `plan.md` §7 refuerza la mitad spec→plan.
- Nuevo: `references/traceability.md`.

### Lo que NO adoptamos (a propósito)
- Servidor MCP, PostgreSQL, pgvector, Docker, embeddings → romperían el zero-dependency.
- Búsqueda semántica por embeddings → sustituida por índice curado + `grep`.
- Comandos extra de ciclo de vida (`explore`, `status`, `verify`, `archive`) → no seleccionados en este ciclo; candidatos para una iteración futura como modos del skill, no como comandos de servidor.

---

## 5. Posibles evoluciones futuras (no implementadas)

- Modos de ciclo de vida adicionales (`status`, `verify`, `archive`) como instrucciones del skill.
- Estimación de esfuerzo / risk scoring en `plan.md`.
- Generación de diagramas (Mermaid) para el modelo de datos.
- Capa MCP/RAG **opcional** documentada para quien quiera memoria semántica pesada (modelo híbrido), sin tocar el core zero-dependency.

---

*Análisis para Bezael Pérez · Dominicode. Los hechos de OpenSddRag reflejan el estado del repo el 2026-06-10 y pueden cambiar.*
