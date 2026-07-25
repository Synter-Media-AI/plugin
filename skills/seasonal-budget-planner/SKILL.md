---
name: seasonal-budget-planner
description: Plan ad budgets around seasonal peaks — holiday scaling, CPM inflation, pre-season/peak/post-season phasing, and Smart Bidding seasonality adjustments. Use when a user wants to plan Black Friday or holiday budgets, forecast peak-season costs, or build a seasonal campaign calendar.
---

# Seasonal Budget Planner

Peak season punishes flat budgets twice: CPMs inflate 50-150% while unprepared accounts pay them with untested creative and cold audiences. Plan in phases, not in a panic the week before.

Ground the plan in your own history first: `pull_<platform>_ads_performance` over last year's season and `ga4_run_report` with a date dimension to see your real demand curve.

## 1. Plan in four phases

- **Pre-season (6-8 weeks out), 70-80% of normal budget:** build remarketing pools, A/B test creative so winners are proven before CPMs spike (see **creative-testing**), verify tracking (see **conversion-tracking**).
- **Ramp-up (2-4 weeks out), 100-120%:** scale winning creative, run teasers, warm audiences, pre-load promo assets.
- **Peak (event days), 200-500% of normal daily budget:** all prepared campaigns live, aggressive bids, budget weighted to warm retargeting audiences, urgency messaging, hourly monitoring.
- **Post-season (1-4 weeks after), 80-100%:** retarget peak-period visitors who did not convert, extended-sale and clearance messaging, step bids down as competition fades.

## 2. Budget for CPM inflation

Costs are not flat across the year. Against a January baseline, expect roughly 1.2-1.3x by September-October, 1.5-2.5x in November, and 1.4-2x through mid-December, with event spikes around Prime Day and Back-to-School. Practical moves:

- Front-load: early-November impressions cost far less than BFCM-week impressions.
- Shift flexible spend into January and April, the cheapest months.
- During peak weeks, tilt toward retargeting and search, where you pay for intent rather than inflated reach.

Use `forecast_campaign` to sanity-check projected volume at planned budgets before committing.

## 3. Index the budget to your industry curve

Build a monthly index from your own trailing 12-24 months of performance data (100 = average month), then set each month's budget as baseline x index/100. Ecommerce typically peaks November-December and troughs in summer; B2B peaks January, March, and September-October and dies in late December; fitness and education have their own January and August-September spikes. Your data beats any generic table — pull it before assuming.

For B2B specifically: push hard in January (new budgets), March (Q1 use-it-or-lose-it), and September-October (next-year budget finalization); cut 30-40% in July-August and after December 15.

## 4. Use platform seasonal features

- **Google Seasonality Adjustments** tell Smart Bidding to expect a temporary CVR change for 1-7 day events (flash sales, BFCM). Set +30% for a general holiday, +50% for a major sale, up to +100% for a deep-discount flash sale, about 24 hours before the event. Do not use them for gradual trends; Smart Bidding learns those itself. See **platform-google**.
- Promotion extensions and countdown customizers on Google; Advantage+ shopping on Meta (see **platform-meta**).

## 5. Anchor to the event calendar

The big cost spikes are predictable. Plan phases backward from the dates that matter for the vertical:

- **BFCM (late November):** the peak of peaks, +80-150% CPMs across retail.
- **Christmas (Dec 1-24, peaking mid-month):** +50-100%, then a hard drop after Dec 20.
- **Prime Day (mid-July):** +40-60% around Amazon, spillover elsewhere.
- **Back-to-School (Aug-Sep):** +20-30% for electronics, apparel, supplies.
- **Gift holidays (Valentine's, Mother's/Father's Day):** +15-30% in gifting categories for the surrounding week.

If you are not in the category, these are your cheap weeks — competitors' budgets left the auction.

## 6. Execute and guard

Encode the phased plan with `create_campaign_plan` and `execute_campaign_plan`, apply phase changes with `update_campaign_budget`, and rebalance across platforms mid-flight with `optimize_budget`. Set `set_spend_alert` before peak so a 5x daily budget cannot silently run for a week. During peak, review daily with `pull_<platform>_ads_performance`; after, reconcile what each platform claims against site truth with `reconcile_platforms`.

## Rules

- No creative testing during peak. Test in pre-season; peak runs proven winners only.
- Higher CPMs are acceptable only where CVR rises to match. Track CPA/ROAS through the spike, not spend.
- Budget increases in steps, not cliffs — large jumps reset bid-strategy learning right when you need it stable (see **bid-optimization**).
- Write down actual vs planned after the season. Next year's plan starts from this year's miss.
- For the year-round allocation question underneath the seasonal one, use **mmm-budget-planner** and **media-plan**.
