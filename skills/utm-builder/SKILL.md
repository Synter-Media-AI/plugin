---
name: utm-builder
description: Build, append, and audit UTM-tagged URLs using Synter's canonical taxonomy. Cross-platform attribution consistency.
synter:
  tools:
    - synter.query
    - synter.artifacts
  permissions:
    read: [campaigns]
  approval: none
  outputs:
    - type: text
    - type: change_proposal
---

# UTM Builder Skill

Generate, append, and validate UTM-tagged URLs using Synter's canonical taxonomy. All campaigns managed by Synter must use these exact values — consistency is what makes attribution work end-to-end through the Synter pixel → Attio CRM pipeline.

---

## Canonical UTM Taxonomy

### utm_source — where the click came from

| Platform | utm_source |
|----------|-----------|
| Google Ads | `google` |
| Meta (Facebook feed, Stories, Reels) | `facebook` |
| Meta (Instagram feed, Stories, Reels) | `instagram` |
| LinkedIn Ads | `linkedin` |
| Reddit Ads | `reddit` |
| TikTok Ads | `tiktok` |
| X Ads | `x` |
| Microsoft Ads | `microsoft` |
| Email (generic) | `email` |
| Organic social | `organic_[platform]` (e.g. `organic_linkedin`) |

### utm_medium — the marketing channel type

| Campaign type | utm_medium |
|--------------|-----------|
| Paid search (Search, PMax) | `cpc` |
| Paid social (all social platforms) | `paid-social` |
| Display / banner | `display` |
| Video (YouTube, TikTok, Reels) | `video` |
| Email | `email` |
| Organic | `organic` |
| Referral | `referral` |

**Note:** Use hyphens, not underscores. `paid-social` not `paid_social`.

### utm_campaign — campaign identifier

Format: `{descriptor}_{date_or_quarter}` — all lowercase, underscores for spaces.

Examples:
- `synter_trial_q2_2026`
- `compute_exchange_leads_apr2026`
- `blackfriday_promo_2025`

When the platform provides a dynamic macro for campaign name, use it (see ValueTrack section below). This ensures the UTM matches what's actually in the ad platform.

### utm_content — creative or ad variant identifier

Used to differentiate A/B variants or ad formats. Optional but recommended for creative testing.

Examples: `headline_a`, `video_30s`, `carousel_v2`, `rsa_broad`

### utm_term — keyword (paid search only)

For Search campaigns, use the platform's dynamic keyword insertion macro so the actual search term is captured. Do not hardcode keywords.

---

## Platform ValueTrack Macros

For Google Ads, always use dynamic macros rather than hardcoded values so attribution survives campaign renames and keyword additions. Do NOT URL-encode these — they are resolved by Google at click time.

| Parameter | Macro | What it captures |
|-----------|-------|-----------------|
| utm_campaign | `{campaignname}` | Campaign name as set in Google Ads |
| utm_content | `{adgroupname}` | Ad group name |
| utm_term | `{keyword}` | Matched keyword |

**Standard Google Ads final URL suffix:**
```
utm_source=google&utm_medium=cpc&utm_campaign={campaignname}&utm_content={adgroupname}&utm_term={keyword}
```

For Meta, LinkedIn, TikTok, Reddit, X: use static values at campaign creation. The platform does not resolve macros the same way Google does — hardcode the campaign name.

---

## Building a UTM URL

### Single URL

When asked to build a UTM URL for a specific destination and platform:

1. Start with the clean destination URL (no existing UTMs)
2. Append `?` if no query string exists, or `&` if one already exists
3. Apply the canonical values for that platform
4. For Google Search/PMax, use ValueTrack macros for campaign/content/term

**Example — Google Search campaign to syntermedia.ai/signup:**
```
https://syntermedia.ai/signup?utm_source=google&utm_medium=cpc&utm_campaign={campaignname}&utm_content={adgroupname}&utm_term={keyword}
```

