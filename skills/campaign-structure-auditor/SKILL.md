---
name: campaign-structure-auditor
description: Audit a Google Ads account's structure — ad group focus, keyword duplication, match-type distribution, cross-campaign conflicts, and naming consistency. Use when a user wants an account audit, asks why an account is hard to manage, or suspects duplicate keywords or messy structure.
---

# Campaign Structure Auditor

Good structure is why an account is cheap to run and easy to read. This audit finds the structural drag before it costs money. Reads only; fixes are separate, approved changes.

Confirm the account: `list_connected_accounts`, then read the real structure with `run_gaql_query` (campaigns, ad groups, keywords with match types, negatives) and `pull_google_ads_performance` for where spend actually sits.

## What to audit

- **Ad group focus:** each ad group should own a tight theme so its RSAs stay relevant. Sprawling ad groups with unrelated keywords drag Quality Score and CTR.
- **Keyword duplication:** the same keyword in multiple ad groups or campaigns makes them bid against each other and inflate CPC. Flag duplicates and where they overlap.
- **Match-type distribution:** a healthy mix with control. Broad-heavy accounts without strong negatives leak spend (see **negative-keywords**); all-exact accounts miss reachable demand.
- **Cross-campaign conflict:** two campaigns competing for the same query. Resolve with campaign-level negatives so each owns its intent.
- **Negatives coverage:** shared and campaign-level lists in place, or new match surface is unguarded.
- **Naming consistency:** a readable, consistent naming grammar. Inconsistent names make the account unmanageable and break UTM reconciliation (see **utm-builder**).

## Report

Rank findings by cost and effort: what wastes the most spend, what is the quickest structural fix. For each, name the specific campaigns or ad groups and the concrete change. Then, on approval, apply fixes through the plan tools and re-audit.

## Rules

- Point to real campaigns, ad groups, and keywords with the IDs the tools return; never generalize without evidence.
- Weight findings by spend impact, not tidiness for its own sake.
- Structural fixes are approved changes, applied one at a time and re-checked.
