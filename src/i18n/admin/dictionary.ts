/**
 * Centralized admin-UI dictionary (Wave 5) — English + Arabic.
 *
 * Pure/dependency-free so both the server layout and the client-free switcher
 * can import it. Typing `en` and `ar` against `AdminDict` forces every key to
 * exist in BOTH languages, so a missing Arabic string is a compile error, not a
 * silent English fallback. Interpolated/counted phrases are small functions so
 * call sites stay tidy and each language controls its own word order.
 *
 * Scope of this first pass: the shared chrome (sidebar nav + furniture) and the
 * dashboard. Other screens are added key-group by key-group in later passes.
 */
import type { BookingStatus } from "@prisma/client";
import type { AdminLocale } from "./config";

export interface AdminDict {
  nav: {
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
  };
  chrome: {
    adminPanel: string;
    viewLiveSite: string;
    signOut: string;
    signingOut: string;
    language: string;
  };
  status: Record<BookingStatus, string>;
  dashboard: DashboardDict;
}
interface DashboardDict {
  welcome: (firstName: string) => string;
  signedInAs: string;
  role: string;
  needsAttention: string;
  awaitingBankTransfer: (n: number) => string;
  review: string;
  newEnquiries: (n: number) => string;
  openEnquiries: string;
  totalBookings: string;
  confirmed: string;
  awaitingPayment: string;
  refunded: string;
  revenueToDate: string;
  revenueHint: string;
  fullReports: string;
  noRevenue: string;
  confirmedCount: (n: number) => string;
  netTaken: string;
  quickActions: string;
  recentOrders: string;
  viewAll: string;
  noOrders: string;
  thReference: string;
  thTour: string;
  thCustomer: string;
  thStatus: string;
  thAmount: string;
  thWhen: string;
  system: string;
  toursCard: string;
  integrationsEnabled: string;
  landingOverrides: string;
  landingOverridesHint: string;
  manage: string;
  edit: string;
}
const en: AdminDict = {
  nav: {
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
  },
  chrome: {
    adminPanel: "Admin panel",
    viewLiveSite: "View live site",
    signOut: "Sign out",
    signingOut: "Signing out…",
    language: "Language",
  },
  status: {
    PENDING_PAYMENT: "Awaiting payment",
    CONFIRMED: "Confirmed",
    CANCELLED: "Cancelled",
    REFUNDED: "Refunded",
    FAILED: "Failed",
  },
  dashboard: {
    welcome: (name) => `Welcome, ${name}`,
    signedInAs: "Signed in as",
    role: "role",
    needsAttention: "Needs attention",
    awaitingBankTransfer: (n) =>
      `${n} booking${n === 1 ? "" : "s"} awaiting bank-transfer confirmation.`,
    review: "Review →",
    newEnquiries: (n) => `${n} new enquir${n === 1 ? "y" : "ies"} to read.`,
    openEnquiries: "Open enquiries →",
    totalBookings: "Total bookings",
    confirmed: "Confirmed",
    awaitingPayment: "Awaiting payment",
    refunded: "Refunded",
    revenueToDate: "Revenue to date",
    revenueHint:
      "Money actually taken from confirmed bookings, after any discounts. Each currency is shown on its own — EGP and USD are never added together.",
    fullReports: "Full reports →",
    noRevenue: "No confirmed revenue yet.",
    confirmedCount: (n) => `${n} confirmed`,
    netTaken: "Net taken (after discounts)",
    quickActions: "Quick actions",
    recentOrders: "Recent orders",
    viewAll: "View all →",
    noOrders: "No orders yet.",
    thReference: "Reference",
    thTour: "Tour",
    thCustomer: "Customer",
    thStatus: "Status",
    thAmount: "Amount",
    thWhen: "When",
    system: "System",
    toursCard: "Tours",
    integrationsEnabled: "Integrations enabled",
    landingOverrides: "Landing overrides",
    landingOverridesHint:
      "How many parts of the public home page you have customized here in the admin (instead of the built-in default text).",
    manage: "Manage →",
    edit: "Edit →",
  },
};
const ar: AdminDict = {
  nav: {
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
  },
  chrome: {
    adminPanel: "لوحة الإدارة",
    viewLiveSite: "عرض الموقع المباشر",
    signOut: "تسجيل الخروج",
    signingOut: "جارٍ تسجيل الخروج…",
    language: "اللغة",
  },
  status: {
    PENDING_PAYMENT: "بانتظار الدفع",
    CONFIRMED: "مؤكَّد",
    CANCELLED: "ملغى",
    REFUNDED: "مُسترَد",
    FAILED: "فشل",
  },
  dashboard: {
    welcome: (name) => `مرحبًا، ${name}`,
    signedInAs: "مسجّل الدخول باسم",
    role: "الدور",
    needsAttention: "تحتاج إلى انتباه",
    awaitingBankTransfer: (n) => `${n} حجز بانتظار تأكيد التحويل البنكي.`,
    review: "مراجعة ←",
    newEnquiries: (n) => `${n} استفسار جديد للقراءة.`,
    openEnquiries: "فتح الاستفسارات ←",
    totalBookings: "إجمالي الحجوزات",
    confirmed: "مؤكَّدة",
    awaitingPayment: "بانتظار الدفع",
    refunded: "مُستردَّة",
    revenueToDate: "الإيرادات حتى الآن",
    revenueHint:
      "الأموال المحصَّلة فعليًا من الحجوزات المؤكَّدة بعد أي خصومات. كل عملة تُعرض على حدة — الجنيه المصري والدولار الأمريكي لا يُجمعان معًا أبدًا.",
    fullReports: "كل التقارير ←",
    noRevenue: "لا توجد إيرادات مؤكَّدة بعد.",
    confirmedCount: (n) => `${n} مؤكَّدة`,
    netTaken: "الصافي المحصَّل (بعد الخصومات)",
    quickActions: "إجراءات سريعة",
    recentOrders: "أحدث الطلبات",
    viewAll: "عرض الكل ←",
    noOrders: "لا توجد طلبات بعد.",
    thReference: "المرجع",
    thTour: "الجولة",
    thCustomer: "العميل",
    thStatus: "الحالة",
    thAmount: "المبلغ",
    thWhen: "التاريخ",
    system: "النظام",
    toursCard: "الجولات",
    integrationsEnabled: "التكاملات المفعَّلة",
    landingOverrides: "تخصيصات الصفحة الرئيسية",
    landingOverridesHint:
      "عدد أجزاء الصفحة الرئيسية العامة التي خصّصتها هنا في لوحة الإدارة (بدلًا من النص الافتراضي المدمج).",
    manage: "إدارة ←",
    edit: "تعديل ←",
  },
};

export const adminDictionaries: Record<AdminLocale, AdminDict> = { en, ar };

/** The full dictionary for a locale. Server components read it and pass the
 *  needed strings (or the whole object) down to any client islands. */
export function getAdminDict(locale: AdminLocale): AdminDict {
  return adminDictionaries[locale];
}
