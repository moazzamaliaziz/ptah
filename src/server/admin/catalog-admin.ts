/**
 * Catalog admin service (Phase 7 — Subsystem 2). Server-only write layer for
 * managing tours + destinations from the admin panel. The public read layer
 * (src/server/catalog.ts) stays the source of truth for what customers see;
 * this module owns staff mutations.
 *
 * Conventions (mirrors content.ts):
 *   • Returns plain view-models / discriminated `MutationResult`s — no Prisma
 *     types leak to callers, invalid input is a friendly error, not a throw.
 *   • Authorization (`catalog.edit`) + audit are the caller's (server action)
 *     responsibility; this module validates shape + business rules.
 *   • Money stays integer cents. Slugs are unique — a friendly pre-check plus a
 *     P2002 backstop.
 *   • Delete guards: a tour/departure with paid-or-pending bookings is never
 *     hard-deleted (schema onDelete: Restrict would throw); we reject first with
 *     an explanation so the UI can tell the editor to cancel bookings instead.
 */
import "server-only";
import type { Prisma } from "@prisma/client";
import type { z } from "zod";
import { db } from "@/lib/db";
import {
  tourInputSchema,
  destinationInputSchema,
  itineraryDaySchema,
  departureInputSchema,
  type TourInput,
  type DestinationInput,
  type ItineraryDayInput,
} from "@/content/catalog-admin-schema";
import { isTourTag, type TourTag } from "@/content/tour-tags";

export type MutationResult<T = void> =
  | ({ ok: true } & (T extends void ? object : { value: T }))
  | { ok: false; error: string };

function ok<T>(value: T): { ok: true; value: T } {
  return { ok: true, value };
}
function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

/** Map a Json array column to a plain string[] (never trust the DB shape). */
function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}
/** Map a Json array column to known TourTag[] (drops anything not in the vocab). */
function toTagArray(value: unknown): TourTag[] {
  return Array.isArray(value) ? value.filter((v): v is TourTag => typeof v === "string" && isTourTag(v)) : [];
}
function toFaqArray(value: unknown): { q: string; a: string }[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (item && typeof item === "object" && !Array.isArray(item)) {
      const { q, a } = item as Record<string, unknown>;
      if (typeof q === "string" && typeof a === "string") return [{ q, a }];
    }
    return [];
  });
}

// ── Tours: list + read ─────────────────────────────────────────────────────────

export interface AdminTourRow {
  id: string;
  slug: string;
  title: string;
  status: string;
  basePriceCents: number;
  currency: string;
  durationDays: number;
  departureCount: number;
  destinationNames: string[];
  updatedAt: Date;
}

/** Every tour (all statuses), newest-updated first — the admin list. */
export async function listAdminTours(): Promise<AdminTourRow[]> {
  const tours = await db.tour.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
      basePriceCents: true,
      currency: true,
      durationDays: true,
      updatedAt: true,
      destinations: {
        orderBy: { sortOrder: "asc" },
        select: { destination: { select: { name: true } } },
      },
      _count: { select: { departures: true } },
    },
  });
  return tours.map((t) => ({
    id: t.id,
    slug: t.slug,
    title: t.title,
    status: t.status,
    basePriceCents: t.basePriceCents,
    currency: t.currency,
    durationDays: t.durationDays,
    departureCount: t._count.departures,
    destinationNames: t.destinations.map((d) => d.destination.name),
    updatedAt: t.updatedAt,
  }));
}

