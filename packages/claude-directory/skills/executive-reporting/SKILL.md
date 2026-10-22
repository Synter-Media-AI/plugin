---
name: executive-reporting
description: Build C-suite and board ad reports — blended ROAS, month-over-month and year-over-year, pacing, and a plain-English narrative of what happened and what to do. Use when a user wants an executive summary, a board report, or a monthly performance review across platforms.
---

# Executive Reporting

Write for a reader who does not live in the ad accounts. Lead with the result and the decision, not the dashboard. Reads only; this produces a report, it does not change spend.

Confirm the account: `list_connected_accounts`, then pull real numbers across platforms: the supported performance tools (`pull_google_ads_performance`, `pull_meta_ads_performance`, `pull_linkedin_ads_performance`, `pull_microsoft_ads_performance`, `pull_reddit_ads_performance`), `get_attribution` for the cross-platform view, `ga4_get_report` for outcomes. Reconcile platform self-reports before quoting a total (see **attribution**).

## What an exec report says

- **Headline:** blended spend, conversions or revenue, blended ROAS or CPA, and the one sentence that matters. ("Spend held flat; leads up 22% as we shifted budget to search.")
- **Trend:** month-over-month and, where data exists, year-over-year. Show direction and magnitude, not a wall of rows.
- **By channel:** a short table of the platforms that matter, with spend, result, and efficiency. Group the long tail.
- **Pacing:** on track, over, or under budget for the period, and the projected finish.
- **Decisions:** what you changed, what you recommend next, and what needs their call. This is the part they read.

## How to present it

- Narrative first, tables second. Every number earns its place; cut vanity metrics.
- Round to what matters at their altitude; no false precision.
- Deliver a copyable summary and table in the conversation. The plugin does not create external documents or send reports. Use **report** for operator-level per-channel detail.

## Rules

- Never fabricate a number or a trend. If data is missing or a platform is unreconciled, say so plainly.
- State the attribution basis and the period behind blended figures.
- Lead with the result and the recommendation; the executive should get the point in the first two lines.
