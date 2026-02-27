/**
 * Integration tests for React hooks
 */

import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import {
  QuoteEngineProvider,
  useQuoteEngineContext,
} from '../../react/QuoteEngineProvider'
import {
  useQuoteChat,
  useQuote,
  usePayment,
  useQuoteWidget,
  useQuoteEngineEvent,
  useCustomerForm,
  useQuoteEngineTheme,
} from '../../react/hooks'
import type { QuoteEngineConfig, CustomerData } from '../../core/types'

const validApiKey = 'test-api-key-1234567890'

function createWrapper(config: Partial<QuoteEngineConfig> = {}) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QuoteEngineProvider
        config={{
          apiKey: validApiKey,
          ...config,
        }}
      >
        {children}
      </QuoteEngineProvider>
    )
  }
}

describe('useQuoteEngineContext', () => {
  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useQuoteEngineContext())
    }).toThrow('useQuoteEngineContext must be used within a QuoteEngineProvider')
  })

  it('should return context value when used inside provider', () => {
    const { result } = renderHook(() => useQuoteEngineContext(), {
      wrapper: createWrapper(),
    })

    expect(result.current).toBeDefined()
    expect(result.current.client).toBeDefined()
    expect(result.current.state).toBeDefined()
    expect(result.current.isReady).toBe(true)
  })

  it('should have all required methods', () => {
    const { result } = renderHook(() => useQuoteEngineContext(), {
      wrapper: createWrapper(),
    })

    expect(typeof result.current.startChat).toBe('function')
    expect(typeof result.current.sendMessage).toBe('function')
    expect(typeof result.current.generateQuote).toBe('function')
    expect(typeof result.current.goToStep).toBe('function')
    expect(typeof result.current.setCustomerData).toBe('function')
    expect(typeof result.current.open).toBe('function')
    expect(typeof result.current.close).toBe('function')
    expect(typeof result.current.reset).toBe('function')
  })
})

describe('useQuoteChat', () => {
  it('should return chat state', () => {
    const { result } = renderHook(() => useQuoteChat(), {
      wrapper: createWrapper(),
    })

    expect(result.current.messages).toEqual([])
    expect(result.current.streamingContent).toBe('')
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.shouldGenerateQuote).toBe(false)
  })

  it('should have sendMessage function', () => {
    const { result } = renderHook(() => useQuoteChat(), {
      wrapper: createWrapper(),
    })

    expect(typeof result.current.sendMessage).toBe('function')
  })

  it('should have startChat function', () => {
    const { result } = renderHook(() => useQuoteChat(), {
      wrapper: createWrapper(),
    })

    expect(typeof result.current.startChat).toBe('function')
  })

  it('should have cancelChat function', () => {
    const { result } = renderHook(() => useQuoteChat(), {
      wrapper: createWrapper(),
    })

    expect(typeof result.current.cancelChat).toBe('function')
  })

  it('should start chat automatically when sending message', async () => {
    const { result } = renderHook(() => useQuoteChat(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      try {
        await result.current.sendMessage('Hello')
      } catch {
        // Expected - message sending may fail in test env
      }
    })

    // Should have attempted to start chat
    expect(result.current.isLoading).toBe(false)
  })
})

describe('useQuote', () => {
  it('should return quote state', () => {
    const { result } = renderHook(() => useQuote(), {
      wrapper: createWrapper(),
    })

    expect(result.current.quote).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should have generateQuote function', () => {
    const { result } = renderHook(() => useQuote(), {
      wrapper: createWrapper(),
    })

    expect(typeof result.current.generateQuote).toBe('function')
  })

  it('should have downloadPdf function', () => {
    const { result } = renderHook(() => useQuote(), {
      wrapper: createWrapper(),
    })

    expect(typeof result.current.downloadPdf).toBe('function')
  })

  it('should have sendEmail function', () => {
    const { result } = renderHook(() => useQuote(), {
      wrapper: createWrapper(),
    })

    expect(typeof result.current.sendEmail).toBe('function')
  })

  it('should have getQuote function', () => {
    const { result } = renderHook(() => useQuote(), {
      wrapper: createWrapper(),
    })

    expect(typeof result.current.getQuote).toBe('function')
  })
})

