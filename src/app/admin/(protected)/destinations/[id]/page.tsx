import type { JSX } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCapability } from "@/server/auth/rbac";
import { getAdminDestination } from "@/server/admin/catalog-admin";
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

  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>{destination.name}</h1>
            <p>/{destination.slug} · {destination.tourCount} linked {destination.tourCount === 1 ? "tour" : "tours"}</p>
          </div>
          <Link className="admin-btn admin-btn--ghost" href="/admin/destinations">← All destinations</Link>
        </div>
      </div>

      <DestinationEditor destination={destination} />

      <section className="admin-card" style={{ borderColor: "rgba(154,92,27,0.4)" }}>
        <h2>Delete destination</h2>
        <p className="admin-card__meta">
          Removes this destination and unlinks it from any tours. The tours themselves are not deleted.
          {destination.tourCount > 0 ? ` Currently linked to ${destination.tourCount} ${destination.tourCount === 1 ? "tour" : "tours"}.` : ""}
        </p>
        <form action={deleteDestinationAction} style={{ marginTop: "0.5rem" }}>
          <input type="hidden" name="id" value={destination.id} />
          <button className="admin-btn admin-btn--danger" type="submit">Delete permanently</button>
        </form>
      </section>
    </>
  );
}
