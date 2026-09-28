/**
 * Original editorial content for the five theme pages (heritage / the-nile /
 * deserts / red-sea / when-to-visit): fact strips, a civilization timeline,
 * image-led feature rows, place cards, and section headings.
 *
 * ENGLISH-FIRST. This copy is authored in English and shared across all locales
 * for now; when the theme pages are translated, lift these strings into the i18n
 * dictionaries (src/i18n/pages/*). Existing per-page keys (title / lede / intro /
 * seasons / CTA) still come from getPageContent and stay translated.
 *
 * All history/geography here is written to be factually accurate; approximate
 * dates carry a "c." (circa) label. Image slugs reference src/content/theme-media.
 */
import type { IconName } from "@/components/ui/Icon";
import type { ThemeSlug } from "./theme-media";

export interface SectionHead {
  eyebrow: string;
  heading: string;
  intro?: string;
}
export interface FactItem {
  icon: IconName;
  value: string;
  label: string;
}
export interface TimelineEntry {
  era: string;
  span: string;
  body: string;
}
export interface FeatureRow {
  image: string;
  eyebrow?: string;
  heading: string;
  body: string[];
}
export interface PlaceCard {
  image: string;
  name: string;
  body: string;
}

export interface ThemeContent {
  facts: FactItem[];
  timeline?: { head: SectionHead; entries: TimelineEntry[] };
  features: { head: SectionHead; rows: FeatureRow[] };
  places?: { head: SectionHead; cards: PlaceCard[] };
  gallery: SectionHead;
  creditsSummary: string;
}

/** Month-by-month climate band for the when-to-visit ClimateWidget. */
export type ClimateBand = "peak" | "good" | "shoulder" | "hot";
export interface MonthClimate {
  month: string;
  abbr: string;
  band: ClimateBand;
  note: string;
}
export interface SeasonNote {
  icon: IconName;
  name: string;
  months: string;
  body: string;
}
export interface WhenToVisitContent {
  facts: FactItem[];
  climate: {
    head: SectionHead;
    months: MonthClimate[];
    legend: { band: ClimateBand; label: string }[];
  };
  regions: { head: SectionHead; rows: FeatureRow[] };
  gallery: SectionHead;
  creditsSummary: string;
}

/** Shared English lightbox/gallery labels (English-first; move to i18n later). */
export const galleryLabels = {
  galleryAria: "Photo gallery",
  lightbox: {
    close: "Close",
    prev: "Previous image",
    next: "Next image",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    counter: "{current} of {total}",
  },
};

