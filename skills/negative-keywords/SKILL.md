---
name: negative-keywords
description: Mine and manage negative keywords from search-term reports to stop wasted spend, and detect match-type bleed and cross-campaign conflicts. Use when a user wants to cut wasted spend, clean up search terms, build negative lists, or fix irrelevant clicks on Google or Microsoft Ads.
---

# Negative Keywords

Negatives are how a Search campaign stops paying for the wrong clicks. They matter as much as the keywords themselves. Reads are free; adding negatives is a change, so confirm before shipping.

Confirm the account: `list_connected_accounts`.

## 1. Read the search-term report

Pull what the campaign actually matched: `run_gaql_query` on the search-term view (Google) or `pull_microsoft_ads_performance` history. Look for terms with spend and clicks but no conversions, and terms that are simply off-intent.

## 2. Categorize

- **Wasteful:** spend, no conversions, clearly off-topic. Add as negatives now.
- **Ambiguous:** some signal, unclear intent. Watch before cutting.
- **Bleed:** broad or phrase keywords matching queries they should not. Tighten match types or add negatives to contain them.
- **Cross-campaign conflict:** the same query served by two campaigns competing against each other. Resolve with campaign-level negatives so each campaign owns its intent.

## 3. Choose the level

Add negatives at ad-group level for surgical fixes, campaign level for account-wide junk, and use shared negative lists for terms every campaign should exclude.

## 4. Add on approval

Apply negatives through the plan tools and confirm. Re-pull the search-term report after a few days to verify the waste stopped.

## Rules

- Pair every keyword expansion (see **keyword-research**) with negatives; expansion without negatives leaks budget.
- Do not negate a term that has converted, even once, without checking the numbers.
- Report the negatives added, the level, and the spend they were burning.
