---
name: bid-optimization
description: Recommend and apply bid and bid-strategy changes from performance data — CPC targets, device and audience modifiers, and target CPA/ROAS moves. Use when a user wants to lower CPCs, hit a target CPA or ROAS, or adjust bids across campaigns.
---

# Bid Optimization

Move bids toward the target CPA or ROAS using real performance, not guesses. Reads are free; changing bids spends differently, so confirm before shipping.

Confirm the account: `list_connected_accounts`.

## 1. Read performance with enough data

Pull recent performance per campaign and, where available, per ad group and segment: `pull_<platform>_ads_performance(days=...)` or `run_gaql_query` for Google detail. Do not act on thin data; a handful of conversions is noise. State the window and volume you based the call on.

## 2. Diagnose before you move

- Segments beating the target CPA/ROAS with volume to spare want more bid or budget.
- Segments far above target with real spend want less, or a match-type or negative fix first (see **negative-keywords**).
- High CPCs with poor relevance are a Quality Score or targeting problem, not a bid problem. Fixing the ad or keyword often beats raising the bid.

## 3. Choose the lever

- **Bid strategy:** manual vs target CPA vs target ROAS vs maximize conversions. Match it to data volume and the goal.
- **Modifiers:** device, audience, location, and schedule (see **dayparting**) adjust bids where performance actually differs.
- Move in steps, not leaps. Large automated-bid target swings reset learning and destabilize delivery.

## 4. Apply on approval

Apply through the plan tools or `update_campaign_budget` where budget is the real constraint. Confirm the change and re-measure after the platform has had time to adjust.

## Rules

- Never chase a target off a few conversions. Minimum data first.
- Step changes, then wait. Do not thrash bids day to day.
- Report what moved, by how much, and the expected effect on CPA/ROAS. Scale winners with the **optimize** skill.
