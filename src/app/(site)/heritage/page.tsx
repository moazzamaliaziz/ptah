import type { Metadata } from "next";
import ThemeHub from "@/components/site/ThemeHub";
import { listPublishedTours } from "@/server/catalog";
import { getSessionUser } from "@/server/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Heritage & History Tours in Egypt | Ptah Tours",
  description:
    "Egypt's greatest monuments, read by licensed Egyptologists — the pyramids of Giza, the temples of Luxor and Karnak, the tombs of the Valley of the Kings. Our heritage and history tours.",
  alternates: { canonical: "/heritage" },
};

export default async function HeritagePage() {
  const [tours, user] = await Promise.all([
    listPublishedTours({ tag: "classic" }),
    getSessionUser(),
  ]);

  return (
    <ThemeHub
      title="Heritage & History"
      eyebrow="Explore by theme"
      lede="Five thousand years of civilization, told properly. Our heritage tours put a licensed Egyptologist beside you at the sites that made Egypt legendary."
      intro={[
        "This is the Egypt of the schoolbooks made real — the Great Pyramid and the Sphinx at Giza, the columned halls of Karnak, the painted tombs of the Valley of the Kings, and the treasures of the Egyptian Museum. But seeing them and understanding them are two different trips.",
        "On every heritage journey, your guide reads the walls for you: the story in a relief, why a temple faces the sunrise, what a cartouche actually says. We time each visit around the light and the crowds, so the monuments feel monumental — not like a queue.",
      ]}
      heroImage="/assets/itineraries/valley-of-kings.webp"
      heroAlt="Golden cliffs descending toward the tombs of the Valley of the Kings."
      tours={tours}
      isAuthenticated={user !== null}
      toursHref="/tours?type=classic"
    />
  );
}
