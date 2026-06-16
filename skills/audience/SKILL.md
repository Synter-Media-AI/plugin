---
name: audience
description: Build, analyze, and activate audiences — ABM target lists, lookalikes, signal-based segments, and first-party data — then sync them to ad platforms. Use when a user wants to define who to reach, build a target list, create a lookalike, or push an audience live.
---

# Build & Activate Audiences

Turn "who we want to reach" into a real, activated audience on the platforms.

## 1. Define the audience

Start from the user's description in plain English, then pick the right path:

- **ABM / named accounts or ICP** → `build_abm_audience` (company + person criteria). Discover accounts by buying signals — hiring, ad spend, funding, intent, install data.
- **Lookalike** → `build_lookalike_audience` from a seed (customers, converters, high-value list).
- **Signal-based** → `find_audience_signals` to discover the signals behind the idea, then build from the strongest.
- **First-party** → upload the user's list (emails/MAIDs). Canonicalize emails and hash before upload; tiny B2B work-email lists often fall below a platform's match floor — warn the user.

## 2. Analyze before you activate

- `list_audiences` to see what already exists — don't rebuild a duplicate.
- Profile the segment: size, match rate, overlap, and whether it clears each platform's minimum (LinkedIn company audiences and Reddit have real floors). Report the numbers honestly; a segment under the floor won't deliver.

## 3. Activate

- `sync_audience` / `attach_audience` to push to a platform and attach to campaigns/ad sets.
- For a fresh campaign targeting the segment, hand off to the **launch** skill (`create_campaign_for_audience`).
- `stage_audience_artifact` when you want the user to review the list before it goes live.

## 4. Keep it living (optional)

For an always-on motion, set the audience to refresh on a schedule so new signal matches flow in automatically. Tell the user what cadence you set and how to change it.

## House rules

- Respect match-rate floors — surface them, don't hide a too-small segment.
- First-party data: hash/normalize identifiers; never upload raw PII where a platform expects hashes.
- Confirm the org/account before activating. Reads are free; activation is an action — confirm scope first.
