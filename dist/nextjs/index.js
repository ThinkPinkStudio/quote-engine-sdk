"use strict";
"use client";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/nextjs/index.tsx
var index_exports = {};
__export(index_exports, {
  Analytics: () => Analytics,
  ApiKeyValidationError: () => ApiKeyValidationError,
  ClientOnly: () => ClientOnly,
  DEFAULT_DARK_THEME: () => DEFAULT_DARK_THEME,
  ELEGANT_THEME_DARK: () => ELEGANT_THEME_DARK,
  ELEGANT_THEME_LIGHT: () => ELEGANT_THEME_LIGHT,
  GLASS_THEME_DARK: () => GLASS_THEME_DARK,
  GLASS_THEME_LIGHT: () => GLASS_THEME_LIGHT,
  MINIMAL_THEME_DARK: () => MINIMAL_THEME_DARK,
  MINIMAL_THEME_LIGHT: () => MINIMAL_THEME_LIGHT,
  PLAN_LIMITS: () => PLAN_LIMITS,
  PLAN_PRICING: () => PLAN_PRICING,
  QuoteEngineClient: () => QuoteEngineClient,
  QuoteEngineProvider: () => QuoteEngineProvider,
  SCOPE_PERMISSIONS: () => SCOPE_PERMISSIONS,
  THEME_STYLE_PRESETS: () => THEME_STYLE_PRESETS,
  ThemeManager: () => ThemeManager,
  VERSION: () => VERSION,
  WEBHOOK_ID_HEADER: () => WEBHOOK_ID_HEADER,
  WEBHOOK_SIGNATURE_HEADER: () => WEBHOOK_SIGNATURE_HEADER,
  WEBHOOK_TIMESTAMP_HEADER: () => WEBHOOK_TIMESTAMP_HEADER,
  WebhookClient: () => WebhookClient,
  assertPermission: () => assertPermission,
  calculatePricingSummary: () => calculatePricingSummary,
  computeSignature: () => computeSignature,
  constructEvent: () => constructEvent,
  createAnalytics: () => createAnalytics,
  createAnalyticsFromConfig: () => createAnalyticsFromConfig,
  createQuoteEngine: () => createQuoteEngine,
  createStyledTheme: () => createStyledTheme,
  createThemeManager: () => createThemeManager,
  createWebhookClient: () => createWebhookClient,
  debounce: () => debounce,
  deepMerge: () => deepMerge,
  formatCurrency: () => formatCurrency,
  formatDate: () => formatDate,
  formatQuoteNumber: () => formatQuoteNumber,
  generateThemeCss: () => generateThemeCss,
  getApiKeyPermissions: () => getApiKeyPermissions,
  getCountryFromLocale: () => getCountryFromLocale,
  getDaysUntilExpiry: () => getDaysUntilExpiry,
  getLocaleFromLanguage: () => getLocaleFromLanguage,
  getQuoteServer: () => getQuoteServer,
  getScopeDescription: () => getScopeDescription,
  getThemePreset: () => getThemePreset,
  hasPermission: () => hasPermission,
  isLiveKey: () => isLiveKey,
  isQuoteExpired: () => isQuoteExpired,
  isTestKey: () => isTestKey,
  isValidApiKeyFormat: () => isValidApiKeyFormat,
  isValidEmail: () => isValidEmail,
  isValidPhone: () => isValidPhone,
  listEnabledPermissions: () => listEnabledPermissions,
  maskApiKey: () => maskApiKey,
  parseApiKey: () => parseApiKey,
  storage: () => storage,
  t: () => t,
  throttle: () => throttle,
  translations: () => translations,
  useCustomerForm: () => useCustomerForm,
  usePayment: () => usePayment,
  useQuote: () => useQuote,
  useQuoteChat: () => useQuoteChat,
  useQuoteEngineConfig: () => useQuoteEngineConfig,
  useQuoteEngineContext: () => useQuoteEngineContext,
  useQuoteEngineEvent: () => useQuoteEngineEvent,
  useQuoteWidget: () => useQuoteWidget,
  validateApiKey: () => validateApiKey2,
  verifySignature: () => verifySignature
});
module.exports = __toCommonJS(index_exports);
var import_react3 = require("react");

// src/react/QuoteEngineProvider.tsx
var import_react = require("react");

