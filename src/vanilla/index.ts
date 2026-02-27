/**
 * ThinkPink Quote Engine SDK - Vanilla JavaScript Integration
 *
 * Pure JavaScript/TypeScript implementation with no framework dependencies
 *
 * @packageDocumentation
 */

import {
  QuoteEngineClient,
  createQuoteEngine,
  type QuoteEngineConfig,
  type ChatMessage,
  type QuoteEngineError,
  type CustomerData,
  type WidgetState,
  type WidgetOptions,
  type ThemeConfig,
  type TextLabels,
  type ClassNameOverrides,
  generateThemeCss,
} from '../core'

// Re-export core
export * from '../core'

/**
 * Quote Engine Widget for Vanilla JavaScript
 *
 * A self-contained widget that can be embedded in any HTML page.
 *
 * @example
 * ```html
 * <script src="https://cdn.thinkpinkstudio.it/quote-engine.min.js"></script>
 * <script>
 *   const widget = QuoteEngine.createWidget({
 *     apiKey: 'your-api-key',
 *     containerId: 'quote-widget',
 *     theme: {
 *       primaryColor: '#e91e63'
 *     }
 *   })
 *
 *   widget.open()
 * </script>
 * <div id="quote-widget"></div>
 * ```
 */
export class QuoteEngineWidget {
  private client: QuoteEngineClient
  private config: QuoteEngineConfig
  private options: WidgetOptions
  private labels: TextLabels
  private cls: ClassNameOverrides
  private container: HTMLElement | null = null
  private state: WidgetState
  private elements: {
    root?: HTMLElement
    chatContainer?: HTMLElement
    messagesContainer?: HTMLElement
    inputContainer?: HTMLElement
    input?: HTMLInputElement
    sendButton?: HTMLButtonElement
  } = {}

  constructor(config: QuoteEngineConfig, options: WidgetOptions = {}) {
    this.client = createQuoteEngine(config)
    this.config = config
    this.options = {
      mode: 'inline',
      position: 'bottom-right',
      showCloseButton: true,
      autoOpen: false,
      ...options,
    }
    this.labels = {
      headerTitle: 'Get a Quote',
      inputPlaceholder: 'Describe your project...',
      sendButtonLabel: 'Send',
      generateQuoteLabel: 'Generate Quote',
      typingIndicator: 'Typing...',
      closeButtonLabel: 'Close',
      ...config.labels,
      ...options.labels,
    }
    this.cls = options.classNames || {}
    this.state = {
      currentStep: options.initialStep || 'chat',
      isOpen: false,
      isLoading: false,
      chatSession: null,
      quote: null,
      error: null,
      customerData: options.customerData || {},
    }

    if (options.containerId) {
      this.mount(options.containerId)
    }

    if (options.autoOpen) {
      this.open()
    }
  }

  /**
   * Mount the widget to a container element
   */
  mount(containerId: string): void {
    this.container = document.getElementById(containerId)
    if (!this.container) {
      console.error(`[QuoteEngine] Container element #${containerId} not found`)
      return
    }

    this.render()
  }

  /**
   * Open the widget
   */
  open(): void {
    this.state.isOpen = true
    this.updateVisibility()

    if (!this.state.chatSession) {
      this.startChat()
    }
  }

  /**
   * Close the widget
   */
  close(): void {
    this.state.isOpen = false
    this.updateVisibility()
    this.client.notifyClose()
  }

  /**
   * Toggle the widget
   */
  toggle(): void {
    if (this.state.isOpen) {
      this.close()
    } else {
      this.open()
    }
  }

  /**
   * Reset the widget
   */
  reset(): void {
    this.client.clearSession()
    this.state = {
      currentStep: 'chat',
      isOpen: this.state.isOpen,
      isLoading: false,
      chatSession: null,
      quote: null,
      error: null,
      customerData: this.options.customerData || {},
    }
    this.renderMessages()
  }