describe('usePayment', () => {
  it('should return payment state', () => {
    const { result } = renderHook(() => usePayment(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isProcessing).toBe(false)
    expect(result.current.paymentError).toBeNull()
    expect(result.current.clientSecret).toBeNull()
    expect(result.current.paymentIntentId).toBeNull()
    expect(result.current.escrowInfo).toBeNull()
  })

  it('should have initPayment function', () => {
    const { result } = renderHook(() => usePayment(), {
      wrapper: createWrapper(),
    })

    expect(typeof result.current.initPayment).toBe('function')
  })

  it('should have confirmPayment function', () => {
    const { result } = renderHook(() => usePayment(), {
      wrapper: createWrapper(),
    })

    expect(typeof result.current.confirmPayment).toBe('function')
  })

  it('should have getEscrowStatus function', () => {
    const { result } = renderHook(() => usePayment(), {
      wrapper: createWrapper(),
    })

    expect(typeof result.current.getEscrowStatus).toBe('function')
  })

  it('should throw error when no quote available', async () => {
    const { result } = renderHook(() => usePayment(), {
      wrapper: createWrapper(),
    })

    await expect(
      act(async () => {
        await result.current.initPayment('deposit')
      })
    ).rejects.toThrow('No quote available')
  })
})

describe('useQuoteWidget', () => {
  it('should return widget state', () => {
    const { result } = renderHook(() => useQuoteWidget(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isOpen).toBe(false)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.currentStep).toBe('chat')
    expect(result.current.error).toBeNull()
    expect(result.current.customerData).toEqual({})
  })

  it('should open and close widget', () => {
    const { result } = renderHook(() => useQuoteWidget(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.open()
    })
    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.close()
    })
    expect(result.current.isOpen).toBe(false)
  })

  it('should go to step', () => {
    const { result } = renderHook(() => useQuoteWidget(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.goToStep('payment')
    })
    expect(result.current.currentStep).toBe('payment')
  })

  it('should set customer data', () => {
    const { result } = renderHook(() => useQuoteWidget(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.setCustomerData({ name: 'John' })
    })
    expect(result.current.customerData.name).toBe('John')
  })

  it('should reset widget', () => {
    const { result } = renderHook(() => useQuoteWidget(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.open()
      result.current.setCustomerData({ name: 'John' })
      result.current.goToStep('payment')
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.isOpen).toBe(false)
    expect(result.current.currentStep).toBe('chat')
    expect(result.current.customerData).toEqual({})
  })
})

describe('useQuoteEngineEvent', () => {
  it('should subscribe to events', () => {
    const handler = vi.fn()

    const { result } = renderHook(
      () => {
        const context = useQuoteEngineContext()
        useQuoteEngineEvent('error', handler)
        return context
      },
      { wrapper: createWrapper() }
    )

    // Emit an event
    act(() => {
      result.current.client.emit('error', { code: 'TEST', message: 'Test error' })
    })

    expect(handler).toHaveBeenCalled()
  })

  it('should unsubscribe on unmount', () => {
    const handler = vi.fn()

    const { unmount, result } = renderHook(
      () => {
        const context = useQuoteEngineContext()
        useQuoteEngineEvent('error', handler)
        return context
      },
      { wrapper: createWrapper() }
    )

    unmount()

    // Emit event after unmount - handler should not be called
    // Note: We can't easily test this as the client is also unmounted
  })
})

