/**
 * secret-box — authenticated symmetric encryption for secrets at rest.
 *
 * Used by the integrations vault (src/server/integrations.ts) to store the 20
 * third-party credential blobs in `integrations.config_encrypted`. Credentials
 * are NEVER stored or logged in plaintext, and the ciphertext is authenticated
 * (AES-256-GCM) so tampering is detected on decrypt.
 *
 * Key derivation: a 32-byte key is derived with HKDF-SHA256 from
 * `INTEGRATIONS_SECRET` (preferred, set a dedicated 32+ byte value in prod) or,
 * as a fallback, from `AUTH_SECRET` so the box works in dev without extra
 * config. Rotating the key re-keys every stored blob (decrypt-then-re-encrypt);
 * that migration is an admin/ops task, documented in the README.
 *
 * Wire format (base64):  [ iv(12) | authTag(16) | ciphertext(N) ]
 */
import "server-only";
import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from "node:crypto";
import { env } from "@/lib/env";

const ALGO = "aes-256-gcm";
const IV_LEN = 12; // GCM standard nonce length
const TAG_LEN = 16;
const KEY_LEN = 32; // AES-256

let cachedKey: Buffer | null = null;

/** Lazily derive (and cache) the 32-byte data-encryption key. */
function getKey(): Buffer {
  if (cachedKey) return cachedKey;
  const ikm = env.INTEGRATIONS_SECRET ?? env.AUTH_SECRET;
  // Stable, non-secret salt/info bind the derived key to this purpose so the
  // same AUTH_SECRET used for auth transport can't collide with this key.
  const derived = hkdfSync(
    "sha256",
    Buffer.from(ikm, "utf8"),
    Buffer.from("ptah-tours:integrations:v1", "utf8"),
    Buffer.from("aes-256-gcm-config", "utf8"),
    KEY_LEN,
  );
  cachedKey = Buffer.from(derived);
  return cachedKey;
}

/** Encrypt a UTF-8 plaintext, returning a base64 wire string. */
export function seal(plaintext: string): string {
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, getKey(), iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64");
}

/**
 * Decrypt a base64 wire string produced by {@link seal}. Throws if the blob is
 * malformed or fails authentication (tampered / wrong key) — callers treat a
 * throw as "no usable credentials" and never surface the raw error to clients.
 */
export function open(wire: string): string {
  const buf = Buffer.from(wire, "base64");
  if (buf.length < IV_LEN + TAG_LEN) {
    throw new Error("secret-box: ciphertext too short");
  }
  const iv = buf.subarray(0, IV_LEN);
  const tag = buf.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const enc = buf.subarray(IV_LEN + TAG_LEN);
  const decipher = createDecipheriv(ALGO, getKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString("utf8");
}

/** Serialize + encrypt an arbitrary JSON-able credential record. */
export function sealJson(value: unknown): string {
  return seal(JSON.stringify(value));
}

/** Decrypt + parse a credential record; returns null on any failure. */
export function openJson<T>(wire: string | null | undefined): T | null {
  if (!wire) return null;
  try {
    return JSON.parse(open(wire)) as T;
  } catch {
    return null;
  }
}