export interface AdminTourDetail extends TourInput {
  id: string;
  status: string;
  itinerary: (ItineraryDayInput & { id: string; sortOrder: number })[];
  departures: {
    id: string;
    startDate: string;
    endDate: string;
    maxCapacity: number;
    remainingCapacity: number;
    bookedSeats: number;
    priceOverrideCents: number | null;
    status: string;
  }[];
  linkedDestinations: { destinationId: string; name: string; slug: string; sortOrder: number }[];
}

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Full editable detail for one tour (any status), or null. */
export async function getAdminTour(id: string): Promise<AdminTourDetail | null> {
  const t = await db.tour.findUnique({
    where: { id },
    select: {
      id: true, slug: true, title: true, summary: true, descriptionLong: true,
      durationDays: true, basePriceCents: true, currency: true, difficulty: true,
      heroImage: true, tags: true, gallery: true, inclusions: true, exclusions: true,
      faqs: true, travelNotes: true, ctaLabel: true, ctaHref: true,
      metaTitle: true, metaDesc: true, ogImage: true, status: true,
      itinerary: {
        orderBy: [{ sortOrder: "asc" }, { dayNumber: "asc" }],
        select: { id: true, dayNumber: true, title: true, description: true, sortOrder: true },
      },
      departures: {
        orderBy: { startDate: "asc" },
        select: {
          id: true, startDate: true, endDate: true, maxCapacity: true,
          remainingCapacity: true, priceOverrideCents: true, status: true,
          _count: { select: { bookings: true } },
        },
      },
      destinations: {
        orderBy: { sortOrder: "asc" },
        select: { destinationId: true, sortOrder: true, destination: { select: { name: true, slug: true } } },
      },
    },
  });
  if (!t) return null;
  return {
    id: t.id,
    slug: t.slug,
    title: t.title,
    summary: t.summary,
    descriptionLong: t.descriptionLong,
    durationDays: t.durationDays,
    basePriceCents: t.basePriceCents,
    currency: t.currency,
    difficulty: t.difficulty,
    heroImage: t.heroImage,
    tags: toTagArray(t.tags),
    gallery: toStringArray(t.gallery),
    inclusions: toStringArray(t.inclusions),
    exclusions: toStringArray(t.exclusions),
    faqs: toFaqArray(t.faqs),
    travelNotes: toStringArray(t.travelNotes),
    ctaLabel: t.ctaLabel,
    ctaHref: t.ctaHref,
    metaTitle: t.metaTitle,
    metaDesc: t.metaDesc,
    ogImage: t.ogImage,
    status: t.status,
    itinerary: t.itinerary.map((d) => ({
      id: d.id, dayNumber: d.dayNumber, title: d.title, description: d.description, sortOrder: d.sortOrder,
    })),
    departures: t.departures.map((d) => ({
      id: d.id,
      startDate: toIsoDate(d.startDate),
      endDate: toIsoDate(d.endDate),
      maxCapacity: d.maxCapacity,
      remainingCapacity: d.remainingCapacity,
      bookedSeats: d.maxCapacity - d.remainingCapacity,
      priceOverrideCents: d.priceOverrideCents,
      status: d.status,
    })),
    linkedDestinations: t.destinations.map((d) => ({
      destinationId: d.destinationId,
      name: d.destination.name,
      slug: d.destination.slug,
      sortOrder: d.sortOrder,
    })),
  };
}

// ── Tours: create / update / status / delete ────────────────────────────────────

/**
 * The scalar/Json write payload for a tour. Explicit plain shape (not a Prisma
 * *CreateInput) so it is assignable to BOTH create and update `data` — a Prisma
 * UncheckedCreateInput carries optional relation-create props that don't match
 * UncheckedUpdateInput, which would break reuse across create + update.
 */
interface TourWriteData {
  slug: string;
  title: string;
  summary: string;
  descriptionLong: string;
  durationDays: number;
  basePriceCents: number;
  currency: string;
  difficulty: TourInput["difficulty"];
  heroImage: string | null;
  tags: Prisma.InputJsonValue;
  gallery: Prisma.InputJsonValue;
  inclusions: Prisma.InputJsonValue;
  exclusions: Prisma.InputJsonValue;
  faqs: Prisma.InputJsonValue;
  travelNotes: Prisma.InputJsonValue;
  ctaLabel: string | null;
  ctaHref: string | null;
  metaTitle: string | null;
  metaDesc: string | null;
  ogImage: string | null;
}

/** Persist the D3 Json fields + scalars from a validated TourInput. */
function tourWriteData(input: TourInput): TourWriteData {
  return {
    slug: input.slug,
    title: input.title,
    summary: input.summary,
    descriptionLong: input.descriptionLong,
    durationDays: input.durationDays,
    basePriceCents: input.basePriceCents,
    currency: input.currency,
    difficulty: input.difficulty,
    heroImage: input.heroImage,
    tags: input.tags as Prisma.InputJsonValue,
    gallery: input.gallery as Prisma.InputJsonValue,
    inclusions: input.inclusions as Prisma.InputJsonValue,
    exclusions: input.exclusions as Prisma.InputJsonValue,
    faqs: input.faqs as Prisma.InputJsonValue,
    travelNotes: input.travelNotes as Prisma.InputJsonValue,
    ctaLabel: input.ctaLabel,
    ctaHref: input.ctaHref,
    metaTitle: input.metaTitle,
    metaDesc: input.metaDesc,
    ogImage: input.ogImage,
  };
}

