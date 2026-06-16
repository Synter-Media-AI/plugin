---
name: campaign-preflight
description: Pre-launch checks for ad campaigns — geo targeting, exclusion lists, tracking setup, budget. Run before enabling paused campaigns.
synter:
  tools:
    - synter.query
    - synter.artifacts
  permissions:
    read: [campaigns, metrics, conversion_actions]
  approval: none
  outputs:
    - type: change_proposal
---

# Campaign Pre-Flight Checks

Ensures campaigns are properly configured before launch to prevent wasted ad spend and spam traffic.

## When to Use

- Before enabling any paused campaign
- After creating a new campaign
- When user asks to "review" or "check" campaign settings
- When user mentions geo targeting or exclusions

## Pre-Flight Checklist

### 0. Campaign Structure Validation (CRITICAL)

**Run structural validation FIRST before any other checks.** This ensures the campaign has all required components to actually serve ads.

#### Platform-Specific Validators

| Platform | Script | Checks |
|----------|--------|--------|
| Google | `google_ads_validate_campaign_structure` | Ad groups, ads, keywords (Search), budget, conversion tracking |
| Meta | `meta_ads_validate_campaign_structure` | Ad sets, ads, targeting, budget, pixel |
| LinkedIn | `linkedin_ads_validate_campaign_structure` | Creatives, approval status, targeting, budget, insight tag |
| Reddit | `reddit_ads_validate_campaign_structure` | Ad groups, ads, targeting, budget, pixel |
| Microsoft | `microsoft_ads_validate_campaign_structure` | Ad groups, ads, keywords (Search), budget, UET tag |
| TikTok | `tiktok_ads_validate_campaign_structure` | Ad groups, ads, targeting, budget, pixel |
| X | `x_ads_validate_campaign_structure` | Line items, promoted tweets, targeting, budget, funding |

#### Run Structure Validation
```bash
POST /tools/run
{
  "script_name": "google_ads_validate_campaign_structure",
  "platform": "GOOGLE",
  "args": ["--campaign-id", "customers/123/campaigns/456"],
  "user_id": <USER_ID>
}
```

#### Output
```json
{
  "success": true,
  "is_complete": true,
  "checks": [
    {"name": "has_ad_groups", "passed": true, "level": "error", "message": "Campaign has 2 ad groups"},
    {"name": "ad_groups_have_ads", "passed": true, "level": "error", "message": "All ad groups have enabled ads"},
    {"name": "has_keywords", "passed": true, "level": "error", "message": "Campaign has 15 keywords"},
    {"name": "budget_configured", "passed": true, "level": "error", "message": "Budget: $50.00/day"},
    {"name": "conversion_tracking", "passed": true, "level": "warning", "message": "Account has 3 conversion actions"}
  ]
}
```

**BLOCKING:** If `is_complete: false`, DO NOT enable the campaign. Fix missing components first.

### 1. UTM Tracking Verification (ALL PLATFORMS — MANDATORY)

**EVERY ad must have UTM parameters before launch.** Without UTMs, you cannot attribute traffic in GA4, HubSpot, or any analytics tool.

#### Standard UTM Format (All Platforms)
| Parameter | Value |
|-----------|-------|
| `utm_source` | Platform name: `google`, `meta`, `linkedin`, `reddit`, `microsoft`, `tiktok`, `x` |
| `utm_medium` | `cpc` (search), `paid-social` (social), `display` (display), `video` (video) |
| `utm_campaign` | Campaign name (slugified, lowercase, hyphens) |
| `utm_content` | Ad group/ad set name (slugified) |
| `utm_term` | Keyword or ad variant name (optional) |

#### Platform-Specific UTM Checks

