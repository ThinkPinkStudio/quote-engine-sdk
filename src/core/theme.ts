/**
 * ThinkPink Quote Engine SDK - Theme Manager
 *
 * Handles dark mode detection, theme switching, and style presets
 */

import type { ThemeConfig, ThemeStyle } from './types'
import { generateThemeCss, deepMerge } from './utils'

export type ThemeMode = 'light' | 'dark' | 'auto'

// ============================================================================
// Theme Style Presets
// ============================================================================

/**
 * Glass theme preset - Glassmorphism effects, gradients, blur
 * Modern and bold visual style with depth and translucency
 */
export const GLASS_THEME_LIGHT: Partial<ThemeConfig> = {
  // Colors with gradient feel
  primaryColor: '#e91e63',
  primaryColorHover: '#d81b60',
  primaryColorLight: '#fce4ec',
  secondaryColor: '#9c27b0',
  accentColor: '#00bcd4',
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  surfaceColor: 'rgba(255, 255, 255, 0.6)',
  textColor: '#1a1a2e',
  textColorMuted: '#64748b',
  textColorInverse: '#ffffff',
  borderColor: 'rgba(255, 255, 255, 0.3)',
  errorColor: '#ef4444',
  successColor: '#10b981',
  warningColor: '#f59e0b',

  // Glass bubbles with backdrop
  userBubbleColor: 'linear-gradient(135deg, #e91e63, #9c27b0)',
  userBubbleTextColor: '#ffffff',
  assistantBubbleColor: 'rgba(255, 255, 255, 0.7)',
  assistantBubbleTextColor: '#1a1a2e',
  userBubbleBorderRadius: '20px 20px 4px 20px',
  assistantBubbleBorderRadius: '20px 20px 20px 4px',
  bubbleMaxWidth: '80%',

  // Typography
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  fontSize: 15,
  fontSizeSmall: 13,
  fontSizeLarge: 17,
  fontWeight: '400',
  fontWeightBold: '600',
  lineHeight: 1.5,

  // Rounded & soft
  borderRadius: 20,
  buttonBorderRadius: 50,
  inputBorderRadius: 24,
  containerPadding: 20,
  messageGap: 16,

  // Glass effects - the signature look
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
  boxShadowElevated: '0 20px 60px rgba(0, 0, 0, 0.2)',
  overlayColor: 'rgba(0, 0, 0, 0.4)',
  transitionDuration: '0.3s',
  transitionEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',

  // Buttons
  sendButtonSize: 48,
  buttonPadding: '14px 28px',
  buttonFontSize: 15,
  disabledOpacity: 0.5,

  // Input with glass effect
  inputBackgroundColor: 'rgba(255, 255, 255, 0.5)',
  inputBorderColor: 'rgba(255, 255, 255, 0.3)',
  inputFocusBorderColor: '#e91e63',
  inputPadding: '14px 18px',
  inputFontSize: 15,

  // Header
  headerBackgroundColor: 'rgba(255, 255, 255, 0.7)',
  headerTextColor: '#1a1a2e',
  headerPadding: '18px 24px',
  headerBorderBottom: '1px solid rgba(255, 255, 255, 0.3)',
  logoHeight: 40,

  // Loading
  loadingColor: '#e91e63',
  loadingDotSize: 10,
  loadingAnimationDuration: 1.2,

  // Custom CSS for glass effects (backdrop-filter)
  customCSS: `
    .qe-widget {
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }
    .qe-widget .qe-header {
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    .qe-widget .qe-message--assistant {
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }
    .qe-widget .qe-input {
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }
  `,
}

