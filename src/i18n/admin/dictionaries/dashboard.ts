/**
 * Admin dashboard dictionary (Wave 5). Counted/interpolated phrases are small
 * functions so each language controls its own word order and plural rules.
 * Arabic flips the directional arrow glyph (→ becomes ←) inside the strings.
 */

export interface DashboardDict {
  welcome: (firstName: string) => string;
  signedInAs: string;
  role: string;
  needsAttention: string;
  awaitingBankTransfer: (n: number) => string;
  review: string;
  newEnquiries: (n: number) => string;
  openEnquiries: string;
  kpisAria: string;
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

export const dashboardEn: DashboardDict = {
  welcome: (name) => `Welcome, ${name}`,
  signedInAs: "Signed in as",
  role: "role",
  needsAttention: "Needs attention",
  awaitingBankTransfer: (n) =>
    `${n} booking${n === 1 ? "" : "s"} awaiting bank-transfer confirmation.`,
  review: "Review →",
  newEnquiries: (n) => `${n} new enquir${n === 1 ? "y" : "ies"} to read.`,
  openEnquiries: "Open enquiries →",
  kpisAria: "Booking totals",
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
};

export const dashboardAr: DashboardDict = {
  welcome: (name) => `مرحبًا، ${name}`,
  signedInAs: "مسجّل الدخول باسم",
  role: "الدور",
  needsAttention: "تحتاج إلى انتباه",
  awaitingBankTransfer: (n) => `${n} حجز بانتظار تأكيد التحويل البنكي.`,
  review: "مراجعة ←",
  newEnquiries: (n) => `${n} استفسار جديد للقراءة.`,
  openEnquiries: "فتح الاستفسارات ←",
  kpisAria: "إجماليات الحجوزات",
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
};
