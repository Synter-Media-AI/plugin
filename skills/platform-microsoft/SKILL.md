---
name: platform-microsoft
description: Operate Microsoft (Bing) Ads through Synter — read and build Search campaigns that mirror Google, with match types, negatives, geo, schedules, and budgets, plus the real Google-to-Microsoft differences. Use when a user is working on Microsoft/Bing Ads or wants to move a Google campaign onto Microsoft.
---

# Microsoft (Bing) Ads Playbook

Microsoft Ads is close to a mirror of Google Ads, which is why porting between them is common. Reads are free; anything that spends money waits for explicit approval.

Confirm the account first: `list_connected_accounts`. Use the real ID the tool returns; never invent one. Not connected → run the **connect** skill.

## Structure

Campaign → ad group → keywords (exact, phrase, broad) → responsive search ads, with negatives at campaign and ad-group level, plus geo/location criteria, ad schedule, and budget. If you know Google Search, you know this shape.

## Read a campaign

`list_campaigns(platform="microsoft")` for the list and IDs. `pull_microsoft_ads_performance(days=...)` for impressions, clicks, spend, conversions, and CPA per campaign.

## Google to Microsoft: the differences that bite

The structure maps almost 1:1, but do not assume it is identical:
- **Networks:** Microsoft has Search Partners and the Microsoft Audience Network. Decide whether to include them; performance can differ materially from Google search traffic.
- **Bid strategies:** some Google automated-bidding modes have no exact Microsoft twin. Map to the closest and say so.
- **Tracking templates and final-URL syntax** can differ. Verify URLs resolve on Microsoft.
- Microsoft search volume and audience skew differ from Google. Validate queries, device, and geography before scaling.

To carry a live Google campaign across, use the **replicate** skill. It reads the Google structure completely, maps match types and negatives, and rebuilds through Synter's plan tools. Do not describe this as Microsoft's native "Import from Google" — that is a separate platform-side path.

## Build a campaign

`create_campaign_plan` → `upsert_plan_entity` per campaign / ad group / keyword / ad → `forecast_campaign`. Generate copy with `generate_text_ad` or the **creative** skill. Run **campaign-preflight**, then `execute_campaign_plan` + `enable_campaign` on approval.

## Operating rules

- Enabling a campaign does not serve its ad groups if those stay paused. After enabling, re-pull and confirm the children actually serve; never trust the campaign status alone.
- Carry negatives across, not just keywords. Keywords without negatives burn budget.
- Verify geo/location criteria exist and match intent.
- Conversion tracking must exist and be attached before scaling: `ga4_list_conversions`, `verify_pixel_ownership`.
- Guard against a fat-finger daily budget 10 to 100x intended. Adjust with `update_campaign_budget`, pause with `pause_campaign`.
- "Created" is not "live and spending." Confirm with `list_campaigns` and report the real IDs.
