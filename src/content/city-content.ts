/**
 * Original, English-first editorial + SEO content for the six city pages
 * (alexandria / aswan / cairo / hurghada / luxor / sharm-el-sheikh).
 *
 * WHY THIS LIVES HERE (not in the i18n dictionaries): like theme-content.ts,
 * this rich copy is authored in English and shared across all locales for now.
 * The translated page chrome (breadcrumbs, tour headings, CTA buttons) still
 * comes from getPageContent → pc.cityDetail. Lift these strings into the i18n
 * dictionaries when the city pages are translated.
 *
 * FACTS: every claim here is written to be accurate as of 2025. Notably the
 * Grand Egyptian Museum at Giza opened fully on 1 November 2025 with the
 * complete Tutankhamun collection; Tutankhamun's mummy remains in the Valley
 * of the Kings. Approximate distances are rounded and prefixed "around/~".
 *
 * IMAGES: every `image`/`heroSlug` references an exact slug in cityMedia[city]
 * (src/content/city-media.ts). Resolve with cityImage(city, slug).
 */
import type { FactItem, FeatureRow, SectionHead } from "@/content/theme-content";
import type { CitySlug } from "@/content/city-media";

/** One ranked "Things to do" entry — numbered editorial, distinct from tour cards. */
export interface CityHighlight {
  rank: number;
  name: string;
  body: string;
}
export interface CityFaq {
  q: string;
  a: string;
}
export interface CitySeo {
  /** <title> — primary keyword first, brand last. */
  title: string;
  /** meta description (~150–160 chars). */
  description: string;
  /** supporting keywords for the metadata keywords field + OG. */
  keywords: string[];
}
export interface CityContent {
  seo: CitySeo;
  /** slug in cityMedia[city] used for the hero image (next/image, priority). */
  heroSlug: string;
  heroEyebrow: string;
  h1: string;
  lede: string;
  /** overview paragraphs — primary keyword appears in the first sentence. */
  overview: string[];
  facts: FactItem[];
  highlights: { head: SectionHead; items: CityHighlight[] };
  features: { head: SectionHead; rows: FeatureRow[] };
  whenToGo: { head: SectionHead; body: string[] };
  gettingThere: { head: SectionHead; body: string[] };
  gallery: SectionHead;
  faqs: CityFaq[];
  creditsSummary: string;
  /** other city slugs for "combine with / nearby" internal links. */
  nearby: CitySlug[];
}

