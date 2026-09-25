/**
 * Orders dictionary (Wave 5) — the bookings LIST, the booking DETAIL screen and
 * the client-side search box. Booking-status enum values themselves come from
 * the shared `status` slice; this module holds the surrounding UI copy, table
 * headers, action buttons and the success/error messages surfaced after a
 * server action (keyed by the machine `msg=`/`err=` codes the actions redirect
 * with). Counted/interpolated phrases are functions so each language controls
 * its own word order. Arabic flips directional arrow glyphs (→ ↔ ←).
 */

export interface OrdersDict {
  // ── list page ──
  title: string;
  subtitle: string;
  noneYet: string; // subtitle fragment when there are zero bookings
  totalShowing: (total: number, start: number, end: number) => string;
  filterByStatus: string; // aria-label
  filterAll: string;
  emptyState: string;
  awaitingPayment: string; // method column, pending booking
  bankTransfer: string; // method column
  noName: string;
  colCustomer: string;
  colTour: string;
  colDeparture: string;
  colSeats: string;
  colTotal: string;
  colMethod: string;
  colStatus: string;
  colBooked: string;
  colActions: string;
  edit: string;
  viewExternal: string;
  paginationLabel: string; // aria-label
  showingRange: (from: number, to: number, total: number) => string;
  pageOf: (page: number, totalPages: number) => string;
  prev: string;
  next: string;
  // ── search box (client island — passed as props) ──
  searchHiddenLabel: string;
  searchPlaceholder: string;
  searchAriaLabel: string;
  searchButton: string;
  // ── detail page ──
  backToOrders: string;
  reference: string;
  downloadInvoice: string;
  actionFailed: string; // error fallback
  okMessages: Record<string, string>; // keyed by ?msg= code
  errMessages: Record<string, string>; // keyed by ?err= code
  // audit timeline
  auditCreated: string;
  auditConfirmedBankTransfer: string;
  auditConfirmedCard: string;
  auditConfirmedPaypal: string;
  auditConfirmed: string;
  auditFailed: string;
  auditCancelled: string;
  auditRefunded: string;
  auditStatusChanged: (from: string, to: string) => string;
  auditStatusChangedPlain: string;
  systemActor: string;
  // Trip card
  tripHeading: string;
  tripTour: string;
  tripDeparture: string;
  tripReturns: string;
  tripTravelers: string;
  discount: string;
  discountWithCode: (code: string) => string;
  tripTotal: string;
  // Customer card
  customerHeading: string;
  custName: string;
  custEmail: string;
  custPhone: string;
  custAccount: string;
  guestCheckout: string;
  registeredUser: string;
  bookedFrom: string;
  bookedAt: string;
  notes: string;
  // Payments card
  paymentsHeading: string;
  noPayments: string;
  payColMethod: string;
  payColStatus: string;
  payColAmount: string;
  payColGatewayRef: string;
  payColWhen: string;
  // History card
  historyHeading: string;
  noHistory: string;
  // Actions card
  actionsHeading: string;
  paymentReferenceLabel: string;
  paymentReferencePlaceholder: string;
  markPaidConfirm: string;
  markPaidPending: string;
  markPaid: string;
  cancelConfirm: string;
  cancelPending: string;
  cancelRelease: string;
  refundConfirm: string;
  refundPending: string;
  refundInFull: string;
  setStatusHeading: string;
  setStatusHelp: string;
  statusLabel: string;
  applyStatusConfirm: string;
  applyStatusPending: string;
  applyStatus: string;
}

