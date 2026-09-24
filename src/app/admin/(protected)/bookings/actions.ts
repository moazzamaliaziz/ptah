"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCapability } from "@/server/auth/rbac";
import {
  adminRefundBooking,
  adminCancelBooking,
  setBookingStatus,
  parseBookingStatus,
} from "@/server/admin/orders-admin";
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
  const reference = str(fd, "reference").trim() || undefined;
  const result = await confirmBankTransferBooking({ bookingId: id, actorId: user.id, reference });
  revalidateBooking(id);
  redirect(`/admin/bookings/${id}?${result.ok ? "msg=paid" : "err=NOT_REFUNDABLE"}`);
}

/**
 * Manually set a booking's status (item #6). Bookkeeping only — corrects the
 * record and its seat count; it does NOT refund/charge a gateway or email the
 * customer. Admin-only (bookings.edit).
 */
export async function setBookingStatusAction(fd: FormData): Promise<void> {
  const user = await requireCapability("bookings.edit");
  const id = str(fd, "id");
  const target = parseBookingStatus(str(fd, "status"));
  if (!target) {
    redirect(`/admin/bookings/${id}?err=INVALID_STATUS`);
  }
  const result = await setBookingStatus({ bookingId: id, target, actorId: user.id });
  revalidateBooking(id);
  redirect(`/admin/bookings/${id}?${result.ok ? "msg=status" : `err=${result.reason}`}`);
}
