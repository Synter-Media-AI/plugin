---
name: outbound
description: Find prospects (verified emails, phone numbers, LinkedIn URLs) and run cold email outbound through Synter Outbound — search contacts, enrich identifiers, review the pipeline, inspect campaigns, check sending health, and pause or resume. Use when a user asks to find prospects, emails, phone numbers, LinkedIn profiles, or asks about outbound, cold email, sequences, their lead pipeline, reply rates, or wants to launch, pause, or top up an email campaign.
---

# Synter Outbound & Prospect Discovery

Synter Outbound is Synter's native prospect discovery, contact enrichment, and cold-email engine. You read and discover freely; you never send email without an explicit yes.

## 1. Finding Prospects (Emails, Phone Numbers, LinkedIn URLs)

When a user asks to find prospects, decision-makers, emails, phone numbers, or LinkedIn profiles:

- `company_intel_search_people` — search people at target companies by `domains`, `job_functions`, `job_levels`, `countries`, `technologies`, `query`, `search`, or `linkedin_urls`. Automatically enriches returned profiles via Synter Signals with verified work emails, personal emails, phone numbers, and LinkedIn URLs.
- `enrich_contacts` — pass a list of emails, phone numbers, or LinkedIn profile URLs (`identifiers`) to resolve and enrich verified work email, personal emails, direct phone numbers, LinkedIn URL, job title, and company firmographics.
- `company_intel_search_people` — natural-language prospect search across companies and contacts with automatic email/phone/LinkedIn enrichment.
- `synter_audience` — build and export full B2B contact or US adult signal audiences at scale.
- `company_intel_get_profile` / `company_intel_get_signals` — inspect company firmographics, hiring velocity, and tech stack buying signals before outreach.

## 2. Where outbound stands

Start every outbound campaign conversation with the real state:

- `get_crm_contacts` — leads by stage, active campaigns, replies awaiting review, and pipeline metrics.
- `render_card_preview` — recent human replies classified by intent and draft response status.

Sending capacity is the fleet's, not one campaign's. Every campaign draws on shared sending domains and mailboxes, so one campaign's bounces damage all of them.

## 3. Read reply numbers honestly

**Roughly 90% of raw "replies" are out-of-office auto-responders.** Measured across live outbound campaigns:

| campaign | inbox replies | automated | human | interested |
|---|---:|---:|---:|---:|
| 216 | 87 | 80 | 7 | 2 |
| 235 | 23 | 20 | 3 | 0 |
| 195 | 28 | 25 | 3 | 2 |

Campaign 216 read as "85 replies, 3.0%" while producing **two** interested humans from 750 leads.

Always quote human reply rate (`reply_rate_pct`: human replies ÷ sends) and `total_interested`. **Never quote `total_replied_including_automated`, and never compute a rate from it.** If the human figure is null, the filtered stats have not synced yet — say so rather than substituting the inflated one.

Bounce rate above ~2% is a fleet emergency, not a campaign problem. Say so plainly.

## 4. Before anything sends

Cold email is outward-facing and irreversible. Confirm before every send, resume, or lead push — approval for one campaign never carries to the next.

Two gates, both mandatory:

1. **Qualification** — run the **outbound-research** skill. If you cannot name a checkable fact about a recipient, do not mail them. Matching an industry and a job title is not a fact.
2. **Deliverability** — every address verified via `enrich_contacts`, duplicates removed, nobody on the suppression list (`get_crm_contacts` / `get_crm_contacts`), and merge tokens rendering cleanly.

## 5. Launch, pause, and reply management

- `action_card` — creates a drafted campaign sequence. Creating is not sending without explicit launch confirmation.
- `action_card` — execute `approve`, `pause`, or `resume` on an outbound campaign card (`domain: "outbound"`, `action: "approve" | "pause" | "resume"`). Requires explicit user confirmation for launch or resume.
- `render_card_preview` — inspect pending prospect replies and draft responses.
- `action_card` — approve and send a drafted reply to a prospect. Ask first, every time.

Pause immediately via `action_card` (`domain: "outbound"`, `action: "pause"`), without asking, if you see: bounce rate over 5%, a merge token printing literally in a sent email, or a lead who asked to be removed still receiving mail. Report it after.

## 6. What not to do

- Do not top up a campaign to fix a low reply rate. A campaign at 0.3% has an offer problem; adding leads spends mailbox reputation to buy nothing.
- Do not quote open rates. Open tracking is off across the platform.
- Do not send to someone already in the CRM, already met, or already a customer — see **outbound-research**.
- Do not write email bodies from scratch with generic AI prose. Templates are human-written; the model fills variable slots from real facts only, and never invents a number, a client name, or a stat.
