/**
 * German (de) editorial translation of src/content/landing.ts.
 * Staging only — mirrors every exported const with a `De` suffix; keys, nesting
 * and array order 1:1. Only human-readable string VALUES are translated. All
 * src/href/iconKey/network/credit/buttonType/trackingContext/xPct/yPct/days/
 * experiences/wideAt/cookie-keys and brand tokens (name, legalName, partner and
 * badge names) kept verbatim. {year} token preserved.
 */
import type {
  HeroSlide,
  InspiredTab,
  PlanCtaBlock,
  FiftyCta,
  KbygItem,
  TourType,
  Story,
  SiteNav,
  FooterContent,
} from "@/content/landing";

const A = "/assets" as const;

export const siteMetaDe: { name: string; legalName: string; tagline: string } = {
  name: "Ptah Tours",
  legalName: "Ptah Tours for Tourism LLC",
  tagline: "Ägypten, kuratiert von den Menschen, die es ihre Heimat nennen",
};

export const heroSlidesDe: HeroSlide[] = [
  {
    id: "giza",
    season: "summer",
    title: "Wandeln Sie zwischen dem letzten Weltwunder der Antike",
    shortLabel: "die Pyramiden von Gizeh",
    subtitle: "Private, von Ägyptologen geführte Vormittage in Gizeh, bevor die Menschenmengen eintreffen.",
    image: {
      src: `${A}/hero/hero-giza-portrait.webp`,
      mid: `${A}/hero/hero-giza.webp`,
      alt: "Die Große Pyramide des Cheops und der Sphinx von Gizeh im warmen Morgenlicht, dahinter das Plateau von Kairo.",
      credit: "Ptah Tours field archive",
    },
    hotspots: [
      { xPct: 30, yPct: 44, label: "Große Pyramide des Cheops", href: "/trip-ideas/panorama-of-the-pyramids" },
      { xPct: 62, yPct: 70, label: "Der Große Sphinx", href: "/trip-ideas/panorama-of-the-pyramids" },
    ],
  },
  {
    id: "thebes",
    season: "summer",
    title: "Gleiten Sie im ersten Licht über die Gräber von Theben",
    shortLabel: "Ballonfahrt über Luxor",
    subtitle: "Ballons bei Sonnenaufgang, das Tal der Könige und Karnak vor der Hitze.",
    image: {
      src: `${A}/hero/hero-thebes-portrait.webp`,
      mid: `${A}/hero/hero-thebes.webp`,
      alt: "Ein Heißluftballon, der bei Sonnenaufgang über das Westufer von Luxor gleitet, darunter der grüne Uferstreifen des Nils.",
      credit: "Ptah Tours field archive",
    },
    hotspots: [
      { xPct: 26, yPct: 38, label: "Heißluftballons im Morgengrauen", href: "/trip-ideas/luxor-sunrise-weekend" },
      { xPct: 68, yPct: 62, label: "Tal der Könige", href: "/trip-ideas/kings-and-queens-of-thebes" },
    ],
  },
  {
    id: "blue-hole",
    season: "summer",
    title: "Tauchen Sie ins Blau: Sinais lebendiges Riff",
    shortLabel: "die Küste des Blue Hole",
    subtitle: "Schnorcheln Sie am Blue Hole, in Ras Abu Galum und Ras Mohammed mit lizenzierten Tauchguides.",
    image: {
      src: `${A}/hero/hero-blue-hole-portrait.webp`,
      mid: `${A}/hero/hero-blue-hole.webp`,
      alt: "Der tiefblaue Kreis des Blue Hole von Dahab aus der Vogelperspektive, umringt von hellem Riffsaum und den Bergen des Sinai.",
      credit: "Ptah Tours field archive",
    },
    hotspots: [
      { xPct: 40, yPct: 46, label: "Die Doline des Blue Hole", href: "/trip-ideas/blue-hole-sinai" },
      { xPct: 66, yPct: 30, label: "Küste von Ras Abu Galum", href: "/trip-ideas/blue-hole-sinai" },
    ],
  },
];

