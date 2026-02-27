# @thinkpinkstudio/quote-engine-sdk

White-label SDK for integrating the **ThinkPink Quote Engine** into any application. AI-powered project quoting with real-time chat, automated quote generation, PDF export, Stripe payments, and **RAG-powered intelligence** that learns from your quoting history.

[![npm version](https://img.shields.io/npm/v/@thinkpinkstudio/quote-engine-sdk.svg)](https://www.npmjs.com/package/@thinkpinkstudio/quote-engine-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## What is this?

The ThinkPink Quote Engine SDK lets you add an AI-powered quoting system to your website or app. Your customers describe their project in natural language, and the AI generates an accurate, detailed quote — complete with timeline, pricing breakdown, and payment processing.

**What makes it special:** The AI learns from every quote you generate. After your first few quotes, the system uses **Retrieval-Augmented Generation (RAG)** to find similar past projects, making estimates progressively more accurate and grounded in your real pricing data.

## Key Features

- **AI Chat** — Natural conversation to gather project requirements
- **RAG Intelligence** — Learns from your quote history for accurate estimates (PRO+)
- **Multi-framework** — React, Next.js, Vue, Angular, Svelte, Astro, React Native, Electron, Vanilla JS, Flutter
- **White-label** — Full visual customization (colors, fonts, text, CSS)
- **Stripe Connect** — Payments with optional escrow (PRO+)
- **Multi-language** — Italian, English, German, French, Spanish, Dutch, Portuguese
- **PDF Export** — Professional quote documents
- **Webhooks** — Real-time notifications for quote events
- **GDPR-compliant** — Analytics with consent management

## Supported Platforms

| Platform | Import Path | Status |
|----------|------------|--------|
| **Core** (framework-agnostic) | `@thinkpinkstudio/quote-engine-sdk` | Stable |
| **React** | `@thinkpinkstudio/quote-engine-sdk/react` | Stable |
| **Next.js** | `@thinkpinkstudio/quote-engine-sdk/nextjs` | Stable |
| **Vue 3** | `@thinkpinkstudio/quote-engine-sdk/vue` | Stable |
| **Angular** | `@thinkpinkstudio/quote-engine-sdk/angular` | Stable |
| **Svelte** | `@thinkpinkstudio/quote-engine-sdk/svelte` | Stable |
| **Astro** | `@thinkpinkstudio/quote-engine-sdk/astro` | Stable |
| **React Native** | `@thinkpinkstudio/quote-engine-sdk/react-native` | Stable |
| **Electron** | `@thinkpinkstudio/quote-engine-sdk/electron` | Stable |
| **Vanilla JS** | `@thinkpinkstudio/quote-engine-sdk/vanilla` | Stable |
| **Flutter** | `thinkpink_quote_engine` (pub.dev) | Stable |

---

## Installation

```bash
npm install @thinkpinkstudio/quote-engine-sdk
```
<!-- 
```bash
yarn add @thinkpinkstudio/quote-engine-sdk
```

```bash
pnpm add @thinkpinkstudio/quote-engine-sdk
```

### CDN

```html
<script src="https://cdn.thinkpinkstudio.it/sdk/quote-engine.iife.js"></script>
``` -->

---

## Quick Start

### 1. Get Your API Key

1. Sign up at [thinkpinkstudio.it/tenant-onboarding](https://thinkpinkstudio.it/tenant-onboarding)
2. Create your tenant workspace and select a plan
3. Go to **Settings → API Keys** and create a new key
4. Copy the key (shown only once)

### 2. Add to Your App (React Example)

```tsx
import { QuoteEngineProvider, useQuoteChat, useQuote } from '@thinkpinkstudio/quote-engine-sdk/react'

function App() {
  return (
    <QuoteEngineProvider config={{
      apiKey: process.env.REACT_APP_QE_API_KEY!,
      language: 'it',
      theme: { primaryColor: '#E91E63' },
    }}>
      <QuotePage />
    </QuoteEngineProvider>
  )
}

function QuotePage() {
  const { messages, sendMessage, isLoading, streamingContent, ragInsight } = useQuoteChat()
  const { quote, generateQuote } = useQuote()

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id} className={msg.role}>{msg.content}</div>
      ))}

      {streamingContent && <div className="streaming">{streamingContent}</div>}

      {ragInsight && ragInsight.dataPoints > 0 && (
        <div className="rag-badge">
          Based on {ragInsight.dataPoints} similar projects
          (Confidence: {ragInsight.confidence}%)
        </div>
      )}

      <input onKeyDown={e => e.key === 'Enter' && sendMessage(e.target.value)} />
    </div>
  )
}
```

That's it. The AI will start learning from your quotes automatically.

---

## How RAG Intelligence Works

```
Customer describes project
        ↓
AI searches your past quotes for similar projects
        ↓
Finds matches → Uses real pricing data in response
No matches → Falls back to standard AI estimation
        ↓
Quote is generated with confidence score
        ↓
New quote is automatically indexed for future reference
```

**The more you use it, the smarter it gets.**

| Quotes Generated | AI Behavior |
|---|---|
| 0–5 | Standard AI estimation (no historical data) |
| 5–20 | Basic pattern matching, rough price ranges |
| 20–100 | Accurate pricing based on your real data |
| 100+ | High-confidence estimates with narrow ranges |

### RAG Insight Data

When RAG is active, the `useQuoteChat` hook exposes:

```typescript
const { ragInsight } = useQuoteChat()

// ragInsight: {
//   dataPoints: 12,           // Similar quotes found
//   confidence: 78,            // 0-100 confidence score
//   similarProjectsCount: 3,   // Direct matches
//   pricingRange: {             // From historical data
//     min: 5000,
//     max: 15000,
//     avg: 9200
//   }
// }
```

RAG is available on **PRO** and **ENTERPRISE** plans. On Starter, the AI uses standard estimation.

---

## Framework Guides

### React

```tsx
import {
  QuoteEngineProvider,
  useQuoteChat,
  useQuote,
  usePayment,
  useQuoteWidget,
  useCustomerForm,
} from '@thinkpinkstudio/quote-engine-sdk/react'

function App() {
  return (
    <QuoteEngineProvider config={{
      apiKey: process.env.REACT_APP_QE_API_KEY!,
      language: 'it',
      theme: { primaryColor: '#E91E63' },
    }}>
      <ChatScreen />
    </QuoteEngineProvider>
  )
}

function ChatScreen() {
  const { messages, sendMessage, isLoading, streamingContent, ragInsight } = useQuoteChat()
  const { quote, generateQuote, downloadPdf } = useQuote()
  const { initPayment, confirmPayment } = usePayment()

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id} className={msg.role}>{msg.content}</div>
      ))}
      {streamingContent && <div className="streaming">{streamingContent}</div>}
    </div>
  )
}
```

**Available hooks:**
| Hook | Returns |
|------|---------|
| `useQuoteChat()` | `messages`, `sendMessage`, `isLoading`, `streamingContent`, `ragInsight` |
| `useQuote()` | `quote`, `generateQuote`, `downloadPdf`, `sendQuoteEmail` |
| `usePayment()` | `initPayment`, `confirmPayment`, `paymentStatus` |
| `useQuoteWidget()` | `isOpen`, `currentStep`, `open`, `close`, `reset` |
| `useCustomerForm()` | `data`, `errors`, `setField`, `validate` |
| `useQuoteEngineEvent(event, handler)` | — |
| `useQuoteEngineTheme()` | `theme`, `labels` |

### Next.js

```tsx
// app/quote/page.tsx
import { QuoteEngineProvider, useQuoteChat } from '@thinkpinkstudio/quote-engine-sdk/nextjs'

export default function QuotePage() {
  return (
    <QuoteEngineProvider config={{
      apiKey: process.env.NEXT_PUBLIC_QE_API_KEY!,
      language: 'it',
    }}>
      <ChatWidget />
    </QuoteEngineProvider>
  )
}
```

SSR-safe: the SDK automatically handles `'use client'` boundaries and hydration.

### Vue 3

```vue
<script setup lang="ts">
import { useQuoteEngine } from '@thinkpinkstudio/quote-engine-sdk/vue'

const { messages, sendMessage, isStreaming, streamingContent, ragInsight, generateQuote, quote } =
  useQuoteEngine({
    apiKey: import.meta.env.VITE_QE_API_KEY,
    language: 'it',
  })
</script>

<template>
  <div v-for="msg in messages" :key="msg.id" :class="msg.role">
    {{ msg.content }}
  </div>
  <div v-if="ragInsight?.dataPoints">
    Based on {{ ragInsight.dataPoints }} similar projects
  </div>
</template>
```

### Angular

```typescript
import { NgModule } from '@angular/core'
import { QuoteEngineModule } from '@thinkpinkstudio/quote-engine-sdk/angular'

@NgModule({
  imports: [
    QuoteEngineModule.forRoot({
      apiKey: environment.qeApiKey,
      language: 'it',
    }),
  ],
})
export class QuoteModule {}
```

```typescript
import { Component } from '@angular/core'
import { QuoteEngineService } from '@thinkpinkstudio/quote-engine-sdk/angular'

@Component({
  selector: 'app-chat',
  template: `
    <div *ngFor="let msg of messages$ | async" [ngClass]="msg.role">
      {{ msg.content }}
    </div>
    <div *ngIf="ragInsight$ | async as rag">
      Based on {{ rag.dataPoints }} similar projects
    </div>
  `,
})
export class ChatComponent {
  messages$ = this.qe.messages$
  ragInsight$ = this.qe.ragInsight$

  constructor(private qe: QuoteEngineService) {}

  async send(text: string) {
    await this.qe.sendMessage(text)
  }
}
```

### Svelte

```svelte
<script lang="ts">
  import { createQuoteEngine } from '@thinkpinkstudio/quote-engine-sdk/svelte'

  const { messages, sendMessage, isStreaming, streamingContent, ragInsight } = createQuoteEngine({
    apiKey: import.meta.env.VITE_QE_API_KEY,
    language: 'it',
  })
</script>

{#each $messages as msg (msg.id)}
  <div class={msg.role}>{msg.content}</div>
{/each}

{#if $ragInsight?.dataPoints}
  <small>Based on {$ragInsight.dataPoints} similar projects</small>
{/if}
```

### Astro

```astro
---
import { getQuoteEngineConfig, createQuoteEngineScript } from '@thinkpinkstudio/quote-engine-sdk/astro'

const config = getQuoteEngineConfig({
  apiKey: import.meta.env.PUBLIC_QE_API_KEY,
  language: 'it',
  mode: 'inline',
})
---

<div id="quote-engine-container"></div>
<script is:inline set:html={createQuoteEngineScript(config)} />
```

### React Native

```tsx
import {
  QuoteEngineRNProvider,
  useQuoteChat,
  useQuote,
  createRNStorage,
} from '@thinkpinkstudio/quote-engine-sdk/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const storage = createRNStorage(AsyncStorage)

function App() {
  return (
    <QuoteEngineRNProvider config={{ apiKey: 'tpk_live_xxxxx', language: 'it', storage }}>
      <ChatScreen />
    </QuoteEngineRNProvider>
  )
}
```

### Electron

```typescript
// main.ts
import { QuoteEngineMain } from '@thinkpinkstudio/quote-engine-sdk/electron'

const qeMain = new QuoteEngineMain({ apiKey: process.env.QE_API_KEY!, language: 'it' })
app.whenReady().then(() => qeMain.registerIPC())

// preload.ts
import { exposeQuoteEngineAPI } from '@thinkpinkstudio/quote-engine-sdk/electron'
exposeQuoteEngineAPI()
```

### Vanilla JS

```html
<script src="https://cdn.thinkpinkstudio.it/sdk/quote-engine.iife.js"></script>
<div id="quote-widget"></div>
<script>
  QuoteEngine.init({
    apiKey: 'tpk_live_xxxxx',
    language: 'it',
    containerId: 'quote-widget',
    mode: 'inline',
    theme: { primaryColor: '#E91E63' },
  })
</script>
```

### Flutter

```dart
import 'package:thinkpink_quote_engine/thinkpink_quote_engine.dart';

final client = QuoteEngineClient(
  config: QuoteEngineConfig(apiKey: 'tpk_live_xxxxx', language: 'it'),
);

// Pre-built widget
QuoteEngineChatWidget(
  client: client,
  primaryColor: Colors.pink,
  onQuoteReady: (quote) => Navigator.push(...),
)
```

---

## Theming & Customization

Every visual aspect is customizable via the `theme` config:

```typescript
const config = {
  apiKey: 'tpk_live_xxxxx',
  theme: {
    // Colors
    primaryColor: '#6C63FF',
    secondaryColor: '#FF6584',
    backgroundColor: '#FFFFFF',
    surfaceColor: '#F8F9FA',
    textColor: '#1A1A1A',

    // Message Bubbles
    userBubbleColor: '#6C63FF',
    userBubbleTextColor: '#FFFFFF',
    assistantBubbleColor: '#F3F4F6',
    assistantBubbleTextColor: '#1F2937',

    // Typography
    fontFamily: '"Inter", sans-serif',
    fontSize: 14,

    // Layout
    borderRadius: 12,
    widgetHeight: '500px',

    // Theme presets: 'glass' | 'minimal' | 'elegant'
    style: 'glass',
  },
  labels: {
    headerTitle: 'Get a Quote',
    inputPlaceholder: 'Describe your project...',
    sendButtonLabel: 'Send',
    generateQuoteLabel: 'Generate Quote',
    poweredByText: '', // empty to hide
  },
}
```

<!-- See the [Theming Guide](https://thinkpinkstudio.it/developers/theming) for the full list of 60+ design tokens. -->

---

## RAG Configuration (Tenant Dashboard)

Control how the AI uses historical data:

| Setting | Default | Description |
|---|---|---|
| RAG Enabled | `true` (PRO+) | Enable/disable RAG intelligence |
| Auto-Ingest | `true` | Automatically index new completed quotes |
| Min Confidence | `50` | Minimum confidence to show RAG data to customers |
| Show Similar Projects | `true` | Display anonymized similar project references |
| Show Pricing Range | `true` | Show historical price range |
| Show Confidence Badge | `true` | Show "AI-powered estimate" badge |

### Knowledge Base Upload

Upload documents (PDF, TXT, Markdown) to your Knowledge Base to give the AI additional context about your services, specializations, and pricing philosophy.

```
Tenant Dashboard → Settings → AI Intelligence → Knowledge Base → Upload
```

Supported: PDF, TXT, MD, DOCX (max 10MB per file, 100 files total on PRO, unlimited on Enterprise).

---

## API Key Types

| Prefix | Environment | Rate Limit | Usage |
|--------|------------|------------|-------|
| `tpk_test_` | Sandbox | 60 req/min | Development and testing |
| `tpk_live_` | Production | 60 req/min | Production apps |

- Max 5 active keys per tenant
- Domain whitelisting for production keys
- Keys hashed (SHA-256), never stored in plain text

---

## Payment Flow (Stripe Connect)

```
Customer → SDK → Backend → Stripe Connect → Your Stripe Account
                                 |
                           Platform Fee (0–4%)
```

| Plan | Platform Fee | Escrow |
|---|---|---|
| Starter | 0% | Not available |
| PRO | 4% | Available |
| Enterprise | 2% | Available |

```typescript
const { clientSecret } = await client.initPayment(quote.id, 'deposit')

const stripe = await loadStripe('pk_live_...')
const { error } = await stripe.confirmPayment({
  elements,
  confirmParams: { return_url: 'https://yoursite.com/success' },
})

await client.confirmPayment(quote.id, paymentIntentId)
```

---

## Webhooks

Receive real-time notifications:

```typescript
// Your server
app.post('/webhooks/quote-engine', (req, res) => {
  const signature = req.headers['x-qe-signature']
  const isValid = verifyWebhookSignature(req.body, signature, webhookSecret)

  if (!isValid) return res.status(401).send('Invalid signature')

  const { event, data } = req.body

  switch (event) {
    case 'quote.created':
      console.log(`New quote: ${data.quoteNumber} — €${data.pricing.total}`)
      break
    case 'quote.paid':
      console.log(`Payment received: €${data.amount}`)
      break
    case 'payment.received':
      // Milestone payment received
      break
    case 'contract.signed':
      // Contract signed by customer
      break
  }

  res.status(200).send('OK')
})
```

Configure webhook URLs in **Tenant Dashboard → Settings → Integrations → Webhooks**.

---

## Plans & Pricing

| Feature | Starter (€49/mo) | PRO (€149/mo) | Enterprise (€499/mo) |
|---|---|---|---|
| AI Chat | ✅ | ✅ | ✅ |
| Quote Generation | 10/month | Unlimited | Unlimited |
| **RAG Intelligence** | ❌ | ✅ | ✅ |
| **Knowledge Base** | ❌ | 100 docs | Unlimited |
| Stripe Payments | ✅ (no escrow) | ✅ + Escrow (4%) | ✅ + Escrow (2%) |
| Custom Domain | ❌ | ✅ | ✅ |
| Webhooks | ❌ | ✅ | ✅ |
| API Access | ❌ | ❌ | ✅ |
| White-label (no branding) | ❌ | ✅ | ✅ |
| Custom AI Model | ❌ | ❌ | ✅ |
| Users | 1 | 3 | 10 |
| Support | Email | Priority | Dedicated |

Start your 14-day free trial at [thinkpinkstudio.it/tenant-onboarding](https://thinkpinkstudio.it/tenant-onboarding).

---

## Tenant Onboarding Checklist

After signing up:

1. **Create your tenant** → automatic Stripe Connect setup
2. **Complete Stripe onboarding** → verify your business for payments
3. **Configure branding** → logo, colors, company name
4. **Set pricing rates** → hourly rates, markup, VAT
5. **Create an API key** → `tpk_live_` for production
6. **Install the SDK** → `npm install @thinkpinkstudio/quote-engine-sdk`
7. **Add to your site** → See Quick Start above
8. **Generate your first quote** → the AI starts learning immediately
9. **(Optional) Upload Knowledge Base** → PDFs, service descriptions, portfolio
10. **Configure webhooks** → receive quote/payment notifications

---

## API Reference

### Core Client

```typescript
const client = createQuoteEngine(config)

// Authentication
await client.validateKey()                // Validate API key

// Chat
const session = await client.startChat(customerData?)
await client.sendMessage(content, onChunk?)
client.cancelChat()
client.getSession()
client.clearSession()

// Quote
const quote = await client.generateQuote(customerData)
const quote = await client.getQuote(quoteId)
const blob  = await client.downloadPdf(quoteId)
await client.sendQuoteEmail(quoteId, email?)

// Payment (Stripe Connect)
const { clientSecret } = await client.initPayment(quoteId, type, milestoneId?, returnUrl?)
await client.confirmPayment(quoteId, paymentIntentId)

// Events
client.addEventListener(event, handler)
// Events: 'ready' | 'error' | 'chatStarted' | 'messageSent' | 'messageReceived'
//       | 'quoteGenerated' | 'paymentComplete' | 'stepChanged' | 'ragContextReceived' | 'closed'
```

### Configuration

```typescript
interface QuoteEngineConfig {
  apiKey: string                  // Required
  tenantSlug?: string             // Auto-detected from API key
  baseUrl?: string                // Custom API URL (Enterprise)
  language?: Language             // 'it' | 'en' | 'de' | 'fr' | 'es' | 'nl' | 'pt'
  debug?: boolean                 // Console logging
  theme?: Partial<ThemeConfig>    // Visual customization
  labels?: Partial<TextLabels>    // Text overrides
  callbacks?: CallbackHandlers    // Lifecycle callbacks
  analytics?: boolean             // GDPR analytics (default: true)
  persistSession?: boolean        // Session persistence (default: true)
  storage?: StorageAdapter        // Custom storage (default: localStorage)
  timeout?: number                // Request timeout ms (default: 30000)
  maxRetries?: number             // Retry attempts (default: 3)
}
```

---

## Environment Variables

| Variable | Description | Where |
|----------|------------|-------|
| `REACT_APP_QE_API_KEY` | API key (Create React App) | `.env` |
| `NEXT_PUBLIC_QE_API_KEY` | API key (Next.js) | `.env.local` |
| `VITE_QE_API_KEY` | API key (Vite: Vue/Svelte) | `.env` |
| `PUBLIC_QE_API_KEY` | API key (Astro) | `.env` |
| `QE_API_KEY` | API key (server-side / Electron) | `.env` |

Always use domain whitelisting on production API keys.

---

## Troubleshooting

| Issue | Solution |
|---|---|
| `401 Invalid API key` | Check key prefix (`tpk_live_` vs `tpk_test_`), verify domain whitelist |
| `429 Rate limited` | SDK auto-retries with backoff. Reduce request frequency if persistent |
| No RAG data showing | RAG activates after 5+ completed quotes. Check plan (PRO+ required) |
| Streaming not working | Ensure your reverse proxy supports SSE (no buffering) |
| Payment fails | Verify Stripe Connect onboarding is complete in tenant dashboard |

---

## Support

<!-- - **Documentation**: [thinkpinkstudio.it/preventivo-sdk](https://thinkpinkstudio.it/preventivo-sdk) -->
- **Live Demo**: [thinkpinkstudio.it/preventivo-sdk](https://thinkpinkstudio.it/preventivo-sdk)
- **Email**: info@thinkpinkstudio.it
<!-- - **Discord**: [discord.gg/thinkpink](https://discord.gg/thinkpink) -->

---

## License

MIT — ThinkPink Studio