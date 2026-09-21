/**
 * Pure, client-safe contract for floating widgets (Phase 7 — Subsystem 4).
 *
 * Free of `server-only` / DB / Next imports so it is importable from both the
 * server service (src/server/widgets.ts, admin/widgets-admin.ts) and the client
 * cluster + admin editor — the boundary rule that kept mariadb out of the
 * browser bundle in S1/S2.
 *
 * SECURITY: `href` is scheme-allowlisted via SAFE_URL_RE (blocks javascript:/
 * data:/protocol-relative). `bgColor` is restricted to a hex color so it can be
 * dropped into a style attribute without a CSS-injection sink.
 */
import { z } from "zod";
import type { WidgetType } from "@prisma/client";
import type { IconName } from "@/components/ui/Icon";
import { SAFE_URL_RE, normalizePhone } from "@/lib/safe-url";

export const WIDGET_TYPES = ["PHONE", "WHATSAPP", "TRIPADVISOR", "EMAIL", "MESSENGER", "CUSTOM"] as const;
export const WIDGET_POSITIONS = ["bottom-right", "bottom-left"] as const;
export type WidgetPosition = (typeof WIDGET_POSITIONS)[number];

/** Icons a widget may use (curated subset of Icon.tsx that reads as a contact affordance). */
export const WIDGET_ICON_KEYS = ["phone", "whatsapp", "star", "chat", "mail", "info"] as const;
export type WidgetIconKey = (typeof WIDGET_ICON_KEYS)[number];

/** Per-type presets: icon, label, brand color and how a raw value becomes an href. */
export interface WidgetTypeMeta {
  icon: WidgetIconKey;
  label: string;
  bgColor: string;
  /** Human hint shown under the href field. */
  hrefHint: string;
}
export const WIDGET_TYPE_META: Record<(typeof WIDGET_TYPES)[number], WidgetTypeMeta> = {
  PHONE: { icon: "phone", label: "Call us", bgColor: "#1a2340", hrefHint: "A phone number (or tel:…) — dialled directly." },
  WHATSAPP: { icon: "whatsapp", label: "WhatsApp", bgColor: "#25d366", hrefHint: "A phone number or full https://wa.me/… link." },
  TRIPADVISOR: { icon: "star", label: "Tripadvisor", bgColor: "#34e0a1", hrefHint: "Your Tripadvisor page (https://…)." },
  EMAIL: { icon: "mail", label: "Email us", bgColor: "#9a5c1b", hrefHint: "An email address (or mailto:…)." },
  MESSENGER: { icon: "chat", label: "Messenger", bgColor: "#0084ff", hrefHint: "Your m.me/… or Messenger link (https://…)." },
  CUSTOM: { icon: "chat", label: "", bgColor: "#1a2340", hrefHint: "Any https://, mailto: or tel: link." },
};

const hexColor = z
  .string()
  .trim()
  .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Must be a hex color like #1a2340");

const safeHref = z
  .string()
  .trim()
  .min(1, "A link is required")
  .max(512)
  .refine((v) => SAFE_URL_RE.test(v), {
    message: "Link must be https://, mailto: or tel: (never javascript:/data:).",
  });

/** Validated widget input (shared by create + update; id/timestamps excluded). */
export const widgetInputSchema = z.object({
  type: z.enum(WIDGET_TYPES),
  enabled: z.boolean(),
  label: z.string().trim().min(1, "A label is required").max(120),
  href: safeHref,
  iconKey: z.enum(WIDGET_ICON_KEYS),
  bgColor: hexColor.nullable(),
  showDesktop: z.boolean(),
  showMobile: z.boolean(),
  position: z.enum(WIDGET_POSITIONS),
  sortOrder: z.number().int().min(0).max(9999),
});
export type WidgetInput = z.infer<typeof widgetInputSchema>;

/** The public-facing shape the cluster renders (no timestamps, client-safe). */
export interface PublicWidget {
  id: string;
  type: WidgetType;
  label: string;
  href: string;
  iconKey: WidgetIconKey;
  bgColor: string;
  showDesktop: boolean;
  showMobile: boolean;
  position: WidgetPosition;
  sortOrder: number;
}

/**
 * Turn an admin-entered value into a safe href for its type. PHONE→tel:,
 * WHATSAPP→https://wa.me/<digits>, EMAIL→mailto:, others pass through. The
 * result is still validated by `widgetInputSchema.href` (SAFE_URL_RE).
 */
export function normalizeWidgetHref(type: (typeof WIDGET_TYPES)[number], raw: string): string {
  const value = raw.trim();
  if (value === "") return value;
  switch (type) {
    case "PHONE":
      return value.startsWith("tel:") ? value : `tel:${normalizePhone(value)}`;
    case "WHATSAPP":
      if (/^https?:\/\//i.test(value)) return value;
      return `https://wa.me/${normalizePhone(value).replace(/^\+/, "")}`;
    case "EMAIL":
      return value.startsWith("mailto:") ? value : `mailto:${value}`;
    default:
      return value;
  }
}

/** Runtime membership check for a widget icon key (used when coercing DB rows). */
export function isWidgetIconKey(value: string): value is WidgetIconKey {
  return (WIDGET_ICON_KEYS as readonly string[]).includes(value);
}

// The widget icon keys must all be real Icon names (compile-time guard).
const _iconKeyCheck: readonly IconName[] = WIDGET_ICON_KEYS;
void _iconKeyCheck;
