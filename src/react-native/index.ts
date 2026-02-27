/**
 * ThinkPink Quote Engine SDK - React Native Integration
 *
 * Provides hooks and utilities optimized for React Native apps.
 * Uses AsyncStorage instead of localStorage, handles network
 * connectivity, and provides mobile-optimized patterns.
 *
 * @packageDocumentation
 *
 * @example
 * ```tsx
 * import { QuoteEngineProvider, useQuoteChat } from '@thinkpinkstudio/quote-engine-sdk/react-native'
 *
 * function App() {
 *   return (
 *     <QuoteEngineProvider config={{
 *       apiKey: 'your-api-key',
 *       language: 'it',
 *     }}>
 *       <ChatScreen />
 *     </QuoteEngineProvider>
 *   )
 * }
 * ```
 */

// Re-export core client and types
export {
  QuoteEngineClient,
  createQuoteEngine,
  VERSION,
} from '../core'

export type {
  QuoteEngineConfig,
  Language,
  ThemeConfig,
  TextLabels,
  ClassNameOverrides,
  CallbackHandlers,
  ChatMessage,
  ChatSession,
  CustomerData,
  ExtractedRequirements,
  Quote,
  QuoteStatus,
  QuoteStep,
  WidgetState,
  WidgetOptions,
  QuoteEngineError,
  QuoteEngineErrorCode,
  PaymentInitResponse,
  Pricing,
  PriceBreakdown,
} from '../core'

export {
  formatCurrency,
  formatDate,
  isValidEmail,
  isValidPhone,
  translations,
  t,
} from '../core'

// React Native specific exports
export {
  QuoteEngineRNProvider,
  useQuoteEngineRNContext,
  type QuoteEngineRNProviderProps,
} from './QuoteEngineRNProvider'

export {
  useQuoteChat,
  useQuote,
  usePayment,
  useQuoteWidget,
  useQuoteEngineEvent,
  useCustomerForm,
  useNetworkStatus,
  useQuoteEngineTheme,
} from './hooks'

export { createRNStorage } from './storage'
