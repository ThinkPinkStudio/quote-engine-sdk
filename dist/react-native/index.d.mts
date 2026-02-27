import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

/**
 * ThinkPink Quote Engine SDK - Type Definitions
 *
 * Complete TypeScript interfaces aligned with the multi-tenant platform
 * using Stripe Connect for payments with escrow functionality
 */
/**
 * SDK Configuration options
 */
interface QuoteEngineConfig {
    /** Your API key obtained from ThinkPink Developer Portal */
    apiKey: string;
    /** Tenant slug (your unique identifier) */
    tenantSlug?: string;
    /** Base URL of the Quote Engine API (default: https://api.[REDACTED]) */
    baseUrl?: string;
    /** Language for the chat interface */
    language?: Language;
    /** Theme customization options (overrides tenant branding) */
    theme?: Partial<ThemeConfig>;
    /** UI text label overrides (i18n / white-label) */
    labels?: Partial<TextLabels>;
    /** Callback handlers */
    callbacks?: CallbackHandlers;
    /** Enable debug mode for development */
    debug?: boolean;
    /** Custom headers to send with requests */
    headers?: Record<string, string>;
    /** Request timeout in milliseconds (default: 30000) */
    timeout?: number;
    /** Maximum number of retry attempts for failed requests (default: 3) */
    maxRetries?: number;
    /** Base delay for exponential backoff in milliseconds (default: 1000) */
    retryBaseDelay?: number;
    /** Enable analytics tracking (default: true) */
    analytics?: boolean;
    /** Enable session persistence (default: true) */
    persistSession?: boolean;
    /** Custom storage adapter (default: localStorage) */
    storage?: StorageAdapter;
}
/**
 * Supported languages
 */
type Language = 'it' | 'en' | 'de' | 'fr' | 'es' | 'nl' | 'pt';
/**
 * Theme customization (from TenantBranding)
 *
 * Comprehensive design token system for pixel-perfect white-label control.
 * Every visual aspect of the widget is configurable via props.
 */
