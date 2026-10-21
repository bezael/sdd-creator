/**
 * Verified done — a Pi extension for CBRM lanes.
 *
 * `dominicode-harness-init` writes the lane into AGENTS.md, and its **short loop** names the
 * commands that prove a change. The prompt asks the agent to run them; this extension does not
 * ask. When the agent stops after changing files, it runs the short loop itself, and if a command
 * is red it hands the failure back to the agent and asks Pi for one more model request. After
 * three red checks in a row for the same prompt it stops pushing and says so.
 *
 *   agent stops ── changed files? ── no ──→ settle
 *                        │ yes
 *                  run short loop ── green ──→ status ✓, settle
 *                        │ red
 *                  tries left? ── no ──→ status "still red", settle
 *                        │ yes
 *                  failure → model, one more request
 *
 * A command annotated `known red` in the lane runs and is reported but never sends the agent back.
 * No AGENTS.md or no Short loop section: the extension does nothing.
 *
 * `/verify` runs the short loop now; `/verify off` and `/verify on` toggle the automatic check.
 *
 * CBRM by Bezael Pérez · Dominicode
 */

import { execFile, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

export type LoopCommand = { command: string; knownRed: boolean };
export type CommandRun = { code: number | null; output: string; timedOut: boolean };
export type CommandResult = LoopCommand & CommandRun;
export type Verdict =
	| { kind: "green"; passed: number; total: number }
	| { kind: "red"; failing: string[] }
	| { kind: "gave-up"; failing: string[]; tries: number };

const STATUS_KEY = "verified-done";
const MAX_ATTEMPTS = 3;
const TIMEOUT_MS = 10 * 60_000;
const OUTPUT_TAIL = 4_000;

/**
 * The commands of the first fenced block under the `Short loop` heading, without blank lines,
 * comment lines or trailing `# comments`. A trailing comment saying "known red" marks the command.
 */
export function parseShortLoop(markdown: string): LoopCommand[] {
	const lines = markdown.split(/\r?\n/);
	const heading = lines.findIndex((l) => /^#{1,6}\s+short loop\b/i.test(l));
	if (heading === -1) return [];

	let i = heading + 1;
	while (i < lines.length && !lines[i].startsWith("```")) {
		if (/^#{1,6}\s/.test(lines[i])) return []; // next section before any code block
		i++;
	}

	const commands: LoopCommand[] = [];
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

const isRed = (r: CommandResult) => !r.knownRed && r.code !== 0;

/** What the model reads when the short loop is red. */
export function failureMessage(results: CommandResult[], attempt: number, maxAttempts: number): string {
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

export function statusText(verdict: Verdict): string {
	switch (verdict.kind) {
		case "green":
			return `✓ short loop ${verdict.passed}/${verdict.total}`;
		case "red":
			return `✗ short loop: ${verdict.failing.join(", ")}`;
		case "gave-up":
			return `✗ short loop still red after ${verdict.tries} tries: ${verdict.failing.join(", ")}`;
	}
}

function runInShell(command: string, cwd: string): Promise<CommandRun> {
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
 */
export function gitSnapshot(cwd: string): Promise<string | null> {
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

function readLane(cwd: string): LoopCommand[] {
	try {
		return parseShortLoop(fs.readFileSync(path.join(cwd, "AGENTS.md"), "utf8"));
	} catch {
		return [];
	}
}

type Options = {
	maxAttempts?: number;
	run?: (command: string, cwd: string) => Promise<CommandRun>;
	snapshot?: (cwd: string) => Promise<string | null>;
};

export function createVerifiedDone({ maxAttempts = MAX_ATTEMPTS, run = runInShell, snapshot = gitSnapshot }: Options = {}) {
	return function (pi: ExtensionAPI) {
		let enabled = true;
		let attempts = 0; // red checks since the last user prompt
		let gaveUp = false;
		let edited = false; // an edit or write since the last check
		let recheck = false; // the agent was sent back and has to be checked again
		let baseline: string | null = null;

		const show = (ctx: ExtensionContext, verdict: Verdict | undefined) => {
			if (!ctx.hasUI) return;
			const text = verdict ? statusText(verdict) : undefined;
			ctx.ui.setStatus(STATUS_KEY, text);
		};

		const runLoop = async (commands: LoopCommand[], cwd: string): Promise<CommandResult[]> => {
			const results: CommandResult[] = [];
			for (const c of commands) results.push({ ...c, ...(await run(c.command, cwd)) });
			return results;
		};

		const verdictOf = (results: CommandResult[]): Verdict => {
			const failing = results.filter(isRed).map((r) => r.command);
			return failing.length
				? { kind: "red", failing }
				: { kind: "green", passed: results.filter((r) => r.code === 0).length, total: results.length };
		};

		pi.on("before_agent_start", async (event, ctx) => {
			if (event.messageType !== "user") return undefined;
			attempts = 0;
			gaveUp = false;
			edited = false;
			recheck = false;
			baseline = enabled ? await snapshot(ctx.cwd) : null;
			return undefined;
		});

		pi.on("tool_call", async (event) => {
			if (event.toolName === "edit" || event.toolName === "write") edited = true;
			return undefined;
		});

		pi.on("agent_before_settle", async (event, ctx) => {
			if (!enabled || gaveUp || event.outcome !== "completed") return undefined;
			const commands = readLane(ctx.cwd);
			if (!commands.length) return undefined;

			const changed = edited || recheck || (baseline !== null && (await snapshot(ctx.cwd)) !== baseline);
			if (!changed) return undefined;
			edited = false;

			const results = await runLoop(commands, ctx.cwd);
			const verdict = verdictOf(results);
			if (verdict.kind === "green") {
				recheck = false;
				show(ctx, verdict);
				return undefined;
			}

			attempts++;
			if (attempts > maxAttempts) {
				gaveUp = true;
				recheck = false;
				show(ctx, { kind: "gave-up", failing: verdict.failing, tries: maxAttempts });
				if (ctx.hasUI) {
					ctx.ui.notify(`verified-done: short loop still red after ${maxAttempts} tries, over to you`, "warning");
				}
				return undefined;
			}

			recheck = true;
			show(ctx, verdict);
			return {
				entries: [
					{
						type: "custom_message" as const,
						customType: STATUS_KEY,
						content: failureMessage(results, attempts, maxAttempts),
						display: true,
					},
				],
				continue: true,
			};
		});

		pi.registerCommand("verify", {
			description: "Run the lane's short loop now (off | on toggles the automatic check)",
			getArgumentCompletions: (prefix) =>
				["on", "off"].filter((a) => a.startsWith(prefix)).map((a) => ({ value: a, label: a })),
			handler: async (args, ctx) => {
				const arg = args.trim();
				if (arg === "off" || arg === "on") {
					enabled = arg === "on";
					if (!enabled) show(ctx, undefined);
					if (ctx.hasUI) ctx.ui.notify(`verified-done: automatic check ${arg}`, "info");
					return;
				}
				const commands = readLane(ctx.cwd);
				if (!commands.length) {
					if (ctx.hasUI) ctx.ui.notify(`verified-done: no "Short loop" section in ${path.join(ctx.cwd, "AGENTS.md")}`, "warning");
					return;
				}
				const verdict = verdictOf(await runLoop(commands, ctx.cwd));
				show(ctx, verdict);
				if (ctx.hasUI) ctx.ui.notify(statusText(verdict), verdict.kind === "green" ? "info" : "error");
			},
		});
	};
}

export default createVerifiedDone();
