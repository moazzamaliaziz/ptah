/**
 * Ptah Tours — landing page content SSOT (Phase 1a).
 *
 * Typed content object shaped like the future CMS `ContentSection.contentPayload`
 * rows (see prisma/schema.prisma + design.md §7). Phase 2 swaps these static
 * reads to DB-backed queries; components must consume ONLY these exports.
 *
 * ASSET PROVENANCE (all files under /public/assets, copied from the curated
 * library at ../images in Phase 1a):
 *   hero/            -- 3 landing hero slides, 2 crops each
 *                       (portrait variant = spec 388/610 mobile box src,
 *                        landscape variant = spec 1420/800 >=744 src)
 *   destinations/    -- 6 destination cards (cairo/luxor/aswan/alexandria/
 *                       hurghada/sharm-el-sheikh), portrait ~0.8 for trip-card
 *                       boxes (spec 754/850 family)
 *   itineraries/     -- "Itineraries" tab cards (8)
 *   activities/      -- Adventure / Culture / River & Sea / Heritage tab cards
 *   stories/         -- Featured Stories slides (5)
 *   cta/             -- full-bleed Plan CTA (2 variants) + 50/50 pair
 *   tour-types/      -- "Tour Types" cards (4) -- this module renames the
 *                       reference "Find Accommodation" slot
 */

import type { IconName } from "@/components/ui/Icon";

/* ================================ Types ==================================== */

export interface ImageRef {
  /** path under /public, e.g. /assets/hero/hero-giza.webp */
  src: string;
  /** human-written alt (design.md §6.1: sentence case, no "image of") */
  alt: string;
  credit?: string;
}

/** A slot image with optional per-breakpoint source variants (design.md §1.4). */
export interface CropImage extends ImageRef {
  /** >=46.5em (744px) variant source */
  mid?: string;
  /** third variant source; `wideAt` picks the switch breakpoint */
  wide?: string;
  wideAt?: 1128 | 1440;
}

export interface CtaLink {
  label: string;
  href: string;
  target?: "_self" | "_blank";
}

export interface CustomButtonCta {
  buttonType: "buildATrip";
  trackingContext: string;
  /** Rebuild convenience [inf]: the reference resolves this in the link object. */
  href: string;
}

export type Cta =
  | { type: "link"; link: CtaLink }
  | { type: "customButton"; button: CustomButtonCta; label: string };

export interface HeroSlide {
  id: string;
  season: "summer" | "winter";
  title: string;
  shortLabel: string;
  subtitle?: string;
  image: CropImage;
  hotspots: Array<{ xPct: number; yPct: number; label: string; href: string }>;
}

export interface InspiredCard {
  title: string;
  href: string;
  days?: number;
  experiences?: number;
  image: ImageRef;
}

export interface InspiredTab {
  key: string;
  label: string;
  cards: InspiredCard[];
}

export interface PlanCtaBlock {
  title: string;
  copy: string;
  image: CropImage;
  credit: string;
  cta: Cta;
}

export interface FiftyCta {
  title: string;
  copy: string;
  cta: CtaLink;
  image: CropImage;
}

export interface KbygItem {
  iconKey: IconName;
  title: string;
  copy: string;
  cta: CtaLink;
}

export interface TourType {
  title: string;
  blurb: string;
  href: string;
  image: ImageRef;
}

export interface Story {
  title: string;
  summary: string;
  href: string;
  image: CropImage;
  credit: string;
}

/* ---- Navigation / chrome ---- */

export interface QuickLink extends CtaLink {
  iconKey: IconName;
}

export interface MegaColumn {
  heading: string;
  links: CtaLink[];
}

export interface MegaSection {
  key: string;
  /** nav row label */
  title: string;
  columns: MegaColumn[];
  imageCtas: Array<{ label: string; heading: string; href: string; image: ImageRef }>;
}

export interface SiteNav {
  quickLinks: QuickLink[];
  sections: MegaSection[];
  directLinks: CtaLink[];
  buildTripCta: CtaLink;
  bookmarksHref: string;
  searchHref: string;
  popularSearches: string[];
}

/* ---- Footer ---- */

export interface FooterColumn {
  heading: string;
  links: CtaLink[];
}

export interface SocialLink {
  network: string;
  href: string;
  iconKey: IconName;
}

export interface PartnerMark {
  name: string;
  tagline: string;
  href: string;
}

