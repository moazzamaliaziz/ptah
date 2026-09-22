import type { Metadata } from "next";
import ThemeHub from "@/components/site/ThemeHub";
import { listPublishedTours } from "@/server/catalog";
import { getSessionUser } from "@/server/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Red Sea Diving & Snorkeling Tours | Ptah Tours",
  description:
    "Warm water, walls of coral, and reef fish by the thousand — the Red Sea off Hurghada and Sharm El Sheikh is world-class year-round. Our snorkeling and diving tours, with licensed dive guides.",
  alternates: { canonical: "/red-sea" },
};

export default async function RedSeaPage() {
  const [tours, user] = await Promise.all([
    listPublishedTours({ tag: "red-sea" }),
    getSessionUser(),
  ]);

  return (
    <ThemeHub
      title="Red Sea & Reefs"
      eyebrow="Explore by theme"
      lede="Some of the finest coral reefs on the planet sit a short boat ride off Egypt's Red Sea coast — warm, clear, and alive with colour almost every day of the year."
      intro={[
        "From Hurghada and Sharm El Sheikh, the reefs begin almost at the shoreline. Slip in over a coral garden and you're among clouds of anthias, gliding turtles, and the occasional curious reef shark. Whether it's your first mask-and-snorkel or your hundredth dive, there's water here for you.",
        "We work with licensed dive guides and hold to reef-safe practices on every boat — no touching, no feeding, reef-safe sunscreen only. The Red Sea pairs beautifully with a few days of temples inland: history in the morning, coral in the afternoon.",
      ]}
      heroImage="/assets/activities/boat-snorkeling.webp"
      heroAlt="Snorkelers drifting above a vivid coral garden in the clear shallows of the Red Sea."
      tours={tours}
      isAuthenticated={user !== null}
      toursHref="/tours?type=red-sea"
    />
  );
}
