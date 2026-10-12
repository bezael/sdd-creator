# AGENTS.md — ICP Community Research

<!-- Generated from SKILL.md by scripts/build-agents.mjs. Edit SKILL.md, not this file. -->

> Mirror of `SKILL.md` for agents that follow the [AGENTS.md](https://agents.md) standard: Codex CLI, Cursor, Gemini CLI, Aider, Continue and others. Same content, without the YAML frontmatter.

Convierte comentarios crudos de cualquier comunidad online en tres salidas: **veredicto de ICP con evidencia**, **ranking de dolores** y **borradores de respuesta humanos y breves**.

La regla que gobierna todo: **no inventes señal**. Un comentario ambiguo es "sin señal", no es un ICP confirmado. El valor de este research está en distinguir lo que la gente dice de lo que nos gustaría que dijera.

## Antes de empezar

1. Lee `config/icp.md`. Si no existe, copia `config/icp.template.md` y pregunta al usuario lo mínimo para rellenarla: producto, quién crees que es el cliente, qué problema crees que resuelve, qué usan hoy en su lugar, qué te haría cambiar de opinión. Nada más: el resto sale del research.
2. Identifica la plataforma y lee la sección correspondiente de `references/plataformas.md`. Reddit, LinkedIn, Facebook, X, Instagram y YouTube dan señales distintas y se responden distinto: Reddit te dice **qué duele**, LinkedIn te dice **a quién le duele**. Si hay varias plataformas, analízalas por separado y cruza al final.
3. Confirma el material de entrada. Esta skill trabaja con contenido que el usuario captura a mano (copiar/pegar, capturas, export propio). No propongas scrapear ni automatizar publicaciones: va contra las condiciones de casi todas las plataformas y arriesga justo la cuenta desde la que el usuario vende.
4. Anonimiza al normalizar: alias tipo `U01`, `U02`. Nunca guardes nombres completos, enlaces a perfiles ni datos personales en los ficheros de trabajo.

## Flujo

### 1. Normalizar

Pasa el material crudo a la tabla de `templates/comentarios.csv`:

`id | plataforma | grupo/sub/cuenta | fecha | tipo (post/comentario) | texto | contexto`

Conserva el texto **literal**, con sus faltas y su jerga. El lenguaje exacto del cliente es el activo principal de este research: de ahí salen los titulares, los emails y los nombres de features.

### 2. Clasificar ICP

Para cada persona (no cada comentario), asigna: `ICP` / `Adyacente` / `Fuera` / `Sin señal`.

Usa la rúbrica de `references/analisis.md`, ajustada por plataforma según `references/plataformas.md`. Resumen: puntúa señales observables (rol o situación, madurez del problema, si ya intenta resolverlo, si ya paga por algo) y cita el fragmento que justifica cada punto. Si no hay fragmento, no hay punto.

"Sin señal" es una respuesta legítima y normalmente será la categoría más grande. Que lo sea no es un fallo del análisis, es el dato.

### 3. Extraer dolores

Por cada dolor detectado: verbatim + reformulación en una línea + categoría + intensidad (1-3) + si aparece dentro del ICP + qué hace hoy para resolverlo.

Prioriza señales de dolor caro: gasto de dinero, gasto de tiempo repetido, workaround manual, abandono ("lo dejé"), pregunta repetida por distintas personas.

### 4. Agregar y rankear

Ranking = frecuencia × intensidad media × % que aparece dentro del ICP.

Marca en qué plataformas aparece cada dolor. **Un dolor que solo aparece en una plataforma es una hipótesis; uno que aparece en tres es un patrón.** Es la mejor defensa contra el sesgo de cada comunidad.

Añade siempre dos apartados incómodos:
- **Dolores que tu producto no resuelve** (aunque sean los más frecuentes).
- **Evidencia en contra de tu hipótesis**: comentarios que contradicen el ICP o sugieren que el problema no duele lo bastante.

### 5. Veredicto

Rellena `templates/informe.md`. El veredicto es una de estas tres frases, nunca una intermedia difusa:
- "El ICP se confirma en esta muestra"
- "El ICP se confirma parcialmente: el segmento real parece ser X"
- "El ICP no se confirma en esta muestra"

Declara siempre tamaño de muestra y confianza. Con menos de 30 personas analizadas, dilo explícitamente: es una señal cualitativa, no una validación.

### 6. Redactar respuestas

Solo para dudas abiertas y reales. Lee `references/respuestas.md` antes de escribir la primera. Reglas base:

- **Máximo 60 palabras.** Idealmente 2-4 líneas. Ajusta al canal con `references/plataformas.md` (Reddit exige cero marketing; X, 1-2 frases; LinkedIn admite una línea más).
- **Responde la pregunta**, aunque la respuesta no lleve a tu producto.
- Sin saludo, sin "qué buena pregunta", sin emojis decorativos, sin negritas, sin listas con viñetas. Nadie comenta así en Facebook.
- Nunca abras con "Mira".
- Menciona tu producto solo si preguntan por herramientas o si resuelve exactamente eso, y siempre diciendo que es tuyo. Como mucho, 1 de cada 5 respuestas.
- Comprueba las normas de promoción del grupo o subreddit antes de mencionar nada. En muchos subs es baneo directo.
- Nada de cuentas múltiples, testimonios fingidos ni DM masivos. Una comunidad quemada no se recupera.

Entrega **3 variantes** por duda: solo ayuda / ayuda + pregunta de research / ayuda + mención honesta. Que elija el usuario.

## Salidas

Al terminar, entrega en este orden:

1. **Veredicto en 3 líneas** (arriba del todo, sin preámbulo).
2. Top 5 dolores con su verbatim más representativo.
3. Tabla de clasificación ICP, con la plataforma de cada persona.
4. Evidencia en contra.
5. Respuestas propuestas.
6. **Siguiente paso de research**: qué pregunta lanzar en el grupo para desambiguar lo que quedó "sin señal".

## Errores típicos que esta skill existe para evitar

- Contar como ICP a quien solo comparte el tema (un curioso no es un comprador).
- Convertir una queja suelta en un dolor validado.
- Confundir "mucha gente pregunta esto" con "mucha gente pagaría por esto". Anótalo como hipótesis, no como conclusión.
- Escribir respuestas que huelen a marca: largas, con estructura, con CTA.
- Rellenar huecos con lo que el producto ya hace. Si el dato no está en el comentario, no está.
- Mezclar plataformas en un solo montón. El mismo dolor pesa distinto en Reddit que en LinkedIn.
