/**
 * Ptah Tours — database seed (idempotent; safe to re-run).
 *
 *   npm run db:seed        (or: npx prisma db seed)
 *
 * NOTE: this script intentionally constructs its own PrismaClient instead of
 * importing src/lib/db.ts — that module imports `server-only`, which throws in
 * a plain Node execution context (tsx), outside the RSC bundler.
 *
 * Seeds:
 *   • 1 SUPER_ADMIN user (dev credentials — change immediately in any real env)
 *   • 6 SiteToggle flags
 *   • 20 Integration registry rows (all disabled)
 *   • 6 Destinations (Cairo, Luxor, Aswan, Alexandria, Hurghada, Sharm El Sheikh)
 *   • 12 Tours with itinerary days + departures + destination links + real hero
 *     images (2 premium multi-day tours + 10 day/half-day tours, all USD). Every
 *     tour slug here resolves at /tours/<slug>, so the DB-backed catalog and the
 *     city/country pages link to real, bookable detail pages.
 *   • 2 ContentSections (hero slide + story card)
 *   • 4 Events/festivals (published) at /events/<slug>
 *   • 16 Trip ideas (published, hybrid) at /trip-ideas/<slug>, each curating real
 *     published tours — the slug set matches every /trip-ideas/<slug> deep-link
 *     in src/content/landing.ts (hero hotspots, plan cards, activity tabs) so no
 *     homepage link 404s.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { hash } from "@node-rs/argon2";
// Shared argon2id params: relative import (no path alias under plain tsx).
// The module deliberately has no "server-only" import so it loads here.
import { ARGON2_OPTIONS } from "../src/lib/argon2-params";
import type { TourTag } from "../src/content/tour-tags";

const connectionString =
  process.env.DATABASE_URL ??
  "mysql://ptah:ptah-dev-password@localhost:3306/ptah_tours";

const db = new PrismaClient({
  adapter: new PrismaMariaDb(connectionString),
});

// ── Reference data ───────────────────────────────────────────────────────────

const SITE_TOGGLES = [
  {
    key: "SIGNUP_ENABLED",
    value: true,
    description: "Allow new customer account registration",
  },
  {
    key: "LOGIN_ENABLED",
    value: true,
    description: "Allow existing customers to sign in",
  },
  {
    key: "PAYMENTS_STRIPE_ENABLED",
    value: false,
    description: "Enable Stripe checkout (requires STRIPE_* env + webhook)",
  },
  {
    key: "PAYMENTS_PAYPAL_ENABLED",
    value: false,
    description: "Enable PayPal checkout (requires PayPal integration creds + webhook ID)",
  },
  {
    key: "PAYMENTS_BANK_TRANSFER_ENABLED",
    value: false,
    description: "Offer offline bank transfer at checkout (staff confirm each payment)",
  },
  {
    key: "MAINTENANCE_MODE",
    value: false,
    description: "Show a maintenance page to all non-admin visitors",
  },
] as const;

const INTEGRATION_KEYS = [
  "GA4",
  "GTM",
  "META_PIXEL",
  "STRIPE",
  "PAYMOB",
  "PAYPAL",
  "RECAPTCHA",
  "TURNSTILE",
  "MAILCHIMP",
  "SENDGRID",
  "AWS_SES",
  "TWILIO",
  "WHATSAPP",
  "GOOGLE_MAPS",
  "MAPBOX",
  "TRIPADVISOR",
  "TRUSTPILOT",
  "HOTJAR",
  "SENTRY",
  "ZAPIER",
] as const;

const DESTINATIONS = [
  {
    slug: "cairo",
    name: "Cairo",
    region: "Greater Cairo",
    heroImage: "/assets/cities/cairo.webp",
    description:
      "Egypt's sprawling capital — the Pyramids of Giza, the Sphinx, Islamic Cairo's medieval lanes, and the Grand Egyptian Museum.",
    metaTitle: "Cairo Tours & Private Guides",
    metaDesc:
      "Private and small-group Cairo tours: the Pyramids of Giza, the Sphinx, Old Cairo, and the Grand Egyptian Museum with licensed guides.",
  },
  {
    slug: "luxor",
    name: "Luxor",
    region: "Upper Egypt",
    heroImage: "/assets/cities/luxor.webp",
    description:
      "The world's greatest open-air museum — Karnak and Luxor temples on the east bank, the Valley of the Kings on the west.",
    metaTitle: "Luxor Tours & Nile Valley Experiences",
    metaDesc:
      "Explore Luxor's East and West Banks: Karnak, Luxor Temple, the Valley of the Kings, and Hatshepsut's temple with expert Egyptologists.",
  },
  {
    slug: "aswan",
    name: "Aswan",
    region: "Upper Egypt",
    heroImage: "/assets/cities/aswan.webp",
    description:
      "Egypt's southernmost city, where the Nile slows between granite islands — Philae Temple, Nubian villages, and feluccas at sunset.",
    metaTitle: "Aswan Tours & Nubian Nile Experiences",
    metaDesc:
      "Aswan tours: Philae Temple, the High Dam, Nubian village visits, and sunset felucca sailing on the Nile with local guides.",
  },
  {
    slug: "alexandria",
    name: "Alexandria",
    region: "Mediterranean Coast",
    heroImage: "/assets/cities/alexandria.webp",
    description:
      "Egypt's Mediterranean port — the Bibliotheca Alexandrina, Qaitbay Citadel on the ancient lighthouse site, and Greco-Roman catacombs.",
    metaTitle: "Alexandria Tours & Mediterranean History",
    metaDesc:
      "Alexandria day tours: the Catacombs of Kom el Shoqafa, Pompey's Pillar, the Bibliotheca Alexandrina, and Qaitbay Citadel.",
  },
  {
    slug: "hurghada",
    name: "Hurghada",
    region: "Red Sea Coast",
    heroImage: "/assets/cities/hurghada.webp",
    description:
      "A Red Sea resort town with reef snorkeling a short boat ride from shore and the Eastern Desert starting immediately inland.",
    metaTitle: "Hurghada Tours & Red Sea Snorkeling",
    metaDesc:
      "Hurghada tours: Red Sea snorkeling boat trips, desert quad safaris at sunset, and Giftun Island day trips.",
  },
  {
    slug: "sharm-el-sheikh",
    name: "Sharm El Sheikh",
    region: "South Sinai",
    heroImage: "/assets/cities/sharm-el-sheikh.webp",
    description:
      "Red Sea resort town known for coral reefs, diving at Ras Mohammed, and desert excursions into the Sinai mountains.",
    metaTitle: "Sharm El Sheikh Tours & Red Sea Diving",
    metaDesc:
      "Red Sea diving, Ras Mohammed snorkeling trips, and Sinai desert safaris from Sharm El Sheikh.",
  },
] as const;

function departureDate(daysFromNow: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + daysFromNow);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

type Diff = "EASY" | "MODERATE" | "CHALLENGING";

/**
 * Egyptian day/half-day tours. Priced in USD like everything else on the site
 * (see src/content/currency.ts); the figures are sample data, converted from the
 * original EGP at 48 EGP = 1 USD and rounded to the nearest $5 — not commercial
 * rates. These are locally-priced
 * excursions, distinct from the two premium USD multi-day journeys below).
 * Every slug maps to a real hero image under /public/assets/tours/<slug>/1.webp.
 */