interface ThemeConfig {
    /** Company name */
    companyName?: string;
    /** Logo URL */
    logo?: string;
    /** Logo for dark backgrounds */
    logoLight?: string;
    /** Favicon URL */
    favicon?: string;
    /** Contact email */
    contactEmail?: string;
    /** Contact phone */
    contactPhone?: string;
    /** Website URL */
    website?: string;
    /** Primary brand color (hex) */
    primaryColor?: string;
    /** Primary hover state color (auto-generated from primaryColor if omitted) */
    primaryColorHover?: string;
    /** Primary light variant (auto-generated from primaryColor if omitted) */
    primaryColorLight?: string;
    /** Secondary brand color (hex) */
    secondaryColor?: string;
    /** Accent color for highlights, links (hex) */
    accentColor?: string;
    /** Background color for widget container */
    backgroundColor?: string;
    /** Surface color for cards, elevated elements */
    surfaceColor?: string;
    /** Text color – main body text */
    textColor?: string;
    /** Muted text – secondary labels, timestamps */
    textColorMuted?: string;
    /** Inverse text – text on primary-colored backgrounds */
    textColorInverse?: string;
    /** Border color for inputs, separators */
    borderColor?: string;
    /** Error color */
    errorColor?: string;
    /** Success color */
    successColor?: string;
    /** Warning color */
    warningColor?: string;
    /** User message bubble background */
    userBubbleColor?: string;
    /** User message text color */
    userBubbleTextColor?: string;
    /** Assistant message bubble background */
    assistantBubbleColor?: string;
    /** Assistant message text color */
    assistantBubbleTextColor?: string;
    /** User bubble border radius (px) */
    userBubbleBorderRadius?: string;
    /** Assistant bubble border radius (px) */
    assistantBubbleBorderRadius?: string;
    /** Max width of message bubbles (e.g. '80%' or '320px') */
    bubbleMaxWidth?: string;
    /** Body font family */
    fontFamily?: string;
    /** Heading font family */
    headingFont?: string;
    /** Base font size (px) */
    fontSize?: number;
    /** Small font size (px) */
    fontSizeSmall?: number;
    /** Large font size (px) */
    fontSizeLarge?: number;
    /** Heading font size (px) */
    fontSizeHeading?: number;
    /** Body font weight (e.g. '400', 'normal') */
    fontWeight?: string;
    /** Bold font weight (e.g. '600', 'bold') */
    fontWeightBold?: string;
    /** Base line height */
    lineHeight?: number;
    /** Letter spacing (em) */
    letterSpacing?: string;
    /** Border radius for containers (px) */
    borderRadius?: number;
    /** Border radius for buttons (px) */
    buttonBorderRadius?: number;
    /** Border radius for inputs (px) */
    inputBorderRadius?: number;
    /** Container padding (px) */
    containerPadding?: number;
    /** Gap between messages (px) */
    messageGap?: number;
    /** Widget height (e.g. '500px', '80vh') */
    widgetHeight?: string;
    /** Widget max height */
    widgetMaxHeight?: string;
    /** Widget width (e.g. '100%', '400px') */
    widgetWidth?: string;
    /** Container box shadow */
    boxShadow?: string;
    /** Elevated element shadow (modals, dropdowns) */
    boxShadowElevated?: string;
    /** Modal overlay color (rgba) */
    overlayColor?: string;
    /** Transition duration (e.g. '0.2s') */
    transitionDuration?: string;
    /** Transition easing function */
    transitionEasing?: string;
    /** Send button size (px) */
    sendButtonSize?: number;
    /** Button padding (CSS shorthand, e.g. '12px 24px') */
    buttonPadding?: string;
    /** Button font size (px) */
    buttonFontSize?: number;
    /** Disabled button opacity (0-1) */
    disabledOpacity?: number;
    /** Input field background color */
    inputBackgroundColor?: string;
    /** Input field border color */
    inputBorderColor?: string;
    /** Input field focus border color */
    inputFocusBorderColor?: string;
    /** Input field padding (CSS shorthand) */
    inputPadding?: string;
    /** Input field font size (px) */
    inputFontSize?: number;
    /** Header background color */
    headerBackgroundColor?: string;
    /** Header text color */
    headerTextColor?: string;
    /** Header padding (CSS shorthand) */
    headerPadding?: string;
    /** Header border bottom */
    headerBorderBottom?: string;
    /** Logo height (px) */
    logoHeight?: number;
    /** Loading dots color */
    loadingColor?: string;
    /** Loading dot size (px) */
    loadingDotSize?: number;
    /** Loading animation duration (s) */
    loadingAnimationDuration?: number;
    /** Raw CSS to inject (Enterprise only) */
    customCSS?: string;
    /**
     * Theme style preset: controls the visual "weight" of the UI
     * - 'glass': Glassmorphism effects, gradients, blur - bold & modern
     * - 'minimal': Clean, flat, light - minimal visual noise
     * - 'elegant': Soft shadows, refined typography - sophisticated
     * Defaults to 'minimal' if not specified.
     */
    style?: 'glass' | 'minimal' | 'elegant';
    /** Theme mode: 'light', 'dark', or 'auto' (follows system preference) */
    mode?: 'light' | 'dark' | 'auto';
    /** Dark mode color overrides - applied when in dark mode */
    darkTheme?: {
        primaryColor?: string;
        primaryColorHover?: string;
        primaryColorLight?: string;
        secondaryColor?: string;
        accentColor?: string;
        backgroundColor?: string;
        surfaceColor?: string;
        textColor?: string;
        textColorMuted?: string;
        textColorInverse?: string;
        borderColor?: string;
        errorColor?: string;
        successColor?: string;
        warningColor?: string;
        userBubbleColor?: string;
        userBubbleTextColor?: string;
        assistantBubbleColor?: string;
        assistantBubbleTextColor?: string;
        inputBackgroundColor?: string;
        inputBorderColor?: string;
        inputFocusBorderColor?: string;
        headerBackgroundColor?: string;
        headerTextColor?: string;
        overlayColor?: string;
        loadingColor?: string;
    };
}
/**
 * UI Text Labels — fully customizable for i18n / white-label.
 *
 * Every string shown in the pre-built widget is overridable.
 * These are used by the Vanilla JS widget and Flutter widget.
 * For headless integrations (React hooks, Vue composables, Angular service)
 * you render your own UI so you control text directly.
 */
interface TextLabels {
    /** Widget header title (default: 'Get a Quote') */
    headerTitle?: string;
    /** Chat input placeholder */
    inputPlaceholder?: string;
    /** Send button tooltip / aria-label */
    sendButtonLabel?: string;
    /** "Generate Quote" button text */
    generateQuoteLabel?: string;
    /** Typing indicator text (default: 'Typing...') */
    typingIndicator?: string;
    /** Welcome message shown when chat starts */
    welcomeMessage?: string;
    /** Error: network error */
    errorNetwork?: string;
    /** Error: generic error */
    errorGeneric?: string;
    /** Quote preview title */
    quoteTitle?: string;
    /** Subtotal label */
    subtotalLabel?: string;
    /** VAT label */
    vatLabel?: string;
    /** Total label */
    totalLabel?: string;
    /** Deposit label */
    depositLabel?: string;
    /** "Pay Now" button text */
    payNowLabel?: string;
    /** Processing text */
    processingLabel?: string;
    /** "Expires in" text */
    expiresInLabel?: string;
    /** "days" text */
    daysLabel?: string;
    /** Close button aria-label */
    closeButtonLabel?: string;
    /** Powered-by footer text (set empty to hide) */
    poweredByText?: string;
}
/**
 * CSS class name overrides for the pre-built widget.
 *
 * Allows consumers to replace default BEM class names with their own
 * (Tailwind, CSS Modules, BEM variants, etc.).
 */