function firstIssue(error: z.ZodError): string {
  const i = error.issues[0];
  return i ? `${i.path.join(".") || "form"}: ${i.message}` : "Invalid input.";
}

/** Create a DRAFT tour. Returns the new id for a redirect to its editor. */
export async function createTour(raw: unknown): Promise<MutationResult<string>> {
  const parsed = tourInputSchema.safeParse(raw);
  if (!parsed.success) return fail(firstIssue(parsed.error));

  const existing = await db.tour.findUnique({ where: { slug: parsed.data.slug }, select: { id: true } });
  if (existing) return fail(`A tour with the slug "${parsed.data.slug}" already exists.`);

  try {
    const created = await db.tour.create({
      data: { ...tourWriteData(parsed.data), status: "DRAFT" },
      select: { id: true },
    });
    return ok(created.id);
  } catch {
    return fail("Could not create the tour (the slug may already be taken).");
  }
}

/** Update an existing tour's editable core (status is changed separately). */
export async function updateTour(id: string, raw: unknown): Promise<MutationResult> {
  const parsed = tourInputSchema.safeParse(raw);
  if (!parsed.success) return fail(firstIssue(parsed.error));

  const clash = await db.tour.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
    select: { id: true },
  });
  if (clash) return fail(`Another tour already uses the slug "${parsed.data.slug}".`);

  const found = await db.tour.findUnique({ where: { id }, select: { id: true } });
  if (!found) return fail("Tour not found.");

  await db.tour.update({ where: { id }, data: tourWriteData(parsed.data) });
  return { ok: true };
}

const ALLOWED_STATUSES = new Set(["DRAFT", "PUBLISHED", "ARCHIVED"]);

