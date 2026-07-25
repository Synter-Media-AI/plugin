---
name: audience-expansion-strategy
description: Expand targeting without wrecking CPA — lookalike ladders, seed quality, audience layering, and exclusion hygiene across platforms. Use when a user wants to scale beyond exhausted audiences, build lookalikes, fix audience fatigue, or set up exclusion lists.
---

# Audience Expansion Strategy

Expansion is a ladder, not a leap: each rung trades a little efficiency for a lot of reach, and you climb only when the rung below is saturated.

Confirm the account and inventory what exists: `list_connected_accounts`, `list_audiences`, and performance per audience via `pull_<platform>_ads_performance`.

## 1. Audit before expanding

Find which audiences drive 80% of conversions, which run above target CPA, and which show fatigue: frequency climbing past ~3-4/week, CTR down 20%+ week over week, CPA up 25%+ week over week. Expansion fixes saturation; it does not fix a broken offer or tired creative (see **creative**).

## 2. Climb the expansion ladder

- **Tier 1, hottest:** retargeting pools and 1% lookalikes of customers. Expect ~0.5-0.8x average CPA.
- **Tier 2, warm:** 1-3% lookalikes from high-value customers, synced prospect lists, engaged audiences. ~0.8-1.2x.
- **Tier 3, cool:** 3-5% lookalikes, in-market and interest targeting, competitor-interest audiences. ~1.2-1.8x.
- **Tier 4, cold:** 5-10% lookalikes, broad/algorithmic targeting. ~1.5-2.5x.

Add one tier at a time with its own budget and CPA ceiling; kill any rung that exceeds its ceiling with volume behind it (see **kill-scale-rules**).

## 3. Build lookalikes from quality seeds

Seed quality decides lookalike quality. Ranked: top-20%-by-LTV customers, then all converters, then intent signals (cart, demo, pricing page), then engagement signals. Practical minimums for good results are ~1,000 matched users on most platforms regardless of lower stated floors. Two upgrades that consistently cut lookalike CPA: seed from top-value customers instead of all customers, and seed from recent (90-day) converters instead of all-time. Refresh seeds monthly.

Build with `build_lookalike_audience`, create several sizes (1%, 3%, 5%) and test them against each other, then attach to campaigns with `attach_audience` or spin up dedicated ones with `create_campaign_for_audience`. Note platform differences: Google retired similar audiences in favor of Optimized Targeting with Customer Match as the signal; Meta, TikTok, and LinkedIn still build explicit lookalike/predictive audiences.

## 4. Layer for precision, exclude for hygiene

Layer dimensions where precision matters: lookalike AND in-market segment AND NOT recent site visitors (give retargeting first shot). For B2B account lists, use `build_abm_audience`; to discover new seed signals, `find_audience_signals`.

Mandatory exclusions on every prospecting campaign:

- Existing customers and recent converters (sync weekly via `sync_audience`).
- All retargeting pools — prospecting money should buy strangers.
- Employees and CRM-disqualified leads.

Sequential exclusion prevents one user being hit at every funnel stage at once: awareness excludes considerers, consideration excludes converters, conversion excludes purchasers.

When uploading lists, format for match rate: lowercase and trim emails, E.164 phone numbers with country code, first and last name in separate fields. Hashed email plus phone typically matches 55-80% of records on Meta and Google; email alone matches meaningfully less. A list that matches under 30% is a data-quality problem, not a platform problem.

## 5. Decide when to hand targeting to the algorithm

Meta Advantage+ audiences and Google Optimized Targeting treat your audiences as suggestions and expand beyond them. Turn them on with strong conversion volume (50+ conversions/week on Meta, 30+/month on Google) and real budget; keep them off for niche B2B ICPs, thin pixels, or when testing a specific audience hypothesis. Exclusions are respected either way — which is another reason the suppression lists must be current.

## 6. Monitor and rebalance

Weekly: `pull_<platform>_ads_performance` per audience tier. Scale rungs beating target, refresh creative on fatiguing ones, and rebalance spend across tiers with `optimize_budget`. When an expansion audience wins, feed its converters back into the seed pool — the ladder compounds.

## Rules

- One new tier at a time, each with a pre-set CPA ceiling. Expansion without a ceiling is just spray.
- Never expand to escape creative fatigue; rotate creative first (see **creative-testing**).
- Suppression lists refresh weekly, everywhere. One stale platform re-buys your own customers.
- Judge broad/algorithmic tiers on incremental performance, not platform-attributed CPA (see **attribution**).
- Check overlap when adding audiences on the same platform. Two campaigns bidding on the same users compete against themselves.
- Preflight every new audience campaign before enabling it (see **campaign-preflight**).
