import type { Metadata } from "next";
import ComingSoon from "@/components/marketing/ComingSoon";

export const metadata: Metadata = {
  title: "Track your booking",
  description:
    "Look up any Ptah Tours booking by reference and email. Booking tracking is coming soon.",
  alternates: { canonical: "/track-booking" },
};

export default function TrackBookingPage() {
  return (
    <ComingSoon
      eyebrow="Track Booking"
      title="Booking tracking needs the booking engine first."
      description="Once a booking reference and status system exist (Phase 9), travelers will be able to look up any booking here by reference and email."
    />
  );
}
