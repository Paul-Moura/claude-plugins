/**
 * locale_bulk_create tool - Create multiple translations in a single operation
 */

import { LocaleApiClient, validateKeyFormat } from '../api/client.js';
import { BulkCreateToolInput, LocaleApiError } from '../types/locale.js';

/**
 * Tool definition for MCP registration
 */
export const bulkToolDefinition = {
  name: 'locale_bulk_create',
  description:
    'Create multiple translations in a single operation (upsert behavior). ' +
    'Efficient for adding many translations at once, such as when localizing a new component. ' +
    'Existing keys will be updated, new keys will be created. ' +
    'Each item is validated independently; failures do not stop processing of other items.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      translations: {
        type: 'array',
        description: 'Array of translation objects to create or update.',
        items: {
          type: 'object',
          properties: {
            key: {
              type: 'string',
              description:
                'Translation key following naming convention. ' +
                'Format: APPLICATION.COMPONENT.CATEGORY.KEY',
            },
            en: {
              type: 'string',
              description: 'English translation text.',
            },
            es: {
              type: 'string',
              description: 'Spanish translation text.',
            },
          },
          required: ['key', 'en', 'es'],
        },
        minItems: 1,
      },
    },
    required: ['translations'],
  },
};

/**
 * Execute the locale_bulk_create tool
 */
export async function executeBulk(
  client: LocaleApiClient,
  input: BulkCreateToolInput
): Promise<string> {
  // Validate input array
  if (!input.translations || !Array.isArray(input.translations) || input.translations.length === 0) {
    return JSON.stringify({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'translations must be a non-empty array.',
    });
  }

  // Pre-validate all keys locally to provide immediate feedback
  const validationErrors: Array<{ key: string; error: string }> = [];
  const validItems: Array<{ key: string; translations: Record<string, string> }> = [];

  for (const item of input.translations) {
    // Validate key format
    try {
      validateKeyFormat(item.key);
    } catch (error) {
      validationErrors.push({
        key: item.key || '(empty)',
        error: error instanceof Error ? error.message : 'Invalid key format',
      });
      continue;
    }

    // Validate translations are not empty
    if (!item.en || item.en.trim() === '') {
      validationErrors.push({
        key: item.key,
        error: 'English translation (en) cannot be empty',
      });
      continue;
    }

    if (!item.es || item.es.trim() === '') {
      validationErrors.push({
        key: item.key,
        error: 'Spanish translation (es) cannot be empty',
      });
      continue;
    }

    validItems.push({
      key: item.key,
      translations: {
        en: item.en,
        es: item.es,
      },
    });
  }

  // If all items failed validation, return early
  if (validItems.length === 0) {
    return JSON.stringify({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'All items failed validation. No translations were processed.',
      totalProcessed: 0,
      created: 0,
      updated: 0,
      failed: validationErrors.length,
      failures: validationErrors,
    });
  }

  try {
    const result = await client.bulk({ items: validItems });

    // Combine API failures with local validation errors
    const allFailures = [
      ...validationErrors,
      ...result.failures,
    ];

    const overallSuccess = result.failed === 0 && validationErrors.length === 0;

    let message: string;
    if (overallSuccess) {
      message = `Successfully processed ${result.totalProcessed} translation(s): ${result.created} created, ${result.updated} updated.`;
    } else if (result.created + result.updated > 0) {
      message = `Partially successful: ${result.created} created, ${result.updated} updated, ${allFailures.length} failed.`;
    } else {
      message = `Bulk operation failed. ${allFailures.length} item(s) had errors.`;
    }

    return JSON.stringify({
      success: overallSuccess,
      message,
      totalProcessed: result.totalProcessed + validationErrors.length,
      created: result.created,
      updated: result.updated,
      failed: allFailures.length,
      successes: result.successes,
      failures: allFailures.length > 0 ? allFailures : undefined,
    });
  } catch (error) {
    if (error instanceof LocaleApiError) {
      return JSON.stringify({
        success: false,
        error: error.code,
        message: error.message,
        validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
      });
    }

    return JSON.stringify({
      success: false,
      error: 'UNKNOWN_ERROR',
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    });
  }
}