  /**
   * Destroy the widget
   */
  destroy(): void {
    if (this.elements.root) {
      this.elements.root.remove()
    }
    this.client.clearSession()
  }

  /**
   * Get current state
   */
  getState(): WidgetState {
    return { ...this.state }
  }

  /**
   * Get the client instance
   */
  getClient(): QuoteEngineClient {
    return this.client
  }

  // Private methods
  private async startChat(): Promise<void> {
    try {
      this.state.chatSession = await this.client.startChat(this.state.customerData)
      this.renderMessages()
    } catch (error) {
      this.handleError(error as QuoteEngineError)
    }
  }

  private async sendMessage(content: string): Promise<void> {
    if (!content.trim() || this.state.isLoading) return

    this.state.isLoading = true
    this.updateLoadingState()

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    }

    if (this.state.chatSession) {
      this.state.chatSession.messages.push(userMessage)
    }
    this.renderMessages()

    // Clear input
    if (this.elements.input) {
      this.elements.input.value = ''
    }

    // Create placeholder for streaming
    const streamingId = `assistant-${Date.now()}`
    let streamingContent = ''

    try {
      await this.client.sendMessage(content, (chunk) => {
        streamingContent += chunk
        this.updateStreamingMessage(streamingId, streamingContent)
      })

      this.state.chatSession = this.client.getSession()
      this.renderMessages()

      // Announce new message to screen readers
      const lastMessage = this.state.chatSession?.messages.at(-1)
      if (lastMessage && lastMessage.role === 'assistant') {
        this.announce(`Response: ${lastMessage.content.substring(0, 100)}${lastMessage.content.length > 100 ? '...' : ''}`)
      }

      // Check if should generate quote
      if (lastMessage?.metadata?.shouldGenerateQuote) {
        this.showGenerateQuoteButton()
        this.announce('Quote suggestion available. A button to generate your quote has appeared.')
      }
    } catch (error) {
      this.handleError(error as QuoteEngineError)
    } finally {
      this.state.isLoading = false
      this.updateLoadingState()

      // Refocus input after sending
      if (this.elements.input) {
        this.elements.input.focus()
      }
    }
  }

  private render(): void {
    if (!this.container) return

    // Inject theme CSS
    if (this.config.theme) {
      this.injectThemeCss(this.config.theme)
    }

    // Create root element
    this.elements.root = document.createElement('div')
    this.elements.root.className = 'qe-widget'
    this.elements.root.innerHTML = this.getWidgetHtml()

    this.container.appendChild(this.elements.root)

    // Cache element references
    this.elements.chatContainer = this.elements.root.querySelector('.qe-chat') as HTMLElement
    this.elements.messagesContainer = this.elements.root.querySelector('.qe-messages') as HTMLElement
    this.elements.inputContainer = this.elements.root.querySelector('.qe-input-container') as HTMLElement
    this.elements.input = this.elements.root.querySelector('.qe-input') as HTMLInputElement
    this.elements.sendButton = this.elements.root.querySelector('.qe-send-btn') as HTMLButtonElement

    // Attach event listeners
    this.attachEventListeners()

    // Initial visibility
    this.updateVisibility()
  }

  private c(base: string, override?: string): string {
    return override || base
  }

  private getWidgetHtml(): string {
    const cl = this.cls
    return `
      <div class="${this.c('qe-container', cl.container)} ${this.options.mode === 'modal' ? 'qe-modal' : ''}" role="dialog" aria-modal="${this.options.mode === 'modal'}" aria-labelledby="qe-title">
        ${this.options.mode === 'modal' ? `<div class="${this.c('qe-overlay', cl.overlay)}" aria-hidden="true"></div>` : ''}
        <div class="qe-content">
          <div class="${this.c('qe-header', cl.header)}">
            ${this.config.theme?.logo ? `<img src="${this.config.theme.logo}" class="${this.c('qe-logo', cl.logo)}" alt="Logo">` : ''}
            <span id="qe-title" class="${this.c('qe-title', cl.title)}">${this.escapeHtml(this.labels.headerTitle || 'Get a Quote')}</span>
            ${this.options.showCloseButton ? `<button class="${this.c('qe-close-btn', cl.closeButton)}" aria-label="${this.escapeHtml(this.labels.closeButtonLabel || 'Close')}">&times;</button>` : ''}
          </div>
          <div class="${this.c('qe-chat', cl.chat)}">
            <div class="${this.c('qe-messages', cl.messages)}" role="log" aria-live="polite" aria-atomic="false" aria-relevant="additions" aria-busy="false"></div>
            <div class="${this.c('qe-input-container', cl.inputContainer)}">
              <label for="qe-chat-input" class="qe-sr-only">${this.escapeHtml(this.labels.inputPlaceholder || 'Describe your project...')}</label>
              <input type="text" id="qe-chat-input" class="${this.c('qe-input', cl.input)}" placeholder="${this.escapeHtml(this.labels.inputPlaceholder || 'Describe your project...')}" aria-describedby="qe-input-hint">
              <span id="qe-input-hint" class="qe-sr-only">Press Enter to send your message</span>
              <button class="${this.c('qe-send-btn', cl.sendButton)}" aria-label="${this.escapeHtml(this.labels.sendButtonLabel || 'Send')}" type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="${this.c('qe-quote-preview', cl.quotePreview)}" style="display: none;" aria-hidden="true"></div>
          <div class="${this.c('qe-payment', cl.payment)}" style="display: none;" aria-hidden="true"></div>
        </div>
        <!-- Screen reader announcements -->
        <div class="qe-sr-only qe-announcer" role="status" aria-live="polite" aria-atomic="true"></div>
      </div>
      ${this.getStyles()}
    `
  }

  private getStyles(): string {
    return `
      <style>
        .qe-widget {
          /* ── Color Defaults ────────────────────────────────────────── */
          --qe-primary-color: #e91e63;
          --qe-primary-color-hover: #c2185b;
          --qe-primary-color-light: #fce4ec;
          --qe-secondary-color: #9c27b0;
          --qe-accent-color: #e91e63;
          --qe-background-color: #ffffff;
          --qe-surface-color: #f5f5f5;
          --qe-text-color: #1a1a1a;
          --qe-text-color-muted: #666666;
          --qe-text-color-inverse: #ffffff;
          --qe-border-color: #eeeeee;
          --qe-error-color: #d32f2f;
          --qe-success-color: #388e3c;
          --qe-warning-color: #f57c00;

          /* ── Bubble Defaults ───────────────────────────────────────── */
          --qe-user-bubble-color: var(--qe-primary-color);
          --qe-user-bubble-text-color: var(--qe-text-color-inverse);
          --qe-assistant-bubble-color: var(--qe-surface-color);
          --qe-assistant-bubble-text-color: var(--qe-text-color);
          --qe-user-bubble-border-radius: 16px 16px 4px 16px;
          --qe-assistant-bubble-border-radius: 16px 16px 16px 4px;
          --qe-bubble-max-width: 80%;

          /* ── Typography Defaults ───────────────────────────────────── */
          --qe-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          --qe-heading-font: var(--qe-font-family);
          --qe-font-size: 14px;
          --qe-font-size-small: 12px;
          --qe-font-size-large: 16px;
          --qe-font-size-heading: 18px;
          --qe-font-weight: 400;
          --qe-font-weight-bold: 600;
          --qe-line-height: 1.4;
          --qe-letter-spacing: normal;

          /* ── Spacing & Layout Defaults ─────────────────────────────── */
          --qe-border-radius: 12px;
          --qe-button-border-radius: 50%;
          --qe-input-border-radius: 24px;
          --qe-container-padding: 16px;
          --qe-message-gap: 12px;
          --qe-widget-height: 500px;
          --qe-widget-max-height: 80vh;
          --qe-widget-width: 100%;

          /* ── Shadows & Effects Defaults ─────────────────────────────── */
          --qe-box-shadow: 0 4px 24px rgba(0,0,0,0.1);
          --qe-box-shadow-elevated: 0 8px 32px rgba(0,0,0,0.15);
          --qe-overlay-color: rgba(0,0,0,0.5);
          --qe-transition-duration: 0.2s;
          --qe-transition-easing: ease;

          /* ── Button Defaults ───────────────────────────────────────── */
          --qe-send-button-size: 44px;
          --qe-button-padding: 12px 24px;
          --qe-button-font-size: 16px;
          --qe-disabled-opacity: 0.5;

          /* ── Input Defaults ────────────────────────────────────────── */
          --qe-input-background-color: var(--qe-background-color);
          --qe-input-border-color: #dddddd;
          --qe-input-focus-border-color: var(--qe-primary-color);
          --qe-input-padding: 12px 16px;
          --qe-input-font-size: var(--qe-font-size);

          /* ── Header Defaults ───────────────────────────────────────── */
          --qe-header-background-color: transparent;
          --qe-header-text-color: var(--qe-text-color);
          --qe-header-padding: 16px;
          --qe-header-border-bottom: 1px solid var(--qe-border-color);
          --qe-logo-height: 32px;

          /* ── Loading Defaults ──────────────────────────────────────── */
          --qe-loading-color: var(--qe-text-color-muted);
          --qe-loading-dot-size: 8px;
          --qe-loading-animation-duration: 1.4s;

          font-family: var(--qe-font-family);
          font-size: var(--qe-font-size);
          font-weight: var(--qe-font-weight);
          line-height: var(--qe-line-height);
          letter-spacing: var(--qe-letter-spacing);
        }

        .qe-container {
          background: var(--qe-background-color);
          border-radius: var(--qe-border-radius);
          box-shadow: var(--qe-box-shadow);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: var(--qe-widget-height);
          max-height: var(--qe-widget-max-height);
          width: var(--qe-widget-width);
        }

        .qe-modal {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qe-modal .qe-overlay {
          position: absolute;
          inset: 0;
          background: var(--qe-overlay-color);
        }

        .qe-modal .qe-content {
          position: relative;
          width: 90%;
          max-width: 500px;
          height: 600px;
          max-height: 90vh;
          background: var(--qe-background-color);
          border-radius: var(--qe-border-radius);
          box-shadow: var(--qe-box-shadow-elevated);
          display: flex;
          flex-direction: column;
        }

        .qe-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: var(--qe-header-padding);
          background: var(--qe-header-background-color);
          border-bottom: var(--qe-header-border-bottom);
        }

        .qe-logo {
          height: var(--qe-logo-height);
          width: auto;
        }

        .qe-title {
          font-family: var(--qe-heading-font);
          font-size: var(--qe-font-size-heading);
          font-weight: var(--qe-font-weight-bold);
          color: var(--qe-header-text-color);
          flex: 1;
        }

        .qe-close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: var(--qe-text-color-muted);
          padding: 4px 8px;
          transition: color var(--qe-transition-duration) var(--qe-transition-easing);
        }

        .qe-close-btn:hover {
          color: var(--qe-text-color);
        }

        .qe-chat {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .qe-messages {
          flex: 1;
          overflow-y: auto;
          padding: var(--qe-container-padding);
          display: flex;
          flex-direction: column;
          gap: var(--qe-message-gap);
        }

        .qe-message {
          max-width: var(--qe-bubble-max-width);
          padding: 12px 16px;
          line-height: var(--qe-line-height);
          font-size: var(--qe-font-size);
        }

        .qe-message-user {
          align-self: flex-end;
          background: var(--qe-user-bubble-color);
          color: var(--qe-user-bubble-text-color);
          border-radius: var(--qe-user-bubble-border-radius);
        }

        .qe-message-assistant {
          align-self: flex-start;
          background: var(--qe-assistant-bubble-color);
          color: var(--qe-assistant-bubble-text-color);
          border-radius: var(--qe-assistant-bubble-border-radius);
        }

        .qe-message-streaming {
          opacity: 0.8;
        }

        .qe-input-container {
          display: flex;
          gap: 8px;
          padding: var(--qe-container-padding);
          border-top: 1px solid var(--qe-border-color);
        }

        .qe-input {
          flex: 1;
          padding: var(--qe-input-padding);
          background: var(--qe-input-background-color);
          border: 1px solid var(--qe-input-border-color);
          border-radius: var(--qe-input-border-radius);
          font-family: var(--qe-font-family);
          font-size: var(--qe-input-font-size);
          color: var(--qe-text-color);
          outline: none;
          transition: border-color var(--qe-transition-duration) var(--qe-transition-easing);
        }

        .qe-input:focus {
          border-color: var(--qe-input-focus-border-color);
        }

        .qe-input::placeholder {
          color: var(--qe-text-color-muted);
        }

        .qe-send-btn {
          width: var(--qe-send-button-size);
          height: var(--qe-send-button-size);
          border: none;
          border-radius: var(--qe-button-border-radius);
          background: var(--qe-primary-color);
          color: var(--qe-text-color-inverse);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background-color var(--qe-transition-duration) var(--qe-transition-easing);
        }

        .qe-send-btn:hover {
          background: var(--qe-primary-color-hover);
        }

        .qe-send-btn:disabled {
          opacity: var(--qe-disabled-opacity);
          cursor: not-allowed;
        }

        .qe-loading {
          display: flex;
          gap: 4px;
          padding: 12px 16px;
          align-self: flex-start;
        }

        .qe-loading span {
          width: var(--qe-loading-dot-size);
          height: var(--qe-loading-dot-size);
          background: var(--qe-loading-color);
          border-radius: 50%;
          animation: qe-bounce var(--qe-loading-animation-duration) ease-in-out infinite;
        }

        .qe-loading span:nth-child(1) { animation-delay: 0s; }
        .qe-loading span:nth-child(2) { animation-delay: 0.2s; }
        .qe-loading span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes qe-bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        .qe-generate-btn {
          margin: var(--qe-container-padding);
          padding: var(--qe-button-padding);
          background: var(--qe-primary-color);
          color: var(--qe-text-color-inverse);
          border: none;
          border-radius: calc(var(--qe-border-radius) - 4px);
          font-family: var(--qe-font-family);
          font-size: var(--qe-button-font-size);
          font-weight: var(--qe-font-weight-bold);
          cursor: pointer;
          transition: background-color var(--qe-transition-duration) var(--qe-transition-easing);
        }

        .qe-generate-btn:hover {
          background: var(--qe-primary-color-hover);
        }

        .qe-hidden {
          display: none !important;
        }

        /* Screen reader only - visually hidden but accessible */
        .qe-sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* Focus visible for keyboard navigation */
        .qe-widget *:focus-visible {
          outline: 2px solid var(--qe-primary-color);
          outline-offset: 2px;
        }

        /* Skip to content link (a11y) */
        .qe-skip-link {
          position: absolute;
          top: -40px;
          left: 0;
          background: var(--qe-primary-color);
          color: var(--qe-text-color-inverse);
          padding: 8px 16px;
          z-index: 100;
          transition: top 0.2s;
        }

        .qe-skip-link:focus {
          top: 0;
        }
      </style>
    `
  }

  private injectThemeCss(theme: ThemeConfig): void {
    const styleId = 'qe-theme-css'
    let styleEl = document.getElementById(styleId) as HTMLStyleElement

    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = styleId
      document.head.appendChild(styleEl)
    }

    styleEl.textContent = generateThemeCss(theme)
  }

  private attachEventListeners(): void {
    // Send button
    this.elements.sendButton?.addEventListener('click', () => {
      if (this.elements.input) {
        this.sendMessage(this.elements.input.value)
      }
    })

    // Enter key
    this.elements.input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        this.sendMessage(this.elements.input!.value)
      }
    })

    // Close button
    const closeBtn = this.elements.root?.querySelector('.qe-close-btn')
    closeBtn?.addEventListener('click', () => this.close())

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.state.isOpen && this.options.mode === 'modal') {
        e.preventDefault()
        this.close()
      }
    })

    // Trap focus in modal
    this.elements.root?.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && this.options.mode === 'modal' && this.state.isOpen) {
        this.trapFocus(e)
      }
    })

    // Overlay click (modal mode)
    const overlay = this.elements.root?.querySelector('.qe-overlay')
    overlay?.addEventListener('click', () => this.close())
  }

  private renderMessages(): void {
    if (!this.elements.messagesContainer) return

    const messages = this.state.chatSession?.messages || []
    const cl = this.cls
    this.elements.messagesContainer.innerHTML = messages
      .map(
        (msg) => {
          const roleClass = msg.role === 'user'
            ? this.c('qe-message-user', cl.messageUser)
            : this.c('qe-message-assistant', cl.messageAssistant)
          return `
          <div class="${this.c('qe-message', cl.message)} ${roleClass}">
            ${this.escapeHtml(msg.content)}
          </div>
        `}
      )
      .join('')

    // Scroll to bottom
    this.elements.messagesContainer.scrollTop =
      this.elements.messagesContainer.scrollHeight
  }

  private updateStreamingMessage(id: string, content: string): void {
    if (!this.elements.messagesContainer) return

    let streamingEl = this.elements.messagesContainer.querySelector(
      `[data-streaming-id="${id}"]`
    ) as HTMLElement

    if (!streamingEl) {
      streamingEl = document.createElement('div')
      streamingEl.className = `${this.c('qe-message', this.cls.message)} ${this.c('qe-message-assistant', this.cls.messageAssistant)} ${this.c('qe-message-streaming', this.cls.messageStreaming)}`
      streamingEl.setAttribute('data-streaming-id', id)
      this.elements.messagesContainer.appendChild(streamingEl)
    }

    streamingEl.textContent = content

    // Scroll to bottom
    this.elements.messagesContainer.scrollTop =
      this.elements.messagesContainer.scrollHeight
  }

  private updateLoadingState(): void {
    if (this.elements.sendButton) {
      this.elements.sendButton.disabled = this.state.isLoading
    }

    // Update aria-busy on messages container
    if (this.elements.messagesContainer) {
      this.elements.messagesContainer.setAttribute(
        'aria-busy',
        this.state.isLoading ? 'true' : 'false'
      )
    }

    // Announce loading state to screen readers
    if (this.state.isLoading) {
      this.announce(this.labels.typingIndicator || 'Typing...')
    }
  }

  private updateVisibility(): void {
    if (!this.elements.root) return

    if (this.options.mode === 'modal') {
      this.elements.root.classList.toggle('qe-hidden', !this.state.isOpen)

      // Focus input when opening
      if (this.state.isOpen && this.elements.input) {
        setTimeout(() => this.elements.input?.focus(), 100)
      }
    }
  }

  /**
   * Trap focus within the modal
   */
  private trapFocus(e: KeyboardEvent): void {
    const focusableElements = this.elements.root?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (!focusableElements || focusableElements.length === 0) return

    const firstFocusable = focusableElements[0] as HTMLElement
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement

    if (e.shiftKey && document.activeElement === firstFocusable) {
      e.preventDefault()
      lastFocusable.focus()
    } else if (!e.shiftKey && document.activeElement === lastFocusable) {
      e.preventDefault()
      firstFocusable.focus()
    }
  }

  /**
   * Announce a message to screen readers
   */
  private announce(message: string): void {
    const announcer = this.elements.root?.querySelector('.qe-announcer')
    if (announcer) {
      announcer.textContent = message
      // Clear after a short delay to allow re-announcing the same message
      setTimeout(() => {
        announcer.textContent = ''
      }, 1000)
    }
  }

  private showGenerateQuoteButton(): void {
    if (!this.elements.messagesContainer) return

    const existingBtn = this.elements.messagesContainer.querySelector('.qe-generate-btn')
    if (existingBtn) return

    const btn = document.createElement('button')
    btn.className = this.c('qe-generate-btn', this.cls.generateButton)
    btn.textContent = this.labels.generateQuoteLabel || 'Generate Quote'
    btn.addEventListener('click', () => this.generateQuote())

    this.elements.messagesContainer.appendChild(btn)
  }

  private async generateQuote(): Promise<void> {
    this.state.isLoading = true
    this.updateLoadingState()

    try {
      const quote = await this.client.generateQuote(
        this.state.customerData as CustomerData
      )
      this.state.quote = quote
      this.state.currentStep = 'preview'
      this.renderQuotePreview()
    } catch (error) {
      this.handleError(error as QuoteEngineError)
    } finally {
      this.state.isLoading = false
      this.updateLoadingState()
    }
  }

  private renderQuotePreview(): void {
    // Implementation for quote preview UI
    if (!this.state.quote || !this.elements.root) return

    const previewEl = this.elements.root.querySelector('.qe-quote-preview') as HTMLElement
    const chatEl = this.elements.root.querySelector('.qe-chat') as HTMLElement

    if (previewEl && chatEl) {
      chatEl.style.display = 'none'
      previewEl.style.display = 'block'
      previewEl.innerHTML = `
        <div style="padding: 20px;">
          <h2>Quote ${this.state.quote.quoteNumber}</h2>
          <p>Total: €${this.state.quote.pricing.total.toFixed(2)}</p>
          <p>Deposit: €${this.state.quote.pricing.deposit.amount.toFixed(2)}</p>
        </div>
      `
    }
  }

  private handleError(error: QuoteEngineError): void {
    this.state.error = error
    console.error('[QuoteEngine]', error.message)
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }
}

