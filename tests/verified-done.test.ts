// Tests for extensions/dominicode-verified-done.ts. No dependencies: run with `node --test tests/`
// (Node strips the TypeScript types itself).
import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import verifiedDone, {
	createVerifiedDone,
	failureMessage,
	gitSnapshot,
	parseShortLoop,
	statusText,
} from "../extensions/dominicode-verified-done.ts";

const LANE = `# Project

## Lane

### Harness

#### Short loop — after every change

\`\`\`bash
# comments and blank lines are skipped

npm run typecheck   # 4s
npm run lint        # 6s, known red: 3 of 120
npm test            # 12s
\`\`\`

#### Long loop — before opening the PR

\`\`\`bash
npm run build
\`\`\`
`;

describe("parseShortLoop", () => {
	test("reads the commands of the first bash fence under Short loop", () => {
		assert.deepEqual(parseShortLoop(LANE), [
			{ command: "npm run typecheck", knownRed: false },
			{ command: "npm run lint", knownRed: true },
			{ command: "npm test", knownRed: false },
		]);
	});

	test("ignores the long loop", () => {
		assert.ok(!parseShortLoop(LANE).some((c) => c.command === "npm run build"));
	});

	test("returns nothing without a Short loop section", () => {
		assert.deepEqual(parseShortLoop("# Project\n\n```bash\nnpm test\n```\n"), []);
	});

	test("keeps a # that is part of the command", () => {
		assert.deepEqual(parseShortLoop("#### Short loop\n\n```bash\ngrep -c '#' file.txt\n```\n"), [
			{ command: "grep -c '#' file.txt", knownRed: false },
		]);
	});

	test("accepts CRLF line endings", () => {
		assert.deepEqual(parseShortLoop("#### Short loop\r\n\r\n```bash\r\nnpm test  # 3s\r\n```\r\n"), [
			{ command: "npm test", knownRed: false },
		]);
	});
});

describe("failureMessage and statusText", () => {
	const red = { command: "npm test", knownRed: false, code: 1, output: "1 failing", timedOut: false };
	const green = { command: "npm run lint", knownRed: false, code: 0, output: "", timedOut: false };

	test("the failure message names each red command, its exit code and its output", () => {
		const msg = failureMessage([green, red], 1, 3);
		assert.match(msg, /`npm test` exited 1/);
		assert.match(msg, /1 failing/);
		assert.doesNotMatch(msg, /npm run lint/);
		assert.match(msg, /attempt 1 of 3/);
	});

	test("caps long output to its tail", () => {
		const long = { ...red, output: "x".repeat(10_000) + "THE END" };
		const msg = failureMessage([long], 1, 3);
		assert.ok(msg.length < 5_000);
		assert.match(msg, /THE END/);
	});

	test("status text for green, red and gave up", () => {
		assert.equal(statusText({ kind: "green", passed: 2, total: 2 }), "✓ short loop 2/2");
		assert.equal(statusText({ kind: "red", failing: ["npm test"] }), "✗ short loop: npm test");
		assert.equal(statusText({ kind: "gave-up", failing: ["npm test"], tries: 3 }), "✗ short loop still red after 3 tries: npm test");
	});
});

// --- Pi wiring, with a fake ExtensionAPI and a scripted command runner -------------------------

function load(results: Record<string, number>, maxAttempts = 3) {
	const handlers: Record<string, Function> = {};
	const commands: Record<string, any> = {};
	const ran: string[] = [];
	const factory = createVerifiedDone({
		maxAttempts,
		snapshot: async () => null,
		run: async (command) => {
			ran.push(command);
			return { code: results[command] ?? 0, output: `output of ${command}`, timedOut: false };
		},
	});
	factory({
		on: (event: string, h: Function) => (handlers[event] = h),
		registerCommand: (name: string, opts: any) => (commands[name] = opts),
	} as any);
	return { handlers, commands, ran };
}

let cwd: string;
let statuses: (string | undefined)[];
let notices: string[];
const ctx = () => ({
	cwd,
	hasUI: true,
	mode: "tui",
	ui: { setStatus: (_k: string, t: string | undefined) => statuses.push(t), notify: (m: string) => notices.push(m) },
});
const prompt = { type: "before_agent_start", messageType: "user", prompt: "go" };
const edit = { type: "tool_call", toolName: "edit", toolCallId: "e1", input: { path: "a.ts", edits: [] } };
const settle = { type: "agent_before_settle", outcome: "completed", entries: [], continue: false };

beforeEach(() => {
	cwd = fs.mkdtempSync(path.join(os.tmpdir(), "verified-done-"));
	fs.writeFileSync(path.join(cwd, "AGENTS.md"), LANE);
	statuses = [];
	notices = [];
});
afterEach(() => fs.rmSync(cwd, { recursive: true, force: true }));

async function turn(h: Record<string, Function>, { edited = true } = {}) {
	await h.before_agent_start(prompt, ctx());
	if (edited) await h.tool_call(edit, ctx());
	return h.agent_before_settle(settle, ctx());
}

