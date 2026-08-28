---
name: outbound-replies
description: Triage and answer replies to cold email campaigns — separate real humans from auto-responders, classify intent, draft a reply in the founder's voice, and route opt-outs to suppression. Use when a user asks about outbound replies, their unibox, who responded to a campaign, or wants to answer a prospect.
---

# Outbound Replies

Most of what looks like a reply is not one. Sort that out before you tell anyone how a campaign is doing.

## 1. Auto-responders are not replies

**Roughly 90% of raw replies are out-of-office.** On the live account, campaign 216 showed 87 inbox replies: 80 automated, 7 human, 2 actually interested.

Three things must come out of the count before you report it:

- **Auto-responders** — out-of-office, vacation, "no longer with the company"
- **The Sent folder** — our own outbound comes back through the same feed; counting it means counting our own words as prospect interest
- **Bounces** — a delivery failure is not a reply

Only what remains is a reply. Never report the raw number, and never compute a rate from it.

## 2. Classify what is left

| Kind | Looks like | Do |
|---|---|---|
| Interested | "happy to discuss", asks about price or timing | draft a reply, propose a time |
| Question | wants detail before committing | answer the question, nothing else |
| Wrong person | "that's not me", "talk to X" | thank, ask for the handoff, never re-pitch |
| Not now | "we're in a good place", "revisit in Q1" | acknowledge, log the date, stop |
| **Opt-out** | "remove me", "unsubscribe", "where did you get my information" | **suppress immediately**, then a one-line apology if any reply at all |

An angry "where did you get my information?" is an opt-out and a targeting failure. Suppress, and treat it as evidence the list was not qualified — see **outbound-research**.

## 3. Draft, then wait

`prospector_create_reply` drafts. A draft is not a send.

Every reply to a real person needs explicit approval before it goes. Approval for one reply does not carry to the next message in the same thread.

Voice rules, enforced by the copy gate:

- **No em-dashes.** Short sentences. Specific asks.
- No "I hope this finds you well", no "circling back", no "per my last email".
- Never invent a number, a client name, a case study or a stat. If you do not have the figure, do not use one.
- Say "one prompt", never "click" — Synter is prompt-driven.
- Answer what they asked. A question about pricing gets a price, not a pitch.

## 4. Booking

When someone wants time, send the real scheduling link rather than proposing slots blind. Confirm the meeting actually lands in the calendar before telling the user it is booked — "created" is not "booked".

## 5. What to report back

When summarizing a campaign's replies, give the user:

```
N human replies (M auto-responders excluded)
  → X interested
  → Y questions
  → Z not now
  → W opt-outs        ← flag these, they are the targeting signal
```

Two interested replies from 750 leads is not a reply rate to celebrate, and it is not a volume problem to solve by adding leads. Say what it is: the offer or the list is wrong.
