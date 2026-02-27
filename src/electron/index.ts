/**
 * ThinkPink Quote Engine SDK - Electron Integration
 *
 * Provides helpers for using the Quote Engine in Electron desktop apps.
 * Supports both main process (window management, IPC) and renderer
 * process (React hooks via preload bridge).
 *
 * @packageDocumentation
 *
 * ## Architecture
 *
 * ```
 * Main Process                 Renderer Process
 * ┌──────────────────┐        ┌──────────────────┐
 * │ createQEWindow() │◄──────►│ React hooks      │
 * │ registerIPC()    │  IPC   │ useQuoteChat()   │
 * │ QuoteEngineMain  │        │ useQuote()       │
 * └──────────────────┘        └──────────────────┘
 * ```
 *
 * @example Main Process
 * ```ts
 * // main.ts
 * import { QuoteEngineMain } from '@thinkpinkstudio/quote-engine-sdk/electron'
 *
 * const qeMain = new QuoteEngineMain({
 *   apiKey: process.env.QE_API_KEY!,
 *   language: 'it',
 * })
 *
 * app.whenReady().then(() => {
 *   qeMain.registerIPC()
 *   // or create a dedicated window:
 *   qeMain.createWindow({ width: 480, height: 700 })
 * })
 * ```
 *
 * @example Renderer Process (with React)
 * ```tsx
 * // Use the standard React integration in the renderer
 * import { QuoteEngineProvider, useQuoteChat } from '@thinkpinkstudio/quote-engine-sdk/react'
 *
 * function App() {
 *   return (
 *     <QuoteEngineProvider config={{ apiKey: 'your-key' }}>
 *       <ChatView />
 *     </QuoteEngineProvider>
 *   )
 * }
 * ```
 *
 * @example Preload Script
 * ```ts
 * // preload.ts
 * import { exposeQuoteEngineAPI } from '@thinkpinkstudio/quote-engine-sdk/electron'
 *
 * exposeQuoteEngineAPI()
 * ```
 */

// Re-export core
export {
  QuoteEngineClient,
  createQuoteEngine,
  VERSION,
} from '../core'

export type {
  QuoteEngineConfig,
  Language,
  ThemeConfig,
  CallbackHandlers,
  ChatMessage,
  ChatSession,
  CustomerData,
  Quote,
  QuoteStatus,
  QuoteStep,
  WidgetState,
  QuoteEngineError,
  QuoteEngineErrorCode,
  PaymentInitResponse,
} from '../core'

export {
  formatCurrency,
  formatDate,
  translations,
  t,
} from '../core'

// Electron-specific exports
export { QuoteEngineMain, type QEWindowOptions } from './main'
export { exposeQuoteEngineAPI, type QEPreloadAPI } from './preload'
