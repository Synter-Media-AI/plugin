---
name: bid-optimization
description: Recommend bid and bid-strategy changes from performance data — CPC targets, device and audience modifiers, and target CPA/ROAS moves. Use when a user wants to lower CPCs, hit a target CPA or ROAS, or adjust bids across campaigns.
---

# Bid Optimization

Move bids toward the target CPA or ROAS using real performance, not guesses. Reads do not require approval; changing bids spends differently, so confirm before shipping.

Confirm the account: `list_connected_accounts`.

## 1. Read performance with enough data

Pull recent campaign performance with `pull_google_ads_performance`, `pull_meta_ads_performance`, `pull_linkedin_ads_performance`, `pull_microsoft_ads_performance`, or `pull_reddit_ads_performance`. Use segment detail only if returned; request platform exports for missing breakdowns. State the period and conversion volume before making a recommendation.

## 2. Diagnose before you move

- Segments beating the target CPA/ROAS with volume to spare want more bid or budget.
- Segments far above target with real spend want less, or a match-type or negative fix first (see **negative-keywords**).
- High CPCs with poor relevance are a Quality Score or targeting problem, not a bid problem. Fixing the ad or keyword often beats raising the bid.

## 3. Choose the lever

- **Bid strategy:** manual vs target CPA vs target ROAS vs maximize conversions. Match it to data volume and the goal.
- **Modifiers:** device, audience, location, and schedule (see **dayparting**) adjust bids where performance actually differs.
- Move in steps, not leaps. Large automated-bid target swings reset learning and destabilize delivery.

## 4. Apply on approval

Apply budget changes with `update_campaign_budget` on approval. Hand bid-strategy and modifier changes on existing campaigns to the platform UI unless the live plan schema supports them; confirm and re-measure.

## Rules

- Never chase a target off a few conversions. Minimum data first.
- Step changes, then wait. Do not thrash bids day to day.
- Report what moved, by how much, and the expected effect on CPA/ROAS. Scale winners with the **optimize** skill.
