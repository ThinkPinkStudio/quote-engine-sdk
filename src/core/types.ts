/**
 * ThinkPink Quote Engine SDK - Type Definitions
 *
 * Complete TypeScript interfaces aligned with the multi-tenant platform
 * using Stripe Connect for payments with escrow functionality
 */

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * SDK Configuration options
 */
export interface QuoteEngineConfig {
  /** Your API key obtained from ThinkPink Developer Portal */
  apiKey: string

  /** Tenant slug (your unique identifier) */
  tenantSlug?: string

  /** Base URL of the Quote Engine API (default: https://api.[REDACTED]) */
  baseUrl?: string

  /** Language for the chat interface */
  language?: Language

  /** Theme customization options (overrides tenant branding) */
  theme?: Partial<ThemeConfig>

  /** UI text label overrides (i18n / white-label) */
  labels?: Partial<TextLabels>

  /** Callback handlers */
  callbacks?: CallbackHandlers

  /** Enable debug mode for development */
  debug?: boolean

  /** Custom headers to send with requests */
  headers?: Record<string, string>

  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number

  /** Maximum number of retry attempts for failed requests (default: 3) */
  maxRetries?: number

  /** Base delay for exponential backoff in milliseconds (default: 1000) */
  retryBaseDelay?: number

  /** Enable analytics tracking (default: true) */
  analytics?: boolean

  /** Enable session persistence (default: true) */
  persistSession?: boolean

  /** Custom storage adapter (default: localStorage) */
  storage?: StorageAdapter
}

/**
 * Supported languages
 */
export type Language = 'it' | 'en' | 'de' | 'fr' | 'es' | 'nl' | 'pt'

/**
 * Theme style presets
 * - 'glass': Glassmorphism effects, gradients, blur - bold & modern
 * - 'minimal': Clean, flat, lightweight - minimal visual noise
 * - 'elegant': Soft shadows, refined typography - sophisticated
 */
export type ThemeStyle = 'glass' | 'minimal' | 'elegant'

/**
 * Theme customization (from TenantBranding)
 *
 * Comprehensive design token system for pixel-perfect white-label control.
 * Every visual aspect of the widget is configurable via props.
 */
export interface ThemeConfig {
  // ── Branding ─────────────────────────────────────────────────────────
  /** Company name */
  companyName?: string

  /** Logo URL */
  logo?: string

  /** Logo for dark backgrounds */
  logoLight?: string

  /** Favicon URL */
  favicon?: string

  /** Contact email */
  contactEmail?: string

  /** Contact phone */
  contactPhone?: string

  /** Website URL */
  website?: string

  // ── Color Palette ────────────────────────────────────────────────────
  /** Primary brand color (hex) */
  primaryColor?: string

  /** Primary hover state color (auto-generated from primaryColor if omitted) */
  primaryColorHover?: string

  /** Primary light variant (auto-generated from primaryColor if omitted) */
  primaryColorLight?: string

  /** Secondary brand color (hex) */
  secondaryColor?: string

  /** Accent color for highlights, links (hex) */
  accentColor?: string

  /** Background color for widget container */
  backgroundColor?: string

  /** Surface color for cards, elevated elements */
  surfaceColor?: string

  /** Text color – main body text */
  textColor?: string

  /** Muted text – secondary labels, timestamps */
  textColorMuted?: string

  /** Inverse text – text on primary-colored backgrounds */
  textColorInverse?: string

  /** Border color for inputs, separators */
  borderColor?: string

  /** Error color */
  errorColor?: string

  /** Success color */
  successColor?: string

  /** Warning color */
  warningColor?: string

  // ── Message Bubbles ──────────────────────────────────────────────────
  /** User message bubble background */
  userBubbleColor?: string

  /** User message text color */
  userBubbleTextColor?: string

  /** Assistant message bubble background */
  assistantBubbleColor?: string

  /** Assistant message text color */
  assistantBubbleTextColor?: string

  /** User bubble border radius (px) */
  userBubbleBorderRadius?: string

  /** Assistant bubble border radius (px) */
  assistantBubbleBorderRadius?: string

  /** Max width of message bubbles (e.g. '80%' or '320px') */
  bubbleMaxWidth?: string

  // ── Typography ───────────────────────────────────────────────────────
  /** Body font family */
  fontFamily?: string

  /** Heading font family */
  headingFont?: string

