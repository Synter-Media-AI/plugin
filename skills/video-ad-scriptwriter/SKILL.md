---
name: video-ad-scriptwriter
description: Write platform-specific video ad scripts with second-by-second timing marks — YouTube bumpers and pre-roll, TikTok native, Reels, and 30s narrative ads. Use when writing video scripts, storyboarding an ad, improving hook rates, or briefing video generation.
---

# Video Ad Scriptwriter

A video ad is won or lost in the first 3 seconds; write the hook first, fit the format's clock exactly, and end on brand plus CTA.

## 1. Define the brief

Before writing a line, pin down: product, objective (awareness / consideration / conversion), audience, single key message, platform, format length, tone, and CTA. One message per video. If the concept needs two messages, that is two videos — test them with **creative-testing**.

Match hook type to objective: emotional or visual for awareness, problem/question for consideration ("Tired of X?"), offer/urgency for conversion, recognition for retargeting ("Still thinking about it?").

## 2. Fit the format

- **6s bumper (YouTube, non-skippable):** one statement, no story. Visual-first, brand in the first 2 seconds and again at the end, 8-10 words of on-screen text max. Structure: hero visual (0-0.5s) → benefit + super (0.5-3.5s) → product in use (3.5-5s) → logo + URL (5-6s).
- **15s pre-roll (skippable after 5s):** the first 5 seconds are the whole ad for most viewers. Hook (0-3s) → product + benefit named before the skip button (3-5s) → demo (5-10s) → proof (10-13s) → logo, URL, offer (13-15s).
- **30s narrative:** three acts. Setup with hook and problem (0-8s), product as the turn with demo (8-20s), outcome, proof, and CTA (20-30s). Music shifts from tense to resolved at the product reveal.
- **TikTok / Reels native (15-30s):** pattern interrupt at 0s (start mid-sentence, dramatic zoom, unexpected visual), hook statement by 3s without naming the brand, story or context to 8s, product reveal and demo to 18s, result or genuine reaction, then a casual CTA. Polished footage underperforms here; phone-shot beats studio.

## 3. Write with timing marks

Script every second. Each beat gets VISUAL, VO or TALENT line, and SUPER (on-screen text). Most feed viewers watch muted, so supers must carry the message alone. Voiceover pace 140-160 wpm; word budgets that actually fit:

| Duration | VO words | On-screen text |
|---|---|---|
| 6s | 12-18 | 4-8 words |
| 15s | 35-45 | 8-15 words |
| 30s | 70-85 | 15-25 words |
| 60s | 140-160 | 25-40 words |

Example beat:

```
[0:08-0:12] PRODUCT INTRO
  VISUAL: chaos dissolves into clean dashboard (satisfying transition)
  VO: "Meet [Product]."
  SUPER: [Product name + 3-word tagline]
```

Keep text out of platform UI zones on 9:16: top 15% and bottom 25% of frame.

## 4. Optimize the hook

Hook rate = viewers past 3 seconds. Rough health lines: under 25% on YouTube skippable or Reels is weak, 30%+ on TikTok is baseline, 50%+ is strong. Techniques, in impact order: movement in frame within 0.5s, a human face close-up, on-screen text at 0.0s (not delayed), voice starting immediately with no music intro, open loops that tease a payoff.

Test hooks systematically: same body, 3-5 different first-3-second openings, identical targeting, kill the losers once each has enough impressions to judge, then iterate new hooks against the winner. **creative-testing** covers the mechanics; **kill-scale-rules** covers when a variant has earned a verdict.

## 5. Produce and ship

- Generate drafts with `generate_video_ad` (or `generate_ugc_ad` for creator-style delivery — see **ugc-creative-brief** for that format's rules).
- Upload finals with `upload_creative`; confirm what is actually live with `get_ad_readback`.
- Read results: `pull_<platform>_ads_performance` for CTR and CPA, `tiktok_ads_get_insights` for TikTok video metrics (watch time, completion). Judge hooks on retention, not just CTR.

## Rules

- One message per video. Cut anything that serves a second message.
- Brand and benefit must land before the skip point on skippable formats.
- Supers carry the ad for muted viewers; never rely on audio alone.
- Never use trending or unlicensed audio in paid placements.
- A script without timing marks is an outline, not a deliverable.
