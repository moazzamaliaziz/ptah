import type { Metadata } from "next";
import ThemeHub from "@/components/site/ThemeHub";
import { listPublishedToursForDestinations } from "@/server/catalog";
import { getSessionUser } from "@/server/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Nile: Luxor, Aswan & the River | Ptah Tours",
  description:
    "The river that made Egypt — the temples of Luxor and Karnak, the islands of Aswan, and slow felucca afternoons under sail. Our tours along the Nile, guided by people who grew up beside it.",
  alternates: { canonical: "/the-nile" },
};

export default async function TheNilePage() {
  // Curated by the great Nile-side destinations — Luxor and Aswan — rather than
  // a single "cruise" tag, so the hub reflects the real river-focused catalog.
  const [tours, user] = await Promise.all([
    listPublishedToursForDestinations(["luxor", "aswan"]),
    getSessionUser(),
  ]);

  return (
    <ThemeHub
      title="The Nile"
      eyebrow="Explore by theme"
      lede="Egypt is the gift of the Nile — and the river is still the best way to understand it. From the temples of Luxor to the islands of Aswan, our Nile journeys follow the water south."
      intro={[
        "For thousands of years, life in Egypt has clung to this thin green ribbon through the desert. Follow it and the country unfolds in order: the mighty temples of Karnak and Luxor, the tombs of the Theban west bank, and further south the calmer, Nubian-flavoured world of Aswan, with Philae temple rising from the water.",
        "Between the great sites, the river slows you down in the best way. A felucca sail at Aswan — no engine, just canvas and the wind — is the afternoon travelers remember most. We build our Nile trips around both: the monuments by morning, the river by evening.",
      ]}
      heroImage="/assets/stories/nile-sailing-aswan.webp"
      heroAlt="A felucca under full sail on the Nile near Aswan at golden hour."
      tours={tours}
      isAuthenticated={user !== null}
      toursHref="/tours"
    />
  );
}