export interface BadgeMark {
  heading: string;
  sub: string;
  href: string;
}

export interface CookieCategoryDef {
  key: "preferences" | "analytics" | "marketing";
  name: string;
  description: string;
}

export interface FooterContent {
  newsletter: { heading: string; blurb: string; cta: CtaLink };
  columns: FooterColumn[];
  badgeHeading: string;
  badges: BadgeMark[];
  partnersHeading: string;
  partners: PartnerMark[];
  socials: SocialLink[];
  legalLinks: CtaLink[];
  copyrightLine: string;
  acknowledgement: string;
  cookie: {
    heading: string;
    copy: string;
    manageHeading: string;
    categories: CookieCategoryDef[];
  };
}

/* =============================== Content =================================== */

const A = "/assets" as const;

export const siteMeta = {
  name: "Ptah Tours",
  legalName: "Ptah Tours for Tourism LLC",
  tagline: "Egypt, curated by the people who call it home",
} as const;

export const heroSlides: HeroSlide[] = [
  {
    id: "giza",
    season: "summer",
    title: "Walk Among the Last Wonder of the Ancient World",
    shortLabel: "the Pyramids of Giza",
    subtitle: "Private Egyptologist-led mornings at Giza, before the crowds arrive.",
    image: {
      // base (mobile) = portrait variant; >=744 = landscape
      src: `${A}/hero/hero-giza-portrait.webp`,
      mid: `${A}/hero/hero-giza.webp`,
      alt: "The Great Pyramid of Khufu and the Sphinx at Giza in warm morning light, with the Cairo plateau behind.",
      credit: "Ptah Tours field archive",
    },
    hotspots: [
      { xPct: 30, yPct: 44, label: "Great Pyramid of Khufu", href: "/trip-ideas/panorama-of-the-pyramids" },
      { xPct: 62, yPct: 70, label: "The Great Sphinx", href: "/trip-ideas/panorama-of-the-pyramids" },
    ],
  },
  {
    id: "thebes",
    season: "summer",
    title: "Drift Over the Tombs of Thebes at First Light",
    shortLabel: "ballooning over Luxor",
    subtitle: "Sunrise balloons, the Valley of the Kings, and Karnak before the heat.",
    image: {
      src: `${A}/hero/hero-thebes-portrait.webp`,
      mid: `${A}/hero/hero-thebes.webp`,
      alt: "A hot air balloon drifting over the west bank of Luxor at sunrise, with the Nile greenbelt below.",
      credit: "Ptah Tours field archive",
    },
    hotspots: [
      { xPct: 26, yPct: 38, label: "Hot-air balloons at dawn", href: "/trip-ideas/luxor-sunrise-weekend" },
      { xPct: 68, yPct: 62, label: "Valley of the Kings", href: "/trip-ideas/kings-and-queens-of-thebes" },
    ],
  },
  {
    id: "blue-hole",
    season: "summer",
    title: "Descend Into the Blue: Sinai's Living Reef",
    shortLabel: "the Blue Hole coast",
    subtitle: "Snorkel the Blue Hole, Ras Abu Galum and Ras Mohammed with licensed dive guides.",
    image: {
      src: `${A}/hero/hero-blue-hole-portrait.webp`,
      mid: `${A}/hero/hero-blue-hole.webp`,
      alt: "The deep blue circle of Dahab's Blue Hole seen from above, ringed by pale reef shelf and Sinai mountains.",
      credit: "Ptah Tours field archive",
    },
    hotspots: [
      { xPct: 40, yPct: 46, label: "The Blue Hole sinkhole", href: "/trip-ideas/blue-hole-sinai" },
      { xPct: 66, yPct: 30, label: "Ras Abu Galum coast", href: "/trip-ideas/blue-hole-sinai" },
    ],
  },
];

