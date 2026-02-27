/**
 * ThinkPink Quote Engine SDK - Utility Functions
 */

import type { Pricing, Quote, ThemeConfig } from './types'

/**
 * Format currency amount
 */
export function formatCurrency(
  amount: number,
  currency: string = 'EUR',
  locale: string = 'it-IT'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format date
 */
export function formatDate(
  date: Date | string,
  locale: string = 'it-IT',
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(d)
}

/**
 * Format quote number for display
 */
export function formatQuoteNumber(quoteNumber: string): string {
  return quoteNumber.toUpperCase()
}

/**
 * Calculate days until expiry
 */
export function getDaysUntilExpiry(expiresAt: Date | string): number {
  const expiry = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt
  const now = new Date()
  const diff = expiry.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * Check if quote is expired
 */
export function isQuoteExpired(quote: Quote): boolean {
  return new Date(quote.expiresAt) < new Date()
}

/**
 * Generate CSS variables from theme config.
 *
 * Produces a comprehensive set of CSS custom properties covering every
 * visual aspect of the pre-built widget. Consumers using headless hooks
 * can also read these variables for consistency.
 */
export function generateThemeCss(theme: ThemeConfig): string {
  const vars: string[] = []

  const set = (name: string, value: string | number | undefined) => {
    if (value !== undefined && value !== null) {
      vars.push(`--qe-${name}: ${value}`)
    }
  }

  const setPx = (name: string, value: number | undefined) => {
    if (value !== undefined && value !== null) {
      vars.push(`--qe-${name}: ${value}px`)
    }
  }

  // ── Colors ──────────────────────────────────────────────────────────
  if (theme.primaryColor) {
    set('primary-color', theme.primaryColor)
    set('primary-color-hover', theme.primaryColorHover || adjustColor(theme.primaryColor, -10))
    set('primary-color-light', theme.primaryColorLight || adjustColor(theme.primaryColor, 40))
  }
  set('secondary-color', theme.secondaryColor)
  set('accent-color', theme.accentColor)
  set('background-color', theme.backgroundColor)
  set('surface-color', theme.surfaceColor)

  if (theme.textColor) {
    set('text-color', theme.textColor)
    set('text-color-muted', theme.textColorMuted || adjustColor(theme.textColor, 30))
  } else if (theme.textColorMuted) {
    set('text-color-muted', theme.textColorMuted)
  }
  set('text-color-inverse', theme.textColorInverse)
  set('border-color', theme.borderColor)
  set('error-color', theme.errorColor)
  set('success-color', theme.successColor)
  set('warning-color', theme.warningColor)

  // ── Message Bubbles ─────────────────────────────────────────────────
  set('user-bubble-color', theme.userBubbleColor)
  set('user-bubble-text-color', theme.userBubbleTextColor)
  set('assistant-bubble-color', theme.assistantBubbleColor)
  set('assistant-bubble-text-color', theme.assistantBubbleTextColor)
  set('user-bubble-border-radius', theme.userBubbleBorderRadius)
  set('assistant-bubble-border-radius', theme.assistantBubbleBorderRadius)
  set('bubble-max-width', theme.bubbleMaxWidth)

  // ── Typography ──────────────────────────────────────────────────────
  set('font-family', theme.fontFamily)
  set('heading-font', theme.headingFont)
  setPx('font-size', theme.fontSize)
  setPx('font-size-small', theme.fontSizeSmall)
  setPx('font-size-large', theme.fontSizeLarge)
  setPx('font-size-heading', theme.fontSizeHeading)
  set('font-weight', theme.fontWeight)
  set('font-weight-bold', theme.fontWeightBold)
  set('line-height', theme.lineHeight)
  set('letter-spacing', theme.letterSpacing)

  // ── Spacing & Layout ────────────────────────────────────────────────
  setPx('border-radius', theme.borderRadius)
  setPx('button-border-radius', theme.buttonBorderRadius)
  setPx('input-border-radius', theme.inputBorderRadius)
  setPx('container-padding', theme.containerPadding)
  setPx('message-gap', theme.messageGap)
  set('widget-height', theme.widgetHeight)
  set('widget-max-height', theme.widgetMaxHeight)
  set('widget-width', theme.widgetWidth)

  // ── Shadows & Effects ───────────────────────────────────────────────
  set('box-shadow', theme.boxShadow)
  set('box-shadow-elevated', theme.boxShadowElevated)
  set('overlay-color', theme.overlayColor)
  set('transition-duration', theme.transitionDuration)
  set('transition-easing', theme.transitionEasing)

  // ── Buttons ─────────────────────────────────────────────────────────
  setPx('send-button-size', theme.sendButtonSize)
  set('button-padding', theme.buttonPadding)
  setPx('button-font-size', theme.buttonFontSize)
  set('disabled-opacity', theme.disabledOpacity)

  // ── Input Field ─────────────────────────────────────────────────────
  set('input-background-color', theme.inputBackgroundColor)
  set('input-border-color', theme.inputBorderColor)
  set('input-focus-border-color', theme.inputFocusBorderColor)
  set('input-padding', theme.inputPadding)
  setPx('input-font-size', theme.inputFontSize)

  // ── Header ──────────────────────────────────────────────────────────
  set('header-background-color', theme.headerBackgroundColor)
  set('header-text-color', theme.headerTextColor)
  set('header-padding', theme.headerPadding)
  set('header-border-bottom', theme.headerBorderBottom)
  setPx('logo-height', theme.logoHeight)

  // ── Loading ─────────────────────────────────────────────────────────
  set('loading-color', theme.loadingColor)
  setPx('loading-dot-size', theme.loadingDotSize)
  if (theme.loadingAnimationDuration) {
    set('loading-animation-duration', `${theme.loadingAnimationDuration}s`)
  }

  return `.qe-widget { ${vars.join('; ')} }`
}

/**
 * Adjust color brightness
 */
function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.min(255, Math.max(0, (num >> 16) + amt))
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt))
  const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt))
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number format
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/
  return phone.length >= 8 && phoneRegex.test(phone)
}

