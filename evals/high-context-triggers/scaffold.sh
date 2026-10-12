#!/usr/bin/env bash
# Existing TypeScript project with Fastify, SQLite and Vitest, and one test.
set -euo pipefail
mkdir -p src
cat > package.json <<'EOF'
{
  "name": "feedback-board",
  "version": "0.3.0",
  "type": "module",
  "scripts": { "test": "vitest run", "dev": "tsx src/server.ts" },
  "dependencies": { "fastify": "^4.28.1", "better-sqlite3": "^11.1.2" },
  "devDependencies": { "vitest": "^2.0.5", "typescript": "^5.5.4", "tsx": "^4.16.2" }
}
EOF
cat > src/server.ts <<'EOF'
import Fastify from 'fastify';
export const app = Fastify();
app.get('/health', async () => ({ ok: true }));
EOF
cat > src/server.test.ts <<'EOF'
import { test, expect } from 'vitest';
import { app } from './server';
test('health', async () => {
  const res = await app.inject({ url: '/health' });
  expect(res.json()).toEqual({ ok: true });
});
EOF
