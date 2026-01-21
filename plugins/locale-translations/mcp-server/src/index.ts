#!/usr/bin/env node
/**
 * Locale Translation MCP Server
 *
 * An MCP server that provides tools for managing locale translations via REST API.
 * This server enables AI agents to search, retrieve, create, update, and bulk manage
 * translation entries programmatically.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { LocaleApiClient } from './api/client.js';
import {
  SearchToolInput,
  GetToolInput,
  ListNamespaceToolInput,
  CreateToolInput,
  UpdateToolInput,
  BulkCreateToolInput,
  SuggestKeyToolInput,
} from './types/locale.js';

// Import tool definitions and executors
import { searchToolDefinition, executeSearch } from './tools/search.js';
import { getToolDefinition, executeGet } from './tools/get.js';
import { listToolDefinition, executeList } from './tools/list.js';
import { createToolDefinition, executeCreate } from './tools/create.js';
import { updateToolDefinition, executeUpdate } from './tools/update.js';
import { bulkToolDefinition, executeBulk } from './tools/bulk.js';
import { suggestToolDefinition, executeSuggest } from './tools/suggest.js';

/**
 * All available tools
 */
const TOOLS = [
  searchToolDefinition,
  getToolDefinition,
  listToolDefinition,
  createToolDefinition,
  updateToolDefinition,
  bulkToolDefinition,
  suggestToolDefinition,
];

/**
 * Create and configure the MCP server
 */
async function createServer(): Promise<Server> {
  // Initialize API client from environment
  let apiClient: LocaleApiClient;
  try {
    apiClient = LocaleApiClient.fromEnv();
  } catch (error) {
    console.error('Failed to initialize API client:', error);
    throw error;
  }

  // Create MCP server
  const server = new Server(
    {
      name: 'locale-translations',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register tools list handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: TOOLS,
    };
  });

  // Register tool call handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      let result: string;

      switch (name) {
        case 'locale_search':
          result = await executeSearch(apiClient, args as unknown as SearchToolInput);
          break;

        case 'locale_get':
          result = await executeGet(apiClient, args as unknown as GetToolInput);
          break;

        case 'locale_list_namespace':
          result = await executeList(apiClient, args as unknown as ListNamespaceToolInput);
          break;

        case 'locale_create':
          result = await executeCreate(apiClient, args as unknown as CreateToolInput);
          break;

        case 'locale_update':
          result = await executeUpdate(apiClient, args as unknown as UpdateToolInput);
          break;

        case 'locale_bulk_create':
          result = await executeBulk(apiClient, args as unknown as BulkCreateToolInput);
          break;

        case 'locale_suggest_key':
          result = await executeSuggest(args as unknown as SuggestKeyToolInput);
          break;

        default:
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: false,
                  error: 'UNKNOWN_TOOL',
                  message: `Unknown tool: ${name}. Available tools: ${TOOLS.map((t) => t.name).join(', ')}`,
                }),
              },
            ],
          };
      }

      return {
        content: [
          {
            type: 'text',
            text: result,
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: 'EXECUTION_ERROR',
              message: errorMessage,
            }),
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  try {
    const server = await createServer();
    const transport = new StdioServerTransport();

    await server.connect(transport);

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      await server.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await server.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Run the server
main();
