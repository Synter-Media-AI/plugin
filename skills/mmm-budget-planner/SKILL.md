---
name: mmm-budget-planner
description: Plan and reallocate budget across platforms by ROI, with revenue projections and shift scenarios. Use when a user asks where to put budget across channels, the true ROI of each channel, what happens if they move spend from one platform to another, or how campaigns are pacing.
---

# Budget Planner

Decide where the next dollar goes across platforms, grounded in real performance rather than gut feel. Reads are free; changing budgets is a change and waits for explicit approval.

Confirm the account and what is connected: `list_connected_accounts`.

## 1. Read cross-platform performance

Pull recent performance per platform so the plan sits on real numbers:

- `pull_google_ads_performance`, `pull_meta_ads_performance`, `pull_linkedin_ads_performance`, and the other `pull_<platform>_ads_performance` tools for spend, conversions, and CPA per channel.
- `get_attribution` to see how conversions credit across touchpoints, not just last click.
- `measure_incrementality` where a holdout exists, to separate true lift from spend that would have converted anyway. This is the honest answer to "what is this channel really worth."

## 2. Reallocate by ROI

`optimize_budget` reallocates spend across platforms toward the channels returning the most per dollar, within the total you set. Feed it the budget and any per-channel floors or caps, and it returns a proposed split.

Read the output as a plan, not a command:

- Every channel has diminishing returns. Pouring the whole budget into the current best performer stops working once it saturates. Keep a spread.
- Compare the proposed allocation to the current one and show the delta and the expected improvement.
- Model shifts explicitly: "move X from platform A to platform B" and what the projected CPA/return does. Keep the math visible.

## 3. Project and pace

- Use recent trend plus the proposed allocation to project the next few weeks of spend and conversions, with a clear range rather than a false-precision single number.
- Flag channels pacing over or under budget so nothing quietly runs away or underspends.

## 4. Ship on approval

Show the current split, the proposed split, the projected outcome, and the rationale. Change budgets only on the user's clear go, with `update_campaign_budget` (or by executing an approved plan). Guard against fat-finger amounts. Then confirm the new budgets with a fresh `pull_<platform>_ads_performance` read.

For single-account bid and pacing tuning rather than cross-platform allocation, use the **optimize** and **bid-optimization** skills. For pure ROAS and CPA math, use the **roas-calculator** skill.
