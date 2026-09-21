/**
 * Phase 2 gate helper — plant a KNOWN sentinel secret in an integration so the
 * credential-leak check is meaningful (an empty vault can't leak anything).
 *
 * Replicates src/lib/secret-box's seal (HKDF-SHA256 → AES-256-GCM) here because
 * that module imports "server-only" and cannot load under plain tsx. Key inputs
 * (INTEGRATIONS_SECRET ?? AUTH_SECRET) and the HKDF salt/info are copied verbatim
 * from secret-box.ts, so the running app decrypts what this writes.
 *
 * Run: npx tsx scripts/phase2-seed-secret.mts
 */
import "dotenv/config";
import { createCipheriv, hkdfSync, randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const SENTINEL = "sk_live_LEAKCANARY_9c3f1a7e2b6d4085a1f0e5c8";

function getKey(): Buffer {
  const ikm = process.env.INTEGRATIONS_SECRET ?? process.env.AUTH_SECRET;
  if (!ikm) throw new Error("Neither INTEGRATIONS_SECRET nor AUTH_SECRET is set");
  return Buffer.from(
    hkdfSync(
      "sha256",
      Buffer.from(ikm, "utf8"),
      Buffer.from("ptah-tours:integrations:v1", "utf8"),
      Buffer.from("aes-256-gcm-config", "utf8"),
      32,
    ),
  );
}

function sealJson(value: unknown): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
  const enc = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64");
}

const connectionString =
  process.env.DATABASE_URL ?? "mysql://ptah:ptah-dev-password@localhost:3306/ptah_tours";
const db = new PrismaClient({ adapter: new PrismaMariaDb(connectionString) });

async function main(): Promise<void> {
  // STRIPE has both a non-secret (PUBLISHABLE_KEY) and secret (SECRET_KEY) field:
  // a good single-card leak test. Store a plain publishable id + the sentinel secret.
  const config = {
    PUBLISHABLE_KEY: "pk_test_PUBLIC_visible_ok",
    SECRET_KEY: SENTINEL,
    WEBHOOK_SECRET: "whsec_ALSO_SECRET_" + SENTINEL,
  };
  await db.integration.upsert({
    where: { key: "STRIPE" },
    update: { enabled: true, configEncrypted: sealJson(config) },
    create: { key: "STRIPE", enabled: true, configEncrypted: sealJson(config) },
  });
  console.log("Sealed sentinel into STRIPE.SECRET_KEY / WEBHOOK_SECRET.");
  console.log("SENTINEL=" + SENTINEL);
  await db.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await db.$disconnect();
  process.exit(1);
});