export const inspiredTabs: InspiredTab[] = [
  {
    key: "itineraries",
    label: "Itineraries",
    cards: [
      {
        title: "Panorama of the Pyramids",
        href: "/trip-ideas/panorama-of-the-pyramids",
        days: 2,
        experiences: 6,
        image: { src: `${A}/itineraries/giza-essentials.webp`, alt: "A camel passing in front of the Great Pyramid of Khufu on the Giza plateau." },
      },
      {
        title: "Cairo Heritage Weekend",
        href: "/trip-ideas/cairo-heritage-weekend",
        days: 3,
        experiences: 9,
        image: { src: `${A}/itineraries/cairo-heritage.webp`, alt: "Gallery cases and gilded artifacts inside the Egyptian Museum in Cairo." },
      },
      {
        title: "Karnak by Day, Luxor Temple by Night",
        href: "/trip-ideas/karnak-luxor-evening",
        days: 2,
        experiences: 7,
        image: { src: `${A}/itineraries/karnak-evening.webp`, alt: "Floodlit columns of Luxor Temple at dusk, glowing amber against a deep blue sky." },
      },
      {
        title: "Kings & Queens of Thebes",
        href: "/trip-ideas/kings-and-queens-of-thebes",
        days: 3,
        experiences: 8,
        image: { src: `${A}/itineraries/valley-of-kings.webp`, alt: "Golden cliffs descending toward the tombs of the Valley of the Kings." },
      },
      {
        title: "Philae Island & the High Dam",
        href: "/trip-ideas/philae-island-aswan",
        days: 2,
        experiences: 5,
        image: { src: `${A}/itineraries/philae-island.webp`, alt: "The island temple of Philae approached by boat across calm blue water." },
      },
      {
        title: "The Nubian Village by Felucca",
        href: "/trip-ideas/nubian-village-aswan",
        days: 2,
        experiences: 6,
        image: { src: `${A}/itineraries/nubian-village.webp`, alt: "A painted Nubian village house in bright ochre and blue above the Nile." },
      },
      {
        title: "Alexandria in a Weekend",
        href: "/trip-ideas/alexandria-weekend",
        days: 2,
        experiences: 7,
        image: { src: `${A}/itineraries/alexandria-classics.webp`, alt: "The modern Bibliotheca Alexandrina's curved roof facing the Mediterranean." },
      },
      {
        title: "Sinai Summit & Saint Catherine's",
        href: "/trip-ideas/sinai-summit-st-catherines",
        days: 2,
        experiences: 4,
        image: { src: `${A}/itineraries/sinai-summit.webp`, alt: "Hikers on the camel path up Mount Sinai under a pre-dawn sky." },
      },
    ],
  },
  {
    key: "adventure",
    label: "Adventure",
    cards: [
      {
        title: "Snorkel the Blue Hole",
        href: "/trip-ideas/blue-hole-sinai",
        image: { src: `${A}/activities/blue-hole-dive.webp`, alt: "A snorkeler floating over the coral shelf at the edge of the Blue Hole." },
      },
      {
        title: "Trek the Colored Canyon",
        href: "/trip-ideas/colored-canyon-sinai",
        image: { src: `${A}/activities/colored-canyon.webp`, alt: "Bands of red, gold and cream rock folding through the Colored Canyon slot." },
      },
      {
        title: "Quad Safari at Sunset",
        href: "/trip-ideas/desert-safari-quad-sunset",
        image: { src: `${A}/activities/desert-safari.webp`, alt: "Quad bikes kicking up dust trails across an orange desert plain at sunset." },
      },
      {
        title: "Red Sea Boat Day",
        href: "/trip-ideas/red-sea-boat-snorkeling",
        image: { src: `${A}/activities/boat-snorkeling.webp`, alt: "A white dive boat anchored over turquoise reef water in the Red Sea." },
      },
    ],
  },
  {
    key: "culture",
    label: "Culture",
    cards: [
      {
        title: "The Egyptian Museum, Guided",
        href: "/trip-ideas/egyptian-museum-guided",
        image: { src: `${A}/activities/museum-tahrir.webp`, alt: "Carved stone statues and sarcophagi inside the Egyptian Museum galleries." },
      },
      {
        title: "Khan el-Khalili After Dark",
        href: "/trip-ideas/khan-el-khalili-night",
        image: { src: `${A}/activities/khan-el-khalili.webp`, alt: "Lantern stalls glowing inside the Khan el-Khalili bazaar at night." },
      },
      {
        title: "Tea with a Nubian Family",
        href: "/trip-ideas/nubian-village-aswan",
        image: { src: `${A}/activities/nubian-culture.webp`, alt: "A painted Nubian courtyard with a family gathering over tea." },
      },
      {
        title: "Bibliotheca Alexandrina & Qaitbay",
        href: "/trip-ideas/alexandria-weekend",
        image: { src: `${A}/activities/bibliotheca.webp`, alt: "The slanted granite facade of the Bibliotheca Alexandrina catching the sun." },
      },
    ],
  },
  {
    key: "river-sea",
    label: "River & Sea",
    cards: [
      {
        title: "Felucca Around Philae",
        href: "/trip-ideas/philae-island-aswan",
        image: { src: `${A}/activities/philae-felucca.webp`, alt: "A white-sailed felucca gliding toward Philae Temple across the Nile." },
      },
      {
        title: "Ras Mohammed Boat Day",
        href: "/trip-ideas/ras-mohammed-park",
        image: { src: `${A}/activities/ras-mohammed.webp`, alt: "Clear turquoise shallows and reef visible from a boat at Ras Mohammed." },
      },
      {
        title: "Sunset Felucca, Luxor",
        href: "/trip-ideas/luxor-sunrise-weekend",
        image: { src: `${A}/activities/nile-sunset-felucca.webp`, alt: "A felucca sail catching the last orange light over the Nile at Luxor." },
      },
      {
        title: "Snorkel the House Reefs",
        href: "/trip-ideas/red-sea-boat-snorkeling",
        image: { src: `${A}/activities/red-sea-boat.webp`, alt: "Snorkelers drifting above coral gardens along the Red Sea coast." },
      },
    ],
  },
  {
    key: "heritage",
    label: "Heritage",
    cards: [
      {
        title: "The Great Hypostyle Hall",
        href: "/trip-ideas/karnak-luxor-evening",
        image: { src: `${A}/activities/karnak-hypostyle.webp`, alt: "Massive papyrus-bud columns crowding the Karnak hypostyle hall." },
      },
      {
        title: "Inside the Valley of the Kings",
        href: "/trip-ideas/kings-and-queens-of-thebes",
        image: { src: `${A}/activities/valley-heritage.webp`, alt: "Painted tomb corridor walls glowing under conservation lighting in the Valley of the Kings." },
      },
      {
        title: "Philae: Temple of Isis",
        href: "/trip-ideas/philae-island-aswan",
        image: { src: `${A}/activities/philae-temple.webp`, alt: "The carved gateway of Philae Temple dedicated to the goddess Isis." },
      },
      {
        title: "Guardians of Giza",
        href: "/trip-ideas/panorama-of-the-pyramids",
        image: { src: `${A}/activities/sphinx-guardians.webp`, alt: "The Sphinx gazing past the camera with the pyramid of Khafre behind." },
      },
    ],
  },
];

