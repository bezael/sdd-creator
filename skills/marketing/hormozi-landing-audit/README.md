# Hormozi Landing Audit · Skill para Claude Code

Skill que audita landing pages de productos digitales aplicando el framework de Alex Hormozi (*$100M Offers*) más principios de aversión a la pérdida.

## Qué hace

Cuando trabajás en una landing page (revisándola, mejorándola, o pidiendo feedback), Claude Code carga esta skill automáticamente y aplica un framework consistente:

- **10 criterios de evaluación** con score de 0 a 100.
- **3 mejoras de mayor impacto** identificadas con ratio impacto/esfuerzo.
- **Reescrituras opcionales** siguiendo el orden pérdida → ganancia → puente.
- **Reglas estrictas de honestidad**: nada de inflar testimonios o fabricar miedo.

## Cómo se activa

La skill se activa automáticamente cuando le pidas a Claude Code cosas como:

- "Audita esta landing de mi workshop"
- "Revisame el copy de la página de ventas"
- "Dame un score de esta landing al estilo Hormozi"
- "¿Cómo mejoro la conversión de esta página?"
- "Reescribime el hero de esta landing"

No tenés que invocarla manualmente. Claude lee la descripción de la skill y decide cuándo es relevante.

## Instalación

### Opción A · Skill global (todos tus proyectos)

```bash
mkdir -p ~/.claude/skills
cp -r hormozi-landing-audit ~/.claude/skills/
```

### Opción B · Skill por proyecto (solo el repo actual)

```bash
mkdir -p .claude/skills
cp -r hormozi-landing-audit .claude/skills/
```

Recomendación: si solo vas a usarla para Dominicode, ponela como skill por proyecto en el repo del workshop. Si vas a auditar landings de varios proyectos, ponela como global.

### Verificar que cargó

Abrí una sesión nueva de Claude Code en el directorio donde instalaste la skill y escribí:

```
¿Qué skills tenés disponibles?
```

Tenés que ver `hormozi-landing-audit` listada con su descripción.

## Uso

### Auditar la landing del workshop

```
audita https://workshop.dominicode.com aplicando el framework Hormozi
```

### Auditar un archivo local

```
audita el archivo src/pages/workshop.mdx con el framework Hormozi
```

### Comparar dos versiones

```
comparame estas dos versiones de landing y dame score de cada una:
- versión actual: workshop.dominicode.com
- versión nueva: src/pages/workshop-v2.mdx
```

### Reescribir una sección

```
reescribime el hero de workshop.dominicode.com con orden pérdida → ganancia → puente
```

## Cómo personalizarla

El archivo `SKILL.md` es un markdown editable. Si quieres ajustarlo:

- **Cambiar el peso de los criterios:** edita la lista del Paso 2.
- **Añadir tu plantilla Hormozi como referencia:** ya está mencionada en "Referencias internas". Si la moves de sitio, actualiza el path.
- **Añadir ejemplos específicos de Dominicode:** poné ejemplos de tus propias landings al final del archivo. La skill aprenderá tu voz.

## Estructura de la skill

```
hormozi-landing-audit/
├── SKILL.md          ← instrucciones para Claude Code (no editar el frontmatter)
└── README.md         ← este archivo (solo informativo)
```

El `SKILL.md` tiene un frontmatter YAML con dos campos críticos:
- `name`: identificador único de la skill (no usar espacios).
- `description`: lo que Claude lee para decidir si activarla. Si lo cambias, asegúrate de que siga mencionando "landing", "audit", "Hormozi" y los formatos de página relevantes.

## Iteración futura

Esta skill es la v1. Si después de usarla un par de veces ves patrones que repetís ("siempre olvido revisar X"), añadílo al SKILL.md como regla. Las skills son mejores cuando reflejan los criterios reales que aplicás vos.
