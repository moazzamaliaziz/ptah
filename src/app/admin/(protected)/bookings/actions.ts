"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCapability } from "@/server/auth/rbac";
import { adminRefundBooking, adminCancelBooking } from "@/server/admin/orders-admin";
import { confirmBankTransferBooking } from "@/server/booking";

const str = (fd: FormData, key: string): string => String(fd.get(key) ?? "");

function revalidateBooking(id: string): void {
  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${id}`);
}

/** Full-refund a confirmed booking. Admin-only (bookings.edit). */
export async function refundBookingAction(fd: FormData): Promise<void> {
  const user = await requireCapability("bookings.edit");
  const id = str(fd, "id");
  const result = await adminRefundBooking({ bookingId: id, actorId: user.id });
  revalidateBooking(id);
  redirect(`/admin/bookings/${id}?${result.ok ? "msg=refunded" : `err=${result.reason}`}`);
}

/** Cancel + release a stuck PENDING_PAYMENT booking. Admin-only (bookings.edit). */
export async function cancelBookingAction(fd: FormData): Promise<void> {
  const user = await requireCapability("bookings.edit");
  const id = str(fd, "id");
  const result = await adminCancelBooking({ bookingId: id, actorId: user.id });
  revalidateBooking(id);
  redirect(`/admin/bookings/${id}?${result.ok ? "msg=cancelled" : `err=${result.reason}`}`);
}

/** Mark an offline bank-transfer booking as paid → confirms it. Admin-only. */
export async function markBankTransferPaidAction(fd: FormData): Promise<void> {
  const user = await requireCapability("bookings.edit");
  const id = str(fd, "id");
  const result = await confirmBankTransferBooking({ bookingId: id, actorId: user.id });
  revalidateBooking(id);
  redirect(`/admin/bookings/${id}?${result.ok ? "msg=paid" : "err=NOT_REFUNDABLE"}`);
}
