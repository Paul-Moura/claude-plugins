/**
 * locale_search tool - Search for existing locale translations
 */

import { LocaleApiClient } from '../api/client.js';
import { SearchToolInput, LocaleApiError } from '../types/locale.js';

/**
 * Tool definition for MCP registration
 */
export const searchToolDefinition = {
  name: 'locale_search',
  description:
    'Search for existing locale translations by key pattern, text content, or namespace. ' +
    'Use this tool BEFORE creating new translations to check if similar translations already exist. ' +
    'Supports wildcards in patterns (e.g., "*.BUTTONS.*" to find all button translations). ' +
    'Returns matching translations with all language values.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      query: {
        type: 'string',
        description:
          'Search text or key pattern. Can be a partial key, translation text, or wildcard pattern. ' +
          'Examples: "Submit", "*.BUTTONS.*", "SAVE", "guardar"',
      },
      namespace: {
        type: 'string',
        description:
          'Optional namespace prefix to filter results. Example: "MY_APP.AUTH" to search only within authentication translations.',
      },
      language: {
        type: 'string',
        description:
          'Optional language code to filter results (e.g., "en" or "es"). If omitted, searches all languages.',
        enum: ['en', 'es'],
      },
    },
    required: ['query'],
  },
};

/**
 * Execute the locale_search tool
 */
export async function executeSearch(
  client: LocaleApiClient,
  input: SearchToolInput
): Promise<string> {
  try {
    const result = await client.search(input.query, input.namespace, input.language);

    if (result.totalCount === 0) {
      let message = `No translations found matching "${input.query}"`;
      if (input.namespace) {
        message += ` in namespace "${input.namespace}"`;
      }
      if (input.language) {
        message += ` for language "${input.language}"`;
      }
      message += '. You may need to create new translations.';
      return JSON.stringify({ success: true, message, results: [] });
    }

    // Format results for agent consumption
    const formattedResults = result.results.map((t) => ({
      key: t.key,
      namespace: t.namespace,
      translations: t.translations,
    }));

    return JSON.stringify({
      success: true,
      message: `Found ${result.totalCount} translation(s) matching your search.`,
      totalCount: result.totalCount,
      results: formattedResults,
    });
  } catch (error) {
    if (error instanceof LocaleApiError) {
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
