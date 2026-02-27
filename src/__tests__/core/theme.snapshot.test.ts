/**
 * Snapshot tests for CSS generation from design tokens
 */

import { describe, it, expect } from 'vitest'
import { generateThemeCss } from '../../core/utils'
import type { ThemeConfig } from '../../core/types'

describe('Theme CSS Snapshots', () => {
  describe('generateThemeCss', () => {
    it('should match snapshot for default theme', () => {
      const theme: ThemeConfig = {}
      const css = generateThemeCss(theme)

      expect(css).toMatchInlineSnapshot(`".qe-widget {  }"`)
    })

    it('should match snapshot for primary color theme', () => {
      const theme: ThemeConfig = {
        primaryColor: '#e91e63',
      }
      const css = generateThemeCss(theme)

      expect(css).toMatchInlineSnapshot(`".qe-widget { --qe-primary-color: #e91e63; --qe-primary-color-hover: #d0054a; --qe-primary-color-light: #ff84c9 }"`)
    })

    it('should match snapshot for full color palette', () => {
      const theme: ThemeConfig = {
        primaryColor: '#e91e63',
        primaryColorHover: '#c2185b',
        primaryColorLight: '#fce4ec',
        secondaryColor: '#9c27b0',
        accentColor: '#00bcd4',
        backgroundColor: '#ffffff',
        surfaceColor: '#f5f5f5',
        textColor: '#212121',
        textColorMuted: '#757575',
        textColorInverse: '#ffffff',
        borderColor: '#e0e0e0',
        errorColor: '#f44336',
        successColor: '#4caf50',
        warningColor: '#ff9800',
      }
      const css = generateThemeCss(theme)

      expect(css).toMatchInlineSnapshot(`".qe-widget { --qe-primary-color: #e91e63; --qe-primary-color-hover: #c2185b; --qe-primary-color-light: #fce4ec; --qe-secondary-color: #9c27b0; --qe-accent-color: #00bcd4; --qe-background-color: #ffffff; --qe-surface-color: #f5f5f5; --qe-text-color: #212121; --qe-text-color-muted: #757575; --qe-text-color-inverse: #ffffff; --qe-border-color: #e0e0e0; --qe-error-color: #f44336; --qe-success-color: #4caf50; --qe-warning-color: #ff9800 }"`)
    })

    it('should match snapshot for message bubble theme', () => {
      const theme: ThemeConfig = {
        userBubbleColor: '#e91e63',
        userBubbleTextColor: '#ffffff',
        assistantBubbleColor: '#f5f5f5',
        assistantBubbleTextColor: '#212121',
        userBubbleBorderRadius: '20px 20px 4px 20px',
        assistantBubbleBorderRadius: '20px 20px 20px 4px',
        bubbleMaxWidth: '75%',
      }
      const css = generateThemeCss(theme)

      expect(css).toMatchInlineSnapshot(`".qe-widget { --qe-user-bubble-color: #e91e63; --qe-user-bubble-text-color: #ffffff; --qe-assistant-bubble-color: #f5f5f5; --qe-assistant-bubble-text-color: #212121; --qe-user-bubble-border-radius: 20px 20px 4px 20px; --qe-assistant-bubble-border-radius: 20px 20px 20px 4px; --qe-bubble-max-width: 75% }"`)
    })

    it('should match snapshot for typography theme', () => {
      const theme: ThemeConfig = {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        headingFont: '"Playfair Display", serif',
        fontSize: 14,
        fontSizeSmall: 12,
        fontSizeLarge: 18,
        fontSizeHeading: 24,
        fontWeight: 400,
        fontWeightBold: 700,
        lineHeight: 1.5,
        letterSpacing: '-0.01em',
      }
      const css = generateThemeCss(theme)

      expect(css).toMatchInlineSnapshot(`".qe-widget { --qe-font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif; --qe-heading-font: "Playfair Display", serif; --qe-font-size: 14px; --qe-font-size-small: 12px; --qe-font-size-large: 18px; --qe-font-size-heading: 24px; --qe-font-weight: 400; --qe-font-weight-bold: 700; --qe-line-height: 1.5; --qe-letter-spacing: -0.01em }"`)
    })

    it('should match snapshot for spacing theme', () => {
      const theme: ThemeConfig = {
        borderRadius: 16,
        buttonBorderRadius: 8,
        inputBorderRadius: 24,
        containerPadding: 20,
        messageGap: 16,
        widgetHeight: '600px',
        widgetMaxHeight: '90vh',
        widgetWidth: '400px',
      }
      const css = generateThemeCss(theme)

      expect(css).toMatchInlineSnapshot(`".qe-widget { --qe-border-radius: 16px; --qe-button-border-radius: 8px; --qe-input-border-radius: 24px; --qe-container-padding: 20px; --qe-message-gap: 16px; --qe-widget-height: 600px; --qe-widget-max-height: 90vh; --qe-widget-width: 400px }"`)
    })

    it('should match snapshot for shadows and effects theme', () => {
      const theme: ThemeConfig = {
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)',
        boxShadowElevated: '0 12px 48px rgba(0, 0, 0, 0.2)',
        overlayColor: 'rgba(0, 0, 0, 0.6)',
        transitionDuration: '0.3s',
        transitionEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }
      const css = generateThemeCss(theme)

      expect(css).toMatchInlineSnapshot(`".qe-widget { --qe-box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12); --qe-box-shadow-elevated: 0 12px 48px rgba(0, 0, 0, 0.2); --qe-overlay-color: rgba(0, 0, 0, 0.6); --qe-transition-duration: 0.3s; --qe-transition-easing: cubic-bezier(0.4, 0, 0.2, 1) }"`)
    })

    it('should match snapshot for button theme', () => {
      const theme: ThemeConfig = {
        sendButtonSize: 48,
        buttonPadding: '14px 28px',
        buttonFontSize: 16,
        disabledOpacity: 0.4,
      }
      const css = generateThemeCss(theme)

      expect(css).toMatchInlineSnapshot(`".qe-widget { --qe-send-button-size: 48px; --qe-button-padding: 14px 28px; --qe-button-font-size: 16px; --qe-disabled-opacity: 0.4 }"`)
    })

    it('should match snapshot for input theme', () => {
      const theme: ThemeConfig = {
        inputBackgroundColor: '#fafafa',
        inputBorderColor: '#e0e0e0',
        inputFocusBorderColor: '#e91e63',
        inputPadding: '16px 20px',
        inputFontSize: 16,
      }
      const css = generateThemeCss(theme)

      expect(css).toMatchInlineSnapshot(`".qe-widget { --qe-input-background-color: #fafafa; --qe-input-border-color: #e0e0e0; --qe-input-focus-border-color: #e91e63; --qe-input-padding: 16px 20px; --qe-input-font-size: 16px }"`)
    })

    it('should match snapshot for header theme', () => {
      const theme: ThemeConfig = {
        headerBackgroundColor: '#e91e63',
        headerTextColor: '#ffffff',
        headerPadding: '20px 24px',
        headerBorderBottom: 'none',
        logoHeight: 40,
      }
      const css = generateThemeCss(theme)

      expect(css).toMatchInlineSnapshot(`".qe-widget { --qe-header-background-color: #e91e63; --qe-header-text-color: #ffffff; --qe-header-padding: 20px 24px; --qe-header-border-bottom: none; --qe-logo-height: 40px }"`)
    })

    it('should match snapshot for loading theme', () => {
      const theme: ThemeConfig = {
        loadingColor: '#e91e63',
        loadingDotSize: 10,
        loadingAnimationDuration: 1.2,
      }
      const css = generateThemeCss(theme)

      expect(css).toMatchInlineSnapshot(`".qe-widget { --qe-loading-color: #e91e63; --qe-loading-dot-size: 10px; --qe-loading-animation-duration: 1.2s }"`)
    })

    it('should match snapshot for complete production theme', () => {
      const theme: ThemeConfig = {
        // Colors
        primaryColor: '#6366f1',
        primaryColorHover: '#4f46e5',
        primaryColorLight: '#e0e7ff',
        secondaryColor: '#8b5cf6',
        accentColor: '#22d3ee',
        backgroundColor: '#ffffff',
        surfaceColor: '#f8fafc',
        textColor: '#0f172a',
        textColorMuted: '#64748b',
        textColorInverse: '#ffffff',
        borderColor: '#e2e8f0',
        errorColor: '#ef4444',
        successColor: '#22c55e',
        warningColor: '#f59e0b',

        // Bubbles
        userBubbleColor: '#6366f1',
        userBubbleTextColor: '#ffffff',
        assistantBubbleColor: '#f1f5f9',
        assistantBubbleTextColor: '#0f172a',
        userBubbleBorderRadius: '18px 18px 4px 18px',
        assistantBubbleBorderRadius: '18px 18px 18px 4px',
        bubbleMaxWidth: '80%',

        // Typography
        fontFamily: '"Inter", system-ui, sans-serif',
        headingFont: '"Inter", system-ui, sans-serif',
        fontSize: 15,
        fontSizeSmall: 13,
        fontSizeLarge: 17,
        fontSizeHeading: 20,
        fontWeight: 400,
        fontWeightBold: 600,
        lineHeight: 1.5,
        letterSpacing: '-0.01em',

        // Spacing
        borderRadius: 12,
        buttonBorderRadius: 50,
        inputBorderRadius: 24,
        containerPadding: 16,
        messageGap: 12,
        widgetHeight: '560px',
        widgetMaxHeight: '85vh',
        widgetWidth: '380px',

        // Effects
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        boxShadowElevated: '0 10px 40px rgba(0, 0, 0, 0.15)',
        overlayColor: 'rgba(15, 23, 42, 0.5)',
        transitionDuration: '0.2s',
        transitionEasing: 'ease-out',

        // Buttons
        sendButtonSize: 44,
        buttonPadding: '12px 24px',
        buttonFontSize: 15,
        disabledOpacity: 0.5,

        // Input
        inputBackgroundColor: '#ffffff',
        inputBorderColor: '#e2e8f0',
        inputFocusBorderColor: '#6366f1',
        inputPadding: '12px 16px',
        inputFontSize: 15,

        // Header
        headerBackgroundColor: 'transparent',
        headerTextColor: '#0f172a',
        headerPadding: '16px 20px',
        headerBorderBottom: '1px solid #e2e8f0',
        logoHeight: 36,

        // Loading
        loadingColor: '#64748b',
        loadingDotSize: 8,
        loadingAnimationDuration: 1.4,
      }

      const css = generateThemeCss(theme)

      expect(css).toMatchInlineSnapshot(`".qe-widget { --qe-primary-color: #6366f1; --qe-primary-color-hover: #4f46e5; --qe-primary-color-light: #e0e7ff; --qe-secondary-color: #8b5cf6; --qe-accent-color: #22d3ee; --qe-background-color: #ffffff; --qe-surface-color: #f8fafc; --qe-text-color: #0f172a; --qe-text-color-muted: #64748b; --qe-text-color-inverse: #ffffff; --qe-border-color: #e2e8f0; --qe-error-color: #ef4444; --qe-success-color: #22c55e; --qe-warning-color: #f59e0b; --qe-user-bubble-color: #6366f1; --qe-user-bubble-text-color: #ffffff; --qe-assistant-bubble-color: #f1f5f9; --qe-assistant-bubble-text-color: #0f172a; --qe-user-bubble-border-radius: 18px 18px 4px 18px; --qe-assistant-bubble-border-radius: 18px 18px 18px 4px; --qe-bubble-max-width: 80%; --qe-font-family: "Inter", system-ui, sans-serif; --qe-heading-font: "Inter", system-ui, sans-serif; --qe-font-size: 15px; --qe-font-size-small: 13px; --qe-font-size-large: 17px; --qe-font-size-heading: 20px; --qe-font-weight: 400; --qe-font-weight-bold: 600; --qe-line-height: 1.5; --qe-letter-spacing: -0.01em; --qe-border-radius: 12px; --qe-button-border-radius: 50px; --qe-input-border-radius: 24px; --qe-container-padding: 16px; --qe-message-gap: 12px; --qe-widget-height: 560px; --qe-widget-max-height: 85vh; --qe-widget-width: 380px; --qe-box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); --qe-box-shadow-elevated: 0 10px 40px rgba(0, 0, 0, 0.15); --qe-overlay-color: rgba(15, 23, 42, 0.5); --qe-transition-duration: 0.2s; --qe-transition-easing: ease-out; --qe-send-button-size: 44px; --qe-button-padding: 12px 24px; --qe-button-font-size: 15px; --qe-disabled-opacity: 0.5; --qe-input-background-color: #ffffff; --qe-input-border-color: #e2e8f0; --qe-input-focus-border-color: #6366f1; --qe-input-padding: 12px 16px; --qe-input-font-size: 15px; --qe-header-background-color: transparent; --qe-header-text-color: #0f172a; --qe-header-padding: 16px 20px; --qe-header-border-bottom: 1px solid #e2e8f0; --qe-logo-height: 36px; --qe-loading-color: #64748b; --qe-loading-dot-size: 8px; --qe-loading-animation-duration: 1.4s }"`)
    })
  })
})
