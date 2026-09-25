/**
 * Errors dictionary (Wave 5) — the admin error boundary (error.tsx). The
 * boundary is a Client Component that can't read the ADMIN_LOCALE cookie via
 * next/headers, so it picks its language from <html lang> at render time and
 * indexes straight into these strings. The loading skeleton reuses
 * `common.loading`, so it isn't duplicated here.
 */

export interface ErrorsDict {
  title: string;
  body: string;
  referenceLabel: string; // precedes the framework digest
  tryAgain: string;
}

export const errorsEn: ErrorsDict = {
  title: "Something went wrong",
  body: "This admin view failed to load. Try again — if it persists, check the server logs for the reference below.",
  referenceLabel: "Reference:",
  tryAgain: "Try again",
};

export const errorsAr: ErrorsDict = {
  title: "حدث خطأ ما",
  body: "تعذّر تحميل هذه الصفحة الإدارية. حاول مرة أخرى — وإذا استمرّت المشكلة، فراجع سجلّات الخادم للرقم المرجعي أدناه.",
  referenceLabel: "الرقم المرجعي:",
  tryAgain: "حاول مرة أخرى",
};
