---
name: outbound
description: Run cold email outbound through Synter Prospector — review the pipeline, inspect campaigns, check sending health, and pause or resume. Use when a user asks about outbound, cold email, sequences, their lead pipeline, reply rates, or wants to launch, pause or top up an email campaign.
---

# Outbound

Prospector is Synter's cold-email engine. You read freely; you never send without a yes.

## 1. Where things stand

Start every outbound conversation with the real state, not the dashboard's:

- `prospector_get_pipeline_summary` — leads by stage, meetings, company grades.
- `prospector_get_campaigns` — what exists and its status.
- `prospector_get_inbox_health` — mailboxes, warmup, daily capacity.

Sending capacity is the fleet's, not one campaign's. Every campaign draws on the same shared mailboxes, so one campaign's bounces damage all of them.

## 2. Read reply numbers honestly

**Roughly 90% of raw "replies" are out-of-office auto-responders.** Measured across the live account on 2026-08-28:

| campaign | inbox replies | automated | human | interested |
|---|---:|---:|---:|---:|
| 216 | 87 | 80 | 7 | 2 |
| 235 | 23 | 20 | 3 | 0 |
| 195 | 28 | 25 | 3 | 2 |

Campaign 216 read as "85 replies, 3.0%" while producing **two** interested humans from 750 leads.

So from `prospector_get_campaign`: quote `reply_rate_pct` (human replies ÷ sends) and `total_interested`. **Never quote `total_replied_including_automated`, and never compute a rate from it.** If the human figure is null the honest stats have not synced yet — say so rather than substituting the inflated one.

Bounce rate above ~2% is a fleet emergency, not a campaign problem. Say so plainly.

## 3. Before anything sends

Cold email is outward-facing and irreversible. Confirm before every send, resume or lead push — approval for one campaign never carries to the next.

Two gates, both mandatory:

1. **Qualification** — run the **outbound-research** skill. If you cannot name a checkable fact about a recipient, do not mail them. Matching an industry and a job title is not a fact.
2. **Deliverability** — every address verified, nobody on the suppression list, tokens rendering. Leads reach a campaign only through the gated push.

## 4. Launch, pause, resume

- `prospector_create_campaign` — creates it. Creating is not sending.
- `prospector_update_campaign_status` — pause or resume. **Resuming sends email.** Ask first, every time.
- `prospector_get_leads` / `prospector_get_contacts` — inspect who is actually on a list before it goes out. Read a sample aloud to the user; off-ICP names are obvious to a human and invisible in aggregate.

Pause immediately, without asking, if you see: bounce rate over 5%, a token printing literally in a sent email, or a lead who asked to be removed still receiving mail. Report it after.

## 5. What not to do

- Do not top up a campaign to fix a low reply rate. A campaign at 0.3% has an offer problem; adding leads spends mailbox reputation to buy nothing.
- Do not quote open rates. Open tracking is off across the platform.
- Do not send to someone already in the CRM, already met, or already a customer — see **outbound-research**.
- Do not write email bodies with the LLM. Templates are human-written; the model fills variable slots from real facts only, and never invents a number, a client name or a stat.
