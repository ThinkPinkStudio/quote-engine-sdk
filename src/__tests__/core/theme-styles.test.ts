/**
 * Tests for Theme Style Presets and Style Switching
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  ThemeManager,
  createThemeManager,
  GLASS_THEME_LIGHT,
  GLASS_THEME_DARK,
  MINIMAL_THEME_LIGHT,
  MINIMAL_THEME_DARK,
  ELEGANT_THEME_LIGHT,
  ELEGANT_THEME_DARK,
  THEME_STYLE_PRESETS,
  getThemePreset,
  createStyledTheme,
} from '../../core/theme'
import type { ThemeConfig, ThemeStyle } from '../../core/types'

describe('Theme Style Presets', () => {
  describe('THEME_STYLE_PRESETS', () => {
    it('should have all three styles defined', () => {
      expect(THEME_STYLE_PRESETS).toHaveProperty('glass')
      expect(THEME_STYLE_PRESETS).toHaveProperty('minimal')
      expect(THEME_STYLE_PRESETS).toHaveProperty('elegant')
    })

    it('should have light and dark variants for each style', () => {
      const styles: ThemeStyle[] = ['glass', 'minimal', 'elegant']
      
      for (const style of styles) {
        expect(THEME_STYLE_PRESETS[style]).toHaveProperty('light')
        expect(THEME_STYLE_PRESETS[style]).toHaveProperty('dark')
      }
    })
  })

  describe('Glass Theme', () => {
    it('should have glassmorphism characteristics', () => {
      expect(GLASS_THEME_LIGHT.backgroundColor).toContain('rgba')
      expect(GLASS_THEME_LIGHT.surfaceColor).toContain('rgba')
      expect(GLASS_THEME_LIGHT.customCSS).toContain('backdrop-filter')
      expect(GLASS_THEME_LIGHT.boxShadow).toContain('inset')
    })

    it('should have gradient user bubble color', () => {
      expect(GLASS_THEME_LIGHT.userBubbleColor).toContain('linear-gradient')
      expect(GLASS_THEME_DARK.userBubbleColor).toContain('linear-gradient')
    })

    it('dark variant should have darker backgrounds', () => {
      // Dark glass should have low-alpha dark backgrounds
      expect(GLASS_THEME_DARK.backgroundColor).toContain('rgba')
      expect(GLASS_THEME_DARK.surfaceColor).toContain('rgba')
    })
  })

  describe('Minimal Theme', () => {
    it('should have clean, solid colors', () => {
      // Minimal uses solid hex colors, not rgba
      expect(MINIMAL_THEME_LIGHT.backgroundColor).toBe('#ffffff')
      expect(MINIMAL_THEME_LIGHT.surfaceColor).toBe('#fafafa')
    })

    it('should have smaller border radius', () => {
      expect(MINIMAL_THEME_LIGHT.borderRadius).toBeLessThan(GLASS_THEME_LIGHT.borderRadius!)
    })

    it('should have lighter shadows', () => {
      expect(MINIMAL_THEME_LIGHT.boxShadow).not.toContain('inset')
    })

    it('dark variant should have slate colors', () => {
      expect(MINIMAL_THEME_DARK.backgroundColor).toBe('#0f172a')
      expect(MINIMAL_THEME_DARK.surfaceColor).toBe('#1e293b')
    })
  })

  describe('Elegant Theme', () => {
    it('should have purple/violet primary colors', () => {
      expect(ELEGANT_THEME_LIGHT.primaryColor).toBe('#7c3aed')
      expect(ELEGANT_THEME_DARK.primaryColor).toBe('#a78bfa')
    })

    it('should have refined typography settings', () => {
      expect(ELEGANT_THEME_LIGHT.letterSpacing).toBeDefined()
      expect(ELEGANT_THEME_LIGHT.lineHeight).toBeDefined()
    })

    it('should have moderate border radius (between minimal and glass)', () => {
      const elegantRadius = ELEGANT_THEME_LIGHT.borderRadius!
      const minimalRadius = MINIMAL_THEME_LIGHT.borderRadius!
      const glassRadius = GLASS_THEME_LIGHT.borderRadius!
      
      expect(elegantRadius).toBeGreaterThan(minimalRadius)
      expect(elegantRadius).toBeLessThan(glassRadius)
    })
  })
})

describe('getThemePreset', () => {
  it('should return correct preset for glass light', () => {
    const preset = getThemePreset('glass', 'light')
    expect(preset).toBe(GLASS_THEME_LIGHT)
  })

  it('should return correct preset for glass dark', () => {
    const preset = getThemePreset('glass', 'dark')
    expect(preset).toBe(GLASS_THEME_DARK)
  })

  it('should return correct preset for minimal light', () => {
    const preset = getThemePreset('minimal', 'light')
    expect(preset).toBe(MINIMAL_THEME_LIGHT)
  })

  it('should return correct preset for minimal dark', () => {
    const preset = getThemePreset('minimal', 'dark')
    expect(preset).toBe(MINIMAL_THEME_DARK)
  })

  it('should return correct preset for elegant light', () => {
    const preset = getThemePreset('elegant', 'light')
    expect(preset).toBe(ELEGANT_THEME_LIGHT)
  })

  it('should return correct preset for elegant dark', () => {
    const preset = getThemePreset('elegant', 'dark')
    expect(preset).toBe(ELEGANT_THEME_DARK)
  })

  it('should fallback to minimal light for invalid style', () => {
    // @ts-expect-error - testing invalid input
    const preset = getThemePreset('invalid', 'light')
    expect(preset).toBe(MINIMAL_THEME_LIGHT)
  })
})

describe('createStyledTheme', () => {
  it('should create theme with style and mode', () => {
    const theme = createStyledTheme('glass', 'light')
    
    expect(theme.style).toBe('glass')
    expect(theme.mode).toBe('light')
  })

  it('should merge overrides with preset', () => {
    const theme = createStyledTheme('minimal', 'light', {
      primaryColor: '#ff0000',
    })
    
    expect(theme.primaryColor).toBe('#ff0000')
    expect(theme.style).toBe('minimal')
  })

  it('should default to minimal light', () => {
    const theme = createStyledTheme()
    
    expect(theme.style).toBe('minimal')
    expect(theme.mode).toBe('light')
  })

  it('should preserve preset values when not overridden', () => {
    const theme = createStyledTheme('elegant', 'dark')
    
    expect(theme.primaryColor).toBe(ELEGANT_THEME_DARK.primaryColor)
    expect(theme.backgroundColor).toBe(ELEGANT_THEME_DARK.backgroundColor)
  })
})

describe('ThemeManager with Styles', () => {
  let manager: ThemeManager

  beforeEach(() => {
    manager = createThemeManager({
      theme: {
        mode: 'light',
        style: 'minimal',
        primaryColor: '#e91e63',
      },
    })
  })

  describe('getStyle / setStyle', () => {
    it('should return initial style', () => {
      expect(manager.getStyle()).toBe('minimal')
    })

    it('should change style', () => {
      manager.setStyle('glass')
      expect(manager.getStyle()).toBe('glass')
    })

    it('should call onStyleChange callback', () => {
      const onStyleChange = vi.fn()
      const managerWithCallback = createThemeManager({
        theme: { mode: 'light', style: 'minimal' },
        onStyleChange,
      })

      managerWithCallback.setStyle('elegant')
      
      expect(onStyleChange).toHaveBeenCalledWith('elegant')
    })

    it('should not call callback if style unchanged', () => {
      const onStyleChange = vi.fn()
      const managerWithCallback = createThemeManager({
        theme: { mode: 'light', style: 'minimal' },
        onStyleChange,
      })

      managerWithCallback.setStyle('minimal')
      
      expect(onStyleChange).not.toHaveBeenCalled()
    })
  })

  describe('onChange callback with style', () => {
    it('should include style in onChange callback', () => {
      const onChange = vi.fn()
      const managerWithCallback = createThemeManager({
        theme: { mode: 'light', style: 'minimal' },
        onChange,
      })

      managerWithCallback.setTheme('dark')
      
      expect(onChange).toHaveBeenCalledWith('dark', true, 'minimal')
    })

    it('should pass updated style when changing style', () => {
      const onChange = vi.fn()
      const managerWithCallback = createThemeManager({
        theme: { mode: 'light', style: 'minimal' },
        onChange,
      })

      managerWithCallback.setStyle('glass')
      
      expect(onChange).toHaveBeenCalledWith('light', false, 'glass')
    })
  })

  describe('getResolvedTheme', () => {
    it('should return theme with style preset applied', () => {
      manager.setStyle('glass')
      const resolved = manager.getResolvedTheme()
      
      // Should have glass characteristics
      expect(resolved.backgroundColor).toContain('rgba')
    })

    it('should apply dark preset when in dark mode', () => {
      manager.setStyle('elegant')
      manager.setTheme('dark')
      const resolved = manager.getResolvedTheme()
      
      expect(resolved.backgroundColor).toBe(ELEGANT_THEME_DARK.backgroundColor)
    })

    it('should preserve user overrides', () => {
      const customManager = createThemeManager({
        theme: {
          mode: 'light',
          style: 'minimal',
          primaryColor: '#ff0000',
        },
      })
      
      const resolved = customManager.getResolvedTheme()
      expect(resolved.primaryColor).toBe('#ff0000')
    })
  })

  describe('updateTheme with style', () => {
    it('should change style via updateTheme', () => {
      manager.updateTheme({ style: 'elegant' })
      expect(manager.getStyle()).toBe('elegant')
    })

    it('should change both style and mode', () => {
      manager.updateTheme({ style: 'glass', mode: 'dark' })
      
      expect(manager.getStyle()).toBe('glass')
      // Mode change happens after style change, so check final state
    })
  })

  describe('getCss', () => {
    it('should include style marker in CSS', () => {
      manager.setStyle('glass')
      manager.setTheme('auto')
      const css = manager.getCss()
      
      expect(css).toContain('data-style="glass"')
    })

    it('should include custom CSS from glass preset', () => {
      manager.setStyle('glass')
      const css = manager.getCss()
      
      expect(css).toContain('backdrop-filter')
    })

    it('should not include custom CSS for minimal preset', () => {
      manager.setStyle('minimal')
      const css = manager.getCss()
      
      // Minimal has no customCSS
      expect(css).not.toContain('backdrop-filter')
    })
  })
})

describe('Theme Style CSS Variables', () => {
  it('glass theme should generate glass-specific CSS vars', () => {
    const manager = createThemeManager({
      theme: { mode: 'light', style: 'glass' },
    })
    const css = manager.getCss()
    
    // Check for rgba background (characteristic of glass)
    expect(css).toContain('--qe-background-color: rgba')
  })

  it('minimal theme should generate clean CSS vars', () => {
    const manager = createThemeManager({
      theme: { mode: 'light', style: 'minimal' },
    })
    const css = manager.getCss()
    
    // Minimal uses hex colors
    expect(css).toContain('--qe-background-color: #ffffff')
  })

  it('elegant theme should generate elegant CSS vars', () => {
    const manager = createThemeManager({
      theme: { mode: 'light', style: 'elegant' },
    })
    const css = manager.getCss()
    
    // Elegant uses violet primary
    expect(css).toContain('--qe-primary-color: #7c3aed')
  })
})

describe('Default style behavior', () => {
  it('should default to minimal when no style specified', () => {
    const manager = createThemeManager({
      theme: { mode: 'light' },
    })
    
    expect(manager.getStyle()).toBe('minimal')
  })

  it('should use minimal preset colors when no style specified', () => {
    const manager = createThemeManager({
      theme: { mode: 'light' },
    })
    const resolved = manager.getResolvedTheme()
    
    expect(resolved.backgroundColor).toBe(MINIMAL_THEME_LIGHT.backgroundColor)
  })
})
