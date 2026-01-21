/**
 * REST API client for the Locale Translation service
 */

import {
  LocaleTranslation,
  SearchResult,
  BulkOperationResult,
  PaginatedResponse,
  ApiError,
  LocaleApiError,
  CreateTranslationInput,
  UpdateTranslationInput,
  BulkTranslationInput,
} from '../types/locale.js';

/**
 * Configuration for the API client
 */
interface ApiClientConfig {
  /** Base URL for the API (e.g., http://localhost:5000/api/locale) */
  baseUrl: string;
  /** Optional API key for authentication */
  apiKey?: string;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
}

/**
 * HTTP client wrapper for the Locale Translation REST API
 */
export class LocaleApiClient {
  private readonly baseUrl: string;
  private readonly apiKey?: string;
  private readonly timeout: number;

  constructor(config: ApiClientConfig) {
    // Remove trailing slash from base URL
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.apiKey = config.apiKey;
    this.timeout = config.timeout ?? 30000;
  }

  /**
   * Create the API client from environment variables
   */
  static fromEnv(): LocaleApiClient {
    const baseUrl = process.env.LOCALE_API_BASE_URL;
    if (!baseUrl) {
      throw new Error(
        'LOCALE_API_BASE_URL environment variable is required. ' +
        'Set it to the base URL of your locale translation API (e.g., http://localhost:5000/api/locale)'
      );
    }

    return new LocaleApiClient({
      baseUrl,
      apiKey: process.env.LOCALE_API_KEY,
      timeout: process.env.LOCALE_API_TIMEOUT
        ? parseInt(process.env.LOCALE_API_TIMEOUT, 10)
        : undefined,
    });
  }

  /**
   * Make an HTTP request to the API
   */
  private async request<T>(
    method: string,
    path: string,
    options?: {
      body?: unknown;
      params?: Record<string, string | number | undefined>;
    }
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);

    // Add query parameters
    if (options?.params) {
      for (const [key, value] of Object.entries(options.params)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url.toString(), {
        method,
        headers,
        body: options?.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-JSON responses for certain error cases
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        if (!response.ok) {
          throw new LocaleApiError(response.status, {
            code: 'UNEXPECTED_ERROR',
            message: `Unexpected response: ${response.status} ${response.statusText}`,
          });
        }
      }

      const data = await response.json();

      if (!response.ok) {
        const error = data as ApiError;
        throw new LocaleApiError(response.status, error);
      }

      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof LocaleApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new LocaleApiError(408, {
            code: 'TIMEOUT',
            message: `Request timed out after ${this.timeout}ms`,
          });
        }

        // Network or fetch errors
        throw new LocaleApiError(0, {
          code: 'NETWORK_ERROR',
          message: `Failed to connect to API: ${error.message}. Ensure the API is running at ${this.baseUrl}`,
        });
      }

