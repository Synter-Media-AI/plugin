---
name: pixel-capi-auditor
description: Audit client-side pixels and server-side Conversions API implementations across Meta, Google, TikTok, LinkedIn, Reddit, and Microsoft — setup, Event Match Quality, deduplication, and click-ID capture. Use when conversion counts disagree between platforms, EMQ or match rates are low, or tracking needs verification before scaling spend.
---

# Pixel & CAPI Auditor

Bad tracking corrupts every downstream decision, so audit it before optimizing anything. The audit is the same on every platform: is the pixel firing, is the server event arriving, are the two deduplicated, and is enough matched user data attached.

Confirm the account with `list_connected_accounts` and `get_connection_status`. Inspect `get_pixel_health`; obtain platform diagnostics or tag-manager exports for missing implementation details.

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

Verify ownership and event delivery in the platform UI when not evidenced by `get_pixel_health`. Have the account owner fix tags and publish through their tag manager, then repeat the test.

## 2. Verify the server side

Check server-event arrivals and routing in each platform’s diagnostics alongside `get_pixel_health`. The account owner must apply routing changes in the platform UI; this plugin does not configure destinations.

## 3. Audit deduplication

When pixel and CAPI both send an event, the platform deduplicates on a shared event ID (`event_id` on Meta/TikTok, `eventId` on LinkedIn, `conversion_id` on Reddit, `order_id`/`transaction_id` on Google). The rule: generate one ID server-side at conversion time (use the transaction ID) and pass the identical string to both the browser tag and the server event.

Failure signatures:

- Conversions roughly double the true count: event ID missing on one side.
- Counts too low: IDs present but formatted differently on each side, or event names mismatched.
- Platform reports far more conversions than GA4 shows (`ga4_get_report` on the conversion event): dedup broken — this is the most common finding.

## 4. Raise match quality

Match quality (Meta EMQ 0-10; TikTok match rate) decides how many conversions attribute at all. Send, in order of impact: hashed email (SHA-256 of lowercased, trimmed value), the platform click ID, hashed phone, browser cookie IDs, external ID, then client IP and user agent. Meta EMQ of 6+ is healthy; below 5 you are losing a meaningful share of attribution and the platform is optimizing on thin data. Adding hashed email and click ID alone typically moves EMQ several points.

## 5. Reconcile across platforms

Platforms can claim overlapping conversions. Compare platform results with `ga4_get_report` and inspect attribution with `get_attribution`, using consistent periods and stated attribution windows. Use `get_spend_reconciliation` for spend discrepancies; it does not establish conversion deduplication.

## 6. Report and fix in priority order

Produce a per-platform grid: pixel present, server events observed, dedup verified, match quality, and action needed. Mark unavailable evidence as unverified. Prioritize broken dedup and missing events on high-spend accounts; ask the owner to fix the implementation and repeat a test conversion before scaling. See **conversion-tracking**.

## Rules

- Never audit from code alone — confirm events actually arrive in each platform's diagnostics.
- One event ID, generated server-side, shared verbatim by pixel and CAPI. No exceptions.
- Hash PII (lowercase, trim, SHA-256) before it leaves the server; send user IP and user agent from the client, never the server's.
- Report discrepancies as percentages against GA4, and state which number you consider canonical.
