#!/usr/bin/env node
// Synter agent runner — headless Claude Agent SDK harness that loads the Synter
// plugin (skills + agents + hooks + MCP) and runs the operator unattended.
//
// Usage:
//   SYNTER_API_KEY=syn_... node sdk/synter-agent.mjs "How's my spend this week?"
//   SYNTER_API_KEY=syn_... node sdk/synter-agent.mjs "/synter:report last 7 days"
//
// Safety: by default this runner is READ-ONLY. Read tools run automatically;
// anything that spends money or mutates a campaign is DENIED, because no human
// is here to approve it. Pass --allow-writes to lift that (use with care — the
// agent can spend real money), or run the plugin interactively in Claude Code
// to approve actions one by one.

import { query } from "@anthropic-ai/claude-agent-sdk";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = resolve(__dirname, "..");

const argv = process.argv.slice(2);
const allowWrites = argv.includes("--allow-writes");
const prompt =
  argv.filter((a) => a !== "--allow-writes").join(" ").trim() ||
  "Give me a quick status: what ad accounts are connected, and any obvious wins or wasted spend in the last 7 days.";

const apiKey = process.env.SYNTER_API_KEY || "";
if (!apiKey) {
  console.error(
    "[synter] No SYNTER_API_KEY set — only free GA4 + onboarding tools will work. Get a key at syntermedia.ai/developer."
  );
}

// Read-only Synter MCP tools (safe to run unattended). Everything else that
// touches an account is treated as a mutation and blocked unless --allow-writes.
const READ_ONLY = [
  /^mcp__synter__(list_|get_|pull_|ga4_|run_gaql_query$|reconcile_platforms$|forecast_campaign$|find_audience_signals$|similarweb_|measure_incrementality$|synter_onboarding_status$|verify_)/,
];
const SAFE_BUILTINS = /^(Read|Glob|Grep|WebFetch|WebSearch|TodoWrite|Task)$/;

function classify(toolName) {
  if (SAFE_BUILTINS.test(toolName)) return "allow";
  if (READ_ONLY.some((re) => re.test(toolName))) return "allow";
  if (toolName.startsWith("mcp__synter__")) return "mutation";
  // Non-Synter writes (Edit/Write/Bash) — block by default in this runner.
  if (/^(Write|Edit|NotebookEdit|Bash)$/.test(toolName)) return "mutation";
  return "allow"; // skills, agent dispatch, etc.
}

async function canUseTool(toolName, input) {
  const kind = classify(toolName);
  if (kind === "allow") return { behavior: "allow", updatedInput: input };
  if (allowWrites) return { behavior: "allow", updatedInput: input };
  return {
    behavior: "deny",
    message:
      `Blocked: '${toolName}' spends money or mutates an account, and no human is here to approve it. ` +
      `Report what you would do and why instead. (Re-run with --allow-writes, or use Claude Code interactively to approve.)`,
  };
}

const options = {
  plugins: [{ type: "local", path: PLUGIN_ROOT }],
  // Provide the Synter MCP from the environment for headless use. (Interactive
  // installs get it from the plugin's userConfig instead.)
  mcpServers: {
    synter: {
      type: "http",
      url: "https://mcp.syntermedia.ai",
      headers: apiKey ? { "X-Synter-Key": apiKey } : {},
    },
  },
  canUseTool,
  maxTurns: 30,
};

console.error(
  `[synter] plugin: ${PLUGIN_ROOT}\n[synter] mode: ${allowWrites ? "WRITES ALLOWED ⚠" : "read-only (default)"}\n[synter] prompt: ${prompt}\n`
);

for await (const message of query({ prompt, options })) {
  if (message.type === "system" && message.subtype === "init") {
    console.error("[synter] plugins:", JSON.stringify(message.plugins || []));
    console.error("[synter] skills:", (message.skills || []).join(", "));
  }
  if (message.type === "assistant") {
    for (const block of message.message.content) {
      if (block.type === "text") process.stdout.write(block.text);
    }
  }
  if (message.type === "result") {
    console.error(
      `\n[synter] done — ${message.subtype} (${message.num_turns} turns)`
    );
  }
}