interface ClassNameOverrides {
    /** Root widget wrapper */
    root?: string;
    /** Container */
    container?: string;
    /** Header bar */
    header?: string;
    /** Logo image */
    logo?: string;
    /** Title text */
    title?: string;
    /** Close button */
    closeButton?: string;
    /** Chat area */
    chat?: string;
    /** Messages scroll container */
    messages?: string;
    /** Single message bubble */
    message?: string;
    /** User message */
    messageUser?: string;
    /** Assistant message */
    messageAssistant?: string;
    /** Streaming message */
    messageStreaming?: string;
    /** Input container */
    inputContainer?: string;
    /** Text input */
    input?: string;
    /** Send button */
    sendButton?: string;
    /** Generate quote button */
    generateButton?: string;
    /** Loading indicator */
    loading?: string;
    /** Modal overlay */
    overlay?: string;
    /** Quote preview section */
    quotePreview?: string;
    /** Payment section */
    payment?: string;
}
/**
 * Event callback handlers
 */
interface CallbackHandlers {
    /** Called when widget is ready */
    onReady?: () => void;
    /** Called when chat starts */
    onChatStart?: () => void;
    /** Called when a message is sent */
    onMessageSent?: (message: ChatMessage) => void;
    /** Called when a message is received */
    onMessageReceived?: (message: ChatMessage) => void;
    /** Called when quote is generated */
    onQuoteGenerated?: (quoteId: string) => void;
    /** Called when payment starts */
    onPaymentStart?: (quoteId: string) => void;
    /** Called when payment is completed */
    onPaymentCompleted?: (paymentId: string) => void;
    /** Called on any error */
    onError?: (error: QuoteEngineError) => void;
    /** Called when widget is closed */
    onClose?: () => void;
    /** Called when step changes */
    onStepChange?: (step: QuoteStep) => void;
}
/**
 * Chat message
 */
interface ChatMessage {
    /** Unique message ID */
    id: string;
    /** Message role */
    role: 'user' | 'assistant' | 'system';
    /** Message content */
    content: string;
    /** Timestamp */
    timestamp: Date;
    /** Message metadata */
    metadata?: MessageMetadata;
}
/**
 * Message metadata from AI
 */
interface MessageMetadata {
    /** AI confidence level (0-100) */
    confidence?: number;
    /** Whether enough info to generate quote */
    shouldGenerateQuote?: boolean;
    /** Extracted requirements so far */
    extractedRequirements?: Partial<ExtractedRequirements>;
}
/**
 * Chat session state
 */
interface ChatSession {
    /** Session ID */
    id: string;
    /** All messages in the session */
    messages: ChatMessage[];
    /** Session status */
    status: 'active' | 'completed' | 'expired';
    /** Customer data collected */
    customerData?: CustomerData;
    /** Created timestamp */
    createdAt: Date;
    /** Last activity timestamp */
    updatedAt: Date;
}
/**
 * Customer data
 */
interface CustomerData {
    name?: string;
    email?: string;
    company?: string;
    phone?: string;
    country?: string;
}
/**
 * Requirements extracted from conversation
 */
interface ExtractedRequirements {
    projectName: string;
    projectDescription: string;
    projectType: ProjectType;
    complexity: Complexity;
    technologies: Technology[];
    features: Feature[];
    timeline?: string;
    budget?: string;
    additionalNotes?: string;
}
/**
 * Quote status
 */
type QuoteStatus = 'draft' | 'generated' | 'sent' | 'viewed' | 'paid' | 'confirmed' | 'expired' | 'cancelled';
/**
 * Project types
 */
type ProjectType = 'web' | 'mobile' | 'desktop' | 'ai' | 'iot' | 'game' | 'ecommerce' | 'saas';
/**
 * Complexity levels
 */
type Complexity = 'simple' | 'medium' | 'complex' | 'enterprise';
/**
 * Supported technologies
 */
type Technology = 'react' | 'nextjs' | 'vue' | 'angular' | 'svelte' | 'flutter' | 'react-native' | 'nodejs' | 'python' | 'go' | 'rust' | 'postgresql' | 'mongodb' | 'firebase' | 'aws' | 'gcp' | 'azure' | 'openai' | 'anthropic' | 'stripe' | string;
/**
 * Feature types
 */
type Feature = 'auth_basic' | 'auth_oauth' | 'auth_mfa' | 'db_basic' | 'db_advanced' | 'api_rest' | 'api_graphql' | 'payment_integration' | 'payment_subscriptions' | 'ai_chat' | 'ai_analysis' | 'ai_generation' | 'realtime' | 'notifications' | 'analytics' | 'admin_panel' | 'cms' | 'i18n' | 'seo' | 'testing' | string;
/**
 * Complete quote object
 */
