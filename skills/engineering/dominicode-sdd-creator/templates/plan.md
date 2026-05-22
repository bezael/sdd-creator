# Plan técnico — [Nombre del feature/producto]

> Derivado de `spec.md`. **No empieces este archivo hasta que la spec esté confirmada por el usuario.**
> Si el spec cambia, este archivo se reescribe — no se parchea.

---

## 1. Stack final

> Decisiones cerradas, con una línea de justificación por cada una. Si la Sección 5 del spec decía "a decidir con el agente", aquí es donde lo decides — con trade-offs explícitos.

- **Frontend:** [tecnología] — [por qué, en 1 línea]
- **Backend / API:** [tecnología] — [por qué]
- **Base de datos:** [tecnología] — [por qué]
- **Autenticación:** [proveedor / patrón] — [por qué]
- **Hosting:** [dónde] — [por qué]
- **Test runner (unit):** [vitest / jest / pytest / rspec / cargo test / go test / junit / xunit / ...] — [por qué]. **Decisión obligatoria — sin runner no hay TDD.**
- **Test runner (E2E, si aplica):** [playwright / cypress / ...] — [por qué]
- **CI:** [GitHub Actions / GitLab CI / ninguno por ahora] — [cuándo se conecta]

### Stacks descartados

> Documenta brevemente qué considerados y por qué NO. Esto evita revisitar la misma decisión en 3 meses.

- **[Stack alternativo]:** descartado porque [razón].

---

## 2. Modelo de datos

> Las entidades principales y cómo se relacionan. Una línea por entidad.

- **[Entidad]** — campos clave: [campo1, campo2]. Relación: [pertenece a / tiene muchos ...].
- **[Entidad]** — campos clave: [...]. Relación: [...].

> Si el modelo es complejo (>6 entidades), añade un diagrama o ASCII en un anexo.

---

## 3. Contratos (API o componentes)

> Si es backend: lista los endpoints o handlers principales.
> Si es solo frontend: lista los componentes principales y su responsabilidad.

**Backend / API:**
- `[METHOD] /ruta` — [qué hace] — input: [...], output: [...]
- `[METHOD] /ruta` — [qué hace] — ...

**Frontend / componentes:**
- `<NombreComponente>` — [responsabilidad en 1 línea]
- `<NombreComponente>` — [...]

---

## 4. Dependencias externas

> Servicios y librerías clave. Para cada uno: por qué se eligió y cuál es el plan B si falla.

- **[Servicio / librería]** — uso: [...]. Plan B si falla: [...].

---

## 5. Riesgos técnicos y mitigaciones

> Lista 3–5 cosas que podrían salir mal. Para cada una: la mitigación.

- **Riesgo:** [descripción]. **Mitigación:** [acción concreta].
- **Riesgo:** [descripción]. **Mitigación:** [acción concreta].

---

## 6. Orden de construcción

> Qué módulo se construye primero, segundo, tercero. Justifica el orden.

1. **Módulo [X]** — primero porque [es la base que el resto necesita / mayor riesgo técnico / habilita demo más temprana].
2. **Módulo [Y]** — segundo porque [depende de X / desbloquea el flujo principal].
3. **Módulo [Z]** — al final porque [es marginal / depende de los anteriores].

---

## 7. Criterios de "hecho" para el plan

- [ ] Todas las funcionalidades del spec aparecen en el modelo de datos o en los contratos
- [ ] Cada riesgo tiene mitigación
- [ ] El orden de construcción es claro y no tiene ciclos
- [ ] **El test runner (unit, y E2E si aplica) está decidido y justificado**
- [ ] El usuario ha confirmado el stack

*Cuando los 5 puntos estén tickeados, pasa al Paso 3.5 (verificación del runner) y luego a `tasks.md`.*
