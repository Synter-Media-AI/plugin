---
name: platform-linkedin
description: Operate LinkedIn Ads through Synter — read and build B2B campaigns with job-title, company, and ABM targeting, the right ad format, and realistic CPL expectations. Use when a user is working on LinkedIn ads, B2B lead gen, or account-based targeting.
---

# LinkedIn Ads Playbook

LinkedIn is the B2B platform: precise professional targeting, higher costs, longer consideration. How it is shaped and how to operate it through Synter. Reads do not require approval; anything that spends money waits for explicit approval.

Confirm the account first: `list_connected_accounts`. Use the real ID the tool returns; never invent one. Not connected → run the **connect** skill.

## Structure

Campaign group → campaign (objective, audience, budget, schedule) → ad. Targeting is the core lever: job title and function, seniority, company, company size, industry, and skills. Keep audiences tight enough to be relevant but large enough to deliver.

- Review existing audiences with `list_audiences`. Use `research_campaign_opportunity` for available campaign research. Ask the account owner to create or synchronize new audience lists in the platform UI; use returned IDs only in supported plan fields.
- **Formats:** single-image, document, video, and conversation/message formats. Match the format to the funnel stage.

## Read a campaign

Use `list_campaigns` for IDs and state and `pull_linkedin_ads_performance` for campaign metrics. Request a platform export for company-level engagement if needed.

## Build a campaign

Use `create_campaign_plan` and `upsert_plan_entity` for the supported campaign structure, and `forecast_campaign` for available estimates. Write text with `create_ad_copy` and select existing advertiser assets with `list_creative_assets`. Follow **launch** for `run_launch_preflight`, explicit user approval, `approve_campaign_plan`, `execute_campaign_plan`, and verification with `get_plan_execution` before any approved activation.

## Operating rules

- Expect higher CPL than other platforms. Judge LinkedIn on pipeline quality and downstream conversion, not raw CPC.
- Keep targeting to decision makers where the offer warrants it; do not spray a broad seniority range on an expensive platform.
- Give campaigns room before judging; B2B conversion windows are long. Follow **pre-pause-analysis** before cutting.
- Conversion tracking (Insight Tag and offline/CRM conversions) must be attached before scaling: `get_pixel_health`, `ga4_get_conversions`. Measure with `get_attribution`.
- Guard against a fat-finger daily budget 10 to 100x intended. Adjust with `update_campaign_budget`, pause with `pause_campaign`.
- "Created" is not "live and spending." Confirm with `list_campaigns` and report the real IDs. Build an audience first with the **audience** skill when one does not exist yet.

Use only platform and entity types accepted by the live tool schema. Follow **launch** for plan review, preflight, approval, execution, and verification. If a setting or platform is unsupported, describe the manual handoff without claiming it was applied.
