---
name: ad-copy-generation
description: Write ad copy that fits the platform and passes policy — Google RSA headlines and descriptions, social primary text and hooks, and variations for testing. Use when a user needs ad copy, headlines, descriptions, RSA assets, or fresh variants for underperforming ads.
---

# Ad Copy Generation

Write copy that matches the platform's format, the searcher's intent, and the brand's voice. This is a creation task; it does not spend money.

Apply brand voice from `${CLAUDE_PLUGIN_ROOT}/context/brand-and-safety.md` to everything you write.

## Fit the format

- **Search (Google, Microsoft) RSAs:** up to 15 headlines and 4 descriptions. Vary them so the platform can assemble strong combinations; pin only when a legal or brand line must always show. Lead with the keyword intent and the offer.
- **Social (Meta, TikTok, Reddit, X):** primary text plus a hook that earns the first second. Match the platform's native tone; a LinkedIn line is not a TikTok line.
- **LinkedIn:** professional, outcome-led, decision-maker framing.

## Write for intent

- Speak to what the user wants at that moment, not what the product is.
- One idea per line. Concrete over abstract; real numbers over adjectives.
- Include a clear next step using an approved CTA.

## Generate and vary

Use `generate_text_ad` for volume, then edit for voice and accuracy. Produce enough distinct variants to test one variable at a time (see **creative-testing**). Never fabricate a price, claim, or statistic; if the real number is unknown, leave it out.

## Check before it ships

Run every variant through the **ad-policy-compliance** thinking and the brand forbidden-word list. Confirm claims are true and the final URL matches the promise.

## Rules

- On brand and on policy, every line. No forbidden words, no invented claims.
- RSAs get varied, unpinned assets unless a line must always appear.
- Report the variants and the one variable each set is built to test.
