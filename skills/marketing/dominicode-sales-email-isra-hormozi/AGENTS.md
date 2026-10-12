# AGENTS.md — Sales Email — Estilo Isra Bravo + Alex Hormozi

<!-- Generated from SKILL.md by scripts/build-agents.mjs. Edit SKILL.md, not this file. -->

> Mirror of `SKILL.md` for agents that follow the [AGENTS.md](https://agents.md) standard: Codex CLI, Cursor, Gemini CLI, Aider, Continue and others. Same content, without the YAML frontmatter.

Esta skill genera emails de venta en español que mezclan dos voces:

- **Isra Bravo** aporta la apertura, el tono conversacional, el storytelling y el cierre con personalidad. Vende sin parecer que vende.
- **Alex Hormozi** aporta la construcción de la oferta: stack de valor, claridad brutal, reversión de riesgo y CTA inequívoco. Vende parecido a un sniper.

El resultado: un email que se lee como una carta de un amigo, pero cuyo bloque de oferta es quirúrgico.

---

## Cuándo activar esta skill

Trigger explícito cuando el usuario pide cualquier email para vender algo: lanzamiento de curso, workshop, infoproducto, tripwire, coaching, servicio freelance, webinar, plaza, mentoría, libro, comunidad de pago, etc. También cuando pide secuencias de email marketing o emails de nutrición con intención comercial.

No la uses para: emails transaccionales puros (confirmación de pago, reset de contraseña), emails internos de empresa, o emails sin intención de venta (newsletter pura de contenido sin oferta).

---

## Antes de escribir: pide o infiere estos inputs

Necesitas estos datos. Si faltan, pídelos en un solo bloque conciso. Si el contexto previo los aporta, úsalos sin preguntar.

1. **Producto/oferta**: qué se vende exactamente
2. **Avatar**: quién es el lector (nivel, contexto, dolor específico)
3. **Promesa principal**: el "después" que el producto entrega
4. **Precio y formato**: cuánto, qué incluye, cuándo se entrega
5. **Mecanismo único**: qué hace diferente esta solución (framework, método, ángulo)
6. **Prueba disponible**: testimonios, números, casos, autoridad
7. **Urgencia real**: cierre de carrito, plazas, bonus que expira (debe ser verdadera)
8. **Garantía o reversión de riesgo** (si existe)
9. **CTA destino**: link al checkout, calendario, formulario

Si el usuario solo da el tema, escribe el email con suposiciones razonables y marca entre corchetes los huecos `[REEMPLAZAR: ...]` para que los rellene.

---

## Las dos voces, destiladas

### Isra Bravo (apertura, tono, cierre)

- **Frases muy cortas. Párrafos de una o dos líneas. Saltos en blanco que respiran.**
- Empieza con una **escena, anécdota u observación cotidiana** que parece no tener nada que ver, y luego conecta con el producto. Ejemplos: paseo con el perro, conversación con su mujer, algo que vio en Twitter, algo que dijo un cliente, una bobada del supermercado.
- **Anti-marketing**: se ríe de los gurús, de las "fórmulas mágicas", del marketing palabrero. Esa burla genera confianza.
- **Auto-deprecación e ironía**. Se baja el ego. Sospecha de sí mismo.
- **Conversacional, casi de bar**. Como hablarle a un amigo en un mensaje de WhatsApp.
- Conectores tipo: *"Mira"*, *"Verás"*, *"Te cuento"*, *"Atento"*, *"Y resulta que"*, *"Pues bien"*, *"El caso es que"*, *"No te voy a engañar"*.
- **Vende negando que vende**: *"si no te interesa, perfecto. Pero si te interesa, esto es para ti"*. Cero presión aparente.
- **P.D. siempre potente**. Es la segunda cosa más leída. Resumen del beneficio o twist de urgencia.
- Firma sencilla, sin formalismos. Nombre y ya.

### Alex Hormozi (bloque de oferta)

- **Claridad brutal sobre qué se obtiene**. Listado con bullets de lo que incluye.
- **Stack de valor**: enumera cada componente y, si tiene sentido, su valor percibido. Hace que el precio final parezca una ganga.
- **Hyper-específico**: no "mejorarás tu productividad" sino "ahorrarás 6 horas a la semana". No "muchos alumnos" sino "47 alumnos".
- **Contraste antes/después**: el lector debe ver con claridad quirúrgica el cambio.
- **Reversión de riesgo**: garantía explícita, condiciones de devolución, "si no funciona, no pagas".
- **Urgencia genuina** atada al cierre: fecha, plazas, bonus que desaparece.
- **CTA único**, en imperativo claro: *"Apúntate aquí"*, *"Quiero entrar"*, *"Mi plaza"*. Nunca dos opciones, nunca "más información".

---

## Las tres capas del cerebro (qué activar en cada zona del email)

| Zona del email | Cerebro objetivo | Qué hacer |
|---|---|---|
| Asunto + hook | **Reptiliano** | Curiosidad, supervivencia, contraste, auto-referencia. Concreto y visual. |
| Historia + dolor | **Límbico** | Identificación, escena reconocible, emoción. "Esto me pasa a mí". |
| Solución + mecanismo | **Límbico + Reptiliano** | Esperanza concreta, mecanismo nuevo, contraste antes/después. |
| Oferta + prueba + garantía | **Neocórtex** | Datos, números, testimonios, garantía. La munición racional para autojustificarse. |
| CTA + P.D. | **Reptiliano** | Acción inmediata, urgencia, miedo a perderse algo. |

El orden de impacto es **reptiliano → límbico → neocórtex**. Nunca abras con datos. Nunca cierres con lógica.

---

## Estructura del output

Devuelve siempre **exactamente este formato**, en este orden:

```
ASUNTO: [una sola línea, <55 caracteres ideal]
PREHEADER: [una línea de apoyo, ~80-100 caracteres]

---

[Hook: 1-3 líneas. Escena, pregunta o afirmación que rompa la expectativa.]

[Historia / contexto: 3-6 líneas cortas, con saltos. Una escena reconocible.]

[Dolor agitado: el lector debe pensar "esto me pasa". Mucha especificidad.]

[Pivote a la solución: "y entonces..." / "el caso es que..." / "lo que hago yo es...".]

[Mecanismo único: por qué este enfoque es diferente. Nombrar el framework si lo hay.]

[OFERTA — estilo Hormozi:
Lo que te llevas:
- [Componente 1] — [resultado concreto]
- [Componente 2] — [resultado concreto]
- [Componente 3] — [resultado concreto]
- [Bonus / extra] — [resultado concreto]

Precio: [X €]
[Si aplica: garantía / reversión de riesgo en una línea]
]

[Prueba breve: testimonio, número, caso. Una o dos frases máximo.]

[Urgencia real: fecha de cierre, plazas, bonus que expira.]

[CTA único en su propia línea, en imperativo:]
👉 [Texto del CTA]
[URL]

[Cierre conversacional corto. Una línea.]

[Firma simple: nombre]

P.D. [Una sola P.D. potente: resumen del beneficio + recordatorio de urgencia, o un twist sorpresa.]
```

No añadas explicaciones tras el email. Si necesitas dejar huecos por falta de info, márcalos con `[REEMPLAZAR: descripción de qué falta]`.

---

## Reglas de estilo (críticas)

**SÍ hacer:**
- Tú (no usted, no vosotros)
- Frases cortas, una idea por línea
- Mucho aire entre párrafos (salto doble entre bloques de idea)
- Verbos concretos ("escribes", "lanzas", "vendes"), no abstractos ("optimizas", "potencias")
- Especificidad numérica donde se pueda (6 horas, 47 alumnos, 3 emails al día)
- Ironía suave y honestidad incómoda
- Negar que se vende mientras se vende
- Usar el "antes/después" para que el reptiliano compare

**NO hacer:**
- Saludos formales ("Estimado", "Querido alumno"). Empieza directo o con "Hola, [nombre]." simple.
- Cierres formales ("Atentamente", "Un cordial saludo"). Solo nombre.
- Adjetivos huecos ("increíble", "revolucionario", "transformador")
- Listas de features sin resultado asociado
- Más de un CTA por email
- Urgencia falsa ("¡últimas plazas!" si no es verdad)
- Emojis decorativos. Máximo uno funcional en el CTA (👉 o similar)
- Párrafos de más de 3 líneas
- Justificarse o pedir disculpas por vender
- "Espero que estés bien"
- Frases de coach motivacional ("creo en ti", "tú puedes")

---

## Ejemplos de aperturas que sirven

```
Hace tres semanas un alumno me escribió cabreado.
```

```
Mi mujer me preguntó ayer por qué sigo levantándome a las 5.
```

```
Esto que voy a contar va a sonar raro.
```

```
El lunes pasado un cliente me dijo algo que me dejó pensando.
```

```
Llevo 11 años en esto. Y todavía me sorprendo.
```

```
Hay un error que cometen el 90% de los developers cuando empiezan con Claude Code.
```

Evita aperturas tipo:
- "¿Sabías que...?" (a nadie le importa)
- "En el mundo actual..." (genérico)
- "Como bien sabes..." (asume confianza no ganada)
- "Te escribo para informarte..." (burocrático)

---

## Ejemplos de asuntos que funcionan

- `el error que cometí ayer (y me costó 200€)`
- `esto no es para ti`
- `lo que nadie te cuenta sobre [tema]`
- `[nombre del lector], una cosa rápida`
- `cierro mañana`
- `por qué dejé de usar [herramienta]`
- `la pregunta que me hizo un alumno el martes`

Patrones que evitar:
- Mayúsculas
- Signos de exclamación
- Emojis al inicio
- "Última oportunidad" sin contexto
- "Descuento exclusivo del 50%"

El asunto debe **sonar humano**, no a newsletter corporativa.

---

## Antes de entregar el email, verifica

- [ ] ¿El asunto es minúscula, curioso, humano?
- [ ] ¿El hook engancha sin parecer marketing?
- [ ] ¿Hay una historia o escena identificable?
- [ ] ¿El dolor está nombrado con especificidad?
- [ ] ¿La oferta tiene stack claro tipo Hormozi?
- [ ] ¿Hay un solo CTA?
- [ ] ¿La urgencia es real?
- [ ] ¿La P.D. punza?
- [ ] ¿Tu copia se leería en voz alta como una conversación o suena a folleto?

Si algo falla, reescribe esa zona específica antes de entregar.

---

## Referencias bundleadas

Para un ejemplo completo y anotado de cómo se ve un email final aplicando esta skill, consulta `references/ejemplo-completo.md`.

Para una lista ampliada de ganchos, transiciones y P.D. probados, consulta `references/banco-de-frases.md`.
