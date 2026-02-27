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
 * Theme style presets
 * - 'glass': Glassmorphism effects, gradients, blur - bold & modern
 * - 'minimal': Clean, flat, lightweight - minimal visual noise
 * - 'elegant': Soft shadows, refined typography - sophisticated
 */
type ThemeStyle = 'glass' | 'minimal' | 'elegant';
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
 * Tenant subscription plans
 */
type TenantPlan = 'starter' | 'pro' | 'enterprise';
/**
 * Plan limits and features
 */
declare const PLAN_LIMITS: Record<TenantPlan, {
    quotesPerMonth: number;
    usersAllowed: number;
    escrowFee: number;
    features: string[];
}>;
/**
 * Plan pricing
 */
declare const PLAN_PRICING: Record<TenantPlan, {
    monthly: number;
    yearly: number;
    currency: 'EUR';
}>;
/**
 * Public tenant configuration (safe to expose)
 */
interface TenantPublicConfig {
    slug: string;
    branding: ThemeConfig;
    aiConfig: {
        personality: 'professional' | 'friendly' | 'technical' | 'casual';
        tone: 'formal' | 'conversational' | 'enthusiastic';
        welcomeMessage: string;
        primaryLanguage: Language;
        supportedLanguages: Language[];
        enabledProjectTypes: ProjectType[];
        enabledTechnologies: Technology[];
    };
    payments: {
        escrowEnabled: boolean;
        enabledMethods: PaymentMethod[];
    };
    hostedSettings: {
        hostedEnabled: boolean;
        pageTitle?: string;
        pageDescription?: string;
        heroTitle?: string;
        heroSubtitle?: string;
        ctaText?: string;
    };
    features: string[];
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
 * Payment methods supported
 */
type PaymentMethod = 'card' | 'bank_transfer';
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
 * Payment status
 */
type PaymentStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded' | 'cancelled';
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
/**
 * Base API response
 */
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: Record<string, unknown>;
    };
}
/**
 * Chat response
 */
interface ChatResponse {
    message: ChatMessage;
    metadata?: MessageMetadata;
    shouldGenerateQuote?: boolean;
}
/**
 * Quote generation response
 */
interface QuoteGenerationResponse {
    quote: Quote;
    remaining: number;
}
/**
 * Stream event types
 */
type StreamEventType = 'content' | 'metadata' | 'rag_context' | 'error' | 'done';
/**
 * Stream event
 */
interface StreamEvent {
    type: StreamEventType;
    data: {
        text?: string;
        confidence?: number;
        shouldGenerateQuote?: boolean;
        error?: string;
    };
}
/**
 * Webhook events that can be subscribed to
 */
