/**
 * ThinkPink Quote Engine SDK - Svelte Integration
 *
 * Svelte stores and utilities for the Quote Engine
 *
 * @packageDocumentation
 */

import { writable, derived, get, type Readable, type Writable } from 'svelte/store'
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

// Re-export core
export * from '../core'

/**
 * Payment initialization response
 */
export interface PaymentInitResult {
  paymentId: string
  paymentIntentId: string
  clientSecret: string
  amount: number
  platformFee: number
  isEscrow: boolean
}

/**
 * Escrow status
 */
export interface EscrowStatus {
  totalPaid: number
  platformFee: number
  totalHeld: number
  totalReleased: number
  remainingBalance: number
}

/**
 * Quote Engine Store Interface
 */
export interface QuoteEngineStore {
  /** Underlying client instance */
  client: QuoteEngineClient

  /** Widget state store */
  state: Writable<WidgetState>

  /** Streaming content store */
  streamingContent: Writable<string>

  /** Derived messages store */
  messages: Readable<ChatMessage[]>

  /** Derived should generate quote store */
  shouldGenerateQuote: Readable<boolean>

  // Methods
  startChat: (customerData?: CustomerData) => Promise<ChatSession>
  sendMessage: (content: string) => Promise<ChatMessage>
  generateQuote: (customerData?: CustomerData) => Promise<Quote>
  goToStep: (step: QuoteStep) => void
  setCustomerData: (data: Partial<CustomerData>) => void
  open: () => void
  close: () => void
  reset: () => void
  cancelChat: () => void
  downloadPdf: () => Promise<void>
  sendEmail: (email?: string) => Promise<void>
  getQuote: (id: string) => Promise<Quote>

  // Stripe Payment
  initPayment: (type?: 'deposit' | 'milestone' | 'final', milestoneId?: string, returnUrl?: string) => Promise<PaymentInitResult>
  confirmPayment: (paymentIntentId: string) => Promise<void>
  getEscrowStatus: () => Promise<EscrowStatus>
}

/**
 * Create Quote Engine Store
 *
 * Creates a Svelte store for the Quote Engine SDK
 *
 * @example
 * ```svelte
 * <script>
 *   import { createQuoteEngineStore } from '@thinkpinkstudio/quote-engine-sdk/svelte'
 *
 *   const quoteEngine = createQuoteEngineStore({
 *     apiKey: 'your-api-key'
 *   })
 *
 *   const { messages, sendMessage, state } = quoteEngine
 * </script>
 *
 * {#each $messages as message}
 *   <div>{message.content}</div>
 * {/each}
 *
 * <input on:keydown={(e) => e.key === 'Enter' && sendMessage(e.target.value)}>
 * ```
 */
