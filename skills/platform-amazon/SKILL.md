---
name: platform-amazon
description: Amazon Ads and Amazon DSP playbook — Sponsored Products/Brands/Display, ACOS/TACOS, retail readiness, and programmatic. Use when planning, reading, auditing, or launching Amazon Ads or DSP, or porting a campaign to Amazon.
---

# Amazon Ads and DSP

Two motions: Sponsored ads on the retail search results, and DSP for programmatic reach on and off Amazon. Retail readiness gates everything: an ad on a weak product page burns budget.

## Read what exists

- `list_connected_accounts`, then `list_campaigns(platform="amazon")`.
- Dedicated performance reads for this platform are outside the plugin’s directory tools. Request a platform export for metrics and use `list_campaigns` for the state and fields actually returned. Do not substitute another platform’s data.

## Sponsored ads

- **Sponsored Products** for individual listings, **Sponsored Brands** for brand and portfolio, **Sponsored Display** for on- and off-Amazon retargeting.
- The core metric is **ACOS** (ad spend / ad sales); watch **TACOS** (ad spend / total sales) to see whether ads are growing the whole business or just shifting organic sales.
- Mine search terms, keep negatives tight, and structure by product intent. Do not scale a campaign pointing at a page with thin content, bad images, or no reviews.

## Amazon DSP

- Review existing audiences with `list_audiences`. Use `research_campaign_opportunity` for available campaign research. Ask the account owner to create or synchronize new audience lists in the platform UI; use returned IDs only in supported plan fields.

## Plan and ship

- Build with `create_campaign_plan` + `upsert_plan_entity`; `forecast_campaign` for projections. Run **campaign-preflight**: retail readiness, tracking, sane budgets.
- Ship only on explicit approval: `execute_campaign_plan`, then `enable_campaign`. Nothing that spends money goes live without a clear go. Apply brand voice from `${CLAUDE_PLUGIN_ROOT}/context/brand-and-safety.md`.
- Confirm live with `list_campaigns(platform="amazon")` and report the real ID. Scale by ACOS with the **optimize** skill.

Porting from another platform? Use the **replicate** skill. Search intent maps to Sponsored Products keywords; audiences map to DSP.

Use only platform and entity types accepted by the live tool schema. Follow **launch** for plan review, preflight, approval, execution, and verification. If a setting or platform is unsupported, describe the manual handoff without claiming it was applied.
