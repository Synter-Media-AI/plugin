---
name: report
description: Build a cross-channel performance report — spend, conversions, CPA/ROAS, attribution, and an executive narrative. Use when a user asks how campaigns are doing, wants a weekly/monthly report, a board/exec summary, or to reconcile numbers across platforms.
---

# Cross-Channel Report

Pull every connected platform the tools support, reconcile, and tell the story straight.

## 1. Gather

Pull the period the user wants across all connected platforms using the supported performance tools (`pull_google_ads_performance`, `pull_meta_ads_performance`, `pull_linkedin_ads_performance`, `pull_microsoft_ads_performance`, `pull_reddit_ads_performance`). Add analytics ground truth: `ga4_get_report` for sessions/conversions, `get_attribution` for conversion paths.

## 2. Reconcile

Use `get_spend_reconciliation` to compare spend records. Compare conversion counts separately with `ga4_get_report` and `get_attribution`, stating the attribution model and window. Flag deduplication uncertainty and access failures rather than treating them as verified tracking defects.

## 3. Tell the story

Lead with the result, then the why. Cover:

- **Blended numbers**: total spend, conversions, blended CPA/ROAS.
- **By platform**: what's working, what's not, where the money should move.
- **Trend**: WoW / MoM / YoY where there's data. Pacing vs target.
- **What I'd do next**: 2–3 concrete moves (hand off to **optimize** or **launch**).

For an exec/board audience, keep it to the narrative and the numbers that matter — no platform jargon dumps.

## 4. Deliver

Deliver a copyable narrative and tables in the conversation. Exporting documents or sending messages is outside this plugin’s tool surface.

## House rules

- Always validate connected Account IDs (`get_connection_status`) first. Explicitly state the **Platform**, **Account Name**, and **Account ID** (e.g. `Google Ads: Acme Corp (ID: 123-456-7890)`) in all reports.
- Numbers must be real and reconciled. Flag gaps; don't paper over them.
- Distinguish "platform says" from "analytics confirms."
- Reporting is read-only — no approval needed to pull and write a report. Acting on it is a separate, approved step.