type WebhookEvent = 'quote.created' | 'quote.updated' | 'quote.paid' | 'quote.expired' | 'contract.signed' | 'payment.received' | 'payment.released' | 'payment.disputed';
/**
 * Deep partial type
 */
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
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
/** Extended chat message with RAG metadata */
interface ChatMessageV2 extends ChatMessage {
    ragInsight?: RAGInsight;
}
/** Similar project reference (anonymized) */
interface SimilarProjectRef {
    projectType: string;
    complexity: string;
    technologies: string[];
    estimatedHours: number;
    priceRange: string;
}
/** Extended quote with RAG data */
interface QuoteV2 extends Quote {
    similarProjects?: SimilarProjectRef[];
    estimateConfidence?: number;
    dataPointsUsed?: number;
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
 * Format quote number for display
 */
declare function formatQuoteNumber(quoteNumber: string): string;
/**
 * Calculate days until expiry
 */
declare function getDaysUntilExpiry(expiresAt: Date | string): number;
/**
 * Check if quote is expired
 */
declare function isQuoteExpired(quote: Quote): boolean;
/**
 * Generate CSS variables from theme config.
 *
 * Produces a comprehensive set of CSS custom properties covering every
 * visual aspect of the pre-built widget. Consumers using headless hooks
 * can also read these variables for consistency.
 */
declare function generateThemeCss(theme: ThemeConfig): string;
/**
 * Debounce function
 */
declare function debounce<T extends (...args: unknown[]) => unknown>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * Throttle function
 */
declare function throttle<T extends (...args: unknown[]) => unknown>(func: T, limit: number): (...args: Parameters<T>) => void;
/**
 * Validate email format
 */
declare function isValidEmail(email: string): boolean;
/**
 * Validate phone number format
 */
declare function isValidPhone(phone: string): boolean;
/**
 * Get country from locale
 */
declare function getCountryFromLocale(locale: string): string;
/**
 * Get locale from language code
 */
declare function getLocaleFromLanguage(language: string): string;
/**
 * Deep merge objects
 */
declare function deepMerge<T extends Record<string, unknown>>(target: T, ...sources: Partial<T>[]): T;
/**
 * Calculate pricing summary
 */
declare function calculatePricingSummary(pricing: Pricing): {
    totalHours: number;
    averageRate: number;
    discountTotal: number;
    netAmount: number;
};
/**
 * Storage helper for session persistence
 */
declare const storage: {
    get<T>(key: string): T | null;
    set<T>(key: string, value: T): void;
    remove(key: string): void;
    clear(): void;
};
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
 * ThinkPink Quote Engine SDK - Theme Manager
 *
 * Handles dark mode detection, theme switching, and style presets
 */

type ThemeMode = 'light' | 'dark' | 'auto';
/**
 * Glass theme preset - Glassmorphism effects, gradients, blur
 * Modern and bold visual style with depth and translucency
 */
declare const GLASS_THEME_LIGHT: Partial<ThemeConfig>;
declare const GLASS_THEME_DARK: Partial<ThemeConfig>;
/**
 * Minimal theme preset - Clean, flat, lightweight
 * Zero visual noise, focuses on content
 */
declare const MINIMAL_THEME_LIGHT: Partial<ThemeConfig>;
declare const MINIMAL_THEME_DARK: Partial<ThemeConfig>;
/**
 * Elegant theme preset - Soft shadows, refined typography
 * Sophisticated and professional look
 */
declare const ELEGANT_THEME_LIGHT: Partial<ThemeConfig>;
declare const ELEGANT_THEME_DARK: Partial<ThemeConfig>;
/**
 * All style presets organized by style and mode
 */
declare const THEME_STYLE_PRESETS: Record<ThemeStyle, {
    light: Partial<ThemeConfig>;
    dark: Partial<ThemeConfig>;
}>;
/**
 * Get the theme preset for a given style and mode
 */
declare function getThemePreset(style: ThemeStyle, mode: 'light' | 'dark'): Partial<ThemeConfig>;
/**
 * Get complete theme config by merging style preset with custom overrides
 */
declare function createStyledTheme(style?: ThemeStyle, mode?: 'light' | 'dark', overrides?: Partial<ThemeConfig>): ThemeConfig;
interface ThemeManagerOptions {
    theme: ThemeConfig;
    onChange?: (mode: ThemeMode, isDark: boolean, style: ThemeStyle) => void;
    onStyleChange?: (style: ThemeStyle) => void;
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
declare class ThemeManager {
    private theme;
    private currentMode;
    private currentStyle;
    private mediaQuery;
    private onChange?;
    private onStyleChange?;
    private styleElement;
    constructor(options: ThemeManagerOptions);
    /**
     * Set the theme mode
     */
    setTheme(mode: ThemeMode): void;
    /**
     * Get the current theme mode
     */
    getMode(): ThemeMode;
    /**
     * Set the theme style (glass, minimal, elegant)
     */
    setStyle(style: ThemeStyle): void;
    /**
     * Get the current theme style
     */
    getStyle(): ThemeStyle;
    /**
     * Check if currently in dark mode
     */
    isDark(): boolean;
    /**
     * Get the resolved theme configuration (with style and dark mode applied)
     */
    getResolvedTheme(): ThemeConfig;
    /**
     * Generate CSS for the current theme state
     */
    getCss(): string;
    /**
     * Update theme configuration
     */
    updateTheme(theme: Partial<ThemeConfig>): void;
    /**
     * Inject theme styles into the document
     */
    injectStyles(containerId?: string): void;
    /**
     * Clean up resources
     */
    destroy(): void;
    private setupMediaQueryListener;
    private removeMediaQueryListener;
    private getSystemPreference;
    private notifyChange;
    private updateStyles;
    private extractCssVars;
}
/**
 * Create a theme manager instance
 */
declare function createThemeManager(options: ThemeManagerOptions): ThemeManager;
/**
 * Default dark theme colors
 */
declare const DEFAULT_DARK_THEME: {
    backgroundColor: string;
    surfaceColor: string;
    textColor: string;
    textColorMuted: string;
    borderColor: string;
    inputBackgroundColor: string;
    inputBorderColor: string;
    assistantBubbleColor: string;
    assistantBubbleTextColor: string;
    headerBackgroundColor: string;
    headerTextColor: string;
    overlayColor: string;
    loadingColor: string;
};

/**
 * ThinkPink Quote Engine SDK - Analytics Module
 *
 * Tracks usage metrics for widget interactions with GDPR compliance
 */

type AnalyticsEventType = 'widget_opened' | 'widget_closed' | 'chat_started' | 'message_sent' | 'message_received' | 'quote_generated' | 'quote_viewed' | 'quote_downloaded' | 'quote_emailed' | 'payment_started' | 'payment_completed' | 'payment_failed' | 'error';
interface AnalyticsEvent {
    type: AnalyticsEventType;
    timestamp: number;
    sessionId?: string;
    quoteId?: string;
    data?: Record<string, unknown>;
}
interface AnalyticsOptions {
    /** Enable or disable analytics (default: true) */
    enabled?: boolean;
    /** Custom endpoint for analytics (default: Quote Engine API) */
    endpoint?: string;
    /** Batch size before sending (default: 10) */
    batchSize?: number;
    /** Max time before flushing batch in ms (default: 30000) */
    flushInterval?: number;
    /** Include device/browser info (default: true) */
    includeDeviceInfo?: boolean;
    /** Custom user ID for tracking */
    userId?: string;
    /** API key for authentication */
    apiKey: string;
}
/**
 * Analytics Manager
 *
 * Handles event tracking with batching, GDPR compliance, and automatic flushing.
 *
 * @example
 * ```typescript
 * const analytics = createAnalytics({
 *   apiKey: 'your-api-key',
 *   enabled: true, // Can be set to false for GDPR opt-out
 * })
 *
 * // Track events
 * analytics.track('widget_opened')
 * analytics.track('message_sent', { messageLength: 150 })
 *
 * // Opt out (GDPR)
 * analytics.setEnabled(false)
 *
 * // Check consent status
 * if (analytics.isEnabled()) { ... }
 *
 * // Flush pending events
 * await analytics.flush()
 *
 * // Clean up
 * analytics.destroy()
 * ```
 */
declare class Analytics {
    private enabled;
    private endpoint;
    private batchSize;
    private flushInterval;
    private includeDeviceInfo;
    private userId?;
    private apiKey;
    private eventQueue;
    private flushTimer;
    private sessionId;
    constructor(options: AnalyticsOptions);
    /**
     * Track an analytics event
     */
    track(type: AnalyticsEventType, data?: Record<string, unknown>): void;
    /**
     * Track an event with quote context
     */
    trackQuote(type: AnalyticsEventType, quoteId: string, data?: Record<string, unknown>): void;
    /**
     * Enable or disable analytics (GDPR opt-out)
     */
    setEnabled(enabled: boolean): void;
    /**
     * Check if analytics is enabled
     */
    isEnabled(): boolean;
    /**
     * Set custom user ID for tracking
     */
    setUserId(userId: string): void;
    /**
     * Flush pending events to the server
     */
    flush(): Promise<void>;
    /**
     * Clean up resources
     */
    destroy(): void;
    private sendWithFetch;
    private startFlushTimer;
    private generateSessionId;
    private getDeviceInfo;
}
/**
 * Create an analytics instance
 */
declare function createAnalytics(options: AnalyticsOptions): Analytics;
/**
 * Create analytics from SDK config
 */
declare function createAnalyticsFromConfig(config: QuoteEngineConfig): Analytics | null;

/**
 * ThinkPink Quote Engine SDK - Webhook Module
 *
 * Provides webhook registration, HMAC signature verification,
 * and event delivery for server-side integrations.
 */

/**
 * Extended webhook event types
 */
type WebhookEventType = WebhookEvent | 'quote.generated' | 'chat.completed' | 'payment.succeeded' | 'payment.failed';
/**
 * Webhook payload base
 */
interface WebhookPayloadBase {
    /** Unique event ID */
    id: string;
    /** Event type */
    type: WebhookEventType;
    /** API version */
    apiVersion: string;
    /** Timestamp (ISO 8601) */
    timestamp: string;
    /** Tenant ID */
    tenantId: string;
    /** Livemode indicator */
    livemode: boolean;
}
/**
 * Quote event payload
 */
interface QuoteEventPayload extends WebhookPayloadBase {
    type: 'quote.created' | 'quote.updated' | 'quote.generated' | 'quote.paid' | 'quote.expired';
    data: {
        quote: Quote;
        previousStatus?: string;
    };
}
/**
 * Chat completed payload
 */
interface ChatCompletedPayload extends WebhookPayloadBase {
    type: 'chat.completed';
    data: {
        sessionId: string;
        quoteId?: string;
        messageCount: number;
        duration: number;
        customerEmail?: string;
    };
}
/**
 * Payment event payload
 */
interface PaymentEventPayload extends WebhookPayloadBase {
    type: 'payment.received' | 'payment.released' | 'payment.disputed' | 'payment.succeeded' | 'payment.failed';
    data: {
        paymentId: string;
        quoteId: string;
        amount: number;
        currency: string;
        status: PaymentStatus;
        stripePaymentIntentId?: string;
        failureReason?: string;
    };
}
/**
 * Contract signed payload
 */
interface ContractSignedPayload extends WebhookPayloadBase {
    type: 'contract.signed';
    data: {
        contractId: string;
        quoteId: string;
        signedAt: string;
        signerName: string;
        signerEmail: string;
    };
}
/**
 * Union of all webhook payloads
 */
type WebhookPayload = QuoteEventPayload | ChatCompletedPayload | PaymentEventPayload | ContractSignedPayload;
/**
 * Webhook endpoint configuration
 */
interface WebhookEndpoint {
    /** Endpoint ID */
    id: string;
    /** Webhook URL */
    url: string;
    /** Events to receive */
    events: WebhookEventType[];
    /** Webhook secret for HMAC verification */
    secret: string;
    /** Whether endpoint is enabled */
    enabled: boolean;
    /** Created timestamp */
    createdAt: Date;
    /** Last successful delivery */
    lastSuccessAt?: Date;
    /** Last failure message */
    lastFailure?: string;
}
/**
 * Webhook signature header name
 */
declare const WEBHOOK_SIGNATURE_HEADER = "X-QuoteEngine-Signature";
/**
 * Webhook timestamp header name
 */
declare const WEBHOOK_TIMESTAMP_HEADER = "X-QuoteEngine-Timestamp";
/**
 * Webhook ID header name
 */
declare const WEBHOOK_ID_HEADER = "X-QuoteEngine-ID";
/**
 * Compute HMAC-SHA256 signature for a payload
 *
 * @param payload - The webhook payload (JSON string)
 * @param secret - The webhook secret
 * @param timestamp - Unix timestamp (seconds)
 * @returns The signature in format: v1=<hex-digest>
 *
 * @example
 * ```typescript
 * const signature = await computeSignature(
 *   JSON.stringify(payload),
 *   'whsec_your_secret',
 *   Math.floor(Date.now() / 1000)
 * )
 * // => "v1=5b8c..."
 * ```
 */
declare function computeSignature(payload: string, secret: string, timestamp: number): Promise<string>;
/**
 * Verify a webhook signature
 *
 * @param payload - The raw request body (string)
 * @param signature - The signature from X-QuoteEngine-Signature header
 * @param timestamp - The timestamp from X-QuoteEngine-Timestamp header
 * @param secret - Your webhook secret
 * @param tolerance - Max age of webhook in seconds (default: 300 = 5 minutes)
 * @returns Whether the signature is valid
 *
 * @example
 * ```typescript
 * // Express.js middleware
 * app.post('/webhooks/quote-engine', express.raw({ type: 'application/json' }), async (req, res) => {
 *   const signature = req.headers['x-quoteengine-signature'] as string
 *   const timestamp = req.headers['x-quoteengine-timestamp'] as string
 *
 *   const isValid = await verifySignature(
 *     req.body.toString(),
 *     signature,
 *     timestamp,
 *     process.env.WEBHOOK_SECRET!
 *   )
 *
 *   if (!isValid) {
 *     return res.status(401).json({ error: 'Invalid signature' })
 *   }
 *
 *   const event = JSON.parse(req.body.toString()) as WebhookPayload
 *   // Handle event...
 *
 *   res.json({ received: true })
 * })
 * ```
 */
declare function verifySignature(payload: string, signature: string, timestamp: string, secret: string, tolerance?: number): Promise<boolean>;
/**
 * Construct a webhook event payload
 *
 * @param type - Event type
 * @param data - Event data
 * @param options - Additional options
 * @returns Complete webhook payload
 */
declare function constructEvent<T extends WebhookEventType>(type: T, data: Record<string, unknown>, options: {
    tenantId: string;
    livemode?: boolean;
    apiVersion?: string;
}): WebhookPayloadBase & {
    type: T;
    data: typeof data;
};
interface WebhookClientOptions {
    apiKey: string;
    baseUrl?: string;
}
/**
 * Client for managing webhook endpoints
 *
 * @example
 * ```typescript
 * const webhooks = new WebhookClient({
 *   apiKey: 'your-api-key',
 * })
 *
 * // Register a new webhook
 * const endpoint = await webhooks.create({
 *   url: 'https://your-server.com/webhooks',
 *   events: ['quote.generated', 'payment.succeeded', 'payment.failed'],
 * })
 *
 * // List all endpoints
 * const endpoints = await webhooks.list()
 *
 * // Delete an endpoint
 * await webhooks.delete(endpoint.id)
 * ```
 */
declare class WebhookClient {
    private apiKey;
    private baseUrl;
    constructor(options: WebhookClientOptions);
    /**
     * Create a new webhook endpoint
     */
    create(options: {
        url: string;
        events: WebhookEventType[];
        description?: string;
    }): Promise<WebhookEndpoint>;
    /**
     * List all webhook endpoints
     */
    list(): Promise<WebhookEndpoint[]>;
    /**
     * Get a specific webhook endpoint
     */
    get(id: string): Promise<WebhookEndpoint>;
    /**
     * Update a webhook endpoint
     */
    update(id: string, options: {
        url?: string;
        events?: WebhookEventType[];
        enabled?: boolean;
    }): Promise<WebhookEndpoint>;
    /**
     * Delete a webhook endpoint
     */
    delete(id: string): Promise<void>;
    /**
     * Rotate the webhook secret
     */
    rotateSecret(id: string): Promise<{
        secret: string;
    }>;
    /**
     * List recent webhook deliveries (for debugging)
     */
    listDeliveries(endpointId: string, options?: {
        limit?: number;
    }): Promise<{
        id: string;
        eventType: WebhookEventType;
        status: 'success' | 'failed' | 'pending';
        statusCode?: number;
        timestamp: string;
        duration?: number;
        error?: string;
    }[]>;
    /**
     * Resend a failed webhook delivery
     */
    resendDelivery(endpointId: string, deliveryId: string): Promise<void>;
}
/**
 * Create a webhook client instance
 */
declare function createWebhookClient(options: WebhookClientOptions): WebhookClient;

/**
 * ThinkPink Quote Engine SDK - API Key Scoping Module
 *
 * Provides types and utilities for API key management, scoping, and validation.
 * API keys follow the format: qe_{environment}_{scope}_{identifier}
 *
 * Examples:
 * - qe_live_full_abc123...    - Production, full access
 * - qe_test_read_xyz789...    - Test mode, read-only access
 * - qe_live_widget_def456...  - Production, widget-only access
 */
/**
 * API key environment
 */
type ApiKeyEnvironment = 'live' | 'test';
/**
 * API key scope
 *
 * Defines what operations the key is allowed to perform:
 * - `full` - All operations (chat, quote, payment, webhooks)
 * - `read` - Read-only operations (get quote, get session)
 * - `widget` - Widget operations only (chat, generate quote)
 * - `webhook` - Webhook management only
 * - `payment` - Payment operations only
 */
type ApiKeyScope = 'full' | 'read' | 'widget' | 'webhook' | 'payment';
/**
 * Parsed API key structure
 */
interface ParsedApiKey {
    /** Raw key value */
    raw: string;
    /** Key environment */
    environment: ApiKeyEnvironment;
    /** Key scope */
    scope: ApiKeyScope;
    /** Unique key identifier */
    identifier: string;
    /** Whether the key format is valid */
    isValid: boolean;
    /** Whether this is a test key */
    isTestKey: boolean;
}
/**
 * API key permissions map
 */
interface ApiKeyPermissions {
    /** Can start and manage chat sessions */
    chat: boolean;
    /** Can generate quotes */
    generateQuote: boolean;
    /** Can read quotes */
    readQuote: boolean;
    /** Can initiate payments */
    initPayment: boolean;
    /** Can confirm payments */
    confirmPayment: boolean;
    /** Can manage webhooks */
    manageWebhooks: boolean;
    /** Can access analytics */
    accessAnalytics: boolean;
    /** Can send emails */
    sendEmails: boolean;
    /** Can download PDFs */
    downloadPdfs: boolean;
}
/**
 * Permissions for each scope
 */
declare const SCOPE_PERMISSIONS: Record<ApiKeyScope, ApiKeyPermissions>;
/**
 * Parse an API key string into its components
 *
 * @param apiKey - The API key to parse
 * @returns Parsed API key structure
 *
 * @example
 * ```typescript
 * const parsed = parseApiKey('qe_live_full_abc123def456ghi789jkl012')
 *
 * if (parsed.isValid) {
 *   // console.log(parsed.environment) // 'live'
 *   // console.log(parsed.scope)       // 'full'
 *   // console.log(parsed.isTestKey)   // false
 * }
 * ```
 */
declare function parseApiKey(apiKey: string): ParsedApiKey;
/**
 * Validate an API key format
 *
 * @param apiKey - The API key to validate
 * @returns Whether the key format is valid
 *
 * @example
 * ```typescript
 * isValidApiKeyFormat('qe_live_full_abc123...') // true
 * isValidApiKeyFormat('invalid-key')            // false
 * ```
 */
declare function isValidApiKeyFormat(apiKey: string): boolean;
/**
 * Get permissions for an API key
 *
 * @param apiKey - The API key (string or parsed)
 * @returns The permissions associated with the key's scope
 *
 * @example
 * ```typescript
 * const perms = getApiKeyPermissions('qe_live_widget_abc123...')
 *
 * if (!perms.manageWebhooks) {
 *   // console.log('This key cannot manage webhooks')
 * }
 * ```
 */
declare function getApiKeyPermissions(apiKey: string | ParsedApiKey): ApiKeyPermissions;
/**
 * Check if an API key has a specific permission
 *
 * @param apiKey - The API key
 * @param permission - The permission to check
 * @returns Whether the key has the permission
 *
 * @example
 * ```typescript
 * if (!hasPermission(apiKey, 'manageWebhooks')) {
 *   throw new Error('This API key cannot manage webhooks')
 * }
 * ```
 */
declare function hasPermission(apiKey: string | ParsedApiKey, permission: keyof ApiKeyPermissions): boolean;
/**
 * Check if an API key is a test key
 *
 * @param apiKey - The API key
 * @returns Whether the key is for test environment
 */
declare function isTestKey(apiKey: string | ParsedApiKey): boolean;
/**
 * Check if an API key is a live (production) key
 *
 * @param apiKey - The API key
 * @returns Whether the key is for live environment
 */
declare function isLiveKey(apiKey: string | ParsedApiKey): boolean;
/**
 * Error thrown when API key validation fails
 */
declare class ApiKeyValidationError extends Error {
    readonly code: ApiKeyErrorCode;
    readonly details?: Record<string, unknown>;
    constructor(code: ApiKeyErrorCode, message: string, details?: Record<string, unknown>);
}
/**
 * API key error codes
 */
type ApiKeyErrorCode = 'INVALID_FORMAT' | 'INVALID_ENVIRONMENT' | 'INVALID_SCOPE' | 'PERMISSION_DENIED' | 'KEY_EXPIRED' | 'KEY_REVOKED';
/**
 * Validate an API key and throw if invalid
 *
 * @param apiKey - The API key to validate
 * @throws ApiKeyValidationError if the key is invalid
 *
 * @example
 * ```typescript
 * try {
 *   validateApiKey(userProvidedKey)
 * } catch (error) {
 *   if (error instanceof ApiKeyValidationError) {
 *     console.error('Invalid API key:', error.code)
 *   }
 * }
 * ```
 */
declare function validateApiKey(apiKey: string): ParsedApiKey;
/**
 * Assert that an API key has a specific permission
 *
 * @param apiKey - The API key
 * @param permission - The required permission
 * @param action - Description of the action for error message
 * @throws ApiKeyValidationError if permission is denied
 *
 * @example
 * ```typescript
 * // In your webhook management code:
 * assertPermission(apiKey, 'manageWebhooks', 'create webhook')
 * ```
 */
declare function assertPermission(apiKey: string | ParsedApiKey, permission: keyof ApiKeyPermissions, action?: string): void;
/**
 * Mask an API key for safe display
 *
 * @param apiKey - The API key to mask
 * @param visibleChars - Number of characters to show at end (default: 4)
 * @returns Masked API key string
 *
 * @example
 * ```typescript
 * maskApiKey('qe_live_full_abc123def456ghi789jkl012')
 * // => 'qe_live_full_****************************l012'
 * ```
 */
declare function maskApiKey(apiKey: string, visibleChars?: number): string;
/**
 * Get a human-readable description of an API key scope
 *
 * @param scope - The API key scope
 * @returns Description of what the scope allows
 */
declare function getScopeDescription(scope: ApiKeyScope): string;
/**
 * List all permissions for a scope
 *
 * @param scope - The API key scope
 * @returns Array of permission names that are enabled
 */
declare function listEnabledPermissions(scope: ApiKeyScope): (keyof ApiKeyPermissions)[];

/**
 * ThinkPink Quote Engine SDK
 *
 * Framework-agnostic SDK for integrating the ThinkPink Quote Engine
 * into any JavaScript application.
 *
 * @packageDocumentation
 */

declare const VERSION = "1.0.0";

export { Analytics, type AnalyticsEvent, type AnalyticsEventType, type AnalyticsOptions, type ApiKeyEnvironment, type ApiKeyErrorCode, type ApiKeyPermissions, type ApiKeyScope, ApiKeyValidationError, type ApiResponse, type CallbackHandlers, type ChatCompletedPayload, type ChatMessage, type ChatMessageV2, type ChatResponse, type ChatSession, type ClassNameOverrides, type Complexity, type ContractInfo, type ContractSignedPayload, type ConversationData, type Customer, type CustomerData, DEFAULT_DARK_THEME, type DeepPartial, type DepositInfo, type Discount, ELEGANT_THEME_DARK, ELEGANT_THEME_LIGHT, type EscrowInfo, type ExtractedRequirements, type Feature, GLASS_THEME_DARK, GLASS_THEME_LIGHT, type Language, MINIMAL_THEME_DARK, MINIMAL_THEME_LIGHT, type MessageMetadata, PLAN_LIMITS, PLAN_PRICING, type ParsedApiKey, type PaymentEventPayload, type PaymentInitResponse, type PaymentMethod, type PaymentMilestone, type PaymentStatus, type PriceBreakdown, type PriceCategory, type Pricing, type Project, type ProjectPhase, type ProjectType, type Quote, QuoteEngineClient, type QuoteEngineConfig, type QuoteEngineError, type QuoteEngineErrorCode, type QuoteEngineEvent, type QuoteEventPayload, type QuoteGenerationResponse, type QuoteStatus, type QuoteStep, type QuoteV2, type RAGInsight, SCOPE_PERMISSIONS, type SimilarProjectRef, type StorageAdapter, type StreamEvent, type StreamEventType, THEME_STYLE_PRESETS, type Technology, type TenantPlan, type TenantPublicConfig, type TextLabels, type ThemeConfig, ThemeManager, type ThemeManagerOptions, type ThemeMode, type ThemeStyle, type Timeline, type Unsubscribe, VERSION, type VatInfo, WEBHOOK_ID_HEADER, WEBHOOK_SIGNATURE_HEADER, WEBHOOK_TIMESTAMP_HEADER, WebhookClient, type WebhookClientOptions, type WebhookEndpoint, type WebhookEvent, type WebhookEventType, type WebhookPayload, type WebhookPayloadBase, type WidgetMode, type WidgetOptions, type WidgetPosition, type WidgetState, assertPermission, calculatePricingSummary, computeSignature, constructEvent, createAnalytics, createAnalyticsFromConfig, createQuoteEngine, createStyledTheme, createThemeManager, createWebhookClient, debounce, deepMerge, createQuoteEngine as default, formatCurrency, formatDate, formatQuoteNumber, generateThemeCss, getApiKeyPermissions, getCountryFromLocale, getDaysUntilExpiry, getLocaleFromLanguage, getScopeDescription, getThemePreset, hasPermission, isLiveKey, isQuoteExpired, isTestKey, isValidApiKeyFormat, isValidEmail, isValidPhone, listEnabledPermissions, maskApiKey, parseApiKey, storage, t, throttle, translations, validateApiKey, verifySignature };