interface Quote {
    /** Unique quote ID */
    id: string;
    /** Human-readable quote number (e.g., QU-2024-001) */
    quoteNumber: string;
    /** Current status */
    status: QuoteStatus;
    /** Tenant ID */
    tenantId: string;
    /** Customer information */
    customer: Customer;
    /** Conversation data */
    conversation: ConversationData;
    /** Project details */
    project: Project;
    /** Pricing breakdown */
    pricing: Pricing;
    /** Escrow information (PRO/ENTERPRISE) */
    escrow?: EscrowInfo;
    /** Contract information */
    contract?: ContractInfo;
    /** Quote language */
    language: Language;
    /** Creation timestamp */
    createdAt: Date;
    /** Last update timestamp */
    updatedAt: Date;
    /** Expiration date */
    expiresAt: Date;
    /** Public URL to view quote */
    publicUrl?: string;
    /** PDF download URL */
    pdfUrl?: string;
    /** Source tracking */
    source?: {
        type: 'hosted' | 'embed' | 'api';
        referrer?: string;
        utmSource?: string;
        utmMedium?: string;
        utmCampaign?: string;
    };
}
/**
 * Customer information
 */
interface Customer {
    email: string;
    name: string;
    company?: string;
    phone?: string;
    country: string;
    vatNumber?: string;
}
/**
 * Conversation data stored with quote
 */
interface ConversationData {
    /** All chat messages */
    messages: ChatMessage[];
    /** AI-generated summary */
    summary: string;
    /** Extracted requirements */
    requirements: ExtractedRequirements;
    /** AI confidence score (0-100) */
    aiConfidence: number;
    /** Total messages exchanged */
    totalMessages: number;
}
/**
 * Project details
 */
interface Project {
    /** Project name */
    name: string;
    /** Project description */
    description: string;
    /** Project type */
    type: ProjectType;
    /** Complexity level */
    complexity: Complexity;
    /** Technologies to be used */
    technologies: Technology[];
    /** Features to implement */
    features: Feature[];
    /** Estimated hours */
    estimatedHours: number;
    /** Timeline information */
    timeline: Timeline;
}
/**
 * Timeline information
 */
interface Timeline {
    /** Estimated weeks to complete */
    estimatedWeeks: number;
    /** Project phases */
    phases: ProjectPhase[];
}
/**
 * Project phase
 */
interface ProjectPhase {
    /** Phase ID */
    id: string;
    /** Phase name */
    name: string;
    /** Phase description */
    description: string;
    /** Duration in weeks */
    durationWeeks: number;
    /** Deliverables */
    deliverables: string[];
}
/**
 * Complete pricing information
 */
interface Pricing {
    /** Price breakdown by category */
    breakdown: PriceBreakdown[];
    /** Subtotal before discounts */
    subtotal: number;
    /** Applied discounts */
    discounts: Discount[];
    /** Subtotal after discounts */
    subtotalAfterDiscounts: number;
    /** VAT information */
    vat: VatInfo;
    /** Total including VAT */
    total: number;
    /** Currency (always EUR) */
    currency: 'EUR';
    /** Deposit information */
    deposit: DepositInfo;
    /** Payment milestones */
    milestones: PaymentMilestone[];
}
/**
 * Price breakdown item
 */
interface PriceBreakdown {
    /** Item name */
    item: string;
    /** Item description */
    description: string;
    /** Hours estimated */
    hours: number;
    /** Rate per hour in EUR */
    ratePerHour: number;
    /** Subtotal for this item */
    subtotal: number;
    /** Category */
    category: PriceCategory;
}
/**
 * Price categories
 */
type PriceCategory = 'development' | 'design' | 'ai' | 'testing' | 'management' | 'infrastructure';
/**
 * Discount applied
 */
interface Discount {
    /** Discount ID */
    id: string;
    /** Discount name */
    name: string;
    /** Discount type */
    type: 'percentage' | 'fixed';
    /** Discount value */
    value: number;
    /** Amount saved */
    amount: number;
}
/**
 * VAT information
 */
interface VatInfo {
    /** VAT rate (e.g., 22 for Italy) */
    rate: number;
    /** VAT amount */
    amount: number;
    /** Country code */
    countryCode?: string;
}
/**
 * Deposit information
 */
interface DepositInfo {
    /** Deposit percentage */
    percentage: number;
    /** Deposit amount */
    amount: number;
}
/**
 * Payment milestone
 */
interface PaymentMilestone {
    /** Milestone ID */
    id: string;
    /** Milestone name */
    name: string;
    /** Percentage of total */
    percentage: number;
    /** Amount to pay */
    amount: number;
    /** Description */
    description: string;
    /** Due condition */
    dueCondition?: string;
    /** Payment status */
    status?: 'pending' | 'paid' | 'released';
}
/**
 * Escrow information (for PRO/ENTERPRISE plans)
 *
 * With escrow, funds are held by the platform and released
 * to the tenant when milestones are completed.
 * Platform fee: 4% (PRO) or 2% (ENTERPRISE)
 */
