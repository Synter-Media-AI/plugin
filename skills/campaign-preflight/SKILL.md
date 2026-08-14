---
name: campaign-preflight
description: Pre-launch checks for an ad campaign — structure, conversion tracking, UTMs, geo targeting, negatives, budget, and schedule. Use before enabling a paused campaign, after building a new one, or when a user asks to review or check campaign settings before spend.
---

# Campaign Pre-Flight

Catch the mistakes that waste budget before a campaign goes live. Reads are free. Run the full checklist, report pass/warn/fail per item, and fix issues before enabling. Nothing that spends money ships without explicit approval.

Confirm the account first: `list_connected_accounts`. Use the real account and campaign IDs the tools return.

## 1. Structure is complete (blocking)

A campaign that looks Active does not serve if pieces are missing. Read the real structure and confirm every level exists and is enabled:

- **Google:** `run_gaql_query` for campaigns, ad groups, ads, and keywords. Confirm ad groups exist, each has enabled ads, Search has keywords, and a budget is set.
- **Other platforms:** `list_campaigns(platform=...)` plus `pull_<platform>_ads_performance` and the matching platform playbook skill to confirm ad sets/ad groups, ads, and budget.

If a required level is missing, do not enable. Fix it first.

## 2. Conversion tracking exists and is attached (blocking for conversion goals)

Without tracking, the spend is blind and smart bidding cannot work.

- `ga4_list_conversions` to confirm conversion actions exist. `get_gtm_tag` / `list_gtm_tags` to confirm the tag is present and published. `verify_pixel_ownership` to confirm the platform pixel is really wired.
- No tracking on a conversion-optimized campaign is a stop. Start on a click or traffic goal until conversions are verified (roughly 15 to 30 conversions before smart bidding has enough signal).

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

## 5. Creative asset completeness (blocking for Search RSAs)

A structurally complete campaign can still launch handicapped: an RSA created with the platform-minimum 3 headlines and 2 descriptions is accepted by the API but scores "Poor" on Google Ad Strength and gets throttled in the auction.

- Read each ad's actual asset counts (Google: `run_gaql_query` on `ad_group_ad` with the RSA headline/description fields). Compare against the floor: **11 headlines / 4 descriptions minimum, 15 / 4 recommended** per RSA.
- Check Google's Ad Strength rating where available. **POOR or AVERAGE = fix the assets before launch**, not after. Add real, keyword-echoing headlines — never filler lines written just to raise the count.
- Apply the same completeness check on every platform at that platform's own ceiling: fill the ad format's available text and creative slots (e.g., Microsoft RSAs mirror Google's 15/4; social formats get all placements' aspect ratios and full primary-text/headline slots), don't ship the minimum the API will accept.

## 6. Negatives, budget, and schedule (warn)

- **Negatives** on Search: confirm a negative list exists so new match surface does not leak spend. See the **negative-keywords** skill.
- **Budget:** sane daily amount, guarded against a fat-finger 10 to 100x. Set a max CPC on manual bidding.
- **Schedule:** if the offer is business-hours only, confirm an ad schedule rather than 24/7.

## Report

Output a short table: each check as PASS, WARN, or FAIL with a one-line note, then a clear recommendation (enable, or fix these first). Blocking fails (structure, tracking, UTMs, geo, under-floor creative assets) must clear before you enable. Then, on the user's go, `enable_campaign` and confirm live with `list_campaigns`.
