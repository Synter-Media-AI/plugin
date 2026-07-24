---
name: attribution
description: Measure which platforms and touches actually drive conversions across channels, compare attribution views, and read assisted conversions and conversion paths. Use when a user asks what is really working, wants cross-platform attribution, or questions a single platform's self-reported numbers.
---

# Attribution

Every platform claims the conversion. Attribution is how you see the truth across them and spend where it actually works. Reads only; this is measurement, not a spend change.

Confirm the account: `list_connected_accounts`.

## 1. Get the cross-platform view

`get_attribution` for Synter's cross-platform picture, and `reconcile_platforms` to line up what each platform reports against a common source. Pull each platform's own numbers (`pull_<platform>_ads_performance`) and GA4 (`ga4_run_report`) so you can see where they disagree and why.

## 2. Read the discrepancy honestly

- Platforms over-claim on their own last-click view; summed platform conversions usually exceed real total conversions.
- Look at assisted conversions and conversion paths, not just last click. A platform that rarely closes but frequently assists still earns budget.
- View-through and different attribution windows inflate some platforms more than others. Name the window when you compare.

## 3. Turn it into a decision

Reallocate toward channels that drive incremental conversions, not the ones best at claiming credit. Where the stakes justify it, the true test is a holdout, not a model; be clear that attribution models estimate and only an incrementality test proves lift.

## Rules

- Never take one platform's self-reported ROAS as the whole truth. Reconcile first.
- State the attribution window and model behind any number you give.
- Report where platforms disagree and what you would move, then hand budget moves to the **optimize** skill for approval.
