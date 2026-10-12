#!/usr/bin/env bash
# Express API with an accepted spec and plan, and no test runner installed.
set -euo pipefail
mkdir -p src specs/notes-api
cat > package.json <<'EOF'
{
  "name": "notes-api",
  "version": "0.1.0",
  "type": "module",
  "scripts": { "start": "node src/index.js" },
  "dependencies": { "express": "^4.19.2" }
}
EOF
cat > src/index.js <<'EOF'
import express from 'express';
const app = express();
app.use(express.json());
app.listen(3000);
EOF
cat > specs/notes-api/spec.md <<'EOF'
# Spec — Notes API

Status: confirmed by the user

## SECTION 1 — Product Vision
A tiny HTTP API to create and list personal notes.

## SECTION 2 — Users and Use Cases
User [owner]: create a note, list notes.

## SECTION 3 — Features
**Module notes:**
- The user can create a note with a non-empty title.
- The user can list all notes, newest first.

## SECTION 4 — User Flows
Create: POST /notes {title} → 201 with the note. Error: empty title → 400.
List: GET /notes → 200 with notes sorted newest first. Error: none (empty list → []).

## SECTION 5 — Architecture
Node 20 + Express, in-memory store.

## SECTION 6 — Non-functional Requirements
Performance: <50ms per request. Security: no auth (local demo). Scalability: single process. Language: English.
EOF
cat > specs/notes-api/plan.md <<'EOF'
# Technical Plan — Notes API

Status: confirmed by the user

## 1. Final stack
- Backend: Express 4 (already installed)
- Storage: in-memory array
- CI / Tests: not decided yet

## 2. Data model
- Note: id, title, createdAt

## 3. Contracts
- POST /notes, GET /notes

## 6. Build order
1. POST /notes  2. GET /notes
EOF
