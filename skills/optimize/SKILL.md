---
name: optimize
description: Improve campaign performance — reallocate budget by ROAS, tune bids, kill losers and scale winners, and catch anomalies across platforms. Use when a user wants to cut wasted spend, improve ROAS/CPA, rebalance budget, or act on what's underperforming.
---

# Tune & Reallocate

Find the wasted spend and the winners, then act on the user's approval.

## 1. Pull the truth

Get recent performance across the connected platforms:
`pull_google_ads_performance`, `pull_meta_ads_performance`, `pull_linkedin_ads_performance`, `pull_reddit_ads_performance`, `pull_tiktok_ads_performance`, `pull_x_ads_performance`, `pull_microsoft_ads_performance` (and the rest). Use `reconcile_platforms` to compare apples to apples, and `get_attribution` to see what's really driving conversions.

## 2. Diagnose

- **Wasted spend**: campaigns/ad sets/creatives spending with no conversions past a minimum-data threshold.
- **Winners**: low CPA / high ROAS with enough volume to scale.
- **Anomalies**: spend spikes, CTR drops, budget runaway — flag before they compound.
- **Fatigue**: rising frequency with falling CTR → creative needs rotation (run the **creative** skill).

Respect minimum-data guardrails — don't kill or scale on noise. State the threshold you used.

## 3. Recommend, then act

Present a clear plan: what to cut, what to scale, where the freed budget goes, and the expected effect.

- `optimize_budget` — cross-platform reallocation by ROAS.
- `update_campaign_budget` — set a specific budget (guard against fat-finger amounts; default to sane ceilings).
- `pause_campaign` — kill a loser.
- Bid/budget tuning per platform as supported.

Scale winners in steps (platform-appropriate budget increments), not all at once — big jumps reset the learning phase.

## 4. Confirm

After acting, re-pull and report what changed and the new state. Set a `set_spend_alert` so the user is warned if spend runs away.

## House rules

- Every budget/pause/bid change needs explicit approval. Recommend-then-execute by default.
- Minimum-data guardrails before any kill-or-scale call.
- Never report a change as done without confirming it landed.
