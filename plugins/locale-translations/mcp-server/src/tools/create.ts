/**
 * locale_create tool - Create a new locale translation
 */

import { LocaleApiClient, validateKeyFormat } from '../api/client.js';
import { CreateToolInput, LocaleApiError, ApiErrorCode } from '../types/locale.js';

/**
 * Tool definition for MCP registration
 */
export const createToolDefinition = {
  name: 'locale_create',
  description:
    'Create a new locale translation with key and language values. ' +
    'IMPORTANT: Always use locale_search first to check if a similar translation already exists. ' +
    'Keys must follow the naming convention: APPLICATION.COMPONENT.CATEGORY.KEY ' +
    '(all uppercase with underscores and periods). Both English and Spanish translations are required.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      key: {
        type: 'string',
        description:
          'The full translation key following naming convention. ' +
          'Format: APPLICATION.COMPONENT.CATEGORY.KEY (uppercase, underscores, periods). ' +
          'Example: "MY_APP.SETTINGS.BUTTONS.SAVE"',
      },
      en: {
        type: 'string',
        description: 'The English translation text.',
      },
      es: {
        type: 'string',
        description: 'The Spanish translation text.',
      },
    },
    required: ['key', 'en', 'es'],
  },
};

/**
 * Execute the locale_create tool
 */
export async function executeCreate(
  client: LocaleApiClient,
  input: CreateToolInput
): Promise<string> {
  // Validate key format before sending to API
  try {
    validateKeyFormat(input.key);
  } catch (error) {
    return JSON.stringify({
      success: false,
      error: 'INVALID_KEY_FORMAT',
      message: error instanceof Error ? error.message : 'Invalid key format',
      suggestion: 'Use locale_suggest_key to generate a properly formatted key.',
    });
  }

  // Validate translations are not empty
  if (!input.en || input.en.trim() === '') {
    return JSON.stringify({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'English translation (en) cannot be empty.',
    });
  }

  if (!input.es || input.es.trim() === '') {
    return JSON.stringify({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Spanish translation (es) cannot be empty.',
    });
  }

  try {
    const translation = await client.create({
      key: input.key,
      translations: {
        en: input.en,
        es: input.es,
      },
    });

    return JSON.stringify({
      success: true,
      message: `Successfully created translation for key "${input.key}".`,
      translation: {
        key: translation.key,
        namespace: translation.namespace,
        translations: translation.translations,
        createdAt: translation.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof LocaleApiError) {
      if (error.code === ApiErrorCode.KEY_EXISTS) {
        return JSON.stringify({
          success: false,
          error: 'KEY_EXISTS',
          message: `Translation key "${input.key}" already exists. Use locale_update to modify it, or locale_get to retrieve its current values.`,
        });
      }

      if (error.code === ApiErrorCode.INVALID_KEY_FORMAT) {
        return JSON.stringify({
          success: false,
          error: 'INVALID_KEY_FORMAT',
          message: error.message,
          suggestion: 'Use locale_suggest_key to generate a properly formatted key.',
        });
      }

      return JSON.stringify({
        success: false,
        error: error.code,
        message: error.message,
      });
    }

    return JSON.stringify({
      success: false,
      error: 'UNKNOWN_ERROR',
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    });
  }
}
