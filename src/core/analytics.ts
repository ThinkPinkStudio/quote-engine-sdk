/**
 * ThinkPink Quote Engine SDK - Analytics Module
 *
 * Tracks usage metrics for widget interactions with GDPR compliance
 */

import type { QuoteEngineConfig } from './types'

export type AnalyticsEventType =
  | 'widget_opened'
  | 'widget_closed'
  | 'chat_started'
  | 'message_sent'
  | 'message_received'
  | 'quote_generated'
  | 'quote_viewed'
  | 'quote_downloaded'
  | 'quote_emailed'
  | 'payment_started'
  | 'payment_completed'
  | 'payment_failed'
  | 'error'

export interface AnalyticsEvent {
  type: AnalyticsEventType
  timestamp: number
  sessionId?: string
  quoteId?: string
  data?: Record<string, unknown>
}

export interface AnalyticsOptions {
  /** Enable or disable analytics (default: true) */
  enabled?: boolean

  /** Custom endpoint for analytics (default: Quote Engine API) */
  endpoint?: string

  /** Batch size before sending (default: 10) */
  batchSize?: number

  /** Max time before flushing batch in ms (default: 30000) */
  flushInterval?: number

  /** Include device/browser info (default: true) */
  includeDeviceInfo?: boolean

  /** Custom user ID for tracking */
  userId?: string

  /** API key for authentication */
  apiKey: string
}

/**
 * Analytics Manager
 *
 * Handles event tracking with batching, GDPR compliance, and automatic flushing.
 *
 * @example
 * ```typescript
 * const analytics = createAnalytics({
 *   apiKey: 'your-api-key',
 *   enabled: true, // Can be set to false for GDPR opt-out
 * })
 *
 * // Track events
 * analytics.track('widget_opened')
 * analytics.track('message_sent', { messageLength: 150 })
 *
 * // Opt out (GDPR)
 * analytics.setEnabled(false)
 *
 * // Check consent status
 * if (analytics.isEnabled()) { ... }
 *
 * // Flush pending events
 * await analytics.flush()
 *
 * // Clean up
 * analytics.destroy()
 * ```
 */
export class Analytics {
  private enabled: boolean
  private endpoint: string
  private batchSize: number
  private flushInterval: number
  private includeDeviceInfo: boolean
  private userId?: string
  private apiKey: string

  private eventQueue: AnalyticsEvent[] = []
  private flushTimer: ReturnType<typeof setTimeout> | null = null
  private sessionId: string

  constructor(options: AnalyticsOptions) {
    this.enabled = options.enabled ?? true
    this.endpoint = options.endpoint || 'https://www.thinkpinkstudio.it/api/qe-sdk/analytics'
    this.batchSize = options.batchSize || 10
    this.flushInterval = options.flushInterval || 30000
    this.includeDeviceInfo = options.includeDeviceInfo ?? true
    this.userId = options.userId
    this.apiKey = options.apiKey

    this.sessionId = this.generateSessionId()

    // Start flush timer
    this.startFlushTimer()
  }

  /**
   * Track an analytics event
   */
  track(type: AnalyticsEventType, data?: Record<string, unknown>): void {
    if (!this.enabled) return

    const event: AnalyticsEvent = {
      type,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      data,
    }

    this.eventQueue.push(event)

    // Flush if batch size reached
    if (this.eventQueue.length >= this.batchSize) {
      this.flush()
    }
  }

  /**
   * Track an event with quote context
   */
  trackQuote(type: AnalyticsEventType, quoteId: string, data?: Record<string, unknown>): void {
    this.track(type, { ...data, quoteId })
  }

  /**
   * Enable or disable analytics (GDPR opt-out)
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled

    if (!enabled) {
      // Clear pending events when disabled
      this.eventQueue = []
    }
  }

  /**
   * Check if analytics is enabled
   */
  isEnabled(): boolean {
    return this.enabled
  }

  /**
   * Set custom user ID for tracking
   */
  setUserId(userId: string): void {
    this.userId = userId
  }

  /**
   * Flush pending events to the server
   */
  async flush(): Promise<void> {
    if (!this.enabled || this.eventQueue.length === 0) return

    const events = [...this.eventQueue]
    this.eventQueue = []

    try {
      const payload = {
        events,
        sessionId: this.sessionId,
        userId: this.userId,
        deviceInfo: this.includeDeviceInfo ? this.getDeviceInfo() : undefined,
        timestamp: Date.now(),
      }

      // Use sendBeacon for reliability, fallback to fetch
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
        const sent = navigator.sendBeacon(this.endpoint, blob)

        if (!sent) {
          // Fallback to fetch
          await this.sendWithFetch(payload)
        }
      } else {
        await this.sendWithFetch(payload)
      }
    } catch (error) {
      // Re-queue events on failure (limit to avoid memory issues)
      if (this.eventQueue.length < 100) {
        this.eventQueue = [...events, ...this.eventQueue]
      }
      console.warn('[QuoteEngine Analytics] Failed to flush events:', error)
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
      this.flushTimer = null
    }

    // Attempt to flush remaining events
    this.flush()
  }

  // Private methods

  private async sendWithFetch(payload: unknown): Promise<void> {
    await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      },
      body: JSON.stringify(payload),
      keepalive: true,
    })
  }

  private startFlushTimer(): void {
    if (typeof setInterval === 'undefined') return

    this.flushTimer = setInterval(() => {
      this.flush()
    }, this.flushInterval)
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
  }

  private getDeviceInfo(): Record<string, unknown> {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return {}
    }

    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenWidth: window.screen?.width,
      screenHeight: window.screen?.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      referrer: document.referrer || undefined,
      url: window.location.href,
    }
  }
}

/**
 * Create an analytics instance
 */
export function createAnalytics(options: AnalyticsOptions): Analytics {
  return new Analytics(options)
}

/**
 * Create analytics from SDK config
 */
export function createAnalyticsFromConfig(config: QuoteEngineConfig): Analytics | null {
  // If analytics is explicitly disabled, return null
  if (config.analytics === false) {
    return null
  }

  return new Analytics({
    apiKey: config.apiKey,
    enabled: true,
  })
}
