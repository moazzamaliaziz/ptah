"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCapability } from "@/server/auth/rbac";
import { writeAudit } from "@/server/audit";
import {
  createDestination,
  updateDestination,
  deleteDestination,
} from "@/server/admin/catalog-admin";
import { emptyToNull } from "@/content/catalog-admin-schema";

export type DestinationFormState = { ok?: boolean; error?: string };

const str = (fd: FormData, key: string): string => String(fd.get(key) ?? "");

function readDestinationInput(fd: FormData): Record<string, unknown> {
  return {
    slug: str(fd, "slug"),
    name: str(fd, "name"),
    region: emptyToNull(str(fd, "region")),
    description: emptyToNull(str(fd, "description")),
    heroImage: emptyToNull(str(fd, "heroImage")),
    metaTitle: emptyToNull(str(fd, "metaTitle")),
    metaDesc: emptyToNull(str(fd, "metaDesc")),
    ogImage: emptyToNull(str(fd, "ogImage")),
  };
}

function revalidateDestination(id?: string): void {
  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
  if (id) revalidatePath(`/admin/destinations/${id}`);
}

export async function createDestinationAction(_prev: DestinationFormState, fd: FormData): Promise<DestinationFormState> {
  const user = await requireCapability("catalog.edit");
  const result = await createDestination(readDestinationInput(fd));
  if (!result.ok) return { error: result.error };
  await writeAudit({ actorId: user.id, action: "destination.create", entity: "destination", entityId: result.value });
  revalidateDestination(result.value);
  redirect(`/admin/destinations/${result.value}`);
}

export async function updateDestinationAction(_prev: DestinationFormState, fd: FormData): Promise<DestinationFormState> {
  const user = await requireCapability("catalog.edit");
  const id = str(fd, "id");
  const result = await updateDestination(id, readDestinationInput(fd));
  if (!result.ok) return { error: result.error };
  await writeAudit({ actorId: user.id, action: "destination.update", entity: "destination", entityId: id });
  revalidateDestination(id);
  revalidatePath(`/destinations/${str(fd, "slug")}`);
  return { ok: true };
}

export async function deleteDestinationAction(fd: FormData): Promise<void> {
  const user = await requireCapability("catalog.edit");
  const id = str(fd, "id");
  const result = await deleteDestination(id);
  await writeAudit({
    actorId: user.id,
    action: "destination.delete",
    entity: "destination",
    entityId: id,
    meta: { ok: result.ok },
  });
  revalidateDestination();
  if (result.ok) redirect("/admin/destinations");
}
