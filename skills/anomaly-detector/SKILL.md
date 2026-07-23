---
name: anomaly-detector
description: Catch spend spikes, CTR or conversion-rate drops, budget runaway, and metric outliers across campaigns, and set sane alert thresholds. Use when a user asks why spend or performance changed suddenly, wants monitoring or alerts, or something looks off in the numbers.
---

# Anomaly Detector

Find the sudden change before it burns a budget. Reads are free; setting alerts or pausing is a change and waits for approval.

Confirm the account: `list_connected_accounts`.

## 1. Pull a baseline and today

Read a stable window and the recent period per platform: `pull_<platform>_ads_performance(days=...)`, or `run_gaql_query` for Google detail. You need enough history to know what normal looks like before you can call something abnormal.

## 2. Find real outliers, not noise

- **Spend spike / budget runaway:** daily spend jumping well above the recent average, or pacing to exhaust the budget far too early. This is the one to catch fastest.
- **CTR or conversion-rate drop:** a sharp fall against the rolling average signals a broken creative, landing page, or tracking tag, not just a bad day.
- **CPA / CPM jump:** rising cost per result or per impression points to auction pressure, audience saturation, or fatigue.
- Judge against variation, not a single day. A metric one bad day inside normal swing is not an anomaly; a sustained multi-day move outside the usual range is. State the window and the size of the move.

## 3. Diagnose before you alarm

Rule out the mundane first: a tracking outage reads as a conversion cliff; a new campaign launch reads as a spend spike; a weekend reads as a volume drop. Confirm the cause before recommending action.

## 4. Act

- Set forward-looking guardrails with `set_spend_alert` so the next runaway trips an alarm early.
- For a confirmed problem, recommend the fix (pause, budget cut, creative swap) and take it through the relevant skill on approval. Do not pause on one noisy data point; see **pre-pause-analysis**.

## Rules

- Distinguish signal from noise; every flag names the window and the magnitude.
- Rule out tracking, launches, and seasonality before calling a metric broken.
- Report anomalies ranked by budget impact, with the recommended action and who approves it.
