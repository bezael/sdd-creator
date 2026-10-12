---
type: llm
---
The request is LOW context ("Quiero hacer una app de recetas"). The skill must interview the user about the idea before deciding what to build.

PASS only if ALL of these hold:
- The response says, in about one sentence, that it detected a low-context or vague request.
- It asks about the idea itself: the problem, who has it, or the desired outcome. One question at a time is expected; two or three short questions are tolerated.
- It does NOT propose a tech stack, screens, endpoints or a feature list yet.
- It does NOT present a drafted spec.

FAIL if it jumps to a spec, a feature list or a stack.
