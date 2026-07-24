---
name: creative-testing
description: Structure and read creative A/B tests across platforms — set up variants, decide when a result is real, and pick winners without fooling yourself on noise. Use when a user wants to test ads, compare creative variants, run an A/B test, or choose a winning ad.
---

# Creative Testing

Test to learn, then scale the winner. Most "winners" called early are noise. Reads are free; launching variants spends money, so confirm before shipping.

Confirm the account: `list_connected_accounts`.

## 1. Test one thing at a time

Change one variable per test (hook, image, headline, offer, format) so the result is attributable. Testing five things at once tells you nothing about which one moved the number.

## 2. Set it up cleanly

Build variants with the **creative** skill or `generate_image_ad` / `generate_video_ad` / `generate_text_ad`, ship them in the same ad group / ad set so they compete on equal footing, and give each enough budget and audience to gather signal. Run **campaign-preflight** before launch.

## 3. Wait for enough data

- Judge on conversions and CPA where volume allows, on CTR only as an early proxy.
- Do not call a winner off a few conversions or one day; small samples swing wildly. State the volume behind the call.
- On Meta, respect the Learning Phase before comparing (see **platform-meta**).

## 4. Read and act

Pull results per variant: `pull_<platform>_ads_performance(level="ad")`. Pick the winner on the metric that matters (usually CPA or ROAS, not CTR). Scale it with the **optimize** skill, retire the losers, and feed what you learned into the next test.

## Rules

- One variable per test; enough data before a verdict.
- Winner is decided on the conversion metric, not clicks, unless volume forces a proxy.
- Report the variants, the volume, the winner, and the next test to run. Watch winners for fatigue with the **creative-fatigue-detector** skill.
