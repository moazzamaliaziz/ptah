import type { JSX } from "react";
import Link from "next/link";
import { requireCapability, can } from "@/server/auth/rbac";
import { listAdminWidgets } from "@/server/admin/widgets-admin";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";
import { setWidgetEnabledAction } from "./actions";

export const dynamic = "force-dynamic";

/**
 * /admin/widgets — list every floating widget with a quick enable/disable, a
 * link to edit, and a "New widget" action. Ordered as the public cluster stacks
 * (sortOrder, then created). View gated by widgets.view; mutations by
 * widgets.edit (re-checked in the action).
 */
export default async function WidgetsPage(): Promise<JSX.Element> {
  const user = await requireCapability("widgets.view");
  const editable = can(user, "widgets.edit");
  const widgets = await listAdminWidgets();
  const dict = getAdminDict(await getAdminLocale());
  const t = dict.widgets;

  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>
          {editable ? <Link className="admin-btn" href="/admin/widgets/new">{t.newWidget}</Link> : null}
        </div>
      </div>

      {!editable ? (
        <div className="admin-alert admin-alert--ok" role="status">{t.viewOnlyNote}</div>
      ) : null}

      {widgets.length === 0 ? (
        <div className="admin-card"><p className="admin-card__meta">{t.noWidgets}{editable ? t.noWidgetsCreateHint : ""}</p></div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t.colLabel}</th>
              <th>{t.colType}</th>
              <th>{t.colPosition}</th>
              <th>{t.colDevices}</th>
              <th>{t.colOrder}</th>
              <th>{t.colStatus}</th>
              <th aria-label={t.actionsAria} />
            </tr>
          </thead>
          <tbody>
            {widgets.map((w) => (
              <tr key={w.id}>
                <td><Link href={`/admin/widgets/${w.id}`}>{w.label}</Link></td>
                <td>{w.type}</td>
                <td>{w.position}</td>
                <td>{[w.showDesktop ? t.deviceDesktop : null, w.showMobile ? t.deviceMobile : null].filter(Boolean).join(" + ") || t.deviceHidden}</td>
                <td>{w.sortOrder}</td>
                <td>
                  <span className={`admin-badge ${w.enabled ? "admin-badge--on" : "admin-badge--off"}`}>{w.enabled ? t.on : t.off}</span>
                </td>
                <td>
                  {editable ? (
                    <form action={setWidgetEnabledAction}>
                      <input type="hidden" name="id" value={w.id} />
                      <input type="hidden" name="enabled" value={w.enabled ? "false" : "true"} />
                      <button className={`admin-btn admin-btn--ghost ${w.enabled ? "admin-btn--danger" : ""}`} type="submit">
                        {w.enabled ? dict.common.disable : dict.common.enable}
                      </button>
                    </form>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
