/**
 * Content (CMS) dictionary (Wave 5) — /admin/content (the seven landing-page
 * sections: list + per-section JSON override editor). The section display
 * labels are a fixed, code-defined set (not user data), so they're translated
 * here keyed by section key, with the server-provided label as a safe fallback
 * if a new key ever appears. The JSON payload text itself is data and is never
 * translated; server-side schema-validation errors on save are surfaced
 * verbatim (not routed through this dictionary).
 */

/** The JSON editor island's labels (all strings → serializable prop). */
export interface ContentEditorLabels {
  saved: string; // success note after a valid save
  save: string; // "Save override"
  saving: string; // the generic `common.saving`, passed through
  payloadAria: string; // precomputed aria-label for the textarea
}

export interface ContentDict {
  title: string;
  subtitle: string;
  colSection: string;
  colSource: string;
  badgeOverride: string;
  badgeDefault: string;
  editSubtitle: string;
  backToList: string;
  badgeCurrentlyOverridden: string;
  badgeServingDefault: string;
  resetToDefault: string;
  saveOverride: string;
  savedNote: string;
  /** aria-label for the JSON textarea, given the raw section key. */
  payloadAria: (sectionKey: string) => string;
  /** section key → localized label (fixed set; falls back to the server label). */
  sectionLabels: Record<string, string>;
}

export const contentEn: ContentDict = {
  title: "Content (CMS)",
  subtitle:
    "The seven landing sections. Each can be overridden by an editable payload; an unset section serves the built-in default. Overrides are validated against the section schema before they go live.",
  colSection: "Section",
  colSource: "Source",
  badgeOverride: "Override",
  badgeDefault: "Default",
  editSubtitle:
    "Edit the section payload as JSON. It is validated against the section schema on save; an invalid shape is rejected and the current content is kept.",
  backToList: "← All sections",
  badgeCurrentlyOverridden: "Currently overridden",
  badgeServingDefault: "Serving default",
  resetToDefault: "Reset to default",
  saveOverride: "Save override",
  savedNote: "Saved. The landing page updates within the revalidation window.",
  payloadAria: (k) => `${k} payload (JSON)`,
  sectionLabels: {
    hero: "Hero — inspiration slides",
    getInspired: "Get Inspired — tabs & cards",
    planCta: "Plan Your Dream Trip — CTA",
    fiftyCtas: "50/50 CTA pair",
    kbyg: "Know Before You Go",
    tourTypes: "Tour Types",
    stories: "Featured Stories",
  },
};

export const contentAr: ContentDict = {
  title: "المحتوى (نظام إدارة المحتوى)",
  subtitle:
    "أقسام الصفحة الرئيسية السبعة. يمكن تجاوز كل قسم بحمولة قابلة للتحرير؛ والقسم غير المحدَّد يعرض الإعداد الافتراضي المدمج. تُتحقَّق التجاوزات من مخطط القسم قبل نشرها.",
  colSection: "القسم",
  colSource: "المصدر",
  badgeOverride: "تجاوز",
  badgeDefault: "افتراضي",
  editSubtitle:
    "حرِّر حمولة القسم بصيغة JSON. يجري التحقق منها وفق مخطط القسم عند الحفظ؛ وأي بنية غير صالحة تُرفض ويُبقى على المحتوى الحالي.",
  backToList: "→ كل الأقسام",
  badgeCurrentlyOverridden: "مُتجاوَز حاليًا",
  badgeServingDefault: "يعرض الافتراضي",
  resetToDefault: "إعادة التعيين إلى الافتراضي",
  saveOverride: "حفظ التجاوز",
  savedNote: "تم الحفظ. ستتحدّث الصفحة الرئيسية خلال نافذة إعادة التحقق.",
  payloadAria: (k) => `${k} — الحمولة (JSON)`,
  sectionLabels: {
    hero: "الواجهة — شرائح الإلهام",
    getInspired: "استلهم — تبويبات وبطاقات",
    planCta: "خطّط لرحلة أحلامك — دعوة لإجراء",
    fiftyCtas: "زوج دعوات 50/50",
    kbyg: "اعرف قبل السفر",
    tourTypes: "أنواع الجولات",
    stories: "قصص مختارة",
  },
};
