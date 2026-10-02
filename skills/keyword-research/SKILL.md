---
name: keyword-research
description: Find high-intent, low-waste keywords for Search campaigns and add them to the right ad groups. Use when a user wants keyword ideas, to expand a Search campaign, improve targeting, or find terms to bid on for Google or Microsoft Ads.
---

# Keyword Research

Find terms real buyers search, group them by intent, and add them where they convert. Reads do not require approval; adding keywords to a live campaign is a change, so confirm before shipping.

Confirm the account: `list_connected_accounts`. This applies to search platforms (**platform-google**, **platform-microsoft**).

## 1. Start from intent, not volume

Anchor to the conversion that defines success. Sort candidate terms by buyer intent:
- **High intent:** problem-aware, ready to act ("buy", "near me", branded competitor terms).
- **Research intent:** comparing, not yet buying. Lower priority unless the funnel supports nurture.
- **Junk:** informational or off-topic. These become negatives, not keywords. See the **negative-keywords** skill.

## 2. Mine what already works

Use `research_campaign_opportunity` and available `pull_google_ads_performance` or `pull_microsoft_ads_performance` history. Request a platform search-term export if query-level detail is missing. Separate observed converting queries from proposed keywords; do not invent query performance.

## 3. Assign match types deliberately

- **Exact** for proven converters you want control over.
- **Phrase** for controlled expansion.
- **Broad** only with strong negatives and conversion tracking, never naked.

## 4. Add on approval

Draft supported keyword entities with `upsert_plan_entity` and follow **launch** for review, preflight, approval, execution, and verification. Use the platform UI if keyword edits are unsupported. Pair expansions with exclusions and verify tracking with `ga4_get_conversions` and **conversion-tracking**.

## Rules

- Group by intent and theme so RSAs stay relevant; relevance is what earns cheaper clicks.
- Never add broad match without negatives and tracking.
- Report the terms added and the ad group they landed in with real IDs.
