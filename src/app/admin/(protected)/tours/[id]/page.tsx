import type { JSX } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCapability } from "@/server/auth/rbac";
import { getAdminTour, listDestinationOptions } from "@/server/admin/catalog-admin";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";
import TourEditor from "./TourEditor";
import ItinerarySection from "./ItinerarySection";
import DeparturesSection from "./DeparturesSection";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import {
  setTourStatusAction,
  deleteTourAction,
  linkDestinationAction,
  unlinkDestinationAction,
} from "../actions";

export const dynamic = "force-dynamic";

export default async function TourEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<JSX.Element> {
  await requireCapability("catalog.edit");
  const { id } = await params;
  const [tour, destOptions] = await Promise.all([getAdminTour(id), listDestinationOptions()]);
  if (!tour) notFound();

  const dict = getAdminDict(await getAdminLocale());
  const t = dict.tours;
  const linkedIds = new Set(tour.linkedDestinations.map((d) => d.destinationId));
  const available = destOptions.filter((d) => !linkedIds.has(d.id));

  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>{tour.title}</h1>
            <p>
              <span className={`admin-badge ${tour.status === "PUBLISHED" ? "admin-badge--gold" : "admin-badge--off"}`}>{t.statusLabels[tour.status] ?? tour.status}</span>
              {" "}/{tour.slug}
            </p>
          </div>
          <div className="admin-row" style={{ gap: "0.5rem" }}>
            <Link className="admin-btn admin-btn--ghost" href="/admin/tours">{t.backToList}</Link>
            {tour.status === "PUBLISHED" ? (
              <Link className="admin-btn admin-btn--ghost" href={`/tours/${tour.slug}`} target="_blank">{t.viewLive}</Link>
            ) : null}
          </div>
        </div>
      </div>

      {/* Status controls */}
      <div className="admin-card">
        <div className="admin-row" style={{ gap: "0.5rem", flexWrap: "wrap" }}>
          {tour.status !== "PUBLISHED" ? (
            <form action={setTourStatusAction}>
              <input type="hidden" name="id" value={tour.id} />
              <input type="hidden" name="status" value="PUBLISHED" />
              <button className="admin-btn" type="submit">{t.publish}</button>
            </form>
          ) : (
            <form action={setTourStatusAction}>
              <input type="hidden" name="id" value={tour.id} />
              <input type="hidden" name="status" value="DRAFT" />
              <button className="admin-btn admin-btn--ghost" type="submit">{t.unpublish}</button>
            </form>
          )}
          {tour.status !== "ARCHIVED" ? (
            <form action={setTourStatusAction}>
              <input type="hidden" name="id" value={tour.id} />
              <input type="hidden" name="status" value="ARCHIVED" />
              <button className="admin-btn admin-btn--ghost" type="submit">{t.archive}</button>
            </form>
          ) : null}
        </div>
        {tour.status !== "PUBLISHED" ? (
          <p className="admin-card__meta" style={{ marginTop: "0.6rem" }}>
            {t.statusNote(t.statusLabels[tour.status] ?? tour.status)}
          </p>
        ) : null}
      </div>

      <TourEditor tour={tour} fields={t.fields} faqLabels={t.faq} savedLabel={t.saved} savingLabel={dict.common.saving} saveLabel={t.saveTour} />

      {/* Destination links */}
      <section className="admin-card">
        <h2>{t.destinationsHeading}</h2>
        <p className="admin-card__meta">{t.destinationsHint}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
          {tour.linkedDestinations.length === 0 ? (
            <span className="admin-card__meta">{t.noneLinkedYet}</span>
          ) : (
            tour.linkedDestinations.map((d) => (
              <form key={d.destinationId} action={unlinkDestinationAction} className="admin-badge admin-badge--gold" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                <input type="hidden" name="tourId" value={tour.id} />
                <input type="hidden" name="destinationId" value={d.destinationId} />
                {d.name}
                <button type="submit" aria-label={t.removeAria(d.name)} style={{ border: "none", background: "none", cursor: "pointer", fontWeight: 700 }}>×</button>
              </form>
            ))
          )}
        </div>
        {available.length > 0 ? (
          <form action={linkDestinationAction} className="admin-row" style={{ gap: "0.5rem", marginTop: "0.75rem", alignItems: "flex-end" }}>
            <input type="hidden" name="tourId" value={tour.id} />
            <label className="admin-field" style={{ flex: "1 1 240px", marginBottom: 0 }}>
              <span>{t.addDestination}</span>
              <select className="admin-input" name="destinationId" defaultValue="">
                <option value="" disabled>{t.choose}</option>
                {available.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </label>
            <button className="admin-btn" type="submit">{t.link}</button>
          </form>
        ) : null}
      </section>

      <ItinerarySection tourId={tour.id} days={tour.itinerary} labels={t.itinerary} />

      <DeparturesSection tourId={tour.id} currency={tour.currency} departures={tour.departures} labels={t.departures} />

      {/* Danger zone */}
      <section className="admin-card admin-card--danger">
        <h2>{t.deleteHeading}</h2>
        <p className="admin-card__meta">
          {t.deleteHint}
        </p>
        <form action={deleteTourAction} style={{ marginTop: "0.5rem" }}>
          <input type="hidden" name="id" value={tour.id} />
          <ConfirmSubmitButton confirm={t.confirmDelete(tour.title)} pendingLabel={dict.common.deleting}>
            {dict.common.deletePermanently}
          </ConfirmSubmitButton>
        </form>
      </section>
    </>
  );
}