  /** Base font size (px) */
  fontSize?: number

  /** Small font size (px) */
  fontSizeSmall?: number

  /** Large font size (px) */
  fontSizeLarge?: number

  /** Heading font size (px) */
  fontSizeHeading?: number

  /** Body font weight (e.g. '400', 'normal') */
  fontWeight?: string

  /** Bold font weight (e.g. '600', 'bold') */
  fontWeightBold?: string

  /** Base line height */
  lineHeight?: number

  /** Letter spacing (em) */
  letterSpacing?: string

  // ── Spacing & Layout ─────────────────────────────────────────────────
  /** Border radius for containers (px) */
  borderRadius?: number

  /** Border radius for buttons (px) */
  buttonBorderRadius?: number

  /** Border radius for inputs (px) */
  inputBorderRadius?: number

  /** Container padding (px) */
  containerPadding?: number

  /** Gap between messages (px) */
  messageGap?: number

  /** Widget height (e.g. '500px', '80vh') */
  widgetHeight?: string

  /** Widget max height */
  widgetMaxHeight?: string

  /** Widget width (e.g. '100%', '400px') */
  widgetWidth?: string

  // ── Shadows & Effects ────────────────────────────────────────────────
  /** Container box shadow */
  boxShadow?: string

  /** Elevated element shadow (modals, dropdowns) */
  boxShadowElevated?: string

  /** Modal overlay color (rgba) */
  overlayColor?: string

  /** Transition duration (e.g. '0.2s') */
  transitionDuration?: string

  /** Transition easing function */
  transitionEasing?: string

  // ── Buttons ──────────────────────────────────────────────────────────
  /** Send button size (px) */
  sendButtonSize?: number

  /** Button padding (CSS shorthand, e.g. '12px 24px') */
  buttonPadding?: string

  /** Button font size (px) */
  buttonFontSize?: number

  /** Disabled button opacity (0-1) */
  disabledOpacity?: number

  // ── Input Field ──────────────────────────────────────────────────────
  /** Input field background color */
  inputBackgroundColor?: string

  /** Input field border color */
  inputBorderColor?: string

  /** Input field focus border color */
  inputFocusBorderColor?: string

  /** Input field padding (CSS shorthand) */
  inputPadding?: string

  /** Input field font size (px) */
  inputFontSize?: number

  // ── Header ───────────────────────────────────────────────────────────
  /** Header background color */
  headerBackgroundColor?: string

  /** Header text color */
  headerTextColor?: string

  /** Header padding (CSS shorthand) */
  headerPadding?: string

  /** Header border bottom */
  headerBorderBottom?: string

  /** Logo height (px) */
  logoHeight?: number

  // ── Loading Indicator ────────────────────────────────────────────────
  /** Loading dots color */
  loadingColor?: string

  /** Loading dot size (px) */
  loadingDotSize?: number

  /** Loading animation duration (s) */
  loadingAnimationDuration?: number

  // ── Custom CSS (Enterprise only) ─────────────────────────────────────
  /** Raw CSS to inject (Enterprise only) */
  customCSS?: string

  // ── Theme Style ───────────────────────────────────────────────────────
  /**
   * Theme style preset: controls the visual "weight" of the UI
   * - 'glass': Glassmorphism effects, gradients, blur - bold & modern
   * - 'minimal': Clean, flat, light - minimal visual noise
   * - 'elegant': Soft shadows, refined typography - sophisticated
   * Defaults to 'minimal' if not specified.
   */
  style?: 'glass' | 'minimal' | 'elegant'

  // ── Dark Mode ─────────────────────────────────────────────────────────
  /** Theme mode: 'light', 'dark', or 'auto' (follows system preference) */
  mode?: 'light' | 'dark' | 'auto'

  /** Dark mode color overrides - applied when in dark mode */
  darkTheme?: {
    primaryColor?: string
    primaryColorHover?: string
    primaryColorLight?: string
    secondaryColor?: string
    accentColor?: string
    backgroundColor?: string
    surfaceColor?: string
    textColor?: string
    textColorMuted?: string
    textColorInverse?: string
    borderColor?: string
    errorColor?: string
    successColor?: string
    warningColor?: string
    userBubbleColor?: string
    userBubbleTextColor?: string
    assistantBubbleColor?: string
    assistantBubbleTextColor?: string
    inputBackgroundColor?: string
    inputBorderColor?: string
    inputFocusBorderColor?: string
    headerBackgroundColor?: string
    headerTextColor?: string
    overlayColor?: string
    loadingColor?: string
  }
}

