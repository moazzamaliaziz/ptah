import type { JSX } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCapability } from "@/server/auth/rbac";
import { listTranslatableRecords } from "@/server/admin/translations-admin";
import { getTranslatableModel } from "@/content/translatable-fields";
import { isLocale, localeNames } from "@/i18n/config";

export const dynamic = "force-dynamic";

export default async function TranslationRecordsPage({
  params,
}: {
  params: Promise<{ model: string }>;
}): Promise<JSX.Element> {
  await requireCapability("content.view");
  const { model } = await params;
  const def = getTranslatableModel(model);
  if (!def) notFound();

  const records = await listTranslatableRecords(model);

  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>{def.label}</h1>
            <p>Pick a {def.singular.toLowerCase()} to translate. The chips show which languages already have text.</p>
          </div>
          <Link className="admin-btn admin-btn--ghost" href="/admin/translations">← All content types</Link>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="admin-card"><p className="admin-card__meta">Nothing to translate here yet.</p></div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>{def.singular}</th>
              <th>Languages done</th>
              <th aria-hidden />
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>
                  <Link href={`/admin/translations/${model}/${r.id}`}>{r.label}</Link>
                  {r.sublabel ? <div className="admin-card__meta">{r.sublabel}</div> : null}
                </td>
                <td>
                  {r.locales.length === 0 ? (
                    <span className="admin-card__meta">None yet</span>
                  ) : (
                    <span className="admin-row" style={{ gap: "0.35rem", flexWrap: "wrap" }}>
                      {r.locales.map((l) => (
                        <span key={l} className="admin-badge admin-badge--gold">
                          {isLocale(l) ? localeNames[l] : l}
                        </span>
                      ))}
                    </span>
                  )}
                </td>
                <td style={{ textAlign: "right" }}>
                  <Link className="admin-btn admin-btn--ghost" href={`/admin/translations/${model}/${r.id}`}>
                    Translate →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
