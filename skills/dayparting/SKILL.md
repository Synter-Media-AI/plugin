---
name: dayparting
description: Analyze hour-of-day and day-of-week performance and set ad schedules and bid modifiers to spend when conversions happen. Use when a user wants to optimize ad scheduling, set dayparting, find the best times to run ads, or cut spend during dead hours.
---

# Dayparting and Ad Scheduling

Spend when the account converts, not evenly around the clock. Reads are free; schedule and modifier changes affect delivery, so confirm before shipping.

Confirm the account: `list_connected_accounts`.

## 1. Read time-segmented performance

Pull performance by hour of day and day of week: `run_gaql_query` on the time segments (Google) or the platform performance pull with a date window long enough to be stable. You want conversions and CPA by time slot, not just clicks.

## 2. Find the real pattern

- Slots with strong conversion volume and CPA at or below target want to keep or gain bid.
- Slots with spend and clicks but no conversions are candidates to reduce or exclude.
- Watch for thin cells; a single quiet hour is not a trend. Judge on volume, not one day.

## 3. Set the schedule

Build an ad schedule with bid modifiers per slot: raise where it converts, lower or pause where it does not. Keep changes proportionate; do not zero out a slot on weak data.

## 4. Apply on approval

Apply through the plan tools and confirm. Re-pull after a couple of weeks to check the pattern held; buyer behavior shifts seasonally (see **kill-scale-rules** for scaling discipline).

## Rules

- Base every slot decision on conversions with volume, not clicks or one-off days.
- Account for the account's real time zone, not yours.
- Report the schedule set and the expected shift in blended CPA.
