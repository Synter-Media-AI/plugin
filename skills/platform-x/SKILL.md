---
name: platform-x
description: X (Twitter) Ads playbook — objectives, targeting, ad formats, and realistic expectations. Use when planning, reading, auditing, or launching X Ads, or porting a campaign to X.
---

# X (Twitter) Ads

Fast, conversational, timeline-native. Structure is campaign → ad group → ad. Set expectations honestly: X can deliver cheap clicks that do not convert, so tie every campaign to a real conversion, not engagement.

## Read what exists

- `list_connected_accounts`, then `list_campaigns(platform="x")`.
- Dedicated performance reads for this platform are outside the plugin’s directory tools. Request a platform export for metrics and use `list_campaigns` for the state and fields actually returned. Do not substitute another platform’s data.

## Structure and targeting

- Objective at the campaign level (traffic, conversions, awareness, app installs, engagement, followers). Choose by the conversion, not the vanity metric.
- Target by keywords, interests, follower lookalikes, and custom audiences. Follower-lookalike (people similar to a chosen account's followers) is the distinctive lever.
- Watch for cheap-click traps: high CTR with zero downstream conversions means the traffic is wrong. Validate against the real action.

## Creative

- Native tweet format wins over banner-style creative. Short copy, a clear hook, one ask. Video and single-image both work.
- Write text with `create_ad_copy`, select existing approved assets with `list_creative_assets`, and apply the verified advertiser’s brand voice. Request missing media from the advertiser. See **creative-testing**.

## Plan and ship

- Build with `create_campaign_plan` + `upsert_plan_entity`; `forecast_campaign` for reach and CPA. Run **campaign-preflight**: geo, tracking (`get_pixel_health`), sane budgets.
- Ship only on explicit approval: `execute_campaign_plan`, then `enable_campaign`. Nothing that spends money goes live without a clear go.
- Confirm live with `list_campaigns(platform="x")` and report the real ID. Start small; measure conversions before scaling with the **optimize** skill.

Porting from another platform? Use the **replicate** skill. Search keywords translate to X keyword and interest targeting, but re-check conversion intent before spending.

Use only platform and entity types accepted by the live tool schema. Follow **launch** for plan review, preflight, approval, execution, and verification. If a setting or platform is unsupported, describe the manual handoff without claiming it was applied.