/**
 * Get country from locale
 */
export function getCountryFromLocale(locale: string): string {
  const parts = locale.split('-')
  return parts.length > 1 ? parts[1].toUpperCase() : parts[0].toUpperCase()
}

/**
 * Get locale from language code
 */
export function getLocaleFromLanguage(language: string): string {
  const localeMap: Record<string, string> = {
    it: 'it-IT',
    en: 'en-GB',
    de: 'de-DE',
    fr: 'fr-FR',
    es: 'es-ES',
    nl: 'nl-NL',
    pt: 'pt-PT',
  }
  return localeMap[language] || 'en-GB'
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        deepMerge(
          target[key] as Record<string, unknown>,
          source[key] as Record<string, unknown>
        )
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return deepMerge(target, ...sources)
}

function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Calculate pricing summary
 */
export function calculatePricingSummary(pricing: Pricing): {
  totalHours: number
  averageRate: number
  discountTotal: number
  netAmount: number
} {
  const totalHours = pricing.breakdown.reduce((sum, item) => sum + item.hours, 0)
  const averageRate =
    totalHours > 0 ? pricing.subtotal / totalHours : 0
  const discountTotal = pricing.discounts.reduce(
    (sum, discount) => sum + discount.amount,
    0
  )
  const netAmount = pricing.subtotalAfterDiscounts

  return {
    totalHours,
    averageRate: Math.round(averageRate * 100) / 100,
    discountTotal,
    netAmount,
  }
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Storage helper for session persistence
 */
export const storage = {
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null
    try {
      const item = localStorage.getItem(`qe_${key}`)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(`qe_${key}`, JSON.stringify(value))
    } catch {
      // Storage full or unavailable
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(`qe_${key}`)
  },

  clear(): void {
    if (typeof window === 'undefined') return
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('qe_')) {
        keys.push(key)
      }
    }
    keys.forEach((key) => localStorage.removeItem(key))
  },
}

