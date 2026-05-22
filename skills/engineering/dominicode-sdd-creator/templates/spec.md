# Spec — [Nombre del feature/producto]

> Plantilla Spec-First de Dominicode (Bezael Pérez).
> Rellena cada sección **en orden**. No avances a `plan.md` hasta tener las 6 secciones cerradas.

---

## SECCIÓN 1 — Visión del producto

> La descripción más corta y clara de lo que construyes. **Una o dos oraciones máximo**. Si no puedes explicarlo en dos oraciones, aún no está claro — vuelve a pensarlo antes de seguir.

**Preguntas guía:**
- ¿Qué hace exactamente este producto / feature?
- ¿Para quién es?
- ¿Qué problema resuelve en una frase?

**Visión:**
[Escribe aquí — 1 o 2 oraciones, no más]

---

## SECCIÓN 2 — Usuarios y casos de uso

> Quién usa el producto y para qué. **No perfiles de marketing** — acciones concretas que realiza cada tipo de usuario.

**Preguntas guía:**
- ¿Quién es el usuario principal?
- ¿Hay usuarios con roles diferentes? (admin, usuario estándar, visitante, sistema)
- ¿Cuáles son las 3 acciones principales que hace cada uno?

**Usuarios:**

**Usuario [rol 1]:** [acción 1], [acción 2], [acción 3].

**Usuario [rol 2]:** [acción 1], [acción 2], [acción 3].

---

## SECCIÓN 3 — Funcionalidades

> La lista completa de lo que hace el sistema, organizada por módulos. Usa **siempre** la forma "El usuario puede..." o "El sistema permite/realiza...". Esto te fuerza a pensar desde el comportamiento, no desde el código.

**Preguntas guía:**
- ¿Qué módulos tiene el sistema?
- ¿Qué puede hacer el usuario en cada módulo?
- ¿Qué hace el sistema automáticamente?

**Módulo [nombre]:**
- El usuario puede [acción].
- El usuario puede [acción].
- El sistema permite [acción automática].

**Módulo [nombre]:**
- El usuario puede [acción].
- El sistema calcula [algo] automáticamente.
- El usuario puede [acción].

> Añade tantos módulos como necesites. Si un módulo tiene menos de 2 funcionalidades, probablemente debe fusionarse con otro.

---

## SECCIÓN 4 — Flujos de usuario

> Los pasos exactos que sigue un usuario para completar cada acción principal. **Cada flujo debe incluir al menos un caso de error**, no solo el happy path.

**Preguntas guía:**
- ¿Cuáles son las 3–5 acciones más importantes del producto?
- ¿Qué pasos sigue el usuario para completar cada una?
- ¿Qué pasa si algo sale mal en cada paso?

**Flujo — [nombre de la acción principal]:**
1. El usuario [acción inicial].
2. El sistema [respuesta].
3. El usuario [siguiente paso].
4. El sistema [resultado final].
- **Error:** si [condición de fallo], el sistema [comportamiento de error].

**Flujo — [otra acción principal]:**
1. ...
2. ...
- **Error:** ...

> Mínimo 3 flujos, máximo 5. Si tienes más de 5 flujos principales, el alcance es demasiado grande para una sola spec — divídelo.

---

## SECCIÓN 5 — Arquitectura

> La estructura técnica del sistema. Qué componentes necesita, cómo se comunican, qué tecnologías usar. Si no tienes decisiones técnicas previas, escribe **"A decidir con el agente"** y el plan.md lo resolverá con trade-offs explícitos.

**Preguntas guía:**
- ¿Es una app web, móvil, CLI, o varias?
- ¿Necesita backend propio o puede usar servicios externos (BaaS)?
- ¿Cómo se almacenan los datos?
- ¿Hay autenticación de usuarios?
- ¿Se integra con otros servicios o APIs?

**Arquitectura propuesta:**

- **Frontend:** [framework + por qué, o "a decidir"]
- **Backend:** [framework / serverless / BaaS, o "a decidir"]
- **Base de datos:** [tipo + producto, o "a decidir"]
- **Autenticación:** [proveedor, o "a decidir"]
- **Hosting:** [dónde se despliega, o "a decidir"]
- **Integraciones:** [APIs externas necesarias]

---

## SECCIÓN 6 — Requisitos no funcionales

> Las restricciones que el sistema debe cumplir aunque el usuario no las vea directamente. Muchos proyectos los ignoran hasta que el problema aparece en producción.

**Preguntas guía:**
- ¿Cuántos usuarios simultáneos necesita soportar?
- ¿Hay datos sensibles? (PII, pagos, salud)
- ¿Necesita funcionar sin conexión?
- ¿En qué idiomas?
- ¿Hay requisitos de accesibilidad o compliance? (GDPR, WCAG)

**Requisitos:**

- **Rendimiento:** [ej. carga inicial < 3s, respuesta API < 500ms]
- **Seguridad:** [ej. datos de cada usuario aislados; cifrado en tránsito; sin almacenar passwords en claro]
- **Escalabilidad:** [ej. diseñado para hasta 1.000 usuarios en v1]
- **Idioma:** [ej. español en v1, inglés en v2]
- **Accesibilidad:** [ej. WCAG 2.1 AA en formularios críticos, o "no aplica en v1"]
- **Compliance / privacidad:** [ej. GDPR si hay usuarios UE, o "no aplica"]

---

## Open questions

> Si quedan decisiones que no se pueden tomar ahora, lístalas aquí. **Cada open question debe tener un responsable y una fecha**, o se queda en limbo.

- [ ] [Pregunta abierta] — owner: [quien], deadline: [fecha]
- [ ] ...

---

*Cuando todas las secciones estén cerradas y los open questions resueltos (o explícitamente diferidos), pasa a `plan.md`.*
