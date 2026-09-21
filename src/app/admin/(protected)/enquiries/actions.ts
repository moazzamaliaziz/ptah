"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCapability } from "@/server/auth/rbac";
import { writeAudit } from "@/server/audit";
import { setContactStatus, deleteContactMessage } from "@/server/contact";

const str = (fd: FormData, key: string): string => String(fd.get(key) ?? "");

function revalidateEnquiries(id?: string): void {
  revalidatePath("/admin/enquiries");
  if (id) revalidatePath(`/admin/enquiries/${id}`);
}

/** Change a message's status (READ / ARCHIVED / NEW). Support-level capability. */
export async function setEnquiryStatusAction(fd: FormData): Promise<void> {
  const user = await requireCapability("enquiries.view");
  const id = str(fd, "id");
  const status = str(fd, "status");
  const ok = await setContactStatus(id, status);
  if (ok) {
    await writeAudit({ actorId: user.id, action: "enquiry.status", entity: "contactMessage", entityId: id, meta: { status } });
    revalidateEnquiries(id);
  }
}

/** Permanently delete an enquiry. Admin-only (manages customer PII). */
export async function deleteEnquiryAction(fd: FormData): Promise<void> {
  const user = await requireCapability("enquiries.manage");
  const id = str(fd, "id");
  const ok = await deleteContactMessage(id);
  await writeAudit({ actorId: user.id, action: "enquiry.delete", entity: "contactMessage", entityId: id, meta: { ok } });
  revalidateEnquiries();
  if (ok) redirect("/admin/enquiries");
}
