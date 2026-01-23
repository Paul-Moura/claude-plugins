---
name: locale-setup
description: Set up and configure the locale-translations MCP server
---

# Locale Setup Command

Set up the locale-translations MCP server. This command is idempotent - safe to run multiple times.

## IMPORTANT: Configuration Scope

**Always configure at USER-LEVEL** so the MCP server is available in ALL projects.

- **User-level** (CORRECT): Root-level `mcpServers` object in `~/.claude.json`
- **Project-level** (AVOID): Inside `projects["path/to/project"].mcpServers` - only works in that one project

This setup command configures at the USER-LEVEL by default.

## Execution Steps

Execute these steps in order.

### Step 1: Detect Plugin Location

Find the MCP server path. Check these locations in order:

1. **Marketplace cache**:
   ```
   Pattern: ~/.claude/plugins/cache/solobitcrafter-toolbox/locale-mcp-server/*/mcp-server/package.json
   ```

2. **Development** (if not found in cache):
   Check common development paths or ask the user.

Use the Glob tool to find the path. Store it as `MCP_SERVER_PATH`.

### Step 2: Check and Build if Needed

Use Glob to check if `{MCP_SERVER_PATH}/dist/index.js` exists.

**If dist/index.js does NOT exist:**

Use the Bash tool to build the MCP server:
- Run: `cd "{MCP_SERVER_PATH}" && npm install && npm run build`

Wait for the build to complete before proceeding.

**If dist/index.js already exists:**

Tell the user: "MCP server already built. Skipping build step."

Proceed to Step 3.

### Step 3: Check Configuration

Read `~/.claude.json` and check for existing configuration at BOTH levels:

1. **User-level** (correct): Root-level `mcpServers.locale-translations`
2. **Project-level** (incorrect): Any `projects[*].mcpServers.locale-translations`

**If configured at PROJECT-LEVEL only (inside a projects entry):**

Warn the user:
```
WARNING: Found locale-translations configured at PROJECT-LEVEL only.
This means it's only available in specific project(s), not globally.

Recommendation: Reconfigure at USER-LEVEL so it's available in all projects.
```

Ask: "Would you like to reconfigure at the USER-LEVEL (recommended)?"
- If yes: First remove project-level config, then proceed to Step 4
- If no: Skip to Step 5 (test connection)

**If configured at USER-LEVEL:**

Output: "MCP server already configured at USER-LEVEL in ~/.claude.json (available in all projects)"

Ask the user: "Would you like to reconfigure the API connection?"
- If no: Skip to Step 5 (test connection)
- If yes: Proceed to Step 4

**If not configured at either level:**

Proceed to Step 4.

### Step 4: Gather Configuration and Update

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

**Question 2: TLS Verification** (only if "Local Development (HTTPS)" was selected)
- Question: "Disable TLS certificate verification? (Required for self-signed certificates)"
- Header: "TLS"
- Options:
  - "Yes - Disable verification (Recommended)" - Required for local self-signed certs
  - "No - Keep verification enabled"

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

**Update ~/.claude.json at USER-LEVEL:**

Read current file and update the ROOT-LEVEL `mcpServers` object (NOT inside any `projects` entry).

**CRITICAL:** The `mcpServers` key MUST be at the root level of the JSON file, like this:

```json
{
  "numStartups": 32,
  "mcpServers": {
    "locale-translations": {
      "command": "node",
      "args": ["{MCP_SERVER_PATH}/dist/index.js"],
      "env": {
        "LOCALE_API_BASE_URL": "{user_provided_url}"
      }
    }
  },
  "projects": { ... }
}
```

**DO NOT** put the configuration inside a `projects` entry - that makes it project-specific only.

Add to env if applicable:
- TLS disabled: `"NODE_TLS_REJECT_UNAUTHORIZED": "0"`
- API key: `"LOCALE_API_KEY": "{user_provided_key}"`

**Important:**
- Use absolute path in args (e.g., `C:/Users/.../dist/index.js`)
- Preserve any existing MCP servers in `mcpServers`

After saving, inform user:

```
Configuration saved to USER-LEVEL settings (available in all projects).

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
