/**
 * Destinations dictionary (Wave 5) — /admin/destinations (list + create/edit
 * editor island + delete). Destination NAMES, slugs and regions are user data
 * and are never translated; only the surrounding chrome is. Counts use Western
 * numerals in both languages; server validation errors (`state.error`) are
 * surfaced verbatim.
 */

/** DestinationEditor island labels (all strings → serializable prop). */
export interface DestinationFormDict {
  name: string;
  slug: string;
  region: string;
  description: string;
  heroImage: string;
  ogImage: string;
  metaTitle: string;
  metaDesc: string;
  saved: string;
  saveDestination: string;
  createDestination: string;
}

export interface DestinationsDict {
  title: string;
  subtitle: string;
  newDestination: string;
  colName: string;
  colRegion: string;
  colTours: string;
  noDestinations: string;
  /** edit-page meta line: "N linked tour(s)" (rendered after "/slug · "). */
  linkedTours: (n: number) => string;
  backToList: string;
  deleteHeading: string;
  deleteHint: string;
  /** trailing sentence appended to the delete hint when tours are linked. */
  currentlyLinked: (n: number) => string;
  newTitle: string;
  newSubtitle: string;
  form: DestinationFormDict;
}

export const destinationsEn: DestinationsDict = {
  title: "Destinations",
  subtitle: "Cities and regions tours are grouped under.",
  newDestination: "+ New destination",
  colName: "Name",
  colRegion: "Region",
  colTours: "Tours",
  noDestinations: "No destinations yet.",
  linkedTours: (n) => `${n} linked ${n === 1 ? "tour" : "tours"}`,
  backToList: "← All destinations",
  deleteHeading: "Delete destination",
  deleteHint:
    "Removes this destination and unlinks it from any tours. The tours themselves are not deleted.",
  currentlyLinked: (n) => ` Currently linked to ${n} ${n === 1 ? "tour" : "tours"}.`,
  newTitle: "New destination",
  newSubtitle: "Create a city or region. Link tours to it from each tour’s editor.",
  form: {
    name: "Name",
    slug: "Slug",
    region: "Region (optional)",
    description: "Description (optional)",
    heroImage: "Hero image",
    ogImage: "Social share image (OG)",
    metaTitle: "Meta title (SEO)",
    metaDesc: "Meta description (SEO)",
    saved: "Saved.",
    saveDestination: "Save destination",
    createDestination: "Create destination",
  },
};

export const destinationsAr: DestinationsDict = {
  title: "الوجهات",
  subtitle: "المدن والمناطق التي تُصنَّف الجولات تحتها.",
  newDestination: "+ وجهة جديدة",
  colName: "الاسم",
  colRegion: "المنطقة",
  colTours: "الجولات",
  noDestinations: "لا توجد وجهات بعد.",
  linkedTours: (n) => `${n} جولة مرتبطة`,
  backToList: "→ كل الوجهات",
  deleteHeading: "حذف الوجهة",
  deleteHint:
    "يزيل هذه الوجهة ويفصلها عن أي جولات. أما الجولات نفسها فلا تُحذف.",
  currentlyLinked: (n) => ` مرتبطة حاليًا بـ ${n} جولة.`,
  newTitle: "وجهة جديدة",
  newSubtitle: "أنشئ مدينة أو منطقة. اربط الجولات بها من محرِّر كل جولة.",
  form: {
    name: "الاسم",
    slug: "المُعرِّف (Slug)",
    region: "المنطقة (اختياري)",
    description: "الوصف (اختياري)",
    heroImage: "صورة الغلاف",
    ogImage: "صورة المشاركة الاجتماعية (OG)",
    metaTitle: "عنوان ميتا (SEO)",
    metaDesc: "وصف ميتا (SEO)",
    saved: "تم الحفظ.",
    saveDestination: "حفظ الوجهة",
    createDestination: "إنشاء الوجهة",
  },
};