export const themeContent: Record<Exclude<ThemeSlug, "when-to-visit">, ThemeContent> = {
  heritage: {
    facts: [
      { icon: "star", value: "7", label: "UNESCO World Heritage Sites" },
      { icon: "clock", value: "5,000+ yrs", label: "of recorded civilization" },
      { icon: "calendar", value: "c. 2560 BC", label: "Great Pyramid of Giza built" },
      { icon: "globe", value: "Giza → Abu Simbel", label: "monuments the length of the Nile" },
    ],
    timeline: {
      head: {
        eyebrow: "A quick timeline",
        heading: "Five thousand years, in order",
        intro:
          "Egyptian history is long enough that even the pharaohs studied ancestors who were ancient to them. Here is the shape of it — approximate dates are marked “c.” for circa.",
      },
      entries: [
        {
          era: "Early Dynastic Period",
          span: "c. 3100–2686 BC",
          body: "Upper and Lower Egypt are unified under the first pharaohs and the capital settles at Memphis, near modern Cairo.",
        },
        {
          era: "Old Kingdom",
          span: "c. 2686–2181 BC",
          body: "The age of the great pyramid builders: Djoser’s Step Pyramid at Saqqara and the three pyramids of Giza rise in a single span of centuries.",
        },
        {
          era: "Middle Kingdom",
          span: "c. 2055–1650 BC",
          body: "After a period of division, Egypt is reunified. It is remembered as a classical age of literature, sculpture and strong central rule.",
        },
        {
          era: "New Kingdom",
          span: "c. 1550–1069 BC",
          body: "Egypt at its imperial height. Karnak and Luxor are expanded into vast temple complexes and pharaohs are buried in the Valley of the Kings at Thebes.",
        },
        {
          era: "Late Period",
          span: "c. 664–332 BC",
          body: "The last native dynasties rule, with Persian interludes, until Alexander the Great arrives.",
        },
        {
          era: "Ptolemaic (Greco-Roman) Period",
          span: "332–30 BC",
          body: "Alexander founds Alexandria; the Greek Ptolemies build temples such as Philae and Kom Ombo. The line ends with Cleopatra VII and the coming of Rome.",
        },
        {
          era: "Coptic & Islamic Egypt",
          span: "from c. 1st century AD",
          body: "Christianity takes root and leaves the churches of Coptic Cairo; the Arab conquest of 641 AD brings Islam, and Cairo grows into one of the great cities of the medieval world.",
        },
      ],
    },
    features: {
      head: {
        eyebrow: "The great monuments",
        heading: "Four wonders, read by an Egyptologist",
        intro:
          "Every Ptah Tours heritage journey is led by a licensed Egyptologist, so the walls stop being decoration and start being sentences. These are the sites at the heart of it.",
      },
      rows: [
        {
          image: "giza-pyramids",
          eyebrow: "Old Kingdom",
          heading: "The Pyramids of Giza",
          body: [
            "Built around 2560 BC as royal tombs, the three pyramids of Giza are the only one of the seven wonders of the ancient world still standing. The Great Pyramid held the record as the tallest structure made by human hands for nearly four thousand years.",
            "Beside them the Great Sphinx keeps watch — a lion’s body with a pharaoh’s face, carved from a single ridge of limestone on the edge of the desert plateau.",
          ],
        },
        {
          image: "karnak-temple",
          eyebrow: "New Kingdom",
          heading: "Karnak, the temple that grew for centuries",
          body: [
            "Karnak is not one temple but a city of them, added to by pharaoh after pharaoh across more than a thousand years. Its Great Hypostyle Hall packs 134 giant columns into a stone forest so tall the roof once floated far overhead.",
            "It was the most important religious site in Egypt, dedicated above all to the god Amun-Ra of Thebes.",
          ],
        },
        {
          image: "luxor-temple",
          eyebrow: "Thebes",
          heading: "Luxor and the Theban west bank",
          body: [
            "Ancient Thebes is modern Luxor, so rich in ruins it is often called the world’s greatest open-air museum. Luxor Temple stands in the heart of the town and once linked to Karnak by an avenue of sphinxes.",
            "Across the river lie the royal cemeteries — the Valley of the Kings among them, where Tutankhamun’s tomb was found nearly intact in 1922.",
          ],
        },
        {
          image: "abu-simbel",
          eyebrow: "Nubia",
          heading: "Abu Simbel and the rescue of a temple",
          body: [
            "Ramesses II cut two temples straight into a Nubian cliff, guarded by four seated colossi more than 20 metres high. Twice a year the rising sun reaches through the doorway to light the innermost sanctuary.",
            "When the Aswan High Dam was built in the 1960s, the whole monument was cut into blocks and lifted to higher ground in a UNESCO rescue effort — one of the largest ever attempted — to save it from the rising lake.",
          ],
        },
      ],
    },
    places: {
      head: {
        eyebrow: "More to see",
        heading: "Temples, tombs and two Cairos",
        intro:
          "Beyond the headline sites, the heritage route is dotted with places that each tell their own chapter of the story.",
      },
      cards: [
        {
          image: "saqqara-step-pyramid",
          name: "Saqqara",
          body: "The Step Pyramid of Djoser, built c. 2670 BC, is the oldest large stone monument in the world — the prototype every later pyramid was refined from.",
        },
        {
          image: "philae-temple",
          name: "Philae",
          body: "A graceful temple to the goddess Isis, moved island and all to higher ground during the Aswan High Dam campaign so it would not be lost beneath the water.",
        },
        {
          image: "kom-ombo",
          name: "Kom Ombo",
          body: "A rare double temple on the Nile, built in the Greco-Roman period and shared equally between the crocodile god Sobek and the falcon god Horus.",
        },
        {
          image: "coptic-cairo",
          name: "Coptic Cairo",
          body: "The old Christian quarter, with the Hanging Church and streets that tradition links to the Holy Family’s time in Egypt.",
        },
        {
          image: "islamic-cairo",
          name: "Islamic Cairo",
          body: "A medieval city of minarets, mosques and the great Khan el-Khalili bazaar — itself a UNESCO World Heritage Site.",
        },
      ],
    },
    gallery: {
      eyebrow: "Gallery",
      heading: "Heritage in photographs",
    },
    creditsSummary: "Image credits & licenses",
  },
  "the-nile": {
    facts: [
      { icon: "globe", value: "~6,650 km", label: "one of the world’s longest rivers" },
      { icon: "travel", value: "South → North", label: "the Nile flows toward the sea" },
      { icon: "user", value: "~95%", label: "of Egyptians live along its banks" },
      { icon: "star", value: "Luxor & Aswan", label: "the great temple towns on the river" },
    ],
    features: {
      head: {
        eyebrow: "The river that made Egypt",
        heading: "Life along the Nile",
        intro:
          "The ancient Greeks called Egypt “the gift of the Nile.” For thousands of years the river’s flood laid down the black soil that fed the whole country — and almost everyone still lives within sight of the water.",
      },
      rows: [
        {
          image: "aswan-feluccas",
          eyebrow: "Under sail",
          heading: "Sailing the Nile by felucca",
          body: [
            "The felucca is the traditional wooden sailboat of the Nile, unchanged in shape for centuries. Around Aswan the river is at its most beautiful — islands, granite outcrops and desert coming right down to the water — and an afternoon under sail is the oldest, quietest way to see it.",
          ],
        },
        {
          image: "luxor-boats-on-nile",
          eyebrow: "Ancient Thebes",
          heading: "Luxor, a city on the water",
          body: [
            "Luxor sits on the site of ancient Thebes, the New Kingdom capital. The river splits it in two: the living east bank with its temples, and the west bank of royal tombs where the sun was seen to die each evening. River life still runs past it all day long.",
          ],
        },
        {
          image: "cairo-nile-skyline-sunset",
          eyebrow: "The capital",
          heading: "Cairo, where the river meets the city",
          body: [
            "By the time it reaches Cairo the Nile is broad and busy, threading between the island of Zamalek and a skyline of some twenty million people. A little further north it fans out into the great Delta and empties into the Mediterranean.",
          ],
        },
        {
          image: "aswan-wide-nile",
          eyebrow: "A changed river",
          heading: "The High Dam and the end of the flood",
          body: [
            "For millennia the Nile flooded every summer and renewed Egypt’s fields. The Aswan High Dam, completed in 1970, ended that annual flood for good — creating Lake Nasser, generating power and controlling the water, but also changing a rhythm the country had lived by since the pharaohs.",
          ],
        },
      ],
    },
    places: {
      head: {
        eyebrow: "Along the banks",
        heading: "Islands, cities and river light",
        intro:
          "The pleasure of the Nile is as much the journey as the sites — the stretches of green fields, the birdlife, and the way the light changes on the water from dawn to dusk.",
      },
      cards: [
        {
          image: "nile-riverbank-kom-ombo-edfu",
          name: "Between the temples",
          body: "The green ribbon of farmland between Kom Ombo and Edfu, where the desert waits just beyond the last irrigated field.",
        },
        {
          image: "elephantine-island",
          name: "Elephantine Island",
          body: "One of Aswan’s inhabited river islands, settled since ancient times when it guarded Egypt’s southern frontier.",
        },
        {
          image: "aswan-boat-egrets",
          name: "River wildlife",
          body: "Cattle egrets and a traditional boat near Aswan — the Nile is a lifeline for birds as much as for people.",
        },
        {
          image: "cairo-nile-night",
          name: "The Nile after dark",
          body: "City lights along the Zamalek waterfront in Cairo, where the river never really goes quiet.",
        },
        {
          image: "river-nile-near-aswan",
          name: "The Nubian Nile",
          body: "South of Aswan the landscape turns to Nubia — bright water, golden sand and dark granite.",
        },
        {
          image: "nile-felucca-aswan",
          name: "A boat and the wind",
          body: "A single felucca catching the breeze — the simplest, most timeless image of the river.",
        },
      ],
    },
    gallery: {
      eyebrow: "Gallery",
      heading: "The Nile in photographs",
    },
    creditsSummary: "Image credits & licenses",
  },
  deserts: {
    facts: [
      { icon: "globe", value: "~95%", label: "of Egypt is desert" },
      { icon: "star", value: "3 regions", label: "Western Desert, Eastern Desert & Sinai" },
      { icon: "info", value: "UNESCO 2005", label: "Wadi Al-Hitan, Valley of the Whales" },
      { icon: "clock", value: "6th century", label: "St Catherine’s, a living monastery" },
    ],
    features: {
      head: {
        eyebrow: "Egypt beyond the river",
        heading: "Three deserts, one country",
        intro:
          "Leave the thin green valley and almost all of Egypt is desert — but “desert” means many things here: white chalk badlands, palm-filled oases, painted mountains and the holy peaks of Sinai.",
      },
      rows: [
        {
          image: "white-desert-alien-landscape",
          eyebrow: "Western Desert",
          heading: "The White Desert",
          body: [
            "A few hours from the Bahariya Oasis, the ground turns to chalk sculpted by wind into mushrooms, towers and strange white shapes that glow at dusk and under the moon. Camping out here, under some of the darkest skies in Egypt, is the classic desert-safari night.",
          ],
        },
        {
          image: "siwa-oracle-temple",
          eyebrow: "Western Desert",
          heading: "Siwa and the Oracle of Amun",
          body: [
            "Remote Siwa, near the Libyan border, kept its own language and customs for centuries. Its ancient Oracle of Amun was famous across the classical world — Alexander the Great is said to have crossed the desert to consult it in 331 BC.",
          ],
        },
        {
          image: "saint-catherine-monastery",
          eyebrow: "Sinai",
          heading: "St Catherine’s Monastery and Mount Sinai",
          body: [
            "At the foot of the mountain where tradition places Moses and the burning bush, St Catherine’s has been a working monastery since the 6th century — among the oldest continuously inhabited Christian communities on earth. Many travellers climb the peak behind it in the dark to reach the summit for sunrise.",
          ],
        },
        {
          image: "wadi-el-hitan-fennec",
          eyebrow: "Wildlife",
          heading: "Life in the sand",
          body: [
            "The desert is far from empty. Fennec foxes, gazelle and migrating birds all cross it, while Wadi Al-Hitan — the Valley of the Whales — protects the fossil skeletons of ancient whales from a time, millions of years ago, when this desert was a sea.",
          ],
        },
      ],
    },
    places: {
      head: {
        eyebrow: "Oases & ranges",
        heading: "Where the sand takes shape",
        intro:
          "Between the great sand seas lie springs, palm groves and mountains — the places that make an Egyptian desert trip more than one long horizon.",
      },
      cards: [
        {
          image: "bahariya-oasis",
          name: "Bahariya Oasis",
          body: "A green, spring-fed town in the Western Desert and the usual jumping-off point for the White and Black Deserts.",
        },
        {
          image: "black-desert-panorama",
          name: "The Black Desert",
          body: "Low volcanic hills capped with dark stone give this stretch near Bahariya its name and its brooding colour.",
        },
        {
          image: "fayoum-desert",
          name: "Fayoum",
          body: "A vast oasis depression southwest of Cairo, edged with desert, lakes and the whale fossils of Wadi Al-Hitan.",
        },
        {
          image: "sinai-canyon",
          name: "Sinai’s canyons",
          body: "Coloured sandstone gorges wind through the Sinai interior — the Coloured Canyon near Nuweiba is the best known.",
        },
        {
          image: "nuweiba-desert-road",
          name: "Desert roads",
          body: "Long empty highways run between the coast and the interior, with mountains standing over the sand on every side.",
        },
      ],
    },
    gallery: {
      eyebrow: "Gallery",
      heading: "The deserts in photographs",
    },
    creditsSummary: "Image credits & licenses",
  },
  "red-sea": {
    facts: [
      { icon: "star", value: "200+", label: "species of coral on the reefs" },
      { icon: "info", value: "1983", label: "Ras Muhammad, Egypt’s first national park" },
      { icon: "weather", value: "Year-round", label: "warm water and sunshine" },
      { icon: "travel", value: "Sharm & Hurghada", label: "the main gateways to the reef" },
    ],
    features: {
      head: {
        eyebrow: "Warm water, walls of coral",
        heading: "One of the world’s great seas",
        intro:
          "The Red Sea is famous among divers and snorkellers for warm, clear water and reefs that drop straight into the blue. You do not have to dive to enjoy it — much of the best coral sits just a few metres below the surface.",
      },
      rows: [
        {
          image: "coral-reef-public-domain",
          eyebrow: "The reef",
          heading: "A living wall of coral",
          body: [
            "Egypt’s reefs hold more than 200 species of hard and soft coral and a dazzling cast of fish — clownfish, angelfish, parrotfish, the occasional turtle or reef shark. Because the water is warm and calm for much of the year, visibility is often superb.",
          ],
        },
        {
          image: "sharm-coral",
          eyebrow: "South Sinai",
          heading: "Ras Muhammad and Sharm El Sheikh",
          body: [
            "At the very tip of the Sinai peninsula, Ras Muhammad became Egypt’s first national park in 1983. Its steep coral walls and the resort town of Sharm El Sheikh next door make this one of the most celebrated stretches of reef anywhere.",
          ],
        },
        {
          image: "hurghada-coast",
          eyebrow: "Mainland coast",
          heading: "Hurghada, the reef on your doorstep",
          body: [
            "Hurghada grew from a small fishing village into the Red Sea’s busiest resort town, with easy boat access to dozens of offshore reefs and islands. It is the classic choice for a first Red Sea trip or a beach add-on after the temples.",
          ],
        },
        {
          image: "marsa-alam",
          eyebrow: "The deep south",
          heading: "Marsa Alam and the quieter coast",
          body: [
            "Further south the coast grows wilder and less developed. Marsa Alam is known for dugongs, dolphins and long reefs, and is the gateway to some of Egypt’s most pristine diving.",
          ],
        },
      ],
    },
    places: {
      head: {
        eyebrow: "Coast & islands",
        heading: "Along the shore",
        intro:
          "From the dive-town calm of Dahab to bare desert islands, the Red Sea coast has more than one mood.",
      },
      cards: [
        {
          image: "dahab-panorama",
          name: "Dahab & the Blue Hole",
          body: "A laid-back former Bedouin village on the Sinai coast, loved by free-divers and home to the famous Blue Hole.",
        },
        {
          image: "shadwan-island",
          name: "Red Sea islands",
          body: "Bare, sun-bleached islands like Shadwan sit offshore, ringed by reef and open water.",
        },
        {
          image: "nuweiba-red-sea-mountains",
          name: "Nuweiba",
          body: "On the Gulf of Aqaba, where the Sinai mountains fall almost straight into a narrow, intensely blue sea.",
        },
        {
          image: "red-sea-mountains",
          name: "Where desert meets sea",
          body: "The Red Sea Mountains rise just inland from the coast, a reminder that reef and desert are neighbours here.",
        },
        {
          image: "coral-bay-sharm",
          name: "Coral Bay",
          body: "One of the sheltered bays around Sharm El Sheikh, with reef flats reachable straight from the beach.",
        },
      ],
    },
    gallery: {
      eyebrow: "Gallery",
      heading: "The Red Sea in photographs",
    },
    creditsSummary: "Image credits & licenses",
  },
};

