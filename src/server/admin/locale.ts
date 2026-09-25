/**
 * Server-side reader for the admin-UI locale (Wave 5).
 *
 * Reads the `ADMIN_LOCALE` cookie set by the language switcher. Read-only, so it
 * is safe to call during render (the admin root layout and any admin server
 * component). Writing the cookie happens in the switcher's Server Action
 * (`locale-actions.ts`), never here — `cookies()` cannot be mutated in render.
 */
import "server-only";
import { cookies } from "next/headers";
import { ADMIN_LOCALE_COOKIE, toAdminLocale, type AdminLocale } from "@/i18n/admin/config";

/** The operator's chosen admin-UI locale, or English when unset/invalid. */
export async function getAdminLocale(): Promise<AdminLocale> {
  const store = await cookies();
  return toAdminLocale(store.get(ADMIN_LOCALE_COOKIE)?.value);
}
