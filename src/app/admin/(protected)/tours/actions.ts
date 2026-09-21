"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCapability } from "@/server/auth/rbac";
import { writeAudit } from "@/server/audit";
import {
  createTour,
  updateTour,
  setTourStatus,
  deleteTour,
  addItineraryDay,
  updateItineraryDay,
  deleteItineraryDay,
  addDeparture,
  updateDeparture,
  deleteDeparture,
  linkDestination,
  unlinkDestination,
} from "@/server/admin/catalog-admin";
import {
  dollarsToCents,
  splitLines,
  emptyToNull,
  type FaqItem,
} from "@/content/catalog-admin-schema";

export type CatalogFormState = { ok?: boolean; error?: string };

const str = (fd: FormData, key: string): string => String(fd.get(key) ?? "");

/** Parse the FAQ hidden field (JSON array of {q,a}); tolerate empty/invalid → []. */
function parseFaqs(raw: string): FaqItem[] {
  if (!raw.trim()) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item) => {
      if (item && typeof item === "object" && !Array.isArray(item)) {
        const { q, a } = item as Record<string, unknown>;
        if (typeof q === "string" && typeof a === "string") return [{ q, a }];
      }
      return [];
    });
  } catch {
    return [];
  }
}

/**
 * Flatten a tour editor FormData into the raw object tourInputSchema validates.
 * Money arrives in major units; multi-line fields as textareas; FAQs as JSON.
 * A price that can't parse becomes NaN so zod rejects it with a field error.
 */
function readTourInput(fd: FormData): Record<string, unknown> {
  const cents = dollarsToCents(str(fd, "basePrice"));
  const ctaLabel = emptyToNull(str(fd, "ctaLabel"));
  const ctaHref = emptyToNull(str(fd, "ctaHref"));
  return {
    slug: str(fd, "slug"),
    title: str(fd, "title"),
    summary: str(fd, "summary"),
    descriptionLong: str(fd, "descriptionLong"),
    durationDays: Number.parseInt(str(fd, "durationDays"), 10),
    basePriceCents: cents ?? Number.NaN,
    currency: str(fd, "currency") || "USD",
    difficulty: str(fd, "difficulty"),
    // Checkbox group: each checked box posts its value under "tags".
    tags: fd.getAll("tags").map((v) => String(v)),
    heroImage: emptyToNull(str(fd, "heroImage")),
    gallery: splitLines(str(fd, "gallery")),
    inclusions: splitLines(str(fd, "inclusions")),
    exclusions: splitLines(str(fd, "exclusions")),
    faqs: parseFaqs(str(fd, "faqs")),
    travelNotes: splitLines(str(fd, "travelNotes")),
    ctaLabel,
    ctaHref,
    metaTitle: emptyToNull(str(fd, "metaTitle")),
    metaDesc: emptyToNull(str(fd, "metaDesc")),
    ogImage: emptyToNull(str(fd, "ogImage")),
  };
}

function revalidateTour(id?: string): void {
  revalidatePath("/admin/tours");
  revalidatePath("/tours");
  if (id) revalidatePath(`/admin/tours/${id}`);
}

/** Create a DRAFT tour, then redirect into its full editor. */
export async function createTourAction(_prev: CatalogFormState, fd: FormData): Promise<CatalogFormState> {
  const user = await requireCapability("catalog.edit");
  const result = await createTour(readTourInput(fd));
  if (!result.ok) return { error: result.error };
  await writeAudit({ actorId: user.id, action: "tour.create", entity: "tour", entityId: result.value });
  revalidateTour(result.value);
  redirect(`/admin/tours/${result.value}`);
}

export async function updateTourAction(_prev: CatalogFormState, fd: FormData): Promise<CatalogFormState> {
  const user = await requireCapability("catalog.edit");
  const id = str(fd, "id");
  const result = await updateTour(id, readTourInput(fd));
  if (!result.ok) return { error: result.error };
  await writeAudit({ actorId: user.id, action: "tour.update", entity: "tour", entityId: id });
  revalidateTour(id);
  revalidatePath(`/tours/${str(fd, "slug")}`);
  return { ok: true };
}

export async function setTourStatusAction(fd: FormData): Promise<void> {
  const user = await requireCapability("catalog.edit");
  const id = str(fd, "id");
  const status = str(fd, "status");
  const result = await setTourStatus(id, status);
  if (result.ok) {
    await writeAudit({ actorId: user.id, action: "tour.status", entity: "tour", entityId: id, meta: { status } });
    revalidateTour(id);
    revalidatePath("/");
  }
}

export async function deleteTourAction(fd: FormData): Promise<void> {
  const user = await requireCapability("catalog.edit");
  const id = str(fd, "id");
  const result = await deleteTour(id);
  await writeAudit({
    actorId: user.id,
    action: "tour.delete",
    entity: "tour",
    entityId: id,
    meta: { ok: result.ok },
  });
  revalidateTour();
  if (result.ok) redirect("/admin/tours");
}

