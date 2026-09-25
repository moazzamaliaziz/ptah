import type { JSX } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCapability } from "@/server/auth/rbac";
import { LANDING_SECTIONS, getLandingSection } from "@/server/content";
import type { LandingSectionKey } from "@/content/landing-schema";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";
import ContentEditor from "./ContentEditor";
import { resetContentAction } from "../actions";

function isSectionKey(key: string): key is LandingSectionKey {
  return Object.prototype.hasOwnProperty.call(LANDING_SECTIONS, key);
}

export default async function ContentEditorPage({
  params,
}: {
  params: Promise<{ key: string }>;
}): Promise<JSX.Element> {
  await requireCapability("content.edit");
  const { key } = await params;
  if (!isSectionKey(key)) notFound();

  const section = await getLandingSection(key);
  const dict = getAdminDict(await getAdminLocale());
  const t = dict.content;

  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>{t.sectionLabels[section.key] ?? section.label}</h1>
            <p>{t.editSubtitle}</p>
          </div>
          <Link className="admin-btn admin-btn--ghost" href="/admin/content">
            {t.backToList}
          </Link>
        </div>
        <span className={`admin-badge ${section.overridden ? "admin-badge--gold" : "admin-badge--off"}`}>
          {section.overridden ? t.badgeCurrentlyOverridden : t.badgeServingDefault}
        </span>
      </div>

      <ContentEditor
        sectionKey={section.key}
        initialJson={section.json}
        labels={{
          saved: t.savedNote,
          save: t.saveOverride,
          saving: dict.common.saving,
          payloadAria: t.payloadAria(section.key),
        }}
      />

      {section.overridden ? (
        <form action={resetContentAction} style={{ marginTop: "1rem" }}>
          <input type="hidden" name="key" value={section.key} />
          <button className="admin-btn admin-btn--danger" type="submit">
            {t.resetToDefault}
          </button>
        </form>
      ) : null}
    </>
  );
}
