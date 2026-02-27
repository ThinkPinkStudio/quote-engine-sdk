/**
 * Unit tests for QuoteEngineClient
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QuoteEngineClient, createQuoteEngine } from '../../core/client'
import type { QuoteEngineConfig, QuoteEngineError } from '../../core/types'
import { mockQuote, mockPaymentInit, mockTenantConfig } from '../mocks/handlers'

const validApiKey = 'test-api-key-1234567890'

function createClient(config: Partial<QuoteEngineConfig> = {}): QuoteEngineClient {
  return new QuoteEngineClient({
    apiKey: validApiKey,
    ...config,
  })
}

describe('QuoteEngineClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  // ===========================================================================
  // Constructor & Configuration
  // ===========================================================================

  describe('constructor', () => {
    it('should create client with valid config', () => {
      const client = createClient()
      expect(client).toBeInstanceOf(QuoteEngineClient)
    })

    it('should throw error when API key is missing', () => {
      expect(() => new QuoteEngineClient({ apiKey: '' })).toThrow()
    })

    it('should throw error when API key is too short', () => {
      expect(() => new QuoteEngineClient({ apiKey: 'short' })).toThrow()
    })

    it('should set default language to en', () => {
      const client = createClient()
      const config = client.getConfig()
      expect(config.language).toBe('en')
    })

    it('should use provided language', () => {
      const client = createClient({ language: 'it' })
      const config = client.getConfig()
      expect(config.language).toBe('it')
    })

    it('should emit ready event on initialization', () => {
      const onReady = vi.fn()
      createClient({ callbacks: { onReady } })
      expect(onReady).toHaveBeenCalled()
    })

    it('should set debug mode', () => {
      const client = createClient({ debug: true })
      const config = client.getConfig()
      expect(config.debug).toBe(true)
    })

    it('should set custom timeout', () => {
      const client = createClient({ timeout: 60000 })
      const config = client.getConfig()
      expect(config.timeout).toBe(60000)
    })
  })

  describe('setConfig', () => {
    it('should update config', () => {
      const client = createClient()
      client.setConfig({ language: 'de' })
      expect(client.getConfig().language).toBe('de')
    })

    it('should not allow changing baseUrl', () => {
      const client = createClient()
      // @ts-expect-error - Testing runtime behavior
      client.setConfig({ baseUrl: 'https://evil.com' })
      expect(client.getConfig().baseUrl).toBe('https://www.thinkpinkstudio.it')
    })

    it('should register new callbacks', () => {
      const client = createClient()
      const onError = vi.fn()
      client.setConfig({ callbacks: { onError } })

      // Trigger an error
      client.emit('error', { code: 'TEST', message: 'Test' } as QuoteEngineError)
      expect(onError).toHaveBeenCalled()
    })
  })

  describe('setLanguage', () => {
    it('should change language', () => {
      const client = createClient()
      client.setLanguage('fr')
      expect(client.getConfig().language).toBe('fr')
    })
  })

  // ===========================================================================
  // API Key Validation
  // ===========================================================================

  describe('validateKey', () => {
    it('should validate API key and return tenant config', async () => {
      const client = createClient()
      const result = await client.validateKey()

      expect(result).toEqual(mockTenantConfig)
      expect(result.tenant.slug).toBe('test-tenant')
      expect(result.tenant.plan).toBe('pro')
    })

    it('should throw error for invalid API key', async () => {
      const client = new QuoteEngineClient({ apiKey: 'a'.repeat(20) }) // Valid length but invalid key

      const originalFetch = global.fetch
      try {
        global.fetch = vi.fn().mockImplementation(() => Promise.resolve(new Response(
          JSON.stringify({ error: { message: 'Invalid API key' } }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        )))

        await expect(client.validateKey()).rejects.toMatchObject({
          code: 'INVALID_API_KEY',
        })
      } finally {
        global.fetch = originalFetch
      }
    })

    it('should throw error for expired API key', async () => {
      const client = new QuoteEngineClient({ apiKey: 'expired-api-key-12345678' })

      await expect(client.validateKey()).rejects.toMatchObject({
        code: 'API_KEY_EXPIRED',
      })
    })
  })

  // ===========================================================================
  // Chat Operations
  // ===========================================================================

  describe('startChat', () => {
    it('should start a new chat session', async () => {
      const client = createClient()
      const session = await client.startChat()

      expect(session).toBeDefined()
      expect(session.id).toBeDefined()
      expect(session.messages).toEqual([])
      expect(session.status).toBe('active')
    })

    it('should start chat with customer data', async () => {
      const client = createClient()
      const customerData = {
        name: 'John Doe',
        email: 'john@example.com',
      }
      const session = await client.startChat(customerData)

      expect(session.customerData).toEqual(customerData)
    })

    it('should emit chatStart event', async () => {
      const onChatStart = vi.fn()
      const client = createClient({ callbacks: { onChatStart } })
      await client.startChat()

      expect(onChatStart).toHaveBeenCalled()
    })
  })

  describe('sendMessage', () => {
    it('should send message and receive streaming response', async () => {
      const client = createClient({ debug: true })
      await client.startChat()

      const chunks: string[] = []
      const message = await client.sendMessage('Hello', (chunk) => {
        chunks.push(chunk)
      })

      expect(message.role).toBe('assistant')
      expect(message.content).toBe('Thank you for your message!')
      expect(chunks.length).toBeGreaterThan(0)
    })

    it('should throw error when no session exists', async () => {
      const client = createClient()

      await expect(client.sendMessage('Hello')).rejects.toMatchObject({
        code: 'SESSION_EXPIRED',
      })
    })

    it('should emit messageSent and messageReceived events', async () => {
      const onMessageSent = vi.fn()
      const onMessageReceived = vi.fn()
      const client = createClient({
        callbacks: { onMessageSent, onMessageReceived },
      })

      await client.startChat()
      await client.sendMessage('Hello')

      expect(onMessageSent).toHaveBeenCalled()
      expect(onMessageReceived).toHaveBeenCalled()
    })

    it('should add messages to session', async () => {
      const client = createClient()
      await client.startChat()
      await client.sendMessage('Hello')

      const session = client.getSession()
      expect(session?.messages.length).toBe(2) // user + assistant
      expect(session?.messages[0].role).toBe('user')
      expect(session?.messages[1].role).toBe('assistant')
    })
  })

  describe('cancelChat', () => {
    it('should cancel ongoing request', async () => {
      const client = createClient()
      await client.startChat()

      // Start a request but don't await it
      const promise = client.sendMessage('Hello')

      // Cancel immediately
      client.cancelChat()

      // Should reject with abort error
      await expect(promise).rejects.toBeDefined()
    })
  })

  describe('getSession', () => {
    it('should return null when no session exists', () => {
      const client = createClient()
      expect(client.getSession()).toBeNull()
    })

    it('should return current session', async () => {
      const client = createClient()
      await client.startChat()

      const session = client.getSession()
      expect(session).toBeDefined()
      expect(session?.status).toBe('active')
    })
  })

  describe('clearSession', () => {
    it('should clear session and quote', async () => {
      const client = createClient()
      await client.startChat()

      client.clearSession()

      expect(client.getSession()).toBeNull()
      expect(client.getCurrentQuote()).toBeNull()
    })
  })

  // ===========================================================================
  // Quote Operations
  // ===========================================================================

  describe('generateQuote', () => {
    it('should generate quote from conversation', async () => {
      const client = createClient()
      await client.startChat({
        name: 'John Doe',
        email: 'john@example.com',
      })
      await client.sendMessage('I need a website')

      const quote = await client.generateQuote()

      expect(quote).toBeDefined()
      expect(quote.id).toBe('quote-123')
      expect(quote.quoteNumber).toBe('QE-2025-001')
    })

    it('should throw error when no session exists', async () => {
      const client = createClient()

      await expect(client.generateQuote()).rejects.toMatchObject({
        code: 'SESSION_EXPIRED',
      })
    })

    it('should throw error when customer data is missing', async () => {
      const client = createClient()
      await client.startChat()

      await expect(client.generateQuote()).rejects.toMatchObject({
        code: 'VALIDATION_ERROR',
      })
    })

    it('should emit quoteGenerated event', async () => {
      const onQuoteGenerated = vi.fn()
      const client = createClient({ callbacks: { onQuoteGenerated } })

      await client.startChat({ name: 'John', email: 'john@example.com' })
      await client.sendMessage('Hello')
      await client.generateQuote()

      expect(onQuoteGenerated).toHaveBeenCalledWith('quote-123')
    })

    it('should set session status to completed', async () => {
      const client = createClient()
      await client.startChat({ name: 'John', email: 'john@example.com' })
      await client.sendMessage('Hello')
      await client.generateQuote()

      expect(client.getSession()?.status).toBe('completed')
    })
  })

  describe('getQuote', () => {
    it('should fetch quote by ID', async () => {
      const client = createClient()
      const quote = await client.getQuote('quote-123')

      expect(quote.id).toBe('quote-123')
    })

    it('should throw error for non-existent quote', async () => {
      const client = createClient()

      await expect(client.getQuote('not-found')).rejects.toMatchObject({
        code: 'UNKNOWN_ERROR',
      })
    })
  })

  describe('getCurrentQuote', () => {
    it('should return null when no quote exists', () => {
      const client = createClient()
      expect(client.getCurrentQuote()).toBeNull()
    })

    it('should return current quote after generation', async () => {
      const client = createClient()
      await client.startChat({ name: 'John', email: 'john@example.com' })
      await client.sendMessage('Hello')
      await client.generateQuote()

      expect(client.getCurrentQuote()?.id).toBe('quote-123')
    })
  })

  describe('sendQuoteEmail', () => {
    it('should send quote via email', async () => {
      const client = createClient()
      await expect(
        client.sendQuoteEmail('quote-123', 'john@example.com')
      ).resolves.toBeUndefined()
    })
  })

  describe('downloadPdf', () => {
    it('should download quote PDF', async () => {
      const client = createClient()
      const blob = await client.downloadPdf('quote-123')

      expect(blob).toBeInstanceOf(Blob)
    })
  })

  // ===========================================================================
  // Payment Operations
  // ===========================================================================

  describe('initPayment', () => {
    it('should initialize payment and return client secret', async () => {
      const client = createClient()
      await client.startChat({ name: 'John', email: 'john@example.com' })
      await client.sendMessage('Hello')
      await client.generateQuote()

      const result = await client.initPayment('quote-123', 'deposit')

      expect(result.clientSecret).toBe('pi_test_123_secret_abc')
      expect(result.paymentIntentId).toBe('pi_test_123')
      expect(result.amount).toBe(4392)
      expect(result.isEscrow).toBe(true)
    })

    it('should emit paymentStart event', async () => {
      const onPaymentStart = vi.fn()
      const client = createClient({ callbacks: { onPaymentStart } })

      await client.startChat({ name: 'John', email: 'john@example.com' })
      await client.sendMessage('Hello')
      await client.generateQuote()
      await client.initPayment('quote-123')

      expect(onPaymentStart).toHaveBeenCalledWith('quote-123')
    })
  })

  describe('confirmPayment', () => {
    it('should confirm payment', async () => {
      const client = createClient()
      await client.startChat({ name: 'John', email: 'john@example.com' })
      await client.sendMessage('Hello')
      await client.generateQuote()
      await client.initPayment('quote-123')

      await expect(
        client.confirmPayment('quote-123', 'pi_test_123')
      ).resolves.toBeUndefined()
    })

    it('should emit paymentCompleted event', async () => {
      const onPaymentCompleted = vi.fn()
      const client = createClient({ callbacks: { onPaymentCompleted } })

      await client.startChat({ name: 'John', email: 'john@example.com' })
      await client.sendMessage('Hello')
      await client.generateQuote()
      await client.initPayment('quote-123')
      await client.confirmPayment('quote-123', 'pi_test_123')

      expect(onPaymentCompleted).toHaveBeenCalledWith('pi_test_123')
    })
  })

  describe('getEscrowStatus', () => {
    it('should return escrow status', async () => {
      const client = createClient()
      const status = await client.getEscrowStatus('quote-123')

      expect(status).toHaveProperty('totalPaid')
      expect(status).toHaveProperty('platformFee')
      expect(status).toHaveProperty('totalHeld')
      expect(status).toHaveProperty('totalReleased')
      expect(status).toHaveProperty('remainingBalance')
    })
  })

  // ===========================================================================
  // Event Handling
  // ===========================================================================

  describe('addEventListener', () => {
    it('should add event listener and return unsubscribe function', () => {
      const client = createClient()
      const handler = vi.fn()

      const unsubscribe = client.addEventListener('error', handler)
      expect(typeof unsubscribe).toBe('function')

      // Trigger event
      client.emit('error', { code: 'TEST', message: 'Test' })
      expect(handler).toHaveBeenCalled()

      // Unsubscribe
      unsubscribe()
      handler.mockClear()
      client.emit('error', { code: 'TEST', message: 'Test' })
      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('removeEventListener', () => {
    it('should remove event listener', () => {
      const client = createClient()
      const handler = vi.fn()

      client.addEventListener('error', handler)
      client.removeEventListener('error', handler)

      client.emit('error', { code: 'TEST', message: 'Test' })
      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('notifyStepChange', () => {
    it('should emit stepChange event', () => {
      const onStepChange = vi.fn()
      const client = createClient({ callbacks: { onStepChange } })

      client.notifyStepChange('payment')

      expect(onStepChange).toHaveBeenCalledWith('payment')
    })
  })

  describe('notifyClose', () => {
    it('should emit close event', () => {
      const onClose = vi.fn()
      const client = createClient({ callbacks: { onClose } })

      client.notifyClose()

      expect(onClose).toHaveBeenCalled()
    })
  })

  // ===========================================================================
  // Error Handling
  // ===========================================================================

  describe('error handling', () => {
    it('should handle rate limiting (429)', async () => {
      const originalFetch = global.fetch
      try {
        global.fetch = vi.fn().mockImplementation(() => Promise.resolve(new Response(
          JSON.stringify({ error: { message: 'Too many requests' } }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': '0.1'
            }
          }
        )))

        const client = createClient()

        await expect(client.validateKey()).rejects.toMatchObject({
          code: 'RATE_LIMIT_EXCEEDED',
        })
      } finally {
        global.fetch = originalFetch
      }
    })

    it('should handle unauthorized (401)', async () => {
      const originalFetch = global.fetch
      try {
        global.fetch = vi.fn().mockImplementation(() => Promise.resolve(new Response(
          JSON.stringify({ error: { message: 'Unauthorized' } }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        )))

        const client = createClient()

        await expect(client.validateKey()).rejects.toMatchObject({
          code: 'INVALID_API_KEY',
        })
      } finally {
        global.fetch = originalFetch
      }
    })

    it('should handle forbidden (403)', async () => {
      const originalFetch = global.fetch
      try {
        global.fetch = vi.fn().mockImplementation(() => Promise.resolve(new Response(
          JSON.stringify({ error: { message: 'Forbidden' } }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        )))

        const client = createClient()

        await expect(client.validateKey()).rejects.toMatchObject({
          code: 'API_KEY_EXPIRED',
        })
      } finally {
        global.fetch = originalFetch
      }
    })

    it('should handle quota exceeded (402)', async () => {
      const originalFetch = global.fetch
      try {
        global.fetch = vi.fn().mockImplementation(() => Promise.resolve(new Response(
          JSON.stringify({ error: { message: 'Quota exceeded' } }),
          { status: 402, headers: { 'Content-Type': 'application/json' } }
        )))

        const client = createClient()

        await expect(client.validateKey()).rejects.toMatchObject({
          code: 'QUOTA_EXCEEDED',
        })
      } finally {
        global.fetch = originalFetch
      }
    })

    it('should handle network timeout', async () => {
      const client = createClient({ timeout: 100 })

      const originalFetch = global.fetch
      try {
        global.fetch = vi.fn().mockImplementation((_url, options) => {
          return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => resolve(new Response()), 200)
            options?.signal?.addEventListener('abort', () => {
              clearTimeout(timeout)
              const error = new Error('Request timed out')
              error.name = 'AbortError'
              reject(error)
            })
          })
        })

        await expect(client.validateKey()).rejects.toMatchObject({
          code: 'NETWORK_ERROR',
          message: 'Request timed out',
        })
      } finally {
        global.fetch = originalFetch
      }
    })

    it('should emit error event on failure', async () => {
      const onError = vi.fn()
      const client = createClient({ callbacks: { onError } })

      await client.startChat()

      const originalFetch = global.fetch
      try {
        global.fetch = vi.fn().mockImplementation(() => Promise.resolve(new Response(
          JSON.stringify({ message: 'Server error' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        )))

        try {
          await client.sendMessage('Hello')
        } catch {
          // Expected
        }

        expect(onError).toHaveBeenCalled()
      } finally {
        global.fetch = originalFetch
      }
    })
  })

  // ===========================================================================
  // Factory Function
  // ===========================================================================

  describe('createQuoteEngine', () => {
    it('should create client instance', () => {
      const client = createQuoteEngine({ apiKey: validApiKey })
      expect(client).toBeInstanceOf(QuoteEngineClient)
    })
  })
})
