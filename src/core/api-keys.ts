/**
 * ThinkPink Quote Engine SDK - API Key Scoping Module
 *
 * Provides types and utilities for API key management, scoping, and validation.
 * API keys follow the format: qe_{environment}_{scope}_{identifier}
 *
 * Examples:
 * - qe_live_full_abc123...    - Production, full access
 * - qe_test_read_xyz789...    - Test mode, read-only access
 * - qe_live_widget_def456...  - Production, widget-only access
 */

// ============================================================================
// API Key Types
// ============================================================================

/**
 * API key environment
 */
export type ApiKeyEnvironment = 'live' | 'test'

/**
 * API key scope
 *
 * Defines what operations the key is allowed to perform:
 * - `full` - All operations (chat, quote, payment, webhooks)
 * - `read` - Read-only operations (get quote, get session)
 * - `widget` - Widget operations only (chat, generate quote)
 * - `webhook` - Webhook management only
 * - `payment` - Payment operations only
 */
export type ApiKeyScope = 'full' | 'read' | 'widget' | 'webhook' | 'payment'

/**
 * Parsed API key structure
 */
export interface ParsedApiKey {
  /** Raw key value */
  raw: string

  /** Key environment */
  environment: ApiKeyEnvironment

  /** Key scope */
  scope: ApiKeyScope

  /** Unique key identifier */
  identifier: string

  /** Whether the key format is valid */
  isValid: boolean

  /** Whether this is a test key */
  isTestKey: boolean
}

/**
 * API key permissions map
 */
export interface ApiKeyPermissions {
  /** Can start and manage chat sessions */
  chat: boolean

  /** Can generate quotes */
  generateQuote: boolean

  /** Can read quotes */
  readQuote: boolean

  /** Can initiate payments */
  initPayment: boolean

  /** Can confirm payments */
  confirmPayment: boolean

  /** Can manage webhooks */
  manageWebhooks: boolean

  /** Can access analytics */
  accessAnalytics: boolean

  /** Can send emails */
  sendEmails: boolean

  /** Can download PDFs */
  downloadPdfs: boolean
}

/**
 * Permissions for each scope
 */
export const SCOPE_PERMISSIONS: Record<ApiKeyScope, ApiKeyPermissions> = {
  full: {
    chat: true,
    generateQuote: true,
    readQuote: true,
    initPayment: true,
    confirmPayment: true,
    manageWebhooks: true,
    accessAnalytics: true,
    sendEmails: true,
    downloadPdfs: true,
  },
  read: {
    chat: false,
    generateQuote: false,
    readQuote: true,
    initPayment: false,
    confirmPayment: false,
    manageWebhooks: false,
    accessAnalytics: true,
    sendEmails: false,
    downloadPdfs: true,
  },
  widget: {
    chat: true,
    generateQuote: true,
    readQuote: true,
    initPayment: true,
    confirmPayment: true,
    manageWebhooks: false,
    accessAnalytics: false,
    sendEmails: true,
    downloadPdfs: true,
  },
  webhook: {
    chat: false,
    generateQuote: false,
    readQuote: false,
    initPayment: false,
    confirmPayment: false,
    manageWebhooks: true,
    accessAnalytics: false,
    sendEmails: false,
    downloadPdfs: false,
  },
  payment: {
    chat: false,
    generateQuote: false,
    readQuote: true,
    initPayment: true,
    confirmPayment: true,
    manageWebhooks: false,
    accessAnalytics: false,
    sendEmails: false,
    downloadPdfs: false,
  },
}

// ============================================================================
// API Key Validation
// ============================================================================

/**
 * Regular expression for valid API key format
 * Format: qe_{live|test}_{full|read|widget|webhook|payment}_{24+ alphanumeric chars}
 */
const API_KEY_REGEX = /^qe_(live|test)_(full|read|widget|webhook|payment)_([A-Za-z0-9]{24,})$/

/**
 * Parse an API key string into its components
 *
 * @param apiKey - The API key to parse
 * @returns Parsed API key structure
 *
 * @example
 * ```typescript
 * const parsed = parseApiKey('qe_live_full_abc123def456ghi789jkl012')
 *
 * if (parsed.isValid) {
 *   // console.log(parsed.environment) // 'live'
 *   // console.log(parsed.scope)       // 'full'
 *   // console.log(parsed.isTestKey)   // false
 * }
 * ```
 */
