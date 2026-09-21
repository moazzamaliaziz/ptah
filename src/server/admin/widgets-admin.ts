/**
 * Floating-widget admin service (Phase 7 — Subsystem 4). Server-only write
 * layer for the /admin/widgets CRUD. Mirrors catalog-admin.ts conventions:
 *   • Returns view-models / a discriminated MutationResult — no Prisma types
 *     leak, invalid input is a friendly error not a throw.
 *   • Authorization (`widgets.edit`) + audit are the caller's (action)
 *     responsibility; this module validates shape + normalizes the href.
 *   • The public read layer (src/server/widgets.ts) stays the source of truth
 *     for what visitors see; this module owns staff mutations + cache busting.
 */
import "server-only";
import { db } from "@/lib/db";
import {
  widgetInputSchema,
  normalizeWidgetHref,
  isWidgetIconKey,
  WIDGET_TYPE_META,
  type WidgetInput,
  type WidgetIconKey,
  type WidgetPosition,
} from "@/content/widget-admin-schema";
import { invalidateWidgetCache } from "@/server/widgets";
import type { WidgetType } from "@prisma/client";

export type MutationResult<T = void> =
  | ({ ok: true } & (T extends void ? object : { value: T }))
  | { ok: false; error: string };

function ok<T>(value: T): { ok: true; value: T } {
  return { ok: true, value };
}
function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

/** Admin list row (all fields — the admin sees disabled widgets too). */
export interface AdminWidgetRow {
  id: string;
  type: WidgetType;
  enabled: boolean;
  label: string;
  href: string;
  iconKey: WidgetIconKey;
  bgColor: string | null;
  showDesktop: boolean;
  showMobile: boolean;
  position: WidgetPosition;
  sortOrder: number;
}

/** Edit-form shape: the validated input plus the row id. */
export type AdminWidgetDetail = WidgetInput & { id: string };

function toRow(r: {
  id: string;
  type: WidgetType;
  enabled: boolean;
  label: string;
  href: string;
  iconKey: string;
  bgColor: string | null;
  showDesktop: boolean;
  showMobile: boolean;
  position: string;
  sortOrder: number;
}): AdminWidgetRow {
  const preset = WIDGET_TYPE_META[r.type];
  return {
    id: r.id,
    type: r.type,
    enabled: r.enabled,
    label: r.label,
    href: r.href,
    iconKey: isWidgetIconKey(r.iconKey) ? r.iconKey : preset.icon,
    bgColor: r.bgColor,
    showDesktop: r.showDesktop,
    showMobile: r.showMobile,
    position: r.position === "bottom-left" ? "bottom-left" : "bottom-right",
    sortOrder: r.sortOrder,
  };
}

/** List every widget (enabled + disabled), ordered as the cluster would stack. */
export async function listAdminWidgets(): Promise<AdminWidgetRow[]> {
  const rows = await db.floatingWidget.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(toRow);
}

/** One widget for the edit form, or null when not found. */
export async function getAdminWidget(id: string): Promise<AdminWidgetDetail | null> {
  const r = await db.floatingWidget.findUnique({ where: { id } });
  if (!r) return null;
  const row = toRow(r);
  return {
    id: row.id,
    type: row.type,
    enabled: row.enabled,
    label: row.label,
    href: row.href,
    iconKey: row.iconKey,
    bgColor: row.bgColor,
    showDesktop: row.showDesktop,
    showMobile: row.showMobile,
    position: row.position,
    sortOrder: row.sortOrder,
  };
}

/**
 * Validate + normalize an input. The href is normalized per type BEFORE schema
 * validation so a raw phone number becomes tel:/wa.me and is then re-checked by
 * the SAFE_URL_RE allowlist. Returns the parsed WidgetInput or a friendly error.
 */
function parseInput(raw: {
  type: string;
  enabled: boolean;
  label: string;
  href: string;
  iconKey: string;
  bgColor: string | null;
  showDesktop: boolean;
  showMobile: boolean;
  position: string;
  sortOrder: number;
}): MutationResult<WidgetInput> {
  // Coerce/normalize before validation.
  const type = raw.type as WidgetType;
  const normalizedHref = (WIDGET_TYPE_META as Record<string, unknown>)[type]
    ? normalizeWidgetHref(type as keyof typeof WIDGET_TYPE_META, raw.href)
    : raw.href;

  const result = widgetInputSchema.safeParse({
    type: raw.type,
    enabled: raw.enabled,
    label: raw.label,
    href: normalizedHref,
    iconKey: raw.iconKey,
    bgColor: raw.bgColor === "" ? null : raw.bgColor,
    showDesktop: raw.showDesktop,
    showMobile: raw.showMobile,
    position: raw.position,
    sortOrder: raw.sortOrder,
  });
  if (!result.success) {
    return fail(result.error.issues[0]?.message ?? "Please check the widget fields.");
  }
  return ok(result.data);
}

/** Create a widget. Returns the new id on success. */
export async function createWidget(raw: Parameters<typeof parseInput>[0]): Promise<MutationResult<string>> {
  const parsed = parseInput(raw);
  if (!parsed.ok) return parsed;
  const input = parsed.value;
  const created = await db.floatingWidget.create({
    data: { ...input },
    select: { id: true },
  });
  invalidateWidgetCache();
  return ok(created.id);
}

/** Update a widget. */
export async function updateWidget(id: string, raw: Parameters<typeof parseInput>[0]): Promise<MutationResult> {
  const parsed = parseInput(raw);
  if (!parsed.ok) return parsed;
  const exists = await db.floatingWidget.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return fail("That widget no longer exists.");
  await db.floatingWidget.update({ where: { id }, data: { ...parsed.value } });
  invalidateWidgetCache();
  return { ok: true };
}

/** Toggle enabled without a full form submit (list-view quick action). */
export async function setWidgetEnabled(id: string, enabled: boolean): Promise<MutationResult> {
  const exists = await db.floatingWidget.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return fail("That widget no longer exists.");
  await db.floatingWidget.update({ where: { id }, data: { enabled } });
  invalidateWidgetCache();
  return { ok: true };
}

/** Delete a widget (no relations — a plain removal). */
export async function deleteWidget(id: string): Promise<MutationResult> {
  await db.floatingWidget.delete({ where: { id } }).catch(() => {});
  invalidateWidgetCache();
  return { ok: true };
}
