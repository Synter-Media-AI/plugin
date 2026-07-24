---
name: platform-amazon
description: Amazon Ads and Amazon DSP playbook — Sponsored Products/Brands/Display, ACOS/TACOS, retail readiness, and programmatic. Use when planning, reading, auditing, or launching Amazon Ads or DSP, or porting a campaign to Amazon.
---

# Amazon Ads and DSP

Two motions: Sponsored ads on the retail search results, and DSP for programmatic reach on and off Amazon. Retail readiness gates everything: an ad on a weak product page burns budget.

## Read what exists

- `list_connected_accounts`, then `list_campaigns(platform="amazon")`.
- `pull_amazon_ads_performance(days=7)` for Sponsored Products/Brands/Display metrics. `pull_amazon_dsp_performance(days=7)` for DSP.

## Sponsored ads

- **Sponsored Products** for individual listings, **Sponsored Brands** for brand and portfolio, **Sponsored Display** for on- and off-Amazon retargeting.
- The core metric is **ACOS** (ad spend / ad sales); watch **TACOS** (ad spend / total sales) to see whether ads are growing the whole business or just shifting organic sales.
- Mine search terms, keep negatives tight, and structure by product intent. Do not scale a campaign pointing at a page with thin content, bad images, or no reviews.

## Amazon DSP

- Programmatic display and video across Amazon inventory and the open web, targeted with Amazon shopping and audience signals. Use for reach, retargeting, and audience-based prospecting beyond keywords. Use `find_audience_signals` and `build_lookalike_audience` to shape audiences.

## Plan and ship

- Build with `create_campaign_plan` + `upsert_plan_entity`; `forecast_campaign` for projections. Run **campaign-preflight**: retail readiness, tracking, sane budgets.
- Ship only on explicit approval: `execute_campaign_plan`, then `enable_campaign`. Nothing that spends money goes live without a clear go. Apply brand voice from `${CLAUDE_PLUGIN_ROOT}/context/brand-and-safety.md`.
- Confirm live with `list_campaigns(platform="amazon")` and report the real ID. Scale by ACOS with the **optimize** skill.

Porting from another platform? Use the **replicate** skill. Search intent maps to Sponsored Products keywords; audiences map to DSP.
