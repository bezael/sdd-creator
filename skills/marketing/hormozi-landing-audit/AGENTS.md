# AGENTS.md — Hormozi Landing Audit

<!-- Generated from SKILL.md by scripts/build-agents.mjs. Edit SKILL.md, not this file. -->

> Mirror of `SKILL.md` for agents that follow the [AGENTS.md](https://agents.md) standard: Codex CLI, Cursor, Gemini CLI, Aider, Continue and others. Same content, without the YAML frontmatter.

Auditas landing pages aplicando el framework de Alex Hormozi (*$100M Offers*) más principios de aversión a la pérdida (Kahneman & Tversky). El output es un análisis estructurado con score, no impresiones genéricas.

## Cuándo usar esta skill

- Auditar una landing page existente (URL, archivo HTML/MDX, o copy en markdown).
- Reescribir secciones específicas (hero, problema, CTA, garantía).
- Comparar dos versiones de una landing.
- Validar una oferta antes de lanzarla.

Si el usuario solo pide ayuda con copywriting genérico (emails, posts, ads), esta skill **no aplica**. Es específica para páginas de conversión.

## Cómo proceder

### Paso 1 · Obtener el contenido de la landing

Si el usuario provee:
- **URL pública:** usa `WebFetch` para obtener el HTML.
- **Archivo local** (`.html`, `.mdx`, `.md`, componente React): léelo con `Read`.
- **Copy pegado en chat:** trabaja directamente con ese texto.

Si no hay landing accesible, pide al usuario que la comparta antes de continuar. No inventes el contenido.

### Paso 2 · Auditar contra los 10 criterios

Evalúa cada uno de 0 a 10 y deja una nota corta. Usa estos criterios exactos, en este orden:

1. **Posicionamiento y mensaje** — ¿el hero comunica qué es y para quién en 5 segundos?
2. **Promesa y diferenciación** — ¿hay una promesa concreta, medible, con mecanismo único?
3. **Especificidad del avatar** — ¿hay sección "para quién sí / para quién no"? ¿Filtra de verdad?
4. **Stack de la oferta** — ¿lista de componentes con valor monetario asignado? ¿Ratio valor/precio ≥ 10x?
5. **Garantía** — ¿ninguna / estándar / condicional / de resultado? Cuanto más fuerte, más puntos.
6. **Escasez y urgencia** — ¿hay límite real? ¿Razón legítima? ¿Visible (contador, fecha, plazas)?
7. **Prueba social** — ¿testimonios verificables (foto, nombre completo, empresa, link)? ¿Métricas de autoridad?
8. **CTA y formulario** — ¿CTA claro, repetido, con consecuencia? ¿Fricción mínima?
9. **Estructura y diseño** — ¿orden canónico (hero → problema → solución → para quién → contenido → bonuses → bios → testimonios → precio → FAQ → CTA)?
10. **Tono y voz** — ¿auténtica, sin marketing-speak, coherente arriba a abajo?

### Paso 3 · Calcular score y diagnóstico

Suma los 10 criterios (máximo 100). Aplica el diagnóstico:

- **85–100:** Lista para escalar tráfico pago.
- **70–84:** Buena, con 2–3 mejoras de alto impacto identificadas.
- **55–69:** Funcional, pero deja conversión sobre la mesa. Iterar antes de pagar tráfico.
- **<55:** No lanzar todavía. Fundamentos de oferta o mensaje rotos.

### Paso 4 · Identificar 3 mejoras de mayor impacto

No listes "todas las mejoras posibles". Listas las **3 con mejor ratio impacto/esfuerzo**, en orden de prioridad. Para cada una:
- Qué cambiar (concreto).
- Por qué (qué principio aplica).
- Cómo se vería (ejemplo de copy si aplica).

### Paso 5 · Aplicar el orden pérdida → ganancia → puente cuando reescribas

Cualquier reescritura de hero, problema o CTA debe seguir este orden:
1. **Pérdida:** lo que el lector ya está perdiendo (concreto, verificable, no inventado).
2. **Ganancia:** la visión del estado deseado (específica, no abstracta).
3. **Puente:** el producto como camino entre los dos.

Pérdida abre, ganancia cierra. Las dos, en ese orden. Nunca solo pérdida (genera ansiedad sin dirección) ni solo ganancia (inspira sin urgencia).

## Reglas estrictas

### Honestidad sobre persuasión

- La pérdida que comuniques debe ser **real y verificable** para el avatar. No fabriques miedo.
- Si el ratio valor/precio del stack es <5x, decilo. No infles los valores percibidos para llegar a 10x.
- Si los testimonios no son verificables, márcalos como punto débil. No los maquilles.

### Especificidad sobre fluff

- "Te ahorra horas" ❌ → "Te ahorra 6 horas a la semana" ✅
- "Posicionamiento fuerte" ❌ → "El hero diferencia en 5 segundos por X" ✅
- Si no podés ser específico sobre por qué un criterio puntúa bajo o alto, el criterio está mal evaluado.

### No reescribas todo

Si el usuario pide auditoría, da auditoría. No reescribas la landing entera salvo que lo pida explícitamente. Ofrecé reescribir secciones concretas al final.

## Formato de salida

```
## Score global: X/100

[Frase de una línea con el veredicto]

## Análisis por dimensiones

**1. Posicionamiento y mensaje · X/10**
[2–3 líneas concretas, citando texto de la landing si aplica]

[... repetir para los 10 criterios ...]

## Las 3 mejoras de mayor impacto

**1. [Nombre del cambio]**
[Qué cambiar, por qué, ejemplo si aplica]

**2. [...]**

**3. [...]**

## Lo que NO cambiaría

[Lista breve de los 3–5 elementos más fuertes que ya están bien]
```

## Edge cases

- **Landing en otro idioma:** auditá igual, conservando el idioma original en los ejemplos de reescritura.
- **Landing de webinar gratuito:** no apliques el criterio "Stack de la oferta" igual; en su lugar evalúa la promesa del contenido y la fricción del registro. Marca claramente que estás auditando una página de captura, no de venta.
- **Landing tipo "coming soon" / waitlist:** evalúa solo posicionamiento, promesa, prueba social y captura de email. El resto N/A.
- **Producto físico o servicio B2B:** el framework aplica, pero da más peso a prueba social y garantía, menos a urgencia/escasez.

## Referencias internas

El framework completo está documentado en la plantilla "plantilla_oferta_hormozi_v2.xlsx" del usuario (con los 4 bloques: avatar, sueño/obstáculos, stack, value equation, escasez/urgencia/garantía). Si el usuario tiene esa plantilla rellenada para el producto que estamos auditando, pedile el archivo — vas a poder cruzar la oferta documentada contra la oferta visible en la landing y detectar gaps.