export const planCta: PlanCtaBlock = {
  title: "Plan Your Dream Trip",
  copy: "Tell our Cairo studio what you are dreaming of — pyramids at dawn, a lazy Nile reach between temples, a week on the reef — and a dedicated trip designer will build the journey with you, message by message.",
  image: {
    // portrait variant (spec 1095/1620) + landscape mid/wide (spec 1562/847, 1988/1078 @1440)
    src: `${A}/cta/plan-nile-portrait.webp`,
    mid: `${A}/cta/plan-karnak-landscape.webp`,
    // same landscape file serves the 1988/1078 @1440 slot (no distinct third crop yet)
    wide: `${A}/cta/plan-karnak-landscape.webp`,
    wideAt: 1440,
    alt: "A felucca sailing past palm trees on the Nile at Aswan, with granite boulders marking the First Cataract.",
  },
  credit: "Ptah Tours field archive — Aswan",
  cta: {
    type: "customButton",
    button: { buttonType: "buildATrip", trackingContext: "HomePageFullPageCTA", href: "/manage/trip-builder" },
    label: "Start Planning",
  },
};

export const fiftyCtas: [FiftyCta, FiftyCta] = [
  {
    title: "Built Around You",
    copy: "Every Ptah journey is private and tailor-made — your guide, your pace, your route. Nothing off the rack.",
    cta: { label: "Design My Journey", href: "/contact" },
    image: {
      src: `${A}/cta/fifty-bespoke-journeys.webp`,
      // spec 728/980 base + 1396/1420 mid; same file crops well both ways
      mid: `${A}/cta/fifty-bespoke-journeys.webp`,
      // same-ratio third variant switches at 1128 for this slot (§1.4.2)
      wide: `${A}/cta/fifty-bespoke-journeys.webp`,
      wideAt: 1128,
      alt: "A view up through the columns of Luxor Temple toward a bright sky.",
    },
  },
  {
    title: "Sail the Nile in Style",
    copy: "Four-to-seven night cruises between Luxor and Aswan, with cabins we have personally inspected.",
    cta: { label: "Explore the Nile", href: "/the-nile" },
    image: {
      src: `${A}/cta/fifty-nile-cruise.webp`,
      mid: `${A}/cta/fifty-nile-cruise.webp`,
      wide: `${A}/cta/fifty-nile-cruise.webp`,
      wideAt: 1128,
      alt: "A Nile cruise boat moored on the west bank near Aswan at golden hour.",
    },
  },
];

