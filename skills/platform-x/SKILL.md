---
name: platform-x
description: X (Twitter) Ads playbook — objectives, targeting, ad formats, and realistic expectations. Use when planning, reading, auditing, or launching X Ads, or porting a campaign to X.
---

# X (Twitter) Ads

Fast, conversational, timeline-native. Structure is campaign → ad group → ad. Set expectations honestly: X can deliver cheap clicks that do not convert, so tie every campaign to a real conversion, not engagement.

## Read what exists

- `list_connected_accounts`, then `list_campaigns(platform="x")`.
- `pull_x_ads_performance(days=7)` for spend, clicks, and CPA per campaign.

## Structure and targeting

- Objective at the campaign level (traffic, conversions, awareness, app installs, engagement, followers). Choose by the conversion, not the vanity metric.
- Target by keywords, interests, follower lookalikes, and custom audiences. Follower-lookalike (people similar to a chosen account's followers) is the distinctive lever.
- Watch for cheap-click traps: high CTR with zero downstream conversions means the traffic is wrong. Validate against the real action.

## Creative

- Native tweet format wins over banner-style creative. Short copy, a clear hook, one ask. Video and single-image both work.
- Generate options with `generate_text_ad` / `generate_image_ad` / `generate_video_ad` and apply brand voice from `${CLAUDE_PLUGIN_ROOT}/context/brand-and-safety.md`.

## Plan and ship

- Build with `create_campaign_plan` + `upsert_plan_entity`; `forecast_campaign` for reach and CPA. Run **campaign-preflight**: geo, tracking (`verify_pixel_ownership`), sane budgets.
- Ship only on explicit approval: `execute_campaign_plan`, then `enable_campaign`. Nothing that spends money goes live without a clear go.
- Confirm live with `list_campaigns(platform="x")` and report the real ID. Start small; measure conversions before scaling with the **optimize** skill.

Porting from another platform? Use the **replicate** skill. Search keywords translate to X keyword and interest targeting, but re-check conversion intent before spending.