export const cityContent: Record<CitySlug, CityContent> = {
  cairo: {
    seo: {
      title: "Cairo Tours & Day Trips | Pyramids of Giza",
      description:
        "Book Cairo tours and day trips — the Pyramids of Giza and the Sphinx, the Grand Egyptian Museum, the Citadel and Khan el-Khalili bazaar. Guided by local experts.",
      keywords: [
        "Cairo tours",
        "Cairo day trips",
        "Pyramids of Giza tours",
        "Grand Egyptian Museum",
        "things to do in Cairo",
        "Cairo excursions",
      ],
    },
    heroSlug: "city-of-a-thousand-minarets",
    heroEyebrow: "Egypt · The Capital on the Nile",
    h1: "Cairo Tours & Day Trips",
    lede: "Egypt's sprawling capital — home to the Pyramids of Giza and five thousand years of history.",
    overview: [
      "Cairo tours put the whole sweep of Egyptian history within a single city. On the Giza plateau at the capital's western edge stand the last of the Seven Wonders of the ancient world — the Great Pyramid, its two companions and the Great Sphinx. A short drive away, the Grand Egyptian Museum opened fully in November 2025 and now displays the complete treasures of Tutankhamun for the first time.",
      "Beyond the pharaohs, Cairo is a living medieval city. Its historic core — often called the City of a Thousand Minarets — folds together the Citadel of Saladin, great mosques, Coptic churches and the labyrinth of the Khan el-Khalili bazaar. This is the natural starting point for almost any trip to Egypt, and the base for day trips to Giza, Saqqara and Memphis.",
    ],
    facts: [
      { icon: "globe", value: "Nile Valley", label: "Egypt's capital region" },
      { icon: "star", value: "Giza Pyramids", label: "the last ancient wonder" },
      { icon: "calendar", value: "Oct – Apr", label: "most comfortable months" },
      { icon: "travel", value: "Main gateway", label: "Cairo International Airport" },
    ],
    highlights: {
      head: {
        eyebrow: "Top attractions",
        heading: "Things to do in Cairo",
        intro:
          "From the last standing wonder of the ancient world to a medieval city of minarets, these are the sights at the heart of a Cairo trip.",
      },
      items: [
        {
          rank: 1,
          name: "Pyramids of Giza & the Sphinx",
          body: "The three pyramids and the Great Sphinx sit on a plateau on the western edge of the city — the only ancient wonder still standing.",
        },
        {
          rank: 2,
          name: "Grand Egyptian Museum",
          body: "The world's largest museum devoted to a single civilisation, beside the pyramids. Fully open since November 2025, it holds the complete Tutankhamun collection.",
        },
        {
          rank: 3,
          name: "The Egyptian Museum, Tahrir",
          body: "The historic museum on Tahrir Square still shows a vast collection of antiquities; the royal mummies now rest at the National Museum of Egyptian Civilisation.",
        },
        {
          rank: 4,
          name: "Citadel of Saladin & Mosque of Muhammad Ali",
          body: "The medieval fortress crowning the city, with the alabaster mosque and long views across the rooftops.",
        },
        {
          rank: 5,
          name: "Khan el-Khalili & Islamic Cairo",
          body: "A bazaar founded in the 14th century, threaded through streets of historic mosques and madrasas.",
        },
        {
          rank: 6,
          name: "Coptic Cairo",
          body: "The old Christian quarter, with the Hanging Church and lanes linked by tradition to the Holy Family's time in Egypt.",
        },
      ],
    },
    features: {
      head: {
        eyebrow: "Explore the city",
        heading: "What makes Cairo unmissable",
        intro:
          "Ancient and medieval Egypt sit side by side here. A few days let you move from the pyramids to the museums to the old city and the river.",
      },
      rows: [
        {
          image: "cairo-museum-public-domain",
          eyebrow: "Museums",
          heading: "From Tahrir to the Grand Egyptian Museum",
          body: [
            "Cairo now has two great museums. The historic Egyptian Museum on Tahrir Square, opened in 1902, still holds a staggering collection of antiquities.",
            "Out at Giza, the Grand Egyptian Museum opened fully on 1 November 2025 — the largest museum of a single civilisation anywhere, and the first place to show the complete Tutankhamun collection together.",
          ],
        },
        {
          image: "khan-el-khalili-cc0",
          eyebrow: "Old Cairo",
          heading: "Khan el-Khalili and the city of minarets",
          body: [
            "The Khan el-Khalili bazaar has traded since the 14th century, a warren of lanes selling spices, lamps, silver and coffee.",
            "Around it stands historic Islamic Cairo, a UNESCO-listed quarter of mosques and madrasas that gave the city its old nickname, the City of a Thousand Minarets.",
          ],
        },
        {
          image: "cairo-nile-night",
          eyebrow: "The river",
          heading: "The Nile through the capital",
          body: [
            "The Nile threads right through Cairo, broad and busy, splitting around the leafy island of Zamalek.",
            "An evening felucca sail or a dinner cruise is the calmest way to see the city, with the lights of some twenty million people along both banks.",
          ],
        },
      ],
    },
    whenToGo: {
      head: { eyebrow: "Plan your visit", heading: "Best time to visit Cairo" },
      body: [
        "Cairo is at its best from October to April, when warm, dry days make long hours at the pyramids and in the old city comfortable.",
        "Summer, from June to August, is hot and hazy but perfectly doable with early starts and midday breaks. Spring and autumn bring the most pleasant weather and the clearest skies.",
      ],
    },
    gettingThere: {
      head: { eyebrow: "Getting around", heading: "How to get to Cairo" },
      body: [
        "Cairo International Airport is Egypt's principal gateway, with direct flights from across Europe, the Gulf, Africa and beyond.",
        "The city is also the hub of Egypt's rail network — sleeper and day trains run south to Luxor and Aswan, and fast services north to Alexandria.",
      ],
    },
    gallery: { eyebrow: "Gallery", heading: "Cairo in photographs" },
    faqs: [
      {
        q: "How many days do you need in Cairo?",
        a: "Two to three full days covers the essentials: a day for the Pyramids of Giza and the Grand Egyptian Museum, and a day or two for Islamic and Coptic Cairo, the Citadel and the bazaar.",
      },
      {
        q: "Is the Grand Egyptian Museum open?",
        a: "Yes. The Grand Egyptian Museum at Giza opened fully on 1 November 2025 and displays the complete Tutankhamun collection alongside thousands of other artefacts.",
      },
      {
        q: "Can you see the Pyramids on a day trip?",
        a: "Easily. The Giza plateau is within the Cairo metropolitan area, so the pyramids and the Sphinx are a short drive from the centre and are usually combined with the Grand Egyptian Museum.",
      },
      {
        q: "What is the best time to visit Cairo?",
        a: "October to April offers the most comfortable sightseeing weather. Summer is hot but manageable with early starts and midday rests.",
      },
    ],
    creditsSummary: "Image credits & licenses",
    nearby: ["luxor", "alexandria", "aswan"],
  },
  luxor: {
    seo: {
      title: "Luxor Tours & Day Trips | Book Excursions",
      description:
        "Luxor tours and day trips — Karnak, the Valley of the Kings, Hatshepsut's Temple and dawn balloon flights over the Nile. Guided by licensed Egyptologists.",
      keywords: [
        "Luxor tours",
        "Luxor day trips",
        "Valley of the Kings tour",
        "Karnak Temple",
        "things to do in Luxor",
        "Luxor excursions",
      ],
    },
    heroSlug: "karnak-temple",
    heroEyebrow: "Upper Egypt · Ancient Thebes",
    h1: "Luxor Tours & Day Trips",
    lede: "The world's greatest open-air museum, built on the site of ancient Thebes.",
    overview: [
      "Luxor tours take you into the heart of ancient Thebes, the New Kingdom capital of Egypt. Often called the world's greatest open-air museum, Luxor holds a density of monuments matched nowhere else — the vast temple complex of Karnak, Luxor Temple in the town centre, and, across the Nile, the royal tombs of the Valley of the Kings.",
      "The river splits the city in two: the living east bank with its temples and markets, and the west bank of tombs and mortuary temples where the ancient Egyptians buried their kings. A single day can pair Karnak with the Valley of the Kings, and there is no finer dawn than the one seen from a hot-air balloon drifting over the whole Theban plain.",
    ],
    facts: [
      { icon: "globe", value: "Upper Egypt", label: "on the Nile, ancient Thebes" },
      { icon: "star", value: "Valley of the Kings", label: "royal tombs of the New Kingdom" },
      { icon: "calendar", value: "Nov – Feb", label: "coolest months for touring" },
      { icon: "travel", value: "~1 hr flight", label: "south from Cairo" },
    ],
    highlights: {
      head: {
        eyebrow: "Top attractions",
        heading: "Things to do in Luxor",
        intro:
          "Temples, royal tombs and the Nile — Luxor packs more of ancient Egypt into a short stay than anywhere else in the country.",
      },
      items: [
        {
          rank: 1,
          name: "Karnak Temple",
          body: "A city of temples added to across more than a thousand years; its Great Hypostyle Hall packs 134 giant columns into a stone forest.",
        },
        {
          rank: 2,
          name: "Valley of the Kings",
          body: "The rock-cut royal tombs of the New Kingdom, including the tomb of Tutankhamun, whose mummy still rests here.",
        },
        {
          rank: 3,
          name: "Luxor Temple",
          body: "In the heart of the modern town, once linked to Karnak by an avenue of sphinxes and beautifully floodlit after dark.",
        },
        {
          rank: 4,
          name: "Temple of Hatshepsut",
          body: "The colonnaded mortuary temple of Egypt's most famous female pharaoh, set against the cliffs of the west bank at Deir el-Bahari.",
        },
        {
          rank: 5,
          name: "Medinet Habu",
          body: "The great mortuary temple of Ramesses III, famous for its vivid, remarkably well-preserved carved reliefs.",
        },
        {
          rank: 6,
          name: "A dawn balloon flight",
          body: "The classic Luxor experience: floating over the temples, tombs and green riverbanks as the sun comes up.",
        },
      ],
    },
    features: {
      head: {
        eyebrow: "Explore the city",
        heading: "What makes Luxor unmissable",
        intro:
          "The Nile divides Luxor into the temples of the living east bank and the tombs of the west. Both belong on any itinerary.",
      },
      rows: [
        {
          image: "valley-of-kings",
          eyebrow: "West Bank",
          heading: "The Valley of the Kings",
          body: [
            "Hidden in a desert valley behind the cliffs, more than sixty royal tombs were cut deep into the rock and painted with texts to guide the pharaohs into the afterlife.",
            "Tutankhamun's tomb is here, and his mummy still lies within it; much of his treasure has moved to the Grand Egyptian Museum near Cairo.",
          ],
        },
        {
          image: "hatshepsut-temple",
          eyebrow: "Mortuary temples",
          heading: "Temples against the cliffs",
          body: [
            "The terraced temple of Hatshepsut rises straight out of the rock at Deir el-Bahari, one of the most striking buildings in Egypt.",
            "Nearby stand Medinet Habu and the Colossi of Memnon, two giant seated statues that have guarded the plain for over three thousand years.",
          ],
        },
        {
          image: "luxor-nile-sunset",
          eyebrow: "The river",
          heading: "The Nile at Luxor",
          body: [
            "A felucca or motorboat crossing links the two banks, and sunset on the water is a Luxor ritual.",
            "Many travellers arrive or leave by Nile cruise to Aswan, turning the journey between the monuments into part of the trip.",
          ],
        },
      ],
    },
    whenToGo: {
      head: { eyebrow: "Plan your visit", heading: "Best time to visit Luxor" },
      body: [
        "Luxor is in Upper Egypt, where summers are genuinely fierce — temperatures regularly climb above 40°C from June to August.",
        "The ideal window is November to February, with warm, dry days perfect for long hours among the temples. Whenever you come, start early and rest through the midday heat.",
      ],
    },
    gettingThere: {
      head: { eyebrow: "Getting around", heading: "How to get to Luxor" },
      body: [
        "Luxor sits on the Nile around 670 km south of Cairo — about a one-hour domestic flight, or an overnight sleeper train.",
        "Luxor International Airport handles domestic and seasonal international flights, and many visitors arrive by Nile cruise from Aswan, roughly 220 km to the south.",
      ],
    },
    gallery: { eyebrow: "Gallery", heading: "Luxor in photographs" },
    faqs: [
      {
        q: "How many days do you need in Luxor?",
        a: "Two days lets you cover the east bank (Karnak and Luxor Temple) and the west bank (Valley of the Kings, Hatshepsut and Medinet Habu) without rushing. One very full day is possible if time is short.",
      },
      {
        q: "Is Tutankhamun's tomb still in the Valley of the Kings?",
        a: "Yes. Tutankhamun's mummy remains in his tomb (KV62) in the Valley of the Kings. Much of his treasure is now displayed at the Grand Egyptian Museum near Cairo.",
      },
      {
        q: "Can you visit Luxor as a day trip from Hurghada?",
        a: "Yes. Luxor is a popular long day trip from Hurghada on the Red Sea, usually a few hours each way by road, taking in Karnak and the Valley of the Kings.",
      },
      {
        q: "What is the best time to visit Luxor?",
        a: "November to February for the coolest, most comfortable sightseeing weather. Summer is very hot but quieter, and best tackled with early starts.",
      },
    ],
    creditsSummary: "Image credits & licenses",
    nearby: ["aswan", "cairo", "hurghada"],
  },
  aswan: {
    seo: {
      title: "Aswan Tours & Day Trips | Abu Simbel & Nile",
      description:
        "Aswan tours and day trips — the temples of Philae and Abu Simbel, feluccas on the Nile, Nubian villages and the High Dam. Egypt's serene southern city.",
      keywords: [
        "Aswan tours",
        "Aswan day trips",
        "Abu Simbel tour",
        "Philae Temple",
        "felucca Aswan",
        "things to do in Aswan",
      ],
    },
    heroSlug: "aswan-nile-r01",
    heroEyebrow: "Upper Egypt · The Nubian Nile",
    h1: "Aswan Tours & Day Trips",
    lede: "Egypt's tranquil southern frontier, where the Nile is at its most beautiful.",
    overview: [
      "Aswan tours explore Egypt's gentle southern city, set where the Nile is at its most scenic — islands, granite boulders and golden desert running right down to bright blue water. It is the most relaxed of the Nile towns and the gateway to Nubia, with a distinct culture, cuisine and music of its own.",
      "From Aswan you can sail to the island Temple of Philae, take a felucca around Elephantine Island and Kitchener's Island, and make the journey south to the colossal rock temples of Abu Simbel. The High Dam and the Unfinished Obelisk tell the more recent story of a city shaped by the river it controls.",
    ],
    facts: [
      { icon: "globe", value: "Nubia", label: "Egypt's far south" },
      { icon: "star", value: "Abu Simbel", label: "Ramesses II's rock temples" },
      { icon: "calendar", value: "Nov – Feb", label: "cool, clear touring weather" },
      { icon: "travel", value: "~1 hr flight", label: "south from Cairo" },
    ],
    highlights: {
      head: {
        eyebrow: "Top attractions",
        heading: "Things to do in Aswan",
        intro:
          "Island temples, sailboats and the road to Abu Simbel — Aswan rewards a slower pace than anywhere else on the Nile.",
      },
      items: [
        {
          rank: 1,
          name: "Abu Simbel",
          body: "The colossal rock-cut temples of Ramesses II, about 280 km south of Aswan, moved block by block to escape the rising waters of Lake Nasser.",
        },
        {
          rank: 2,
          name: "Temple of Philae",
          body: "The graceful temple of the goddess Isis, relocated to the island of Agilkia during the High Dam campaign and reached by boat.",
        },
        {
          rank: 3,
          name: "A felucca on the Nile",
          body: "The traditional sailboat of the river; an afternoon around Elephantine and Kitchener's Islands is the classic Aswan experience.",
        },
        {
          rank: 4,
          name: "A Nubian village",
          body: "Brightly painted riverside houses, Nubian food and warm hospitality, usually reached by boat across the Nile.",
        },
        {
          rank: 5,
          name: "The Aswan High Dam",
          body: "The 1960s dam that created Lake Nasser, ended the Nile's annual flood and reshaped modern Egypt.",
        },
        {
          rank: 6,
          name: "The Unfinished Obelisk",
          body: "Abandoned in its ancient granite quarry, it reveals exactly how the Egyptians cut their giant monuments.",
        },
      ],
    },
    features: {
      head: {
        eyebrow: "Explore the city",
        heading: "What makes Aswan unmissable",
        intro:
          "This is the Nile at its most beautiful, and the doorway to Nubia and the far south of ancient Egypt.",
      },
      rows: [
        {
          image: "philae-temple",
          eyebrow: "Island temple",
          heading: "Philae, temple of Isis",
          body: [
            "When the High Dam threatened to drown it, the whole temple of Philae was cut apart and rebuilt stone by stone on higher ground at Agilkia Island.",
            "Reached by a short boat ride, it is one of the loveliest settings of any temple in Egypt, especially in the soft light of early morning.",
          ],
        },
        {
          image: "felucca-aswan",
          eyebrow: "Under sail",
          heading: "Feluccas and the islands",
          body: [
            "Nothing captures Aswan like an afternoon under a felucca's white sail, tacking between granite islands as the sun drops.",
            "The river here wraps around Elephantine Island and the botanical gardens of Kitchener's Island, both easy to weave into a sail.",
          ],
        },
        {
          image: "aswan-high-dam",
          eyebrow: "The modern Nile",
          heading: "The High Dam and Lake Nasser",
          body: [
            "Completed in 1970, the Aswan High Dam tamed the Nile's floods and created Lake Nasser, one of the world's largest reservoirs.",
            "The project reshaped Egypt — and forced the epic rescue of Abu Simbel and Philae from the rising water.",
          ],
        },
      ],
    },
    whenToGo: {
      head: { eyebrow: "Plan your visit", heading: "Best time to visit Aswan" },
      body: [
        "As the southernmost of Egypt's main cities, Aswan is hot for much of the year and searing in high summer. November to February brings warm days and cool, clear nights — ideal for temples and river time.",
        "The Abu Simbel Sun Festival, when sunlight reaches the inner sanctuary, falls on 22 February and 22 October and draws big crowds.",
      ],
    },
    gettingThere: {
      head: { eyebrow: "Getting around", heading: "How to get to Aswan" },
      body: [
        "Aswan lies on the Nile in Egypt's far south, about a one-hour flight from Cairo or an overnight train.",
        "Abu Simbel is roughly 280 km further south, reached by road or a short domestic flight. Many visitors arrive or leave by Nile cruise between Aswan and Luxor.",
      ],
    },
    gallery: { eyebrow: "Gallery", heading: "Aswan in photographs" },
    faqs: [
      {
        q: "Is Abu Simbel worth the trip from Aswan?",
        a: "For most travellers, yes. The two rock-cut temples of Ramesses II are among Egypt's most spectacular monuments. The trip is around 280 km each way by road, or a short domestic flight.",
      },
      {
        q: "What is a felucca ride in Aswan?",
        a: "A felucca is a traditional wooden sailboat. A gentle sail around Elephantine Island and Kitchener's Island, especially at sunset, is the signature Aswan experience.",
      },
      {
        q: "How many days do you need in Aswan?",
        a: "One to two days covers Philae, a felucca sail and a Nubian village; add a day if you want to make the excursion south to Abu Simbel.",
      },
      {
        q: "What is the best time to visit Aswan?",
        a: "November to February for the coolest weather. Summers are very hot, so early starts are essential if you travel then.",
      },
    ],
    creditsSummary: "Image credits & licenses",
    nearby: ["luxor", "cairo", "hurghada"],
  },
  alexandria: {
    seo: {
      title: "Alexandria Tours & Day Trips from Cairo",
      description:
        "Alexandria tours and day trips — the Citadel of Qaitbay, the Bibliotheca Alexandrina, Roman catacombs and the Mediterranean corniche. Egypt's historic seaside city.",
      keywords: [
        "Alexandria tours",
        "Alexandria day trips",
        "Alexandria day trip from Cairo",
        "Bibliotheca Alexandrina",
        "Citadel of Qaitbay",
        "things to do in Alexandria",
      ],
    },
    heroSlug: "citadel-of-qaitbay-alexandria-egypt",
    heroEyebrow: "Egypt · The Mediterranean Coast",
    h1: "Alexandria Tours & Day Trips",
    lede: "Egypt's storied seaside city, founded by Alexander the Great.",
    overview: [
      "Alexandria tours trace the Mediterranean city founded by Alexander the Great in 331 BC. For centuries it was one of the great cities of the ancient world, home to the fabled Library and the Pharos lighthouse — one of the Seven Wonders. Today it is Egypt's second city, strung along a curving seafront corniche with a character all its own.",
      "Most visitors come from Cairo, around three hours away by road or high-speed train, which makes Alexandria a popular day trip. The Citadel of Qaitbay stands on the site of the ancient lighthouse, and the modern Bibliotheca Alexandrina revives the memory of the lost Library, alongside Roman catacombs, Pompey's Pillar and famous seafront seafood.",
    ],
    facts: [
      { icon: "globe", value: "Mediterranean", label: "Egypt's second city" },
      { icon: "star", value: "Qaitbay Citadel", label: "on the site of the Pharos" },
      { icon: "calendar", value: "Spring & autumn", label: "mild coastal weather" },
      { icon: "travel", value: "~3 hrs", label: "by road or train from Cairo" },
    ],
    highlights: {
      head: {
        eyebrow: "Top attractions",
        heading: "Things to do in Alexandria",
        intro:
          "Greek, Roman and modern Egypt layered along one Mediterranean seafront — all within a comfortable day from Cairo.",
      },
      items: [
        {
          rank: 1,
          name: "Citadel of Qaitbay",
          body: "A 15th-century fort guarding the harbour, built on the very site of the ancient Pharos lighthouse.",
        },
        {
          rank: 2,
          name: "Bibliotheca Alexandrina",
          body: "A striking modern library and cultural centre reviving the legacy of the ancient Library of Alexandria.",
        },
        {
          rank: 3,
          name: "Catacombs of Kom el-Shoqafa",
          body: "A multi-level Roman-era necropolis blending Egyptian, Greek and Roman art, rediscovered by chance in 1900.",
        },
        {
          rank: 4,
          name: "Pompey's Pillar",
          body: "A towering Roman triumphal column beside the ruins of the Serapeum temple.",
        },
        {
          rank: 5,
          name: "The Corniche & Montaza",
          body: "The long seafront promenade, ending at the royal gardens and palace of Montaza to the east.",
        },
        {
          rank: 6,
          name: "Seafront seafood",
          body: "Alexandria is famous across Egypt for fresh Mediterranean seafood eaten right by the water.",
        },
      ],
    },
    features: {
      head: {
        eyebrow: "Explore the city",
        heading: "What makes Alexandria unmissable",
        intro:
          "A Mediterranean capital of memory, where the ghosts of the ancient world meet a lively modern seafront.",
      },
      rows: [
        {
          image: "citadel-of-qaitbay-014",
          eyebrow: "The harbour",
          heading: "The Citadel of Qaitbay",
          body: [
            "The fortress of Qaitbay guards the entrance to the eastern harbour, its pale walls rising straight from the sea.",
            "It stands on the exact spot where the Pharos lighthouse — one of the Seven Wonders of the ancient world — once warned ships off the coast.",
          ],
        },
        {
          image: "alexandria-egypt-235108463",
          eyebrow: "The seafront city",
          heading: "A capital of memory by the sea",
          body: [
            "Alexandria curves for miles along a breezy corniche, its cafés and faded villas looking out over the Mediterranean.",
            "The modern Bibliotheca Alexandrina, the Roman catacombs and Pompey's Pillar keep the city's Greek and Roman past close to the surface.",
          ],
        },
      ],
    },
    whenToGo: {
      head: { eyebrow: "Plan your visit", heading: "Best time to visit Alexandria" },
      body: [
        "With its Mediterranean setting, Alexandria is milder than the rest of Egypt — pleasant in spring and autumn, hot but sea-cooled in summer, and cool and sometimes rainy in winter.",
        "Spring (March to May) and autumn (September to November) are the most comfortable times to walk the corniche and explore the sites.",
      ],
    },
    gettingThere: {
      head: { eyebrow: "Getting around", heading: "How to get to Alexandria" },
      body: [
        "Alexandria is around three hours from Cairo by road or high-speed train (roughly 220 km northwest), which makes it a popular day trip or overnight from the capital.",
        "Borg El Arab Airport, west of the city, handles a growing number of international flights for travellers heading straight to the coast.",
      ],
    },
    gallery: { eyebrow: "Gallery", heading: "Alexandria in photographs" },
    faqs: [
      {
        q: "Can you visit Alexandria as a day trip from Cairo?",
        a: "Yes — it's one of the most popular day trips in Egypt. Alexandria is about three hours from Cairo by road or high-speed train, leaving a full day for the Citadel, the library and the catacombs.",
      },
      {
        q: "What is Alexandria known for?",
        a: "Founded by Alexander the Great, it was home to the ancient Library and the Pharos lighthouse. Today it's known for its Mediterranean seafront, Greco-Roman sites and fresh seafood.",
      },
      {
        q: "How many days do you need in Alexandria?",
        a: "A single full day covers the highlights. An overnight stay lets you enjoy the corniche and the seafood at a slower pace.",
      },
      {
        q: "What is the best time to visit Alexandria?",
        a: "Spring and autumn are ideal. Summer is busy and warm but tempered by the sea; winter is cool and can be rainy.",
      },
    ],
    creditsSummary: "Image credits & licenses",
    nearby: ["cairo", "luxor", "aswan"],
  },
  hurghada: {
    seo: {
      title: "Hurghada Excursions & Day Trips | Red Sea",
      description:
        "Hurghada excursions and day trips — snorkelling and diving on the Red Sea reefs, Giftun Island boat trips, desert safaris and long day trips to Luxor.",
      keywords: [
        "Hurghada excursions",
        "Hurghada day trips",
        "Giftun Island snorkelling",
        "Red Sea diving Hurghada",
        "things to do in Hurghada",
        "Hurghada boat trips",
      ],
    },
    heroSlug: "giftun-eden-island",
    heroEyebrow: "Egypt · The Red Sea Riviera",
    h1: "Hurghada Excursions & Day Trips",
    lede: "Egypt's busiest Red Sea resort, and a gateway to warm-water reefs.",
    overview: [
      "Hurghada excursions are all about the Red Sea. Grown from a small fishing village into Egypt's busiest coastal resort, Hurghada sits on a long stretch of warm, clear water with dozens of offshore reefs and islands within easy reach. It's the classic choice for a first Red Sea trip, a family beach holiday or a sun-and-sea add-on after the temples.",
      "Boat trips head out to Giftun Island and Orange Bay for snorkelling over coral gardens, while divers explore reefs and wrecks up and down the coast. Inland, desert safaris by quad or jeep reach Bedouin camps under the stars, and long day trips run west to the temples of Luxor.",
    ],
    facts: [
      { icon: "globe", value: "Red Sea coast", label: "mainland Egypt" },
      { icon: "star", value: "Giftun Island", label: "reefs and white-sand bays" },
      { icon: "weather", value: "Year-round sun", label: "warm sea and sunshine" },
      { icon: "travel", value: "Direct charters", label: "plus ~1 hr flight from Cairo" },
    ],
    highlights: {
      head: {
        eyebrow: "Top attractions",
        heading: "Things to do in Hurghada",
        intro:
          "Reefs, islands and desert — Hurghada is built for time on and under the water, with the temples of Luxor within a day's reach.",
      },
      items: [
        {
          rank: 1,
          name: "Giftun Island & Orange Bay",
          body: "The most popular boat trip from Hurghada: white-sand bays and shallow reefs ideal for snorkelling.",
        },
        {
          rank: 2,
          name: "Snorkelling & diving the reefs",
          body: "Warm, clear water and reefs full of coral and fish make this one of the world's favourite dive destinations.",
        },
        {
          rank: 3,
          name: "A Red Sea boat trip",
          body: "Half- and full-day cruises combine snorkelling stops, swimming and lunch out on the water.",
        },
        {
          rank: 4,
          name: "Desert safari",
          body: "Quad bikes, jeeps and camels head into the Eastern Desert to Bedouin camps for sunset and dinner.",
        },
        {
          rank: 5,
          name: "The marina & El Dahar old town",
          body: "The waterfront promenade for dining and evenings out, and the older quarter's markets and cafés.",
        },
        {
          rank: 6,
          name: "Day trip to Luxor",
          body: "A long but rewarding day inland to the temples and tombs of ancient Thebes.",
        },
      ],
    },
    features: {
      head: {
        eyebrow: "Explore the coast",
        heading: "What makes Hurghada unmissable",
        intro:
          "A whole coastline of reefs and islands, with the ancient sites of the Nile Valley an easy day trip away.",
      },
      rows: [
        {
          image: "giftun-island-egypte-panoramio",
          eyebrow: "The islands",
          heading: "Giftun Island and the reefs",
          body: [
            "The islands off Hurghada are ringed by shallow coral reefs and bright white sandbars — the Red Sea at its most postcard-perfect.",
            "Orange Bay on Giftun is the headline stop, with warm, calm water that suits first-time snorkellers as much as seasoned divers.",
          ],
        },
        {
          image: "egypt-hurghada-from-plane01",
          eyebrow: "The Red Sea Riviera",
          heading: "Resort coast and desert edge",
          body: [
            "Hurghada runs for miles along the shore, a strip of resorts and marinas backed by the Eastern Desert.",
            "That mix means you can snorkel in the morning, ride the dunes by quad at sunset, and still fit in a day trip to Luxor's temples.",
          ],
        },
      ],
    },
    whenToGo: {
      head: { eyebrow: "Plan your visit", heading: "Best time to visit Hurghada" },
      body: [
        "The Red Sea coast is a year-round destination — warm and swimmable in every season. Spring and autumn are glorious, and water temperatures stay comfortable all year.",
        "Summer is hot but tempered by sea breezes and perfect for water time, while winter stays mild and sunny by day, cooler after dark.",
      ],
    },
    gettingThere: {
      head: { eyebrow: "Getting around", heading: "How to get to Hurghada" },
      body: [
        "Hurghada sits on the Red Sea coast, roughly a one-hour flight from Cairo or around a four- to five-hour drive.",
        "Hurghada International Airport receives direct scheduled and charter flights from many European cities, making it one of the easiest places in Egypt to reach directly from abroad.",
      ],
    },
    gallery: { eyebrow: "Gallery", heading: "Hurghada in photographs" },
    faqs: [
      {
        q: "What is the best excursion in Hurghada?",
        a: "A boat trip to Giftun Island and Orange Bay is the most popular, combining snorkelling over coral reefs with time on white-sand beaches.",
      },
      {
        q: "Can you visit Luxor from Hurghada?",
        a: "Yes. Luxor is a popular long day trip from Hurghada, usually a few hours each way by road, taking in Karnak and the Valley of the Kings.",
      },
      {
        q: "Is Hurghada good for snorkelling and diving?",
        a: "Very. The offshore reefs are warm, clear and rich in coral and fish, suitable for first-timers and experienced divers alike.",
      },
      {
        q: "What is the best time to visit Hurghada?",
        a: "Any time of year. Spring and autumn are ideal; summer is hot but great for the water; winter is mild and sunny.",
      },
    ],
    creditsSummary: "Image credits & licenses",
    nearby: ["luxor", "cairo", "sharm-el-sheikh"],
  },
  "sharm-el-sheikh": {
    seo: {
      title: "Sharm el-Sheikh Excursions & Day Trips",
      description:
        "Sharm el-Sheikh excursions and day trips — world-class diving and snorkelling at Ras Muhammad and Tiran, desert safaris and the trip to St Catherine's Monastery.",
      keywords: [
        "Sharm el-Sheikh excursions",
        "Sharm el-Sheikh day trips",
        "Ras Muhammad diving",
        "Tiran Island snorkelling",
        "things to do in Sharm el-Sheikh",
        "St Catherine's Monastery trip",
      ],
    },
    heroSlug: "ras-mohammed-panoramio",
    heroEyebrow: "Egypt · South Sinai",
    h1: "Sharm el-Sheikh Excursions & Day Trips",
    lede: "A South Sinai resort ringed by some of the world's finest coral reefs.",
    overview: [
      "Sharm el-Sheikh excursions centre on the extraordinary reefs of South Sinai. At the peninsula's southern tip, the resort looks out over water that draws divers and snorkellers from around the world — nowhere more so than Ras Muhammad National Park, Egypt's first national park, where steep coral walls drop straight into the blue.",
      "Beyond the reefs, Sharm is a base for the desert and mountains of the Sinai interior. Boat trips run to Tiran Island, and one of Egypt's great overland journeys climbs to St Catherine's Monastery and Mount Sinai. Naama Bay is the hub for dining and evenings out.",
    ],
    facts: [
      { icon: "globe", value: "South Sinai", label: "the peninsula's tip" },
      { icon: "star", value: "Ras Muhammad", label: "Egypt's first national park" },
      { icon: "weather", value: "Year-round sun", label: "warm, clear Red Sea water" },
      { icon: "travel", value: "Direct flights", label: "from Europe and the Gulf" },
    ],
    highlights: {
      head: {
        eyebrow: "Top attractions",
        heading: "Things to do in Sharm el-Sheikh",
        intro:
          "Some of the planet's best diving sits on the doorstep, with desert and mountain adventures a short drive inland.",
      },
      items: [
        {
          rank: 1,
          name: "Ras Muhammad National Park",
          body: "Egypt's first national park, protecting spectacular coral walls where divers and snorkellers meet clouds of fish.",
        },
        {
          rank: 2,
          name: "Diving & snorkelling",
          body: "Sharm is one of the world's top dive centres, with easy reef access for beginners and famous sites for experts.",
        },
        {
          rank: 3,
          name: "Tiran Island",
          body: "A boat-trip favourite in the strait between Sinai and Arabia, ringed by shallow, colourful reefs.",
        },
        {
          rank: 4,
          name: "Naama Bay",
          body: "The resort's lively seafront hub of restaurants, cafés and nightlife.",
        },
        {
          rank: 5,
          name: "St Catherine's Monastery & Mount Sinai",
          body: "An overland trip into the mountains to a 6th-century monastery and the peak traditionally linked to Moses.",
        },
        {
          rank: 6,
          name: "Desert safari",
          body: "Quad, jeep and camel trips into the Sinai desert, often ending with a Bedouin dinner under the stars.",
        },
      ],
    },
    features: {
      head: {
        eyebrow: "Explore the coast",
        heading: "What makes Sharm el-Sheikh unmissable",
        intro:
          "The reefs are the reason to come, but the Sinai's deserts and holy mountains give Sharm a second dimension.",
      },
      rows: [
        {
          image: "ras-mohamed-national-park-panoramio",
          eyebrow: "The national park",
          heading: "Ras Muhammad's coral walls",
          body: [
            "At the very tip of Sinai, the reefs of Ras Muhammad plunge from the surface into deep blue water alive with fish.",
            "Declared Egypt's first national park in 1983, it remains one of the finest and most protected reef systems in the Red Sea.",
          ],
        },
        {
          image: "divemaster-ready-to-go",
          eyebrow: "Under the surface",
          heading: "A world capital of diving",
          body: [
            "Dive centres line the shore, running courses for complete beginners and guided dives to famous sites for the experienced.",
            "Warm water and superb visibility make Sharm one of the easiest places anywhere to learn to dive or simply snorkel a reef.",
          ],
        },
        {
          image: "tiran-island-sharm-el-sheikh-south-sinai-egypt",
          eyebrow: "Boat trips",
          heading: "Tiran Island and the strait",
          body: [
            "The reefs around Tiran, in the strait toward Saudi Arabia, are a classic day trip by boat from Sharm.",
            "Shallow coral gardens and drop-offs sit close together, so snorkellers and divers share some of the best sites.",
          ],
        },
      ],
    },
    whenToGo: {
      head: { eyebrow: "Plan your visit", heading: "Best time to visit Sharm el-Sheikh" },
      body: [
        "Sheltered on the Gulf of Aqaba, Sharm el-Sheikh enjoys warm, dry weather almost year-round. Spring and autumn are ideal for combining diving with desert trips.",
        "Summer is hot but the sea stays inviting, and winter days are pleasantly warm — though evenings, and the mountain trip to St Catherine's, can be cold.",
      ],
    },
    gettingThere: {
      head: { eyebrow: "Getting around", heading: "How to get to Sharm el-Sheikh" },
      body: [
        "Sharm el-Sheikh sits at the southern tip of the Sinai Peninsula. Its international airport receives direct scheduled and charter flights from across Europe and the Gulf, so many visitors arrive straight from abroad.",
        "Overland, it's a long but scenic drive from Cairo across the Sinai, and domestic flights link it to the capital in about an hour.",
      ],
    },
    gallery: { eyebrow: "Gallery", heading: "Sharm el-Sheikh in photographs" },
    faqs: [
      {
        q: "What is Sharm el-Sheikh best known for?",
        a: "World-class diving and snorkelling, above all in Ras Muhammad National Park, plus warm year-round sunshine and easy direct flights from Europe.",
      },
      {
        q: "Can beginners dive or snorkel in Sharm?",
        a: "Yes. Many reefs are shallow and close to shore, ideal for first-time snorkellers, while dive centres run courses and guided dives for all levels.",
      },
      {
        q: "Is the trip to St Catherine's Monastery worth it?",
        a: "For many visitors, yes. It's a long overland day — or an overnight for the Mount Sinai sunrise climb — into the mountains to one of the world's oldest working monasteries.",
      },
      {
        q: "What is the best time to visit Sharm el-Sheikh?",
        a: "Spring and autumn are ideal. Summer is hot but great for the water, and winter is mild by day though cooler at night.",
      },
    ],
    creditsSummary: "Image credits & licenses",
    nearby: ["cairo", "hurghada", "luxor"],
  },
};
