---
name: campaign-preflight
description: Pre-launch checks for an ad campaign — structure, conversion tracking, UTMs, geo targeting, negatives, budget, and schedule. Use before enabling a paused campaign, after building a new one, or when a user asks to review or check campaign settings before spend.
---

# Campaign Pre-Flight

Catch the mistakes that waste budget before a campaign goes live. Reads do not require approval. Run the full checklist, report pass/warn/fail per item, and fix issues before enabling. Nothing that spends money ships without explicit approval.

Confirm the account first: `list_connected_accounts`. Use the real account and campaign IDs the tools return.

## 1. Structure is complete (blocking)

A campaign that looks Active does not serve if pieces are missing. Read the real structure and confirm every level exists and is enabled:

- Use `audit_account_structure` and `get_campaign_plan` for available structure and asset details. Run `run_launch_preflight` on the plan. Confirm required ad groups, keywords, budgets, and assets only where the returned evidence supports them; obtain platform exports for missing detail.
- **Other platforms:** `list_campaigns(platform=...)` plus the supported performance tools (`pull_google_ads_performance`, `pull_meta_ads_performance`, `pull_linkedin_ads_performance`, `pull_microsoft_ads_performance`, `pull_reddit_ads_performance`) and the matching platform playbook skill to confirm ad sets/ad groups, ads, and budget.

If a required level is missing, do not enable. Fix it first.

## 2. Conversion tracking exists and is attached (blocking for conversion goals)

Without tracking, the spend is blind and smart bidding cannot work.

- Use `ga4_get_conversions`, `ga4_get_report`, and `get_pixel_health` for available conversion evidence. A configured action does not prove that a tag is firing; mark missing verification explicitly.
- Missing verified tracking on a conversion campaign is a stop. Once conversion goals are established, use MAXIMIZE_CONVERSIONS for Google Search conversion campaigns; do not substitute unconstrained Max Clicks. Consider Target CPA when conversion volume supports it.

## 3. UTMs on every ad (blocking)

Untagged traffic cannot be attributed in GA4 or a CRM. Confirm each ad's final URL carries UTMs. Standard shape:

- `utm_source` = platform (`google`, `microsoft`, `meta`, `linkedin`, `reddit`, `tiktok`, `x`)
- `utm_medium` = `cpc` (search), `paid-social` (social), `display`, or `video`
- `utm_campaign` = campaign name, slugified
- `utm_content` = ad group or ad set, `utm_term` = keyword or variant (optional)

See the **utm-builder** skill for consistent tags.

## 4. Geo targeting is set and correct (blocking)

A campaign with no location criteria serves everywhere, including low-quality and high-fraud geographies. This is the classic silent budget leak.

- Confirm location criteria exist and match the intended market. A campaign named for one country with no location criteria is the red flag.
- Prefer presence-based matching (people in the location) over interest-based unless the goal truly needs it.
- Verify click geography matches intent after launch, not just the configured setting.

## 5. Creative assets meet platform requirements

Read available asset details from `get_campaign_plan`, `list_creative_assets`, or a platform export. Verify the platform’s required asset counts, character limits, approved claims, and destination. Report missing evidence rather than assuming compliance.

- Prefer fewer concise, relevant RSA headlines that express search intent, the offer, and intentional audience qualification. Do not impose an 11-headline floor or pad to 15.
- Ad Strength is not a launch gate. Do not claim that a lower rating proves throttling or add filler to raise the rating.
- For each format, include its required assets and the placements in the approved plan. Optional slots are useful only when the content adds a distinct, relevant message.

## 6. Negatives, budget, and schedule (warn)

- **Negatives** on Search: confirm a negative list exists so new match surface does not leak spend. See the **negative-keywords** skill.
- **Budget:** sane daily amount, guarded against a fat-finger 10 to 100x. Set a max CPC on manual bidding.
- **Schedule:** if the offer is business-hours only, confirm an ad schedule rather than 24/7.

## Report

Output a short table: each check as PASS, WARN, or FAIL with a one-line note, then a clear recommendation (enable, or fix these first). Blocking fails (structure, tracking, UTMs, geo, missing required creative assets) must clear before you enable. Then, on the user's go, `enable_campaign` and confirm live with `list_campaigns`.
