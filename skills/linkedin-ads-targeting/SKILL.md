---
name: linkedin-ads-targeting
description: Build LinkedIn Ads audiences with job title, seniority, and company targeting, ABM company lists, lookalikes, and lead gen form optimization. Use when building LinkedIn audiences, setting up ABM, choosing ad formats, optimizing lead gen forms, or estimating LinkedIn costs.
---

# LinkedIn Ads Targeting

LinkedIn is the most expensive click in B2B; it only pays when the audience is layered tightly enough that every impression is a plausible buyer.

Confirm the account: `list_connected_accounts`.

## 1. Build the audience in layers

Layer categories with AND logic, options within a category with OR:

- **Job function or title:** e.g. Marketing OR Sales. Titles are text — add variations.
- **Seniority:** Director OR VP OR CXO for buying-committee reach. Skip individual contributors unless they are the actual users driving adoption.
- **Company size:** pick the employee ranges matching your ICP (e.g. 201-5000 for mid-market).
- **Industry:** map your vertical to LinkedIn's taxonomy.
- **Geography:** country or region.

Size targets: below ~50,000 members delivery suffers for Sponsored Content; 100,000-300,000 is the sweet spot; above ~500,000 you are paying LinkedIn CPMs for non-ICP reach — narrow with skills or a company list. Under ~10,000 is workable only for ABM and message formats.

Review existing audiences with `list_audiences`. Define company, seniority, and job criteria; have the account owner create and synchronize new lists in the platform UI. See **audience** for the planning workflow.

## 2. Set up ABM

1. Prepare the company criteria and required domains, then have the account owner create the list in the platform UI. Confirm returned audience IDs and observed match rates with `list_audiences`; do not promise a match rate.
2. Layer the account list with seniority (Director+) and the job functions that own the buying decision.
3. Tier the accounts: Tier 1 (top strategic accounts) gets highest bids and personalized messaging, Tier 2 industry-specific messaging, Tier 3 broader value prop at lower bids.
4. Use `pull_linkedin_ads_performance` for available campaign metrics and **attribution** for pipeline analysis. Request exports for company-level engagement not returned by the tools.

## 3. Choose the format

- **Awareness:** Sponsored Content single image or video, broad audience (100k+).
- **Consideration:** carousel or video, Conversation Ads for multi-CTA journeys, mid-size audience.
- **Lead gen:** Sponsored Content or Message Ads with Lead Gen Forms, tight audience (50k-150k).
- **Cheap presence:** Text Ads in the sidebar — low CPC, low volume.

Compare CPC, CPM, CPL, and CTR with the account’s recent history for the same objective and audience. Use **media-plan** for the proposed test budget and label estimates clearly.

## 4. Optimize lead gen forms

- Fewer fields, higher conversion: 3 pre-filled fields converts roughly 12-15%, 5 fields 8-12%, 7+ fields drops to 4-8%. Phone number alone cuts conversion 20-30%.
- Stick to pre-filled fields (name, email, company, title) plus at most one custom qualifying question.
- Headline states what they get ("Get the ROI Report"), CTA button matches ("Download Now"), thank-you message sets next-step expectations.
- Protect lead quality with targeting (seniority, company size) and one qualifying question rather than more form fields.
- Speed-to-lead matters: sync leads to CRM fast and follow up within 24 hours.

## 5. Verify and iterate

Confirm campaign state with `list_campaigns` and delivery with `pull_linkedin_ads_performance`. Configure alerts and new expansion audiences in the platform UI. Use **ad-copy-generation** for text and **platform-linkedin** for campaign planning.

## Rules

- Every audience gets a seniority layer. Unlayered function targeting wastes most of the spend.
- Check estimated audience size before launch; fix anything under 50k (non-ABM) or over 500k.
- ABM lists need domains, not just company names, for good match rates.
- Judge lead gen on qualified leads and pipeline, not form fills.
- Judge LinkedIn costs against lead quality, pipeline value, and the account’s own benchmarks before proposing a pause.
