---
name: linkedin-ads-targeting
description: Build LinkedIn Ads audiences with job title, seniority, and company targeting, ABM company lists, lookalikes, and lead gen form optimization. Use when building LinkedIn audiences, setting up ABM, choosing ad formats, optimizing lead gen forms, or estimating LinkedIn costs.
---

# LinkedIn Ads Targeting

LinkedIn is the most expensive click in B2B; it only pays when the audience is layered tightly enough that every impression is a plausible buyer.

Confirm the account: `list_connected_accounts`.

## 1. Build the audience in layers

Layer categories with AND logic, options within a category with OR:

- **Job function or title:** e.g. Marketing OR Sales. Titles are free text — add variations.
- **Seniority:** Director OR VP OR CXO for buying-committee reach. Skip individual contributors unless they are the actual users driving adoption.
- **Company size:** pick the employee ranges matching your ICP (e.g. 201-5000 for mid-market).
- **Industry:** map your vertical to LinkedIn's taxonomy.
- **Geography:** country or region.

Size targets: below ~50,000 members delivery suffers for Sponsored Content; 100,000-300,000 is the sweet spot; above ~500,000 you are paying LinkedIn CPMs for non-ICP reach — narrow with skills or a company list. Under ~10,000 is workable only for ABM and message formats.

Build and manage audiences with `build_abm_audience`, `build_lookalike_audience`, and `find_audience_signals`; review with `list_audiences`, connect with `attach_audience`, push with `sync_audience`. The **audience** skill covers cross-platform audience strategy.

## 2. Set up ABM

1. Prepare the company list: company name plus domain per row, minimum ~300 companies for matching, 1,000+ for real scale. `build_abm_audience` handles the build; expect a 60-80% match rate and allow 24-48 hours for matching.
2. Layer the account list with seniority (Director+) and the job functions that own the buying decision.
3. Tier the accounts: Tier 1 (top strategic accounts) gets highest bids and personalized messaging, Tier 2 industry-specific messaging, Tier 3 broader value prop at lower bids.
4. Measure ABM on account penetration (% of target accounts reached), engagement by tier, and pipeline influenced — not raw CPL. Use `pull_linkedin_ads_performance` and `pull_linkedin_company_engagement` for the read; **attribution** for pipeline crediting.

## 3. Choose the format

- **Awareness:** Sponsored Content single image or video, broad audience (100k+).
- **Consideration:** carousel or video, Conversation Ads for multi-CTA journeys, mid-size audience.
- **Lead gen:** Sponsored Content or Message Ads with Lead Gen Forms, tight audience (50k-150k).
- **Cheap presence:** Text Ads in the sidebar — low CPC, low volume.

Cost reality check (2025-2026 US B2B ranges): CPCs roughly $5-14, CPMs $25-60, CPLs $50-200 depending on industry and offer; CTR around 0.4-0.6% is normal for Sponsored Content. Budget with **media-plan** and validate spend against these before declaring a problem.

## 4. Optimize lead gen forms

- Fewer fields, higher conversion: 3 pre-filled fields converts roughly 12-15%, 5 fields 8-12%, 7+ fields drops to 4-8%. Phone number alone cuts conversion 20-30%.
- Stick to pre-filled fields (name, email, company, title) plus at most one custom qualifying question.
- Headline states what they get ("Get the ROI Report"), CTA button matches ("Download Now"), thank-you message sets next-step expectations.
- Protect lead quality with targeting (seniority, company size) and one qualifying question rather than more form fields.
- Speed-to-lead matters: sync leads to CRM fast and follow up within 24 hours.

## 5. Verify and iterate

Confirm campaigns went live as configured with `list_campaigns` and `get_ad_readback`, watch delivery with `pull_linkedin_ads_performance`, and set a `set_spend_alert` — LinkedIn burns budget quickly at these CPMs. Retarget engagers and form-openers as a second-stage audience; expand proven audiences with `build_lookalike_audience`. Creative guidance lives in **creative**; broader LinkedIn platform mechanics in **platform-linkedin**.

## Rules

- Every audience gets a seniority layer. Unlayered function targeting wastes most of the spend.
- Check estimated audience size before launch; fix anything under 50k (non-ABM) or over 500k.
- ABM lists need domains, not just company names, for good match rates.
- Judge lead gen on qualified leads and pipeline, not form fills.
- LinkedIn CPLs of $75-150 in SaaS are normal — do not panic-pause at CPCs that would be alarming on other platforms; compare against benchmarks first.
