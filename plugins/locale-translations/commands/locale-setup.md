---
name: locale-setup
description: Set up and configure the locale-translations MCP server
---

# Locale Setup Command

Set up the locale-translations MCP server. This command is idempotent - safe to run multiple times.

## Configuration Approach

This command configures the MCP server at the **user level** in `~/.claude.json`, pointing to the installed plugin's MCP server. This approach:
- Keeps the plugin's `.mcp.json` with safe localhost defaults (no secrets in repo)
- Stores user-specific configuration (production URLs, API keys) in user settings
- Makes the MCP available across all projects

## Execution Steps

Execute these steps in order.

### Step 1: Find Installed Plugin

Find the `locale-mcp-server` plugin's built MCP server in the marketplace cache.

**Use the Glob tool with this exact pattern:**

```
{USER_HOME}/.claude/plugins/cache/solobitcrafter-toolbox/locale-mcp-server/*/mcp-server/dist/index.js
```

Where `{USER_HOME}` is the user's home directory:
- **Windows:** `C:/Users/{username}` (use forward slashes)
- **macOS/Linux:** `/Users/{username}` or `/home/{username}`

**Example Glob calls:**
- Windows: `C:/Users/*/.claude/plugins/cache/solobitcrafter-toolbox/locale-mcp-server/*/mcp-server/dist/index.js`
- Or use the current user's path directly from context

The `*` wildcard matches any version number (e.g., `1.0.0`, `2.1.0`).

**From the result**, extract `PLUGIN_PATH` as the directory containing `mcp-server/`:
- If found: `C:/Users/pfojpm/.claude/plugins/cache/solobitcrafter-toolbox/locale-mcp-server/1.0.0/mcp-server/dist/index.js`
- Then `PLUGIN_PATH` = `C:/Users/pfojpm/.claude/plugins/cache/solobitcrafter-toolbox/locale-mcp-server/1.0.0`

**If not found:**
```
The locale-mcp-server plugin is not installed or not built.

Install it first:
1. Run: /plugin
2. Search for "locale-mcp-server" from the solobitcrafter-toolbox marketplace
3. Install the plugin
4. Run /locale-setup again
```
Done.

### Step 2: Check and Build if Needed

Use Glob to check if `{PLUGIN_PATH}/mcp-server/dist/index.js` exists.

**If dist/index.js does NOT exist:**

Use the Bash tool to build the MCP server:
- Run: `cd "{PLUGIN_PATH}/mcp-server" && npm install && npm run build`

Wait for the build to complete before proceeding.

**If dist/index.js already exists:**

Tell the user: "MCP server already built. Skipping build step."

Proceed to Step 3.

### Step 3: Read Current User Configuration

Read `~/.claude.json` and check if `mcpServers.locale-translations` exists at the root level.

**If found:**
Show user the current configuration:
```
Current configuration found in ~/.claude.json:
- API URL: {current LOCALE_API_BASE_URL}
- TLS verification: {disabled if NODE_TLS_REJECT_UNAUTHORIZED=0, otherwise enabled}
```

Ask: "Would you like to change the API connection settings?"
- If no: Skip to Step 5 (test connection)
- If yes: Proceed to Step 4

**If not found:**
Proceed to Step 4 to gather configuration.

### Step 4: Gather Configuration and Update User Settings

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

**Update `~/.claude.json`:**

Read the current `~/.claude.json` file. Add or update the `mcpServers.locale-translations` entry at the root level (NOT inside a project):

```json
{
  "mcpServers": {
    "locale-translations": {
      "command": "node",
      "args": ["{PLUGIN_PATH}/mcp-server/dist/index.js"],
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

**Important:**
- Use the actual resolved path for `{PLUGIN_PATH}` (e.g., `C:/Users/username/.claude/plugins/cache/solobitcrafter-toolbox/locale-mcp-server/1.0.0`)
- Preserve all other settings in `~/.claude.json`
- If `mcpServers` doesn't exist at root level, create it

After saving, inform user:

```
Configuration saved to ~/.claude.json

IMPORTANT: You must FULLY RESTART Claude Code for changes to take effect:
- Close the terminal completely
- Reopen Claude Code

NOTE: Running `/mcp restart` alone will NOT reload environment variables.
A full restart is required.

Tell me when you've restarted and are ready to test the connection.
```

Wait for user confirmation.

### Step 5: Test Connection

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