interface EscrowInfo {
    /** Escrow status */
    status: 'none' | 'pending' | 'held' | 'partial_release' | 'released' | 'disputed' | 'refunded';
    /** Amount held in escrow */
    amountHeld: number;
    /** Platform fee (4% PRO, 2% ENTERPRISE) */
    platformFee: number;
    /** Amount already released */
    amountReleased: number;
    /** Release history */
    releases: {
        amount: number;
        milestone: string;
        releasedAt: Date;
    }[];
    /** Stripe payment intent ID */
    stripePaymentIntentId?: string;
    /** Stripe transfer ID */
    stripeTransferId?: string;
    /** Dispute reason if disputed */
    disputeReason?: string;
}
/**
 * Contract information
 */
interface ContractInfo {
    /** Contract ID */
    id: string;
    /** Contract status */
    status: 'draft' | 'sent' | 'viewed' | 'signed' | 'expired' | 'rejected';
    /** Sent timestamp */
    sentAt?: Date;
    /** Viewed timestamp */
    viewedAt?: Date;
    /** Signed timestamp */
    signedAt?: Date;
    /** Signature data (base64) */
    signatureData?: string;
    /** Signer information */
    signerName?: string;
    signerEmail?: string;
    signerIp?: string;
    /** Signed PDF URL */
    pdfUrl?: string;
}
/**
 * Payment initiation response (Stripe)
 */
interface PaymentInitResponse {
    /** Payment ID */
    paymentId: string;
    /** Stripe payment intent ID */
    paymentIntentId: string;
    /** Client secret for Stripe Elements */
    clientSecret: string;
    /** Total amount in cents */
    amount: number;
    /** Platform fee in cents */
    platformFee: number;
    /** Whether this is an escrow payment */
    isEscrow: boolean;
}
/**
 * Quote engine steps
 */
type QuoteStep = 'chat' | 'preview' | 'customer-info' | 'payment' | 'contract' | 'completed';
/**
 * Widget state
 */
interface WidgetState {
    /** Current step */
    currentStep: QuoteStep;
    /** Whether widget is open */
    isOpen: boolean;
    /** Whether loading */
    isLoading: boolean;
    /** Current chat session */
    chatSession: ChatSession | null;
    /** Generated quote */
    quote: Quote | null;
    /** Current error */
    error: QuoteEngineError | null;
    /** Customer data */
    customerData: CustomerData;
}
/**
 * Widget display mode
 */
type WidgetMode = 'inline' | 'modal' | 'fullpage';
/**
 * Widget position for floating mode
 */
type WidgetPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
/**
 * Widget options (from WidgetConfig in tenant.ts)
 */
interface WidgetOptions {
    /** Tenant ID */
    tenantId?: string;
    /** Display mode */
    mode?: WidgetMode;
    /** Auto-open on page load */
    autoOpen?: boolean;
    /** Close on complete */
    closeOnComplete?: boolean;
    /** Language override */
    language?: Language;
    /** Container element ID for inline mode */
    containerId?: string;
    /** Show close button */
    showCloseButton?: boolean;
    /** Initial step */
    initialStep?: QuoteStep;
    /** Pre-fill customer data */
    customerData?: CustomerData;
    /** Skip chat and go directly to manual quote */
    skipChat?: boolean;
    /** Position for modal/floating mode */
    position?: WidgetPosition;
    /** UI text label overrides (i18n / white-label) */
    labels?: Partial<TextLabels>;
    /** CSS class name overrides */
    classNames?: Partial<ClassNameOverrides>;
}
/**
 * Quote engine error
 */
interface QuoteEngineError {
    /** Error code */
    code: QuoteEngineErrorCode;
    /** Human-readable message */
    message: string;
    /** Additional details */
    details?: Record<string, unknown>;
    /** Original error */
    cause?: Error;
}
/**
 * Storage adapter interface for session persistence
 * Use this to provide custom storage implementations (e.g., AsyncStorage for RN)
 */
interface StorageAdapter {
    /** Get a value from storage */
    get<T>(key: string): T | null | Promise<T | null>;
    /** Set a value in storage */
    set<T>(key: string, value: T): void | Promise<void>;
    /** Remove a value from storage */
    remove(key: string): void | Promise<void>;
    /** Clear all SDK-related storage */
    clear(): void | Promise<void>;
}
/**
 * Error codes
 */
type QuoteEngineErrorCode = 'INVALID_API_KEY' | 'API_KEY_EXPIRED' | 'RATE_LIMIT_EXCEEDED' | 'QUOTA_EXCEEDED' | 'NETWORK_ERROR' | 'INVALID_CONFIG' | 'CHAT_ERROR' | 'QUOTE_GENERATION_ERROR' | 'PAYMENT_ERROR' | 'ESCROW_ERROR' | 'SESSION_EXPIRED' | 'VALIDATION_ERROR' | 'TENANT_NOT_FOUND' | 'STRIPE_ERROR' | 'UNKNOWN_ERROR';
/** RAG context returned with chat responses (v2.0+) */
interface RAGInsight {
    dataPoints: number;
    confidence: number;
    similarProjectsCount: number;
    pricingRange?: {
        min: number;
        max: number;
        avg: number;
    };
}
/**
 * Event listener cleanup function
 */
