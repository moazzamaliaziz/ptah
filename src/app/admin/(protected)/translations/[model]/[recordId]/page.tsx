import type { JSX } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCapability } from "@/server/auth/rbac";
import { getTranslatableRecord } from "@/server/admin/translations-admin";
import { getTranslatableModel } from "@/content/translatable-fields";
import { locales, defaultLocale, localeNames, toLocale } from "@/i18n/config";
import TranslationEditor from "./TranslationEditor";

export const dynamic = "force-dynamic";

/** Languages you can translate INTO (English is the source, never a target). */
const targetLocales = locales.filter((l) => l !== defaultLocale);

export default async function TranslationEditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ model: string; recordId: string }>;
  searchParams: Promise<{ locale?: string }>;
}): Promise<JSX.Element> {
  await requireCapability("content.view");
  const { model, recordId } = await params;
  const { locale: rawLocale } = await searchParams;

  const def = getTranslatableModel(model);
  if (!def) notFound();

  // Coerce ?locale to a supported target; English (the source) is never a
  // target, so it falls back to the first non-English language.
  const coerced = toLocale(rawLocale);
  const locale = coerced === defaultLocale ? targetLocales[0]! : coerced;

  const record = await getTranslatableRecord(model, recordId, locale);
  if (!record) notFound();

  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>{record.recordLabel}</h1>
            <p>
              {record.modelSingular}
              {record.sublabel ? ` · ${record.sublabel}` : ""} — translating into{" "}
              <strong>{localeNames[locale]}</strong>
            </p>
          </div>
          <Link className="admin-btn admin-btn--ghost" href={`/admin/translations/${model}`}>
            ← All {def.label.toLowerCase()}
          </Link>
        </div>
      </div>

      {/* Language switcher — same record, different target language. */}
      <div className="admin-card">
        <div className="admin-row" style={{ gap: "0.4rem", flexWrap: "wrap" }}>
          {targetLocales.map((l) => (
            <Link
              key={l}
              className={`admin-btn ${l === locale ? "" : "admin-btn--ghost"}`}
              href={`/admin/translations/${model}/${recordId}?locale=${l}`}
            >
              {localeNames[l]}
            </Link>
          ))}
        </div>
        <p className="admin-card__meta" style={{ marginTop: "0.6rem" }}>
          Leave a box empty to use the English text on the public site. The grey text under each box
          is the English source, for reference.
        </p>
      </div>

      <TranslationEditor record={record} />
    </>
  );
}