/**
 * Create a Quote Engine widget instance
 *
 * @example
 * ```javascript
 * const widget = QuoteEngine.createWidget({
 *   apiKey: 'your-api-key',
 *   containerId: 'quote-container',
 *   theme: {
 *     primaryColor: '#e91e63'
 *   }
 * })
 *
 * // Open widget
 * document.getElementById('get-quote-btn').onclick = () => widget.open()
 * ```
 */
export function createWidget(
  config: QuoteEngineConfig & WidgetOptions
): QuoteEngineWidget {
  const { containerId, mode, position, autoOpen, showCloseButton, initialStep, customerData, skipChat, labels, classNames, ...sdkConfig } = config

  return new QuoteEngineWidget(sdkConfig, {
    containerId,
    mode,
    position,
    autoOpen,
    showCloseButton,
    initialStep,
    customerData,
    skipChat,
    labels,
    classNames,
  })
}

/**
 * Initialize Quote Engine globally
 *
 * For use in traditional script tag setups
 *
 * @example
 * ```html
 * <script src="quote-engine.min.js"></script>
 * <script>
 *   QuoteEngine.init({
 *     apiKey: 'your-api-key',
 *     containerId: 'quote-widget'
 *   })
 * </script>
 * ```
 */
export function init(config: QuoteEngineConfig & WidgetOptions): QuoteEngineWidget {
  return createWidget(config)
}

// Default export for IIFE bundle
export default {
  createWidget,
  createQuoteEngine,
  init,
  QuoteEngineClient,
  QuoteEngineWidget,
}