type Unsubscribe = () => void;
/**
 * Event types for the SDK
 */
type QuoteEngineEvent = 'ready' | 'chatStart' | 'messageSent' | 'messageReceived' | 'ragContextReceived' | 'quoteGenerated' | 'paymentStart' | 'paymentCompleted' | 'error' | 'close' | 'stepChange';

/**
 * ThinkPink Quote Engine SDK - Core Client
 *
 * Framework-agnostic client for interacting with the Quote Engine API
 * Uses Stripe Connect for payments with escrow functionality
 */

/**
 * Event emitter for the SDK
 */
declare class EventEmitter {
    private listeners;
    on(event: string, callback: Function): Unsubscribe;
    off(event: string, callback: Function): void;
    emit(event: string, ...args: unknown[]): void;
}
/**
 * Main Quote Engine Client
 */
declare class QuoteEngineClient extends EventEmitter {
    private config;
    private currentSession;
    private currentQuote;
    private abortController;
    private storage;
    private lastRAGInsight;
    private static readonly SESSION_STORAGE_KEY;
    private static readonly QUOTE_STORAGE_KEY;
    constructor(config: QuoteEngineConfig);
    /**
     * Validate the API key and fetch tenant configuration.
     * Call this after construction to verify the key is valid
     * and load the tenant branding/config from the backend.
     */
    validateKey(): Promise<{
        tenant: {
            slug: string;
            plan: string;
            status: string;
            branding: Record<string, unknown>;
            aiConfig: Record<string, unknown>;
        };
        environment: string;
    }>;
    /**
     * Update configuration
     */
    setConfig(config: Partial<QuoteEngineConfig>): void;
    /**
     * Get current configuration
     */
    getConfig(): QuoteEngineConfig;
    /**
     * Set language
     */
    setLanguage(language: Language): void;
    /**
     * Start a new chat session
     */
    startChat(customerData?: CustomerData): Promise<ChatSession>;
    /**
     * Send a message and get AI response (streaming)
     */
    sendMessage(content: string, onChunk?: (text: string) => void): Promise<ChatMessage>;
    /**
     * Stream chat response from API
     */
    private streamChat;
    /**
     * Cancel ongoing chat request
     */
    cancelChat(): void;
    /**
     * Get current chat session
     */
    getSession(): ChatSession | null;
    /**
     * Get the last RAG insight received during chat
     */
    getLastRAGInsight(): RAGInsight | null;
    /**
     * Clear current session
     */
    clearSession(): void;
    /**
     * Restore session from storage
     */
    private restoreSession;
    /**
     * Save session to storage
     */
    private saveSession;
    /**
     * Serialize session for storage (convert Date objects to ISO strings)
     */
    private serializeSession;
    /**
     * Deserialize session from storage (convert ISO strings back to Date objects)
     */
    private deserializeSession;
    /**
     * Generate a quote from the current conversation
     */
    generateQuote(customerData?: CustomerData): Promise<Quote>;
    /**
     * Get a quote by ID
     */
    getQuote(quoteId: string): Promise<Quote>;
    /**
     * Get current quote
     */
    getCurrentQuote(): Quote | null;
    /**
     * Send quote via email
     */
    sendQuoteEmail(quoteId: string, email?: string): Promise<void>;
    /**
     * Download quote PDF
     */
    downloadPdf(quoteId: string): Promise<Blob>;
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
    initPayment(quoteId: string, type?: 'deposit' | 'milestone' | 'final', milestoneId?: string, returnUrl?: string): Promise<PaymentInitResponse>;
    /**
     * Confirm payment was successful
     *
     * Call this after Stripe confirms the payment on the frontend.
     */
    confirmPayment(quoteId: string, paymentIntentId: string): Promise<void>;
    /**
     * Get escrow status for a quote
     */
    getEscrowStatus(quoteId: string): Promise<{
        totalPaid: number;
        platformFee: number;
        totalHeld: number;
        totalReleased: number;
        remainingBalance: number;
    }>;
    /**
     * Subscribe to events
     */
    addEventListener(event: QuoteEngineEvent, callback: Function): Unsubscribe;
    /**
     * Remove event listener
     */
    removeEventListener(event: QuoteEngineEvent, callback: Function): void;
    /**
     * Notify step change
     */
    notifyStepChange(step: QuoteStep): void;
    /**
     * Notify close
     */
    notifyClose(): void;
    private validateConfig;
    private registerCallbacks;
    private fetch;
    /**
     * Calculate delay for exponential backoff
     * Formula: baseDelay * 2^attempt (1s, 2s, 4s)
     */
    private calculateRetryDelay;
    /**
     * Sleep for specified milliseconds
     */
    private sleep;
    private createError;
    private handleError;
    private isQuoteEngineError;
    private generateId;
    private log;
}
/**
 * Create a new Quote Engine client instance
 */
