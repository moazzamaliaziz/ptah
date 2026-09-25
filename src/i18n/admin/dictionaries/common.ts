/**
 * Shared admin labels (Wave 5) — generic verbs and words that recur across many
 * screens (Save, Cancel, Delete, …). Screens read these instead of each
 * duplicating the word, so terminology stays consistent in both languages.
 * Screen-specific or counted phrases live in that screen's own module.
 */

export interface CommonDict {
  save: string;
  saveChanges: string;
  saving: string;
  saved: string;
  cancel: string;
  delete: string;
  deleting: string;
  deletePermanently: string;
  remove: string;
  edit: string;
  create: string;
  creating: string;
  add: string;
  new: string;
  back: string;
  view: string;
  open: string;
  close: string;
  search: string;
  loading: string;
  uploading: string;
  required: string;
  optional: string;
  noneYet: string;
  actions: string;
  previous: string;
  next: string;
  enabled: string;
  disabled: string;
  enable: string;
  disable: string;
  yes: string;
  no: string;
  confirm: string;
  published: string;
  draft: string;
  active: string;
  inactive: string;
  all: string;
  apply: string;
  reset: string;
  name: string;
  title: string;
  slug: string;
  description: string;
  status: string;
  sortOrder: string;
  /** Prefix for help-chip screen-reader labels: `${help}: ${text}`. */
  help: string;
}

export const commonEn: CommonDict = {
  save: "Save",
  saveChanges: "Save changes",
  saving: "Saving…",
  saved: "Saved",
  cancel: "Cancel",
  delete: "Delete",
  deleting: "Deleting…",
  deletePermanently: "Delete permanently",
  remove: "Remove",
  edit: "Edit",
  create: "Create",
  creating: "Creating…",
  add: "Add",
  new: "New",
  back: "Back",
  view: "View",
  open: "Open",
  close: "Close",
  search: "Search",
  loading: "Loading…",
  uploading: "Uploading…",
  required: "Required",
  optional: "Optional",
  noneYet: "None yet",
  actions: "Actions",
  previous: "Previous",
  next: "Next",
  enabled: "Enabled",
  disabled: "Disabled",
  enable: "Enable",
  disable: "Disable",
  yes: "Yes",
  no: "No",
  confirm: "Confirm",
  published: "Published",
  draft: "Draft",
  active: "Active",
  inactive: "Inactive",
  all: "All",
  apply: "Apply",
  reset: "Reset",
  name: "Name",
  title: "Title",
  slug: "Slug",
  description: "Description",
  status: "Status",
  sortOrder: "Sort order",
  help: "Help",
};

export const commonAr: CommonDict = {
  save: "حفظ",
  saveChanges: "حفظ التغييرات",
  saving: "جارٍ الحفظ…",
  saved: "تم الحفظ",
  cancel: "إلغاء",
  delete: "حذف",
  deleting: "جارٍ الحذف…",
  deletePermanently: "حذف نهائيًا",
  remove: "إزالة",
  edit: "تعديل",
  create: "إنشاء",
  creating: "جارٍ الإنشاء…",
  add: "إضافة",
  new: "جديد",
  back: "رجوع",
  view: "عرض",
  open: "فتح",
  close: "إغلاق",
  search: "بحث",
  loading: "جارٍ التحميل…",
  uploading: "جارٍ الرفع…",
  required: "مطلوب",
  optional: "اختياري",
  noneYet: "لا يوجد بعد",
  actions: "إجراءات",
  previous: "السابق",
  next: "التالي",
  enabled: "مفعَّل",
  disabled: "معطَّل",
  enable: "تفعيل",
  disable: "تعطيل",
  yes: "نعم",
  no: "لا",
  confirm: "تأكيد",
  published: "منشور",
  draft: "مسودة",
  active: "نشط",
  inactive: "غير نشط",
  all: "الكل",
  apply: "تطبيق",
  reset: "إعادة تعيين",
  name: "الاسم",
  title: "العنوان",
  slug: "المُعرّف (Slug)",
  description: "الوصف",
  status: "الحالة",
  sortOrder: "ترتيب العرض",
  help: "مساعدة",
};
