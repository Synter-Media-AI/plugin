---
name: performance-max-optimizer
description: Optimize Google Ads Performance Max — asset group structure, asset performance labels, audience signals, search term insights, negatives, and channel allocation. Use when managing or auditing PMax campaigns, replacing Low assets, or diagnosing where PMax spend actually goes.
---

# Performance Max Optimizer

PMax gives up query and placement control, so you steer it with the three inputs you still own: assets, audience signals, and the feed. Optimize those; don't fight the black box.

Confirm the account: `list_connected_accounts`. Pull performance with `pull_google_ads_performance` and detail with `run_gaql_query`.

## 1. Fill every asset slot

Ad Strength tracks asset diversity. Per asset group, target: 10-15 distinct headlines, 4-5 long headlines, 4-5 descriptions, 5+ landscape and 5+ square images, 3+ portrait images, logos, and at least one real video — if you supply none, Google auto-generates one, usually badly. Generate gaps with `generate_text_ad`, `generate_image_ad`, and `generate_video_ad`, and ship via `upload_creative`.

## 2. Replace Low assets on a cycle

Query `asset_group_asset` with `run_gaql_query` for the `performance_label` on each asset (filter to `PERFORMANCE_MAX` campaigns).

- BEST: keep, and spin 2-3 close variations off it.
- GOOD: keep and monitor.
- LOW: replace within 2-4 weeks with variants of your BEST assets.
- LEARNING / PENDING: wait 2+ weeks before judging.

Replace 1-2 assets at a time and never wipe a whole asset type at once. Validate concepts with **creative-testing** before rolling them across groups.

## 3. Mine search term insights and cut waste

Query `search_term_insight` via `run_gaql_query` (Google only exposes category-level data for PMax). Flag categories with CPA over 2x target or clicks with zero conversions. PMax takes negatives at the account level only — build a list covering job-seeker terms, informational queries ("what is", "how to"), free/coupon hunters, and DIY terms, then manage it with **negative-keywords**. Re-check CPA and impression share 7-14 days after applying.

The most expensive miss: brand queries. If insights show a large brand share, PMax is buying conversions your brand campaign gets cheaper — add brand terms as account-level negatives and let the brand campaign recover.

## 4. Feed audience signals, not audience targets

Signals guide initial learning; PMax expands beyond them. Stack them by strength:

- Customer match lists first — purchasers and high-LTV segments (build with `build_abm_audience` or `build_lookalike_audience`, attach via `attach_audience`, keep fresh with `sync_audience`).
- Custom segments from high-intent search terms and competitor URLs (50-100 entries each).
- Site visitors and cart abandoners from GA4 (`ga4_run_report` to size them).
- Interests and demographics last, as seasoning only.

After 30 days, check which segments convert and whether expansion aligns with them. Deeper audience work lives in **audience**.

## 5. Check channel allocation

Segment by network with `run_gaql_query`. For e-commerce, Shopping should carry most conversions; Search next; Display and YouTube minority shares. Diagnose imbalance:

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
