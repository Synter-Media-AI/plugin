---
name: agentic-loop-campaign-sandbox
description: Run autonomous, goal-driven agentic loops powered by Google Gemini or Azure AI Foundry to research, build, preflight, and stage multi-platform ad campaigns in safe platform sandbox environments (Google Drafts, Meta PAUSED, LinkedIn DRAFT, TikTok Sandbox) with automated Subagent Verifier review gates. Use when a user wants to run an autonomous agentic loop to launch or test multi-platform campaign ideas safely in sandboxes.
---

# Agentic Loop Campaign Sandbox Skill

How to run autonomous AI agentic loops to plan, build, audit, and stage multi-platform advertising campaigns across Google Ads, Meta, LinkedIn, TikTok, Reddit, Microsoft, and Amazon Advertising without risking live ad spend.

## Core Architecture

The Agentic Loop Campaign Sandbox uses a **4-Tier Sandbox Pipeline**:

1. **Tier 1 — Git Worktree Sandbox:** Isolated local workspace branch (`.worktrees/campaign-goal`) created dynamically per task goal to isolate file edits and temporary plan artifacts.
2. **Tier 2 — Synter Staging Database:** Campaign hierarchies (Campaign -> Ad Sets -> Keywords -> Creative Ads) stored in Synter's staging database using `create_campaign_plan` and `upsert_plan_entity`.
3. **Tier 3 — Platform Sandbox & Draft Mode:** Staged directly into native platform test/draft endpoints:
   - **Google Ads:** `CampaignDraft` / `ExperimentService` (Draft state, 0 live serve)
   - **Meta Ads (FB/IG):** Developer Sandbox Ad Account with `status="PAUSED"`
   - **LinkedIn Ads:** Campaign Manager Sandbox with `status="DRAFT"`
   - **TikTok Ads:** Sandbox Advertiser Account with `operation_status="DISABLE"`
   - **Reddit Ads:** Test Account with `configured_status="PAUSED"`
   - **Microsoft Ads:** Sandbox API Mirroring
   - **Amazon DSP / Ads:** Amazon Advertising Sandbox API endpoint
4. **Tier 4 — Subagent Verifier & Outer Loop Approval Gate:** Independent auditor subagent runs a 0–100 verification score before asking for explicit human approval to push live.

---

## Operating Workflow

### 1. Goal Engine & Decomposition
Define a clear `TaskGoal` with explicit, unambiguous acceptance criteria:
- Research audience signals and CPC/CPM benchmarks across requested platforms.
- Create structured multi-platform campaign hierarchy in Synter Staging DB.
- Stage campaign entities natively into platform Sandboxes / Draft states.
- Pass `campaign-preflight` safety audit (conversion tracking, fat-finger budget limits, geo-exclusions, ad policy compliance).

### 2. Autonomous Tool Loop (Inner Loop)
The model (Google Gemini or Azure AI Foundry) iteratively executes tool actions:
- `synter_research_opportunity`: Fetch keyword volume, audience signals, and benchmark CPCs.
- `synter_create_campaign_plan`: Generate campaign plan hierarchy and budget allocations.
- `create_platform_sandbox_campaign`: Stage entities in platform draft states.
- `synter_preflight_check`: Run automated safety checks.

### 3. Safety Guardrails & Circuit Breakers
- **Loop Detector:** Action signature hashing (`sha256(tool_name + args)`) trips a circuit breaker if the model repeats the exact tool call sequence 3 times.
- **Context Manager:** Enforces a 50,000 token budget limit and compacts conversation history.
- **Fat-Finger Budget Guard:** Hard stop if daily budget exceeds configured human safety limits (e.g. $500/day).

### 4. Independent Review Cycle (Outer Loop)
When the inner loop concludes, an independent **Subagent Verifier** evaluates the generated work against the goal's acceptance criteria:
- **Verifier Score >= 90/100:** Verification Passed ✅ -> Staged in Sandbox.
- **Verifier Score < 90/100:** Auto-Fix Triggered 🔄 -> Re-opens inner loop with verifier feedback.

---

## Command Reference

Run the Agentic Loop Campaign Sandbox from terminal or via Doppler:

```bash
# Run with Doppler Doppler key management
cd /Users/joelhorwitz/personal/agentic-loop-system
doppler run --project synter-media --config dev -- npx tsx src/demo_synter.ts

# Run interactive CLI in Guarded mode
node dist/cli.js --provider gemini --mode guarded --goal "Research & Stage Q3 B2B Campaign in Sandboxes"
```
