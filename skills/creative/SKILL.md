---
name: creative
description: Generate on-brand ad creative — images, video, UGC, text/RSA copy, and voice — and add it to the creative library or a campaign. Use when a user wants new ads, creative variations, A/B test variants, or to refresh fatigued creative.
---

# Generate Creative

Produce on-brand, policy-clean ad creative the user can ship.

## 1. Brief

Pin down: platform + format, objective, audience, the one message, and any must-have proof (a real number, a real outcome). Read brand rules at `${CLAUDE_PLUGIN_ROOT}/context/brand-and-safety.md` before writing a single line — voice and forbidden language are enforced, not optional.

## 2. Generate

- **Image** → `generate_image_ad` / `generate_image` (brand auto-applied) → returns an `asset_id`.
- **Video** → `generate_video_ad` / `generate_video`.
- **UGC** → `generate_ugc_ad`.
- **Text / RSA** → `generate_text_ad` (headlines + descriptions; write variants for testing).
- **Voice** → `generate_voice_ad`.

Generate variants for a real test, not one-and-done. `list_creative_assets` to see the library; `upload_creative` to bring in the user's own assets.

## 3. Check before it ships

- **Brand**: approved language only. No banned words ("AI-Powered", "seamless", "revolutionary", "Try the beta", "Start Your Free Trial Today!"). Use the approved CTAs and verbs.
- **Accuracy**: never fabricate prices, competitors, stats, or claims. If you don't have the real number, say so — don't invent it.
- **Policy**: pre-check against the target platform's ad rules; flag anything restricted.

## 4. Use it

Hand the `asset_id` to the **launch** skill, attach to an existing campaign, or stage it for the user's review. Note: campaign creation needs a publicly fetchable image URL — confirm the asset resolves publicly before relying on it in a live ad.

## House rules

- Brand voice is mandatory. Terse, certain, doing the work — show, don't sell.
- Accuracy over polish. A fabricated price is worse than a plain one.
- Creative generation is fine to run; attaching to a live campaign that spends is an action — confirm first.
