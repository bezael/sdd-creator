# TDD Workflow — encadenamiento Spec → Plan → Tests → Código

> Detalle del paso 4 del workflow. Define cómo se traducen las funcionalidades de la Sección 3 del spec en tareas TDD ejecutables.

---

## Principio

**Una funcionalidad del spec = al menos un ciclo Red → Green → Refactor.**

Si una funcionalidad necesita más de un ciclo (porque tiene sub-comportamientos), se descompone en varias filas de tareas, **pero todas comparten la misma funcionalidad fuente** del spec. Mantén la trazabilidad citando el bullet exacto del spec en cada test.

---

## El ciclo, en concreto

### 🔴 Red — escribir el test que falla

- El nombre del test es una traducción literal del bullet del spec: `"El usuario puede crear proyectos con nombre, cliente y tarifa"` → `it("crea un proyecto con nombre, cliente y tarifa", ...)`.
- El test debe fallar por la razón correcta (la lógica no existe), no por errores de sintaxis o imports rotos.
- Verifica que falla **antes** de marcar la tarea como avanzada al siguiente paso.
- Si no sabes cómo escribir el test, **el bullet del spec es ambiguo**. Vuelve al spec.

### 🟢 Green — mínima implementación que pasa el test

- "Mínima" en serio. Si el test pide que sume 2 + 2 y devuelva 4, `return 4` está permitido en green.
- La duplicación y los hardcodes se resuelven en el refactor, no en green.
- No anticipes funcionalidades futuras. Si el siguiente test va a forzarte a generalizar, perfecto, eso es TDD funcionando.

### 🔵 Refactor — limpieza opcional

- Solo si **mejora la claridad o elimina duplicación real**. "Refactor por refactorizar" no es una tarea.
- Tests TODOS verdes antes y después. Si rompes algo, vuelve atrás, no parches.
- Renombrar, extraer función/método, mover archivo, separar responsabilidades. NO añadir comportamiento.

---

## Naming de tests

Convención recomendada (alinea con la forma "El usuario puede…" del spec):

```
describe('[Módulo] — [Funcionalidad del spec]', () => {
  it('[comportamiento esperado en lenguaje natural]', () => { ... });
  it('falla si [precondición de error de la Sección 4]', () => { ... });
});
```

Ejemplo real:

```ts
describe('Módulo de horas — registrar horas trabajadas', () => {
  it('guarda una entrada con fecha, duración y descripción', () => { /* ... */ });
  it('actualiza el total del proyecto tras guardar', () => { /* ... */ });
  it('rechaza duraciones <= 0 con mensaje específico', () => { /* ... */ });
});
```

Notarás que **el tercer test** viene directamente del error path de la Sección 4 del spec. Esa es la razón por la que SDD obliga a escribir error paths: cada uno se convierte en un test.

---

## Cuándo añadir test de integración (🔗)

Tres situaciones:

1. **Cierre de módulo:** un test que ejercita 2–3 funcionalidades del módulo juntas, verificando que encajan.
2. **Flujo end-to-end:** uno por cada flujo de la Sección 4 del spec. El happy path y al menos un error path.
3. **NFR verificable:** rendimiento, seguridad, accesibilidad. No todos los NFRs se testean automáticamente; los que sí, van aquí.

Los tests unitarios cubren funcionalidades aisladas. Los de integración cubren flujos. **No los confundas** — si un test "unitario" levanta una base de datos, ya no es unitario.

---

## Anti-patterns frecuentes

| Anti-pattern | Por qué falla | Qué hacer en su lugar |
|---|---|---|
| Escribir test después del código | No es TDD, es "test-after". La presión psicológica de tener código ya escrito sesga el test hacia confirmar lo que hay, no hacia el comportamiento deseado. | Test primero, siempre. Si ya tienes código, bórralo o ignóralo hasta tener el test rojo. |
| Test que no falla nunca | Estás testeando un mock o una tautología. | Antes de implementar, corre el test y confirma que falla por la razón correcta. |
| Saltar el refactor "porque hay prisa" | La deuda se acumula en silencio. En 5 tareas el código está ilegible. | Refactor es opcional **por tarea**, pero el equipo debe revisar deuda cada cierre de módulo. |
| Test con múltiples asserts no relacionados | Falla un assert y no sabes qué se rompió de verdad. | Un comportamiento por test. Si necesitas varios asserts, todos deben describir el mismo comportamiento. |
| Implementar sin tener el bullet del spec correspondiente | Estás añadiendo funcionalidad fuera de alcance. | Si la implementación lo requiere, vuelve al spec y añade el bullet primero. |
| Tests E2E para todo | Lentos, frágiles, caros de mantener. | E2E solo para flujos críticos. La mayoría del comportamiento se cubre con unitarios. |
| Marcar 🟢 sin correr todos los tests | Pasa el test nuevo pero rompiste otro hace 2 tareas. | Antes de marcar verde, `npm test` (o equivalente) completo. |

---

## Plantilla de tarea TDD

Cada tarea en `tasks.md` sigue este formato:

```markdown
- [ ] 🔴 **Test: el usuario registra horas con fecha, duración y descripción**
      Archivos: `tests/horas/register.test.ts`
      Criterio: spec.md §3 → "El usuario puede registrar horas trabajadas con fecha, duración y descripción"
      Debe fallar al correr el test.

- [ ] 🟢 **Implementar registro de horas**
      Archivos: `src/horas/register.ts`, `src/horas/types.ts`
      Hace pasar el test rojo anterior. No añadir validación que no exija el test.

- [ ] 🔵 **Refactor: extraer validación a `validators.ts`**  (opcional)
      Archivos: `src/horas/register.ts`, `src/horas/validators.ts`
      Solo si el siguiente test rojo (validación de duración <= 0) va a duplicar lógica.
```

Tres campos no negociables: archivos que toca, criterio que satisface (con cita al spec), y el estado esperado al ejecutar.

---

## Cuándo detener el ciclo TDD y volver al spec

Estas señales indican que el problema **no es de código, es de spec**:

- El test rojo no se puede escribir porque el comportamiento esperado es ambiguo
- Dos tests del mismo módulo se contradicen
- La implementación mínima requiere una decisión arquitectónica no presente en `plan.md`
- Un error path no aparece en la Sección 4 pero claramente debería existir

Cuando ocurra: **para de codear**. Actualiza `spec.md` → confirma con el usuario → actualiza `plan.md` si afecta → regenera las tareas afectadas en `tasks.md` → retoma TDD desde el punto donde paraste.
