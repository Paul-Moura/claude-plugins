<objective>
Create a Claude Code MCP (Model Context Protocol) server plugin that enables AI agents to interact with the locale translation database through the REST API.

This plugin allows agents to:
- Search for existing translations before creating duplicates
- Retrieve translations for implementation reference
- Insert new translations when implementing localization
- Update existing translations when refactoring

The goal is to eliminate manual translation entry by users when agents implement localization in applications.
</objective>

<context>
Prerequisites:
- The REST API from prompt 001 must be running and accessible
- API base URL will be configurable via environment variable

The locale system:
- Supports English (en) and Spanish (es)
- Uses upper snake case keys with period namespaces
- Format: `APPLICATION_NAME.FOLDER_NAME.COMPONENT_NAME.CATEGORY.KEY`
- Example: `MY_APP.SETTINGS.PROFILE.BUTTONS.SUBMIT`

This MCP server will be used during:
1. New application development - agents need to create translation keys
2. Refactoring - agents need to find and reuse existing translations
3. Adding features - agents need to check what translations exist in a namespace
</context>

<requirements>
Create an MCP server with the following tools:

1. **locale_search**
   - Description: "Search for existing locale translations by key pattern, text content, or namespace"
   - Parameters:
     - `query` (required): Search text or key pattern (supports wildcards like `*.BUTTONS.*`)
     - `namespace` (optional): Filter to specific namespace prefix
     - `language` (optional): Filter to specific language (en/es)
   - Returns: Array of matching translations with keys and all language values
   - Use case: Agent checks if "Submit" button translation already exists before creating

2. **locale_get**
   - Description: "Get a specific translation by its exact key"
   - Parameters:
     - `key` (required): Full translation key
     - `language` (optional): Specific language to retrieve
   - Returns: Translation object or null if not found
   - Use case: Agent retrieves exact translation for code implementation

3. **locale_list_namespace**
   - Description: "List all translations under a namespace prefix"
   - Parameters:
     - `namespace` (required): Namespace prefix (e.g., `MY_APP.AUTH`)
     - `page` (optional): Page number for pagination
     - `pageSize` (optional): Results per page (default 50)
   - Returns: Paginated list of translations in namespace
   - Use case: Agent explores what translations exist in a feature area

4. **locale_create**
   - Description: "Create a new locale translation with key and language values"
   - Parameters:
     - `key` (required): Full translation key following naming convention
     - `en` (required): English translation text
     - `es` (required): Spanish translation text
   - Returns: Created translation object or error if key exists
   - Use case: Agent adds new translation during localization implementation

5. **locale_update**
   - Description: "Update an existing translation's text values"
   - Parameters:
     - `key` (required): Existing translation key
     - `en` (optional): Updated English text
     - `es` (optional): Updated Spanish text
   - Returns: Updated translation object or error if key not found
   - Use case: Agent corrects or improves existing translation

6. **locale_bulk_create**
   - Description: "Create multiple translations in a single operation"
   - Parameters:
     - `translations` (required): Array of objects with `key`, `en`, `es` properties
   - Returns: Report with successful and failed entries
   - Use case: Agent implements localization for a component with many strings

7. **locale_suggest_key**
   - Description: "Generate a suggested translation key based on context"
   - Parameters:
     - `application` (required): Application name/identifier
     - `component` (required): Component or feature path
     - `category` (required): Category (BUTTONS, LABELS, MESSAGES, VALIDATIONS, etc.)
     - `purpose` (required): What the text is for (e.g., "submit button", "email required error")
   - Returns: Suggested key following naming convention
   - Use case: Agent needs help generating consistent key names
</requirements>

<implementation>
MCP Server Structure:
```
locale-mcp-server/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts          # MCP server entry point
│   ├── tools/            # Tool implementations
│   │   ├── search.ts
│   │   ├── get.ts
│   │   ├── list.ts
│   │   ├── create.ts
│   │   ├── update.ts
│   │   ├── bulk.ts
│   │   └── suggest.ts
│   ├── api/
│   │   └── client.ts     # REST API client wrapper
│   └── types/
│       └── locale.ts     # TypeScript interfaces
├── README.md
└── .env.example
```

Environment Configuration:
- `LOCALE_API_BASE_URL` - Base URL of the REST API (e.g., `http://localhost:5000/api/locale`)
- `LOCALE_API_KEY` - Optional API key for authentication

Key Implementation Details:
- Use the official MCP SDK for TypeScript
- Implement proper error handling with descriptive messages
- Include rate limiting awareness for bulk operations
- Log operations for debugging
- Validate key format before sending to API

Tool Response Guidelines:
- Always return structured data agents can parse
- Include helpful context in error messages
- For search results, include relevance indicators
- For bulk operations, clearly report each item's status
</implementation>

<output>
Create the MCP server in:
- `./locale-mcp-server/` - Complete MCP server package

Include configuration for Claude Code:
- `./locale-mcp-server/claude-code-config.json` - Example MCP server configuration for claude_desktop_config.json
</output>

<verification>
Before declaring complete, verify:
1. All 7 tools are implemented and registered with MCP
2. API client handles connection errors gracefully
3. Key validation matches the naming convention requirements
4. Bulk create handles partial failures correctly
5. Server starts without errors when API URL is configured
6. Tool descriptions are clear for agent understanding
</verification>

<success_criteria>
- MCP server compiles and runs with `npm start`
- All tools appear when querying server capabilities
- locale_search returns results matching query patterns
- locale_create successfully adds new translations via API
- locale_bulk_create processes 20+ translations in one call
- Error messages help agents understand and recover from failures
- README includes setup instructions and usage examples
</success_criteria>
