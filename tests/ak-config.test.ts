// Verified done reads ai-workflow-kit's .ak/config.md when a repo has no CBRM lane.
import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseAkCommands, readLane } from "../extensions/verified-done-core.mjs";
import { createVerifiedDone } from "../extensions/dominicode-verified-done.ts";
import { clearState, handle } from "../hooks/verified-done.mjs";

// What ai-workflow-kit's /ak-setup writes.
const AK_CONFIG = `# Project config — read by /ak- skills

## Repo
- Default branch: main

## Commands
- Install: npm ci
- Test: \`npm test\`
- Lint: npm run lint
- Typecheck: unknown — no script found
- Build: npm run build
- E2E: npx playwright test

## Layout
- Test: not a command, wrong section
`;

const LANE = "#### Short loop\n\n```bash\nnode check.js   # 1s\n```\n";

let cwd: string;
beforeEach(() => (cwd = fs.mkdtempSync(path.join(os.tmpdir(), "verified-done-ak-"))));
afterEach(() => fs.rmSync(cwd, { recursive: true, force: true }));

const writeAk = (body = AK_CONFIG) => {
	fs.mkdirSync(path.join(cwd, ".ak"));
	fs.writeFileSync(path.join(cwd, ".ak", "config.md"), body);
};

describe("parseAkCommands", () => {
	test("reads Test, Lint and Typecheck from ## Commands, skipping unknown, Build and E2E", () => {
		assert.deepEqual(parseAkCommands(AK_CONFIG), [
			{ command: "npm test", knownRed: false },
			{ command: "npm run lint", knownRed: false },
		]);
	});

	test("returns nothing without a ## Commands section", () => {
		assert.deepEqual(parseAkCommands("## Repo\n- Test: npm test\n"), []);
	});
});

describe("readLane", () => {
	test("falls back to .ak/config.md when there is no AGENTS.md", () => {
		writeAk();
		assert.deepEqual(readLane(cwd).map((c) => c.command), ["npm test", "npm run lint"]);
	});

	test("falls back when AGENTS.md has no Short loop", () => {
		fs.writeFileSync(path.join(cwd, "AGENTS.md"), "# Project\n\nNo lane here.\n");
		writeAk();
		assert.deepEqual(readLane(cwd).map((c) => c.command), ["npm test", "npm run lint"]);
	});

	test("a CBRM lane wins over .ak/config.md", () => {
		fs.writeFileSync(path.join(cwd, "AGENTS.md"), LANE);
		writeAk();
		assert.deepEqual(readLane(cwd).map((c) => c.command), ["node check.js"]);
	});

	test("nothing when neither exists", () => {
		assert.deepEqual(readLane(cwd), []);
	});
});

describe("both agents use the fallback", () => {
	const run = async (command: string) => ({ code: command === "npm test" ? 1 : 0, output: "1 failing", timedOut: false });

	test("Pi: an edit in a repo with only .ak/config.md runs its commands and sends the failure back", async () => {
		writeAk();
		const handlers: Record<string, Function> = {};
		createVerifiedDone({ run, snapshot: async () => null })({
			on: (e: string, h: Function) => (handlers[e] = h),
			registerCommand: () => {},
		} as any);
		const ctx = { cwd, hasUI: false, mode: "print", ui: {} };
		await handlers.before_agent_start({ messageType: "user", prompt: "go" }, ctx);
		await handlers.tool_call({ toolName: "write", input: { path: "a.js", content: "" } }, ctx);
		const r = await handlers.agent_before_settle({ outcome: "completed", entries: [], continue: false }, ctx);
		assert.equal(r.continue, true);
		assert.match(r.entries[0].content, /`npm test` exited 1/);
	});

	test("Claude Code: the Stop hook blocks on a red .ak/config.md command", async () => {
		writeAk();
		const session = `ak-test-${process.pid}-${Math.random().toString(36).slice(2)}`;
		const options = { run, snapshot: async () => null };
		const event = (hook_event_name: string) => ({ hook_event_name, session_id: session, cwd });
		try {
			await handle(event("UserPromptSubmit"), options);
			await handle(event("PostToolUse"), options);
			const out = JSON.parse(await handle(event("Stop"), options));
			assert.equal(out.decision, "block");
			assert.match(out.reason, /npm test/);
		} finally {
			clearState(session);
		}
	});

	test("Pi: /verify with neither source names both files", async () => {
		const commands: Record<string, any> = {};
		const notices: string[] = [];
		createVerifiedDone({ run })({ on: () => {}, registerCommand: (n: string, o: any) => (commands[n] = o) } as any);
		await commands.verify.handler("", { cwd, hasUI: true, ui: { notify: (m: string) => notices.push(m), setStatus: () => {} } });
		assert.match(notices[0], /Short loop/);
		assert.match(notices[0], /\.ak[\\/]config\.md/);
	});
});
