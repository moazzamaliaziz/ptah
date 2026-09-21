"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCapability } from "@/server/auth/rbac";
import { writeAudit } from "@/server/audit";
import {
  createTripIdea,
  updateTripIdea,
  setTripIdeaStatus,
  deleteTripIdea,
  linkTripIdeaTour,
  unlinkTripIdeaTour,
} from "@/server/admin/events-admin";
import { emptyToNull } from "@/content/events-admin-schema";

export type TripIdeaFormState = { ok?: boolean; error?: string };

const str = (fd: FormData, key: string): string => String(fd.get(key) ?? "");
function int(fd: FormData, key: string, fallback = 0): number {
  const n = Number.parseInt(str(fd, key), 10);
  return Number.isFinite(n) ? n : fallback;
}

function readTripIdeaInput(fd: FormData): Record<string, unknown> {
  return {
    slug: str(fd, "slug"),
    title: str(fd, "title"),
    summary: str(fd, "summary"),
    descriptionLong: str(fd, "descriptionLong"),
    heroImage: emptyToNull(str(fd, "heroImage")),
    metaTitle: emptyToNull(str(fd, "metaTitle")),
    metaDesc: emptyToNull(str(fd, "metaDesc")),
    ogImage: emptyToNull(str(fd, "ogImage")),
    sortOrder: int(fd, "sortOrder", 0),
  };
}

function revalidateTripIdea(id?: string): void {
  revalidatePath("/admin/trip-ideas");
  revalidatePath("/trip-ideas");
  if (id) revalidatePath(`/admin/trip-ideas/${id}`);
}

export async function createTripIdeaAction(_prev: TripIdeaFormState, fd: FormData): Promise<TripIdeaFormState> {
  const user = await requireCapability("tripideas.edit");
  const result = await createTripIdea(readTripIdeaInput(fd));
  if (!result.ok) return { error: result.error };
  await writeAudit({ actorId: user.id, action: "tripidea.create", entity: "tripIdea", entityId: result.value });
  revalidateTripIdea(result.value);
  redirect(`/admin/trip-ideas/${result.value}`);
}

export async function updateTripIdeaAction(_prev: TripIdeaFormState, fd: FormData): Promise<TripIdeaFormState> {
  const user = await requireCapability("tripideas.edit");
  const id = str(fd, "id");
  const result = await updateTripIdea(id, readTripIdeaInput(fd));
  if (!result.ok) return { error: result.error };
  await writeAudit({ actorId: user.id, action: "tripidea.update", entity: "tripIdea", entityId: id });
  revalidateTripIdea(id);
  revalidatePath(`/trip-ideas/${str(fd, "slug")}`);
  return { ok: true };
}

export async function setTripIdeaStatusAction(fd: FormData): Promise<void> {
  const user = await requireCapability("tripideas.edit");
  const id = str(fd, "id");
  const status = str(fd, "status");
  const result = await setTripIdeaStatus(id, status);
  if (result.ok) {
    await writeAudit({ actorId: user.id, action: "tripidea.status", entity: "tripIdea", entityId: id, meta: { status } });
    revalidateTripIdea(id);
  }
}

export async function deleteTripIdeaAction(fd: FormData): Promise<void> {
  const user = await requireCapability("tripideas.edit");
  const id = str(fd, "id");
  const result = await deleteTripIdea(id);
  await writeAudit({ actorId: user.id, action: "tripidea.delete", entity: "tripIdea", entityId: id, meta: { ok: result.ok } });
  revalidateTripIdea();
  if (result.ok) redirect("/admin/trip-ideas");
}

export async function linkTripIdeaTourAction(fd: FormData): Promise<void> {
  const user = await requireCapability("tripideas.edit");
  const tripIdeaId = str(fd, "tripIdeaId");
  const tourId = str(fd, "tourId");
  const result = await linkTripIdeaTour(tripIdeaId, tourId);
  if (result.ok) {
    await writeAudit({ actorId: user.id, action: "tripidea.linkTour", entity: "tripIdea", entityId: tripIdeaId, meta: { tourId } });
    revalidateTripIdea(tripIdeaId);
  }
}

export async function unlinkTripIdeaTourAction(fd: FormData): Promise<void> {
  const user = await requireCapability("tripideas.edit");
  const tripIdeaId = str(fd, "tripIdeaId");
  const tourId = str(fd, "tourId");
  const result = await unlinkTripIdeaTour(tripIdeaId, tourId);
  if (result.ok) {
    await writeAudit({ actorId: user.id, action: "tripidea.unlinkTour", entity: "tripIdea", entityId: tripIdeaId, meta: { tourId } });
    revalidateTripIdea(tripIdeaId);
  }
}
