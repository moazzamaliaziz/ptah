// Country content. Structured with explicit slugs (not embedded relations)
// so this maps directly onto a `Country` table later — cities and tours
// reference countrySlug the same way a Prisma model would reference
// countryId.

export type Faq = { q: string; a: string };

export type Country = {
  slug: string;
  name: string;
  tagline: string;
  heroImage: string;
  intro: string;
  overview: string;
  whyVisit: string[];
  thingsToDo: string[];
  bestTimeToVisit: string;
  travelInfo: string;
  faqs: Faq[];
  /** Set once at least one city under this country is published. */
  hasCities: boolean;
};

export const countries: Country[] = [
  {
    slug: "egypt",
    name: "Egypt",
    tagline: "Ancient stories. Timeless journeys.",
    heroImage: "/assets/countries/egypt.webp",
    intro:
      "Temples that have stood for four thousand years, the Nile still moving at the same pace it always has, and cities that turn from Pharaonic to Ottoman to modern in the space of one afternoon.",
    overview:
      "Egypt is where Sekhmet and Ptah Tours began, and it's still the backbone of what we run: Luxor's temple complexes, Aswan's Nubian villages and the Nile itself, the Red Sea coast around Hurghada and Sharm El Sheikh, and the layered history of Alexandria. Most itineraries here move between two or three cities, since a lot of what's worth seeing is spread along the river and the coast rather than packed into one place.",
    whyVisit: [
      "The single largest concentration of ancient monuments still standing anywhere in the world",
      "A Red Sea coastline with some of the most accessible reef diving and snorkeling on the planet",
      "Guides who are, in many cases, trained Egyptologists rather than general tour leaders",
    ],
    thingsToDo: [
      "Trace the Pharaonic timeline through Luxor's temples and the Valley of the Kings",
      "Sail a felucca on the Nile around Aswan at sunset",
      "Snorkel or dive the reefs off Hurghada and Sharm El Sheikh",
      "Walk the layered Greco-Roman and Islamic history of Alexandria",
    ],
    bestTimeToVisit:
      "October through April, when daytime temperatures in Upper Egypt are manageable. June through August is hot enough that most touring happens early morning and late afternoon.",
    travelInfo:
      "Cairo International (CAI), Hurghada (HRG) and Sharm El Sheikh (SSH) are the main international gateways. Domestic flights and overnight sleeper trains connect Cairo, Luxor and Aswan.",
    faqs: [
      {
        q: "Do I need a visa to visit Egypt?",
        a: "Most nationalities can obtain a visa on arrival or an e-visa in advance; requirements vary by passport, so check with the Egyptian consulate for your nationality before you travel.",
      },
      {
        q: "Can I combine Luxor and Aswan in one trip?",
        a: "Yes — most of our Nile itineraries link the two, either by road, rail, or a short Nile cruise.",
      },
    ],
    hasCities: true,
  },
  {
    slug: "uae",
    name: "UAE",
    tagline: "Desert horizons, modern skylines.",
    heroImage: "https://picsum.photos/seed/ptah-country-uae/1600/900",
    intro:
      "From Dubai's skyline to the quieter emirates along the coast, the UAE pairs some of the most ambitious modern architecture anywhere with a desert interior that's still largely untouched.",
    overview:
      "We're building out our UAE program alongside our Egypt itineraries — the first city pages and tours for this country are in progress.",
    whyVisit: [
      "A short flight time from most of the Gulf, Europe and South Asia",
      "Desert excursions a short drive from major cities",
      "A strong base for combining with other Gulf and Middle East destinations",
    ],
    thingsToDo: [
      "Desert safari and dune driving outside the main cities",
      "Traditional souks alongside contemporary architecture",
    ],
    bestTimeToVisit:
      "November through March, when daytime temperatures are comfortable for outdoor activity.",
    travelInfo: "Dubai (DXB) and Abu Dhabi (AUH) are the primary international gateways.",
    faqs: [],
    hasCities: false,
  },
  {
    slug: "saudi-arabia",
    name: "Saudi Arabia",
    tagline: "A kingdom newly open to the world.",
    heroImage: "https://picsum.photos/seed/ptah-country-saudi/1600/900",
    intro:
      "Saudi Arabia opened to leisure tourism only recently, and much of what's here — from AlUla's rock-cut tombs to the Red Sea coast — is still genuinely uncrowded.",
    overview:
      "Our Saudi Arabia program is in development. City and tour pages for this destination will go live as itineraries are finalized.",
    whyVisit: [
      "Archaeological sites, like AlUla, that see a fraction of the visitors comparable sites elsewhere do",
      "A Red Sea coastline largely untouched by mass tourism so far",
    ],
    thingsToDo: ["Rock-cut Nabataean tombs at AlUla", "Historic Jeddah's old town"],
    bestTimeToVisit: "November through March.",
    travelInfo: "Riyadh (RUH) and Jeddah (JED) are the main international gateways.",
    faqs: [],
    hasCities: false,
  },
  {
    slug: "morocco",
    name: "Morocco",
    tagline: "Medinas, mountains, and the edge of the Sahara.",
    heroImage: "https://picsum.photos/seed/ptah-country-morocco/1600/900",
    intro:
      "Marrakech's medina, the Atlas Mountains rising just behind it, and the Sahara a day's drive further south — Morocco packs an unusual amount of contrast into a small footprint.",
    overview:
      "Our Morocco program is in development. City and tour pages for this destination will go live as itineraries are finalized.",
    whyVisit: [
      "Medinas that function as living cities, not open-air museums",
      "The Atlas Mountains and Sahara dunes both within a day's drive of Marrakech",
    ],
    thingsToDo: ["Wander the souks and riads of the Marrakech medina", "Day trips into the High Atlas"],
    bestTimeToVisit: "March–May and September–November.",
    travelInfo: "Marrakech Menara (RAK) and Casablanca (CMN) are the main gateways.",
    faqs: [],
    hasCities: false,
  },
  {
    slug: "jordan",
    name: "Jordan",
    tagline: "The rose-red city, and the desert beyond it.",
    heroImage: "https://picsum.photos/seed/ptah-country-jordan/1600/900",
    intro:
      "Petra is the reason most people first look at Jordan, but Wadi Rum's desert and the Dead Sea coast round out a country that rewards a few extra days.",
    overview:
      "Our Jordan program is in development. City and tour pages for this destination will go live as itineraries are finalized.",
    whyVisit: ["Petra, one of the most complete ancient cities left standing", "Wadi Rum's protected desert landscape"],
    thingsToDo: ["Petra by day and by candlelight", "A night camping in Wadi Rum"],
    bestTimeToVisit: "March–May and September–November.",
    travelInfo: "Queen Alia International (AMM) is the main gateway.",
    faqs: [],
    hasCities: false,
  },
  {
    slug: "albania",
    name: "Albania",
    tagline: "The Mediterranean's quieter coastline.",
    heroImage: "https://picsum.photos/seed/ptah-country-albania/1600/900",
    intro:
      "Albania's Riviera and its Ottoman-era hill towns are still a step behind neighboring coastlines in visitor numbers, which is a large part of the appeal.",
    overview:
      "Our Albania program is in development. City and tour pages for this destination will go live as itineraries are finalized.",
    whyVisit: ["A largely undeveloped Mediterranean coastline", "Ottoman and Communist-era history side by side"],
    thingsToDo: ["The Albanian Riviera coast road", "Berat's Ottoman old town"],
    bestTimeToVisit: "May–June and September.",
    travelInfo: "Tirana International (TIA) is the main gateway.",
    faqs: [],
    hasCities: false,
  },
];

export function getCountry(slug: string) {
  return countries.find((c) => c.slug === slug);
}
