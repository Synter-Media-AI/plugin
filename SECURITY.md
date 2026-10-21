# Security

## Reporting a vulnerability

Email **joel@synterai.com** with the subject "Security: Synter plugin". Please include steps to reproduce. We'll acknowledge within 2 business days. Please don't open public issues for vulnerabilities.

## What this plugin does

The plugin ships Markdown skills, agents, and rules. ChatGPT, Codex, Claude, and Cursor connect to `https://mcp.synterai.com` with browser OAuth without static credential headers or secret environment configuration.

Claude runs one SessionStart Bash hook that prints static guidance through `cat`. It does not read credentials or make network requests. Cursor declares no executable hooks. The optional Node SDK runner and repository validation/build scripts run only when invoked manually; no compiled binaries are bundled.

## Spend and write safety

- Anything that spends money, launches campaigns, or changes budgets requires explicit user approval before it runs. Reads (`list_*`, `get_*`, reports) don't.
- Actions run only against ad accounts the user has connected and authorized in Synter.

## Data handling

For service data handling, see the [Privacy Policy](https://synterai.com/privacy), [Terms](https://synterai.com/terms), and [Security overview](https://synterai.com/security).