/**
 * UI Text Labels — fully customizable for i18n / white-label.
 *
 * Every string shown in the pre-built widget is overridable.
 * These are used by the Vanilla JS widget and Flutter widget.
 * For headless integrations (React hooks, Vue composables, Angular service)
 * you render your own UI so you control text directly.
 */
export interface TextLabels {
  /** Widget header title (default: 'Get a Quote') */
  headerTitle?: string

  /** Chat input placeholder */
  inputPlaceholder?: string

  /** Send button tooltip / aria-label */
  sendButtonLabel?: string

  /** "Generate Quote" button text */
  generateQuoteLabel?: string

  /** Typing indicator text (default: 'Typing...') */
  typingIndicator?: string

  /** Welcome message shown when chat starts */
  welcomeMessage?: string

  /** Error: network error */
  errorNetwork?: string

  /** Error: generic error */
  errorGeneric?: string

  /** Quote preview title */
  quoteTitle?: string

  /** Subtotal label */
  subtotalLabel?: string

  /** VAT label */
  vatLabel?: string

  /** Total label */
  totalLabel?: string

  /** Deposit label */
  depositLabel?: string

  /** "Pay Now" button text */
  payNowLabel?: string

  /** Processing text */
  processingLabel?: string

  /** "Expires in" text */
  expiresInLabel?: string

  /** "days" text */
  daysLabel?: string

  /** Close button aria-label */
  closeButtonLabel?: string

  /** Powered-by footer text (set empty to hide) */
  poweredByText?: string
}

/**
 * CSS class name overrides for the pre-built widget.
 *
 * Allows consumers to replace default BEM class names with their own
 * (Tailwind, CSS Modules, BEM variants, etc.).
 */
export interface ClassNameOverrides {
  /** Root widget wrapper */
  root?: string

  /** Container */
  container?: string

  /** Header bar */
  header?: string

  /** Logo image */
  logo?: string

  /** Title text */
  title?: string

  /** Close button */
  closeButton?: string

  /** Chat area */
  chat?: string

  /** Messages scroll container */
  messages?: string

  /** Single message bubble */
  message?: string

  /** User message */
  messageUser?: string

  /** Assistant message */
  messageAssistant?: string

  /** Streaming message */
  messageStreaming?: string

  /** Input container */
  inputContainer?: string

  /** Text input */
  input?: string

  /** Send button */
  sendButton?: string

  /** Generate quote button */
  generateButton?: string

  /** Loading indicator */
  loading?: string

  /** Modal overlay */
  overlay?: string

  /** Quote preview section */
  quotePreview?: string

  /** Payment section */
  payment?: string
}

/**
 * Event callback handlers
 */
export interface CallbackHandlers {
  /** Called when widget is ready */
  onReady?: () => void

  /** Called when chat starts */
  onChatStart?: () => void

  /** Called when a message is sent */
  onMessageSent?: (message: ChatMessage) => void

  /** Called when a message is received */
  onMessageReceived?: (message: ChatMessage) => void

  /** Called when quote is generated */
  onQuoteGenerated?: (quoteId: string) => void

  /** Called when payment starts */
  onPaymentStart?: (quoteId: string) => void

  /** Called when payment is completed */
  onPaymentCompleted?: (paymentId: string) => void

  /** Called on any error */
  onError?: (error: QuoteEngineError) => void

  /** Called when widget is closed */
  onClose?: () => void

  /** Called when step changes */
  onStepChange?: (step: QuoteStep) => void
}

// ============================================================================
// Tenant Types (from platform)
// ============================================================================

/**
 * Tenant subscription plans
 */
export type TenantPlan = 'starter' | 'pro' | 'enterprise'

/**
 * Plan limits and features
 */
export const PLAN_LIMITS: Record<TenantPlan, {
  quotesPerMonth: number
  usersAllowed: number
  escrowFee: number
  features: string[]
}> = {
  starter: {
    quotesPerMonth: 10,
    usersAllowed: 1,
    escrowFee: 0,
    features: ['basic_branding', 'email_support']
  },
  pro: {
    quotesPerMonth: -1,
    usersAllowed: 3,
    escrowFee: 0.04, // 4% platform fee
    features: [
      'full_branding',
      'escrow_payments',
      'contracts',
      'zapier',
      'priority_support',
      'custom_domain'
    ]
  },
  enterprise: {
    quotesPerMonth: -1,
    usersAllowed: 10,
    escrowFee: 0.02, // 2% platform fee
    features: [
      'white_label',
      'escrow_payments',
      'contracts',
      'api_access',
      'native_crm',
      'sla_24h',
      'dedicated_support',
      'custom_domain',
      'multi_language',
      'advanced_analytics'
    ]
  }
}

