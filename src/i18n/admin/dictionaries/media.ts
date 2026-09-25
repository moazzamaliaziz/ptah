/**
 * Media library dictionary (Wave 5) — /admin/media (upload form + grid) and the
 * reusable MediaPicker island (select/upload control embedded in tours,
 * destinations, events, trip ideas and branding editors).
 *
 * Folder names come from `MEDIA_FOLDERS` and are technical identifiers shown
 * verbatim; asset metadata (filename, mime, dimensions, alt text) is user data.
 * Server VALIDATION errors (`state.error`, upload `result.error`) are surfaced
 * verbatim; only UI-authored copy and client-side fallbacks are localized here.
 */

/** Upload form island (MediaUploadForm). All strings. */
export interface MediaUploadDict {
  heading: string;
  dedupedNote: string;
  uploadedNote: string;
  imageFile: string;
  folder: string;
  altTextOptional: string;
  altPlaceholder: string;
  uploading: string;
  upload: string;
  formatsHint: string;
}

/** Reusable select-or-upload image control (MediaPicker island). All strings. */
export interface MediaPickerDict {
  none: string;
  change: string;
  select: string;
  clear: string;
  urlPlaceholder: string;
  /** aria-label suffix: `${label}${pathAriaSuffix}`. */
  pathAriaSuffix: string;
  selectImage: string;
  close: string;
  uploadNew: string;
  formatsHintShort: string;
  uploading: string;
  loadingLibrary: string;
  noImagesUploadAbove: string;
  uploadFailed: string;
}
/** /admin/media page (upload form heading lives on MediaUploadDict). All strings. */
export interface MediaDict {
  title: string;
  subtitle: string;
  viewOnlyNote: string;
  folderAll: string;
  noImages: string;
  /** Empty-state variant when a folder filter is active: `${folder}` is a MEDIA_FOLDERS name. */
  noImagesInFolder: (folder: string) => string;
  altText: string;
  saveAlt: string;
  noAltText: string;
  upload: MediaUploadDict;
}
export const mediaEn: MediaDict = {
  title: "Media library",
  subtitle:
    "Upload and manage images. Stored in the database; served via a cached route and optimized by the image pipeline.",
  viewOnlyNote: "Your role can view media but not upload or change it.",
  folderAll: "All",
  noImages: "No images yet.",
  noImagesInFolder: (folder) => `No images in “${folder}” yet.`,
  altText: "Alt text",
  saveAlt: "Save alt",
  noAltText: "— no alt text —",
  upload: {
    heading: "Upload image",
    dedupedNote: "That image already existed — reused the existing asset.",
    uploadedNote: "Uploaded.",
    imageFile: "Image file",
    folder: "Folder",
    altTextOptional: "Alt text (optional)",
    altPlaceholder: "Describe the image for screen readers",
    uploading: "Uploading…",
    upload: "Upload",
    formatsHint:
      "JPEG, PNG, WebP, GIF, SVG, ICO, AVIF, BMP, TIFF — max 4 MB (512 KB for SVG). TIFF is auto-converted to WebP; iPhone HEIC isn't supported (save as JPEG).",
  },
};

export const mediaPickerEn: MediaPickerDict = {
  none: "None",
  change: "Change",
  select: "Select",
  clear: "Clear",
  urlPlaceholder: "/assets/… or https://… or pick from library",
  pathAriaSuffix: " path",
  selectImage: "Select image",
  close: "Close",
  uploadNew: "Upload new",
  formatsHintShort: "JPEG, PNG, WebP, GIF, SVG, ICO, AVIF, BMP, TIFF — max 4 MB.",
  uploading: "Uploading…",
  loadingLibrary: "Loading library…",
  noImagesUploadAbove: "No images yet — upload one above.",
  uploadFailed: "Upload failed.",
};
export const mediaAr: MediaDict = {
  title: "مكتبة الوسائط",
  subtitle:
    "ارفع الصور وأدِرها. تُخزَّن في قاعدة البيانات، وتُقدَّم عبر مسار مُخزَّن مؤقتًا وتُحسَّن عبر خط معالجة الصور.",
  viewOnlyNote: "يمكن لدورك عرض الوسائط دون رفعها أو تغييرها.",
  folderAll: "الكل",
  noImages: "لا توجد صور بعد.",
  noImagesInFolder: (folder) => `لا توجد صور في «${folder}» بعد.`,
  altText: "النص البديل",
  saveAlt: "حفظ النص البديل",
  noAltText: "— لا يوجد نص بديل —",
  upload: {
    heading: "رفع صورة",
    dedupedNote: "هذه الصورة موجودة بالفعل — أُعيد استخدام الأصل الموجود.",
    uploadedNote: "تم الرفع.",
    imageFile: "ملف الصورة",
    folder: "المجلد",
    altTextOptional: "النص البديل (اختياري)",
    altPlaceholder: "صِف الصورة لقارئات الشاشة",
    uploading: "جارٍ الرفع…",
    upload: "رفع",
    formatsHint:
      "JPEG وPNG وWebP وGIF وSVG وICO وAVIF وBMP وTIFF — بحد أقصى 4 ميغابايت (512 كيلوبايت لـ SVG). يُحوَّل TIFF تلقائيًا إلى WebP؛ صيغة HEIC من آيفون غير مدعومة (احفظها بصيغة JPEG).",
  },
};

export const mediaPickerAr: MediaPickerDict = {
  none: "لا شيء",
  change: "تغيير",
  select: "اختيار",
  clear: "مسح",
  urlPlaceholder: "/assets/… أو https://… أو اختر من المكتبة",
  pathAriaSuffix: " المسار",
  selectImage: "اختيار صورة",
  close: "إغلاق",
  uploadNew: "رفع صورة جديدة",
  formatsHintShort: "JPEG وPNG وWebP وGIF وSVG وICO وAVIF وBMP وTIFF — بحد أقصى 4 ميغابايت.",
  uploading: "جارٍ الرفع…",
  loadingLibrary: "جارٍ تحميل المكتبة…",
  noImagesUploadAbove: "لا توجد صور بعد — ارفع واحدة بالأعلى.",
  uploadFailed: "فشل الرفع.",
};
