/**
 * Reports dictionary (Wave 5) — the /admin/reports screen, its Recharts island
 * (labels passed down as props) and the CSV export route. Booking-status names
 * come from the shared `status` slice, so this module holds only the reports
 * chrome: range tabs, KPI labels, section headings + hints, table headers, the
 * GA4 traffic panel copy and the CSV column/section labels. Range keys mirror
 * `ReportRangeKey` from `@/server/admin/reports`. Counted phrases are functions.
 */
import type { ReportRangeKey } from "@/server/admin/reports";

/** Labels the server page passes into the <ReportsCharts> client island. */
export interface ReportsChartsDict {
  statusTitle: string;
  statusSubtitle: string;
  toursTitle: string;
  toursSubtitle: string;
  countriesTitle: string;
  countriesSubtitle: string;
  bookingsSeries: string; // bar-series name in tooltips/legend
}

/** Section + column labels for the downloadable CSV (admin-facing artifact). */
export interface ReportsCsvDict {
  period: string;
  generated: string;
  revenueSection: string;
  colCurrency: string;
  colConfirmedBookings: string;
  colNet: string;
  colDiscount: string;
  colGross: string;
  noRevenue: string;
  refundsSection: string;
  colRefundedBookings: string;
  colAmountRefunded: string;
  noRefunds: string;
  statusSection: string;
  colStatus: string;
  colBookings: string;
  totalRow: string;
  topToursSection: string;
  colTour: string;
  colSeats: string;
  colRevenuePerCurrency: string;
  noTourBookings: string;
  countrySection: string;
  colCountry: string;
  noConfirmedBookings: string;
}

export interface ReportsDict {
  title: string;
  subtitle: string;
  rangeAria: string;
  rangeTab: Record<ReportRangeKey, string>;
  rangeLabel: Record<ReportRangeKey, string>;
  downloadCsv: string;
  kpiAria: string;
  kpiTotalBookings: string;
  kpiConfirmed: string;
  kpiAwaitingPayment: string;
  kpiRefunded: string;
  revenueHeading: string;
  revenueHint: string;
  noRevenue: string;
  bookingsCount: (n: number) => string;
  netTaken: string;
  grossLine: (gross: string, discount: string) => string;
  refundsHeading: string;
  refundsHint: string;
  refundColCurrency: string;
  refundColBookings: string;
  refundColAmount: string;
  byStatusHeading: string;
  byStatusHint: string;
  noBookings: string;
  colStatus: string;
  colBookings: string;
  totalRow: string;
  topToursHeading: string;
  topToursHint: string;
  noTourBookings: string;
  colTour: string;
  colSeats: string;
  colRevenue: string;
  byCountryHeading: string;
  byCountryHint: string;
  byCountryNote: string;
  noConfirmedBookings: string;
  colCountry: string;
  trafficHeading: string;
  trafficHint: string;
  trafficNote: string;
  ga4NotConfigured: string;
  ga4Error: string;
  ga4Setup: string;
  ga4NoData: string;
  ga4Loading: string;
  colSessions: string;
  colActiveUsers: string;
  charts: ReportsChartsDict;
  csv: ReportsCsvDict;
}

