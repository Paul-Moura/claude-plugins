---
name: locale-reset
description: Remove locale-translations MCP server configuration for fresh setup
---

# Locale Reset Command

Reset the locale-translations MCP server configuration to defaults. This is useful for testing the setup process, reconfiguring from scratch, or fixing configuration issues.

## What This Command Does

1. Resets the plugin's `.mcp.json` to default settings (localhost:5001)
2. Removes any legacy user-level config from `~/.claude.json` (if present)
3. Removes any project-level disabled entries (if present)

## Execution Steps

### Step 1: Detect Plugin Location

Find the `locale-mcp-server` plugin's `.mcp.json`:

1. **Marketplace cache**:
   ```
   Pattern: ~/.claude/plugins/cache/solobitcrafter-toolbox/locale-mcp-server/*/.mcp.json
   ```

2. **Development**:
   ```
   Pattern: ~/source/GitHub/claude-plugins/plugins/locale-mcp-server/.mcp.json
   ```

Use Glob to find the file. Store directory as `PLUGIN_ROOT`.

### Step 2: Reset Plugin Configuration

Write the default configuration to `{PLUGIN_ROOT}/.mcp.json`:

```json
{
  "mcpServers": {
    "locale-translations": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/mcp-server/dist/index.js"],
      "env": {
        "LOCALE_API_BASE_URL": "https://localhost:5001/api/locale",
        "NODE_TLS_REJECT_UNAUTHORIZED": "0"
      }
    }
  }
}
```

### Step 3: Remove Legacy User-Level Config

Read `~/.claude.json` and check for `mcpServers.locale-translations` at the root level.

**If found:**
- Remove the `locale-translations` entry from root `mcpServers`
- If `mcpServers` becomes empty, remove the empty object
- Report: "Removed legacy user-level configuration"

**If not found:**
- Report: "No legacy user-level configuration found"

### Step 4: Remove Project-Level Disabled Entries

Check `~/.claude.json` for any `projects[*].disabledMcpServers` arrays containing "locale-translations".

**For each project that has it:**
- Remove "locale-translations" from the `disabledMcpServers` array
- Report which project paths were updated

### Step 5: Confirm Reset

Tell the user:

```
Configuration reset complete:

Plugin .mcp.json: Reset to defaults
- API URL: https://localhost:5001/api/locale
- TLS verification: Disabled (for self-signed certs)

Legacy user-level config: [Removed / Not found]
Project-level disabled entries: [List of cleared projects / Not found]

To configure for a different API, run /locale-setup

To apply changes, fully restart Claude Code (close and reopen terminal).
```
