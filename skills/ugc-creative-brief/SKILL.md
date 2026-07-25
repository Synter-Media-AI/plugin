---
name: ugc-creative-brief
description: Build UGC creator briefs with hook formulas, shot lists, platform format specs, and compensation frameworks. Use when briefing UGC creators, planning creator campaigns, writing creator-style hooks, or generating UGC-style ads.
---

# UGC Creative Brief

A UGC ad works because it looks like a person talking, not a brand advertising; the brief's job is to lock the hook, message, and CTA while leaving the delivery authentic.

## 1. Gather the inputs

You need: brand and product, target audience with pain points, objective, distribution platforms, 2-3 key messages, restricted claims or compliance limits, and budget. If any of these are missing, ask before drafting — a brief with vague messages produces generic content.

## 2. Write the brief

Structure every brief with these blocks:

- **Brand overview:** product, site, brand voice in one line each.
- **Deliverables:** count, length, aspect ratio, resolution (1080x1920 minimum for vertical), raw footage yes/no, revision rounds (cap at 2).
- **Key messages:** 2-3 per video, no more. Creators who juggle five talking points hit none.
- **Hook requirement:** first 3 seconds must stop the scroll, using one of the approved formulas below. Never open with the brand name.
- **CTA requirement:** exact verbal CTA and timestamp, on-screen CTA text, promo code if any.
- **DOs:** natural lighting, phone-shot, product in frame within 5 seconds, direct-to-camera, genuine reactions.
- **DON'Ts:** no competitor mentions, no unsubstantiated health or income claims, no copyrighted music, no scripted-sounding delivery. Check restricted verticals against platform policy before briefing.
- **Timeline and compensation:** acceptance, draft, revision, and final dates; fee structure from section 6.

## 3. Pick the hook formula

- **Problem-Agitation-Solution:** "Stop wasting money on X" → frustrating before-state → "Then I found [Product]" → result → CTA. Best for clear pain points.
- **Before-After-Bridge:** show the before, "This was me a month ago," bridge to the product, transformation, code CTA. Best for visual transformations and SaaS workflows.
- **Testimonial:** "I never thought I'd say this but..." → credibility → specific use case and result → endorsement → CTA. Best for high-trust and B2B products.
- **Curiosity gap / pattern interrupt:** unexpected open with no context, tease the reveal, then the product. Best for TikTok-native content.
- **Listicle:** "3 things I wish I knew about X," product woven into the tips. Best for educational angles.

Give the creator one formula per video, with the opening line drafted for them.

## 4. Match platform specs

| Spec | TikTok / Reels / Shorts | Meta Feed | YouTube pre-roll |
|---|---|---|---|
| Aspect ratio | 9:16 | 1:1 or 4:5 | 16:9 |
| Sweet-spot length | 15-34s | 15-60s | 6s / 15s / 30s |
| Captions | Required (most watch muted) | Required | Optional |
| Text safe zone | Avoid top 15%, bottom 25% | Full frame | Full frame |
| CTA overlay | Last 3-5 seconds | Throughout OK | Last 2 seconds |

Brief the shot list per format — a 9:16 talking-head does not crop into a usable 1:1.

## 5. Include a shot list

Break the video into numbered shots with duration, shot type, description, and audio line. Example 30s unboxing skeleton: arrival excitement (0-3s), open and first reaction (3-6s), product reveal close-up (6-10s), first use (10-15s), natural POV usage (15-22s), final reaction (22-27s), CTA overlay (27-30s). Tutorials and day-in-life follow the same discipline: hook shot first, CTA card last, demo in the middle.

## 6. Set compensation

Typical market structure: a base fee per video scaled to follower tier (nano creators from low hundreds, scaling up through micro and mid tiers), plus separately priced usage rights. Organic-only is the 1x baseline; paid amplification runs 1.5-2x, whitelisting from the creator's handle 2-3x, perpetual rights 3-5x, and exclusivity adds 50-100%. Time-box usage rights (30/60/90 days) rather than buying perpetual by default, and consider performance bonuses per view or tracked conversion threshold.

## 7. Produce, test, ship

- No creator lined up? `generate_ugc_ad` produces creator-style video from the same brief — hook formula, message, CTA all still apply.
- Upload finals with `upload_creative`; verify placements with `get_ad_readback`.
- Run variants head-to-head with `test_creatives` and read results via `pull_<platform>_ads_performance` or `tiktok_ads_get_insights`. **creative-testing** covers test design; **video-ad-scriptwriter** covers timing-mark scripting when the creator wants a full script.

## Rules

- Lock hook, key messages, and CTA; leave wording and delivery to the creator.
- 2-3 key messages max, one hook formula per video.
- Compliance limits go in the brief, not the revision round.
- Price usage rights explicitly and time-boxed. Never assume paid rights from a base fee.
