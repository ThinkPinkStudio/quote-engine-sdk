/**
 * ThinkPink Quote Engine SDK - React Provider
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

/**
 * Context value interface
 */
export interface QuoteEngineContextValue {
  /** The Quote Engine client instance */
  client: QuoteEngineClient

  /** Current widget state */
  state: WidgetState

  /** Start a new chat session */
  startChat: (customerData?: CustomerData) => Promise<ChatSession>

  /** Send a message */
  sendMessage: (content: string) => Promise<void>

  /** Generate a quote */
  generateQuote: (customerData?: CustomerData) => Promise<Quote>

  /** Go to a specific step */
  goToStep: (step: QuoteStep) => void

  /** Set customer data */
  setCustomerData: (data: Partial<CustomerData>) => void

  /** Open the widget */
  open: () => void

  /** Close the widget */
  close: () => void

  /** Reset the widget */
  reset: () => void

  /** Check if widget is ready */
  isReady: boolean
}

const QuoteEngineContext = createContext<QuoteEngineContextValue | null>(null)

/**
 * Provider props
 */
export interface QuoteEngineProviderProps {
  /** SDK configuration */
  config: QuoteEngineConfig

  /** Children to render */
  children: ReactNode

  /** Initial step */
  initialStep?: QuoteStep

  /** Pre-fill customer data */
  customerData?: CustomerData

  /** Called when widget state changes */
  onStateChange?: (state: WidgetState) => void
}

/**
 * Quote Engine Provider Component
 *
 * Wraps your application to provide Quote Engine functionality
 *
 * @example
 * ```tsx
 * import { QuoteEngineProvider } from '@thinkpinkstudio/quote-engine-sdk/react'
 *
 * function App() {
 *   return (
 *     <QuoteEngineProvider config={{ apiKey: 'your-api-key' }}>
 *       <YourApp />
 *     </QuoteEngineProvider>
 *   )
 * }
 * ```
 */
export function QuoteEngineProvider({
  config,
  children,
  initialStep = 'chat',
  customerData: initialCustomerData,
  onStateChange,
}: QuoteEngineProviderProps) {
  // Create client instance
  const clientRef = useRef<QuoteEngineClient | null>(null)

  if (!clientRef.current) {
    clientRef.current = createQuoteEngine(config)
  }

  const client = clientRef.current

  // Widget state
  const [state, setState] = useState<WidgetState>({
    currentStep: initialStep,
    isOpen: false,
    isLoading: false,
    chatSession: null,
    quote: null,
    error: null,
    customerData: initialCustomerData || {},
  })

  // Streaming message state
  const [streamingContent, setStreamingContent] = useState('')

  // Notify parent of state changes
  useEffect(() => {
    onStateChange?.(state)
  }, [state, onStateChange])

  // Update config when it changes
  useEffect(() => {
    client.setConfig(config)
  }, [config, client])

  // Set up event listeners
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

  // Context methods
  const value = useMemo<QuoteEngineContextValue>(() => {
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

    const open = () => {
      setState((s) => ({ ...s, isOpen: true }))
    }

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
        // Include streaming content in chat session if available
        chatSession: state.chatSession
          ? {
            ...state.chatSession,
            streamingContent,
          }
          : null,
      } as WidgetState & { chatSession: ChatSession & { streamingContent?: string } | null },
      startChat,
      sendMessage,
      generateQuote,
      goToStep,
      setCustomerData,
      open,
      close,
      reset,
      isReady: true,
    }
  }, [
    client,
    state,
    streamingContent,
    initialStep,
    initialCustomerData,
  ])

  return (
    <QuoteEngineContext.Provider value={value}>
      {children}
    </QuoteEngineContext.Provider>
  )
}

/**
 * Hook to access Quote Engine context
 *
 * @throws Error if used outside of QuoteEngineProvider
 *
 * @example
 * ```tsx
 * function ChatComponent() {
 *   const { sendMessage, state } = useQuoteEngineContext()
 *
 *   return (
 *     <div>
 *       {state.chatSession?.messages.map(msg => (
 *         <div key={msg.id}>{msg.content}</div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export function useQuoteEngineContext(): QuoteEngineContextValue {
  const context = useContext(QuoteEngineContext)

  if (!context) {
    throw new Error(
      'useQuoteEngineContext must be used within a QuoteEngineProvider'
    )
  }

  return context
}
