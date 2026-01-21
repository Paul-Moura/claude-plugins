# Locale Translation API Documentation

REST API for managing locale translations. This API serves as the backend for Claude Code MCP server integration, enabling AI agents to programmatically search, retrieve, and manage locale translations.

## Base URL

```
/api/locale
```

## Authentication

Currently, no authentication is required. Consider adding API key or JWT authentication for production use.

## Key Format Convention

Translation keys follow a strict naming convention:

- **Format**: `APPLICATION_NAME.FOLDER_NAME.COMPONENT_NAME.CATEGORY.KEY`
- **Examples**:
  - `MY_APP.SETTINGS.PROFILE.BUTTONS.SUBMIT`
  - `MY_APP.AUTH.LOGIN.VALIDATIONS.REQUIRED.EMAIL`
- **Rules**:
  - Must be uppercase letters, numbers, underscores, and periods only
  - Must have at least 2 segments (namespace.key minimum)
  - Maximum length: 200 characters
  - Each segment must start with a letter

## Supported Languages

- English: `en` or `en-US`
- Spanish: `es` or `es-ES`

Additional languages can be added dynamically.

---

## Endpoints

### 1. Search Translations

Search for translations by key pattern, translation text, or namespace.

```http
GET /api/locale/search
```

#### Query Parameters

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| query     | string | No       | Search query - key pattern or translation text. Supports wildcards (*). |
| namespace | string | No       | Namespace prefix to filter results. |
| language  | string | No       | Language code to filter (e.g., "en", "es"). |

#### Example Requests

```bash
# Search by text
GET /api/locale/search?query=Submit

# Search by key pattern with wildcard
GET /api/locale/search?query=*.BUTTONS.*

# Search within namespace
GET /api/locale/search?namespace=MY_APP.AUTH

# Filter by language
GET /api/locale/search?query=button&language=en
```

#### Response

```json
{
  "query": "*.BUTTONS.*",
  "namespace": null,
  "language": null,
  "totalCount": 3,
  "results": [
    {
      "key": "MY_APP.SETTINGS.BUTTONS.SAVE",
      "namespace": "MY_APP.SETTINGS.BUTTONS",
      "translations": {
        "en": "Save",
        "es": "Guardar"
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### 2. Get Translation by Key

Retrieve a specific translation by its key.

```http
GET /api/locale/{key}
```

#### Path Parameters

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| key       | string | Yes      | The full translation key (e.g., MY_APP.BUTTONS.SUBMIT). |

#### Query Parameters

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| language  | string | No       | If specified, returns only that language. |

#### Example Requests

```bash
# Get all languages for a key
GET /api/locale/MY_APP.BUTTONS.SUBMIT

