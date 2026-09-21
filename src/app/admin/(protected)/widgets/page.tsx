import type { JSX } from "react";
import Link from "next/link";
import { requireCapability, can } from "@/server/auth/rbac";
import { listAdminWidgets } from "@/server/admin/widgets-admin";
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

  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>Floating widgets</h1>
            <p>Contact buttons anchored to the corner of every public page (phone, WhatsApp, Tripadvisor, email, …). The database is the source of truth; changes appear within seconds.</p>
          </div>
          {editable ? <Link className="admin-btn" href="/admin/widgets/new">New widget</Link> : null}
        </div>
      </div>

      {!editable ? (
        <div className="admin-alert admin-alert--ok" role="status">Your role can view widgets but not change them.</div>
      ) : null}

      {widgets.length === 0 ? (
        <div className="admin-card"><p className="admin-card__meta">No widgets yet.{editable ? " Create one to add a floating contact button." : ""}</p></div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Label</th>
              <th>Type</th>
              <th>Position</th>
              <th>Devices</th>
              <th>Order</th>
              <th>Status</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {widgets.map((w) => (
              <tr key={w.id}>
                <td><Link href={`/admin/widgets/${w.id}`}>{w.label}</Link></td>
                <td>{w.type}</td>
                <td>{w.position}</td>
                <td>{[w.showDesktop ? "desktop" : null, w.showMobile ? "mobile" : null].filter(Boolean).join(" + ") || "hidden"}</td>
                <td>{w.sortOrder}</td>
                <td>
                  <span className={`admin-badge ${w.enabled ? "admin-badge--on" : "admin-badge--off"}`}>{w.enabled ? "On" : "Off"}</span>
                </td>
                <td>
                  {editable ? (
                    <form action={setWidgetEnabledAction}>
                      <input type="hidden" name="id" value={w.id} />
                      <input type="hidden" name="enabled" value={w.enabled ? "false" : "true"} />
                      <button className={`admin-btn admin-btn--ghost ${w.enabled ? "admin-btn--danger" : ""}`} type="submit">
                        {w.enabled ? "Disable" : "Enable"}
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
