#!/usr/bin/env node
// Synter agent runner — headless Claude Agent SDK harness that loads the Synter
// plugin (skills + agents + hooks + MCP) and runs the operator unattended.
//
// Usage:
//   node sdk/synter-agent.mjs "How's my spend this week?"
//   node sdk/synter-agent.mjs "/synter:report last 7 days"
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

// Read-only Synter MCP tools (safe to run unattended). Everything else that
// touches an account is treated as a mutation and blocked unless --allow-writes.
const READ_ONLY = new Set([
  "get_connection_status",
  "list_connected_accounts",
  "verify_platform_accounts",
  "list_campaigns",
  "pull_google_ads_performance",
  "pull_meta_ads_performance",
  "pull_linkedin_ads_performance",
  "pull_microsoft_ads_performance",
  "pull_reddit_ads_performance",
  "ga4_get_properties",
  "ga4_get_report",
  "ga4_get_conversions",
  "get_attribution",
  "get_spend_reconciliation",
  "get_pixel_health",
  "list_audiences",
  "list_creative_assets",
  "get_campaign_plan",
  "get_plan_execution",
  "get_job_status"
]);
const SAFE_BUILTINS = /^(Read|Glob|Grep|WebFetch|WebSearch|TodoWrite|Task)$/;

function classify(toolName) {
  if (SAFE_BUILTINS.test(toolName)) return "allow";
  if (toolName.startsWith("mcp__synter__") && READ_ONLY.has(toolName.slice("mcp__synter__".length))) return "allow";
  if (toolName.startsWith("mcp__")) return "mutation";
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
  // The plugin supplies its OAuth-only Claude remote MCP configuration.
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
