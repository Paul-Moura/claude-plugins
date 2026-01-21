<objective>
Add a REST API controller to the existing Blazor application that exposes CRUD operations for locale translations.

This API will serve as the backend for a Claude Code MCP server plugin, enabling AI agents to programmatically search, retrieve, and manage locale translations when implementing localization in applications.
</objective>

<context>
The Blazor application already has a common library serving as the data layer for locale translations. You need to add a controller that exposes this functionality via REST endpoints.

The locale system supports:
- English (en) and Spanish (es) translations
- Keys using upper snake case with period-separated namespaces
- Format: `APPLICATION_NAME.FOLDER_NAME.COMPONENT_NAME.CATEGORY.KEY`
- Example: `MY_APP.SETTINGS.PROFILE.BUTTONS.SUBMIT` or `MY_APP.AUTH.LOGIN.VALIDATIONS.REQUIRED.EMAIL`

@[path-to-blazor-app]/Common/* - Examine the existing data layer
@[path-to-blazor-app]/**/*Controller.cs - Review existing controller patterns
</context>

<requirements>
Create a LocaleController with the following endpoints:

1. **Search translations**
   - `GET /api/locale/search?query={text}&namespace={optional}&language={optional}`
   - Search by key pattern, translation text, or namespace prefix
   - Support wildcard searches (e.g., `*.BUTTONS.*`)
   - Return matching translations with metadata

2. **Get translation by key**
   - `GET /api/locale/{key}?language={optional}`
   - Returns all language versions if language not specified
   - 404 if key doesn't exist

3. **List translations by namespace**
   - `GET /api/locale/namespace/{namespace}`
   - Returns all keys under a namespace prefix
   - Supports pagination: `?page=1&pageSize=50`

4. **Create new translation**
   - `POST /api/locale`
   - Body: `{ "key": "...", "translations": { "en": "...", "es": "..." } }`
   - Validate key format matches convention
   - Return 409 Conflict if key exists

5. **Update translation**
   - `PUT /api/locale/{key}`
   - Body: `{ "translations": { "en": "...", "es": "..." } }`
   - Partial updates allowed (update only specified languages)
   - Return 404 if key doesn't exist

6. **Bulk operations**
   - `POST /api/locale/bulk`
   - Body: array of translations to insert/update
   - Return report of successes and failures
</requirements>

<implementation>
Follow the existing patterns in the Blazor application for:
- Controller structure and routing
- Error handling and response formats
- Authentication/authorization if applicable
- Dependency injection for data layer access

Key validation rules to enforce:
- Keys must be uppercase with underscores and periods only
- Keys must have at least 2 segments (namespace.key minimum)
- Empty translations should be rejected
- Maximum key length: 200 characters

Response format for translations:
```json
{
  "key": "APP.BUTTONS.SUBMIT",
  "translations": {
    "en": "Submit",
    "es": "Enviar"
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```
</implementation>

<output>
Create/modify files in the Blazor application:
- `./Controllers/LocaleController.cs` - Main controller with all endpoints
- `./Models/LocaleDto.cs` - Request/response DTOs
- `./Services/ILocaleService.cs` - Service interface (if not using data layer directly)

Document the API endpoints in a markdown file:
- `./docs/locale-api.md` - OpenAPI-style documentation
</output>

<verification>
Before declaring complete, verify:
1. All 6 endpoint categories are implemented
2. Key validation rejects malformed keys
3. Search returns relevant results for partial matches
4. Bulk operations handle mixed success/failure cases
5. Error responses follow consistent format
</verification>

<success_criteria>
- Controller compiles without errors
- All endpoints return appropriate HTTP status codes
- Search functionality finds translations by key pattern and text content
- Bulk insert can process 50+ translations in a single request
- API is ready for MCP server integration
</success_criteria>
