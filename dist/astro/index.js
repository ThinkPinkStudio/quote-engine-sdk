"use strict";
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

// src/astro/index.ts
var index_exports = {};
__export(index_exports, {
  QuoteEngineClient: () => QuoteEngineClient,
  VERSION: () => VERSION,
  createQuoteEngine: () => createQuoteEngine,
  createQuoteEngineEmbed: () => createQuoteEngineEmbed,
  createQuoteEngineScript: () => createQuoteEngineScript,
  createViewTransitionScript: () => createViewTransitionScript,
  formatCurrency: () => formatCurrency,
  formatDate: () => formatDate,
  generateThemeCss: () => generateThemeCss,
  getQuoteEngineConfig: () => getQuoteEngineConfig,
  storage: () => storage,
  t: () => t,
  translations: () => translations,
  validateApiKeyServer: () => validateApiKeyServer
});
module.exports = __toCommonJS(index_exports);

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

// src/core/index.ts
var VERSION = "1.0.0";

// src/astro/index.ts
function getQuoteEngineConfig(overrides) {
  return {
    language: overrides.language || "en",
    debug: overrides.debug || false,
    containerId: overrides.containerId || "quote-engine-container",
    autoInit: overrides.autoInit !== false,
    mode: overrides.mode || "inline",
    ...overrides
  };
}
function createQuoteEngineScript(config) {
  const serialized = JSON.stringify({
    apiKey: config.apiKey,
    language: config.language || "en",
    debug: config.debug || false,
    theme: config.theme || {},
    containerId: config.containerId || "quote-engine-container",
    mode: config.mode || "inline"
  });
  return `
(function() {
  var config = ${serialized};

  function initQuoteEngine() {
    if (typeof window.QuoteEngine !== 'undefined') {
      window.QuoteEngine.init(config);
      return;
    }

    // If the vanilla bundle is loaded as a module
    import('${config.baseUrl || "https://www.thinkpinkstudio.it"}/sdk/quote-engine.iife.js')
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
`;
}
function createQuoteEngineEmbed(config) {
  const containerId = config.containerId || "quote-engine-container";
  return `<div id="${containerId}" data-qe-api-key="${config.apiKey}" data-qe-language="${config.language || "en"}" data-qe-mode="${config.mode || "inline"}"></div>
<script>${createQuoteEngineScript(config)}</script>`;
}
async function validateApiKeyServer(apiKey, baseUrl = "https://www.thinkpinkstudio.it") {
  try {
    const response = await fetch(`${baseUrl}/api/qe-sdk/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey
      }
    });
    if (!response.ok) {
      const data2 = await response.json().catch(() => ({}));
      return { valid: false, error: data2.error?.message || "Invalid API key" };
    }
    const data = await response.json();
    return { valid: true, tenant: data.data?.tenant };
  } catch (error) {
    return { valid: false, error: error.message || "Network error" };
  }
}
function createViewTransitionScript(config) {
  return `
document.addEventListener('astro:page-load', function() {
  var container = document.getElementById('${config.containerId || "quote-engine-container"}');
  if (container && window.QuoteEngine) {
    window.QuoteEngine.init(${JSON.stringify({
    apiKey: config.apiKey,
    language: config.language || "en",
    debug: config.debug || false,
    theme: config.theme || {},
    containerId: config.containerId || "quote-engine-container",
    mode: config.mode || "inline"
  })});
  }
});
`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  QuoteEngineClient,
  VERSION,
  createQuoteEngine,
  createQuoteEngineEmbed,
  createQuoteEngineScript,
  createViewTransitionScript,
  formatCurrency,
  formatDate,
  generateThemeCss,
  getQuoteEngineConfig,
  storage,
  t,
  translations,
  validateApiKeyServer
});
//# sourceMappingURL=index.js.map