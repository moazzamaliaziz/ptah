/**
 * Floating widgets read layer (Phase 7 — Subsystem 4).
 *
 * Mirrors src/server/toggles.ts: a short-TTL per-process cache over the
 * `floating_widgets` table so the public layout (every page renders the
 * cluster) does not hit the DB each request. The DB is the source of truth;
 * if it is unreachable, reads return an empty list so the site keeps serving
 * (a missing widget cluster is fail-safe — nothing breaks).
 *
 * Only ENABLED widgets are returned to the public renderer, already ordered by
 * (sortOrder, createdAt), and coerced to the client-safe PublicWidget shape
 * (defensively defaulting an unknown iconKey/bgColor from the type presets).
 */
import "server-only";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import {
  WIDGET_TYPE_META,
  isWidgetIconKey,
  type PublicWidget,
  type WidgetIconKey,
  type WidgetPosition,
} from "@/content/widget-admin-schema";

const CACHE_TTL_MS = 10_000;

const globalForWidgets = globalThis as unknown as {
  __ptahWidgets?: { data: PublicWidget[]; expires: number };
};

/** Read all ENABLED widgets (cached), ready for the public cluster. */
export async function getEnabledWidgets(): Promise<PublicWidget[]> {
  const cached = globalForWidgets.__ptahWidgets;
  if (cached && cached.expires > Date.now()) return cached.data;

  let widgets: PublicWidget[] = [];
  try {
    const rows = await db.floatingWidget.findMany({
      where: { enabled: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    widgets = rows.map((row) => {
      const preset = WIDGET_TYPE_META[row.type];
      const iconKey: WidgetIconKey = isWidgetIconKey(row.iconKey) ? row.iconKey : preset.icon;
      return {
        id: row.id,
        type: row.type,
        label: row.label,
        href: row.href,
        iconKey,
        bgColor: row.bgColor ?? preset.bgColor,
        showDesktop: row.showDesktop,
        showMobile: row.showMobile,
        position: (row.position === "bottom-left" ? "bottom-left" : "bottom-right") as WidgetPosition,
        sortOrder: row.sortOrder,
      };
    });
  } catch (error) {
    logger.warn("widgets read failed — rendering no cluster", { error });
    return [];
  }

  globalForWidgets.__ptahWidgets = { data: widgets, expires: Date.now() + CACHE_TTL_MS };
  return widgets;
}

/** Invalidate the per-process cache (called after any admin write). */
export function invalidateWidgetCache(): void {
  globalForWidgets.__ptahWidgets = undefined;
}
