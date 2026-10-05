/**
 * Tours dictionary (Wave 5) — /admin/tours (list, create, edit) plus the shared
 * client islands: TourFormFields, FaqEditor, ItinerarySection, DeparturesSection.
 * Tour titles/slugs/descriptions are user data (never translated). Fixed enums
 * (tour status, departure status, difficulty, style tags) are translated via the
 * *Labels maps here; their stored VALUES stay the English enum. Server validation
 * errors (`state.error`) are surfaced verbatim. Interpolated notes are functions
 * called on the SERVER (edit page); islands receive strings only, so the currency
 * hint carries a `{currency}` token the island substitutes at render.
 */

/** FaqEditor island (shared inside TourFormFields). All strings. */
export interface FaqEditorDict {
  faqsLabel: string;
  incompleteWarn: string;
  questionWord: string;
  remove: string;
  questionPlaceholder: string;
  answerPlaceholder: string;
  addFaq: string;
}

/** Itinerary section island. All strings. */
export interface ItinerarySectionDict {
  heading: string;
  hint: string;
  addHeading: string;
  day: string;
  title: string;
  description: string;
  addBtn: string;
  adding: string;
  dayWord: string;
  edit: string;
  close: string;
  saveDay: string;
  saving: string;
  deleteDay: string;
  saved: string;
}
/** Departures section island. All strings; `hint` carries a `{currency}` token. */
export interface DeparturesSectionDict {
  heading: string;
  hint: string;
  addHeading: string;
  startDate: string;
  endDate: string;
  capacity: string;
  priceOverride: string;
  priceOverridePlaceholder: string;
  status: string;
  addBtn: string;
  adding: string;
  bookedSuffix: string;
  edit: string;
  close: string;
  saveDeparture: string;
  saving: string;
  deleteDeparture: string;
  hasBookingsNote: string;
  saved: string;
  statusLabels: Record<string, string>;
}

