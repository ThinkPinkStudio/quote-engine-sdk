/**
 * ThinkPink Quote Engine SDK - Core Client
 *
 * Framework-agnostic client for interacting with the Quote Engine API
 * Uses Stripe Connect for payments with escrow functionality
 */

import type {
  QuoteEngineConfig,
  ChatSession,
  ChatMessage,
  Quote,
  CustomerData,
  QuoteEngineError,
  QuoteEngineErrorCode,
  StreamEvent,
  Language,
  Unsubscribe,
  QuoteEngineEvent,
  CallbackHandlers,
  QuoteStep,
  PaymentInitResponse,
  StorageAdapter,
  RAGInsight,
} from './types'
import { storage as defaultStorage } from './utils'

const DEFAULT_BASE_URL = 'https://www.thinkpinkstudio.it'
const DEFAULT_TIMEOUT = 30000
const DEFAULT_MAX_RETRIES = 3
const DEFAULT_RETRY_BASE_DELAY = 1000 // 1 second

/**
 * Event emitter for the SDK
 */
class EventEmitter {
  private listeners: Map<string, Set<Function>> = new Map()

  on(event: string, callback: Function): Unsubscribe {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)
    return () => this.off(event, callback)
  }

  off(event: string, callback: Function): void {
    this.listeners.get(event)?.delete(callback)
  }

  emit(event: string, ...args: unknown[]): void {
    this.listeners.get(event)?.forEach((callback) => {
      try {
        callback(...args)
      } catch (e) {
        console.error(`Error in event handler for ${event}:`, e)
      }
    })
  }
}

/**
 * Main Quote Engine Client
 */
export class QuoteEngineClient extends EventEmitter {
  private config: Required<
    Pick<QuoteEngineConfig, 'apiKey' | 'baseUrl' | 'language' | 'debug' | 'timeout'>
  > &
    QuoteEngineConfig & {
      maxRetries: number
      retryBaseDelay: number
      persistSession: boolean
    }

  private currentSession: ChatSession | null = null
  private currentQuote: Quote | null = null
  private abortController: AbortController | null = null
  private storage: StorageAdapter
  private lastRAGInsight: RAGInsight | null = null

  private static readonly SESSION_STORAGE_KEY = 'session'
  private static readonly QUOTE_STORAGE_KEY = 'quote'

  constructor(config: QuoteEngineConfig) {
    super()
    this.validateConfig(config)

    this.storage = config.storage || defaultStorage
    this.config = {
      ...config,
      baseUrl: DEFAULT_BASE_URL, // Fixed, not configurable
      language: config.language || 'en',
      debug: config.debug || false,
      timeout: config.timeout || DEFAULT_TIMEOUT,
      maxRetries: config.maxRetries ?? DEFAULT_MAX_RETRIES,
      retryBaseDelay: config.retryBaseDelay ?? DEFAULT_RETRY_BASE_DELAY,
      persistSession: config.persistSession ?? true,
    }

    // Register callback handlers as event listeners
    if (config.callbacks) {
      this.registerCallbacks(config.callbacks)
    }

    // Restore session from storage
    if (this.config.persistSession) {
      this.restoreSession()
    }

    this.log('QuoteEngineClient initialized')
    this.emit('ready')
    this.config.callbacks?.onReady?.()
  }

