/**
 * Events & festivals dictionary (Wave 5) — /admin/events (list, create, edit,
 * status controls, delete) plus the shared EventFormFields island. Event
 * titles/slugs/descriptions are user data (never translated); the PUBLISHED/
 * DRAFT/ARCHIVED status is a fixed enum translated via `statusLabels`. Server
 * validation errors (`state.error`) are surfaced verbatim.
 */

/** Shared editable-field labels (create form + editor). All strings. */
export interface EventFormFieldsDict {
  unsavedChanges: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  recurring: string;
  heroImage: string;
  ogImage: string;
  metaTitle: string;
  sortOrder: string;
  metaDesc: string;
}

export interface EventsDict {
  title: string;
  subtitle: string;
  newEvent: string;
  newSubtitle: string;
  viewOnlyNote: string;
  noEvents: string;
  noEventsCreateHint: string;
  colTitle: string;
  colDates: string;
  colRecurring: string;
  colStatus: string;
  statusLabels: Record<string, string>;
  backToList: string;
  viewLive: string;
  publish: string;
  unpublish: string;
  archive: string;
  /** meta note shown for non-published events, wrapping the /events link. */
  statusNotePre: (statusWord: string) => string;
  statusNotePost: string;
  deleteHeading: string;
  deleteHint: string;
  confirmDelete: (title: string) => string;
  createDraft: string;
  saved: string;
  fields: EventFormFieldsDict;
}

export const eventsEn: EventsDict = {
  title: "Events & festivals",
  subtitle:
    "Cultural events and festivals shown at /events. Only published events appear on the public site.",
  newEvent: "New event",
  newSubtitle:
    "Create a cultural event or festival. It starts as a draft — publish it from the editor when ready.",
  viewOnlyNote: "Your role can view events but not change them.",
  noEvents: "No events yet.",
  noEventsCreateHint: " Create one to populate the Events page.",
  colTitle: "Title",
  colDates: "Dates",
  colRecurring: "Recurring",
  colStatus: "Status",
  statusLabels: { PUBLISHED: "Published", DRAFT: "Draft", ARCHIVED: "Archived" },
  backToList: "← All events",
  viewLive: "View live ↗",
  publish: "Publish",
  unpublish: "Unpublish (→ draft)",
  archive: "Archive",
  statusNotePre: (w) =>
    `This event is ${w.toLowerCase()} — its content is saved but only appears on the public `,
  statusNotePost: " page once you publish it.",
  deleteHeading: "Delete event",
  deleteHint: "Permanently removes this event. This cannot be undone.",
  confirmDelete: (title) => `Delete "${title}" permanently? This cannot be undone.`,
  createDraft: "Create event (draft)",
  saved: "Saved.",
  fields: {
    unsavedChanges: "Unsaved changes — remember to save before leaving this page.",
    title: "Title",
    slug: "Slug",
    summary: "Summary",
    description: "Description",
    location: "Location",
    startDate: "Start date",
    endDate: "End date (optional)",
    recurring: "Recurring annual festival (date repeats each year)",
    heroImage: "Hero image",
    ogImage: "Social share image (OG)",
    metaTitle: "Meta title (SEO)",
    sortOrder: "Sort order",
    metaDesc: "Meta description (SEO)",
  },
};

// __AR__
export const eventsAr: EventsDict = {
  title: "الفعاليات والمهرجانات",
  subtitle:
    "الفعاليات والمهرجانات الثقافية المعروضة في /events. لا تظهر على الموقع العام سوى الفعاليات المنشورة.",
  newEvent: "فعالية جديدة",
  newSubtitle:
    "أنشئ فعالية أو مهرجانًا ثقافيًا. تبدأ كمسودة — انشرها من المحرّر عندما تكون جاهزة.",
  viewOnlyNote: "يمكن لدورك عرض الفعاليات دون تعديلها.",
  noEvents: "لا توجد فعاليات بعد.",
  noEventsCreateHint: " أنشئ واحدة لملء صفحة الفعاليات.",
  colTitle: "العنوان",
  colDates: "التواريخ",
  colRecurring: "متكرّرة",
  colStatus: "الحالة",
  statusLabels: { PUBLISHED: "منشورة", DRAFT: "مسودة", ARCHIVED: "مؤرشفة" },
  backToList: "→ كل الفعاليات",
  viewLive: "المعاينة المباشرة ↗",
  publish: "نشر",
  unpublish: "إلغاء النشر (← مسودة)",
  archive: "أرشفة",
  statusNotePre: (w) =>
    `هذه الفعالية ${w} — يُحفظ محتواها لكن لا يظهر على صفحة `,
  statusNotePost: " العامة إلا بعد أن تنشرها.",
  deleteHeading: "حذف الفعالية",
  deleteHint: "يزيل هذه الفعالية نهائيًا. لا يمكن التراجع عن هذا الإجراء.",
  confirmDelete: (title) => `حذف "${title}" نهائيًا؟ لا يمكن التراجع عن هذا الإجراء.`,
  createDraft: "إنشاء فعالية (مسودة)",
  saved: "تم الحفظ.",
  fields: {
    unsavedChanges: "تغييرات غير محفوظة — تذكّر الحفظ قبل مغادرة هذه الصفحة.",
    title: "العنوان",
    slug: "المُعرّف (Slug)",
    summary: "ملخّص",
    description: "الوصف",
    location: "الموقع",
    startDate: "تاريخ البدء",
    endDate: "تاريخ الانتهاء (اختياري)",
    recurring: "مهرجان سنوي متكرّر (يتكرّر التاريخ كل عام)",
    heroImage: "صورة الغلاف",
    ogImage: "صورة المشاركة الاجتماعية (OG)",
    metaTitle: "عنوان ميتا (SEO)",
    sortOrder: "ترتيب العرض",
    metaDesc: "وصف ميتا (SEO)",
  },
};
