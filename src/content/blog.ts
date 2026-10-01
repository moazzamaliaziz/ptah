/**
 * Blog content SSOT (Wave 1).
 *
 * Shared card metadata (title, summary, hero image, credit, href) lives in the
 * `stories` array in `landing.ts` — the same five featured stories the landing
 * page links to. This module keys the full editorial BODY of each post to its
 * slug and joins the two, so the landing feature and the /blog pages never drift.
 *
 * Pure shared module (no `server-only`): safe to import from server components
 * and from other content modules. Bodies are original editorial copy — no
 * fabricated quotes, statistics, or attributions.
 */
import { stories, type Story } from "./landing";
import { localeHtmlLang, type Locale } from "@/i18n/config";
import { getLandingDefaults } from "./localized/landing";

/** A single rendered block within a post body. */
export type BlogBlock =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string };

export interface BlogPostMeta {
  author: string;
  /** ISO date (YYYY-MM-DD) for <time> + sort order. */
  publishedISO: string;
  /** Rough read time in minutes, shown as a hint. */
  readMinutes: number;
  body: BlogBlock[];
}

export interface BlogPost extends BlogPostMeta {
  slug: string;
  /** Canonical link, e.g. "/blog/cairo-beyond-the-guidebook". */
  href: string;
  title: string;
  summary: string;
  image: Story["image"];
  credit: string;
}