export const inspiredTabsDe: InspiredTab[] = [
  {
    key: "itineraries",
    label: "Reiserouten",
    cards: [
      {
        title: "Panorama der Pyramiden",
        href: "/trip-ideas/panorama-of-the-pyramids",
        days: 2,
        experiences: 6,
        image: { src: `${A}/itineraries/giza-essentials.webp`, alt: "Ein Kamel, das vor der Großen Pyramide des Cheops über das Gizeh-Plateau zieht." },
      },
      {
        title: "Kulturwochenende in Kairo",
        href: "/trip-ideas/cairo-heritage-weekend",
        days: 3,
        experiences: 9,
        image: { src: `${A}/itineraries/cairo-heritage.webp`, alt: "Vitrinen und vergoldete Artefakte im Ägyptischen Museum in Kairo." },
      },
      {
        title: "Karnak bei Tag, Luxor-Tempel bei Nacht",
        href: "/trip-ideas/karnak-luxor-evening",
        days: 2,
        experiences: 7,
        image: { src: `${A}/itineraries/karnak-evening.webp`, alt: "Flutlichtbeleuchtete Säulen des Luxor-Tempels in der Dämmerung, bernsteinfarben leuchtend vor tiefblauem Himmel." },
      },
      {
        title: "Könige & Königinnen von Theben",
        href: "/trip-ideas/kings-and-queens-of-thebes",
        days: 3,
        experiences: 8,
        image: { src: `${A}/itineraries/valley-of-kings.webp`, alt: "Goldene Felswände, die zu den Gräbern des Tals der Könige abfallen." },
      },
      {
        title: "Insel Philae & der Hochdamm",
        href: "/trip-ideas/philae-island-aswan",
        days: 2,
        experiences: 5,
        image: { src: `${A}/itineraries/philae-island.webp`, alt: "Der Inseltempel von Philae, per Boot über ruhiges blaues Wasser erreicht." },
      },
      {
        title: "Das nubische Dorf per Feluke",
        href: "/trip-ideas/nubian-village-aswan",
        days: 2,
        experiences: 6,
        image: { src: `${A}/itineraries/nubian-village.webp`, alt: "Ein bemaltes nubisches Dorfhaus in leuchtendem Ocker und Blau über dem Nil." },
      },
      {
        title: "Alexandria an einem Wochenende",
        href: "/trip-ideas/alexandria-weekend",
        days: 2,
        experiences: 7,
        image: { src: `${A}/itineraries/alexandria-classics.webp`, alt: "Das geschwungene Dach der modernen Bibliotheca Alexandrina mit Blick aufs Mittelmeer." },
      },
      {
        title: "Sinai-Gipfel & Katharinenkloster",
        href: "/trip-ideas/sinai-summit-st-catherines",
        days: 2,
        experiences: 4,
        image: { src: `${A}/itineraries/sinai-summit.webp`, alt: "Wanderer auf dem Kamelpfad hinauf zum Berg Sinai unter dem Himmel vor Tagesanbruch." },
      },
    ],
  },
  {
    key: "adventure",
    label: "Abenteuer",
    cards: [
      {
        title: "Schnorcheln am Blue Hole",
        href: "/trip-ideas/blue-hole-sinai",
        image: { src: `${A}/activities/blue-hole-dive.webp`, alt: "Ein Schnorchler, der über dem Korallensaum am Rand des Blue Hole schwebt." },
      },
      {
        title: "Wanderung durch den Colored Canyon",
        href: "/trip-ideas/colored-canyon-sinai",
        image: { src: `${A}/activities/colored-canyon.webp`, alt: "Bänder aus rotem, goldenem und cremefarbenem Gestein, die sich durch die Schlucht des Colored Canyon ziehen." },
      },
      {
        title: "Quad-Safari bei Sonnenuntergang",
        href: "/trip-ideas/desert-safari-quad-sunset",
        image: { src: `${A}/activities/desert-safari.webp`, alt: "Quads, die bei Sonnenuntergang Staubfahnen über eine orangefarbene Wüstenebene aufwirbeln." },
      },
      {
        title: "Bootstag am Roten Meer",
        href: "/trip-ideas/red-sea-boat-snorkeling",
        image: { src: `${A}/activities/boat-snorkeling.webp`, alt: "Ein weißes Tauchboot, das über türkisfarbenem Riffwasser im Roten Meer ankert." },
      },
    ],
  },
  {
    key: "culture",
    label: "Kultur",
    cards: [
      {
        title: "Das Ägyptische Museum, mit Führung",
        href: "/trip-ideas/egyptian-museum-guided",
        image: { src: `${A}/activities/museum-tahrir.webp`, alt: "Behauene Steinstatuen und Sarkophage in den Sälen des Ägyptischen Museums." },
      },
      {
        title: "Khan el-Khalili nach Einbruch der Dunkelheit",
        href: "/trip-ideas/khan-el-khalili-night",
        image: { src: `${A}/activities/khan-el-khalili.webp`, alt: "Leuchtende Laternenstände im Basar Khan el-Khalili bei Nacht." },
      },
      {
        title: "Tee bei einer nubischen Familie",
        href: "/trip-ideas/nubian-village-aswan",
        image: { src: `${A}/activities/nubian-culture.webp`, alt: "Ein bemalter nubischer Innenhof, in dem sich eine Familie zum Tee versammelt." },
      },
      {
        title: "Bibliotheca Alexandrina & Qaitbay",
        href: "/trip-ideas/alexandria-weekend",
        image: { src: `${A}/activities/bibliotheca.webp`, alt: "Die schräge Granitfassade der Bibliotheca Alexandrina, die das Sonnenlicht einfängt." },
      },
    ],
  },
  {
    key: "river-sea",
    label: "Fluss & Meer",
    cards: [
      {
        title: "Feluke rund um Philae",
        href: "/trip-ideas/philae-island-aswan",
        image: { src: `${A}/activities/philae-felucca.webp`, alt: "Eine weiß besegelte Feluke, die über den Nil auf den Philae-Tempel zugleitet." },
      },
      {
        title: "Bootstag in Ras Mohammed",
        href: "/trip-ideas/ras-mohammed-park",
        image: { src: `${A}/activities/ras-mohammed.webp`, alt: "Klare türkisfarbene Untiefen und Riff, von einem Boot aus in Ras Mohammed sichtbar." },
      },
      {
        title: "Feluke bei Sonnenuntergang, Luxor",
        href: "/trip-ideas/luxor-sunrise-weekend",
        image: { src: `${A}/activities/nile-sunset-felucca.webp`, alt: "Ein Felukensegel, das über dem Nil bei Luxor das letzte orangefarbene Licht einfängt." },
      },
      {
        title: "Schnorcheln an den Hausriffen",
        href: "/trip-ideas/red-sea-boat-snorkeling",
        image: { src: `${A}/activities/red-sea-boat.webp`, alt: "Schnorchler, die über Korallengärten entlang der Küste des Roten Meeres treiben." },
      },
    ],
  },
  {
    key: "heritage",
    label: "Kulturerbe",
    cards: [
      {
        title: "Die Große Säulenhalle",
        href: "/trip-ideas/karnak-luxor-evening",
        image: { src: `${A}/activities/karnak-hypostyle.webp`, alt: "Gewaltige Papyrusknospensäulen, die sich in der Säulenhalle von Karnak drängen." },
      },
      {
        title: "Im Tal der Könige",
        href: "/trip-ideas/kings-and-queens-of-thebes",
        image: { src: `${A}/activities/valley-heritage.webp`, alt: "Bemalte Wände eines Grabkorridors, die im Tal der Könige unter konservatorischer Beleuchtung leuchten." },
      },
      {
        title: "Philae: Tempel der Isis",
        href: "/trip-ideas/philae-island-aswan",
        image: { src: `${A}/activities/philae-temple.webp`, alt: "Das reliefverzierte Tor des Philae-Tempels, der Göttin Isis geweiht." },
      },
      {
        title: "Wächter von Gizeh",
        href: "/trip-ideas/panorama-of-the-pyramids",
        image: { src: `${A}/activities/sphinx-guardians.webp`, alt: "Der Sphinx, der an der Kamera vorbeiblickt, dahinter die Pyramide des Chephren." },
      },
    ],
  },
];

