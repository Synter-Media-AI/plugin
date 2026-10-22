# Synter

Synter helps you review advertising performance, prepare campaign plans, write ad copy, and approve changes through its hosted MCP service. Start with the quickstart skill, sign in through the browser OAuth prompt, and verify the connected workspace and advertising account before using account data.

This directory package includes 56 Markdown skills, six agent instructions, an output style, and static [brand and safety guidance](context/brand-and-safety.md). Its only service connection is the remote HTTPS MCP server declared in `.mcp.json`. It contains no local lifecycle hooks, executable scripts, or SDK runner. Tool availability follows the bundled [tool directory](tools/directory-tools.json) and the live server schema.

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

For help, use the help skill or [contact Synter](https://synterai.com/contact). This folder is generated from reviewed repository sources and is intended for the Claude directory submission path `packages/claude-directory`. Directory approval and publication are separate from local package validation. The source is distributed under the included MIT license.