export const GLASS_THEME_DARK: Partial<ThemeConfig> = {
  // Dark glass colors
  primaryColor: '#f472b6',
  primaryColorHover: '#ec4899',
  primaryColorLight: '#831843',
  secondaryColor: '#a855f7',
  accentColor: '#22d3ee',
  backgroundColor: 'rgba(15, 15, 30, 0.9)',
  surfaceColor: 'rgba(30, 30, 50, 0.7)',
  textColor: '#f1f5f9',
  textColorMuted: '#94a3b8',
  textColorInverse: '#0f0f1e',
  borderColor: 'rgba(255, 255, 255, 0.1)',
  errorColor: '#f87171',
  successColor: '#34d399',
  warningColor: '#fbbf24',

  // Dark glass bubbles
  userBubbleColor: 'linear-gradient(135deg, #ec4899, #a855f7)',
  userBubbleTextColor: '#ffffff',
  assistantBubbleColor: 'rgba(50, 50, 80, 0.6)',
  assistantBubbleTextColor: '#f1f5f9',

  // Input dark glass
  inputBackgroundColor: 'rgba(30, 30, 50, 0.5)',
  inputBorderColor: 'rgba(255, 255, 255, 0.1)',
  inputFocusBorderColor: '#f472b6',

  // Header dark
  headerBackgroundColor: 'rgba(20, 20, 40, 0.8)',
  headerTextColor: '#f1f5f9',
  headerBorderBottom: '1px solid rgba(255, 255, 255, 0.1)',

  // Loading
  loadingColor: '#f472b6',

  // Dark glass effects
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
  overlayColor: 'rgba(0, 0, 0, 0.7)',
}

/**
 * Minimal theme preset - Clean, flat, lightweight
 * Zero visual noise, focuses on content
 */
export const MINIMAL_THEME_LIGHT: Partial<ThemeConfig> = {
  // Clean, neutral colors
  primaryColor: '#0f172a',
  primaryColorHover: '#1e293b',
  primaryColorLight: '#f1f5f9',
  secondaryColor: '#64748b',
  accentColor: '#3b82f6',
  backgroundColor: '#ffffff',
  surfaceColor: '#fafafa',
  textColor: '#0f172a',
  textColorMuted: '#64748b',
  textColorInverse: '#ffffff',
  borderColor: '#e5e7eb',
  errorColor: '#dc2626',
  successColor: '#16a34a',
  warningColor: '#d97706',

  // Simple bubbles
  userBubbleColor: '#0f172a',
  userBubbleTextColor: '#ffffff',
  assistantBubbleColor: '#f3f4f6',
  assistantBubbleTextColor: '#0f172a',
  userBubbleBorderRadius: '16px 16px 4px 16px',
  assistantBubbleBorderRadius: '16px 16px 16px 4px',
  bubbleMaxWidth: '85%',

  // Typography - clean system fonts
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: 14,
  fontSizeSmall: 12,
  fontSizeLarge: 16,
  fontWeight: '400',
  fontWeightBold: '500',
  lineHeight: 1.6,

  // Minimal border radius
  borderRadius: 8,
  buttonBorderRadius: 6,
  inputBorderRadius: 6,
  containerPadding: 16,
  messageGap: 12,

  // No heavy shadows
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  boxShadowElevated: '0 4px 12px rgba(0, 0, 0, 0.1)',
  overlayColor: 'rgba(0, 0, 0, 0.5)',
  transitionDuration: '0.15s',
  transitionEasing: 'ease-out',

  // Compact buttons
  sendButtonSize: 40,
  buttonPadding: '10px 20px',
  buttonFontSize: 14,
  disabledOpacity: 0.4,

  // Simple input
  inputBackgroundColor: '#ffffff',
  inputBorderColor: '#e5e7eb',
  inputFocusBorderColor: '#0f172a',
  inputPadding: '10px 14px',
  inputFontSize: 14,

  // Minimal header
  headerBackgroundColor: '#ffffff',
  headerTextColor: '#0f172a',
  headerPadding: '14px 18px',
  headerBorderBottom: '1px solid #e5e7eb',
  logoHeight: 32,

  // Loading
  loadingColor: '#64748b',
  loadingDotSize: 6,
  loadingAnimationDuration: 1.4,
}

