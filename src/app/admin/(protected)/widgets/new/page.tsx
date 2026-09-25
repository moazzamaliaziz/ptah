import type { JSX } from "react";
import Link from "next/link";
import { requireCapability } from "@/server/auth/rbac";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";
import WidgetEditor from "../WidgetEditor";

export const dynamic = "force-dynamic";

export default async function NewWidgetPage(): Promise<JSX.Element> {
  await requireCapability("widgets.edit");
  const dict = getAdminDict(await getAdminLocale());
  const t = dict.widgets;
  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div><h1>{t.newTitle}</h1><p>{t.newSubtitle}</p></div>
          <Link className="admin-btn admin-btn--ghost" href="/admin/widgets">{t.backToList}</Link>
        </div>
      </div>
      <WidgetEditor labels={t.editor} />
    </>
  );
}
