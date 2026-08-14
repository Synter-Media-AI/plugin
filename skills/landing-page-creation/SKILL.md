---
name: landing-page-creation
description: MUST load before `create_landing_page_draft`. Covers brand preflight → outline → generate → publish → custom domain.
---

# Landing Page Creation Workflow

When creating landing pages, use this 5-step workflow:

## 1. Brand & Form Preflight (CUSTOMER pages only)

BEFORE generating or publishing a landing page for a CUSTOMER (not Synter), you MUST verify brand context and form destination:

- **Brand Guidelines**: Brand guidelines must exist for that customer's domain/organization. Marketing skills should exist for: `brand-voice`, `positioning-angles`, and `audience-icp`. If missing, STOP and request them or offer to run `extract_brand_skills`.
- **Form Destination & External Tool Audit**: Inspect the customer's existing main website (e.g. `/contact` or `/book`) to identify their exact live form/calendar setup (e.g. Fillout, Calendly, Typeform, HubSpot).
- **Dual Routing & Attribution Pass-Through**: Ensure the landing page form posts to `POST /api/lp/forms/submit` (for Synter DB capture and multi-platform CAPI event logging), then pre-fills and redirects directly to the customer's original form/calendar flow.
- **Click ID & UTM Preservation**: Ensure all platform click IDs (`rdt_cid`, `li_fat_id`, `gclid`, `fbclid`) and UTM parameters inherit into the form/redirect URL so the customer's CRM maintains complete attribution parity.
- The `create_landing_page_draft` tool enforces brand check automatically and will return a `LANDING_PAGE_BRAND_SETUP_REQUIRED` error if brand context is missing. Follow its instructions.


## 2. Outline

Discuss the page structure, headline, value props, and CTA with the user. Ask the user for their CTA URL or suggest links from their existing website. Never invent URLs.

## 3. Generate & Preview

You MUST call the `create_landing_page_draft` tool. The tool saves the page to the database AND returns a JSON result. The UI automatically renders a live preview widget from the tool result. Do NOT manually write a landing-page code fence — only the tool result triggers the widget correctly.

## 4. Publish

After user approval, call `publish_landing_page`. The UI automatically updates the widget status.

## 5. Custom Domain Offer

After a page is published, offer to set up a custom domain (e.g. `go.acme.com`). Explain that a branded domain keeps their brand in the URL for Google Ads quality score. Tell the user to provide their domain, then you can check DNS setup requirements via the `/api/landing-pages/domain-setup` endpoint. We can auto-configure DNS for many providers (Cloudflare, GoDaddy, Namecheap, etc.) or provide manual CNAME instructions. The tool result from `create_landing_page_draft` includes `offer_custom_domain: true` and a `page_id` — the UI renders a DomainSetupCard automatically.

## Critical Rules

- **NEVER output a landing-page code fence yourself.** ALWAYS call `create_landing_page_draft` instead. If you output the code fence without calling the tool, the preview will show "Not Found" because the page was never saved to the database.
- **Always wrap the landing page workflow in a `workflow` fenced block** to show visual progress to the user.
- If title/slug are not provided, derive sensible defaults.
- For `cta_url`, ALWAYS ask the user or suggest URLs from their working website. NEVER guess a CTA URL. The LP generator will hard-fail if the URL doesn't resolve.
- For Synter pages, use https://syntermedia.ai/signup (NEVER app.syntermedia.ai which does not exist).
- If the user explicitly asks to "generate/build/create a landing page", do not stop at a markdown template — you must call the `create_landing_page_draft` tool.
