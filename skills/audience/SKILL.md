---
name: audience
description: Review existing audiences and plan account-specific targeting, exclusions, and targeting and list requirements.
---

# Audience planning

Confirm the workspace and accounts with `list_connected_accounts`. Inspect existing audiences with `list_audiences`, preserving their returned IDs and platform scope.

Clarify who should see the campaign, which geographies are in scope, and which groups should be excluded. For first-party segments, document source, consent, recency, match quality, and suppression requirements. For expansion, define a seed and a test hypothesis without claiming a list has been built or synchronized.

Use `research_campaign_opportunity` to inform the campaign brief where the returned data supports it. Do not infer person-level records or audience membership from aggregate research.

Audience creation, list upload, and synchronization require the platform’s own interface. Ask the user to complete those steps if needed, then re-read `list_audiences`. For supported campaign targeting fields, record existing audience IDs with `create_campaign_plan` and `upsert_plan_entity`; follow **launch** for preflight and approval.

Report what exists, what is proposed, and what still needs manual setup. Never mix audiences from different workspaces.
