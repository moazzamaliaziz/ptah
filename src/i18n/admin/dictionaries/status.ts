/**
 * Booking-status labels (Wave 5). Keyed by the Prisma `BookingStatus` enum so a
 * new status becomes a compile error until both languages label it. Shared by
 * the dashboard, the orders list and the booking-detail screen.
 */
import type { BookingStatus } from "@prisma/client";

export type StatusDict = Record<BookingStatus, string>;

export const statusEn: StatusDict = {
  PENDING_PAYMENT: "Awaiting payment",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
  FAILED: "Failed",
};

export const statusAr: StatusDict = {
  PENDING_PAYMENT: "بانتظار الدفع",
  CONFIRMED: "مؤكَّد",
  CANCELLED: "ملغى",
  REFUNDED: "مُسترَد",
  FAILED: "فشل",
};
