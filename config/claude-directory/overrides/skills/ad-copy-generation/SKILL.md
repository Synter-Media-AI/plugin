---
name: ad-copy-generation
description: Write ad copy that fits the platform and passes policy — Google RSA headlines and descriptions, social primary text and hooks, and variations for testing. Use when a user needs ad copy, headlines, descriptions, RSA assets, or fresh variants for underperforming ads.
---

# Ad Copy Generation

Write copy that matches the platform's format, the searcher's intent, and the brand's voice. This is a creation task; it does not spend money.

Apply brand voice from `../../context/brand-and-safety.md` to everything you write.

## Fit the format

- **Search (Google, Microsoft) RSAs:** meet the platform’s required counts and character limits. Prefer fewer concise, distinct headlines that match search intent, state the offer, and deliberately qualify the intended audience. Use the ad group’s actual keywords where they read naturally. Never pad to 15 headlines or impose an arbitrary 11-headline floor. Ad Strength is not a launch gate or a reason to add filler. Pin only when a legal or brand line must always appear. Rewrite strong lines to fit instead of truncating them.
- **Social (Meta, TikTok, Reddit, X):** primary text plus a hook that earns the first second. Match the platform's native tone; a LinkedIn line is not a TikTok line.
- **LinkedIn:** professional, outcome-led, decision-maker framing.

## Write for intent

- Speak to what the user wants at that moment, not what the product is.
- One idea per line. Concrete over abstract; real numbers over adjectives.
- Include a clear next step using an approved CTA.

## Generate and vary

Use `create_ad_copy` for volume, then edit for voice and accuracy. Produce enough distinct variants to test one variable at a time (see **creative-testing**). Never fabricate a price, claim, or statistic; if the real number is unknown, leave it out.

## Check before it ships

Run every variant through the **ad-policy-compliance** thinking and the brand forbidden-word list. Confirm claims are true and the final URL matches the promise.

## Rules

- On brand and on policy, every line. No forbidden words, no invented claims.
- RSA assets must be relevant, accurate, and within platform limits. Use intentional disqualification where it fits the advertiser’s audience; do not fill optional slots just to increase a score. No filler or truncation.
- RSAs get varied, unpinned assets unless a line must always appear.
- Report the variants and the one variable each set is built to test.