export const kbygItems: [KbygItem, KbygItem, KbygItem, KbygItem] = [
  {
    iconKey: "weather",
    title: "When to Visit",
    copy: "October to April is temple season; the Red Sea shines year-round. We will match your dates to the right map.",
    cta: { label: "See the Seasons", href: "/when-to-visit" },
  },
  {
    iconKey: "ticket",
    title: "Entry & Visas",
    copy: "Most nationalities can get an e-Visa online in minutes. We send every guest a step-by-step arrival guide.",
    cta: { label: "Check Requirements", href: "/visa" },
  },
  {
    iconKey: "travel",
    title: "Getting Around",
    copy: "Private drivers by default, first-class rail and domestic hops between the long legs, feluccas for the fun parts.",
    cta: { label: "How We Travel", href: "/getting-around" },
  },
  {
    iconKey: "info",
    title: "Talk to a Human",
    copy: "Nile veterans, not a call center. WhatsApp, phone or email — you will reach the team that plans the trip.",
    cta: { label: "Contact Us", href: "/contact" },
  },
];

/* The "Find Accommodation" slot (design.md §3.6) adapted to Ptah Tours: we do
   not sell rooms, so the slot becomes "Tour Types" — the 4 travel styles.
   Card anatomy (whole-card link, bottom-half scrim, pinned label) is kept. */
export const tourTypes: [TourType, TourType, TourType, TourType] = [
  {
    title: "Classic Egypt",
    blurb: "Pyramids, Luxor temples and the great museums — the essential circuit, done properly.",
    href: "/tours?type=classic",
    image: { src: `${A}/tour-types/classic-egypt.webp`, alt: "Philae Temple pylons mirrored in the Nile on a still Aswan morning." },
  },
  {
    title: "Nile Cruises",
    blurb: "Sleep on the river: Luxor to Aswan decks, private moorings and temple stops en route.",
    href: "/tours?type=nile-cruise",
    image: { src: `${A}/tour-types/nile-cruise.webp`, alt: "Hot air balloons rising over the Nile valley west of Luxor at sunrise." },
  },
  {
    title: "Red Sea & Beach",
    blurb: "Hurghada, Sharm and Dahab — reef days, boat trips and proper downtime.",
    href: "/tours?type=red-sea",
    image: { src: `${A}/tour-types/red-sea-escape.webp`, alt: "The sun setting over the Red Sea with a dahabiya silhouette offshore." },
  },
  {
    title: "Desert Adventures",
    blurb: "White Desert camps, Sinai summits, oasis drives — Egypt beyond the riverbank.",
    href: "/tours?type=desert",
    image: { src: `${A}/tour-types/desert-adventure.webp`, alt: "A 4x4 track winding into orange dunes toward a desert camp at dusk." },
  },
];

/* Story crops (§1.4.2): one asset per slide serves base/mid/wide until distinct
   server-side crops land — mid/wide must be present for MultiCropImage's
   breakpoint switch (a `wide` without a `mid` is an invalid stack). */
