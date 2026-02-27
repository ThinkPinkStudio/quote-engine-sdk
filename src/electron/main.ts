/**
 * ThinkPink Quote Engine SDK - Electron Main Process
 *
 * Provides window management and IPC handling for the Quote Engine
 * in Electron's main process. Uses dynamic require to avoid bundling
 * Electron as a dependency.
 */

import { QuoteEngineClient, createQuoteEngine } from '../core'
import type { QuoteEngineConfig, CustomerData } from '../core'

export interface QEWindowOptions {
  width?: number
  height?: number
  title?: string
  alwaysOnTop?: boolean
  frame?: boolean
  transparent?: boolean
  resizable?: boolean
  parent?: unknown
  preloadPath?: string
}

/**
 * Main process helper for Electron.
 *
 * Handles IPC communication between main and renderer processes,
 * and optionally manages a dedicated Quote Engine window.
 *
 * @example
 * ```ts
 * import { app, BrowserWindow } from 'electron'
 * import { QuoteEngineMain } from '@thinkpinkstudio/quote-engine-sdk/electron'
 *
 * const qe = new QuoteEngineMain({
 *   apiKey: process.env.QE_API_KEY!,
 *   language: 'it',
 * })
 *
 * app.whenReady().then(() => {
 *   qe.registerIPC()
 *
 *   const mainWindow = new BrowserWindow({ ... })
 *   // The renderer can now use useQuoteChat() etc. via IPC
 * })
 * ```
 */
export class QuoteEngineMain {
  private client: QuoteEngineClient
  private qeWindow: unknown = null

  constructor(config: QuoteEngineConfig) {
    this.client = createQuoteEngine(config)
  }

  /**
   * Register IPC handlers so the renderer process can call SDK methods.
   *
   * Registers these channels:
   * - `qe:start-chat` - Start a new chat session
   * - `qe:send-message` - Send a chat message
   * - `qe:generate-quote` - Generate a quote
   * - `qe:get-quote` - Get a quote by ID
   * - `qe:download-pdf` - Download quote PDF
   * - `qe:send-email` - Send quote via email
   * - `qe:init-payment` - Initialize payment
   * - `qe:confirm-payment` - Confirm payment
   * - `qe:validate-key` - Validate the API key
   */
  registerIPC(): void {
    let ipcMain: any
    try {
      ipcMain = require('electron').ipcMain
    } catch {
      throw new Error(
        'QuoteEngineMain.registerIPC() must be called from the Electron main process'
      )
    }

    ipcMain.handle('qe:validate-key', async () => {
      return this.client.validateKey()
    })

    ipcMain.handle('qe:start-chat', async (_event: unknown, customerData?: CustomerData) => {
      return this.client.startChat(customerData)
    })

    ipcMain.handle('qe:send-message', async (_event: unknown, content: string) => {
      const chunks: string[] = []
      await this.client.sendMessage(content, (chunk) => {
        chunks.push(chunk)
        // Forward streaming chunks to all renderer windows
        try {
          const { BrowserWindow } = require('electron')
          BrowserWindow.getAllWindows().forEach((win: any) => {
            win.webContents.send('qe:stream-chunk', chunk)
          })
        } catch {
          // Ignore if window not available
        }
      })
      return this.client.getSession()
    })

    ipcMain.handle('qe:generate-quote', async (_event: unknown, customerData: CustomerData) => {
      return this.client.generateQuote(customerData)
    })

    ipcMain.handle('qe:get-quote', async (_event: unknown, quoteId: string) => {
      return this.client.getQuote(quoteId)
    })

    ipcMain.handle('qe:download-pdf', async (_event: unknown, quoteId: string) => {
      const blob = await this.client.downloadPdf(quoteId)
      const buffer = await blob.arrayBuffer()
      return Buffer.from(buffer)
    })

    ipcMain.handle('qe:send-email', async (_event: unknown, quoteId: string, email?: string) => {
      return this.client.sendQuoteEmail(quoteId, email)
    })

    ipcMain.handle(
      'qe:init-payment',
      async (
        _event: unknown,
        quoteId: string,
        type: 'deposit' | 'milestone' | 'final',
        milestoneId?: string,
        returnUrl?: string
      ) => {
        return this.client.initPayment(quoteId, type, milestoneId, returnUrl)
      }
    )

    ipcMain.handle(
      'qe:confirm-payment',
      async (_event: unknown, quoteId: string, paymentIntentId: string) => {
        return this.client.confirmPayment(quoteId, paymentIntentId)
      }
    )
  }

  /**
   * Create a dedicated Quote Engine window.
   *
   * Useful for apps that want a separate floating quote widget window.
   */
  createWindow(options: QEWindowOptions = {}): unknown {
    let BrowserWindow: any
    try {
      BrowserWindow = require('electron').BrowserWindow
    } catch {
      throw new Error(
        'QuoteEngineMain.createWindow() must be called from the Electron main process'
      )
    }

    const {
      width = 480,
      height = 700,
      title = 'Quote Engine',
      alwaysOnTop = false,
      frame = true,
      transparent = false,
      resizable = true,
      parent,
      preloadPath,
    } = options

    this.qeWindow = new BrowserWindow({
      width,
      height,
      title,
      alwaysOnTop,
      frame,
      transparent,
      resizable,
      parent,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        ...(preloadPath ? { preload: preloadPath } : {}),
      },
    })

    return this.qeWindow
  }

  /**
   * Get the underlying QuoteEngineClient instance.
   */
  getClient(): QuoteEngineClient {
    return this.client
  }

  /**
   * Destroy the Quote Engine window if it exists.
   */
  destroyWindow(): void {
    if (this.qeWindow && (this.qeWindow as any).isDestroyed && !(this.qeWindow as any).isDestroyed()) {
      (this.qeWindow as any).destroy()
    }
    this.qeWindow = null
  }
}
