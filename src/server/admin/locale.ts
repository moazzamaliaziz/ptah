/**
 * Server-side reader for the admin-UI locale (Wave 5).
 *
 * Reads the `ADMIN_LOCALE` cookie set by the language switcher. Read-only, so it
 * is safe to call during render (the admin root layout and any admin server
 * component). Writing the cookie happens in the switcher's Server Action
 * (`locale-actions.ts`), never here — `cookies()` cannot be mutated in render.
 */
import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { ADMIN_LOCALE_COOKIE, toAdminLocale, type AdminLocale } from "@/i18n/admin/config";

async function readAdminLocale(): Promise<AdminLocale> {
  const store = await cookies();
  return toAdminLocale(store.get(ADMIN_LOCALE_COOKIE)?.value);
}

/**
 * The operator's chosen admin-UI locale, or English when unset/invalid.
 *
 * Memoized per request: the admin root layout, the protected layout, the page
 * and its loading skeleton each need the locale, so this was four awaits on
 * `cookies()` in one render. No DB is involved, but `cookies()` is an async
 * dynamic-API boundary and each await is still a suspend/resume point on the
 * critical path, so resolving it once per request is strictly cheaper. A cookie
 * cannot change mid-request, so there is nothing to go stale.
 */
export const getAdminLocale: () => Promise<AdminLocale> = cache(readAdminLocale);
