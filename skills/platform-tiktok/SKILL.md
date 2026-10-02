---
name: platform-tiktok
description: TikTok Ads playbook — campaign structure, objectives, Spark Ads, audiences, and native video creative. Use when planning, reading, auditing, or launching TikTok Ads, or porting a campaign to TikTok.
---

# TikTok Ads

Native, sound-on, creator-style video is the product. Structure is campaign → ad group → ad.

## Read what exists

- `list_connected_accounts` to confirm the org and account, then `list_campaigns(platform="tiktok")`.
- Dedicated performance reads for this platform are outside the plugin’s directory tools. Request a platform export for metrics and use `list_campaigns` for the state and fields actually returned. Do not substitute another platform’s data.

## Structure and objectives

- Objective sits at the campaign level (traffic, conversions, app installs, reach, lead generation). Pick the one that matches the real conversion, not the vanity metric.
- Ad groups hold budget, targeting, placement, and schedule. Ads hold the creative.
- Review existing audiences with `list_audiences`. Use `research_campaign_opportunity` for available campaign research. Ask the account owner to create or synchronize new audience lists in the platform UI; use returned IDs only in supported plan fields.

## Creative is the campaign

- Vertical 9:16, sound-on, hook in the first 2 seconds. Spark Ads run through an organic post and usually outperform static uploads.
- Write text with `create_ad_copy`, select existing approved assets with `list_creative_assets`, and apply the verified advertiser’s brand voice. Request missing media from the advertiser. See **creative-testing**.

## Plan and ship

- Build with `create_campaign_plan` + `upsert_plan_entity`; `forecast_campaign` for reach and CPA. Run **campaign-preflight** before launch: geo, tracking (`get_pixel_health`), sane budgets.
- Ship only on explicit approval: `execute_campaign_plan`, then `enable_campaign`. Nothing that spends money goes live without the user's clear go.
- Confirm live with `list_campaigns(platform="tiktok")` and report the real ID. Start conservative; scale winners with the **optimize** skill.

Porting a campaign here from another platform (e.g. Google Search)? Search keywords have no twin on TikTok. Translate intent into audience signals and creative. Use the **replicate** skill.

Use only platform and entity types accepted by the live tool schema. Follow **launch** for plan review, preflight, approval, execution, and verification. If a setting or platform is unsupported, describe the manual handoff without claiming it was applied.
