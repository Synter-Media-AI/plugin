# Optional Claude Agent SDK runner

This manually invoked Node runner loads the local plugin, including its Claude remote MCP configuration and session hook. It is not started by installation and is excluded from release zips.

```bash
cd sdk
npm install
node synter-agent.mjs "/synter:report last 7 days"
```

Use the host SDK’s supported Claude authentication. Synter uses the plugin’s browser OAuth connection at `https://mcp.syntermedia.ai`. Establish that connection interactively in the host environment first. An unattended process cannot complete a browser prompt; if the host does not reuse the authorized session, run the task interactively. OAuth session reuse depends on the host and must be verified before scheduling this runner.

The runner permits the explicitly listed read tools and blocks other Synter tools by default. It also blocks local write and shell tools. Review `synter-agent.mjs` before use. The existing `--allow-writes` option removes the runner’s mutation guard; campaign instructions still require the user’s explicit approval of the action scope. Prefer interactive use when campaign changes need review.

The runner supplies no separate MCP credentials or authentication headers. Never put tokens in prompts or source files. See [support](https://syntermedia.ai/support) for OAuth connection issues.
