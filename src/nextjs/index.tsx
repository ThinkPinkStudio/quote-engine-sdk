/**
 * ThinkPink Quote Engine SDK - Next.js Integration
 *
 * Next.js-specific components and utilities for the Quote Engine
 *
 * @packageDocumentation
 */

'use client'

import { useEffect, useState } from 'react'
import type { QuoteEngineConfig } from '../core'

// Re-export React provider and hooks
export {
  QuoteEngineProvider,
  useQuoteEngineContext,
  useQuoteChat,
  useQuote,
  usePayment,
  useQuoteWidget,
  useQuoteEngineEvent,
  useCustomerForm,
} from '../react'

// Re-export core
export * from '../core'

/**
 * Client-side only wrapper for Quote Engine components
 *
 * Use this to wrap Quote Engine components that need to be rendered
 * only on the client side in Next.js applications.
 *
 * @example
 * ```tsx
 * import { ClientOnly, QuoteEngineProvider } from '@thinkpinkstudio/quote-engine-sdk/nextjs'
 *
 * export default function Page() {
 *   return (
 *     <ClientOnly>
 *       <QuoteEngineProvider config={{ apiKey: 'your-api-key' }}>
 *         <YourQuoteWidget />
 *       </QuoteEngineProvider>
 *     </ClientOnly>
 *   )
 * }
 * ```
 */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return fallback
  }

  return <>{children}</>
}

/**
 * Hook to get Quote Engine config from environment variables
 *
 * This hook reads the API key from NEXT_PUBLIC_QUOTE_ENGINE_API_KEY
 * environment variable.
 *
 * @example
 * ```tsx
 * function App() {
 *   const config = useQuoteEngineConfig()
 *
 *   return (
 *     <QuoteEngineProvider config={config}>
 *       <YourApp />
 *     </QuoteEngineProvider>
 *   )
 * }
 * ```
 */
export function useQuoteEngineConfig(
  overrides?: Partial<QuoteEngineConfig>
): QuoteEngineConfig {
  const apiKey = process.env.NEXT_PUBLIC_QUOTE_ENGINE_API_KEY

  if (!apiKey && !overrides?.apiKey) {
    console.warn(
      '[QuoteEngine] Missing API key. Set NEXT_PUBLIC_QUOTE_ENGINE_API_KEY or provide apiKey in config.'
    )
  }

  return {
    apiKey: apiKey || '',
    baseUrl: process.env.NEXT_PUBLIC_QUOTE_ENGINE_BASE_URL,
    ...overrides,
  }
}

/**
 * Server action to validate API key
 *
 * Use this in server components to validate the API key
 * before rendering the Quote Engine.
 */
export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.QUOTE_ENGINE_BASE_URL || 'https://api.thinkpinkstudio.it'}/api/validate-key`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
      }
    )
    return response.ok
  } catch {
    return false
  }
}

/**
 * Server action to get quote by ID
 *
 * Fetches a quote from the server, useful for SSR pages.
 */
export async function getQuoteServer(quoteId: string) {
  const apiKey = process.env.QUOTE_ENGINE_API_KEY

  if (!apiKey) {
    throw new Error('QUOTE_ENGINE_API_KEY not set')
  }

  const response = await fetch(
    `${process.env.QUOTE_ENGINE_BASE_URL || 'https://api.thinkpinkstudio.it'}/api/quotes/${quoteId}`,
    {
      headers: {
        'X-API-Key': apiKey,
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    } as any
  )

  if (!response.ok) {
    throw new Error('Failed to fetch quote')
  }

  const data = await response.json()
  return data.quote
}
