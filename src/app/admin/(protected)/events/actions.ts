"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCapability } from "@/server/auth/rbac";
import { writeAudit } from "@/server/audit";
import {
  createEvent,
  updateEvent,
  setEventStatus,
  deleteEvent,
} from "@/server/admin/events-admin";
import { emptyToNull } from "@/content/events-admin-schema";

export type EventFormState = { ok?: boolean; error?: string };

const str = (fd: FormData, key: string): string => String(fd.get(key) ?? "");
const bool = (fd: FormData, key: string): boolean => fd.get(key) === "on" || fd.get(key) === "true";
function int(fd: FormData, key: string, fallback = 0): number {
  const n = Number.parseInt(str(fd, key), 10);
  return Number.isFinite(n) ? n : fallback;
}

function readEventInput(fd: FormData): Record<string, unknown> {
  return {
    slug: str(fd, "slug"),
    title: str(fd, "title"),
    summary: str(fd, "summary"),
    description: str(fd, "description"),
    location: emptyToNull(str(fd, "location")),
    startDate: str(fd, "startDate"),
    endDate: emptyToNull(str(fd, "endDate")),
    recurring: bool(fd, "recurring"),
    heroImage: emptyToNull(str(fd, "heroImage")),
    metaTitle: emptyToNull(str(fd, "metaTitle")),
    metaDesc: emptyToNull(str(fd, "metaDesc")),
    ogImage: emptyToNull(str(fd, "ogImage")),
    sortOrder: int(fd, "sortOrder", 0),
  };
}

function revalidateEvent(id?: string): void {
  revalidatePath("/admin/events");
  revalidatePath("/events");
  // /events/[slug] is ISR (revalidate=300). Publish/unpublish and delete don't
  // carry the slug, so refresh the whole detail route on every mutation. Call
  // both the route-group-prefixed and bare dynamic-pattern forms — a
  // non-matching path is a harmless no-op, so this is robust to how Next 16
  // resolves the (site) group in the pattern.
  revalidatePath("/(site)/events/[slug]", "page");
  revalidatePath("/events/[slug]", "page");
  if (id) revalidatePath(`/admin/events/${id}`);
}

export async function createEventAction(_prev: EventFormState, fd: FormData): Promise<EventFormState> {
  const user = await requireCapability("events.edit");
  const result = await createEvent(readEventInput(fd));
  if (!result.ok) return { error: result.error };
  await writeAudit({ actorId: user.id, action: "event.create", entity: "event", entityId: result.value });
  revalidateEvent(result.value);
  redirect(`/admin/events/${result.value}`);
}

export async function updateEventAction(_prev: EventFormState, fd: FormData): Promise<EventFormState> {
  const user = await requireCapability("events.edit");
  const id = str(fd, "id");
  const result = await updateEvent(id, readEventInput(fd));
  if (!result.ok) return { error: result.error };
  await writeAudit({ actorId: user.id, action: "event.update", entity: "event", entityId: id });
  revalidateEvent(id);
  revalidatePath(`/events/${str(fd, "slug")}`);
  return { ok: true };
}

export async function setEventStatusAction(fd: FormData): Promise<void> {
  const user = await requireCapability("events.edit");
  const id = str(fd, "id");
  const status = str(fd, "status");
  const result = await setEventStatus(id, status);
  if (result.ok) {
    await writeAudit({ actorId: user.id, action: "event.status", entity: "event", entityId: id, meta: { status } });
    revalidateEvent(id);
  }
}

export async function deleteEventAction(fd: FormData): Promise<void> {
  const user = await requireCapability("events.edit");
  const id = str(fd, "id");
  const result = await deleteEvent(id);
  await writeAudit({ actorId: user.id, action: "event.delete", entity: "event", entityId: id, meta: { ok: result.ok } });
  revalidateEvent();
  if (result.ok) redirect("/admin/events");
}
