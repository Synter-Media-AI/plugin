---
name: help
description: Explain the bundled skills, supported MCP tools, OAuth setup, and support options.
---

# Synter help

This plugin connects to Synter’s hosted read-only MCP profile (`https://mcp.synterai.com/mcp/directory`) over OAuth. Use **quickstart** to sign in and **connect** to verify accounts.

Main read-only workflows:

- **report** and **attribution**: review performance and reconcile measurement.
- **media-plan** and **roas-calculator**: build media plans, forecast outcomes, and check profitability math.
- **audience-expansion-strategy** and **linkedin-ads-targeting**: inspect existing audiences and plan targeting.
- **ugc-creative-brief** and **video-ad-scriptwriter**: draft creative briefs and scripts for the verified advertiser.
- **campaign-structure-auditor** and **pixel-capi-auditor**: audit campaign hygiene and conversion tracking.

The README lists every bundled skill and agent. Both `tools/directory-tools.json` and `tools/readonly-tools.json` list the 94 read-only MCP tools exposed on `https://mcp.synterai.com/mcp/directory`. Use only tools available in that directory and the live server schema; report unavailable capabilities plainly, and direct spend-changing or write operations to the full Synter product at https://synterai.com.

The Claude package runs a SessionStart shell hook that prints static operating guidance. Cursor and Antigravity use the rules files. The optional SDK runner in the repository is launched manually.

[Privacy](https://synterai.com/privacy) · [Support](https://synterai.com/contact)
