/**
 * locale_list_namespace tool - List all translations under a namespace prefix
 */

import { LocaleApiClient } from '../api/client.js';
import { ListNamespaceToolInput, LocaleApiError } from '../types/locale.js';

/**
 * Tool definition for MCP registration
 */
export const listToolDefinition = {
  name: 'locale_list_namespace',
  description:
    'List all translations under a namespace prefix with pagination. ' +
    'Use this to explore what translations exist in a feature area or component. ' +
    'Helpful for understanding existing key patterns before creating new translations.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      namespace: {
        type: 'string',
        description:
          'The namespace prefix to list translations for. ' +
          'Example: "MY_APP.AUTH" will return all translations starting with that prefix.',
      },
      page: {
        type: 'number',
        description: 'Page number for pagination (1-based). Defaults to 1.',
        minimum: 1,
      },
      pageSize: {
        type: 'number',
        description: 'Number of results per page. Defaults to 50, maximum is 100.',
        minimum: 1,
        maximum: 100,
      },
    },
    required: ['namespace'],
  },
};

/**
 * Execute the locale_list_namespace tool
 */
export async function executeList(
  client: LocaleApiClient,
  input: ListNamespaceToolInput
): Promise<string> {
  try {
    const result = await client.listNamespace(input.namespace, input.page, input.pageSize);

    if (result.totalCount === 0) {
      return JSON.stringify({
        success: true,
        message: `No translations found in namespace "${input.namespace}". This namespace may not exist or has no translations yet.`,
        totalCount: 0,
        items: [],
      });
    }

    // Format items for agent consumption
    const formattedItems = result.items.map((t) => ({
      key: t.key,
      translations: t.translations,
    }));

    let message = `Found ${result.totalCount} translation(s) in namespace "${input.namespace}".`;
    if (result.hasNextPage) {
      message += ` Showing page ${result.page} of ${result.totalPages}. Use page parameter to see more.`;
    }

    return JSON.stringify({
      success: true,
      message,
      namespace: input.namespace,
      totalCount: result.totalCount,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
      hasNextPage: result.hasNextPage,
      hasPreviousPage: result.hasPreviousPage,
      items: formattedItems,
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