/**
 * Plan pricing
 */
export const PLAN_PRICING: Record<TenantPlan, {
  monthly: number
  yearly: number
  currency: 'EUR'
}> = {
  starter: { monthly: 49, yearly: 490, currency: 'EUR' },
  pro: { monthly: 149, yearly: 1490, currency: 'EUR' },
  enterprise: { monthly: 499, yearly: 4990, currency: 'EUR' }
}

/**
 * Public tenant configuration (safe to expose)
 */
export interface TenantPublicConfig {
  slug: string
  branding: ThemeConfig
  aiConfig: {
    personality: 'professional' | 'friendly' | 'technical' | 'casual'
    tone: 'formal' | 'conversational' | 'enthusiastic'
    welcomeMessage: string
    primaryLanguage: Language
    supportedLanguages: Language[]
    enabledProjectTypes: ProjectType[]
    enabledTechnologies: Technology[]
  }
  payments: {
    escrowEnabled: boolean
    enabledMethods: PaymentMethod[]
  }
  hostedSettings: {
    hostedEnabled: boolean
    pageTitle?: string
    pageDescription?: string
    heroTitle?: string
    heroSubtitle?: string
    ctaText?: string
  }
  features: string[]
}

// ============================================================================
// Chat Types
// ============================================================================

/**
 * Chat message
 */
export interface ChatMessage {
  /** Unique message ID */
  id: string

  /** Message role */
  role: 'user' | 'assistant' | 'system'

  /** Message content */
  content: string

  /** Timestamp */
  timestamp: Date

  /** Message metadata */
  metadata?: MessageMetadata
}

/**
 * Message metadata from AI
 */
export interface MessageMetadata {
  /** AI confidence level (0-100) */
  confidence?: number

  /** Whether enough info to generate quote */
  shouldGenerateQuote?: boolean

  /** Extracted requirements so far */
  extractedRequirements?: Partial<ExtractedRequirements>
}

/**
 * Chat session state
 */
export interface ChatSession {
  /** Session ID */
  id: string

  /** All messages in the session */
  messages: ChatMessage[]

  /** Session status */
  status: 'active' | 'completed' | 'expired'

  /** Customer data collected */
  customerData?: CustomerData

  /** Created timestamp */
  createdAt: Date

  /** Last activity timestamp */
  updatedAt: Date
}

/**
 * Customer data
 */
export interface CustomerData {
  name?: string
  email?: string
  company?: string
  phone?: string
  country?: string
}

/**
 * Requirements extracted from conversation
 */
export interface ExtractedRequirements {
  projectName: string
  projectDescription: string
  projectType: ProjectType
  complexity: Complexity
  technologies: Technology[]
  features: Feature[]
  timeline?: string
  budget?: string
  additionalNotes?: string
}

// ============================================================================
// Quote Types
// ============================================================================

/**
 * Quote status
 */
export type QuoteStatus =
  | 'draft'
  | 'generated'
  | 'sent'
  | 'viewed'
  | 'paid'
  | 'confirmed'
  | 'expired'
  | 'cancelled'

/**
 * Project types
 */
export type ProjectType =
  | 'web'
  | 'mobile'
  | 'desktop'
  | 'ai'
  | 'iot'
  | 'game'
  | 'ecommerce'
  | 'saas'

/**
 * Complexity levels
 */
export type Complexity = 'simple' | 'medium' | 'complex' | 'enterprise'

/**
 * Supported technologies
 */
export type Technology =
  | 'react'
  | 'nextjs'
  | 'vue'
  | 'angular'
  | 'svelte'
  | 'flutter'
  | 'react-native'
  | 'nodejs'
  | 'python'
  | 'go'
  | 'rust'
  | 'postgresql'
  | 'mongodb'
  | 'firebase'
  | 'aws'
  | 'gcp'
  | 'azure'
  | 'openai'
  | 'anthropic'
  | 'stripe'
  | string

