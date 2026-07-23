---
name: roas-calculator
description: Calculate ROAS, CPA, break-even, max CPC, and campaign profitability from real spend and revenue, and set realistic targets. Use when a user asks whether a campaign is profitable, what ROAS or CPA they need, what to bid, or wants the unit economics behind ad spend.
---

# ROAS and Profitability Math

Turn spend and revenue into the numbers that decide whether a campaign lives. Reads only; this is math, not a spend change.

Confirm the account: `list_connected_accounts`, then pull real figures with `pull_<platform>_ads_performance(days=...)`. Never invent revenue or margin; if the user has not given margin or conversion value, ask rather than assume.

## The core numbers

- **ROAS** = revenue / ad spend. A ratio, before costs.
- **CPA** = spend / conversions. What one conversion costs.
- **Break-even ROAS** = 1 / gross margin. At 50% margin you break even at 2.0x; at 25% margin, 4.0x. Below break-even, spend loses money even when ROAS looks positive.
- **Target ROAS** = break-even divided by the profit multiple the business wants. Always state the margin behind it.
- **Profit** = (revenue times margin) minus ad spend. ROAS can look healthy while profit is negative once margin is real.
- **Max CPC** = target CPA times conversion rate. Bidding above it pushes CPA past target.
- **LTV:CPA** = lifetime value / CPA. Roughly 3:1 or higher is the usual healthy line for a recurring-revenue model.

## How to use it

- Compute blended (all platforms) and per-platform; a strong average can hide a channel losing money.
- Compare CPA to real customer value or LTV, not a vanity target.
- Platform-reported revenue over-claims. Reconcile with the **attribution** skill before trusting a single platform's ROAS.

## Report

Show the inputs (spend, revenue, margin), the derived ROAS/CPA/break-even, and the profit. State the margin assumption plainly. Then translate into a decision: at target and profitable, scale with the **optimize** skill; below break-even with no fixable cause, see **kill-scale-rules**.

## Rules

- Every ROAS needs its margin and attribution basis stated, or it is a half-number.
- Use real figures from the tools; ask for margin or conversion value rather than guessing.
- Break-even, not gross ROAS, is the line that decides profitability. Feed the numbers into the **mmm-budget-planner** skill for cross-platform reallocation.
