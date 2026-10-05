import type { JSX } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCapability } from "@/server/auth/rbac";
import { getAdminTripIdea, listTourOptions } from "@/server/admin/events-admin";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";
import TripIdeaEditor from "../TripIdeaEditor";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import SubmitButton from "@/components/admin/SubmitButton";
import {
  setTripIdeaStatusAction,
  deleteTripIdeaAction,
  linkTripIdeaTourAction,
  unlinkTripIdeaTourAction,
} from "../actions";

export const dynamic = "force-dynamic";

export default async function TripIdeaEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<JSX.Element> {
  await requireCapability("tripideas.edit");
  const { id } = await params;
  const [idea, tourOptions] = await Promise.all([getAdminTripIdea(id), listTourOptions()]);
  if (!idea) notFound();

  const dict = getAdminDict(await getAdminLocale());
  const t = dict.tripIdeas;
  const linkedIds = new Set(idea.linkedTours.map((tour) => tour.tourId));
  const available = tourOptions.filter((tour) => !linkedIds.has(tour.id));

  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>{idea.title}</h1>
            <p>
              <span className={`admin-badge ${idea.status === "PUBLISHED" ? "admin-badge--gold" : "admin-badge--off"}`}>{t.statusLabels[idea.status] ?? idea.status}</span>
              {" "}/{idea.slug}
            </p>
          </div>
          <div className="admin-row" style={{ gap: "0.5rem" }}>
            <Link className="admin-btn admin-btn--ghost" href="/admin/trip-ideas">{t.backToList}</Link>
            {idea.status === "PUBLISHED" ? (
              <Link className="admin-btn admin-btn--ghost" href={`/trip-ideas/${idea.slug}`} target="_blank">{t.viewLive}</Link>
            ) : null}
          </div>
        </div>
      </div>

      {/* Status controls */}
      <div className="admin-card">
        <div className="admin-row" style={{ gap: "0.5rem", flexWrap: "wrap" }}>
          {idea.status !== "PUBLISHED" ? (
            <form action={setTripIdeaStatusAction}>
              <input type="hidden" name="id" value={idea.id} />
              <input type="hidden" name="status" value="PUBLISHED" />
              <SubmitButton pendingLabel={dict.common.publishing}>{t.publish}</SubmitButton>
            </form>
          ) : (
            <form action={setTripIdeaStatusAction}>
              <input type="hidden" name="id" value={idea.id} />
              <input type="hidden" name="status" value="DRAFT" />
              <SubmitButton className="admin-btn admin-btn--ghost" pendingLabel={dict.common.unpublishing}>{t.unpublish}</SubmitButton>
            </form>
          )}
          {idea.status !== "ARCHIVED" ? (
            <form action={setTripIdeaStatusAction}>
              <input type="hidden" name="id" value={idea.id} />
              <input type="hidden" name="status" value="ARCHIVED" />
              <SubmitButton className="admin-btn admin-btn--ghost" pendingLabel={dict.common.archiving}>{t.archive}</SubmitButton>
            </form>
          ) : null}
        </div>
        {idea.status !== "PUBLISHED" ? (
          <p className="admin-card__meta" style={{ marginTop: "0.6rem" }}>
            {t.statusNotePre(t.statusLabels[idea.status] ?? idea.status)}
            <Link href="/trip-ideas">/trip-ideas</Link>
            {t.statusNotePost}
          </p>
        ) : null}
      </div>

      <TripIdeaEditor idea={idea} fields={t.fields} savedLabel={t.saved} savingLabel={dict.common.saving} saveLabel={dict.common.saveChanges} />

      {/* Curated tours (hybrid model) */}
      <section className="admin-card">
        <h2>{t.curatedHeading}</h2>
        <p className="admin-card__meta">{t.curatedHint}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
          {idea.linkedTours.length === 0 ? (
            <span className="admin-card__meta">{t.noToursLinked}</span>
          ) : (
            idea.linkedTours.map((tour) => (
              <form key={tour.tourId} action={unlinkTripIdeaTourAction} className="admin-badge admin-badge--gold" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                <input type="hidden" name="tripIdeaId" value={idea.id} />
                <input type="hidden" name="tourId" value={tour.tourId} />
                {tour.title}
                <SubmitButton className="admin-inline-x" ariaLabel={t.removeAria(tour.title)} pendingLabel="…">×</SubmitButton>
              </form>
            ))
          )}
        </div>
        {available.length > 0 ? (
          <form action={linkTripIdeaTourAction} className="admin-row" style={{ gap: "0.5rem", marginTop: "0.75rem", alignItems: "flex-end" }}>
            <input type="hidden" name="tripIdeaId" value={idea.id} />
            <label className="admin-field" style={{ flex: "1 1 240px", marginBottom: 0 }}>
              <span>{t.addTour}</span>
              <select className="admin-input" name="tourId" defaultValue="">
                <option value="" disabled>{t.choose}</option>
                {available.map((tour) => (
                  <option key={tour.id} value={tour.id}>{tour.title}</option>
                ))}
              </select>
            </label>
            <SubmitButton pendingLabel={dict.common.linking}>{t.link}</SubmitButton>
          </form>
        ) : (
          <p className="admin-card__meta" style={{ marginTop: "0.75rem" }}>{t.allLinked}</p>
        )}
      </section>

      {/* Danger zone */}
      <section className="admin-card" style={{ borderColor: "rgba(154,92,27,0.4)" }}>
        <h2>{t.deleteHeading}</h2>
        <p className="admin-card__meta">{t.deleteHint}</p>
        <form action={deleteTripIdeaAction} style={{ marginTop: "0.5rem" }}>
          <input type="hidden" name="id" value={idea.id} />
          <ConfirmSubmitButton confirm={t.confirmDelete(idea.title)} pendingLabel={dict.common.deleting}>
            {dict.common.deletePermanently}
          </ConfirmSubmitButton>
        </form>
      </section>
    </>
  );
}
