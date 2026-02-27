/**
 * Tests for API key scoping and validation
 */

import { describe, it, expect } from 'vitest'
import {
  parseApiKey,
  isValidApiKeyFormat,
  getApiKeyPermissions,
  hasPermission,
  isTestKey,
  isLiveKey,
  validateApiKey,
  assertPermission,
  maskApiKey,
  getScopeDescription,
  listEnabledPermissions,
  ApiKeyValidationError,
  SCOPE_PERMISSIONS,
} from '../../core/api-keys'

describe('API Keys Module', () => {
  // Sample valid keys for testing
  const validLiveFullKey = 'qe_live_full_abc123def456ghi789jkl012'
  const validTestWidgetKey = 'qe_test_widget_xyz789abc123def456ghi789'
  const validLiveReadKey = 'qe_live_read_aaaaaaaabbbbbbbbcccccccc'
  const validLiveWebhookKey = 'qe_live_webhook_webhookidentifier12345678'
  const validLivePaymentKey = 'qe_live_payment_paymentidentifier12345678'

  describe('parseApiKey', () => {
    it('should parse a valid live full key', () => {
      const parsed = parseApiKey(validLiveFullKey)

      expect(parsed.isValid).toBe(true)
      expect(parsed.environment).toBe('live')
      expect(parsed.scope).toBe('full')
      expect(parsed.identifier).toBe('abc123def456ghi789jkl012')
      expect(parsed.isTestKey).toBe(false)
      expect(parsed.raw).toBe(validLiveFullKey)
    })

    it('should parse a valid test widget key', () => {
      const parsed = parseApiKey(validTestWidgetKey)

      expect(parsed.isValid).toBe(true)
      expect(parsed.environment).toBe('test')
      expect(parsed.scope).toBe('widget')
      expect(parsed.isTestKey).toBe(true)
    })

    it('should parse all valid scopes', () => {
      const scopes = ['full', 'read', 'widget', 'webhook', 'payment'] as const

      for (const scope of scopes) {
        const key = `qe_live_${scope}_identifier12345678901234`
        const parsed = parseApiKey(key)
        expect(parsed.isValid).toBe(true)
        expect(parsed.scope).toBe(scope)
      }
    })

    it('should return invalid for malformed keys', () => {
      const invalidKeys = [
        'invalid-key',
        'qe_invalid_scope_abc123',
        'qe_live_invalid_abc123',
        'qe_prod_full_abc123', // invalid environment
        'qe_live_full_short', // identifier too short
        'sk_live_abc123', // wrong prefix
        '',
        '   ',
      ]

      for (const key of invalidKeys) {
        const parsed = parseApiKey(key)
        expect(parsed.isValid).toBe(false)
      }
    })

    it('should handle identifier with minimum length (24 chars)', () => {
      const key = 'qe_live_full_' + 'a'.repeat(24)
      const parsed = parseApiKey(key)
      expect(parsed.isValid).toBe(true)
    })

    it('should handle identifier with long length', () => {
      const key = 'qe_live_full_' + 'a'.repeat(64)
      const parsed = parseApiKey(key)
      expect(parsed.isValid).toBe(true)
      expect(parsed.identifier.length).toBe(64)
    })
  })

  describe('isValidApiKeyFormat', () => {
    it('should return true for valid keys', () => {
      expect(isValidApiKeyFormat(validLiveFullKey)).toBe(true)
      expect(isValidApiKeyFormat(validTestWidgetKey)).toBe(true)
      expect(isValidApiKeyFormat(validLiveReadKey)).toBe(true)
    })

    it('should return false for invalid keys', () => {
      expect(isValidApiKeyFormat('invalid')).toBe(false)
      expect(isValidApiKeyFormat('qe_live_invalid_abc123def456ghi789jkl012')).toBe(false)
      expect(isValidApiKeyFormat('')).toBe(false)
    })
  })

  describe('getApiKeyPermissions', () => {
    it('should return full permissions for full scope', () => {
      const perms = getApiKeyPermissions(validLiveFullKey)

      expect(perms.chat).toBe(true)
      expect(perms.generateQuote).toBe(true)
      expect(perms.readQuote).toBe(true)
      expect(perms.initPayment).toBe(true)
      expect(perms.confirmPayment).toBe(true)
      expect(perms.manageWebhooks).toBe(true)
      expect(perms.accessAnalytics).toBe(true)
      expect(perms.sendEmails).toBe(true)
      expect(perms.downloadPdfs).toBe(true)
    })

    it('should return read-only permissions for read scope', () => {
      const perms = getApiKeyPermissions(validLiveReadKey)

      expect(perms.chat).toBe(false)
      expect(perms.generateQuote).toBe(false)
      expect(perms.readQuote).toBe(true)
      expect(perms.initPayment).toBe(false)
      expect(perms.manageWebhooks).toBe(false)
      expect(perms.accessAnalytics).toBe(true)
      expect(perms.downloadPdfs).toBe(true)
    })

    it('should return widget permissions for widget scope', () => {
      const perms = getApiKeyPermissions(validTestWidgetKey)

      expect(perms.chat).toBe(true)
      expect(perms.generateQuote).toBe(true)
      expect(perms.readQuote).toBe(true)
      expect(perms.initPayment).toBe(true)
      expect(perms.manageWebhooks).toBe(false)
      expect(perms.accessAnalytics).toBe(false)
    })

    it('should return webhook permissions for webhook scope', () => {
      const perms = getApiKeyPermissions(validLiveWebhookKey)

      expect(perms.chat).toBe(false)
      expect(perms.generateQuote).toBe(false)
      expect(perms.manageWebhooks).toBe(true)
    })

    it('should return payment permissions for payment scope', () => {
      const perms = getApiKeyPermissions(validLivePaymentKey)

      expect(perms.readQuote).toBe(true)
      expect(perms.initPayment).toBe(true)
      expect(perms.confirmPayment).toBe(true)
      expect(perms.chat).toBe(false)
      expect(perms.manageWebhooks).toBe(false)
    })

    it('should return no permissions for invalid keys', () => {
      const perms = getApiKeyPermissions('invalid-key')

      expect(perms.chat).toBe(false)
      expect(perms.generateQuote).toBe(false)
      expect(perms.readQuote).toBe(false)
      expect(perms.initPayment).toBe(false)
      expect(perms.manageWebhooks).toBe(false)
    })

    it('should accept parsed key object', () => {
      const parsed = parseApiKey(validLiveFullKey)
      const perms = getApiKeyPermissions(parsed)

      expect(perms.chat).toBe(true)
    })
  })

  describe('hasPermission', () => {
    it('should return true when permission exists', () => {
      expect(hasPermission(validLiveFullKey, 'chat')).toBe(true)
      expect(hasPermission(validLiveFullKey, 'manageWebhooks')).toBe(true)
    })

    it('should return false when permission is denied', () => {
      expect(hasPermission(validLiveReadKey, 'chat')).toBe(false)
      expect(hasPermission(validTestWidgetKey, 'manageWebhooks')).toBe(false)
    })
  })

  describe('isTestKey / isLiveKey', () => {
    it('should identify test keys', () => {
      expect(isTestKey(validTestWidgetKey)).toBe(true)
      expect(isTestKey(validLiveFullKey)).toBe(false)
    })

    it('should identify live keys', () => {
      expect(isLiveKey(validLiveFullKey)).toBe(true)
      expect(isLiveKey(validTestWidgetKey)).toBe(false)
    })

    it('should return false for invalid keys', () => {
      expect(isTestKey('invalid')).toBe(false)
      expect(isLiveKey('invalid')).toBe(false)
    })
  })

  describe('validateApiKey', () => {
    it('should return parsed key for valid keys', () => {
      const result = validateApiKey(validLiveFullKey)

      expect(result.isValid).toBe(true)
      expect(result.scope).toBe('full')
    })

    it('should throw for empty string', () => {
      expect(() => validateApiKey('')).toThrow(ApiKeyValidationError)
      expect(() => validateApiKey('')).toThrow('non-empty string')
    })

    it('should throw for short keys', () => {
      expect(() => validateApiKey('short')).toThrow(ApiKeyValidationError)
      expect(() => validateApiKey('short')).toThrow('too short')
    })

    it('should throw for wrong prefix', () => {
      expect(() => validateApiKey('sk_live_full_abc123def456ghi789jkl012')).toThrow(
        'must start with "qe_"'
      )
    })

    it('should throw for invalid format', () => {
      expect(() => validateApiKey('qe_invalid_invalid_abc123def456ghi789jkl012')).toThrow(
        'format is invalid'
      )
    })

    it('should trim whitespace', () => {
      const result = validateApiKey('  ' + validLiveFullKey + '  ')
      expect(result.isValid).toBe(true)
    })

    it('should include error code', () => {
      try {
        validateApiKey('invalid')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiKeyValidationError)
        expect((error as ApiKeyValidationError).code).toBe('INVALID_FORMAT')
      }
    })
  })

  describe('assertPermission', () => {
    it('should not throw when permission exists', () => {
      expect(() => assertPermission(validLiveFullKey, 'chat')).not.toThrow()
      expect(() => assertPermission(validLiveFullKey, 'manageWebhooks')).not.toThrow()
    })

    it('should throw when permission is denied', () => {
      expect(() => assertPermission(validLiveReadKey, 'chat', 'start chat')).toThrow(
        ApiKeyValidationError
      )
      expect(() => assertPermission(validLiveReadKey, 'chat', 'start chat')).toThrow(
        'cannot start chat'
      )
    })

    it('should include scope and permission in error', () => {
      try {
        assertPermission(validLiveReadKey, 'chat', 'start chat')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiKeyValidationError)
        const apiError = error as ApiKeyValidationError
        expect(apiError.code).toBe('PERMISSION_DENIED')
        expect(apiError.details?.scope).toBe('read')
        expect(apiError.details?.permission).toBe('chat')
      }
    })
  })

  describe('maskApiKey', () => {
    it('should mask the identifier portion', () => {
      const masked = maskApiKey(validLiveFullKey)

      expect(masked).toContain('qe_live_full_')
      expect(masked).toContain('****')
      expect(masked.endsWith('l012')).toBe(true)
    })

    it('should respect visibleChars parameter', () => {
      const masked = maskApiKey(validLiveFullKey, 6)

      expect(masked.endsWith('jkl012')).toBe(true)
    })

    it('should handle invalid keys', () => {
      const masked = maskApiKey('short')

      expect(masked).toBe('****')
    })

    it('should handle invalid keys with more chars', () => {
      const masked = maskApiKey('some_invalid_key_here')

      expect(masked).toContain('****')
    })
  })

  describe('getScopeDescription', () => {
    it('should return descriptions for all scopes', () => {
      expect(getScopeDescription('full')).toContain('Full access')
      expect(getScopeDescription('read')).toContain('Read-only')
      expect(getScopeDescription('widget')).toContain('Widget')
      expect(getScopeDescription('webhook')).toContain('Webhook')
      expect(getScopeDescription('payment')).toContain('Payment')
    })
  })

  describe('listEnabledPermissions', () => {
    it('should list all permissions for full scope', () => {
      const perms = listEnabledPermissions('full')

      expect(perms).toContain('chat')
      expect(perms).toContain('generateQuote')
      expect(perms).toContain('manageWebhooks')
      expect(perms.length).toBe(9)
    })

    it('should list limited permissions for read scope', () => {
      const perms = listEnabledPermissions('read')

      expect(perms).toContain('readQuote')
      expect(perms).toContain('accessAnalytics')
      expect(perms).not.toContain('chat')
      expect(perms.length).toBe(3)
    })

    it('should list webhook-only permissions for webhook scope', () => {
      const perms = listEnabledPermissions('webhook')

      expect(perms).toEqual(['manageWebhooks'])
    })
  })

  describe('SCOPE_PERMISSIONS', () => {
    it('should have all expected scopes', () => {
      expect(SCOPE_PERMISSIONS).toHaveProperty('full')
      expect(SCOPE_PERMISSIONS).toHaveProperty('read')
      expect(SCOPE_PERMISSIONS).toHaveProperty('widget')
      expect(SCOPE_PERMISSIONS).toHaveProperty('webhook')
      expect(SCOPE_PERMISSIONS).toHaveProperty('payment')
    })

    it('should have all expected permission keys', () => {
      const expectedKeys = [
        'chat',
        'generateQuote',
        'readQuote',
        'initPayment',
        'confirmPayment',
        'manageWebhooks',
        'accessAnalytics',
        'sendEmails',
        'downloadPdfs',
      ]

      for (const scope of Object.keys(SCOPE_PERMISSIONS)) {
        for (const key of expectedKeys) {
          expect(SCOPE_PERMISSIONS[scope as keyof typeof SCOPE_PERMISSIONS]).toHaveProperty(key)
        }
      }
    })
  })
})
