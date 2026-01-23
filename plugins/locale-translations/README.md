# Locale Translations Plugin

A Claude Code plugin for managing locale translations via REST API. This plugin provides an MCP server, skill, and agent that enable AI agents to interact with a locale translation database.

## Overview

The locale-translations plugin enables:
- **Searching** existing translations by key pattern, text, or namespace
- **Creating** new translations with English and Spanish values
- **Updating** existing translations
- **Bulk operations** for efficient batch processing
- **Key generation** following naming conventions

## Installation

### Quick Setup (Recommended)

1. **Add the marketplace** (if not already added):
   ```
   /plugin marketplace add Paul-Moura/claude-plugins
   ```

2. **Install the plugin**:
   ```
   /plugin install locale-translations@solobitcrafter-toolbox
   ```

3. **Run the setup skill**:
   ```
   /locale-setup
   ```

The setup skill will guide you through building the MCP server, configuring the API connection, and testing everything works.

### Manual Setup

If you prefer to configure manually, follow these steps:

#### 1. Install the Plugin

```
/plugin marketplace add Paul-Moura/claude-plugins
/plugin install locale-translations@solobitcrafter-toolbox
```

#### 2. Build the MCP Server

Navigate to the installed plugin location and build:

```bash
cd ~/.claude/plugins/cache/solobitcrafter-toolbox/locale-translations/1.0.0/mcp-server
npm install
npm run build
```

#### 3. Configure the MCP Server

Add the MCP server configuration to your `~/.claude.json` file:

```json
{
  "mcpServers": {
    "locale-translations": {
      "command": "node",
      "args": ["C:/Users/YOUR_USERNAME/.claude/plugins/cache/solobitcrafter-toolbox/locale-translations/1.0.0/mcp-server/dist/index.js"],
      "env": {
        "LOCALE_API_BASE_URL": "http://localhost:5000/api/locale",
        "LOCALE_API_KEY": "your-api-key-if-required"
      }
    }
  }
}
```

**Note:** Replace `YOUR_USERNAME` with your actual username, and adjust the path separator for your OS.

#### 4. Restart Claude Code

Restart Claude Code or run `/mcp restart locale-translations` to load the MCP server.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `LOCALE_API_BASE_URL` | Yes | Base URL of the locale REST API (e.g., `http://localhost:5000/api/locale`) |
| `LOCALE_API_KEY` | No | API key for authentication if the API requires it |
| `NODE_TLS_REJECT_UNAUTHORIZED` | No | Set to `"0"` to disable TLS verification for self-signed certificates |

## Available MCP Tools

The plugin provides 7 MCP tools for managing translations:

| Tool | Description |
|------|-------------|
| `locale_search` | Search translations by key pattern, text content, or namespace. Supports wildcards (e.g., `*.BUTTONS.*`). Use this BEFORE creating new translations. |
| `locale_get` | Retrieve a specific translation by its exact key. Returns all language values. |
| `locale_list_namespace` | List all translations under a namespace prefix with pagination. Useful for exploring existing translations in a feature area. |
| `locale_create` | Create a new translation with key, English (en), and Spanish (es) values. Keys must follow the naming convention. |
| `locale_update` | Update an existing translation's text values. Supports partial updates (just en, just es, or both). |
| `locale_bulk_create` | Create multiple translations in a single operation. Uses upsert behavior - existing keys are updated, new keys are created. |
| `locale_suggest_key` | Generate a suggested translation key based on application, component, category, and purpose. Helps maintain consistent naming. |

### Tool Parameters

#### locale_search

| Parameter | Required | Description |
|-----------|----------|-------------|
| `query` | Yes | Search text, key pattern, or wildcard (e.g., `"Submit"`, `"*.BUTTONS.*"`) |
| `namespace` | No | Filter results to a specific namespace prefix |
| `language` | No | Filter by language (`en` or `es`) |

#### locale_get

| Parameter | Required | Description |
|-----------|----------|-------------|
| `key` | Yes | Exact translation key (e.g., `"MY_APP.BUTTONS.SUBMIT"`) |
| `language` | No | Specific language to retrieve |

#### locale_list_namespace

| Parameter | Required | Description |
|-----------|----------|-------------|
| `namespace` | Yes | Namespace prefix to list (e.g., `"MY_APP.AUTH"`) |
| `page` | No | Page number (1-based, default: 1) |
| `pageSize` | No | Results per page (default: 50, max: 100) |

#### locale_create

| Parameter | Required | Description |
|-----------|----------|-------------|
| `key` | Yes | Full key following `APP.COMPONENT.CATEGORY.KEY` convention |
| `en` | Yes | English translation text |
| `es` | Yes | Spanish translation text |

#### locale_update

| Parameter | Required | Description |
|-----------|----------|-------------|
| `key` | Yes | Existing translation key to update |
| `en` | No | Updated English text (omit to leave unchanged) |
| `es` | No | Updated Spanish text (omit to leave unchanged) |

#### locale_bulk_create

| Parameter | Required | Description |
|-----------|----------|-------------|
| `translations` | Yes | Array of `{key, en, es}` objects |

#### locale_suggest_key