export const planCtaDe: PlanCtaBlock = {
  title: "Planen Sie Ihre Traumreise",
  copy: "Sagen Sie unserem Studio in Kairo, wovon Sie träumen – Pyramiden im Morgengrauen, ein gemächlicher Nilabschnitt zwischen Tempeln, eine Woche am Riff – und ein persönlicher Reisedesigner gestaltet die Reise gemeinsam mit Ihnen, Nachricht für Nachricht.",
  image: {
    src: `${A}/cta/plan-nile-portrait.webp`,
    mid: `${A}/cta/plan-karnak-landscape.webp`,
    wide: `${A}/cta/plan-karnak-landscape.webp`,
    wideAt: 1440,
    alt: "Eine Feluke, die auf dem Nil bei Assuan an Palmen vorbeisegelt, während Granitfelsen den Ersten Katarakt markieren.",
  },
  credit: "Ptah Tours field archive — Aswan",
  cta: {
    type: "customButton",
    button: { buttonType: "buildATrip", trackingContext: "HomePageFullPageCTA", href: "/manage/trip-builder" },
    label: "Jetzt planen",
  },
};
export const fiftyCtasDe: [FiftyCta, FiftyCta] = [
  {
    title: "Ganz auf Sie zugeschnitten",
    copy: "Jede Ptah-Reise ist privat und maßgeschneidert – Ihr Guide, Ihr Tempo, Ihre Route. Nichts von der Stange.",
    cta: { label: "Meine Reise gestalten", href: "/contact" },
    image: {
      src: `${A}/cta/fifty-bespoke-journeys.webp`,
      mid: `${A}/cta/fifty-bespoke-journeys.webp`,
      wide: `${A}/cta/fifty-bespoke-journeys.webp`,
      wideAt: 1128,
      alt: "Ein Blick nach oben durch die Säulen des Luxor-Tempels zu einem hellen Himmel.",
    },
  },
  {
    title: "Segeln Sie stilvoll über den Nil",
    copy: "Kreuzfahrten von vier bis sieben Nächten zwischen Luxor und Assuan, mit Kabinen, die wir persönlich in Augenschein genommen haben.",
    cta: { label: "Den Nil entdecken", href: "/the-nile" },
    image: {
      src: `${A}/cta/fifty-nile-cruise.webp`,
      mid: `${A}/cta/fifty-nile-cruise.webp`,
      wide: `${A}/cta/fifty-nile-cruise.webp`,
      wideAt: 1128,
      alt: "Ein Nilkreuzfahrtschiff, das zur goldenen Stunde am Westufer bei Assuan vertäut liegt.",
    },
  },
];