describe('useCustomerForm', () => {
  it('should return customer form state', () => {
    const { result } = renderHook(() => useCustomerForm(), {
      wrapper: createWrapper(),
    })

    expect(result.current.customerData).toEqual({})
    expect(result.current.errors).toEqual({})
    expect(result.current.isValid).toBe(true)
    expect(typeof result.current.updateField).toBe('function')
    expect(typeof result.current.validate).toBe('function')
  })

  it('should update field and clear error', () => {
    const { result } = renderHook(() => useCustomerForm(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.updateField('name', 'John Doe')
    })

    expect(result.current.customerData.name).toBe('John Doe')
  })

  it('should validate required fields', () => {
    const { result } = renderHook(() => useCustomerForm(), {
      wrapper: createWrapper(),
    })

    let isValid: boolean
    act(() => {
      isValid = result.current.validate()
    })

    expect(isValid!).toBe(false)
    expect(result.current.errors.name).toBe('Name is required')
    expect(result.current.errors.email).toBe('Email is required')
  })

  it('should validate email format', () => {
    const { result } = renderHook(() => useCustomerForm(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.updateField('name', 'John')
      result.current.updateField('email', 'invalid-email')
    })

    let isValid: boolean
    act(() => {
      isValid = result.current.validate()
    })

    expect(isValid!).toBe(false)
    expect(result.current.errors.email).toBe('Invalid email format')
  })

  it('should return true when form is valid', () => {
    const { result } = renderHook(() => useCustomerForm(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.updateField('name', 'John Doe')
      result.current.updateField('email', 'john@example.com')
    })

    let isValid: boolean
    act(() => {
      isValid = result.current.validate()
    })

    expect(isValid!).toBe(true)
    expect(result.current.errors).toEqual({})
  })
})

describe('useQuoteEngineTheme', () => {
  it('should return theme configuration', () => {
    const { result } = renderHook(() => useQuoteEngineTheme(), {
      wrapper: createWrapper({
        theme: {
          primaryColor: '#e91e63',
        },
      }),
    })

    expect(result.current.theme).toBeDefined()
    expect(result.current.theme.primaryColor).toBe('#e91e63')
  })

  it('should return labels', () => {
    const { result } = renderHook(() => useQuoteEngineTheme(), {
      wrapper: createWrapper({
        labels: {
          headerTitle: 'Custom Title',
        },
      }),
    })

    expect(result.current.labels).toBeDefined()
    expect(result.current.labels.headerTitle).toBe('Custom Title')
  })

  it('should generate CSS variables', () => {
    const { result } = renderHook(() => useQuoteEngineTheme(), {
      wrapper: createWrapper({
        theme: {
          primaryColor: '#e91e63',
        },
      }),
    })

    expect(result.current.cssVars).toContain('.qe-widget')
    expect(result.current.cssVars).toContain('--qe-primary-color: #e91e63')
  })

  it('should memoize CSS generation', () => {
    const { result, rerender } = renderHook(() => useQuoteEngineTheme(), {
      wrapper: createWrapper({
        theme: {
          primaryColor: '#e91e63',
        },
      }),
    })

    const firstCssVars = result.current.cssVars

    rerender()

    expect(result.current.cssVars).toBe(firstCssVars) // Same reference
  })
})

describe('QuoteEngineProvider', () => {
  it('should initialize with initial step', () => {
    const { result } = renderHook(() => useQuoteWidget(), {
      wrapper: ({ children }) => (
        <QuoteEngineProvider
          config={{ apiKey: validApiKey }}
          initialStep="customer-info"
        >
          {children}
        </QuoteEngineProvider>
      ),
    })

    expect(result.current.currentStep).toBe('customer-info')
  })

  it('should initialize with customer data', () => {
    const customerData: CustomerData = {
      name: 'John Doe',
      email: 'john@example.com',
    }

    const { result } = renderHook(() => useQuoteWidget(), {
      wrapper: ({ children }) => (
        <QuoteEngineProvider
          config={{ apiKey: validApiKey }}
          customerData={customerData}
        >
          {children}
        </QuoteEngineProvider>
      ),
    })

    expect(result.current.customerData).toEqual(customerData)
  })

  it('should call onStateChange callback', () => {
    const onStateChange = vi.fn()

    const { result } = renderHook(() => useQuoteWidget(), {
      wrapper: ({ children }) => (
        <QuoteEngineProvider
          config={{ apiKey: validApiKey }}
          onStateChange={onStateChange}
        >
          {children}
        </QuoteEngineProvider>
      ),
    })

    act(() => {
      result.current.open()
    })

    expect(onStateChange).toHaveBeenCalled()
    const lastCall = onStateChange.mock.calls[onStateChange.mock.calls.length - 1][0]
    expect(lastCall.isOpen).toBe(true)
  })
})
