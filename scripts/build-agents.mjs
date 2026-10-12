#!/usr/bin/env node
// Generates each skill's AGENTS.md from its SKILL.md: same body, no YAML
// frontmatter, and a header for agents that follow the AGENTS.md standard.
// SKILL.md is the only file to edit. Run: `node scripts/build-agents.mjs`.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, posix, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function renderAgents(skillMarkdown) {
  const body = skillMarkdown.replace(/^---\n[\s\S]*?\n---\n+/, '');
  const title = body.match(/^# (.+)\n+/);
  if (!title) throw new Error('SKILL.md has no H1 title after its frontmatter');
  return [
    `# AGENTS.md — ${title[1]}`,
    '',
    '<!-- Generated from SKILL.md by scripts/build-agents.mjs. Edit SKILL.md, not this file. -->',
    '',
    '> Mirror of `SKILL.md` for agents that follow the [AGENTS.md](https://agents.md) standard: Codex CLI, Cursor, Gemini CLI, Aider, Continue and others. Same content, without the YAML frontmatter.',
    '',
    body.slice(title[0].length),
  ].join('\n');
}

// Every plugin in the marketplace (or just the root plugin.json when there is
// no marketplace), with its skill folders resolved to repo-relative paths.
export function loadPlugins(root) {
  const readJson = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'));
  const entries = existsSync(join(root, '.claude-plugin/marketplace.json'))
    ? readJson('.claude-plugin/marketplace.json').plugins ?? []
    : [{ source: './' }];
  return entries.map((entry) => {
    const source = posix.normalize(entry.source).replace(/\/$/, '');
    const manifestPath = posix.join(source, '.claude-plugin/plugin.json');
    const manifest = existsSync(join(root, manifestPath)) ? readJson(manifestPath) : null;
    const skillDirs = (manifest?.skills ?? []).map((p) => posix.join(source, p));
    return { entry, source, manifestPath, manifest, skillDirs };
  });
}

export const skillDirs = (root) => loadPlugins(root).flatMap((p) => p.skillDirs);

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  for (const dir of skillDirs(root)) {
    const skill = readFileSync(join(root, dir, 'SKILL.md'), 'utf8');
    writeFileSync(join(root, dir, 'AGENTS.md'), renderAgents(skill));
    console.log(`wrote ${dir}/AGENTS.md`);
  }
}
