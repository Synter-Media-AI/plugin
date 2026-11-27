---
name: quickstart
description: Sign in through OAuth, confirm the workspace, and run a first read-only report or audit.
---

# Get started with Synter

1. Call `get_connection_status`. Complete the client’s browser OAuth prompt if requested, then retry. If sign-in fails, reconnect from the client’s plugin settings. Never ask for credentials in chat.
2. Call `list_connected_accounts` and show the workspace, platform, account name, and account ID. If an account is missing, use the **connect** skill.
3. For connected GA4 accounts, use `ga4_get_properties`, then `ga4_get_report` with the selected property and requested period. Use the tool’s returned schema for parameters.
4. Offer a first read-only task: a **report**, an **attribution** check, a **campaign-structure-auditor** review, or an **audience-expansion-strategy** review. Do not claim access to accounts or data that the tools did not return.

The plugin connects to Synter’s hosted read-only MCP endpoint at https://mcp.synterai.com/mcp/directory over browser OAuth (ChatGPT/Codex connects to https://mcp.synterai.com). Both require a client that supports remote MCP and browser OAuth.

This directory listing is read-only: account lookups, reports, and audits run directly; write, launch, or spend-changing actions live in the full Synter product at https://synterai.com. More help: **help** or https://synterai.com/contact.
