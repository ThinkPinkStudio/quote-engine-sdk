/**
 * ThinkPink Quote Engine SDK - Angular Service
 *
 * Injectable service for Angular applications
 */

import {
  QuoteEngineClient,
  createQuoteEngine,
  type QuoteEngineConfig,
  type ChatSession,
  type ChatMessage,
  type Quote,
  type QuoteStep,
  type QuoteEngineError,
  type CustomerData,
  type WidgetState,
} from '../core'

/**
 * Injection token name for Quote Engine config
 */
export const QUOTE_ENGINE_CONFIG = 'QUOTE_ENGINE_CONFIG'

/**
 * Service configuration interface
 */
export interface QuoteEngineServiceConfig extends QuoteEngineConfig { }

/**
 * Quote Engine Angular Service
 *
 * This service provides a wrapper around the Quote Engine client
 * that can be used in Angular applications.
 *
 * @example
 * ```typescript
 * // In your app.module.ts or app.config.ts
 * import { QuoteEngineService, QUOTE_ENGINE_CONFIG } from '@thinkpinkstudio/quote-engine-sdk/angular'
 *
 * // Using providers array
 * providers: [
 *   {
 *     provide: QUOTE_ENGINE_CONFIG,
 *     useValue: { apiKey: 'your-api-key' }
 *   },
 *   QuoteEngineService
 * ]
 *
 * // Or using standalone approach
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     {
 *       provide: QUOTE_ENGINE_CONFIG,
 *       useValue: { apiKey: 'your-api-key' }
 *     },
 *     QuoteEngineService
 *   ]
 * })
 * ```
 *
 * @example
 * ```typescript
 * // In your component
 * import { Component } from '@angular/core'
 * import { QuoteEngineService } from '@thinkpinkstudio/quote-engine-sdk/angular'
 *
 * @Component({
 *   selector: 'app-quote-widget',
 *   template: `
 *     <div *ngFor="let msg of messages$ | async">
 *       {{ msg.content }}
 *     </div>
 *     <input #input (keyup.enter)="send(input.value)">
 *   `
 * })
 * export class QuoteWidgetComponent {
 *   messages$ = this.quoteEngine.messages$
 *
 *   constructor(private quoteEngine: QuoteEngineService) {}
 *
 *   async send(content: string) {
 *     await this.quoteEngine.sendMessage(content)
 *   }
 * }
 * ```
 */
export class QuoteEngineService {
  private client: QuoteEngineClient
  private _state: WidgetState
  private _streamingContent: string = ''
  private stateListeners: Set<(state: WidgetState) => void> = new Set()

  constructor(config: QuoteEngineConfig) {
    this.client = createQuoteEngine(config)
    this._state = {
      currentStep: 'chat',
      isOpen: false,
      isLoading: false,
      chatSession: null,
      quote: null,
      error: null,
      customerData: {},
    }
  }

  /**
   * Factory method for creating the service with config
   */
  static create(config: QuoteEngineConfig): QuoteEngineService {
    return new QuoteEngineService(config)
  }

  // Getters
  get state(): WidgetState {
    return this._state
  }

  get streamingContent(): string {
    return this._streamingContent
  }

  get messages(): ChatMessage[] {
    return this._state.chatSession?.messages || []
  }

  get quote(): Quote | null {
    return this._state.quote
  }

  get isLoading(): boolean {
    return this._state.isLoading
  }

  get currentStep(): QuoteStep {
    return this._state.currentStep
  }

  get error(): QuoteEngineError | null {
    return this._state.error
  }

  get shouldGenerateQuote(): boolean {
    return this.messages.some((m) => m.metadata?.shouldGenerateQuote)
  }

  // State subscription
  subscribeToState(listener: (state: WidgetState) => void): () => void {
    this.stateListeners.add(listener)
    return () => this.stateListeners.delete(listener)
  }

  private updateState(partial: Partial<WidgetState>): void {
    this._state = { ...this._state, ...partial }
    this.stateListeners.forEach((listener) => listener(this._state))
  }

  // Chat operations
  async startChat(customerData?: CustomerData): Promise<ChatSession> {
    this.updateState({ isLoading: true, error: null })

    try {
      const session = await this.client.startChat(
        customerData || this._state.customerData
      )
      this.updateState({
        chatSession: session,
        isLoading: false,
        currentStep: 'chat',
      })
      return session
    } catch (error) {
      this.updateState({
        error: error as QuoteEngineError,
        isLoading: false,
      })
      throw error
    }
  }

