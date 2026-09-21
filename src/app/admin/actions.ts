"use server";

/** Shared admin session actions. */
import { redirect } from "next/navigation";
import { getSessionUser, destroySession } from "@/server/auth/session";
import { writeAudit } from "@/server/audit";

export async function logoutAction(): Promise<void> {
  const user = await getSessionUser();
  await destroySession();
  if (user) {
    await writeAudit({ actorId: user.id, action: "auth.logout", entity: "user", entityId: user.id });
  }
  redirect("/admin/login");
}