export function parseApiKey(apiKey: string): ParsedApiKey {
  const match = apiKey.match(API_KEY_REGEX)

  if (!match) {
    return {
      raw: apiKey,
      environment: 'live',
      scope: 'full',
      identifier: '',
      isValid: false,
      isTestKey: false,
    }
  }

  const [, environment, scope, identifier] = match

  return {
    raw: apiKey,
    environment: environment as ApiKeyEnvironment,
    scope: scope as ApiKeyScope,
    identifier,
    isValid: true,
    isTestKey: environment === 'test',
  }
}

/**
 * Validate an API key format
 *
 * @param apiKey - The API key to validate
 * @returns Whether the key format is valid
 *
 * @example
 * ```typescript
 * isValidApiKeyFormat('qe_live_full_abc123...') // true
 * isValidApiKeyFormat('invalid-key')            // false
 * ```
 */
export function isValidApiKeyFormat(apiKey: string): boolean {
  return API_KEY_REGEX.test(apiKey)
}

/**
 * Get permissions for an API key
 *
 * @param apiKey - The API key (string or parsed)
 * @returns The permissions associated with the key's scope
 *
 * @example
 * ```typescript
 * const perms = getApiKeyPermissions('qe_live_widget_abc123...')
 *
 * if (!perms.manageWebhooks) {
 *   // console.log('This key cannot manage webhooks')
 * }
 * ```
 */
export function getApiKeyPermissions(apiKey: string | ParsedApiKey): ApiKeyPermissions {
  const parsed = typeof apiKey === 'string' ? parseApiKey(apiKey) : apiKey

  if (!parsed.isValid) {
    // Invalid keys get no permissions
    return {
      chat: false,
      generateQuote: false,
      readQuote: false,
      initPayment: false,
      confirmPayment: false,
      manageWebhooks: false,
      accessAnalytics: false,
      sendEmails: false,
      downloadPdfs: false,
    }
  }

  return SCOPE_PERMISSIONS[parsed.scope]
}

/**
 * Check if an API key has a specific permission
 *
 * @param apiKey - The API key
 * @param permission - The permission to check
 * @returns Whether the key has the permission
 *
 * @example
 * ```typescript
 * if (!hasPermission(apiKey, 'manageWebhooks')) {
 *   throw new Error('This API key cannot manage webhooks')
 * }
 * ```
 */
export function hasPermission(
  apiKey: string | ParsedApiKey,
  permission: keyof ApiKeyPermissions
): boolean {
  const perms = getApiKeyPermissions(apiKey)
  return perms[permission]
}

/**
 * Check if an API key is a test key
 *
 * @param apiKey - The API key
 * @returns Whether the key is for test environment
 */
export function isTestKey(apiKey: string | ParsedApiKey): boolean {
  const parsed = typeof apiKey === 'string' ? parseApiKey(apiKey) : apiKey
  return parsed.isTestKey
}

/**
 * Check if an API key is a live (production) key
 *
 * @param apiKey - The API key
 * @returns Whether the key is for live environment
 */
export function isLiveKey(apiKey: string | ParsedApiKey): boolean {
  const parsed = typeof apiKey === 'string' ? parseApiKey(apiKey) : apiKey
  return parsed.isValid && !parsed.isTestKey
}

// ============================================================================
// API Key Validation Errors
// ============================================================================

/**
 * Error thrown when API key validation fails
 */
export class ApiKeyValidationError extends Error {
  readonly code: ApiKeyErrorCode
  readonly details?: Record<string, unknown>

  constructor(code: ApiKeyErrorCode, message: string, details?: Record<string, unknown>) {
    super(message)
    this.name = 'ApiKeyValidationError'
    this.code = code
    this.details = details
  }
}

/**
 * API key error codes
 */
export type ApiKeyErrorCode =
  | 'INVALID_FORMAT'
  | 'INVALID_ENVIRONMENT'
  | 'INVALID_SCOPE'
  | 'PERMISSION_DENIED'
  | 'KEY_EXPIRED'
  | 'KEY_REVOKED'