      throw error;
    }
  }

  /**
   * Search for translations by query, namespace, or language
   *
   * @param query - Search text or key pattern (supports wildcards like *.BUTTONS.*)
   * @param namespace - Optional namespace prefix to filter results
   * @param language - Optional language code to filter (en/es)
   * @returns Search results with matching translations
   */
  async search(
    query?: string,
    namespace?: string,
    language?: string
  ): Promise<SearchResult> {
    return this.request<SearchResult>('GET', '/search', {
      params: { query, namespace, language },
    });
  }

  /**
   * Get a specific translation by its exact key
   *
   * @param key - Full translation key (e.g., MY_APP.BUTTONS.SUBMIT)
   * @param language - Optional specific language to retrieve
   * @returns The translation or throws if not found
   */
  async get(key: string, language?: string): Promise<LocaleTranslation> {
    const encodedKey = encodeURIComponent(key);
    return this.request<LocaleTranslation>('GET', `/${encodedKey}`, {
      params: { language },
    });
  }

  /**
   * List all translations under a namespace prefix with pagination
   *
   * @param namespace - Namespace prefix (e.g., MY_APP.AUTH)
   * @param page - Page number (1-based, default: 1)
   * @param pageSize - Items per page (default: 50, max: 100)
   * @returns Paginated list of translations
   */
  async listNamespace(
    namespace: string,
    page?: number,
    pageSize?: number
  ): Promise<PaginatedResponse<LocaleTranslation>> {
    const encodedNamespace = encodeURIComponent(namespace);
    return this.request<PaginatedResponse<LocaleTranslation>>(
      'GET',
      `/namespace/${encodedNamespace}`,
      { params: { page, pageSize } }
    );
  }

  /**
   * Create a new translation entry
   *
   * @param input - Translation key and language values
   * @returns The created translation
   * @throws LocaleApiError if key already exists or validation fails
   */
  async create(input: CreateTranslationInput): Promise<LocaleTranslation> {
    return this.request<LocaleTranslation>('POST', '', {
      body: input,
    });
  }

  /**
   * Update an existing translation's text values
   *
   * @param key - Existing translation key
   * @param input - Language values to update (partial updates supported)
   * @returns The updated translation
   * @throws LocaleApiError if key not found
   */
  async update(key: string, input: UpdateTranslationInput): Promise<LocaleTranslation> {
    const encodedKey = encodeURIComponent(key);
    return this.request<LocaleTranslation>('PUT', `/${encodedKey}`, {
      body: input,
    });
  }

  /**
   * Create or update multiple translations in a single operation
   *
   * @param input - Array of translation items
   * @returns Report with successful and failed entries
   */
  async bulk(input: BulkTranslationInput): Promise<BulkOperationResult> {
    return this.request<BulkOperationResult>('POST', '/bulk', {
      body: input,
    });
  }

  /**
   * Check if the API is reachable
   *
   * @returns true if API responds, false otherwise
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Try a simple search to verify API is working
      await this.search('', undefined, undefined);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Validate a translation key format
 *
 * Key format rules:
 * - Must be uppercase letters, numbers, underscores, and periods only
 * - Must have at least 2 segments (namespace.key minimum)
 * - Maximum length: 200 characters
 * - Each segment must start with a letter
 *
 * @param key - The key to validate
 * @returns true if valid, throws with message if invalid
 */
export function validateKeyFormat(key: string): true | never {
  if (!key || typeof key !== 'string') {
    throw new Error('Key is required and must be a non-empty string');
  }

  if (key.length > 200) {
    throw new Error('Key must be 200 characters or less');
  }

  // Check format: uppercase letters, numbers, underscores, and periods only
  const formatRegex = /^[A-Z][A-Z0-9_]*(\.[A-Z][A-Z0-9_]*)+$/;
  if (!formatRegex.test(key)) {
    throw new Error(
      'Key must be uppercase with underscores and periods only, with at least 2 segments ' +
      '(e.g., NAMESPACE.KEY). Each segment must start with a letter.'
    );
  }

  return true;
}

/**
 * Generate a suggested translation key based on context
 *
 * @param application - Application name/identifier
 * @param component - Component or feature path
 * @param category - Category (BUTTONS, LABELS, MESSAGES, VALIDATIONS, etc.)
 * @param purpose - What the text is for (e.g., "submit button", "email required error")
 * @returns Suggested key following naming convention
 */
export function generateSuggestedKey(
  application: string,
  component: string,
  category: string,
  purpose: string
): string {
  // Normalize and convert to uppercase
  const normalize = (str: string): string => {
    return str
      .toUpperCase()
      .replace(/[^A-Z0-9.]/g, '_')  // Replace non-alphanumeric (except dots) with underscore
      .replace(/_+/g, '_')           // Collapse multiple underscores
      .replace(/^_|_$/g, '')         // Remove leading/trailing underscores
      .replace(/\.+/g, '.');         // Collapse multiple dots
  };

  // Convert purpose to a key-friendly format
  const purposeKey = normalize(purpose)
    .split('_')
    .filter(Boolean)
    .slice(0, 3)  // Take at most 3 words
    .join('_');

  const parts = [
    normalize(application),
    normalize(component),
    normalize(category),
    purposeKey,
  ].filter(Boolean);

  return parts.join('.');
}
