---
name: meta-ads-diagnostics
description: Diagnose Meta Ads delivery and performance problems — Learning Phase stalls, creative fatigue, audience overlap, CPM spikes, and Advantage+ vs manual structure. Use when a Meta campaign underperforms, delivery is limited, or CPMs and frequency are climbing.
---

# Meta Ads Diagnostics

Find the real cause before touching the campaign. Most Meta "performance problems" are one of four things: learning starvation, creative fatigue, audience self-competition, or a post-click issue.

Confirm the account: `list_connected_accounts`, then pull data with `pull_meta_ads_performance(days=30, level="ad-set")` and at ad level for creative checks.

## 1. Check Learning Phase first

Meta needs roughly 50 optimization events per ad set per week to stabilize. Under that, CPA runs volatile and high, and no other diagnosis is reliable.

- Learning resets on: budget moves over ~20%, bid changes, new creatives, targeting edits, optimization-event changes, or a pause longer than 7 days.
- Stuck in Learning Limited: consolidate ad sets so events pool, broaden the audience, raise budget toward 10x target CPA, or optimize to a higher-volume event (Add to Cart instead of Purchase).
- If it launched or changed within the last 7 days: do not touch it. Wait.

## 2. Test for creative fatigue

Pull daily impressions, reach, frequency, and CTR for the last 30 days. Compute fatigue as the CTR decline from the first full week to now:

- Under 15% decline: healthy.
- 15-30%: early fatigue, prepare a refresh.
- 30-50%: rotate creatives now.
- Over 50%: pause and replace.

Frequency confirms it: prospecting past ~3.0 or retargeting past ~5.0 with falling CTR is fatigue, not audience quality. Refresh in proportion — copy swap for mild decline, new visual angle for moderate, new concept or format change for severe. Build replacements with the **creative** skill and validate with **creative-testing**.

## 3. Check audience overlap

Symptoms: CPMs rising on multiple ad sets at once, frequency climbing faster than spend justifies, two ad sets going Learning Limited together, one ad set starving the other.

- Under ~10% overlap: ignore. 10-25%: watch CPMs. Over 25%: exclude one audience from the other or merge the ad sets. Over 50%: consolidate immediately.
- Consolidation into fewer, broader ad sets usually beats exclusion lists — it also fixes learning starvation at the same time.

## 4. Respect the breakdown effect

Per-placement or per-demo breakdowns lie. Meta optimizes holistically, so a placement with an ugly standalone CPA may be feeding cheap assists to the placements that convert. Never cut a placement off breakdown data alone — measure it properly with `measure_incrementality` or leave it on. Give the algorithm 14+ days with all placements before judging.

## 5. Advantage+ vs manual structure

- Advantage+ Shopping fits: product catalog, 100+ conversions/week, broad targeting, simple purchase goals. Set an existing-customer budget cap (20-30%) and feed it 5-10 diverse creatives.
- Manual fits: B2B lead gen, narrow audiences, heavy exclusions, under ~50 conversions/week, or when you need creative-level budget control.
- When testing ASC against manual, run both at equal budget for 14+ days and compare CPA, ROAS, and new-customer share before consolidating.

## 6. Decision tree for the rest

In order: Learning Phase → frequency over 3.0 (fatigue) → CPM rising with stable CTR (saturation or auction pressure; broaden) → CTR fine but CVR down (landing page; see **campaign-preflight**) → quality/conversion ranking below average (creative or post-click) → none of the above (tracking; audit with **conversion-tracking** and verify pixel destinations with `get_pixel_destinations`).

Apply fixes with `pause_campaign`, `update_campaign_budget`, or `upload_creative`, and confirm each write before shipping. Kill/scale calls go through **kill-scale-rules**.

## Rules

- Never diagnose a campaign still in Learning Phase; fix event volume first.
- One change at a time — every edit can reset learning.
- Breakdown data is directional, not causal. Incrementality beats breakdowns.
- State the data window and event counts behind every recommendation.