/**
 * Feature types
 */
export type Feature =
  | 'auth_basic'
  | 'auth_oauth'
  | 'auth_mfa'
  | 'db_basic'
  | 'db_advanced'
  | 'api_rest'
  | 'api_graphql'
  | 'payment_integration'
  | 'payment_subscriptions'
  | 'ai_chat'
  | 'ai_analysis'
  | 'ai_generation'
  | 'realtime'
  | 'notifications'
  | 'analytics'
  | 'admin_panel'
  | 'cms'
  | 'i18n'
  | 'seo'
  | 'testing'
  | string

/**
 * Complete quote object
 */
export interface Quote {
  /** Unique quote ID */
  id: string

  /** Human-readable quote number (e.g., QU-2024-001) */
  quoteNumber: string

  /** Current status */
  status: QuoteStatus

  /** Tenant ID */
  tenantId: string

  /** Customer information */
  customer: Customer

  /** Conversation data */
  conversation: ConversationData

  /** Project details */
  project: Project

  /** Pricing breakdown */
  pricing: Pricing

  /** Escrow information (PRO/ENTERPRISE) */
  escrow?: EscrowInfo

  /** Contract information */
  contract?: ContractInfo

  /** Quote language */
  language: Language

  /** Creation timestamp */
  createdAt: Date

  /** Last update timestamp */
  updatedAt: Date

  /** Expiration date */
  expiresAt: Date

  /** Public URL to view quote */
  publicUrl?: string

  /** PDF download URL */
  pdfUrl?: string

  /** Source tracking */
  source?: {
    type: 'hosted' | 'embed' | 'api'
    referrer?: string
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
  }
}

/**
 * Customer information
 */
export interface Customer {
  email: string
  name: string
  company?: string
  phone?: string
  country: string
  vatNumber?: string
}

/**
 * Conversation data stored with quote
 */
export interface ConversationData {
  /** All chat messages */
  messages: ChatMessage[]

  /** AI-generated summary */
  summary: string

  /** Extracted requirements */
  requirements: ExtractedRequirements

  /** AI confidence score (0-100) */
  aiConfidence: number

  /** Total messages exchanged */
  totalMessages: number
}

/**
 * Project details
 */
export interface Project {
  /** Project name */
  name: string

  /** Project description */
  description: string

  /** Project type */
  type: ProjectType

  /** Complexity level */
  complexity: Complexity

  /** Technologies to be used */
  technologies: Technology[]

  /** Features to implement */
  features: Feature[]

  /** Estimated hours */
  estimatedHours: number

  /** Timeline information */
  timeline: Timeline
}

/**
 * Timeline information
 */
export interface Timeline {
  /** Estimated weeks to complete */
  estimatedWeeks: number

  /** Project phases */
  phases: ProjectPhase[]
}

/**
 * Project phase
 */
export interface ProjectPhase {
  /** Phase ID */
  id: string

  /** Phase name */
  name: string

  /** Phase description */
  description: string

  /** Duration in weeks */
  durationWeeks: number

  /** Deliverables */
  deliverables: string[]
}

// ============================================================================
// Pricing Types
// ============================================================================

/**
 * Complete pricing information
 */
export interface Pricing {
  /** Price breakdown by category */
  breakdown: PriceBreakdown[]

  /** Subtotal before discounts */
  subtotal: number

  /** Applied discounts */
  discounts: Discount[]

  /** Subtotal after discounts */
  subtotalAfterDiscounts: number

  /** VAT information */
  vat: VatInfo

  /** Total including VAT */
  total: number

  /** Currency (always EUR) */
  currency: 'EUR'

  /** Deposit information */
  deposit: DepositInfo

  /** Payment milestones */
  milestones: PaymentMilestone[]
}

/**
 * Price breakdown item
 */
export interface PriceBreakdown {
  /** Item name */
  item: string

  /** Item description */
  description: string

  /** Hours estimated */
  hours: number

  /** Rate per hour in EUR */
  ratePerHour: number

  /** Subtotal for this item */
  subtotal: number

  /** Category */
  category: PriceCategory
}

/**
 * Price categories
 */
export type PriceCategory =
  | 'development'
  | 'design'
  | 'ai'
  | 'testing'
  | 'management'
  | 'infrastructure'

/**
 * Discount applied
 */
export interface Discount {
  /** Discount ID */
  id: string

