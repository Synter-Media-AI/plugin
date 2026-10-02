---
name: help
description: Explain the bundled skills, supported MCP tools, OAuth setup, and support options.
---

# Synter help

This plugin connects to Synter’s hosted advertising service over OAuth. Use **quickstart** to sign in and **connect** to verify accounts.

Main workflows:

- **report** and **attribution**: review performance and reconcile measurement.
- **media-plan**, **launch**, and **replicate**: prepare campaign plans and execute approved changes.
- **audience**: inspect existing audiences and plan targeting.
- **ad-copy-generation**: write text ads for the verified advertiser.
- **optimize**: review budget opportunities and apply approved changes.

The README lists every bundled skill and agent. The supported tool directory is `tools/directory-tools.json`. Use only tools available in that directory and the live server schema; report unavailable capabilities plainly.

The Claude package runs a SessionStart shell hook that prints static operating guidance. Cursor uses the rules file. The optional SDK runner in the repository is launched manually.

[Privacy](https://syntermedia.ai/privacy) · [Support](https://syntermedia.ai/support)
