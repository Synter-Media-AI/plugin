---
name: google-ads-quality-score
description: Diagnose and improve Google Ads Quality Score — Expected CTR, Ad Relevance, and Landing Page Experience — to cut CPCs and lift Ad Rank. Use when CPCs look high for the vertical, impression share is capped by rank, or keywords sit at QS 5 and below.
---

# Google Ads Quality Score

Quality Score is a keyword-level 1-10 diagnostic built from three rated components: Expected CTR, Ad Relevance, and Landing Page Experience. Low QS means you pay more per click for the same position — fixing the weakest component is the cheapest CPC reduction available.

Confirm the account: `list_connected_accounts`.

## 1. Pull QS with spend context

Use `pull_google_ads_performance` and `audit_account_structure` to prioritize campaign issues. Request a Google Ads export for keyword-level Quality Score and its components if the returned data lacks them. Never infer a component score from campaign averages.

Rank the fix list by cost, not by QS: a QS 3 keyword spending $4K/month matters more than twenty QS 4 keywords spending nothing. Pull the below-average components on the highest-spend keywords first.

## 2. Read the components

- **Expected CTR below average**: your ad gets clicked less than competitors' for the same query. Ad copy problem.
- **Ad Relevance below average**: the ad text does not match the keyword's intent. Structure problem.
- **Landing Page below average**: slow, thin, or mismatched page. Post-click problem.

Rough mechanics worth knowing: Ad Rank scales with bid times quality, and actual CPC is the ad rank of the advertiser below you divided by your quality. Moving a keyword from QS 4-5 to QS 7 typically cuts its CPC on the order of 25-30% — quantify the monthly savings before recommending work.

## 3. Fix Expected CTR

Write RSA variants with `create_ad_copy`: use relevant keywords, concrete differentiators, and distinct headlines. Compare current text and asset counts using `list_creative_assets` where available, or request a platform export. Follow **launch** before any deployment.

## 4. Fix Ad Relevance

Restructure to tightly themed ad groups: if no headline in the ad group contains the keyword or a close synonym, the keyword is in the wrong ad group. Split mixed-intent groups (one theme per group), then write ads that name the theme. Keyword insertion helps only when the group is already tight. Expect 1-2 weeks after restructuring. Query bleed between groups is a negatives problem — see **negative-keywords**.

## 5. Fix Landing Page Experience

- Speed: LCP under 2.5s, mobile-usable, no intrusive interstitials.
- Message match: page headline mirrors the ad promise; ad-group keywords appear in the page copy above the fold.
- Trust: HTTPS, visible contact info, clear offer details and policies.

If the page needs replacing, provide a copy and usability brief for the site owner. The plugin does not publish landing pages. Recheck the destination before launch.

## 6. Track it over time

Google keeps no QS history, so snapshot weekly with the same GAQL query and track impression-weighted average QS, percent of spend on QS 7+ keywords, and percent of keywords at QS 3 and below. Report movement against those, not single-keyword anecdotes.

## Rules

- Prioritize by wasted spend, not by score. Fix the expensive keywords first.
- Competitor-brand keywords naturally sit at QS 3-5; judge them on CPA, not QS.
- One component per ad group per cycle, then wait for the rating to update before layering more changes.
- QS is a diagnostic, not an auction input — never chase 10/10 on keywords that already hit CPA targets. Bid moves belong to **bid-optimization**.