/**
 * Translations helper
 */
export const translations = {
  it: {
    chat: {
      placeholder: 'Descrivi il tuo progetto...',
      send: 'Invia',
      typing: 'Sta scrivendo...',
    },
    quote: {
      title: 'Il tuo preventivo',
      subtotal: 'Subtotale',
      vat: 'IVA',
      total: 'Totale',
      deposit: 'Acconto',
      expiresIn: 'Scade tra',
      days: 'giorni',
    },
    payment: {
      title: 'Pagamento',
      payNow: 'Paga ora',
      processing: 'Elaborazione...',
    },
    errors: {
      required: 'Campo obbligatorio',
      invalidEmail: 'Email non valida',
      networkError: 'Errore di rete',
    },
  },
  en: {
    chat: {
      placeholder: 'Describe your project...',
      send: 'Send',
      typing: 'Typing...',
    },
    quote: {
      title: 'Your Quote',
      subtotal: 'Subtotal',
      vat: 'VAT',
      total: 'Total',
      deposit: 'Deposit',
      expiresIn: 'Expires in',
      days: 'days',
    },
    payment: {
      title: 'Payment',
      payNow: 'Pay Now',
      processing: 'Processing...',
    },
    errors: {
      required: 'Required field',
      invalidEmail: 'Invalid email',
      networkError: 'Network error',
    },
  },
  de: {
    chat: {
      placeholder: 'Beschreiben Sie Ihr Projekt...',
      send: 'Senden',
      typing: 'Tippt...',
    },
    quote: {
      title: 'Ihr Angebot',
      subtotal: 'Zwischensumme',
      vat: 'MwSt.',
      total: 'Gesamt',
      deposit: 'Anzahlung',
      expiresIn: 'Läuft ab in',
      days: 'Tagen',
    },
    payment: {
      title: 'Zahlung',
      payNow: 'Jetzt bezahlen',
      processing: 'Verarbeitung...',
    },
    errors: {
      required: 'Pflichtfeld',
      invalidEmail: 'Ungültige E-Mail',
      networkError: 'Netzwerkfehler',
    },
  },
  fr: {
    chat: {
      placeholder: 'Décrivez votre projet...',
      send: 'Envoyer',
      typing: 'Écrit...',
    },
    quote: {
      title: 'Votre Devis',
      subtotal: 'Sous-total',
      vat: 'TVA',
      total: 'Total',
      deposit: 'Acompte',
      expiresIn: 'Expire dans',
      days: 'jours',
    },
    payment: {
      title: 'Paiement',
      payNow: 'Payer maintenant',
      processing: 'Traitement...',
    },
    errors: {
      required: 'Champ obligatoire',
      invalidEmail: 'Email invalide',
      networkError: 'Erreur réseau',
    },
  },
  es: {
    chat: {
      placeholder: 'Describe tu proyecto...',
      send: 'Enviar',
      typing: 'Escribiendo...',
    },
    quote: {
      title: 'Tu Presupuesto',
      subtotal: 'Subtotal',
      vat: 'IVA',
      total: 'Total',
      deposit: 'Depósito',
      expiresIn: 'Expira en',
      days: 'días',
    },
    payment: {
      title: 'Pago',
      payNow: 'Pagar ahora',
      processing: 'Procesando...',
    },
    errors: {
      required: 'Campo obligatorio',
      invalidEmail: 'Email inválido',
      networkError: 'Error de red',
    },
  },
}

export type TranslationKey = keyof (typeof translations)['en']

export function t(
  language: string,
  category: TranslationKey,
  key: string
): string {
  const lang = language in translations ? language : 'en'
  const trans = translations[lang as keyof typeof translations]
  const cat = trans[category] as Record<string, string>
  return cat?.[key] || key
}
