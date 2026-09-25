/**
 * Floating widgets dictionary (Wave 5) — /admin/widgets (list, quick
 * enable/disable, create, edit, delete) plus the shared WidgetEditor island.
 * Widget labels/hrefs/colors are user data (never translated). Type, position
 * and icon keys are fixed technical identifiers shown verbatim in the pickers
 * and table (stored values stay English). Server validation errors
 * (`state.error`) are surfaced verbatim.
 */

/** Shared create/edit form labels (WidgetEditor island). All strings. */
export interface WidgetEditorDict {
  savedNote: string;
  type: string;
  label: string;
  link: string;
  icon: string;
  bgColor: string;
  preview: string;
  position: string;
  sortOrder: string;
  enabled: string;
  showDesktop: string;
  showMobile: string;
  saving: string;
  saveWidget: string;
  createWidget: string;
}

export interface WidgetsDict {
  // list page
  title: string;
  subtitle: string;
  newWidget: string;
  viewOnlyNote: string;
  noWidgets: string;
  noWidgetsCreateHint: string;
  colLabel: string;
  colType: string;
  colPosition: string;
  colDevices: string;
  colOrder: string;
  colStatus: string;
  actionsAria: string;
  deviceDesktop: string;
  deviceMobile: string;
  deviceHidden: string;
  on: string;
  off: string;
  // detail page
  backToList: string;
  deleteHeading: string;
  deleteHint: string;
  // new page
  newTitle: string;
  newSubtitle: string;
  // editor island
  editor: WidgetEditorDict;
}
export const widgetsEn: WidgetsDict = {
  title: "Floating widgets",
  subtitle:
    "Contact buttons anchored to the corner of every public page (phone, WhatsApp, Tripadvisor, email, …). The database is the source of truth; changes appear within seconds.",
  newWidget: "New widget",
  viewOnlyNote: "Your role can view widgets but not change them.",
  noWidgets: "No widgets yet.",
  noWidgetsCreateHint: " Create one to add a floating contact button.",
  colLabel: "Label",
  colType: "Type",
  colPosition: "Position",
  colDevices: "Devices",
  colOrder: "Order",
  colStatus: "Status",
  actionsAria: "Actions",
  deviceDesktop: "desktop",
  deviceMobile: "mobile",
  deviceHidden: "hidden",
  on: "On",
  off: "Off",
  backToList: "← All widgets",
  deleteHeading: "Delete widget",
  deleteHint: "Removes this widget from the site. This cannot be undone.",
  newTitle: "New widget",
  newSubtitle: "Add a floating contact button.",
  editor: {
    savedNote: "Saved. Widgets update on the live site within seconds.",
    type: "Type",
    label: "Label (tooltip / aria-label)",
    link: "Link",
    icon: "Icon",
    bgColor: "Background color",
    preview: "Preview",
    position: "Position",
    sortOrder: "Sort order",
    enabled: "Enabled",
    showDesktop: "Show on desktop",
    showMobile: "Show on mobile",
    saving: "Saving…",
    saveWidget: "Save widget",
    createWidget: "Create widget",
  },
};
export const widgetsAr: WidgetsDict = {
  title: "الأدوات العائمة",
  subtitle:
    "أزرار تواصل مثبّتة في زاوية كل صفحة عامة (هاتف، واتساب، Tripadvisor، بريد إلكتروني، …). قاعدة البيانات هي المصدر الموثوق؛ تظهر التغييرات خلال ثوانٍ.",
  newWidget: "أداة جديدة",
  viewOnlyNote: "يمكن لدورك عرض الأدوات دون تعديلها.",
  noWidgets: "لا توجد أدوات بعد.",
  noWidgetsCreateHint: " أنشئ واحدة لإضافة زر تواصل عائم.",
  colLabel: "التسمية",
  colType: "النوع",
  colPosition: "الموضع",
  colDevices: "الأجهزة",
  colOrder: "الترتيب",
  colStatus: "الحالة",
  actionsAria: "إجراءات",
  deviceDesktop: "سطح المكتب",
  deviceMobile: "الجوال",
  deviceHidden: "مخفي",
  on: "مُفعّل",
  off: "مُعطّل",
  backToList: "→ كل الأدوات",
  deleteHeading: "حذف الأداة",
  deleteHint: "يزيل هذه الأداة من الموقع. لا يمكن التراجع عن هذا الإجراء.",
  newTitle: "أداة جديدة",
  newSubtitle: "أضف زر تواصل عائم.",
  editor: {
    savedNote: "تم الحفظ. تتحدّث الأدوات على الموقع المباشر خلال ثوانٍ.",
    type: "النوع",
    label: "التسمية (تلميح / aria-label)",
    link: "الرابط",
    icon: "الأيقونة",
    bgColor: "لون الخلفية",
    preview: "معاينة",
    position: "الموضع",
    sortOrder: "ترتيب العرض",
    enabled: "مُفعّل",
    showDesktop: "إظهار على سطح المكتب",
    showMobile: "إظهار على الجوال",
    saving: "جارٍ الحفظ…",
    saveWidget: "حفظ الأداة",
    createWidget: "إنشاء الأداة",
  },
};
