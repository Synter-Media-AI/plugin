# Synter — Claude Code plugin

**The AI Agent Operator for Ads.** Claude Code for advertising. You direct, the agents execute.

Connect every ad platform, build audiences from signals and first-party data, generate on-brand creative, plan and launch cross-platform campaigns, and reallocate spend by ROAS — all in one conversation. Nothing that spends money ships without your approval.

One interface. Every ad platform. Ship faster.

---

## Install

In Claude Code:

```text
/plugin marketplace add Synter-Media-AI/plugin
/plugin install synter@synter
```

When enabling, paste your **Synter API key** (`syn_...`) — or leave it blank and run `/synter:quickstart` to onboard and get one. Create a key at [syntermedia.ai/developer](https://syntermedia.ai/developer).

Free GA4 and onboarding tools work with no key and no credits.

> Requires Claude Code with plugin support. US data; campaign write actions spend real money — every spend asks for your approval first.

---

## What's in the box

This plugin packages **agents, skills, an MCP server, a hook, and an output style** — the same shape as the [Watt Data plugin](https://github.com/wattdata/plugin), built for Synter.

### Skills — `/synter:*`

| Command | Does |
| --- | --- |
| `/synter:quickstart` | Onboard, connect a platform, run a first action. |
| `/synter:connect` | Link ad platforms and GA4 — Google, Meta, LinkedIn, Microsoft, Reddit, TikTok, X, Amazon, and more. |
| `/synter:audience` | Build ABM lists, lookalikes, and signal-based segments; activate them. |
| `/synter:creative` | Generate on-brand images, video, UGC, and ad copy. |
| `/synter:launch` | Plan, preflight, and ship a cross-platform campaign. |
| `/synter:replicate` | Rebuild an existing campaign from one platform onto another (e.g. Google to Microsoft). |
| `/synter:optimize` | Cut wasted spend, scale winners, reallocate budget by ROAS. |
| `/synter:outbound` | Run cold email through Prospector — pipeline, campaigns, sending health. |
| `/synter:report` | Cross-channel performance report and exec summary. |
| `/synter:help` | What Synter can do, and where to get support. |

### Craft skills

Bundled alongside the workflows is a library of advertising-craft knowledge skills Claude pulls in automatically when the task fits.

**Platform playbooks** — structure, targeting, and cost realities per platform:
`platform-google` · `platform-microsoft` · `platform-meta` · `platform-linkedin` · `platform-tiktok` · `platform-reddit` · `platform-x` · `platform-amazon` · `platform-openai`

**Plan & structure:** `media-plan` · `keyword-research` · `negative-keywords` · `campaign-preflight` · `campaign-structure-auditor` · `platform-benchmarks`

**Bid & budget:** `bid-optimization` · `dayparting` · `kill-scale-rules` · `pre-pause-analysis` · `roas-calculator` · `mmm-budget-planner` · `anomaly-detector`

**Creative:** `ad-copy-generation` · `creative-testing` · `creative-fatigue-detector` · `ad-policy-compliance` · `landing-page-creation`

**Measurement:** `conversion-tracking` · `attribution` · `utm-builder` · `executive-reporting`

**Outbound:** `outbound-research` · `outbound-replies`

**Research:** `competitor-analysis`

(Internal runbooks, Synter's proprietary operating playbooks, and anything that names internal infrastructure are intentionally not shipped — this plugin acts through the Synter MCP, not bundled scripts.)

### Agents — `/agents`

`campaign-strategist` · `media-buyer` · `audience-builder` · `creative-director` · `budget-optimizer` · `performance-analyst` · `visibility-agent`

They run automatically when the task fits, or call one directly.

### MCP server

The Synter Advertising Platform MCP (`https://mcp.syntermedia.ai`) — cross-platform campaign read/write, creative generation, audiences, attribution, and GA4. Tools register automatically once the plugin is enabled.

---

## Structure

```text
plugin/
├── .claude-plugin/
│   ├── plugin.json          # manifest + userConfig (API key)
│   └── marketplace.json     # one-plugin marketplace
├── .mcp.json                # Synter MCP (HTTP, key via userConfig header)
├── skills/                  # /synter:* slash commands (SKILL.md each)
├── agents/                  # subagent definitions
├── hooks/hooks.json         # SessionStart safety + voice primer
├── scripts/session-context.sh
├── context/brand-and-safety.md
├── output-styles/synter.md
├── sdk/                     # headless Claude Agent SDK runner
│   ├── synter-agent.mjs
│   └── README.md
├── CHANGELOG.md
└── LICENSE                  # MIT
```

---

## Run it headlessly — Claude Agent SDK

A ready-to-run agent harness lives in [`sdk/`](./sdk). It loads this plugin with the SDK and runs the Synter operator unattended — **read-only by default** (spend/mutation is auto-denied with no human to approve). Good for cron digests, pipelines, or embedding.

```bash
cd sdk && npm install
SYNTER_API_KEY=syn_... node synter-agent.mjs "/synter:report last 7 days"
```

See [`sdk/README.md`](./sdk/README.md) for the safety model, `--allow-writes`, and the Python equivalent.

Under the hood it's just:

```ts
import { query } from "@anthropic-ai/claude-agent-sdk";
for await (const m of query({
  prompt: "/synter:report last 7 days",
  options: { plugins: [{ type: "local", path: "/path/to/plugin" }] },
})) { /* skills, agents, hooks, MCP all loaded */ }
```

### Or wire the MCP straight into any client

**HTTP (recommended)**
```json
{
  "mcpServers": {
    "synter": {
      "type": "http",
      "url": "https://mcp.syntermedia.ai",
      "headers": { "X-Synter-Key": "syn_your_api_key_here" }
    }
  }
}
```

**stdio (Claude Desktop)** — via the public SDK [`@synterai/mcp-server`](https://www.npmjs.com/package/@synterai/mcp-server):
```json
{
  "mcpServers": {
    "synter": {
      "command": "npx",
      "args": ["@synterai/mcp-server"],
      "env": { "SYNTER_API_KEY": "syn_your_api_key_here" }
    }
  }
}
```

---

## Safety

Your agent can create campaigns, change budgets, and pause spend. The plugin defaults to **recommend-then-execute** and asks for explicit approval before anything spends money. It confirms the org/account before any write, uses only the real IDs the platform returns, and guards against fat-finger budgets. Reads are always free to run.

---

## Develop

```bash
git clone https://github.com/Synter-Media-AI/plugin synter-plugin && cd synter-plugin
claude plugin validate . --strict   # check the manifest + frontmatter
claude --plugin-dir .               # load locally without a marketplace
```

After editing `hooks/`, `.mcp.json`, or `agents/`, run `/reload-plugins`.

MIT licensed. © 2026 Synter.
