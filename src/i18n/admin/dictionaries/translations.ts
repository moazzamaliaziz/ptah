/**
 * Translations workspace dictionary (Wave 5) — /admin/translations (landing
 * grid, per-model record list, and the per-record TranslationEditor island).
 *
 * Scope note: the CONTENT-TYPE and FIELD labels come from the shared
 * `@/content/translatable-fields` registry (model `label`/`singular`, field
 * `label`) and are shown verbatim — they are technical registry identifiers, so
 * they stay English in both languages (same treatment as widget type/position
 * enums). Public LANGUAGE names come from `@/i18n/config` `localeNames` and are
 * proper nouns, also shown verbatim. Server VALIDATION errors (`state.error`)
 * are surfaced verbatim. Everything else — the surrounding chrome — is
 * localized here. `intro`, `backToRecords` and `translatingInto` are invoked in
 * SERVER components, so functions are fine; the island receives strings only.
 */

/** Per-record editor island labels (TranslationEditor). All strings. */
export interface TranslationEditorDict {
  savedNote: string;
  unsavedChanges: string;
  helpList: string;
  helpFaq: string;
  englishLabel: string;
  emptyPlaceholder: string;
  saving: string;
  /** Wraps the (proper-noun) language name: `${pre}${lang}${post}`. */
  saveTranslationPre: string;
  saveTranslationPost: string;
}

export interface TranslationsDict {
  // landing grid
  title: string;
  intro: (langs: string) => string;
  colContentType: string;
  colRecords: string;
  colTranslatedFields: string;
  open: string;
  // per-model record list
  pickHint: string;
  backToTypes: string;
  nothingToTranslate: string;
  colLanguagesDone: string;
  noneYet: string;
  translate: string;
  // per-record editor page
  backToRecords: (label: string) => string;
  translatingInto: (lang: string) => string;
  emptyHint: string;
  // editor island
  editor: TranslationEditorDict;
}

export const translationsEn: TranslationsDict = {
  title: "Translations",
  intro: (langs) =>
    `English is the source — you write it on each Tour, Event, etc. Here you add the ${langs} versions. Anything you leave blank simply shows the English text on the public site.`,
  colContentType: "Content type",
  colRecords: "Records",
  colTranslatedFields: "Translated fields",
  open: "Open →",
  pickHint: "Pick a record to translate. The chips show which languages already have text.",
  backToTypes: "← All content types",
  nothingToTranslate: "Nothing to translate here yet.",
  colLanguagesDone: "Languages done",
  noneYet: "None yet",
  translate: "Translate →",
  backToRecords: (label) => `← All ${label}`,
  translatingInto: (lang) => ` — translating into ${lang}`,
  emptyHint:
    "Leave a box empty to use the English text on the public site. The grey text under each box is the English source, for reference.",
  editor: {
    savedNote: "Saved.",
    unsavedChanges: "Unsaved changes — save before leaving this page.",
    helpList: "One item per line.",
    helpFaq: "One per line, written as  question :: answer",
    englishLabel: "English:",
    emptyPlaceholder: "(empty)",
    saving: "Saving…",
    saveTranslationPre: "Save ",
    saveTranslationPost: " translation",
  },
};

export const translationsAr: TranslationsDict = {
  title: "الترجمات",
  intro: (langs) =>
    `الإنجليزية هي المصدر — تكتبها في كل جولة وفعالية وغيرها. هنا تضيف النسخ بلغات ${langs}. أي حقل تتركه فارغًا سيعرض النص الإنجليزي على الموقع العام.`,
  colContentType: "نوع المحتوى",
  colRecords: "السجلات",
  colTranslatedFields: "الحقول المترجمة",
  open: "فتح ←",
  pickHint: "اختر سجلًّا لترجمته. تُظهر العلامات اللغات التي تحتوي على نص بالفعل.",
  backToTypes: "→ كل أنواع المحتوى",
  nothingToTranslate: "لا يوجد ما يُترجَم هنا بعد.",
  colLanguagesDone: "اللغات المكتملة",
  noneYet: "لا شيء بعد",
  translate: "ترجمة ←",
  backToRecords: (label) => `→ كل ${label}`,
  translatingInto: (lang) => ` — الترجمة إلى ${lang}`,
  emptyHint:
    "اترك أي مربع فارغًا لاستخدام النص الإنجليزي على الموقع العام. النص الرمادي أسفل كل مربع هو المصدر الإنجليزي، للاستئناس.",
  editor: {
    savedNote: "تم الحفظ.",
    unsavedChanges: "تغييرات غير محفوظة — احفظ قبل مغادرة هذه الصفحة.",
    helpList: "عنصر واحد في كل سطر.",
    helpFaq: "واحد في كل سطر، بالصيغة  سؤال :: جواب",
    englishLabel: "الإنجليزية:",
    emptyPlaceholder: "(فارغ)",
    saving: "جارٍ الحفظ…",
    saveTranslationPre: "حفظ ترجمة ",
    saveTranslationPost: "",
  },
};