// ── Itinerary ────────────────────────────────────────────────────────────────

function readItinerary(fd: FormData): Record<string, unknown> {
  return {
    dayNumber: Number.parseInt(str(fd, "dayNumber"), 10),
    title: str(fd, "title"),
    description: str(fd, "description"),
  };
}

export async function addItineraryDayAction(_prev: CatalogFormState, fd: FormData): Promise<CatalogFormState> {
  const user = await requireCapability("catalog.edit");
  const tourId = str(fd, "tourId");
  const result = await addItineraryDay(tourId, readItinerary(fd));
  if (!result.ok) return { error: result.error };
  await writeAudit({ actorId: user.id, action: "tour.itinerary.add", entity: "tour", entityId: tourId });
  revalidateTour(tourId);
  return { ok: true };
}

export async function updateItineraryDayAction(_prev: CatalogFormState, fd: FormData): Promise<CatalogFormState> {
  const user = await requireCapability("catalog.edit");
  const tourId = str(fd, "tourId");
  const dayId = str(fd, "dayId");
  const result = await updateItineraryDay(tourId, dayId, readItinerary(fd));
  if (!result.ok) return { error: result.error };
  await writeAudit({ actorId: user.id, action: "tour.itinerary.update", entity: "itinerary_day", entityId: dayId });
  revalidateTour(tourId);
  return { ok: true };
}

export async function deleteItineraryDayAction(fd: FormData): Promise<void> {
  const user = await requireCapability("catalog.edit");
  const tourId = str(fd, "tourId");
  const dayId = str(fd, "dayId");
  const result = await deleteItineraryDay(tourId, dayId);
  if (result.ok) {
    await writeAudit({ actorId: user.id, action: "tour.itinerary.delete", entity: "itinerary_day", entityId: dayId });
    revalidateTour(tourId);
  }
}

// ── Departures ─────────────────────────────────────────────────────────────────

function readDeparture(fd: FormData): Record<string, unknown> {
  const override = dollarsToCents(str(fd, "priceOverride"));
  const overrideRaw = str(fd, "priceOverride").trim();
  return {
    startDate: str(fd, "startDate"),
    endDate: str(fd, "endDate"),
    maxCapacity: Number.parseInt(str(fd, "maxCapacity"), 10),
    // Blank override → null (inherit base price); a non-blank unparseable value → NaN (rejected).
    priceOverrideCents: overrideRaw === "" ? null : (override ?? Number.NaN),
    status: str(fd, "status"),
  };
}

export async function addDepartureAction(_prev: CatalogFormState, fd: FormData): Promise<CatalogFormState> {
  const user = await requireCapability("catalog.edit");
  const tourId = str(fd, "tourId");
  const result = await addDeparture(tourId, readDeparture(fd));
  if (!result.ok) return { error: result.error };
  await writeAudit({ actorId: user.id, action: "tour.departure.add", entity: "tour", entityId: tourId });
  revalidateTour(tourId);
  return { ok: true };
}

export async function updateDepartureAction(_prev: CatalogFormState, fd: FormData): Promise<CatalogFormState> {
  const user = await requireCapability("catalog.edit");
  const tourId = str(fd, "tourId");
  const departureId = str(fd, "departureId");
  const result = await updateDeparture(tourId, departureId, readDeparture(fd));
  if (!result.ok) return { error: result.error };
  await writeAudit({ actorId: user.id, action: "tour.departure.update", entity: "tour_departure", entityId: departureId });
  revalidateTour(tourId);
  return { ok: true };
}

export async function deleteDepartureAction(fd: FormData): Promise<void> {
  const user = await requireCapability("catalog.edit");
  const tourId = str(fd, "tourId");
  const departureId = str(fd, "departureId");
  const result = await deleteDeparture(tourId, departureId);
  if (result.ok) {
    await writeAudit({ actorId: user.id, action: "tour.departure.delete", entity: "tour_departure", entityId: departureId });
    revalidateTour(tourId);
  }
}

// ── Destination links ────────────────────────────────────────────────────────

export async function linkDestinationAction(fd: FormData): Promise<void> {
  const user = await requireCapability("catalog.edit");
  const tourId = str(fd, "tourId");
  const destinationId = str(fd, "destinationId");
  const result = await linkDestination(tourId, destinationId);
  if (result.ok) {
    await writeAudit({ actorId: user.id, action: "tour.destination.link", entity: "tour", entityId: tourId, meta: { destinationId } });
    revalidateTour(tourId);
  }
}

export async function unlinkDestinationAction(fd: FormData): Promise<void> {
  const user = await requireCapability("catalog.edit");
  const tourId = str(fd, "tourId");
  const destinationId = str(fd, "destinationId");
  await unlinkDestination(tourId, destinationId);
  await writeAudit({ actorId: user.id, action: "tour.destination.unlink", entity: "tour", entityId: tourId, meta: { destinationId } });
  revalidateTour(tourId);
}
