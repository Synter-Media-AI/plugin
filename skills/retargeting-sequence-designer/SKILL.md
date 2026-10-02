---
name: retargeting-sequence-designer
description: Design multi-stage retargeting funnels with recency windows, sequential messaging, frequency caps, and exclusion lists across platforms. Use when a user wants to build a retargeting or remarketing funnel, segment audiences by recency, or stop over-serving ads to the same people.
---

# Retargeting Sequence Designer

Retargeting works when recency drives the message and exclusions stop the waste. One "all visitors 30 days" audience with one ad is not a funnel; it is a frequency complaint generator.

Confirm the account and existing audiences first: `list_connected_accounts`, `list_audiences`.

## 1. Map stages to intent

Define the conversion goal, then split visitors by how close they got:

- **Stage 1:** all site visitors (awareness reinforcement)
- **Stage 2:** engaged visitors (product or offer pages, 2+ pages)
- **Stage 3:** high-intent (cart, order, demo page)
- **Stage 4:** abandoners (started the conversion, did not finish)

Allocate the proposed budget by intent and audience size. Check `get_pixel_health` and **conversion-tracking** before relying on event-based audiences; verify actual membership with `list_audiences` or platform exports.

## 2. Segment by recency, with mutual exclusion

- **Hot (0-3 days):** highest bids, direct CTA and urgency, up to 3 impressions/day, ~35% of budget.
- **Warm (4-14 days):** social proof and case studies, up to 2/day, ~30%.
- **Cool (15-30 days):** value proposition refresh, 1/day, ~20%.
- **Cold (31-90 days):** new features and win-back offers, ~3/week, ~15%.

Each window must exclude every shorter window, or the hot audience gets triple-served by every campaign at once.

## 3. Sequence the message

Sequence messages by recency and intent: reminder, evidence, relevant offer, then a different angle. Avoid fabricated urgency. Write text variants with `create_ad_copy`, select existing approved assets with `list_creative_assets`, and use **creative-testing** to assess results.

## 4. Build the exclusions

Mandatory, on every retargeting campaign:

- Purchasers and converters, 30 days minimum, 90 recommended.
- Existing customers, unless the approved campaign explicitly targets them.
- Junk traffic: sub-5-second bounces, careers-page visitors.

Have the account owner refresh customer suppression lists and exclusions in the platform UI. Confirm existing audience IDs with `list_audiences` before adding them to supported plan fields.

## 5. Coordinate across platforms

Assign roles so platforms complement instead of pile on: Google Display/YouTube for reach, Meta for social proof, LinkedIn for B2B decision-makers, TikTok for short-form. Cap total cross-platform exposure around 5-8 impressions/day per user by capping each platform individually (Meta and Reddit 2-3/day, LinkedIn 1-2/day, Display 3-5/day). Upload the same suppression list everywhere so a converter disappears from all platforms, not just one.

## 6. Launch and monitor

Prepare per-stage campaigns with `create_campaign_plan` and `upsert_plan_entity`, then follow **launch** for preflight and explicit approval. Review results weekly with the supported platform performance tools:

- Frequency above ~8/week per user: tighten windows or cut budget.
- CTR falling 20%+ week over week: creative fatigue, rotate the stage's ads.
- Check that retargeting credit is real, not just last-touch harvesting — `get_attribution` and, when spend is material, an incrementality test (see **attribution**).

## Rules

- No stage without an exclusion. Overlapping windows are self-competition you pay for.
- Recency beats everything: a 0-3 day cart abandoner converts at many times the rate of a 60-day visitor. Bid like it.
- Rotate creative per stage; a five-touch sequence with one ad is one touch, five times.
- Retargeting looks cheap on last-click. Judge it on incremental CPA before scaling (see **optimize**).