export function createQuoteEngineStore(config: QuoteEngineConfig): QuoteEngineStore {
  const client = createQuoteEngine(config)

  // Create main state store
  const state = writable<WidgetState>({
    currentStep: 'chat',
    isOpen: false,
    isLoading: false,
    chatSession: null,
    quote: null,
    error: null,
    customerData: {},
  })

  // Streaming content store
  const streamingContent = writable<string>('')

  // Derived stores
  const messages = derived(state, ($state) => $state.chatSession?.messages || [])

  const shouldGenerateQuote = derived(messages, ($messages) =>
    $messages.some((m) => m.metadata?.shouldGenerateQuote)
  )

  // Methods
  async function startChat(customerData?: CustomerData): Promise<ChatSession> {
    state.update((s) => ({ ...s, isLoading: true, error: null }))

    try {
      const currentState = get(state)
      const session = await client.startChat(
        customerData || currentState.customerData
      )
      state.update((s) => ({
        ...s,
        chatSession: session,
        isLoading: false,
        currentStep: 'chat',
      }))
      return session
    } catch (error) {
      state.update((s) => ({
        ...s,
        error: error as QuoteEngineError,
        isLoading: false,
      }))
      throw error
    }
  }

  async function sendMessage(content: string): Promise<ChatMessage> {
    state.update((s) => ({ ...s, isLoading: true, error: null }))
    streamingContent.set('')

    try {
      const currentState = get(state)
      if (!currentState.chatSession) {
        await startChat()
      }

      const message = await client.sendMessage(content, (chunk) => {
        streamingContent.update((s) => s + chunk)
      })

      state.update((s) => ({
        ...s,
        chatSession: client.getSession(),
        isLoading: false,
      }))
      streamingContent.set('')
      return message
    } catch (error) {
      state.update((s) => ({
        ...s,
        error: error as QuoteEngineError,
        isLoading: false,
      }))
      streamingContent.set('')
      throw error
    }
  }

  async function generateQuote(customerData?: CustomerData): Promise<Quote> {
    state.update((s) => ({ ...s, isLoading: true, error: null }))

    try {
      const currentState = get(state)
      const data = customerData || currentState.customerData
      const quote = await client.generateQuote(data as CustomerData)
      state.update((s) => ({
        ...s,
        quote,
        isLoading: false,
        currentStep: 'preview',
      }))
      return quote
    } catch (error) {
      state.update((s) => ({
        ...s,
        error: error as QuoteEngineError,
        isLoading: false,
      }))
      throw error
    }
  }

  function goToStep(step: QuoteStep): void {
    state.update((s) => ({ ...s, currentStep: step }))
    client.notifyStepChange(step)
  }

  function setCustomerData(data: Partial<CustomerData>): void {
    state.update((s) => ({
      ...s,
      customerData: { ...s.customerData, ...data },
    }))
  }

  function open(): void {
    state.update((s) => ({ ...s, isOpen: true }))
  }

  function close(): void {
    state.update((s) => ({ ...s, isOpen: false }))
    client.notifyClose()
  }

  function reset(): void {
    client.clearSession()
    streamingContent.set('')
    state.set({
      currentStep: 'chat',
      isOpen: false,
      isLoading: false,
      chatSession: null,
      quote: null,
      error: null,
      customerData: {},
    })
  }

  function cancelChat(): void {
    client.cancelChat()
  }

  async function downloadPdf(): Promise<void> {
    const currentState = get(state)
    if (!currentState.quote) return
    const blob = await client.downloadPdf(currentState.quote.id)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentState.quote.quoteNumber}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function sendEmail(email?: string): Promise<void> {
    const currentState = get(state)
    if (!currentState.quote) return
    await client.sendQuoteEmail(currentState.quote.id, email)
  }

  async function getQuote(id: string): Promise<Quote> {
    return client.getQuote(id)
  }

  // Stripe Payment methods

  /**
   * Initialize a Stripe payment
   */
  async function initPayment(
    type: 'deposit' | 'milestone' | 'final' = 'deposit',
    milestoneId?: string,
    returnUrl?: string
  ): Promise<PaymentInitResult> {
    const currentState = get(state)
    if (!currentState.quote) throw new Error('No quote available')
    return client.initPayment(currentState.quote.id, type, milestoneId, returnUrl)
  }

  /**
   * Confirm payment was successful
   */
  async function confirmPayment(paymentIntentId: string): Promise<void> {
    const currentState = get(state)
    if (!currentState.quote) throw new Error('No quote available')
    return client.confirmPayment(currentState.quote.id, paymentIntentId)
  }

  /**
   * Get current escrow status
   */
  async function getEscrowStatus(): Promise<EscrowStatus> {
    const currentState = get(state)
    if (!currentState.quote) throw new Error('No quote available')
    return client.getEscrowStatus(currentState.quote.id)
  }

  return {
    client,
    state,
    streamingContent,
    messages,
    shouldGenerateQuote,
    startChat,
    sendMessage,
    generateQuote,
    goToStep,
    setCustomerData,
    open,
    close,
    reset,
    cancelChat,
    downloadPdf,
    sendEmail,
    getQuote,
    initPayment,
    confirmPayment,
    getEscrowStatus,
  }
}

/**
 * Context key for Quote Engine store
 */
export const QUOTE_ENGINE_CONTEXT_KEY = 'quote-engine'

/**
 * Get Quote Engine from context
 *
 * Use this in child components to access the Quote Engine store
 * that was set in a parent component.
 *
 * @example
 * ```svelte
 * <!-- Parent component -->
 * <script>
 *   import { setContext } from 'svelte'
 *   import { createQuoteEngineStore, QUOTE_ENGINE_CONTEXT_KEY } from '@thinkpinkstudio/quote-engine-sdk/svelte'
 *
 *   const quoteEngine = createQuoteEngineStore({ apiKey: 'your-api-key' })
 *   setContext(QUOTE_ENGINE_CONTEXT_KEY, quoteEngine)
 * </script>
 *
 * <!-- Child component -->
 * <script>
 *   import { getContext } from 'svelte'
 *   import { QUOTE_ENGINE_CONTEXT_KEY } from '@thinkpinkstudio/quote-engine-sdk/svelte'
 *
 *   const quoteEngine = getContext(QUOTE_ENGINE_CONTEXT_KEY)
 *   const { messages, sendMessage } = quoteEngine
 * </script>
 * ```
 */