export const kbygItemsDe: [KbygItem, KbygItem, KbygItem, KbygItem] = [
  {
    iconKey: "weather",
    title: "Beste Reisezeit",
    copy: "Oktober bis April ist Tempelsaison; das Rote Meer glänzt das ganze Jahr. Wir stimmen Ihre Reisedaten auf die passende Region ab.",
    cta: { label: "Die Jahreszeiten ansehen", href: "/when-to-visit" },
  },
  {
    iconKey: "ticket",
    title: "Einreise & Visa",
    copy: "Die meisten Nationalitäten erhalten ein e-Visum in wenigen Minuten online. Jedem Gast senden wir eine Schritt-für-Schritt-Anleitung für die Ankunft.",
    cta: { label: "Voraussetzungen prüfen", href: "/visa" },
  },
  {
    iconKey: "travel",
    title: "Fortbewegung vor Ort",
    copy: "Standardmäßig private Fahrer, erste Klasse per Bahn und Inlandsflüge für die langen Etappen, Feluken für die schönen Abschnitte.",
    cta: { label: "Wie wir reisen", href: "/getting-around" },
  },
  {
    iconKey: "info",
    title: "Sprechen Sie mit einem Menschen",
    copy: "Nil-Kenner, kein Callcenter. WhatsApp, Telefon oder E-Mail – Sie erreichen das Team, das die Reise plant.",
    cta: { label: "Kontakt", href: "/contact" },
  },
];
export const tourTypesDe: [TourType, TourType, TourType, TourType] = [
  {
    title: "Klassisches Ägypten",
    blurb: "Pyramiden, die Tempel von Luxor und die großen Museen – die wesentliche Runde, richtig gemacht.",
    href: "/tours?type=classic",
    image: { src: `${A}/tour-types/classic-egypt.webp`, alt: "Die Pylone des Philae-Tempels, die sich an einem stillen Morgen in Assuan im Nil spiegeln." },
  },
  {
    title: "Nilkreuzfahrten",
    blurb: "Schlafen Sie auf dem Fluss: Decks von Luxor nach Assuan, private Anlegestellen und Tempelstopps unterwegs.",
    href: "/tours?type=nile-cruise",
    image: { src: `${A}/tour-types/nile-cruise.webp`, alt: "Heißluftballons, die bei Sonnenaufgang über dem Niltal westlich von Luxor aufsteigen." },
  },
  {
    title: "Rotes Meer & Strand",
    blurb: "Hurghada, Sharm und Dahab – Rifftage, Bootsausflüge und echte Erholung.",
    href: "/tours?type=red-sea",
    image: { src: `${A}/tour-types/red-sea-escape.webp`, alt: "Die Sonne, die über dem Roten Meer untergeht, mit der Silhouette einer Dahabiya vor der Küste." },
  },
  {
    title: "Wüstenabenteuer",
    blurb: "Camps in der Weißen Wüste, Sinai-Gipfel, Fahrten zu den Oasen – Ägypten jenseits des Flussufers.",
    href: "/tours?type=desert",
    image: { src: `${A}/tour-types/desert-adventure.webp`, alt: "Eine Geländewagenspur, die sich in der Dämmerung durch orangefarbene Dünen zu einem Wüstencamp windet." },
  },
];

