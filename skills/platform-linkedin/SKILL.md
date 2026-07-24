---
name: platform-linkedin
description: Operate LinkedIn Ads through Synter — read and build B2B campaigns with job-title, company, and ABM targeting, the right ad format, and realistic CPL expectations. Use when a user is working on LinkedIn ads, B2B lead gen, or account-based targeting.
---

# LinkedIn Ads Playbook

LinkedIn is the B2B platform: precise professional targeting, higher costs, longer consideration. How it is shaped and how to operate it through Synter. Reads are free; anything that spends money waits for explicit approval.

Confirm the account first: `list_connected_accounts`. Use the real ID the tool returns; never invent one. Not connected → run the **connect** skill.

## Structure

Campaign group → campaign (objective, audience, budget, schedule) → ad. Targeting is the core lever: job title and function, seniority, company, company size, industry, and skills. Keep audiences tight enough to be relevant but large enough to deliver.

- **ABM:** target named accounts with `build_abm_audience`, then attach with `attach_audience`. Layer seniority on top so spend reaches decision makers.
- **Formats:** single-image, document, video, and conversation/message formats. Match the format to the funnel stage.

## Read a campaign

`list_campaigns(platform="linkedin")` for the list and IDs. `pull_linkedin_ads_performance(days=...)` for spend, clicks, leads, and CPL. `pull_linkedin_company_engagement` for company-level engagement signal.

## Build a campaign

`create_campaign_plan` → `upsert_plan_entity` per campaign / ad → `forecast_campaign` (expect higher CPCs and CPLs than search or social). Generate creative with `generate_image_ad` or the **creative** skill; apply brand voice from `${CLAUDE_PLUGIN_ROOT}/context/brand-and-safety.md`. Run **campaign-preflight**, then `execute_campaign_plan` + `enable_campaign` on approval.

## Operating rules

- Expect higher CPL than other platforms. Judge LinkedIn on pipeline quality and downstream conversion, not raw CPC.
- Keep targeting to decision makers where the offer warrants it; do not spray a broad seniority range on an expensive platform.
- Give campaigns room before judging; B2B conversion windows are long. Follow **pre-pause-analysis** before cutting.
- Conversion tracking (Insight Tag and offline/CRM conversions) must be attached before scaling: `verify_pixel_ownership`, `ga4_list_conversions`. Measure with `get_attribution`.
- Guard against a fat-finger daily budget 10 to 100x intended. Adjust with `update_campaign_budget`, pause with `pause_campaign`.
- "Created" is not "live and spending." Confirm with `list_campaigns` and report the real IDs. Build an audience first with the **audience** skill when one does not exist yet.
