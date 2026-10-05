/**
 * Admin chrome dictionary (Wave 5) — sidebar navigation labels + shell furniture.
 * One focused slice of the modular admin dictionary; assembled in ../dictionary.ts.
 * `navEn`/`navAr` (and `chromeEn`/`chromeAr`) are each typed against their
 * interface, so a key missing in either language is a compile error.
 */

export interface NavDict {
  dashboard: string;
  orders: string;
  reports: string;
  coupons: string;
  content: string;
  translations: string;
  tours: string;
  destinations: string;
  events: string;
  tripIdeas: string;
  enquiries: string;
  media: string;
  branding: string;
  widgets: string;
  toggles: string;
  integrations: string;
  payments: string;
}

export interface ChromeDict {
  adminPanel: string;
  viewLiveSite: string;
  signOut: string;
  signingOut: string;
  language: string;
  /** aria-label for the sidebar <nav> landmark. */
  navLabel: string;
  /** Screen-reader suffix for the unread-enquiry count on the nav link. */
  unreadEnquiries: string;
}

export const navEn: NavDict = {
  dashboard: "Dashboard",
  orders: "Orders",
  reports: "Reports",
  coupons: "Coupons",
  content: "Content (CMS)",
  translations: "Translations",
  tours: "Tours",
  destinations: "Destinations",
  events: "Events",
  tripIdeas: "Trip ideas",
  enquiries: "Enquiries",
  media: "Media library",
  branding: "Branding",
  widgets: "Floating widgets",
  toggles: "Site toggles",
  integrations: "Integrations",
  payments: "Payments",
};

export const navAr: NavDict = {
  dashboard: "لوحة التحكم",
  orders: "الطلبات",
  reports: "التقارير",
  coupons: "الكوبونات",
  content: "المحتوى",
  translations: "الترجمات",
  tours: "الجولات",
  destinations: "الوجهات",
  events: "الفعاليات",
  tripIdeas: "أفكار الرحلات",
  enquiries: "الاستفسارات",
  media: "مكتبة الوسائط",
  branding: "الهوية البصرية",
  widgets: "الأدوات العائمة",
  toggles: "إعدادات الموقع",
  integrations: "التكاملات",
  payments: "المدفوعات",
};

export const chromeEn: ChromeDict = {
  adminPanel: "Admin panel",
  viewLiveSite: "View live site",
  signOut: "Sign out",
  signingOut: "Signing out…",
  language: "Language",
  navLabel: "Admin sections",
  unreadEnquiries: "unread enquiries",
};

export const chromeAr: ChromeDict = {
  adminPanel: "لوحة الإدارة",
  viewLiveSite: "عرض الموقع المباشر",
  signOut: "تسجيل الخروج",
  signingOut: "جارٍ تسجيل الخروج…",
  language: "اللغة",
  navLabel: "أقسام الإدارة",
  unreadEnquiries: "استفسارات غير مقروءة",
};
