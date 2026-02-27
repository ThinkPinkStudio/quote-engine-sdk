/**
 * Tests for webhook signature verification and client
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  computeSignature,
  verifySignature,
  constructEvent,
  WebhookClient,
  WEBHOOK_SIGNATURE_HEADER,
  WEBHOOK_TIMESTAMP_HEADER,
} from '../../core/webhooks'

describe('Webhook Module', () => {
  describe('computeSignature', () => {
    it('should compute HMAC-SHA256 signature', async () => {
      const payload = JSON.stringify({ test: 'data' })
      const secret = 'whsec_test_secret_12345'
      const timestamp = 1704067200 // 2024-01-01 00:00:00 UTC

      const signature = await computeSignature(payload, secret, timestamp)

      expect(signature).toMatch(/^v1=[a-f0-9]{64}$/)
    })

    it('should produce consistent signatures for same input', async () => {
      const payload = JSON.stringify({ event: 'quote.created', id: '123' })
      const secret = 'whsec_consistent'
      const timestamp = 1704067200

      const sig1 = await computeSignature(payload, secret, timestamp)
      const sig2 = await computeSignature(payload, secret, timestamp)

      expect(sig1).toBe(sig2)
    })

    it('should produce different signatures for different payloads', async () => {
      const secret = 'whsec_test'
      const timestamp = 1704067200

      const sig1 = await computeSignature('{"a":1}', secret, timestamp)
      const sig2 = await computeSignature('{"a":2}', secret, timestamp)

      expect(sig1).not.toBe(sig2)
    })

    it('should produce different signatures for different secrets', async () => {
      const payload = JSON.stringify({ test: true })
      const timestamp = 1704067200

      const sig1 = await computeSignature(payload, 'secret1', timestamp)
      const sig2 = await computeSignature(payload, 'secret2', timestamp)

      expect(sig1).not.toBe(sig2)
    })

    it('should produce different signatures for different timestamps', async () => {
      const payload = JSON.stringify({ test: true })
      const secret = 'whsec_test'

      const sig1 = await computeSignature(payload, secret, 1704067200)
      const sig2 = await computeSignature(payload, secret, 1704067201)

      expect(sig1).not.toBe(sig2)
    })
  })

  describe('verifySignature', () => {
    it('should verify valid signature', async () => {
      const payload = JSON.stringify({ type: 'quote.created', id: 'evt_123' })
      const secret = 'whsec_verification_test'
      const timestamp = Math.floor(Date.now() / 1000)

      const signature = await computeSignature(payload, secret, timestamp)

      const isValid = await verifySignature(
        payload,
        signature,
        timestamp.toString(),
        secret
      )

      expect(isValid).toBe(true)
    })

    it('should reject invalid signature', async () => {
      const payload = JSON.stringify({ type: 'quote.created' })
      const secret = 'whsec_test'
      const timestamp = Math.floor(Date.now() / 1000)

      const isValid = await verifySignature(
        payload,
        'v1=invalid_signature_here',
        timestamp.toString(),
        secret
      )

      expect(isValid).toBe(false)
    })

    it('should reject expired timestamp', async () => {
      const payload = JSON.stringify({ test: true })
      const secret = 'whsec_test'
      const oldTimestamp = Math.floor(Date.now() / 1000) - 600 // 10 minutes ago

      const signature = await computeSignature(payload, secret, oldTimestamp)

      const isValid = await verifySignature(
        payload,
        signature,
        oldTimestamp.toString(),
        secret,
        300 // 5 minute tolerance
      )

      expect(isValid).toBe(false)
    })

    it('should accept timestamp within tolerance', async () => {
      const payload = JSON.stringify({ test: true })
      const secret = 'whsec_test'
      const recentTimestamp = Math.floor(Date.now() / 1000) - 60 // 1 minute ago

      const signature = await computeSignature(payload, secret, recentTimestamp)

      const isValid = await verifySignature(
        payload,
        signature,
        recentTimestamp.toString(),
        secret,
        300 // 5 minute tolerance
      )

      expect(isValid).toBe(true)
    })

    it('should reject invalid timestamp format', async () => {
      const payload = JSON.stringify({ test: true })

      const isValid = await verifySignature(
        payload,
        'v1=abc123',
        'not-a-number',
        'whsec_test'
      )

      expect(isValid).toBe(false)
    })

    it('should reject tampered payload', async () => {
      const originalPayload = JSON.stringify({ amount: 100 })
      const tamperedPayload = JSON.stringify({ amount: 1000 })
      const secret = 'whsec_test'
      const timestamp = Math.floor(Date.now() / 1000)

      const signature = await computeSignature(originalPayload, secret, timestamp)

      const isValid = await verifySignature(
        tamperedPayload,
        signature,
        timestamp.toString(),
        secret
      )

      expect(isValid).toBe(false)
    })
  })

  describe('constructEvent', () => {
    it('should construct a valid webhook event', () => {
      const event = constructEvent('quote.created', { quoteId: 'q_123' }, {
        tenantId: 'tenant_abc',
      })

      expect(event.type).toBe('quote.created')
      expect(event.data.quoteId).toBe('q_123')
      expect(event.tenantId).toBe('tenant_abc')
      expect(event.livemode).toBe(true)
      expect(event.id).toMatch(/^evt_[A-Za-z0-9]{24}$/)
      expect(event.timestamp).toBeDefined()
      expect(event.apiVersion).toBe('2024-01-01')
    })

    it('should respect livemode setting', () => {
      const event = constructEvent('payment.succeeded', { amount: 5000 }, {
        tenantId: 'test',
        livemode: false,
      })

      expect(event.livemode).toBe(false)
    })

    it('should allow custom API version', () => {
      const event = constructEvent('chat.completed', {}, {
        tenantId: 'test',
        apiVersion: '2025-01-01',
      })

      expect(event.apiVersion).toBe('2025-01-01')
    })
  })

  describe('WebhookClient', () => {
    let client: WebhookClient

    beforeEach(() => {
      client = new WebhookClient({
        apiKey: 'test_api_key',
        baseUrl: 'https://api.test.com',
      })
      vi.clearAllMocks()
    })

    describe('create', () => {
      it('should create a webhook endpoint', async () => {
        const mockEndpoint = {
          id: 'we_123',
          url: 'https://example.com/webhooks',
          events: ['quote.created'],
          secret: 'whsec_generated',
          enabled: true,
          createdAt: new Date(),
        }

        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockEndpoint),
        })

        const endpoint = await client.create({
          url: 'https://example.com/webhooks',
          events: ['quote.created'],
        })

        expect(fetch).toHaveBeenCalledWith(
          'https://api.test.com/webhooks',
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'X-API-Key': 'test_api_key',
            }),
          })
        )
        expect(endpoint.id).toBe('we_123')
        expect(endpoint.secret).toBe('whsec_generated')
      })

      it('should throw on error response', async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          json: () => Promise.resolve({ message: 'Invalid URL' }),
        })

        await expect(
          client.create({ url: 'invalid', events: [] })
        ).rejects.toThrow('Invalid URL')
      })
    })

    describe('list', () => {
      it('should list webhook endpoints', async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({
            endpoints: [
              { id: 'we_1', url: 'https://a.com' },
              { id: 'we_2', url: 'https://b.com' },
            ],
          }),
        })

        const endpoints = await client.list()

        expect(endpoints).toHaveLength(2)
        expect(endpoints[0].id).toBe('we_1')
      })
    })

    describe('update', () => {
      it('should update webhook endpoint', async () => {
        const updated = {
          id: 'we_123',
          url: 'https://new-url.com',
          enabled: false,
        }

        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(updated),
        })

        const result = await client.update('we_123', {
          url: 'https://new-url.com',
          enabled: false,
        })

        expect(fetch).toHaveBeenCalledWith(
          'https://api.test.com/webhooks/we_123',
          expect.objectContaining({ method: 'PATCH' })
        )
        expect(result.enabled).toBe(false)
      })
    })

    describe('delete', () => {
      it('should delete webhook endpoint', async () => {
        global.fetch = vi.fn().mockResolvedValue({ ok: true })

        await client.delete('we_123')

        expect(fetch).toHaveBeenCalledWith(
          'https://api.test.com/webhooks/we_123',
          expect.objectContaining({ method: 'DELETE' })
        )
      })
    })

    describe('rotateSecret', () => {
      it('should rotate webhook secret', async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({ secret: 'whsec_new_secret' }),
        })

        const result = await client.rotateSecret('we_123')

        expect(fetch).toHaveBeenCalledWith(
          'https://api.test.com/webhooks/we_123/rotate-secret',
          expect.objectContaining({ method: 'POST' })
        )
        expect(result.secret).toBe('whsec_new_secret')
      })
    })

    describe('listDeliveries', () => {
      it('should list webhook deliveries', async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({
            deliveries: [
              { id: 'd_1', status: 'success', eventType: 'quote.created' },
              { id: 'd_2', status: 'failed', eventType: 'payment.failed' },
            ],
          }),
        })

        const deliveries = await client.listDeliveries('we_123', { limit: 10 })

        expect(fetch).toHaveBeenCalledWith(
          'https://api.test.com/webhooks/we_123/deliveries?limit=10',
          expect.any(Object)
        )
        expect(deliveries).toHaveLength(2)
        expect(deliveries[1].status).toBe('failed')
      })
    })

    describe('resendDelivery', () => {
      it('should resend a failed delivery', async () => {
        global.fetch = vi.fn().mockResolvedValue({ ok: true })

        await client.resendDelivery('we_123', 'd_456')

        expect(fetch).toHaveBeenCalledWith(
          'https://api.test.com/webhooks/we_123/deliveries/d_456/resend',
          expect.objectContaining({ method: 'POST' })
        )
      })
    })
  })

  describe('Header Constants', () => {
    it('should export correct header names', () => {
      expect(WEBHOOK_SIGNATURE_HEADER).toBe('X-QuoteEngine-Signature')
      expect(WEBHOOK_TIMESTAMP_HEADER).toBe('X-QuoteEngine-Timestamp')
    })
  })
})
