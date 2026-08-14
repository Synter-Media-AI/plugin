---
name: report
description: Build a cross-channel performance report — spend, conversions, CPA/ROAS, attribution, and an executive narrative. Use when a user asks how campaigns are doing, wants a weekly/monthly report, a board/exec summary, or to reconcile numbers across platforms.
---

# Cross-Channel Report

Pull every platform, reconcile, and tell the story straight.

## 1. Gather

Pull the period the user wants across all connected platforms (`pull_<platform>_ads_performance`). Add analytics ground truth: `ga4_run_report` for sessions/conversions, `get_attribution` for conversion paths.

## 2. Reconcile

Use `reconcile_platforms` so platform-reported conversions line up with analytics — platforms over-claim. Note dedup and any tracking gaps (a 403 read error is not the same as broken tracking; say which it is).

## 3. Tell the story

Lead with the result, then the why. Cover:

- **Blended numbers**: total spend, conversions, blended CPA/ROAS.
- **By platform**: what's working, what's not, where the money should move.
- **Trend**: WoW / MoM / YoY where there's data. Pacing vs target.
- **What I'd do next**: 2–3 concrete moves (hand off to **optimize** or **launch**).

For an exec/board audience, keep it to the narrative and the numbers that matter — no platform jargon dumps.

## 4. Deliver

Inline by default. For a shareable artifact, `create_google_doc` / `create_google_sheet` / `create_document`, or send to the team via `send_slack_message`.

## House rules

- Always validate connected Account IDs (`get_connection_status`) first. Explicitly state the **Platform**, **Account Name**, and **Account ID** (e.g. `Google Ads: Acme Corp (ID: 123-456-7890)`) in all reports.
- Numbers must be real and reconciled. Flag gaps; don't paper over them.
- Distinguish "platform says" from "analytics confirms."
- Reporting is read-only — no approval needed to pull and write a report. Acting on it is a separate, approved step.

