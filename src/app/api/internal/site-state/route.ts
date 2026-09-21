/**
 * Internal site-state endpoint. The proxy polls this (short-TTL cached) to
 * enforce MAINTENANCE_MODE without importing Prisma into the proxy bundle or
 * hitting the DB on every request. Exposes only a single boolean — no secrets,
 * no user data — so it is safe to leave unauthenticated.
 */
import { NextResponse } from "next/server";
import { getToggle } from "@/server/toggles";
import { getActiveCspIntegrationKeys } from "@/server/integration-scripts";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  let maintenance = false;
  try {
    maintenance = await getToggle("MAINTENANCE_MODE");
  } catch {
    // Fail open: if the toggle can't be read, keep the site up.
    maintenance = false;
  }

  // The injectable integrations that are active — the proxy widens the CSP for
  // exactly these vendors (fail CLOSED: on error report none, tightest CSP).
  let cspIntegrations: string[] = [];
  try {
    cspIntegrations = await getActiveCspIntegrationKeys();
  } catch {
    cspIntegrations = [];
  }

  return NextResponse.json(
    { maintenance, cspIntegrations },
    { headers: { "Cache-Control": "no-store" } },
  );
}
