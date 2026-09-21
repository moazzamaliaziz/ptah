import type { JSX } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCapability } from "@/server/auth/rbac";
import { getAdminTripIdea, listTourOptions } from "@/server/admin/events-admin";
import TripIdeaEditor from "../TripIdeaEditor";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
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

  const linkedIds = new Set(idea.linkedTours.map((t) => t.tourId));
  const available = tourOptions.filter((t) => !linkedIds.has(t.id));

  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>{idea.title}</h1>
            <p>
              <span className={`admin-badge ${idea.status === "PUBLISHED" ? "admin-badge--gold" : "admin-badge--off"}`}>{idea.status}</span>
              {" "}/{idea.slug}
            </p>
          </div>
          <div className="admin-row" style={{ gap: "0.5rem" }}>
            <Link className="admin-btn admin-btn--ghost" href="/admin/trip-ideas">← All trip ideas</Link>
            {idea.status === "PUBLISHED" ? (
              <Link className="admin-btn admin-btn--ghost" href={`/trip-ideas/${idea.slug}`} target="_blank">View live ↗</Link>
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
              <button className="admin-btn" type="submit">Publish</button>
            </form>
          ) : (
            <form action={setTripIdeaStatusAction}>
              <input type="hidden" name="id" value={idea.id} />
              <input type="hidden" name="status" value="DRAFT" />
              <button className="admin-btn admin-btn--ghost" type="submit">Unpublish (→ draft)</button>
            </form>
          )}
          {idea.status !== "ARCHIVED" ? (
            <form action={setTripIdeaStatusAction}>
              <input type="hidden" name="id" value={idea.id} />
              <input type="hidden" name="status" value="ARCHIVED" />
              <button className="admin-btn admin-btn--ghost" type="submit">Archive</button>
            </form>
          ) : null}
        </div>
        {idea.status !== "PUBLISHED" ? (
          <p className="admin-card__meta" style={{ marginTop: "0.6rem" }}>
            This trip idea is <strong>{idea.status.toLowerCase()}</strong> — its content is saved but only appears
            on the public <Link href="/trip-ideas">/trip-ideas</Link> page once you <strong>Publish</strong>.
          </p>
        ) : null}
      </div>

      <TripIdeaEditor idea={idea} />

      {/* Curated tours (hybrid model) */}
      <section className="admin-card">
        <h2>Curated tours</h2>
        <p className="admin-card__meta">
          Hand-picked tours shown under the editorial intro. Only <strong>published</strong> tours appear on the
          public page, even if linked here.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
          {idea.linkedTours.length === 0 ? (
            <span className="admin-card__meta">No tours linked yet.</span>
          ) : (
            idea.linkedTours.map((t) => (
              <form key={t.tourId} action={unlinkTripIdeaTourAction} className="admin-badge admin-badge--gold" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                <input type="hidden" name="tripIdeaId" value={idea.id} />
                <input type="hidden" name="tourId" value={t.tourId} />
                {t.title}
                <button type="submit" aria-label={`Remove ${t.title}`} style={{ border: "none", background: "none", cursor: "pointer", fontWeight: 700 }}>×</button>
              </form>
            ))
          )}
        </div>
        {available.length > 0 ? (
          <form action={linkTripIdeaTourAction} className="admin-row" style={{ gap: "0.5rem", marginTop: "0.75rem", alignItems: "flex-end" }}>
            <input type="hidden" name="tripIdeaId" value={idea.id} />
            <label className="admin-field" style={{ flex: "1 1 240px", marginBottom: 0 }}>
              <span>Add tour</span>
              <select className="admin-input" name="tourId" defaultValue="">
                <option value="" disabled>Choose…</option>
                {available.map((t) => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </label>
            <button className="admin-btn" type="submit">Link</button>
          </form>
        ) : (
          <p className="admin-card__meta" style={{ marginTop: "0.75rem" }}>All tours are already linked.</p>
        )}
      </section>

      {/* Danger zone */}
      <section className="admin-card" style={{ borderColor: "rgba(154,92,27,0.4)" }}>
        <h2>Delete trip idea</h2>
        <p className="admin-card__meta">Permanently removes this trip idea and its tour links. The tours themselves are not affected. This cannot be undone.</p>
        <form action={deleteTripIdeaAction} style={{ marginTop: "0.5rem" }}>
          <input type="hidden" name="id" value={idea.id} />
          <ConfirmSubmitButton confirm={`Delete "${idea.title}" permanently? This cannot be undone.`} pendingLabel="Deleting…">
            Delete permanently
          </ConfirmSubmitButton>
        </form>
      </section>
    </>
  );
}