// src/core/utils.ts
function formatCurrency(amount, currency = "EUR", locale = "it-IT") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}
function formatDate(date, locale = "it-IT", options) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options
  }).format(d);
}
function formatQuoteNumber(quoteNumber) {
  return quoteNumber.toUpperCase();
}
function getDaysUntilExpiry(expiresAt) {
  const expiry = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
  const now = /* @__PURE__ */ new Date();
  const diff = expiry.getTime() - now.getTime();
  return Math.ceil(diff / (1e3 * 60 * 60 * 24));
}
function isQuoteExpired(quote) {
  return new Date(quote.expiresAt) < /* @__PURE__ */ new Date();
}
function generateThemeCss(theme) {
  const vars = [];
  const set = (name, value) => {
    if (value !== void 0 && value !== null) {
      vars.push(`--qe-${name}: ${value}`);
    }
  };
  const setPx = (name, value) => {
    if (value !== void 0 && value !== null) {
      vars.push(`--qe-${name}: ${value}px`);
    }
  };
  if (theme.primaryColor) {
    set("primary-color", theme.primaryColor);
    set("primary-color-hover", theme.primaryColorHover || adjustColor(theme.primaryColor, -10));
    set("primary-color-light", theme.primaryColorLight || adjustColor(theme.primaryColor, 40));
  }
  set("secondary-color", theme.secondaryColor);
  set("accent-color", theme.accentColor);
  set("background-color", theme.backgroundColor);
  set("surface-color", theme.surfaceColor);
  if (theme.textColor) {
    set("text-color", theme.textColor);
    set("text-color-muted", theme.textColorMuted || adjustColor(theme.textColor, 30));
  } else if (theme.textColorMuted) {
    set("text-color-muted", theme.textColorMuted);
  }
  set("text-color-inverse", theme.textColorInverse);
  set("border-color", theme.borderColor);
  set("error-color", theme.errorColor);
  set("success-color", theme.successColor);
  set("warning-color", theme.warningColor);
  set("user-bubble-color", theme.userBubbleColor);
  set("user-bubble-text-color", theme.userBubbleTextColor);
  set("assistant-bubble-color", theme.assistantBubbleColor);
  set("assistant-bubble-text-color", theme.assistantBubbleTextColor);
  set("user-bubble-border-radius", theme.userBubbleBorderRadius);
  set("assistant-bubble-border-radius", theme.assistantBubbleBorderRadius);
  set("bubble-max-width", theme.bubbleMaxWidth);
  set("font-family", theme.fontFamily);
  set("heading-font", theme.headingFont);
  setPx("font-size", theme.fontSize);
  setPx("font-size-small", theme.fontSizeSmall);
  setPx("font-size-large", theme.fontSizeLarge);
  setPx("font-size-heading", theme.fontSizeHeading);
  set("font-weight", theme.fontWeight);
  set("font-weight-bold", theme.fontWeightBold);
  set("line-height", theme.lineHeight);
  set("letter-spacing", theme.letterSpacing);
  setPx("border-radius", theme.borderRadius);
  setPx("button-border-radius", theme.buttonBorderRadius);
  setPx("input-border-radius", theme.inputBorderRadius);
  setPx("container-padding", theme.containerPadding);
  setPx("message-gap", theme.messageGap);
  set("widget-height", theme.widgetHeight);
  set("widget-max-height", theme.widgetMaxHeight);
  set("widget-width", theme.widgetWidth);
  set("box-shadow", theme.boxShadow);
  set("box-shadow-elevated", theme.boxShadowElevated);
  set("overlay-color", theme.overlayColor);
  set("transition-duration", theme.transitionDuration);
  set("transition-easing", theme.transitionEasing);
  setPx("send-button-size", theme.sendButtonSize);
  set("button-padding", theme.buttonPadding);
  setPx("button-font-size", theme.buttonFontSize);
  set("disabled-opacity", theme.disabledOpacity);
  set("input-background-color", theme.inputBackgroundColor);
  set("input-border-color", theme.inputBorderColor);
  set("input-focus-border-color", theme.inputFocusBorderColor);
  set("input-padding", theme.inputPadding);
  setPx("input-font-size", theme.inputFontSize);
  set("header-background-color", theme.headerBackgroundColor);
  set("header-text-color", theme.headerTextColor);
  set("header-padding", theme.headerPadding);
  set("header-border-bottom", theme.headerBorderBottom);
  setPx("logo-height", theme.logoHeight);
  set("loading-color", theme.loadingColor);
  setPx("loading-dot-size", theme.loadingDotSize);
  if (theme.loadingAnimationDuration) {
    set("loading-animation-duration", `${theme.loadingAnimationDuration}s`);
  }
  return `.qe-widget { ${vars.join("; ")} }`;
}
function adjustColor(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, (num >> 8 & 255) + amt));
  const B = Math.min(255, Math.max(0, (num & 255) + amt));
  return `#${(16777216 + R * 65536 + G * 256 + B).toString(16).slice(1)}`;
}
function debounce(func, wait) {
  let timeout = null;
  return function(...args) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
function throttle(func, limit) {
  let inThrottle = false;
  return function(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
function isValidPhone(phone) {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
  return phone.length >= 8 && phoneRegex.test(phone);
}
function getCountryFromLocale(locale) {
  const parts = locale.split("-");
  return parts.length > 1 ? parts[1].toUpperCase() : parts[0].toUpperCase();
}
function getLocaleFromLanguage(language) {
  const localeMap = {
    it: "it-IT",
    en: "en-GB",
    de: "de-DE",
    fr: "fr-FR",
    es: "es-ES",
    nl: "nl-NL",
    pt: "pt-PT"
  };
  return localeMap[language] || "en-GB";
}
function deepMerge(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(
          target[key],
          source[key]
        );
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return deepMerge(target, ...sources);
}
function isObject(item) {
  return item !== null && typeof item === "object" && !Array.isArray(item);
}
function calculatePricingSummary(pricing) {
  const totalHours = pricing.breakdown.reduce((sum, item) => sum + item.hours, 0);
  const averageRate = totalHours > 0 ? pricing.subtotal / totalHours : 0;
  const discountTotal = pricing.discounts.reduce(
    (sum, discount) => sum + discount.amount,
    0
  );
  const netAmount = pricing.subtotalAfterDiscounts;
  return {
    totalHours,
    averageRate: Math.round(averageRate * 100) / 100,
    discountTotal,
    netAmount
  };
}
var storage = {
  get(key) {
    if (typeof window === "undefined") return null;
    try {
      const item = localStorage.getItem(`qe_${key}`);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set(key, value) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(`qe_${key}`, JSON.stringify(value));
    } catch {
    }
  },
  remove(key) {
    if (typeof window === "undefined") return;
    localStorage.removeItem(`qe_${key}`);
  },
  clear() {
    if (typeof window === "undefined") return;
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("qe_")) {
        keys.push(key);
      }
    }
    keys.forEach((key) => localStorage.removeItem(key));
  }
};
var translations = {
  it: {
    chat: {
      placeholder: "Descrivi il tuo progetto...",
      send: "Invia",
      typing: "Sta scrivendo..."
    },
    quote: {
      title: "Il tuo preventivo",
      subtotal: "Subtotale",
      vat: "IVA",
      total: "Totale",
      deposit: "Acconto",
      expiresIn: "Scade tra",
      days: "giorni"
    },
    payment: {
      title: "Pagamento",
      payNow: "Paga ora",
      processing: "Elaborazione..."
    },
    errors: {
      required: "Campo obbligatorio",
      invalidEmail: "Email non valida",
      networkError: "Errore di rete"
    }
  },
  en: {
    chat: {
      placeholder: "Describe your project...",
      send: "Send",
      typing: "Typing..."
    },
    quote: {
      title: "Your Quote",
      subtotal: "Subtotal",
      vat: "VAT",
      total: "Total",
      deposit: "Deposit",
      expiresIn: "Expires in",
      days: "days"
    },
    payment: {
      title: "Payment",
      payNow: "Pay Now",
      processing: "Processing..."
    },
    errors: {
      required: "Required field",
      invalidEmail: "Invalid email",
      networkError: "Network error"
    }
  },
  de: {
    chat: {
      placeholder: "Beschreiben Sie Ihr Projekt...",
      send: "Senden",
      typing: "Tippt..."
    },
    quote: {
      title: "Ihr Angebot",
      subtotal: "Zwischensumme",
      vat: "MwSt.",
      total: "Gesamt",
      deposit: "Anzahlung",
      expiresIn: "L\xE4uft ab in",
      days: "Tagen"
    },
    payment: {
      title: "Zahlung",
      payNow: "Jetzt bezahlen",
      processing: "Verarbeitung..."
    },
    errors: {
      required: "Pflichtfeld",
      invalidEmail: "Ung\xFCltige E-Mail",
      networkError: "Netzwerkfehler"
    }
  },
  fr: {
    chat: {
      placeholder: "D\xE9crivez votre projet...",
      send: "Envoyer",
      typing: "\xC9crit..."
    },
    quote: {
      title: "Votre Devis",
      subtotal: "Sous-total",
      vat: "TVA",
      total: "Total",
      deposit: "Acompte",
      expiresIn: "Expire dans",
      days: "jours"
    },
    payment: {
      title: "Paiement",
      payNow: "Payer maintenant",
      processing: "Traitement..."
    },
    errors: {
      required: "Champ obligatoire",
      invalidEmail: "Email invalide",
      networkError: "Erreur r\xE9seau"
    }
  },
  es: {
    chat: {
      placeholder: "Describe tu proyecto...",
      send: "Enviar",
      typing: "Escribiendo..."
    },
    quote: {
      title: "Tu Presupuesto",
      subtotal: "Subtotal",
      vat: "IVA",
      total: "Total",
      deposit: "Dep\xF3sito",
      expiresIn: "Expira en",
      days: "d\xEDas"
    },
    payment: {
      title: "Pago",
      payNow: "Pagar ahora",
      processing: "Procesando..."
    },
    errors: {
      required: "Campo obligatorio",
      invalidEmail: "Email inv\xE1lido",
      networkError: "Error de red"
    }
  }
};
function t(language, category, key) {
  const lang = language in translations ? language : "en";
  const trans = translations[lang];
  const cat = trans[category];
  return cat?.[key] || key;
}

// src/core/client.ts
var DEFAULT_BASE_URL = "https://www.thinkpinkstudio.it";
var DEFAULT_TIMEOUT = 3e4;
var DEFAULT_MAX_RETRIES = 3;
var DEFAULT_RETRY_BASE_DELAY = 1e3;
var EventEmitter = class {
  constructor() {
    this.listeners = /* @__PURE__ */ new Map();
  }
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, /* @__PURE__ */ new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }
  off(event, callback) {
    this.listeners.get(event)?.delete(callback);
  }
  emit(event, ...args) {
    this.listeners.get(event)?.forEach((callback) => {
      try {
        callback(...args);
      } catch (e) {
        console.error(`Error in event handler for ${event}:`, e);
      }
    });
  }
};
var _QuoteEngineClient = class _QuoteEngineClient extends EventEmitter {
  constructor(config) {
    super();
    this.currentSession = null;
    this.currentQuote = null;
    this.abortController = null;
    this.lastRAGInsight = null;
    this.validateConfig(config);
    this.storage = config.storage || storage;
    this.config = {
      ...config,
      baseUrl: DEFAULT_BASE_URL,
      // Fixed, not configurable
      language: config.language || "en",
      debug: config.debug || false,
      timeout: config.timeout || DEFAULT_TIMEOUT,
      maxRetries: config.maxRetries ?? DEFAULT_MAX_RETRIES,
      retryBaseDelay: config.retryBaseDelay ?? DEFAULT_RETRY_BASE_DELAY,
      persistSession: config.persistSession ?? true
    };
    if (config.callbacks) {
      this.registerCallbacks(config.callbacks);
    }
    if (this.config.persistSession) {
      this.restoreSession();
    }
    this.log("QuoteEngineClient initialized");
    this.emit("ready");
    this.config.callbacks?.onReady?.();
  }
  /**
   * Validate the API key and fetch tenant configuration.
   * Call this after construction to verify the key is valid
   * and load the tenant branding/config from the backend.
   */
  async validateKey() {
    const response = await this.fetch("/api/qe-sdk/validate", {
      method: "POST"
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw this.createError(
        "INVALID_API_KEY",
        error.error?.message || "API key validation failed"
      );
    }
    const data = await response.json();
    return data.data;
  }
  // ===========================================================================
  // Configuration
  // ===========================================================================
  /**
   * Update configuration
   */
  setConfig(config) {
    const { baseUrl, ...rest } = config;
    this.config = { ...this.config, ...rest };
    if (config.callbacks) {
      this.registerCallbacks(config.callbacks);
    }
  }
  /**
   * Get current configuration
   */
  getConfig() {
    return { ...this.config };
  }
  /**
   * Set language
   */
  setLanguage(language) {
    this.config.language = language;
  }
  // ===========================================================================
  // Chat Operations
  // ===========================================================================
  /**
   * Start a new chat session
   */
  async startChat(customerData) {
    this.log("Starting new chat session");
    this.emit("chatStart");
    this.config.callbacks?.onChatStart?.();
    const session = {
      id: this.generateId(),
      messages: [],
      status: "active",
      customerData,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.currentSession = session;
    this.saveSession();
    return session;
  }
  /**
   * Send a message and get AI response (streaming)
   */
  async sendMessage(content, onChunk) {
    if (!this.currentSession) {
      throw this.createError("SESSION_EXPIRED", "No active chat session");
    }
    const userMessage = {
      id: this.generateId(),
      role: "user",
      content,
      timestamp: /* @__PURE__ */ new Date()
    };
    this.currentSession.messages.push(userMessage);
    this.currentSession.updatedAt = /* @__PURE__ */ new Date();
    this.emit("messageSent", userMessage);
    this.config.callbacks?.onMessageSent?.(userMessage);
    this.log("Sending message", { content: content.substring(0, 50) + "..." });
    try {
      const assistantMessage = await this.streamChat(
        this.currentSession.messages,
        onChunk
      );
      this.currentSession.messages.push(assistantMessage);
      this.currentSession.updatedAt = /* @__PURE__ */ new Date();
      this.saveSession();
      this.emit("messageReceived", assistantMessage);
      this.config.callbacks?.onMessageReceived?.(assistantMessage);
      if (assistantMessage.metadata?.shouldGenerateQuote) {
        this.log("AI suggests generating quote");
      }
      return assistantMessage;
    } catch (error) {
      const qeError = this.handleError(error);
      this.emit("error", qeError);
      this.config.callbacks?.onError?.(qeError);
      throw qeError;
    }
  }
  /**
   * Stream chat response from API
   */
  async streamChat(messages, onChunk) {
    this.abortController = new AbortController();
    const response = await this.fetch("/api/qe-sdk/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content
        })),
        language: this.config.language,
        customerData: this.currentSession?.customerData
      }),
      signal: this.abortController.signal
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw this.createError(
        "CHAT_ERROR",
        error.message || "Failed to send message"
      );
    }
    const body = response.body;
    if (!body) {
      throw this.createError("CHAT_ERROR", "No response body");
    }
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let fullContent = "";
    let metadata = {};
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        let chunk;
        console.error("DEBUG_CHUNK:", typeof value, value);
        if (typeof value === "string") {
          chunk = value;
        } else if (value) {
          try {
            const buffer = value instanceof Uint8Array ? value : Uint8Array.from(value);
            chunk = decoder.decode(buffer, { stream: true });
          } catch {
            chunk = String(value);
          }
        } else {
          chunk = "";
        }
        const lines = chunk.split("\n");
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          if (!line.startsWith("data: ")) {
            this.log(`Ignoring non-data line: ${line}`);
            continue;
          }
          const jsonStr = line.replace("data: ", "");
          try {
            const event = JSON.parse(jsonStr);
            this.log(`Parsed event type: ${event.type}`);
            if (event.type === "content" && event.data.text) {
              fullContent += event.data.text;
              onChunk?.(event.data.text);
            } else if (event.type === "rag_context") {
              const ragInsight = {
                dataPoints: event.dataPoints || 0,
                confidence: event.confidence || 0,
                similarProjectsCount: event.similarProjectsCount || 0,
                pricingRange: event.pricingRange
              };
              this.lastRAGInsight = ragInsight;
              this.emit("ragContextReceived", ragInsight);
            } else if (event.type === "metadata") {
              metadata = {
                confidence: event.data.confidence,
                shouldGenerateQuote: event.data.shouldGenerateQuote
              };
            } else if (event.type === "error") {
              throw this.createError("CHAT_ERROR", event.data.error || "Stream error");
            }
          } catch {
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
    return {
      id: this.generateId(),
      role: "assistant",
      content: fullContent,
      timestamp: /* @__PURE__ */ new Date(),
      metadata
    };
  }
  /**
   * Cancel ongoing chat request
   */
  cancelChat() {
    this.abortController?.abort();
    this.abortController = null;
  }
  /**
   * Get current chat session
   */
  getSession() {
    return this.currentSession;
  }
  /**
   * Get the last RAG insight received during chat
   */
  getLastRAGInsight() {
    return this.lastRAGInsight;
  }
  /**
   * Clear current session
   */
  clearSession() {
    this.currentSession = null;
    this.currentQuote = null;
    if (this.config.persistSession) {
      this.storage.remove(_QuoteEngineClient.SESSION_STORAGE_KEY);
      this.storage.remove(_QuoteEngineClient.QUOTE_STORAGE_KEY);
    }
  }
  // ===========================================================================
  // Session Persistence
  // ===========================================================================
  /**
   * Restore session from storage
   */
  restoreSession() {
    try {
      const sessionData = this.storage.get(_QuoteEngineClient.SESSION_STORAGE_KEY);
      const quoteData = this.storage.get(_QuoteEngineClient.QUOTE_STORAGE_KEY);
      if (sessionData instanceof Promise) {
        sessionData.then((session) => {
          if (session) {
            this.currentSession = this.deserializeSession(session);
            this.log("Session restored from storage");
          }
        });
        if (quoteData instanceof Promise) {
          quoteData.then((quote) => {
            if (quote) {
              this.currentQuote = quote;
              this.log("Quote restored from storage");
            }
          });
        }
      } else {
        if (sessionData) {
          this.currentSession = this.deserializeSession(sessionData);
          this.log("Session restored from storage");
        }
        if (quoteData && !(quoteData instanceof Promise)) {
          this.currentQuote = quoteData;
          this.log("Quote restored from storage");
        }
      }
    } catch (error) {
      this.log("Failed to restore session:", error);
    }
  }
  /**
   * Save session to storage
   */
  saveSession() {
    if (!this.config.persistSession || !this.currentSession) return;
    try {
      this.storage.set(_QuoteEngineClient.SESSION_STORAGE_KEY, this.serializeSession(this.currentSession));
      if (this.currentQuote) {
        this.storage.set(_QuoteEngineClient.QUOTE_STORAGE_KEY, this.currentQuote);
      }
    } catch (error) {
      this.log("Failed to save session:", error);
    }
  }
  /**
   * Serialize session for storage (convert Date objects to ISO strings)
   */
  serializeSession(session) {
    return {
      ...session,
      createdAt: session.createdAt instanceof Date ? session.createdAt.toISOString() : session.createdAt,
      updatedAt: session.updatedAt instanceof Date ? session.updatedAt.toISOString() : session.updatedAt,
      messages: session.messages.map((msg) => ({
        ...msg,
        timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp
      }))
    };
  }
  /**
   * Deserialize session from storage (convert ISO strings back to Date objects)
   */
  deserializeSession(data) {
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      messages: (data.messages || []).map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    };
  }
  // ===========================================================================
  // Quote Operations
  // ===========================================================================
  /**
   * Generate a quote from the current conversation
   */
  async generateQuote(customerData) {
    if (!this.currentSession) {
      throw this.createError("SESSION_EXPIRED", "No active chat session");
    }
    const customer = customerData || this.currentSession.customerData;
    if (!customer?.email || !customer?.name) {
      throw this.createError(
        "VALIDATION_ERROR",
        "Customer name and email are required"
      );
    }
    this.log("Generating quote");
    try {
      const response = await this.fetch("/api/qe-sdk/quote/generate", {
        method: "POST",
        body: JSON.stringify({
          customer,
          conversation: this.currentSession.messages,
          language: this.config.language
        })
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw this.createError(
          "QUOTE_GENERATION_ERROR",
          error.message || "Failed to generate quote"
        );
      }
      const data = await response.json();
      this.currentQuote = data.quote;
      this.currentSession.status = "completed";
      this.saveSession();
      this.emit("quoteGenerated", this.currentQuote.id);
      this.config.callbacks?.onQuoteGenerated?.(this.currentQuote.id);
      this.log("Quote generated", { quoteId: this.currentQuote.id });
      return this.currentQuote;
    } catch (error) {
      const qeError = this.handleError(error);
      this.emit("error", qeError);
      this.config.callbacks?.onError?.(qeError);
      throw qeError;
    }
  }
  /**
   * Get a quote by ID
   */
  async getQuote(quoteId) {
    const response = await this.fetch(`/api/qe-sdk/quote/${quoteId}`);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw this.createError(
        "UNKNOWN_ERROR",
        error.message || "Failed to get quote"
      );
    }
    const data = await response.json();
    return data.quote;
  }
  /**
   * Get current quote
   */
  getCurrentQuote() {
    return this.currentQuote;
  }
  /**
   * Send quote via email
   */
  async sendQuoteEmail(quoteId, email) {
    const response = await this.fetch(`/api/qe-sdk/quote/${quoteId}/email`, {
      method: "POST",
      body: JSON.stringify({ sendTo: email })
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw this.createError(
        "UNKNOWN_ERROR",
        error.message || "Failed to send email"
      );
    }
  }
  /**
   * Download quote PDF
   */
  async downloadPdf(quoteId) {
    const response = await this.fetch(`/api/qe-sdk/quote/${quoteId}/pdf`, {
      method: "POST"
    });
    if (!response.ok) {
      throw this.createError("UNKNOWN_ERROR", "Failed to download PDF");
    }
    return response.blob();
  }
  // ===========================================================================
  // Payment Operations (Stripe Connect with Escrow)
  // ===========================================================================
  /**
   * Initialize payment via Stripe
   *
   * Creates a PaymentIntent for the deposit amount.
   * For PRO/ENTERPRISE plans, payments go through escrow with platform fee.
   *
   * @param quoteId - The quote ID
   * @param type - Payment type: 'deposit', 'milestone', or 'final'
   * @param milestoneId - Required if type is 'milestone'
   * @param returnUrl - URL to redirect after payment
   */
  async initPayment(quoteId, type = "deposit", milestoneId, returnUrl) {
    this.emit("paymentStart", quoteId);
    this.config.callbacks?.onPaymentStart?.(quoteId);
    const response = await this.fetch("/api/qe-sdk/escrow", {
      method: "POST",
      body: JSON.stringify({
        quoteId,
        type,
        milestoneId,
        returnUrl: returnUrl || window.location.href,
        customerEmail: this.currentQuote?.customer.email || this.currentSession?.customerData?.email
      })
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const stripeError = this.createError(
        "STRIPE_ERROR",
        error.message || "Failed to initialize payment"
      );
      this.emit("error", stripeError);
      this.config.callbacks?.onError?.(stripeError);
      throw stripeError;
    }
    const data = await response.json();
    return {
      paymentId: data.paymentId,
      paymentIntentId: data.paymentIntentId,
      clientSecret: data.clientSecret,
      amount: data.amount,
      platformFee: data.platformFee,
      isEscrow: data.isEscrow
    };
  }
  /**
   * Confirm payment was successful
   *
   * Call this after Stripe confirms the payment on the frontend.
   */
  async confirmPayment(quoteId, paymentIntentId) {
    const response = await this.fetch(`/api/qe-sdk/quote/${quoteId}/pay`, {
      method: "POST",
      body: JSON.stringify({
        paymentIntentId,
        provider: "stripe"
      })
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw this.createError("PAYMENT_ERROR", error.message || "Failed to confirm payment");
    }
    this.emit("paymentCompleted", paymentIntentId);
    this.config.callbacks?.onPaymentCompleted?.(paymentIntentId);
  }
  /**
   * Get escrow status for a quote
   */
  async getEscrowStatus(quoteId) {
    const quote = await this.getQuote(quoteId);
    if (!quote.escrow) {
      return {
        totalPaid: 0,
        platformFee: 0,
        totalHeld: 0,
        totalReleased: 0,
        remainingBalance: 0
      };
    }
    return {
      totalPaid: quote.escrow.amountHeld + quote.escrow.platformFee,
      platformFee: quote.escrow.platformFee,
      totalHeld: quote.escrow.amountHeld,
      totalReleased: quote.escrow.amountReleased,
      remainingBalance: quote.escrow.amountHeld - quote.escrow.amountReleased
    };
  }
  // ===========================================================================
  // Event Handling
  // ===========================================================================
  /**
   * Subscribe to events
   */
  addEventListener(event, callback) {
    return this.on(event, callback);
  }
  /**
   * Remove event listener
   */
  removeEventListener(event, callback) {
    this.off(event, callback);
  }
  /**
   * Notify step change
   */
  notifyStepChange(step) {
    this.emit("stepChange", step);
    this.config.callbacks?.onStepChange?.(step);
  }
  /**
   * Notify close
   */
  notifyClose() {
    this.emit("close");
    this.config.callbacks?.onClose?.();
  }
  // ===========================================================================
  // Private Helpers
  // ===========================================================================
  validateConfig(config) {
    if (!config.apiKey) {
      throw this.createError("INVALID_CONFIG", "API key is required");
    }
    if (config.apiKey.length < 20) {
      throw this.createError("INVALID_API_KEY", "Invalid API key format");
    }
  }
  registerCallbacks(callbacks) {
    if (callbacks.onReady) this.on("ready", callbacks.onReady);
    if (callbacks.onChatStart) this.on("chatStart", callbacks.onChatStart);
    if (callbacks.onMessageSent) this.on("messageSent", callbacks.onMessageSent);
    if (callbacks.onMessageReceived) this.on("messageReceived", callbacks.onMessageReceived);
    if (callbacks.onQuoteGenerated) this.on("quoteGenerated", callbacks.onQuoteGenerated);
    if (callbacks.onPaymentStart) this.on("paymentStart", callbacks.onPaymentStart);
    if (callbacks.onPaymentCompleted) this.on("paymentCompleted", callbacks.onPaymentCompleted);
    if (callbacks.onError) this.on("error", callbacks.onError);
    if (callbacks.onClose) this.on("close", callbacks.onClose);
    if (callbacks.onStepChange) this.on("stepChange", callbacks.onStepChange);
  }
  async fetch(endpoint, options = {}, retryOptions = {}) {
    const url = `${this.config.baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      "X-API-Key": this.config.apiKey,
      "X-SDK-Version": "1.0.0",
      ...this.config.headers,
      ...options.headers || {}
    };
    const maxRetries = retryOptions.skipRetry ? 0 : this.config.maxRetries;
    let lastError = null;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
      try {
        const response = await fetch(url, {
          ...options,
          headers,
          signal: options.signal || controller.signal
        });
        if (controller.signal.aborted) {
          throw new Error("AbortError");
        }
        clearTimeout(timeoutId);
        if (response && response.status === 429) {
          const retryAfter = response.headers.get("Retry-After");
          let delayMs = this.calculateRetryDelay(attempt);
          if (retryAfter) {
            const retryAfterSeconds = parseInt(retryAfter, 10);
            if (!isNaN(retryAfterSeconds)) {
              delayMs = retryAfterSeconds * 1e3;
            }
          }
          if (attempt < maxRetries) {
            try {
              await response.text();
            } catch {
            }
            this.log(`Rate limited, retrying in ${delayMs}ms (attempt ${attempt + 1}/${maxRetries})`);
            await this.sleep(delayMs);
            continue;
          }
          throw this.createError(
            "RATE_LIMIT_EXCEEDED",
            "Too many requests. Please try again later.",
            { retryAfter: retryAfter || void 0 }
          );
        }
        if (response && response.status === 401) {
          throw this.createError("INVALID_API_KEY", "Invalid or expired API key");
        }
        if (response && response.status === 403) {
          throw this.createError("API_KEY_EXPIRED", "API key has expired");
        }
        if (response && response.status === 402) {
          throw this.createError("QUOTA_EXCEEDED", "Monthly quote limit exceeded. Please upgrade your plan.");
        }
        if (response && response.status >= 500 && attempt < maxRetries) {
          try {
            await response.text();
          } catch {
          }
          const delay = this.calculateRetryDelay(attempt);
          this.log(`Server error (${response.status}), retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
          await this.sleep(delay);
          continue;
        }
        if (!response) {
          throw lastError || this.createError("NETWORK_ERROR", "No response received");
        }
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === "AbortError") {
          if (attempt < maxRetries) {
            const delay = this.calculateRetryDelay(attempt);
            this.log(`Request timed out, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
            await this.sleep(delay);
            continue;
          }
          throw this.createError("NETWORK_ERROR", "Request timed out");
        }
        if (error instanceof TypeError && error.message.includes("fetch")) {
          if (attempt < maxRetries) {
            const delay = this.calculateRetryDelay(attempt);
            this.log(`Network error, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
            await this.sleep(delay);
            continue;
          }
          throw this.createError("NETWORK_ERROR", "Network request failed");
        }
        if (this.isQuoteEngineError(error)) {
          throw error;
        }
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }
    throw lastError || this.createError("NETWORK_ERROR", "Request failed after retries");
  }
  /**
   * Calculate delay for exponential backoff
   * Formula: baseDelay * 2^attempt (1s, 2s, 4s)
   */
  calculateRetryDelay(attempt) {
    return this.config.retryBaseDelay * Math.pow(2, attempt);
  }
  /**
   * Sleep for specified milliseconds
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  createError(code, message, details) {
    return {
      code,
      message,
      details
    };
  }
  handleError(error) {
    if (this.isQuoteEngineError(error)) {
      return error;
    }
    if (error instanceof Error) {
      return this.createError("UNKNOWN_ERROR", error.message, {
        cause: error
      });
    }
    return this.createError("UNKNOWN_ERROR", "An unknown error occurred");
  }
  isQuoteEngineError(error) {
    return typeof error === "object" && error !== null && "code" in error && "message" in error;
  }
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
  log(...args) {
    if (this.config.debug) {
      console.log("[QuoteEngine]", ...args);
    }
  }
};
_QuoteEngineClient.SESSION_STORAGE_KEY = "session";
_QuoteEngineClient.QUOTE_STORAGE_KEY = "quote";
var QuoteEngineClient = _QuoteEngineClient;
function createQuoteEngine(config) {
  return new QuoteEngineClient(config);
}

// src/core/types.ts
var PLAN_LIMITS = {
  starter: {
    quotesPerMonth: 10,
    usersAllowed: 1,
    escrowFee: 0,
    features: ["basic_branding", "email_support"]
  },
  pro: {
    quotesPerMonth: -1,
    usersAllowed: 3,
    escrowFee: 0.04,
    // 4% platform fee
    features: [
      "full_branding",
      "escrow_payments",
      "contracts",
      "zapier",
      "priority_support",
      "custom_domain"
    ]
  },
  enterprise: {
    quotesPerMonth: -1,
    usersAllowed: 10,
    escrowFee: 0.02,
    // 2% platform fee
    features: [
      "white_label",
      "escrow_payments",
      "contracts",
      "api_access",
      "native_crm",
      "sla_24h",
      "dedicated_support",
      "custom_domain",
      "multi_language",
      "advanced_analytics"
    ]
  }
};
var PLAN_PRICING = {
  starter: { monthly: 49, yearly: 490, currency: "EUR" },
  pro: { monthly: 149, yearly: 1490, currency: "EUR" },
  enterprise: { monthly: 499, yearly: 4990, currency: "EUR" }
};

// src/core/theme.ts
var GLASS_THEME_LIGHT = {
  // Colors with gradient feel
  primaryColor: "#e91e63",
  primaryColorHover: "#d81b60",
  primaryColorLight: "#fce4ec",
  secondaryColor: "#9c27b0",
  accentColor: "#00bcd4",
  backgroundColor: "rgba(255, 255, 255, 0.85)",
  surfaceColor: "rgba(255, 255, 255, 0.6)",
  textColor: "#1a1a2e",
  textColorMuted: "#64748b",
  textColorInverse: "#ffffff",
  borderColor: "rgba(255, 255, 255, 0.3)",
  errorColor: "#ef4444",
  successColor: "#10b981",
  warningColor: "#f59e0b",
  // Glass bubbles with backdrop
  userBubbleColor: "linear-gradient(135deg, #e91e63, #9c27b0)",
  userBubbleTextColor: "#ffffff",
  assistantBubbleColor: "rgba(255, 255, 255, 0.7)",
  assistantBubbleTextColor: "#1a1a2e",
  userBubbleBorderRadius: "20px 20px 4px 20px",
  assistantBubbleBorderRadius: "20px 20px 20px 4px",
  bubbleMaxWidth: "80%",
  // Typography
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  fontSize: 15,
  fontSizeSmall: 13,
  fontSizeLarge: 17,
  fontWeight: "400",
  fontWeightBold: "600",
  lineHeight: 1.5,
  // Rounded & soft
  borderRadius: 20,
  buttonBorderRadius: 50,
  inputBorderRadius: 24,
  containerPadding: 20,
  messageGap: 16,
  // Glass effects - the signature look
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.2)",
  boxShadowElevated: "0 20px 60px rgba(0, 0, 0, 0.2)",
  overlayColor: "rgba(0, 0, 0, 0.4)",
  transitionDuration: "0.3s",
  transitionEasing: "cubic-bezier(0.4, 0, 0.2, 1)",
  // Buttons
  sendButtonSize: 48,
  buttonPadding: "14px 28px",
  buttonFontSize: 15,
  disabledOpacity: 0.5,
  // Input with glass effect
  inputBackgroundColor: "rgba(255, 255, 255, 0.5)",
  inputBorderColor: "rgba(255, 255, 255, 0.3)",
  inputFocusBorderColor: "#e91e63",
  inputPadding: "14px 18px",
  inputFontSize: 15,
  // Header
  headerBackgroundColor: "rgba(255, 255, 255, 0.7)",
  headerTextColor: "#1a1a2e",
  headerPadding: "18px 24px",
  headerBorderBottom: "1px solid rgba(255, 255, 255, 0.3)",
  logoHeight: 40,
  // Loading
  loadingColor: "#e91e63",
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
  `
};
var GLASS_THEME_DARK = {
  // Dark glass colors
  primaryColor: "#f472b6",
  primaryColorHover: "#ec4899",
  primaryColorLight: "#831843",
  secondaryColor: "#a855f7",
  accentColor: "#22d3ee",
  backgroundColor: "rgba(15, 15, 30, 0.9)",
  surfaceColor: "rgba(30, 30, 50, 0.7)",
  textColor: "#f1f5f9",
  textColorMuted: "#94a3b8",
  textColorInverse: "#0f0f1e",
  borderColor: "rgba(255, 255, 255, 0.1)",
  errorColor: "#f87171",
  successColor: "#34d399",
  warningColor: "#fbbf24",
  // Dark glass bubbles
  userBubbleColor: "linear-gradient(135deg, #ec4899, #a855f7)",
  userBubbleTextColor: "#ffffff",
  assistantBubbleColor: "rgba(50, 50, 80, 0.6)",
  assistantBubbleTextColor: "#f1f5f9",
  // Input dark glass
  inputBackgroundColor: "rgba(30, 30, 50, 0.5)",
  inputBorderColor: "rgba(255, 255, 255, 0.1)",
  inputFocusBorderColor: "#f472b6",
  // Header dark
  headerBackgroundColor: "rgba(20, 20, 40, 0.8)",
  headerTextColor: "#f1f5f9",
  headerBorderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  // Loading
  loadingColor: "#f472b6",
  // Dark glass effects
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
  overlayColor: "rgba(0, 0, 0, 0.7)"
};
var MINIMAL_THEME_LIGHT = {
  // Clean, neutral colors
  primaryColor: "#0f172a",
  primaryColorHover: "#1e293b",
  primaryColorLight: "#f1f5f9",
  secondaryColor: "#64748b",
  accentColor: "#3b82f6",
  backgroundColor: "#ffffff",
  surfaceColor: "#fafafa",
  textColor: "#0f172a",
  textColorMuted: "#64748b",
  textColorInverse: "#ffffff",
  borderColor: "#e5e7eb",
  errorColor: "#dc2626",
  successColor: "#16a34a",
  warningColor: "#d97706",
  // Simple bubbles
  userBubbleColor: "#0f172a",
  userBubbleTextColor: "#ffffff",
  assistantBubbleColor: "#f3f4f6",
  assistantBubbleTextColor: "#0f172a",
  userBubbleBorderRadius: "16px 16px 4px 16px",
  assistantBubbleBorderRadius: "16px 16px 16px 4px",
  bubbleMaxWidth: "85%",
  // Typography - clean system fonts
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: 14,
  fontSizeSmall: 12,
  fontSizeLarge: 16,
  fontWeight: "400",
  fontWeightBold: "500",
  lineHeight: 1.6,
  // Minimal border radius
  borderRadius: 8,
  buttonBorderRadius: 6,
  inputBorderRadius: 6,
  containerPadding: 16,
  messageGap: 12,
  // No heavy shadows
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
  boxShadowElevated: "0 4px 12px rgba(0, 0, 0, 0.1)",
  overlayColor: "rgba(0, 0, 0, 0.5)",
  transitionDuration: "0.15s",
  transitionEasing: "ease-out",
  // Compact buttons
  sendButtonSize: 40,
  buttonPadding: "10px 20px",
  buttonFontSize: 14,
  disabledOpacity: 0.4,
  // Simple input
  inputBackgroundColor: "#ffffff",
  inputBorderColor: "#e5e7eb",
  inputFocusBorderColor: "#0f172a",
  inputPadding: "10px 14px",
  inputFontSize: 14,
  // Minimal header
  headerBackgroundColor: "#ffffff",
  headerTextColor: "#0f172a",
  headerPadding: "14px 18px",
  headerBorderBottom: "1px solid #e5e7eb",
  logoHeight: 32,
  // Loading
  loadingColor: "#64748b",
  loadingDotSize: 6,
  loadingAnimationDuration: 1.4
};
var MINIMAL_THEME_DARK = {
  // Dark minimal colors
  primaryColor: "#f8fafc",
  primaryColorHover: "#e2e8f0",
  primaryColorLight: "#1e293b",
  secondaryColor: "#94a3b8",
  accentColor: "#60a5fa",
  backgroundColor: "#0f172a",
  surfaceColor: "#1e293b",
  textColor: "#f8fafc",
  textColorMuted: "#94a3b8",
  textColorInverse: "#0f172a",
  borderColor: "#334155",
  errorColor: "#f87171",
  successColor: "#4ade80",
  warningColor: "#fbbf24",
  // Dark minimal bubbles
  userBubbleColor: "#f8fafc",
  userBubbleTextColor: "#0f172a",
  assistantBubbleColor: "#1e293b",
  assistantBubbleTextColor: "#f8fafc",
  // Dark input
  inputBackgroundColor: "#1e293b",
  inputBorderColor: "#334155",
  inputFocusBorderColor: "#f8fafc",
  // Dark header
  headerBackgroundColor: "#0f172a",
  headerTextColor: "#f8fafc",
  headerBorderBottom: "1px solid #334155",
  // Loading
  loadingColor: "#94a3b8",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
  boxShadowElevated: "0 4px 12px rgba(0, 0, 0, 0.4)",
  overlayColor: "rgba(0, 0, 0, 0.8)"
};
var ELEGANT_THEME_LIGHT = {
  // Warm, sophisticated colors
  primaryColor: "#7c3aed",
  primaryColorHover: "#6d28d9",
  primaryColorLight: "#ede9fe",
  secondaryColor: "#a78bfa",
  accentColor: "#14b8a6",
  backgroundColor: "#fefefe",
  surfaceColor: "#f9fafb",
  textColor: "#1f2937",
  textColorMuted: "#6b7280",
  textColorInverse: "#ffffff",
  borderColor: "#e5e7eb",
  errorColor: "#ef4444",
  successColor: "#059669",
  warningColor: "#f59e0b",
  // Elegant bubbles with subtle styling
  userBubbleColor: "#7c3aed",
  userBubbleTextColor: "#ffffff",
  assistantBubbleColor: "#f3f4f6",
  assistantBubbleTextColor: "#1f2937",
  userBubbleBorderRadius: "18px 18px 6px 18px",
  assistantBubbleBorderRadius: "18px 18px 18px 6px",
  bubbleMaxWidth: "78%",
  // Refined typography
  fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
  headingFont: '"Inter", "SF Pro Display", sans-serif',
  fontSize: 15,
  fontSizeSmall: 13,
  fontSizeLarge: 17,
  fontSizeHeading: 22,
  fontWeight: "400",
  fontWeightBold: "600",
  lineHeight: 1.55,
  letterSpacing: "-0.01em",
  // Balanced border radius
  borderRadius: 14,
  buttonBorderRadius: 10,
  inputBorderRadius: 12,
  containerPadding: 18,
  messageGap: 14,
  // Soft, elegant shadows
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)",
  boxShadowElevated: "0 12px 40px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05)",
  overlayColor: "rgba(31, 41, 55, 0.5)",
  transitionDuration: "0.2s",
  transitionEasing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  // Refined buttons
  sendButtonSize: 44,
  buttonPadding: "12px 24px",
  buttonFontSize: 15,
  disabledOpacity: 0.5,
  // Elegant input
  inputBackgroundColor: "#ffffff",
  inputBorderColor: "#e5e7eb",
  inputFocusBorderColor: "#7c3aed",
  inputPadding: "12px 16px",
  inputFontSize: 15,
  // Refined header
  headerBackgroundColor: "#ffffff",
  headerTextColor: "#1f2937",
  headerPadding: "16px 22px",
  headerBorderBottom: "1px solid #f3f4f6",
  logoHeight: 38,
  // Loading
  loadingColor: "#7c3aed",
  loadingDotSize: 8,
  loadingAnimationDuration: 1.3
};
var ELEGANT_THEME_DARK = {
  // Dark elegant colors
  primaryColor: "#a78bfa",
  primaryColorHover: "#8b5cf6",
  primaryColorLight: "#2e1065",
  secondaryColor: "#c4b5fd",
  accentColor: "#2dd4bf",
  backgroundColor: "#111827",
  surfaceColor: "#1f2937",
  textColor: "#f9fafb",
  textColorMuted: "#9ca3af",
  textColorInverse: "#111827",
  borderColor: "#374151",
  errorColor: "#f87171",
  successColor: "#34d399",
  warningColor: "#fbbf24",
  // Dark elegant bubbles
  userBubbleColor: "#8b5cf6",
  userBubbleTextColor: "#ffffff",
  assistantBubbleColor: "#1f2937",
  assistantBubbleTextColor: "#f9fafb",
  // Dark input
  inputBackgroundColor: "#1f2937",
  inputBorderColor: "#374151",
  inputFocusBorderColor: "#a78bfa",
  // Dark header
  headerBackgroundColor: "#111827",
  headerTextColor: "#f9fafb",
  headerBorderBottom: "1px solid #1f2937",
  // Loading
  loadingColor: "#a78bfa",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1)",
  boxShadowElevated: "0 12px 40px rgba(0, 0, 0, 0.3)",
  overlayColor: "rgba(0, 0, 0, 0.7)"
};
var THEME_STYLE_PRESETS = {
  glass: { light: GLASS_THEME_LIGHT, dark: GLASS_THEME_DARK },
  minimal: { light: MINIMAL_THEME_LIGHT, dark: MINIMAL_THEME_DARK },
  elegant: { light: ELEGANT_THEME_LIGHT, dark: ELEGANT_THEME_DARK }
};
function getThemePreset(style, mode) {
  return THEME_STYLE_PRESETS[style]?.[mode] ?? MINIMAL_THEME_LIGHT;
}
function createStyledTheme(style = "minimal", mode = "light", overrides = {}) {
  const preset = getThemePreset(style, mode);
  return deepMerge(
    {},
    preset,
    overrides,
    { style, mode }
  );
}
var ThemeManager = class {
  constructor(options) {
    this.mediaQuery = null;
    this.styleElement = null;
    this.theme = options.theme;
    this.currentMode = options.theme.mode || "light";
    this.currentStyle = options.theme.style || "minimal";
    this.onChange = options.onChange;
    this.onStyleChange = options.onStyleChange;
    if (typeof window !== "undefined" && this.currentMode === "auto") {
      this.setupMediaQueryListener();
    }
  }
  /**
   * Set the theme mode
   */
  setTheme(mode) {
    const previousMode = this.currentMode;
    this.currentMode = mode;
    if (mode === "auto") {
      this.setupMediaQueryListener();
    } else if (this.mediaQuery) {
      this.removeMediaQueryListener();
    }
    if (previousMode !== mode) {
      this.notifyChange();
      this.updateStyles();
    }
  }
  /**
   * Get the current theme mode
   */
  getMode() {
    return this.currentMode;
  }
  /**
   * Set the theme style (glass, minimal, elegant)
   */
  setStyle(style) {
    const previousStyle = this.currentStyle;
    this.currentStyle = style;
    this.theme.style = style;
    if (previousStyle !== style) {
      this.onStyleChange?.(style);
      this.notifyChange();
      this.updateStyles();
    }
  }
  /**
   * Get the current theme style
   */
  getStyle() {
    return this.currentStyle;
  }
  /**
   * Check if currently in dark mode
   */
  isDark() {
    if (this.currentMode === "auto") {
      return this.getSystemPreference() === "dark";
    }
    return this.currentMode === "dark";
  }
  /**
   * Get the resolved theme configuration (with style and dark mode applied)
   */
  getResolvedTheme() {
    const isDark = this.isDark();
    const modeForPreset = isDark ? "dark" : "light";
    const preset = getThemePreset(this.currentStyle, modeForPreset);
    let resolved = deepMerge(
      {},
      preset,
      this.theme
    );
    if (isDark && this.theme.darkTheme) {
      resolved = deepMerge(
        {},
        resolved,
        this.theme.darkTheme
      );
    }
    return resolved;
  }
  /**
   * Generate CSS for the current theme state
   */
  getCss() {
    const lightPreset = getThemePreset(this.currentStyle, "light");
    const lightTheme = deepMerge(
      {},
      lightPreset,
      this.theme
    );
    const baseCSS = generateThemeCss(lightTheme);
    const darkPreset = getThemePreset(this.currentStyle, "dark");
    const darkTheme = deepMerge(
      {},
      darkPreset,
      this.theme,
      this.theme.darkTheme || {}
    );
    const darkCSS = generateThemeCss(darkTheme);
    const customCSS = lightTheme.customCSS || "";
    const darkCustomCSS = darkTheme.customCSS || "";
    if (this.currentMode === "auto") {
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
      `;
    }
    if (this.currentMode === "dark") {
      return `
        ${darkCSS}
        ${darkCustomCSS}
      `;
    }
    return `
      ${baseCSS}
      ${customCSS}
    `;
  }
  /**
   * Update theme configuration
   */
  updateTheme(theme) {
    this.theme = deepMerge(
      {},
      this.theme,
      theme
    );
    if (theme.style && theme.style !== this.currentStyle) {
      this.setStyle(theme.style);
      return;
    }
    if (theme.mode && theme.mode !== this.currentMode) {
      this.setTheme(theme.mode);
    } else {
      this.updateStyles();
    }
  }
  /**
   * Inject theme styles into the document
   */
  injectStyles(containerId) {
    if (typeof document === "undefined") return;
    const styleId = containerId ? `qe-theme-${containerId}` : "qe-theme-css";
    if (!this.styleElement) {
      this.styleElement = document.getElementById(styleId);
      if (!this.styleElement) {
        this.styleElement = document.createElement("style");
        this.styleElement.id = styleId;
        document.head.appendChild(this.styleElement);
      }
    }
    this.styleElement.textContent = this.getCss();
  }
  /**
   * Clean up resources
   */
  destroy() {
    this.removeMediaQueryListener();
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }
  }
  // Private methods
  setupMediaQueryListener() {
    if (typeof window === "undefined" || this.mediaQuery) return;
    this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      this.notifyChange();
      this.updateStyles();
    };
    if (this.mediaQuery.addEventListener) {
      this.mediaQuery.addEventListener("change", handler);
    } else {
      this.mediaQuery.addListener(handler);
    }
  }
  removeMediaQueryListener() {
    this.mediaQuery = null;
  }
  getSystemPreference() {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  notifyChange() {
    this.onChange?.(this.currentMode, this.isDark(), this.currentStyle);
  }
  updateStyles() {
    if (this.styleElement) {
      this.styleElement.textContent = this.getCss();
    }
  }
  extractCssVars(css) {
    const match = css.match(/\.qe-widget\s*\{\s*([^}]+)\s*\}/);
    return match ? match[1] : "";
  }
};
function createThemeManager(options) {
  return new ThemeManager(options);
}
var DEFAULT_DARK_THEME = {
  backgroundColor: "#1a1a1a",
  surfaceColor: "#2d2d2d",
  textColor: "#f5f5f5",
  textColorMuted: "#a0a0a0",
  borderColor: "#404040",
  inputBackgroundColor: "#2d2d2d",
  inputBorderColor: "#404040",
  assistantBubbleColor: "#2d2d2d",
  assistantBubbleTextColor: "#f5f5f5",
  headerBackgroundColor: "#1a1a1a",
  headerTextColor: "#f5f5f5",
  overlayColor: "rgba(0, 0, 0, 0.8)",
  loadingColor: "#a0a0a0"
};

// src/core/analytics.ts
var Analytics = class {
  constructor(options) {
    this.eventQueue = [];
    this.flushTimer = null;
    this.enabled = options.enabled ?? true;
    this.endpoint = options.endpoint || "https://www.thinkpinkstudio.it/api/qe-sdk/analytics";
    this.batchSize = options.batchSize || 10;
    this.flushInterval = options.flushInterval || 3e4;
    this.includeDeviceInfo = options.includeDeviceInfo ?? true;
    this.userId = options.userId;
    this.apiKey = options.apiKey;
    this.sessionId = this.generateSessionId();
    this.startFlushTimer();
  }
  /**
   * Track an analytics event
   */
  track(type, data) {
    if (!this.enabled) return;
    const event = {
      type,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      data
    };
    this.eventQueue.push(event);
    if (this.eventQueue.length >= this.batchSize) {
      this.flush();
    }
  }
  /**
   * Track an event with quote context
   */
  trackQuote(type, quoteId, data) {
    this.track(type, { ...data, quoteId });
  }
  /**
   * Enable or disable analytics (GDPR opt-out)
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) {
      this.eventQueue = [];
    }
  }
  /**
   * Check if analytics is enabled
   */
  isEnabled() {
    return this.enabled;
  }
  /**
   * Set custom user ID for tracking
   */
  setUserId(userId) {
    this.userId = userId;
  }
  /**
   * Flush pending events to the server
   */
  async flush() {
    if (!this.enabled || this.eventQueue.length === 0) return;
    const events = [...this.eventQueue];
    this.eventQueue = [];
    try {
      const payload = {
        events,
        sessionId: this.sessionId,
        userId: this.userId,
        deviceInfo: this.includeDeviceInfo ? this.getDeviceInfo() : void 0,
        timestamp: Date.now()
      };
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
        const sent = navigator.sendBeacon(this.endpoint, blob);
        if (!sent) {
          await this.sendWithFetch(payload);
        }
      } else {
        await this.sendWithFetch(payload);
      }
    } catch (error) {
      if (this.eventQueue.length < 100) {
        this.eventQueue = [...events, ...this.eventQueue];
      }
      console.warn("[QuoteEngine Analytics] Failed to flush events:", error);
    }
  }
  /**
   * Clean up resources
   */
  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.flush();
  }
  // Private methods
  async sendWithFetch(payload) {
    await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.apiKey
      },
      body: JSON.stringify(payload),
      keepalive: true
    });
  }
  startFlushTimer() {
    if (typeof setInterval === "undefined") return;
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }
  generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }
  getDeviceInfo() {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return {};
    }
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenWidth: window.screen?.width,
      screenHeight: window.screen?.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      referrer: document.referrer || void 0,
      url: window.location.href
    };
  }
};
function createAnalytics(options) {
  return new Analytics(options);
}
function createAnalyticsFromConfig(config) {
  if (config.analytics === false) {
    return null;
  }
  return new Analytics({
    apiKey: config.apiKey,
    enabled: true
  });
}

// src/core/webhooks.ts
var WEBHOOK_SIGNATURE_HEADER = "X-QuoteEngine-Signature";
var WEBHOOK_TIMESTAMP_HEADER = "X-QuoteEngine-Timestamp";
var WEBHOOK_ID_HEADER = "X-QuoteEngine-ID";
async function computeSignature(payload, secret, timestamp) {
  const signedPayload = `${timestamp}.${payload}`;
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(signedPayload)
    );
    const hashArray = Array.from(new Uint8Array(signatureBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return `v1=${hashHex}`;
  }
  throw new Error(
    "Web Crypto API not available. Use Node.js 15+ or a polyfill."
  );
}
async function verifySignature(payload, signature, timestamp, secret, tolerance = 300) {
  const ts = parseInt(timestamp, 10);
  if (isNaN(ts)) {
    return false;
  }
  const now = Math.floor(Date.now() / 1e3);
  if (Math.abs(now - ts) > tolerance) {
    return false;
  }
  const expectedSignature = await computeSignature(payload, secret, ts);
  return timingSafeEqual(signature, expectedSignature);
}
function timingSafeEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
function constructEvent(type, data, options) {
  return {
    id: `evt_${generateId()}`,
    type,
    apiVersion: options.apiVersion || "2024-01-01",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    tenantId: options.tenantId,
    livemode: options.livemode ?? true,
    data
  };
}
function generateId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 24; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
var WebhookClient = class {
  constructor(options) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl || "https://www.thinkpinkstudio.it/api/qe-sdk";
  }
  /**
   * Create a new webhook endpoint
   */
  async create(options) {
    const response = await fetch(`${this.baseUrl}/webhooks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.apiKey
      },
      body: JSON.stringify(options)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create webhook endpoint");
    }
    return response.json();
  }
  /**
   * List all webhook endpoints
   */
  async list() {
    const response = await fetch(`${this.baseUrl}/webhooks`, {
      headers: {
        "X-API-Key": this.apiKey
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to list webhook endpoints");
    }
    const data = await response.json();
    return data.endpoints;
  }
  /**
   * Get a specific webhook endpoint
   */
  async get(id) {
    const response = await fetch(`${this.baseUrl}/webhooks/${id}`, {
      headers: {
        "X-API-Key": this.apiKey
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to get webhook endpoint");
    }
    return response.json();
  }
  /**
   * Update a webhook endpoint
   */
  async update(id, options) {
    const response = await fetch(`${this.baseUrl}/webhooks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.apiKey
      },
      body: JSON.stringify(options)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update webhook endpoint");
    }
    return response.json();
  }
  /**
   * Delete a webhook endpoint
   */
  async delete(id) {
    const response = await fetch(`${this.baseUrl}/webhooks/${id}`, {
      method: "DELETE",
      headers: {
        "X-API-Key": this.apiKey
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete webhook endpoint");
    }
  }
  /**
   * Rotate the webhook secret
   */
  async rotateSecret(id) {
    const response = await fetch(`${this.baseUrl}/webhooks/${id}/rotate-secret`, {
      method: "POST",
      headers: {
        "X-API-Key": this.apiKey
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to rotate webhook secret");
    }
    return response.json();
  }
  /**
   * List recent webhook deliveries (for debugging)
   */
  async listDeliveries(endpointId, options) {
    const params = new URLSearchParams();
    if (options?.limit) {
      params.set("limit", options.limit.toString());
    }
    const response = await fetch(
      `${this.baseUrl}/webhooks/${endpointId}/deliveries?${params}`,
      {
        headers: {
          "X-API-Key": this.apiKey
        }
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to list webhook deliveries");
    }
    const data = await response.json();
    return data.deliveries;
  }
  /**
   * Resend a failed webhook delivery
   */
  async resendDelivery(endpointId, deliveryId) {
    const response = await fetch(
      `${this.baseUrl}/webhooks/${endpointId}/deliveries/${deliveryId}/resend`,
      {
        method: "POST",
        headers: {
          "X-API-Key": this.apiKey
        }
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to resend webhook delivery");
    }
  }
};
function createWebhookClient(options) {
  return new WebhookClient(options);
}

// src/core/api-keys.ts
var SCOPE_PERMISSIONS = {
  full: {
    chat: true,
    generateQuote: true,
    readQuote: true,
    initPayment: true,
    confirmPayment: true,
    manageWebhooks: true,
    accessAnalytics: true,
    sendEmails: true,
    downloadPdfs: true
  },
  read: {
    chat: false,
    generateQuote: false,
    readQuote: true,
    initPayment: false,
    confirmPayment: false,
    manageWebhooks: false,
    accessAnalytics: true,
    sendEmails: false,
    downloadPdfs: true
  },
  widget: {
    chat: true,
    generateQuote: true,
    readQuote: true,
    initPayment: true,
    confirmPayment: true,
    manageWebhooks: false,
    accessAnalytics: false,
    sendEmails: true,
    downloadPdfs: true
  },
  webhook: {
    chat: false,
    generateQuote: false,
    readQuote: false,
    initPayment: false,
    confirmPayment: false,
    manageWebhooks: true,
    accessAnalytics: false,
    sendEmails: false,
    downloadPdfs: false
  },
  payment: {
    chat: false,
    generateQuote: false,
    readQuote: true,
    initPayment: true,
    confirmPayment: true,
    manageWebhooks: false,
    accessAnalytics: false,
    sendEmails: false,
    downloadPdfs: false
  }
};
var API_KEY_REGEX = /^qe_(live|test)_(full|read|widget|webhook|payment)_([A-Za-z0-9]{24,})$/;
function parseApiKey(apiKey) {
  const match = apiKey.match(API_KEY_REGEX);
  if (!match) {
    return {
      raw: apiKey,
      environment: "live",
      scope: "full",
      identifier: "",
      isValid: false,
      isTestKey: false
    };
  }
  const [, environment, scope, identifier] = match;
  return {
    raw: apiKey,
    environment,
    scope,
    identifier,
    isValid: true,
    isTestKey: environment === "test"
  };
}
function isValidApiKeyFormat(apiKey) {
  return API_KEY_REGEX.test(apiKey);
}
function getApiKeyPermissions(apiKey) {
  const parsed = typeof apiKey === "string" ? parseApiKey(apiKey) : apiKey;
  if (!parsed.isValid) {
    return {
      chat: false,
      generateQuote: false,
      readQuote: false,
      initPayment: false,
      confirmPayment: false,
      manageWebhooks: false,
      accessAnalytics: false,
      sendEmails: false,
      downloadPdfs: false
    };
  }
  return SCOPE_PERMISSIONS[parsed.scope];
}
function hasPermission(apiKey, permission) {
  const perms = getApiKeyPermissions(apiKey);
  return perms[permission];
}
function isTestKey(apiKey) {
  const parsed = typeof apiKey === "string" ? parseApiKey(apiKey) : apiKey;
  return parsed.isTestKey;
}
function isLiveKey(apiKey) {
  const parsed = typeof apiKey === "string" ? parseApiKey(apiKey) : apiKey;
  return parsed.isValid && !parsed.isTestKey;
}
var ApiKeyValidationError = class extends Error {
  constructor(code, message, details) {
    super(message);
    this.name = "ApiKeyValidationError";
    this.code = code;
    this.details = details;
  }
};
function assertPermission(apiKey, permission, action) {
  if (!hasPermission(apiKey, permission)) {
    const parsed = typeof apiKey === "string" ? parseApiKey(apiKey) : apiKey;
    throw new ApiKeyValidationError(
      "PERMISSION_DENIED",
      `API key with scope "${parsed.scope}" cannot ${action || permission}. Required permission: ${permission}`,
      { scope: parsed.scope, permission }
    );
  }
}
function maskApiKey(apiKey, visibleChars = 4) {
  const parsed = parseApiKey(apiKey);
  if (!parsed.isValid) {
    if (apiKey.length <= 8) return "****";
    return apiKey.substring(0, 4) + "*".repeat(apiKey.length - 8) + apiKey.slice(-4);
  }
  const prefix = `qe_${parsed.environment}_${parsed.scope}_`;
  const maskedIdentifier = "*".repeat(Math.max(0, parsed.identifier.length - visibleChars)) + parsed.identifier.slice(-visibleChars);
  return prefix + maskedIdentifier;
}
function getScopeDescription(scope) {
  const descriptions = {
    full: "Full access to all SDK features including chat, quotes, payments, and webhooks",
    read: "Read-only access to quotes and analytics",
    widget: "Widget operations including chat, quote generation, and payments",
    webhook: "Webhook management only",
    payment: "Payment operations and quote reading only"
  };
  return descriptions[scope];
}
function listEnabledPermissions(scope) {
  const perms = SCOPE_PERMISSIONS[scope];
  return Object.keys(perms).filter(
    (key) => perms[key]
  );
}

// src/core/index.ts
var VERSION = "1.0.0";

// src/react/QuoteEngineProvider.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var QuoteEngineContext = (0, import_react.createContext)(null);
function QuoteEngineProvider({
  config,
  children,
  initialStep = "chat",
  customerData: initialCustomerData,
  onStateChange
}) {
  const clientRef = (0, import_react.useRef)(null);
  if (!clientRef.current) {
    clientRef.current = createQuoteEngine(config);
  }
  const client = clientRef.current;
  const [state, setState] = (0, import_react.useState)({
    currentStep: initialStep,
    isOpen: false,
    isLoading: false,
    chatSession: null,
    quote: null,
    error: null,
    customerData: initialCustomerData || {}
  });
  const [streamingContent, setStreamingContent] = (0, import_react.useState)("");
  (0, import_react.useEffect)(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);
  (0, import_react.useEffect)(() => {
    client.setConfig(config);
  }, [config, client]);
  (0, import_react.useEffect)(() => {
    const unsubscribers = [
      client.addEventListener("error", (error) => {
        setState((s) => ({ ...s, error, isLoading: false }));
      }),
      client.addEventListener("quoteGenerated", (quote) => {
        setState((s) => ({ ...s, quote, currentStep: "preview" }));
      }),
      client.addEventListener("paymentCompleted", () => {
        setState((s) => ({ ...s, currentStep: "completed" }));
      })
    ];
    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [client]);
  const value = (0, import_react.useMemo)(() => {
    const startChat = async (customerData) => {
      setState((s) => ({ ...s, isLoading: true, error: null }));
      try {
        const session = await client.startChat(
          customerData || state.customerData
        );
        setState((s) => ({
          ...s,
          chatSession: session,
          isLoading: false,
          currentStep: "chat"
        }));
        return session;
      } catch (error) {
        setState((s) => ({
          ...s,
          error,
          isLoading: false
        }));
        throw error;
      }
    };
    const sendMessage = async (content) => {
      setState((s) => ({ ...s, isLoading: true, error: null }));
      setStreamingContent("");
      try {
        await client.sendMessage(content, (chunk) => {
          setStreamingContent((prev) => prev + chunk);
        });
        setState((s) => ({
          ...s,
          chatSession: client.getSession(),
          isLoading: false
        }));
        setStreamingContent("");
      } catch (error) {
        setState((s) => ({
          ...s,
          error,
          isLoading: false
        }));
        setStreamingContent("");
        throw error;
      }
    };
    const generateQuote = async (customerData) => {
      setState((s) => ({ ...s, isLoading: true, error: null }));
      try {
        const data = customerData || state.customerData;
        const quote = await client.generateQuote(data);
        setState((s) => ({
          ...s,
          quote,
          isLoading: false,
          currentStep: "preview"
        }));
        return quote;
      } catch (error) {
        setState((s) => ({
          ...s,
          error,
          isLoading: false
        }));
        throw error;
      }
    };
    const goToStep = (step) => {
      setState((s) => ({ ...s, currentStep: step }));
      client.notifyStepChange(step);
    };
    const setCustomerData = (data) => {
      setState((s) => ({
        ...s,
        customerData: { ...s.customerData, ...data }
      }));
    };
    const open = () => {
      setState((s) => ({ ...s, isOpen: true }));
    };
    const close = () => {
      setState((s) => ({ ...s, isOpen: false }));
      client.notifyClose();
    };
    const reset = () => {
      client.clearSession();
      setState({
        currentStep: initialStep,
        isOpen: false,
        isLoading: false,
        chatSession: null,
        quote: null,
        error: null,
        customerData: initialCustomerData || {}
      });
    };
    return {
      client,
      state: {
        ...state,
        // Include streaming content in chat session if available
        chatSession: state.chatSession ? {
          ...state.chatSession,
          streamingContent
        } : null
      },
      startChat,
      sendMessage,
      generateQuote,
      goToStep,
      setCustomerData,
      open,
      close,
      reset,
      isReady: true
    };
  }, [
    client,
    state,
    streamingContent,
    initialStep,
    initialCustomerData
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuoteEngineContext.Provider, { value, children });
}
function useQuoteEngineContext() {
  const context = (0, import_react.useContext)(QuoteEngineContext);
  if (!context) {
    throw new Error(
      "useQuoteEngineContext must be used within a QuoteEngineProvider"
    );
  }
  return context;
}

// src/react/hooks.ts
var import_react2 = require("react");
function useQuoteChat() {
  const { client, state, sendMessage, startChat } = useQuoteEngineContext();
  const [ragInsight, setRagInsight] = (0, import_react2.useState)(null);
  const messages = state.chatSession?.messages || [];
  const streamingContent = state.chatSession?.streamingContent || "";
  const isLoading = state.isLoading;
  const error = state.error;
  const shouldGenerateQuote = messages.some(
    (m) => m.metadata?.shouldGenerateQuote
  );
  (0, import_react2.useEffect)(() => {
    return client.addEventListener("ragContextReceived", (insight) => {
      setRagInsight(insight);
    });
  }, [client]);
  const send = (0, import_react2.useCallback)(
    async (content) => {
      if (!state.chatSession) {
        await startChat();
      }
      return sendMessage(content);
    },
    [state.chatSession, startChat, sendMessage]
  );
  const cancel = (0, import_react2.useCallback)(() => {
    client.cancelChat();
  }, [client]);
  return {
    messages,
    streamingContent,
    isLoading,
    error,
    shouldGenerateQuote,
    ragInsight,
    sendMessage: send,
    startChat,
    cancelChat: cancel
  };
}
function useQuote() {
  const { client, state, generateQuote } = useQuoteEngineContext();
  const quote = state.quote;
  const isLoading = state.isLoading;
  const error = state.error;
  const downloadPdf = (0, import_react2.useCallback)(async () => {
    if (!quote) return;
    const blob = await client.downloadPdf(quote.id);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${quote.quoteNumber}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }, [client, quote]);
  const sendEmail = (0, import_react2.useCallback)(
    async (email) => {
      if (!quote) return;
      await client.sendQuoteEmail(quote.id, email);
    },
    [client, quote]
  );
  const getQuote = (0, import_react2.useCallback)(
    async (id) => {
      return client.getQuote(id);
    },
    [client]
  );
  return {
    quote,
    isLoading,
    error,
    generateQuote,
    downloadPdf,
    sendEmail,
    getQuote
  };
}
function usePayment() {
  const { client, state } = useQuoteEngineContext();
  const [isProcessing, setIsProcessing] = (0, import_react2.useState)(false);
  const [paymentError, setPaymentError] = (0, import_react2.useState)(null);
  const [clientSecret, setClientSecret] = (0, import_react2.useState)(null);
  const [paymentIntentId, setPaymentIntentId] = (0, import_react2.useState)(null);
  const [escrowInfo, setEscrowInfo] = (0, import_react2.useState)(null);
  const quote = state.quote;
  const initPayment = (0, import_react2.useCallback)(
    async (type = "deposit", milestoneId, returnUrl) => {
      if (!quote) throw new Error("No quote available");
      setIsProcessing(true);
      setPaymentError(null);
      try {
        const result = await client.initPayment(quote.id, type, milestoneId, returnUrl);
        setClientSecret(result.clientSecret);
        setPaymentIntentId(result.paymentIntentId);
        return result;
      } catch (error) {
        setPaymentError(error);
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [client, quote]
  );
  const confirmPayment = (0, import_react2.useCallback)(async () => {
    if (!quote) throw new Error("No quote available");
    if (!paymentIntentId) throw new Error("No payment initialized");
    setIsProcessing(true);
    setPaymentError(null);
    try {
      await client.confirmPayment(quote.id, paymentIntentId);
      setClientSecret(null);
      setPaymentIntentId(null);
    } catch (error) {
      setPaymentError(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [client, quote, paymentIntentId]);
  const getEscrowStatus = (0, import_react2.useCallback)(async () => {
    if (!quote) throw new Error("No quote available");
    setIsProcessing(true);
    setPaymentError(null);
    try {
      const status = await client.getEscrowStatus(quote.id);
      setEscrowInfo(status);
      return status;
    } catch (error) {
      setPaymentError(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [client, quote]);
  return {
    isProcessing,
    paymentError,
    clientSecret,
    paymentIntentId,
    escrowInfo,
    initPayment,
    confirmPayment,
    getEscrowStatus
  };
}
function useQuoteWidget() {
  const {
    state,
    open,
    close,
    reset,
    goToStep,
    setCustomerData
  } = useQuoteEngineContext();
  return {
    isOpen: state.isOpen,
    isLoading: state.isLoading,
    currentStep: state.currentStep,
    error: state.error,
    customerData: state.customerData,
    open,
    close,
    reset,
    goToStep,
    setCustomerData
  };
}
function useQuoteEngineEvent(event, handler) {
  const { client } = useQuoteEngineContext();
  (0, import_react2.useEffect)(() => {
    return client.addEventListener(event, handler);
  }, [client, event, handler]);
}
function useCustomerForm() {
  const { state, setCustomerData } = useQuoteEngineContext();
  const [errors, setErrors] = (0, import_react2.useState)({});
  const updateField = (0, import_react2.useCallback)(
    (field, value) => {
      setCustomerData({ [field]: value });
      setErrors((prev) => ({ ...prev, [field]: void 0 }));
    },
    [setCustomerData]
  );
  const validate = (0, import_react2.useCallback)(() => {
    const newErrors = {};
    const data = state.customerData;
    if (!data.name?.trim()) {
      newErrors.name = "Name is required";
    }
    if (!data.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Invalid email format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [state.customerData]);
  return {
    customerData: state.customerData,
    updateField,
    errors,
    validate,
    isValid: Object.keys(errors).length === 0
  };
}

// src/nextjs/index.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function ClientOnly({
  children,
  fallback = null
}) {
  const [hasMounted, setHasMounted] = (0, import_react3.useState)(false);
  (0, import_react3.useEffect)(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return fallback;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_jsx_runtime2.Fragment, { children });
}
function useQuoteEngineConfig(overrides) {
  const apiKey = process.env.NEXT_PUBLIC_QUOTE_ENGINE_API_KEY;
  if (!apiKey && !overrides?.apiKey) {
    console.warn(
      "[QuoteEngine] Missing API key. Set NEXT_PUBLIC_QUOTE_ENGINE_API_KEY or provide apiKey in config."
    );
  }
  return {
    apiKey: apiKey || "",
    baseUrl: process.env.NEXT_PUBLIC_QUOTE_ENGINE_BASE_URL,
    ...overrides
  };
}
async function validateApiKey2(apiKey) {
  try {
    const response = await fetch(
      `${process.env.QUOTE_ENGINE_BASE_URL || "https://api.thinkpinkstudio.it"}/api/validate-key`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey
        }
      }
    );
    return response.ok;
  } catch {
    return false;
  }
}
async function getQuoteServer(quoteId) {
  const apiKey = process.env.QUOTE_ENGINE_API_KEY;
  if (!apiKey) {
    throw new Error("QUOTE_ENGINE_API_KEY not set");
  }
  const response = await fetch(
    `${process.env.QUOTE_ENGINE_BASE_URL || "https://api.thinkpinkstudio.it"}/api/quotes/${quoteId}`,
    {
      headers: {
        "X-API-Key": apiKey
      },
      next: { revalidate: 60 }
      // Cache for 60 seconds
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch quote");
  }
  const data = await response.json();
  return data.quote;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Analytics,
  ApiKeyValidationError,
  ClientOnly,
  DEFAULT_DARK_THEME,
  ELEGANT_THEME_DARK,
  ELEGANT_THEME_LIGHT,
  GLASS_THEME_DARK,
  GLASS_THEME_LIGHT,
  MINIMAL_THEME_DARK,
  MINIMAL_THEME_LIGHT,
  PLAN_LIMITS,
  PLAN_PRICING,
  QuoteEngineClient,
  QuoteEngineProvider,
  SCOPE_PERMISSIONS,
  THEME_STYLE_PRESETS,
  ThemeManager,
  VERSION,
  WEBHOOK_ID_HEADER,
  WEBHOOK_SIGNATURE_HEADER,
  WEBHOOK_TIMESTAMP_HEADER,
  WebhookClient,
  assertPermission,
  calculatePricingSummary,
  computeSignature,
  constructEvent,
  createAnalytics,
  createAnalyticsFromConfig,
  createQuoteEngine,
  createStyledTheme,
  createThemeManager,
  createWebhookClient,
  debounce,
  deepMerge,
  formatCurrency,
  formatDate,
  formatQuoteNumber,
  generateThemeCss,
  getApiKeyPermissions,
  getCountryFromLocale,
  getDaysUntilExpiry,
  getLocaleFromLanguage,
  getQuoteServer,
  getScopeDescription,
  getThemePreset,
  hasPermission,
  isLiveKey,
  isQuoteExpired,
  isTestKey,
  isValidApiKeyFormat,
  isValidEmail,
  isValidPhone,
  listEnabledPermissions,
  maskApiKey,
  parseApiKey,
  storage,
  t,
  throttle,
  translations,
  useCustomerForm,
  usePayment,
  useQuote,
  useQuoteChat,
  useQuoteEngineConfig,
  useQuoteEngineContext,
  useQuoteEngineEvent,
  useQuoteWidget,
  validateApiKey,
  verifySignature
});
//# sourceMappingURL=index.js.map