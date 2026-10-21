// Verified done — the part shared by the Pi extension (dominicode-verified-done.ts) and the
// Claude Code hook (hooks/verified-done.mjs). Plain JavaScript, no dependencies, so the hook runs
// on any Node that Claude Code runs on and Pi loads it as is.
//
// The lane written by dominicode-harness-init names the commands that prove a change (the short
// loop). When the agent stops after changing files, onStop() runs them; a red result goes back to
// the agent, up to maxAttempts times per prompt.
//
// CBRM by Bezael Pérez · Dominicode

import { execFile, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/** @typedef {{ command: string, knownRed: boolean }} LoopCommand */
/** @typedef {{ code: number | null, output: string, timedOut: boolean }} CommandRun */
/** @typedef {LoopCommand & CommandRun} CommandResult */
/**
 * @typedef {{ kind: "green", passed: number, total: number }
 *   | { kind: "red", failing: string[] }
 *   | { kind: "gave-up", failing: string[], tries: number }} Verdict
 */
/**
 * What one prompt has done so far. Kept in memory by Pi, in a file per session by Claude Code.
 * @typedef {{ attempts: number, gaveUp: boolean, edited: boolean, recheck: boolean, baseline: string | null }} StopState
 */

export const MAX_ATTEMPTS = 3;
const TIMEOUT_MS = 10 * 60_000;
const OUTPUT_TAIL = 4_000;

/**
 * The commands of the first fenced block under the `Short loop` heading, without blank lines,
 * comment lines or trailing `# comments`. A trailing comment saying "known red" marks the command.
 * @param {string} markdown
 * @returns {LoopCommand[]}
 */
export function parseShortLoop(markdown) {
	const lines = markdown.split(/\r?\n/);
	const heading = lines.findIndex((l) => /^#{1,6}\s+short loop\b/i.test(l));
	if (heading === -1) return [];

	let i = heading + 1;
	while (i < lines.length && !lines[i].startsWith("```")) {
		if (/^#{1,6}\s/.test(lines[i])) return []; // next section before any code block
		i++;
	}

	/** @type {LoopCommand[]} */
	const commands = [];
	for (i++; i < lines.length && !lines[i].startsWith("```"); i++) {
		const line = lines[i].trim();
		if (!line || line.startsWith("#")) continue;
		const comment = line.match(/\s+#\s.*$/);
		commands.push({
			command: comment ? line.slice(0, comment.index).trim() : line,
			knownRed: comment ? /known red/i.test(comment[0]) : false,
		});
	}
	return commands;
}

/** @param {CommandResult} r */
const isRed = (r) => !r.knownRed && r.code !== 0;

/**
 * What the agent reads when the short loop is red.
 * @param {CommandResult[]} results
 * @param {number} attempt
 * @param {number} maxAttempts
 */
export function failureMessage(results, attempt, maxAttempts) {
	const failures = results.filter(isRed).map((r) => {
		const how = r.timedOut ? "timed out" : `exited ${r.code}`;
		const output = r.output.length > OUTPUT_TAIL ? `…${r.output.slice(-OUTPUT_TAIL)}` : r.output;
		return `\`${r.command}\` ${how}:\n\n\`\`\`\n${output.trim()}\n\`\`\``;
	});
	return [
		`The lane's short loop is red, so the task is not done (verified-done, attempt ${attempt} of ${maxAttempts}).`,
		...failures,
		"Fix the cause in the code and stop again; the short loop will run again. Do not edit tests or the lane to make it pass.",
	].join("\n\n");
}

/** @param {Verdict} verdict */
export function statusText(verdict) {
	switch (verdict.kind) {
		case "green":
			return `✓ short loop ${verdict.passed}/${verdict.total}`;
		case "red":
			return `✗ short loop: ${verdict.failing.join(", ")}`;
		case "gave-up":
			return `✗ short loop still red after ${verdict.tries} tries: ${verdict.failing.join(", ")}`;
	}
}

/**
 * @param {string} command
 * @param {string} cwd
 * @returns {Promise<CommandRun>}
 */
export function runInShell(command, cwd) {
	return new Promise((resolve) => {
		const child = spawn(command, { cwd, shell: true });
		let output = "";
		let timedOut = false;
		const timer = setTimeout(() => {
			timedOut = true;
			child.kill();
		}, TIMEOUT_MS);
		child.stdout.on("data", (d) => (output += d));
		child.stderr.on("data", (d) => (output += d));
		child.on("error", (err) => {
			clearTimeout(timer);
			resolve({ code: null, output: err.message, timedOut });
		});
		child.on("close", (code) => {
			clearTimeout(timer);
			resolve({ code, output, timedOut });
		});
	});
}

/**
 * The changed files with their size and mtime, or null outside a git repo. The status alone is not
 * enough: a file that is already modified or untracked keeps the same status line when bash
 * changes it again.
 * @param {string} cwd
 * @returns {Promise<string | null>}
 */
export function gitSnapshot(cwd) {
	return new Promise((resolve) =>
		execFile("git", ["status", "--porcelain", "-z", "--untracked-files=all"], { cwd }, (err, stdout) => {
			if (err) return resolve(null);
			const lines = stdout.split("\0").filter(Boolean).map((entry) => {
				const file = entry.length > 3 && entry[2] === " " ? entry.slice(3) : entry; // a rename's source has no status
				try {
					const s = fs.statSync(path.join(cwd, file));
					return `${entry} ${s.size} ${s.mtimeMs}`;
				} catch {
					return `${entry} gone`;
				}
			});
			resolve(lines.join("\n"));
		}),
	);
}

/** The `.ak/config.md` keys that make a short loop; Build and E2E are long-loop work. */
const AK_SHORT_LOOP_KEYS = ["Test", "Lint", "Typecheck"];

/**
 * The short-loop commands of ai-workflow-kit's `.ak/config.md`: the `- Key: value` bullets under
 * `## Commands`, backticks stripped, values starting with "unknown" skipped. Same rules as the
 * kit's own parseConfigCommands.
 * @param {string} markdown
 * @returns {LoopCommand[]}
 */
export function parseAkCommands(markdown) {
	/** @type {Map<string, string>} */
	const found = new Map();
	let inCommands = false;
	for (const line of markdown.split(/\r?\n/)) {
		const heading = line.match(/^##\s+(.+?)\s*$/);
		if (heading) {
			inCommands = /^commands$/i.test(heading[1]);
			continue;
		}
		if (!inCommands) continue;
		const m = line.match(/^\s*-\s*([A-Za-z0-9 ]+?):\s*(.+?)\s*$/);
		const key = m && AK_SHORT_LOOP_KEYS.find((k) => k.toLowerCase() === m[1].trim().toLowerCase());
		if (!key) continue;
		const value = m[2].trim().replace(/^`(.+)`$/, "$1");
		if (!/^unknown\b/i.test(value)) found.set(key, value);
	}
	return AK_SHORT_LOOP_KEYS.filter((k) => found.has(k)).map((k) => ({ command: /** @type {string} */ (found.get(k)), knownRed: false }));
}

/** @param {string} file */
const readText = (file) => {
	try {
		return fs.readFileSync(file, "utf8");
	} catch {
		return "";
	}
};

/**
 * The short loop of the repo: the CBRM lane in AGENTS.md, or, when there is none, the
 * Test / Lint / Typecheck commands ai-workflow-kit's /ak-setup recorded in .ak/config.md.
 * @param {string} cwd
 * @returns {LoopCommand[]}
 */
export function readLane(cwd) {
	const lane = parseShortLoop(readText(path.join(cwd, "AGENTS.md")));
	return lane.length ? lane : parseAkCommands(readText(path.join(cwd, ".ak", "config.md")));
}

/**
 * @param {LoopCommand[]} commands
 * @param {string} cwd
 * @param {(command: string, cwd: string) => Promise<CommandRun>} run
 * @returns {Promise<CommandResult[]>}
 */
export async function runLoop(commands, cwd, run = runInShell) {
	const results = [];
	for (const c of commands) results.push({ ...c, ...(await run(c.command, cwd)) });
	return results;
}

/** @param {CommandResult[]} results @returns {Verdict} */
export function verdictOf(results) {
	const failing = results.filter(isRed).map((r) => r.command);
	return failing.length
		? { kind: "red", failing }
		: { kind: "green", passed: results.filter((r) => r.code === 0).length, total: results.length };
}

/** @returns {StopState} */
export const freshState = () => ({ attempts: 0, gaveUp: false, edited: false, recheck: false, baseline: null });

/**
 * A new user prompt: the attempt counter starts over and the git snapshot becomes the baseline.
 * @param {string} cwd
 * @param {(cwd: string) => Promise<string | null>} snapshot
 * @returns {Promise<StopState>}
 */
export async function startPrompt(cwd, snapshot = gitSnapshot) {
	return { ...freshState(), baseline: await snapshot(cwd) };
}

/**
 * The agent wants to stop. Mutates `state` and says what to do:
 * - `skip`: nothing to check (no lane, no change, already gave up)
 * - `green`: the short loop passed, let it stop
 * - `red`: send `message` back to the agent and keep it working
 * - `gave-up`: still red after maxAttempts, let it stop and tell the user
 * @param {StopState} state
 * @param {string} cwd
 * @param {{ maxAttempts?: number, run?: (command: string, cwd: string) => Promise<CommandRun>, snapshot?: (cwd: string) => Promise<string | null> }} [options]
 * @returns {Promise<{ action: "skip" } | { action: "green" | "gave-up", verdict: Verdict } | { action: "red", verdict: Verdict, message: string }>}
 */
export async function onStop(state, cwd, { maxAttempts = MAX_ATTEMPTS, run = runInShell, snapshot = gitSnapshot } = {}) {
	if (state.gaveUp) return { action: "skip" };
	const commands = readLane(cwd);
	if (!commands.length) return { action: "skip" };

	const changed = state.edited || state.recheck || (state.baseline !== null && (await snapshot(cwd)) !== state.baseline);
	if (!changed) return { action: "skip" };
	state.edited = false;

	const results = await runLoop(commands, cwd, run);
	const verdict = verdictOf(results);
	if (verdict.kind === "green") {
		state.recheck = false;
		return { action: "green", verdict };
	}

	state.attempts++;
	if (state.attempts > maxAttempts) {
		state.gaveUp = true;
		state.recheck = false;
		return { action: "gave-up", verdict: { kind: "gave-up", failing: verdict.failing, tries: maxAttempts } };
	}

	state.recheck = true;
	return { action: "red", verdict, message: failureMessage(results, state.attempts, maxAttempts) };
}
