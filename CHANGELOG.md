# Changelog

All notable changes to the Synter plugin are documented here. This project follows [semantic versioning](https://semver.org).

## [0.1.0] — 2026-06-16

Initial release. The AI Agent Operator for Ads, packaged for Claude Code / Claude Desktop.

### Added
- **MCP server** — Synter Advertising Platform (`https://mcp.syntermedia.ai`), cross-platform ad read/write. Free GA4 + onboarding tools work without a key.
- **Skills** (`/synter:*`) — quickstart, connect, audience, creative, launch, optimize, report, help.
- **Agents** — campaign-strategist, media-buyer, audience-builder, creative-director, budget-optimizer, performance-analyst.
- **Hook** — SessionStart primer enforcing the money-safety rules and brand voice.
- **Output style** — `synter` agent voice.
- **Context** — bundled brand-voice and safety rules referenced by skills and agents.
- `userConfig.synter_api_key` for turnkey, secure key entry at enable time.
