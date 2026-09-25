/**
 * Branding dictionary (Wave 5) — /admin/branding (global brand, contact and SEO
 * settings) plus its two client islands: BrandingEditor and the branding-only
 * SocialsEditor repeater.
 *
 * Every string here reaches a client island via the `labels` prop, so this
 * module holds NO functions — per-row numbers/labels use pre/suffix tokens the
 * island concatenates. Server VALIDATION errors (`state.error`) stay verbatim;
 * example/format placeholders (emails, "+20 …", "#1a2340", URL schemes) are
 * technical samples kept verbatim. Icon-key option values are stored enums.
 */

/** Footer social-link repeater island (SocialsEditor). All strings. */
export interface SocialsEditorDict {
  fieldLabel: string;
  /** Row heading: `${linkPre}${n}`. */
  linkPre: string;
  remove: string;
  label: string;
  icon: string;
  url: string;
  addLink: string;
  /** aria-label parts: `${ariaPre}${n}${ariaLabelSuffix|ariaIconSuffix|ariaUrlSuffix}`. */
  ariaPre: string;
  ariaLabelSuffix: string;
  ariaIconSuffix: string;
  ariaUrlSuffix: string;
}

/** Branding form island (BrandingEditor). All strings. */
export interface BrandingEditorDict {
  savedNote: string;
  identityHeading: string;
  siteName: string;
  tagline: string;
  legalName: string;
  copyrightLine: string;
  copyrightHint: string;
  logosHeading: string;
  logosHint: string;
  headerLogo: string;
  footerLogo: string;
  favicon: string;
  socialLinksHeading: string;
  contactHeading: string;
  contactHint: string;
  contactEmail: string;
  phone: string;
  whatsapp: string;
  seoThemeHeading: string;
  ogImage: string;
  themeColor: string;
  saving: string;
  save: string;
  socials: SocialsEditorDict;
}
/** /admin/branding page (server). All strings. */
export interface BrandingDict {
  title: string;
  subtitle: string;
  viewOnlyNote: string;
  editor: BrandingEditorDict;
}
export const brandingEn: BrandingDict = {
  title: "Branding",
  subtitle:
    "Logo, favicon, social links, contact details and theme — used across the public site and document metadata. The database is the source of truth; changes take effect within seconds.",
  viewOnlyNote: "Your role can view branding but not change it.",
  editor: {
    savedNote: "Branding saved. Public pages update within seconds.",
    identityHeading: "Identity",
    siteName: "Site name",
    tagline: "Tagline",
    legalName: "Legal name",
    copyrightLine: "Copyright line",
    copyrightHint: "({year} is replaced automatically)",
    logosHeading: "Logos & favicon",
    logosHint:
      "Leave empty to use the built-in cartouche wordmark and default favicon. Raster (PNG/WebP) is preferred for the favicon.",
    headerLogo: "Header logo",
    footerLogo: "Footer logo",
    favicon: "Favicon",
    socialLinksHeading: "Social links",
    contactHeading: "Contact",
    contactHint: "Email appears on legal pages. Phone and WhatsApp drive the floating contact widgets.",
    contactEmail: "Contact email",
    phone: "Phone",
    whatsapp: "WhatsApp",
    seoThemeHeading: "SEO & theme",
    ogImage: "Default social share image (OG)",
    themeColor: "Theme color",
    saving: "Saving…",
    save: "Save branding",
    socials: {
      fieldLabel: "Social links",
      linkPre: "Link ",
      remove: "Remove",
      label: "Label",
      icon: "Icon",
      url: "URL",
      addLink: "+ Add social link",
      ariaPre: "Social ",
      ariaLabelSuffix: " label",
      ariaIconSuffix: " icon",
      ariaUrlSuffix: " URL",
    },
  },
};
export const brandingAr: BrandingDict = {
  title: "الهوية البصرية",
  subtitle:
    "الشعار والأيقونة المفضلة وروابط التواصل وبيانات الاتصال والمظهر — تُستخدَم عبر الموقع العام وبيانات المستندات الوصفية. قاعدة البيانات هي مصدر الحقيقة؛ تسري التغييرات خلال ثوانٍ.",
  viewOnlyNote: "يمكن لدورك عرض الهوية البصرية دون تغييرها.",
  editor: {
    savedNote: "تم حفظ الهوية البصرية. تتحدّث الصفحات العامة خلال ثوانٍ.",
    identityHeading: "الهوية",
    siteName: "اسم الموقع",
    tagline: "الشعار النصي",
    legalName: "الاسم القانوني",
    copyrightLine: "سطر حقوق النشر",
    copyrightHint: "({year} يُستبدَل تلقائيًا)",
    logosHeading: "الشعارات والأيقونة المفضلة",
    logosHint:
      "اتركها فارغة لاستخدام علامة الخرطوش المدمجة والأيقونة المفضلة الافتراضية. يُفضَّل استخدام صورة نقطية (PNG/WebP) للأيقونة المفضلة.",
    headerLogo: "شعار الرأس",
    footerLogo: "شعار التذييل",
    favicon: "الأيقونة المفضلة",
    socialLinksHeading: "روابط التواصل الاجتماعي",
    contactHeading: "التواصل",
    contactHint: "يظهر البريد الإلكتروني في الصفحات القانونية. يشغّل الهاتف وواتساب أدوات الاتصال العائمة.",
    contactEmail: "بريد التواصل",
    phone: "الهاتف",
    whatsapp: "واتساب",
    seoThemeHeading: "تحسين محركات البحث والمظهر",
    ogImage: "صورة المشاركة الاجتماعية الافتراضية (OG)",
    themeColor: "لون المظهر",
    saving: "جارٍ الحفظ…",
    save: "حفظ الهوية البصرية",
    socials: {
      fieldLabel: "روابط التواصل الاجتماعي",
      linkPre: "رابط ",
      remove: "إزالة",
      label: "التسمية",
      icon: "الأيقونة",
      url: "الرابط",
      addLink: "+ إضافة رابط تواصل",
      ariaPre: "رابط تواصل ",
      ariaLabelSuffix: " التسمية",
      ariaIconSuffix: " الأيقونة",
      ariaUrlSuffix: " الرابط",
    },
  },
};
