# Synter agent runner (Claude Agent SDK)

A headless runner that loads the Synter plugin and runs the operator unattended — for cron jobs, pipelines, or embedding in your own app. Built on [`@anthropic-ai/claude-agent-sdk`](https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk).

The plugin (skills, agents, hooks, brand voice) is loaded with `plugins: [{ type: "local", path }]`; the Synter MCP is supplied from your environment.

## Run

```bash
cd sdk
npm install
export SYNTER_API_KEY=syn_your_api_key_here   # get one at syntermedia.ai/developer
export ANTHROPIC_API_KEY=sk-ant-...           # or use your Claude Code auth

node synter-agent.mjs "How's my spend this week, and anything wasted?"
node synter-agent.mjs "/synter:report last 7 days"
```

## Safety — read-only by default

No human is present to approve actions, so the runner is **read-only**:

- **Allowed automatically:** read tools — `list_*`, `get_*`, `pull_*`, `ga4_*`, `reconcile_platforms`, `forecast_campaign`, `find_audience_signals`, `verify_*`, plus `Read`/`Glob`/`Grep`/web search.
- **Denied:** anything that spends money or mutates an account — `create_*`, `enable_*`, `update_*_budget`, `pause_*`, `execute*`, `launch*`, `sync_*`, `attach_*`, and local `Write`/`Edit`/`Bash`. The agent is told to report what it *would* do instead.

Lift the guard only when you mean it:

```bash
node synter-agent.mjs --allow-writes "Pause anything with zero conversions and $50+ spend in 14 days"
```

`--allow-writes` lets the agent spend real money. Prefer running interactively in Claude Code (`/plugin install synter@synter`) so you approve each action.

## Cron example

```cron
# 7am daily: read-only spend digest to stdout (pipe to Slack/email in your wrapper)
0 7 * * *  cd /path/to/plugin/sdk && SYNTER_API_KEY=... node synter-agent.mjs "/synter:report yesterday" >> /var/log/synter.log 2>&1
```

## Python

The same plugin loads from the Python SDK (`pip install claude-agent-sdk`):

```python
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="/synter:report last 7 days",
    options=ClaudeAgentOptions(plugins=[{"type": "local", "path": ".."}]),
):
    ...
```

Add your own `can_use_tool` guard to enforce the same read-only default.