declare function createQuoteEngine(config: QuoteEngineConfig): QuoteEngineClient;

/**
 * ThinkPink Quote Engine SDK - Utility Functions
 */

/**
 * Format currency amount
 */
declare function formatCurrency(amount: number, currency?: string, locale?: string): string;
/**
 * Format date
 */
declare function formatDate(date: Date | string, locale?: string, options?: Intl.DateTimeFormatOptions): string;
/**
 * Validate email format
 */
declare function isValidEmail(email: string): boolean;
/**
 * Validate phone number format
 */
declare function isValidPhone(phone: string): boolean;
/**
 * Translations helper
 */
declare const translations: {
    it: {
        chat: {
            placeholder: string;
            send: string;
            typing: string;
        };
        quote: {
            title: string;
            subtotal: string;
            vat: string;
            total: string;
            deposit: string;
            expiresIn: string;
            days: string;
        };
        payment: {
            title: string;
            payNow: string;
            processing: string;
        };
        errors: {
            required: string;
            invalidEmail: string;
            networkError: string;
        };
    };
    en: {
        chat: {
            placeholder: string;
            send: string;
            typing: string;
        };
        quote: {
            title: string;
            subtotal: string;
            vat: string;
            total: string;
            deposit: string;
            expiresIn: string;
            days: string;
        };
        payment: {
            title: string;
            payNow: string;
            processing: string;
        };
        errors: {
            required: string;
            invalidEmail: string;
            networkError: string;
        };
    };
    de: {
        chat: {
            placeholder: string;
            send: string;
            typing: string;
        };
        quote: {
            title: string;
            subtotal: string;
            vat: string;
            total: string;
            deposit: string;
            expiresIn: string;
            days: string;
        };
        payment: {
            title: string;
            payNow: string;
            processing: string;
        };
        errors: {
            required: string;
            invalidEmail: string;
            networkError: string;
        };
    };
    fr: {
        chat: {
            placeholder: string;
            send: string;
            typing: string;
        };
        quote: {
            title: string;
            subtotal: string;
            vat: string;
            total: string;
            deposit: string;
            expiresIn: string;
            days: string;
        };
        payment: {
            title: string;
            payNow: string;
            processing: string;
        };
        errors: {
            required: string;
            invalidEmail: string;
            networkError: string;
        };
    };
    es: {
        chat: {
            placeholder: string;
            send: string;
            typing: string;
        };
        quote: {
            title: string;
            subtotal: string;
            vat: string;
            total: string;
            deposit: string;
            expiresIn: string;
            days: string;
        };
        payment: {
            title: string;
            payNow: string;
            processing: string;
        };
        errors: {
            required: string;
            invalidEmail: string;
            networkError: string;
        };
    };
};
type TranslationKey = keyof (typeof translations)['en'];
declare function t(language: string, category: TranslationKey, key: string): string;

/**
 * ThinkPink Quote Engine SDK
 *
 * Framework-agnostic SDK for integrating the ThinkPink Quote Engine
 * into any JavaScript application.
 *
 * @packageDocumentation
 */

declare const VERSION = "1.0.0";

interface QuoteEngineRNContextValue {
    client: QuoteEngineClient;
    state: WidgetState;
    startChat: (customerData?: CustomerData) => Promise<ChatSession>;
    sendMessage: (content: string) => Promise<void>;
    generateQuote: (customerData?: CustomerData) => Promise<Quote>;
    goToStep: (step: QuoteStep) => void;
    setCustomerData: (data: Partial<CustomerData>) => void;
    open: () => void;
    close: () => void;
    reset: () => void;
    isReady: boolean;
    isOnline: boolean;
}
interface QuoteEngineRNProviderProps {
    config: QuoteEngineConfig;
    children: ReactNode;
    initialStep?: QuoteStep;
    customerData?: CustomerData;
    onStateChange?: (state: WidgetState) => void;
}
declare function QuoteEngineRNProvider({ config, children, initialStep, customerData: initialCustomerData, onStateChange, }: QuoteEngineRNProviderProps): react_jsx_runtime.JSX.Element;
declare function useQuoteEngineRNContext(): QuoteEngineRNContextValue;

/**
 * Hook for chat functionality (same API as web React hook)
 */
declare function useQuoteChat(): {
    messages: ChatMessage[];
    streamingContent: string;
    isLoading: boolean;
    error: QuoteEngineError | null;
    shouldGenerateQuote: boolean;
    sendMessage: (content: string) => Promise<void>;
    startChat: (customerData?: CustomerData) => Promise<ChatSession>;
    cancelChat: () => void;
};
/**
 * Hook for quote operations
 *
 * On React Native, `downloadPdf` returns the blob directly
 * instead of triggering a browser download. Use react-native-share
 * or react-native-blob-util to save/share the file.
 */
