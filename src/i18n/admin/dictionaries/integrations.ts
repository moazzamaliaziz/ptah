/**
 * Integrations dictionary (Wave 5) — /admin/integrations (third-party service
 * catalog: analytics, payments, security, email, …). Both the page and the
 * IntegrationCard are SERVER components, so interpolated phrases may stay
 * functions (the count in the intro line).
 *
 * Localized: page title/intro, the category section headings, and each card's
 * chrome (enabled/off badge, the configured note, the "Enabled" switch label,
 * the secret set/not-set hint, Save). NOT localized — kept English per the
 * translatable-fields registry precedent — is every per-integration registry
 * string: `item.label` (product names: Google Analytics, reCAPTCHA…), plus
 * `f.label`/`f.help`/`f.placeholder`/`f.value` (technical config identifiers the
 * operator matches against the provider's own dashboard) and `item.key`. Server
 * VALIDATION errors from actions.ts stay verbatim.
 */
import type { IntegrationCategory } from "@/server/integrations";

/** "Test connection" panel on the PayPal card. */
export interface PaypalTestDict {
  test: string;
  testing: string;
  testHint: string;
  okText: string;
  notConfigured: string;
  authRejected: string;
  orderRejected: string;
  network: string;
}

export interface IntegrationsDict {
  paypalTest: PaypalTestDict;
  title: string;
  /** Intro line; `${count}` is the live integration count. */
  intro: (count: number) => string;
  /** Section headings, keyed by the stored category enum (exhaustive). */
  categories: Record<IntegrationCategory, string>;
  badgeEnabled: string;
  badgeOff: string;
  configured: string;
  notConfigured: string;
  /** Per-card on/off switch label. */
  enabledSwitch: string;
  /** Secret-field hint appended after a secret field's label. */
  secretSet: string;
  secretNotSet: string;
  save: string;
  saving: string;
}

export const integrationsEn: IntegrationsDict = {
  paypalTest: {
    test: "Test connection",
    testing: "Testing…",
    testHint:
      "Asks PayPal for a token and tries a $1.00 test order. The order is never approved and nothing is charged — it just expires.",
    okText: "PayPal is working ({environment}). Checkout can start.",
    notConfigured:
      "PayPal is not configured: the integration is switched off, or the Client ID / Secret are missing. Fill them in above, tick Enabled, and save.",
    authRejected:
      "PayPal rejected these credentials (HTTP {status}) against the {environment} environment. Either the Client ID / Secret are wrong, or they belong to the other environment — sandbox keys only work with Environment set to sandbox, live keys only with live.",
    orderRejected:
      "The credentials are valid, but PayPal refused a test order (HTTP {status}) in {currency}. This usually means the account cannot receive payments in that currency, or cannot receive payments at all yet. PayPal's exact reply is below.",
    network:
      "PayPal could not be reached. This is usually temporary — try again in a moment.",
  },
  title: "Integrations",
  intro: (count) =>
    `${count} third-party integrations. Secrets are encrypted at rest and never sent back to the browser — a saved secret field shows only as “set”.`,
  categories: {
    analytics: "Analytics & tags",
    payments: "Payments",
    security: "Bot protection",
    email: "Email",
    sms: "SMS & messaging",
    maps: "Maps",
    reviews: "Reviews",
    monitoring: "Monitoring",
    automation: "Automation",
  },
  badgeEnabled: "Enabled",
  badgeOff: "Off",
  configured: "Credentials stored",
  notConfigured: "Not configured",
  enabledSwitch: "Enabled",
  secretSet: "set (leave blank to keep)",
  secretNotSet: "not set",
  save: "Save",
  saving: "Saving…",
};

export const integrationsAr: IntegrationsDict = {
  paypalTest: {
    test: "اختبار الاتصال",
    testing: "جارٍ الاختبار…",
    testHint:
      "يطلب رمزًا من PayPal ثم يجرّب طلبًا اختباريًا بقيمة 1.00 دولار. لا تتم الموافقة على الطلب ولا يُخصم أي مبلغ — ينتهي تلقائيًا.",
    okText: "PayPal يعمل ({environment}). يمكن بدء الدفع.",
    notConfigured:
      "لم يُضبط PayPal: التكامل مُعطَّل، أو أن Client ID / Secret غير مُدخلين. أدخلهما أعلاه وفعّل الخيار ثم احفظ.",
    authRejected:
      "رفض PayPal بيانات الاعتماد هذه (HTTP {status}) في بيئة {environment}. إما أن Client ID / Secret غير صحيحين، أو أنهما يخصّان البيئة الأخرى — مفاتيح sandbox تعمل فقط مع sandbox، ومفاتيح live مع live فقط.",
    orderRejected:
      "بيانات الاعتماد صحيحة، لكن PayPal رفض طلبًا اختباريًا (HTTP {status}) بعملة {currency}. يعني هذا غالبًا أن الحساب لا يمكنه استقبال المدفوعات بهذه العملة، أو لا يمكنه استقبال المدفوعات بعد. ردّ PayPal الكامل في الأسفل.",
    network: "تعذّر الوصول إلى PayPal. غالبًا ما يكون هذا مؤقتًا — أعد المحاولة بعد قليل.",
  },
  title: "التكاملات",
  intro: (count) =>
    `${count} تكاملات مع خدمات خارجية. تُشفَّر الأسرار عند التخزين ولا تُعاد إلى المتصفح مطلقًا — يظهر حقل السرّ المحفوظ كـ«مُعيَّن» فقط.`,
  categories: {
    analytics: "التحليلات والوسوم",
    payments: "المدفوعات",
    security: "الحماية من الروبوتات",
    email: "البريد الإلكتروني",
    sms: "الرسائل والمراسلة",
    maps: "الخرائط",
    reviews: "التقييمات",
    monitoring: "المراقبة",
    automation: "الأتمتة",
  },
  badgeEnabled: "مُفعَّل",
  badgeOff: "متوقف",
  configured: "بيانات الاعتماد محفوظة",
  notConfigured: "غير مُهيّأ",
  enabledSwitch: "مُفعَّل",
  secretSet: "معيَّن (اتركه فارغًا للإبقاء عليه)",
  secretNotSet: "غير معيَّن",
  save: "حفظ",
  saving: "جارٍ الحفظ…",
};
