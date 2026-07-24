---
name: platform-google
description: Operate Google Ads through Synter — read and build Search, Performance Max, Display, Demand Gen, and Video campaigns, with the right structure, match types, negatives, geo, and bid strategy. Use when a user is working on Google Ads, asks about Search/PMax/Shopping, or wants to read or change a Google campaign.
---

# Google Ads Playbook

How Google Ads is shaped and how to operate it through Synter. Reads are free; anything that spends money waits for explicit approval.

Confirm the account first: `list_connected_accounts`. Use the real customer ID the tool returns; never invent one. Not connected → run the **connect** skill.

## Structure

- **Search:** campaign → ad group → keywords (with match types: exact, phrase, broad) → responsive search ads (RSAs, up to 15 headlines / 4 descriptions, some pinned). Negatives live at campaign and ad-group level and matter as much as the keywords.
- **Performance Max:** campaign → asset groups + audience signals. No keywords; goals and conversion data drive it.
- **Display / Demand Gen / Video:** campaign → ad group → audiences + creative. Video runs on YouTube.
- Campaign settings that must be right: budget, bid strategy, networks, geo/location criteria, languages, ad schedule.

## Read a campaign

`list_campaigns(platform="google")` for the list and IDs. `run_gaql_query` is the ground truth for full structure: pull campaign settings, ad groups, keywords with match types, negatives, RSAs (every headline and description plus pinning), and location criteria. `pull_google_ads_performance(days=...)` for impressions, clicks, spend, conversions, and CPA per campaign so you know which pieces are worth acting on.

## Build a campaign

`create_campaign_plan` to draft structure, `upsert_plan_entity` to add each campaign → ad group → keyword/ad, `forecast_campaign` for reach/CPC/CPA. Generate copy with `generate_text_ad` or the **creative** skill; apply brand voice from `${CLAUDE_PLUGIN_ROOT}/context/brand-and-safety.md`. Then run **campaign-preflight** and ship with `execute_campaign_plan` + `enable_campaign` on approval. To port an existing Google campaign to another platform, use the **replicate** skill.

## Operating rules

- Keep match types deliberate. Broad without good negatives and conversion tracking wastes budget fast.
- Geo is the classic miss: a "US" campaign with no location criteria serves everywhere. Verify location criteria exist and match intent.
- Conversion tracking must exist and be attached before scaling: `ga4_list_conversions`, `get_gtm_tag`, `verify_pixel_ownership`. Blind spend is worse than no spend.
- Guard budgets against a fat-finger daily amount 10 to 100x intended.
- Adjust budgets with `update_campaign_budget`; pause with `pause_campaign`. Start conservative; scale winners with the **optimize** skill.
- "Created" is not "live and spending." Confirm with `list_campaigns` and report the real IDs.
