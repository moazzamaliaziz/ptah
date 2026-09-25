/**
 * Trip ideas dictionary (Wave 5) — /admin/trip-ideas (list, create, edit,
 * status controls, curated-tour links, delete) plus the shared
 * TripIdeaFormFields island. Titles/slugs/summaries/intros are user data
 * (never translated); the PUBLISHED/DRAFT/ARCHIVED status is a fixed enum
 * translated via `statusLabels`. Server validation errors (`state.error`)
 * are surfaced verbatim.
 */

/** Shared editable-field labels (create form + editor). All strings. */
export interface TripIdeaFormFieldsDict {
  unsavedChanges: string;
  title: string;
  slug: string;
  summary: string;
  editorialIntro: string;
  heroImage: string;
  ogImage: string;
  metaTitle: string;
  sortOrder: string;
  metaDesc: string;
}

export interface TripIdeasDict {
  // list page
  title: string;
  subtitle: string;
  newTripIdea: string;
  viewOnlyNote: string;
  noTripIdeas: string;
  noTripIdeasCreateHint: string;
  colTitle: string;
  colCuratedTours: string;
  colStatus: string;
  statusLabels: Record<string, string>;
  // new page
  newTitle: string;
  newSubtitle: string;
  createDraft: string;
  // editor
  saved: string;
  // detail page
  backToList: string;
  viewLive: string;
  publish: string;
  unpublish: string;
  archive: string;
  /** meta note shown for non-published ideas, wrapping the /trip-ideas link. */
  statusNotePre: (statusWord: string) => string;
  statusNotePost: string;
  curatedHeading: string;
  curatedHint: string;
  noToursLinked: string;
  removeAria: (title: string) => string;
  addTour: string;
  choose: string;
  link: string;
  allLinked: string;
  deleteHeading: string;
  deleteHint: string;
  confirmDelete: (title: string) => string;
  fields: TripIdeaFormFieldsDict;
}
export const tripIdeasEn: TripIdeasDict = {
  title: "Trip ideas",
  subtitle:
    "Editorial collections shown at /trip-ideas. Each pairs an intro with hand-picked tours. Only published ideas appear on the public site.",
  newTripIdea: "New trip idea",
  viewOnlyNote: "Your role can view trip ideas but not change them.",
  noTripIdeas: "No trip ideas yet.",
  noTripIdeasCreateHint: " Create one to curate tours by theme.",
  colTitle: "Title",
  colCuratedTours: "Curated tours",
  colStatus: "Status",
  statusLabels: { PUBLISHED: "Published", DRAFT: "Draft", ARCHIVED: "Archived" },
  newTitle: "New trip idea",
  newSubtitle:
    "Create the editorial intro first. Once saved, you can curate which tours it links to. It starts as a draft.",
  createDraft: "Create trip idea (draft)",
  saved: "Saved.",
  backToList: "← All trip ideas",
  viewLive: "View live ↗",
  publish: "Publish",
  unpublish: "Unpublish (→ draft)",
  archive: "Archive",
  statusNotePre: (w) =>
    `This trip idea is ${w.toLowerCase()} — its content is saved but only appears on the public `,
  statusNotePost: " page once you publish it.",
  curatedHeading: "Curated tours",
  curatedHint:
    "Hand-picked tours shown under the editorial intro. Only published tours appear on the public page, even if linked here.",
  noToursLinked: "No tours linked yet.",
  removeAria: (title) => `Remove ${title}`,
  addTour: "Add tour",
  choose: "Choose…",
  link: "Link",
  allLinked: "All tours are already linked.",
  deleteHeading: "Delete trip idea",
  deleteHint:
    "Permanently removes this trip idea and its tour links. The tours themselves are not affected. This cannot be undone.",
  confirmDelete: (title) => `Delete "${title}" permanently? This cannot be undone.`,
  fields: {
    unsavedChanges: "Unsaved changes — remember to save before leaving this page.",
    title: "Title",
    slug: "Slug",
    summary: "Summary",
    editorialIntro: "Editorial introduction",
    heroImage: "Hero image",
    ogImage: "Social share image (OG)",
    metaTitle: "Meta title (SEO)",
    sortOrder: "Sort order",
    metaDesc: "Meta description (SEO)",
  },
};
export const tripIdeasAr: TripIdeasDict = {
  title: "أفكار الرحلات",
  subtitle:
    "مجموعات تحريرية معروضة في /trip-ideas. تقرن كل واحدة مقدمةً بجولات مختارة بعناية. لا تظهر على الموقع العام سوى الأفكار المنشورة.",
  newTripIdea: "فكرة رحلة جديدة",
  viewOnlyNote: "يمكن لدورك عرض أفكار الرحلات دون تعديلها.",
  noTripIdeas: "لا توجد أفكار رحلات بعد.",
  noTripIdeasCreateHint: " أنشئ واحدة لتنظيم الجولات حسب الموضوع.",
  colTitle: "العنوان",
  colCuratedTours: "الجولات المختارة",
  colStatus: "الحالة",
  statusLabels: { PUBLISHED: "منشورة", DRAFT: "مسودة", ARCHIVED: "مؤرشفة" },
  newTitle: "فكرة رحلة جديدة",
  newSubtitle:
    "أنشئ المقدمة التحريرية أولًا. بعد الحفظ يمكنك اختيار الجولات المرتبطة بها. تبدأ كمسودة.",
  createDraft: "إنشاء فكرة رحلة (مسودة)",
  saved: "تم الحفظ.",
  backToList: "→ كل أفكار الرحلات",
  viewLive: "المعاينة المباشرة ↗",
  publish: "نشر",
  unpublish: "إلغاء النشر (← مسودة)",
  archive: "أرشفة",
  statusNotePre: (w) =>
    `فكرة الرحلة هذه ${w} — يُحفظ محتواها لكن لا يظهر على صفحة `,
  statusNotePost: " العامة إلا بعد أن تنشرها.",
  curatedHeading: "الجولات المختارة",
  curatedHint:
    "جولات مختارة بعناية تظهر أسفل المقدمة التحريرية. لا تظهر على الصفحة العامة سوى الجولات المنشورة، حتى لو رُبطت هنا.",
  noToursLinked: "لا توجد جولات مرتبطة بعد.",
  removeAria: (title) => `إزالة ${title}`,
  addTour: "إضافة جولة",
  choose: "اختر…",
  link: "ربط",
  allLinked: "جميع الجولات مرتبطة بالفعل.",
  deleteHeading: "حذف فكرة الرحلة",
  deleteHint:
    "يزيل فكرة الرحلة هذه وروابط جولاتها نهائيًا. لا تتأثر الجولات نفسها. لا يمكن التراجع عن هذا الإجراء.",
  confirmDelete: (title) => `حذف "${title}" نهائيًا؟ لا يمكن التراجع عن هذا الإجراء.`,
  fields: {
    unsavedChanges: "تغييرات غير محفوظة — تذكّر الحفظ قبل مغادرة هذه الصفحة.",
    title: "العنوان",
    slug: "المُعرّف (Slug)",
    summary: "ملخّص",
    editorialIntro: "المقدمة التحريرية",
    heroImage: "صورة الغلاف",
    ogImage: "صورة المشاركة الاجتماعية (OG)",
    metaTitle: "عنوان ميتا (SEO)",
    sortOrder: "ترتيب العرض",
    metaDesc: "وصف ميتا (SEO)",
  },
};
