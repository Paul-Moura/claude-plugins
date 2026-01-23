---
name: locale-reset
description: Remove locale-translations MCP server configuration for fresh setup
---

# Locale Reset Command

Remove the locale-translations MCP server configuration from `~/.claude.json` to allow a fresh setup. This is useful for testing the setup process or reconfiguring from scratch.

## Execution Steps

### Step 1: Read Current Configuration

Read `~/.claude.json` and check if `mcpServers.locale-translations` exists.

**If not configured:**

Tell the user: "No locale-translations configuration found in ~/.claude.json. Nothing to reset."

Done.

**If configured:**

Proceed to Step 2.

### Step 2: Remove Configuration

Use the Edit tool to remove the `locale-translations` entry from `mcpServers` in `~/.claude.json`.

Be careful to:
- Only remove the `locale-translations` key, not other MCP servers
- Preserve the rest of the file structure
- Handle the case where `locale-translations` is the only entry (remove empty `mcpServers` object too)

### Step 3: Confirm Reset

Tell the user:

```
Configuration removed from ~/.claude.json.

The plugin's default configuration (.mcp.json) will be used:
- API URL: https://localhost:5001/api/locale
- TLS verification: Disabled (for self-signed certs)

To reconfigure with custom settings, run /locale-setup

To apply changes, restart Claude Code or run: /mcp restart locale-translations
```