**Example — Meta paid social campaign:**
```
https://syntermedia.ai/signup?utm_source=facebook&utm_medium=paid-social&utm_campaign=synter_trial_q2_2026&utm_content=carousel_v1
```

### Appending UTMs to an existing URL

If the URL already has query parameters, append UTMs with `&`. Never duplicate an existing UTM key — replace it.

```python
from urllib.parse import urlencode, urlparse, urlunparse, parse_qs

def append_utms(base_url: str, utms: dict) -> str:
    parsed = urlparse(base_url if base_url.startswith('http') else f'https://{base_url}')
    params = parse_qs(parsed.query, keep_blank_values=True)
    for key, value in utms.items():
        params[key] = [value]
    query = urlencode({k: v[0] for k, v in params.items()})
    return urlunparse(parsed._replace(query=query))
```

### Bulk generation for multi-platform campaigns

When launching the same campaign across multiple platforms:

```python
PLATFORM_DEFAULTS = {
    "google":    {"utm_source": "google",    "utm_medium": "cpc",        "utm_campaign": "{campaignname}", "utm_content": "{adgroupname}", "utm_term": "{keyword}"},
    "facebook":  {"utm_source": "facebook",  "utm_medium": "paid-social"},
    "instagram": {"utm_source": "instagram", "utm_medium": "paid-social"},
    "linkedin":  {"utm_source": "linkedin",  "utm_medium": "paid-social"},
    "reddit":    {"utm_source": "reddit",    "utm_medium": "paid-social"},
    "tiktok":    {"utm_source": "tiktok",    "utm_medium": "video"},
    "x":         {"utm_source": "x",         "utm_medium": "paid-social"},
    "microsoft": {"utm_source": "microsoft", "utm_medium": "cpc"},
}
```

---

## Validation Rules

Before finalizing any URL:

- All values must be **lowercase** (except Google ValueTrack macros which are `{camelCase}`)
- Use **hyphens** for multi-word mediums (`paid-social`, not `paid_social`)
- Use **underscores** for campaign names (`synter_trial_q2`, not `synter-trial-q2`)
- `utm_source` and `utm_medium` are **required** on every URL
- `utm_campaign` is required for all paid campaigns
- Never URL-encode ValueTrack macros — Google resolves them raw

---

## CRITICAL: Internal CTAs Must NEVER Set UTMs

**Any link within syntermedia.ai or a customer's website that navigates to another page on the SAME site must NOT include UTM parameters.** UTMs are for tracking traffic from EXTERNAL sources. Internal CTAs overwrite the real attribution stored in cookies by the middleware.

### ❌ NEVER do this
```html
<!-- Pricing page CTA — WRONG, overwrites real source -->
<a href="/get-started?utm_source=pricing&utm_medium=cta">Start Free</a>

<!-- Landing page CTA — WRONG, "lp" is not a real source -->
<a href="/get-started?utm_source=lp&utm_medium=skills">Start Free</a>

<!-- Blog post CTA — WRONG, "blog" is not an ad platform -->
<a href="/subscribe?utm_source=blog&utm_medium=strategist-post">Upgrade</a>
```

### ✅ Do this instead
```html
<!-- Clean internal links — middleware cookies preserve the real source -->
<a href="/get-started">Start Free</a>
<a href="/subscribe?plan=starter&billing=yearly">Upgrade</a>
<a href="https://cal.com/joel-synter/demo">Book a Demo</a>
```

**Why:** When a user arrives from Google Ads (`utm_source=google`), the middleware captures that into a cookie. If they then click a CTA with `utm_source=pricing`, the cookie is overwritten and attribution is lost. The CRM (Attio) will show "pricing" as the source instead of "google".

**The rule:** `utm_source` must ALWAYS be an external traffic source from the canonical taxonomy table above (google, facebook, linkedin, reddit, tiktok, x, microsoft, email). Page names, UI elements, and content types are NEVER valid sources.

