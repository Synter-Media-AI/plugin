---
name: platform-meta
description: Operate Meta (Facebook and Instagram) Ads through Synter — read and build campaigns with the right objective, ad-set structure, audiences, and creative, and handle the Learning Phase and creative fatigue. Use when a user is working on Meta, Facebook, or Instagram ads.
---

# Meta (Facebook / Instagram) Ads Playbook

How Meta is shaped and how to operate it through Synter. Reads are free; anything that spends money waits for explicit approval.

Confirm the account first: `list_connected_accounts`. Use the real ID the tool returns; never invent one. Not connected → run the **connect** skill.

## Structure

Campaign (objective) → ad set (audience, budget, placements, schedule) → ad (creative). The objective is chosen once at the campaign level and shapes everything below it, so pick it from the conversion that defines success, not by habit.

- **Audiences:** custom (your data), lookalike (seeded from a custom audience), and interest/behavior. Build lookalikes with `build_lookalike_audience` and attach with `attach_audience`; find reachable signals with `find_audience_signals`.
- **Advantage+** shifts targeting and placement decisions to Meta. Use it when data volume supports it; keep enough signal flowing.
- **Placements:** Feed, Stories, Reels, and more. Creative should fit the placement, not be stretched into it.

## Read a campaign

`list_campaigns(platform="meta")` for the list and IDs. `pull_meta_ads_performance(days=..., level="campaign")` for top line, `level="ad-set"` for audience and budget detail, `level="ad"` for creative performance.

## Build a campaign

`create_campaign_plan` → `upsert_plan_entity` per campaign / ad set / ad → `forecast_campaign`. Generate creative with `generate_image_ad`, `generate_video_ad`, `generate_ugc_ad`, or the **creative** skill; apply brand voice from `${CLAUDE_PLUGIN_ROOT}/context/brand-and-safety.md`. Run **campaign-preflight**, then `execute_campaign_plan` + `enable_campaign` on approval.

## Operating rules

- **Learning Phase:** a new ad set needs enough conversions to exit learning. Do not judge or kill it early, and do not edit it constantly; each significant edit resets learning. See the **pre-pause-analysis** discipline before cutting anything.
- **Creative fatigue:** rising frequency with falling CTR means the creative is spent. Watch it with the **creative-fatigue-detector** skill and rotate before performance collapses.
- Keep audience overlap in check; ad sets competing against each other inflate CPM.
- Conversion tracking (pixel and CAPI) must be firing and attached: `verify_pixel_ownership`, `ga4_list_conversions`. Blind spend is worse than no spend.
- Guard against a fat-finger daily budget 10 to 100x intended. Adjust with `update_campaign_budget`, pause with `pause_campaign`. Start conservative; scale winners with the **optimize** skill.
- "Created" is not "live and spending." Confirm with `list_campaigns` and report the real IDs.
