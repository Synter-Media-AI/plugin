---
name: incrementality-testing
description: Design and run incrementality tests that measure true lift from ads — geo holdouts, platform lift studies, significance math, and iCPA decisions. Use when a user wants to know whether ads actually cause conversions, design a holdout test, or decide budget based on real lift.
---

# Incrementality Testing

Attribution measures correlation; incrementality measures causation. The question is always the same: would this conversion have happened without the ad?

Start with `measure_incrementality` where the platform and data support it; design a manual test when it does not.

## 1. Define the question

Pick one testable claim: channel incrementality ("does Display drive anything?"), budget incrementality ("does doubling spend double conversions?"), or tactic incrementality ("is retargeting real?"). One variable per test. Pull the baseline first: `pull_<platform>_ads_performance` for spend and attributed conversions, `ga4_run_report` for a platform-neutral conversion count.

## 2. Choose the method

- **Geo holdout:** run ads in test regions, go dark in matched control regions. The gold standard, but needs regional volume. Pause delivery in control geos via `pause_campaign` or geo exclusions.
- **Platform lift study:** Meta and Google both offer native conversion-lift experiments with randomized holdout groups. Least effort, but you trust the platform to grade its own homework.
- **Ghost ads / PSA:** serve an unrelated ad to the control group so both groups pass through the same auction. Works on any platform, costs the PSA impressions.

## 3. Design it so the answer is trustworthy

- **Match regions** on population, historical CVR, revenue per conversion, and seasonality. Validate with 8-12 weeks of history: if historical CVRs differ by more than ~5%, pick different regions.
- **Size the control** at 20-30% of the addressable market.
- **Duration:** minimum 4 weeks for most channels; 2 weeks only for high-volume search or Meta; add 50-100% for long sales cycles. Avoid holidays or extend through them.
- **Sample size:** small lifts need big audiences. Detecting a 20% lift on a 1% baseline CVR takes roughly 400K users; a 10% lift takes 1.5M. If you cannot reach the numbers, test a bigger intervention instead of a subtle one.

## 4. Run it clean

Freeze everything else: no creative swaps, no budget moves, no new campaigns in test or control markets mid-flight. Use `list_campaigns` to confirm nothing else is live in the control geos, and `set_spend_alert` to catch drift. Measure conversions from a neutral source (GA4), not the tested platform.

## 5. Analyze

```
Lift = (CVR_test - CVR_control) / CVR_control
Incremental conversions = Conversions_test - (Exposed_test x CVR_control)
iCPA = Test spend / Incremental conversions
iROAS = Incremental revenue / Test spend
```

Run a two-proportion z-test on test vs control CVR and report the lift with its 95% confidence interval, not just the point estimate. A lift whose interval crosses zero is not a result.

## 6. Decide

Compare iCPA to attributed CPA:

- **iCPA within ~1.5x of CPA:** highly incremental. Scale it (see **kill-scale-rules**).
- **1.5-3x:** moderately incremental. Hold and optimize.
- **3-5x:** weak. Shift budget with `optimize_budget` and re-test the reallocation.
- **5x+:** the channel is mostly claiming credit for organic conversions. Cut it or keep it only for awareness.

Brand search typically tests at 15-35% incrementality, non-brand search 40-65%, display prospecting 5-20%, retargeting 20-45%. If your result lands far outside these ranges, re-check the test before celebrating or panicking.

## Rules

- One variable per test. A test that changes budget, creative, and audience proves nothing.
- Neutral measurement only. The platform being tested does not get to score the test.
- Pre-register the success threshold before launch; do not move the goalposts after seeing data.
- Feed results back into planning: incrementality-adjusted returns belong in **mmm-budget-planner** and **attribution** conversations, not in a slide graveyard.
