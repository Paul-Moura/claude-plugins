/**
 * TypeScript types for the Locale Translation MCP Server
 */

/**
 * A locale translation entry with key and language values
 */
export interface LocaleTranslation {
  /** Full translation key (e.g., MY_APP.BUTTONS.SUBMIT) */
  key: string;
  /** Namespace prefix derived from key */
  namespace: string;
  /** Language code to translation text mapping */
  translations: Record<string, string>;
  /** ISO timestamp when created */
  createdAt: string;
  /** ISO timestamp when last updated */
  updatedAt: string;
}

/**
 * Search operation response
 */
export interface SearchResult {
  /** Original search query */
  query: string | null;
  /** Namespace filter applied */
  namespace: string | null;
  /** Language filter applied */
  language: string | null;
  /** Total number of matching results */
  totalCount: number;
  /** Array of matching translations */
  results: LocaleTranslation[];
}

/**
 * Bulk operation result for a single item
 */
export interface BulkItemFailure {
  /** The key that failed */
  key: string;
  /** Error message explaining the failure */
  error: string;
}

/**
 * Bulk operation response
 */
export interface BulkOperationResult {
  /** Total number of items processed */
  totalProcessed: number;
  /** Number of items created */
  created: number;
  /** Number of items updated */
  updated: number;
  /** Number of items that failed */
  failed: number;
  /** Keys that were successfully processed */
  successes: string[];
  /** Details of failed items */
  failures: BulkItemFailure[];
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  /** Array of items on this page */
  items: T[];
  /** Current page number (1-based) */
  page: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of items across all pages */
  totalCount: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there is a next page */
  hasNextPage: boolean;
  /** Whether there is a previous page */
  hasPreviousPage: boolean;
}

/**
 * API error response structure
 */
export interface ApiError {
  /** Error code (e.g., KEY_NOT_FOUND, VALIDATION_ERROR) */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Optional field-level error details */
  details?: Record<string, string[]>;
}

/**
 * Known API error codes
 */
export enum ApiErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_KEY_FORMAT = 'INVALID_KEY_FORMAT',
  KEY_NOT_FOUND = 'KEY_NOT_FOUND',
  KEY_EXISTS = 'KEY_EXISTS',
  SEARCH_ERROR = 'SEARCH_ERROR',
  GET_ERROR = 'GET_ERROR',
  CREATE_ERROR = 'CREATE_ERROR',
  UPDATE_ERROR = 'UPDATE_ERROR',
  BULK_ERROR = 'BULK_ERROR',
}

/**
 * Custom error class for API errors
 */
export class LocaleApiError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: Record<string, string[]>;

  constructor(statusCode: number, error: ApiError) {
    super(error.message);
    this.name = 'LocaleApiError';
    this.code = error.code;
    this.statusCode = statusCode;
    this.details = error.details;
  }
}

/**
 * Input type for creating a translation
 */
export interface CreateTranslationInput {
  /** Full translation key */
  key: string;
  /** Language to translation text mapping */
  translations: Record<string, string>;
}

/**
 * Input type for updating a translation
 */
export interface UpdateTranslationInput {
  /** Language to translation text mapping (partial updates supported) */
  translations: Record<string, string>;
}

/**
 * Input type for bulk operations
 */
export interface BulkTranslationInput {
  /** Array of translation items to create/update */
  items: CreateTranslationInput[];
}

/**
 * Tool input types for MCP tools
 */
export interface SearchToolInput {
  query: string;
  namespace?: string;
  language?: string;
}

export interface GetToolInput {
  key: string;
  language?: string;
}

export interface ListNamespaceToolInput {
  namespace: string;
  page?: number;
  pageSize?: number;
}

export interface CreateToolInput {
  key: string;
  en: string;
  es: string;
}

export interface UpdateToolInput {
  key: string;
  en?: string;
  es?: string;
}

export interface BulkCreateToolInput {
  translations: Array<{
    key: string;
    en: string;
    es: string;
  }>;
}

export interface SuggestKeyToolInput {
  application: string;
  component: string;
  category: string;
  purpose: string;
}