| Parameter | Required | Description |
|-----------|----------|-------------|
| `application` | Yes | Application identifier (e.g., `"MyApp"`) |
| `component` | Yes | Component path (e.g., `"settings/profile"`) |
| `category` | Yes | Category: BUTTONS, LABELS, MESSAGES, VALIDATIONS, ERRORS, TITLES, PLACEHOLDERS, HINTS, TOOLTIPS, CONFIRMATIONS, NOTIFICATIONS, NAVIGATION, ACTIONS, STATUS |
| `purpose` | Yes | Brief description (e.g., `"submit button"`) |

## Skill: Locale Setup

The **locale-setup** skill automates the MCP server setup process.

**Trigger:** `/locale-setup`

**What it does:**
1. Detects the installed plugin location
2. Checks if the MCP server is built (builds if needed)
3. **Prompts for API environment:**
   - Production API (for deployed services)
   - Local Development HTTPS (localhost:5001 with self-signed cert)
   - Local Development HTTP (localhost:5000)
4. Configures TLS settings for self-signed certificates
5. Asks for API key if required
6. Configures the MCP server in your Claude settings
7. Tests the connection

Use this skill for initial setup or when reconfiguring the API connection.

## Skill: Locale Manager

The **locale-manager** skill provides structured workflows for translation management.

**Trigger phrases:**
- "implement localization"
- "add translations"
- "manage locale keys"
- "audit translations"
- "import/export translations"

**Key workflows:**

1. **Implementation Workflow** - Add localization to applications:
   - Search for existing translations
   - Generate consistent key names
   - Create missing translations
   - Generate localized code

2. **Management Workflow** - Maintain translations:
   - Audit namespaces
   - Find missing translations
   - Bulk import/export

## Agent: Locale Implementer

The **locale-implementer** agent specializes in implementing localization in existing codebases.

**Use when:**
- "Localize this component"
- "Add i18n to this file"
- "Find hardcoded strings and replace with translations"

**What it does:**
1. Analyzes code for hardcoded user-facing strings
2. Searches for existing translations to reuse
3. Generates key suggestions for new strings
4. Creates missing translations via MCP tools
5. Rewrites code using the localization library

## Example Workflows

### Workflow 1: Localize a New Component

```
1. Use locale_search to check for existing translations:
   query: "Submit"
   namespace: "MY_APP"

2. Use locale_suggest_key to generate keys for new strings:
   application: "MY_APP"
   component: "checkout"
   category: "BUTTONS"
   purpose: "place order button"

3. Use locale_bulk_create to add all translations:
   translations: [
     { key: "MY_APP.CHECKOUT.BUTTONS.PLACE_ORDER", en: "Place Order", es: "Realizar Pedido" },
     { key: "MY_APP.CHECKOUT.LABELS.SHIPPING_ADDRESS", en: "Shipping Address", es: "Direccion de Envio" }
   ]

4. Update your code to use the translation keys
```

### Workflow 2: Audit Translations in a Namespace

```
1. Use locale_list_namespace to review all translations:
   namespace: "MY_APP.AUTH"
   pageSize: 100

2. Review for:
   - Missing Spanish translations
   - Inconsistent key naming
   - Duplicate concepts

3. Use locale_update to fix any issues
```

### Workflow 3: Bulk Import from JSON

```
1. Read your JSON file with translations

2. Use locale_bulk_create with the translations array:
   translations: [
     { key: "APP.FEATURE.LABELS.NAME", en: "Name", es: "Nombre" },
     { key: "APP.FEATURE.LABELS.EMAIL", en: "Email", es: "Correo" },
     ...
   ]

3. Review the response for any failed entries
```

## Key Naming Convention

All translation keys follow this format:

```
APPLICATION.COMPONENT.CATEGORY.KEY
```

**Examples:**
- `MY_APP.AUTH.BUTTONS.LOGIN` - Login button
- `MY_APP.SETTINGS.PROFILE.LABELS.EMAIL` - Email label
- `MY_APP.CHECKOUT.VALIDATIONS.CARD_INVALID` - Card validation error

**Rules:**
- Use UPPER_SNAKE_CASE
- Separate levels with periods (.)
- Keep keys descriptive but concise

**Standard Categories:**
- BUTTONS - Button labels
- LABELS - Form labels, field names
- MESSAGES - Informational messages
- VALIDATIONS - Form validation errors
- ERRORS - Error messages
- TITLES - Page/section titles
- PLACEHOLDERS - Input placeholders
- TOOLTIPS - Hover text

## Troubleshooting

### MCP Server Not Connecting

1. Verify the server is built:
   ```bash
   cd plugins/locale-translations/mcp-server
   npm run build
   ls dist/index.js  # Should exist
   ```

2. Check the path in your configuration is correct and absolute

3. Ensure the REST API is running and accessible at `LOCALE_API_BASE_URL`

4. Test the API directly:
   ```bash
   curl http://localhost:5000/api/locale/search?query=test
   ```

### "Key Not Found" Errors

- Verify the key exists using `locale_search`
- Check for typos in the key name
- Ensure you're using the exact key, not a partial match

### "Invalid Key Format" Errors

- Keys must use UPPER_SNAKE_CASE
- Keys must have at least 3 segments: `APP.COMPONENT.KEY`
- No spaces or special characters (only letters, numbers, underscores, periods)

### Bulk Operations Partially Failing

- Check the response for specific failure reasons
- Invalid keys are reported individually
- Fix and retry failed entries using `locale_create`

### API Connection Refused

- Verify `LOCALE_API_BASE_URL` is correct
- Ensure the locale REST API service is running
- Check firewall/network settings if the API is on a different host

## License

MIT
