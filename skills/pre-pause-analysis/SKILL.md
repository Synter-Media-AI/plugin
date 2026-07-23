---
name: pre-pause-analysis
description: Full-funnel check before pausing, cutting, or killing a paid campaign — confirm the problem is real and the platform has had enough time before stopping any spend. Use before pausing anything, or when a user wants to cut a campaign that looks like it is underperforming.
---

# Pre-Pause Analysis

Pausing is easy and often wrong. A campaign that looks like a loser is frequently a tracking gap, a geo leak, or an ad set the platform has not finished learning. Run this before any pause so you stop the right thing for the right reason. Reads are free; pausing is a change and waits for explicit approval.

Confirm the account: `list_connected_accounts`.

## 1. Is the data even real

- Confirm conversion tracking is firing and attached to the right action (`ga4_list_conversions`, `verify_pixel_ownership`). A campaign with broken tracking looks dead when it may be converting. See the **conversion-tracking** skill.
- Check the destination: does the final URL resolve and match the ad's promise. A broken or mismatched landing page kills conversion rate independent of the campaign.

## 2. Has it had enough time and volume

- New ad sets need a learning window before their numbers mean anything. On Meta, an ad set in the Learning Phase has not stabilized. On Search, a handful of clicks is noise.
- Require a real spend and conversion count over enough days before judging. State the window and the volume you are judging on.

## 3. Where in the funnel is it actually failing

Diagnose the level, do not just read the top-line CPA:

- **Delivery:** is it spending and serving. Low impression share or a tiny audience is a setup problem, not a performance one.
- **Click:** impressions but no clicks points at creative or relevance. Clicks from the wrong geography point at a targeting or fraud leak, not a bad offer. Validate click geography against intent.
- **Conversion:** clicks but no conversions points at the landing page, the offer, or tracking, before the campaign itself.

## 4. Decide and confirm

- If the problem is fixable (tracking, geo, negatives, creative, landing page), fix that first rather than pausing.
- If it is a genuine loser with enough evidence, pause on the user's clear go with `pause_campaign`, and report the evidence behind the call.

Pair with **kill-scale-rules** for the kill-or-scale decision once the data is trustworthy.
