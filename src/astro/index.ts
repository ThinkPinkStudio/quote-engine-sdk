/**
 * ThinkPink Quote Engine SDK - Astro Integration
 *
 * Provides helpers for using the Quote Engine in Astro projects.
 * Works with both static (SSG) and server-rendered (SSR) Astro sites.
 *
 * Usage in .astro files:
 * ```astro
 * ---
 * import { createQuoteEngineScript, getQuoteEngineConfig } from '@thinkpinkstudio/quote-engine-sdk/astro'
 *
 * const config = getQuoteEngineConfig({
 *   apiKey: import.meta.env.PUBLIC_QUOTE_ENGINE_API_KEY,
 *   language: 'it',
 * })
 * ---
 *
 * <div id="quote-engine-container"></div>
 * <script is:inline set:html={createQuoteEngineScript(config)} />
 * ```
 *
 * Or use with React/Vue islands:
 * ```astro
 * ---
 * import QuoteEngineIsland from '../components/QuoteEngineIsland'
 * ---
 *
 * <QuoteEngineIsland client:load apiKey={import.meta.env.PUBLIC_QUOTE_ENGINE_API_KEY} />
 * ```
 */

// Re-export core SDK
export {
  QuoteEngineClient,
  createQuoteEngine,
} from '../core/client'

export type {
  QuoteEngineConfig,
  Language,
  ThemeConfig,
  CallbackHandlers,
  ChatMessage,
  ChatSession,
  CustomerData,
  Quote,
  QuoteStatus,
  QuoteStep,
  WidgetState,
  WidgetOptions,
  QuoteEngineError,
  QuoteEngineErrorCode,
  PaymentInitResponse,
} from '../core/types'

export {
  formatCurrency,
  formatDate,
  generateThemeCss,
  translations,
  t,
  storage,
} from '../core/utils'

export { VERSION } from '../core/index'

// ============================================================================
// Astro-specific helpers
// ============================================================================

import type { QuoteEngineConfig } from '../core/types'

/**
 * Astro-specific configuration options
 */
export interface AstroQuoteEngineConfig extends QuoteEngineConfig {
  /** Container element ID (default: 'quote-engine-container') */
  containerId?: string
  /** Auto-initialize the widget on page load */
  autoInit?: boolean
  /** Mode: 'inline' renders in container, 'modal' adds floating button */
  mode?: 'inline' | 'modal'
}

/**
 * Build configuration from Astro environment variables.
 *
 * In Astro, public env vars use `import.meta.env.PUBLIC_*`
 */
export function getQuoteEngineConfig(
  overrides: Partial<AstroQuoteEngineConfig> & { apiKey: string }
): AstroQuoteEngineConfig {
  return {

    language: overrides.language || 'en',
    debug: overrides.debug || false,
    containerId: overrides.containerId || 'quote-engine-container',
    autoInit: overrides.autoInit !== false,
    mode: overrides.mode || 'inline',
    ...overrides,
  }
}

/**
 * Generate an inline script that initializes the Quote Engine widget
 * on the client side. Use with Astro's `<script is:inline>` directive.
 *
 * This outputs a self-contained script that:
 * 1. Loads the Quote Engine vanilla widget
 * 2. Initializes it with the given config
 * 3. Mounts it to the specified container
 */
export function createQuoteEngineScript(config: AstroQuoteEngineConfig): string {
  const serialized = JSON.stringify({
    apiKey: config.apiKey,
    language: config.language || 'en',
    debug: config.debug || false,
    theme: config.theme || {},
    containerId: config.containerId || 'quote-engine-container',
    mode: config.mode || 'inline',
  })

  return `
(function() {
  var config = ${serialized};

  function initQuoteEngine() {
    if (typeof window.QuoteEngine !== 'undefined') {
      window.QuoteEngine.init(config);
      return;
    }

    // If the vanilla bundle is loaded as a module
    import('${config.baseUrl || 'https://www.thinkpinkstudio.it'}/sdk/quote-engine.iife.js')
      .then(function(module) {
        if (module.init) {
          module.init(config);
        } else if (module.default && module.default.init) {
          module.default.init(config);
        }
      })
      .catch(function(err) {
        console.error('[QuoteEngine] Failed to load SDK:', err);

        // Fallback: load via script tag
        var script = document.createElement('script');
        script.src = (config.baseUrl || 'https://www.thinkpinkstudio.it') + '/sdk/quote-engine.iife.js';
        script.onload = function() {
          if (window.QuoteEngine) {
            window.QuoteEngine.init(config);
          }
        };
        document.head.appendChild(script);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuoteEngine);
  } else {
    initQuoteEngine();
  }
})();
`
}

/**
 * Generate the HTML snippet for embedding the Quote Engine in any page.
 * Useful for Astro's `set:html` directive.
 */
export function createQuoteEngineEmbed(config: AstroQuoteEngineConfig): string {
  const containerId = config.containerId || 'quote-engine-container'

  return `<div id="${containerId}" data-qe-api-key="${config.apiKey}" data-qe-language="${config.language || 'en'}" data-qe-mode="${config.mode || 'inline'}"></div>
<script>${createQuoteEngineScript(config)}</script>`
}

/**
 * Server-side helper: validate an API key during SSR.
 * Useful in Astro API routes or middleware.
 *
 * ```ts
 * // src/pages/api/validate-key.ts
 * import { validateApiKeyServer } from '@thinkpinkstudio/quote-engine-sdk/astro'
 *
 * export async function GET({ request }) {
 *   const result = await validateApiKeyServer('your-key', 'https://www.thinkpinkstudio.it')
 *   return new Response(JSON.stringify(result))
 * }
 * ```
 */
export async function validateApiKeyServer(
  apiKey: string,
  baseUrl: string = 'https://www.thinkpinkstudio.it'
): Promise<{ valid: boolean; tenant?: Record<string, unknown>; error?: string }> {
  try {
    const response = await fetch(`${baseUrl}/api/qe-sdk/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      return { valid: false, error: data.error?.message || 'Invalid API key' }
    }

    const data = await response.json()
    return { valid: true, tenant: data.data?.tenant }
  } catch (error: any) {
    return { valid: false, error: error.message || 'Network error' }
  }
}

/**
 * Astro View Transitions support.
 * Re-initializes the widget after Astro page transitions.
 */
export function createViewTransitionScript(config: AstroQuoteEngineConfig): string {
  return `
document.addEventListener('astro:page-load', function() {
  var container = document.getElementById('${config.containerId || 'quote-engine-container'}');
  if (container && window.QuoteEngine) {
    window.QuoteEngine.init(${JSON.stringify({
    apiKey: config.apiKey,
    language: config.language || 'en',
    debug: config.debug || false,
    theme: config.theme || {},
    containerId: config.containerId || 'quote-engine-container',
    mode: config.mode || 'inline',
  })});
  }
});
`
}
