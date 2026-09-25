import type { JSX } from "react";
import Link from "next/link";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";
import { logoutAction } from "@/app/admin/actions";

export default async function AdminForbiddenPage(): Promise<JSX.Element> {
  const t = getAdminDict(await getAdminLocale()).auth;
  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <h1>{t.forbiddenTitle}</h1>
        <p>{t.forbiddenBody}</p>
        <div className="admin-row">
          <Link className="admin-btn admin-btn--ghost" href="/">
            {t.backToSite}
          </Link>
          <form action={logoutAction}>
            <button className="admin-btn" type="submit">
              {t.signOut}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
