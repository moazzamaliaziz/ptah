"use server";

/**
 * Admin-UI language switch (Wave 5).
 *
 * Persists the operator's choice in the ADMIN_LOCALE cookie and revalidates the
 * admin subtree so the new language + text direction take effect immediately on
 * the current page. This is a display preference, not a secret — the cookie is
 * NOT HttpOnly, is scoped to /admin, and is long-lived.
 */
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { env } from "@/lib/env";
import { ADMIN_LOCALE_COOKIE, toAdminLocale } from "@/i18n/admin/config";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export async function setAdminLocaleAction(formData: FormData): Promise<void> {
  const locale = toAdminLocale(formData.get("locale")?.toString());
  const store = await cookies();
  store.set(ADMIN_LOCALE_COOKIE, locale, {
    httpOnly: false,
    sameSite: "lax",
    secure: env.isProd,
    path: "/admin",
    maxAge: ONE_YEAR_SECONDS,
  });
  // Re-render the admin layout tree so it re-reads the cookie (new <html
  // lang/dir> + translated chrome) and the current page picks up the language.
  revalidatePath("/admin", "layout");
}
