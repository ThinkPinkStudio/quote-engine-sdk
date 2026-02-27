/**
 * ThinkPink Quote Engine SDK - React Hooks
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuoteEngineContext } from './QuoteEngineProvider'
import type {
  CustomerData,
  QuoteEngineError,
  ThemeConfig,
  TextLabels,
  RAGInsight,
} from '../core'
import { generateThemeCss } from '../core'

/**
 * Hook for chat functionality
 *
 * @example
 * ```tsx
 * function Chat() {
 *   const { messages, sendMessage, isLoading, streamingContent } = useQuoteChat()
 *
 *   const handleSend = async (text: string) => {
 *     await sendMessage(text)
 *   }
 *
 *   return (
 *     <div>
 *       {messages.map(msg => <Message key={msg.id} {...msg} />)}
 *       {streamingContent && <div>{streamingContent}</div>}
 *     </div>
 *   )
 * }
 * ```
 */
export function useQuoteChat() {
  const { client, state, sendMessage, startChat } = useQuoteEngineContext()
  const [ragInsight, setRagInsight] = useState<RAGInsight | null>(null)

  const messages = state.chatSession?.messages || []
  const streamingContent = (state.chatSession as { streamingContent?: string })?.streamingContent || ''
  const isLoading = state.isLoading
  const error = state.error
  const shouldGenerateQuote = messages.some(
    (m) => m.metadata?.shouldGenerateQuote
  )

  useEffect(() => {
    return client.addEventListener('ragContextReceived', (insight: unknown) => {
      setRagInsight(insight as RAGInsight)
    })
  }, [client])

  const send = useCallback(
    async (content: string) => {
      if (!state.chatSession) {
        await startChat()
      }
      return sendMessage(content)
    },
    [state.chatSession, startChat, sendMessage]
  )

  const cancel = useCallback(() => {
    client.cancelChat()
  }, [client])

  return {
    messages,
    streamingContent,
    isLoading,
    error,
    shouldGenerateQuote,
    ragInsight,
    sendMessage: send,
    startChat,
    cancelChat: cancel,
  }
}

/**
 * Hook for quote operations
 *
 * @example
 * ```tsx
 * function QuotePreview() {
 *   const { quote, generateQuote, isLoading } = useQuote()
 *
 *   if (!quote) {
 *     return <button onClick={generateQuote}>Generate Quote</button>
 *   }
 *
 *   return <QuoteDetails quote={quote} />
 * }
 * ```
 */
export function useQuote() {
  const { client, state, generateQuote } = useQuoteEngineContext()

  const quote = state.quote
  const isLoading = state.isLoading
  const error = state.error

  const downloadPdf = useCallback(async () => {
    if (!quote) return
    const blob = await client.downloadPdf(quote.id)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${quote.quoteNumber}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }, [client, quote])

  const sendEmail = useCallback(
    async (email?: string) => {
      if (!quote) return
      await client.sendQuoteEmail(quote.id, email)
    },
    [client, quote]
  )

  const getQuote = useCallback(
    async (id: string) => {
      return client.getQuote(id)
    },
    [client]
  )

  return {
    quote,
    isLoading,
    error,
    generateQuote,
    downloadPdf,
    sendEmail,
    getQuote,
  }
}

/**
 * Hook for Stripe payment functionality
 *
 * Payments are processed via Stripe Connect with escrow functionality.
 * Platform fees (0%/4%/2% depending on plan) are automatically deducted.
 *
 * @example
 * ```tsx
 * import { loadStripe } from '@stripe/stripe-js'
 * import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
 *
 * const stripePromise = loadStripe('pk_live_...')
 *
 * function PaymentForm() {
 *   const stripe = useStripe()
 *   const elements = useElements()
 *   const { initPayment, confirmPayment, isProcessing, paymentError } = usePayment()
 *
 *   const handleSubmit = async (e: React.FormEvent) => {
 *     e.preventDefault()
 *     if (!stripe || !elements) return
 *
 *     const { error } = await stripe.confirmPayment({
 *       elements,
 *       confirmParams: { return_url: window.location.href },
 *     })
 *
 *     if (error) {
 *       console.error(error)
 *     }
 *   }
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <PaymentElement />
 *       <button disabled={isProcessing}>Pay Now</button>
 *       {paymentError && <p>{paymentError.message}</p>}
 *     </form>
 *   )
 * }
 *
 * function PaymentSection() {
 *   const { initPayment, clientSecret } = usePayment()
 *
 *   useEffect(() => {
 *     initPayment('deposit')
 *   }, [])
 *
 *   if (!clientSecret) return <div>Loading...</div>
 *
 *   return (
 *     <Elements stripe={stripePromise} options={{ clientSecret }}>
 *       <PaymentForm />
 *     </Elements>
 *   )
 * }
 * ```
 */