export const whenToVisitContent: WhenToVisitContent = {
  facts: [
    { icon: "weather", value: "Oct – Apr", label: "the cooler, most comfortable months" },
    { icon: "calendar", value: "Feb 22 & Oct 22", label: "the Abu Simbel Sun Festival" },
    { icon: "travel", value: "Year-round", label: "the Red Sea coast stays warm" },
    { icon: "info", value: "40°C+", label: "summer highs in Luxor & Aswan" },
  ],
  climate: {
    head: {
      eyebrow: "Month by month",
      heading: "When to come, and what it feels like",
      intro:
        "Egypt is a year-round destination, but the experience changes a lot with the season. Winter is mild and busy; high summer is very hot inland but still fine on the coast. The bands below are a general guide to sightseeing weather.",
    },
    months: [
      { month: "January", abbr: "Jan", band: "peak", note: "Cool, sunny days and chilly nights — prime sightseeing weather, and the busiest season." },
      { month: "February", abbr: "Feb", band: "peak", note: "Mild and clear; the Abu Simbel Sun Festival falls on 22 February." },
      { month: "March", abbr: "Mar", band: "peak", note: "Warm and pleasant, still comfortable for long temple days before the summer heat." },
      { month: "April", abbr: "Apr", band: "good", note: "Warm and lovely; a brief khamsin wind can raise dust on the odd day." },
      { month: "May", abbr: "May", band: "good", note: "Hot inland but excellent on the Red Sea coast, with thinner crowds." },
      { month: "June", abbr: "Jun", band: "hot", note: "High summer begins — very hot in Luxor and Aswan, best enjoyed early and late in the day." },
      { month: "July", abbr: "Jul", band: "hot", note: "Peak heat inland; the coast and an air-conditioned Nile cruise are the comfortable choices." },
      { month: "August", abbr: "Aug", band: "hot", note: "Still very hot inland, with warm sea temperatures on the Red Sea." },
      { month: "September", abbr: "Sep", band: "good", note: "The fierce heat starts to ease — a good shoulder month with fewer visitors." },
      { month: "October", abbr: "Oct", band: "peak", note: "Comfortable again everywhere; the second Abu Simbel Sun Festival falls on 22 October." },
      { month: "November", abbr: "Nov", band: "peak", note: "Warm days and cool evenings — one of the very best months to travel." },
      { month: "December", abbr: "Dec", band: "peak", note: "Cool and sunny; busy around the Christmas and New Year holidays." },
    ],
    legend: [
      { band: "peak", label: "Prime sightseeing weather" },
      { band: "good", label: "Good — warm to hot" },
      { band: "hot", label: "Very hot inland" },
    ],
  },
  regions: {
    head: {
      eyebrow: "It depends where you go",
      heading: "Different Egypts, different seasons",
      intro:
        "The best time to travel also depends on which Egypt you are after — the Nile valley, the Red Sea coast and the deep desert each have their own ideal window.",
    },
    rows: [
      {
        image: "aswan-nile",
        eyebrow: "Nile valley",
        heading: "Luxor, Aswan & the temples",
        body: [
          "For the great monuments, October to April is ideal: warm, dry days that make long hours among the temples a pleasure. Summer here is genuinely fierce, so plan early starts and midday rests if you come between June and August.",
        ],
      },
      {
        image: "red-sea-soma-bay",
        eyebrow: "The coast",
        heading: "The Red Sea",
        body: [
          "The coast is the exception to the calendar — warm and swimmable almost all year. Spring and autumn are glorious, and even high summer, unbearable inland, stays comfortable here with a sea breeze and easy water.",
        ],
      },
      {
        image: "white-desert-rock",
        eyebrow: "The Sahara",
        heading: "The Western Desert & oases",
        body: [
          "Desert safaris and oasis trips are best from October to April, when daytime heat is manageable and the desert nights turn crisp and starry. Deep summer in the open desert is best avoided.",
        ],
      },
    ],
  },
  gallery: {
    eyebrow: "Gallery",
    heading: "Egypt through the year",
  },
  creditsSummary: "Image credits & licenses",
};
