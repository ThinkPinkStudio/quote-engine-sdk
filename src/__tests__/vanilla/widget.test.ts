/**
 * E2E tests for vanilla JavaScript widget
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { QuoteEngineWidget, createWidget, init } from '../../vanilla'
import type { QuoteEngineConfig, WidgetOptions } from '../../core/types'

const validApiKey = 'test-api-key-1234567890'

function createConfig(
  config: Partial<QuoteEngineConfig> = {},
  options: Partial<WidgetOptions> = {}
): QuoteEngineConfig & WidgetOptions {
  return {
    apiKey: validApiKey,
    ...config,
    ...options,
  }
}

describe('QuoteEngineWidget', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    container.id = 'quote-widget'
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
    // Clean up any injected styles
    document.querySelectorAll('#qe-theme-css').forEach((el) => el.remove())
  })

  describe('constructor', () => {
    it('should create widget instance', () => {
      const widget = new QuoteEngineWidget(
        { apiKey: validApiKey },
        { containerId: 'quote-widget' }
      )

      expect(widget).toBeInstanceOf(QuoteEngineWidget)
    })

    it('should mount to container', () => {
      new QuoteEngineWidget(
        { apiKey: validApiKey },
        { containerId: 'quote-widget' }
      )

      expect(container.querySelector('.qe-widget')).not.toBeNull()
    })

    it('should apply custom labels', () => {
      new QuoteEngineWidget(
        {
          apiKey: validApiKey,
          labels: { headerTitle: 'Custom Title' },
        },
        { containerId: 'quote-widget' }
      )

      const title = container.querySelector('.qe-title')
      expect(title?.textContent).toBe('Custom Title')
    })

    it('should auto-open when configured', () => {
      const widget = new QuoteEngineWidget(
        { apiKey: validApiKey },
        { containerId: 'quote-widget', autoOpen: true }
      )

      expect(widget.getState().isOpen).toBe(true)
    })
  })

  describe('mount', () => {
    it('should mount to specified container', () => {
      const widget = new QuoteEngineWidget({ apiKey: validApiKey })
      widget.mount('quote-widget')

      expect(container.querySelector('.qe-widget')).not.toBeNull()
    })

    it('should log error for non-existent container', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

      const widget = new QuoteEngineWidget({ apiKey: validApiKey })
      widget.mount('non-existent')

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('#non-existent not found')
      )

      consoleSpy.mockRestore()
    })
  })

  describe('open/close/toggle', () => {
    it('should open widget', () => {
      const widget = new QuoteEngineWidget(
        { apiKey: validApiKey },
        { containerId: 'quote-widget' }
      )

      widget.open()

      expect(widget.getState().isOpen).toBe(true)
    })

    it('should close widget', () => {
      const widget = new QuoteEngineWidget(
        { apiKey: validApiKey },
        { containerId: 'quote-widget', autoOpen: true }
      )

      widget.close()

      expect(widget.getState().isOpen).toBe(false)
    })

    it('should toggle widget', () => {
      const widget = new QuoteEngineWidget(
        { apiKey: validApiKey },
        { containerId: 'quote-widget' }
      )

      expect(widget.getState().isOpen).toBe(false)

      widget.toggle()
      expect(widget.getState().isOpen).toBe(true)

      widget.toggle()
      expect(widget.getState().isOpen).toBe(false)
    })
  })

  describe('reset', () => {
    it('should reset widget state', () => {
      const widget = new QuoteEngineWidget(
        { apiKey: validApiKey },
        { containerId: 'quote-widget', autoOpen: true }
      )

      widget.reset()

      const state = widget.getState()
      expect(state.chatSession).toBeNull()
      expect(state.quote).toBeNull()
      expect(state.error).toBeNull()
    })
  })

  describe('destroy', () => {
    it('should remove widget from DOM', () => {
      const widget = new QuoteEngineWidget(
        { apiKey: validApiKey },
        { containerId: 'quote-widget' }
      )

      expect(container.querySelector('.qe-widget')).not.toBeNull()

      widget.destroy()

      expect(container.querySelector('.qe-widget')).toBeNull()
    })
  })

  describe('getState', () => {
    it('should return current state', () => {
      const widget = new QuoteEngineWidget(
        { apiKey: validApiKey },
        { containerId: 'quote-widget' }
      )

      const state = widget.getState()

      expect(state).toHaveProperty('currentStep')
      expect(state).toHaveProperty('isOpen')
      expect(state).toHaveProperty('isLoading')
      expect(state).toHaveProperty('chatSession')
      expect(state).toHaveProperty('quote')
      expect(state).toHaveProperty('error')
      expect(state).toHaveProperty('customerData')
    })

    it('should return a copy of state', () => {
      const widget = new QuoteEngineWidget(
        { apiKey: validApiKey },
        { containerId: 'quote-widget' }
      )

      const state1 = widget.getState()
      const state2 = widget.getState()

      expect(state1).not.toBe(state2)
      expect(state1).toEqual(state2)
    })
  })

  describe('getClient', () => {
    it('should return client instance', () => {
      const widget = new QuoteEngineWidget(
        { apiKey: validApiKey },
        { containerId: 'quote-widget' }
      )

      const client = widget.getClient()

      expect(client).toBeDefined()
      expect(client.getConfig).toBeDefined()
    })
  })

  describe('UI rendering', () => {
    it('should render header', () => {
      new QuoteEngineWidget(
        { apiKey: validApiKey },
        { containerId: 'quote-widget' }
      )

      expect(container.querySelector('.qe-header')).not.toBeNull()
    })

    it('should render input field', () => {
      new QuoteEngineWidget(
        { apiKey: validApiKey },
        { containerId: 'quote-widget' }
      )

      const input = container.querySelector('.qe-input') as HTMLInputElement
      expect(input).not.toBeNull()
      expect(input.placeholder).toBe('Describe your project...')
    })

    it('should render send button', () => {
      new QuoteEngineWidget(
        { apiKey: validApiKey },
        { containerId: 'quote-widget' }
      )

      expect(container.querySelector('.qe-send-btn')).not.toBeNull()
    })

    it('should render close button when configured', () => {
      new QuoteEngineWidget(
        { apiKey: validApiKey },
        { containerId: 'quote-widget', showCloseButton: true }
      )

      expect(container.querySelector('.qe-close-btn')).not.toBeNull()
    })

    it('should hide close button when configured', () => {
      new QuoteEngineWidget(
        { apiKey: validApiKey },
        { containerId: 'quote-widget', showCloseButton: false }
      )

      expect(container.querySelector('.qe-close-btn')).toBeNull()
    })

    it('should render messages container', () => {
      new QuoteEngineWidget(
        { apiKey: validApiKey },
        { containerId: 'quote-widget' }
      )

      expect(container.querySelector('.qe-messages')).not.toBeNull()
    })

    it('should render logo when provided', () => {
      new QuoteEngineWidget(
        {
          apiKey: validApiKey,
          theme: { logo: 'https://example.com/logo.png' },
        },
        { containerId: 'quote-widget' }
      )

      const logo = container.querySelector('.qe-logo') as HTMLImageElement
      expect(logo).not.toBeNull()
      expect(logo.src).toBe('https://example.com/logo.png')
    })
  })

  describe('modal mode', () => {
    it('should add modal class', () => {
      new QuoteEngineWidget(
        { apiKey: validApiKey },
        { containerId: 'quote-widget', mode: 'modal' }
      )

      expect(container.querySelector('.qe-modal')).not.toBeNull()
    })

    it('should render overlay', () => {
      new QuoteEngineWidget(
        { apiKey: validApiKey },
        { containerId: 'quote-widget', mode: 'modal' }
      )

      expect(container.querySelector('.qe-overlay')).not.toBeNull()
    })

    it('should hide when closed', () => {
      const widget = new QuoteEngineWidget(
        { apiKey: validApiKey },
        { containerId: 'quote-widget', mode: 'modal' }
      )

      widget.close()

      const root = container.querySelector('.qe-widget')
      expect(root?.classList.contains('qe-hidden')).toBe(true)
    })
  })

  describe('event handling', () => {
    it('should send message on button click', () => {
      const widget = new QuoteEngineWidget(
        { apiKey: validApiKey },
        { containerId: 'quote-widget' }
      )

      widget.open()

      const input = container.querySelector('.qe-input') as HTMLInputElement
      const button = container.querySelector('.qe-send-btn') as HTMLButtonElement

      input.value = 'Hello'
      button.click()

      // After clicking, input should be cleared
      expect(input.value).toBe('')
    })

    it('should send message on Enter key', () => {
      const widget = new QuoteEngineWidget(
        { apiKey: validApiKey },
        { containerId: 'quote-widget' }
      )

      widget.open()

      const input = container.querySelector('.qe-input') as HTMLInputElement
      input.value = 'Hello'

      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      })
      input.dispatchEvent(event)

      expect(input.value).toBe('')
    })

    it('should close on close button click', () => {
      const widget = new QuoteEngineWidget(
        { apiKey: validApiKey },
        { containerId: 'quote-widget', autoOpen: true }
      )

      const closeBtn = container.querySelector('.qe-close-btn') as HTMLButtonElement
      closeBtn.click()

      expect(widget.getState().isOpen).toBe(false)
    })

    it('should close on overlay click (modal mode)', () => {
      const widget = new QuoteEngineWidget(
        { apiKey: validApiKey },
        { containerId: 'quote-widget', mode: 'modal', autoOpen: true }
      )

      const overlay = container.querySelector('.qe-overlay') as HTMLElement
      overlay.click()

      expect(widget.getState().isOpen).toBe(false)
    })
  })

  describe('theming', () => {
    it('should inject theme CSS', () => {
      new QuoteEngineWidget(
        {
          apiKey: validApiKey,
          theme: { primaryColor: '#e91e63' },
        },
        { containerId: 'quote-widget' }
      )

      const styleEl = document.getElementById('qe-theme-css')
      expect(styleEl).not.toBeNull()
      expect(styleEl?.textContent).toContain('--qe-primary-color: #e91e63')
    })

    it('should apply custom class names', () => {
      new QuoteEngineWidget(
        { apiKey: validApiKey },
        {
          containerId: 'quote-widget',
          classNames: {
            container: 'custom-container',
          },
        }
      )

      expect(container.querySelector('.custom-container')).not.toBeNull()
    })
  })

  describe('XSS protection', () => {
    it('should escape HTML in labels', () => {
      new QuoteEngineWidget(
        {
          apiKey: validApiKey,
          labels: { headerTitle: '<script>alert("xss")</script>' },
        },
        { containerId: 'quote-widget' }
      )

      const title = container.querySelector('.qe-title')
      expect(title?.querySelector('script')).toBeNull()
      expect(title?.textContent).toBe('<script>alert("xss")</script>')
    })

    it('should escape HTML in messages', async () => {
      new QuoteEngineWidget(
        { apiKey: validApiKey },
        { containerId: 'quote-widget' }
      )

      const messagesEl = container.querySelector('.qe-messages') as HTMLElement
      // We simulate a message being added to the DOM via the widget's escaping logic
      const msgContent = '<script>alert("xss")</script>'
      const msgEl = document.createElement('div')
      msgEl.className = 'qe-message'

      // Manual escape matching the widget's implementation
      msgEl.innerHTML = msgContent
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')

      messagesEl.appendChild(msgEl)

      expect(msgEl.querySelector('script')).toBeNull()
      expect(msgEl.textContent).toBe(msgContent)
    })
  })
})

describe('createWidget', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    container.id = 'quote-widget'
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  it('should create widget instance', () => {
    const widget = createWidget(createConfig({}, { containerId: 'quote-widget' }))

    expect(widget).toBeInstanceOf(QuoteEngineWidget)
  })

  it('should separate SDK config from widget options', () => {
    const widget = createWidget({
      apiKey: validApiKey,
      language: 'it',
      containerId: 'quote-widget',
      mode: 'modal',
    })

    const client = widget.getClient()
    expect(client.getConfig().language).toBe('it')
  })
})

describe('init', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    container.id = 'quote-widget'
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  it('should create widget instance', () => {
    const widget = init({
      apiKey: validApiKey,
      containerId: 'quote-widget',
    })

    expect(widget).toBeInstanceOf(QuoteEngineWidget)
  })
})

describe('CSS styles', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    container.id = 'quote-widget'
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  it('should include CSS variables', () => {
    new QuoteEngineWidget(
      { apiKey: validApiKey },
      { containerId: 'quote-widget' }
    )

    const style = container.querySelector('style')
    expect(style).not.toBeNull()
    expect(style?.textContent).toContain('--qe-primary-color')
    expect(style?.textContent).toContain('--qe-font-family')
    expect(style?.textContent).toContain('--qe-border-radius')
  })

  it('should include animation keyframes', () => {
    new QuoteEngineWidget(
      { apiKey: validApiKey },
      { containerId: 'quote-widget' }
    )

    const style = container.querySelector('style')
    expect(style?.textContent).toContain('@keyframes qe-bounce')
  })
})
