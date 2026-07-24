# Changelog

All notable changes to the Synter plugin are documented here. This project follows [semantic versioning](https://semver.org).

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
