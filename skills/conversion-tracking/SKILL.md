---
name: conversion-tracking
description: Verify and fix conversion tracking before spend goes live — pixels, Conversions API, GA4 conversions, GTM tags, and that the right action is attached to the campaign. Use when a user sets up tracking, suspects conversions are not recording, or before launching or scaling anything.
---

# Conversion Tracking

Tracking is the difference between optimization and guessing. No campaign should scale on blind spend. Reads are free; changing tags is a change, so confirm before shipping.

Confirm the account: `list_connected_accounts`.

## 1. Confirm what exists

- `ga4_list_conversions` to see the GA4 conversion events and which are marked as conversions.
- `get_gtm_tag` / `list_gtm_tags` / `list_gtm_containers` to see the tags in place.
- `verify_pixel_ownership` and `get_pixel_destinations` to confirm the pixel is owned and where it sends data.

## 2. Confirm it is attached and firing

A conversion action that exists but is not attached to the campaign, or not firing, is worse than none because it looks fine. Confirm the campaign optimizes toward the right action, and that the action actually records on the real conversion event, not a pageview standing in for a purchase.

## 3. Fix gaps before launch

- Missing GA4 conversion → set it up (connect GA4 at syntermedia.ai/settings/credentials, free and instant).
- Missing or misfiring tag → `get_gtm_tag` / `update_gtm_tag_html` and `publish_gtm_container` on approval.
- Pixel and CAPI both matter on Meta; server-side improves match quality and resilience. Configure destinations with `configure_pixel_destination`.

## 4. Re-verify

After any change, re-run the checks and confirm a real conversion records end to end before trusting it.

## Rules

- No scaling on unverified tracking. Blind spend is worse than no spend.
- Prove the specific conversion action is attached and firing, do not assume from its presence.
- Report exactly what is tracked, what is attached, and any gap you fixed. Measurement pairs with the **attribution** skill.