export function usePayment() {
  const { client, state } = useQuoteEngineContext()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState<QuoteEngineError | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const [escrowInfo, setEscrowInfo] = useState<{
    totalPaid: number
    platformFee: number
    totalHeld: number
    totalReleased: number
    remainingBalance: number
  } | null>(null)

  const quote = state.quote

  /**
   * Initialize a Stripe payment
   *
   * @param type - Payment type: 'deposit', 'milestone', or 'final'
   * @param milestoneId - Required if type is 'milestone'
   * @param returnUrl - URL to redirect after payment
   */
  const initPayment = useCallback(
    async (
      type: 'deposit' | 'milestone' | 'final' = 'deposit',
      milestoneId?: string,
      returnUrl?: string
    ) => {
      if (!quote) throw new Error('No quote available')

      setIsProcessing(true)
      setPaymentError(null)

      try {
        const result = await client.initPayment(quote.id, type, milestoneId, returnUrl)
        setClientSecret(result.clientSecret)
        setPaymentIntentId(result.paymentIntentId)
        return result
      } catch (error) {
        setPaymentError(error as QuoteEngineError)
        throw error
      } finally {
        setIsProcessing(false)
      }
    },
    [client, quote]
  )

  /**
   * Confirm payment was successful
   * Call this after Stripe confirms the payment
   */
  const confirmPayment = useCallback(async () => {
    if (!quote) throw new Error('No quote available')
    if (!paymentIntentId) throw new Error('No payment initialized')

    setIsProcessing(true)
    setPaymentError(null)

    try {
      await client.confirmPayment(quote.id, paymentIntentId)
      setClientSecret(null)
      setPaymentIntentId(null)
    } catch (error) {
      setPaymentError(error as QuoteEngineError)
      throw error
    } finally {
      setIsProcessing(false)
    }
  }, [client, quote, paymentIntentId])

  /**
   * Get current escrow status
   */
  const getEscrowStatus = useCallback(async () => {
    if (!quote) throw new Error('No quote available')

    setIsProcessing(true)
    setPaymentError(null)

    try {
      const status = await client.getEscrowStatus(quote.id)
      setEscrowInfo(status)
      return status
    } catch (error) {
      setPaymentError(error as QuoteEngineError)
      throw error
    } finally {
      setIsProcessing(false)
    }
  }, [client, quote])

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
 * Hook for widget state management
 *
 * @example
 * ```tsx
 * function WidgetButton() {
 *   const { isOpen, open, close, currentStep } = useQuoteWidget()
 *
 *   return (
 *     <>
 *       <button onClick={open}>Get a Quote</button>
 *       {isOpen && <QuoteWidget onClose={close} step={currentStep} />}
 *     </>
 *   )
 * }
 * ```
 */
export function useQuoteWidget() {
  const {
    state,
    open,
    close,
    reset,
    goToStep,
    setCustomerData,
  } = useQuoteEngineContext()

  return {
    isOpen: state.isOpen,
    isLoading: state.isLoading,
    currentStep: state.currentStep,
    error: state.error,
    customerData: state.customerData,
    open,
    close,
    reset,
    goToStep,
    setCustomerData,
  }
}

/**
 * Hook to listen to Quote Engine events
 *
 * @example
 * ```tsx
 * function Analytics() {
 *   useQuoteEngineEvent('quoteGenerated', (quote) => {
 *     analytics.track('quote_generated', { quoteId: quote.id })
 *   })
 *
 *   useQuoteEngineEvent('paymentComplete', (payment) => {
 *     analytics.track('payment_complete', { amount: payment.amount })
 *   })
 *
 *   return null
 * }
 * ```
 */
export function useQuoteEngineEvent<T>(
  event: string,
  handler: (data: T) => void
) {
  const { client } = useQuoteEngineContext()

  useEffect(() => {
    return client.addEventListener(event as never, handler)
  }, [client, event, handler])
}

/**
 * Hook for customer data form
 *
 * @example
 * ```tsx
 * function CustomerForm() {
 *   const { customerData, updateField, errors, validate } = useCustomerForm()
 *
 *   return (
 *     <form onSubmit={validate}>
 *       <input
 *         value={customerData.name}
 *         onChange={e => updateField('name', e.target.value)}
 *       />
 *       {errors.name && <span>{errors.name}</span>}
 *     </form>
 *   )
 * }
 * ```
 */
export function useCustomerForm() {
  const { state, setCustomerData } = useQuoteEngineContext()
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerData, string>>>({})

  const updateField = useCallback(
    (field: keyof CustomerData, value: string) => {
      setCustomerData({ [field]: value })
      // Clear error when field is updated
      setErrors((prev: Partial<Record<keyof CustomerData, string>>) => ({ ...prev, [field]: undefined }))
    },
    [setCustomerData]
  )

  const validate = useCallback(() => {
    const newErrors: Partial<Record<keyof CustomerData, string>> = {}
    const data = state.customerData

    if (!data.name?.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!data.email?.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Invalid email format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [state.customerData])

  return {
    customerData: state.customerData,
    updateField,
    errors,
    validate,
    isValid: Object.keys(errors).length === 0,
  }
}

/**
 * Hook for accessing theme tokens and labels.
 *
 * Returns the resolved ThemeConfig, TextLabels, and a CSS string
 * containing all design tokens as CSS custom properties.
 * Use this when building a custom UI that should respect the SDK theme.
 *
 * @example
 * ```tsx
 * function ChatBubble({ role, content }: { role: string; content: string }) {
 *   const { theme, labels, cssVars } = useQuoteEngineTheme()
 *
 *   return (
 *     <div style={{
 *       background: role === 'user' ? theme.primaryColor : theme.surfaceColor,
 *       borderRadius: theme.borderRadius ?? 12,
 *     }}>
 *       {content}
 *     </div>
 *   )
 * }
 * ```
 */
export function useQuoteEngineTheme() {
  const { client } = useQuoteEngineContext()

  const config = client.getConfig()
  const theme: ThemeConfig = config.theme || {}
  const labels: TextLabels = config.labels || {}

  const cssVars = useMemo(() => {
    return generateThemeCss(theme)
  }, [theme])

  return {
    /** Resolved theme configuration with all design tokens */
    theme,
    /** Resolved text labels for white-label UI */
    labels,
    /** CSS string with all tokens as CSS custom properties */
    cssVars,
  }
}
