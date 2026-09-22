/**
 * TEMPORARY diagnostic route — measures where the ~10s DB stall actually is,
 * from inside the Vercel function (real prod DATABASE_URL). Gated behind the
 * INTEGRATIONS_SECRET header; 404 without it. DELETE after diagnosis.
 */
import "server-only";
import net from "node:net";
import { promises as dns } from "node:dns";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

function timedTcp(
  host: string,
  port: number,
  family: 0 | 4 | 6,
  timeoutMs: number,
): Promise<{ ok: boolean; ms: number; err?: string }> {
  return new Promise((resolve) => {
    const start = Date.now();
    let done = false;
    const finish = (ok: boolean, err?: string) => {
      if (done) return;
      done = true;
      try {
        sock.destroy();
      } catch {}
      resolve({ ok, ms: Date.now() - start, err });
    };
    const sock = net.connect({ host, port, family });
    sock.setTimeout(timeoutMs, () => finish(false, "timeout"));
    sock.once("connect", () => finish(true));
    sock.once("error", (e) => finish(false, (e as Error).message));
  });
}

export async function GET(req: Request) {
  const secret = process.env.INTEGRATIONS_SECRET;
  if (!secret || req.headers.get("x-diag-key") !== secret) {
    return new NextResponse("not found", { status: 404 });
  }

  const raw = process.env.DATABASE_URL ?? "";
  let host = "";
  let port = 3306;
  let database = "";
  let query = "";
  try {
    const u = new URL(raw);
    host = u.hostname;
    port = u.port ? Number(u.port) : 3306;
    database = u.pathname.replace(/^\//, "");
    query = u.search; // reveals dropped ssl-mode/sslaccept params (no password)
  } catch (e) {
    return NextResponse.json({ error: "bad DATABASE_URL", detail: (e as Error).message });
  }

  const out: Record<string, unknown> = {
    host,
    port,
    database,
    query,
    nodeVersion: process.version,
  };

  const [lookupSingle, lookupAll, r4, r6, tcpDefault, tcp4, tcp6] = await Promise.all([
    dns.lookup(host).then(
      (v) => v,
      (e) => ({ err: (e as Error).message }),
    ),
    dns.lookup(host, { all: true }).then(
      (v) => v,
      (e) => ({ err: (e as Error).message }),
    ),
    dns.resolve4(host).then(
      (v) => v,
      (e) => ({ err: (e as Error).message }),
    ),
    dns.resolve6(host).then(
      (v) => v,
      (e) => ({ err: (e as Error).message }),
    ),
    timedTcp(host, port, 0, 12000),
    timedTcp(host, port, 4, 12000),
    timedTcp(host, port, 6, 8000),
  ]);
  Object.assign(out, { lookupSingle, lookupAll, resolve4: r4, resolve6: r6, tcpDefault, tcp4, tcp6 });

  // Pooled query timing: cold (first acquire) then warm (reuse) in one invocation.
  const t1 = Date.now();
  try {
    await db.$queryRawUnsafe("SELECT 1");
    out.query1 = { ms: Date.now() - t1 };
  } catch (e) {
    out.query1 = { ms: Date.now() - t1, err: (e as Error).message };
  }
  const t2 = Date.now();
  try {
    await db.$queryRawUnsafe("SELECT 1");
    out.query2 = { ms: Date.now() - t2 };
  } catch (e) {
    out.query2 = { ms: Date.now() - t2, err: (e as Error).message };
  }

  // Post-connect introspection (only meaningful once TLS lets a query through):
  // which database the URL actually selected, and what tables live there — to
  // confirm the seed landed where the app reads. The URL path is "sys", which
  // is suspicious for a MySQL system schema.
  try {
    const rows = await db.$queryRawUnsafe<Array<Record<string, unknown>>>(
      "SELECT DATABASE() AS db",
    );
    out.currentDatabase = rows?.[0]?.db ?? null;
  } catch (e) {
    out.currentDatabase = { err: (e as Error).message };
  }
  try {
    const rows = await db.$queryRawUnsafe<Array<Record<string, unknown>>>("SHOW TABLES");
    out.tables = rows.map((row) => Object.values(row)[0]);
    out.tableCount = rows.length;
  } catch (e) {
    out.tables = { err: (e as Error).message };
  }

  return NextResponse.json(out);
}
