---
name: platform-tiktok
description: TikTok Ads playbook — campaign structure, objectives, Spark Ads, audiences, and native video creative. Use when planning, reading, auditing, or launching TikTok Ads, or porting a campaign to TikTok.
---

# TikTok Ads

Native, sound-on, creator-style video is the product. Structure is campaign → ad group → ad.

## Read what exists

- `list_connected_accounts` to confirm the org and account, then `list_campaigns(platform="tiktok")`.
- `pull_tiktok_ads_performance(days=7)` for spend, clicks, and CPA per campaign. `tiktok_ads_get_insights` for detailed video metrics (views, watch time, completion).

## Structure and objectives

- Objective sits at the campaign level (traffic, conversions, app installs, reach, lead generation). Pick the one that matches the real conversion, not the vanity metric.
- Ad groups hold budget, targeting, placement, and schedule. Ads hold the creative.
- Audiences: interest and behavior, custom audiences from your data, and lookalikes. Use `find_audience_signals` to size who is reachable and `build_lookalike_audience` from a seed.

## Creative is the campaign

- Vertical 9:16, sound-on, hook in the first 2 seconds. Spark Ads run through an organic post and usually outperform static uploads.
- Generate options with `generate_video_ad` / `generate_ugc_ad`; apply brand voice from `${CLAUDE_PLUGIN_ROOT}/context/brand-and-safety.md`. Test several hooks, not one polished film. See the **creative-testing** skill.

## Plan and ship

- Build with `create_campaign_plan` + `upsert_plan_entity`; `forecast_campaign` for reach and CPA. Run **campaign-preflight** before launch: geo, tracking (`verify_pixel_ownership`), sane budgets.
- Ship only on explicit approval: `execute_campaign_plan`, then `enable_campaign`. Nothing that spends money goes live without the user's clear go.
- Confirm live with `list_campaigns(platform="tiktok")` and report the real ID. Start conservative; scale winners with the **optimize** skill.

Porting a campaign here from another platform (e.g. Google Search)? Search keywords have no twin on TikTok. Translate intent into audience signals and creative. Use the **replicate** skill.
