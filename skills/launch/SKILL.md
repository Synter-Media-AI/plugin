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

Confirm the account: `list_connected_accounts`. Confirm conversion tracking exists: `ga4_list_conversions` / `get_gtm_tag` / `verify_pixel_ownership`. No tracking → fix that before launching, or the spend is blind.

## 2. Plan it

Use `create_campaign_plan` to draft structure (campaigns → ad sets → ads), then `forecast_campaign` for reach/CPM/CPC/CPA projections. For the channel mix and budget split, lean on platform cost benchmarks and a clear rationale.

Creative: run the **creative** skill, or `generate_image_ad` / `generate_text_ad` / `generate_video_ad`. Apply brand voice (see `${CLAUDE_PLUGIN_ROOT}/context/brand-and-safety.md`).

## 3. Preflight — before anything goes live

Walk the checklist and report pass/fail:

- Geo targeting correct, exclusion lists applied.
- Conversion tracking firing and attached to the right action.
- Budget and bid caps sane — guard against fat-finger budgets (a daily budget that's 10–100x intended is the classic incident).
- Creative passes platform policy (`ad-policy-compliance` thinking) and brand rules.
- Final URL resolves and matches the ad's promise.

## 4. Ship on approval

Show the full plan — platform, audience, budget, creative, projected CPA — and ask for a clear go. Only then:

- `create_campaign_for_audience(...)` for an audience-targeted launch, or `execute_campaign_plan` / `enable_campaign` for a built plan.
- For multi-platform, ship each platform and confirm each one back with its real campaign ID.

Then confirm live: `list_campaigns(platform=...)` and report the IDs created. "Created" and "live and spending" are different claims — verify before you say it's running.

## House rules

- Nothing that spends money ships without explicit approval. Default to recommend-then-execute.
- Use real account IDs returned by the tools — never invent them.
- Start conservative on budget; scale winners later with the **optimize** skill.
