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

export interface IntegrationsDict {
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
}

export const integrationsEn: IntegrationsDict = {
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
};

export const integrationsAr: IntegrationsDict = {
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
};
