/**
 * Unit tests for Quote Engine SDK utilities
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  formatCurrency,
  formatDate,
  formatQuoteNumber,
  getDaysUntilExpiry,
  isQuoteExpired,
  generateThemeCss,
  debounce,
  throttle,
  isValidEmail,
  isValidPhone,
  getCountryFromLocale,
  getLocaleFromLanguage,
  deepMerge,
  calculatePricingSummary,
  storage,
  translations,
  t,
} from '../../core/utils'
import type { ThemeConfig, Quote, Pricing } from '../../core/types'

describe('formatCurrency', () => {
  it('should format currency with default EUR/IT locale', () => {
    const result = formatCurrency(1234.56)
    // Use regex to match parts because some environments use non-breaking spaces or different group separators
    // Also thousands separator might be missing in some locales/environments
    expect(result).toMatch(/1[.,]?234[.,]56/)
    expect(result).toContain('€')
  })

  it('should format currency with custom currency', () => {
    const result = formatCurrency(1234.56, 'USD', 'en-US')
    expect(result).toContain('$')
    expect(result).toContain('1,234.56')
  })

  it('should handle zero', () => {
    const result = formatCurrency(0)
    expect(result).toContain('0,00')
  })

  it('should handle negative amounts', () => {
    const result = formatCurrency(-100)
    expect(result).toContain('-')
    expect(result).toContain('100')
  })
})

describe('formatDate', () => {
  it('should format date with default IT locale', () => {
    const date = new Date('2025-03-15')
    const result = formatDate(date)
    expect(result).toContain('15')
    expect(result).toContain('marzo')
    expect(result).toContain('2025')
  })

  it('should format date string', () => {
    const result = formatDate('2025-06-20')
    expect(result).toContain('20')
    expect(result).toContain('giugno')
    expect(result).toContain('2025')
  })

  it('should use custom locale', () => {
    const date = new Date('2025-03-15')
    const result = formatDate(date, 'en-US')
    expect(result).toContain('March')
  })

  it('should use custom options', () => {
    const date = new Date('2025-03-15')
    const result = formatDate(date, 'en-US', { weekday: 'long' })
    expect(result).toContain('Saturday')
  })
})

describe('formatQuoteNumber', () => {
  it('should uppercase quote number', () => {
    expect(formatQuoteNumber('qe-2025-001')).toBe('QE-2025-001')
  })

  it('should handle already uppercase', () => {
    expect(formatQuoteNumber('QE-2025-001')).toBe('QE-2025-001')
  })
})

describe('getDaysUntilExpiry', () => {
  it('should calculate days until expiry', () => {
    const future = new Date()
    future.setDate(future.getDate() + 10)
    expect(getDaysUntilExpiry(future)).toBe(10)
  })

  it('should handle string dates', () => {
    const future = new Date()
    future.setDate(future.getDate() + 5)
    expect(getDaysUntilExpiry(future.toISOString())).toBe(5)
  })

  it('should return negative for past dates', () => {
    const past = new Date()
    past.setDate(past.getDate() - 3)
    expect(getDaysUntilExpiry(past)).toBe(-3)
  })

  it('should return 1 for today + 1 hour', () => {
    const soon = new Date()
    soon.setHours(soon.getHours() + 1)
    expect(getDaysUntilExpiry(soon)).toBe(1)
  })
})

describe('isQuoteExpired', () => {
  it('should return true for expired quote', () => {
    const quote = {
      expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    } as Quote
    expect(isQuoteExpired(quote)).toBe(true)
  })

  it('should return false for valid quote', () => {
    const quote = {
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    } as Quote
    expect(isQuoteExpired(quote)).toBe(false)
  })
})

describe('generateThemeCss', () => {
  it('should generate CSS with primary color', () => {
    const theme: ThemeConfig = { primaryColor: '#e91e63' }
    const css = generateThemeCss(theme)

    expect(css).toContain('.qe-widget')
    expect(css).toContain('--qe-primary-color: #e91e63')
  })

  it('should auto-generate hover color', () => {
    const theme: ThemeConfig = { primaryColor: '#e91e63' }
    const css = generateThemeCss(theme)

    expect(css).toContain('--qe-primary-color-hover:')
  })

  it('should use provided hover color', () => {
    const theme: ThemeConfig = {
      primaryColor: '#e91e63',
      primaryColorHover: '#c2185b',
    }
    const css = generateThemeCss(theme)

    expect(css).toContain('--qe-primary-color-hover: #c2185b')
  })

  it('should include typography settings', () => {
    const theme: ThemeConfig = {
      fontFamily: 'Inter, sans-serif',
      fontSize: 16,
      fontWeight: 400,
    }
    const css = generateThemeCss(theme)

    expect(css).toContain('--qe-font-family: Inter, sans-serif')
    expect(css).toContain('--qe-font-size: 16px')
    expect(css).toContain('--qe-font-weight: 400')
  })

  it('should include spacing settings', () => {
    const theme: ThemeConfig = {
      borderRadius: 12,
      containerPadding: 20,
      messageGap: 8,
    }
    const css = generateThemeCss(theme)

    expect(css).toContain('--qe-border-radius: 12px')
    expect(css).toContain('--qe-container-padding: 20px')
    expect(css).toContain('--qe-message-gap: 8px')
  })

  it('should include bubble settings', () => {
    const theme: ThemeConfig = {
      userBubbleColor: '#e91e63',
      assistantBubbleColor: '#f5f5f5',
    }
    const css = generateThemeCss(theme)

    expect(css).toContain('--qe-user-bubble-color: #e91e63')
    expect(css).toContain('--qe-assistant-bubble-color: #f5f5f5')
  })

  it('should handle loading animation duration', () => {
    const theme: ThemeConfig = { loadingAnimationDuration: 1.5 }
    const css = generateThemeCss(theme)

    expect(css).toContain('--qe-loading-animation-duration: 1.5s')
  })

  it('should skip undefined values', () => {
    const theme: ThemeConfig = {}
    const css = generateThemeCss(theme)

    expect(css).not.toContain('undefined')
    expect(css).not.toContain('null')
  })
})

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('should debounce function calls', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced()
    debounced()
    debounced()

    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should pass arguments correctly', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced('arg1', 'arg2')
    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2')
  })

  it('should reset timer on subsequent calls', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced()
    vi.advanceTimersByTime(50)
    debounced()
    vi.advanceTimersByTime(50)

    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(50)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('should throttle function calls', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 100)

    throttled()
    throttled()
    throttled()

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should allow calls after throttle period', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 100)

    throttled()
    vi.advanceTimersByTime(100)
    throttled()

    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should pass arguments correctly', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 100)

    throttled('arg1', 'arg2')

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2')
  })
})

describe('isValidEmail', () => {
  it('should validate correct emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
    expect(isValidEmail('user+tag@example.org')).toBe(true)
  })

  it('should reject invalid emails', () => {
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('invalid')).toBe(false)
    expect(isValidEmail('missing@domain')).toBe(false)
    expect(isValidEmail('@nodomain.com')).toBe(false)
    expect(isValidEmail('spaces in@email.com')).toBe(false)
  })
})

describe('isValidPhone', () => {
  it('should validate correct phone numbers', () => {
    expect(isValidPhone('+39 333 1234567')).toBe(true)
    expect(isValidPhone('(555) 123-4567')).toBe(true)
    expect(isValidPhone('0039333123456')).toBe(true)
  })

  it('should reject invalid phone numbers', () => {
    expect(isValidPhone('')).toBe(false)
    expect(isValidPhone('123')).toBe(false) // Too short
    expect(isValidPhone('abc12345678')).toBe(false)
  })
})

describe('getCountryFromLocale', () => {
  it('should extract country from locale', () => {
    expect(getCountryFromLocale('it-IT')).toBe('IT')
    expect(getCountryFromLocale('en-US')).toBe('US')
    expect(getCountryFromLocale('de-DE')).toBe('DE')
  })

  it('should handle language-only codes', () => {
    expect(getCountryFromLocale('it')).toBe('IT')
    expect(getCountryFromLocale('en')).toBe('EN')
  })
})

describe('getLocaleFromLanguage', () => {
  it('should return correct locale for language', () => {
    expect(getLocaleFromLanguage('it')).toBe('it-IT')
    expect(getLocaleFromLanguage('en')).toBe('en-GB')
    expect(getLocaleFromLanguage('de')).toBe('de-DE')
    expect(getLocaleFromLanguage('fr')).toBe('fr-FR')
    expect(getLocaleFromLanguage('es')).toBe('es-ES')
  })

  it('should default to en-GB for unknown language', () => {
    expect(getLocaleFromLanguage('xx')).toBe('en-GB')
  })
})

describe('deepMerge', () => {
  it('should merge objects deeply', () => {
    const target = { a: 1, b: { c: 2 } }
    const source = { b: { d: 3 }, e: 4 }

    const result = deepMerge(target, source)

    expect(result).toEqual({
      a: 1,
      b: { c: 2, d: 3 },
      e: 4,
    })
  })

  it('should override primitive values', () => {
    const target = { a: 1, b: 2 }
    const source = { b: 3 }

    const result = deepMerge(target, source)

    expect(result).toEqual({ a: 1, b: 3 })
  })

  it('should handle multiple sources', () => {
    const target = { a: 1 }
    const source1 = { b: 2 }
    const source2 = { c: 3 }

    const result = deepMerge(target, source1, source2)

    expect(result).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('should not merge arrays', () => {
    const target = { arr: [1, 2] }
    const source = { arr: [3, 4] }

    const result = deepMerge(target, source)

    expect(result.arr).toEqual([3, 4])
  })

  it('should handle empty sources', () => {
    const target = { a: 1 }
    const result = deepMerge(target)

    expect(result).toEqual({ a: 1 })
  })

  it('should create new nested objects', () => {
    const target = { a: 1 }
    const source = { b: { c: 2 } }

    const result = deepMerge(target, source)

    expect(result).toEqual({ a: 1, b: { c: 2 } })
  })
})

describe('calculatePricingSummary', () => {
  it('should calculate pricing summary correctly', () => {
    const pricing: Pricing = {
      breakdown: [
        { category: 'Design', description: 'UI', hours: 40, rate: 100, amount: 4000 },
        { category: 'Dev', description: 'Frontend', hours: 60, rate: 120, amount: 7200 },
      ],
      subtotal: 11200,
      discounts: [{ type: 'percentage', value: 10, amount: 1120 }],
      subtotalAfterDiscounts: 10080,
      vatRate: 22,
      vatAmount: 2217.6,
      total: 12297.6,
      deposit: { percentage: 30, amount: 3689.28 },
      milestones: [],
    }

    const summary = calculatePricingSummary(pricing)

    expect(summary.totalHours).toBe(100)
    expect(summary.averageRate).toBe(112) // 11200 / 100
    expect(summary.discountTotal).toBe(1120)
    expect(summary.netAmount).toBe(10080)
  })

  it('should handle empty breakdown', () => {
    const pricing: Pricing = {
      breakdown: [],
      subtotal: 0,
      discounts: [],
      subtotalAfterDiscounts: 0,
      vatRate: 22,
      vatAmount: 0,
      total: 0,
      deposit: { percentage: 30, amount: 0 },
      milestones: [],
    }

    const summary = calculatePricingSummary(pricing)

    expect(summary.totalHours).toBe(0)
    expect(summary.averageRate).toBe(0)
  })

  it('should handle no discounts', () => {
    const pricing: Pricing = {
      breakdown: [{ category: 'Dev', description: 'Work', hours: 10, rate: 100, amount: 1000 }],
      subtotal: 1000,
      discounts: [],
      subtotalAfterDiscounts: 1000,
      vatRate: 22,
      vatAmount: 220,
      total: 1220,
      deposit: { percentage: 30, amount: 366 },
      milestones: [],
    }

    const summary = calculatePricingSummary(pricing)

    expect(summary.discountTotal).toBe(0)
  })
})

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should get and set values', () => {
    storage.set('test', { foo: 'bar' })
    const result = storage.get<{ foo: string }>('test')

    expect(result).toEqual({ foo: 'bar' })
  })

  it('should prefix keys with qe_', () => {
    storage.set('key', 'value')

    expect(localStorage.getItem('qe_key')).toBe('"value"')
  })

  it('should return null for missing keys', () => {
    expect(storage.get('nonexistent')).toBeNull()
  })

  it('should remove values', () => {
    storage.set('test', 'value')
    storage.remove('test')

    expect(storage.get('test')).toBeNull()
  })

  it('should clear only qe_ prefixed keys', () => {
    localStorage.setItem('other_key', 'other')
    storage.set('key1', 'value1')
    storage.set('key2', 'value2')

    storage.clear()

    expect(localStorage.getItem('other_key')).toBe('other')
    expect(storage.get('key1')).toBeNull()
    expect(storage.get('key2')).toBeNull()
  })
})

describe('translations', () => {
  it('should have Italian translations', () => {
    expect(translations.it.chat.placeholder).toBe('Descrivi il tuo progetto...')
    expect(translations.it.quote.title).toBe('Il tuo preventivo')
    expect(translations.it.payment.payNow).toBe('Paga ora')
  })

  it('should have English translations', () => {
    expect(translations.en.chat.placeholder).toBe('Describe your project...')
    expect(translations.en.quote.title).toBe('Your Quote')
    expect(translations.en.payment.payNow).toBe('Pay Now')
  })

  it('should have German translations', () => {
    expect(translations.de.chat.placeholder).toBe('Beschreiben Sie Ihr Projekt...')
  })

  it('should have French translations', () => {
    expect(translations.fr.chat.placeholder).toBe('Décrivez votre projet...')
  })

  it('should have Spanish translations', () => {
    expect(translations.es.chat.placeholder).toBe('Describe tu proyecto...')
  })
})

describe('t (translation helper)', () => {
  it('should return correct translation', () => {
    expect(t('it', 'chat', 'placeholder')).toBe('Descrivi il tuo progetto...')
    expect(t('en', 'quote', 'total')).toBe('Total')
  })

  it('should fallback to English for unknown language', () => {
    expect(t('xx', 'chat', 'send')).toBe('Send')
  })

  it('should return key if translation not found', () => {
    expect(t('en', 'chat', 'nonexistent')).toBe('nonexistent')
  })
})
