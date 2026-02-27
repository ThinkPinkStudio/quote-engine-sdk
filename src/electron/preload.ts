/**
 * ThinkPink Quote Engine SDK - Electron Preload Script
 *
 * Exposes a safe API bridge from the main process to the renderer
 * via contextBridge. This allows the renderer to call SDK methods
 * without having direct access to Node.js APIs.
 *
 * @example
 * ```ts
 * // preload.ts
 * import { exposeQuoteEngineAPI } from '@thinkpinkstudio/quote-engine-sdk/electron'
 * exposeQuoteEngineAPI()
 * ```
 *
 * Then in the renderer:
 * ```ts
 * // The API is available on window.quoteEngine
 * const session = await window.quoteEngine.startChat({ name: 'John' })
 * ```
 */

import type { CustomerData, ChatSession, Quote, PaymentInitResponse } from '../core'

/**
 * The API exposed to the renderer process via contextBridge.
 */
export interface QEPreloadAPI {
  validateKey(): Promise<unknown>
  startChat(customerData?: CustomerData): Promise<ChatSession>
  sendMessage(content: string): Promise<ChatSession>
  generateQuote(customerData: CustomerData): Promise<Quote>
  getQuote(quoteId: string): Promise<Quote>
  downloadPdf(quoteId: string): Promise<ArrayBuffer>
  sendEmail(quoteId: string, email?: string): Promise<void>
  initPayment(
    quoteId: string,
    type: 'deposit' | 'milestone' | 'final',
    milestoneId?: string,
    returnUrl?: string
  ): Promise<PaymentInitResponse>
  confirmPayment(quoteId: string, paymentIntentId: string): Promise<void>
  onStreamChunk(callback: (chunk: string) => void): () => void
}

/**
 * Expose the Quote Engine API to the renderer process.
 *
 * Call this in your Electron preload script. It uses `contextBridge`
 * to safely expose IPC-based methods on `window.quoteEngine`.
 *
 * @param apiName - The name of the API on the window object (default: 'quoteEngine')
 */
export function exposeQuoteEngineAPI(apiName: string = 'quoteEngine'): void {
  let contextBridge: any
  let ipcRenderer: any

  try {
    const electron = require('electron')
    contextBridge = electron.contextBridge
    ipcRenderer = electron.ipcRenderer
  } catch {
    throw new Error(
      'exposeQuoteEngineAPI() must be called from an Electron preload script'
    )
  }

  const api: QEPreloadAPI = {
    validateKey: () => ipcRenderer.invoke('qe:validate-key'),

    startChat: (customerData?: CustomerData) =>
      ipcRenderer.invoke('qe:start-chat', customerData),

    sendMessage: (content: string) =>
      ipcRenderer.invoke('qe:send-message', content),

    generateQuote: (customerData: CustomerData) =>
      ipcRenderer.invoke('qe:generate-quote', customerData),

    getQuote: (quoteId: string) =>
      ipcRenderer.invoke('qe:get-quote', quoteId),

    downloadPdf: (quoteId: string) =>
      ipcRenderer.invoke('qe:download-pdf', quoteId),

    sendEmail: (quoteId: string, email?: string) =>
      ipcRenderer.invoke('qe:send-email', quoteId, email),

    initPayment: (
      quoteId: string,
      type: 'deposit' | 'milestone' | 'final',
      milestoneId?: string,
      returnUrl?: string
    ) => ipcRenderer.invoke('qe:init-payment', quoteId, type, milestoneId, returnUrl),

    confirmPayment: (quoteId: string, paymentIntentId: string) =>
      ipcRenderer.invoke('qe:confirm-payment', quoteId, paymentIntentId),

    onStreamChunk: (callback: (chunk: string) => void) => {
      const handler = (_event: unknown, chunk: string) => callback(chunk)
      ipcRenderer.on('qe:stream-chunk', handler)
      return () => {
        ipcRenderer.removeListener('qe:stream-chunk', handler)
      }
    },
  }

  contextBridge.exposeInMainWorld(apiName, api)
}

/**
 * Type augmentation for the renderer window object.
 *
 * Add this to your renderer's global types:
 * ```ts
 * import type { QEPreloadAPI } from '@thinkpinkstudio/quote-engine-sdk/electron'
 *
 * declare global {
 *   interface Window {
 *     quoteEngine: QEPreloadAPI
 *   }
 * }
 * ```
 */
declare global {
  interface Window {
    quoteEngine?: QEPreloadAPI
  }
}
