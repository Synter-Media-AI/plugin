# Changelog

All notable changes to the Synter plugin are documented here. This project follows [semantic versioning](https://semver.org).

## [1.0.0] — 2026-08-27

### Changed
- **Approval gating is universal again.** The Solo/Scale tier carve-out that allowed direct single-turn execution has been reverted — every tier now requires explicit approval before any create/enable/budget/launch/pause call that spends money. Reads (`list_*`, `get_*`, `pull_*`, `verify_*`, reports) remain free to run without asking. The session-start hook, output style, and brand-and-safety context all describe the same universal gate again.
- Version canonicalized to **1.0.0** across `.claude-plugin/plugin.json`, `.cursor-plugin/plugin.json`, and `.cursor-plugin/marketplace.json`, closing the skew between the Claude and Cursor packaging surfaces.

### Added
- **Packaging and release automation** — a zip build produces `dist/synter-plugin-<version>.zip` with the plugin at the archive root, matching Claude Desktop's zip-upload layout. CI validates every PR (manifest JSON, marketplace/plugin name match, skill frontmatter, `.mcp.json`/`mcp.json` interpolation guards) and a release workflow attaches the built zip to the GitHub Release on each `synter--v*` tag push.

### Fixed
- README no longer tells Claude Code installers they can "leave it blank" — `userConfig.synter_api_key` is `required: true` and a blank key yields zero Synter tools (see 0.1.1 below). The install steps now point straight at [syntermedia.ai/developer](https://syntermedia.ai/developer) and clarify that `.mcp.json` (Claude) and `mcp.json` (Cursor) use different key-interpolation syntax and must not be cross-wired.

## [0.4.1] — 2026-08-19

### Added
- **Cursor Plugin packaging** — `.cursor-plugin/plugin.json`, `.cursor-plugin/marketplace.json`, and `mcp.json` so the same repo can be imported as a Cursor Team Marketplace and submitted to the [Cursor Marketplace](https://cursor.com/marketplace/publish). The hosted Synter MCP (`https://mcp.syntermedia.ai`) takes `SYNTER_API_KEY` via Cursor plugin variables. Listing metadata includes the Synter mark (`assets/logo.png`, 1024×1024) and the marketplace description on both the plugin manifest and the marketplace index.

### Fixed
- Cursor install no longer requires `SYNTER_API_KEY` up front (onboarding and free GA4 tools work without one). HTTP MCP declares `type: "http"`. Logo uses an absolute GitHub URL so the marketplace crawler does not 404. Cursor hooks use `sessionStart` instead of Claude's `SessionStart`.

## [0.4.0] — 2026-08-04

RSA asset floor: the Google Ads API accepts as few as 3 headlines and 2 descriptions, but ads built at that minimum score "Poor" on Google Ad Strength and get throttled in the auction. The plugin now enforces a real floor everywhere ad copy is created or reviewed.

### Changed
- **`ad-copy-generation`** — RSAs require **11 headlines / 4 descriptions minimum (15/4 recommended)**, every slot filled, the ad group's actual keywords echoed in at least 5 headlines, no filler padding, no truncation (rewrite to the character limit instead).
- **`campaign-preflight`** — new blocking "Creative asset completeness" check: per-ad asset counts read from the platform and compared against the floor; Google Ad Strength POOR/AVERAGE must be fixed before launch; the same fill-every-slot rule applies on every platform at its own ceiling.
- **`creative-director`** and **`media-buyer`** agents — carry the floor rule wherever they direct ad creation or launch.

## [0.3.0] — 2026-07-25

Fourteen new skills deepening diagnostics, measurement, and creative coverage — every one grounded exclusively in public Synter MCP tools.

### Added
- **Platform depth** — `meta-ads-diagnostics` (Learning Phase, fatigue, overlap, Advantage+), `google-ads-quality-score`, `google-shopping-optimizer` (feeds, disapprovals, Shopping vs PMax), `performance-max-optimizer` (asset groups, brand cannibalization), `linkedin-ads-targeting` (ABM, lead gen forms).
- **Measurement & data** — `pixel-capi-auditor` (dedup, Event Match Quality), `first-party-data-strategy` (Enhanced Conversions, server-side tagging, Consent Mode v2), `incrementality-testing` (geo holdouts, lift studies), `attribution` companions via `measure_incrementality` and `get_attribution`.
- **Strategy** — `retargeting-sequence-designer` (staged funnels, recency windows, exclusions), `seasonal-budget-planner` (build your own seasonality index from your account data), `audience-expansion-strategy` (lookalike ladders, seed quality, layering), `geo-integrity-audit` (location-criteria and click-geography verification).
- **Creative** — `video-ad-scriptwriter` (platform-specific scripts with timing marks), `ugc-creative-brief` (briefs, hooks, usage-rights structure).

## [0.2.0] — 2026-07-22

Broadened skill and agent coverage so the operator can plan, port, and run campaigns across every platform without falling back on internal tools it cannot reach.

### Added
- **`replicate` workflow skill** (`/synter:replicate`) — rebuild an existing campaign from one platform onto another (read the source structure, map it to the target, preflight, ship). Fixes the gap where "build my Google campaign on Microsoft" had no guided path.
- **Platform playbooks** — `platform-google`, `platform-microsoft`, `platform-meta`, `platform-linkedin`, `platform-tiktok`, `platform-reddit`, `platform-x`, `platform-amazon`, `platform-openai`. Structure, targeting, and the real cross-platform mapping differences per channel.
- **Operational skills** — `media-plan`, `keyword-research`, `negative-keywords`, `bid-optimization`, `dayparting`, `kill-scale-rules`, `pre-pause-analysis`, `platform-benchmarks`, `conversion-tracking`, `attribution`, `utm-builder`, `competitor-analysis`, `creative-testing`, `ad-copy-generation`.
- Agents `media-buyer` and `campaign-strategist` now point at the `replicate` workflow and the platform playbooks.

### Changed
- **`campaign-preflight`** rewritten to use only public MCP tools. The prior version referenced internal backend scripts (`*_validate_campaign_structure`, `run_gaql`, `verify_website_tracking`, `POST /tools/run` blocks) that the public MCP does not expose, and carried a hardcoded country blocklist. Now grounded in `run_gaql_query`, `ga4_list_conversions`, `get_gtm_tag`, and `verify_pixel_ownership`.
- **`mmm-budget-planner`** rewritten around the public `optimize_budget`, `get_attribution`, and `measure_incrementality` tools instead of internal `mmm_*` training scripts that are not available through the MCP.

### Note on exclusions
The new `kill-scale-rules`, `platform-benchmarks`, and `pre-pause-analysis` skills ship **generic methodology only**. Synter's proprietary numeric thresholds and cost-benchmark tables remain withheld — these skills teach the approach and defer to the account's own data, they do not carry the internal numbers. Internal runbooks and infrastructure-coupled skills are still not shipped.

## 0.1.1 — 2026-07-20

### Fixed
- **API key is now required at plugin enable time.** The previous config invited users to
  "leave blank to onboard," but the hosted Synter MCP server (mcp.syntermedia.ai) rejects
  unauthenticated connections with a 401 — so a blank key meant the MCP server silently
  failed to load and Claude had skill files but zero Synter tools. Requiring the key up
  front prevents the broken skills-without-tools state. Get a key at syntermedia.ai/developer.


## [0.1.0] — 2026-06-16

Initial release. The AI Agent Operator for Ads, packaged for Claude Code / Claude Desktop.

### Added
- **MCP server** — Synter Advertising Platform (`https://mcp.syntermedia.ai`), cross-platform ad read/write. Free GA4 + onboarding tools work without a key.
- **Workflow skills** (`/synter:*`) — quickstart, connect, audience, creative, launch, optimize, report, help.
- **Craft skills** — 9 generic advertising-methodology skills: ad-policy-compliance, anomaly-detector, campaign-preflight, campaign-structure-auditor, creative-fatigue-detector, executive-reporting, landing-page-creation, mmm-budget-planner, roas-calculator. Deliberately excluded from the public package: internal-execution runbooks (Doppler/DB-coupled), Synter's proprietary operating playbooks (kill/scale thresholds, cost-benchmark + budget-split logic), and skills referencing internal infrastructure (pixel pipeline, table names, non-public tools).
- **Agents** — campaign-strategist, media-buyer, audience-builder, creative-director, budget-optimizer, performance-analyst.
- **Hook** — SessionStart primer enforcing the money-safety rules and brand voice.
- **Output style** — `synter` agent voice.
- **Context** — bundled brand-voice and safety rules referenced by skills and agents.
- `userConfig.synter_api_key` for turnkey, secure key entry at enable time.
- **SDK runner** (`sdk/synter-agent.mjs`) — headless [`@anthropic-ai/claude-agent-sdk`](https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk) harness that loads the plugin and runs the operator unattended. Read-only by default (spend/mutation auto-denied via `canUseTool`); `--allow-writes` to lift. Verified: SDK loads all 23 skills + 6 agents.
