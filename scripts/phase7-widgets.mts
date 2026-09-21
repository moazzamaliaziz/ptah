/**
 * Phase 7 — Subsystem 4 (Floating widgets) probe.
 *
 * Verifies against the real MySQL what the widget service + public read layer
 * rely on and a `server-only` unit test can't reach:
 *   • the FloatingWidget model + WidgetType enum persist (migration applied);
 *   • the public query — enabled=true ordered by (sortOrder, createdAt) —
 *     returns the right rows in the right order and EXCLUDES disabled ones;
 *   • THREE+ widgets coexist (the spec's "test 3+ simultaneously" gate);
 *   • the SAFE_URL_RE href allowlist blocks javascript:/data: and the wa.me
 *     phone normalization (normalizePhone) strips punctuation to digits.
 *
 * Run:
 *   DATABASE_URL="mysql://ptah:ptah-dev-password@127.0.0.1:3306/ptah_tours" npx tsx scripts/phase7-widgets.mts
 *
 * Own PrismaClient (server-only db.ts breaks tsx). SAFE_URL_RE/normalizePhone
 * imported from the pure lib module (no @/ alias) relatively. All rows created
 * are namespaced with a timestamp and cleaned up in `finally`.
 */
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { SAFE_URL_RE, normalizePhone } from "../src/lib/safe-url";

const url = process.env.DATABASE_URL ?? "mysql://ptah:ptah-dev-password@127.0.0.1:3306/ptah_tours";
const db = new PrismaClient({ adapter: new PrismaMariaDb(url) });

let failures = 0;
function check(label: string, cond: boolean): void {
  console.log(`${cond ? "PASS" : "FAIL"}  ${label}`);
  if (!cond) failures++;
}

const tag = Date.now().toString(36);
const createdIds: string[] = [];

async function add(data: {
  type: "PHONE" | "WHATSAPP" | "TRIPADVISOR" | "EMAIL" | "MESSENGER" | "CUSTOM";
  enabled: boolean;
  label: string;
  href: string;
  iconKey: string;
  sortOrder: number;
  position?: string;
}): Promise<string> {
  const row = await db.floatingWidget.create({
    data: {
      type: data.type,
      enabled: data.enabled,
      label: `${data.label} ${tag}`,
      href: data.href,
      iconKey: data.iconKey,
      sortOrder: data.sortOrder,
      position: data.position ?? "bottom-right",
    },
    select: { id: true },
  });
  createdIds.push(row.id);
  return row.id;
}

async function main(): Promise<void> {
  // ── 4 widgets: 3 enabled (Phone, WhatsApp, Tripadvisor) + 1 disabled CUSTOM ─
  await add({ type: "PHONE", enabled: true, label: "Call us", href: "tel:+201000000000", iconKey: "phone", sortOrder: 0 });
  await add({ type: "WHATSAPP", enabled: true, label: "WhatsApp", href: "https://wa.me/201000000000", iconKey: "whatsapp", sortOrder: 1 });
  await add({ type: "TRIPADVISOR", enabled: true, label: "Tripadvisor", href: "https://www.tripadvisor.com/ptah", iconKey: "star", sortOrder: 2 });
  await add({ type: "CUSTOM", enabled: false, label: "Hidden", href: "https://example.com", iconKey: "chat", sortOrder: 3 });

  check("FloatingWidget model + WidgetType enum persist (4 created)", createdIds.length === 4);

  // Public query: enabled only, ordered.
  const enabled = await db.floatingWidget.findMany({
    where: { enabled: true, label: { endsWith: tag } },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  check("public query returns 3 enabled widgets (disabled excluded)", enabled.length === 3);
  check("3+ widgets coexist simultaneously (spec gate)", enabled.length >= 3);
  check(
    "enabled widgets ordered by sortOrder",
    enabled[0]?.type === "PHONE" && enabled[1]?.type === "WHATSAPP" && enabled[2]?.type === "TRIPADVISOR",
  );

  // ── href allowlist + phone normalization ───────────────────────────────────
  check("SAFE_URL_RE allows tel:/https for widgets", SAFE_URL_RE.test("tel:+201000000000") && SAFE_URL_RE.test("https://wa.me/201000000000"));
  check("SAFE_URL_RE rejects javascript:/data: hrefs", !SAFE_URL_RE.test("javascript:alert(1)") && !SAFE_URL_RE.test("data:text/html,x"));
  check("normalizePhone strips punctuation to digits", normalizePhone("+20 (100) 000-0000") === "+201000000000");
  check("wa.me href built from normalized digits (no +)", `https://wa.me/${normalizePhone("+20 100 000 0000").replace(/^\+/, "")}` === "https://wa.me/201000000000");

  console.log(`\n${failures === 0 ? "ALL PASS" : `${failures} FAILURE(S)`}`);
  if (failures > 0) process.exitCode = 1;
}

main()
  .catch((e) => {
    console.error("PROBE_FAIL", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    for (const id of createdIds) {
      await db.floatingWidget.delete({ where: { id } }).catch(() => {});
    }
    await db.$disconnect();
  });
