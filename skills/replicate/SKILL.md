---
name: replicate
description: Rebuild an existing campaign from one ad platform onto another — read the live structure on the source platform, map it to the target platform, and ship a matching campaign. Use when a user wants to copy, port, clone, duplicate, mirror, or replicate a campaign across platforms (e.g. "build my Google campaign on Microsoft", "run this Meta campaign on TikTok too", "copy my Search campaign to Bing").
---

# Replicate a Campaign Across Platforms

Take a campaign that already runs on one platform and stand up a matching one on another. Read what exists, map it to the target platform's shape, show the plan, and ship on the user's word. This is a build path — every spend-creating step waits for explicit approval.

The common ask is Google → Microsoft (near 1:1), but the same loop works for any pair.

## 1. Read the source campaign — completely

Confirm the org and accounts first: `list_connected_accounts`. Both the source and target platforms must be connected. If the target isn't connected, run the **connect** skill first.

Find the source campaign: `list_campaigns(platform="<source>")`. Get its real ID.

Pull the full structure, not just top-line metrics:

- **Google source:** `run_gaql_query` is the ground truth. Read campaign settings (budget, bid strategy, networks, geo/location criteria, languages, ad schedule), ad groups, keywords with **match types**, negative keywords (campaign and ad-group level), and the RSAs (every headline and description, and any pinning). Use `pull_google_ads_performance` for the metrics that tell you which pieces are worth carrying over.
- **Other sources (Meta, LinkedIn, TikTok, Reddit, X):** use `list_campaigns` + `pull_<platform>_ads_performance` and the matching platform playbook skill to read structure, audiences, budgets, and creative.

Write down the source structure explicitly before you build. If you cannot read a piece, say so — never invent a keyword list or a budget.

## 2. Map source → target

Platforms are not identical. State the mapping and where it is lossy.

**Google → Microsoft (the easy case — nearly a mirror):**
- Campaign, ad group, keyword (with match types), RSA, negative keyword, geo/location, ad schedule, and budget all map directly.
- Keep match types exactly. Keep negatives — they matter as much as the keywords.
- Watch the gaps: Microsoft's audience and network options differ (Search Partners, Microsoft Audience Network), some Google automated-bidding modes have no exact twin, and final-URL/tracking-template syntax can differ. Call these out rather than silently dropping them.
- Rebuild fresh through Synter's plan tools. Do not describe this as Microsoft's native "Import from Google" — that is a different, platform-side path.

**Cross-format pairs (e.g. Search → social, Google → Meta/TikTok):**
- There is no keyword concept on social. Translate intent: keywords and search themes become audience signals and interests; RSAs become social ad copy and creative. Use `find_audience_signals` and the target platform playbook. Be explicit that this is a re-interpretation, not a copy.

## 3. Build the target plan

`create_campaign_plan` to draft the target structure, then `upsert_plan_entity` to add each campaign → ad group / ad set → ad, carrying over the mapped keywords, negatives, geo, schedule, and budget. `forecast_campaign` for reach/CPC/CPA on the new platform — the source platform's numbers do not transfer.

Creative: reuse the source ad copy where the format allows; otherwise run the **creative** / **ad-copy-generation** skills to regenerate for the target platform. Apply brand voice — see `${CLAUDE_PLUGIN_ROOT}/context/brand-and-safety.md`.

## 4. Preflight — before anything goes live

Run the **campaign-preflight** checklist and report pass/fail:

- Geo/location criteria copied and correct (a "US" name with no location criteria is the classic miss).
- Negatives carried over — porting keywords without negatives burns budget fast.
- Conversion tracking exists and is attached on the target (`ga4_list_conversions` / `get_gtm_tag` / `verify_pixel_ownership`). No tracking → fix before launch.
- Budget and bid caps sane — guard against a fat-finger daily budget 10–100x intended.
- Match types preserved; final URLs resolve and match the ad's promise.

## 5. Ship on approval

Show the full mapped plan side by side with the source — platform, structure, budget, geo, creative, projected CPA — and name what changed in translation and why. Ask for a clear go. Only then `execute_campaign_plan` (or `create_campaign_for_audience` for an audience-targeted build), then `enable_campaign`.

Confirm live: `list_campaigns(platform="<target>")` and report the real campaign ID created. "Created" and "live and spending" are different claims — verify before you say it is running.

## House rules

- Nothing that spends money ships without explicit approval. Recommend, then execute.
- Use the real account and campaign IDs the tools return — never invent them.
- Never run one org's campaign through another org's key.
- Microsoft (and most platforms): enabling a campaign does not serve its ad groups if those stay paused. After enabling, re-pull and confirm the children actually serve.
- Start the target conservative on budget; scale winners later with the **optimize** skill.
