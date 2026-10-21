#!/usr/bin/env node
// Verified done — the Claude Code side. Wired by hooks/hooks.json, which the
// dominicode-sdd-creator plugin ships.
//
//   UserPromptSubmit  → a new prompt: attempts start over, git snapshot as the baseline
//   PostToolUse       → Edit / Write / NotebookEdit: the run changed files
//   Stop              → run the lane's short loop; red → {"decision":"block"} with the failure,
//                       so Claude keeps working; still red after 3 tries → let it stop and warn
//
// The state of each session lives in a small JSON file in the OS temp dir, since every hook call
// is a new process. Same logic as the Pi extension: both call verified-done-core.mjs.
// Set DOMINICODE_VERIFIED_DONE=off to turn it off.
//
// CBRM by Bezael Pérez · Dominicode

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { freshState, onStop, readLane, startPrompt, statusText } from "../extensions/verified-done-core.mjs";

const STATE_DIR = path.join(os.tmpdir(), "dominicode-verified-done");

/** @param {string} sessionId */
const stateFile = (sessionId) => path.join(STATE_DIR, `${String(sessionId).replace(/[^\w-]/g, "_")}.json`);

/** @param {string} sessionId */
function load(sessionId) {
	try {
		return { ...freshState(), ...JSON.parse(fs.readFileSync(stateFile(sessionId), "utf8")) };
	} catch {
		return freshState();
	}
}

/** @param {string} sessionId @param {object} state */
function save(sessionId, state) {
	fs.mkdirSync(STATE_DIR, { recursive: true });
	fs.writeFileSync(stateFile(sessionId), JSON.stringify(state));
}

/** Sessions end without telling the hook: drop state files nobody touched for a week. */
function pruneOldStates() {
	const cutoff = Date.now() - 7 * 24 * 60 * 60_000;
	try {
		for (const name of fs.readdirSync(STATE_DIR)) {
			const file = path.join(STATE_DIR, name);
			if (fs.statSync(file).mtimeMs < cutoff) fs.rmSync(file, { force: true });
		}
	} catch {
		// no state dir yet
	}
}

/** @param {string} sessionId */
export const clearState = (sessionId) => fs.rmSync(stateFile(sessionId), { force: true });

/**
 * Handles one hook event and returns what to print on stdout ("" for nothing).
 * @param {{ hook_event_name: string, session_id: string, cwd: string }} input
 * @param {Parameters<typeof onStop>[2]} [options]
 * @returns {Promise<string>}
 */
export async function handle(input, options = {}) {
	if (process.env.DOMINICODE_VERIFIED_DONE === "off") return "";
	const { hook_event_name: event, session_id: sessionId, cwd } = input;
	if (!sessionId || !cwd || !readLane(cwd).length) return "";

	if (event === "UserPromptSubmit") {
		pruneOldStates();
		save(sessionId, await startPrompt(cwd, options.snapshot));
		return ""; // stdout here would be added to Claude's context
	}

	if (event === "PostToolUse") {
		const state = load(sessionId);
		state.edited = true;
		save(sessionId, state);
		return "";
	}

	if (event === "Stop") {
		const state = load(sessionId);
		const result = await onStop(state, cwd, options);
		save(sessionId, state);
		if (result.action === "skip") return "";
		if (result.action === "red") return JSON.stringify({ decision: "block", reason: result.message });
		const text = statusText(result.verdict);
		return JSON.stringify({
			systemMessage: result.action === "gave-up" ? `verified-done: ${text}. Over to you.` : `verified-done: ${text}`,
		});
	}

	return "";
}

async function main() {
	let raw = "";
	for await (const chunk of process.stdin) raw += chunk;
	let input;
	try {
		input = JSON.parse(raw);
	} catch {
		return; // not a hook payload: do nothing rather than block Claude
	}
	const out = await handle(input);
	if (out) process.stdout.write(out);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	main().catch((err) => {
		// A broken hook must never trap Claude: report and let it stop.
		process.stderr.write(`verified-done: ${err?.message ?? err}\n`);
		process.exit(0);
	});
}