/** Shared TourFormFields island (create + edit). All strings. */
export interface TourFormFieldsDict {
  unsavedChanges: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  durationDays: string;
  basePrice: string;
  /** Read-only currency note; carries a {currency} token. */
  currencyNote: string;
  difficulty: string;
  pricingLegend: string;
  childPrice: string;
  infantPrice: string;
  childPlaceholder: string;
  infantPlaceholder: string;
  pricingNote: string;
  bookingClosedLabel: string;
  /** Group-size price bands (P8). */
  tiersLegend: string;
  tiersNote: string;
  tiersMinPax: string;
  tiersMaxPax: string;
  tiersPrice: string;
  tiersMaxPaxPlaceholder: string;
  tiersAdd: string;
  tiersRemove: string;
  tiersEmpty: string;
  /** Customer-chosen travel dates (P8). */
  datesLegend: string;
  datesNote: string;
  onRequestDatesLabel: string;
  requestLeadDays: string;
  requestWindowDays: string;
  requestCapacity: string;
  blackoutDatesLabel: string;
  blackoutDatesPlaceholder: string;
  tagsLegend: string;
  heroImage: string;
  ogImage: string;
  galleryLabel: string;
  galleryPlaceholder: string;
  inclusionsLabel: string;
  exclusionsLabel: string;
  travelNotesLabel: string;
  ctaLegend: string;
  ctaLabelField: string;
  ctaHrefField: string;
  ctaLabelPlaceholder: string;
  ctaHrefPlaceholder: string;
  metaTitle: string;
  metaDesc: string;
  difficultyLabels: Record<string, string>;
  tagLabels: Record<string, string>;
}
export interface ToursDict {
  // List
  title: string;
  subtitle: string;
  newTour: string;
  colTitle: string;
  colStatus: string;
  colFrom: string;
  colDays: string;
  colDepartures: string;
  colDestinations: string;
  colEdit: string;
  noTours: string;
  statusLabels: Record<string, string>;
  // New page
  newTitle: string;
  newSubtitle: string;
  // Edit page chrome
  backToList: string;
  viewLive: string;
  publish: string;
  unpublish: string;
  archive: string;
  statusNote: (statusWord: string) => string;
  destinationsHeading: string;
  destinationsHint: string;
  noneLinkedYet: string;
  removeAria: (name: string) => string;
  addDestination: string;
  choose: string;
  link: string;
  deleteHeading: string;
  deleteHint: string;
  confirmDelete: (title: string) => string;
  // Create form (NewTourForm)
  createDraft: string;
  createDraftHint: string;
  // Editor (TourEditor)
  saveTour: string;
  saved: string;
  // Nested islands
  itinerary: ItinerarySectionDict;
  departures: DeparturesSectionDict;
  fields: TourFormFieldsDict;
  faq: FaqEditorDict;
}
export const toursEn: ToursDict = {
  title: "Tours",
  subtitle: "Every tour, all statuses. Only published tours appear on the public site.",
  newTour: "+ New tour",
  colTitle: "Title",
  colStatus: "Status",
  colFrom: "From",
  colDays: "Days",
  colDepartures: "Departures",
  colDestinations: "Destinations",
  colEdit: "Edit",
  noTours: "No tours yet.",
  statusLabels: { PUBLISHED: "Published", DRAFT: "Draft", ARCHIVED: "Archived" },
  newTitle: "New tour",
  newSubtitle: "Start with the essentials. You'll add itinerary, departures and images next.",
  backToList: "← All tours",
  viewLive: "View live ↗",
  publish: "Publish",
  unpublish: "Unpublish (→ draft)",
  archive: "Archive",
  statusNote: (w) =>
    `This tour is ${w.toLowerCase()} — its content (including FAQs, itinerary and departures) is saved but only appears on the public site once you publish it.`,
  destinationsHeading: "Destinations",
  destinationsHint: "Which cities/regions this tour belongs to (controls where it appears).",
  noneLinkedYet: "None linked yet.",
  removeAria: (name) => `Remove ${name}`,
  addDestination: "Add destination",
  choose: "Choose…",
  link: "Link",
  deleteHeading: "Delete tour",
  deleteHint:
    "Permanently removes this tour, its itinerary, departures, and destination links. A tour with bookings can't be deleted — archive it instead.",
  confirmDelete: (title) => `Delete "${title}" permanently? This cannot be undone.`,
  createDraft: "Create draft & continue",
  createDraftHint: "Created as a draft — add itinerary & departures, then publish from the editor.",
  saveTour: "Save tour",
  saved: "Saved.",
  itinerary: {
    heading: "Itinerary",
    hint: "Day-by-day plan shown on the tour page.",
    addHeading: "Add a day",
    day: "Day",
    title: "Title",
    description: "Description",
    addBtn: "Add day",
    adding: "Adding…",
    dayWord: "Day",
    edit: "Edit",
    close: "Close",
    saveDay: "Save day",
    saving: "Saving…",
    deleteDay: "Delete day",
    saved: "Saved.",
  },
  departures: {
    heading: "Departures",
    hint: "Dates customers can book. Only OPEN, future departures show publicly. Price override is optional (blank inherits the base price). Currency: {currency}.",
    addHeading: "Add a departure",
    startDate: "Start date",
    endDate: "End date",
    capacity: "Capacity",
    priceOverride: "Price override",
    priceOverridePlaceholder: "(base)",
    status: "Status",
    addBtn: "Add departure",
    adding: "Adding…",
    bookedSuffix: "booked",
    edit: "Edit",
    close: "Close",
    saveDeparture: "Save departure",
    saving: "Saving…",
    deleteDeparture: "Delete departure",
    hasBookingsNote: "Has bookings — set to CANCELED instead of deleting.",
    saved: "Saved.",
    statusLabels: { OPEN: "Open", CLOSED: "Closed", CANCELED: "Canceled" },
  },
  fields: {
    unsavedChanges: "Unsaved changes — remember to save before leaving this page.",
    title: "Title",
    slug: "Slug",
    summary: "Summary",
    description: "Description",
    durationDays: "Duration (days)",
    basePrice: "Base price",
    currencyNote: "All prices are in {currency}.",
    difficulty: "Difficulty",
    pricingLegend: "Passenger pricing & availability",
    childPrice: "Child price (optional)",
    infantPrice: "Infant price (optional)",
    childPlaceholder: "e.g. 899.00",
    infantPlaceholder: "0.00 for free",
    pricingNote:
      "Leave a price blank to hide that traveler type from the booking form. Enter 0.00 to offer it free (e.g. infants). The base price above is the adult price.",
    bookingClosedLabel:
      "Pause online booking for this tour (shows a “booking paused” notice; existing bookings are unaffected)",
    tiersLegend: "Price per person by group size",
    tiersNote:
      "The band matching the total party size (adults + children + infants) sets the per-person adult price. Bands must not overlap; leave the largest size blank for an open-ended top band (“7+”). A party size no band covers pays the base price. A departure's own price override wins over these.",
    tiersMinPax: "From (travelers)",
    tiersMaxPax: "To (travelers)",
    tiersPrice: "Price per person",
    tiersMaxPaxPlaceholder: "blank = and above",
    tiersAdd: "Add a band",
    tiersRemove: "Remove",
    tiersEmpty: "No bands yet — the base price applies to every party size.",
    datesLegend: "Travel dates",
    datesNote:
      "With dates on request, customers pick their own day on a calendar and the departure for that day is created when the first booking comes in. Turn it off to sell only the scheduled departures below.",
    onRequestDatesLabel: "Let customers choose their own travel date",
    requestLeadDays: "Notice required (days)",
    requestWindowDays: "Bookable window (days ahead)",
    requestCapacity: "Seats per requested date",
    blackoutDatesLabel: "Blackout dates (one YYYY-MM-DD per line)",
    blackoutDatesPlaceholder: "2026-12-25",
    tagsLegend: "Style & special tags (drive the Tours menu filters)",
    heroImage: "Hero image",
    ogImage: "Social share image (OG)",
    galleryLabel: "Gallery image paths (one per line)",
    galleryPlaceholder: "/assets/… or https://…",
    inclusionsLabel: "What's included (one per line)",
    exclusionsLabel: "Not included (one per line)",
    travelNotesLabel: "Good to know / travel notes (one per line)",
    ctaLegend: "Custom call-to-action (optional — set both or neither)",
    ctaLabelField: "CTA label",
    ctaHrefField: "CTA link",
    ctaLabelPlaceholder: "e.g. Download itinerary",
    ctaHrefPlaceholder: "/contact or https://…",
    metaTitle: "Meta title (SEO)",
    metaDesc: "Meta description (SEO)",
    difficultyLabels: { EASY: "Easy", MODERATE: "Moderate", CHALLENGING: "Challenging" },
    tagLabels: {
      classic: "Classic Egypt",
      "nile-cruise": "Nile Cruise",
      "red-sea": "Red Sea & Beach",
      desert: "Desert Adventure",
      private: "Private & Tailor-Made",
      family: "Family Trip",
      honeymoon: "Honeymoon",
    },
  },
  faq: {
    faqsLabel: "FAQs",
    incompleteWarn:
      "A FAQ with only a question or only an answer won't be saved — fill in both, or remove the row.",
    questionWord: "Question",
    remove: "Remove",
    questionPlaceholder: "Question",
    answerPlaceholder: "Answer",
    addFaq: "+ Add FAQ",
  },
};
export const toursAr: ToursDict = {
  title: "الجولات",
  subtitle: "كل الجولات بجميع الحالات. لا تظهر على الموقع العام سوى الجولات المنشورة.",
  newTour: "+ جولة جديدة",
  colTitle: "العنوان",
  colStatus: "الحالة",
  colFrom: "ابتداءً من",
  colDays: "الأيام",
  colDepartures: "المغادرات",
  colDestinations: "الوجهات",
  colEdit: "تحرير",
  noTours: "لا توجد جولات بعد.",
  statusLabels: { PUBLISHED: "منشورة", DRAFT: "مسودة", ARCHIVED: "مؤرشفة" },
  newTitle: "جولة جديدة",
  newSubtitle: "ابدأ بالأساسيات. ستضيف البرنامج والمغادرات والصور لاحقًا.",
  backToList: "→ كل الجولات",
  viewLive: "المعاينة المباشرة ↗",
  publish: "نشر",
  unpublish: "إلغاء النشر (← مسودة)",
  archive: "أرشفة",
  statusNote: (w) =>
    `هذه الجولة ${w} — يُحفظ محتواها (بما في ذلك الأسئلة الشائعة والبرنامج والمغادرات) لكنه لا يظهر على الموقع العام إلا بعد أن تنشرها.`,
  destinationsHeading: "الوجهات",
  destinationsHint: "المدن/المناطق التي تنتمي إليها هذه الجولة (تتحكّم في مكان ظهورها).",
  noneLinkedYet: "لا توجد وجهات مرتبطة بعد.",
  removeAria: (name) => `إزالة ${name}`,
  addDestination: "إضافة وجهة",
  choose: "اختر…",
  link: "ربط",
  deleteHeading: "حذف الجولة",
  deleteHint:
    "يزيل هذه الجولة نهائيًا مع برنامجها ومغادراتها وروابط وجهاتها. لا يمكن حذف جولة عليها حجوزات — أرشفها بدلًا من ذلك.",
  confirmDelete: (title) => `حذف "${title}" نهائيًا؟ لا يمكن التراجع عن هذا الإجراء.`,
  createDraft: "إنشاء مسودة والمتابعة",
  createDraftHint: "تُنشأ كمسودة — أضف البرنامج والمغادرات ثم انشرها من المحرّر.",
  saveTour: "حفظ الجولة",
  saved: "تم الحفظ.",
  itinerary: {
    heading: "البرنامج",
    hint: "خطة يومًا بيوم تظهر في صفحة الجولة.",
    addHeading: "إضافة يوم",
    day: "اليوم",
    title: "العنوان",
    description: "الوصف",
    addBtn: "إضافة يوم",
    adding: "جارٍ الإضافة…",
    dayWord: "اليوم",
    edit: "تحرير",
    close: "إغلاق",
    saveDay: "حفظ اليوم",
    saving: "جارٍ الحفظ…",
    deleteDay: "حذف اليوم",
    saved: "تم الحفظ.",
  },
  departures: {
    heading: "المغادرات",
    hint: "التواريخ التي يمكن للعملاء الحجز فيها. تظهر علنًا فقط المغادرات المفتوحة والمستقبلية. تجاوز السعر اختياري (يرث السعر الأساسي عند تركه فارغًا). العملة: {currency}.",
    addHeading: "إضافة مغادرة",
    startDate: "تاريخ البدء",
    endDate: "تاريخ الانتهاء",
    capacity: "السعة",
    priceOverride: "تجاوز السعر",
    priceOverridePlaceholder: "(الأساسي)",
    status: "الحالة",
    addBtn: "إضافة مغادرة",
    adding: "جارٍ الإضافة…",
    bookedSuffix: "محجوز",
    edit: "تحرير",
    close: "إغلاق",
    saveDeparture: "حفظ المغادرة",
    saving: "جارٍ الحفظ…",
    deleteDeparture: "حذف المغادرة",
    hasBookingsNote: "عليها حجوزات — اضبطها على CANCELED بدلًا من الحذف.",
    saved: "تم الحفظ.",
    statusLabels: { OPEN: "مفتوحة", CLOSED: "مغلقة", CANCELED: "ملغاة" },
  },
  fields: {
    unsavedChanges: "تغييرات غير محفوظة — تذكّر الحفظ قبل مغادرة هذه الصفحة.",
    title: "العنوان",
    slug: "المُعرّف (Slug)",
    summary: "ملخّص",
    description: "الوصف",
    durationDays: "المدة (أيام)",
    basePrice: "السعر الأساسي",
    currencyNote: "جميع الأسعار بعملة {currency}.",
    difficulty: "مستوى الصعوبة",
    pricingLegend: "تسعير المسافرين والإتاحة",
    childPrice: "سعر الطفل (اختياري)",
    infantPrice: "سعر الرضيع (اختياري)",
    childPlaceholder: "مثال: 899.00",
    infantPlaceholder: "0.00 للمجاني",
    pricingNote:
      "اترك السعر فارغًا لإخفاء هذا النوع من المسافرين من نموذج الحجز. أدخل 0.00 لتقديمه مجانًا (مثل الرضّع). السعر الأساسي أعلاه هو سعر البالغ.",
    bookingClosedLabel:
      "إيقاف الحجز الإلكتروني مؤقتًا لهذه الجولة (يعرض إشعار «الحجز متوقف»؛ الحجوزات القائمة لا تتأثر)",
    tiersLegend: "السعر للفرد حسب حجم المجموعة",
    tiersNote:
      "النطاق المطابق لإجمالي عدد المسافرين (بالغون + أطفال + رضّع) يحدّد سعر البالغ للفرد. يجب ألّا تتداخل النطاقات؛ اترك الحد الأعلى فارغًا لنطاق مفتوح من الأعلى («7+»). أي حجم مجموعة لا يغطّيه نطاق يدفع السعر الأساسي. تجاوز سعر المغادرة له الأولوية على هذه النطاقات.",
    tiersMinPax: "من (مسافرين)",
    tiersMaxPax: "إلى (مسافرين)",
    tiersPrice: "السعر للفرد",
    tiersMaxPaxPlaceholder: "فارغ = وما فوق",
    tiersAdd: "إضافة نطاق",
    tiersRemove: "إزالة",
    tiersEmpty: "لا نطاقات بعد — يُطبّق السعر الأساسي على كل أحجام المجموعات.",
    datesLegend: "تواريخ السفر",
    datesNote:
      "مع التواريخ حسب الطلب، يختار العملاء يومهم من التقويم وتُنشأ المغادرة لذلك اليوم عند وصول أول حجز. أوقفه لبيع المغادرات المجدولة أدناه فقط.",
    onRequestDatesLabel: "السماح للعملاء باختيار تاريخ سفرهم",
    requestLeadDays: "مدة الإشعار المطلوبة (أيام)",
    requestWindowDays: "نافذة الحجز (أيام مقدمًا)",
    requestCapacity: "المقاعد لكل تاريخ مطلوب",
    blackoutDatesLabel: "التواريخ المستبعدة (تاريخ YYYY-MM-DD في كل سطر)",
    blackoutDatesPlaceholder: "2026-12-25",
    tagsLegend: "الأنماط والوسوم الخاصة (تُشغّل مرشّحات قائمة الجولات)",
    heroImage: "صورة الغلاف",
    ogImage: "صورة المشاركة الاجتماعية (OG)",
    galleryLabel: "مسارات صور المعرض (سطر لكل صورة)",
    galleryPlaceholder: "/assets/… أو https://…",
    inclusionsLabel: "ما يشمله السعر (سطر لكل عنصر)",
    exclusionsLabel: "غير مشمول (سطر لكل عنصر)",
    travelNotesLabel: "معلومات مفيدة / ملاحظات السفر (سطر لكل عنصر)",
    ctaLegend: "زر إجراء مخصّص (اختياري — اضبط الاثنين معًا أو لا شيء)",
    ctaLabelField: "نص الزر",
    ctaHrefField: "رابط الزر",
    ctaLabelPlaceholder: "مثال: تنزيل البرنامج",
    ctaHrefPlaceholder: "/contact أو https://…",
    metaTitle: "عنوان ميتا (SEO)",
    metaDesc: "وصف ميتا (SEO)",
    difficultyLabels: { EASY: "سهل", MODERATE: "متوسط", CHALLENGING: "صعب" },
    tagLabels: {
      classic: "مصر الكلاسيكية",
      "nile-cruise": "رحلة نيلية",
      "red-sea": "البحر الأحمر والشاطئ",
      desert: "مغامرة صحراوية",
      private: "خاصة ومصمّمة حسب الطلب",
      family: "رحلة عائلية",
      honeymoon: "شهر العسل",
    },
  },
  faq: {
    faqsLabel: "الأسئلة الشائعة",
    incompleteWarn:
      "لن يُحفظ سؤال شائع يحتوي على سؤال فقط أو إجابة فقط — املأ الحقلين أو احذف الصف.",
    questionWord: "سؤال",
    remove: "إزالة",
    questionPlaceholder: "السؤال",
    answerPlaceholder: "الإجابة",
    addFaq: "+ إضافة سؤال",
  },
};