  /** Discount name */
  name: string

  /** Discount type */
  type: 'percentage' | 'fixed'

  /** Discount value */
  value: number

  /** Amount saved */
  amount: number
}

/**
 * VAT information
 */
export interface VatInfo {
  /** VAT rate (e.g., 22 for Italy) */
  rate: number

  /** VAT amount */
  amount: number

  /** Country code */
  countryCode?: string
}

/**
 * Deposit information
 */
export interface DepositInfo {
  /** Deposit percentage */
  percentage: number

  /** Deposit amount */
  amount: number
}

/**
 * Payment milestone
 */
export interface PaymentMilestone {
  /** Milestone ID */
  id: string

  /** Milestone name */
  name: string

  /** Percentage of total */
  percentage: number

  /** Amount to pay */
  amount: number

  /** Description */
  description: string

  /** Due condition */
  dueCondition?: string

  /** Payment status */
  status?: 'pending' | 'paid' | 'released'
}

// ============================================================================
// Payment Types (Stripe Connect)
// ============================================================================

/**
 * Payment methods supported
 */
export type PaymentMethod = 'card' | 'bank_transfer'

/**
 * Escrow information (for PRO/ENTERPRISE plans)
 *
 * With escrow, funds are held by the platform and released
 * to the tenant when milestones are completed.
 * Platform fee: 4% (PRO) or 2% (ENTERPRISE)
 */
export interface EscrowInfo {
  /** Escrow status */
  status: 'none' | 'pending' | 'held' | 'partial_release' | 'released' | 'disputed' | 'refunded'

  /** Amount held in escrow */
  amountHeld: number

  /** Platform fee (4% PRO, 2% ENTERPRISE) */
  platformFee: number

  /** Amount already released */
  amountReleased: number

  /** Release history */
  releases: {
    amount: number
    milestone: string
    releasedAt: Date
  }[]

  /** Stripe payment intent ID */
  stripePaymentIntentId?: string

  /** Stripe transfer ID */
  stripeTransferId?: string

  /** Dispute reason if disputed */
  disputeReason?: string
}

/**
 * Contract information
 */
export interface ContractInfo {
  /** Contract ID */
  id: string

  /** Contract status */
  status: 'draft' | 'sent' | 'viewed' | 'signed' | 'expired' | 'rejected'

  /** Sent timestamp */
  sentAt?: Date

  /** Viewed timestamp */
  viewedAt?: Date

  /** Signed timestamp */
  signedAt?: Date

  /** Signature data (base64) */
  signatureData?: string

  /** Signer information */
  signerName?: string
  signerEmail?: string
  signerIp?: string

  /** Signed PDF URL */
  pdfUrl?: string
}

/**
 * Payment initiation response (Stripe)
 */
export interface PaymentInitResponse {
  /** Payment ID */
  paymentId: string

  /** Stripe payment intent ID */
  paymentIntentId: string

  /** Client secret for Stripe Elements */
  clientSecret: string

  /** Total amount in cents */
  amount: number

  /** Platform fee in cents */
  platformFee: number

  /** Whether this is an escrow payment */
  isEscrow: boolean
}

/**
 * Payment status
 */
export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'refunded'
  | 'cancelled'

// ============================================================================
// Widget Types
// ============================================================================

/**
 * Quote engine steps
 */
export type QuoteStep =
  | 'chat'
  | 'preview'
  | 'customer-info'
  | 'payment'
  | 'contract'
  | 'completed'

/**
 * Widget state
 */
export interface WidgetState {
  /** Current step */
  currentStep: QuoteStep

  /** Whether widget is open */
  isOpen: boolean

  /** Whether loading */
  isLoading: boolean

  /** Current chat session */
  chatSession: ChatSession | null

  /** Generated quote */
  quote: Quote | null

  /** Current error */
  error: QuoteEngineError | null

  /** Customer data */
  customerData: CustomerData
}

/**
 * Widget display mode
 */
export type WidgetMode = 'inline' | 'modal' | 'fullpage'

/**
 * Widget position for floating mode
 */
export type WidgetPosition =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left'

/**
 * Widget options (from WidgetConfig in tenant.ts)
 */
export interface WidgetOptions {
  /** Tenant ID */
  tenantId?: string

  /** Display mode */
  mode?: WidgetMode

  /** Auto-open on page load */
  autoOpen?: boolean

