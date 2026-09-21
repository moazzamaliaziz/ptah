import type { JSX } from "react";
import Link from "next/link";
import { requireCapability } from "@/server/auth/rbac";
import { listLandingSections } from "@/server/content";

export default async function ContentIndexPage(): Promise<JSX.Element> {
  await requireCapability("content.view");
  const sections = await listLandingSections();

  return (
    <>
      <div className="admin-head">
        <h1>Content (CMS)</h1>
        <p>
          The seven landing sections. Each can be overridden by an editable payload; an unset section
          serves the built-in default. Overrides are validated against the section schema before they go live.
        </p>
      </div>

      <div className="admin-card" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Section</th>
              <th>Source</th>
              <th style={{ textAlign: "right" }}>Edit</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((s) => (
              <tr key={s.key}>
                <td>{s.label}</td>
                <td>
                  <span className={`admin-badge ${s.overridden ? "admin-badge--gold" : "admin-badge--off"}`}>
                    {s.overridden ? "Override" : "Default"}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <Link className="admin-btn admin-btn--ghost" href={`/admin/content/${s.key}`}>
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