export const MINIMAL_THEME_DARK: Partial<ThemeConfig> = {
  // Dark minimal colors
  primaryColor: '#f8fafc',
  primaryColorHover: '#e2e8f0',
  primaryColorLight: '#1e293b',
  secondaryColor: '#94a3b8',
  accentColor: '#60a5fa',
  backgroundColor: '#0f172a',
  surfaceColor: '#1e293b',
  textColor: '#f8fafc',
  textColorMuted: '#94a3b8',
  textColorInverse: '#0f172a',
  borderColor: '#334155',
  errorColor: '#f87171',
  successColor: '#4ade80',
  warningColor: '#fbbf24',

  // Dark minimal bubbles
  userBubbleColor: '#f8fafc',
  userBubbleTextColor: '#0f172a',
  assistantBubbleColor: '#1e293b',
  assistantBubbleTextColor: '#f8fafc',

  // Dark input
  inputBackgroundColor: '#1e293b',
  inputBorderColor: '#334155',
  inputFocusBorderColor: '#f8fafc',

  // Dark header
  headerBackgroundColor: '#0f172a',
  headerTextColor: '#f8fafc',
  headerBorderBottom: '1px solid #334155',

  // Loading
  loadingColor: '#94a3b8',

  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
  boxShadowElevated: '0 4px 12px rgba(0, 0, 0, 0.4)',
  overlayColor: 'rgba(0, 0, 0, 0.8)',
}

/**
 * Elegant theme preset - Soft shadows, refined typography
 * Sophisticated and professional look
 */
export const ELEGANT_THEME_LIGHT: Partial<ThemeConfig> = {
  // Warm, sophisticated colors
  primaryColor: '#7c3aed',
  primaryColorHover: '#6d28d9',
  primaryColorLight: '#ede9fe',
  secondaryColor: '#a78bfa',
  accentColor: '#14b8a6',
  backgroundColor: '#fefefe',
  surfaceColor: '#f9fafb',
  textColor: '#1f2937',
  textColorMuted: '#6b7280',
  textColorInverse: '#ffffff',
  borderColor: '#e5e7eb',
  errorColor: '#ef4444',
  successColor: '#059669',
  warningColor: '#f59e0b',

  // Elegant bubbles with subtle styling
  userBubbleColor: '#7c3aed',
  userBubbleTextColor: '#ffffff',
  assistantBubbleColor: '#f3f4f6',
  assistantBubbleTextColor: '#1f2937',
  userBubbleBorderRadius: '18px 18px 6px 18px',
  assistantBubbleBorderRadius: '18px 18px 18px 6px',
  bubbleMaxWidth: '78%',

  // Refined typography
  fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
  headingFont: '"Inter", "SF Pro Display", sans-serif',
  fontSize: 15,
  fontSizeSmall: 13,
  fontSizeLarge: 17,
  fontSizeHeading: 22,
  fontWeight: '400',
  fontWeightBold: '600',
  lineHeight: 1.55,
  letterSpacing: '-0.01em',

  // Balanced border radius
  borderRadius: 14,
  buttonBorderRadius: 10,
  inputBorderRadius: 12,
  containerPadding: 18,
  messageGap: 14,

  // Soft, elegant shadows
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
  boxShadowElevated: '0 12px 40px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05)',
  overlayColor: 'rgba(31, 41, 55, 0.5)',
  transitionDuration: '0.2s',
  transitionEasing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',

  // Refined buttons
  sendButtonSize: 44,
  buttonPadding: '12px 24px',
  buttonFontSize: 15,
  disabledOpacity: 0.5,

  // Elegant input
  inputBackgroundColor: '#ffffff',
  inputBorderColor: '#e5e7eb',
  inputFocusBorderColor: '#7c3aed',
  inputPadding: '12px 16px',
  inputFontSize: 15,

  // Refined header
  headerBackgroundColor: '#ffffff',
  headerTextColor: '#1f2937',
  headerPadding: '16px 22px',
  headerBorderBottom: '1px solid #f3f4f6',
  logoHeight: 38,

  // Loading
  loadingColor: '#7c3aed',
  loadingDotSize: 8,
  loadingAnimationDuration: 1.3,
}

