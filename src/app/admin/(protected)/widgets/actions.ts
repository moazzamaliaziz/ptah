"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCapability } from "@/server/auth/rbac";
import {
  createWidget,
  updateWidget,
  setWidgetEnabled,
  deleteWidget,
} from "@/server/admin/widgets-admin";
import { writeAudit } from "@/server/audit";
import { WIDGET_TYPES, WIDGET_POSITIONS } from "@/content/widget-admin-schema";

export type WidgetFormState = { ok?: boolean; error?: string };

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}
function bool(fd: FormData, key: string): boolean {
  return fd.get(key) === "on" || fd.get(key) === "true";
}
function int(fd: FormData, key: string, fallback = 0): number {
  const n = Number.parseInt(str(fd, key), 10);
  return Number.isFinite(n) ? n : fallback;
}

/** Read the widget form into the service's raw-input shape. */
function readWidget(fd: FormData): Parameters<typeof createWidget>[0] {
  const type = str(fd, "type");
  const position = str(fd, "position");
  return {
    type: (WIDGET_TYPES as readonly string[]).includes(type) ? type : "CUSTOM",
    enabled: bool(fd, "enabled"),
    label: str(fd, "label"),
    href: str(fd, "href"),
    iconKey: str(fd, "iconKey"),
    bgColor: str(fd, "bgColor") || null,
    showDesktop: bool(fd, "showDesktop"),
    showMobile: bool(fd, "showMobile"),
    position: (WIDGET_POSITIONS as readonly string[]).includes(position) ? position : "bottom-right",
    sortOrder: int(fd, "sortOrder", 0),
  };
}

/** Create → redirect to the edit page on success. */
export async function createWidgetAction(_prev: WidgetFormState, fd: FormData): Promise<WidgetFormState> {
  const user = await requireCapability("widgets.edit");
  const result = await createWidget(readWidget(fd));
  if (!result.ok) return { error: result.error };

  await writeAudit({ actorId: user.id, action: "widget.create", entity: "floating_widget", entityId: result.value });
  revalidatePath("/", "layout");
  revalidatePath("/admin/widgets");
  redirect(`/admin/widgets/${result.value}`);
}

export async function updateWidgetAction(_prev: WidgetFormState, fd: FormData): Promise<WidgetFormState> {
  const user = await requireCapability("widgets.edit");
  const id = str(fd, "id");
  if (!id) return { error: "Missing widget id." };
  const result = await updateWidget(id, readWidget(fd));
  if (!result.ok) return { error: result.error };

  await writeAudit({ actorId: user.id, action: "widget.update", entity: "floating_widget", entityId: id });
  revalidatePath("/", "layout");
  revalidatePath("/admin/widgets");
  return { ok: true };
}

/** Quick enable/disable from the list view (void action). */
export async function setWidgetEnabledAction(fd: FormData): Promise<void> {
  const user = await requireCapability("widgets.edit");
  const id = str(fd, "id");
  const enabled = str(fd, "enabled") === "true";
  if (!id) return;
  const result = await setWidgetEnabled(id, enabled);
  if (result.ok) {
    await writeAudit({ actorId: user.id, action: "widget.toggle", entity: "floating_widget", entityId: id, meta: { enabled } });
    revalidatePath("/", "layout");
    revalidatePath("/admin/widgets");
  }
}

/** Delete → redirect back to the list (void action). */
export async function deleteWidgetAction(fd: FormData): Promise<void> {
  const user = await requireCapability("widgets.edit");
  const id = str(fd, "id");
  if (!id) return;
  await deleteWidget(id);
  await writeAudit({ actorId: user.id, action: "widget.delete", entity: "floating_widget", entityId: id });
  revalidatePath("/", "layout");
  revalidatePath("/admin/widgets");
  redirect("/admin/widgets");
}
