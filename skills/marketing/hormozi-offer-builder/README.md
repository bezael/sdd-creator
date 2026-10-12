# Hormozi Offer Builder · Skill para Claude Code

Agente especializado en construir ofertas que el cliente no pueda rechazar. Usa la Value Equation de Alex Hormozi y las 6 dimensiones de toda oferta: Promesa, Precio, Riesgo, Tiempo, Sacrificio, Escasez.

## Qué hace

Cuando estés diseñando o refinando una oferta, esta skill se carga sola y trabaja en uno de dos modos según cómo arranques la conversación:

- **Modo construcción guiada:** si tenés una idea pero no una oferta formada. Va dimensión por dimensión hasta tener oferta completa.
- **Modo análisis y refinado:** si ya tenés una oferta (aunque sea floja), la audita en las 6 dimensiones, identifica la más débil y propone cambios concretos.

El agente decide solo qué modo usar en base al primer mensaje. Si no queda claro, hace una pregunta — no un cuestionario largo.

## Personalidad del agente

- **Astuto.** Entiende por qué la gente compra y por qué no.
- **Honesto.** Si la oferta es floja, lo dice — con razón concreta y alternativa.
- **Constructivo.** El objetivo es que salgas con una oferta más fuerte, no con tu ego más débil.
- **Específico.** Nada de "mejorá la promesa". Sí "cambiá 'aprenderás X' por 'en 30 días tenés Y'".
- **Directo.** Sin emojis, sin superlativos vacíos, sin coaching motivacional.

## Cómo se activa

Se activa automáticamente cuando le pidas a Claude Code cosas como:

- "Ayúdame a construir una oferta para mi curso"
- "Mi oferta no convierte, ¿qué le pasa?"
- "Quiero armar un workshop, no sé cómo estructurar la oferta"
- "Auditá esta propuesta de venta"
- "Hacé que la gente diga lo quiero ya"

No tenés que invocarla manualmente. Claude lee la descripción de la skill y decide cuándo es relevante.

## Instalación

### Opción A · Skill global (todos tus proyectos)

```bash
unzip hormozi-offer-builder.zip -d ~/.claude/skills/
```

### Opción B · Skill por proyecto

```bash
unzip hormozi-offer-builder.zip -d /ruta/a/tu/repo/.claude/skills/
```

### Verificar que cargó

Abrí Claude Code en el directorio donde la instalaste y decí:

```
¿Qué skills tenés disponibles?
```

Tenés que ver `hormozi-offer-builder` listada con su descripción.

## Uso · ejemplos

### Construcción desde cero

```
Tengo una idea para un curso de UI/UX con IA dirigido a diseñadores
sin background técnico. Ayudame a construir la oferta.
```

El agente arranca preguntando por el avatar, valida cada dimensión y al final te entrega la oferta completa con stack, garantía, escasez y ratio valor/precio.

### Análisis de oferta existente

```
Esta es mi oferta actual del workshop:
- Workshop de 2 días por $87
- Bonus: vault de Obsidian, comunidad Telegram, Q&A posterior
- Garantía de 14 días
¿Qué le falta?
```

El agente audita las 6 dimensiones, identifica la más débil y propone los 3 movimientos de mayor impacto.

### Modo híbrido

```
Tengo claro el producto y la promesa pero no sé qué garantía poner
ni cómo crear urgencia honesta sin que parezca presión.
```

El agente solo trabaja las dimensiones que faltan. No te re-pregunta lo que ya está claro.

## Cómo se complementa con otras skills

| Skill | Cuándo se usa |
|---|---|
| `hormozi-offer-builder` (esta) | Diseñar o refinar la **oferta** |
| `hormozi-landing-audit` | Auditar cómo se comunica la oferta en una **landing page** |

Flujo recomendado:
1. Construir la oferta con esta skill.
2. Documentarla en la plantilla `plantilla_oferta_hormozi_v2.xlsx`.
3. Escribir la landing.
4. Auditar la landing con `hormozi-landing-audit`.

## Cómo personalizarla

El `SKILL.md` es markdown editable. Para ajustar:

- **Cambiar la personalidad:** edita la sección "Tu personalidad". Si querés que sea más cálido o más cortante, ajustá ahí.
- **Añadir tu plantilla como referencia:** ya está mencionada en "Integración con otros activos".
- **Añadir ejemplos específicos:** si tenés ofertas tuyas que ya funcionan, añadilas como ejemplos al final del archivo. La skill aprenderá tu voz.

## Estructura

```
hormozi-offer-builder/
├── SKILL.md          ← instrucciones del agente (no editar el frontmatter sin cuidado)
└── README.md         ← este archivo
```

El frontmatter de `SKILL.md` tiene dos campos críticos:
- `name`: identificador único (no usar espacios).
- `description`: lo que Claude lee para decidir si activarla. Si lo cambias, mantené las palabras clave: "oferta", "Hormozi", "irresistible", "construir", "promesa", "precio", "garantía", "escasez".

## Iteración

Esta skill es la v1. Después de 3–5 conversaciones reales con el agente, vas a ver patrones que querés ajustar:
- Preguntas que hace de más o de menos.
- Edge cases que no contemplé.
- Ejemplos que vendrían bien para tu nicho específico.

Editá el `SKILL.md`, guardalo en tu repo, y la próxima vez se va a comportar mejor.
