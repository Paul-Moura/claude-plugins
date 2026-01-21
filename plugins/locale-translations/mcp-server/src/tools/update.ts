/**
 * locale_update tool - Update an existing translation's text values
 */

import { LocaleApiClient } from '../api/client.js';
import { UpdateToolInput, LocaleApiError, ApiErrorCode } from '../types/locale.js';

/**
 * Tool definition for MCP registration
 */
export const updateToolDefinition = {
  name: 'locale_update',
  description:
    'Update an existing translation\'s text values. ' +
    'Supports partial updates - you can update just English, just Spanish, or both. ' +
    'The key must already exist; use locale_create for new translations.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      key: {
        type: 'string',
        description:
          'The existing translation key to update. Must be an exact match. ' +
          'Example: "MY_APP.BUTTONS.SUBMIT"',
      },
      en: {
        type: 'string',
        description: 'Updated English translation text. Omit to leave unchanged.',
      },
      es: {
        type: 'string',
        description: 'Updated Spanish translation text. Omit to leave unchanged.',
      },
    },
    required: ['key'],
  },
};

/**
 * Execute the locale_update tool
 */
export async function executeUpdate(
  client: LocaleApiClient,
  input: UpdateToolInput
): Promise<string> {
  // Validate that at least one translation is provided
  const hasEnglish = input.en !== undefined && input.en !== null;
  const hasSpanish = input.es !== undefined && input.es !== null;

  if (!hasEnglish && !hasSpanish) {
    return JSON.stringify({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'At least one translation (en or es) must be provided to update.',
    });
  }

  // Build translations object with only provided values
  const translations: Record<string, string> = {};
  if (hasEnglish) {
    translations.en = input.en!;
  }
  if (hasSpanish) {
    translations.es = input.es!;
  }

  try {
    const translation = await client.update(input.key, { translations });

    const updatedLanguages = Object.keys(translations).join(' and ');

    return JSON.stringify({
      success: true,
      message: `Successfully updated ${updatedLanguages} translation(s) for key "${input.key}".`,
      translation: {
        key: translation.key,
        namespace: translation.namespace,
        translations: translation.translations,
        updatedAt: translation.updatedAt,
      },
    });
  } catch (error) {
    if (error instanceof LocaleApiError) {
      if (error.code === ApiErrorCode.KEY_NOT_FOUND) {
        return JSON.stringify({
          success: false,
          error: 'KEY_NOT_FOUND',
          message: `Translation key "${input.key}" does not exist. Use locale_create to create it first.`,
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
