/**
 * ThinkPink Quote Engine SDK
 *
 * Framework-agnostic SDK for integrating the ThinkPink Quote Engine
 * into any JavaScript application.
 *
 * @packageDocumentation
 */

// Export main client
export { QuoteEngineClient, createQuoteEngine } from './client'

// Export all types
export type {
  // Configuration
  QuoteEngineConfig,
  Language,
  ThemeStyle,
  ThemeConfig,
  TextLabels,
  ClassNameOverrides,
  CallbackHandlers,

  // Tenant
  TenantPlan,
  TenantPublicConfig,

  // Chat
  ChatMessage,
  ChatSession,
  CustomerData,
  ExtractedRequirements,
  MessageMetadata,

  // Quote
  Quote,
  QuoteStatus,
  Customer,
  ConversationData,
  Project,
  ProjectType,
  Complexity,
  Technology,
  Feature,
  Timeline,
  ProjectPhase,

  // Pricing
  Pricing,
  PriceBreakdown,
  PriceCategory,
  Discount,
  VatInfo,
  DepositInfo,
  PaymentMilestone,

  // Payment
  PaymentMethod,
  PaymentStatus,
  PaymentInitResponse,
  EscrowInfo,
  ContractInfo,

  // Widget
  WidgetState,
  WidgetMode,
  WidgetPosition,
  WidgetOptions,
  QuoteStep,

  // Errors
  QuoteEngineError,
  QuoteEngineErrorCode,

  // Storage
  StorageAdapter,

  // API
  ApiResponse,
  ChatResponse,
  QuoteGenerationResponse,
  StreamEvent,
  StreamEventType,
  WebhookEvent,

  // RAG (v2.0+)
  RAGInsight,
  ChatMessageV2,
  SimilarProjectRef,
  QuoteV2,

  // Events
  QuoteEngineEvent,
  Unsubscribe,
  DeepPartial,
} from './types'

// Export plan constants
export { PLAN_LIMITS, PLAN_PRICING } from './types'

// Export utilities
export {
  formatCurrency,
  formatDate,
  formatQuoteNumber,
  getDaysUntilExpiry,
  isQuoteExpired,
  generateThemeCss,
  debounce,
  throttle,
  isValidEmail,
  isValidPhone,
  getCountryFromLocale,
  getLocaleFromLanguage,
  deepMerge,
  calculatePricingSummary,
  storage,
  translations,
  t,
} from './utils'

// Export theme manager and style presets
export {
  ThemeManager,
  createThemeManager,
  DEFAULT_DARK_THEME,
  // Style presets
  GLASS_THEME_LIGHT,
  GLASS_THEME_DARK,
  MINIMAL_THEME_LIGHT,
  MINIMAL_THEME_DARK,
  ELEGANT_THEME_LIGHT,
  ELEGANT_THEME_DARK,
  THEME_STYLE_PRESETS,
  // Helper functions
  getThemePreset,
  createStyledTheme,
} from './theme'

export type { ThemeMode, ThemeManagerOptions } from './theme'

// Export analytics
export {
  Analytics,
  createAnalytics,
  createAnalyticsFromConfig,
} from './analytics'

export type { AnalyticsEventType, AnalyticsEvent, AnalyticsOptions } from './analytics'

// Export webhooks
export {
  WebhookClient,
  createWebhookClient,
  computeSignature,
  verifySignature,
  constructEvent,
  WEBHOOK_SIGNATURE_HEADER,
  WEBHOOK_TIMESTAMP_HEADER,
  WEBHOOK_ID_HEADER,
} from './webhooks'

export type {
  WebhookEventType,
  WebhookPayload,
  WebhookPayloadBase,
  QuoteEventPayload,
  ChatCompletedPayload,
  PaymentEventPayload,
  ContractSignedPayload,
  WebhookEndpoint,
  WebhookClientOptions,
} from './webhooks'

// Export API key utilities
export {
  parseApiKey,
  isValidApiKeyFormat,
  getApiKeyPermissions,
  hasPermission,
  isTestKey,
  isLiveKey,
  validateApiKey,
  assertPermission,
  maskApiKey,
  getScopeDescription,
  listEnabledPermissions,
  ApiKeyValidationError,
  SCOPE_PERMISSIONS,
} from './api-keys'

export type {
  ApiKeyEnvironment,
  ApiKeyScope,
  ParsedApiKey,
  ApiKeyPermissions,
  ApiKeyErrorCode,
} from './api-keys'

// SDK Version
export const VERSION = '1.0.0'

// Default export
export { createQuoteEngine as default } from './client'
