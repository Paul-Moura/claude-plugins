---
name: Locale Manager
description: This skill should be used when the user asks to "implement localization", "add translations", "manage locale keys", "audit translations", "import/export translations", or when implementing i18n in an application.
version: 1.0.0
---

# Locale Manager

This skill enables comprehensive management of locale translations through the locale MCP server. It provides workflows for implementing localization in applications, managing existing translations, auditing for missing entries, and performing bulk import/export operations.

## Overview

The Locale Manager skill facilitates two primary workflows:

1. **Implementation Workflow** - Add localization to applications by finding existing translations, generating consistent keys, creating new translations, and producing localized code.

2. **Management Workflow** - Maintain translation quality by auditing namespaces, identifying missing translations, and performing bulk operations for import/export.

The skill integrates with seven MCP tools:
- `locale_search` - Find translations by pattern, text, or namespace
- `locale_get` - Retrieve a specific translation by key
- `locale_list_namespace` - List all translations in a namespace
- `locale_create` - Create a single translation
- `locale_update` - Modify an existing translation
- `locale_bulk_create` - Create multiple translations at once
- `locale_suggest_key` - Generate a key following naming conventions

## MCP Server Dependency

This skill requires the locale MCP server to be configured and running. The server must be registered in the Claude configuration with access to the locale REST API.

Required configuration in `claude_desktop_config.json` or project settings:

```json
{
  "mcpServers": {
    "locale-translations": {
      "command": "node",
      "args": ["path/to/locale-mcp-server/dist/index.js"],
      "env": {
        "LOCALE_API_BASE_URL": "http://localhost:5000/api/locale"
      }
    }
  }
}
```

Verify the server is operational by testing `locale_search` with a simple query before proceeding with other operations.

## Implementation Workflow

To add localization to an application or component, follow this structured approach:

### Step 1: Search for Existing Translations

Before creating any translation, search the database for existing entries that may be reusable:

```
Use locale_search with:
- query: The English text or a relevant keyword
- namespace: The application namespace (optional but recommended)
```

Example: To localize a "Submit" button, first search for existing submit translations:
- Search for `query: "Submit"` to find text matches
- Search for `query: "*.BUTTONS.SUBMIT"` to find key pattern matches

Reuse existing translations whenever possible to maintain consistency.

### Step 2: Generate Consistent Key Names

For strings that need new translations, use `locale_suggest_key` to generate properly formatted keys:

```
Use locale_suggest_key with:
- application: The application identifier (e.g., "MY_APP")
- component: The component path (e.g., "SETTINGS.PROFILE")
- category: The type of text (BUTTONS, LABELS, MESSAGES, VALIDATIONS, ERRORS, TITLES, PLACEHOLDERS)
- purpose: Brief description of the text's purpose
```

The tool returns a suggested key following the `APP.COMPONENT.CATEGORY.KEY` convention.

### Step 3: Create Missing Translations

For a single translation:

```
Use locale_create with:
- key: The full translation key
- en: English text
- es: Spanish text
```

For multiple translations (3 or more), use bulk operations:

```
Use locale_bulk_create with:
- translations: Array of objects, each containing key, en, and es
```

Example bulk payload:
```json
{
  "translations": [
    { "key": "MY_APP.AUTH.BUTTONS.LOGIN", "en": "Log In", "es": "Iniciar Sesion" },
    { "key": "MY_APP.AUTH.BUTTONS.LOGOUT", "en": "Log Out", "es": "Cerrar Sesion" },
    { "key": "MY_APP.AUTH.LABELS.EMAIL", "en": "Email", "es": "Correo Electronico" }
  ]
}
```

### Step 4: Generate Localized Code

After creating translations, generate code using the application's localization library. Common patterns:

**React with i18next:**
```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <button>{t('MY_APP.AUTH.BUTTONS.LOGIN')}</button>;
}
```

**Angular with ngx-translate:**
```html
<button>{{ 'MY_APP.AUTH.BUTTONS.LOGIN' | translate }}</button>
```

**Vue with vue-i18n:**
```vue
<button>{{ $t('MY_APP.AUTH.BUTTONS.LOGIN') }}</button>
```

Always verify the localization library pattern used in the target codebase before generating code.

## Management Workflow

To audit and maintain translations, use these procedures:

### Audit Translations in a Namespace

To review all translations within a feature or component:

```
Use locale_list_namespace with:
- namespace: The prefix to audit (e.g., "MY_APP.SETTINGS")
- page: Start with 1
- pageSize: 50 (or larger for comprehensive review)
```

Review the returned translations for:
- Inconsistent naming patterns
- Missing categories
- Outdated or incorrect text
- Duplicate concepts with different keys

### Find Missing Translations

To identify translations that exist in English but lack Spanish equivalents (or vice versa):

1. Use `locale_list_namespace` to retrieve all translations in a namespace
2. Filter results where `en` is present but `es` is null/empty (or reverse)
3. Use `locale_update` to add the missing language values

For systematic missing translation detection:

