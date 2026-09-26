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
  brandKicker: string;
  welcomeBack: string;
  loginLede: string;
  heroHeadline: string;
  heroHeadlineItalic: string;
  heroSubtitle: string;
  email: string;
  password: string;
  showPassword: string;
  hidePassword: string;
  signIn: string;
  signingIn: string;
  langSwitchLabel: string;
  installApp: string;
  installIosHint: string;
  installMenuHint: string;
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
  brandKicker: "Admin",
  welcomeBack: "Welcome back.",
  loginLede: "Sign in with your admin email and password.",
  heroHeadline: "Every journey,",
  heroHeadlineItalic: "beautifully run.",
  heroSubtitle: "Tours, bookings, content and settings — all from one calm place.",
  email: "Email",
  password: "Password",
  showPassword: "Show password",
  hidePassword: "Hide password",
  signIn: "Sign in",
  signingIn: "Signing in…",
  langSwitchLabel: "Language",
  installApp: "Install the admin app",
  installIosHint: "Tap Share, then “Add to Home Screen”.",
  installMenuHint: "Open your browser menu and choose “Install app” (or “Add to Home Screen”).",
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
  brandKicker: "الإدارة",
  welcomeBack: "مرحبًا بعودتك.",
  loginLede: "سجّل الدخول ببريدك الإلكتروني وكلمة المرور.",
  heroHeadline: "كل رحلة",
  heroHeadlineItalic: "تُدار بإتقان.",
  heroSubtitle: "الجولات والحجوزات والمحتوى والإعدادات — من مكان واحد هادئ.",
  email: "البريد الإلكتروني",
  password: "كلمة المرور",
  showPassword: "إظهار كلمة المرور",
  hidePassword: "إخفاء كلمة المرور",
  signIn: "تسجيل الدخول",
  signingIn: "جارٍ تسجيل الدخول…",
  langSwitchLabel: "اللغة",
  installApp: "تثبيت تطبيق الإدارة",
  installIosHint: "اضغط مشاركة، ثم «إضافة إلى الشاشة الرئيسية».",
  installMenuHint: "افتح قائمة المتصفح واختر «تثبيت التطبيق» (أو «إضافة إلى الشاشة الرئيسية»).",
  errInvalid: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  errRate: "محاولات كثيرة جدًا. يُرجى الانتظار دقيقة ثم المحاولة مرة أخرى.",
  errGeneric: "تعذّر تسجيل الدخول.",
  forbiddenTitle: "تم رفض الوصول",
  forbiddenBody: "لا يملك حسابك صلاحية الوصول إلى هذا القسم.",
  backToSite: "العودة إلى الموقع",
  signOut: "تسجيل الخروج",
};