export const reportsEn: ReportsDict = {
  title: "Reports",
  subtitle: "Revenue and bookings for the selected period. Money is shown per currency and never mixed.",
  rangeAria: "Report period",
  rangeTab: { "7d": "7 days", "30d": "30 days", "90d": "90 days", "12m": "12 months", ytd: "Year to date", all: "All time" },
  rangeLabel: { "7d": "Last 7 days", "30d": "Last 30 days", "90d": "Last 90 days", "12m": "Last 12 months", ytd: "Year to date", all: "All time" },
  downloadCsv: "↓ Download CSV",
  kpiAria: "Key totals",
  kpiTotalBookings: "Total bookings",
  kpiConfirmed: "Confirmed",
  kpiAwaitingPayment: "Awaiting payment",
  kpiRefunded: "Refunded",
  revenueHeading: "Revenue (confirmed)",
  revenueHint:
    "Money actually taken from paid (confirmed) bookings, after any coupon discounts. Each currency is shown on its own — EGP and USD are never added together.",
  noRevenue: "No confirmed revenue in this period.",
  bookingsCount: (n) => `${n} bookings`,
  netTaken: "Net taken (after discounts)",
  grossLine: (gross, discount) => `Gross ${gross} · discounts −${discount}`,
  refundsHeading: "Refunds",
  refundsHint: "Money paid back to customers on refunded bookings, shown per currency.",
  refundColCurrency: "Currency",
  refundColBookings: "Refunded bookings",
  refundColAmount: "Amount refunded",
  byStatusHeading: "Bookings by status",
  byStatusHint:
    "How many bookings fall into each stage — pending payment, confirmed, cancelled, refunded or failed. This counts bookings, not money, so all currencies are included together.",
  noBookings: "No bookings in this period.",
  colStatus: "Status",
  colBookings: "Bookings",
  totalRow: "Total",
  topToursHeading: "Top tours (confirmed)",
  topToursHint:
    "Your best-selling tours in this period, ordered by number of confirmed bookings. Revenue is listed per currency for each tour.",
  noTourBookings: "No confirmed tour bookings in this period.",
  colTour: "Tour",
  colSeats: "Seats",
  colRevenue: "Revenue",
  byCountryHeading: "Bookings by country",
  byCountryHint:
    "Where your paying customers are — grouped by the country they entered at checkout. This is buyers only, not general website visitors.",
  byCountryNote: "From the customer’s country at checkout (confirmed bookings).",
  noConfirmedBookings: "No confirmed bookings in this period.",
  colCountry: "Country",
  trafficHeading: "Website traffic by country",
  trafficHint:
    "Everyone who visited the site, from Google Analytics — not just buyers. Sessions = visits; active users = distinct people. Needs Google Analytics set up in Integrations.",
  trafficNote: "Visitor sessions from Google Analytics (all site traffic, not only buyers).",
  ga4NotConfigured:
    "Add the GA4 Property ID, service-account email and private key in Integrations, and enable GA4.",
  ga4Error: "Could not reach Google Analytics. Check the GA4 credentials and Property ID.",
  ga4Setup: "Set up Google Analytics →",
  ga4NoData: "No visitor data reported for this period yet.",
  ga4Loading: "Loading visitor analytics…",
  colSessions: "Sessions",
  colActiveUsers: "Active users",
  charts: {
    statusTitle: "Bookings by status",
    statusSubtitle: "Every booking this period, by stage",
    toursTitle: "Top tours",
    toursSubtitle: "Confirmed bookings per tour",
    countriesTitle: "Bookings by country",
    countriesSubtitle: "Confirmed buyers by checkout country",
    bookingsSeries: "Bookings",
  },
  csv: {
    period: "Period",
    generated: "Generated",
    revenueSection: "Revenue (confirmed) — per currency",
    colCurrency: "Currency",
    colConfirmedBookings: "Confirmed bookings",
    colNet: "Net",
    colDiscount: "Discount",
    colGross: "Gross",
    noRevenue: "No confirmed revenue in this period",
    refundsSection: "Refunds — per currency",
    colRefundedBookings: "Refunded bookings",
    colAmountRefunded: "Amount refunded",
    noRefunds: "No refunds in this period",
    statusSection: "Bookings by status",
    colStatus: "Status",
    colBookings: "Bookings",
    totalRow: "Total",
    topToursSection: "Top tours (confirmed)",
    colTour: "Tour",
    colSeats: "Seats",
    colRevenuePerCurrency: "Revenue (per currency)",
    noTourBookings: "No confirmed tour bookings in this period",
    countrySection: "Bookings by country",
    colCountry: "Country",
    noConfirmedBookings: "No confirmed bookings in this period",
  },
};
export const reportsAr: ReportsDict = {
  title: "التقارير",
  subtitle: "الإيرادات والحجوزات للفترة المحددة. تُعرض المبالغ لكل عملة على حدة ولا تُجمع معًا أبدًا.",
  rangeAria: "فترة التقرير",
  rangeTab: { "7d": "7 أيام", "30d": "30 يومًا", "90d": "90 يومًا", "12m": "12 شهرًا", ytd: "منذ بداية العام", all: "كل الوقت" },
  rangeLabel: { "7d": "آخر 7 أيام", "30d": "آخر 30 يومًا", "90d": "آخر 90 يومًا", "12m": "آخر 12 شهرًا", ytd: "منذ بداية العام", all: "كل الوقت" },
  downloadCsv: "↓ تنزيل CSV",
  kpiAria: "الإجماليات الرئيسية",
  kpiTotalBookings: "إجمالي الحجوزات",
  kpiConfirmed: "مؤكَّدة",
  kpiAwaitingPayment: "بانتظار الدفع",
  kpiRefunded: "مُسترَدة",
  revenueHeading: "الإيرادات (المؤكَّدة)",
  revenueHint:
    "المبالغ المُحصَّلة فعليًا من الحجوزات المدفوعة (المؤكَّدة) بعد خصومات الكوبونات. تُعرض كل عملة على حدة — الجنيه المصري والدولار لا يُجمعان معًا أبدًا.",
  noRevenue: "لا توجد إيرادات مؤكَّدة في هذه الفترة.",
  bookingsCount: (n) => `${n} حجز`,
  netTaken: "الصافي المُحصَّل (بعد الخصومات)",
  grossLine: (gross, discount) => `الإجمالي ${gross} · الخصومات −${discount}`,
  refundsHeading: "المبالغ المُستردة",
  refundsHint: "المبالغ المُعادة للعملاء عن الحجوزات المُستردة، معروضة لكل عملة.",
  refundColCurrency: "العملة",
  refundColBookings: "الحجوزات المُستردة",
  refundColAmount: "المبلغ المُسترد",
  byStatusHeading: "الحجوزات حسب الحالة",
  byStatusHint:
    "كم عدد الحجوزات في كل مرحلة — بانتظار الدفع، مؤكَّدة، ملغاة، مُستردة أو فاشلة. هذا يَعدّ الحجوزات لا المبالغ، لذا تُدرَج كل العملات معًا.",
  noBookings: "لا توجد حجوزات في هذه الفترة.",
  colStatus: "الحالة",
  colBookings: "الحجوزات",
  totalRow: "الإجمالي",
  topToursHeading: "أفضل الجولات (المؤكَّدة)",
  topToursHint:
    "أكثر جولاتك مبيعًا في هذه الفترة، مرتبةً حسب عدد الحجوزات المؤكَّدة. تُدرَج الإيرادات لكل عملة لكل جولة.",
  noTourBookings: "لا توجد حجوزات جولات مؤكَّدة في هذه الفترة.",
  colTour: "الجولة",
  colSeats: "المقاعد",
  colRevenue: "الإيرادات",
  byCountryHeading: "الحجوزات حسب الدولة",
  byCountryHint:
    "من أين يأتي عملاؤك الدافعون — مُجمَّعين حسب الدولة التي أدخلوها عند الدفع. هؤلاء المشترون فقط، وليس زوّار الموقع عمومًا.",
  byCountryNote: "من دولة العميل عند الدفع (الحجوزات المؤكَّدة).",
  noConfirmedBookings: "لا توجد حجوزات مؤكَّدة في هذه الفترة.",
  colCountry: "الدولة",
  trafficHeading: "زيارات الموقع حسب الدولة",
  trafficHint:
    "كل من زار الموقع، من Google Analytics — وليس المشترين فقط. الجلسات = الزيارات؛ المستخدمون النشطون = أشخاص مختلفون. يتطلب إعداد Google Analytics في التكاملات.",
  trafficNote: "جلسات الزوّار من Google Analytics (كل زيارات الموقع، وليس المشترين فقط).",
  ga4NotConfigured:
    "أضِف معرّف موقع GA4 وبريد حساب الخدمة والمفتاح الخاص في التكاملات، ثم فعّل GA4.",
  ga4Error: "تعذّر الوصول إلى Google Analytics. تحقّق من بيانات اعتماد GA4 ومعرّف الموقع.",
  ga4Setup: "إعداد Google Analytics ←",
  ga4NoData: "لم تُسجَّل بيانات زوّار لهذه الفترة بعد.",
  ga4Loading: "جارٍ تحميل تحليلات الزوّار…",
  colSessions: "الجلسات",
  colActiveUsers: "المستخدمون النشطون",
  charts: {
    statusTitle: "الحجوزات حسب الحالة",
    statusSubtitle: "كل حجوزات هذه الفترة، حسب المرحلة",
    toursTitle: "أفضل الجولات",
    toursSubtitle: "الحجوزات المؤكَّدة لكل جولة",
    countriesTitle: "الحجوزات حسب الدولة",
    countriesSubtitle: "المشترون المؤكَّدون حسب دولة الدفع",
    bookingsSeries: "الحجوزات",
  },
  csv: {
    period: "الفترة",
    generated: "أُنشئ في",
    revenueSection: "الإيرادات (المؤكَّدة) — لكل عملة",
    colCurrency: "العملة",
    colConfirmedBookings: "الحجوزات المؤكَّدة",
    colNet: "الصافي",
    colDiscount: "الخصم",
    colGross: "الإجمالي",
    noRevenue: "لا توجد إيرادات مؤكَّدة في هذه الفترة",
    refundsSection: "المبالغ المُستردة — لكل عملة",
    colRefundedBookings: "الحجوزات المُستردة",
    colAmountRefunded: "المبلغ المُسترد",
    noRefunds: "لا توجد مبالغ مُستردة في هذه الفترة",
    statusSection: "الحجوزات حسب الحالة",
    colStatus: "الحالة",
    colBookings: "الحجوزات",
    totalRow: "الإجمالي",
    topToursSection: "أفضل الجولات (المؤكَّدة)",
    colTour: "الجولة",
    colSeats: "المقاعد",
    colRevenuePerCurrency: "الإيرادات (لكل عملة)",
    noTourBookings: "لا توجد حجوزات جولات مؤكَّدة في هذه الفترة",
    countrySection: "الحجوزات حسب الدولة",
    colCountry: "الدولة",
    noConfirmedBookings: "لا توجد حجوزات مؤكَّدة في هذه الفترة",
  },
};


