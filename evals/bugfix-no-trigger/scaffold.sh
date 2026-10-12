#!/usr/bin/env bash
# One-function project with a failing test.
set -euo pipefail
mkdir -p src
cat > package.json <<'EOF'
{ "name": "calc", "type": "module", "scripts": { "test": "vitest run" }, "devDependencies": { "vitest": "^2.0.5" } }
EOF
cat > src/sum.js <<'EOF'
export const sum = (a, b) => a + b + 1;
EOF
cat > src/sum.test.js <<'EOF'
import { test, expect } from 'vitest';
import { sum } from './sum.js';
test('sum', () => expect(sum(2, 3)).toBe(5));
EOF
