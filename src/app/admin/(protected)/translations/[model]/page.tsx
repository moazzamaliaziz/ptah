import type { JSX } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCapability } from "@/server/auth/rbac";
import { listTranslatableRecords } from "@/server/admin/translations-admin";
import { getTranslatableModel } from "@/content/translatable-fields";
import { isLocale, localeNames } from "@/i18n/config";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";

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
  const dict = getAdminDict(await getAdminLocale());
  const t = dict.translations;

  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>{def.label}</h1>
            <p>{t.pickHint}</p>
          </div>
          <Link className="admin-btn admin-btn--ghost" href="/admin/translations">{t.backToTypes}</Link>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="admin-card"><p className="admin-card__meta">{t.nothingToTranslate}</p></div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th scope="col">{def.singular}</th>
              <th scope="col">{t.colLanguagesDone}</th>
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
                    <span className="admin-card__meta">{t.noneYet}</span>
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
                <td style={{ textAlign: "end" }}>
                  <Link className="admin-btn admin-btn--ghost" href={`/admin/translations/${model}/${r.id}`}>
                    {t.translate}
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