/** Change a tour's publication status. */
export async function setTourStatus(id: string, status: string): Promise<MutationResult> {
  if (!ALLOWED_STATUSES.has(status)) return fail("Unknown status.");
  const found = await db.tour.findUnique({ where: { id }, select: { id: true } });
  if (!found) return fail("Tour not found.");
  await db.tour.update({ where: { id }, data: { status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED" } });
  return { ok: true };
}

/**
 * Hard-delete a tour. Rejected when any of its departures has bookings — those
 * are Restrict-guarded financial records; the editor must ARCHIVE instead.
 * Itinerary days, departures (booking-free), and destination links cascade.
 */
export async function deleteTour(id: string): Promise<MutationResult> {
  const found = await db.tour.findUnique({
    where: { id },
    select: { id: true, departures: { select: { _count: { select: { bookings: true } } } } },
  });
  if (!found) return fail("Tour not found.");
  const bookingCount = found.departures.reduce((n, d) => n + d._count.bookings, 0);
  if (bookingCount > 0) {
    return fail("This tour has departures with bookings — archive it instead of deleting.");
  }
  await db.tour.delete({ where: { id } });
  return { ok: true };
}

// ── Itinerary days ───────────────────────────────────────────────────────────

async function assertTourExists(tourId: string): Promise<boolean> {
  const t = await db.tour.findUnique({ where: { id: tourId }, select: { id: true } });
  return t !== null;
}

/** Add an itinerary day. Rejects a duplicate day number (schema @@unique). */
export async function addItineraryDay(tourId: string, raw: unknown): Promise<MutationResult> {
  const parsed = itineraryDaySchema.safeParse(raw);
  if (!parsed.success) return fail(firstIssue(parsed.error));
  if (!(await assertTourExists(tourId))) return fail("Tour not found.");
  const clash = await db.itineraryDay.findUnique({
    where: { tourId_dayNumber: { tourId, dayNumber: parsed.data.dayNumber } },
    select: { id: true },
  });
  if (clash) return fail(`Day ${parsed.data.dayNumber} already exists.`);
  await db.itineraryDay.create({
    data: {
      tourId,
      dayNumber: parsed.data.dayNumber,
      title: parsed.data.title,
      description: parsed.data.description,
      sortOrder: parsed.data.dayNumber,
    },
  });
  return { ok: true };
}

/** Update one itinerary day (identified within its tour). */
export async function updateItineraryDay(tourId: string, dayId: string, raw: unknown): Promise<MutationResult> {
  const parsed = itineraryDaySchema.safeParse(raw);
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const day = await db.itineraryDay.findUnique({ where: { id: dayId }, select: { tourId: true } });
  if (!day || day.tourId !== tourId) return fail("Day not found.");
  const clash = await db.itineraryDay.findFirst({
    where: { tourId, dayNumber: parsed.data.dayNumber, NOT: { id: dayId } },
    select: { id: true },
  });
  if (clash) return fail(`Day ${parsed.data.dayNumber} already exists.`);
  await db.itineraryDay.update({
    where: { id: dayId },
    data: {
      dayNumber: parsed.data.dayNumber,
      title: parsed.data.title,
      description: parsed.data.description,
      sortOrder: parsed.data.dayNumber,
    },
  });
  return { ok: true };
}

export async function deleteItineraryDay(tourId: string, dayId: string): Promise<MutationResult> {
  const day = await db.itineraryDay.findUnique({ where: { id: dayId }, select: { tourId: true } });
  if (!day || day.tourId !== tourId) return fail("Day not found.");
  await db.itineraryDay.delete({ where: { id: dayId } });
  return { ok: true };
}

// ── Departures ─────────────────────────────────────────────────────────────────

/** Parse a validated ISO date (YYYY-MM-DD) at UTC midnight (matches @db.Date). */
function parseUtcDate(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

/** Add a departure. remainingCapacity starts equal to maxCapacity (no bookings). */
export async function addDeparture(tourId: string, raw: unknown): Promise<MutationResult> {
  const parsed = departureInputSchema.safeParse(raw);
  if (!parsed.success) return fail(firstIssue(parsed.error));
  if (!(await assertTourExists(tourId))) return fail("Tour not found.");
  await db.tourDeparture.create({
    data: {
      tourId,
      startDate: parseUtcDate(parsed.data.startDate),
      endDate: parseUtcDate(parsed.data.endDate),
      maxCapacity: parsed.data.maxCapacity,
      remainingCapacity: parsed.data.maxCapacity,
      priceOverrideCents: parsed.data.priceOverrideCents,
      status: parsed.data.status,
    },
  });
  return { ok: true };
}

/**
 * Update a departure. maxCapacity can't drop below already-booked seats; the
 * remaining count is re-derived as (newMax − booked) so seats stay consistent.
 */
export async function updateDeparture(tourId: string, departureId: string, raw: unknown): Promise<MutationResult> {
  const parsed = departureInputSchema.safeParse(raw);
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const dep = await db.tourDeparture.findUnique({
    where: { id: departureId },
    select: { tourId: true, maxCapacity: true, remainingCapacity: true },
  });
  if (!dep || dep.tourId !== tourId) return fail("Departure not found.");
  const booked = dep.maxCapacity - dep.remainingCapacity;
  if (parsed.data.maxCapacity < booked) {
    return fail(`Capacity can't be below ${booked} — that many seats are already booked.`);
  }
  await db.tourDeparture.update({
    where: { id: departureId },
    data: {
      startDate: parseUtcDate(parsed.data.startDate),
      endDate: parseUtcDate(parsed.data.endDate),
      maxCapacity: parsed.data.maxCapacity,
      remainingCapacity: parsed.data.maxCapacity - booked,
      priceOverrideCents: parsed.data.priceOverrideCents,
      status: parsed.data.status,
    },
  });
  return { ok: true };
}

/** Delete a departure. Rejected when it has bookings (Restrict-guarded). */
export async function deleteDeparture(tourId: string, departureId: string): Promise<MutationResult> {
  const dep = await db.tourDeparture.findUnique({
    where: { id: departureId },
    select: { tourId: true, _count: { select: { bookings: true } } },
  });
  if (!dep || dep.tourId !== tourId) return fail("Departure not found.");
  if (dep._count.bookings > 0) {
    return fail("This departure has bookings — set it to CANCELED instead of deleting.");
  }
  await db.tourDeparture.delete({ where: { id: departureId } });
  return { ok: true };
}

// ── Destination links (tour ↔ destination M:N) ──────────────────────────────────

/** Attach a destination to a tour (idempotent), appended at the end. */
export async function linkDestination(tourId: string, destinationId: string): Promise<MutationResult> {
  if (!(await assertTourExists(tourId))) return fail("Tour not found.");
  const dest = await db.destination.findUnique({ where: { id: destinationId }, select: { id: true } });
  if (!dest) return fail("Destination not found.");
  const existing = await db.tourDestination.findUnique({
    where: { tourId_destinationId: { tourId, destinationId } },
    select: { tourId: true },
  });
  if (existing) return { ok: true }; // already linked — no-op
  const max = await db.tourDestination.aggregate({
    where: { tourId },
    _max: { sortOrder: true },
  });
  await db.tourDestination.create({
    data: { tourId, destinationId, sortOrder: (max._max.sortOrder ?? -1) + 1 },
  });
  return { ok: true };
}

export async function unlinkDestination(tourId: string, destinationId: string): Promise<MutationResult> {
  await db.tourDestination.deleteMany({ where: { tourId, destinationId } });
  return { ok: true };
}

// ── Destinations: list / read / CRUD ─────────────────────────────────────────────

export interface AdminDestinationRow {
  id: string;
  slug: string;
  name: string;
  region: string | null;
  tourCount: number;
  updatedAt: Date;
}

export async function listAdminDestinations(): Promise<AdminDestinationRow[]> {
  const rows = await db.destination.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true, slug: true, name: true, region: true, updatedAt: true,
      _count: { select: { tours: true } },
    },
  });
  return rows.map((d) => ({
    id: d.id,
    slug: d.slug,
    name: d.name,
    region: d.region,
    tourCount: d._count.tours,
    updatedAt: d.updatedAt,
  }));
}

export interface AdminDestinationDetail extends DestinationInput {
  id: string;
  tourCount: number;
}

export async function getAdminDestination(id: string): Promise<AdminDestinationDetail | null> {
  const d = await db.destination.findUnique({
    where: { id },
    select: {
      id: true, slug: true, name: true, region: true, description: true,
      heroImage: true, metaTitle: true, metaDesc: true, ogImage: true,
      _count: { select: { tours: true } },
    },
  });
  if (!d) return null;
  return {
    id: d.id,
    slug: d.slug,
    name: d.name,
    region: d.region,
    description: d.description,
    heroImage: d.heroImage,
    metaTitle: d.metaTitle,
    metaDesc: d.metaDesc,
    ogImage: d.ogImage,
    tourCount: d._count.tours,
  };
}

export async function createDestination(raw: unknown): Promise<MutationResult<string>> {
  const parsed = destinationInputSchema.safeParse(raw);
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const existing = await db.destination.findUnique({ where: { slug: parsed.data.slug }, select: { id: true } });
  if (existing) return fail(`A destination with the slug "${parsed.data.slug}" already exists.`);
  try {
    const created = await db.destination.create({
      data: {
        slug: parsed.data.slug,
        name: parsed.data.name,
        region: parsed.data.region,
        description: parsed.data.description,
        heroImage: parsed.data.heroImage,
        metaTitle: parsed.data.metaTitle,
        metaDesc: parsed.data.metaDesc,
        ogImage: parsed.data.ogImage,
      },
      select: { id: true },
    });
    return ok(created.id);
  } catch {
    return fail("Could not create the destination (the slug may already be taken).");
  }
}

export async function updateDestination(id: string, raw: unknown): Promise<MutationResult> {
  const parsed = destinationInputSchema.safeParse(raw);
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const clash = await db.destination.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
    select: { id: true },
  });
  if (clash) return fail(`Another destination already uses the slug "${parsed.data.slug}".`);
  const found = await db.destination.findUnique({ where: { id }, select: { id: true } });
  if (!found) return fail("Destination not found.");
  await db.destination.update({
    where: { id },
    data: {
      slug: parsed.data.slug,
      name: parsed.data.name,
      region: parsed.data.region,
      description: parsed.data.description,
      heroImage: parsed.data.heroImage,
      metaTitle: parsed.data.metaTitle,
      metaDesc: parsed.data.metaDesc,
      ogImage: parsed.data.ogImage,
    },
  });
  return { ok: true };
}

/**
 * Delete a destination. Its tour links (TourDestination) cascade away, but the
 * tours themselves are untouched. We surface the link count so the UI can warn.
 */
export async function deleteDestination(id: string): Promise<MutationResult> {
  const found = await db.destination.findUnique({ where: { id }, select: { id: true } });
  if (!found) return fail("Destination not found.");
  await db.destination.delete({ where: { id } });
  return { ok: true };
}

/** All destinations as {id,name} — for the link picker on the tour editor. */
export async function listDestinationOptions(): Promise<{ id: string; name: string }[]> {
  const rows = await db.destination.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  return rows;
}
