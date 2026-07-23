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

Weight channels by how they perform for this objective and audience, grounded in the account's own history (`pull_<platform>_ads_performance`) and typical ranges (see **platform-benchmarks**). Use `find_audience_signals` for who is reachable where. Balance demand capture (search) against demand generation (social) to fit the funnel.

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