declare function useQuote(): {
    quote: Quote | null;
    isLoading: boolean;
    error: QuoteEngineError | null;
    generateQuote: (customerData?: CustomerData) => Promise<Quote>;
    downloadPdf: () => Promise<Blob | null>;
    sendEmail: (email?: string) => Promise<void>;
    getQuote: (id: string) => Promise<Quote>;
};
/**
 * Hook for Stripe payment functionality
 */
declare function usePayment(): {
    isProcessing: boolean;
    paymentError: QuoteEngineError | null;
    clientSecret: string | null;
    paymentIntentId: string | null;
    initPayment: (type?: "deposit" | "milestone" | "final", milestoneId?: string, returnUrl?: string) => Promise<PaymentInitResponse>;
    confirmPayment: () => Promise<void>;
};
/**
 * Hook for widget state management
 */
declare function useQuoteWidget(): {
    isOpen: boolean;
    isLoading: boolean;
    currentStep: QuoteStep;
    error: QuoteEngineError | null;
    customerData: CustomerData;
    open: () => void;
    close: () => void;
    reset: () => void;
    goToStep: (step: QuoteStep) => void;
    setCustomerData: (data: Partial<CustomerData>) => void;
};
/**
 * Hook to listen to Quote Engine events
 */
declare function useQuoteEngineEvent<T>(event: string, handler: (data: T) => void): void;
/**
 * Hook for customer data form
 */
declare function useCustomerForm(): {
    customerData: CustomerData;
    updateField: (field: keyof CustomerData, value: string) => void;
    errors: Partial<Record<keyof CustomerData, string>>;
    validate: () => boolean;
    isValid: boolean;
};
/**
 * React Native-specific: hook to track network connectivity.
 *
 * Requires `@react-native-community/netinfo` to be installed.
 * Falls back to online if the dependency is not available.
 *
 * @example
 * ```tsx
 * function ChatScreen() {
 *   const { isOnline } = useNetworkStatus()
 *   const { sendMessage } = useQuoteChat()
 *
 *   if (!isOnline) {
 *     return <Text>You are offline. Please check your connection.</Text>
 *   }
 *   // ...
 * }
 * ```
 */
declare function useNetworkStatus(): {
    isOnline: boolean;
};
/**
 * Hook for accessing theme tokens and labels in React Native.
 *
 * Returns the resolved ThemeConfig and TextLabels from the SDK config
 * so you can apply consistent styling to your custom RN components.
 *
 * @example
 * ```tsx
 * function ChatBubble({ role, content }: { role: string; content: string }) {
 *   const { theme, labels } = useQuoteEngineTheme()
 *
 *   return (
 *     <View style={{
 *       backgroundColor: role === 'user' ? theme.primaryColor : theme.surfaceColor,
 *       borderRadius: theme.borderRadius ?? 12,
 *     }}>
 *       <Text style={{ color: role === 'user' ? theme.textColorInverse : theme.textColor }}>
 *         {content}
 *       </Text>
 *     </View>
 *   )
 * }
 * ```
 */
declare function useQuoteEngineTheme(): {
    /** Resolved theme configuration with all design tokens */
    theme: ThemeConfig;
    /** Resolved text labels for white-label UI */
    labels: TextLabels;
};

/**
 * ThinkPink Quote Engine SDK - React Native Storage Adapter
 *
 * Wraps AsyncStorage to provide the same interface as the
 * browser localStorage helper used in the core SDK.
 */
interface RNStorageAdapter {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    getAllKeys?(): Promise<string[]>;
}
/**
 * Create a storage adapter for React Native.
 *
 * Pass your AsyncStorage instance (from `@react-native-async-storage/async-storage`)
 * to get a Quote Engine-compatible storage helper.
 *
 * @example
 * ```ts
 * import AsyncStorage from '@react-native-async-storage/async-storage'
 * import { createRNStorage } from '@thinkpinkstudio/quote-engine-sdk/react-native'
 *
 * const storage = createRNStorage(AsyncStorage)
 * ```
 */
declare function createRNStorage(asyncStorage: RNStorageAdapter): {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T): Promise<void>;
    remove(key: string): Promise<void>;
    clear(): Promise<void>;
};

export { type CallbackHandlers, type ChatMessage, type ChatSession, type ClassNameOverrides, type CustomerData, type ExtractedRequirements, type Language, type PaymentInitResponse, type PriceBreakdown, type Pricing, type Quote, QuoteEngineClient, type QuoteEngineConfig, type QuoteEngineError, type QuoteEngineErrorCode, QuoteEngineRNProvider, type QuoteEngineRNProviderProps, type QuoteStatus, type QuoteStep, type TextLabels, type ThemeConfig, VERSION, type WidgetOptions, type WidgetState, createQuoteEngine, createRNStorage, formatCurrency, formatDate, isValidEmail, isValidPhone, t, translations, useCustomerForm, useNetworkStatus, usePayment, useQuote, useQuoteChat, useQuoteEngineEvent, useQuoteEngineRNContext, useQuoteEngineTheme, useQuoteWidget };
