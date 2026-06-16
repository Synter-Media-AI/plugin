# Changelog

All notable changes to the Synter plugin are documented here. This project follows [semantic versioning](https://semver.org).

## [0.1.0] — 2026-06-16

Initial release. The AI Agent Operator for Ads, packaged for Claude Code / Claude Desktop.

### Added
- **MCP server** — Synter Advertising Platform (`https://mcp.syntermedia.ai`), cross-platform ad read/write. Free GA4 + onboarding tools work without a key.
- **Workflow skills** (`/synter:*`) — quickstart, connect, audience, creative, launch, optimize, report, help.
- **Craft skills** — 15 advertising-methodology skills bundled from Synter's library: ad-copy-generation, ad-policy-compliance, anomaly-detector, bid-optimization, campaign-preflight, campaign-structure-auditor, competitor-analysis, creative-fatigue-detector, executive-reporting, kill-scale-rules, landing-page-creation, mmm-budget-planner, platform-cost-benchmarks, roas-calculator, utm-builder. Internal-execution runbooks (Doppler/DB-coupled) deliberately excluded.
- **Agents** — campaign-strategist, media-buyer, audience-builder, creative-director, budget-optimizer, performance-analyst.
- **Hook** — SessionStart primer enforcing the money-safety rules and brand voice.
- **Output style** — `synter` agent voice.
- **Context** — bundled brand-voice and safety rules referenced by skills and agents.
- `userConfig.synter_api_key` for turnkey, secure key entry at enable time.
