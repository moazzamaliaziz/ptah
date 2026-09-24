/**
 * Events + Trip Ideas admin service (server-only write layer). Same conventions
 * as catalog-admin.ts: discriminated MutationResult, friendly errors (never
 * throws on bad input), unique-slug pre-check + P2002 backstop. Authorization
 * (events.edit / tripideas.edit) + audit are the caller's (server action)
 * responsibility.
 */
import "server-only";
import type { z } from "zod";
import { db } from "@/lib/db";
import { deleteRecordTranslations } from "@/server/admin/translations-admin";
import {
  eventInputSchema,
  tripIdeaInputSchema,
  type EventInput,
  type TripIdeaInput,
} from "@/content/events-admin-schema";

export type MutationResult<T = void> =
  | ({ ok: true } & (T extends void ? object : { value: T }))
  | { ok: false; error: string };

function ok<T>(value: T): { ok: true; value: T } {
  return { ok: true, value };
}
function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}
function firstIssue(error: z.ZodError): string {
  const i = error.issues[0];
  return i ? `${i.path.join(".") || "form"}: ${i.message}` : "Invalid input.";
}
function parseUtcDate(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}
function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// ── Events: list / read ─────────────────────────────────────────────────────────

export interface AdminEventRow {
  id: string;
  slug: string;
  title: string;
  status: string;
  startDate: string;
  endDate: string | null;
  recurring: boolean;
  updatedAt: Date;
}

export async function listAdminEvents(): Promise<AdminEventRow[]> {
  const rows = await db.event.findMany({
    orderBy: [{ sortOrder: "asc" }, { startDate: "asc" }],
    select: {
      id: true, slug: true, title: true, status: true,
      startDate: true, endDate: true, recurring: true, updatedAt: true,
    },
  });
  return rows.map((e) => ({
    id: e.id,
    slug: e.slug,
    title: e.title,
    status: e.status,
    startDate: toIsoDate(e.startDate),
    endDate: e.endDate ? toIsoDate(e.endDate) : null,
    recurring: e.recurring,
    updatedAt: e.updatedAt,
  }));
}

export interface AdminEventDetail extends EventInput {
  id: string;
  status: string;
}

export async function getAdminEvent(id: string): Promise<AdminEventDetail | null> {
  const e = await db.event.findUnique({
    where: { id },
    select: {
      id: true, slug: true, title: true, summary: true, description: true,
      location: true, startDate: true, endDate: true, recurring: true,
      heroImage: true, metaTitle: true, metaDesc: true, ogImage: true,
      sortOrder: true, status: true,
    },
  });
  if (!e) return null;
  return {
    id: e.id,
    slug: e.slug,
    title: e.title,
    summary: e.summary,
    description: e.description,
    location: e.location,
    startDate: toIsoDate(e.startDate),
    endDate: e.endDate ? toIsoDate(e.endDate) : null,
    recurring: e.recurring,
    heroImage: e.heroImage,
    metaTitle: e.metaTitle,
    metaDesc: e.metaDesc,
    ogImage: e.ogImage,
    sortOrder: e.sortOrder,
    status: e.status,
  };
}

// ── Events: create / update / status / delete ────────────────────────────────────

function eventWriteData(input: EventInput) {
  return {
    slug: input.slug,
    title: input.title,
    summary: input.summary,
    description: input.description,
    location: input.location,
    startDate: parseUtcDate(input.startDate),
    endDate: input.endDate ? parseUtcDate(input.endDate) : null,
    recurring: input.recurring,
    heroImage: input.heroImage,
    metaTitle: input.metaTitle,
    metaDesc: input.metaDesc,
    ogImage: input.ogImage,
    sortOrder: input.sortOrder,
  };
}

export async function createEvent(raw: unknown): Promise<MutationResult<string>> {
  const parsed = eventInputSchema.safeParse(raw);
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const existing = await db.event.findUnique({ where: { slug: parsed.data.slug }, select: { id: true } });
  if (existing) return fail(`An event with the slug "${parsed.data.slug}" already exists.`);
  try {
    const created = await db.event.create({
      data: { ...eventWriteData(parsed.data), status: "DRAFT" },
      select: { id: true },
    });
    return ok(created.id);
  } catch {
    return fail("Could not create the event (the slug may already be taken).");
  }
}

export async function updateEvent(id: string, raw: unknown): Promise<MutationResult> {
  const parsed = eventInputSchema.safeParse(raw);
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const clash = await db.event.findFirst({ where: { slug: parsed.data.slug, NOT: { id } }, select: { id: true } });
  if (clash) return fail(`Another event already uses the slug "${parsed.data.slug}".`);
  const found = await db.event.findUnique({ where: { id }, select: { id: true } });
  if (!found) return fail("Event not found.");
  await db.event.update({ where: { id }, data: eventWriteData(parsed.data) });
  return { ok: true };
}

