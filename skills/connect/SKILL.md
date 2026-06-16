---
name: connect
description: Connect ad platforms and data sources to Synter (Google, Meta, LinkedIn, Microsoft, Reddit, TikTok, X, Amazon, GA4, and more). Use when a user wants to link an account, says a platform isn't connected, hits an auth/reconnect error, or asks what's connected.
---

# Connect Platforms

Link the user's ad accounts and analytics so the agents can read and act on real data.

## 1. Show current state

`list_connected_accounts` and `get_connection_status`. Report which platforms are live, the account IDs, and the org. Name what's missing.

## 2. Connect what they need

Synter connects via direct API (OAuth where the platform supports it). To start a connection, direct the user to the connection flow at **syntermedia.ai/settings/credentials** (or **/settings/connections**), then have them complete the platform's OAuth in the browser. After they finish, re-run `list_connected_accounts` to confirm.

Free and instant: connect **GA4** at syntermedia.ai/settings/credentials — then `ga4_list_properties()` works immediately, no credits.

## 3. Verify, don't assume

- After any connect, confirm with `list_connected_accounts` — show the exact account ID that came back. Never invent or guess account IDs.
- `verify_platform_accounts` / `verify_pixel_ownership` to confirm the account and tracking are really wired.

## Troubleshooting

- **"Reconnect over and over"** is usually a delegation/permissions issue on the platform side, not a broken token — check that the connected user actually has content/ad rights on that account before reconnecting again.
- **Auth error on a write** → the token may have expired; reconnect once, then verify with `list_connected_accounts`.
- A connection should be scoped to the **workspace/org**, not just one user. Confirm the right org is selected before acting.

## House rules

- Confirm the org before connecting or acting. Never mix one client's accounts with another's.
- Connecting is read-safe. Acting on the account (campaigns, budgets) still needs explicit approval.