| Platform | Where UTMs Live | How to Verify | Fix Script |
|----------|----------------|---------------|------------|
| **Google Ads** | Final URL suffix or tracking template | `run_gaql` query for `ad_group_ad.ad.final_urls` | `google_ads_set_url_suffix` |
| **Meta** | Ad `url_tags` or URL parameters on creative link | `meta_ads_get_insights` — check ad URLs | `meta_ads_update_adset` |
| **LinkedIn** | Creative click-through URL | `linkedin_ads_list_campaigns` — inspect creative URLs | Manual update in creative |
| **Reddit** | `click_url` on ad or `destination_url` on post | `reddit_ads_fix_utms --dry-run` | `reddit_ads_fix_utms` |
| **Microsoft** | Final URL suffix or tracking template | Campaign export | `microsoft_ads_update_campaign` |
| **TikTok** | Landing page URL on ad | `tiktok_ads_list_ads` — check URLs | Update via ad creation |
| **X** | Website card URL | `x_ads_get_analytics` — check card URLs | Update card URL |

#### Reddit-Specific UTM Issue
**TEXT posts cannot have `click_url`.** If you find TEXT-type ads without UTMs:
1. Create new IMAGE posts with UTM-tagged `destination_url`
2. Create new ads from those posts with UTM `click_url`
3. Use `reddit_ads_fix_utms` to batch-fix

#### Quick UTM Audit (Reddit)
```json
{
  "script_name": "reddit_ads_fix_utms",
  "platform": "REDDIT",
  "args": ["--account-id", "a2_xxx", "--profile-id", "t2_xxx", "--dry-run"]
}
```
Look for `WOULD_CREATE_POST_AND_AD` (TEXT posts needing replacement) and `WOULD_CREATE_AD` (IMAGE posts needing UTM ads).

### 1b. Conversion Tracking Verification (ALL PLATFORMS — MANDATORY)

**Without conversion tracking, campaigns cannot optimize for business outcomes.** Always verify before launch.

#### Platform Tracking Requirements

| Platform | Tracking Pixel/Tag | Verification Script | Required For |
|----------|-------------------|--------------------|--------------| 
| **Google** | Google Tag (gtag.js) or GTM | `verify_website_tracking`, `google_ads_list_conversions` | Smart Bidding, Maximize Conversions |
| **Meta** | Meta Pixel | `verify_website_tracking`, `meta_ads_manage_pixel` | OUTCOME_SALES, Conversion optimization |
| **LinkedIn** | LinkedIn Insight Tag | `verify_website_tracking`, `gtm_list_tags` | Conversion tracking, website demographics |
| **Reddit** | Reddit Pixel | `verify_website_tracking`, `reddit_ads_manage_pixel --list` | CONVERSIONS objective |
| **Microsoft** | UET Tag | `verify_website_tracking` | Conversion goals |
| **TikTok** | TikTok Pixel | `verify_website_tracking` | Conversion optimization |
| **X** | X Pixel (Web Tag) | `x_ads_manage_web_tag` | Conversion tracking |

#### Quick Tracking Audit
```json
{
  "script_name": "verify_website_tracking",
  "platform": "REDDIT",
  "args": ["--url", "https://example.com"]
}
```

This checks for ALL platform pixels on the target URL. Flag any missing ones.

#### What to Do If Tracking Is Missing

1. **No pixel at all:** Help user install via GTM or direct code injection
2. **Pixel exists but no conversion events:** Help create conversion actions
3. **GTM not published:** Use `gtm_publish` to publish pending changes
4. **Server-side tracking (CAPI) not configured:** Set up for better attribution
5. **Recommend bidding strategy:** Start with `maximize_clicks` / `target_spend` until conversions are verified (15-30 conversions minimum for smart bidding)

#### GA4 + HubSpot Attribution Check
If the client uses GA4 or HubSpot, verify UTM parameters are flowing through:
- GA4: Check `Traffic acquisition` report for `reddit` / `paid-social` source/medium
- HubSpot: Check contact attribution report for UTM source values

### 2. Geo Targeting Verification

**CRITICAL:** Campaigns without geo targeting will show to ALL countries including spam countries.

#### Check Current Geo Targeting
```bash
POST /tools/run
{
  "script_name": "google_ads_export_campaigns",
  "platform": "GOOGLE",
  "args": ["--campaign-filter", "<CAMPAIGN_NAME>"],
  "user_id": <USER_ID>
}
```

Look for "Geo Targets: Not set" - this is a red flag.

#### Tier Definitions

