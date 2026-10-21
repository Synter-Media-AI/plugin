---
name: geo-integrity-audit
description: Check intended geography against available campaign settings and delivery evidence; identify unverified targeting before launch.
---

# Geo integrity audit

Confirm the workspace with `list_connected_accounts`, then read `list_campaigns` and `audit_account_structure`. For a planned campaign, use `get_campaign_plan` and `run_launch_preflight`.

Compare the intended geography with the location criteria, exclusions, and presence settings actually returned. A campaign name is not targeting evidence. Check every ad set or ad group when the data is available. Missing fields mean UNVERIFIED, not worldwide delivery or a passed check.

Use `pull_google_ads_performance`, `pull_meta_ads_performance`, `pull_linkedin_ads_performance`, `pull_microsoft_ads_performance`, or `pull_reddit_ads_performance` for delivery evidence. Request geography only when the tool schema supports that breakdown. Cross-check site engagement by country with `ga4_get_report`. If targeting or delivery detail is unavailable, request an export from the platform UI.

Investigate spend outside the intended market, unusually cheap clicks with weak engagement, and traffic spikes. These are signals to investigate, not proof of fraud.

Report per campaign: intended geography, verified settings, evidence period, out-of-market delivery where measurable, and missing evidence. Propose corrections through supported campaign-plan fields and the **launch** approval flow, or hand off unsupported settings to the platform UI. Re-read settings and delivery after the change.