interface SeedTour {
  slug: string;
  destinationSlug: string;
  title: string;
  summary: string;
  descriptionLong: string;
  durationDays: number;
  priceCents: number; // minor units of `currency`
  currency: string;
  difficulty: Diff;
  tags: TourTag[];
  heroImage: string;
  maxCapacity: number;
  inclusions: string[];
  exclusions: string[];
  itinerary: { title: string; description: string }[];
  metaTitle: string;
  metaDesc: string;
}

const DAY_TOURS: SeedTour[] = [
  {
    slug: "catacombs-pompeys-pillar",
    destinationSlug: "alexandria",
    title: "Catacombs of Kom el Shoqafa & Pompey's Pillar",
    summary:
      "A half-day through Alexandria's Greco-Roman underground: the three-tiered catacombs at Kom el Shoqafa and the towering red-granite Pompey's Pillar.",
    descriptionLong:
      "A half-day through Alexandria's Greco-Roman underground: the three-tiered catacombs at Kom el Shoqafa, one of the few Egyptian sites that blends Pharaonic, Greek and Roman styles in the same carvings, then the towering red-granite column known as Pompey's Pillar.\n\nHighlights:\n• Descend through all three levels of the Kom el Shoqafa catacombs\n• See Egyptian funerary imagery carved in a distinctly Roman style\n• Pompey's Pillar and the nearby Serapeum ruins",
    durationDays: 1,
    priceCents: 3000,
    currency: "USD",
    difficulty: "EASY",
    tags: ["classic"],
    heroImage: "/assets/tours/catacombs-pompeys-pillar/1.webp",
    maxCapacity: 8,
    inclusions: ["Private licensed guide", "Air-conditioned vehicle", "Site entrance fees"],
    exclusions: ["Hotel pickup outside central Alexandria (available as an add-on)", "Gratuities", "Lunch"],
    itinerary: [
      { title: "Kom el Shoqafa Catacombs", description: "Guided descent through the spiral staircase into the three burial levels, with time to view the main tomb chamber and its mixed Egyptian-Roman reliefs." },
      { title: "Pompey's Pillar & the Serapeum", description: "A short transfer to the nearby hilltop site, with the standing granite column and the underground remains of the Serapeum temple." },
    ],
    metaTitle: "Catacombs of Kom el Shoqafa & Pompey's Pillar Tour",
    metaDesc: "Half-day Alexandria tour of the Kom el Shoqafa catacombs and Pompey's Pillar with a private licensed guide and entrance fees.",
  },
  {
    slug: "alexandria-library-citadel",
    destinationSlug: "alexandria",
    title: "Bibliotheca Alexandrina & Qaitbay Citadel",
    summary:
      "The modern Bibliotheca Alexandrina paired with the 15th-century Qaitbay Citadel, built on the site of the ancient Lighthouse of Alexandria.",
    descriptionLong:
      "The modern Bibliotheca Alexandrina, built as a reinterpretation of the ancient Library of Alexandria, paired with the 15th-century Qaitbay Citadel standing on the site of the ancient lighthouse.\n\nHighlights:\n• The Bibliotheca Alexandrina's main reading hall and manuscript exhibits\n• Qaitbay Citadel on the harbor, built where the Lighthouse of Alexandria once stood\n• Corniche waterfront views between stops",
    durationDays: 1,
    priceCents: 2900,
    currency: "USD",
    difficulty: "EASY",
    tags: ["classic", "family"],
    heroImage: "/assets/tours/alexandria-library-citadel/1.webp",
    maxCapacity: 8,
    inclusions: ["Private licensed guide", "Air-conditioned vehicle", "Site entrance fees"],
    exclusions: ["Gratuities", "Lunch"],
    itinerary: [
      { title: "Bibliotheca Alexandrina", description: "Guided visit through the main reading hall, manuscript museum, and antiquities exhibit." },
      { title: "Qaitbay Citadel", description: "Walk the fortress built from the stones of the ancient lighthouse, with harbor views from the upper level." },
    ],
    metaTitle: "Bibliotheca Alexandrina & Qaitbay Citadel Tour",
    metaDesc: "Half-day Alexandria tour of the Bibliotheca Alexandrina and the harbor-side Qaitbay Citadel with a private guide.",
  },
  {
    slug: "st-catherine-mount-sinai",
    destinationSlug: "sharm-el-sheikh",
    title: "Mount Sinai Sunrise & St. Catherine's Monastery",
    summary:
      "A night departure from Sharm El Sheikh, a torch-lit climb to Mount Sinai's summit for sunrise, and a morning at St. Catherine's Monastery.",
    descriptionLong:
      "A night departure from Sharm El Sheikh, a torch-lit climb to Mount Sinai's summit for sunrise, and a morning visit to St. Catherine's Monastery, one of the oldest continuously inhabited Christian monasteries in the world.\n\nHighlights:\n• Sunrise from the summit of Mount Sinai\n• St. Catherine's Monastery, including the Burning Bush site\n• A Bedouin guide for the overnight ascent",
    durationDays: 1,
    priceCents: 5500,
    currency: "USD",
    difficulty: "CHALLENGING",
    tags: ["desert"],
    heroImage: "/assets/tours/st-catherine-mount-sinai/1.webp",
    maxCapacity: 16,
    inclusions: ["Small-group transport", "Bedouin mountain guide", "St. Catherine's Monastery entrance"],
    exclusions: ["Camel rental partway up the mountain (optional, paid locally)", "Meals", "Gratuities"],
    itinerary: [
      { title: "Departure & ascent", description: "Late-night pickup and transfer to the base of Mount Sinai, followed by a guided overnight climb (roughly 2.5–3 hours) to the summit." },
      { title: "Sunrise", description: "Time at the summit to watch the sunrise over the Sinai mountains." },
      { title: "St. Catherine's Monastery", description: "Descent and a guided visit to the monastery grounds and chapel." },
    ],
    metaTitle: "Mount Sinai Sunrise & St. Catherine's Monastery Tour",
    metaDesc: "Overnight Mount Sinai sunrise climb and St. Catherine's Monastery visit from Sharm El Sheikh with a Bedouin guide.",
  },
  {
    slug: "ras-mohammed-snorkeling",
    destinationSlug: "sharm-el-sheikh",
    title: "Ras Mohammed National Park Snorkeling",
    summary:
      "A full day by boat to Ras Mohammed National Park, where the reef walls drop close to shore and marine life density is among the highest on the coast.",
    descriptionLong:
      "A full day by boat to Ras Mohammed National Park, where the reef walls drop close to shore and marine life density is among the highest on this stretch of coast.\n\nHighlights:\n• Two to three snorkeling stops inside the protected park\n• Reef walls and coral gardens close to the boat\n• Lunch served on board",
    durationDays: 1,
    priceCents: 3700,
    currency: "USD",
    difficulty: "EASY",
    tags: ["red-sea", "family"],
    heroImage: "/assets/tours/ras-mohammed-snorkeling/1.webp",
    maxCapacity: 25,
    inclusions: ["Boat trip", "Snorkeling equipment", "Park entrance fees", "Lunch on board"],
    exclusions: ["Hotel pickup outside Sharm El Sheikh/Naama Bay", "Underwater camera rental", "Gratuities"],
    itinerary: [
      { title: "Departure", description: "Morning transfer to the marina and boat departure toward Ras Mohammed." },
      { title: "Snorkeling stops", description: "Two to three stops at different reef sites within the park, with snorkeling gear provided." },
      { title: "Lunch & return", description: "Lunch served on board before the return journey in the afternoon." },
    ],
    metaTitle: "Ras Mohammed National Park Snorkeling Trip",
    metaDesc: "Full-day snorkeling boat trip to Ras Mohammed National Park from Sharm El Sheikh, with gear, park fees, and lunch on board.",
  },
  {
    slug: "desert-safari-quad-bike",
    destinationSlug: "hurghada",
    title: "Desert Safari & Quad Bike Sunset",
    summary:
      "An afternoon into the Eastern Desert outside Hurghada — quad biking through the dunes, a Bedouin camp stop, and sunset over the desert.",
    descriptionLong:
      "An afternoon into the Eastern Desert just outside Hurghada — quad biking through the dunes, a stop at a Bedouin camp, and sunset over the desert.\n\nHighlights:\n• Guided quad-bike ride through desert dunes\n• Bedouin tea and hospitality stop\n• Sunset over the desert with photo stops",
    durationDays: 1,
    priceCents: 2300,
    currency: "USD",
    difficulty: "MODERATE",
    tags: ["desert", "family"],
    heroImage: "/assets/tours/desert-safari-quad-bike/1.webp",
    maxCapacity: 20,
    inclusions: ["Quad bike rental & fuel", "Safety briefing and helmet", "Bedouin tea stop", "Hotel transfers"],
    exclusions: ["Dinner (available as an add-on)", "Gratuities", "Photos/video package"],
    itinerary: [
      { title: "Pickup & briefing", description: "Hotel pickup followed by a safety briefing and quad-bike handover at the desert start point." },
      { title: "Quad biking", description: "Guided ride through the dunes at a pace suited to the group." },
      { title: "Bedouin camp & sunset", description: "Tea, a short cultural stop at a Bedouin camp, and sunset views before the return transfer." },
    ],
    metaTitle: "Hurghada Desert Safari & Quad Bike Sunset Tour",
    metaDesc: "Afternoon Eastern Desert quad-bike safari from Hurghada with a Bedouin camp stop and sunset views. Hotel transfers included.",
  },
  {
    slug: "red-sea-snorkeling",
    destinationSlug: "hurghada",
    title: "Red Sea Snorkeling Boat Trip",
    summary:
      "A day on the water off Hurghada, with stops at reef sites close to shore — short boat rides out and long time in the water.",
    descriptionLong:
      "A day on the water off Hurghada, with stops at reef sites close enough to shore that the boat ride out is short and the time in the water is long.\n\nHighlights:\n• Two to three snorkeling stops at different reef sites\n• Lunch served on board\n• Short boat transfers between sites",
    durationDays: 1,
    priceCents: 2200,
    currency: "USD",
    difficulty: "EASY",
    tags: ["red-sea", "family"],
    heroImage: "/assets/tours/red-sea-snorkeling/1.webp",
    maxCapacity: 25,
    inclusions: ["Boat trip", "Snorkeling equipment", "Lunch on board", "Hotel transfers"],
    exclusions: ["Underwater camera rental", "Gratuities"],
    itinerary: [
      { title: "Departure", description: "Morning transfer to the marina and departure by boat." },
      { title: "Snorkeling stops", description: "Multiple stops at nearby reef sites with equipment provided." },
      { title: "Lunch & return", description: "Lunch on board, with the return to Hurghada in the afternoon." },
    ],
    metaTitle: "Hurghada Red Sea Snorkeling Boat Trip",
    metaDesc: "Full-day Red Sea snorkeling boat trip from Hurghada with equipment, lunch on board, and hotel transfers included.",
  },
  {
    slug: "nubian-village-felucca",
    destinationSlug: "aswan",
    title: "Nubian Village & Felucca Sail",
    summary:
      "A slow-paced afternoon on the Nile: a felucca sail to a Nubian village, tea with a local family, and a walk through the painted houses.",
    descriptionLong:
      "A slow-paced afternoon on the Nile: a felucca sail up to a Nubian village, tea with a local family, and a walk through the village's distinctive painted houses.\n\nHighlights:\n• Traditional felucca sailing on the Nile\n• Tea with a Nubian family\n• The painted houses of a Nubian village",
    durationDays: 1,
    priceCents: 2000,
    currency: "USD",
    difficulty: "EASY",
    tags: ["classic", "family"],
    heroImage: "/assets/tours/nubian-village-felucca/1.webp",
    maxCapacity: 10,
    inclusions: ["Felucca sailing", "Nubian village visit", "Tea with a local family"],
    exclusions: ["Hotel pickup (available as an add-on)", "Gratuities"],
    itinerary: [
      { title: "Felucca departure", description: "Board a traditional felucca from the Aswan corniche and sail toward the Nubian village." },
      { title: "Nubian village visit", description: "Walk through the village, with a stop for tea with a local family." },
      { title: "Return sail", description: "Sail back to Aswan as the light softens toward evening." },
    ],
    metaTitle: "Aswan Nubian Village & Felucca Sail",
    metaDesc: "Half-day Aswan felucca sail to a Nubian village with tea with a local family and a walk through the painted houses.",
  },
  {
    slug: "philae-temple-high-dam",
    destinationSlug: "aswan",
    title: "Philae Temple & the High Dam",
    summary:
      "Philae Temple, dedicated to Isis and relocated stone by stone, paired with a stop at the Aswan High Dam.",
    descriptionLong:
      "Philae Temple, dedicated to Isis and relocated stone by stone in one of the 20th century's largest archaeological rescue projects, paired with a stop at the Aswan High Dam.\n\nHighlights:\n• Philae Temple, reached by a short boat crossing\n• The Temple of Isis's reliefs and hypostyle hall\n• The Aswan High Dam, one of the largest of its kind in the world",
    durationDays: 1,
    priceCents: 2600,
    currency: "USD",
    difficulty: "EASY",
    tags: ["classic"],
    heroImage: "/assets/tours/philae-temple-high-dam/1.webp",
    maxCapacity: 8,
    inclusions: ["Private licensed guide", "Air-conditioned vehicle", "Boat crossing to Philae", "Entrance fees"],
    exclusions: ["Gratuities", "Lunch"],
    itinerary: [
      { title: "Aswan High Dam", description: "A stop at the dam with views over Lake Nasser." },
      { title: "Philae Temple", description: "A short boat crossing to Agilkia Island and a guided tour of the temple complex." },
    ],
    metaTitle: "Aswan Philae Temple & High Dam Tour",
    metaDesc: "Half-day Aswan tour of the island Temple of Philae and the Aswan High Dam with a private guide, boat crossing, and entrance fees.",
  },
  {
    slug: "karnak-luxor-temple",
    destinationSlug: "luxor",
    title: "Karnak & Luxor Temple by Night",
    summary:
      "Karnak Temple in the morning light and Luxor Temple after dark — two of Egypt's greatest temple complexes on one day.",
    descriptionLong:
      "Karnak Temple in the morning light, when the hypostyle hall's columns are at their most dramatic, then Luxor Temple again after dark, lit in a way that changes the whole feel of the site.\n\nHighlights:\n• Karnak's Great Hypostyle Hall, 134 columns in the morning light\n• The avenue of sphinxes connecting Karnak to Luxor Temple\n• Luxor Temple illuminated after sunset",
    durationDays: 1,
    priceCents: 4100,
    currency: "USD",
    difficulty: "EASY",
    tags: ["classic"],
    heroImage: "/assets/tours/karnak-luxor-temple/1.webp",
    maxCapacity: 8,
    inclusions: ["Private licensed Egyptologist guide", "Air-conditioned vehicle", "Both site entrance fees"],
    exclusions: ["Lunch between visits", "Gratuities"],
    itinerary: [
      { title: "Morning: Karnak Temple", description: "A guided morning visit through Karnak's temple complex, including the hypostyle hall and sacred lake." },
      { title: "Evening: Luxor Temple", description: "Return after dark for a guided visit of Luxor Temple under its evening lighting." },
    ],
    metaTitle: "Karnak & Luxor Temple by Night Tour",
    metaDesc: "Full-day Luxor tour of Karnak Temple by morning and Luxor Temple illuminated after dark, with a private Egyptologist guide.",
  },
  {
    slug: "valley-of-the-kings",
    destinationSlug: "luxor",
    title: "Valley of the Kings & Hatshepsut Temple",
    summary:
      "Luxor's West Bank in a day: royal tombs in the Valley of the Kings, Hatshepsut's terraced temple, and the Colossi of Memnon.",
    descriptionLong:
      "Luxor's West Bank in a single day: royal tombs cut deep into the Valley of the Kings, Hatshepsut's terraced mortuary temple at Deir el-Bahari, and the twin Colossi of Memnon.\n\nHighlights:\n• Entry to three tombs in the Valley of the Kings\n• Hatshepsut's mortuary temple, one of ancient Egypt's most distinctive buildings\n• The Colossi of Memnon",
    durationDays: 1,
    priceCents: 4500,
    currency: "USD",
    difficulty: "MODERATE",
    tags: ["classic"],
    heroImage: "/assets/tours/valley-of-the-kings/1.webp",
    maxCapacity: 8,
    inclusions: ["Private licensed Egyptologist guide", "Air-conditioned vehicle", "Standard tomb entrance tickets"],
    exclusions: ["Tutankhamun's tomb (separate ticket, optional)", "Lunch", "Gratuities"],
    itinerary: [
      { title: "Valley of the Kings", description: "Guided visits inside three royal tombs (subject to which are open on the day)." },
      { title: "Hatshepsut's Temple", description: "A walk through the terraced mortuary temple at Deir el-Bahari." },
      { title: "Colossi of Memnon", description: "A brief stop at the two seated statues on the way back." },
    ],
    metaTitle: "Valley of the Kings & Hatshepsut Temple Tour",
    metaDesc: "Full-day Luxor West Bank tour of the Valley of the Kings, Hatshepsut's temple, and the Colossi of Memnon with an Egyptologist guide.",
  },
];

