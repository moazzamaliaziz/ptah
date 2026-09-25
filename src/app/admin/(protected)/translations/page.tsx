import type { JSX } from "react";
import Link from "next/link";
import { requireCapability } from "@/server/auth/rbac";
import { listTranslationModels } from "@/server/admin/translations-admin";
import { locales, defaultLocale, localeNames } from "@/i18n/config";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";

export const dynamic = "force-dynamic";

/** Non-English target languages, shown as a hint on the landing page. */
const targetLocales = locales.filter((l) => l !== defaultLocale);

export default async function TranslationsIndexPage(): Promise<JSX.Element> {
  await requireCapability("content.view");
  const models = await listTranslationModels();
  const dict = getAdminDict(await getAdminLocale());
  const t = dict.translations;
  const langs = targetLocales.map((l) => localeNames[l]).join(", ");

  return (
    <>
      <div className="admin-head">
        <h1>{t.title}</h1>
        <p>{t.intro(langs)}</p>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t.colContentType}</th>
              <th style={{ textAlign: "right" }}>{t.colRecords}</th>
              <th style={{ textAlign: "right" }}>{t.colTranslatedFields}</th>
              <th aria-hidden />
            </tr>
          </thead>
          <tbody>
            {models.map((m) => (
              <tr key={m.model}>
                <td>
                  <Link href={`/admin/translations/${m.model}`}>{m.label}</Link>
                </td>
                <td style={{ textAlign: "right" }}>{m.recordCount}</td>
                <td style={{ textAlign: "right" }}>{m.translationRows}</td>
                <td style={{ textAlign: "right" }}>
                  <Link className="admin-btn admin-btn--ghost" href={`/admin/translations/${m.model}`}>
                    {t.open}
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