export const ELEGANT_THEME_DARK: Partial<ThemeConfig> = {
  // Dark elegant colors
  primaryColor: '#a78bfa',
  primaryColorHover: '#8b5cf6',
  primaryColorLight: '#2e1065',
  secondaryColor: '#c4b5fd',
  accentColor: '#2dd4bf',
  backgroundColor: '#111827',
  surfaceColor: '#1f2937',
  textColor: '#f9fafb',
  textColorMuted: '#9ca3af',
  textColorInverse: '#111827',
  borderColor: '#374151',
  errorColor: '#f87171',
  successColor: '#34d399',
  warningColor: '#fbbf24',

  // Dark elegant bubbles
  userBubbleColor: '#8b5cf6',
  userBubbleTextColor: '#ffffff',
  assistantBubbleColor: '#1f2937',
  assistantBubbleTextColor: '#f9fafb',

  // Dark input
  inputBackgroundColor: '#1f2937',
  inputBorderColor: '#374151',
  inputFocusBorderColor: '#a78bfa',

  // Dark header
  headerBackgroundColor: '#111827',
  headerTextColor: '#f9fafb',
  headerBorderBottom: '1px solid #1f2937',

  // Loading
  loadingColor: '#a78bfa',

  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1)',
  boxShadowElevated: '0 12px 40px rgba(0, 0, 0, 0.3)',
  overlayColor: 'rgba(0, 0, 0, 0.7)',
}

/**
 * All style presets organized by style and mode
 */
export const THEME_STYLE_PRESETS: Record<ThemeStyle, { light: Partial<ThemeConfig>; dark: Partial<ThemeConfig> }> = {
  glass: { light: GLASS_THEME_LIGHT, dark: GLASS_THEME_DARK },
  minimal: { light: MINIMAL_THEME_LIGHT, dark: MINIMAL_THEME_DARK },
  elegant: { light: ELEGANT_THEME_LIGHT, dark: ELEGANT_THEME_DARK },
}

/**
 * Get the theme preset for a given style and mode
 */
export function getThemePreset(style: ThemeStyle, mode: 'light' | 'dark'): Partial<ThemeConfig> {
  return THEME_STYLE_PRESETS[style]?.[mode] ?? MINIMAL_THEME_LIGHT
}

/**
 * Get complete theme config by merging style preset with custom overrides
 */
export function createStyledTheme(
  style: ThemeStyle = 'minimal',
  mode: 'light' | 'dark' = 'light',
  overrides: Partial<ThemeConfig> = {}
): ThemeConfig {
  const preset = getThemePreset(style, mode)
  return deepMerge(
    {} as Record<string, unknown>,
    preset as Record<string, unknown>,
    overrides as Record<string, unknown>,
    { style, mode }
  ) as ThemeConfig
}

export interface ThemeManagerOptions {
  theme: ThemeConfig
  onChange?: (mode: ThemeMode, isDark: boolean, style: ThemeStyle) => void
  onStyleChange?: (style: ThemeStyle) => void
}

/**
 * Theme Manager for handling light/dark mode
 *
 * @example
 * ```typescript
 * const manager = createThemeManager({
 *   theme: {
 *     mode: 'auto',
 *     primaryColor: '#e91e63',
 *     darkTheme: {
 *       backgroundColor: '#1a1a1a',
 *       textColor: '#ffffff',
 *     }
 *   },
 *   onChange: (mode, isDark) => // console.log(`Theme: ${mode}, Dark: ${isDark}`)
 * })
 *
 * // Programmatically switch theme
 * manager.setTheme('dark')
 *
 * // Get current state
 * // console.log(manager.isDark()) // true/false
 * // console.log(manager.getMode()) // 'light' | 'dark' | 'auto'
 *
 * // Get resolved theme config
 * const config = manager.getResolvedTheme()
 *
 * // Clean up
 * manager.destroy()
 * ```
 */