**Tier 1 (High-value markets):**
- United States, United Kingdom, Canada, Australia, New Zealand
- Germany, France, Netherlands, Switzerland
- Norway, Sweden, Denmark, Finland
- Austria, Belgium, Ireland
- Japan, Singapore

**Tier 2 (Good secondary markets):**
- Spain, Italy, Portugal
- Poland, Czech Republic
- Israel, UAE, Saudi Arabia
- South Korea, Taiwan, Hong Kong
- Brazil, Mexico, South Africa

**Spam Countries (AVOID):**
- India, Pakistan, Bangladesh
- Russia, Ukraine
- China (unless specifically targeting)

#### Fix Missing Geo Targeting
```bash
POST /tools/run
{
  "script_name": "google_ads_set_campaign_geo_targets",
  "platform": "GOOGLE",
  "args": ["--campaign-ids", "<CAMPAIGN_IDS>", "--tier", "1,2"],
  "user_id": <USER_ID>
}
```

**Note:** Demand Gen campaigns require ad group-level targeting. The script handles this automatically.

### 3. Budget Sanity Check

Review daily budgets:
- **Minimum recommended:** $25/day for Search, $50/day for Demand Gen
- **Maximum CPC:** Should be set for manual bidding strategies
- **Conversion-based bidding:** Requires 15+ conversions in last 30 days

### 4. Negative Keyword Lists (Search Campaigns)

Check for common negative keywords:
- Brand misspellings to avoid
- Irrelevant industry terms
- Competitor brands (if not conquesting)
- "free", "cheap" (if selling premium)

### 5. Ad Schedule

Verify ads run during business hours if B2B:
- US: 6am-8pm PT / 9am-11pm ET
- EMEA: 7am-7pm CET
- APAC: 8am-8pm local

## Campaign Type Specific Checks

### Demand Gen (YouTube/Discover)

1. **Video requirements:**
   - YouTube video must be public or unlisted
   - Minimum 10 seconds for in-stream
   - 6-15 seconds for bumper ads

2. **Location targeting at ad group level** (not campaign level)

3. **Audience targeting:**
   - Custom intent keywords recommended
   - Remarketing audiences for better performance

### Search Campaigns

1. **Keyword match types:**
   - Broad match requires Smart Bidding
   - Phrase/Exact for manual CPC

2. **Ad extensions:**
   - Sitelinks (minimum 4)
   - Callouts (minimum 4)
   - Structured snippets

### Display Campaigns

1. **Image assets:**
   - Landscape (1200x628)
   - Square (1200x1200)
   - Logo (1200x1200)

2. **Placement exclusions:**
   - Exclude mobile apps if not relevant
   - Exclude parked domains

## Quick Pre-Flight Summary

When reviewing campaigns, output a summary like:

```
## Campaign Pre-Flight Report

| Check | Status | Notes |
|-------|--------|-------|
| Campaign Structure | ✅/⚠️/❌ | Complete / Missing components |
| UTM Tracking | ✅/⚠️/❌ | All ads tagged / X ads missing UTMs |
| Conversion Tracking | ✅/⚠️/❌ | Pixel installed + events firing / Missing |
| Geo Targeting | ✅/⚠️/❌ | Tier 1+2 / Not set |
| Budget | ✅/⚠️ | $X/day |
| Ad Schedule | ✅/⚠️ | 24/7 / Business hours |
| Negative Keywords | ✅/⚠️ | X keywords / None |

**Recommendation:** [Enable/Fix issues first]
```

**BLOCKING checks (must fix before launch):**
- ❌ Campaign Structure incomplete
- ❌ UTM tracking missing on any ads
- ❌ Conversion tracking not installed (for conversion-optimized campaigns)
- ❌ Geo targeting not set

**Warning checks (recommended but not blocking):**
- ⚠️ No negative keywords
- ⚠️ Budget below platform minimum
- ⚠️ No ad schedule (24/7 running)

## Automation Workflow

For bulk campaign review:

1. Export all campaigns with geo targeting info
2. Flag campaigns with issues
3. Offer to fix automatically
4. Re-verify after fixes
