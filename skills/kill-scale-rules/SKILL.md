---
name: kill-scale-rules
description: Decide whether to kill or scale a campaign, ad set, or creative, with minimum-data guardrails and platform-safe budget-step limits. Use when a user asks whether to pause, cut, kill, scale, or increase budget on something, or wants rules for when to do it.
---

# Kill or Scale

The two decisions that move an account: cut what is losing, feed what is winning. Both fail when made too early or too hard. Reads are free; pausing or scaling spends differently, so confirm before shipping.

Confirm the account: `list_connected_accounts`.

## Minimum data first

Never kill or scale on noise. Require enough conversions and enough time for the platform to have learned. For a new ad set still in Meta's Learning Phase, or a Search campaign with a handful of clicks, the answer is usually "wait", not "cut". Run **pre-pause-analysis** before pausing anything.

## When to kill

- Real spend, enough conversions to judge, CPA well above target with no fixable cause (targeting, negatives, creative, tracking all checked).
- Creative fatigue past recovery (rising frequency, falling CTR) that rotation will not fix (see **creative-fatigue-detector**).
- Before you pause, confirm it is not a tracking or geo problem masquerading as poor performance.

## When to scale

- Consistent performance at or below target CPA/ROAS with volume, held across enough days.
- Room to grow (impression share lost to budget, or audience not saturated).

## Scale in safe steps

Raise budget in increments, not leaps. Large jumps reset learning and can spike CPM or CPA. Increase, hold, re-measure, increase again. Match the step to the platform and the ad set's stability. Use `update_campaign_budget` and confirm.

## Rules

- Minimum data before any kill or scale call. State the window and volume.
- Rule out tracking, geo, and creative before blaming the campaign.
- Report the decision, the evidence, and the step taken. Scaling is a separate, approved action every time (see **optimize**).