export class ThemeManager {
  private theme: ThemeConfig
  private currentMode: ThemeMode
  private currentStyle: ThemeStyle
  private mediaQuery: MediaQueryList | null = null
  private onChange?: (mode: ThemeMode, isDark: boolean, style: ThemeStyle) => void
  private onStyleChange?: (style: ThemeStyle) => void
  private styleElement: HTMLStyleElement | null = null

  constructor(options: ThemeManagerOptions) {
    this.theme = options.theme
    this.currentMode = options.theme.mode || 'light'
    this.currentStyle = options.theme.style || 'minimal'
    this.onChange = options.onChange
    this.onStyleChange = options.onStyleChange

    // Listen for system preference changes if in auto mode
    if (typeof window !== 'undefined' && this.currentMode === 'auto') {
      this.setupMediaQueryListener()
    }
  }

  /**
   * Set the theme mode
   */
  setTheme(mode: ThemeMode): void {
    const previousMode = this.currentMode
    this.currentMode = mode

    if (mode === 'auto') {
      this.setupMediaQueryListener()
    } else if (this.mediaQuery) {
      this.removeMediaQueryListener()
    }

    // Only trigger change if mode actually changed
    if (previousMode !== mode) {
      this.notifyChange()
      this.updateStyles()
    }
  }

  /**
   * Get the current theme mode
   */
  getMode(): ThemeMode {
    return this.currentMode
  }

  /**
   * Set the theme style (glass, minimal, elegant)
   */
  setStyle(style: ThemeStyle): void {
    const previousStyle = this.currentStyle
    this.currentStyle = style
    this.theme.style = style

    if (previousStyle !== style) {
      this.onStyleChange?.(style)
      this.notifyChange()
      this.updateStyles()
    }
  }

  /**
   * Get the current theme style
   */
  getStyle(): ThemeStyle {
    return this.currentStyle
  }

  /**
   * Check if currently in dark mode
   */
  isDark(): boolean {
    if (this.currentMode === 'auto') {
      return this.getSystemPreference() === 'dark'
    }
    return this.currentMode === 'dark'
  }

  /**
   * Get the resolved theme configuration (with style and dark mode applied)
   */
  getResolvedTheme(): ThemeConfig {
    const isDark = this.isDark()
    const modeForPreset = isDark ? 'dark' : 'light'

    // Start with style preset
    const preset = getThemePreset(this.currentStyle, modeForPreset)

    // Merge with user theme
    let resolved = deepMerge(
      {} as Record<string, unknown>,
      preset as Record<string, unknown>,
      this.theme as Record<string, unknown>
    ) as ThemeConfig

    // Apply dark theme overrides if in dark mode
    if (isDark && this.theme.darkTheme) {
      resolved = deepMerge(
        {} as Record<string, unknown>,
        resolved as Record<string, unknown>,
        this.theme.darkTheme as Record<string, unknown>
      ) as ThemeConfig
    }

    return resolved
  }

  /**
   * Generate CSS for the current theme state
   */
  getCss(): string {
    // Get light theme with style preset
    const lightPreset = getThemePreset(this.currentStyle, 'light')
    const lightTheme = deepMerge(
      {} as Record<string, unknown>,
      lightPreset as Record<string, unknown>,
      this.theme as Record<string, unknown>
    ) as ThemeConfig
    const baseCSS = generateThemeCss(lightTheme)

    // Get dark theme with style preset
    const darkPreset = getThemePreset(this.currentStyle, 'dark')
    const darkTheme = deepMerge(
      {} as Record<string, unknown>,
      darkPreset as Record<string, unknown>,
      this.theme as Record<string, unknown>,
      (this.theme.darkTheme || {}) as Record<string, unknown>
    ) as ThemeConfig
    const darkCSS = generateThemeCss(darkTheme)

    // Include custom CSS from style presets
    const customCSS = lightTheme.customCSS || ''
    const darkCustomCSS = darkTheme.customCSS || ''

    // Build the complete CSS with media query support
    if (this.currentMode === 'auto') {
      return `
        ${baseCSS}
        ${customCSS}

        @media (prefers-color-scheme: dark) {
          ${darkCSS}
          ${darkCustomCSS}
        }

        .qe-widget[data-theme="dark"] {
          ${this.extractCssVars(darkCSS)}
        }

        .qe-widget[data-style="${this.currentStyle}"] {
          /* Style marker for JS hooks */
        }
      `
    }

    if (this.currentMode === 'dark') {
      return `
        ${darkCSS}
        ${darkCustomCSS}
      `
    }

    return `
      ${baseCSS}
      ${customCSS}
    `
  }

