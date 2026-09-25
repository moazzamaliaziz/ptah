import type { JSX } from "react";
import Link from "next/link";
import { requireCapability } from "@/server/auth/rbac";
import { listLandingSections } from "@/server/content";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";

export default async function ContentIndexPage(): Promise<JSX.Element> {
  await requireCapability("content.view");
  const sections = await listLandingSections();
  const dict = getAdminDict(await getAdminLocale());
  const t = dict.content;

  return (
    <>
      <div className="admin-head">
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </div>

      <div className="admin-card" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t.colSection}</th>
              <th>{t.colSource}</th>
              <th style={{ textAlign: "right" }}>{dict.common.edit}</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((s) => (
              <tr key={s.key}>
                <td>{t.sectionLabels[s.key] ?? s.label}</td>
                <td>
                  <span className={`admin-badge ${s.overridden ? "admin-badge--gold" : "admin-badge--off"}`}>
                    {s.overridden ? t.badgeOverride : t.badgeDefault}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <Link className="admin-btn admin-btn--ghost" href={`/admin/content/${s.key}`}>
                    {dict.common.edit}
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
