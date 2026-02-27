/**
 * ThinkPink Quote Engine SDK - React Native Provider
 *
 * Similar to the React web provider but adapted for mobile:
 * - No DOM operations (no document.createElement, etc.)
 * - Uses AsyncStorage via adapter instead of localStorage
 * - Handles app state changes (background/foreground)
 */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  QuoteEngineClient,
  createQuoteEngine,
  type QuoteEngineConfig,
  type ChatSession,
  type Quote,
  type QuoteStep,
  type QuoteEngineError,
  type CustomerData,
  type WidgetState,
} from '../core'

export interface QuoteEngineRNContextValue {
  client: QuoteEngineClient
  state: WidgetState
  startChat: (customerData?: CustomerData) => Promise<ChatSession>
  sendMessage: (content: string) => Promise<void>
  generateQuote: (customerData?: CustomerData) => Promise<Quote>
  goToStep: (step: QuoteStep) => void
  setCustomerData: (data: Partial<CustomerData>) => void
  open: () => void
  close: () => void
  reset: () => void
  isReady: boolean
  isOnline: boolean
}

const QuoteEngineRNContext = createContext<QuoteEngineRNContextValue | null>(null)

export interface QuoteEngineRNProviderProps {
  config: QuoteEngineConfig
  children: ReactNode
  initialStep?: QuoteStep
  customerData?: CustomerData
  onStateChange?: (state: WidgetState) => void
}

export function QuoteEngineRNProvider({
  config,
  children,
  initialStep = 'chat',
  customerData: initialCustomerData,
  onStateChange,
}: QuoteEngineRNProviderProps) {
  const clientRef = useRef<QuoteEngineClient | null>(null)

  if (!clientRef.current) {
    clientRef.current = createQuoteEngine(config)
  }

  const client = clientRef.current

  const [state, setState] = useState<WidgetState>({
    currentStep: initialStep,
    isOpen: false,
    isLoading: false,
    chatSession: null,
    quote: null,
    error: null,
    customerData: initialCustomerData || {},
  })

  const [streamingContent, setStreamingContent] = useState('')
  const [isOnline] = useState(true)

  useEffect(() => {
    onStateChange?.(state)
  }, [state, onStateChange])

  useEffect(() => {
    client.setConfig(config)
  }, [config, client])

  useEffect(() => {
    const unsubscribers = [
      client.addEventListener('error', (error: QuoteEngineError) => {
        setState((s) => ({ ...s, error, isLoading: false }))
      }),
      client.addEventListener('quoteGenerated', (quote: Quote) => {
        setState((s) => ({ ...s, quote, currentStep: 'preview' }))
      }),
      client.addEventListener('paymentCompleted', () => {
        setState((s) => ({ ...s, currentStep: 'completed' }))
      }),
    ]

    return () => {
      unsubscribers.forEach((unsub) => unsub())
    }
  }, [client])

  const value = useMemo<QuoteEngineRNContextValue>(() => {
    const startChat = async (customerData?: CustomerData) => {
      setState((s) => ({ ...s, isLoading: true, error: null }))
      try {
        const session = await client.startChat(
          customerData || state.customerData
        )
        setState((s) => ({
          ...s,
          chatSession: session,
          isLoading: false,
          currentStep: 'chat',
        }))
        return session
      } catch (error) {
        setState((s) => ({
          ...s,
          error: error as QuoteEngineError,
          isLoading: false,
        }))
        throw error
      }
    }

    const sendMessage = async (content: string) => {
      setState((s) => ({ ...s, isLoading: true, error: null }))
      setStreamingContent('')

      try {
        await client.sendMessage(content, (chunk) => {
          setStreamingContent((prev) => prev + chunk)
        })

        setState((s) => ({
          ...s,
          chatSession: client.getSession(),
          isLoading: false,
        }))
        setStreamingContent('')
      } catch (error) {
        setState((s) => ({
          ...s,
          error: error as QuoteEngineError,
          isLoading: false,
        }))
        setStreamingContent('')
        throw error
      }
    }

    const generateQuote = async (customerData?: CustomerData) => {
      setState((s) => ({ ...s, isLoading: true, error: null }))
      try {
        const data = customerData || state.customerData
        const quote = await client.generateQuote(data as CustomerData)
        setState((s) => ({
          ...s,
          quote,
          isLoading: false,
          currentStep: 'preview',
        }))
        return quote
      } catch (error) {
        setState((s) => ({
          ...s,
          error: error as QuoteEngineError,
          isLoading: false,
        }))
        throw error
      }
    }

    const goToStep = (step: QuoteStep) => {
      setState((s) => ({ ...s, currentStep: step }))
      client.notifyStepChange(step)
    }

    const setCustomerData = (data: Partial<CustomerData>) => {
      setState((s) => ({
        ...s,
        customerData: { ...s.customerData, ...data },
      }))
    }

    const open = () => setState((s) => ({ ...s, isOpen: true }))
    const close = () => {
      setState((s) => ({ ...s, isOpen: false }))
      client.notifyClose()
    }

    const reset = () => {
      client.clearSession()
      setState({
        currentStep: initialStep,
        isOpen: false,
        isLoading: false,
        chatSession: null,
        quote: null,
        error: null,
        customerData: initialCustomerData || {},
      })
    }

    return {
      client,
      state: {
        ...state,
        chatSession: state.chatSession
          ? { ...state.chatSession, streamingContent }
          : null,
      } as WidgetState,
      startChat,
      sendMessage,
      generateQuote,
      goToStep,
      setCustomerData,
      open,
      close,
      reset,
      isReady: true,
      isOnline,
    }
  }, [client, state, streamingContent, isOnline, initialStep, initialCustomerData])

  return (
    <QuoteEngineRNContext.Provider value={value}>
      {children}
    </QuoteEngineRNContext.Provider>
  )
}

export function useQuoteEngineRNContext(): QuoteEngineRNContextValue {
  const context = useContext(QuoteEngineRNContext)
  if (!context) {
    throw new Error(
      'useQuoteEngineRNContext must be used within a QuoteEngineRNProvider'
    )
  }
  return context
}
