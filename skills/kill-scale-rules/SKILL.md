---
name: kill-scale-rules
description: "Whether to kill or scale a campaign / ad set / creative. Covers kill thresholds with minimum-data guardrails and platform-specific scaling budget-step limits."
---

# Kill Criteria & Scaling Rules

Most teams kill too early (acting on noise) or scale too aggressively (the algorithm can't keep up). These thresholds are calibrated so you act on signal, not noise.

## Kill Criteria — minimum data required BEFORE killing

| Timeframe | Kill if | Min data |
|-----------|---------|----------|
| 24 hours | Hook rate < 15% | 5K+ impressions |
| 48 hours | CTR < 0.5% | 2K+ impressions |
| 3 days | CPA > 2x target | $50+ spend or 1K+ clicks |
| 5 days | No conversions | 3x target CPA in spend |
| 7 days | CPA trending up 3 consecutive days | Statistically significant data |
| 14 days | CPA 1.5x above target with no improvement | Full test cycle complete |

**Never kill before minimum data.** Bad decisions from small samples cost more than the extra test spend. If a creative has 800 impressions and 2 clicks, you don't have enough signal to conclude anything — wait.

## Scaling Rules

| Condition | Action | Frequency |
|-----------|--------|-----------|
| CPA < target for 48h | Increase budget 20% | Every 2-3 days |
| CPA < 50% of target for 72h | Increase budget 30-50% | Every 2 days |
| Winner holds after 3 increases | Duplicate to new audience | Once per winner |
| Creative at 100K impressions | Commission 3 variations | Immediately |
| CPA rises after budget increase | Revert to previous budget, wait 48h | As needed |

## Platform-specific budget step limits

- **Meta:** Max **30%/day** budget increase. The algorithm needs recalibration time — bigger steps re-enter the learning phase and can wreck stable performance.
- **Google PMax:** Tolerates up to **50%/day**.
- **TikTok Smart+:** Tolerates up to **50%/day**.
- **LinkedIn:** Conservative — **20%/day** is the safe ceiling.

## When to revert

If CPA rises >25% within 48h of a budget increase, revert to the previous budget and wait 48h before trying again. The algorithm may need to re-stabilize. Repeated failed scaling attempts on the same creative usually mean the audience is saturated — duplicate to a new audience instead of pushing harder.

## When to duplicate vs. when to scale in place

- **Scale in place** if the creative is still under its proven scaling ceiling and frequency is stable.
- **Duplicate to a new audience** if frequency is climbing or CPA rises after every budget step.
- **Commission variations** as soon as a creative crosses 100K impressions — fatigue is coming whether you can see it yet or not.

## Running too hot — throttle BEFORE you kill

When a campaign is overspending or CPA is climbing but it is **still converting**, throttle it down — don't kill it. Killing a converting campaign throws away the algorithm's learning; throttling keeps it alive while you pull spend back to target. Apply in this order, least-destructive first:

| Signal (past minimum data) | Action | Why this lever |
|----------------------------|--------|----------------|
| CPA 1.2–1.5× target, still converting | Reduce daily budget **15%** | Pull spend back without resetting learning |
| CPA 1.5–2× target, still converting | Reduce daily budget **25%** and/or tighten the target (target-CPA down ≤15%) | Heavier throttle, still recoverable |
| CPA > 2–3× target **and 0 conversions** | **Pause** (kill) — see Kill Criteria above | No conversions = no learning to protect |
| Spend pacing > 150% of expected daily run-rate | Reduce budget to bring projected month-end spend back under cap | Pacing, not just efficiency |

Always protect the top converters: never pause the best-performing 2–3 campaigns/ad sets in an account on a pacing trigger alone.

### Which lever per platform (use the tool that exists; don't hand-roll the API)

- **Budget down — every platform.** `update_campaign_budget` / `optimize_budget`. The universal throttle.
- **Pause — every platform.** `pause_campaign`. Reset-safe.
- **Bid / smart-bid target down — Google (target CPA/ROAS), Meta (cost/bid cap), TikTok, Reddit, X, Amazon DSP, Spotify (CPM).** Use the platform's update tool.
- **Objective / optimization-event shift — Google, Meta, TikTok, Reddit, X only.** Other platforms can't change objective after launch.
- **Microsoft / Pinterest / Snapchat / OpenAI / retail (Criteo/Walmart/Instacart/Roundel):** budget + pause only — no bid/objective tool. Throttle via budget.

## Learning-phase guardrail — the one rule that, if broken, makes throttling backfire

Editing a campaign **while it is in its learning phase resets the algorithm to zero** and *hurts* performance. This is the most common way automated throttling does more harm than good. Before changing a bid, budget, target, objective, or audience:

- **Don't edit during learning.** A campaign is "learning" until it has roughly **50 conversions over ~7 days** (Meta/Google/TikTok all use ~this). If it's still learning and merely volatile, **hold** — volatility is expected, not a problem to fix.
- **Cap the size of any change at ≤20%** of the current value. Bigger steps (Meta >20–25%, TikTok >~50%, Google strategy/target changes) re-enter learning.
- **Cooldowns between edits.** Google smart-bidding target: change at most **once or twice a month** (~14-day cooldown). Meta/TikTok budget steps: wait **2–3 days** between changes; **7-day no-touch** right after launch.
- **Pausing is reset-safe; editing is not.** Pausing/killing clearly-dead spend (2–3× CPA, 0 conv) carries no learning penalty. Fiddling with a live learner does. When in doubt on a converting campaign, do the smaller budget nudge — not a bid-strategy or objective change.
- **Require minimum data first** (same bar as Kill Criteria): ~48–72h + ~30–50 conversions before judging efficiency; 2–3× target CPA in spend before a kill.

## Frequency / fatigue throttle

Use a **compound** trigger, not frequency alone, to avoid false kills: 7-day frequency **> 3.5** AND CTR/engagement decayed **> 25%** from the first-week baseline → refresh creative (commission variations) and/or cap delivery. Healthy 7-day frequency: prospecting ~1.5–2.5, retargeting ~4–7.
