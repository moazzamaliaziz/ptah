/**
 * German (de) chrome dictionary (Phase 3 i18n) — machine-translated.
 * Mirrors `en.ts` by index: identical keys, nesting and array lengths;
 * only the string values are translated (formal "Sie" register).
 */
import type { Dictionary } from "./en";

export const de = {
  common: {
    /** Appended to the brand mark aria-label: `${siteName} — home`. */
    home: "Startseite",
    openInNewTab: "wird in einem neuen Tab geöffnet",
  },
  skip: {
    toContent: "Zum Hauptinhalt springen",
  },
  header: {
    quickLinksAria: "Schnellzugriff",
    primaryAria: "Hauptnavigation",
    mobileNavAria: "Website (mobil)",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    trackBooking: "Ihre Buchung verfolgen",
    viewBookmarks: "Ihre Lesezeichen ansehen",
  },
  search: {
    triggerAria: "Suche",
    dialogAria: "Ptah Tours durchsuchen",
    closeAria: "Suche schließen",
    inputAria: "Reisen, Reiseziele und Geschichten durchsuchen",
    placeholder: "Pyramiden, Nilkreuzfahrt, Alexandria…",
    popular: "Beliebte Suchanfragen",
  },
  bookmarks: {
    title: "Ihre Lesezeichen ansehen",
    /** Exactly one bookmark. */
    one: "Sie haben 1 Lesezeichen",
    /** Zero or many — `{count}` is replaced with the number. */
    other: "Sie haben {count} Lesezeichen",
  },
  nav: {
    /** Quick-links bar, in order: Events, When to Visit, eVisa, My Account. */
    quickLinks: ["Veranstaltungen & Festivals", "Beste Reisezeit", "eVisa buchen", "Mein Konto"],
    /** Direct nav links, in order: Destinations, Trip Ideas. */
    directLinks: ["Reiseziele", "Reiseideen", "Galerie"],
    buildTrip: "Meine Reise planen",
    popularSearches: [
      "Pyramiden von Gizeh",
      "Nilkreuzfahrt",
      "Heißluftballon in Luxor",
      "Schnorcheln in Ras Mohammed",
      "Private Kairo-Tour",
      "Weihnachten in Ägypten",
    ],
    /** Mega-menu sections, in order: About Egypt, Plan Your Trip, Tours. */
    sections: [
      {
        title: "Über Ägypten",
        columns: [
          { heading: "Reiseziele", links: ["Luxor", "Assuan", "Kairo", "Alexandria", "Hurghada", "Sharm El Sheikh"] },
          { heading: "Land kennenlernen", links: ["Geschichte & Kulturerbe", "Jahreszeiten & Klima", "Der Nil", "Wüsten & Oasen", "Riffe im Roten Meer"] },
          { heading: "Gut zu wissen", links: ["Verantwortungsvolles Reisen", "Barrierefreiheit", "Sicherheit & Unterstützung", "Geschichten & Journal"] },
        ],
        imageCtas: [
          { label: "Reiseziel im Detail", heading: "Das antike Theben" },
          { label: "Küsten", heading: "Das Rote Meer entdecken" },
          { label: "Vor Ort", heading: "Das Journal lesen" },
        ],
      },
      {
        title: "Reise planen",
        columns: [
          { heading: "Anreise", links: ["Flüge nach Ägypten", "Visa & Einreise", "Ankunftstage, organisiert", "Fortbewegung vor Ort"] },
          { heading: "Unser Versprechen", links: ["So funktionieren Ptah-Reisen", "Verantwortungsvolles Reisen", "Bewertungen & Akkreditierung", "Team kontaktieren"] },
        ],
        imageCtas: [
          { label: "Kostenlose Beratung", heading: "Sprechen Sie mit einem Ägyptologen" },
          { label: "Stöbern", heading: "Alle Ptah Tours" },
          { label: "Inspiration", heading: "Reiseideen entdecken" },
        ],
      },
      {
        title: "Touren",
        columns: [
          { heading: "Luxor-Touren", links: ["Alle Luxor-Touren", "Tempel & Gräber", "Nilkreuzfahrten ab Luxor", "Luxor entdecken"] },
          { heading: "Assuan-Touren", links: ["Alle Assuan-Touren", "Abu Simbel & Philae", "Nilkreuzfahrten ab Assuan", "Assuan entdecken"] },
          { heading: "Nach Stil", links: ["Klassisches Ägypten", "Nilkreuzfahrten", "Rotes Meer & Strand", "Wüstenabenteuer"] },
        ],
        imageCtas: [
          { label: "Westufer", heading: "Luxor, Tempel und Gräber" },
          { label: "Auf dem Fluss", heading: "Nilkreuzfahrt-Kollektion" },
          { label: "Flussaufwärts", heading: "Assuan & Abu Simbel" },
        ],
      },
    ],
  },
  footer: {
    newsletterAria: "In Verbindung bleiben",
    columnsAria: "Fußzeile",
    /** Social row aria — `{siteName}` is replaced with the site name. */
    followAria: "{siteName} folgen",
    newsletter: {
      heading: "Jetzt anmelden!",
      blurb: "Reiseideen, saisonale Abfahrten und gelegentlich Neuigkeiten aus der Wüste — ein paar Mal im Monat, niemals Spam.",
      ctaLabel: "Für unseren E-Newsletter anmelden",
    },
    /** Footer link columns, in order: (brand), Travel With Us, Help & Info. */
    columns: [
      { heading: "Ptah Tours", links: ["Über uns", "Unsere Ägyptologen", "Karriere", "Presse & Medien", "Kontakt"] },
      { heading: "Mit uns reisen", links: ["Alle Touren", "Reiseideen", "Nilkreuzfahrten", "Private Reisen", "Verantwortungsvolles Reisen", "Fotogalerie"] },
      { heading: "Hilfe & Infos", links: ["Beste Reisezeit", "Visa & Einreise", "Meine Buchung verfolgen", "Gesundheit & Sicherheit", "Häufige Fragen"] },
    ],
    badgeHeading: "Empfohlen von",
    /** Badge sub-labels, in order: ETF, Travelife (badge names stay as-is). */
    badgeSubs: ["Mitglied 2026", "Partner"],
    partnersHeading: "Reisepartner",
    /** Partner taglines, in order: Egypt Air, IATA, Visit Egypt (names stay). */
    partnerTaglines: ["Offizieller Airline-Partner", "Akkreditierter Agent", "Ägyptische Tourismusbehörde"],
    /** Legal links, in order: Privacy, Terms, Cookie Policy. */
    legalLinks: ["Datenschutzerklärung", "Allgemeine Geschäftsbedingungen", "Cookie-Richtlinie"],
    /** Keep `{year}` and the brand "Ptah Tours" verbatim. */
    copyrightLine: "© {year} Ptah Tours. Alle Rechte vorbehalten.",
    acknowledgement:
      "Ptah Tours hat seinen Hauptsitz in Kairo und ist in ganz Ägypten tätig — im Niltal, im Delta, auf dem Sinai und in der Westwüste. Wir reisen mit lizenzierten Ägyptologen, entlohnen unsere Teams fair und planen jede Reiseroute so, dass sie den Gemeinden und Kulturerbestätten Ägyptens mehr gibt, als sie ihnen nimmt.",
  },
  cookie: {
    regionAria: "Cookie-Einwilligung",
    heading: "Wir schätzen Ihre Privatsphäre",
    copy: "Wir verwenden Cookies, um Ihr Surferlebnis zu verbessern, personalisierte Inhalte bereitzustellen und unseren Datenverkehr zu analysieren. Indem Sie auf „Alle akzeptieren“ klicken, stimmen Sie unserer Verwendung von Cookies zu. Sie können Ihre Meinung jederzeit über die Fußzeile ändern.",
    manageHeading: "Verwalten Sie Ihre Cookie-Einstellungen",
    acceptAll: "Alle akzeptieren",
    manage: "Verwalten",
    rejectAll: "Alle ablehnen",
    saveChoices: "Meine Auswahl speichern",
    necessaryName: "Unbedingt erforderlich",
    necessaryDesc: "Erforderlich für Sicherheit, Einwilligungsspeicherung und zentrale Buchungsabläufe. Immer aktiv.",
    /** Categories, in order: preferences, analytics, marketing. */
    categories: [
      { name: "Präferenzen", description: "Speichert Auswahl wie Sprache, Währung und Ihre gemerkten Reisen." },
      { name: "Analyse", description: "Anonyme Statistiken, die uns helfen zu verstehen, welche Reisen und Seiten bei Reisenden beliebt sind." },
      { name: "Marketing", description: "Misst unsere Kampagnen und zeigt anderswo relevantere Inhalte von Ptah Tours." },
    ],
    /** Footer trigger: long prefix ("Manage Your ") hidden on narrow screens. */
    manageButtonLong: "Verwalten Sie Ihre ",
    manageButtonShort: "Cookies",
  },
} satisfies Dictionary;
