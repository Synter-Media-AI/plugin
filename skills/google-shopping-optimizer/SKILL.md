---
name: google-shopping-optimizer
description: Optimize Google Shopping — product feed quality, titles, Merchant Center disapprovals, supplemental feeds, custom-label segmentation, and Shopping vs Performance Max structure. Use when Shopping impression share is low, products are disapproved, or feed titles and labels need work.
---

# Google Shopping Optimizer

Shopping performance is mostly feed quality. Fix titles, identifiers, images, and price accuracy before touching bids or structure.

Confirm the account: `list_connected_accounts`. Pull campaign performance with `pull_google_ads_performance` and product-level detail via `run_gaql_query` on `shopping_performance_view`.

## 1. Audit the feed

Export the feed and check, in order of revenue contribution:

- Missing GTINs on branded products (required; use `identifier_exists = false` only for genuinely custom or handmade items).
- Short titles (under ~70 characters) missing brand, product type, or key attributes.
- Thin descriptions, missing `google_product_category` or `product_type`.
- Main images with watermarks, text overlays, or lifestyle shots where a white-background product shot belongs (800x800+ recommended).
- Feed price or availability that does not match the landing page — the top disapproval cause.

Grade each top product: optimized, needs work, or at risk of disapproval. Fix by revenue, not alphabetically.

## 2. Rewrite titles

Structure: Brand + Product Type + Key Attributes (color, size, material, gender) + Model/Variant. Front-load the important terms — Shopping truncates around 70 characters. No ALL CAPS, no promo text ("SALE", "FREE SHIPPING"), no symbols. Aim for 70-100 characters, max 150.

## 3. Clear disapprovals

Triage by reason, fastest first:

- **Price/availability mismatch**: sync feed to page, enable automated item updates. Instant class of fix.
- **Missing GTIN/MPN**: bulk-add via supplemental feed; source GTINs from the manufacturer or GS1.
- **Image issues**: replace with clean white-background images; product should fill most of the frame.
- **Policy violations**: check the landing page and image against the restricted-content policies (see **campaign-preflight** before relaunch).

Request re-review; most complete within 24-72 hours. Track reinstatement rate weekly.

## 4. Use supplemental feeds for speed

A supplemental feed (a connected sheet keyed on product `id`) overrides primary-feed values without touching the source system. Use it to fix titles, add GTINs, set `sale_price`, and stamp custom labels — same-day fixes instead of waiting on a feed pipeline.

## 5. Segment with custom labels

The five `custom_label` slots are your only campaign-structure handles. A workable scheme: label 0 = performance tier (hero / mid / long tail by trailing revenue), label 1 = margin tier, label 2 = seasonality, label 3 = price band, label 4 = competitive price position. Then structure campaigns by label — hero products get the budget and the aggressive ROAS target, long tail runs cheap. Apply budget moves with `update_campaign_budget` and cross-product allocation with `optimize_budget`.

## 6. Shopping vs Performance Max

- **Standard Shopping**: full search-term visibility, campaign-level negatives, product-level bid control. Best for mature accounts that need control.
- **PMax**: all Google channels, better new-product discovery, but limited query visibility and account-level negatives only. Best for growth and catalog breadth — see **performance-max-optimizer**.
- The usual right answer is hybrid: Standard Shopping on hero SKUs, PMax on the rest of the catalog, compare ROAS by product group after 30 days. Watch for PMax eating brand queries when comparing.

## Rules

- Feed fixes before bid fixes. A bad title wastes every dollar bid behind it.
- Price mismatch is the one issue that gets accounts suspended — verify it first and keep automated item updates on.
- Never put promotional text or watermarks on main images.
- State expected impact and timeline for each fix batch, then re-check impression share after two weeks.
