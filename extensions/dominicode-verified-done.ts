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
 * The logic lives in verified-done-core.mjs, shared with the Claude Code hook.
 *
 * CBRM by Bezael Pérez · Dominicode
 */

import path from "node:path";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import {
	type CommandRun,
	type Verdict,
	freshState,
	gitSnapshot,
	MAX_ATTEMPTS,
	onStop,
	readLane,
	runInShell,
	runLoop,
	startPrompt,
	statusText,
	verdictOf,
} from "./verified-done-core.mjs";

export { failureMessage, gitSnapshot, parseShortLoop, statusText } from "./verified-done-core.mjs";

const STATUS_KEY = "verified-done";

type Options = {
	maxAttempts?: number;
	run?: (command: string, cwd: string) => Promise<CommandRun>;
	snapshot?: (cwd: string) => Promise<string | null>;
};

export function createVerifiedDone({ maxAttempts = MAX_ATTEMPTS, run = runInShell, snapshot = gitSnapshot }: Options = {}) {
	return function (pi: ExtensionAPI) {
		let enabled = true;
		let state = freshState();

		const show = (ctx: ExtensionContext, verdict: Verdict | undefined) => {
			if (ctx.hasUI) ctx.ui.setStatus(STATUS_KEY, verdict ? statusText(verdict) : undefined);
		};

		pi.on("before_agent_start", async (event, ctx) => {
			if (event.messageType !== "user") return undefined;
			state = enabled ? await startPrompt(ctx.cwd, snapshot) : freshState();
			return undefined;
		});

		pi.on("tool_call", async (event) => {
			if (event.toolName === "edit" || event.toolName === "write") state.edited = true;
			return undefined;
		});

		pi.on("agent_before_settle", async (event, ctx) => {
			if (!enabled || event.outcome !== "completed") return undefined;
			const result = await onStop(state, ctx.cwd, { maxAttempts, run, snapshot });
			if (result.action === "skip") return undefined;
			show(ctx, result.verdict);
			if (result.action === "gave-up" && ctx.hasUI) {
				ctx.ui.notify(`verified-done: short loop still red after ${maxAttempts} tries, over to you`, "warning");
			}
			if (result.action !== "red") return undefined;
			return {
				entries: [{ type: "custom_message" as const, customType: STATUS_KEY, content: result.message, display: true }],
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
				const verdict = verdictOf(await runLoop(commands, ctx.cwd, run));
				show(ctx, verdict);
				if (ctx.hasUI) ctx.ui.notify(statusText(verdict), verdict.kind === "green" ? "info" : "error");
			},
		});
	};
}

export default createVerifiedDone();
