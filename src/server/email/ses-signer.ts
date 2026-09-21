/**
 * Minimal AWS Signature Version 4 signer (server-only), just enough to
 * authorize an HTTPS POST to the SES v2 API without pulling in the AWS SDK.
 *
 * Implements the documented SigV4 flow: canonical request → string-to-sign →
 * signing key (date/region/service/aws4_request) → HMAC signature →
 * Authorization header. The secret access key is used only to derive the
 * signing key here; it is never logged or returned.
 *
 * Reference: AWS "Signing AWS API requests" (SigV4). Payload is hashed
 * (SHA-256) and that hex digest is sent as x-amz-content-sha256, which SES
 * requires. This is intentionally scoped to a single header set + JSON body;
 * it is not a general-purpose AWS client.
 */
import "server-only";
import { createHash, createHmac } from "node:crypto";

export interface SesSignParams {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  service: string;
  method: string;
  host: string;
  path: string;
  body: string;
}

function sha256Hex(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

function hmac(key: Buffer | string, data: string): Buffer {
  return createHmac("sha256", key).update(data, "utf8").digest();
}

/** yyyymmdd + full ISO basic timestamp (yyyymmddThhmmssZ) from one Date. */
function amzDates(now: Date): { amzDate: string; dateStamp: string } {
  const iso = now.toISOString().replace(/[:-]|\.\d{3}/g, ""); // 20240102T150405Z
  return { amzDate: iso, dateStamp: iso.slice(0, 8) };
}

/**
 * Build the signed header set for a SES v2 request. Returns the exact headers
 * to pass to fetch (Authorization + the signed x-amz-* + host + content-type).
 */
export async function sesV4AuthHeaders(
  params: SesSignParams,
): Promise<Record<string, string>> {
  const { accessKeyId, secretAccessKey, region, service, method, host, path, body } = params;
  const { amzDate, dateStamp } = amzDates(new Date());

  const payloadHash = sha256Hex(body);
  const contentType = "application/json";

  // Canonical headers MUST be sorted by lowercase name and signed in that order.
  const canonicalHeaders =
    `content-type:${contentType}\n` +
    `host:${host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`;
  const signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date";

  const canonicalRequest = [
    method,
    path,
    "", // no query string
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const scope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    scope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  // Derive the signing key, then sign.
  const kDate = hmac(`AWS4${secretAccessKey}`, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  const kSigning = hmac(kService, "aws4_request");
  const signature = createHmac("sha256", kSigning).update(stringToSign, "utf8").digest("hex");

  const authorization =
    `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${scope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return {
    "Content-Type": contentType,
    "X-Amz-Date": amzDate,
    "X-Amz-Content-Sha256": payloadHash,
    Authorization: authorization,
  };
}