  async sendMessage(content: string): Promise<ChatMessage> {
    this.updateState({ isLoading: true, error: null })
    this._streamingContent = ''

    try {
      if (!this._state.chatSession) {
        await this.startChat()
      }

      const message = await this.client.sendMessage(content, (chunk) => {
        this._streamingContent += chunk
      })

      this.updateState({
        chatSession: this.client.getSession(),
        isLoading: false,
      })
      this._streamingContent = ''
      return message
    } catch (error) {
      this.updateState({
        error: error as QuoteEngineError,
        isLoading: false,
      })
      this._streamingContent = ''
      throw error
    }
  }

  cancelChat(): void {
    this.client.cancelChat()
  }

  // Quote operations
  async generateQuote(customerData?: CustomerData): Promise<Quote> {
    this.updateState({ isLoading: true, error: null })

    try {
      const data = customerData || this._state.customerData
      const quote = await this.client.generateQuote(data as CustomerData)
      this.updateState({
        quote,
        isLoading: false,
        currentStep: 'preview',
      })
      return quote
    } catch (error) {
      this.updateState({
        error: error as QuoteEngineError,
        isLoading: false,
      })
      throw error
    }
  }

  async getQuote(quoteId: string): Promise<Quote> {
    return this.client.getQuote(quoteId)
  }

  async downloadPdf(): Promise<void> {
    if (!this._state.quote) return
    const blob = await this.client.downloadPdf(this._state.quote.id)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${this._state.quote.quoteNumber}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  async sendEmail(email?: string): Promise<void> {
    if (!this._state.quote) return
    await this.client.sendQuoteEmail(this._state.quote.id, email)
  }

  // Payment operations (Stripe Connect with escrow)

  /**
   * Initialize a Stripe payment
   *
   * @param type - Payment type: 'deposit', 'milestone', or 'final'
   * @param milestoneId - Required if type is 'milestone'
   * @param returnUrl - URL to redirect after payment
   * @returns PaymentInitResponse with clientSecret for Stripe Elements
   */
  async initPayment(
    type: 'deposit' | 'milestone' | 'final' = 'deposit',
    milestoneId?: string,
    returnUrl?: string
  ) {
    if (!this._state.quote) throw new Error('No quote available')
    return this.client.initPayment(this._state.quote.id, type, milestoneId, returnUrl)
  }

  /**
   * Confirm payment was successful
   * Call this after Stripe confirms the payment
   */
  async confirmPayment(paymentIntentId: string): Promise<void> {
    if (!this._state.quote) throw new Error('No quote available')
    return this.client.confirmPayment(this._state.quote.id, paymentIntentId)
  }

  /**
   * Get current escrow status for the quote
   */
  async getEscrowStatus() {
    if (!this._state.quote) throw new Error('No quote available')
    return this.client.getEscrowStatus(this._state.quote.id)
  }

  // Widget operations
  goToStep(step: QuoteStep): void {
    this.updateState({ currentStep: step })
    this.client.notifyStepChange(step)
  }

  setCustomerData(data: Partial<CustomerData>): void {
    this.updateState({
      customerData: { ...this._state.customerData, ...data },
    })
  }

  open(): void {
    this.updateState({ isOpen: true })
  }

  close(): void {
    this.updateState({ isOpen: false })
    this.client.notifyClose()
  }

  reset(): void {
    this.client.clearSession()
    this._streamingContent = ''
    this.updateState({
      currentStep: 'chat',
      isOpen: false,
      isLoading: false,
      chatSession: null,
      quote: null,
      error: null,
      customerData: {},
    })
  }

  // Event handling
  addEventListener(
    event: string,
    handler: (data: unknown) => void
  ): () => void {
    return this.client.addEventListener(event as never, handler)
  }

  destroy(): void {
    this.stateListeners.clear()
    this.client.clearSession()
  }
}

/**
 * RxJS integration helpers
 *
 * If you're using RxJS in your Angular application, you can use these
 * helpers to create observables from the service.
 *
 * @example
 * ```typescript
 * import { fromQuoteEngineState } from '@thinkpinkstudio/quote-engine-sdk/angular'
 *
 * const state$ = fromQuoteEngineState(quoteEngineService)
 * const messages$ = state$.pipe(
 *   map(state => state.chatSession?.messages || [])
 * )
 * ```
 */
export function fromQuoteEngineState(service: QuoteEngineService) {
  // Returns a simple object that can be used with RxJS if available
  return {
    subscribe: (observer: {
      next: (state: WidgetState) => void
      error?: (err: unknown) => void
      complete?: () => void
    }) => {
      const unsubscribe = service.subscribeToState(observer.next)
      return { unsubscribe }
    },
  }
}
