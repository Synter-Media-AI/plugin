# Security

## Reporting a vulnerability

Email **joel@synterai.com** with the subject "Security: Synter plugin". Please include steps to reproduce. We'll acknowledge within 2 business days. Please don't open public issues for vulnerabilities.

## What this plugin does

- It contains Markdown skills, agents, and rules, plus one remote MCP server entry. It ships no executable hooks for Cursor.
- The MCP server is Synter's hosted server over HTTPS. Cursor authenticates with browser OAuth (scopes `tools:read` and `tools:write`). An API key is an optional fallback for headless use and is never stored in this repo.

## Spend and write safety

- Anything that spends money, launches campaigns, or changes budgets requires explicit user approval before it runs. Reads (`list_*`, `get_*`, reports) don't.
- Actions run only against ad accounts the user has connected and authorized in Synter.

## Data handling

Synter processes ad-account data only to perform the actions you request. See the [Privacy Policy](https://syntermedia.ai/privacy), [Terms](https://syntermedia.ai/terms), and [Security overview](https://syntermedia.ai/security).
