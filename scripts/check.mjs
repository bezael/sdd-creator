#!/usr/bin/env node
// Repository consistency checks for the dominicode-sdd-creator plugin.
// Zero dependencies. Run from anywhere: `node scripts/check.mjs`.
// Exit code 1 if any check fails.

import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderAgents } from './build-agents.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const exists = (p) => existsSync(join(ROOT, p));

const failures = [];
const fail = (check, msg) => failures.push(`[${check}] ${msg}`);

const trackedFiles = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8' })
  .split('\n')
  .filter(Boolean);
const markdownFiles = trackedFiles.filter((f) => f.endsWith('.md'));

// Plugin manifest: every listed skill exists, and every skill on disk is listed.
const plugin = JSON.parse(read('.claude-plugin/plugin.json'));
if (!/^\d+\.\d+\.\d+$/.test(plugin.version ?? '')) {
  fail('plugin', `version "${plugin.version}" is not semver`);
}
const listedSkills = (plugin.skills ?? []).map((p) => p.replace(/^\.\//, ''));
for (const skillDir of listedSkills) {
  if (!exists(join(skillDir, 'SKILL.md'))) {
    fail('plugin', `${skillDir} is listed but has no SKILL.md`);
    continue;
  }
  const frontmatter = read(join(skillDir, 'SKILL.md')).match(/^---\n([\s\S]*?)\n---/);
  const name = frontmatter?.[1].match(/^name:\s*(.+)$/m)?.[1].trim();
  const description = frontmatter?.[1].match(/^description:\s*(.+)$/m)?.[1].trim();
  if (name !== basename(skillDir)) {
    fail('plugin', `${skillDir}/SKILL.md frontmatter name "${name}" does not match its folder`);
  }
  if (!description) fail('plugin', `${skillDir}/SKILL.md frontmatter has no description`);
}
const skillsOnDisk = trackedFiles
  .filter((f) => /^skills\/[^/]+\/[^/]+\/SKILL\.md$/.test(f))
  .map(dirname);
for (const skillDir of skillsOnDisk) {
  if (!listedSkills.includes(skillDir)) {
    fail('plugin', `${skillDir} has a SKILL.md but is not listed in plugin.json`);
  }
}

// Marketplace: the entry for this repo's root names the plugin as plugin.json does,
// and carries no version of its own (plugin.json is the single version source).
if (exists('.claude-plugin/marketplace.json')) {
  const marketplace = JSON.parse(read('.claude-plugin/marketplace.json'));
  const entry = (marketplace.plugins ?? []).find((p) => p.source === './');
  if (!entry) fail('marketplace', 'marketplace.json has no plugin entry with source "./"');
  else {
    if (entry.name !== plugin.name) {
      fail('marketplace', `marketplace.json names the plugin "${entry.name}" but plugin.json says "${plugin.name}"`);
    }
    if ('version' in entry) fail('marketplace', 'marketplace.json entry sets a version; keep it only in plugin.json');
  }
}

// Version: plugin.json matches the latest released CHANGELOG entry.
const released = read('CHANGELOG.md').match(/^## \[(\d+\.\d+\.\d+)\]/m)?.[1];
if (released !== plugin.version) {
  fail('version', `plugin.json is ${plugin.version} but the latest CHANGELOG release is ${released}`);
}

// Mirror sync: each AGENTS.md is generated from its SKILL.md and must match it exactly.
for (const skillDir of listedSkills) {
  if (!exists(join(skillDir, 'SKILL.md'))) continue;
  const expected = renderAgents(read(join(skillDir, 'SKILL.md')));
  const actual = exists(join(skillDir, 'AGENTS.md')) ? read(join(skillDir, 'AGENTS.md')) : null;
  if (actual !== expected) {
    fail('mirror', `${skillDir}/AGENTS.md is out of date with SKILL.md; run \`node scripts/build-agents.mjs\``);
  }
}

// Internal references: files a skill points to must exist inside that skill,
// or inside a sibling skill when prefixed with its name (`other-skill/references/x.md`).
for (const skillDir of listedSkills) {
  const skillMarkdown = markdownFiles.filter((f) => f.startsWith(`${skillDir}/`));
  for (const file of skillMarkdown) {
    const seen = new Set();
    for (const [ref, sibling, path] of read(file).matchAll(/(?:\b([\w-]+)\/)?\b((?:references|templates)\/[\w.-]+\.md)\b/g)) {
      if (seen.has(ref)) continue;
      seen.add(ref);
      const base = sibling ? join(dirname(skillDir), sibling) : skillDir;
      if (!exists(join(base, path))) fail('links', `${file} references ${ref}, which does not exist in ${base}`);
    }
  }
}

// Relative Markdown links resolve to a tracked path.
for (const file of markdownFiles) {
  const text = read(file).replace(/```[\s\S]*?```/g, '');
  for (const [, target] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    if (/^(?:[a-z]+:|#)/i.test(target)) continue;
    const path = join(dirname(file), decodeURI(target.split('#')[0]));
    if (!exists(path)) fail('links', `${file} links to ${target}, which does not exist`);
  }
}

// Markdown tables: every row has as many cells as its header.
// An unescaped | inside a cell (even inside backticks) adds a column on GitHub.
const cellCount = (row) => row.trim().replace(/\\\|/g, '').replace(/^\||\|$/g, '').split('|').length;
for (const file of markdownFiles) {
  const lines = read(file).split('\n');
  let inFence = false;
  let header = null;
  lines.forEach((line, i) => {
    if (/^\s*```/.test(line)) inFence = !inFence;
    const isRow = !inFence && /^\s*\|.*\|\s*$/.test(line);
    if (!isRow) return void (header = null);
    if (header === null) return void (header = cellCount(line));
    const cells = cellCount(line);
    if (cells !== header) fail('tables', `${file}:${i + 1} has ${cells} cells, header has ${header}`);
  });
}

// Line endings: LF everywhere (.gitattributes enforces it on commit).
for (const line of execSync('git ls-files --eol', { cwd: ROOT, encoding: 'utf8' }).split('\n')) {
  if (/\b[iw]\/crlf\b/.test(line)) fail('eol', `CRLF in ${line.split('\t').pop()}`);
}

// Credits: SDD is an adaptation, never "methodology by".
const creditScope = markdownFiles.filter((f) => f.startsWith('skills/') || /^README(\.es)?\.md$/.test(f));
for (const file of [...creditScope, '.claude-plugin/plugin.json']) {
  if (/methodology by/i.test(read(file))) fail('credits', `${file} says "methodology by"; use "SDD adaptation by"`);
}

// harness-init templates are copied into user repos: no emojis.
for (const file of trackedFiles.filter((f) => f.startsWith('skills/engineering/dominicode-harness-init/templates/'))) {
  if (/\p{Extended_Pictographic}/u.test(read(file))) fail('emoji', `${file} contains an emoji`);
}

if (failures.length) {
  console.error(`✗ ${failures.length} problem(s) found:\n`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log(`✓ All checks passed (${listedSkills.length} skills, ${markdownFiles.length} Markdown files).`);
