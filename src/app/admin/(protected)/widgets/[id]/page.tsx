import type { JSX } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCapability } from "@/server/auth/rbac";
import { getAdminWidget } from "@/server/admin/widgets-admin";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";
import WidgetEditor from "../WidgetEditor";
import { deleteWidgetAction } from "../actions";
import SubmitButton from "@/components/admin/SubmitButton";

export const dynamic = "force-dynamic";

export default async function WidgetEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<JSX.Element> {
  await requireCapability("widgets.edit");
  const { id } = await params;
  const widget = await getAdminWidget(id);
  if (!widget) notFound();

  const dict = getAdminDict(await getAdminLocale());
  const t = dict.widgets;

  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div><h1>{widget.label}</h1><p>{widget.type} · {widget.position}</p></div>
          <Link className="admin-btn admin-btn--ghost" href="/admin/widgets">{t.backToList}</Link>
        </div>
      </div>

      <WidgetEditor widget={widget} labels={t.editor} />

      <section className="admin-card" style={{ borderColor: "rgba(154,92,27,0.4)", marginTop: "1.25rem" }}>
        <h2>{t.deleteHeading}</h2>
        <p className="admin-card__meta">{t.deleteHint}</p>
        <form action={deleteWidgetAction} style={{ marginTop: "0.5rem" }}>
          <input type="hidden" name="id" value={widget.id} />
          <SubmitButton className="admin-btn admin-btn--danger" pendingLabel={dict.common.deleting}>
            {dict.common.deletePermanently}
          </SubmitButton>
        </form>
      </section>
    </>
  );
}