---

## Google Ads: final_url_suffix vs tracking_url_template

**Always use `final_url_suffix` as the canonical UTM source. Never use `tracking_url_template` for UTMs.**

| Method | Use for UTMs? | Why |
|--------|--------------|-----|
| `final_url_suffix` | ✅ YES | Clean, appended to final URL, no duplicates |
| `tracking_url_template` | ❌ NO | Legacy (HubSpot-era), causes duplicate params, wrong medium values |

### Standard account-level final_url_suffix
```
utm_source=google&utm_medium=cpc&utm_campaign={campaignname}&utm_content={adgroupname}&utm_term={keyword}
```

### Clearing legacy tracking templates
If a customer account has `tracking_url_template` set (often from HubSpot migration), it will conflict with `final_url_suffix` and cause:
- Duplicate `utm_term` parameters
- Wrong `utm_medium=ppc` instead of `cpc`
- HubSpot `hsa_*` noise params

**Fix with:**
```bash
python google_ads_set_url_suffix.py --clear-tracking-template       # live
python google_ads_set_url_suffix.py --clear-tracking-template --dry-run  # preview
```

This sets `tracking_url_template` to `{lpurl}` (no-op passthrough) on the account and all campaigns, letting `final_url_suffix` be the sole UTM source.

### Full audit workflow
```bash
# 1. Audit current state
python google_ads_set_url_suffix.py --audit

# 2. If tracking templates exist, clear them
python google_ads_set_url_suffix.py --clear-tracking-template

# 3. If final_url_suffix is missing or wrong, set it
python google_ads_set_url_suffix.py --account-level \
  --suffix "utm_source=google&utm_medium=cpc&utm_campaign={campaignname}&utm_content={adgroupname}&utm_term={keyword}"

# 4. Re-audit to confirm
python google_ads_set_url_suffix.py --audit
```

---

## How UTMs flow through Synter

1. **Ad click** → browser lands on customer's URL with UTMs in query string (from `final_url_suffix` or hardcoded in ad)
2. **Synter pixel** (`synter-pixel.js`, installed via GTM on customer's site) captures UTMs from URL, stores in cookies (90-day expiry)
3. **Middleware** on syntermedia.ai also captures UTMs into httpOnly cookies for Synter's own signup flow
4. On any `Lead` / `Submit` / `CompleteRegistration` event, pixel fires to `/api/pixel/events` with UTM context
5. `/api/pixel/events` calls `syncConversionToAttio` → UTMs land on the Attio person record as `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`
6. For **customer-connected Attio workspaces**, UTM attributes are auto-provisioned on the customer's schema if they don't exist

For Meta Lead Gen Forms and Google Lead Form Assets (in-ad forms), UTMs are injected server-side by Synter at the time leads are received — no pixel needed.

### Pipeline verification checklist
| Check | How to verify |
|-------|--------------|
| Pixel installed on customer site | `curl -s https://customer.com \| grep synter-pixel` or check GTM container |
| UTMs in final_url_suffix | `python google_ads_set_url_suffix.py --audit` |
| Pixel events flowing | Query `pixel_events` table by `pixel_id` |
| Lead events (not just PageViews) | Check `event_name = 'Lead'` in pixel_events |
| Attio connection active | Check `platform_connections` for `platform = 'ATTIO'` |
| UTMs in customer Attio | Query Attio API via customer's OAuth token |

---

## When to use this skill

- User asks to "add UTMs", "build a tracking link", or "set up attribution"
- Creating destination URLs for any new campaign
- Auditing existing campaign URLs for missing or inconsistent UTMs
- User asks why GA4 / Attio isn't showing the right source
- Before launching any campaign via the campaign preflight checklist
- Reviewing or fixing internal CTA links that incorrectly set UTM params
- Onboarding a new customer's Google Ads account with proper UTM setup
- Cleaning up HubSpot-era tracking templates on customer accounts
