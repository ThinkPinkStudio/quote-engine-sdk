/**
 * ThinkPink Quote Engine SDK - Webhook Module
 *
 * Provides webhook registration, HMAC signature verification,
 * and event delivery for server-side integrations.
 */

import type { Quote, PaymentStatus, WebhookEvent } from './types'

// ============================================================================
// Webhook Types
// ============================================================================

/**
 * Extended webhook event types
 */
export type WebhookEventType =
  | WebhookEvent
  | 'quote.generated'
  | 'chat.completed'
  | 'payment.succeeded'
  | 'payment.failed'

/**
 * Webhook payload base
 */
export interface WebhookPayloadBase {
  /** Unique event ID */
  id: string

  /** Event type */
  type: WebhookEventType

  /** API version */
  apiVersion: string

  /** Timestamp (ISO 8601) */
  timestamp: string

  /** Tenant ID */
  tenantId: string

  /** Livemode indicator */
  livemode: boolean
}

/**
 * Quote event payload
 */
export interface QuoteEventPayload extends WebhookPayloadBase {
  type:
    | 'quote.created'
    | 'quote.updated'
    | 'quote.generated'
    | 'quote.paid'
    | 'quote.expired'
  data: {
    quote: Quote
    previousStatus?: string
  }
}

/**
 * Chat completed payload
 */
export interface ChatCompletedPayload extends WebhookPayloadBase {
  type: 'chat.completed'
  data: {
    sessionId: string
    quoteId?: string
    messageCount: number
    duration: number // seconds
    customerEmail?: string
  }
}

/**
 * Payment event payload
 */
export interface PaymentEventPayload extends WebhookPayloadBase {
  type: 'payment.received' | 'payment.released' | 'payment.disputed' | 'payment.succeeded' | 'payment.failed'
  data: {
    paymentId: string
    quoteId: string
    amount: number
    currency: string
    status: PaymentStatus
    stripePaymentIntentId?: string
    failureReason?: string
  }
}

/**
 * Contract signed payload
 */
export interface ContractSignedPayload extends WebhookPayloadBase {
  type: 'contract.signed'
  data: {
    contractId: string
    quoteId: string
    signedAt: string
    signerName: string
    signerEmail: string
  }
}

/**
 * Union of all webhook payloads
 */
export type WebhookPayload =
  | QuoteEventPayload
  | ChatCompletedPayload
  | PaymentEventPayload
  | ContractSignedPayload

/**
 * Webhook endpoint configuration
 */
export interface WebhookEndpoint {
  /** Endpoint ID */
  id: string

  /** Webhook URL */
  url: string

  /** Events to receive */
  events: WebhookEventType[]

  /** Webhook secret for HMAC verification */
  secret: string

  /** Whether endpoint is enabled */
  enabled: boolean

  /** Created timestamp */
  createdAt: Date

  /** Last successful delivery */
  lastSuccessAt?: Date

  /** Last failure message */
  lastFailure?: string
}

/**
 * Webhook signature header name
 */
export const WEBHOOK_SIGNATURE_HEADER = 'X-QuoteEngine-Signature'

/**
 * Webhook timestamp header name
 */
export const WEBHOOK_TIMESTAMP_HEADER = 'X-QuoteEngine-Timestamp'

/**
 * Webhook ID header name
 */
export const WEBHOOK_ID_HEADER = 'X-QuoteEngine-ID'

// ============================================================================
// HMAC Signature Utilities
// ============================================================================

/**
 * Compute HMAC-SHA256 signature for a payload
 *
 * @param payload - The webhook payload (JSON string)
 * @param secret - The webhook secret
 * @param timestamp - Unix timestamp (seconds)
 * @returns The signature in format: v1=<hex-digest>
 *
 * @example
 * ```typescript
 * const signature = await computeSignature(
 *   JSON.stringify(payload),
 *   'whsec_your_secret',
 *   Math.floor(Date.now() / 1000)
 * )
 * // => "v1=5b8c..."
 * ```
 */
export async function computeSignature(
  payload: string,
  secret: string,
  timestamp: number
): Promise<string> {
  const signedPayload = `${timestamp}.${payload}`

  // Use Web Crypto API (works in browser and Node.js 15+)
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(signedPayload)
    )

    const hashArray = Array.from(new Uint8Array(signatureBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

    return `v1=${hashHex}`
  }

  // Fallback for Node.js without Web Crypto
  throw new Error(
    'Web Crypto API not available. Use Node.js 15+ or a polyfill.'
  )
}

/**
 * Verify a webhook signature
 *
 * @param payload - The raw request body (string)
 * @param signature - The signature from X-QuoteEngine-Signature header
 * @param timestamp - The timestamp from X-QuoteEngine-Timestamp header
 * @param secret - Your webhook secret
 * @param tolerance - Max age of webhook in seconds (default: 300 = 5 minutes)
 * @returns Whether the signature is valid
 *
 * @example
 * ```typescript
 * // Express.js middleware
 * app.post('/webhooks/quote-engine', express.raw({ type: 'application/json' }), async (req, res) => {
 *   const signature = req.headers['x-quoteengine-signature'] as string
 *   const timestamp = req.headers['x-quoteengine-timestamp'] as string
 *
 *   const isValid = await verifySignature(
 *     req.body.toString(),
 *     signature,
 *     timestamp,
 *     process.env.WEBHOOK_SECRET!
 *   )
 *
 *   if (!isValid) {
 *     return res.status(401).json({ error: 'Invalid signature' })
 *   }
 *
 *   const event = JSON.parse(req.body.toString()) as WebhookPayload
 *   // Handle event...
 *
 *   res.json({ received: true })
 * })
 * ```
 */