export const storiesDe: Story[] = [
  {
    title: "Kairo jenseits des Reiseführers",
    summary: "Wo die Kairoer wirklich Koshari essen, die Moschee mit Kairos schönstem Sonnenuntergang und warum die hinteren Säle des Ägyptischen Museums den berühmten Saal übertreffen – fünf Tage zu Fuß durch die Hauptstadt mit unserem Team vor Ort.",
    href: "/blog/cairo-beyond-the-guidebook",
    image: {
      src: `${A}/stories/cairo-experience.webp`,
      mid: `${A}/stories/cairo-experience.webp`,
      wide: `${A}/stories/cairo-experience.webp`,
      wideAt: 1440,
      alt: "Kairo am Nilufer in der Dämmerung, Minarette und Brücken vor einem violetten Himmel geschichtet.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Ein Abend in Karnak, ganz für sich",
    summary: "Die Ton- und Lichtshow hat einen schlechten Ruf – so takten unsere Guides sie, dass die Säulenhalle nahezu leer ist, und das hat der Lichtdesigner an den Obelisken richtig gemacht.",
    href: "/blog/karnak-sound-and-light",
    image: {
      src: `${A}/stories/karnak-sound-light.webp`,
      mid: `${A}/stories/karnak-sound-light.webp`,
      wide: `${A}/stories/karnak-sound-light.webp`,
      wideAt: 1440,
      alt: "Karnaks gewaltige Säulen, während der Abendshow bernsteinfarben vor mitternachtsblauem Himmel beleuchtet.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Alexandria: Ägyptens mediterrane Seele",
    summary: "Zwei Stunden von Kairo entfernt und eine Welt für sich – Meeresfrüchte am Fischmarkt, die neue Bibliothek, die Katakomben und ein Spaziergang auf der Corniche, der jeden Alexandriner erklärt, dem Sie je begegnet sind.",
    href: "/blog/alexandria-mediterranean-soul",
    image: {
      src: `${A}/stories/alexandria-mediterranean.webp`,
      mid: `${A}/stories/alexandria-mediterranean.webp`,
      wide: `${A}/stories/alexandria-mediterranean.webp`,
      wideAt: 1440,
      alt: "Die Corniche von Alexandria, die sich im Morgengrauen entlang des Mittelmeers zur Zitadelle schwingt.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Wie Sie im Roten Meer schnorcheln, ohne ihm zu schaden",
    summary: "Auftriebstipps unserer Tauchguides, warum wir die Fische nie füttern, die Sonnenschutzregeln auf jedem Ptah-Boot und die drei Riffe bei Sharm, an denen Sie kaum eine andere Gruppe zu Gesicht bekommen.",
    href: "/blog/red-sea-reef-etiquette",
    image: {
      src: `${A}/stories/red-sea-reef.webp`,
      mid: `${A}/stories/red-sea-reef.webp`,
      wide: `${A}/stories/red-sea-reef.webp`,
      wideAt: 1440,
      alt: "Ein Korallengarten mit umherhuschenden Fahnenbarschen in den klaren Untiefen eines Hausriffs am Roten Meer.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Ein Loblied auf die Feluke: gemächliche Niltage",
    summary: "Kein Motor, kein Zeitplan enger als der Wind. Warum unser liebster Nachmittag in Assuan aus einem Segel aus Leinwand, einer Thermoskanne Tee und allem besteht, was der Fluss Ihnen zu zeigen beschließt.",
    href: "/blog/slow-nile-felucca-days",
    image: {
      src: `${A}/stories/nile-sailing-aswan.webp`,
      mid: `${A}/stories/nile-sailing-aswan.webp`,
      wide: `${A}/stories/nile-sailing-aswan.webp`,
      wideAt: 1440,
      alt: "Eine Feluke, die bei Sonnenuntergang mit vollen Segeln sanft über den Nil bei Assuan krängt.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Die beste Reisezeit für Ägypten, Monat für Monat",
    summary: "Ägypten hat für jeden die passende Saison – klare, kühle Winter für die Tempel, ruhige Übergangsmonate für ein gutes Preis-Leistungs-Verhältnis und eine kluge Art, selbst die Sommerhitze zu genießen. So fühlt sich jeder Monat wirklich an, und wann Sie wofür reisen sollten.",
    href: "/blog/best-time-to-visit-egypt",
    image: {
      src: `${A}/hero/hero-giza.webp`,
      mid: `${A}/hero/hero-giza.webp`,
      wide: `${A}/hero/hero-giza.webp`,
      wideAt: 1440,
      alt: "Die Pyramiden von Gizeh unter einem klaren blauen Winterhimmel.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Ein Leitfaden zur ersten Nilkreuzfahrt",
    summary: "Wie eine Nilkreuzfahrt wirklich ist – die Kabinen, das Essen, der tägliche Rhythmus aus Tempeln und Segeln, in welche Richtung Sie fahren sollten und wie Sie zwischen einem großen Flussschiff und einer intimen Dahabiya wählen.",
    href: "/blog/first-time-nile-cruise",
    image: {
      src: `${A}/cta/fifty-nile-cruise.webp`,
      mid: `${A}/cta/fifty-nile-cruise.webp`,
      wide: `${A}/cta/fifty-nile-cruise.webp`,
      wideAt: 1440,
      alt: "Ein Nilkreuzfahrtschiff auf ruhigem Wasser an einem grünen Flussufer.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Sieben Tage in Ägypten: unsere klassische Route, aufgeschlüsselt",
    summary: "Kairo, Luxor und Assuan in einer Woche, ohne Hektik – unsere klassische Sieben-Tage-Route, Tag für Tag, mit den Abwägungen, die wir treffen, damit die Höhepunkte wirken und das Tempo menschlich bleibt.",
    href: "/blog/seven-days-in-egypt",
    image: {
      src: `${A}/itineraries/cairo-heritage.webp`,
      mid: `${A}/itineraries/cairo-heritage.webp`,
      wide: `${A}/itineraries/cairo-heritage.webp`,
      wideAt: 1440,
      alt: "Kuppeln und Minarette des historischen islamischen Kairo zur goldenen Stunde.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Was Sie für Ägypten einpacken (und was Sie zu Hause lassen)",
    summary: "Die kurze Liste, auf die es wirklich ankommt – Schichten für kalte Wüstennächte, Sonnenschutz, der die Stätten respektiert, die richtigen Schuhe für Gräber und die Dinge, die Erstreisende stets zu viel einpacken. Mit Hinweisen zur Saison.",
    href: "/blog/what-to-pack-for-egypt",
    image: {
      src: `${A}/activities/desert-safari.webp`,
      mid: `${A}/activities/desert-safari.webp`,
      wide: `${A}/activities/desert-safari.webp`,
      wideAt: 1440,
      alt: "Eine Wüstenpiste, die unter einem weiten ägyptischen Himmel auf Dünen zuläuft.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Jenseits von Gizeh: Ägyptens unterschätzte antike Stätten",
    summary: "Wenn Sie die Pyramiden gesehen haben, geht Ägypten weiter – die Stufenpyramide von Sakkara, die bemalte Decke von Dendera, Abydos, Kom Ombo und die stillen Tempel, in denen Sie vielleicht die einzigen Besucher sind.",
    href: "/blog/beyond-giza-underrated-sites",
    image: {
      src: `${A}/activities/philae-temple.webp`,
      mid: `${A}/activities/philae-temple.webp`,
      wide: `${A}/activities/philae-temple.webp`,
      wideAt: 1440,
      alt: "Die Säulen des Philae-Tempels, die sich über dem Nil bei Assuan erheben.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Ägypten mit Kindern: ein Reiseführer für Familien",
    summary: "Ägypten ist eine großartige Reise mit Kindern – Mumien, Kamele und Boote, die sie bei der Stange halten. Unser Leitfaden zu Tempo, Alter, Essen, Hitze und den Reisen, die für Familien am besten funktionieren.",
    href: "/blog/egypt-with-kids-family-guide",
    image: {
      src: `${A}/activities/nubian-culture.webp`,
      mid: `${A}/activities/nubian-culture.webp`,
      wide: `${A}/activities/nubian-culture.webp`,
      wideAt: 1440,
      alt: "Eine bunt bemalte Gasse in einem nubischen Dorf über dem Nil bei Assuan.",
    },
    credit: "Ptah Tours field archive",
  },
];
export const siteNavDe: SiteNav = {
  quickLinks: [
    { label: "Veranstaltungen & Festivals", href: "/events", iconKey: "calendar" },
    { label: "Beste Reisezeit", href: "/when-to-visit", iconKey: "weather" },
    { label: "eVisum buchen", href: "/visa", iconKey: "ticket" },
    { label: "Mein Konto", href: "/account", iconKey: "user" },
  ],
  directLinks: [
    { label: "Reiseziele", href: "/cities" },
    { label: "Reiseideen", href: "/trip-ideas" },
    { label: "Galerie", href: "/gallery" },
  ],
  buildTripCta: { label: "Meine Reise planen", href: "/manage/trip-builder" },
  bookmarksHref: "/manage/trip-builder?tab=bookmarks",
  searchHref: "/search",
  popularSearches: [
    "Pyramiden von Gizeh",
    "Nilkreuzfahrt",
    "Heißluftballon Luxor",
    "Schnorcheln Ras Mohammed",
    "Private Kairo-Tour",
    "Weihnachten in Ägypten",
  ],
  sections: [
    {
      key: "about",
      title: "Über Ägypten",
      columns: [
        {
          heading: "Reiseziele",
          links: [
            { label: "Kairo", href: "/cities/cairo" },
            { label: "Luxor", href: "/cities/luxor" },
            { label: "Assuan", href: "/cities/aswan" },
            { label: "Alexandria", href: "/cities/alexandria" },
            { label: "Hurghada", href: "/cities/hurghada" },
            { label: "Sharm el-Sheikh", href: "/cities/sharm-el-sheikh" },
          ],
        },
        {
          heading: "Das Land kennenlernen",
          links: [
            { label: "Geschichte & Kulturerbe", href: "/heritage" },
            { label: "Jahreszeiten & Klima", href: "/when-to-visit" },
            { label: "Der Nil", href: "/the-nile" },
            { label: "Wüsten & Oasen", href: "/deserts" },
            { label: "Riffe des Roten Meeres", href: "/red-sea" },
          ],
        },
        {
          heading: "Gut zu wissen",
          links: [
            { label: "Verantwortungsvolles Reisen", href: "/responsible-travel" },
            { label: "Barrierefreiheit", href: "/accessibility" },
            { label: "Sicherheit & Unterstützung", href: "/contact" },
            { label: "Geschichten & Journal", href: "/blog" },
          ],
        },
      ],
      imageCtas: [
        {
          label: "Reiseziel im Detail",
          heading: "Das antike Theben",
          href: "/cities/luxor",
          image: { src: `${A}/hero/hero-thebes-portrait.webp`, alt: "Ein Heißluftballon über den Tempeln am Westufer von Luxor im Morgengrauen." },
        },
        {
          label: "Küsten",
          heading: "Das Rote Meer entdecken",
          href: "/cities/sharm-el-sheikh",
          image: { src: `${A}/hero/hero-blue-hole-portrait.webp`, alt: "Ein Schnorchler, der über Korallen am Riffsaum des Blue Hole treibt." },
        },
        {
          label: "Aus dem Feld",
          heading: "Das Journal lesen",
          href: "/blog",
          image: { src: `${A}/stories/nile-sailing-aswan.webp`, alt: "Eine Feluke unter Segeln auf dem Nil bei Assuan." },
        },
      ],
    },
    {
      key: "plan",
      title: "Reise planen",
      columns: [
        {
          heading: "Anreise",
          links: [
            { label: "Flüge nach Ägypten", href: "/getting-here" },
            { label: "Visa & Einreise", href: "/visa" },
            { label: "Ankunftstage, organisiert", href: "/getting-here#arrivals" },
            { label: "Fortbewegung vor Ort", href: "/getting-around" },
          ],
        },
        {
          heading: "Entscheiden",
          links: [
            { label: "Beste Reisezeit", href: "/when-to-visit" },
            { label: "Wie viele Tage", href: "/how-many-days" },
            { label: "Budget & Trinkgeld", href: "/travel-tips" },
            { label: "Reisen mit Kindern", href: "/family-travel" },
          ],
        },
        {
          heading: "Unser Versprechen",
          links: [
            { label: "So funktionieren Ptah-Reisen", href: "/how-it-works" },
            { label: "Verantwortungsvolles Reisen", href: "/responsible-travel" },
            { label: "Bewertungen & Akkreditierung", href: "/reviews" },
            { label: "Das Team kontaktieren", href: "/contact" },
          ],
        },
      ],
      imageCtas: [
        {
          label: "Kostenlose Beratung",
          heading: "Mit einem Ägyptologen sprechen",
          href: "/contact",
          image: { src: `${A}/activities/philae-felucca.webp`, alt: "Eine Feluke, die über ruhiges Nilwasser auf den Philae-Tempel zusegelt." },
        },
        {
          label: "Stöbern",
          heading: "Alle Ptah-Touren",
          href: "/tours",
          image: { src: `${A}/activities/valley-heritage.webp`, alt: "Bemalte Grabwände im Tal der Könige." },
        },
        {
          label: "Inspiration",
          heading: "Reiseideen entdecken",
          href: "/trip-ideas",
          image: { src: `${A}/cta/plan-nile-portrait.webp`, alt: "Eine Feluke auf dem Nil bei Assuan zwischen Granitfelsen." },
        },
      ],
    },
    {
      key: "tours",
      title: "Touren",
      columns: [
        {
          heading: "Nach Stil",
          links: [
            { label: "Klassisches Ägypten", href: "/tours?type=classic" },
            { label: "Nilkreuzfahrten", href: "/tours?type=nile-cruise" },
            { label: "Rotes Meer & Strand", href: "/tours?type=red-sea" },
            { label: "Wüstenabenteuer", href: "/tours?type=desert" },
          ],
        },
        {
          heading: "Nach Dauer",
          links: [
            { label: "Tagestouren", href: "/tours?length=day" },
            { label: "2–4-Tage-Reisen", href: "/tours?length=short" },
            { label: "5–9-Tage-Reisen", href: "/tours?length=week" },
            { label: "Expeditionen ab 10 Tagen", href: "/tours?length=grand" },
          ],
        },
        {
          heading: "Besonderes",
          links: [
            { label: "Privat & maßgeschneidert", href: "/tours?type=private" },
            { label: "Familienreisen", href: "/tours?type=family" },
            { label: "Flitterwochen", href: "/tours?type=honeymoon" },
            { label: "Last-Minute-Abreisen", href: "/tours?filter=departing-soon" },
          ],
        },
      ],
      imageCtas: [
        {
          label: "Signature-Reise",
          heading: "Klassisches Ägypten, 8 Tage",
          href: "/tours?type=classic",
          image: { src: `${A}/itineraries/giza-essentials.webp`, alt: "Die Große Pyramide von Gizeh mit einem Kamelführer im Vordergrund." },
        },
        {
          label: "Auf dem Fluss",
          heading: "Nilkreuzfahrt-Kollektion",
          href: "/tours?type=nile-cruise",
          image: { src: `${A}/tour-types/nile-cruise.webp`, alt: "Ballons, die im ersten Licht über dem Niltal bei Luxor aufsteigen." },
        },
        {
          label: "Unter Wasser",
          heading: "Tauch- & Schnorchelausflüge",
          href: "/tours?type=red-sea",
          image: { src: `${A}/activities/blue-hole-dive.webp`, alt: "Ein Schnorchler über dem Korallensaum am Blue Hole von Dahab." },
        },
      ],
    },
    {
      key: "journal",
      title: "Journal",
      columns: [
        {
          heading: "Hier beginnen",
          links: [
            { label: "Beste Reisezeit", href: "/blog/best-time-to-visit-egypt" },
            { label: "Die erste Nilkreuzfahrt", href: "/blog/first-time-nile-cruise" },
            { label: "7-Tage-Reiseplan", href: "/blog/seven-days-in-egypt" },
            { label: "Packliste", href: "/blog/what-to-pack-for-egypt" },
          ],
        },
        {
          heading: "Orte & Geschichten",
          links: [
            { label: "Kairo jenseits des Reiseführers", href: "/blog/cairo-beyond-the-guidebook" },
            { label: "Alexandrias Seele", href: "/blog/alexandria-mediterranean-soul" },
            { label: "Jenseits von Gizeh", href: "/blog/beyond-giza-underrated-sites" },
            { label: "Ein Abend in Karnak", href: "/blog/karnak-sound-and-light" },
          ],
        },
        {
          heading: "Clever reisen",
          links: [
            { label: "Ägypten mit Kindern", href: "/blog/egypt-with-kids-family-guide" },
            { label: "Riff-Knigge fürs Rote Meer", href: "/blog/red-sea-reef-etiquette" },
            { label: "Gemächliche Niltage per Feluke", href: "/blog/slow-nile-felucca-days" },
            { label: "Alle Journal-Beiträge", href: "/blog" },
          ],
        },
      ],
      imageCtas: [
        {
          label: "Reiseplanung",
          heading: "Beste Reisezeit für Ägypten",
          href: "/blog/best-time-to-visit-egypt",
          image: { src: `${A}/hero/hero-giza-portrait.webp`, alt: "Die Pyramiden von Gizeh unter einem klaren Winterhimmel." },
        },
        {
          label: "Auf dem Fluss",
          heading: "Die erste Nilkreuzfahrt",
          href: "/blog/first-time-nile-cruise",
          image: { src: `${A}/cta/fifty-nile-cruise.webp`, alt: "Ein Nilkreuzfahrtschiff, das an einem grünen Flussufer vertäut ist." },
        },
        {
          label: "Mit der Familie",
          heading: "Ägypten mit Kindern",
          href: "/blog/egypt-with-kids-family-guide",
          image: { src: `${A}/activities/nubian-culture.webp`, alt: "Eine bunt bemalte Dorfgasse in Nubien über dem Nil bei Assuan." },
        },
      ],
    },
  ],
};
export const footerContentDe: FooterContent = {
  newsletter: {
    heading: "Anmelden!",
    blurb:
      "Reiseideen, saisonale Abreisen und gelegentlich eine Depesche aus der Wüste — ein paar Mal im Monat, niemals Spam.",
    cta: { label: "Für unseren E-Newsletter anmelden", href: "/newsletter" },
  },
  badgeHeading: "Empfohlen von",
  badges: [
    { heading: "ETF", sub: "Mitglied 2026", href: "/about#accreditation" },
    { heading: "Travelife", sub: "Partner", href: "/responsible-travel" },
  ],
  partnersHeading: "Reisepartner",
  partners: [
    { name: "Egypt Air", tagline: "Offizieller Fluglinienpartner", href: "https://www.egyptair.com" },
    { name: "IATA", tagline: "Akkreditierter Agent", href: "https://www.iata.org" },
    { name: "Visit Egypt", tagline: "Ägyptische Tourismusbehörde", href: "https://www.experienceegypt.eg" },
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
        { label: "Über uns", href: "/about" },
        { label: "Unsere Ägyptologen", href: "/about#team" },
        { label: "Karriere", href: "/careers" },
        { label: "Presse & Medien", href: "/press" },
        { label: "Kontakt", href: "/contact" },
      ],
    },
    {
      heading: "Mit uns reisen",
      links: [
        { label: "Alle Touren", href: "/tours" },
        { label: "Reiseideen", href: "/trip-ideas" },
        { label: "Nilkreuzfahrten", href: "/tours?type=nile-cruise" },
        { label: "Private Reisen", href: "/tours?type=private" },
        { label: "Verantwortungsvolles Reisen", href: "/responsible-travel" },
        { label: "Fotogalerie", href: "/gallery" },
      ],
    },
    {
      heading: "Hilfe & Infos",
      links: [
        { label: "Beste Reisezeit", href: "/when-to-visit" },
        { label: "Visum & Einreise", href: "/visa" },
        { label: "Buchung verfolgen", href: "/track-booking" },
        { label: "Gesundheit & Sicherheit", href: "/travel-tips" },
        { label: "FAQ", href: "/faqs" },
      ],
    },
  ],
  legalLinks: [
    { label: "Datenschutzerklärung", href: "/privacy-policy" },
    { label: "Allgemeine Geschäftsbedingungen", href: "/terms-of-service" },
    { label: "Cookie-Richtlinie", href: "/cookie-policy" },
  ],
  copyrightLine: "© {year} Ptah Tours. Alle Rechte vorbehalten.",
  acknowledgement:
    "Ptah Tours hat seinen Hauptsitz in Kairo und ist in ganz Ägypten tätig — im Niltal, im Delta, auf dem Sinai und in der Westlichen Wüste. Wir reisen mit lizenzierten Ägyptologen, entlohnen unsere Crews fair und planen jede Reiseroute so, dass sie Ägyptens Gemeinden und Kulturstätten mehr gibt, als sie ihnen nimmt.",
  cookie: {
    heading: "Ihre Privatsphäre ist uns wichtig",
    copy: "Wir verwenden Cookies, um Ihr Surferlebnis zu verbessern, personalisierte Inhalte bereitzustellen und unseren Traffic zu analysieren. Indem Sie auf „Alle akzeptieren“ klicken, stimmen Sie unserer Verwendung von Cookies zu. Sie können Ihre Entscheidung jederzeit über die Fußzeile ändern.",
    manageHeading: "Cookie-Einstellungen verwalten",
    categories: [
      {
        key: "preferences",
        name: "Präferenzen",
        description: "Merkt sich Einstellungen wie Sprache, Währung und Ihre gemerkten Reisen.",
      },
      {
        key: "analytics",
        name: "Analyse",
        description: "Anonyme Statistiken, die uns verstehen helfen, welche Reisen und Seiten Reisende lieben.",
      },
      {
        key: "marketing",
        name: "Marketing",
        description: "Messen unsere Kampagnen und zeigen anderswo relevantere Ptah-Tours-Inhalte.",
      },
    ],
  },
};
export const landingContentDe = {
  hero: heroSlidesDe,
  inspiredTabs: inspiredTabsDe,
  planCta: planCtaDe,
  fiftyCtas: fiftyCtasDe,
  kbygItems: kbygItemsDe,
  tourTypes: tourTypesDe,
  stories: storiesDe,
} as const;
