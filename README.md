<p align="center">
  <img src="assets/logo.png" alt="Synter" width="128" height="128" />
</p>

# Synter — Claude and Cursor plugin

**The AI Agent Operator for Ads.** Claude, Cowork, Claude Code, and Cursor for advertising. You direct, the agents execute.

Connect every ad platform, build audiences from signals and first-party data, generate on-brand creative, plan and launch cross-platform campaigns, and reallocate spend by ROAS — all in one conversation. Nothing that spends money ships without your approval.

One interface. Every ad platform. Ship faster.

---

## Install

### Claude Code

```text
/plugin marketplace add Synter-Media-AI/plugin
/plugin install synter@synter
```

Start a new conversation and run `/synter:quickstart`. Claude opens Synter's
secure browser OAuth flow when the first protected tool is used. Never paste an
API key, access token, or authorization code into chat.

### Claude Desktop and Cowork

Open **Customize → Plugins**. Under **Personal plugins**, click **+ → Add
marketplace → Add from a repository**, enter `Synter-Media-AI/plugin`, and
install `synter` from that marketplace. The full GitHub URL also works.

Alternatively, download the package from the [latest GitHub
release](https://github.com/Synter-Media-AI/plugin/releases/latest) and choose
**+ → Upload plugin**. A tagged release (`synter--v*`) rebuilds the zip through
the repository's release workflow.

Start a new conversation after installation and complete the Synter browser
sign-in prompt. Skills work in Claude chat and Cowork; hooks and sub-agents run
in Cowork. The plugin can be installed directly today, but it will not appear
in Anthropic's public directory until Anthropic approves the separate community
submission.

Official install documentation: [Use plugins in Claude](https://support.claude.com/en/articles/13837440-use-plugins-in-claude) and [Install plugins in Cowork](https://claude.com/docs/cowork/guide/plugins).

### Cursor

**Team / local:** import `https://github.com/Synter-Media-AI/plugin` under **Dashboard → Plugins → Team Marketplaces**, or symlink this repo into `~/.cursor/plugins/local/synter` and reload the window.

**Public marketplace:** submit this repository at [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish). Cursor reviews every listing; the plugin is MIT and open source.

After install, set `SYNTER_API_KEY` in **Plugins → Configure**. The hosted MCP is `https://mcp.syntermedia.ai`.

Free GA4 and onboarding tools work with no key and no credits.

> Campaign write actions spend real money — every spend asks for your approval first.

### ChatGPT (Developer Mode / Connectors)

ChatGPT's custom-connector setup (**Settings → Connectors → Advanced → Developer mode**, or the Workspace admin equivalent under **Apps**) accepts Synter's production remote MCP server through OAuth 2.1:

- [Developer mode and MCP apps in ChatGPT](https://help.openai.com/en/articles/12584461-developer-mode-and-full-mcp-connectors-in-chatgpt-beta) (OpenAI Help Center) — app setup lets you "pick the authentication mechanism, if applicable," then walks through the OAuth authorization prompt; no custom-header option is described.
- [Authentication – Apps SDK](https://developers.openai.com/apps-sdk/build/auth) (OpenAI Developers) — the only documented way to add custom auth to an MCP server ChatGPT connects to is a full OAuth 2.1 flow (protected-resource metadata, CIMD/DCR, PKCE). Static API keys or bearer headers aren't part of the spec ChatGPT implements.

Add `https://mcp.syntermedia.ai` as the remote MCP URL and complete the Synter authorization flow in the browser. The hosted service publishes OAuth authorization-server and protected-resource metadata, supports dynamic client registration and PKCE, and returns the required resource challenge to unauthenticated MCP clients.

Supported connection paths are:

- **ChatGPT** — connect the production MCP URL and authorize with OAuth 2.1.
- **Claude Code, Claude Desktop, or Cowork** — install this plugin and authorize with OAuth 2.1 in the browser.
- **Cursor** — install the Cursor plugin and set `SYNTER_API_KEY` in **Plugins → Configure**.
- **Any other MCP client that supports custom headers** — wire the HTTP endpoint directly with `X-Synter-Key: syn_your_api_key_here` (see "Wire the MCP straight into any client" below).
- **A client with no remote-MCP support** — run the published stdio server locally: `SYNTER_API_KEY=syn_... npx -y @synterai/mcp-server` (get a key at [syntermedia.ai/developer](https://syntermedia.ai/developer)).

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
│   ├── plugin.json          # Claude/Cowork plugin manifest
│   └── marketplace.json     # Claude Code marketplace
├── .cursor-plugin/
│   ├── plugin.json          # Cursor Plugin manifest + SYNTER_API_KEY variable
│   └── marketplace.json     # Cursor Team Marketplace index
├── .mcp.json                # Synter remote MCP for Claude (browser OAuth)
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

> **Don't cross-wire the two MCP configs.** `.mcp.json` is Claude-only and uses browser OAuth with no static credentials; `mcp.json` is Cursor-only and interpolates `${SYNTER_API_KEY}` from the Cursor plugin's variables. Copying the Cursor header into Claude bypasses the supported secure sign-in flow and violates public-directory requirements.

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

**HTTP with browser OAuth (recommended)**
```json
{
  "mcpServers": {
    "synter": {
      "type": "http",
      "url": "https://mcp.syntermedia.ai"
    }
  }
}
```

Clients that do not implement remote MCP OAuth can instead use an
`X-Synter-Key` header if they support custom headers, or the stdio package
below. Create a key at [syntermedia.ai/developer](https://syntermedia.ai/developer)
and store it in the client's secret configuration, never in chat.

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

[Privacy](https://syntermedia.ai/privacy) · [Terms](https://syntermedia.ai/terms) · [Support](https://syntermedia.ai/contact) · MIT licensed. © 2026 Synter.
