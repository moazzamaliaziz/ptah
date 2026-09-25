import type { JSX } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCapability } from "@/server/auth/rbac";
import { getAdminDestination } from "@/server/admin/catalog-admin";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";
import DestinationEditor from "../DestinationEditor";
import { deleteDestinationAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function DestinationEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<JSX.Element> {
  await requireCapability("catalog.edit");
  const { id } = await params;
  const destination = await getAdminDestination(id);
  if (!destination) notFound();

  const dict = getAdminDict(await getAdminLocale());
  const t = dict.destinations;

  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>{destination.name}</h1>
            <p>/{destination.slug} · {t.linkedTours(destination.tourCount)}</p>
          </div>
          <Link className="admin-btn admin-btn--ghost" href="/admin/destinations">{t.backToList}</Link>
        </div>
      </div>

      <DestinationEditor destination={destination} labels={t.form} savingLabel={dict.common.saving} />

      <section className="admin-card" style={{ borderColor: "rgba(154,92,27,0.4)" }}>
        <h2>{t.deleteHeading}</h2>
        <p className="admin-card__meta">
          {t.deleteHint}
          {destination.tourCount > 0 ? t.currentlyLinked(destination.tourCount) : ""}
        </p>
        <form action={deleteDestinationAction} style={{ marginTop: "0.5rem" }}>
          <input type="hidden" name="id" value={destination.id} />
          <button className="admin-btn admin-btn--danger" type="submit">{dict.common.deletePermanently}</button>
        </form>
      </section>
    </>
  );
}
