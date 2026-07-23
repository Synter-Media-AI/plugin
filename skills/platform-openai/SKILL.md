---
name: platform-openai
description: OpenAI Ads playbook — campaign structure, appearances in AI answers, and aggregation levels. Use when planning, reading, auditing, or launching OpenAI Ads, or porting a campaign to OpenAI Ads.
---

# OpenAI Ads

A newer surface: ads that appear alongside AI answers. Structure is campaign → ad group → ad. Treat it as an emerging channel, measure honestly, and start small.

## Read what exists

- `list_connected_accounts`, then `list_campaigns(platform="openai_ads")`.
- `pull_openai_ads_performance(days=7, aggregation_level="campaign")` for metrics. Scope tighter with `ad_group_id` or `ad_id`, or set `aggregation_level` to ad_group or ad.

## Structure and intent

- Campaigns hold objective and budget, ad groups hold targeting, ads hold the copy and destination.
- Placement is inside AI answers, so intent matters more than raw reach. Match the ad to the questions your audience actually asks, and point at a content page that answers them, not a bare signup screen.

## Creative

- Concise, useful, honest copy. Overtly promotional creative reads badly next to an AI answer. Generate options with `generate_text_ad` / `generate_image_ad` and apply brand voice from `${CLAUDE_PLUGIN_ROOT}/context/brand-and-safety.md`.

## Plan and ship

- Build with `create_campaign_plan` + `upsert_plan_entity`; `forecast_campaign` where projections are available. Run **campaign-preflight**: tracking attached (`verify_pixel_ownership` / `ga4_list_conversions`), sane budgets.
- Ship only on explicit approval: `execute_campaign_plan`, then `enable_campaign`. Nothing that spends money goes live without a clear go.
- Confirm live with `list_campaigns(platform="openai_ads")` and report the real ID. Start conservative; read results before scaling with the **optimize** skill.

Porting from another platform? Use the **replicate** skill and translate keyword intent into the questions this audience asks.
