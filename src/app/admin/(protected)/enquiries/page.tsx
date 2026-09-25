import type { JSX } from "react";
import Link from "next/link";
import { requireCapability } from "@/server/auth/rbac";
import { listContactMessages } from "@/server/contact";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";
import { formatAdminDateTime } from "@/i18n/admin/format";

export const dynamic = "force-dynamic";

const STATUS_BADGE: Record<string, string> = {
  NEW: "admin-badge--gold",
  READ: "admin-badge--off",
  ARCHIVED: "admin-badge--off",
};

/**
 * /admin/enquiries — customer contact-form inbox. View gated by enquiries.view
 * (support + admins); deletion is admin-only (enforced in the action).
 */
export default async function EnquiriesPage(): Promise<JSX.Element> {
  await requireCapability("enquiries.view");
  const locale = await getAdminLocale();
  const t = getAdminDict(locale).enquiries;
  const messages = await listContactMessages();
  const newCount = messages.filter((m) => m.status === "NEW").length;

  return (
    <>
      <div className="admin-head">
        <h1>{t.title}</h1>
        <p>
          {t.subtitle}{" "}
          {newCount > 0 ? <strong>{t.newCount(newCount)}</strong> : t.noUnread}
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="admin-card"><p className="admin-card__meta">{t.emptyState}</p></div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th scope="col">{t.colFrom}</th>
              <th scope="col">{t.colSubject}</th>
              <th scope="col">{t.colReceived}</th>
              <th scope="col">{t.colStatus}</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((m) => (
              <tr key={m.id} style={m.status === "NEW" ? { fontWeight: 600 } : undefined}>
                <td>
                  <Link href={`/admin/enquiries/${m.id}`}>{m.name}</Link>
                  <div className="admin-card__meta" style={{ fontWeight: 400 }}>{m.email}</div>
                </td>
                <td>{m.subject ?? <span className="admin-card__meta">{t.noSubject}</span>}</td>
                <td>{formatAdminDateTime(m.createdAt, locale)}</td>
                <td><span className={`admin-badge ${STATUS_BADGE[m.status] ?? "admin-badge--off"}`}>{t.statusLabel[m.status] ?? m.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
