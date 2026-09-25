/**
 * Site-toggles dictionary (Wave 5) — /admin/toggles (runtime feature flags).
 * Server component only, so no serializable-prop constraint applies here.
 *
 * Localized: page title/subtitle, the view-only note, the on/off badge, the
 * enable/disable button, and each flag's operator-facing label + description
 * (the `items` map, keyed by the stored ToggleKey enum — exhaustive, so a
 * missing key is a compile error). NOT localized: the monospace flag KEY shown
 * under each card (`{key}` — a stored enum), the env-var name
 * `BANK_TRANSFER_INSTRUCTIONS` and the product names Stripe / PayPal (proper
 * nouns) inside the descriptions. Server VALIDATION errors from actions.ts stay
 * verbatim.
 */
import type { ToggleKey } from "@/server/toggles";

export interface TogglesDict {
  title: string;
  subtitle: string;
  viewOnlyNote: string;
  badgeOn: string;
  badgeOff: string;
  enable: string;
  disable: string;
  /** Per-flag label + description, keyed by the stored enum (exhaustive). */
  items: Record<ToggleKey, { label: string; description: string }>;
}

export const togglesEn: TogglesDict = {
  title: "Site toggles",
  subtitle: "Runtime feature flags. The database is the source of truth; changes take effect within seconds.",
  viewOnlyNote: "Your role can view toggles but not change them.",
  badgeOn: "On",
  badgeOff: "Off",
  enable: "Enable",
  disable: "Disable",
  items: {
    SIGNUP_ENABLED: { label: "Customer sign-up", description: "Allow new customer account registration (enforced by the auth phase)." },
    LOGIN_ENABLED: { label: "Customer login", description: "Allow existing customers to sign in (enforced by the auth phase). Admin login is never affected." },
    PAYMENTS_STRIPE_ENABLED: { label: "Stripe payments", description: "Enable Stripe checkout (requires Stripe integration credentials + webhook)." },
    PAYMENTS_PAYPAL_ENABLED: { label: "PayPal payments", description: "Enable PayPal checkout (requires PayPal integration credentials + webhook ID)." },
    PAYMENTS_BANK_TRANSFER_ENABLED: { label: "Bank transfer", description: "Offer offline bank transfer at checkout. Set the instructions via BANK_TRANSFER_INSTRUCTIONS; staff confirm each payment manually in Orders." },
    MAINTENANCE_MODE: { label: "Maintenance mode", description: "Show a maintenance page to non-admin visitors. Admins keep full access." },
  },
};

export const togglesAr: TogglesDict = {
  title: "إعدادات الموقع",
  subtitle: "مفاتيح ميزات فورية. قاعدة البيانات هي مصدر الحقيقة؛ تسري التغييرات خلال ثوانٍ.",
  viewOnlyNote: "يمكن لدورك عرض المفاتيح دون تغييرها.",
  badgeOn: "مُفعَّل",
  badgeOff: "متوقف",
  enable: "تفعيل",
  disable: "تعطيل",
  items: {
    SIGNUP_ENABLED: { label: "تسجيل العملاء", description: "السماح بتسجيل حسابات عملاء جدد (يُطبَّق في مرحلة المصادقة)." },
    LOGIN_ENABLED: { label: "دخول العملاء", description: "السماح للعملاء الحاليين بتسجيل الدخول (يُطبَّق في مرحلة المصادقة). لا يتأثر دخول المسؤول أبدًا." },
    PAYMENTS_STRIPE_ENABLED: { label: "مدفوعات Stripe", description: "تفعيل الدفع عبر Stripe (يتطلب بيانات اعتماد تكامل Stripe + خطاف ويب)." },
    PAYMENTS_PAYPAL_ENABLED: { label: "مدفوعات PayPal", description: "تفعيل الدفع عبر PayPal (يتطلب بيانات اعتماد تكامل PayPal + معرّف خطاف الويب)." },
    PAYMENTS_BANK_TRANSFER_ENABLED: { label: "التحويل البنكي", description: "إتاحة التحويل البنكي دون اتصال عند الدفع. اضبط التعليمات عبر BANK_TRANSFER_INSTRUCTIONS؛ يؤكّد الموظفون كل دفعة يدويًا في الطلبات." },
    MAINTENANCE_MODE: { label: "وضع الصيانة", description: "إظهار صفحة صيانة للزوار غير المسؤولين. يحتفظ المسؤولون بالوصول الكامل." },
  },
};
