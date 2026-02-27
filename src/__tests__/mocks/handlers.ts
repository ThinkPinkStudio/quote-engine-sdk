/**
 * MSW request handlers for Quote Engine SDK tests
 */

import { http, HttpResponse, delay } from 'msw'
import { createStreamingResponse } from '../setup'

const BASE_URL = 'https://www.thinkpinkstudio.it'

// Sample data
export const mockTenantConfig = {
  tenant: {
    slug: 'test-tenant',
    plan: 'pro',
    status: 'active',
    branding: {
      logo: 'https://example.com/logo.png',
      primaryColor: '#e91e63',
    },
    aiConfig: {
      model: 'gpt-4',
      temperature: 0.7,
    },
  },
  environment: 'test',
}

export const mockQuote = {
  id: 'quote-123',
  quoteNumber: 'QE-2025-001',
  status: 'draft',
  customer: {
    name: 'John Doe',
    email: 'john@example.com',
    company: 'ACME Inc',
  },
  pricing: {
    breakdown: [
      { category: 'Design', description: 'UI/UX Design', hours: 40, rate: 100, amount: 4000 },
      { category: 'Development', description: 'Frontend Dev', hours: 80, rate: 100, amount: 8000 },
    ],
    subtotal: 12000,
    discounts: [],
    subtotalAfterDiscounts: 12000,
    vatRate: 22,
    vatAmount: 2640,
    total: 14640,
    deposit: {
      percentage: 30,
      amount: 4392,
    },
    milestones: [],
  },
  escrow: {
    amountHeld: 0,
    platformFee: 0,
    amountReleased: 0,
    releases: [],
  },
  contract: {
    status: 'pending',
  },
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
}

export const mockPaymentInit = {
  paymentId: 'pay-123',
  paymentIntentId: 'pi_test_123',
  clientSecret: 'pi_test_123_secret_abc',
  amount: 4392,
  platformFee: 175.68,
  isEscrow: true,
}

export const handlers = [
  // Validate API key
  http.post(`${BASE_URL}/api/qe-sdk/validate`, async ({ request }) => {
    const apiKey = request.headers.get('X-API-Key')

    if (!apiKey || apiKey.length < 20) {
      return HttpResponse.json(
        { error: { message: 'Invalid API key' } },
        { status: 401 }
      )
    }

    if (apiKey === 'expired-api-key-12345678') {
      return HttpResponse.json(
        { error: { message: 'API key has expired' } },
        { status: 403 }
      )
    }

    return HttpResponse.json({ data: mockTenantConfig })
  }),

  // Chat endpoint with streaming
  http.post(`${BASE_URL}/api/qe-sdk/chat`, async ({ request }) => {
    const apiKey = request.headers.get('X-API-Key')

    if (!apiKey) {
      return HttpResponse.json(
        { error: { message: 'Unauthorized' } },
        { status: 401 }
      )
    }

    await request.json().catch(() => ({}))

    // Simulate streaming response
    const chunks = [
      'data: {"type":"content","data":{"text":"Thank "}}\n\n',
      'data: {"type":"content","data":{"text":"you for "}}\n\n',
      'data: {"type":"content","data":{"text":"your message!"}}\n\n',
      'data: {"type":"metadata","data":{"confidence":0.95,"shouldGenerateQuote":false}}\n\n',
    ]

    return createStreamingResponse(chunks) as any
  }),

  // Generate quote
  http.post(`${BASE_URL}/api/qe-sdk/quote/generate`, async ({ request }) => {
    const apiKey = request.headers.get('X-API-Key')

    if (!apiKey) {
      return HttpResponse.json(
        { error: { message: 'Unauthorized' } },
        { status: 401 }
      )
    }

    const body = (await request.json()) as { customer?: { name?: string; email?: string } }

    if (!body.customer?.email || !body.customer?.name) {
      return HttpResponse.json(
        { error: { message: 'Customer name and email required' } },
        { status: 400 }
      )
    }

    await delay(100)
    return HttpResponse.json({ quote: mockQuote })
  }),

  // Get quote by ID
  http.get(`${BASE_URL}/api/qe-sdk/quote/:quoteId`, async ({ params }) => {
    if (params.quoteId === 'not-found') {
      return HttpResponse.json(
        { error: { message: 'Quote not found' } },
        { status: 404 }
      )
    }

    return HttpResponse.json({ quote: { ...mockQuote, id: params.quoteId } })
  }),

  // Send quote email
  http.post(`${BASE_URL}/api/qe-sdk/quote/:quoteId/email`, async () => {
    await delay(50)
    return HttpResponse.json({ success: true })
  }),

  // Download PDF
  http.post(`${BASE_URL}/api/qe-sdk/quote/:quoteId/pdf`, async () => {
    await delay(50)
    return new HttpResponse(new Blob(['%PDF-1.4...'], { type: 'application/pdf' }), {
      headers: { 'Content-Type': 'application/pdf' },
    })
  }),

  // Init payment (escrow)
  http.post(`${BASE_URL}/api/qe-sdk/escrow`, async ({ request }) => {
    const body = (await request.json()) as { quoteId?: string }

    if (!body.quoteId) {
      return HttpResponse.json(
        { error: { message: 'Quote ID required' } },
        { status: 400 }
      )
    }

    await delay(100)
    return HttpResponse.json(mockPaymentInit)
  }),

  // Confirm payment
  http.post(`${BASE_URL}/api/qe-sdk/quote/:quoteId/pay`, async ({ request }) => {
    const body = (await request.json()) as { paymentIntentId?: string }

    if (!body.paymentIntentId) {
      return HttpResponse.json(
        { error: { message: 'Payment intent ID required' } },
        { status: 400 }
      )
    }

    await delay(50)
    return HttpResponse.json({ success: true })
  }),

  // Rate limiting test
  http.post(`${BASE_URL}/api/qe-sdk/rate-limited`, async () => {
    return HttpResponse.json(
      { error: { message: 'Too many requests' } },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }),

  // Server error for retry tests
  http.post(`${BASE_URL}/api/qe-sdk/server-error`, async () => {
    return HttpResponse.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    )
  }),

  // Timeout simulation
  http.post(`${BASE_URL}/api/qe-sdk/timeout`, async () => {
    await delay(60000) // 60 seconds - will timeout
    return HttpResponse.json({ success: true })
  }),
]
