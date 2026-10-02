---
name: platform-openai
description: OpenAI Ads playbook — campaign structure, appearances in AI answers, and aggregation levels. Use when planning, reading, auditing, or launching OpenAI Ads, or porting a campaign to OpenAI Ads.
---

# OpenAI Ads

A newer surface: ads that appear alongside AI answers. Structure is campaign → ad group → ad. Treat it as an emerging channel, measure honestly, and start small.

## Read what exists

- `list_connected_accounts`, then `list_campaigns(platform="openai_ads")`.
- Dedicated performance reads for this platform are outside the plugin’s directory tools. Request a platform export for metrics and use `list_campaigns` for the state and fields actually returned. Do not substitute another platform’s data.

## Structure and intent

- Campaigns hold objective and budget, ad groups hold targeting, ads hold the copy and destination.
- Placement is inside AI answers, so intent matters more than raw reach. Match the ad to the questions your audience actually asks, and point at a content page that answers them, not a bare signup screen.

## Creative

- Write text with `create_ad_copy`, select existing approved assets with `list_creative_assets`, and apply the verified advertiser’s brand voice. Request missing media from the advertiser. See **creative-testing**.

## Plan and ship

- Build with `create_campaign_plan` + `upsert_plan_entity`; `forecast_campaign` where projections are available. Run **campaign-preflight**: tracking attached (`get_pixel_health` / `ga4_get_conversions`), sane budgets.
- Ship only on explicit approval: `execute_campaign_plan`, then `enable_campaign`. Nothing that spends money goes live without a clear go.
- Confirm live with `list_campaigns(platform="openai_ads")` and report the real ID. Start conservative; read results before scaling with the **optimize** skill.

Porting from another platform? Use the **replicate** skill and translate keyword intent into the questions this audience asks.

Use only platform and entity types accepted by the live tool schema. Follow **launch** for plan review, preflight, approval, execution, and verification. If a setting or platform is unsupported, describe the manual handoff without claiming it was applied.
