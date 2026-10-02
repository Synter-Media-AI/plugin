---
name: performance-max-optimizer
description: Optimize Google Ads Performance Max — asset group structure, asset performance labels, audience signals, search term insights, negatives, and channel allocation. Use when managing or auditing PMax campaigns, replacing Low assets, or diagnosing where PMax spend actually goes.
---

# Performance Max Optimizer

PMax gives up query and placement control, so you steer it with the three inputs you still own: assets, audience signals, and the feed. Optimize those; don't fight the black box.

Confirm the account with `list_connected_accounts`, then use `pull_google_ads_performance` and `audit_account_structure`. Request platform exports when asset or query-level details are missing.

## 1. Fill every asset slot

Inventory approved assets with `list_creative_assets` and write missing text with `create_ad_copy`. Request any missing images, logos, or video from the advertiser. Review asset completeness and brand consistency before following **launch**.

## 2. Replace Low assets on a cycle

Review asset performance labels in a Google Ads export if they are absent from the tool results. Do not infer asset-level labels from campaign performance.

- BEST: keep, and spin 2-3 close variations off it.
- GOOD: keep and monitor.
- LOW: replace within 2-4 weeks with variants of your BEST assets.
- LEARNING / PENDING: wait 2+ weeks before judging.

Replace 1-2 assets at a time and never wipe a whole asset type at once. Validate concepts with **creative-testing** before rolling them across groups.

## 3. Mine search term insights and cut waste

Review a platform search-category export for irrelevant or unprofitable traffic. Propose negatives with **negative-keywords**, verify current platform support, and have the account owner apply unsupported changes in the platform UI.

The most expensive miss: brand queries. If insights show a large brand share, PMax is buying conversions your brand campaign gets cheaper — add brand terms as account-level negatives and let the brand campaign recover.

## 4. Feed audience signals, not audience targets

Signals guide initial learning; PMax expands beyond them. Stack them by strength:

- Review customer and high-value purchaser lists with `list_audiences`. Have the account owner create or refresh lists in the platform UI before using them in supported campaign-plan fields.
- Custom segments from high-intent search terms and competitor URLs (50-100 entries each).
- Site visitors and cart abandoners from GA4 (`ga4_get_report` to size them).
- Interests and demographics last, as seasoning only.

After 30 days, check which segments convert and whether expansion aligns with them. Deeper audience work lives in **audience**.

## 5. Check channel allocation

Use a platform channel export when the performance response lacks channel breakdowns. Compare conversion value and spend by channel before recommending a reallocation:

- Display bloated with weak CVR: audience signals too loose — add purchase-intent custom segments.
- Search share mostly brand: negate brand at account level.
- Shopping share low for a catalog business: feed quality problem — see **google-shopping-optimizer**.
- Zero YouTube: you have no video asset; add one.

## 6. Structure asset groups by intent

One asset group per coherent product/audience theme, each with its own listing group filter and matched signals — not one mega-group. Use custom labels on the feed to split hero, seasonal, and long-tail products across groups. Budget and target changes go through `update_campaign_budget` and **bid-optimization**; give the campaign 2+ weeks after any target move.

## Rules

- Never judge PMax in its first 2-3 weeks or right after a target/budget change.
- Brand traffic makes PMax look better than it is — always separate brand before reading ROAS.
- Change one input class per cycle (assets, signals, negatives, or targets), then wait.
- Report channel mix and asset-label distribution, not just topline ROAS.
