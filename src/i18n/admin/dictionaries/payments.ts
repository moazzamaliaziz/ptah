/**
 * Payments dictionary — /admin/payments (the bank account customers transfer
 * to). Server component plus one client editor, so every string here is a plain
 * serializable value.
 *
 * NOT localized: "IBAN" and "BIC / SWIFT" are international standards and read
 * the same in every market we serve. Server VALIDATION errors from actions.ts
 * stay verbatim, as elsewhere in the admin.
 */

export interface PaymentsEditorDict {
  bankLegend: string;
  bankNoteHint: string;
  accountName: string;
  iban: string;
  accountNumber: string;
  bic: string;
  currency: string;
  note: string;
  noteHint: string;
  /** Live IBAN checksum feedback — a warning, never a block. */
  ibanValid: string;
  ibanInvalid: string;
  save: string;
  saving: string;
  saved: string;
}

export interface PaymentsDict {
  title: string;
  subtitle: string;
  viewOnlyNote: string;
  editor: PaymentsEditorDict;
}

export const paymentsEn: PaymentsDict = {
  title: "Payments",
  subtitle: "The bank account customers see when they choose to pay by transfer.",
  viewOnlyNote: "You have view-only access to payment settings.",
  editor: {
    bankLegend: "Bank transfer account",
    bankNoteHint:
      "Shown on the booking confirmation page when a customer pays by transfer, with a copy button on each field. Leave the account name and IBAN both empty to hide the account and tell customers you'll email the details instead.",
    accountName: "Account name",
    iban: "IBAN",
    accountNumber: "Account number",
    bic: "BIC / SWIFT",
    currency: "Account currency",
    note: "Note (optional)",
    noteHint:
      "Shown under the account — use it for anything situational like a correspondent bank or branch, not for the numbers above.",
    ibanValid: "Checksum valid:",
    ibanInvalid:
      "This IBAN fails its checksum — it is very likely mistyped. You can still save it, but please double-check it against your bank statement first.",
    save: "Save payment settings",
    saving: "Saving…",
    saved: "Payment settings saved.",
  },
};

export const paymentsAr: PaymentsDict = {
  title: "المدفوعات",
  subtitle: "الحساب البنكي الذي يراه العملاء عند اختيارهم الدفع بالتحويل.",
  viewOnlyNote: "لديك صلاحية الاطلاع فقط على إعدادات المدفوعات.",
  editor: {
    bankLegend: "حساب التحويل البنكي",
    bankNoteHint:
      "يظهر في صفحة تأكيد الحجز عندما يدفع العميل بالتحويل، مع زر نسخ لكل حقل. اترك اسم الحساب والآيبان فارغين معًا لإخفاء الحساب وإبلاغ العملاء بأنك سترسل التفاصيل بالبريد الإلكتروني.",
    accountName: "اسم الحساب",
    iban: "الآيبان (IBAN)",
    accountNumber: "رقم الحساب",
    bic: "السويفت / BIC",
    currency: "عملة الحساب",
    note: "ملاحظة (اختياري)",
    noteHint:
      "تظهر أسفل الحساب — استخدمها لأي تفاصيل إضافية مثل البنك المراسل أو الفرع، وليس للأرقام أعلاه.",
    ibanValid: "رقم التحقق صحيح:",
    ibanInvalid:
      "هذا الآيبان لا يجتاز رقم التحقق — الأرجح أنه مكتوب بشكل خاطئ. يمكنك حفظه على أي حال، لكن يُرجى مراجعته مع كشف حسابك البنكي أولًا.",
    save: "حفظ إعدادات المدفوعات",
    saving: "جارٍ الحفظ…",
    saved: "تم حفظ إعدادات المدفوعات.",
  },
};
