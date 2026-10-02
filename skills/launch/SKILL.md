---
name: launch
description: Plan and launch a cross-platform ad campaign — strategy, targeting, creative, budget, and preflight — then ship it on the user's approval. Use when a user wants to launch, build, or run a new campaign on one or more platforms (Google, Meta, LinkedIn, Reddit, TikTok, X, and more).
---

# Launch a Campaign

Take the user from intent to a live campaign. Plan it, show it, ship it on their word. You direct nothing on your own — every spend-creating step waits for explicit approval.

## 1. Scope it

Get the brief in plain English, then pin down what you need:

- **Objective** (leads, signups, sales, awareness) and the **conversion** that defines success.
- **Platform(s)** — recommend the mix; don't just take the first one named.
- **Audience** — who, where. If it needs building, run the **audience** skill first.
- **Budget** — daily/total, and the **target CPA/ROAS**.
- **Landing page / final URL** and the offer.

Confirm the account with `list_connected_accounts`. Check conversion evidence with `ga4_get_conversions`, `ga4_get_report`, and `get_pixel_health`. Resolve missing verification before launching.

## 2. Plan it

Use `create_campaign_plan` to draft structure (campaigns → ad sets → ads), add supported entities with `upsert_plan_entity`, then `forecast_campaign` for reach/CPM/CPC/CPA projections. For the channel mix and budget split, lean on platform cost benchmarks and a clear rationale.

Write text with `create_ad_copy` and select existing approved assets with `list_creative_assets`. Use the verified advertiser’s voice, logos, colors, and destination; see `${CLAUDE_PLUGIN_ROOT}/context/brand-and-safety.md`.

## 3. Preflight — before anything goes live

Read the complete plan with `get_campaign_plan` and run `run_launch_preflight`. Resolve failures, then show the exact final plan and report pass/fail:

- Geo targeting correct, exclusion lists applied.
- Conversion tracking firing and attached to the right action.
- Budget and bid caps sane — guard against fat-finger budgets (a daily budget that's 10–100x intended is the classic incident).
- Creative passes platform policy (`ad-policy-compliance` thinking) and brand rules.
- Final URL resolves and matches the ad's promise.

## 4. Ship on approval

Show the full plan — platform, audience, budget, creative, projected CPA — and ask for a clear go. Only then:

- Record the user’s approval with `approve_campaign_plan`, then use `execute_campaign_plan`. Check `get_plan_execution` and, if a job ID is returned, `get_job_status`. Use `enable_campaign` only when activation is within the user-approved scope.
- For multi-platform, ship each platform and confirm each one back with its real campaign ID.

Then confirm live: `list_campaigns(platform=...)` and report the IDs created. "Created" and "live and spending" are different claims — verify before you say it's running.

## House rules

- Nothing that spends money ships without explicit approval. Default to recommend-then-execute.
- ALWAYS call `list_connected_accounts` or `get_connection_status` first to validate the target Account ID and Account Name on multi-account setups.
- Whenever reporting back, you MUST explicitly include the **Platform**, **Account Name**, and **Account ID** (e.g. `Google Ads: Acme Corp (ID: 123-456-7890)`).
- Use real account IDs returned by the tools — never invent them.
- Start conservative on budget; scale winners later with the **optimize** skill.

