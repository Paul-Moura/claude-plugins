/**
 * locale_suggest_key tool - Generate a suggested translation key based on context
 */

import { generateSuggestedKey } from '../api/client.js';
import { SuggestKeyToolInput } from '../types/locale.js';

/**
 * Known categories for translation keys
 */
const KNOWN_CATEGORIES = [
  'BUTTONS',
  'LABELS',
  'MESSAGES',
  'VALIDATIONS',
  'ERRORS',
  'TITLES',
  'PLACEHOLDERS',
  'HINTS',
  'TOOLTIPS',
  'CONFIRMATIONS',
  'NOTIFICATIONS',
  'NAVIGATION',
  'ACTIONS',
  'STATUS',
];

/**
 * Tool definition for MCP registration
 */
export const suggestToolDefinition = {
  name: 'locale_suggest_key',
  description:
    'Generate a suggested translation key based on context. ' +
    'Use this when you need help creating a properly formatted key that follows naming conventions. ' +
    'Provide the application name, component path, category, and purpose to get a suggested key.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      application: {
        type: 'string',
        description:
          'Application name or identifier. Will be converted to uppercase. ' +
          'Example: "MyApp" becomes "MY_APP"',
      },
      component: {
        type: 'string',
        description:
          'Component or feature path. Can include multiple levels separated by dots or slashes. ' +
          'Examples: "settings/profile", "Auth.Login", "Dashboard"',
      },
      category: {
        type: 'string',
        description:
          'Category of the translation. Common categories: ' +
          'BUTTONS, LABELS, MESSAGES, VALIDATIONS, ERRORS, TITLES, PLACEHOLDERS, HINTS, TOOLTIPS, CONFIRMATIONS, NOTIFICATIONS, NAVIGATION, ACTIONS, STATUS',
        enum: KNOWN_CATEGORIES,
      },
      purpose: {
        type: 'string',
        description:
          'Brief description of what the text is for. Will be converted to a key segment. ' +
          'Examples: "submit button", "email required error", "welcome message", "cancel action"',
      },
    },
    required: ['application', 'component', 'category', 'purpose'],
  },
};

/**
 * Execute the locale_suggest_key tool
 */
export async function executeSuggest(
  input: SuggestKeyToolInput
): Promise<string> {
  // Validate inputs
  if (!input.application || input.application.trim() === '') {
    return JSON.stringify({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Application name is required.',
    });
  }

  if (!input.component || input.component.trim() === '') {
    return JSON.stringify({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Component path is required.',
    });
  }

  if (!input.category || input.category.trim() === '') {
    return JSON.stringify({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Category is required.',
    });
  }

  if (!input.purpose || input.purpose.trim() === '') {
    return JSON.stringify({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Purpose is required.',
    });
  }

  // Normalize component path (convert slashes to dots)
  const normalizedComponent = input.component
    .replace(/[/\\]/g, '.')
    .replace(/\.+/g, '.');

  // Generate the suggested key
  const suggestedKey = generateSuggestedKey(
    input.application,
    normalizedComponent,
    input.category,
    input.purpose
  );

  // Provide category recommendation if not a known category
  const categoryUpper = input.category.toUpperCase();
  const isKnownCategory = KNOWN_CATEGORIES.includes(categoryUpper);

  let message = `Generated translation key: "${suggestedKey}"`;
  let recommendations: string[] = [];

  if (!isKnownCategory) {
    recommendations.push(
      `Consider using a standard category: ${KNOWN_CATEGORIES.join(', ')}`
    );
  }

  // Add usage example
  const usageExample = {
    key: suggestedKey,
    en: `[English text for ${input.purpose}]`,
    es: `[Spanish text for ${input.purpose}]`,
  };

  return JSON.stringify({
    success: true,
    message,
    suggestedKey,
    breakdown: {
      application: input.application.toUpperCase().replace(/[^A-Z0-9]/g, '_'),
      component: normalizedComponent.toUpperCase().replace(/[^A-Z0-9.]/g, '_'),
      category: categoryUpper,
      purpose: input.purpose,
    },
    recommendations: recommendations.length > 0 ? recommendations : undefined,
    usageExample,
    nextStep: `Use locale_search to check if "${suggestedKey}" or similar keys already exist, then use locale_create to create it.`,
  });
}