  /** Close on complete */
  closeOnComplete?: boolean

  /** Language override */
  language?: Language

  /** Container element ID for inline mode */
  containerId?: string

  /** Show close button */
  showCloseButton?: boolean

  /** Initial step */
  initialStep?: QuoteStep

  /** Pre-fill customer data */
  customerData?: CustomerData

  /** Skip chat and go directly to manual quote */
  skipChat?: boolean

  /** Position for modal/floating mode */
  position?: WidgetPosition

  /** UI text label overrides (i18n / white-label) */
  labels?: Partial<TextLabels>

  /** CSS class name overrides */
  classNames?: Partial<ClassNameOverrides>
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Quote engine error
 */
export interface QuoteEngineError {
  /** Error code */
  code: QuoteEngineErrorCode

  /** Human-readable message */
  message: string

  /** Additional details */
  details?: Record<string, unknown>

  /** Original error */
  cause?: Error
}

/**
 * Storage adapter interface for session persistence
 * Use this to provide custom storage implementations (e.g., AsyncStorage for RN)
 */
export interface StorageAdapter {
  /** Get a value from storage */
  get<T>(key: string): T | null | Promise<T | null>

  /** Set a value in storage */
  set<T>(key: string, value: T): void | Promise<void>

  /** Remove a value from storage */
  remove(key: string): void | Promise<void>

  /** Clear all SDK-related storage */
  clear(): void | Promise<void>
}

/**
 * Error codes
 */
export type QuoteEngineErrorCode =
  | 'INVALID_API_KEY'
  | 'API_KEY_EXPIRED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'QUOTA_EXCEEDED'
  | 'NETWORK_ERROR'
  | 'INVALID_CONFIG'
  | 'CHAT_ERROR'
  | 'QUOTE_GENERATION_ERROR'
  | 'PAYMENT_ERROR'
  | 'ESCROW_ERROR'
  | 'SESSION_EXPIRED'
  | 'VALIDATION_ERROR'
  | 'TENANT_NOT_FOUND'
  | 'STRIPE_ERROR'
  | 'UNKNOWN_ERROR'

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Base API response
 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

/**
 * Chat response
 */
export interface ChatResponse {
  message: ChatMessage
  metadata?: MessageMetadata
  shouldGenerateQuote?: boolean
}

/**
 * Quote generation response
 */
export interface QuoteGenerationResponse {
  quote: Quote
  remaining: number
}

/**
 * Stream event types
 */
export type StreamEventType =
  | 'content'
  | 'metadata'
  | 'rag_context'
  | 'error'
  | 'done'

/**
 * Stream event
 */
export interface StreamEvent {
  type: StreamEventType
  data: {
    text?: string
    confidence?: number
    shouldGenerateQuote?: boolean
    error?: string
  }
}

// ============================================================================
// Webhook Event Types
// ============================================================================

/**
 * Webhook events that can be subscribed to
 */
export type WebhookEvent =
  | 'quote.created'
  | 'quote.updated'
  | 'quote.paid'
  | 'quote.expired'
  | 'contract.signed'
  | 'payment.received'
  | 'payment.released'
  | 'payment.disputed'

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Deep partial type
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// ============================================================================
// RAG Types (v2.0+)
// ============================================================================

/** RAG context returned with chat responses (v2.0+) */
export interface RAGInsight {
  dataPoints: number
  confidence: number
  similarProjectsCount: number
  pricingRange?: { min: number; max: number; avg: number }
}

/** Extended chat message with RAG metadata */
export interface ChatMessageV2 extends ChatMessage {
  ragInsight?: RAGInsight
}

/** Similar project reference (anonymized) */
export interface SimilarProjectRef {
  projectType: string
  complexity: string
  technologies: string[]
  estimatedHours: number
  priceRange: string
}

/** Extended quote with RAG data */
export interface QuoteV2 extends Quote {
  similarProjects?: SimilarProjectRef[]
  estimateConfidence?: number
  dataPointsUsed?: number
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Event listener cleanup function
 */
export type Unsubscribe = () => void

/**
 * Event types for the SDK
 */
export type QuoteEngineEvent =
  | 'ready'
  | 'chatStart'
  | 'messageSent'
  | 'messageReceived'
  | 'ragContextReceived'
  | 'quoteGenerated'
  | 'paymentStart'
  | 'paymentCompleted'
  | 'error'
  | 'close'
  | 'stepChange'
