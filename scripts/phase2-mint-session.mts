/**
 * Phase 2 gate helper — mint a real session for a given role and print the raw
 * cookie token, so curl can exercise route-level RBAC guards as that role.
 *
 * Mirrors src/server/auth/session.createSession EXACTLY: raw = base64url(32
 * random bytes), DB stores sha256hex(raw) in sessions.token, cookie carries raw.
 * (session.ts imports "server-only" so it can't load under tsx — replicated.)
 *
 * Ensures a test user exists for the requested role (idempotent upsert), then
 * creates a session row for it. Prints only the raw token on the last line.
 *
 * Run: npx tsx scripts/phase2-mint-session.mts <ROLE>
 *   ROLE ∈ SUPER_ADMIN | ADMIN | EDITOR | SUPPORT | USER
 */
import "dotenv/config";
import { createHash, randomBytes } from "node:crypto";
import { PrismaClient, type Role } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { hash } from "@node-rs/argon2";
import { ARGON2_OPTIONS } from "../src/lib/argon2-params";

const role = (process.argv[2] ?? "SUPER_ADMIN") as Role;
const VALID: Role[] = ["SUPER_ADMIN", "ADMIN", "EDITOR", "SUPPORT", "USER"];
if (!VALID.includes(role)) {
  console.error(`Invalid role: ${role}. Use one of ${VALID.join(", ")}`);
  process.exit(1);
}

const connectionString =
  process.env.DATABASE_URL ?? "mysql://ptah:ptah-dev-password@127.0.0.1:3306/ptah_tours";
const db = new PrismaClient({ adapter: new PrismaMariaDb(connectionString) });

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

async function main(): Promise<void> {
  // Reuse the seeded SUPER_ADMIN; synthesize one test user per other role.
  const email =
    role === "SUPER_ADMIN" ? "admin@ptahtours.local" : `gate-${role.toLowerCase()}@ptahtours.local`;

  const user = await db.user.upsert({
    where: { email },
    update: { role, status: "ACTIVE" },
    create: {
      email,
      name: `Gate ${role}`,
      passwordHash: await hash("ChangeMe!Dev2026", ARGON2_OPTIONS),
      role,
      status: "ACTIVE",
    },
    select: { id: true, email: true, role: true },
  });

  const raw = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(raw).digest("hex");
  await db.session.create({
    data: { userId: user.id, token: tokenHash, expiresAt: new Date(Date.now() + SESSION_TTL_MS) },
  });

  console.error(`minted session for ${user.email} (${user.role})`);
  console.log(raw); // raw token — last stdout line
  await db.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await db.$disconnect();
  process.exit(1);
});