/**
 * Validate an API key and throw if invalid
 *
 * @param apiKey - The API key to validate
 * @throws ApiKeyValidationError if the key is invalid
 *
 * @example
 * ```typescript
 * try {
 *   validateApiKey(userProvidedKey)
 * } catch (error) {
 *   if (error instanceof ApiKeyValidationError) {
 *     console.error('Invalid API key:', error.code)
 *   }
 * }
 * ```
 */
export function validateApiKey(apiKey: string): ParsedApiKey {
  if (!apiKey || typeof apiKey !== 'string') {
    throw new ApiKeyValidationError(
      'INVALID_FORMAT',
      'API key must be a non-empty string'
    )
  }

  const trimmed = apiKey.trim()

  if (trimmed.length < 20) {
    throw new ApiKeyValidationError(
      'INVALID_FORMAT',
      'API key is too short'
    )
  }

  if (!trimmed.startsWith('qe_')) {
    throw new ApiKeyValidationError(
      'INVALID_FORMAT',
      'API key must start with "qe_"'
    )
  }

  const parsed = parseApiKey(trimmed)

  if (!parsed.isValid) {
    throw new ApiKeyValidationError(
      'INVALID_FORMAT',
      'API key format is invalid. Expected: qe_{live|test}_{scope}_{identifier}',
      { receivedPrefix: trimmed.substring(0, 20) + '...' }
    )
  }

  return parsed
}

/**
 * Assert that an API key has a specific permission
 *
 * @param apiKey - The API key
 * @param permission - The required permission
 * @param action - Description of the action for error message
 * @throws ApiKeyValidationError if permission is denied
 *
 * @example
 * ```typescript
 * // In your webhook management code:
 * assertPermission(apiKey, 'manageWebhooks', 'create webhook')
 * ```
 */
export function assertPermission(
  apiKey: string | ParsedApiKey,
  permission: keyof ApiKeyPermissions,
  action?: string
): void {
  if (!hasPermission(apiKey, permission)) {
    const parsed = typeof apiKey === 'string' ? parseApiKey(apiKey) : apiKey
    throw new ApiKeyValidationError(
      'PERMISSION_DENIED',
      `API key with scope "${parsed.scope}" cannot ${action || permission}. ` +
      `Required permission: ${permission}`,
      { scope: parsed.scope, permission }
    )
  }
}

// ============================================================================
// API Key Utilities
// ============================================================================

/**
 * Mask an API key for safe display
 *
 * @param apiKey - The API key to mask
 * @param visibleChars - Number of characters to show at end (default: 4)
 * @returns Masked API key string
 *
 * @example
 * ```typescript
 * maskApiKey('qe_live_full_abc123def456ghi789jkl012')
 * // => 'qe_live_full_****************************l012'
 * ```
 */
export function maskApiKey(apiKey: string, visibleChars: number = 4): string {
  const parsed = parseApiKey(apiKey)

  if (!parsed.isValid) {
    // For invalid keys, just mask most of it
    if (apiKey.length <= 8) return '****'
    return apiKey.substring(0, 4) + '*'.repeat(apiKey.length - 8) + apiKey.slice(-4)
  }

  const prefix = `qe_${parsed.environment}_${parsed.scope}_`
  const maskedIdentifier =
    '*'.repeat(Math.max(0, parsed.identifier.length - visibleChars)) +
    parsed.identifier.slice(-visibleChars)

  return prefix + maskedIdentifier
}

/**
 * Get a human-readable description of an API key scope
 *
 * @param scope - The API key scope
 * @returns Description of what the scope allows
 */
export function getScopeDescription(scope: ApiKeyScope): string {
  const descriptions: Record<ApiKeyScope, string> = {
    full: 'Full access to all SDK features including chat, quotes, payments, and webhooks',
    read: 'Read-only access to quotes and analytics',
    widget: 'Widget operations including chat, quote generation, and payments',
    webhook: 'Webhook management only',
    payment: 'Payment operations and quote reading only',
  }

  return descriptions[scope]
}

/**
 * List all permissions for a scope
 *
 * @param scope - The API key scope
 * @returns Array of permission names that are enabled
 */
export function listEnabledPermissions(scope: ApiKeyScope): (keyof ApiKeyPermissions)[] {
  const perms = SCOPE_PERMISSIONS[scope]
  return (Object.keys(perms) as (keyof ApiKeyPermissions)[]).filter(
    (key) => perms[key]
  )
}
