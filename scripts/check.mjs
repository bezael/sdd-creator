#!/usr/bin/env node
// Repository consistency checks for the dominicode-sdd-creator plugin.
// Zero dependencies. Run from anywhere: `node scripts/check.mjs`.
// Exit code 1 if any check fails.

import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPlugins, renderAgents } from './build-agents.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const exists = (p) => existsSync(join(ROOT, p));

const failures = [];
const fail = (check, msg) => failures.push(`[${check}] ${msg}`);

const trackedFiles = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8' })
  .split('\n')
  .filter(Boolean);
const markdownFiles = trackedFiles.filter((f) => f.endsWith('.md'));

// Plugins: every marketplace entry has a manifest with the same name and a semver
// version, the entry carries no version of its own (plugin.json is the single
// version source), every listed skill exists, and every skill on disk is listed.
const plugins = loadPlugins(ROOT);
for (const { entry, source, manifestPath, manifest } of plugins) {
  if (!manifest) {
    fail('plugin', `${source} has no ${manifestPath}`);
    continue;
  }
  if (entry.name && entry.name !== manifest.name) {
    fail('marketplace', `marketplace.json names the plugin at ${source} "${entry.name}" but its plugin.json says "${manifest.name}"`);
  }
  if ('version' in entry) fail('marketplace', `marketplace.json entry "${entry.name}" sets a version; keep it only in ${manifestPath}`);
  if (!/^\d+\.\d+\.\d+$/.test(manifest.version ?? '')) {
    fail('plugin', `${manifestPath} version "${manifest.version}" is not semver`);
  }
}
const listedSkills = plugins.flatMap((p) => p.skillDirs);
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
  // Pi and other Agent Skills loaders parse frontmatter as strict YAML: an
  // unquoted value with ": " or " #" is invalid there and the skill is dropped.
  if (description && !/^["'>|]/.test(description) && /: | #/.test(description)) {
    fail('frontmatter', `${skillDir}/SKILL.md description is an unquoted YAML value with ": " or " #"; quote it`);
  }
  if (name && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
    fail('frontmatter', `${skillDir}/SKILL.md name "${name}" is not lowercase letters, digits and single hyphens`);
  }
  if (name && name.length > 64) fail('frontmatter', `${skillDir}/SKILL.md name is longer than 64 characters`);
  const descriptionText = description?.replace(/^(["'])([\s\S]*)\1$/, '$2');
  if (descriptionText && [...descriptionText].length > 1024) {
    fail('frontmatter', `${skillDir}/SKILL.md description is longer than 1024 characters`);
  }
}
const skillsOnDisk = trackedFiles
  .filter((f) => /^skills\/[^/]+\/[^/]+\/SKILL\.md$/.test(f))
  .map(dirname);
for (const skillDir of skillsOnDisk) {
  if (!listedSkills.includes(skillDir)) {
    fail('plugin', `${skillDir} has a SKILL.md but no plugin.json lists it`);
  }
}

// Version: the root plugin matches the latest released CHANGELOG entry.
const rootPlugin = plugins.find((p) => p.source === '.')?.manifest;
const released = read('CHANGELOG.md').match(/^## \[(\d+\.\d+\.\d+)\]/m)?.[1];
if (rootPlugin && released !== rootPlugin.version) {
  fail('version', `plugin.json is ${rootPlugin.version} but the latest CHANGELOG release is ${released}`);
}

// Pi package: package.json ships the same skills as the plugins, at the root
// plugin's version, and keeps the keyword that lists it in the Pi gallery.
// Skills are listed one by one: a category folder would load its README.md as a skill.
const pkg = exists('package.json') ? JSON.parse(read('package.json')) : null;
if (!pkg) {
  fail('pi', 'package.json is missing; it is the Pi package manifest');
} else {
  const piSkills = (pkg.pi?.skills ?? []).map((p) => p.replace(/^\.\//, '').replace(/\/$/, ''));
  for (const skillDir of listedSkills) {
    if (!piSkills.includes(skillDir)) fail('pi', `${skillDir} is in a plugin.json but not in package.json "pi.skills"`);
  }
  for (const skillDir of piSkills) {
    if (!listedSkills.includes(skillDir)) fail('pi', `package.json "pi.skills" lists ${skillDir}, which no plugin.json lists`);
  }
  if (rootPlugin && pkg.version !== rootPlugin.version) {
    fail('pi', `package.json is ${pkg.version} but plugin.json is ${rootPlugin.version}; bump both together`);
  }
  if (!pkg.keywords?.includes('pi-package')) fail('pi', 'package.json keywords lack "pi-package"');
  for (const ext of pkg.pi?.extensions ?? []) {
    const file = ext.replace(/^\.\//, '');
    if (!exists(file)) fail('pi', `package.json "pi.extensions" lists ${ext}, which doesn't exist`);
    if (!(pkg.files ?? []).some((f) => file.startsWith(f.replace(/\/$/, '') + '/') || file === f)) {
      fail('pi', `${ext} is a Pi extension but package.json "files" doesn't ship it`);
    }
  }
}

// Claude Code hooks shipped by the root plugin: hooks/hooks.json needs the top-level "hooks"
// wrapper (a bare event map fails to load), and every script it runs must exist.
if (exists('hooks/hooks.json')) {
  let hooks = null;
  try {
    hooks = JSON.parse(read('hooks/hooks.json'));
  } catch (err) {
    fail('hooks', `hooks/hooks.json is not valid JSON: ${err.message}`);
  }
  if (hooks && typeof hooks.hooks !== 'object') fail('hooks', 'hooks/hooks.json lacks the top-level "hooks" key');
  for (const groups of Object.values(hooks?.hooks ?? {})) {
    for (const hook of groups.flatMap((g) => g.hooks ?? [])) {
      for (const [, script] of String(hook.command ?? '').matchAll(/\$\{CLAUDE_PLUGIN_ROOT\}\/([^"'\s]+)/g)) {
        if (!exists(script)) fail('hooks', `hooks/hooks.json runs ${script}, which doesn't exist`);
      }
    }
  }
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
