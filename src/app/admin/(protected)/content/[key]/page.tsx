import type { JSX } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCapability } from "@/server/auth/rbac";
import { LANDING_SECTIONS, getLandingSection } from "@/server/content";
import type { LandingSectionKey } from "@/content/landing-schema";
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

  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>{section.label}</h1>
            <p>
              Edit the section payload as JSON. It is validated against the section schema on save; an invalid
              shape is rejected and the current content is kept.
            </p>
          </div>
          <Link className="admin-btn admin-btn--ghost" href="/admin/content">
            ← All sections
          </Link>
        </div>
        <span className={`admin-badge ${section.overridden ? "admin-badge--gold" : "admin-badge--off"}`}>
          {section.overridden ? "Currently overridden" : "Serving default"}
        </span>
      </div>

      <ContentEditor sectionKey={section.key} initialJson={section.json} />

      {section.overridden ? (
        <form action={resetContentAction} style={{ marginTop: "1rem" }}>
          <input type="hidden" name="key" value={section.key} />
          <button className="admin-btn admin-btn--danger" type="submit">
            Reset to default
          </button>
        </form>
      ) : null}
    </>
  );
}
