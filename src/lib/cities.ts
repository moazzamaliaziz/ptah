import { Faq } from "./countries";

export type City = {
  slug: string;
  name: string;
  countrySlug: string;
  tagline: string;
  heroImage: string;
  intro: string;
  about: string;
  popularExperiences: string[];
  thingsToDo: string[];
  bestTimeToVisit: string;
  travelInfo: string;
  coordinates: { lat: number; lng: number };
  faqs: Faq[];
};

export const cities: City[] = [
  {
    slug: "luxor",
    name: "Luxor",
    countrySlug: "egypt",
    tagline: "Walk through the living history of ancient Egypt.",
    heroImage: "/assets/cities/luxor.webp",
    intro:
      "Ancient Thebes, split by the Nile: temples and the living city on the east bank, the Valley of the Kings and the mortuary temples on the west.",
    about:
      "Luxor holds more standing ancient monuments per square kilometer than anywhere else in Egypt. Karnak and Luxor Temple sit inside the modern city; a short crossing over the Nile puts you at the Valley of the Kings, Hatshepsut's mortuary temple, and the Colossi of Memnon.",
    popularExperiences: [
      "Sunrise hot-air balloon over the West Bank",
      "Karnak Temple lit at night",
      "Nile-side felucca sailing",
    ],
    thingsToDo: [
      "Valley of the Kings tomb visits",
      "Karnak and Luxor Temple complexes",
      "Hatshepsut's mortuary temple",
      "Luxor Museum",
    ],
    bestTimeToVisit: "November through February for the most comfortable daytime touring temperatures.",
    travelInfo:
      "Luxor International Airport (LXR) has domestic connections from Cairo; overnight sleeper trains also run from Cairo.",
    coordinates: { lat: 25.6872, lng: 32.6396 },
    faqs: [
      {
        q: "How many days does Luxor need?",
        a: "Two full days covers the East and West Bank highlights comfortably; three allows a slower pace and time for the museum.",
      },
    ],
  },
  {
    slug: "aswan",
    name: "Aswan",
    countrySlug: "egypt",
    tagline: "Where the Nile slows down and Nubia begins.",
    heroImage: "/assets/cities/aswan.webp",
    intro:
      "Egypt's southernmost major city, and its most relaxed — granite hills, Nubian villages, and a stretch of the Nile lined with feluccas rather than cruise boats.",
    about:
      "Aswan sits where the Nile narrows between granite outcrops, and where Nubian culture is still the dominant thread of daily life rather than a historical footnote. Philae Temple, relocated stone by stone when the High Dam was built, is the standout ancient site; the Nubian villages on Elephantine Island and the west bank are as much a reason to visit.",
    popularExperiences: [
      "Felucca sailing at sunset",
      "Nubian village visits by boat",
      "Philae Temple by day or evening sound-and-light show",
    ],
    thingsToDo: ["Philae Temple", "The High Dam", "Elephantine Island", "Nubian Museum"],
    bestTimeToVisit: "November through March; Aswan runs hotter than Luxor in summer.",
    travelInfo: "Aswan International Airport (ASW) connects to Cairo and Luxor; also reachable by overnight train.",
    coordinates: { lat: 24.0889, lng: 32.8998 },
    faqs: [],
  },
  {
    slug: "alexandria",
    name: "Alexandria",
    countrySlug: "egypt",
    tagline: "Mediterranean light, layered history.",
    heroImage: "/assets/cities/alexandria.webp",
    intro:
      "Founded by Alexander the Great, later home to one of the ancient world's great libraries, and today a Mediterranean port city with a distinct character from the rest of Egypt.",
    about:
      "Alexandria's ancient city is mostly underground or underwater now, but what remains — the catacombs, Pompey's Pillar, the reimagined Bibliotheca Alexandrina, and the waterfront Qaitbay Citadel — gives a clear sense of the city's Greco-Roman and Islamic layers.",
    popularExperiences: [
      "Corniche waterfront walk at sunset",
      "Bibliotheca Alexandrina",
      "Fresh seafood along the harbor",
    ],
    thingsToDo: [
      "Catacombs of Kom el Shoqafa",
      "Pompey's Pillar",
      "Qaitbay Citadel",
      "Bibliotheca Alexandrina",
    ],
    bestTimeToVisit:
      "April–June and September–November, avoiding the busiest domestic summer holiday crowds.",
    travelInfo: "Borg El Arab Airport (HBE) or a roughly 2.5-hour train/road transfer from Cairo.",
    coordinates: { lat: 31.2001, lng: 29.9187 },
    faqs: [],
  },
  {
    slug: "sharm-el-sheikh",
    name: "Sharm El Sheikh",
    countrySlug: "egypt",
    tagline: "Red Sea reefs and Sinai's high desert.",
    heroImage: "/assets/cities/sharm-el-sheikh.webp",
    intro:
      "A Red Sea resort city built around some of the most accessible reef diving anywhere, with the Sinai's mountains and St. Catherine's Monastery a few hours inland.",
    about:
      "Most visitors come to Sharm El Sheikh for the reefs — Ras Mohammed National Park in particular is a well-regarded entry point for snorkeling and diving. The Sinai interior, including Mount Sinai and St. Catherine's Monastery, makes for a genuinely different day trip: high desert instead of coast.",
    popularExperiences: [
      "Ras Mohammed reef snorkeling",
      "Sunrise hike up Mount Sinai",
      "St. Catherine's Monastery",
    ],
    thingsToDo: [
      "Ras Mohammed National Park",
      "Mount Sinai sunrise trek",
      "St. Catherine's Monastery",
      "Naama Bay waterfront",
    ],
    bestTimeToVisit: "March–May and September–November for milder heat.",
    travelInfo: "Sharm El Sheikh International Airport (SSH) has direct international connections.",
    coordinates: { lat: 27.9158, lng: 34.3299 },
    faqs: [],
  },
  {
    slug: "hurghada",
    name: "Hurghada",
    countrySlug: "egypt",
    tagline: "Red Sea coast, desert just behind it.",
    heroImage: "/assets/cities/hurghada.webp",
    intro:
      "A Red Sea resort town with reef access close to shore and the Eastern Desert starting almost immediately inland.",
    about:
      "Hurghada's reefs are a shorter boat ride from shore than most of Sharm El Sheikh's best sites, which makes it a solid base for half-day snorkeling trips. The desert immediately behind the coast is also where most of the region's quad-biking and desert safari tours run from.",
    popularExperiences: [
      "Red Sea snorkeling boat trips",
      "Desert safari with sunset stop",
      "Giftun Island day trips",
    ],
    thingsToDo: ["Red Sea reef snorkeling", "Desert quad biking", "Giftun Island", "El Dahar old town market"],
    bestTimeToVisit: "March–May and September–November.",
    travelInfo: "Hurghada International Airport (HRG) has direct international connections.",
    coordinates: { lat: 27.2579, lng: 33.8116 },
    faqs: [],
  },
  {
    slug: "cairo",
    name: "Cairo",
    countrySlug: "egypt",
    tagline: "Where ancient and modern Egypt meet in one city.",
    heroImage: "/assets/cities/cairo.webp",
    intro:
      "The Giza Pyramids on the edge of the city, the Egyptian Museum's collection in the center of it, and a sprawling, dense capital in between.",
    about:
      "Cairo is usually the first or last stop on an Egypt itinerary — home to the Giza Plateau, the Egyptian Museum, and Islamic Cairo's mosques and markets, all within a single, very large city.",
    popularExperiences: ["Giza Pyramids and the Sphinx", "Egyptian Museum", "Khan el-Khalili bazaar"],
    thingsToDo: ["Giza Plateau", "Egyptian Museum", "Islamic Cairo", "Khan el-Khalili"],
    bestTimeToVisit: "November through February.",
    travelInfo: "Cairo International Airport (CAI) is Egypt's main international gateway.",
    coordinates: { lat: 30.0444, lng: 31.2357 },
    faqs: [],
  },
];

export function getCity(slug: string) {
  return cities.find((c) => c.slug === slug);
}

export function citiesByCountry(countrySlug: string) {
  return cities.filter((c) => c.countrySlug === countrySlug);
}
