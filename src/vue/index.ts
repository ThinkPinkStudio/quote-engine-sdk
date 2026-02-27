/**
 * ThinkPink Quote Engine SDK - Vue Integration
 *
 * Vue 3 composables and utilities for the Quote Engine
 *
 * @packageDocumentation
 */

import {
  ref,
  reactive,
  computed,
  inject,
  onMounted,
  onUnmounted,
  type InjectionKey,
} from 'vue'
import {
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
 * Injection key for Quote Engine
 */
export const QuoteEngineKey: InjectionKey<ReturnType<typeof createQuoteEngineComposable>> =
  Symbol('QuoteEngine')

/**
 * Create Quote Engine composable
 *
 * @example
 * ```ts
 * // In your main.ts or App.vue setup
 * import { createQuoteEngineComposable, QuoteEngineKey } from '@thinkpinkstudio/quote-engine-sdk/vue'
 *
 * const quoteEngine = createQuoteEngineComposable({
 *   apiKey: 'your-api-key'
 * })
 *
 * app.provide(QuoteEngineKey, quoteEngine)
 * ```
 */
export function createQuoteEngineComposable(config: QuoteEngineConfig) {
  const client = createQuoteEngine(config)

  // Reactive state
  const state = reactive<WidgetState>({
    currentStep: 'chat',
    isOpen: false,
    isLoading: false,
    chatSession: null,
    quote: null,
    error: null,
    customerData: {},
  })

  const streamingContent = ref('')

  // Methods
  async function startChat(customerData?: CustomerData): Promise<ChatSession> {
    state.isLoading = true
    state.error = null

    try {
      const session = await client.startChat(customerData || state.customerData)
      state.chatSession = session
      state.isLoading = false
      state.currentStep = 'chat'
      return session
    } catch (error) {
      state.error = error as QuoteEngineError
      state.isLoading = false
      throw error
    }
  }

  async function sendMessage(content: string): Promise<ChatMessage> {
    state.isLoading = true
    state.error = null
    streamingContent.value = ''

    try {
      if (!state.chatSession) {
        await startChat()
      }

      const message = await client.sendMessage(content, (chunk) => {
        streamingContent.value += chunk
      })

      state.chatSession = client.getSession()
      state.isLoading = false
      streamingContent.value = ''
      return message
    } catch (error) {
      state.error = error as QuoteEngineError
      state.isLoading = false
      streamingContent.value = ''
      throw error
    }
  }

  async function generateQuote(customerData?: CustomerData): Promise<Quote> {
    state.isLoading = true
    state.error = null

    try {
      const data = customerData || state.customerData
      const quote = await client.generateQuote(data as CustomerData)
      state.quote = quote
      state.isLoading = false
      state.currentStep = 'preview'
      return quote
    } catch (error) {
      state.error = error as QuoteEngineError
      state.isLoading = false
      throw error
    }
  }

  function goToStep(step: QuoteStep): void {
    state.currentStep = step
    client.notifyStepChange(step)
  }

  function setCustomerData(data: Partial<CustomerData>): void {
    state.customerData = { ...state.customerData, ...data }
  }

  function open(): void {
    state.isOpen = true
  }

  function close(): void {
    state.isOpen = false
    client.notifyClose()
  }

  function reset(): void {
    client.clearSession()
    state.currentStep = 'chat'
    state.isOpen = false
    state.isLoading = false
    state.chatSession = null
    state.quote = null
    state.error = null
    state.customerData = {}
  }

  function cancelChat(): void {
    client.cancelChat()
  }

  async function downloadPdf(): Promise<void> {
    if (!state.quote) return
    const blob = await client.downloadPdf(state.quote.id)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${state.quote.quoteNumber}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function sendEmail(email?: string): Promise<void> {
    if (!state.quote) return
    await client.sendQuoteEmail(state.quote.id, email)
  }

  // Computed
  const messages = computed(() => state.chatSession?.messages || [])
  const shouldGenerateQuote = computed(() =>
    messages.value.some((m: ChatMessage) => m.metadata?.shouldGenerateQuote)
  )

  return {
    // Client
    client,

    // State
    state,
    streamingContent,
    messages,
    shouldGenerateQuote,

    // Methods
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
  }
}

/**
 * Use Quote Engine composable
 *
 * @example
 * ```vue
 * <script setup>
 * import { useQuoteEngine } from '@thinkpinkstudio/quote-engine-sdk/vue'
 *
 * const {
 *   state,
 *   messages,
 *   sendMessage,
 *   generateQuote
 * } = useQuoteEngine()
 * </script>
 * ```
 */
export function useQuoteEngine() {
  const quoteEngine = inject(QuoteEngineKey)

  if (!quoteEngine) {
    throw new Error(
      'useQuoteEngine must be used within a component that has provided QuoteEngineKey'
    )
  }

  return quoteEngine
}

/**
 * Use Quote Chat composable
 *
 * Focused composable for chat functionality only
 */
export function useQuoteChat() {
  const qe = useQuoteEngine()

  return {
    messages: qe.messages,
    streamingContent: qe.streamingContent,
    isLoading: computed(() => qe.state.isLoading),
    error: computed(() => qe.state.error),
    shouldGenerateQuote: qe.shouldGenerateQuote,
    sendMessage: qe.sendMessage,
    startChat: qe.startChat,
    cancelChat: qe.cancelChat,
  }
}

/**
 * Use Quote composable
 *
 * Focused composable for quote operations
 */
export function useQuote() {
  const qe = useQuoteEngine()

  return {
    quote: computed(() => qe.state.quote),
    isLoading: computed(() => qe.state.isLoading),
    error: computed(() => qe.state.error),
    generateQuote: qe.generateQuote,
    downloadPdf: qe.downloadPdf,
    sendEmail: qe.sendEmail,
    getQuote: (id: string) => qe.client.getQuote(id),
  }
}

/**
 * Use Payment composable
 *
 * Focused composable for Stripe payment operations with escrow support.
 * Platform fees (0%/4%/2% depending on plan) are automatically deducted.
 *
 * @example
 * ```vue
 * <script setup>
 * import { usePayment } from '@thinkpinkstudio/quote-engine-sdk/vue'
 * import { loadStripe } from '@stripe/stripe-js'
 *
 * const { initPayment, clientSecret, isProcessing } = usePayment()
 *
 * // Initialize payment
 * await initPayment('deposit')
 *
 * // Use clientSecret with Stripe Elements
 * const stripe = await loadStripe('pk_live_...')
 * const elements = stripe.elements({ clientSecret: clientSecret.value })
 * </script>
 * ```
 */
export function usePayment() {
  const qe = useQuoteEngine()

  const isProcessing = ref(false)
  const paymentError = ref<QuoteEngineError | null>(null)
  const clientSecret = ref<string | null>(null)
  const paymentIntentId = ref<string | null>(null)
  const escrowInfo = ref<{
    totalPaid: number
    platformFee: number
    totalHeld: number
    totalReleased: number
    remainingBalance: number
  } | null>(null)

  /**
   * Initialize a Stripe payment
   */
  async function initPayment(
    type: 'deposit' | 'milestone' | 'final' = 'deposit',
    milestoneId?: string,
    returnUrl?: string
  ) {
    if (!qe.state.quote) throw new Error('No quote available')

    isProcessing.value = true
    paymentError.value = null

    try {
      const result = await qe.client.initPayment(qe.state.quote.id, type, milestoneId, returnUrl)
      clientSecret.value = result.clientSecret
      paymentIntentId.value = result.paymentIntentId
      return result
    } catch (error) {
      paymentError.value = error as QuoteEngineError
      throw error
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Confirm payment was successful
   */
  async function confirmPayment() {
    if (!qe.state.quote) throw new Error('No quote available')
    if (!paymentIntentId.value) throw new Error('No payment initialized')

    isProcessing.value = true
    paymentError.value = null

    try {
      await qe.client.confirmPayment(qe.state.quote.id, paymentIntentId.value)
      clientSecret.value = null
      paymentIntentId.value = null
    } catch (error) {
      paymentError.value = error as QuoteEngineError
      throw error
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Get current escrow status
   */
  async function getEscrowStatus() {
    if (!qe.state.quote) throw new Error('No quote available')

    isProcessing.value = true
    paymentError.value = null

    try {
      const status = await qe.client.getEscrowStatus(qe.state.quote.id)
      escrowInfo.value = status
      return status
    } catch (error) {
      paymentError.value = error as QuoteEngineError
      throw error
    } finally {
      isProcessing.value = false
    }
  }

  return {
    isProcessing,
    paymentError,
    clientSecret,
    paymentIntentId,
    escrowInfo,
    initPayment,
    confirmPayment,
    getEscrowStatus,
  }
}

/**
 * Use Quote Widget composable
 *
 * Focused composable for widget state management
 */
export function useQuoteWidget() {
  const qe = useQuoteEngine()

  return {
    isOpen: computed(() => qe.state.isOpen),
    isLoading: computed(() => qe.state.isLoading),
    currentStep: computed(() => qe.state.currentStep),
    error: computed(() => qe.state.error),
    customerData: computed(() => qe.state.customerData),
    open: qe.open,
    close: qe.close,
    reset: qe.reset,
    goToStep: qe.goToStep,
    setCustomerData: qe.setCustomerData,
  }
}

/**
 * Use Quote Engine Event
 *
 * Subscribe to Quote Engine events
 *
 * @example
 * ```vue
 * <script setup>
 * import { useQuoteEngineEvent } from '@thinkpinkstudio/quote-engine-sdk/vue'
 *
 * useQuoteEngineEvent('quoteGenerated', (quote) => {
 *   // console.log('Quote generated:', quote.id)
 * })
 * </script>
 * ```
 */
export function useQuoteEngineEvent<T>(
  event: string,
  handler: (data: T) => void
) {
  const qe = useQuoteEngine()

  onMounted(() => {
    const unsubscribe = qe.client.addEventListener(event as never, handler)
    onUnmounted(unsubscribe)
  })
}
