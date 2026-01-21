/**
 * locale_get tool - Get a specific translation by its exact key
 */

import { LocaleApiClient } from '../api/client.js';
import { GetToolInput, LocaleApiError, ApiErrorCode } from '../types/locale.js';

/**
 * Tool definition for MCP registration
 */
export const getToolDefinition = {
  name: 'locale_get',
  description:
    'Get a specific translation by its exact key. ' +
    'Use this when you know the full translation key and need to retrieve its values. ' +
    'Returns the translation with all language values, or an error if the key does not exist.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      key: {
        type: 'string',
        description:
          'The full translation key to retrieve. Must be an exact match. ' +
          'Example: "MY_APP.BUTTONS.SUBMIT"',
      },
      language: {
        type: 'string',
        description:
          'Optional specific language to retrieve. If omitted, returns all languages.',
        enum: ['en', 'es'],
      },
    },
    required: ['key'],
  },
};

/**
 * Execute the locale_get tool
 */
export async function executeGet(
  client: LocaleApiClient,
  input: GetToolInput
): Promise<string> {
  try {
    const translation = await client.get(input.key, input.language);

    return JSON.stringify({
      success: true,
      message: `Found translation for key "${input.key}".`,
      translation: {
        key: translation.key,
        namespace: translation.namespace,
        translations: translation.translations,
        createdAt: translation.createdAt,
        updatedAt: translation.updatedAt,
      },
    });
  } catch (error) {
    if (error instanceof LocaleApiError) {
      if (error.code === ApiErrorCode.KEY_NOT_FOUND) {
        return JSON.stringify({
          success: false,
          error: 'KEY_NOT_FOUND',
          message: `Translation key "${input.key}" does not exist. You may need to create it using locale_create.`,
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
