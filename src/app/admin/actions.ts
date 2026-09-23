"use server";

/** Shared admin session actions. */
import { redirect } from "next/navigation";
import { after } from "next/server";
import { getSessionUser, destroySession } from "@/server/auth/session";
import { writeAudit } from "@/server/audit";

export async function logoutAction(): Promise<void> {
  const user = await getSessionUser();
  await destroySession();
  // Audit logging is a non-critical side effect — run it AFTER the response so
  // sign-out redirects immediately instead of waiting on another DB round trip.
  if (user) {
    after(() => writeAudit({ actorId: user.id, action: "auth.logout", entity: "user", entityId: user.id }));
  }
  redirect("/admin/login");
}