// ── Seed routine ─────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("🌱 Seeding Ptah Tours database…");

  // 1) Super admin — DEV CREDENTIALS ONLY. Rotate immediately in real envs.
  const passwordHash = await hash("ChangeMe!Dev2026", ARGON2_OPTIONS);
  const admin = await db.user.upsert({
    where: { email: "admin@ptahtours.local" },
    update: {},
    create: {
      email: "admin@ptahtours.local",
      name: "Ptah Platform Admin",
      passwordHash,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      emailVerifiedAt: new Date(),
    },
  });
  console.log(`  ✓ SUPER_ADMIN user: ${admin.email} (dev password — see README)`);

  // 2) Site toggles
  for (const toggle of SITE_TOGGLES) {
    await db.siteToggle.upsert({
      where: { key: toggle.key },
      update: { description: toggle.description },
      create: { ...toggle },
    });
  }
  console.log(`  ✓ ${SITE_TOGGLES.length} site toggles`);

  // 3) Integration registry — all disabled, credentials empty.
  for (const key of INTEGRATION_KEYS) {
    await db.integration.upsert({
      where: { key },
      update: {},
      create: { key, enabled: false },
    });
  }
  console.log(`  ✓ ${INTEGRATION_KEYS.length} integrations registered (all disabled)`);

  // 4) Destinations (re-runnable: hero image + copy refreshed on update).
  const destinations = new Map<string, string>();
  for (const dest of DESTINATIONS) {
    const row = await db.destination.upsert({
      where: { slug: dest.slug },
      update: {
        name: dest.name,
        region: dest.region,
        description: dest.description,
        heroImage: dest.heroImage,
        metaTitle: dest.metaTitle,
        metaDesc: dest.metaDesc,
      },
      create: { ...dest },
    });
    destinations.set(dest.slug, row.id);
  }
  console.log(`  ✓ ${DESTINATIONS.length} destinations`);

  // 5) Premium USD multi-day tours (hero image now refreshed on re-run too).
  const pyramidsTour = await db.tour.upsert({
    where: { slug: "giza-pyramids-and-gem-day-tour" },
    update: { tags: ["classic", "private", "family"], heroImage: "/assets/tours/giza-pyramids-and-gem-day-tour.webp" },
    create: {
      slug: "giza-pyramids-and-gem-day-tour",
      title: "Giza Pyramids & Grand Egyptian Museum — Private Day Tour",
      summary:
        "A full private day at the Giza plateau and the Grand Egyptian Museum with a licensed Egyptologist guide.",
      descriptionLong:
        "Start at the Giza plateau for the Great Pyramid, Khafre and Menkaure pyramids, and the Sphinx, with time for the panoramic viewpoint. After lunch at a local restaurant, spend the afternoon in the Grand Egyptian Museum's main galleries, including the Tutankhamun collection. Door-to-door private transfers included.",
      durationDays: 1,
      basePriceCents: 14500,
      currency: "USD",
      difficulty: "EASY",
      tags: ["classic", "private", "family"],
      heroImage: "/assets/tours/giza-pyramids-and-gem-day-tour.webp",
      status: "PUBLISHED",
      inclusions: [
        "Private air-conditioned vehicle and driver",
        "Licensed Egyptologist guide",
        "Entrance tickets to the Giza plateau and the Grand Egyptian Museum",
        "Lunch at a local restaurant",
        "Bottled water",
      ],
      exclusions: [
        "Entry inside the Great Pyramid (optional ticket)",
        "Gratuities",
        "Personal expenses",
      ],
      metaTitle: "Giza Pyramids & GEM Private Day Tour",
      metaDesc:
        "Private full-day tour of the Giza Pyramids, Sphinx, and Grand Egyptian Museum with licensed guide, tickets, lunch, and hotel pickup.",
      itinerary: {
        create: [
          {
            dayNumber: 1,
            sortOrder: 0,
            title: "Giza plateau, Sphinx, and the Grand Egyptian Museum",
            description:
              "08:00 hotel pickup — morning at the Giza plateau (pyramids, Sphinx, panoramic viewpoint) — lunch — afternoon at the Grand Egyptian Museum — return to your hotel by late afternoon.",
          },
        ],
      },
      departures: {
        create: [30, 37, 44].map((offset) => ({
          startDate: departureDate(offset),
          endDate: departureDate(offset),
          maxCapacity: 12,
          remainingCapacity: 12,
          status: "OPEN" as const,
        })),
      },
    },
  });

  const luxorTour = await db.tour.upsert({
    where: { slug: "luxor-east-west-bank-two-day-tour" },
    update: { tags: ["classic", "private", "honeymoon"], heroImage: "/assets/tours/luxor-east-west-bank-two-day-tour.webp" },
    create: {
      slug: "luxor-east-west-bank-two-day-tour",
      title: "Luxor East & West Bank — Two-Day Explorer",
      summary:
        "Two days covering Karnak, Luxor Temple, the Valley of the Kings, and Hatshepsut's temple — plus an optional Red Sea extension from Sharm El Sheikh departures.",
      descriptionLong:
        "Day one covers the East Bank: Karnak temple complex and Luxor Temple, ending with a felucca ride at sunset. Day two crosses to the West Bank for the Valley of the Kings (three royal tombs), the Temple of Hatshepsut, and the Colossi of Memnon. Private guide and vehicle throughout; overnight hotel stay in Luxor included.",
      durationDays: 3,
      basePriceCents: 69000,
      currency: "USD",
      difficulty: "MODERATE",
      tags: ["classic", "private", "honeymoon"],
      heroImage: "/assets/tours/luxor-east-west-bank-two-day-tour.webp",
      status: "PUBLISHED",
      inclusions: [
        "Two nights of hotel accommodation in Luxor (4-star, breakfast included)",
        "Private Egyptologist guide for both touring days",
        "All entrance tickets listed in the itinerary",
        "Private air-conditioned vehicle",
        "Sunset felucca ride",
      ],
      exclusions: [
        "Flights or trains to/from Luxor",
        "Tutankhamun tomb entry (optional ticket)",
        "Meals not listed",
        "Gratuities",
      ],
      metaTitle: "Luxor East & West Bank Two-Day Private Tour",
      metaDesc:
        "Two-day private Luxor tour: Karnak, Luxor Temple, Valley of the Kings, and Hatshepsut's temple with guide, tickets, and hotel stay included.",
      itinerary: {
        create: [
          {
            dayNumber: 1,
            sortOrder: 0,
            title: "Arrival & Karnak Temple",
            description:
              "Arrive in Luxor and check in; afternoon guided visit to the Karnak temple complex; evening at leisure in Luxor.",
          },
          {
            dayNumber: 2,
            sortOrder: 1,
            title: "East Bank: Luxor Temple & sunset felucca",
            description:
              "Morning at Luxor Temple, free time at the souq, then a sunset felucca ride on the Nile.",
          },
          {
            dayNumber: 3,
            sortOrder: 2,
            title: "West Bank: Valley of the Kings & Hatshepsut",
            description:
              "Cross to the West Bank for the Valley of the Kings (three tombs), the Temple of Hatshepsut, and the Colossi of Memnon before departure transfers.",
          },
        ],
      },
      departures: {
        create: [30, 37].map((offset) => ({
          startDate: departureDate(offset),
          endDate: departureDate(offset + 2),
          maxCapacity: 8,
          remainingCapacity: 8,
          priceOverrideCents: 59000,
          status: "OPEN" as const,
        })),
      },
    },
  });

  // 6) Day/half-day tours — created once; hero image refreshed on re-run.
  const egpTourIds = new Map<string, string>();
  for (const t of DAY_TOURS) {
    const created = await db.tour.upsert({
      where: { slug: t.slug },
      update: {
        tags: t.tags,
        heroImage: t.heroImage,
        gallery: [`/assets/tours/${t.slug}/2.webp`, `/assets/tours/${t.slug}/3.webp`],
      },
      create: {
        slug: t.slug,
        title: t.title,
        summary: t.summary,
        descriptionLong: t.descriptionLong,
        durationDays: t.durationDays,
        basePriceCents: t.priceCents,
        currency: t.currency,
        difficulty: t.difficulty,
        tags: t.tags,
        heroImage: t.heroImage,
        status: "PUBLISHED",
        inclusions: t.inclusions,
        exclusions: t.exclusions,
        gallery: [`/assets/tours/${t.slug}/2.webp`, `/assets/tours/${t.slug}/3.webp`],
        metaTitle: t.metaTitle,
        metaDesc: t.metaDesc,
        itinerary: {
          create: t.itinerary.map((step, i) => ({
            dayNumber: i + 1,
            sortOrder: i,
            title: step.title,
            description: step.description,
          })),
        },
        departures: {
          create: [21, 35, 49].map((offset) => ({
            startDate: departureDate(offset),
            endDate: departureDate(offset),
            maxCapacity: t.maxCapacity,
            remainingCapacity: t.maxCapacity,
            status: "OPEN" as const,
          })),
        },
      },
    });
    egpTourIds.set(t.slug, created.id);
  }
  console.log(`  ✓ ${DAY_TOURS.length} day tours`);

  // 7) Tour ↔ destination links (idempotent via composite key).
  const cairoId = destinations.get("cairo") as string;
  const luxorId = destinations.get("luxor") as string;
  const sharmId = destinations.get("sharm-el-sheikh") as string;

  const links: Array<[string, string, number]> = [
    [pyramidsTour.id, cairoId, 0],
    [luxorTour.id, luxorId, 0],
    [luxorTour.id, sharmId, 1], // optional extension pairing
  ];
  for (const t of DAY_TOURS) {
    const tourId = egpTourIds.get(t.slug) as string;
    const destId = destinations.get(t.destinationSlug) as string;
    links.push([tourId, destId, 1]);
  }
  for (const [tourId, destinationId, sortOrder] of links) {
    await db.tourDestination.upsert({
      where: { tourId_destinationId: { tourId, destinationId } },
      update: { sortOrder },
      create: { tourId, destinationId, sortOrder },
    });
  }
  console.log(`  ✓ tour ↔ destination links (${links.length})`);

  // 8) CMS content sections — one hero slide + one story card.
  // Upserted by STABLE dev UUIDs: ContentSection has no natural unique key,
  // so createMany+skipDuplicates would duplicate rows on every re-run
  // (skipDuplicates only fires on unique-constraint collisions).
  const CONTENT_SECTIONS = [
    {
      id: "7c8b2d1e-4f5a-4e6b-8c9d-0e1f2a3b4c01",
      type: "HERO_SLIDE" as const,
      sortOrder: 0,
      enabled: true,
      data: {
        headline: "Egypt, curated end to end",
        subheading:
          "Private journeys across Cairo, Luxor, and the Red Sea — designed and hosted by Ptah Tours.",
        image: "/assets/hero/hero-giza.webp",
        cta: { label: "Explore tours", href: "/tours" },
        linkedTourSlug: "giza-pyramids-and-gem-day-tour",
      },
    },
    {
      id: "7c8b2d1e-4f5a-4e6b-8c9d-0e1f2a3b4c02",
      type: "STORY_CARD" as const,
      sortOrder: 0,
      enabled: true,
      data: {
        kicker: "Why Ptah",
        title: "Small groups, licensed guides, no compromises",
        body: "Every itinerary is built with local Egyptologists and drivers we work with directly — no hand-offs, no hidden stops.",
        link: { label: "Our story", href: "/about" },
      },
    },
  ];
  for (const section of CONTENT_SECTIONS) {
    await db.contentSection.upsert({
      where: { id: section.id },
      update: { data: section.data, enabled: section.enabled, sortOrder: section.sortOrder },
      create: section,
    });
  }
  console.log("  ✓ CMS content sections (hero slide, story card)");

  // 9) Events & festivals (published) — real Egyptian cultural calendar, reusing
  // existing hero/activity/story assets. `recurring` = annual festival.
  const ymd = (iso: string): Date => new Date(`${iso}T00:00:00.000Z`);
  const EVENTS = [
    {
      slug: "abu-simbel-sun-festival",
      title: "Abu Simbel Sun Festival",
      summary:
        "Twice a year the rising sun pierces the temple of Ramesses II to illuminate the gods in the inner sanctuary — a feat of ancient engineering, celebrated at dawn.",
      description:
        "On February 22 and October 22 each year, the first light of morning travels 60 metres into the Great Temple of Abu Simbel to light the seated statues of Ra-Horakhty, Ramesses II, and Amun — leaving only Ptah, god of darkness, in shadow. Crowds gather before dawn for music, dancing, and the moment of alignment. We can position you at the temple for sunrise and pair it with a wider Aswan and Lake Nasser itinerary.",
      location: "Abu Simbel, Aswan",
      startDate: ymd("2026-10-22"),
      endDate: null,
      recurring: true,
      heroImage: "/assets/destinations/aswan.webp",
      metaTitle: "Abu Simbel Sun Festival — Feb 22 & Oct 22",
      metaDesc:
        "The sun alignment festival at the Great Temple of Abu Simbel, held every February 22 and October 22. Plan your trip with Ptah Tours.",
      sortOrder: 0,
    },
    {
      slug: "wafaa-el-nil-festival",
      title: "Wafaa El-Nil (Nile Festival)",
      summary:
        "A centuries-old celebration of the river that made Egypt — with felucca processions, music, and poetry along the Nile.",
      description:
        "Wafaa El-Nil marks the ancient flooding of the Nile that once renewed Egypt's fields. Today it is a cultural season of concerts, art, felucca sailing, and poetry readings along the river in Cairo, Aswan, and beyond. It pairs beautifully with a felucca sail at sunset.",
      location: "Cairo & the Nile Valley",
      startDate: ymd("2026-08-15"),
      endDate: ymd("2026-08-29"),
      recurring: true,
      heroImage: "/assets/stories/nile-sailing-aswan.webp",
      metaTitle: "Wafaa El-Nil — Egypt's Nile Festival",
      metaDesc: "Egypt's traditional Nile festival of felucca processions, music, and poetry. Plan around it with Ptah Tours.",
      sortOrder: 1,
    },
    {
      slug: "cairo-international-film-festival",
      title: "Cairo International Film Festival",
      summary:
        "The Arab world's oldest international film festival brings premieres, stars, and screenings to downtown Cairo each November.",
      description:
        "Founded in 1976 and accredited by FIAPF, the Cairo International Film Festival (CIFF) is the region's most established film event. Screenings and red-carpet premieres spread across the Cairo Opera House and downtown venues. A great excuse to add a few culture-rich evenings to a Cairo stay.",
      location: "Cairo Opera House, Cairo",
      startDate: ymd("2026-11-12"),
      endDate: ymd("2026-11-21"),
      recurring: false,
      heroImage: "/assets/stories/cairo-experience.webp",
      metaTitle: "Cairo International Film Festival",
      metaDesc: "The Arab world's oldest international film festival, held each November in Cairo.",
      sortOrder: 2,
    },
    {
      slug: "moulid-sayyid-al-badawi",
      title: "Moulid of Sayyid Al-Badawi",
      summary:
        "One of Egypt's largest moulids — a saint's festival in Tanta drawing millions for Sufi processions, music, and celebration.",
      description:
        "Held in the Delta city of Tanta after the cotton harvest, the moulid of Sufi saint Sayyid Ahmad Al-Badawi is among the biggest religious festivals in Egypt. Expect crowds, chanting, lights, and street food across several days. A vivid window into living Egyptian folk tradition, best visited with a local guide.",
      location: "Tanta, Gharbia",
      startDate: ymd("2026-10-18"),
      endDate: ymd("2026-10-25"),
      recurring: true,
      heroImage: "/assets/activities/nubian-culture.webp",
      metaTitle: "Moulid of Sayyid Al-Badawi — Tanta",
      metaDesc: "One of Egypt's largest Sufi saint festivals, held in Tanta after the cotton harvest.",
      sortOrder: 3,
    },
  ];
  for (const e of EVENTS) {
    await db.event.upsert({
      where: { slug: e.slug },
      update: {
        title: e.title, summary: e.summary, description: e.description, location: e.location,
        startDate: e.startDate, endDate: e.endDate, recurring: e.recurring, heroImage: e.heroImage,
        status: "PUBLISHED", metaTitle: e.metaTitle, metaDesc: e.metaDesc, sortOrder: e.sortOrder,
      },
      create: { ...e, status: "PUBLISHED" },
    });
  }
  console.log(`  ✓ ${EVENTS.length} events (published)`);

  // 10) Trip ideas (published, hybrid) — editorial themes that curate real
  // published tours. The full set of slugs here MUST match every
  // `/trip-ideas/<slug>` deep-link in src/content/landing.ts (hero hotspots,
  // the "Get Inspired" plan cards, and all activity tabs) so no homepage link
  // 404s. Each hero image reuses the same asset as the homepage card that
  // links here, so the detail hero matches the card the visitor clicked.
  const tid = (slug: string): string =>
    slug === "giza-pyramids-and-gem-day-tour"
      ? pyramidsTour.id
      : slug === "luxor-east-west-bank-two-day-tour"
        ? luxorTour.id
        : (egpTourIds.get(slug) as string);

  // Slugs seeded in a prior pass that the homepage never references — removed so
  // the /trip-ideas surface faithfully mirrors the homepage's curation. Join
  // rows are cleared first to stay safe regardless of FK cascade config.
  const ORPHAN_TRIP_IDEAS = ["nile-and-nubia", "red-sea-escapes", "egypt-for-families"];
  let orphansRemoved = 0;
  for (const slug of ORPHAN_TRIP_IDEAS) {
    const existing = await db.tripIdea.findUnique({ where: { slug }, select: { id: true } });
    if (existing) {
      await db.tripIdeaTour.deleteMany({ where: { tripIdeaId: existing.id } });
      await db.tripIdea.delete({ where: { id: existing.id } });
      orphansRemoved++;
    }
  }
  if (orphansRemoved > 0) console.log(`  ✓ removed ${orphansRemoved} orphan trip idea(s) not linked from the homepage`);

  const TRIP_IDEAS: Array<{
    slug: string; title: string; summary: string; descriptionLong: string;
    heroImage: string; metaTitle: string; metaDesc: string; sortOrder: number; tourSlugs: string[];
  }> = [
    // — Multi-day itineraries (the "Get Inspired → Plan an itinerary" cards) —
    {
      slug: "panorama-of-the-pyramids",
      title: "Panorama of the Pyramids",
      summary: "The essential Giza plateau, done properly — early light, an Egyptologist at your side, and the Grand Egyptian Museum.",
      descriptionLong:
        "There is a right way to see the pyramids: early, unhurried, and with someone who can read the stones. This is our classic Giza experience — the Great Pyramid, Khafre and Menkaure, the Sphinx, the panoramic viewpoint, and the treasures of the Grand Egyptian Museum — built around the light and away from the coach crowds.",
      heroImage: "/assets/itineraries/giza-essentials.webp",
      metaTitle: "Panorama of the Pyramids — Giza Trip Idea",
      metaDesc: "See the Giza pyramids and the Grand Egyptian Museum the right way, with a licensed Egyptologist. Curated tours from Ptah Tours.",
      sortOrder: 0,
      tourSlugs: ["giza-pyramids-and-gem-day-tour"],
    },
    {
      slug: "cairo-heritage-weekend",
      title: "Cairo Heritage Weekend",
      summary: "Two full days across old and ancient Cairo — the pyramids, the Grand Egyptian Museum, and the lanes of Islamic Cairo.",
      descriptionLong:
        "Cairo rewards a proper weekend. Give it two days and you can stand beneath the pyramids at Giza, walk the galleries of the Grand Egyptian Museum, and lose an evening in the lantern-lit lanes of Khan el-Khalili. We pace it so the great sights and the everyday city both get their moment.",
      heroImage: "/assets/itineraries/cairo-heritage.webp",
      metaTitle: "Cairo Heritage Weekend — Cairo Trip Idea",
      metaDesc: "A two-day Cairo weekend: the Giza pyramids, the Grand Egyptian Museum, and historic Islamic Cairo. Curated tours from Ptah Tours.",
      sortOrder: 1,
      tourSlugs: ["giza-pyramids-and-gem-day-tour"],
    },
    {
      slug: "karnak-luxor-evening",
      title: "Karnak by Day, Luxor Temple by Night",
      summary: "The two great temples of Luxor's east bank — Karnak's hypostyle hall by day, Luxor Temple floodlit after dark.",
      descriptionLong:
        "Luxor's east bank holds two of Egypt's most theatrical temples, and they are best seen at opposite ends of the day. Walk the forest of columns in Karnak's Great Hypostyle Hall while the light is high, then return to a floodlit Luxor Temple after dark, when the avenue of sphinxes and the great colonnade glow amber against the night.",
      heroImage: "/assets/itineraries/karnak-evening.webp",
      metaTitle: "Karnak & Luxor Temple by Night — Luxor Trip Idea",
      metaDesc: "Karnak's hypostyle hall by day and a floodlit Luxor Temple after dark. Curated tours from Ptah Tours.",
      sortOrder: 2,
      tourSlugs: ["karnak-luxor-temple", "luxor-east-west-bank-two-day-tour"],
    },
    {
      slug: "kings-and-queens-of-thebes",
      title: "Kings & Queens of Thebes",
      summary: "Luxor's east and west banks — Karnak, the Valley of the Kings, and the temples that crowned ancient Thebes.",
      descriptionLong:
        "Ancient Thebes was the seat of Egypt's New Kingdom, and Luxor is its open-air museum. Cross from the living city of the east bank — Karnak and Luxor Temple — to the necropolis of the west, where pharaohs were laid to rest in the Valley of the Kings. These tours weave the two banks into one unforgettable stretch of the Nile.",
      heroImage: "/assets/itineraries/valley-of-kings.webp",
      metaTitle: "Kings & Queens of Thebes — Luxor Trip Idea",
      metaDesc: "Karnak, Luxor Temple, and the Valley of the Kings across the two banks of Luxor. Curated tours from Ptah Tours.",
      sortOrder: 3,
      tourSlugs: ["luxor-east-west-bank-two-day-tour", "valley-of-the-kings", "karnak-luxor-temple"],
    },
    {
      slug: "philae-island-aswan",
      title: "Philae Island & the High Dam",
      summary: "Aswan's island temple of Isis, reached by boat, paired with the great dam that reshaped the Nile.",
      descriptionLong:
        "Few temples are approached as beautifully as Philae — a short boat ride across calm water to an island sacred to the goddess Isis, rescued stone by stone from the rising Nile. Combine it with the Aswan High Dam and Lake Nasser to see both the ancient devotion and the modern engineering that define the river's southern reach.",
      heroImage: "/assets/itineraries/philae-island.webp",
      metaTitle: "Philae Island & the High Dam — Aswan Trip Idea",
      metaDesc: "The island temple of Isis at Philae and the Aswan High Dam. Curated tours from Ptah Tours.",
      sortOrder: 4,
      tourSlugs: ["philae-temple-high-dam", "nubian-village-felucca"],
    },
    {
      slug: "nubian-village-aswan",
      title: "The Nubian Village by Felucca",
      summary: "A felucca across the Nile to a colour-washed Nubian village — tea with a family, and the south's gentlest afternoon.",
      descriptionLong:
        "South of Aswan the Nile belongs to Nubia. Sail across by felucca to a village of ochre and indigo houses, where you are welcomed for tea, spices, and a slower rhythm of life. It is the warmest, most human afternoon in Egypt — and the golden-hour sail back is worth the trip on its own.",
      heroImage: "/assets/itineraries/nubian-village.webp",
      metaTitle: "The Nubian Village by Felucca — Aswan Trip Idea",
      metaDesc: "A felucca sail to a colour-washed Nubian village near Aswan, with tea and warm hospitality. Curated tours from Ptah Tours.",
      sortOrder: 5,
      tourSlugs: ["nubian-village-felucca", "philae-temple-high-dam"],
    },
    {
      slug: "alexandria-weekend",
      title: "Alexandria in a Weekend",
      summary: "Egypt's Mediterranean city — the Catacombs and Pompey's Pillar, the Bibliotheca Alexandrina, and the Qaitbay seafront.",
      descriptionLong:
        "Alexandria faces the sea, and it feels different from the rest of Egypt for it. Spend a weekend among Greco-Roman catacombs and Pompey's Pillar, the sweeping modern Bibliotheca Alexandrina, and the Qaitbay Citadel on the old harbour — with a plate of fresh seafood between the sights.",
      heroImage: "/assets/itineraries/alexandria-classics.webp",
      metaTitle: "Alexandria in a Weekend — Alexandria Trip Idea",
      metaDesc: "A Mediterranean weekend in Alexandria: catacombs, Pompey's Pillar, the Bibliotheca, and Qaitbay. Curated tours from Ptah Tours.",
      sortOrder: 6,
      tourSlugs: ["catacombs-pompeys-pillar", "alexandria-library-citadel"],
    },
    {
      slug: "sinai-summit-st-catherines",
      title: "Sinai Summit & Saint Catherine's",
      summary: "The pre-dawn climb of Mount Sinai and the ancient monastery of Saint Catherine at its foot.",
      descriptionLong:
        "Walk the camel path up Mount Sinai in the dark to reach the summit for sunrise, then descend to Saint Catherine's Monastery — one of the oldest working monasteries on earth, home to the burning-bush chapel and a library second only to the Vatican's. A journey as much about the quiet as the view.",
      heroImage: "/assets/itineraries/sinai-summit.webp",
      metaTitle: "Sinai Summit & Saint Catherine's — Sinai Trip Idea",
      metaDesc: "A sunrise climb of Mount Sinai and the ancient Saint Catherine's Monastery. Curated tours from Ptah Tours.",
      sortOrder: 7,
      tourSlugs: ["st-catherine-mount-sinai"],
    },
    // — Single experiences (the "Get Inspired" activity tabs) —
    {
      slug: "blue-hole-sinai",
      title: "Snorkel the Blue Hole",
      summary: "Dahab's famous coral sinkhole — a wall of reef dropping into deep blue, and one of the Red Sea's iconic swims.",
      descriptionLong:
        "The Blue Hole at Dahab is a legend among divers and snorkelers alike: a near-perfect circle of deep water ringed by living coral, right off the shore. Float over the reef shelf, watch the wall fall away beneath you, and follow it up to Ras Abu Galum's remote coast. We pair it with the region's best-guided reef days.",
      heroImage: "/assets/activities/blue-hole-dive.webp",
      metaTitle: "Snorkel the Blue Hole, Dahab — Sinai Trip Idea",
      metaDesc: "Snorkel the coral sinkhole of the Blue Hole near Dahab, Sinai. Curated reef tours from Ptah Tours.",
      sortOrder: 8,
      tourSlugs: ["ras-mohammed-snorkeling", "red-sea-snorkeling"],
    },
    {
      slug: "colored-canyon-sinai",
      title: "Trek the Colored Canyon",
      summary: "A slot canyon of red, gold, and cream sandstone folded through the Sinai desert — a half-day walk through rock.",
      descriptionLong:
        "Inland from Nuweiba, the Colored Canyon is a narrow chasm where iron and manganese have stained the sandstone into bands of red, ochre, and cream. It is a cool, shaded walk between towering walls, often finished with a desert lunch and a Bedouin tea. Easy underfoot, unforgettable to look at.",
      heroImage: "/assets/activities/colored-canyon.webp",
      metaTitle: "Trek the Colored Canyon — Sinai Trip Idea",
      metaDesc: "A guided desert trek through the banded sandstone of Sinai's Colored Canyon. Curated tours from Ptah Tours.",
      sortOrder: 9,
      tourSlugs: ["desert-safari-quad-bike", "st-catherine-mount-sinai"],
    },
    {
      slug: "desert-safari-quad-sunset",
      title: "Quad Safari at Sunset",
      summary: "Quad bikes across an open desert plain as the light turns gold — with a Bedouin camp waiting at dusk.",
      descriptionLong:
        "When the heat eases, the desert comes alive. Ride quad bikes out across the plains behind the Red Sea coast, kicking up dust trails toward the horizon, and arrive at a Bedouin camp as the sun drops. Tea, stars, and the vast quiet of the desert round out the evening.",
      heroImage: "/assets/activities/desert-safari.webp",
      metaTitle: "Quad Safari at Sunset — Desert Trip Idea",
      metaDesc: "A sunset quad-bike safari across the desert with a Bedouin camp. Curated tours from Ptah Tours.",
      sortOrder: 10,
      tourSlugs: ["desert-safari-quad-bike"],
    },
    {
      slug: "red-sea-boat-snorkeling",
      title: "Red Sea Boat Day",
      summary: "A day on the water — anchoring over turquoise reef, snorkeling the coral gardens, lunch on deck.",
      descriptionLong:
        "The best of the Red Sea is reached by boat. Cruise out to anchor over shallow reef, slip into water so clear the coral gardens read like a map, and spend the day between snorkel stops and lunch on deck. An easy, joyful day for swimmers of every level.",
      heroImage: "/assets/activities/boat-snorkeling.webp",
      metaTitle: "Red Sea Boat Day — Snorkeling Trip Idea",
      metaDesc: "A full snorkeling boat day over the reefs of the Red Sea. Curated tours from Ptah Tours.",
      sortOrder: 11,
      tourSlugs: ["red-sea-snorkeling", "ras-mohammed-snorkeling"],
    },
    {
      slug: "egyptian-museum-guided",
      title: "The Egyptian Museum, Guided",
      summary: "The great collection in Cairo — statues, sarcophagi, and treasures, read for you by an Egyptologist.",
      descriptionLong:
        "A museum this dense needs a guide. Walk the halls of Cairo's Egyptian Museum with an Egyptologist who can turn a case of artifacts into a story — the statues, the sarcophagi, the everyday objects of a civilisation that lasted three thousand years. We fold it into a wider day among Cairo's monuments.",
      heroImage: "/assets/activities/museum-tahrir.webp",
      metaTitle: "The Egyptian Museum, Guided — Cairo Trip Idea",
      metaDesc: "A guided walk through Cairo's Egyptian Museum with an Egyptologist. Curated tours from Ptah Tours.",
      sortOrder: 12,
      tourSlugs: ["giza-pyramids-and-gem-day-tour"],
    },
    {
      slug: "khan-el-khalili-night",
      title: "Khan el-Khalili After Dark",
      summary: "Cairo's great bazaar in the evening — lantern stalls, coppersmiths, and mint tea at a centuries-old café.",
      descriptionLong:
        "Khan el-Khalili is at its best after dark, when the lanterns come on and the lanes fill with the sound of coppersmiths and spice sellers. Wander the medieval market, haggle for a keepsake, and stop for mint tea at El Fishawy, a café that has served Cairo for over two centuries. A vivid, atmospheric close to a day in the city.",
      heroImage: "/assets/activities/khan-el-khalili.webp",
      metaTitle: "Khan el-Khalili After Dark — Cairo Trip Idea",
      metaDesc: "An evening in Cairo's historic Khan el-Khalili bazaar. Curated tours from Ptah Tours.",
      sortOrder: 13,
      tourSlugs: ["giza-pyramids-and-gem-day-tour"],
    },
    {
      slug: "ras-mohammed-park",
      title: "Ras Mohammed Boat Day",
      summary: "The national park at Sinai's tip — sheer coral walls, clear shallows, and some of the Red Sea's finest snorkeling.",
      descriptionLong:
        "Where the Gulfs of Suez and Aqaba meet, Ras Mohammed National Park protects some of the healthiest reef in the world. Boat out to its famous coral walls and the clear shallows of the mangrove channel, where the visibility and marine life are hard to beat anywhere in Egypt.",
      heroImage: "/assets/activities/ras-mohammed.webp",
      metaTitle: "Ras Mohammed Boat Day — Sinai Trip Idea",
      metaDesc: "A snorkeling boat day in Ras Mohammed National Park at the tip of Sinai. Curated tours from Ptah Tours.",
      sortOrder: 14,
      tourSlugs: ["ras-mohammed-snorkeling"],
    },
    {
      slug: "luxor-sunrise-weekend",
      title: "Luxor at Sunrise",
      summary: "Dawn over Thebes — hot-air balloons above the west bank, then the Valley of the Kings and a sunset felucca.",
      descriptionLong:
        "There is no better way to meet Luxor than at first light. Drift over the west bank by hot-air balloon as the sun rises on the temples and tombs below, then spend the day among the Valley of the Kings and Karnak before a sunset felucca on the Nile. A weekend built around the two best hours of the Theban day.",
      heroImage: "/assets/activities/nile-sunset-felucca.webp",
      metaTitle: "Luxor at Sunrise — Luxor Trip Idea",
      metaDesc: "Dawn balloons over Thebes, the Valley of the Kings, and a sunset felucca in Luxor. Curated tours from Ptah Tours.",
      sortOrder: 15,
      tourSlugs: ["luxor-east-west-bank-two-day-tour", "valley-of-the-kings"],
    },
  ];
  let tripIdeaLinkCount = 0;
  for (const idea of TRIP_IDEAS) {
    const { tourSlugs, ...data } = idea;
    const row = await db.tripIdea.upsert({
      where: { slug: idea.slug },
      update: {
        title: data.title, summary: data.summary, descriptionLong: data.descriptionLong,
        heroImage: data.heroImage, status: "PUBLISHED", metaTitle: data.metaTitle,
        metaDesc: data.metaDesc, sortOrder: data.sortOrder,
      },
      create: { ...data, status: "PUBLISHED" },
    });
    // Replace this idea's tour links wholesale so re-seeds can't leave stale
    // links behind if a slug's curation changes. Then re-create in order.
    await db.tripIdeaTour.deleteMany({ where: { tripIdeaId: row.id } });
    for (let i = 0; i < tourSlugs.length; i++) {
      const tourId = tid(tourSlugs[i]);
      await db.tripIdeaTour.create({
        data: { tripIdeaId: row.id, tourId, sortOrder: i },
      });
      tripIdeaLinkCount++;
    }
  }
  console.log(`  ✓ ${TRIP_IDEAS.length} trip ideas (published) with ${tripIdeaLinkCount} curated tour links`);

  console.log("🌱 Seed complete.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => {
    void db.$disconnect();
  });
