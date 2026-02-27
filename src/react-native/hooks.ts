/**
 * ThinkPink Quote Engine SDK - React Native Hooks
 *
 * Mobile-optimized hooks. Same API surface as the web React hooks
 * but with RN-specific additions (network status, share, etc.).
 */

import { useCallback, useEffect, useState } from 'react'
import { useQuoteEngineRNContext } from './QuoteEngineRNProvider'
import type {
  CustomerData,
  QuoteEngineError,
  ThemeConfig,
  TextLabels,
} from '../core'

/**
 * Hook for chat functionality (same API as web React hook)
 */
export function useQuoteChat() {
  const { client, state, sendMessage, startChat } = useQuoteEngineRNContext()

  const messages = state.chatSession?.messages || []
  const streamingContent = (state.chatSession as { streamingContent?: string })?.streamingContent || ''
  const isLoading = state.isLoading
  const error = state.error
  const shouldGenerateQuote = messages.some(
    (m) => m.metadata?.shouldGenerateQuote
  )

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
    sendMessage: send,
    startChat,
    cancelChat: cancel,
  }
}

/**
 * Hook for quote operations
 *
 * On React Native, `downloadPdf` returns the blob directly
 * instead of triggering a browser download. Use react-native-share
 * or react-native-blob-util to save/share the file.
 */
export function useQuote() {
  const { client, state, generateQuote } = useQuoteEngineRNContext()

  const quote = state.quote
  const isLoading = state.isLoading
  const error = state.error

  const downloadPdf = useCallback(async (): Promise<Blob | null> => {
    if (!quote) return null
    return client.downloadPdf(quote.id)
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
 */
export function usePayment() {
  const { client, state } = useQuoteEngineRNContext()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState<QuoteEngineError | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)

  const quote = state.quote

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

  return {
    isProcessing,
    paymentError,
    clientSecret,
    paymentIntentId,
    initPayment,
    confirmPayment,
  }
}

/**
 * Hook for widget state management
 */
export function useQuoteWidget() {
  const {
    state,
    open,
    close,
    reset,
    goToStep,
    setCustomerData,
  } = useQuoteEngineRNContext()

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
 */
export function useQuoteEngineEvent<T>(
  event: string,
  handler: (data: T) => void
) {
  const { client } = useQuoteEngineRNContext()

  useEffect(() => {
    return client.addEventListener(event as never, handler)
  }, [client, event, handler])
}

/**
 * Hook for customer data form
 */
export function useCustomerForm() {
  const { state, setCustomerData } = useQuoteEngineRNContext()
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerData, string>>>({})

  const updateField = useCallback(
    (field: keyof CustomerData, value: string) => {
      setCustomerData({ [field]: value })
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
 * React Native-specific: hook to track network connectivity.
 *
 * Requires `@react-native-community/netinfo` to be installed.
 * Falls back to online if the dependency is not available.
 *
 * @example
 * ```tsx
 * function ChatScreen() {
 *   const { isOnline } = useNetworkStatus()
 *   const { sendMessage } = useQuoteChat()
 *
 *   if (!isOnline) {
 *     return <Text>You are offline. Please check your connection.</Text>
 *   }
 *   // ...
 * }
 * ```
 */
export function useNetworkStatus() {
  const { isOnline } = useQuoteEngineRNContext()

  return { isOnline }
}

/**
 * Hook for accessing theme tokens and labels in React Native.
 *
 * Returns the resolved ThemeConfig and TextLabels from the SDK config
 * so you can apply consistent styling to your custom RN components.
 *
 * @example
 * ```tsx
 * function ChatBubble({ role, content }: { role: string; content: string }) {
 *   const { theme, labels } = useQuoteEngineTheme()
 *
 *   return (
 *     <View style={{
 *       backgroundColor: role === 'user' ? theme.primaryColor : theme.surfaceColor,
 *       borderRadius: theme.borderRadius ?? 12,
 *     }}>
 *       <Text style={{ color: role === 'user' ? theme.textColorInverse : theme.textColor }}>
 *         {content}
 *       </Text>
 *     </View>
 *   )
 * }
 * ```
 */
export function useQuoteEngineTheme() {
  const { client } = useQuoteEngineRNContext()

  const config = client.getConfig()
  const theme: ThemeConfig = config.theme || {}
  const labels: TextLabels = config.labels || {}

  return {
    /** Resolved theme configuration with all design tokens */
    theme,
    /** Resolved text labels for white-label UI */
    labels,
  }
}
