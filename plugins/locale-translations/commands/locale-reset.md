---
name: locale-reset
description: Remove locale-translations MCP server configuration for fresh setup
---

# Locale Reset Command

Reset the locale-translations MCP server configuration. This removes the user-level configuration from `~/.claude.json`, allowing you to run `/locale-setup` fresh.

## What This Command Does

1. Removes user-level MCP config from `~/.claude.json`
2. Removes any project-level disabled entries (if present)
3. Does NOT modify the plugin's `.mcp.json` (it has safe localhost defaults)

## Execution Steps

### Step 1: Remove User-Level Config

Read `~/.claude.json` and check for `mcpServers.locale-translations` at the root level.

**If found:**
- Remove the `locale-translations` entry from root `mcpServers`
- If `mcpServers` becomes empty, remove the empty object
- Report: "Removed user-level MCP configuration"

**If not found:**
- Report: "No user-level MCP configuration found"

### Step 2: Remove Project-Level Disabled Entries

Check `~/.claude.json` for any `projects[*].disabledMcpServers` arrays containing "locale-translations".

**For each project that has it:**
- Remove "locale-translations" from the `disabledMcpServers` array
- Report which project paths were updated

### Step 3: Confirm Reset

Tell the user:

```
Configuration reset complete:

User-level MCP config: [Removed / Not found]
Project-level disabled entries: [List of cleared projects / Not found]

To reconfigure, run /locale-setup

To apply changes, fully restart Claude Code (close and reopen terminal).
```
