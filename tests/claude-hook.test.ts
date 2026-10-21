// Tests for hooks/verified-done.mjs, the Claude Code side of verified-done.
import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { clearState, handle } from "../hooks/verified-done.mjs";

const HOOK = path.join(import.meta.dirname, "..", "hooks", "verified-done.mjs");
const LANE = "#### Short loop\n\n```bash\nnpm run lint   # 2s\nnpm test       # 5s\n```\n";

let cwd: string;
let session: string;
beforeEach(() => {
	cwd = fs.mkdtempSync(path.join(os.tmpdir(), "verified-done-hook-"));
	fs.writeFileSync(path.join(cwd, "AGENTS.md"), LANE);
	session = `test-${process.pid}-${Math.random().toString(36).slice(2)}`;
});
afterEach(() => {
	fs.rmSync(cwd, { recursive: true, force: true });
	clearState(session);
});

const event = (hook_event_name: string) => ({ hook_event_name, session_id: session, cwd });
const scripted = (codes: Record<string, number>) => ({
	snapshot: async () => null,
	run: async (command: string) => ({ code: codes[command] ?? 0, output: `output of ${command}`, timedOut: false }),
});

async function editedTurn(options: ReturnType<typeof scripted>) {
	assert.equal(await handle(event("UserPromptSubmit"), options), "");
	assert.equal(await handle(event("PostToolUse"), options), "");
	return handle(event("Stop"), options);
}

describe("Claude Code hook", () => {
	test("UserPromptSubmit and PostToolUse print nothing (stdout would reach Claude's context)", async () => {
		const options = scripted({});
		assert.equal(await handle(event("UserPromptSubmit"), options), "");
		assert.equal(await handle(event("PostToolUse"), options), "");
	});

	test("a red short loop blocks the stop and sends the failure to Claude", async () => {
		const out = JSON.parse(await editedTurn(scripted({ "npm test": 1 })));
		assert.equal(out.decision, "block");
		assert.match(out.reason, /`npm test` exited 1/);
		assert.match(out.reason, /output of npm test/);
	});

	test("a green short loop lets Claude stop and tells the user", async () => {
		assert.deepEqual(JSON.parse(await editedTurn(scripted({}))), { systemMessage: "verified-done: ✓ short loop 2/2" });
	});

	test("a stop with no change does nothing", async () => {
		const options = scripted({ "npm test": 1 });
		await handle(event("UserPromptSubmit"), options);
		assert.equal(await handle(event("Stop"), options), "");
	});

	test("after 3 blocks for one prompt it lets Claude stop and warns the user; a new prompt starts over", async () => {
		const options = scripted({ "npm test": 1 });
		assert.equal(JSON.parse(await editedTurn(options)).decision, "block");
		assert.equal(JSON.parse(await handle(event("Stop"), options)).decision, "block");
		assert.equal(JSON.parse(await handle(event("Stop"), options)).decision, "block");
		const last = JSON.parse(await handle(event("Stop"), options));
		assert.equal(last.decision, undefined);
		assert.match(last.systemMessage, /still red after 3 tries: npm test\. Over to you\./);
		assert.equal(await handle(event("Stop"), options), "");

		assert.equal(JSON.parse(await editedTurn(options)).decision, "block");
	});

	test("DOMINICODE_VERIFIED_DONE=off turns it off", async () => {
		process.env.DOMINICODE_VERIFIED_DONE = "off";
		try {
			assert.equal(await editedTurn(scripted({ "npm test": 1 })), "");
		} finally {
			delete process.env.DOMINICODE_VERIFIED_DONE;
		}
	});

	test("inert without a lane", async () => {
		fs.rmSync(path.join(cwd, "AGENTS.md"));
		assert.equal(await editedTurn(scripted({ "npm test": 1 })), "");
	});
});

describe("Claude Code hook as a process", () => {
	const run = (payload: string) => spawnSync(process.execPath, [HOOK], { input: payload, encoding: "utf8" });

	test("blocks on a real failing command, with exit 0 and JSON on stdout", () => {
		fs.writeFileSync(
			path.join(cwd, "AGENTS.md"),
			'#### Short loop\n\n```bash\nnode -e "console.log(\'expected 4, got 0\'); process.exit(1)"\n```\n',
		);
		run(JSON.stringify(event("UserPromptSubmit")));
		run(JSON.stringify({ ...event("PostToolUse"), tool_name: "Edit" }));
		const stop = run(JSON.stringify({ ...event("Stop"), stop_hook_active: false }));
		assert.equal(stop.status, 0);
		const out = JSON.parse(stop.stdout);
		assert.equal(out.decision, "block");
		assert.match(out.reason, /expected 4, got 0/);
	});

	test("ignores input that is not a hook payload", () => {
		const r = run("not json");
		assert.equal(r.status, 0);
		assert.equal(r.stdout, "");
	});
});
