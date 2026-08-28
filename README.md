<p align="center">
  <img src="assets/logo.png" alt="Synter" width="128" height="128" />
</p>

# Synter — Claude Code & Cursor plugin

**The AI Agent Operator for Ads.** Claude Code and Cursor for advertising. You direct, the agents execute.

Connect every ad platform, build audiences from signals and first-party data, generate on-brand creative, plan and launch cross-platform campaigns, and reallocate spend by ROAS — all in one conversation. Nothing that spends money ships without your approval.

One interface. Every ad platform. Ship faster.

---

## Install

### Claude Code

```text
/plugin marketplace add Synter-Media-AI/plugin
/plugin install synter@synter
```

Create a key at [syntermedia.ai/developer](https://syntermedia.ai/developer) and paste it when enabling the plugin — the Synter MCP server rejects unauthenticated connections, so the plugin cannot start without one. Once enabled, `/synter:quickstart` handles first-run onboarding.

### Claude Desktop

Claude Desktop's **Settings → Plugins** UI installs this plugin either of two ways:

**Add marketplace** — click **Add marketplace**, point it at `Synter-Media-AI/plugin` (the GitHub repo, same source Claude Code's `/plugin marketplace add` reads), then install `synter` from the listing. This tracks `main`, so you always get the latest tagged manifests.

**Upload plugin** — download the packaged zip from the [v1.0.0 release](https://github.com/Synter-Media-AI/plugin/releases/latest/download/synter-plugin-1.0.0.zip) (browse all releases at [github.com/Synter-Media-AI/plugin/releases](https://github.com/Synter-Media-AI/plugin/releases)) and drag it into **Upload plugin**. Every tagged release (`synter--v*`) rebuilds this zip via `.github/workflows/release.yml`, with the plugin manifest at the archive root — the layout Desktop's upload flow expects.

Both routes need the same API key as Claude Code — create one at [syntermedia.ai/developer](https://syntermedia.ai/developer) and paste it when enabling the plugin.

### Cursor

**Team / local:** import `https://github.com/Synter-Media-AI/plugin` under **Dashboard → Plugins → Team Marketplaces**, or symlink this repo into `~/.cursor/plugins/local/synter` and reload the window.

**Public marketplace:** submit this repository at [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish). Cursor reviews every listing; the plugin is MIT and open source.

After install, set `SYNTER_API_KEY` in **Plugins → Configure**. The hosted MCP is `https://mcp.syntermedia.ai`.

Free GA4 and onboarding tools work with no key and no credits.

> Campaign write actions spend real money — every spend asks for your approval first.

### ChatGPT (Developer Mode / Connectors)

ChatGPT's custom-connector setup (**Settings → Connectors → Advanced → Developer mode**, or the Workspace admin equivalent under **Apps**) accepts a remote MCP server URL plus an authentication mechanism — but per OpenAI's own docs, that mechanism is limited to **no authentication** or **OAuth 2.1**. There's no field for a static API key or a custom request header. Verified against OpenAI's current documentation:

- [Developer mode and MCP apps in ChatGPT](https://help.openai.com/en/articles/12584461-developer-mode-and-full-mcp-connectors-in-chatgpt-beta) (OpenAI Help Center) — app setup lets you "pick the authentication mechanism, if applicable," then walks through the OAuth authorization prompt; no custom-header option is described.
- [Authentication – Apps SDK](https://developers.openai.com/apps-sdk/build/auth) (OpenAI Developers) — the only documented way to add custom auth to an MCP server ChatGPT connects to is a full OAuth 2.1 flow (protected-resource metadata, CIMD/DCR, PKCE). Static API keys or bearer headers aren't part of the spec ChatGPT implements.

Synter's hosted MCP server authenticates every request with a static `X-Synter-Key` header — the same credential the Claude Code, Claude Desktop, and Cursor configs above send — and doesn't implement OAuth. **That means pointing ChatGPT's connector picker straight at `https://mcp.syntermedia.ai` won't authenticate today: ChatGPT has no field to carry the required key.** This is a real gap, not a documentation omission — closing it means adding an OAuth 2.1 front end to the MCP server, which is out of scope for this release.

Until then, the working paths to Synter's tools are the ones already documented on this page:

- **Claude Code, Claude Desktop, or Cursor** — the plugin sends the header correctly out of the box (see Install above).
- **Any other MCP client that supports custom headers** — wire the HTTP endpoint directly with `X-Synter-Key: syn_your_api_key_here` (see "Wire the MCP straight into any client" below).
- **A client with no remote-MCP support at all** — run the published stdio server locally: `SYNTER_API_KEY=syn_... npx -y @synterai/mcp-server` (get a key at [syntermedia.ai/developer](https://syntermedia.ai/developer)). Note this doesn't help ChatGPT specifically — ChatGPT's connector product only reaches remote HTTPS servers, it cannot spawn a local stdio process.

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
│   ├── plugin.json          # Claude Code manifest + userConfig (API key)
│   └── marketplace.json     # Claude Code marketplace
├── .cursor-plugin/
│   ├── plugin.json          # Cursor Plugin manifest + SYNTER_API_KEY variable
│   └── marketplace.json     # Cursor Team Marketplace index
├── .mcp.json                # Synter MCP for Claude (header: ${user_config.synter_api_key})
├── mcp.json                 # Synter MCP for Cursor (header: ${SYNTER_API_KEY})
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

> **Don't cross-wire the two MCP configs.** `.mcp.json` is Claude-only and must interpolate `${user_config.synter_api_key}` (sourced from `.claude-plugin/plugin.json`'s `userConfig`); `mcp.json` is Cursor-only and must interpolate `${SYNTER_API_KEY}` (sourced from `.cursor-plugin/plugin.json`'s `variables`). Copying one file's header value into the other silently breaks that client's authentication.

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
