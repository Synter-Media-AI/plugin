<p align="center">
  <img src="assets/logo.png" alt="Synter" width="128" height="128" />
</p>

# Synter — Claude and Cursor plugin

Plan advertising campaigns, review performance, write ad copy, and apply approved campaign changes through Synter. This plugin is a no-cost client for the paid Synter service. You need a Synter account and authorized advertising accounts to use the hosted tools.

## Install and sign in

### Claude Code

```text
/plugin marketplace add Synter-Media-AI/plugin
/plugin install synter@synter
```

Start a new conversation and run `/synter:quickstart`. Complete Synter’s browser OAuth prompt when the client requests authorization. Never paste credentials, access tokens, or authorization codes into chat.

### Claude Desktop and Cowork

In **Customize → Plugins**, add `Synter-Media-AI/plugin` as a repository marketplace and install `synter`. You can also upload the plugin zip from the [latest GitHub release](https://github.com/Synter-Media-AI/plugin/releases/latest). Start a new conversation and complete the browser OAuth prompt.

Direct installation does not imply that Anthropic has approved a public directory listing.

### Cursor

Import `https://github.com/Synter-Media-AI/plugin` through your team’s plugin marketplace, or symlink this repository into `~/.cursor/plugins/local/synter` and reload Cursor. Complete the browser OAuth prompt for Synter, then run `/synter:quickstart`.

Both plugin configurations use remote HTTP MCP with browser OAuth. They contain no static credentials, environment-variable secrets, or authentication headers:

| Client | Configuration | Hosted MCP URL |
| --- | --- | --- |
| Cursor | `mcp.json`, referenced by `.cursor-plugin/plugin.json` | `https://mcp.synterai.com` |
| Claude | `.mcp.json`, discovered by the Claude plugin | `https://mcp.syntermedia.ai` |

Claude retains the connector URL under Anthropic review. Keep the two configurations separate. For another remote MCP client, use its browser OAuth flow with the appropriate hosted URL. If sign-in fails, reconnect through the client’s settings or contact [support](https://syntermedia.ai/support).

## What this plugin runs

The plugin connects to the hosted Synter MCP server over OAuth. The advertising tools run on that server. Local Markdown skills, agents, and rules guide how the client uses them; the checked-in [tool directory](tools/directory-tools.json) contains the 34 supported tool names.

Claude also runs one `SessionStart` hook from [.claude-plugin/plugin.json](.claude-plugin/plugin.json). It invokes [scripts/session-context.sh](scripts/session-context.sh), a Bash script that uses `cat` to print static account-scope and approval guidance. It does not read credentials or make network requests. Cursor declares no hooks and uses [rules/synter-operator.mdc](rules/synter-operator.mdc).

There is no local MCP server or bundled compiled binary. The repository includes an optional [Node SDK runner](sdk/README.md), invoked manually, and development scripts for validation and packaging. The release zip excludes the SDK. Agent definitions may delegate work when the host client supports them.

Bundled skills (invoke as `/synter:<name>`):

- [`ad-copy-generation`](skills/ad-copy-generation/SKILL.md) · [`ad-policy-compliance`](skills/ad-policy-compliance/SKILL.md) · [`anomaly-detector`](skills/anomaly-detector/SKILL.md) · [`attribution`](skills/attribution/SKILL.md)
- [`audience`](skills/audience/SKILL.md) · [`audience-expansion-strategy`](skills/audience-expansion-strategy/SKILL.md) · [`bid-optimization`](skills/bid-optimization/SKILL.md) · [`campaign-preflight`](skills/campaign-preflight/SKILL.md)
- [`campaign-structure-auditor`](skills/campaign-structure-auditor/SKILL.md) · [`competitor-analysis`](skills/competitor-analysis/SKILL.md) · [`connect`](skills/connect/SKILL.md) · [`conversion-tracking`](skills/conversion-tracking/SKILL.md)
- [`creative-fatigue-detector`](skills/creative-fatigue-detector/SKILL.md) · [`creative-testing`](skills/creative-testing/SKILL.md) · [`dayparting`](skills/dayparting/SKILL.md) · [`executive-reporting`](skills/executive-reporting/SKILL.md)
- [`first-party-data-strategy`](skills/first-party-data-strategy/SKILL.md) · [`geo-integrity-audit`](skills/geo-integrity-audit/SKILL.md) · [`google-ads-quality-score`](skills/google-ads-quality-score/SKILL.md) · [`google-shopping-optimizer`](skills/google-shopping-optimizer/SKILL.md)
- [`help`](skills/help/SKILL.md) · [`incrementality-testing`](skills/incrementality-testing/SKILL.md) · [`keyword-research`](skills/keyword-research/SKILL.md) · [`kill-scale-rules`](skills/kill-scale-rules/SKILL.md)
- [`launch`](skills/launch/SKILL.md) · [`linkedin-ads-targeting`](skills/linkedin-ads-targeting/SKILL.md) · [`media-plan`](skills/media-plan/SKILL.md) · [`meta-ads-diagnostics`](skills/meta-ads-diagnostics/SKILL.md)
- [`mmm-budget-planner`](skills/mmm-budget-planner/SKILL.md) · [`negative-keywords`](skills/negative-keywords/SKILL.md) · [`optimize`](skills/optimize/SKILL.md) · [`performance-max-optimizer`](skills/performance-max-optimizer/SKILL.md)
- [`pixel-capi-auditor`](skills/pixel-capi-auditor/SKILL.md) · [`platform-amazon`](skills/platform-amazon/SKILL.md) · [`platform-benchmarks`](skills/platform-benchmarks/SKILL.md) · [`platform-google`](skills/platform-google/SKILL.md)
- [`platform-linkedin`](skills/platform-linkedin/SKILL.md) · [`platform-meta`](skills/platform-meta/SKILL.md) · [`platform-microsoft`](skills/platform-microsoft/SKILL.md) · [`platform-openai`](skills/platform-openai/SKILL.md)
- [`platform-reddit`](skills/platform-reddit/SKILL.md) · [`platform-tiktok`](skills/platform-tiktok/SKILL.md) · [`platform-x`](skills/platform-x/SKILL.md) · [`pre-pause-analysis`](skills/pre-pause-analysis/SKILL.md)
- [`quickstart`](skills/quickstart/SKILL.md) · [`replicate`](skills/replicate/SKILL.md) · [`report`](skills/report/SKILL.md) · [`retargeting-sequence-designer`](skills/retargeting-sequence-designer/SKILL.md)
- [`roas-calculator`](skills/roas-calculator/SKILL.md) · [`seasonal-budget-planner`](skills/seasonal-budget-planner/SKILL.md) · [`utm-builder`](skills/utm-builder/SKILL.md) · [`video-ad-scriptwriter`](skills/video-ad-scriptwriter/SKILL.md)

Bundled agents: [`audience-builder`](agents/audience-builder.md) · [`budget-optimizer`](agents/budget-optimizer.md) · [`campaign-strategist`](agents/campaign-strategist.md) · [`creative-director`](agents/creative-director.md) · [`media-buyer`](agents/media-buyer.md) · [`performance-analyst`](agents/performance-analyst.md).

[Privacy policy](https://syntermedia.ai/privacy) · [Support](https://syntermedia.ai/support)

## Campaign safety and scope

Confirm the workspace, account name, and account ID before account actions. Use the advertiser’s verified brand and original assets. Writes require an explicit approved scope; a tool’s plan-approval record is not a substitute for the user’s approval.

The launch workflow reads the final plan, runs preflight, records approval, executes, and verifies the returned campaign state. Creating a campaign does not prove it is live or spending. Unsupported operations, including tag publishing and audience synchronization, require a manual handoff to the platform UI.

Text ads use `create_ad_copy`; existing assets use `list_creative_assets`. The plugin reports missing capabilities and data rather than inventing tool names or results.

## Develop and validate

```bash
node scripts/validate-manifests.js
node scripts/check-directory-tools.js
node --test scripts/check-directory-tools.test.js
npx -y @anthropic-ai/claude-code@2.1.263 plugin validate . --strict
bash scripts/build-zip.sh
```

The directory check scans every file under `skills/`, `commands/` (when present), `rules/`, and `agents/`, including prose, tables, and code fences. Spell out exact tool names; dynamic tool-name templates fail validation. Snake-case data fields are recognized separately, but calling them as functions still counts as a tool reference. For a tool name without underscores, use explicit `tool:name` or its MCP-qualified name.

The check runs offline in CI. To also compare the directory against live MCP `tools/list`, supply an OAuth access token through `SYNTER_MCP_TOKEN` in your environment and run the same script. It initializes an MCP session and follows paginated results. `--live` requires the token instead of silently running offline. `SYNTER_MCP_URL` optionally selects either hosted URL in the table; it defaults to the Cursor endpoint. The token is for this development check only and is never written to plugin configuration. Extra live tools do not expand the checked-in directory.

[Terms](https://syntermedia.ai/terms) · [MIT license](LICENSE)
