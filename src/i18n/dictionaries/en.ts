/**
 * English chrome dictionary (Phase 3 i18n) — the SOURCE dictionary and shape
 * SSOT for the localized global chrome: header, footer, search dialog,
 * bookmark pill, cookie consent and the skip link.
 *
 * Scope: UI CHROME strings only. Page bodies and DB-driven catalog content
 * (tours, destinations, events, homepage sections via getLandingContent) are
 * the separate DB translation layer, not this file.
 *
 * Structure (hrefs, icon keys, image src/alt, brand/proper nouns, social
 * networks) stays single-sourced in `@/content/landing`. The builders in
 * `@/i18n/chrome` zip these strings onto that structure by index, falling
 * back to English per item — so a short/edited translation degrades to
 * English rather than breaking a render.
 *
 * TRANSLATOR NOTES for ar/fr/de/es/it (each `satisfies Dictionary`):
 *  - Keep every key and every array length identical to this file.
 *  - Do NOT translate the placeholders `{count}`, `{year}`, `{siteName}` — keep
 *    them verbatim in the translated string.
 *  - Keep the brand name "Ptah Tours" and proper nouns (city names may use the
 *    standard localized exonym). Arabic (ar) renders right-to-left.
 */
export const en = {
  common: {
    /** Appended to the brand mark aria-label: `${siteName} — home`. */
    home: "home",
    openInNewTab: "opens in a new tab",
  },
  skip: {
    toContent: "Skip to main content",
  },
  header: {
    quickLinksAria: "Quick links",
    primaryAria: "Primary",
    mobileNavAria: "Site (mobile)",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    trackBooking: "Track your booking",
    viewBookmarks: "View your bookmarks",
  },
  search: {
    triggerAria: "Search",
    dialogAria: "Search Ptah Tours",
    closeAria: "Close search",
    inputAria: "Search trips, destinations and stories",
    placeholder: "Pyramids, Nile cruise, Alexandria…",
    popular: "Popular searches",
  },
  bookmarks: {
    title: "View your Bookmarks",
    /** Exactly one bookmark. */
    one: "You have 1 bookmark",
    /** Zero or many — `{count}` is replaced with the number. */
    other: "You have {count} bookmarks",
  },
  nav: {
    /** Quick-links bar, in order: Events, When to Visit, eVisa, My Account. */
    quickLinks: ["Events & Festivals", "When to Visit", "Book Your eVisa", "My Account"],
    /** Direct nav links, in order: Destinations, Trip Ideas, Gallery. */
    directLinks: ["Destinations", "Trip Ideas", "Gallery"],
    buildTrip: "Plan My Trip",
    popularSearches: [
      "Pyramids of Giza",
      "Nile Cruise",
      "Luxor Hot Air Balloon",
      "Ras Mohammed Snorkeling",
      "Private Cairo Tour",
      "Christmas in Egypt",
    ],
    /** Mega-menu sections, in order: About Egypt, Plan Your Trip, Tours, Journal. */
    sections: [
      {
        title: "About Egypt",
        columns: [
          { heading: "Destinations", links: ["Cairo", "Luxor", "Aswan", "Alexandria", "Hurghada", "Sharm El Sheikh"] },
          { heading: "Know the Land", links: ["History & Heritage", "Seasons & Climate", "The Nile", "Deserts & Oases", "Red Sea Reefs"] },
          { heading: "Good to Know", links: ["Responsible Travel", "Accessibility", "Safety & Support", "Stories & Journal"] },
        ],
        imageCtas: [
          { label: "Destination Deep-Dive", heading: "Ancient Thebes" },
          { label: "Coastlines", heading: "Meet the Red Sea" },
          { label: "From the Field", heading: "Read the Journal" },
        ],
      },
      {
        title: "Plan Your Trip",
        columns: [
          { heading: "Getting There", links: ["Flights to Egypt", "Visas & Entry", "Arrival Days, Handled", "Getting Around"] },
          { heading: "Deciding", links: ["When to Visit", "How Many Days", "Budget & Tipping", "Traveling with Kids"] },
          { heading: "Our Promise", links: ["How Ptah Trips Work", "Responsible Travel", "Reviews & Accreditation", "Contact the Team"] },
        ],
        imageCtas: [
          { label: "Free Consultation", heading: "Talk to an Egyptologist" },
          { label: "Browse", heading: "All Ptah Tours" },
          { label: "Inspiration", heading: "Get Trip Ideas" },
        ],
      },
      {
        title: "Tours",
        columns: [
          { heading: "By Style", links: ["Classic Egypt", "Nile Cruises", "Red Sea & Beach", "Desert Adventures"] },
          { heading: "By Length", links: ["Day Tours", "2–4 Day Trips", "5–9 Day Journeys", "10+ Day Expeditions"] },
          { heading: "Special", links: ["Private & Tailor-Made", "Family Trips", "Honeymoons", "Last-Minute Departures"] },
        ],
        imageCtas: [
          { label: "Signature Journey", heading: "Classic Egypt, 8 Days" },
          { label: "On the River", heading: "Nile Cruise Collection" },
          { label: "Under the Water", heading: "Dive & Snorkel Trips" },
        ],
      },
      {
        title: "Journal",
        columns: [
          { heading: "Start Here", links: ["Best Time to Visit", "First Nile Cruise", "7-Day Itinerary", "What to Pack"] },
          { heading: "Places & Stories", links: ["Cairo Beyond the Guidebook", "Alexandria's Soul", "Beyond Giza", "An Evening at Karnak"] },
          { heading: "Travel Smart", links: ["Egypt with Kids", "Red Sea Reef Etiquette", "Slow Nile Felucca Days", "All Journal Posts"] },
        ],
        imageCtas: [
          { label: "Trip Planning", heading: "When to Visit Egypt" },
          { label: "On the River", heading: "A First Nile Cruise" },
          { label: "With the Family", heading: "Egypt with Kids" },
        ],
      },
    ],
  },
  footer: {
    newsletterAria: "Stay Connected",
    columnsAria: "Footer",
    /** Social row aria — `{siteName}` is replaced with the site name. */
    followAria: "Follow {siteName}",
    newsletter: {
      heading: "Sign Up!",
      blurb: "Trip ideas, seasonal departures and the occasional desert dispatch — a few times a month, never spammy.",
      ctaLabel: "Sign up for our E-Newsletter",
    },
    /** Footer link columns, in order: (brand), Travel With Us, Help & Info. */
    columns: [
      { heading: "Ptah Tours", links: ["About Us", "Our Egyptologists", "Careers", "Press & Media", "Contact Us"] },
      { heading: "Travel With Us", links: ["All Tours", "Trip Ideas", "Nile Cruises", "Private Journeys", "Responsible Travel", "Photo Gallery"] },
      { heading: "Help & Info", links: ["When to Visit", "Visas & Entry", "Track My Booking", "Health & Safety", "FAQs"] },
    ],
    badgeHeading: "Endorsed By",
    /** Badge sub-labels, in order: ETF, Travelife (badge names stay as-is). */
    badgeSubs: ["Member 2026", "Partner"],
    partnersHeading: "Travel Partners",
    /** Partner taglines, in order: Egypt Air, IATA, Visit Egypt (names stay). */
    partnerTaglines: ["Official carrier partner", "Accredited agent", "Egyptian Tourism Authority"],
    /** Legal links, in order: Privacy, Terms, Cookie Policy. */
    legalLinks: ["Privacy Policy", "Terms & Conditions", "Cookie Policy"],
    /** Keep `{year}` and the brand "Ptah Tours" verbatim. */
    copyrightLine: "© {year} Ptah Tours. All rights reserved.",
    acknowledgement:
      "Ptah Tours is headquartered in Cairo and works across Egypt — the Nile Valley, the Delta, Sinai and the Western Desert. We travel with licensed Egyptologists, pay our crews fairly, and plan every itinerary to give more to Egypt's communities and heritage sites than it takes.",
  },
  cookie: {
    regionAria: "Cookie consent",
    heading: "We value your privacy",
    copy: "We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking Accept All, you consent to our use of cookies. You can change your mind at any time from the footer.",
    manageHeading: "Manage your cookie preferences",
    acceptAll: "Accept All",
    manage: "Manage",
    rejectAll: "Reject All",
    saveChoices: "Save My Choices",
    necessaryName: "Strictly Necessary",
    necessaryDesc: "Required for security, consent storage and core booking flows. Always on.",
    /** Categories, in order: preferences, analytics, marketing. */
    categories: [
      { name: "Preferences", description: "Remember choices like language, currency and your bookmarked trips." },
      { name: "Analytics", description: "Anonymous statistics that help us understand which trips and pages travelers love." },
      { name: "Marketing", description: "Measure our campaigns and show more relevant Ptah Tours content elsewhere." },
    ],
    /** Footer trigger: long prefix ("Manage Your ") hidden on narrow screens. */
    manageButtonLong: "Manage Your ",
    manageButtonShort: "Cookies",
  },
} ;

export type Dictionary = typeof en;