```
Use locale_search with:
- namespace: Target namespace
- language: "en" (to find English-only entries)
```

Then compare against Spanish-only entries to identify gaps.

### Bulk Import from JSON/CSV

To import translations from an external file:

1. Read the source file (JSON or CSV format)
2. Transform each entry to the required format:
   ```json
   { "key": "...", "en": "...", "es": "..." }
   ```
3. Use `locale_bulk_create` with the transformed array
4. Review the response for any failed entries and address individually

Expected JSON import format:
```json
[
  { "key": "APP.FEATURE.BUTTONS.SAVE", "en": "Save", "es": "Guardar" },
  { "key": "APP.FEATURE.BUTTONS.CANCEL", "en": "Cancel", "es": "Cancelar" }
]
```

Expected CSV import format:
```
key,en,es
APP.FEATURE.BUTTONS.SAVE,Save,Guardar
APP.FEATURE.BUTTONS.CANCEL,Cancel,Cancelar
```

### Export Namespace to File

To export translations for backup, sharing, or external editing:

1. Use `locale_list_namespace` to retrieve all translations (paginate if necessary)
2. Transform results to desired format (JSON or CSV)
3. Write to file

For large namespaces, iterate through all pages:
```
page 1: locale_list_namespace(namespace, page=1, pageSize=100)
page 2: locale_list_namespace(namespace, page=2, pageSize=100)
... continue until all entries retrieved
```

## Key Naming Convention

All translation keys follow a hierarchical structure using upper snake case:

```
APPLICATION.COMPONENT.CATEGORY.KEY
```

### Structure Components

| Level | Description | Examples |
|-------|-------------|----------|
| APPLICATION | Top-level app identifier | `MY_APP`, `ADMIN_PORTAL`, `MOBILE_APP` |
| COMPONENT | Feature or component path | `AUTH`, `SETTINGS.PROFILE`, `DASHBOARD.WIDGETS` |
| CATEGORY | Type of text content | `BUTTONS`, `LABELS`, `MESSAGES`, `VALIDATIONS` |
| KEY | Specific identifier | `SUBMIT`, `EMAIL_REQUIRED`, `WELCOME_BACK` |

### Standard Categories

- **BUTTONS** - Button labels and action text
- **LABELS** - Form labels, field names, headers
- **MESSAGES** - Informational messages, notifications
- **VALIDATIONS** - Form validation error messages
- **ERRORS** - Error messages and alerts
- **TITLES** - Page titles, section headers
- **PLACEHOLDERS** - Input placeholder text
- **TOOLTIPS** - Hover text and helper information
- **CONFIRMATIONS** - Confirmation dialog text

### Key Formatting Rules

1. Use UPPER_SNAKE_CASE for all segments
2. Separate hierarchy levels with periods (.)
3. Keep keys descriptive but concise
4. Avoid abbreviations unless universally understood
5. Use consistent terminology across the application

**Correct examples:**
- `MY_APP.AUTH.BUTTONS.LOGIN`
- `MY_APP.SETTINGS.PROFILE.LABELS.FIRST_NAME`
- `MY_APP.CHECKOUT.VALIDATIONS.CARD_NUMBER_INVALID`

**Incorrect examples:**
- `myApp.auth.buttons.login` (wrong case)
- `MY_APP_AUTH_BUTTONS_LOGIN` (missing periods)
- `MY_APP.AUTH.BTN.LOGIN` (unclear abbreviation)

## Best Practices

### Always Search Before Creating

Before adding any translation, search for existing entries. This prevents:
- Duplicate keys with slightly different names
- Inconsistent translations of the same concept
- Wasted effort recreating existing work

Search strategies:
1. Search by the exact English text
2. Search by key pattern for similar features
3. Search by namespace to see related translations

### Use Bulk Operations for Efficiency

When creating 3 or more translations, always use `locale_bulk_create`:
- Reduces API calls and improves performance
- Provides atomic-like behavior for related translations
- Returns comprehensive status for each entry
- Easier to track and verify batch operations

### Group Keys by Component and Feature

Organize translations logically:
- Keep all translations for a component in the same namespace
- Use consistent category names across the application
- Co-locate related translations (e.g., a form's labels and validations)

### Provide Both Languages

Always create translations with both English and Spanish values:
- Prevents runtime fallback issues
- Ensures complete localization coverage
- Makes auditing easier

If a Spanish translation is unavailable, use a clear placeholder like `[TODO: Spanish translation needed]` rather than leaving it empty.

### Validate Before Bulk Operations

Before executing `locale_bulk_create`:
- Verify all keys follow the naming convention
- Check for duplicate keys in the batch
- Confirm no keys already exist in the database
- Review all translations for accuracy

### Document Context in Key Names

Choose key names that convey meaning:
- `MY_APP.CHECKOUT.ERRORS.PAYMENT_DECLINED` (clear purpose)
- `MY_APP.CHECKOUT.ERRORS.ERROR_1` (unclear, avoid)

Future maintainers should understand the key's purpose from its name alone.
