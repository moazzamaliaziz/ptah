import type { JSX } from "react";
import Link from "next/link";
import { requireCapability } from "@/server/auth/rbac";
import { listTranslationModels } from "@/server/admin/translations-admin";
import { locales, defaultLocale, localeNames } from "@/i18n/config";

export const dynamic = "force-dynamic";

/** Non-English target languages, shown as a hint on the landing page. */
const targetLocales = locales.filter((l) => l !== defaultLocale);

export default async function TranslationsIndexPage(): Promise<JSX.Element> {
  await requireCapability("content.view");
  const models = await listTranslationModels();

  return (
    <>
      <div className="admin-head">
        <h1>Translations</h1>
        <p>
          English is the source — you write it on each Tour, Event, etc. Here you add the{" "}
          {targetLocales.map((l) => localeNames[l]).join(", ")} versions. Anything you leave blank
          simply shows the English text on the public site.
        </p>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Content type</th>
              <th style={{ textAlign: "right" }}>Records</th>
              <th style={{ textAlign: "right" }}>Translated fields</th>
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
                    Open →
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