/** Extract the `/blog/<slug>` slug from a story href (empty if not a blog link). */
function slugFromHref(href: string): string {
  const m = href.match(/^\/blog\/([^/?#]+)/);
  return m ? m[1] : "";
}

const p = (text: string): BlogBlock => ({ kind: "p", text });
const h2 = (text: string): BlogBlock => ({ kind: "h2", text });

/** Full post bodies, keyed by slug. Card metadata comes from `stories`. */
const POST_BODIES: Record<string, BlogPostMeta> = {
  "cairo-beyond-the-guidebook": {
    author: "The Ptah Tours team",
    publishedISO: "2026-03-12",
    readMinutes: 6,
    body: [
      p("Cairo overwhelms first-time visitors, and that's part of its charm. Twenty-something million people, a river older than history, and traffic that turns a two-mile trip into an adventure. The guidebook will send you to the Pyramids and the Egyptian Museum — and you should absolutely go. But the Cairo we love is the one you find in the hours between."),
      h2("Eat where Cairenes eat"),
      p("Koshari is the city on a plate: rice, lentils, pasta, chickpeas, crisp fried onions and a garlicky tomato sauce, assembled at speed and eaten standing up. Skip the tourist cafés and follow the lunchtime queue of office workers instead. The best koshari is loud, cheap, and served with a bottle of hot sauce you should treat with respect."),
      p("In the evening, the old fatir bakeries and the ful and taameya carts come into their own. Egyptian street food is some of the most rewarding in the region, and eating it well is mostly a matter of going where it's busy and freshly cooked."),
      h2("Find the sunset"),
      p("Everyone photographs the Pyramids at sunset. Fewer people climb up to the Citadel of Salah al-Din, where the Mosque of Muhammad Ali crowns the skyline and the whole city spreads out below in the low gold light. As the call to prayer rises across the rooftops, it's one of the great free experiences in Cairo."),
      h2("The museum's quiet rooms"),
      p("The famous halls of the Egyptian Museum are unmissable, but the back rooms reward patience: cases of everyday objects — sandals, combs, children's toys, a scribe's palette — that make the ancient world feel suddenly, movingly human. Our guides love these corners, and a slow morning here beats a rushed hour any day."),
      p("Cairo doesn't hand itself over easily. Give it a few days, a good guide, and an appetite, and it becomes the city you'll want to come back to."),
    ],
  },
  "karnak-sound-and-light": {
    author: "The Ptah Tours team",
    publishedISO: "2026-04-02",
    readMinutes: 5,
    body: [
      p("The Karnak sound and light show has a reputation, and not always a kind one. Some travelers dismiss it as a dated bit of theatre. Done right — and timed right — it's one of the most atmospheric evenings you can have in Luxor."),
      h2("Timing is everything"),
      p("The trick is the crowds. We schedule visits so that, as the show moves through the temple, our travelers reach the great Hypostyle Hall when it's nearly empty. Standing among 134 towering columns in the dark, lit one section at a time, with the narration echoing off three-thousand-year-old stone — that's the moment people remember."),
      h2("What the lighting gets right"),
      p("Say what you like about the script, the lighting design understands the architecture. Watch how the obelisks catch the light and seem to lift; how a wash of colour reveals a wall of hieroglyphs you'd have walked straight past by day. Karnak was built to stage the drama of the divine, and after dark it still does."),
      h2("Pair it with a daytime visit"),
      p("The show works best as a second visit. See Karnak by daylight first — get your bearings, let your guide walk you through the pharaohs who each added their mark over two thousand years — then return at night to feel it rather than study it. By day you understand Karnak. By night you sense why it mattered."),
    ],
  },
  "alexandria-mediterranean-soul": {
    author: "The Ptah Tours team",
    publishedISO: "2026-04-20",
    readMinutes: 6,
    body: [
      p("Two hours north of Cairo, Egypt changes its mind. The desert light softens into sea haze, the coffee gets stronger, and a salt breeze rolls in off the Mediterranean. Alexandria has always faced outward — to Greece, to Rome, to the wider sea — and it still feels like a different country wearing the same flag."),
      h2("Start at the water"),
      p("The Corniche is the city's living room. Walk it in the late afternoon as the light turns the sea silver and the fishermen bring in their lines, and you'll understand every wistful Alexandrian you've ever met. The curve of the bay toward the citadel is one of the great city walks in Egypt."),
      h2("The library, old and new"),
      p("The ancient Library of Alexandria is long gone, but its modern successor — the Bibliotheca Alexandrina — is a striking building well worth an hour, a deliberate echo of the city's role as a place of learning. It's a reminder that Alexandria's story is about ideas as much as monuments."),
      h2("Down into the catacombs"),
      p("The Catacombs of Kom el-Shoqafa are the city's strangest treasure: a multi-level Roman-era tomb complex spiralling underground, where Egyptian, Greek and Roman styles blur together on the same carved walls. Nowhere else captures Alexandria's mongrel, Mediterranean identity so completely."),
      h2("And the seafood"),
      p("End at the fish market, where you choose your catch and they cook it simply and superbly. Grilled fish, a squeeze of lemon, bread and salads, the sea a few metres away — this is the meal that sends people home determined to return."),
    ],
  },
  "red-sea-reef-etiquette": {
    author: "The Ptah Tours team",
    publishedISO: "2026-05-08",
    readMinutes: 5,
    body: [
      p("The reefs of the Red Sea are among the healthiest and most beautiful in the world — and keeping them that way is partly up to the people who visit them. Good snorkeling isn't just about what you see; it's about how lightly you move through it. Here's how our dive guides do it."),
      h2("Master your buoyancy"),
      p("The single biggest thing you can do for a reef is not touch it. A fin kick that stirs up sand, a steadying hand on the coral — small contacts add up to real damage over thousands of visitors. Stay horizontal, keep your fins up and behind you, and hover rather than stand. If you're new to it, tell your guide; they'll help you find your balance in the shallows first."),
      h2("Never feed the fish"),
      p("It's tempting, and it's harmful. Feeding changes fish behaviour, skews the reef's delicate balance, and habituates animals to people in ways that don't end well for them. On every Ptah boat, the rule is simple: look, don't feed."),
      h2("Sunscreen matters"),
      p("Many common sunscreens contain chemicals that harm coral. We ask everyone to use reef-safe, mineral-based sunscreen — or better still, cover up with a rash guard and let the shirt do the work. What goes on your skin ends up in the water."),
      h2("Where to find quiet water"),
      p("The famous sites are famous for a reason, but they get busy. Near Sharm especially, there are quieter reefs where you'll share the water with almost no one — our guides know them, and how to time a trip so you get the reef closer to yourself. A calmer reef is a better reef, for you and for it."),
    ],
  },
  "slow-nile-felucca-days": {
    author: "The Ptah Tours team",
    publishedISO: "2026-05-24",
    readMinutes: 4,
    body: [
      p("You can see a great deal of Egypt at speed — temple after temple, tomb after tomb, ticking off the wonders. But some of the trip's best hours happen when you stop trying to see anything at all. Chief among them: an afternoon on a felucca."),
      h2("No engine, no schedule"),
      p("A felucca is a traditional wooden sailboat, worked by wind and skill alone. There's no motor to hurry you, no fixed route beyond where the breeze allows. In Aswan, where the Nile is at its most beautiful — islands, granite boulders, white-sailed boats against the desert — this is the way to be on the water."),
      h2("The rhythm of the river"),
      p("Settle onto the cushions, trail a hand in the water, and let the captain do what feluccas have done here for centuries. A thermos of hot, sweet tea appears. Birds work the shallows. The light shifts toward gold. Conversation slows, then stops, and nobody minds."),
      h2("Why we build it in"),
      p("We could fill that afternoon with another site. We choose not to. A slow felucca sail is the counterweight to a busy itinerary — the moment that lets everything you've seen settle, and the memory that surfaces first when people describe their trip months later. Egypt rewards the traveler who occasionally does nothing, beautifully."),
    ],
  },
  "best-time-to-visit-egypt": {
    author: "The Ptah Tours team",
    publishedISO: "2026-09-15",
    readMinutes: 7,
    body: [
      p("There is no single best time to visit Egypt — only the best time for the trip you have in mind. Cool winters suit the temples and tombs; the shoulder months trade a little heat for smaller crowds and better value; and even high summer has its rewards if you plan around the sun. Here is how the year actually feels on the ground."),
      h2("Winter (November to February): the classic season"),
      p("This is peak season, and for good reason. Days are warm and clear, evenings are cool, and walking the open sites at Giza, Luxor and Aswan is genuinely comfortable. The trade-off is company: the famous sites are busiest now, and prices for cruises and hotels are at their highest. Book early, start your sightseeing days at opening time, and the season's one real drawback mostly melts away."),
      h2("Spring and autumn (March, April, October): the sweet spot"),
      p("The shoulder months are our quiet favourite. The weather is still kind, the crowds thin out, and the value improves noticeably. Spring carries one caveat — the khamsin, a hot, dusty wind that can blow up for a day or two between March and May. It passes quickly, and a flexible morning easily works around it. For most travelers, these weeks are the best balance of all."),
      h2("Summer (May to September): hot, cheap and quieter than you think"),
      p("Summer in Upper Egypt is genuinely hot, and we won't pretend otherwise. But it is also the cheapest and least crowded time to travel, and it is very manageable with the right rhythm: sightsee at dawn, rest through the fierce midday hours, and come back out as the day cools. A Nile cruise, with its shaded deck and river breeze, is an especially smart way to see the south in summer."),
      h2("For the Red Sea"),
      p("The coast keeps its own calendar. Hurghada, Sharm el-Sheikh and Marsa Alam are warm and swimmable year-round, with the warmest water from June to October. Winter is pleasant for diving and snorkeling too, just with a wetsuit and the occasional breezy day. If beach time is the point of your trip, almost any month works."),
      h2("So, when should you go?"),
      p("Go in winter for the most comfortable sightseeing weather. Go in the spring or autumn shoulder for the best all-round balance of climate, cost and quiet. Go in summer if budget matters most, or if you are heading for the Red Sea. Whatever you choose, we build the daily pace around the season — and that, more than the calendar, is what makes a trip feel effortless."),
    ],
  },
  "first-time-nile-cruise": {
    author: "The Ptah Tours team",
    publishedISO: "2026-08-28",
    readMinutes: 7,
    body: [
      p("A Nile cruise is the oldest way to see Egypt and still the best. For a few days the river does the travelling for you: temples arrive at the riverbank, the landscape drifts past the deck, and the logistics that make a land trip tiring simply dissolve. If you have never done one, here is what to expect."),
      h2("The daily rhythm"),
      p("Life aboard settles into an easy pattern. Early mornings are for the big sites, before the heat and the crowds; middays are for sailing, lunch and the sun deck; late afternoons bring another temple or a quiet stretch on the water. Meals are generally buffet style and plentiful, evenings are relaxed, and the whole thing asks very little of you beyond turning up and looking out."),
      h2("Which direction, and how long"),
      p("Most cruises run between Luxor and Aswan, and the standard options are three or four nights. Sailing south from Luxor or north from Aswan covers the same great sites — Karnak and the Valley of the Kings at the Luxor end, Edfu and Kom Ombo in the middle, Philae near Aswan — so choose by which city you would rather fly in and out of. Four nights gives everything a little more room to breathe."),
      h2("Cruise ship or dahabiya?"),
      p("The big river ships are comfortable and sociable, with pools, several decks and a few hundred fellow travelers. A dahabiya is the intimate alternative: a small sailing boat with a handful of cabins, no crowds, and a slower, wind-driven pace that feels closer to how the river was always travelled. Ships suit those who like amenities and company; dahabiyas suit those who want quiet and romance. Neither is wrong."),
      h2("Choosing a cabin"),
      p("Spend a little more for a higher deck and a proper window or balcony if you can — the view is the whole point, and you will spend more time watching it than you expect. Cabins are generally compact but well kept; you are not in them much."),
      h2("A few honest tips"),
      p("Pack a light layer for breezy evenings on deck and a good sun hat for the day. Tipping is usually pooled for the crew and handled at the end; ask your guide what is customary. And resist the urge to cram the itinerary — the sailing hours, when nothing is scheduled and the valley slides by, are the ones you will remember most."),
    ],
  },
  "seven-days-in-egypt": {
    author: "The Ptah Tours team",
    publishedISO: "2026-08-10",
    readMinutes: 8,
    body: [
      p("Seven days is the sweet spot for a first trip to Egypt: long enough to see Cairo, Luxor and Aswan properly, short enough to fit a normal amount of leave. The secret to a week that feels full rather than frantic is knowing what to skip. Here is the classic route we run, day by day, and the trade-offs behind it."),
      h2("Days 1–2: Cairo and Giza"),
      p("Land in Cairo and dive straight in. The Pyramids of Giza and the Sphinx are the obvious first morning, ideally paired with the Grand Egyptian Museum, whose galleries now gather the treasures in one extraordinary place. The second day goes to Saqqara's step pyramid and the ruins of Memphis, then into the tangle of Islamic and Coptic Cairo — mosques, churches, the Khan el-Khalili bazaar — for the living city behind the monuments."),
      h2("Day 3: fly south to Luxor"),
      p("A short domestic flight saves a long drive and drops you into the greatest concentration of ancient sites on earth. Ease in with the East Bank: Karnak, vast and layered, and the Luxor Temple, best seen as the afternoon cools and the floodlights come up."),
      h2("Days 4–6: the Nile, Luxor to Aswan"),
      p("These are the heart of the trip, most often aboard a cruise. The Luxor West Bank brings the Valley of the Kings and the terraced temple of Hatshepsut. Sailing south, you stop at Edfu and Kom Ombo, two of the best-preserved temples anywhere, before reaching Aswan for Philae and a slow felucca sail among its islands. The rhythm of temple, river, temple is the essence of Egypt."),
      h2("Day 7: Abu Simbel or an easy finish"),
      p("The keen can add a dawn run to Abu Simbel, Ramses II's colossal rock temples on Lake Nasser — unforgettable, but an early start. The alternative is a gentler Aswan morning and an unhurried journey home. Either way, seven days is a satisfying whole, not a rushed sampler."),
      h2("The trade-offs we make"),
      p("We fly between Cairo and the south rather than drive, we resist tacking on a Red Sea beach stay that would eat two days, and we deliberately build in slow hours — the felucca, a leisurely lunch — so the highlights have space to land. A week done at a human pace beats ten days done in a blur."),
      h2("Want longer?"),
      p("With ten days or two weeks we add Alexandria, more of the Red Sea, or the Western Desert oases. But if a week is what you have, this route makes the very most of it."),
    ],
  },
  "what-to-pack-for-egypt": {
    author: "The Ptah Tours team",
    publishedISO: "2026-07-22",
    readMinutes: 6,
    body: [
      p("Packing for Egypt comes down to three facts: the sun is strong, the sites and mosques ask for a little modesty, and the desert gets surprisingly cold after dark. Get those right and you can travel light. Here is the short list that actually matters, and the things first-timers tend to over-pack."),
      h2("Clothing: light, loose and layered"),
      p("Think breathable cotton and linen in light colours, cut loose to keep you cool and to keep the sun off your skin. Layers matter more than you would guess: mornings on the water and desert evenings can be genuinely chilly, so pack a light sweater or jacket even in summer. The single most useful item most people forget is a large scarf or shawl — sun cover, dust protection, a wrap for cool evenings, and modest cover for mosques, all in one."),
      h2("Dressing for the sites and mosques"),
      p("Egypt is relaxed, but covering shoulders and knees is respectful at temples and expected at mosques, for men and women alike. Women should carry a scarf to cover their hair when entering a mosque. Nobody needs to dress heavily — just aim for modest and breathable rather than skimpy, and you will feel comfortable everywhere."),
      h2("Shoes"),
      p("You will walk far more than you expect, over sand, uneven stone and the odd steep tomb ramp. A pair of closed, broken-in walking shoes is the one thing worth prioritising; sandals are fine for downtime but poor protection among rubble and hot ground."),
      h2("Sun and health kit"),
      p("A wide-brimmed hat, good sunglasses and a high-factor, reef-safe sunscreen are non-negotiable. Bring any personal medicines in their original packaging, a small supply of rehydration salts, and a refillable water bottle — staying hydrated is the best defence against the heat. Hand sanitiser and a few tissues earn their place too."),
      h2("What to leave behind"),
      p("Most people simply pack too much — you will re-wear the same light layers happily. Leave heavy \"just in case\" clothing at home, and leave the drone: flying one in Egypt is tightly restricted and can cause real trouble at the sites. Pack for the trip you are actually taking, not every trip you might imagine."),
    ],
  },
  "beyond-giza-underrated-sites": {
    author: "The Ptah Tours team",
    publishedISO: "2026-07-05",
    readMinutes: 7,
    body: [
      p("The Pyramids of Giza earn their fame, and every first trip should include them. But Egypt's ancient landscape runs far deeper than its three most famous stones, and some of the most rewarding sites are the ones with barely another visitor in sight. Once you have seen the icons, here is where to go next."),
      h2("Saqqara and Dahshur"),
      p("Half an hour south of Giza, Saqqara holds the Step Pyramid of Djoser — the oldest large stone structure in the world and, in a real sense, where pyramid-building began. A little further on at Dahshur stand the Bent Pyramid and the Red Pyramid, the first true smooth-sided pyramid ever completed. Together they tell the story Giza only concludes, and you can often explore them in near solitude."),
      h2("Abydos and Dendera"),
      p("These two temples reward the longer drive north of Luxor. Abydos holds the exquisite carved reliefs of Seti I and the famous King List, a roll-call of pharaohs stretching back into legend. Dendera, dedicated to the goddess Hathor, keeps one of the best-preserved painted ceilings in Egypt — its deep blues and golden stars still vivid overhead. Few day trips pack in this much beauty for so few crowds."),
      h2("Kom Ombo and Edfu"),
      p("Usually seen from a Nile cruise, these two deserve their own mention. Kom Ombo is a rare double temple, dedicated to two gods at once, with a wall of carved surgical instruments that never fails to astonish. Edfu, dedicated to Horus, is the most completely preserved major temple in the country — walk it and you understand what these places looked like when they were whole."),
      h2("The Western Desert"),
      p("For travelers with more time, the oases of the Western Desert — Bahariya, Dakhla, Kharga — and the surreal, wind-carved chalk formations of the White Desert offer an Egypt with almost no one else in it: springs, palm groves, hot desert nights under enormous skies. It is a different journey entirely, and an unforgettable one."),
      h2("Why go beyond the icons"),
      p("The famous sites tell you what ancient Egypt achieved. The quieter ones let you feel it — standing alone in a painted hall, with the guardian and your guide and three thousand years of silence. That is the Egypt people fall for, and it starts just past the edge of the postcard."),
    ],
  },
  "egypt-with-kids-family-guide": {
    author: "The Ptah Tours team",
    publishedISO: "2026-06-18",
    readMinutes: 7,
    body: [
      p("Egypt is one of the great trips to take with children. The history they half-know from cartoons and schoolbooks turns real in front of them — actual mummies, actual pyramids, camels and boats and treasure — and the sense of wonder is contagious. It takes a little planning to do well, and here is what we have learned."),
      h2("It's more kid-friendly than you expect"),
      p("Egyptians adore children, and families are welcomed warmly everywhere, from bustling markets to quiet temples. Children often get more patience and more smiles than adults do. The country's headline sights happen to be exactly the ones that light young imaginations: pyramids to gaze up at, tombs to peer into, a river to sail."),
      h2("Pace and ages"),
      p("The one rule that saves a family trip is to slow down. Two sites a day is plenty; a rushed schedule undoes everyone. School-age children — roughly six and up — tend to get the most from it, old enough to remember the pyramids and follow a story. Younger ones can absolutely come; just build in pool afternoons and downtime, and lower your sightseeing ambitions accordingly."),
      h2("Beating the heat"),
      p("Heat is the real challenge, so work with the day rather than against it: early starts, a long midday break, and plenty of water. A Nile cruise is a brilliant family base — a floating hotel with a pool that carries you between sites, so nobody spends the hottest hours trudging around, and there is always somewhere to cool off."),
      h2("Food and tummies"),
      p("Stick to bottled or filtered water, including for brushing teeth, and favour freshly cooked, busy places over anything that has been sitting out. Bread, rice, grilled meats and fresh fruit keep most children happy. Pack rehydration salts just in case, and ease into the local food rather than diving in on the first night."),
      h2("The trips that work"),
      p("Private, guided travel pays off doubly with a family — a good guide pitches the stories to your children's ages and keeps the day flexible. Fold in the things that turn history into adventure: a camel ride at the pyramids, a felucca sail, the mummy rooms at the museum, a horse-drawn carriage in Luxor. Get the pace right, and Egypt becomes the trip your children talk about for years."),
    ],
  },
};

/** Localized post bodies, keyed by slug. English is the SSOT + fallback. */
const bodyLoaders: Record<Locale, () => Promise<Record<string, BlogPostMeta>>> = {
  en: () => Promise.resolve(POST_BODIES),
  ar: () => import("./localized/blog.ar").then((m) => m.postBodiesAr),
  fr: () => import("./localized/blog.fr").then((m) => m.postBodiesFr),
  de: () => import("./localized/blog.de").then((m) => m.postBodiesDe),
  es: () => import("./localized/blog.es").then((m) => m.postBodiesEs),
  it: () => import("./localized/blog.it").then((m) => m.postBodiesIt),
  ru: () => import("./localized/blog.ru").then((m) => m.postBodiesRu),
};

async function getPostBodies(locale: Locale): Promise<Record<string, BlogPostMeta>> {
  return (bodyLoaders[locale] ?? bodyLoaders.en)();
}

/** All blog posts, newest first, joining localized story metadata with body. */
export async function getAllBlogPosts(locale: Locale = "en"): Promise<BlogPost[]> {
  const [bodies, landing] = await Promise.all([
    getPostBodies(locale),
    getLandingDefaults(locale),
  ]);
  return landing.stories
    .flatMap((s): BlogPost[] => {
      const slug = slugFromHref(s.href);
      const meta = slug ? bodies[slug] : undefined;
      if (!slug || !meta) return [];
      return [
        {
          slug,
          href: s.href,
          title: s.title,
          summary: s.summary,
          image: s.image,
          credit: s.credit,
          ...meta,
        },
      ];
    })
    .sort((a, b) => (a.publishedISO < b.publishedISO ? 1 : -1));
}

/** One post by slug for a locale, or null if it doesn't exist. */
export async function getBlogPost(slug: string, locale: Locale = "en"): Promise<BlogPost | null> {
  return (await getAllBlogPosts(locale)).find((post) => post.slug === slug) ?? null;
}

/** All slugs (for generateStaticParams). Locale-independent — slugs never translate. */
export function blogSlugs(): string[] {
  return stories.map((s) => slugFromHref(s.href)).filter((slug) => slug !== "" && slug in POST_BODIES);
}

/** Format an ISO date (YYYY-MM-DD) for the active locale, e.g. "March 12, 2026". */
export function formatBlogDate(iso: string, locale: Locale = "en"): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat(localeHtmlLang[locale], {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}
