---
name: competitor-analysis
description: "ANY competitor research — PPC budget, paid keywords, live ads, keyword gaps, video benchmarking, channel mix. MUST load before research_competitor_spyfu, get_competitor_ads, analyze_keyword_gap."
synter:
  tools:
    - synter.query
    - synter.artifacts
    - synter.memory
  permissions:
    read:
      - campaigns
      - metrics
  approval: none
  outputs:
    - type: account_audit
---

# Competitor Analysis

Search and analyze competitor ads using a stack of data sources: SpyFu (PPC budgets, paid keywords, ad copy history), Adyntel (live ad creative across Meta/Google/LinkedIn/Reddit), Apify + GPT-4o vision (video benchmarking), and Facebook Ads Library directly. This skill is the entry point for ALL competitor-research user intents.

## Tool Decision Matrix (which tool for which question)

**Rule 0 — user-named tools win.** If the user explicitly names a tool or data source ("use spyfu", "with adyntel", "check the ads library"), call that tool first, even if another tool would otherwise match better. User intent beats keyword inference.

**Choose the right tool for what the user is asking:**

| User Intent | Tool | Data Source |
|---|---|---|
| "What's X's PPC budget?" | `research_competitor_spyfu` | SpyFu — PPC budget estimates |
| "Show me X's ad copy" | `get_competitor_ad_copy` | SpyFu — historical ad text |
| "What's X running on Meta/Google/LinkedIn right now?" | `get_competitor_ads` | Adyntel — live ad creative |
| "Show me competitor images/videos" | `get_competitor_ads` | Adyntel — live ad creative with assets |
| "What keywords is X bidding on?" | `research_competitor_spyfu` | SpyFu — paid keywords |
| "Find keyword gaps vs competitors" | `analyze_keyword_gap` | SpyFu — Kombat analysis |
| "Show me competitor Facebook ads" | `get_competitor_ads` | Adyntel — Meta Ads Library |
| "How does my video compare to competitors?" | `benchmark_video_creative` | Apify + GPT-4o vision |
| "What makes competitor video ads effective?" | `benchmark_video_creative --analyze-only` | Apify + GPT-4o vision |
| "Top landing pages competitor X pushes" | `get_competitor_landing_pages` | SpyFu |
| "Compare PPC budgets" | `benchmark_ppc_budgets` | SpyFu |
| "Is X more SEO or PPC heavy?" | `analyze_channel_mix` | SpyFu |

**When to combine tools:** For a full competitive picture, combine SpyFu (PPC budgets, paid keywords, ad copy) + Adyntel `get_competitor_ads` (live creative evidence) + `web_search` (qualitative signals and public traffic estimates).

**Platform-scoped live-ad rule:** If the user explicitly says "LinkedIn only", "Meta only", "Google only", or otherwise asks what a competitor is running on a single live ad surface right now, use `get_competitor_ads` only. Do **not** add SpyFu or Meta-creative fallback tools unless the user separately asks for budgets, keywords, ad-copy history, or creative generation.

## Meta Ads Library workflow (legacy fallback)

Search and analyze competitor ads from Facebook Ads Library to understand their advertising strategies, messaging, and creative approaches.

## Available Tools

- **get_meta_platform_id** - Get Meta platform ID for a brand name
- **get_meta_ads** - Retrieve ads for a specific page/platform ID

## Workflows

### Find a Competitor's Ads

1. Get the platform ID: Use `get_meta_platform_id` with the brand name
2. Fetch their ads: Use `get_meta_ads` with the platform ID
3. Analyze the results for patterns in messaging, offers, and creative types

### Analyze Competitor Strategy

```
1. Search for competitor by name/domain
2. Review active ad creatives
3. Identify:
   - Primary messaging themes
   - Offers and promotions
   - Call-to-action patterns
   - Creative formats (image, video, carousel)
   - Target audience signals
```

### Compare Multiple Competitors

Use batch capabilities to query multiple brands simultaneously:
- Pass an array of brand names to `get_meta_platform_id`
- Pass an array of platform IDs to `get_meta_ads`

## Example Prompts

- "What ads is [competitor] currently running?"
- "Compare ad strategies between [brand A] and [brand B]"
- "Find ads from [competitor] and summarize their messaging"
- "What offers is [competitor] promoting right now?"

## Automated Analysis

Run `scripts/analyze-competitor.py` to generate a strategy summary:

```bash
python scripts/analyze-competitor.py "BrandName"
```

This outputs:
- Ad count and formats
- Common messaging themes
- Offers and CTAs
- Creative type breakdown
