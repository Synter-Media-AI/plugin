---
name: quickstart
description: Sign in through OAuth, confirm the workspace, and run a first report or campaign plan.
---

# Get started with Synter

1. Call `get_connection_status`. Complete the client’s browser OAuth prompt if requested, then retry. If sign-in fails, reconnect from the client’s plugin settings. Never ask for credentials in chat.
2. Call `list_connected_accounts` and show the workspace, platform, account name, and account ID. If an account is missing, use the **connect** skill.
3. For connected GA4 accounts, use `ga4_get_properties`, then `ga4_get_report` with the selected property and requested period. Use the tool’s returned schema for parameters.
4. Offer a first task: a **report**, a **launch** plan, an **audience** review, or **ad-copy-generation**. Do not claim access to accounts or data that the tools did not return.

The plugin connects to the hosted Synter MCP server over OAuth. Cursor uses https://mcp.synterai.com; Claude uses https://mcp.syntermedia.ai. Both require a client that supports remote MCP and browser OAuth.

Reads do not require approval. Show the exact scope and obtain explicit approval before account mutations or spend changes. More help: **help** or https://syntermedia.ai/support.
