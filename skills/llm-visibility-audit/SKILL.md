---
name: llm-visibility-audit
description: Audit domain visibility and Generative Engine Optimization (GEO) across ChatGPT, Claude, Perplexity, Google Gemini, and AI search engines. Assesses AI crawler access, /llms.txt machine readability, JSON-LD schema, Wikipedia/Wikidata entity footprint, and commercial buying intent share of voice. Use when auditing brand AI visibility, testing GEO readiness, analyzing /llms.txt, or generating an LLM visibility score (1-100).
---

# LLM Visibility & Generative Engine Optimization (GEO) Audit

Audits a domain's visibility, machine-readability, and entity authority across AI search engines and generative models (ChatGPT, Claude, Perplexity, Google Gemini, ByteDance/TikTok). Calculates a 1–100 **Synter LLM Visibility Score** across 5 weighted pillars and generates actionable GEO improvement plans.

## Capabilities

1. **AI Crawler Readiness Audit** — Verifies `robots.txt` permissions for `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Bytespider`, and `CCBot`.
2. **Machine-Readable Knowledge Indexing (`/llms.txt`)** — Checks `/llms.txt` and `/llms-full.txt` availability, syntax, and token efficiency (<50 KB primary index target).
3. **Structured Schema & Technical Markup** — Evaluates embedded `application/ld+json` script tags (`Organization`, `SoftwareApplication`, `Product`, `FAQPage`).
4. **Knowledge Graph & Entity Footprint** — Queries Wikidata entities (QID) and Wikipedia encyclopedic articles.
5. **Third-Party Citation & Commercial SOV Audit** — Audits brand profile presence and review completeness across G2, Capterra, Trustpilot, and Gartner.
6. **Commercial Buying Prompt Discovery** — Maps high-intent buyer prompts across Evaluation, Direct Comparison, Alternatives, Pricing/ROI, and Feature Verification intent stages.

---

## 5 Assessment Pillars & Scoring Weights

```
========================================================================================
Pillar                                                Weight   Max Points  Target Standard
========================================================================================
1. AI Crawler Infrastructure & Access                 20%        20 pts    Explicit Allow rules in robots.txt for all 6 major bots
2. Machine-Readable Knowledge Indexing (/llms.txt)   20%        20 pts    /llms.txt active & compressed (<50 KB summary + /llms-full.txt)
3. Structured Schema & Technical Markup               20%        20 pts    JSON-LD Organization, SoftwareApplication, & FAQPage
4. Knowledge Graph & Wikipedia/Wikidata Footprint     20%        20 pts    Wikidata entity (P31/P856) & Wikipedia article
5. Third-Party Citations & Commercial SOV             20%        20 pts    Indexed profiles on G2, Capterra, Trustpilot, Gartner
----------------------------------------------------------------------------------------
TOTAL SYNTER LLM VISIBILITY SCORE                     100%      100 pts    Grade: A (90-100), B (75-89), C (60-74), D (<60)
========================================================================================
```

---

## Workflow & Step-by-Step Execution

### Step 1: Execute Synter Visibility MCP Agent Tools

Run the native visibility agent tools via MCP or runtime helper:

```typescript
// 1. Audit Crawler Readiness & /llms.txt
const crawlers = await executeVisibilityAgentTool("audit_llm_crawler_readiness", {
  domain: "targetdomain.com",
  check_llms_txt: true
}, context);

// 2. Discover High-Intent Commercial Prompts
const prompts = await executeVisibilityAgentTool("discover_llm_visibility_prompts", {
  domain: "targetdomain.com",
  competitors: ["Competitor A", "Competitor B"],
  icp_persona: "Target Buyer Persona"
}, context);

// 3. Audit Review Profiles
const reviewProfiles = await executeVisibilityAgentTool("audit_review_site_profiles", {
  brand_name: "BrandName",
  domain: "targetdomain.com",
  review_platforms: ["g2", "capterra", "trustpilot", "gartner"]
}, context);

// 4. Check Schema Markup Recommendations
const schema = await executeVisibilityAgentTool("generate_jsonld_schema_markup", {
  brand_name: "BrandName",
  domain: "targetdomain.com",
  description: "Official platform overview",
  pricing_summary: "Pricing tier summary"
}, context);
```

### Step 2: Conduct Live Domain Verification

Verify live headers, `robots.txt`, `/llms.txt`, and HTML DOM schemas:

1. **Robots.txt:** Fetch `https://<domain>/robots.txt` and check explicit `Allow: /` or wildcard rules for `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Bytespider`, `CCBot`.
2. **llms.txt File Size:** Fetch `https://<domain>/llms.txt` and calculate byte length. If `> 100 KB`, recommend splitting into a concise `/llms.txt` (<50 KB) and a deep `/llms-full.txt`.
3. **JSON-LD Schema Check:** Inspect HTML source for `<script type="application/ld+json">`. Ensure `SoftwareApplication`, `Organization`, and `FAQPage` entities exist.
4. **Wikidata & Wikipedia Search:** Query Wikidata API (`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=<Brand>&language=en&format=json`) for official QID and `sameAs` links.

---

## Actionable GEO Playbook Recommendations

### 1. JSON-LD Schema Snippet Template

Embed inside the `<head>` of core product and landing pages:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "BrandName",
  "operatingSystem": "All",
  "applicationCategory": "BusinessApplication",
  "description": "Comprehensive product description targeting key buyer capabilities.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Transparent usage or tier-based pricing"
  },
  "sameAs": [
    "https://en.wikipedia.org/wiki/BrandName",
    "https://www.wikidata.org/wiki/QXXXXXX",
    "https://www.linkedin.com/company/brandname"
  ]
}
</script>
```

### 2. `/llms.txt` Best Practice Format

```markdown
# domain.com - LLM Knowledge & Indexing Map
> Curated index for language models and RAG agents to retrieve verified brand capabilities at inference time.

## Core Capabilities
- Autonomous Campaign Management
- Real-Time Attribution & Revenue Tracking
- Cross-Platform Conversion API (CAPI) Integration

## Key Documentation
- Platform Overview: https://domain.com/overview
- API Documentation: https://domain.com/docs
- Pricing & Tiers: https://domain.com/pricing

## Full Index Archive
- Extended Knowledge Index: https://domain.com/llms-full.txt
```

---

## Best Practices & Guardrails

1. **Markdown Token Efficiency:** Keep primary `/llms.txt` files under **50 KB** to prevent single-pass LLM context truncation during RAG vector indexing.
2. **Never Block AI Crawlers:** Avoid wildcard `Disallow: /` rules in `robots.txt` that inadvertently block `Google-Extended` or `GPTBot`.
3. **Synchronize SameAs Entity Links:** Ensure JSON-LD `sameAs` array links to verified Wikidata QIDs, Wikipedia articles, Crunchbase, and official LinkedIn/Twitter profiles.
4. **Target Head-to-Head Comparison Prompts:** Build explicit Markdown comparison tables on official docs for queries like *"Brand vs Competitor A"*.