export const stories: Story[] = [
  {
    title: "Cairo Beyond the Guidebook",
    summary: "Where Cairenes actually eat koshari, the mosque with Cairo's best sunset, and why the back rooms of the Egyptian Museum beat the famous hall — five days walking the capital with our on-the-ground team.",
    href: "/blog/cairo-beyond-the-guidebook",
    image: {
      src: `${A}/stories/cairo-experience.webp`,
      mid: `${A}/stories/cairo-experience.webp`,
      wide: `${A}/stories/cairo-experience.webp`,
      wideAt: 1440,
      alt: "Nile-side Cairo at dusk, minarets and bridges layered into a violet sky.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "An Evening at Karnak, On Your Own",
    summary: "The sound and light show gets a bad reputation — here is how our guides time it so the hypostyle hall is nearly empty, and what the lighting designer got right about the obelisks.",
    href: "/blog/karnak-sound-and-light",
    image: {
      src: `${A}/stories/karnak-sound-light.webp`,
      mid: `${A}/stories/karnak-sound-light.webp`,
      wide: `${A}/stories/karnak-sound-light.webp`,
      wideAt: 1440,
      alt: "Karnak's great columns lit amber against a midnight-blue sky during the evening show.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Alexandria: Egypt's Mediterranean Soul",
    summary: "Two hours from Cairo and a world away — seafood at the fish market, the new library, the catacombs and a corniche walk that explains every Alexandrian you have ever met.",
    href: "/blog/alexandria-mediterranean-soul",
    image: {
      src: `${A}/stories/alexandria-mediterranean.webp`,
      mid: `${A}/stories/alexandria-mediterranean.webp`,
      wide: `${A}/stories/alexandria-mediterranean.webp`,
      wideAt: 1440,
      alt: "The Alexandria corniche curving along the Mediterranean toward the citadel at dawn.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "How to Snorkel the Red Sea Without Harming It",
    summary: "Buoyancy tips from our dive guides, why we never feed the fish, the sunscreen rules on every Ptah boat, and the three reefs near Sharm where you will barely see another group.",
    href: "/blog/red-sea-reef-etiquette",
    image: {
      src: `${A}/stories/red-sea-reef.webp`,
      mid: `${A}/stories/red-sea-reef.webp`,
      wide: `${A}/stories/red-sea-reef.webp`,
      wideAt: 1440,
      alt: "A coral garden with darting anthias fish in the clear shallows of a Red Sea house reef.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "In Praise of the Felucca: Slow Nile Days",
    summary: "No engine, no itinerary tighter than the wind. Why our favorite afternoon in Aswan is a canvas sail, a thermos of tea and whatever the river decides to show you.",
    href: "/blog/slow-nile-felucca-days",
    image: {
      src: `${A}/stories/nile-sailing-aswan.webp`,
      mid: `${A}/stories/nile-sailing-aswan.webp`,
      wide: `${A}/stories/nile-sailing-aswan.webp`,
      wideAt: 1440,
      alt: "A felucca heeling gently under full sail on the Nile near Aswan at sunset.",
    },
    credit: "Ptah Tours field archive",
  },
];

/* ---- Navigation & site chrome --------------------------------------------- */

export const siteNav: SiteNav = {
  quickLinks: [
    { label: "Events & Festivals", href: "/events", iconKey: "calendar" },
    { label: "When to Visit", href: "/when-to-visit", iconKey: "weather" },
    { label: "Book Your eVisa", href: "/visa", iconKey: "ticket" },
    { label: "My Account", href: "/account", iconKey: "user" },
  ],
  directLinks: [
    { label: "Destinations", href: "/cities" },
    { label: "Trip Ideas", href: "/trip-ideas" },
  ],
  buildTripCta: { label: "Plan My Trip", href: "/manage/trip-builder" },
  bookmarksHref: "/manage/trip-builder?tab=bookmarks",
  searchHref: "/search",
  popularSearches: [
    "Pyramids of Giza",
    "Nile Cruise",
    "Luxor Hot Air Balloon",
    "Ras Mohammed Snorkeling",
    "Private Cairo Tour",
    "Christmas in Egypt",
  ],
  sections: [
    {
      key: "about",
      title: "About Egypt",
      columns: [
        {
          heading: "Destinations",
          links: [
            { label: "Cairo", href: "/cities/cairo" },
            { label: "Luxor", href: "/cities/luxor" },
            { label: "Aswan", href: "/cities/aswan" },
            { label: "Alexandria", href: "/cities/alexandria" },
            { label: "Hurghada", href: "/cities/hurghada" },
            { label: "Sharm El Sheikh", href: "/cities/sharm-el-sheikh" },
          ],
        },
        {
          heading: "Know the Land",
          links: [
            { label: "History & Heritage", href: "/heritage" },
            { label: "Seasons & Climate", href: "/when-to-visit" },
            { label: "The Nile", href: "/the-nile" },
            { label: "Deserts & Oases", href: "/deserts" },
            { label: "Red Sea Reefs", href: "/red-sea" },
          ],
        },
        {
          heading: "Good to Know",
          links: [
            {
              label: "Responsible Travel",
              href: "/responsible-travel",
            },
            { label: "Accessibility", href: "/accessibility" },
            { label: "Safety & Support", href: "/contact" },
            { label: "Stories & Journal", href: "/blog" },
          ],
        },
      ],
      imageCtas: [
        {
          label: "Destination Deep-Dive",
          heading: "Ancient Thebes",
          href: "/cities/luxor",
          image: { src: `${A}/hero/hero-thebes-portrait.webp`, alt: "A hot air balloon over Luxor's west bank temples at dawn." },
        },
        {
          label: "Coastlines",
          heading: "Meet the Red Sea",
          href: "/cities/sharm-el-sheikh",
          image: { src: `${A}/hero/hero-blue-hole-portrait.webp`, alt: "A snorkeler drifting over coral at the Blue Hole reef shelf." },
        },
        {
          label: "From the Field",
          heading: "Read the Journal",
          href: "/blog",
          image: { src: `${A}/stories/nile-sailing-aswan.webp`, alt: "A felucca under sail on the Nile near Aswan." },
        },
      ],
    },
    {
      key: "plan",
      title: "Plan Your Trip",
      columns: [
        {
          heading: "Getting There",
          links: [
            { label: "Flights to Egypt", href: "/getting-here" },
            { label: "Visas & Entry", href: "/visa" },
            { label: "Arrival Days, Handled", href: "/getting-here#arrivals" },
            { label: "Getting Around", href: "/getting-around" },
          ],
        },
        {
          heading: "Deciding",
          links: [
            { label: "When to Visit", href: "/when-to-visit" },
            { label: "How Many Days", href: "/how-many-days" },
            { label: "Budget & Tipping", href: "/travel-tips" },
            { label: "Traveling with Kids", href: "/family-travel" },
          ],
        },
        {
          heading: "Our Promise",
          links: [
            { label: "How Ptah Trips Work", href: "/how-it-works" },
            { label: "Responsible Travel", href: "/responsible-travel" },
            { label: "Reviews & Accreditation", href: "/reviews" },
            { label: "Contact the Team", href: "/contact" },
          ],
        },
      ],
      imageCtas: [
        {
          label: "Free Consultation",
          heading: "Talk to an Egyptologist",
          href: "/contact",
          image: { src: `${A}/activities/philae-felucca.webp`, alt: "A felucca sailing toward Philae Temple on calm Nile water." },
        },
        {
          label: "Browse",
          heading: "All Ptah Tours",
          href: "/tours",
          image: { src: `${A}/activities/valley-heritage.webp`, alt: "Painted tomb walls inside the Valley of the Kings." },
        },
        {
          label: "Inspiration",
          heading: "Get Trip Ideas",
          href: "/trip-ideas",
          image: { src: `${A}/cta/plan-nile-portrait.webp`, alt: "A felucca on the Nile at Aswan between granite boulders." },
        },
      ],
    },
    {
      key: "tours",
      title: "Tours",
      columns: [
        {
          heading: "By Style",
          links: [
            { label: "Classic Egypt", href: "/tours?type=classic" },
            { label: "Nile Cruises", href: "/tours?type=nile-cruise" },
            { label: "Red Sea & Beach", href: "/tours?type=red-sea" },
            { label: "Desert Adventures", href: "/tours?type=desert" },
          ],
        },
        {
          heading: "By Length",
          links: [
            { label: "Day Tours", href: "/tours?length=day" },
            { label: "2–4 Day Trips", href: "/tours?length=short" },
            { label: "5–9 Day Journeys", href: "/tours?length=week" },
            { label: "10+ Day Expeditions", href: "/tours?length=grand" },
          ],
        },
        {
          heading: "Special",
          links: [
            { label: "Private & Tailor-Made", href: "/tours?type=private" },
            { label: "Family Trips", href: "/tours?type=family" },
            { label: "Honeymoons", href: "/tours?type=honeymoon" },
            { label: "Last-Minute Departures", href: "/tours?filter=departing-soon" },
          ],
        },
      ],
      imageCtas: [
        {
          label: "Signature Journey",
          heading: "Classic Egypt, 8 Days",
          href: "/tours?type=classic",
          image: { src: `${A}/itineraries/giza-essentials.webp`, alt: "The Great Pyramid of Giza with a camel guide in the foreground." },
        },
        {
          label: "On the River",
          heading: "Nile Cruise Collection",
          href: "/tours?type=nile-cruise",
          image: { src: `${A}/tour-types/nile-cruise.webp`, alt: "Balloons lifting over the Nile valley near Luxor at first light." },
        },
        {
          label: "Under the Water",
          heading: "Dive & Snorkel Trips",
          href: "/tours?type=red-sea",
          image: { src: `${A}/activities/blue-hole-dive.webp`, alt: "A snorkeler over the coral shelf at Dahab's Blue Hole." },
        },
      ],
    },
  ],
};

/* ---- Footer content (design.md §2.8 + §7.4 vocabulary) --------------------- */

export const footerContent: FooterContent = {
  newsletter: {
    heading: "Sign Up!",
    blurb:
      "Trip ideas, seasonal departures and the occasional desert dispatch — a few times a month, never spammy.",
    cta: { label: "Sign up for our E-Newsletter", href: "/newsletter" },
  },
  badgeHeading: "Endorsed By",
  badges: [
    { heading: "ETF", sub: "Member 2026", href: "/about#accreditation" },
    { heading: "Travelife", sub: "Partner", href: "/responsible-travel" },
  ],
  partnersHeading: "Travel Partners",
  partners: [
    { name: "Egypt Air", tagline: "Official carrier partner", href: "https://www.egyptair.com" },
    { name: "IATA", tagline: "Accredited agent", href: "https://www.iata.org" },
    { name: "Visit Egypt", tagline: "Egyptian Tourism Authority", href: "https://www.experienceegypt.eg" },
  ],
  socials: [
    { network: "Facebook", href: "https://www.facebook.com/ptahtours", iconKey: "facebook" },
    { network: "Instagram", href: "https://www.instagram.com/ptahtours", iconKey: "instagram" },
    { network: "Threads", href: "https://www.threads.net/@ptahtours", iconKey: "threads" },
    { network: "YouTube", href: "https://www.youtube.com/@ptahtours", iconKey: "youtube" },
    { network: "Pinterest", href: "https://www.pinterest.com/ptahtours", iconKey: "pinterest" },
    { network: "X", href: "https://x.com/ptahtours", iconKey: "x" },
    { network: "Email", href: "mailto:hello@ptahtours.com", iconKey: "mail" },
  ],
  columns: [
    {
      heading: "Ptah Tours",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Our Egyptologists", href: "/about#team" },
        { label: "Careers", href: "/careers" },
        { label: "Press & Media", href: "/press" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      heading: "Travel With Us",
      links: [
        { label: "All Tours", href: "/tours" },
        { label: "Trip Ideas", href: "/trip-ideas" },
        { label: "Nile Cruises", href: "/tours?type=nile-cruise" },
        { label: "Private Journeys", href: "/tours?type=private" },
        { label: "Responsible Travel", href: "/responsible-travel" },
      ],
    },
    {
      heading: "Help & Info",
      links: [
        { label: "When to Visit", href: "/when-to-visit" },
        { label: "Visas & Entry", href: "/visa" },
        { label: "Track My Booking", href: "/track-booking" },
        { label: "Health & Safety", href: "/travel-tips" },
        { label: "FAQs", href: "/faqs" },
      ],
    },
  ],
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-of-service" },
    { label: "Cookie Policy", href: "/cookie-policy" },
  ],
  copyrightLine: "© {year} Ptah Tours. All rights reserved.",
  acknowledgement:
    "Ptah Tours is headquartered in Cairo and works across Egypt — the Nile Valley, the Delta, Sinai and the Western Desert. We travel with licensed Egyptologists, pay our crews fairly, and plan every itinerary to give more to Egypt's communities and heritage sites than it takes.",
  cookie: {
    heading: "We value your privacy",
    copy: "We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking Accept All, you consent to our use of cookies. You can change your mind at any time from the footer.",
    manageHeading: "Manage your cookie preferences",
    categories: [
      {
        key: "preferences",
        name: "Preferences",
        description: "Remember choices like language, currency and your bookmarked trips.",
      },
      {
        key: "analytics",
        name: "Analytics",
        description: "Anonymous statistics that help us understand which trips and pages travelers love.",
      },
      {
        key: "marketing",
        name: "Marketing",
        description: "Measure our campaigns and show more relevant Ptah Tours content elsewhere.",
      },
    ],
  },
};

/* Aggregate export shaped like the future HomePage.content[] (design.md §7.3).
   Phase 1b renders sections from this array in order. */
export const landingContent = {
  hero: heroSlides,
  inspiredTabs,
  planCta,
  fiftyCtas,
  kbygItems,
  tourTypes,
  stories,
} as const;