const ALLOWED_STATUSES = new Set(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export async function setEventStatus(id: string, status: string): Promise<MutationResult> {
  if (!ALLOWED_STATUSES.has(status)) return fail("Unknown status.");
  const found = await db.event.findUnique({ where: { id }, select: { id: true } });
  if (!found) return fail("Event not found.");
  await db.event.update({ where: { id }, data: { status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED" } });
  return { ok: true };
}

export async function deleteEvent(id: string): Promise<MutationResult> {
  const found = await db.event.findUnique({ where: { id }, select: { id: true } });
  if (!found) return fail("Event not found.");
  await db.event.delete({ where: { id } });
  await deleteRecordTranslations("Event", id);
  return { ok: true };
}

// ── Trip Ideas: list / read ─────────────────────────────────────────────────────

export interface AdminTripIdeaRow {
  id: string;
  slug: string;
  title: string;
  status: string;
  tourCount: number;
  updatedAt: Date;
}

export async function listAdminTripIdeas(): Promise<AdminTripIdeaRow[]> {
  const rows = await db.tripIdea.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true, slug: true, title: true, status: true, updatedAt: true,
      _count: { select: { tours: true } },
    },
  });
  return rows.map((t) => ({
    id: t.id,
    slug: t.slug,
    title: t.title,
    status: t.status,
    tourCount: t._count.tours,
    updatedAt: t.updatedAt,
  }));
}

export interface AdminTripIdeaDetail extends TripIdeaInput {
  id: string;
  status: string;
  linkedTours: { tourId: string; title: string; slug: string; sortOrder: number }[];
}

export async function getAdminTripIdea(id: string): Promise<AdminTripIdeaDetail | null> {
  const t = await db.tripIdea.findUnique({
    where: { id },
    select: {
      id: true, slug: true, title: true, summary: true, descriptionLong: true,
      heroImage: true, metaTitle: true, metaDesc: true, ogImage: true,
      sortOrder: true, status: true,
      tours: {
        orderBy: { sortOrder: "asc" },
        select: { tourId: true, sortOrder: true, tour: { select: { title: true, slug: true } } },
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
    heroImage: t.heroImage,
    metaTitle: t.metaTitle,
    metaDesc: t.metaDesc,
    ogImage: t.ogImage,
    sortOrder: t.sortOrder,
    status: t.status,
    linkedTours: t.tours.map((x) => ({
      tourId: x.tourId,
      title: x.tour.title,
      slug: x.tour.slug,
      sortOrder: x.sortOrder,
    })),
  };
}

// ── Trip Ideas: create / update / status / delete / tour links ────────────────────

function tripIdeaWriteData(input: TripIdeaInput) {
  return {
    slug: input.slug,
    title: input.title,
    summary: input.summary,
    descriptionLong: input.descriptionLong,
    heroImage: input.heroImage,
    metaTitle: input.metaTitle,
    metaDesc: input.metaDesc,
    ogImage: input.ogImage,
    sortOrder: input.sortOrder,
  };
}

export async function createTripIdea(raw: unknown): Promise<MutationResult<string>> {
  const parsed = tripIdeaInputSchema.safeParse(raw);
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const existing = await db.tripIdea.findUnique({ where: { slug: parsed.data.slug }, select: { id: true } });
  if (existing) return fail(`A trip idea with the slug "${parsed.data.slug}" already exists.`);
  try {
    const created = await db.tripIdea.create({
      data: { ...tripIdeaWriteData(parsed.data), status: "DRAFT" },
      select: { id: true },
    });
    return ok(created.id);
  } catch {
    return fail("Could not create the trip idea (the slug may already be taken).");
  }
}

export async function updateTripIdea(id: string, raw: unknown): Promise<MutationResult> {
  const parsed = tripIdeaInputSchema.safeParse(raw);
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const clash = await db.tripIdea.findFirst({ where: { slug: parsed.data.slug, NOT: { id } }, select: { id: true } });
  if (clash) return fail(`Another trip idea already uses the slug "${parsed.data.slug}".`);
  const found = await db.tripIdea.findUnique({ where: { id }, select: { id: true } });
  if (!found) return fail("Trip idea not found.");
  await db.tripIdea.update({ where: { id }, data: tripIdeaWriteData(parsed.data) });
  return { ok: true };
}

export async function setTripIdeaStatus(id: string, status: string): Promise<MutationResult> {
  if (!ALLOWED_STATUSES.has(status)) return fail("Unknown status.");
  const found = await db.tripIdea.findUnique({ where: { id }, select: { id: true } });
  if (!found) return fail("Trip idea not found.");
  await db.tripIdea.update({ where: { id }, data: { status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED" } });
  return { ok: true };
}

export async function deleteTripIdea(id: string): Promise<MutationResult> {
  const found = await db.tripIdea.findUnique({ where: { id }, select: { id: true } });
  if (!found) return fail("Trip idea not found.");
  await db.tripIdea.delete({ where: { id } });
  await deleteRecordTranslations("TripIdea", id);
  return { ok: true };
}

/** Attach a tour to a trip idea (idempotent), appended at the end. */
export async function linkTripIdeaTour(tripIdeaId: string, tourId: string): Promise<MutationResult> {
  const idea = await db.tripIdea.findUnique({ where: { id: tripIdeaId }, select: { id: true } });
  if (!idea) return fail("Trip idea not found.");
  const tour = await db.tour.findUnique({ where: { id: tourId }, select: { id: true } });
  if (!tour) return fail("Tour not found.");
  const existing = await db.tripIdeaTour.findUnique({
    where: { tripIdeaId_tourId: { tripIdeaId, tourId } },
    select: { tourId: true },
  });
  if (existing) return { ok: true };
  const max = await db.tripIdeaTour.aggregate({ where: { tripIdeaId }, _max: { sortOrder: true } });
  await db.tripIdeaTour.create({
    data: { tripIdeaId, tourId, sortOrder: (max._max.sortOrder ?? -1) + 1 },
  });
  return { ok: true };
}

export async function unlinkTripIdeaTour(tripIdeaId: string, tourId: string): Promise<MutationResult> {
  await db.tripIdeaTour.deleteMany({ where: { tripIdeaId, tourId } });
  return { ok: true };
}

/** Published tours as {id,title} — for the trip-idea tour-link picker. */
export async function listTourOptions(): Promise<{ id: string; title: string }[]> {
  const rows = await db.tour.findMany({
    orderBy: { title: "asc" },
    select: { id: true, title: true },
  });
  return rows;
}
