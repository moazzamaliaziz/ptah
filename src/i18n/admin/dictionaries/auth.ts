/**
 * Auth dictionary (Wave 5) — the two screens OUTSIDE the protected shell:
 * /admin/login (sign-in form + its error banner) and /admin/forbidden (shown
 * when a signed-in but under-privileged account hits a protected page). These
 * live in the public admin layout, so they keep their own copy rather than
 * leaning on the protected-shell slices. The login error strings are UI-authored
 * (keyed by a query param), so they ARE translated here — unlike dynamic
 * server-validation errors elsewhere, which are surfaced verbatim.
 */

export interface AuthDict {
  // Login
  loginTitle: string;
  loginSubtitle: string;
  email: string;
  password: string;
  signIn: string;
  signingIn: string;
  errInvalid: string;
  errRate: string;
  errGeneric: string;
  // Forbidden
  forbiddenTitle: string;
  forbiddenBody: string;
  backToSite: string;
  signOut: string;
}

export const authEn: AuthDict = {
  loginTitle: "Ptah Admin",
  loginSubtitle: "Sign in to manage the platform.",
  email: "Email",
  password: "Password",
  signIn: "Sign in",
  signingIn: "Signing in…",
  errInvalid: "Incorrect email or password.",
  errRate: "Too many attempts. Please wait a minute and try again.",
  errGeneric: "Sign-in failed.",
  forbiddenTitle: "Access denied",
  forbiddenBody: "Your account doesn’t have permission to view this area.",
  backToSite: "Back to site",
  signOut: "Sign out",
};

export const authAr: AuthDict = {
  loginTitle: "لوحة تحكم بتاح",
  loginSubtitle: "سجّل الدخول لإدارة المنصة.",
  email: "البريد الإلكتروني",
  password: "كلمة المرور",
  signIn: "تسجيل الدخول",
  signingIn: "جارٍ تسجيل الدخول…",
  errInvalid: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  errRate: "محاولات كثيرة جدًا. يُرجى الانتظار دقيقة ثم المحاولة مرة أخرى.",
  errGeneric: "تعذّر تسجيل الدخول.",
  forbiddenTitle: "تم رفض الوصول",
  forbiddenBody: "لا يملك حسابك صلاحية الوصول إلى هذا القسم.",
  backToSite: "العودة إلى الموقع",
  signOut: "تسجيل الخروج",
};