  /**
   * Validate the API key and fetch tenant configuration.
   * Call this after construction to verify the key is valid
   * and load the tenant branding/config from the backend.
   */
  async validateKey(): Promise<{
    tenant: {
      slug: string
      plan: string
      status: string
      branding: Record<string, unknown>
      aiConfig: Record<string, unknown>
    }
    environment: string
  }> {
    const response = await this.fetch('/api/qe-sdk/validate', {
      method: 'POST',
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw this.createError(
        'INVALID_API_KEY',
        error.error?.message || 'API key validation failed'
      )
    }

    const data = await response.json()
    return data.data
  }

  // ===========================================================================
  // Configuration
  // ===========================================================================

  /**
   * Update configuration
   */
  setConfig(config: Partial<QuoteEngineConfig>): void {
    // baseUrl is not configurable
    const { baseUrl, ...rest } = config
    this.config = { ...this.config, ...rest }
    if (config.callbacks) {
      this.registerCallbacks(config.callbacks)
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): QuoteEngineConfig {
    return { ...this.config }
  }

  /**
   * Set language
   */
  setLanguage(language: Language): void {
    this.config.language = language
  }

  // ===========================================================================
  // Chat Operations
  // ===========================================================================

  /**
   * Start a new chat session
   */
  async startChat(customerData?: CustomerData): Promise<ChatSession> {
    this.log('Starting new chat session')
    this.emit('chatStart')
    this.config.callbacks?.onChatStart?.()

    const session: ChatSession = {
      id: this.generateId(),
      messages: [],
      status: 'active',
      customerData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.currentSession = session
    this.saveSession()
    return session
  }

  /**
   * Send a message and get AI response (streaming)
   */
  async sendMessage(
    content: string,
    onChunk?: (text: string) => void
  ): Promise<ChatMessage> {
    if (!this.currentSession) {
      throw this.createError('SESSION_EXPIRED', 'No active chat session')
    }

    const userMessage: ChatMessage = {
      id: this.generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    this.currentSession.messages.push(userMessage)
    this.currentSession.updatedAt = new Date()

    this.emit('messageSent', userMessage)
    this.config.callbacks?.onMessageSent?.(userMessage)

    this.log('Sending message', { content: content.substring(0, 50) + '...' })

    try {
      const assistantMessage = await this.streamChat(
        this.currentSession.messages,
        onChunk
      )

      this.currentSession.messages.push(assistantMessage)
      this.currentSession.updatedAt = new Date()

      // Save session after receiving message
      this.saveSession()

      this.emit('messageReceived', assistantMessage)
      this.config.callbacks?.onMessageReceived?.(assistantMessage)

      // Check if quote should be generated
      if (assistantMessage.metadata?.shouldGenerateQuote) {
        this.log('AI suggests generating quote')
      }

      return assistantMessage
    } catch (error) {
      const qeError = this.handleError(error)
      this.emit('error', qeError)
      this.config.callbacks?.onError?.(qeError)
      throw qeError
    }
  }

  /**
   * Stream chat response from API
   */
  private async streamChat(
    messages: ChatMessage[],
    onChunk?: (text: string) => void
  ): Promise<ChatMessage> {
    this.abortController = new AbortController()

    const response = await this.fetch('/api/qe-sdk/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        language: this.config.language,
        customerData: this.currentSession?.customerData,
      }),
      signal: this.abortController.signal,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw this.createError(
        'CHAT_ERROR',
        error.message || 'Failed to send message'
      )
    }

    // Handle streaming response
    const body = response.body
    if (!body) {
      throw this.createError('CHAT_ERROR', 'No response body')
    }

    const reader = body.getReader()

    const decoder = new TextDecoder()
    let fullContent = ''
    let metadata: ChatMessage['metadata'] = {}

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        let chunk: string
        console.error('DEBUG_CHUNK:', typeof value, value)
        if (typeof value === 'string') {
          chunk = value
        } else if (value) {
          try {
            // Normalize value to a local Uint8Array to handle cross-realm issues in some test environments
            const buffer = (value instanceof Uint8Array) ? value : Uint8Array.from(value as any)
            chunk = decoder.decode(buffer, { stream: true })
          } catch {
            chunk = String(value)
          }
        } else {
          chunk = ''
        }

        const lines = chunk.split('\n')

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()
          if (!line) continue

          if (!line.startsWith('data: ')) {
            this.log(`Ignoring non-data line: ${line}`)
            continue
          }

          const jsonStr = line.replace('data: ', '')
          try {
            const event: StreamEvent = JSON.parse(jsonStr)
            this.log(`Parsed event type: ${event.type}`)

            if (event.type === 'content' && event.data.text) {
              fullContent += event.data.text
              onChunk?.(event.data.text)
            } else if (event.type === 'rag_context') {
              const ragInsight: RAGInsight = {
                dataPoints: (event as any).dataPoints || 0,
                confidence: (event as any).confidence || 0,
                similarProjectsCount: (event as any).similarProjectsCount || 0,
                pricingRange: (event as any).pricingRange,
              }
              this.lastRAGInsight = ragInsight
              this.emit('ragContextReceived', ragInsight)
            } else if (event.type === 'metadata') {
              metadata = {
                confidence: event.data.confidence,
                shouldGenerateQuote: event.data.shouldGenerateQuote,
              }
            } else if (event.type === 'error') {
              throw this.createError('CHAT_ERROR', event.data.error || 'Stream error')
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    } finally {
      reader.releaseLock()
    }

    return {
      id: this.generateId(),
      role: 'assistant',
      content: fullContent,
      timestamp: new Date(),
      metadata,
    }
  }

  /**
   * Cancel ongoing chat request
   */
  cancelChat(): void {
    this.abortController?.abort()
    this.abortController = null
  }

  /**
   * Get current chat session
   */
  getSession(): ChatSession | null {
    return this.currentSession
  }

  /**
   * Get the last RAG insight received during chat
   */
  getLastRAGInsight(): RAGInsight | null {
    return this.lastRAGInsight
  }

  /**
   * Clear current session
   */
  clearSession(): void {
    this.currentSession = null
    this.currentQuote = null

    // Remove from storage
    if (this.config.persistSession) {
      this.storage.remove(QuoteEngineClient.SESSION_STORAGE_KEY)
      this.storage.remove(QuoteEngineClient.QUOTE_STORAGE_KEY)
    }
  }

  // ===========================================================================
  // Session Persistence
  // ===========================================================================

  /**
   * Restore session from storage
   */
  private restoreSession(): void {
    try {
      const sessionData = this.storage.get<ChatSession>(QuoteEngineClient.SESSION_STORAGE_KEY)
      const quoteData = this.storage.get<Quote>(QuoteEngineClient.QUOTE_STORAGE_KEY)

      // Handle async storage (returns a Promise)
      if (sessionData instanceof Promise) {
        sessionData.then((session) => {
          if (session) {
            this.currentSession = this.deserializeSession(session as any)
            this.log('Session restored from storage')
          }
        })
        if (quoteData instanceof Promise) {
          quoteData.then((quote) => {
            if (quote) {
              this.currentQuote = quote
              this.log('Quote restored from storage')
            }
          })
        }
      } else {
        // Sync storage (localStorage)
        if (sessionData) {
          this.currentSession = this.deserializeSession(sessionData as any)
          this.log('Session restored from storage')
        }
        if (quoteData && !(quoteData instanceof Promise)) {
          this.currentQuote = quoteData
          this.log('Quote restored from storage')
        }
      }
    } catch (error) {
      this.log('Failed to restore session:', error)
    }
  }

  /**
   * Save session to storage
   */
  private saveSession(): void {
    if (!this.config.persistSession || !this.currentSession) return

    try {
      this.storage.set(QuoteEngineClient.SESSION_STORAGE_KEY, this.serializeSession(this.currentSession))

      if (this.currentQuote) {
        this.storage.set(QuoteEngineClient.QUOTE_STORAGE_KEY, this.currentQuote)
      }
    } catch (error) {
      this.log('Failed to save session:', error)
    }
  }

  /**
   * Serialize session for storage (convert Date objects to ISO strings)
   */
  private serializeSession(session: ChatSession): Record<string, unknown> {
    return {
      ...session,
      createdAt: session.createdAt instanceof Date ? session.createdAt.toISOString() : session.createdAt,
      updatedAt: session.updatedAt instanceof Date ? session.updatedAt.toISOString() : session.updatedAt,
      messages: session.messages.map((msg) => ({
        ...msg,
        timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp,
      })),
    }
  }

  /**
   * Deserialize session from storage (convert ISO strings back to Date objects)
   */
  private deserializeSession(data: Record<string, unknown>): ChatSession {
    return {
      ...data,
      createdAt: new Date(data.createdAt as string),
      updatedAt: new Date(data.updatedAt as string),
      messages: ((data.messages as Array<Record<string, unknown>>) || []).map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp as string),
      })),
    } as ChatSession
  }

  // ===========================================================================
  // Quote Operations
  // ===========================================================================

  /**
   * Generate a quote from the current conversation
   */
  async generateQuote(customerData?: CustomerData): Promise<Quote> {
    if (!this.currentSession) {
      throw this.createError('SESSION_EXPIRED', 'No active chat session')
    }

    const customer = customerData || this.currentSession.customerData
    if (!customer?.email || !customer?.name) {
      throw this.createError(
        'VALIDATION_ERROR',
        'Customer name and email are required'
      )
    }

    this.log('Generating quote')

    try {
      const response = await this.fetch('/api/qe-sdk/quote/generate', {
        method: 'POST',
        body: JSON.stringify({
          customer,
          conversation: this.currentSession.messages,
          language: this.config.language,
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw this.createError(
          'QUOTE_GENERATION_ERROR',
          error.message || 'Failed to generate quote'
        )
      }

      const data = await response.json()
      this.currentQuote = data.quote
      this.currentSession.status = 'completed'

      // Save session and quote
      this.saveSession()

      this.emit('quoteGenerated', this.currentQuote!.id)
      this.config.callbacks?.onQuoteGenerated?.(this.currentQuote!.id)

      this.log('Quote generated', { quoteId: this.currentQuote!.id })

      return this.currentQuote!
    } catch (error) {
      const qeError = this.handleError(error)
      this.emit('error', qeError)
      this.config.callbacks?.onError?.(qeError)
      throw qeError
    }
  }

  /**
   * Get a quote by ID
   */
  async getQuote(quoteId: string): Promise<Quote> {
    const response = await this.fetch(`/api/qe-sdk/quote/${quoteId}`)

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw this.createError(
        'UNKNOWN_ERROR',
        error.message || 'Failed to get quote'
      )
    }

    const data = await response.json()
    return data.quote
  }

  /**
   * Get current quote
   */
  getCurrentQuote(): Quote | null {
    return this.currentQuote
  }

  /**
   * Send quote via email
   */
  async sendQuoteEmail(quoteId: string, email?: string): Promise<void> {
    const response = await this.fetch(`/api/qe-sdk/quote/${quoteId}/email`, {
      method: 'POST',
      body: JSON.stringify({ sendTo: email }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw this.createError(
        'UNKNOWN_ERROR',
        error.message || 'Failed to send email'
      )
    }
  }

  /**
   * Download quote PDF
   */
  async downloadPdf(quoteId: string): Promise<Blob> {
    const response = await this.fetch(`/api/qe-sdk/quote/${quoteId}/pdf`, {
      method: 'POST',
    })

    if (!response.ok) {
      throw this.createError('UNKNOWN_ERROR', 'Failed to download PDF')
    }

    return response.blob()
  }

  // ===========================================================================
  // Payment Operations (Stripe Connect with Escrow)
  // ===========================================================================

  /**
   * Initialize payment via Stripe
   *
   * Creates a PaymentIntent for the deposit amount.
   * For PRO/ENTERPRISE plans, payments go through escrow with platform fee.
   *
   * @param quoteId - The quote ID
   * @param type - Payment type: 'deposit', 'milestone', or 'final'
   * @param milestoneId - Required if type is 'milestone'
   * @param returnUrl - URL to redirect after payment
   */
  async initPayment(
    quoteId: string,
    type: 'deposit' | 'milestone' | 'final' = 'deposit',
    milestoneId?: string,
    returnUrl?: string
  ): Promise<PaymentInitResponse> {
    this.emit('paymentStart', quoteId)
    this.config.callbacks?.onPaymentStart?.(quoteId)

    const response = await this.fetch('/api/qe-sdk/escrow', {
      method: 'POST',
      body: JSON.stringify({
        quoteId,
        type,
        milestoneId,
        returnUrl: returnUrl || window.location.href,
        customerEmail: this.currentQuote?.customer.email || this.currentSession?.customerData?.email,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      const stripeError = this.createError(
        'STRIPE_ERROR',
        error.message || 'Failed to initialize payment'
      )
      this.emit('error', stripeError)
      this.config.callbacks?.onError?.(stripeError)
      throw stripeError
    }

    const data = await response.json()
    return {
      paymentId: data.paymentId,
      paymentIntentId: data.paymentIntentId,
      clientSecret: data.clientSecret,
      amount: data.amount,
      platformFee: data.platformFee,
      isEscrow: data.isEscrow,
    }
  }

  /**
   * Confirm payment was successful
   *
   * Call this after Stripe confirms the payment on the frontend.
   */
  async confirmPayment(
    quoteId: string,
    paymentIntentId: string
  ): Promise<void> {
    const response = await this.fetch(`/api/qe-sdk/quote/${quoteId}/pay`, {
      method: 'POST',
      body: JSON.stringify({
        paymentIntentId,
        provider: 'stripe',
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw this.createError('PAYMENT_ERROR', error.message || 'Failed to confirm payment')
    }

    this.emit('paymentCompleted', paymentIntentId)
    this.config.callbacks?.onPaymentCompleted?.(paymentIntentId)
  }

  /**
   * Get escrow status for a quote
   */
  async getEscrowStatus(quoteId: string): Promise<{
    totalPaid: number
    platformFee: number
    totalHeld: number
    totalReleased: number
    remainingBalance: number
  }> {
    const quote = await this.getQuote(quoteId)

    if (!quote.escrow) {
      return {
        totalPaid: 0,
        platformFee: 0,
        totalHeld: 0,
        totalReleased: 0,
        remainingBalance: 0,
      }
    }

    return {
      totalPaid: quote.escrow.amountHeld + quote.escrow.platformFee,
      platformFee: quote.escrow.platformFee,
      totalHeld: quote.escrow.amountHeld,
      totalReleased: quote.escrow.amountReleased,
      remainingBalance: quote.escrow.amountHeld - quote.escrow.amountReleased,
    }
  }

  // ===========================================================================
  // Event Handling
  // ===========================================================================

  /**
   * Subscribe to events
   */
  addEventListener(
    event: QuoteEngineEvent,
    callback: Function
  ): Unsubscribe {
    return this.on(event, callback)
  }

  /**
   * Remove event listener
   */
  removeEventListener(event: QuoteEngineEvent, callback: Function): void {
    this.off(event, callback)
  }

  /**
   * Notify step change
   */
  notifyStepChange(step: QuoteStep): void {
    this.emit('stepChange', step)
    this.config.callbacks?.onStepChange?.(step)
  }

  /**
   * Notify close
   */
  notifyClose(): void {
    this.emit('close')
    this.config.callbacks?.onClose?.()
  }

  // ===========================================================================
  // Private Helpers
  // ===========================================================================

  private validateConfig(config: QuoteEngineConfig): void {
    if (!config.apiKey) {
      throw this.createError('INVALID_CONFIG', 'API key is required')
    }

    if (config.apiKey.length < 20) {
      throw this.createError('INVALID_API_KEY', 'Invalid API key format')
    }
  }

  private registerCallbacks(callbacks: CallbackHandlers): void {
    if (callbacks.onReady) this.on('ready', callbacks.onReady)
    if (callbacks.onChatStart) this.on('chatStart', callbacks.onChatStart)
    if (callbacks.onMessageSent) this.on('messageSent', callbacks.onMessageSent)
    if (callbacks.onMessageReceived) this.on('messageReceived', callbacks.onMessageReceived)
    if (callbacks.onQuoteGenerated) this.on('quoteGenerated', callbacks.onQuoteGenerated)
    if (callbacks.onPaymentStart) this.on('paymentStart', callbacks.onPaymentStart)
    if (callbacks.onPaymentCompleted) this.on('paymentCompleted', callbacks.onPaymentCompleted)
    if (callbacks.onError) this.on('error', callbacks.onError)
    if (callbacks.onClose) this.on('close', callbacks.onClose)
    if (callbacks.onStepChange) this.on('stepChange', callbacks.onStepChange)
  }

  private async fetch(
    endpoint: string,
    options: RequestInit = {},
    retryOptions: { skipRetry?: boolean } = {}
  ): Promise<Response> {
    const url = `${this.config.baseUrl}${endpoint}`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-API-Key': this.config.apiKey,
      'X-SDK-Version': '1.0.0',
      ...this.config.headers,
      ...((options.headers as Record<string, string>) || {}),
    }

    const maxRetries = retryOptions.skipRetry ? 0 : this.config.maxRetries
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

      try {
        const response = await fetch(url, {
          ...options,
          headers,
          signal: options.signal || controller.signal,
        })

        if (controller.signal.aborted) {
          throw new Error('AbortError')
        }

        clearTimeout(timeoutId)

        // Handle rate limiting with Retry-After header parsing
        if (response && response.status === 429) {
          const retryAfter = response.headers.get('Retry-After')
          let delayMs = this.calculateRetryDelay(attempt)

          if (retryAfter) {
            // Retry-After can be seconds or HTTP-date
            const retryAfterSeconds = parseInt(retryAfter, 10)
            if (!isNaN(retryAfterSeconds)) {
              delayMs = retryAfterSeconds * 1000
            }
          }

          if (attempt < maxRetries) {
            try { await response.text() } catch { /* ignore */ }
            this.log(`Rate limited, retrying in ${delayMs}ms (attempt ${attempt + 1}/${maxRetries})`)
            await this.sleep(delayMs)
            continue
          }

          throw this.createError(
            'RATE_LIMIT_EXCEEDED',
            'Too many requests. Please try again later.',
            { retryAfter: retryAfter || undefined }
          )
        }

        // Handle auth errors (no retry)
        if (response && response.status === 401) {
          throw this.createError('INVALID_API_KEY', 'Invalid or expired API key')
        }

        if (response && response.status === 403) {
          throw this.createError('API_KEY_EXPIRED', 'API key has expired')
        }

        // Handle quota exceeded (no retry)
        if (response && response.status === 402) {
          throw this.createError('QUOTA_EXCEEDED', 'Monthly quote limit exceeded. Please upgrade your plan.')
        }

        // Handle server errors with retry
        if (response && response.status >= 500 && attempt < maxRetries) {
          try { await response.text() } catch { /* ignore */ }
          const delay = this.calculateRetryDelay(attempt)
          this.log(`Server error (${response.status}), retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`)
          await this.sleep(delay)
          continue
        }

        if (!response) {
          throw lastError || this.createError('NETWORK_ERROR', 'No response received')
        }

        return response
      } catch (error) {
        clearTimeout(timeoutId)

        // AbortError from timeout
        if (error instanceof Error && error.name === 'AbortError') {
          if (attempt < maxRetries) {
            const delay = this.calculateRetryDelay(attempt)
            this.log(`Request timed out, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`)
            await this.sleep(delay)
            continue
          }
          throw this.createError('NETWORK_ERROR', 'Request timed out')
        }

        // Network errors (fetch failed)
        if (error instanceof TypeError && error.message.includes('fetch')) {
          if (attempt < maxRetries) {
            const delay = this.calculateRetryDelay(attempt)
            this.log(`Network error, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`)
            await this.sleep(delay)
            continue
          }
          throw this.createError('NETWORK_ERROR', 'Network request failed')
        }

        // If it's already a QuoteEngineError, don't retry
        if (this.isQuoteEngineError(error)) {
          throw error
        }

        lastError = error instanceof Error ? error : new Error(String(error))
      }
    }

    throw lastError || this.createError('NETWORK_ERROR', 'Request failed after retries')
  }

  /**
   * Calculate delay for exponential backoff
   * Formula: baseDelay * 2^attempt (1s, 2s, 4s)
   */
  private calculateRetryDelay(attempt: number): number {
    return this.config.retryBaseDelay * Math.pow(2, attempt)
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private createError(
    code: QuoteEngineErrorCode,
    message: string,
    details?: Record<string, unknown>
  ): QuoteEngineError {
    return {
      code,
      message,
      details,
    }
  }

  private handleError(error: unknown): QuoteEngineError {
    if (this.isQuoteEngineError(error)) {
      return error
    }

    if (error instanceof Error) {
      return this.createError('UNKNOWN_ERROR', error.message, {
        cause: error,
      })
    }

    return this.createError('UNKNOWN_ERROR', 'An unknown error occurred')
  }

  private isQuoteEngineError(error: unknown): error is QuoteEngineError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      'message' in error
    )
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }

  private log(...args: unknown[]): void {
    if (this.config.debug) {
      console.log('[QuoteEngine]', ...args)
    }
  }
}

/**
 * Create a new Quote Engine client instance
 */
export function createQuoteEngine(
  config: QuoteEngineConfig
): QuoteEngineClient {
  return new QuoteEngineClient(config)
}
