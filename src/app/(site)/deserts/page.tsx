import type { Metadata } from "next";
import ThemeHub from "@/components/site/ThemeHub";
import { listPublishedTours } from "@/server/catalog";
import { getSessionUser } from "@/server/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Desert Tours & Safaris in Egypt | Ptah Tours",
  description:
    "Egypt beyond the Nile — desert safaris, star-filled nights, and the mountain monastery of St Catherine in the Sinai. Our desert tours, led by guides who know the sands.",
  alternates: { canonical: "/deserts" },
};

export default async function DesertsPage() {
  const [tours, user] = await Promise.all([
    listPublishedTours({ tag: "desert" }),
    getSessionUser(),
  ]);

  return (
    <ThemeHub
      title="Deserts & Sinai"
      eyebrow="Explore by theme"
      lede="Past the last stretch of green lies most of Egypt: an ocean of sand, wind-carved rock, and a silence you can hear. Our desert tours take you into it, safely and well."
      intro={[
        "The desert is where Egypt gets quiet and vast. Ride out into the dunes as the light turns gold, watch the stars come out with nothing to dim them, and share sweet tea around a fire with Bedouin hosts who have crossed these sands for generations.",
        "In the Sinai, the desert climbs. We can guide you up to St Catherine's Monastery beneath Mount Sinai, or out along the Red Sea's desert coast. Wherever the sand takes you, you'll go with guides who read the terrain and plan every trip around your comfort and safety.",
      ]}
      heroImage="/assets/activities/desert-safari.webp"
      heroAlt="A four-wheel-drive tracing a ridge of golden dunes under a wide desert sky."
      tours={tours}
      isAuthenticated={user !== null}
      toursHref="/tours?type=desert"
    />
  );
}
