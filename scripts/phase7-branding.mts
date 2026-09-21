/**
 * Phase 7 — Subsystem 3 (Global branding) probe.
 *
 * Verifies the DB + security behaviour the branding settings depend on and a
 * `server-only` unit test can't reach:
 *   • a socials JSON *array* (objects, not a scalar) round-trips through
 *     SiteSetting exactly — the foundations probe only covered a scalar string;
 *   • the SAFE_URL_RE scheme allowlist (the stored-XSS gate on every editable
 *     social/CTA href) allows relative/https/mailto/tel and REJECTS
 *     javascript:, data:, and protocol-relative "//host";
 *   • a hex theme color and a uuid mediaId persist and read back byte-identical;
 *   • an absent key leaves no row (so the read layer serves its typed default).
 *
 * Run:
 *   DATABASE_URL="mysql://ptah:ptah-dev-password@127.0.0.1:3306/ptah_tours" npx tsx scripts/phase7-branding.mts
 *
 * Own PrismaClient (server-only db.ts breaks tsx). SAFE_URL_RE is imported from
 * the pure lib module (no @/ alias) via relative path. Everything created is
 * namespaced with a timestamp and cleaned up in `finally`.
 */
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { SAFE_URL_RE } from "../src/lib/safe-url";

const url = process.env.DATABASE_URL ?? "mysql://ptah:ptah-dev-password@127.0.0.1:3306/ptah_tours";
const db = new PrismaClient({ adapter: new PrismaMariaDb(url) });

let failures = 0;
function check(label: string, cond: boolean): void {
  console.log(`${cond ? "PASS" : "FAIL"}  ${label}`);
  if (!cond) failures++;
}

const tag = Date.now().toString(36);
const createdKeys: string[] = [];

async function put(key: string, value: unknown): Promise<void> {
  const encoded = JSON.stringify(value);
  await db.siteSetting.upsert({ where: { key }, update: { value: encoded }, create: { key, value: encoded } });
  createdKeys.push(key);
}
async function read<T>(key: string): Promise<T | undefined> {
  const row = await db.siteSetting.findUnique({ where: { key } });
  return row ? (JSON.parse(row.value) as T) : undefined;
}

async function main(): Promise<void> {
  // ── (1) socials JSON-array round-trip ──────────────────────────────────────
  const socials = [
    { label: "Instagram", href: "https://www.instagram.com/ptahtours", iconKey: "instagram" },
    { label: "Email", href: "mailto:hello@ptahtours.com", iconKey: "mail" },
    { label: "Call us", href: "tel:+201234567890", iconKey: "mail" },
  ];
  const socialsKey = `branding.socials.__probe_${tag}`;
  await put(socialsKey, socials);
  const readSocials = await read<typeof socials>(socialsKey);
  check(
    "socials JSON array round-trips (order + nested fields intact)",
    Array.isArray(readSocials) &&
      readSocials.length === 3 &&
      readSocials[0]?.label === "Instagram" &&
      readSocials[1]?.href === "mailto:hello@ptahtours.com" &&
      readSocials[2]?.iconKey === "mail",
  );

  // ── (2) SAFE_URL_RE scheme allowlist (the stored-XSS gate) ─────────────────
  const allowed = ["/tours", "/about#team", "/tours?type=classic", "https://x.com/ptahtours", "mailto:hello@ptahtours.com", "tel:+201234567890"];
  const rejected = ["javascript:alert(1)", "data:text/html,<script>alert(1)</script>", "//evil.example.com", "http://insecure.example.com", "ftp://x", " javascript:alert(1)"];
  check("SAFE_URL_RE allows every legit scheme (relative/https/mailto/tel)", allowed.every((u) => SAFE_URL_RE.test(u.trim())));
  check("SAFE_URL_RE rejects javascript:/data:/protocol-relative/http/ftp", rejected.every((u) => !SAFE_URL_RE.test(u.trim())));

  // ── (3) hex color + uuid mediaId persist byte-identical ────────────────────
  const themeKey = `seo.themeColor.__probe_${tag}`;
  await put(themeKey, "#d9822b");
  check("hex theme color round-trips", (await read<string>(themeKey)) === "#d9822b");

  const logoKey = `branding.logoMediaId.__probe_${tag}`;
  const fakeUuid = "123e4567-e89b-12d3-a456-426614174000";
  await put(logoKey, fakeUuid);
  check("uuid mediaId round-trips", (await read<string>(logoKey)) === fakeUuid);

  // null mediaId (the "use built-in" state) round-trips as JSON null.
  const nullLogoKey = `branding.footerLogoMediaId.__probe_${tag}`;
  await put(nullLogoKey, null);
  const nullRow = await db.siteSetting.findUnique({ where: { key: nullLogoKey } });
  check("null mediaId stores as JSON null", nullRow?.value === "null");

  // ── (4) absent key → no row (read layer serves its default) ────────────────
  const absent = await db.siteSetting.findUnique({ where: { key: `branding.absent.__probe_${tag}` } });
  check("absent key has no row (falls back to typed default)", absent === null);

  console.log(`\n${failures === 0 ? "ALL PASS" : `${failures} FAILURE(S)`}`);
  if (failures > 0) process.exitCode = 1;
}

main()
  .catch((e) => {
    console.error("PROBE_FAIL", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    for (const key of createdKeys) {
      await db.siteSetting.delete({ where: { key } }).catch(() => {});
    }
    await db.$disconnect();
  });
