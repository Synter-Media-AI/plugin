---
name: geo-integrity-audit
description: Verify that ad campaigns actually target the geographies they claim — location criteria exist, presence-only matching is set, and click geography matches intent. Use when auditing campaigns, investigating cheap clicks or missing conversions, or reviewing any campaign before and after launch.
---

# Geo Integrity Audit

A campaign named "US" is not a campaign targeted to the US; the only evidence of geo targeting is the configured criteria and the actual delivery data, so check both.

Confirm the account: `list_connected_accounts`.

## 1. Verify location criteria exist

A campaign with no positive location criteria serves worldwide on most platforms. Never accept the campaign name as evidence of targeting.

On Google, read the actual criteria with `run_gaql_query`:

```sql
SELECT campaign.name, campaign_criterion.location.geo_target_constant,
       campaign_criterion.negative
FROM campaign_criterion
WHERE campaign_criterion.type = 'LOCATION' AND campaign.status = 'ENABLED'
```

An empty result for a campaign means worldwide delivery. On social platforms, geo lives at the ad set / ad group level — check every ad set, not just the campaign (`tiktok_ads_get_adgroup` shows TikTok targeting; elsewhere use `get_ad_readback` and the platform UI). If a platform gives you no read path for targeting, mark it UNVERIFIED in the report and verify through delivery data instead — never imply a check you could not run.

## 2. Verify presence-only matching

Google's default geo match is "presence or interest," which lets users anywhere in the world match your target country by merely showing interest in it — a standing leak for junk clicks. Check it:

```sql
SELECT campaign.name, campaign.geo_target_type_setting.positive_geo_target_type
FROM campaign WHERE campaign.status = 'ENABLED'
```

Flag anything not set to `PRESENCE`. Microsoft Ads has the same concept ("people in" vs "people searching for or viewing pages about" the location) — verify it there too.

## 3. Verify click geography matches intent

Criteria can look right while delivery is wrong. Pull actual delivery by country and compare against the intended market:

- **Google:** `run_gaql_query` on `geographic_view`:

```sql
SELECT geographic_view.country_criterion_id, metrics.clicks, metrics.cost_micros
FROM geographic_view
WHERE segments.date DURING LAST_30_DAYS
ORDER BY metrics.clicks DESC
```

- **Other platforms:** `pull_<platform>_ads_performance` with a geographic breakdown where the platform supports it (Meta, LinkedIn, Reddit, TikTok via `tiktok_ads_get_insights`, X, Microsoft, Amazon).
- **Cross-check engagement:** `ga4_run_report` with a country dimension — high click volume from a geo with near-zero engaged sessions is a fraud symptom, not an audience.

Any meaningful spend outside the intended market is a finding even when the criteria look correct.

## 4. Apply fraud-symptom heuristics

Cheap clicks are a symptom to explain, not a win to report. Investigate when you see:

- CPCs far below the vertical's normal range (a rough tripwire: any geo where CPC runs under a third of the home-market CPC).
- CTR suspiciously uniform across unrelated ads.
- Click volume with near-zero engaged sessions or conversions in GA4.
- Traffic spikes at odd hours for the target market.

For campaigns serving developed-market B2B (US/CA/UK/AU/NZ), a common practice is proactively excluding known high-invalid-traffic geographies unless the business explicitly serves them. The standard is not any fixed exclusion list; it is "delivery matches the stated market."

## 5. Fix and re-verify

- Add explicit location criteria to any campaign missing them; switch Google and Microsoft campaigns to presence-only matching; add exclusions for geographies producing junk clicks. Apply changes through the platform or via `create_campaign_plan` / `execute_campaign_plan`, and confirm with a fresh criteria read afterward.
- Bake this into launches: **campaign-preflight** runs the same checks before a campaign goes live. Re-run this audit after any campaign creation or edit — including agent-built campaigns.
- Report per campaign: intended geo, configured geo (or NONE / UNVERIFIED), presence setting, % of clicks and spend outside intended geo over 30 days, and estimated wasted spend. Treat material out-of-geo spend as an urgent fix, not a suggestion.

## Campaign-type notes

- **PMax, Demand Gen, Display, Video:** highest junk-geo risk because inventory is cheap; the delivery-geography check is mandatory before judging their performance. A suspiciously cheap CPC on these types is presumed junk until geography proves otherwise.
- **Search:** presence-or-interest is the main leak even with correct country criteria.
- **Social:** check every ad set / ad group, not just the campaign shell.

## Rules

- The campaign name is never evidence of targeting. Read the criteria.
- Presence-only on Google and Microsoft unless the business has a stated reason otherwise.
- If you cannot read a platform's targeting, say UNVERIFIED — never imply it was checked.
- Never praise cheap CPCs before confirming where the clicks came from.
- If the intended market is unknown, ask. Never assume worldwide.
