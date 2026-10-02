---
name: connect
description: Connect ad accounts and GA4 through the Synter browser flow and verify the selected workspace.
---

# Connect accounts

Use `get_connection_status` and `list_connected_accounts` to identify the workspace and existing accounts. Report the platform, account name, and account ID.

Direct the user to https://syntermedia.ai/settings/credentials to connect the required platform or GA4 account in the browser. Afterward, re-run `list_connected_accounts` and `verify_platform_accounts`. For GA4, confirm access with `ga4_get_properties`. Use `get_pixel_health` for the available tracking diagnostics; do not treat account access as proof of a working conversion event.

If access fails, confirm the selected workspace and the connected user's platform permissions. Reconnect through browser OAuth when needed. Never collect keys, tokens, or authorization codes in chat. For accounts that need provisioning help, link https://syntermedia.ai/support.

Confirm the workspace again before any write. Keep account IDs, audiences, tracking, destinations, and credentials scoped to that workspace.
