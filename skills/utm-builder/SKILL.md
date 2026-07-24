---
name: utm-builder
description: Build consistent, correctly structured UTM parameters for ad URLs so traffic shows up cleanly in analytics. Use when a user needs UTM tags, tracking URLs, campaign links, or their analytics source/medium data is a mess.
---

# UTM Builder

Clean UTMs are why analytics can tell platforms apart. Inconsistent tags turn reports into guesswork. This is a build-the-links task; it does not spend money.

## The five parameters

- **utm_source** the platform (google, microsoft, meta, linkedin, tiktok, reddit, x, amazon).
- **utm_medium** the type (cpc, paid_social, display, video).
- **utm_campaign** the campaign, in the account's naming grammar.
- **utm_term** the keyword or audience (search or targeting).
- **utm_content** the ad or creative variant, for A/B reads.

## Rules that keep data clean

- One convention, applied everywhere. Lowercase, no spaces, hyphens or underscores, never both by accident.
- Same value for the same thing every time; "facebook" and "fb" split one source into two rows.
- Match utm_campaign to the real campaign name so ad-platform data and analytics reconcile.
- Never put PII or secrets in a UTM; the URL is public.

## Wire it up

Apply the convention across the campaign's final URLs, and confirm the parameters survive to the landing page (redirects sometimes strip them). Check they resolve in analytics with `ga4_run_report` (source/medium) after traffic starts. Consistent UTMs make the **attribution** and **report** skills far more accurate.

## Rules

- Enforce one naming convention across every platform; consistency beats cleverness.
- Verify the tagged URL resolves and the parameters arrive intact before launch.
- Report the convention used so the next campaign matches it.
