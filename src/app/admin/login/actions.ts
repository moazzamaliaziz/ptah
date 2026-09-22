"use server";

/**
 * Admin sign-in (Phase 2). Server Action = CSRF-safe by Next's same-origin +
 * encrypted-action-id design. Rate-limited per IP. Admin login is deliberately
 * NOT gated by the public LOGIN_ENABLED toggle — staff must be able to reach
 * the panel even during maintenance / with public login disabled.
 */
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { verifyCredentials } from "@/server/auth/credentials";
import { createSession } from "@/server/auth/session";
import { isStaff } from "@/server/auth/rbac";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/client-ip";
import { writeAudit } from "@/server/audit";
import { logger } from "@/lib/logger";

const schema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(200),
});

/** Only permit same-app admin return paths (no open redirect / protocol-relative). */
function safeReturn(from: FormDataEntryValue | null): string {
  const v = typeof from === "string" ? from : "";
  if (v.startsWith("/admin") && !v.startsWith("//") && !v.includes("\\")) return v;
  return "/admin";
}

export async function loginAction(formData: FormData): Promise<void> {
  const target = safeReturn(formData.get("from"));

  const h = await headers();
  const ip = getClientIp(h);
  const userAgent = h.get("user-agent");

  // Per-IP throttle: 10 attempts / minute.
  if (!(await checkRateLimit(`admin-login:${ip}`, 10, 60_000)).allowed) {
    redirect(`/admin/login?error=rate&from=${encodeURIComponent(target)}`);
  }

  const parsed = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    redirect(`/admin/login?error=invalid&from=${encodeURIComponent(target)}`);
  }

  const user = await verifyCredentials(parsed.data.email, parsed.data.password);
  if (!user || !isStaff(user)) {
    logger.warn("admin login denied", { ip });
    redirect(`/admin/login?error=invalid&from=${encodeURIComponent(target)}`);
  }

  await createSession(user.id, { ip, userAgent });
  await writeAudit({
    actorId: user.id,
    action: "auth.login",
    entity: "user",
    entityId: user.id,
    meta: { area: "admin", ip },
  });
  redirect(target);
}