export const ordersEn: OrdersDict = {
  title: "Orders",
  subtitle: "Every booking and its payment status.",
  noneYet: "None yet.",
  totalShowing: (total, start, end) => `${total} total — showing ${start}–${end}.`,
  filterByStatus: "Filter by status",
  filterAll: "All",
  emptyState: "No bookings match. Orders appear here as customers book.",
  awaitingPayment: "Awaiting payment",
  bankTransfer: "Bank transfer",
  noName: "(no name)",
  colCustomer: "Customer",
  colTour: "Tour",
  colDeparture: "Departure",
  colSeats: "Seats",
  colTotal: "Total",
  colMethod: "Method",
  colStatus: "Status",
  colBooked: "Booked",
  colActions: "Actions",
  edit: "Edit",
  viewExternal: "View ↗",
  paginationLabel: "Orders pagination",
  showingRange: (from, to, total) => `Showing ${from}–${to} of ${total}`,
  pageOf: (page, totalPages) => `Page ${page} of ${totalPages}`,
  prev: "← Prev",
  next: "Next →",
  searchHiddenLabel: "Search orders",
  searchPlaceholder: "Search by reference or email…",
  searchAriaLabel: "Search orders by reference or email",
  searchButton: "Search",
  backToOrders: "← Orders",
  reference: "Reference",
  downloadInvoice: "Download invoice (PDF)",
  actionFailed: "Action failed.",
  okMessages: {
    refunded: "Booking refunded and seats released.",
    cancelled: "Booking cancelled and seats released.",
    paid: "Payment recorded — booking confirmed and the customer emailed.",
    status: "Booking status updated.",
  },
  errMessages: {
    NOT_FOUND: "Booking not found.",
    NOT_REFUNDABLE: "That action is not allowed for this booking's current status.",
    NO_PAYMENT: "No matching payment was found to act on.",
    GATEWAY_UNAVAILABLE: "The payment gateway is not configured.",
    GATEWAY_ERROR: "The payment gateway refused the request — check its dashboard.",
    SEATS_UNAVAILABLE: "Not enough seats remain on this departure to re-activate the booking.",
    STALE: "The booking changed status just now — reload and try again.",
    INVALID_STATUS: "That is not a valid booking status.",
  },
  auditCreated: "Booking created",
  auditConfirmedBankTransfer: "Payment confirmed (bank transfer)",
  auditConfirmedCard: "Payment confirmed (card / Stripe)",
  auditConfirmedPaypal: "Payment confirmed (PayPal)",
  auditConfirmed: "Payment confirmed",
  auditFailed: "Payment failed",
  auditCancelled: "Booking cancelled — seats released",
  auditRefunded: "Booking refunded — seats released",
  auditStatusChanged: (from, to) => `Status changed manually: ${from} → ${to}`,
  auditStatusChangedPlain: "Status changed manually",
  systemActor: "System",
  tripHeading: "Trip",
  tripTour: "Tour",
  tripDeparture: "Departure",
  tripReturns: "Returns",
  tripTravelers: "Travelers",
  discount: "Discount",
  discountWithCode: (code) => ` (${code})`,
  tripTotal: "Total",
  customerHeading: "Customer",
  custName: "Name",
  custEmail: "Email",
  custPhone: "Phone",
  custAccount: "Account",
  guestCheckout: "Guest checkout",
  registeredUser: "Registered user",
  bookedFrom: "Booked from",
  bookedAt: "Booked",
  notes: "Notes:",
  paymentsHeading: "Payments",
  noPayments: "No payment attempts recorded.",
  payColMethod: "Method",
  payColStatus: "Status",
  payColAmount: "Amount",
  payColGatewayRef: "Gateway ref",
  payColWhen: "When",
  historyHeading: "History",
  noHistory: "No history recorded yet.",
  actionsHeading: "Actions",
  paymentReferenceLabel: "Payment reference (optional)",
  paymentReferencePlaceholder: "e.g. bank transfer confirmation code",
  markPaidConfirm:
    "Confirm you have received the bank transfer for this booking? The customer will be emailed a confirmation.",
  markPaidPending: "Confirming…",
  markPaid: "Mark as paid",
  cancelConfirm:
    "Cancel this booking and release its seats? This does NOT refund any money — use “Refund in full” for that. This cannot be undone.",
  cancelPending: "Cancelling…",
  cancelRelease: "Cancel & release",
  refundConfirm:
    "Refund this booking in full and release its seats? The refund is sent through the original payment method.",
  refundPending: "Refunding…",
  refundInFull: "Refund in full",
  setStatusHeading: "Set status manually",
  setStatusHelp:
    "Corrects the record and its seat count only. This does not refund or charge a card and does not email the customer — use the buttons above for those. Reactivating a cancelled/refunded booking re-claims seats and is refused if the departure is full.",
  statusLabel: "Status",
  applyStatusConfirm:
    "Change this booking's status? This only corrects the record and its seat count — no refund, charge, or email is sent.",
  applyStatusPending: "Saving…",
  applyStatus: "Apply status",
};
export const ordersAr: OrdersDict = {
  title: "الطلبات",
  subtitle: "كل حجز وحالة دفعه.",
  noneYet: "لا يوجد بعد.",
  totalShowing: (total, start, end) => `${total} إجمالًا — عرض ${start}–${end}.`,
  filterByStatus: "التصفية حسب الحالة",
  filterAll: "الكل",
  emptyState: "لا توجد حجوزات مطابقة. تظهر الطلبات هنا عندما يحجز العملاء.",
  awaitingPayment: "بانتظار الدفع",
  bankTransfer: "تحويل بنكي",
  noName: "(بدون اسم)",
  colCustomer: "العميل",
  colTour: "الجولة",
  colDeparture: "المغادرة",
  colSeats: "المقاعد",
  colTotal: "الإجمالي",
  colMethod: "طريقة الدفع",
  colStatus: "الحالة",
  colBooked: "تاريخ الحجز",
  colActions: "إجراءات",
  edit: "تعديل",
  viewExternal: "عرض ↖",
  paginationLabel: "ترقيم صفحات الطلبات",
  showingRange: (from, to, total) => `عرض ${from}–${to} من ${total}`,
  pageOf: (page, totalPages) => `صفحة ${page} من ${totalPages}`,
  prev: "→ السابق",
  next: "التالي ←",
  searchHiddenLabel: "البحث في الطلبات",
  searchPlaceholder: "ابحث بالمرجع أو البريد الإلكتروني…",
  searchAriaLabel: "البحث في الطلبات بالمرجع أو البريد الإلكتروني",
  searchButton: "بحث",
  backToOrders: "→ الطلبات",
  reference: "المرجع",
  downloadInvoice: "تنزيل الفاتورة (PDF)",
  actionFailed: "فشل الإجراء.",
  okMessages: {
    refunded: "تم استرداد قيمة الحجز وتحرير المقاعد.",
    cancelled: "تم إلغاء الحجز وتحرير المقاعد.",
    paid: "تم تسجيل الدفع — تأكّد الحجز وأُرسل بريد إلكتروني إلى العميل.",
    status: "تم تحديث حالة الحجز.",
  },
  errMessages: {
    NOT_FOUND: "لم يُعثر على الحجز.",
    NOT_REFUNDABLE: "هذا الإجراء غير مسموح به لحالة الحجز الحالية.",
    NO_PAYMENT: "لم يُعثر على دفعة مطابقة لتنفيذ الإجراء عليها.",
    GATEWAY_UNAVAILABLE: "بوابة الدفع غير مُهيّأة.",
    GATEWAY_ERROR: "رفضت بوابة الدفع الطلب — راجع لوحة تحكمها.",
    SEATS_UNAVAILABLE: "لا تتوفر مقاعد كافية في هذه المغادرة لإعادة تفعيل الحجز.",
    STALE: "تغيّرت حالة الحجز للتو — أعد التحميل وحاول مرة أخرى.",
    INVALID_STATUS: "هذه ليست حالة حجز صالحة.",
  },
  auditCreated: "تم إنشاء الحجز",
  auditConfirmedBankTransfer: "تم تأكيد الدفع (تحويل بنكي)",
  auditConfirmedCard: "تم تأكيد الدفع (بطاقة / Stripe)",
  auditConfirmedPaypal: "تم تأكيد الدفع (PayPal)",
  auditConfirmed: "تم تأكيد الدفع",
  auditFailed: "فشل الدفع",
  auditCancelled: "أُلغي الحجز — حُررت المقاعد",
  auditRefunded: "استُردّ الحجز — حُررت المقاعد",
  auditStatusChanged: (from, to) => `تغيّرت الحالة يدويًا: ${from} ← ${to}`,
  auditStatusChangedPlain: "تغيّرت الحالة يدويًا",
  systemActor: "النظام",
  tripHeading: "الرحلة",
  tripTour: "الجولة",
  tripDeparture: "المغادرة",
  tripReturns: "العودة",
  tripTravelers: "المسافرون",
  discount: "الخصم",
  discountWithCode: (code) => ` (${code})`,
  tripTotal: "الإجمالي",
  customerHeading: "العميل",
  custName: "الاسم",
  custEmail: "البريد الإلكتروني",
  custPhone: "الهاتف",
  custAccount: "الحساب",
  guestCheckout: "دفع كضيف",
  registeredUser: "مستخدم مسجَّل",
  bookedFrom: "الحجز من",
  bookedAt: "تاريخ الحجز",
  notes: "ملاحظات:",
  paymentsHeading: "المدفوعات",
  noPayments: "لا توجد محاولات دفع مُسجَّلة.",
  payColMethod: "الطريقة",
  payColStatus: "الحالة",
  payColAmount: "المبلغ",
  payColGatewayRef: "مرجع البوابة",
  payColWhen: "الوقت",
  historyHeading: "السجل",
  noHistory: "لا يوجد سجل مُسجَّل بعد.",
  actionsHeading: "الإجراءات",
  paymentReferenceLabel: "مرجع الدفع (اختياري)",
  paymentReferencePlaceholder: "مثال: رمز تأكيد التحويل البنكي",
  markPaidConfirm:
    "هل تؤكّد استلامك للتحويل البنكي لهذا الحجز؟ سيتلقّى العميل بريدًا إلكترونيًا بالتأكيد.",
  markPaidPending: "جارٍ التأكيد…",
  markPaid: "وضع علامة مدفوع",
  cancelConfirm:
    "إلغاء هذا الحجز وتحرير مقاعده؟ هذا لا يستردّ أي أموال — استخدم «استرداد كامل» لذلك. لا يمكن التراجع عن هذا.",
  cancelPending: "جارٍ الإلغاء…",
  cancelRelease: "إلغاء وتحرير",
  refundConfirm:
    "استرداد كامل قيمة هذا الحجز وتحرير مقاعده؟ يُرسَل الاسترداد عبر طريقة الدفع الأصلية.",
  refundPending: "جارٍ الاسترداد…",
  refundInFull: "استرداد كامل",
  setStatusHeading: "تعيين الحالة يدويًا",
  setStatusHelp:
    "يصحّح السجل وعدد مقاعده فقط. لا يستردّ الأموال أو يخصم من بطاقة ولا يرسل بريدًا إلى العميل — استخدم الأزرار أعلاه لذلك. إعادة تفعيل حجز مُلغى/مُسترَد يُعيد حجز المقاعد ويُرفض إذا كانت المغادرة ممتلئة.",
  statusLabel: "الحالة",
  applyStatusConfirm:
    "تغيير حالة هذا الحجز؟ هذا يصحّح السجل وعدد مقاعده فقط — دون أي استرداد أو خصم أو بريد إلكتروني.",
  applyStatusPending: "جارٍ الحفظ…",
  applyStatus: "تطبيق الحالة",
};
