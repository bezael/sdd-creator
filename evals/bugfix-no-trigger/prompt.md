---
name: bugfix-no-trigger
tags: [trigger, negative]
runs: 3
max_turns: 10
allowed_tools: [Read, Glob, Grep, Skill, Edit]
---
El test de `src/sum.test.js` falla: `sum(2, 3)` devuelve 6 y debería devolver 5. Arréglalo.
