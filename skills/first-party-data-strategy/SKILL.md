---
name: first-party-data-strategy
description: Build a post-cookie first-party data strategy — Enhanced Conversions, server-side tracking, Consent Mode v2, and activating owned data for targeting. Use when a user wants to recover lost conversion data, set up Enhanced Conversions or CAPI, implement consent mode, or plan for cookie deprecation.
---

# First-Party Data Strategy

Third-party cookies are gone; the accounts that keep measuring are the ones that collect, consent, and send their own data. Build that pipeline in order: audit, capture, consent, activate.

Confirm the workspace with `list_connected_accounts` and `get_connection_status`; read `get_pixel_health` for the available tracking diagnostics.

## 1. Audit what you collect today

Inventory every point where you capture an identifier: forms, signups, purchases, email lists, CRM records, in-app events. For each, note the identifier (email, phone, address), consent status, and freshness. Check what conversion data actually reaches the platforms: `ga4_get_conversions` and `ga4_get_report` for the site side, the supported performance tools (`pull_google_ads_performance`, `pull_meta_ads_performance`, `pull_linkedin_ads_performance`, `pull_microsoft_ads_performance`, `pull_reddit_ads_performance`) for what each platform claims. Big gaps between GA4 and platform numbers usually mean tracking loss, not attribution magic — see **conversion-tracking**.

## 2. Set up Enhanced Conversions and CAPI

Hashed first-party identifiers recover conversions that cookies alone miss.

- **Google Enhanced Conversions:** send SHA-256 hashed email/phone/address with the conversion tag. Normalize before hashing: lowercase, trim, E.164 phone format. Typical recovery is 5-15% more attributed conversions.
- **Meta Conversions API:** send server-side events with hashed identifiers plus `fbc`/`fbp` cookie values, and deduplicate against the browser pixel with a shared `event_id`. Typical recovery is 15-30%.
- LinkedIn, TikTok, and Reddit have equivalent server-side conversion APIs; the same hashing and dedup rules apply.

Inspect the available diagnostics with `get_pixel_health`. Have the account owner make tag, event-routing, and consent changes in the platform UI or tag manager, then verify with a test event. The plugin cannot publish tags.

## 3. Move tracking server-side

Client-only tags lose data to ad blockers and 7-day browser cookie caps. A server-side GTM container on a first-party subdomain (track.yourdomain.com) extends cookie lifespan to 1-2 years, enriches events before forwarding (LTV, customer segment), and sends once to every platform API. This is the single highest-leverage tracking improvement for a returning-visitor business.

## 4. Implement Consent Mode v2

Required for EEA traffic since March 2024. Two choices:

- **Basic:** tags do not fire without consent. Simple, but every unconsented user is invisible.
- **Advanced (recommended):** cookieless pings fire even when consent is denied and Google models the missing conversions, recovering roughly half to two-thirds of them.

Set default consent state to denied before the CMP loads, update on user choice, and gate the four ad parameters (`ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`). Verify consent signals in Google Ads diagnostics and GA4 admin after deploying.

## 5. Know your match rates

Uploaded lists only work as well as they match. Rough expectations: hashed email alone matches 40-60% on Google and 50-70% on Meta; adding phone pushes combined match to 55-80%. LinkedIn matches better on work email than personal. Improve matches by sending multiple identifiers per record and normalizing before hashing. If a synced list delivers to far fewer users than you uploaded, fix the data before blaming the platform.

## 6. Activate the data for targeting

Collected data earns its keep in audiences:

- Review available lists with `list_audiences`; the account owner handles synchronization and suppression updates in the platform UI.
- Define a seed from the best customers and hand off its construction to the platform UI; see **audience**.
- Always maintain suppression lists — existing customers and recent converters excluded from acquisition. Refresh at least weekly.
- Pass conversion value where you have it so value-based bidding has something to optimize toward (see **bid-optimization**).

## 7. Verify the pipeline end to end

After changes, compare site events with `ga4_get_report` and available platform performance results, then inspect attribution differences with `get_attribution`. Use `get_spend_reconciliation` for spend records separately. Mark unsupported event-level checks as unverified.

## Rules

- Never send unhashed PII to an ad platform. Hash client-side or server-side, always.
- Consent is not optional in regulated geographies; denied-by-default is the safe default state.
- Measure recovery: compare attributed conversions for 2-4 weeks before and after each change so you know what each fix earned.
- Suppression lists are part of the strategy, not an afterthought. Stale lists burn budget on people who already bought.
