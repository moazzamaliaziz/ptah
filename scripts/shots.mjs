/**
 * Playwright responsive screenshot capture for Ptah Tours QA.
 * Captures key public pages + the admin panel at mobile / tablet / laptop
 * viewports, logging into admin first. Output: ./qa-screenshots/<viewport>-<page>.png
 *
 * Usage: node scripts/shots.mjs
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.SHOT_BASE ?? "http://127.0.0.1:3000";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@ptahtours.local";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "ChangeMe!Dev2026";
const OUT = "qa-screenshots";

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844, isMobile: true },
  { name: "tablet", width: 768, height: 1024, isMobile: false },
  { name: "laptop", width: 1366, height: 768, isMobile: false },
];

async function discoverTourSlug() {
  try {
    const res = await fetch(`${BASE}/tours`);
    const html = await res.text();
    const m = html.match(/href="\/tours\/([a-z0-9-]+)"/i);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

async function shoot(page, path, file) {
  try {
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 30_000 });
  } catch {
    await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded", timeout: 30_000 }).catch(() => {});
  }
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/${file}.png`, fullPage: true });
  console.log(`  ✓ ${file}.png  (${path})`);
}

async function loginAdmin(page) {
  await page.goto(`${BASE}/admin/login`, { waitUntil: "domcontentloaded" });
  await page.fill('input[type="email"], input[name="email"]', ADMIN_EMAIL).catch(() => {});
  await page.fill('input[type="password"], input[name="password"]', ADMIN_PASSWORD).catch(() => {});
  await Promise.all([
    page.waitForLoadState("networkidle").catch(() => {}),
    page.click('button[type="submit"]').catch(() => {}),
  ]);
  await page.waitForTimeout(800);
  // Confirm we reached the panel (not still on /login).
  return !page.url().includes("/admin/login");
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const slug = await discoverTourSlug();
  const publicPages = [
    ["/", "home"],
    ["/tours", "tours"],
    ...(slug ? [[`/tours/${slug}`, "tour-detail"]] : []),
    ["/booking/" + (slug ?? ""), "booking"],
    ["/contact", "contact"],
  ];

  const browser = await chromium.launch();
  for (const vp of VIEWPORTS) {
    console.log(`\n▶ Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      deviceScaleFactor: 1,
      userAgent: vp.isMobile
        ? "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36"
        : undefined,
    });
    const page = await ctx.newPage();

    for (const [path, name] of publicPages) await shoot(page, path, `${vp.name}-${name}`);

    // Admin (login then capture dashboard + orders)
    const ok = await loginAdmin(page);
    if (ok) {
      await shoot(page, "/admin", `${vp.name}-admin-dashboard`);
      await shoot(page, "/admin/bookings", `${vp.name}-admin-orders`);
      await shoot(page, "/admin/tours", `${vp.name}-admin-tours`);
    } else {
      console.log(`  ! admin login did not succeed at ${vp.name}; captured login page only`);
      await shoot(page, "/admin/login", `${vp.name}-admin-login`);
    }
    await ctx.close();
  }
  await browser.close();
  console.log(`\nDone. Screenshots in ./${OUT}/`);
}

main().catch((e) => {
  console.error("shots failed:", e);
  process.exit(1);
});
