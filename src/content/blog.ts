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
};

/** All blog posts, newest first, joining story metadata with body. */
export function getAllBlogPosts(): BlogPost[] {
  return stories
    .flatMap((s): BlogPost[] => {
      const slug = slugFromHref(s.href);
      const meta = slug ? POST_BODIES[slug] : undefined;
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

/** One post by slug, or null if it doesn't exist. */
export function getBlogPost(slug: string): BlogPost | null {
  return getAllBlogPosts().find((post) => post.slug === slug) ?? null;
}

/** All slugs (for generateStaticParams). */
export function blogSlugs(): string[] {
  return getAllBlogPosts().map((post) => post.slug);
}

/** Format an ISO date (YYYY-MM-DD) as e.g. "March 12, 2026". */
export function formatBlogDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}
