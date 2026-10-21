---
name: media-plan
description: Build a full media plan — objective, channel mix, budget split, projected CPM/CPC/CPA, and a first test flight — before any campaign is built. Use when a user wants a media plan, a budget allocation across platforms, or a go-to-market for a launch.
---

# Media Plan Builder

Turn a goal and a budget into a defensible plan across platforms, with the math shown, before anything is built. Planning only; building and spending are the **launch** skill's job and wait for approval.

Confirm what is available first: `list_connected_accounts`.

## 1. Start from the objective

Anchor to the conversion that defines success and the target CPA or ROAS. Get the budget, audience, geo, and offer. Do not start from a platform.

## 2. Choose the channel mix

Ground channel weights in account history using `pull_google_ads_performance`, `pull_meta_ads_performance`, `pull_linkedin_ads_performance`, `pull_microsoft_ads_performance`, and `pull_reddit_ads_performance`. Use `research_campaign_opportunity` for available research and `forecast_campaign` for estimates; label projections clearly. Balance demand capture and demand generation for the objective.

## 3. Split the budget and project outcomes

Allocate budget per channel with projected CPM/CPC/CPA/reach from `forecast_campaign`. Show the math; a split without projected outcomes is a guess. Start conservative and name the scale path.

## 4. Plan measurement and a first flight

State which conversion, which tracking (see **conversion-tracking**), and how success is judged. Define a first two-week test flight with a clear read before wider spend.

## Output

Objective → audience → channel mix and budget split → projected CPA/ROAS per channel → creative direction → measurement → first-flight test. Lead with the recommendation, then the reasoning. Hand off to **launch** to build and ship on approval.

## Rules

- Show the budget math and projected outcomes per channel; no unsupported splits.
- Prefer the account's own history over any benchmark, and never present a projection as a guarantee.
- Include measurement in the plan; a plan you cannot read is not a plan.
