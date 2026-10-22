---
name: platform-reddit
description: Reddit Ads playbook — community vs interest targeting, ad formats, tone, and moderation reality. Use when planning, reading, auditing, or launching Reddit Ads, or porting a campaign to Reddit.
---

# Reddit Ads

Reddit rewards ads that read like a good post and punishes ads that read like ads. Structure is campaign → ad group → ad.

## Read what exists

- `list_connected_accounts`, then `list_campaigns(platform="reddit")`.
- `pull_reddit_ads_performance(days=7)` for spend, clicks, and CPA per campaign.

## Targeting

- Two levers: **communities** (specific subreddits) and **interests** (Reddit's topic clusters). Community targeting is precise but narrow; interest targeting scales but blurs.
- Prefer audience fit over long subreddit lists. A tight interest plus a handful of high-fit communities usually beats a scraped list of 200 subreddits.
- Review existing audiences with `list_audiences`. Use `research_campaign_opportunity` for available campaign research. Ask the account owner to create or synchronize new audience lists in the platform UI; use returned IDs only in supported plan fields.

## Creative and tone

- Match the medium: conversational copy, a real point of view, an image or short video that would not look out of place in the feed. Overtly corporate creative dies here.
- Write text with `create_ad_copy`, select existing approved assets with `list_creative_assets`, and apply the verified advertiser’s brand voice. Request missing media from the advertiser. See **creative-testing**.

## Plan and ship

- Build with `create_campaign_plan` + `upsert_plan_entity`; `forecast_campaign` for reach and CPA. Run **campaign-preflight**: geo correct, tracking attached (`get_pixel_health`), budgets sane.
- Ship only on explicit approval: `execute_campaign_plan`, then `enable_campaign`. Nothing that spends money goes live without a clear go.
- Confirm live with `list_campaigns(platform="reddit")` and report the real ID. Start conservative; scale with the **optimize** skill.

Porting from another platform? Use the **replicate** skill and translate keywords or audiences into communities and interests.

Use only platform and entity types accepted by the live tool schema. Follow **launch** for plan review, preflight, approval, execution, and verification. If a setting or platform is unsupported, describe the manual handoff without claiming it was applied.
