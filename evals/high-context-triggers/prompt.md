---
name: high-context-triggers
tags: [trigger, step-2]
runs: 3
max_turns: 25
allowed_tools: [Read, Glob, Grep, Skill, Write]
---
Quiero añadir votos a los items del feedback board.

Contexto: cada usuario autenticado puede votar una vez por item y quitar su voto. El listado de items se ordena por número de votos, de más a menos, y muestra el contador. Si un usuario intenta votar dos veces el mismo item, la API devuelve 409. Si el item no existe, 404. Los votos se guardan en la misma base SQLite que ya usamos. No hace falta tiempo real: basta con que el contador sea correcto al recargar. Tiene que responder en menos de 100 ms con 10.000 items.
