# Synter

Synter executes approval-gated advertising campaigns on 30+ ad platforms. This plugin helps you review performance, prepare campaign plans, write ad copy, and approve changes through Synter's hosted MCP service. Start with the quickstart skill, sign in through the browser OAuth prompt, and verify the connected workspace and advertising account before using account data.

This directory package includes 56 Markdown skills, six agent instructions, an output style, and static [brand and safety guidance](context/brand-and-safety.md). Its only service connection is the remote HTTPS MCP server declared in `.mcp.json` (`https://mcp.synterai.com/mcp/directory`, the curated directory profile). It contains no local lifecycle hooks, executable scripts, or SDK runner. Tool availability follows the bundled [tool directory](tools/directory-tools.json) and the live server schema.

Read-only account lookups and reports can run directly. Before any campaign creation, activation, pause, budget adjustment, or other spend-changing action, review the proposed account, scope, and amounts and give explicit approval. After execution, check the provider readback before treating a change as complete. Use the verified advertiser's brand and original assets; do not substitute Synter's branding for another advertiser.

```mermaid
flowchart LR
  User["Your request and approval"] --> Claude["Claude with Synter instructions"]
  Claude --> MCP["Synter HTTPS MCP over OAuth"]
  MCP --> Provider["Your connected advertising accounts"]
  Provider --> Readback["Results and verification"]
  Readback --> Claude
```

Tool arguments and account results pass through Synter's hosted service and the connected advertising provider. Never paste passwords, API keys, or access tokens into chat. Sample data must be identified as sample data; missing account access or unavailable metrics must be reported plainly. Read [Synter's privacy policy](https://synterai.com/privacy) for data handling and [terms](https://synterai.com/terms) for service conditions.

## Install

In Claude Code, add Synter's marketplace and install the plugin, then complete the browser OAuth prompt:

```text
/plugin install synter --marketplace Synter-Media-AI/plugin
```

## Pricing

Performance reporting uses credits. Actions start at $0.25. Audiences, creative and other add-ons are priced per use. $20/month minimum. You need a Synter account at [synterai.com](https://synterai.com) and at least one connected advertising account.

## Support and security

For help, use the help skill, see [Synter support](https://synterai.com/support), or email support@syntermedia.ai. Report security issues to security@synterai.com. This folder is generated from reviewed repository sources and is intended for the Claude directory submission path `packages/claude-directory`. Directory approval and publication are separate from local package validation. The source is distributed under the included MIT license.
