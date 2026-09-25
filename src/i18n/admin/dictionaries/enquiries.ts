/**
 * Enquiries dictionary (Wave 5) — the /admin/enquiries inbox (list + detail).
 * These screens read the public contact form's messages, whose status enum
 * (NEW / READ / ARCHIVED) is specific to this area, so its labels live here
 * rather than in the shared `status` slice (that one is booking statuses only).
 * Generic verbs (Delete, Deleting…) come from the shared `common` slice.
 */

/** Contact-message status → label. Keyed loosely (DB value is a plain string);
 *  callers fall back to the raw value if an unknown status ever appears. */
export type EnquiryStatusDict = Record<string, string>;

export interface EnquiriesDict {
  // List
  title: string;
  subtitle: string;
  newCount: (n: number) => string;
  noUnread: string;
  emptyState: string;
  colFrom: string;
  colSubject: string;
  colReceived: string;
  colStatus: string;
  noSubject: string;
  // Detail
  fallbackTitle: string; // heading when the message has no subject
  from: string; // "From" — precedes the sender name on the detail sub-line
  backToList: string;
  fieldName: string;
  fieldEmail: string;
  fieldPhone: string;
  fieldSubject: string;
  messageLabel: string;
  statusPrefix: string; // "Status:" before the current status
  archive: string;
  restoreToRead: string;
  deleteHeading: string;
  deleteHint: string;
  deleteConfirm: (name: string) => string;
  // Reply mailto subject
  replyPrefix: string; // "Re:" prepended to an existing subject
  replyFallback: string; // full subject when the enquiry had none
  statusLabel: EnquiryStatusDict;
}

export const enquiriesEn: EnquiriesDict = {
  title: "Enquiries",
  subtitle: "Messages from the public contact form.",
  newCount: (n) => `${n} new`,
  noUnread: "No unread messages.",
  emptyState: "No enquiries yet. Submissions from /contact will appear here.",
  colFrom: "From",
  colSubject: "Subject",
  colReceived: "Received",
  colStatus: "Status",
  noSubject: "(no subject)",
  fallbackTitle: "Enquiry",
  from: "From",
  backToList: "← All enquiries",
  fieldName: "Name",
  fieldEmail: "Email",
  fieldPhone: "Phone",
  fieldSubject: "Subject",
  messageLabel: "Message",
  statusPrefix: "Status:",
  archive: "Archive",
  restoreToRead: "Restore (→ read)",
  deleteHeading: "Delete enquiry",
  deleteHint: "Permanently removes this message and its contact details. This cannot be undone.",
  deleteConfirm: (name) => `Delete the enquiry from ${name}? This cannot be undone.`,
  replyPrefix: "Re:",
  replyFallback: "Re: your enquiry",
  statusLabel: { NEW: "New", READ: "Read", ARCHIVED: "Archived" },
};

export const enquiriesAr: EnquiriesDict = {
  title: "الاستفسارات",
  subtitle: "الرسائل الواردة من نموذج التواصل العام.",
  newCount: (n) => `${n} جديدة`,
  noUnread: "لا توجد رسائل غير مقروءة.",
  emptyState: "لا توجد استفسارات بعد. ستظهر هنا الرسائل المُرسلة من /contact.",
  colFrom: "من",
  colSubject: "الموضوع",
  colReceived: "وردت في",
  colStatus: "الحالة",
  noSubject: "(بدون موضوع)",
  fallbackTitle: "استفسار",
  from: "من",
  backToList: "→ كل الاستفسارات",
  fieldName: "الاسم",
  fieldEmail: "البريد الإلكتروني",
  fieldPhone: "الهاتف",
  fieldSubject: "الموضوع",
  messageLabel: "الرسالة",
  statusPrefix: "الحالة:",
  archive: "أرشفة",
  restoreToRead: "استعادة (→ مقروء)",
  deleteHeading: "حذف الاستفسار",
  deleteHint: "يحذف هذه الرسالة وبيانات التواصل الخاصة بها نهائيًا. لا يمكن التراجع عن ذلك.",
  deleteConfirm: (name) => `حذف الاستفسار الوارد من ${name}؟ لا يمكن التراجع عن ذلك.`,
  replyPrefix: "رد:",
  replyFallback: "رد: على استفسارك",
  statusLabel: { NEW: "جديد", READ: "مقروء", ARCHIVED: "مؤرشف" },
};
