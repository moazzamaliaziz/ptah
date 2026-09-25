import type { JSX } from "react";
import { adminLocales, adminLocaleNames, type AdminLocale } from "@/i18n/admin/config";
import { setAdminLocaleAction } from "@/app/admin/(protected)/locale-actions";

/**
 * Two-language (English / Arabic) admin switcher — Wave 5.
 *
 * Cookie-backed with NO client JS: each language is a Server Action form submit
 * that sets ADMIN_LOCALE and revalidates. The active language is rendered as a
 * pressed button. A server component so it can reference the action directly.
 */
export default function AdminLocaleSwitcher({
  current,
  label,
}: {
  current: AdminLocale;
  label: string;
}): JSX.Element {
  return (
    <form action={setAdminLocaleAction} className="admin-locale" aria-label={label}>
      {adminLocales.map((loc) => {
        const active = loc === current;
        return (
          <button
            key={loc}
            type="submit"
            name="locale"
            value={loc}
            lang={loc}
            aria-pressed={active}
            className={`admin-locale__btn${active ? " admin-locale__btn--active" : ""}`}
          >
            {adminLocaleNames[loc]}
          </button>
        );
      })}
    </form>
  );
}
