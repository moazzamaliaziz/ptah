/**
 * Phase 4 gate probe — proves the DB-level invariants the auth modules rely on.
 * Uses direct Prisma (the server/* modules import "server-only", which throws
 * under tsx), so this validates the exact constraints/queries those modules
 * depend on rather than importing them. Creates a throwaway user, asserts each
 * invariant, and cascades everything away at the end (onDelete: Cascade).
 */
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { randomBytes } from "node:crypto";

const url = process.env.DATABASE_URL ?? "mysql://ptah:ptah-dev-password@127.0.0.1:3306/ptah_tours";
const db = new PrismaClient({ adapter: new PrismaMariaDb(url) });

const results: { name: string; pass: boolean; detail: string }[] = [];
function check(name: string, pass: boolean, detail: string) {
  results.push({ name, pass, detail });
}
function tok() {
  return randomBytes(32).toString("hex");
}

async function main() {
  const marker = `__phase4probe_${Date.now()}`;
  const email = `${marker}@example.test`;

  // Need a real tour for the wishlist FK.
  const tour = await db.tour.findFirst({ where: { status: "PUBLISHED" }, select: { id: true } });
  if (!tour) throw new Error("no PUBLISHED tour to attach a wishlist row to");

  const user = await db.user.create({
    data: { email, name: "Probe User", passwordHash: "x".repeat(20), role: "USER", status: "ACTIVE" },
    select: { id: true },
  });

  // (1) ENUMERATION: a duplicate email must throw P2002 — this is what
  // registerUser catches to return its generic (non-revealing) message.
  let p2002 = false;
  try {
    await db.user.create({ data: { email, name: "Dup", passwordHash: "y".repeat(20), role: "USER", status: "ACTIVE" } });
  } catch (e) {
    p2002 = typeof e === "object" && e !== null && "code" in e && (e as { code?: string }).code === "P2002";
  }
  check("enumeration: duplicate email → P2002", p2002, p2002 ? "unique(email) enforced" : "NO P2002 thrown");

  // (2) SESSION REVOCATION: revokeAllForUser deletes every session by userId.
  await db.session.createMany({
    data: [0, 1, 2].map(() => ({ userId: user.id, token: tok(), expiresAt: new Date(Date.now() + 3600_000) })),
  });
  const before = await db.session.count({ where: { userId: user.id } });
  const { count: revoked } = await db.session.deleteMany({ where: { userId: user.id } });
  const after = await db.session.count({ where: { userId: user.id } });
  check("revocation: deleteMany(userId) removes all", before === 3 && revoked === 3 && after === 0, `before=${before} revoked=${revoked} after=${after}`);

  // (3) RESET TOKEN SINGLE-USE: the guarded updateMany(usedAt:null) is the race
  // guard in resetPassword — exactly one claim wins (count 1); the rest get 0.
  const rt = await db.passwordResetToken.create({
    data: { userId: user.id, tokenHash: tok(), expires: new Date(Date.now() + 3600_000) },
    select: { id: true },
  });
  const claim1 = await db.passwordResetToken.updateMany({ where: { id: rt.id, usedAt: null }, data: { usedAt: new Date() } });
  const claim2 = await db.passwordResetToken.updateMany({ where: { id: rt.id, usedAt: null }, data: { usedAt: new Date() } });
  check("reset token: single-use claim", claim1.count === 1 && claim2.count === 0, `claim1=${claim1.count} claim2=${claim2.count}`);

  // (4) WISHLIST MERGE IDEMPOTENCY: @@unique([userId,tourId]) means a repeated
  // merge (createMany skipDuplicates) never duplicates a row.
  await db.wishlist.create({ data: { userId: user.id, tourId: tour.id } });
  await db.wishlist.createMany({ data: [{ userId: user.id, tourId: tour.id }], skipDuplicates: true });
  const wcount = await db.wishlist.count({ where: { userId: user.id, tourId: tour.id } });
  check("wishlist: unique(userId,tourId) — merge idempotent", wcount === 1, `rows=${wcount}`);

  // Cleanup — cascade removes sessions, tokens, wishlist rows.
  await db.user.delete({ where: { id: user.id } });
  const orphanSessions = await db.session.count({ where: { userId: user.id } });
  const orphanTokens = await db.passwordResetToken.count({ where: { userId: user.id } });
  const orphanWish = await db.wishlist.count({ where: { userId: user.id } });
  check("cascade: user delete purges children", orphanSessions === 0 && orphanTokens === 0 && orphanWish === 0, `sess=${orphanSessions} tok=${orphanTokens} wish=${orphanWish}`);

  const allPass = results.every((r) => r.pass);
  console.log(JSON.stringify({ allPass, results }, null, 2));
  if (!allPass) process.exitCode = 1;
}

main()
  .catch((e) => {
    console.error("PROBE_FAIL", e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
