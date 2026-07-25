---
name: pixel-capi-auditor
description: Audit client-side pixels and server-side Conversions API implementations across Meta, Google, TikTok, LinkedIn, Reddit, and Microsoft — setup, Event Match Quality, deduplication, and click-ID capture. Use when conversion counts disagree between platforms, EMQ or match rates are low, or tracking needs verification before scaling spend.
---

# Pixel & CAPI Auditor

Bad tracking corrupts every downstream decision, so audit it before optimizing anything. The audit is the same on every platform: is the pixel firing, is the server event arriving, are the two deduplicated, and is enough matched user data attached.

Confirm the account: `list_connected_accounts` and `get_connection_status`. Inspect what is actually deployed with `list_gtm_tags` and `get_gtm_tag`; see what tech the site runs with `builtwith_domain_lookup`.

## 1. Verify the client side

Per platform, confirm the base tag is present and fires on every page, standard events fire on the actions that matter (Purchase, Lead, AddToCart), and the platform click ID is captured from the landing URL into a first-party cookie:

| Platform | Click ID param | Tag marker |
|---|---|---|
| Meta | `fbclid` (`_fbc`/`_fbp` cookies) | `fbq('init', ...)` |
| Google | `gclid` | Google tag + Conversion Linker |
| TikTok | `ttclid` | `ttq.load(...)` |
| LinkedIn | `li_fat_id` | Insight Tag partner ID |
| Reddit | `rdt_cid` (`_rdt_uuid`) | `rdt('init', ...)` |
| Microsoft | `msclkid` | UET tag, auto-tagging on |

Confirm pixel ownership with `verify_pixel_ownership`. Fix tag gaps directly: `update_gtm_tag_html`, then `publish_gtm_container`.

## 2. Verify the server side

Check each platform's events manager diagnostics for arriving server events. Route server-side conversion data with `configure_pixel_destination` and confirm the wiring with `get_pixel_destinations`. Google's server path is Enhanced Conversions (hashed user data on the conversion, plus Consent Mode v2 defaults for EEA/UK traffic); Microsoft's is offline conversion upload keyed on `msclkid`.

## 3. Audit deduplication

When pixel and CAPI both send an event, the platform deduplicates on a shared event ID (`event_id` on Meta/TikTok, `eventId` on LinkedIn, `conversion_id` on Reddit, `order_id`/`transaction_id` on Google). The rule: generate one ID server-side at conversion time (use the transaction ID) and pass the identical string to both the browser tag and the server event.

Failure signatures:

- Conversions roughly double the true count: event ID missing on one side.
- Counts too low: IDs present but formatted differently on each side, or event names mismatched.
- Platform reports far more conversions than GA4 shows (`ga4_run_report` on the conversion event): dedup broken — this is the most common finding.

## 4. Raise match quality

Match quality (Meta EMQ 0-10; TikTok match rate) decides how many conversions attribute at all. Send, in order of impact: hashed email (SHA-256 of lowercased, trimmed value), the platform click ID, hashed phone, browser cookie IDs, external ID, then client IP and user agent. Meta EMQ of 6+ is healthy; below 5 you are losing a meaningful share of attribution and the platform is optimizing on thin data. Adding hashed email and click ID alone typically moves EMQ several points.

## 5. Reconcile across platforms

Sum of per-platform reported conversions always exceeds reality because each platform claims its own touch. Compare platform claims against GA4 and each other with `reconcile_platforms`, and read multi-touch credit with `get_attribution` (deeper treatment in **attribution**). Use GA4 (`ga4_list_conversions`, `ga4_run_report`) as the neutral yardstick when judging whether a platform's count is inflated.

## 6. Report and fix in priority order

Produce a per-platform grid: pixel present, CAPI live, dedup verified, match quality score, action needed. Fix in the order that recovers the most spend: broken dedup on the biggest platform first, then missing CAPI, then match-quality parameters, then the long tail. Re-verify with a test conversion after each fix, and set `set_spend_alert` on any account that was double-counting so budget decisions pause until numbers are trusted. Baseline event coverage setup belongs to **conversion-tracking**; this skill is the audit layer on top.

## Rules

- Never audit from code alone — confirm events actually arrive in each platform's diagnostics.
- One event ID, generated server-side, shared verbatim by pixel and CAPI. No exceptions.
- Hash PII (lowercase, trim, SHA-256) before it leaves the server; send user IP and user agent from the client, never the server's.
- Report discrepancies as percentages against GA4, and state which number you consider canonical.