export async function verifySignature(
  payload: string,
  signature: string,
  timestamp: string,
  secret: string,
  tolerance: number = 300
): Promise<boolean> {
  // Parse timestamp
  const ts = parseInt(timestamp, 10)
  if (isNaN(ts)) {
    return false
  }

  // Check timestamp is within tolerance
  const now = Math.floor(Date.now() / 1000)
  if (Math.abs(now - ts) > tolerance) {
    return false
  }

  // Compute expected signature
  const expectedSignature = await computeSignature(payload, secret, ts)

  // Constant-time comparison to prevent timing attacks
  return timingSafeEqual(signature, expectedSignature)
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return result === 0
}

// ============================================================================
// Webhook Event Construction
// ============================================================================

/**
 * Construct a webhook event payload
 *
 * @param type - Event type
 * @param data - Event data
 * @param options - Additional options
 * @returns Complete webhook payload
 */
export function constructEvent<T extends WebhookEventType>(
  type: T,
  data: Record<string, unknown>,
  options: {
    tenantId: string
    livemode?: boolean
    apiVersion?: string
  }
): WebhookPayloadBase & { type: T; data: typeof data } {
  return {
    id: `evt_${generateId()}`,
    type,
    apiVersion: options.apiVersion || '2024-01-01',
    timestamp: new Date().toISOString(),
    tenantId: options.tenantId,
    livemode: options.livemode ?? true,
    data,
  }
}

/**
 * Generate a random event ID
 */
function generateId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 24; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// ============================================================================
// Webhook Client (for SDK users to manage webhooks)
// ============================================================================

export interface WebhookClientOptions {
  apiKey: string
  baseUrl?: string
}

/**
 * Client for managing webhook endpoints
 *
 * @example
 * ```typescript
 * const webhooks = new WebhookClient({
 *   apiKey: 'your-api-key',
 * })
 *
 * // Register a new webhook
 * const endpoint = await webhooks.create({
 *   url: 'https://your-server.com/webhooks',
 *   events: ['quote.generated', 'payment.succeeded', 'payment.failed'],
 * })
 *
 * // List all endpoints
 * const endpoints = await webhooks.list()
 *
 * // Delete an endpoint
 * await webhooks.delete(endpoint.id)
 * ```
 */
export class WebhookClient {
  private apiKey: string
  private baseUrl: string

  constructor(options: WebhookClientOptions) {
    this.apiKey = options.apiKey
    this.baseUrl = options.baseUrl || 'https://www.thinkpinkstudio.it/api/qe-sdk'
  }

  /**
   * Create a new webhook endpoint
   */
  async create(options: {
    url: string
    events: WebhookEventType[]
    description?: string
  }): Promise<WebhookEndpoint> {
    const response = await fetch(`${this.baseUrl}/webhooks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      },
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create webhook endpoint')
    }

    return response.json()
  }

  /**
   * List all webhook endpoints
   */
  async list(): Promise<WebhookEndpoint[]> {
    const response = await fetch(`${this.baseUrl}/webhooks`, {
      headers: {
        'X-API-Key': this.apiKey,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to list webhook endpoints')
    }

    const data = await response.json()
    return data.endpoints
  }

  /**
   * Get a specific webhook endpoint
   */
  async get(id: string): Promise<WebhookEndpoint> {
    const response = await fetch(`${this.baseUrl}/webhooks/${id}`, {
      headers: {
        'X-API-Key': this.apiKey,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to get webhook endpoint')
    }

    return response.json()
  }

  /**
   * Update a webhook endpoint
   */
  async update(
    id: string,
    options: {
      url?: string
      events?: WebhookEventType[]
      enabled?: boolean
    }
  ): Promise<WebhookEndpoint> {
    const response = await fetch(`${this.baseUrl}/webhooks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      },
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update webhook endpoint')
    }

    return response.json()
  }

  /**
   * Delete a webhook endpoint
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/webhooks/${id}`, {
      method: 'DELETE',
      headers: {
        'X-API-Key': this.apiKey,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to delete webhook endpoint')
    }
  }

  /**
   * Rotate the webhook secret
   */
  async rotateSecret(id: string): Promise<{ secret: string }> {
    const response = await fetch(`${this.baseUrl}/webhooks/${id}/rotate-secret`, {
      method: 'POST',
      headers: {
        'X-API-Key': this.apiKey,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to rotate webhook secret')
    }

    return response.json()
  }

  /**
   * List recent webhook deliveries (for debugging)
   */
  async listDeliveries(
    endpointId: string,
    options?: { limit?: number }
  ): Promise<
    {
      id: string
      eventType: WebhookEventType
      status: 'success' | 'failed' | 'pending'
      statusCode?: number
      timestamp: string
      duration?: number
      error?: string
    }[]
  > {
    const params = new URLSearchParams()
    if (options?.limit) {
      params.set('limit', options.limit.toString())
    }

    const response = await fetch(
      `${this.baseUrl}/webhooks/${endpointId}/deliveries?${params}`,
      {
        headers: {
          'X-API-Key': this.apiKey,
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to list webhook deliveries')
    }

    const data = await response.json()
    return data.deliveries
  }

  /**
   * Resend a failed webhook delivery
   */
  async resendDelivery(endpointId: string, deliveryId: string): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/webhooks/${endpointId}/deliveries/${deliveryId}/resend`,
      {
        method: 'POST',
        headers: {
          'X-API-Key': this.apiKey,
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to resend webhook delivery')
    }
  }
}

/**
 * Create a webhook client instance
 */
export function createWebhookClient(options: WebhookClientOptions): WebhookClient {
  return new WebhookClient(options)
}