describe("Pi wiring", () => {
	test("does not run after a run that changed nothing", async () => {
		const { handlers, ran } = load({});
		assert.equal(await turn(handlers, { edited: false }), undefined);
		assert.deepEqual(ran, []);
	});

	test("green after an edit: settles and shows the count", async () => {
		const { handlers, ran } = load({});
		assert.equal(await turn(handlers), undefined);
		assert.deepEqual(ran, ["npm run typecheck", "npm run lint", "npm test"]);
		assert.equal(statuses.at(-1), "✓ short loop 3/3");
	});

	test("red after an edit: appends the failure and asks for one more request", async () => {
		const { handlers } = load({ "npm test": 1 });
		const r = await turn(handlers);
		assert.equal(r.continue, true);
		assert.equal(r.entries[0].type, "custom_message");
		assert.equal(r.entries[0].display, true);
		assert.match(r.entries[0].content, /`npm test` exited 1/);
		assert.equal(statuses.at(-1), "✗ short loop: npm test");
	});

	test("a known red does not send the agent back", async () => {
		const { handlers } = load({ "npm run lint": 1 });
		assert.equal(await turn(handlers), undefined);
	});

	test("gives up after maxAttempts reds in one prompt, and a new prompt starts over", async () => {
		const { handlers } = load({ "npm test": 1 }, 2);
		assert.equal((await turn(handlers)).continue, true);
		// the continuation is the same prompt: no before_agent_start for it
		await handlers.tool_call(edit, ctx());
		assert.equal((await handlers.agent_before_settle(settle, ctx())).continue, true);
		await handlers.tool_call(edit, ctx());
		assert.equal(await handlers.agent_before_settle(settle, ctx()), undefined);
		assert.equal(statuses.at(-1), "✗ short loop still red after 2 tries: npm test");
		assert.equal(notices.length, 1);

		assert.equal((await turn(handlers)).continue, true);
	});

	test("checks again after a continuation even without a new edit", async () => {
		const { handlers, ran } = load({ "npm test": 1 });
		await turn(handlers);
		ran.length = 0;
		await handlers.agent_before_settle(settle, ctx());
		assert.ok(ran.includes("npm test"));
	});

	test("skips aborted or failed runs", async () => {
		const { handlers, ran } = load({ "npm test": 1 });
		await handlers.before_agent_start(prompt, ctx());
		await handlers.tool_call(edit, ctx());
		assert.equal(await handlers.agent_before_settle({ ...settle, outcome: "aborted" }, ctx()), undefined);
		assert.deepEqual(ran, []);
	});

	test("inert without AGENTS.md", async () => {
		fs.rmSync(path.join(cwd, "AGENTS.md"));
		const { handlers, ran } = load({});
		assert.equal(await turn(handlers), undefined);
		assert.deepEqual(ran, []);
		assert.deepEqual(statuses, []);
	});

	test("/verify off stops the automatic check, /verify on restores it", async () => {
		const { handlers, commands, ran } = load({ "npm test": 1 });
		await commands.verify.handler("off", ctx());
		assert.equal(await turn(handlers), undefined);
		assert.deepEqual(ran, []);
		await commands.verify.handler("on", ctx());
		assert.equal((await turn(handlers)).continue, true);
	});

	test("/verify runs the short loop now and reports it", async () => {
		const { commands, ran } = load({ "npm test": 1 });
		await commands.verify.handler("", ctx());
		assert.deepEqual(ran, ["npm run typecheck", "npm run lint", "npm test"]);
		assert.match(notices.at(-1)!, /npm test/);
	});

	test("/verify without a lane says where it looked", async () => {
		fs.rmSync(path.join(cwd, "AGENTS.md"));
		const { commands } = load({});
		await commands.verify.handler("", ctx());
		assert.match(notices.at(-1)!, /Short loop/);
	});
});

describe("gitSnapshot", () => {
	test("changes when bash rewrites a file that was already untracked or modified", async () => {
		execSync("git init -q", { cwd });
		fs.writeFileSync(path.join(cwd, "sum.js"), "a - b\n");
		const before = await gitSnapshot(cwd);
		fs.writeFileSync(path.join(cwd, "sum.js"), "() => 0\n");
		assert.notEqual(await gitSnapshot(cwd), before);
	});

	test("is null outside a git repo", async () => {
		assert.equal(await gitSnapshot(os.tmpdir()), null);
	});
});

describe("default export with the real shell", () => {
	test("a failing command is red, a passing one is green", async () => {
		fs.writeFileSync(
			path.join(cwd, "AGENTS.md"),
			'#### Short loop\n\n```bash\nnode -e "process.exit(0)"\nnode -e "console.log(\'boom\'); process.exit(3)"\n```\n',
		);
		const handlers: Record<string, Function> = {};
		verifiedDone({ on: (e: string, h: Function) => (handlers[e] = h), registerCommand: () => {} } as any);
		const r = await turn(handlers);
		assert.equal(r.continue, true);
		assert.match(r.entries[0].content, /exited 3/);
		assert.match(r.entries[0].content, /boom/);
	});
});
