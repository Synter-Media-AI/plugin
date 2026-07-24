---
name: keyword-research
description: Find high-intent, low-waste keywords for Search campaigns and add them to the right ad groups. Use when a user wants keyword ideas, to expand a Search campaign, improve targeting, or find terms to bid on for Google or Microsoft Ads.
---

# Keyword Research

Find terms real buyers search, group them by intent, and add them where they convert. Reads are free; adding keywords to a live campaign is a change, so confirm before shipping.

Confirm the account: `list_connected_accounts`. This applies to search platforms (**platform-google**, **platform-microsoft**).

## 1. Start from intent, not volume

Anchor to the conversion that defines success. Sort candidate terms by buyer intent:
- **High intent:** problem-aware, ready to act ("buy", "pricing", "near me", branded competitor terms).
- **Research intent:** comparing, not yet buying. Lower priority unless the funnel supports nurture.
- **Junk:** informational or off-topic. These become negatives, not keywords. See the **negative-keywords** skill.

## 2. Mine what already works

Pull the account's own search terms before inventing new ones: `run_gaql_query` on the search-term view (Google) or `pull_microsoft_ads_performance` history. Terms that already converted are the strongest seeds. Group survivors into tight ad groups by theme so ad copy can match.

## 3. Assign match types deliberately

- **Exact** for proven converters you want control over.
- **Phrase** for controlled expansion.
- **Broad** only with strong negatives and conversion tracking, never naked.

## 4. Add on approval

Add keywords through the plan tools (`upsert_plan_entity` into the target ad group) and confirm the change. Then pair every expansion with negatives so new match surface does not leak budget. Verify conversion tracking exists first: `ga4_list_conversions`.

## Rules

- Group by intent and theme so RSAs stay relevant; relevance is what earns cheaper clicks.
- Never add broad match without negatives and tracking.
- Report the terms added and the ad group they landed in with real IDs.
