# Install and update Synter

Synter has two Claude installation flows. They share the same plugin identity
(`synter`) and OAuth connector, but they do not update each other.

## Claude Code marketplace

Run these inside Claude Code:

```text
/plugin marketplace add Synter-Media-AI/plugin
/plugin install synter@synter
```

For an existing installation, refresh rather than adding a duplicate:

```text
/plugin marketplace update synter
/plugin update synter@synter
```

Third-party marketplaces do not auto-update unless the user enables that
setting. Restart the session after an update so hooks and the MCP connection use
the new cached plugin version.

If **Add marketplace** reports that the name already exists, the marketplace is
already configured. Open the existing `synter` marketplace or run `/plugin
marketplace list`; do not create a second marketplace with the same name.

## Claude Desktop and Cowork custom upload

1. Download `synter-plugin-<version>.zip` and
   `synter-plugin-<version>.zip.sha256` from the [latest release](https://github.com/Synter-Media-AI/plugin/releases/latest).
2. Optionally verify the download:

   ```bash
   shasum -a 256 -c synter-plugin-<version>.zip.sha256
   ```

3. Open **Customize → Plugins → Personal plugins → + → Upload plugin** and
   select the ZIP. Do not unzip it or put it inside another ZIP.
4. Start a new conversation and inspect Synter's plugin details. The current
   package reports version 1.1.3 and contains 57 skills, 7 agents, one
   SessionStart hook, and one Synter connector.
5. Use a protected Synter tool and complete the browser OAuth prompt. No API key
   belongs in Claude plugin settings or chat.

The package's authoritative identity and version come from
`.claude-plugin/plugin.json`. The bundled `assets/logo.png` is the canonical
Synter artwork, but Claude's current plugin manifest does not accept a `logo` or
`icon` field. A generic fallback avatar in a Claude surface is therefore not
evidence that the asset is missing, and adding an unsupported field would make
strict package validation fail.

To update an uploaded Synter 1.0.0, upload the current ZIP to the same
personal/manual marketplace. Claude identifies the plugin by the stable name
`synter`; the supported manual-marketplace flow overwrites a same-name plugin.
If your personal-plugin UI only offers **Remove** rather than replacement,
remove the old upload and upload the current ZIP. Do not add the GitHub
marketplace as an update workaround: that creates a second installation source
and can trigger a duplicate marketplace-name failure.

## Claude Desktop repository marketplace

Instead of a custom ZIP, Desktop can sync this repository:

1. Open **Customize → Plugins → Personal plugins → + → Add marketplace → Add
   from a repository**.
2. Enter `Synter-Media-AI/plugin` and install `synter` from the resulting
   marketplace.
3. If `synter` already appears under Personal plugins, use that existing source
   rather than adding it again.

Repository-marketplace updates and custom-upload replacements are different
operations. Keep one source for Synter unless intentionally testing both.

## Authentication and troubleshooting

- Installation adds the remote connector from `.mcp.json`. Authentication
  happens later through Synter's browser OAuth flow on the first protected tool
  call.
- The Claude connector has no static API-key header. Never paste an API key,
  access token, or authorization code into chat.
- A generic Desktop **Failed to add marketplace** message can hide a duplicate
  marketplace name. Check whether `synter` already exists before retrying.
- A generic upload failure is emitted by Claude Desktop, not this repository.
  Confirm that the file is the release ZIP, is under 50 MB, has the published
  checksum, and was not re-zipped. If those checks pass, use Claude's displayed
  diagnostics or contact Claude support; repeatedly adding marketplaces will
  not repair an upload failure.
- After an update, start a new conversation. Existing sessions can retain the
  previous plugin files and connector process.

The local npm package `@synterai/mcp-server` is a separate, MCP-only stdio
client. Installing it does not install the branded Claude plugin or update a
Desktop custom upload.
