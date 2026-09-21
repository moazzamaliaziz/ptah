import type { JSX } from "react";
import Link from "next/link";
import { requireCapability } from "@/server/auth/rbac";
import { listContactMessages } from "@/server/contact";

export const dynamic = "force-dynamic";

const STATUS_BADGE: Record<string, string> = {
  NEW: "admin-badge--gold",
  READ: "admin-badge--off",
  ARCHIVED: "admin-badge--off",
};

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(d);
}

/**
 * /admin/enquiries — customer contact-form inbox. View gated by enquiries.view
 * (support + admins); deletion is admin-only (enforced in the action).
 */
export default async function EnquiriesPage(): Promise<JSX.Element> {
  await requireCapability("enquiries.view");
  const messages = await listContactMessages();
  const newCount = messages.filter((m) => m.status === "NEW").length;

  return (
    <>
      <div className="admin-head">
        <h1>Enquiries</h1>
        <p>
          Messages from the public contact form.{" "}
          {newCount > 0 ? <strong>{newCount} new</strong> : "No unread messages."}
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="admin-card"><p className="admin-card__meta">No enquiries yet. Submissions from /contact will appear here.</p></div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>From</th>
              <th>Subject</th>
              <th>Received</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((m) => (
              <tr key={m.id} style={m.status === "NEW" ? { fontWeight: 600 } : undefined}>
                <td>
                  <Link href={`/admin/enquiries/${m.id}`}>{m.name}</Link>
                  <div className="admin-card__meta" style={{ fontWeight: 400 }}>{m.email}</div>
                </td>
                <td>{m.subject ?? <span className="admin-card__meta">(no subject)</span>}</td>
                <td>{formatDate(m.createdAt)}</td>
                <td><span className={`admin-badge ${STATUS_BADGE[m.status] ?? "admin-badge--off"}`}>{m.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
