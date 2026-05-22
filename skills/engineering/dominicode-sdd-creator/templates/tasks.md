# Tasks — [Nombre del feature/producto]

> Derivado de `spec.md` + `plan.md`. **Ejecutar las tareas en orden estricto.**
> Para cada funcionalidad: 🔴 test que falla → 🟢 implementación mínima → 🔵 refactor (si aporta).
> Si una tarea revela que falta algo en el spec → **vuelve al spec primero**, no improvises en código.

---

## Convenciones

- **Checkbox** `[ ]` → pendiente / `[x]` → completada
- **Emojis** marcan la fase TDD:
  - ⚙️ Setup (no requiere test)
  - 🔴 Red — escribir test que falla
  - 🟢 Green — implementación mínima que hace pasar el test
  - 🔵 Refactor — cleanup sin cambiar comportamiento
  - 🔗 Integración — test que cruza módulos
- **Cada tarea lista** los archivos que toca y el criterio que satisface

---

## Fase 0 — Setup del proyecto y verificación del runner

> **Gate obligatorio:** sin runner de tests verificado, NO se puede empezar la Fase 1.
> Antes de generar esta fase, ya se hizo el Paso 3.5 (detección del runner). Escoge **una** de las dos rutas según el resultado.

### Ruta A — Runner ya existe en el proyecto

- [x] ⚙️ **Runner verificado:** [nombre, ej. vitest 1.6.0] detectado en `[archivo, ej. package.json]`. Comando: `[ej. npm test]`. (No requiere instalación.)
- [ ] ⚙️ **Confirmar que el runner ejecuta** — corre `[comando]` en el repo actual. Debe terminar sin error (puede no haber tests aún).

### Ruta B — Hay que instalar el runner

- [ ] ⚙️ **Instalar runner** — `[comando de instalación, ej. npm install -D vitest @vitest/ui]`.
- [ ] ⚙️ **Configurar runner** — `[archivos de config, ej. vitest.config.ts + script "test": "vitest" en package.json]`.
- [ ] ⚙️ **Smoke test del runner** — crear `tests/smoke.test.[ts|py|...]` con un test trivial (`expect(true).toBe(true)` o equivalente). Correr `[comando]` y verificar que **pasa**. Esto valida que la config funciona antes de empezar TDD real.

### Resto del setup (común a ambas rutas)

- [ ] ⚙️ **Inicializar proyecto si es greenfield** — `package.json`, `tsconfig.json` u otros manifiestos. Test: N/A.
- [ ] ⚙️ **Configurar linter / formatter** — [eslint, prettier, biome, ruff, rustfmt...]. Test: el comando del linter pasa con el repo actual.
- [ ] ⚙️ **Crear estructura de carpetas según `plan.md` sección 3** — Test: N/A.

> **No avances a Fase 1 hasta que el smoke test del runner pase en verde** (Ruta B) o el runner existente ejecute sin errores (Ruta A).

---

## Fase 1 — Módulo [primer módulo del orden en plan.md]

### Funcionalidad: [copiar literal de Sección 3 del spec]

- [ ] 🔴 **Test: [nombre del test]** — archivos: `tests/[modulo]/[caso].test.ts`. Criterio: `spec.md §3 → "El usuario puede [X]"`. Debe FALLAR al correrlo.
- [ ] 🟢 **Implementar [X]** — archivos: `src/[modulo]/[archivo].ts`. Hace que el test rojo pase. NO añadir código que no necesite el test.
- [ ] 🔵 **Refactor [opcional]** — archivos: `src/[modulo]/[archivo].ts`. Solo si mejora claridad. Tests siguen en verde.

### Funcionalidad: [siguiente del mismo módulo]

- [ ] 🔴 **Test: [...]** — ...
- [ ] 🟢 **Implementar [...]** — ...
- [ ] 🔵 **Refactor** — ...

### Cierre del módulo

- [ ] 🔗 **Test de integración del módulo** — verifica que las funcionalidades del módulo encajan entre sí. Archivos: `tests/[modulo]/integration.test.ts`.

---

## Fase 2 — Módulo [segundo módulo del orden en plan.md]

### Funcionalidad: [...]

- [ ] 🔴 **Test: [...]** — ...
- [ ] 🟢 **Implementar [...]** — ...
- [ ] 🔵 **Refactor** — ...

> Repite el patrón red → green → refactor para cada funcionalidad de cada módulo, en el orden definido en `plan.md` sección 6.

---

## Fase N — Flujos end-to-end

> Después de tener todos los módulos, escribe un test E2E por cada flujo de la Sección 4 del spec.

- [ ] 🔗 **E2E flujo: [nombre del flujo]** — happy path. Archivos: `tests/e2e/[flujo].test.ts`.
- [ ] 🔗 **E2E flujo: [nombre del flujo]** — caso de error definido en la spec. Archivos: `tests/e2e/[flujo]-error.test.ts`.

---

## Fase final — Requisitos no funcionales

> Para cada NFR de la Sección 6 del spec que sea verificable, una tarea.

- [ ] 🔗 **NFR rendimiento: [criterio]** — archivos: `tests/perf/[caso].test.ts` o herramienta de benchmark.
- [ ] 🔗 **NFR seguridad: [criterio]** — archivos: `tests/security/[caso].test.ts` o auditoría manual.
- [ ] ⚙️ **NFR idioma: [criterio]** — i18n configurado, strings extraídos.

---

## Reglas de ejecución

1. **Una tarea a la vez.** No abras dos en paralelo en la misma sesión.
2. **Antes de marcar 🟢 completada:** corre los tests y verifica que el test correspondiente pasa.
3. **Antes de marcar 🔵 completada:** corre TODOS los tests y verifica que siguen en verde.
4. **Si una tarea revela ambigüedad en el spec:** detén la ejecución, actualiza `spec.md` y `plan.md`, y regenera las tareas afectadas. No improvises en código.
5. **Commits:** uno por tarea completada. Mensaje sugerido: `[fase] feat(modulo): descripción — task #N`.