  /**
   * Update theme configuration
   */
  updateTheme(theme: Partial<ThemeConfig>): void {
    this.theme = deepMerge(
      {} as Record<string, unknown>,
      this.theme as Record<string, unknown>,
      theme as Record<string, unknown>
    ) as ThemeConfig

    // Handle style change
    if (theme.style && theme.style !== this.currentStyle) {
      this.setStyle(theme.style)
      return
    }

    // Handle mode change
    if (theme.mode && theme.mode !== this.currentMode) {
      this.setTheme(theme.mode)
    } else {
      this.updateStyles()
    }
  }

  /**
   * Inject theme styles into the document
   */
  injectStyles(containerId?: string): void {
    if (typeof document === 'undefined') return

    const styleId = containerId ? `qe-theme-${containerId}` : 'qe-theme-css'

    if (!this.styleElement) {
      this.styleElement = document.getElementById(styleId) as HTMLStyleElement

      if (!this.styleElement) {
        this.styleElement = document.createElement('style')
        this.styleElement.id = styleId
        document.head.appendChild(this.styleElement)
      }
    }

    this.styleElement.textContent = this.getCss()
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.removeMediaQueryListener()

    if (this.styleElement) {
      this.styleElement.remove()
      this.styleElement = null
    }
  }

  // Private methods

  private setupMediaQueryListener(): void {
    if (typeof window === 'undefined' || this.mediaQuery) return

    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handler = () => {
      this.notifyChange()
      this.updateStyles()
    }

    // Use addListener for older browser support
    if (this.mediaQuery.addEventListener) {
      this.mediaQuery.addEventListener('change', handler)
    } else {
      // Fallback for older browsers
      this.mediaQuery.addListener(handler)
    }
  }

  private removeMediaQueryListener(): void {
    this.mediaQuery = null
  }

  private getSystemPreference(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  private notifyChange(): void {
    this.onChange?.(this.currentMode, this.isDark(), this.currentStyle)
  }

  private updateStyles(): void {
    if (this.styleElement) {
      this.styleElement.textContent = this.getCss()
    }
  }

  private extractCssVars(css: string): string {
    // Extract CSS variables from the .qe-widget block
    const match = css.match(/\.qe-widget\s*\{\s*([^}]+)\s*\}/)
    return match ? match[1] : ''
  }
}

/**
 * Create a theme manager instance
 */
export function createThemeManager(options: ThemeManagerOptions): ThemeManager {
  return new ThemeManager(options)
}

/**
 * Default dark theme colors
 */
export const DEFAULT_DARK_THEME = {
  backgroundColor: '#1a1a1a',
  surfaceColor: '#2d2d2d',
  textColor: '#f5f5f5',
  textColorMuted: '#a0a0a0',
  borderColor: '#404040',
  inputBackgroundColor: '#2d2d2d',
  inputBorderColor: '#404040',
  assistantBubbleColor: '#2d2d2d',
  assistantBubbleTextColor: '#f5f5f5',
  headerBackgroundColor: '#1a1a1a',
  headerTextColor: '#f5f5f5',
  overlayColor: 'rgba(0, 0, 0, 0.8)',
  loadingColor: '#a0a0a0',
}
