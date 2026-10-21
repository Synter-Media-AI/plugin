---
name: platform-google
description: Operate Google Ads through Synter — read and build Search, Performance Max, Display, Demand Gen, and Video campaigns, with the right structure, match types, negatives, geo, and bid strategy. Use when a user is working on Google Ads, asks about Search/PMax/Shopping, or wants to read or change a Google campaign.
---

# Google Ads Playbook

How Google Ads is shaped and how to operate it through Synter. Reads do not require approval; anything that spends money waits for explicit approval.

Confirm the account first: `list_connected_accounts`. Use the real customer ID the tool returns; never invent one. Not connected → run the **connect** skill.

## Structure

- **Search:** campaign → ad group → keywords (with match types: exact, phrase, broad) → responsive search ads (RSAs, up to 15 headlines / 4 descriptions, some pinned). Negatives live at campaign and ad-group level and matter as much as the keywords.
- **Performance Max:** campaign → asset groups + audience signals. No keywords; goals and conversion data drive it.
- **Display / Demand Gen / Video:** campaign → ad group → audiences + creative. Video runs on YouTube.
- Campaign settings that must be right: budget, bid strategy, networks, geo/location criteria, languages, ad schedule.

## Read a campaign

Use `list_campaigns` for returned campaign IDs and settings, `audit_account_structure` for available structure checks, and `pull_google_ads_performance` for performance. Request a Google Ads export for detailed targeting, keyword match types, negatives, or asset data that the tools do not return.

## Build a campaign

Use `create_campaign_plan` and `upsert_plan_entity` for the supported campaign structure, and `forecast_campaign` for available estimates. Write text with `create_ad_copy` and select existing advertiser assets with `list_creative_assets`. Follow **launch** for `run_launch_preflight`, explicit user approval, `approve_campaign_plan`, `execute_campaign_plan`, and verification with `get_plan_execution` before any approved activation.

## Operating rules

- Keep match types deliberate. Broad without good negatives and conversion tracking wastes budget fast.
- Geo is the classic miss: a "US" campaign with no location criteria serves everywhere. Verify location criteria exist and match intent.
- Conversion tracking must exist and be attached before scaling: `ga4_get_conversions`, `get_pixel_health`. Blind spend is worse than no spend.
- Guard budgets against a fat-finger daily amount 10 to 100x intended.
- Adjust budgets with `update_campaign_budget`; pause with `pause_campaign`. Start conservative; scale winners with the **optimize** skill.
- "Created" is not "live and spending." Confirm with `list_campaigns` and report the real IDs.

Use only platform and entity types accepted by the live tool schema. Follow **launch** for plan review, preflight, approval, execution, and verification. If a setting or platform is unsupported, describe the manual handoff without claiming it was applied.
