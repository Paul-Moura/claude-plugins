---
name: locale-setup
description: Set up and configure the locale-translations MCP server
---

# Locale Setup Command

Set up the locale-translations MCP server. This command is idempotent - safe to run multiple times.

## Configuration Approach

This command configures the **plugin's `.mcp.json`** file directly. This is the recommended approach because:
- Configuration stays with the plugin
- Uses `${CLAUDE_PLUGIN_ROOT}` variable for portable paths
- No need for user-level overrides in `~/.claude.json`
- Available in all projects when the plugin is installed

## Execution Steps

Execute these steps in order.

### Step 1: Detect Plugin Location

Find the `locale-mcp-server` plugin. Check these locations in order:

1. **Marketplace cache** (installed via plugin system):
   ```
   Pattern: ~/.claude/plugins/cache/solobitcrafter-toolbox/locale-mcp-server/*/.mcp.json
   ```

2. **Development** (local git repo):
   ```
   Pattern: ~/source/GitHub/claude-plugins/plugins/locale-mcp-server/.mcp.json
   Or ask the user for the path.
   ```

Use the Glob tool to find the `.mcp.json` file. Store the directory as `PLUGIN_ROOT`.

**If not found:**
```
The locale-mcp-server plugin is not installed.

Install it first:
1. Run: /plugin
2. Search for "locale-mcp-server" from the solobitcrafter-toolbox marketplace
3. Install the plugin
4. Run /locale-setup again
```
Done.

### Step 2: Check and Build if Needed

Use Glob to check if `{PLUGIN_ROOT}/mcp-server/dist/index.js` exists.

**If dist/index.js does NOT exist:**

Use the Bash tool to build the MCP server:
- Run: `cd "{PLUGIN_ROOT}/mcp-server" && npm install && npm run build`

Wait for the build to complete before proceeding.

**If dist/index.js already exists:**

Tell the user: "MCP server already built. Skipping build step."

Proceed to Step 3.

### Step 3: Check for Legacy User-Level Config

Read `~/.claude.json` and check if `mcpServers.locale-translations` exists at the root level.

**If found:**

Warn the user:
```
WARNING: Found legacy user-level MCP configuration in ~/.claude.json

This is no longer needed - the plugin's .mcp.json handles configuration.
Having both can cause confusion with duplicate entries in /mcp.

Recommendation: Remove the user-level config.
```

Ask: "Remove the legacy user-level configuration?"
- If yes: Remove `mcpServers.locale-translations` from `~/.claude.json` (preserve other servers)
- If no: Continue (user will have duplicate entries)

### Step 4: Read Current Plugin Configuration

Read `{PLUGIN_ROOT}/.mcp.json` to see current settings.

Show user:
```
Current configuration:
- API URL: {current LOCALE_API_BASE_URL}
- TLS verification: {disabled if NODE_TLS_REJECT_UNAUTHORIZED=0, otherwise enabled}
```

Ask: "Would you like to change the API connection settings?"
- If no: Skip to Step 6 (test connection)
- If yes: Proceed to Step 5

### Step 5: Gather Configuration and Update Plugin

Use AskUserQuestion to gather configuration:

**Question 1: API Environment**
- Question: "Which locale translation API do you want to connect to?"
- Header: "API"
- Options:
  - "Production API (Recommended)" - Connect to the production locale translation service
  - "Local Development (HTTPS)" - localhost:5001 with self-signed certificate
  - "Local Development (HTTP)" - localhost:5000 without TLS

**If Production API selected:**
Ask a follow-up question for the production URL:
- Question: "Enter your production API base URL (e.g., https://api.yourcompany.com/api/locale)"
- This requires the "Other" option - let user type their URL

**Question 2: TLS Verification** (ask for Production API and Local HTTPS)
- Question: "Disable TLS certificate verification? (Required for self-signed certificates)"
- Header: "TLS"
- Options:
  - "Yes - Disable verification" - Required for self-signed certs
  - "No - Keep verification enabled (Recommended for production)" - Use proper certificates

**Question 3: API Key**
- Question: "Does your API require an API key?"
- Header: "API Key"
- Options:
  - "No API key required"
  - "Yes, I need to provide an API key"

If API key needed, ask for the key value.

**Determine the API URL based on selection:**
- Production API: Use the URL provided by the user
- Local Development (HTTPS): `https://localhost:5001/api/locale`
- Local Development (HTTP): `http://localhost:5000/api/locale`

**Update the plugin's `.mcp.json`:**

Write the updated configuration to `{PLUGIN_ROOT}/.mcp.json`:

```json
{
  "mcpServers": {
    "locale-translations": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/mcp-server/dist/index.js"],
      "env": {
        "LOCALE_API_BASE_URL": "{user_provided_url}"
      }
    }
  }
}
```

Add to env if applicable:
- TLS disabled: `"NODE_TLS_REJECT_UNAUTHORIZED": "0"`
- API key: `"LOCALE_API_KEY": "{user_provided_key}"`

**Important:** Always use `${CLAUDE_PLUGIN_ROOT}` in args - this variable resolves to the plugin's installation path automatically.

After saving, inform user:

```
Configuration saved to plugin's .mcp.json

IMPORTANT: You must FULLY RESTART Claude Code for changes to take effect:
- Close the terminal completely
- Reopen Claude Code

NOTE: Running `/mcp restart` alone will NOT reload environment variables.
A full restart is required.

Tell me when you've restarted and are ready to test the connection.
```

Wait for user confirmation.

### Step 6: Test Connection

Call `mcp__locale-translations__locale_search` with query: "test"

**If successful:**
```
Setup complete! The locale-translations MCP server is configured and working.

Available tools:
- locale_search - Find translations by pattern or text
- locale_get - Get a specific translation by key
- locale_list_namespace - List translations in a namespace
- locale_create - Create a new translation
- locale_update - Update an existing translation
- locale_bulk_create - Create multiple translations
- locale_suggest_key - Generate a key following conventions

Use /locale-manager for guided translation workflows.
```

**If failed:**
```
Connection test failed. Please verify:
1. The API server is running at: {configured_url}
2. The URL is accessible
3. API key is correct (if required)

Error: {error_message}

Run /locale-setup again to reconfigure.
```
