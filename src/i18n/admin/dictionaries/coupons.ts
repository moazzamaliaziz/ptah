/**
 * Coupons dictionary (Wave 5) — /admin/coupons (list + shared create/edit form
 * + delete). Discount codes customers enter at checkout. Generic verbs (Edit,
 * View, Active/Inactive, Delete permanently) come from the shared `common`
 * slice; everything screen-specific lives here. The `form` slice is passed to
 * the shared CouponEditor island by both the New and Edit server pages.
 *
 * NOTE: server-side validation errors (createCoupon/updateCoupon `result.error`)
 * are surfaced verbatim from the server/schema layer and are intentionally NOT
 * routed through this dictionary — only UI-authored copy is translated here.
 */

/** The create/edit form island's labels (passed down as a serializable prop). */
export interface CouponFormDict {
  code: string;
  codeHint: string;
  discountType: string;
  typePercent: string;
  typeFixed: string;
  valuePercentLabel: string;
  valueFixedLabel: string;
  valuePercentHint: string;
  valueFixedHint: string;
  currency: string;
  currencyPercentHint: string;
  currencyFixedHint: string;
  minSpend: string;
  minSpendHint: string;
  maxUses: string;
  maxUsesHint: string;
  maxUsesPlaceholder: string;
  starts: string;
  ends: string;
  endsHint: string;
  activeLabel: string;
  saveCoupon: string;
  createCoupon: string;
  saved: string;
}

export interface CouponsDict {
  title: string;
  subtitle: string;
  newCoupon: string;
  colCode: string;
  colDiscount: string;
  colUses: string;
  colStatus: string;
  noCoupons: string;
  percentOff: (value: number) => string;
  fixedOff: (money: string, currency: string) => string;
  usedLine: (redemptions: number, maxRedemptions: number | null) => string;
  backToList: string;
  deleteHeading: string;
  deleteHint: string;
  newTitle: string;
  newSubtitle: string;
  form: CouponFormDict;
}

export const couponsEn: CouponsDict = {
  title: "Coupons",
  subtitle: "Discount codes customers can enter at checkout.",
  newCoupon: "+ New coupon",
  colCode: "Code",
  colDiscount: "Discount",
  colUses: "Uses",
  colStatus: "Status",
  noCoupons: "No coupons yet.",
  percentOff: (v) => `${v}% off`,
  fixedOff: (money, currency) => `${money} ${currency} off`.trim(),
  usedLine: (r, max) => `Used ${r}${max != null ? ` of ${max}` : ""}${r === 1 ? " time" : " times"}.`,
  backToList: "← All coupons",
  deleteHeading: "Delete coupon",
  deleteHint:
    "Removes this code so it can no longer be used at checkout. Bookings that already used it keep their discount — nothing already charged is changed. To stop a code without losing its history, untick “Active” above instead.",
  newTitle: "New coupon",
  newSubtitle: "Create a discount code customers can enter at checkout.",
  form: {
    code: "Code",
    codeHint: "Customers type this at checkout. Letters, digits and hyphens.",
    discountType: "Discount type",
    typePercent: "Percentage off",
    typeFixed: "Fixed amount off",
    valuePercentLabel: "Percentage off (1–100)",
    valueFixedLabel: "Amount off",
    valuePercentHint: "A whole number, e.g. 10 for 10% off.",
    valueFixedHint: "In the currency below, e.g. 25.00.",
    currency: "Currency",
    currencyPercentHint: "Optional — leave blank to apply in any currency.",
    currencyFixedHint: "Required for a fixed amount.",
    minSpend: "Minimum spend (optional)",
    minSpendHint: "Order must reach this before the code applies.",
    maxUses: "Max uses (optional)",
    maxUsesHint: "Total bookings that may use this code.",
    maxUsesPlaceholder: "Unlimited",
    starts: "Starts (optional)",
    ends: "Ends (optional)",
    endsHint: "Valid through the whole of this day.",
    activeLabel: "Active (customers can use this code)",
    saveCoupon: "Save coupon",
    createCoupon: "Create coupon",
    saved: "Saved.",
  },
};

export const couponsAr: CouponsDict = {
  title: "الكوبونات",
  subtitle: "أكواد الخصم التي يُدخلها العملاء عند الدفع.",
  newCoupon: "+ كوبون جديد",
  colCode: "الكود",
  colDiscount: "الخصم",
  colUses: "الاستخدامات",
  colStatus: "الحالة",
  noCoupons: "لا توجد كوبونات بعد.",
  percentOff: (v) => `خصم ${v}%`,
  fixedOff: (money, currency) => `خصم ${money} ${currency}`.trim(),
  usedLine: (r, max) => `استُخدم ${r}${max != null ? ` من ${max}` : ""} مرة.`,
  backToList: "→ كل الكوبونات",
  deleteHeading: "حذف الكوبون",
  deleteHint:
    "يزيل هذا الكود بحيث لا يعود قابلاً للاستخدام عند الدفع. تحتفظ الحجوزات التي استخدمته بالخصم — لا يتغيّر أي مبلغ سبق تحصيله. لإيقاف كود دون فقدان سجلّه، أزِل تحديد «مفعّل» أعلاه بدلاً من ذلك.",
  newTitle: "كوبون جديد",
  newSubtitle: "أنشئ كود خصم يمكن للعملاء إدخاله عند الدفع.",
  form: {
    code: "الكود",
    codeHint: "يكتبه العملاء عند الدفع. أحرف وأرقام وشُرَط.",
    discountType: "نوع الخصم",
    typePercent: "نسبة مئوية",
    typeFixed: "مبلغ ثابت",
    valuePercentLabel: "نسبة الخصم (1–100)",
    valueFixedLabel: "قيمة الخصم",
    valuePercentHint: "رقم صحيح، مثلاً 10 لخصم 10%.",
    valueFixedHint: "بالعملة أدناه، مثلاً 25.00.",
    currency: "العملة",
    currencyPercentHint: "اختياري — اتركه فارغًا للتطبيق بأي عملة.",
    currencyFixedHint: "مطلوب للمبلغ الثابت.",
    minSpend: "الحد الأدنى للإنفاق (اختياري)",
    minSpendHint: "يجب أن يبلغ الطلب هذا الحد قبل تطبيق الكود.",
    maxUses: "أقصى عدد استخدامات (اختياري)",
    maxUsesHint: "إجمالي الحجوزات التي يمكنها استخدام هذا الكود.",
    maxUsesPlaceholder: "غير محدود",
    starts: "يبدأ (اختياري)",
    ends: "ينتهي (اختياري)",
    endsHint: "صالح طوال هذا اليوم بالكامل.",
    activeLabel: "مفعّل (يمكن للعملاء استخدام هذا الكود)",
    saveCoupon: "حفظ الكوبون",
    createCoupon: "إنشاء كوبون",
    saved: "تم الحفظ.",
  },
};
