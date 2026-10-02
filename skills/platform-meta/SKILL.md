---
name: platform-meta
description: Operate Meta (Facebook and Instagram) Ads through Synter — read and build campaigns with the right objective, ad-set structure, audiences, and creative, and handle the Learning Phase and creative fatigue. Use when a user is working on Meta, Facebook, or Instagram ads.
---

# Meta (Facebook / Instagram) Ads Playbook

How Meta is shaped and how to operate it through Synter. Reads do not require approval; anything that spends money waits for explicit approval.

Confirm the account first: `list_connected_accounts`. Use the real ID the tool returns; never invent one. Not connected → run the **connect** skill.

## Structure

Campaign (objective) → ad set (audience, budget, placements, schedule) → ad (creative). The objective is chosen once at the campaign level and shapes everything below it, so pick it from the conversion that defines success, not by habit.

- Review existing audiences with `list_audiences`. Use `research_campaign_opportunity` for available campaign research. Ask the account owner to create or synchronize new audience lists in the platform UI; use returned IDs only in supported plan fields.
- **Advantage+** shifts targeting and placement decisions to Meta. Use it when data volume supports it; keep enough signal flowing.
- **Placements:** Feed, Stories, Reels, and more. Creative should fit the placement, not be stretched into it.

## Read a campaign

`list_campaigns(platform="meta")` for the list and IDs. `pull_meta_ads_performance(days=..., level="campaign")` for top line, `level="ad-set"` for audience and budget detail, `level="ad"` for creative performance.

## Build a campaign

Use `create_campaign_plan` and `upsert_plan_entity` for the supported campaign structure, and `forecast_campaign` for available estimates. Write text with `create_ad_copy` and select existing advertiser assets with `list_creative_assets`. Follow **launch** for `run_launch_preflight`, explicit user approval, `approve_campaign_plan`, `execute_campaign_plan`, and verification with `get_plan_execution` before any approved activation.

## Operating rules

- **Learning Phase:** a new ad set needs enough conversions to exit learning. Do not judge or kill it early, and do not edit it constantly; each significant edit resets learning. See the **pre-pause-analysis** discipline before cutting anything.
- **Creative fatigue:** rising frequency with falling CTR means the creative is spent. Watch it with the **creative-fatigue-detector** skill and rotate before performance collapses.
- Keep audience overlap in check; ad sets competing against each other inflate CPM.
- Conversion tracking (pixel and CAPI) must be firing and attached: `get_pixel_health`, `ga4_get_conversions`. Blind spend is worse than no spend.
- Guard against a fat-finger daily budget 10 to 100x intended. Adjust with `update_campaign_budget`, pause with `pause_campaign`. Start conservative; scale winners with the **optimize** skill.
- "Created" is not "live and spending." Confirm with `list_campaigns` and report the real IDs.

Use only platform and entity types accepted by the live tool schema. Follow **launch** for plan review, preflight, approval, execution, and verification. If a setting or platform is unsupported, describe the manual handoff without claiming it was applied.