# Get specific language
GET /api/locale/MY_APP.BUTTONS.SUBMIT?language=es
```

#### Response (200 OK)

```json
{
  "key": "MY_APP.BUTTONS.SUBMIT",
  "namespace": "MY_APP.BUTTONS",
  "translations": {
    "en": "Submit",
    "es": "Enviar"
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### Error Response (404 Not Found)

```json
{
  "code": "KEY_NOT_FOUND",
  "message": "Translation key 'MY_APP.BUTTONS.SUBMIT' not found"
}
```

---

### 3. List Translations by Namespace

Get all translations under a namespace prefix with pagination.

```http
GET /api/locale/namespace/{namespace}
```

#### Path Parameters

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| namespace | string | Yes      | The namespace prefix to filter by. |

#### Query Parameters

| Parameter | Type    | Required | Default | Description |
|-----------|---------|----------|---------|-------------|
| page      | integer | No       | 1       | Page number (1-based). |
| pageSize  | integer | No       | 50      | Items per page (max: 100). |

#### Example Requests

```bash
# Get first page
GET /api/locale/namespace/MY_APP.AUTH

# Get second page with custom size
GET /api/locale/namespace/MY_APP.AUTH?page=2&pageSize=25
```

#### Response

```json
{
  "items": [
    {
      "key": "MY_APP.AUTH.LOGIN.TITLE",
      "namespace": "MY_APP.AUTH.LOGIN",
      "translations": {
        "en": "Login",
        "es": "Iniciar Sesion"
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "page": 1,
  "pageSize": 50,
  "totalCount": 125,
  "totalPages": 3,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```

---

### 4. Create Translation

Create a new translation entry.

```http
POST /api/locale
```

#### Request Body

```json
{
  "key": "MY_APP.BUTTONS.CANCEL",
  "translations": {
    "en": "Cancel",
    "es": "Cancelar"
  }
}
```

#### Validation Rules

- `key` is required and must follow the key format convention
- `translations` must contain at least one non-empty value
- Key must not already exist

#### Response (201 Created)

```json
{
  "key": "MY_APP.BUTTONS.CANCEL",
  "namespace": "MY_APP.BUTTONS",
  "translations": {
    "en": "Cancel",
    "es": "Cancelar"
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### Error Responses

**400 Bad Request - Invalid Key Format**
```json
{
  "code": "INVALID_KEY_FORMAT",
  "message": "Key must be uppercase with underscores and periods only, with at least 2 segments (e.g., NAMESPACE.KEY)"
}
```

**409 Conflict - Key Exists**
```json
{
  "code": "KEY_EXISTS",
  "message": "Key 'MY_APP.BUTTONS.CANCEL' already exists"
}
```

---

### 5. Update Translation

Update an existing translation. Partial updates are supported.

```http
PUT /api/locale/{key}
```

#### Path Parameters

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| key       | string | Yes      | The translation key to update. |

#### Request Body

```json
{
  "translations": {
    "es": "Enviar Formulario"
  }
}
```

Only specified languages will be updated. To remove a translation for a language, set its value to an empty string.

#### Response (200 OK)

```json
{
  "key": "MY_APP.BUTTONS.SUBMIT",
  "namespace": "MY_APP.BUTTONS",
  "translations": {
    "en": "Submit",
    "es": "Enviar Formulario"
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-16T14:22:00Z"
}
```

#### Error Response (404 Not Found)

```json
{
  "code": "KEY_NOT_FOUND",
  "message": "Translation key 'MY_APP.BUTTONS.SUBMIT' not found"
}
```

---

### 6. Bulk Operations

Insert or update multiple translations in a single request.

```http
POST /api/locale/bulk
```

#### Request Body

```json
{
  "items": [
    {
      "key": "MY_APP.BUTTONS.SAVE",
      "translations": {
        "en": "Save",
        "es": "Guardar"
      }
    },
    {
      "key": "MY_APP.BUTTONS.DELETE",
      "translations": {
        "en": "Delete",
        "es": "Eliminar"
      }
    }
  ]
}
```

#### Behavior

- Existing keys will be updated (upsert behavior)
- New keys will be created
- Each item is validated independently
- Failures do not stop processing of other items

#### Response

```json
{
  "totalProcessed": 50,
  "created": 30,
  "updated": 18,
  "failed": 2,
  "successes": [
    "MY_APP.BUTTONS.SAVE",
    "MY_APP.BUTTONS.DELETE"
  ],
  "failures": [
    {
      "key": "invalid-key",
      "error": "Key must be uppercase with underscores and periods only, with at least 2 segments (e.g., NAMESPACE.KEY)"
    },
    {
      "key": "ANOTHER.INVALID",
      "error": "At least one non-empty translation is required"
    }
  ]
}
```

---

## Error Response Format

All errors follow a consistent format:

```json
{
  "code": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": {
    "fieldName": ["Error message 1", "Error message 2"]
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Request validation failed |
| INVALID_KEY_FORMAT | 400 | Key does not match required format |
| KEY_NOT_FOUND | 404 | Translation key does not exist |
| KEY_EXISTS | 409 | Key already exists (on create) |
| SEARCH_ERROR | 500 | Error during search operation |
| GET_ERROR | 500 | Error retrieving translation |
| CREATE_ERROR | 500 | Error creating translation |
| UPDATE_ERROR | 500 | Error updating translation |
| BULK_ERROR | 500 | Error during bulk operation |

---

## Usage Examples

### cURL Examples

```bash
# Search for button translations
curl -X GET "http://localhost:5000/api/locale/search?query=*.BUTTONS.*"

# Get a specific translation
curl -X GET "http://localhost:5000/api/locale/MY_APP.BUTTONS.SUBMIT"

# Create a new translation
curl -X POST "http://localhost:5000/api/locale" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "MY_APP.MESSAGES.SUCCESS",
    "translations": {
      "en": "Operation successful",
      "es": "Operacion exitosa"
    }
  }'

# Update a translation
curl -X PUT "http://localhost:5000/api/locale/MY_APP.MESSAGES.SUCCESS" \
  -H "Content-Type: application/json" \
  -d '{
    "translations": {
      "es": "Operacion completada con exito"
    }
  }'

# Bulk insert translations
curl -X POST "http://localhost:5000/api/locale/bulk" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"key": "APP.NAV.HOME", "translations": {"en": "Home", "es": "Inicio"}},
      {"key": "APP.NAV.ABOUT", "translations": {"en": "About", "es": "Acerca de"}}
    ]
  }'
```

### JavaScript/TypeScript Example

```typescript
const API_BASE = 'http://localhost:5000/api/locale';

// Search translations
async function searchTranslations(query: string, namespace?: string) {
  const params = new URLSearchParams();
  if (query) params.set('query', query);
  if (namespace) params.set('namespace', namespace);

  const response = await fetch(`${API_BASE}/search?${params}`);
  return response.json();
}

// Get translation by key
async function getTranslation(key: string, language?: string) {
  const params = language ? `?language=${language}` : '';
  const response = await fetch(`${API_BASE}/${key}${params}`);
  if (response.status === 404) return null;
  return response.json();
}

// Create translation
async function createTranslation(key: string, translations: Record<string, string>) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, translations })
  });
  return response.json();
}

// Update translation
async function updateTranslation(key: string, translations: Record<string, string>) {
  const response = await fetch(`${API_BASE}/${key}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ translations })
  });
  return response.json();
}
```

---

## MCP Server Integration

This API is designed to be consumed by a Claude Code MCP (Model Context Protocol) server plugin. The MCP server can expose these endpoints as tools for AI agents to:

1. **Search existing translations** before creating new ones to avoid duplicates
2. **Retrieve translations** when implementing localization in code
3. **Create new translations** when adding new UI elements
4. **Update translations** when fixing typos or improving text
5. **Bulk import translations** when migrating from other systems

### Recommended MCP Tool Mappings

| MCP Tool | API Endpoint |
|----------|--------------|
| `search_translations` | GET /api/locale/search |
| `get_translation` | GET /api/locale/{key} |
| `list_namespace` | GET /api/locale/namespace/{namespace} |
| `create_translation` | POST /api/locale |
| `update_translation` | PUT /api/locale/{key} |
| `bulk_upsert_translations` | POST /api/locale/bulk |
