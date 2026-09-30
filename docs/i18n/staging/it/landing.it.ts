/**
 * Italian (it) editorial translation of `src/content/landing.ts` (Module G).
 * Staging only. Register: Lei (courtesy) + impersonal editorial voice; CTA
 * microcopy uses the formal imperative (Pianifichi, Scopra…). Human-readable
 * values translated; `src`, `href`, `credit`, `iconKey`, `buttonType`,
 * `trackingContext`, `network`, `season`, `id`, `key`, numeric fields and cookie
 * category `key` enums mirrored 1:1. Brand "Ptah Tours" and legalName kept
 * verbatim. `{year}` token preserved. `siteMetaIt` is widened to string values
 * because the English `siteMeta` is declared `as const` (literal types); see notes.md.
 */
import type {
  siteMeta,
  heroSlides,
  inspiredTabs,
  planCta,
  fiftyCtas,
  kbygItems,
  tourTypes,
  stories,
  siteNav,
  footerContent,
  landingContent,
} from "@/content/landing";

export const siteMetaIt: { [K in keyof typeof siteMeta]: string } = {
  name: "Ptah Tours",
  legalName: "Ptah Tours for Tourism LLC",
  tagline: "L'Egitto, curato da chi lo chiama casa",
};

export const heroSlidesIt: typeof heroSlides = [
  {
    id: "giza",
    season: "summer",
    title: "Cammini tra l'ultima meraviglia del mondo antico",
    shortLabel: "le piramidi di Giza",
    subtitle: "Mattinate private a Giza con un egittologo, prima dell'arrivo della folla.",
    image: {
      src: "/assets/hero/hero-giza-portrait.webp",
      mid: "/assets/hero/hero-giza.webp",
      alt: "La Grande Piramide di Cheope e la Sfinge di Giza nella calda luce del mattino, con l'altopiano del Cairo sullo sfondo.",
      credit: "Ptah Tours field archive",
    },
    hotspots: [
      { xPct: 30, yPct: 44, label: "Grande Piramide di Cheope", href: "/trip-ideas/panorama-of-the-pyramids" },
      { xPct: 62, yPct: 70, label: "La Grande Sfinge", href: "/trip-ideas/panorama-of-the-pyramids" },
    ],
  },
  {
    id: "thebes",
    season: "summer",
    title: "Sorvoli le tombe di Tebe alle prime luci",
    shortLabel: "volo in mongolfiera su Luxor",
    subtitle: "Mongolfiere all'alba, la Valle dei Re e Karnak prima del caldo.",
    image: {
      src: "/assets/hero/hero-thebes-portrait.webp",
      mid: "/assets/hero/hero-thebes.webp",
      alt: "Una mongolfiera che sorvola la riva occidentale di Luxor all'alba, con la fascia verde del Nilo sotto.",
      credit: "Ptah Tours field archive",
    },
    hotspots: [
      { xPct: 26, yPct: 38, label: "Mongolfiere all'alba", href: "/trip-ideas/luxor-sunrise-weekend" },
      { xPct: 68, yPct: 62, label: "Valle dei Re", href: "/trip-ideas/kings-and-queens-of-thebes" },
    ],
  },
  {
    id: "blue-hole",
    season: "summer",
    title: "Scenda nell'azzurro: la barriera viva del Sinai",
    shortLabel: "la costa del Blue Hole",
    subtitle: "Faccia snorkeling al Blue Hole, a Ras Abu Galum e a Ras Mohammed con guide subacquee autorizzate.",
    image: {
      src: "/assets/hero/hero-blue-hole-portrait.webp",
      mid: "/assets/hero/hero-blue-hole.webp",
      alt: "Il cerchio azzurro profondo del Blue Hole di Dahab visto dall'alto, circondato dalla pallida piattaforma corallina e dalle montagne del Sinai.",
      credit: "Ptah Tours field archive",
    },
    hotspots: [
      { xPct: 40, yPct: 46, label: "La dolina del Blue Hole", href: "/trip-ideas/blue-hole-sinai" },
      { xPct: 66, yPct: 30, label: "Costa di Ras Abu Galum", href: "/trip-ideas/blue-hole-sinai" },
    ],
  },
];

export const inspiredTabsIt: typeof inspiredTabs = [
  {
    key: "itineraries",
    label: "Itinerari",
    cards: [
      {
        title: "Panorama delle piramidi",
        href: "/trip-ideas/panorama-of-the-pyramids",
        days: 2,
        experiences: 6,
        image: { src: "/assets/itineraries/giza-essentials.webp", alt: "Un cammello che passa davanti alla Grande Piramide di Cheope sull'altopiano di Giza." },
      },
      {
        title: "Weekend storico al Cairo",
        href: "/trip-ideas/cairo-heritage-weekend",
        days: 3,
        experiences: 9,
        image: { src: "/assets/itineraries/cairo-heritage.webp", alt: "Vetrine e reperti dorati all'interno del Museo Egizio del Cairo." },
      },
      {
        title: "Karnak di giorno, tempio di Luxor di sera",
        href: "/trip-ideas/karnak-luxor-evening",
        days: 2,
        experiences: 7,
        image: { src: "/assets/itineraries/karnak-evening.webp", alt: "Colonne illuminate del tempio di Luxor all'imbrunire, splendenti d'ambra contro un cielo blu intenso." },
      },
      {
        title: "Re e regine di Tebe",
        href: "/trip-ideas/kings-and-queens-of-thebes",
        days: 3,
        experiences: 8,
        image: { src: "/assets/itineraries/valley-of-kings.webp", alt: "Rupi dorate che digradano verso le tombe della Valle dei Re." },
      },
      {
        title: "L'isola di File e la Grande Diga",
        href: "/trip-ideas/philae-island-aswan",
        days: 2,
        experiences: 5,
        image: { src: "/assets/itineraries/philae-island.webp", alt: "Il tempio insulare di File, raggiungibile in barca attraverso acque azzurre e tranquille." },
      },
      {
        title: "Il villaggio nubiano in feluca",
        href: "/trip-ideas/nubian-village-aswan",
        days: 2,
        experiences: 6,
        image: { src: "/assets/itineraries/nubian-village.webp", alt: "Una casa dipinta di un villaggio nubiano, in ocra e azzurro accesi, sopra il Nilo." },
      },
      {
        title: "Alessandria in un weekend",
        href: "/trip-ideas/alexandria-weekend",
        days: 2,
        experiences: 7,
        image: { src: "/assets/itineraries/alexandria-classics.webp", alt: "La copertura curva della moderna Biblioteca di Alessandria affacciata sul Mediterraneo." },
      },
      {
        title: "Vetta del Sinai e Santa Caterina",
        href: "/trip-ideas/sinai-summit-st-catherines",
        days: 2,
        experiences: 4,
        image: { src: "/assets/itineraries/sinai-summit.webp", alt: "Escursionisti sul sentiero dei cammelli verso il monte Sinai sotto un cielo che precede l'alba." },
      },
    ],
  },
  {
    key: "adventure",
    label: "Avventura",
    cards: [
      {
        title: "Snorkeling al Blue Hole",
        href: "/trip-ideas/blue-hole-sinai",
        image: { src: "/assets/activities/blue-hole-dive.webp", alt: "Un sub in snorkeling che galleggia sulla piattaforma corallina al bordo del Blue Hole." },
      },
      {
        title: "Trekking nel Canyon Colorato",
        href: "/trip-ideas/colored-canyon-sinai",
        image: { src: "/assets/activities/colored-canyon.webp", alt: "Fasce di roccia rossa, dorata e crema che si piegano lungo lo stretto Canyon Colorato." },
      },
      {
        title: "Safari in quad al tramonto",
        href: "/trip-ideas/desert-safari-quad-sunset",
        image: { src: "/assets/activities/desert-safari.webp", alt: "Quad che sollevano polvere su una piana desertica arancione al tramonto." },
      },
      {
        title: "Giornata in barca nel Mar Rosso",
        href: "/trip-ideas/red-sea-boat-snorkeling",
        image: { src: "/assets/activities/boat-snorkeling.webp", alt: "Una barca da immersione bianca all'ancora su acque turchesi di barriera nel Mar Rosso." },
      },
    ],
  },
  {
    key: "culture",
    label: "Cultura",
    cards: [
      {
        title: "Il Museo Egizio, con guida",
        href: "/trip-ideas/egyptian-museum-guided",
        image: { src: "/assets/activities/museum-tahrir.webp", alt: "Statue di pietra scolpite e sarcofagi nelle sale del Museo Egizio." },
      },
      {
        title: "Khan el-Khalili al calar della sera",
        href: "/trip-ideas/khan-el-khalili-night",
        image: { src: "/assets/activities/khan-el-khalili.webp", alt: "Bancarelle di lanterne accese nel bazar di Khan el-Khalili di notte." },
      },
      {
        title: "Tè con una famiglia nubiana",
        href: "/trip-ideas/nubian-village-aswan",
        image: { src: "/assets/activities/nubian-culture.webp", alt: "Un cortile nubiano dipinto con una famiglia riunita a prendere il tè." },
      },
      {
        title: "Biblioteca di Alessandria e Qaitbay",
        href: "/trip-ideas/alexandria-weekend",
        image: { src: "/assets/activities/bibliotheca.webp", alt: "La facciata inclinata di granito della Biblioteca di Alessandria che riflette il sole." },
      },
    ],
  },
  {
    key: "river-sea",
    label: "Fiume e mare",
    cards: [
      {
        title: "Feluca attorno a File",
        href: "/trip-ideas/philae-island-aswan",
        image: { src: "/assets/activities/philae-felucca.webp", alt: "Una feluca dalla vela bianca che scivola verso il tempio di File sul Nilo." },
      },
      {
        title: "Giornata in barca a Ras Mohammed",
        href: "/trip-ideas/ras-mohammed-park",
        image: { src: "/assets/activities/ras-mohammed.webp", alt: "Bassi fondali turchesi e barriera visibili da una barca a Ras Mohammed." },
      },
      {
        title: "Feluca al tramonto, Luxor",
        href: "/trip-ideas/luxor-sunrise-weekend",
        image: { src: "/assets/activities/nile-sunset-felucca.webp", alt: "La vela di una feluca che cattura l'ultima luce arancione sul Nilo a Luxor." },
      },
      {
        title: "Snorkeling sui reef sotto costa",
        href: "/trip-ideas/red-sea-boat-snorkeling",
        image: { src: "/assets/activities/red-sea-boat.webp", alt: "Sub in snorkeling che fluttuano sopra giardini di corallo lungo la costa del Mar Rosso." },
      },
    ],
  },
  {
    key: "heritage",
    label: "Patrimonio",
    cards: [
      {
        title: "La grande sala ipostila",
        href: "/trip-ideas/karnak-luxor-evening",
        image: { src: "/assets/activities/karnak-hypostyle.webp", alt: "Enormi colonne dai capitelli papiriformi affollano la sala ipostila di Karnak." },
      },
      {
        title: "Dentro la Valle dei Re",
        href: "/trip-ideas/kings-and-queens-of-thebes",
        image: { src: "/assets/activities/valley-heritage.webp", alt: "Le pareti dipinte del corridoio di una tomba che risplendono sotto l'illuminazione conservativa nella Valle dei Re." },
      },
      {
        title: "File: il tempio di Iside",
        href: "/trip-ideas/philae-island-aswan",
        image: { src: "/assets/activities/philae-temple.webp", alt: "Il portale scolpito del tempio di File, dedicato alla dea Iside." },
      },
      {
        title: "Guardiani di Giza",
        href: "/trip-ideas/panorama-of-the-pyramids",
        image: { src: "/assets/activities/sphinx-guardians.webp", alt: "La Sfinge che guarda oltre l'obiettivo, con la piramide di Chefren sullo sfondo." },
      },
    ],
  },
];

export const planCtaIt: typeof planCta = {
  title: "Pianifichi il viaggio dei Suoi sogni",
  copy: "Racconti al nostro studio del Cairo che cosa sogna — piramidi all'alba, un tratto tranquillo del Nilo tra un tempio e l'altro, una settimana sulla barriera — e un progettista di viaggi dedicato costruirà l'itinerario con Lei, messaggio dopo messaggio.",
  image: {
    src: "/assets/cta/plan-nile-portrait.webp",
    mid: "/assets/cta/plan-karnak-landscape.webp",
    wide: "/assets/cta/plan-karnak-landscape.webp",
    wideAt: 1440,
    alt: "Una feluca che naviga accanto alle palme del Nilo ad Assuan, con i massi di granito che segnano la prima cateratta.",
  },
  credit: "Ptah Tours field archive — Aswan",
  cta: {
    type: "customButton",
    button: { buttonType: "buildATrip", trackingContext: "HomePageFullPageCTA", href: "/manage/trip-builder" },
    label: "Inizi a pianificare",
  },
};

export const fiftyCtasIt: typeof fiftyCtas = [
  {
    title: "Pensato su misura per Lei",
    copy: "Ogni viaggio Ptah è privato e su misura: la Sua guida, il Suo ritmo, il Suo percorso. Niente di preconfezionato.",
    cta: { label: "Progetti il mio viaggio", href: "/contact" },
    image: {
      src: "/assets/cta/fifty-bespoke-journeys.webp",
      mid: "/assets/cta/fifty-bespoke-journeys.webp",
      wide: "/assets/cta/fifty-bespoke-journeys.webp",
      wideAt: 1128,
      alt: "Uno sguardo verso l'alto tra le colonne del tempio di Luxor, verso un cielo luminoso.",
    },
  },
  {
    title: "Navighi il Nilo con stile",
    copy: "Crociere da quattro a sette notti tra Luxor e Assuan, con cabine che abbiamo ispezionato di persona.",
    cta: { label: "Scopra il Nilo", href: "/the-nile" },
    image: {
      src: "/assets/cta/fifty-nile-cruise.webp",
      mid: "/assets/cta/fifty-nile-cruise.webp",
      wide: "/assets/cta/fifty-nile-cruise.webp",
      wideAt: 1128,
      alt: "Una nave da crociera sul Nilo ormeggiata sulla riva occidentale, vicino ad Assuan, nell'ora dorata.",
    },
  },
];

export const kbygItemsIt: typeof kbygItems = [
  {
    iconKey: "weather",
    title: "Quando venire",
    copy: "Da ottobre ad aprile è stagione dei templi; il Mar Rosso brilla tutto l'anno. Abbineremo le Sue date alla mappa giusta.",
    cta: { label: "Veda le stagioni", href: "/when-to-visit" },
  },
  {
    iconKey: "ticket",
    title: "Ingresso e visti",
    copy: "La maggior parte delle nazionalità può ottenere l'e-Visa online in pochi minuti. Inviamo a ogni ospite una guida all'arrivo passo passo.",
    cta: { label: "Verifichi i requisiti", href: "/visa" },
  },
  {
    iconKey: "travel",
    title: "Come spostarsi",
    copy: "Autisti privati come standard, treni di prima classe e voli interni tra le tratte lunghe, e feluche per i tragitti più belli.",
    cta: { label: "Come viaggiamo", href: "/getting-around" },
  },
  {
    iconKey: "info",
    title: "Parli con una persona",
    copy: "Veterani del Nilo, non un call center. WhatsApp, telefono o email: raggiungerà il team che pianifica il viaggio.",
    cta: { label: "Ci contatti", href: "/contact" },
  },
];

export const tourTypesIt: typeof tourTypes = [
  {
    title: "Egitto classico",
    blurb: "Piramidi, templi di Luxor e i grandi musei: il circuito essenziale, fatto come si deve.",
    href: "/tours?type=classic",
    image: { src: "/assets/tour-types/classic-egypt.webp", alt: "I piloni del tempio di File riflessi nel Nilo in una tranquilla mattina ad Assuan." },
  },
  {
    title: "Crociere sul Nilo",
    blurb: "Dorma sul fiume: ponti da Luxor ad Assuan, ormeggi privati e soste ai templi lungo il percorso.",
    href: "/tours?type=nile-cruise",
    image: { src: "/assets/tour-types/nile-cruise.webp", alt: "Mongolfiere che si alzano sulla valle del Nilo a ovest di Luxor all'alba." },
  },
  {
    title: "Mar Rosso e spiaggia",
    blurb: "Hurghada, Sharm e Dahab: giornate sulla barriera, gite in barca e vero riposo.",
    href: "/tours?type=red-sea",
    image: { src: "/assets/tour-types/red-sea-escape.webp", alt: "Il sole che tramonta sul Mar Rosso con la sagoma di una dahabiya al largo." },
  },
  {
    title: "Avventure nel deserto",
    blurb: "Campi nel Deserto Bianco, vette del Sinai, piste tra le oasi: l'Egitto oltre la riva del fiume.",
    href: "/tours?type=desert",
    image: { src: "/assets/tour-types/desert-adventure.webp", alt: "Una pista fuoristrada che serpeggia tra dune arancioni verso un campo nel deserto all'imbrunire." },
  },
];

export const storiesIt: typeof stories = [
  {
    title: "Il Cairo oltre la guida",
    summary: "Dove i cairoti mangiano davvero il koshari, la moschea con il tramonto più bello del Cairo e perché le sale sul retro del Museo Egizio battono la galleria famosa: cinque giorni a piedi per la capitale con il nostro team sul posto.",
    href: "/blog/cairo-beyond-the-guidebook",
    image: {
      src: "/assets/stories/cairo-experience.webp",
      mid: "/assets/stories/cairo-experience.webp",
      wide: "/assets/stories/cairo-experience.webp",
      wideAt: 1440,
      alt: "Il Cairo sul Nilo all'imbrunire, minareti e ponti stratificati contro un cielo violaceo.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Una sera a Karnak, per conto Suo",
    summary: "Lo spettacolo di suoni e luci ha una brutta fama: Le spieghiamo come le nostre guide lo programmano perché la sala ipostila resti quasi vuota, e in che cosa il progettista delle luci ci ha visto giusto con gli obelischi.",
    href: "/blog/karnak-sound-and-light",
    image: {
      src: "/assets/stories/karnak-sound-light.webp",
      mid: "/assets/stories/karnak-sound-light.webp",
      wide: "/assets/stories/karnak-sound-light.webp",
      wideAt: 1440,
      alt: "Le grandi colonne di Karnak illuminate d'ambra contro un cielo blu notte durante lo spettacolo serale.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Alessandria: l'anima mediterranea dell'Egitto",
    summary: "A due ore dal Cairo e a un mondo di distanza: pesce al mercato, la nuova biblioteca, le catacombe e una passeggiata sulla corniche che spiega ogni alessandrino che abbia mai conosciuto.",
    href: "/blog/alexandria-mediterranean-soul",
    image: {
      src: "/assets/stories/alexandria-mediterranean.webp",
      mid: "/assets/stories/alexandria-mediterranean.webp",
      wide: "/assets/stories/alexandria-mediterranean.webp",
      wideAt: 1440,
      alt: "La corniche di Alessandria che si curva lungo il Mediterraneo verso la cittadella all'alba.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Come fare snorkeling nel Mar Rosso senza danneggiarlo",
    summary: "Consigli sull'assetto dalle nostre guide subacquee, perché non diamo mai da mangiare ai pesci, le regole sulla crema solare su ogni barca Ptah e i tre reef vicino a Sharm dove vedrà a malapena un altro gruppo.",
    href: "/blog/red-sea-reef-etiquette",
    image: {
      src: "/assets/stories/red-sea-reef.webp",
      mid: "/assets/stories/red-sea-reef.webp",
      wide: "/assets/stories/red-sea-reef.webp",
      wideAt: 1440,
      alt: "Un giardino di corallo con pesci anthias guizzanti nelle limpide acque basse di una barriera costiera del Mar Rosso.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Elogio della feluca: giornate lente sul Nilo",
    summary: "Niente motore, nessun itinerario più stretto del vento. Perché il nostro pomeriggio preferito ad Assuan è una vela di tela, un thermos di tè e ciò che il fiume decide di mostrare.",
    href: "/blog/slow-nile-felucca-days",
    image: {
      src: "/assets/stories/nile-sailing-aswan.webp",
      mid: "/assets/stories/nile-sailing-aswan.webp",
      wide: "/assets/stories/nile-sailing-aswan.webp",
      wideAt: 1440,
      alt: "Una feluca che si inclina dolcemente a vele spiegate sul Nilo, vicino ad Assuan, al tramonto.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Il periodo migliore per visitare l'Egitto, mese per mese",
    summary: "L'Egitto ha una stagione per ognuno: inverni freschi e limpidi per i templi, mesi di mezza stagione più tranquilli e convenienti e un modo intelligente di godersi perfino il caldo estivo. Ecco come si presenta davvero ogni mese, e quando andare e per cosa.",
    href: "/blog/best-time-to-visit-egypt",
    image: {
      src: "/assets/hero/hero-giza.webp",
      mid: "/assets/hero/hero-giza.webp",
      wide: "/assets/hero/hero-giza.webp",
      wideAt: 1440,
      alt: "Le piramidi di Giza sotto un limpido cielo azzurro invernale.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Guida alla Sua prima crociera sul Nilo",
    summary: "Com'è davvero una crociera sul Nilo: le cabine, la ristorazione, il ritmo quotidiano tra templi e navigazione, in quale direzione andare e come scegliere tra una grande motonave e un'intima dahabiya.",
    href: "/blog/first-time-nile-cruise",
    image: {
      src: "/assets/cta/fifty-nile-cruise.webp",
      mid: "/assets/cta/fifty-nile-cruise.webp",
      wide: "/assets/cta/fifty-nile-cruise.webp",
      wideAt: 1440,
      alt: "Una nave da crociera sul Nilo su acque calme accanto a una riva verde.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Sette giorni in Egitto: il nostro itinerario classico, spiegato",
    summary: "Il Cairo, Luxor e Assuan in una settimana senza sentirsi di corsa: il nostro classico itinerario di sette giorni, giorno per giorno, con i compromessi che facciamo perché i grandi momenti risaltino e il ritmo resti umano.",
    href: "/blog/seven-days-in-egypt",
    image: {
      src: "/assets/itineraries/cairo-heritage.webp",
      mid: "/assets/itineraries/cairo-heritage.webp",
      wide: "/assets/itineraries/cairo-heritage.webp",
      wideAt: 1440,
      alt: "Cupole e minareti del Cairo islamico storico nell'ora dorata.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Cosa mettere in valigia per l'Egitto (e cosa lasciare a casa)",
    summary: "La lista essenziale che conta davvero: strati per le fredde notti nel deserto, protezione solare che rispetti i siti, le scarpe giuste per le tombe e le cose che i neofiti portano sempre in eccesso. Con note per stagione.",
    href: "/blog/what-to-pack-for-egypt",
    image: {
      src: "/assets/activities/desert-safari.webp",
      mid: "/assets/activities/desert-safari.webp",
      wide: "/assets/activities/desert-safari.webp",
      wideAt: 1440,
      alt: "Una pista del deserto che punta verso le dune sotto un ampio cielo egiziano.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Oltre Giza: i siti antichi sottovalutati dell'Egitto",
    summary: "Una volta viste le piramidi, l'Egitto ha ancora molto da offrire: la piramide a gradoni di Saqqara, il soffitto dipinto di Dendera, Abido, Kom Ombo e i templi tranquilli dove potrebbe essere l'unico visitatore.",
    href: "/blog/beyond-giza-underrated-sites",
    image: {
      src: "/assets/activities/philae-temple.webp",
      mid: "/assets/activities/philae-temple.webp",
      wide: "/assets/activities/philae-temple.webp",
      wideAt: 1440,
      alt: "Le colonne del tempio di File che si ergono sul Nilo, vicino ad Assuan.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "L'Egitto con i bambini: guida al viaggio in famiglia",
    summary: "L'Egitto è un viaggio splendido con i bambini: mummie, cammelli e barche per tenerli sempre incuriositi. La nostra guida su ritmo, età, cibo, caldo e i tour che funzionano meglio in famiglia.",
    href: "/blog/egypt-with-kids-family-guide",
    image: {
      src: "/assets/activities/nubian-culture.webp",
      mid: "/assets/activities/nubian-culture.webp",
      wide: "/assets/activities/nubian-culture.webp",
      wideAt: 1440,
      alt: "Un vicolo di villaggio nubiano dipinto a colori vivaci sopra il Nilo, ad Assuan.",
    },
    credit: "Ptah Tours field archive",
  },
];

export const siteNavIt: typeof siteNav = {
  quickLinks: [
    { label: "Eventi e festival", href: "/events", iconKey: "calendar" },
    { label: "Quando venire", href: "/when-to-visit", iconKey: "weather" },
    { label: "Richieda l'eVisa", href: "/visa", iconKey: "ticket" },
    { label: "Il mio account", href: "/account", iconKey: "user" },
  ],
  directLinks: [
    { label: "Destinazioni", href: "/cities" },
    { label: "Idee di viaggio", href: "/trip-ideas" },
    { label: "Galleria", href: "/gallery" },
  ],
  buildTripCta: { label: "Pianifichi il mio viaggio", href: "/manage/trip-builder" },
  bookmarksHref: "/manage/trip-builder?tab=bookmarks",
  searchHref: "/search",
  popularSearches: [
    "Piramidi di Giza",
    "Crociera sul Nilo",
    "Mongolfiera a Luxor",
    "Snorkeling a Ras Mohammed",
    "Tour privato del Cairo",
    "Natale in Egitto",
  ],
  sections: [
    {
      key: "about",
      title: "Conoscere l'Egitto",
      columns: [
        {
          heading: "Destinazioni",
          links: [
            { label: "Il Cairo", href: "/cities/cairo" },
            { label: "Luxor", href: "/cities/luxor" },
            { label: "Assuan", href: "/cities/aswan" },
            { label: "Alessandria", href: "/cities/alexandria" },
            { label: "Hurghada", href: "/cities/hurghada" },
            { label: "Sharm el-Sheikh", href: "/cities/sharm-el-sheikh" },
          ],
        },
        {
          heading: "Conoscere il territorio",
          links: [
            { label: "Storia e patrimonio", href: "/heritage" },
            { label: "Stagioni e clima", href: "/when-to-visit" },
            { label: "Il Nilo", href: "/the-nile" },
            { label: "Deserti e oasi", href: "/deserts" },
            { label: "Le barriere del Mar Rosso", href: "/red-sea" },
          ],
        },
        {
          heading: "Buono a sapersi",
          links: [
            { label: "Viaggio responsabile", href: "/responsible-travel" },
            { label: "Accessibilità", href: "/accessibility" },
            { label: "Sicurezza e assistenza", href: "/contact" },
            { label: "Racconti e diario", href: "/blog" },
          ],
        },
      ],
      imageCtas: [
        {
          label: "Approfondimento sulla destinazione",
          heading: "L'antica Tebe",
          href: "/cities/luxor",
          image: { src: "/assets/hero/hero-thebes-portrait.webp", alt: "Una mongolfiera sui templi della riva occidentale di Luxor all'alba." },
        },
        {
          label: "Coste",
          heading: "Scopra il Mar Rosso",
          href: "/cities/sharm-el-sheikh",
          image: { src: "/assets/hero/hero-blue-hole-portrait.webp", alt: "Un sub in snorkeling che galleggia sul corallo della piattaforma di barriera del Blue Hole." },
        },
        {
          label: "Dal campo",
          heading: "Legga il diario",
          href: "/blog",
          image: { src: "/assets/stories/nile-sailing-aswan.webp", alt: "Una feluca a vela sul Nilo, vicino ad Assuan." },
        },
      ],
    },
    {
      key: "plan",
      title: "Pianifichi il viaggio",
      columns: [
        {
          heading: "Come arrivare",
          links: [
            { label: "Voli per l'Egitto", href: "/getting-here" },
            { label: "Visti e ingresso", href: "/visa" },
            { label: "Giorni di arrivo, gestiti", href: "/getting-here#arrivals" },
            { label: "Come spostarsi", href: "/getting-around" },
          ],
        },
        {
          heading: "Come decidere",
          links: [
            { label: "Quando venire", href: "/when-to-visit" },
            { label: "Quanti giorni", href: "/how-many-days" },
            { label: "Budget e mance", href: "/travel-tips" },
            { label: "Viaggiare con i bambini", href: "/family-travel" },
          ],
        },
        {
          heading: "La nostra promessa",
          links: [
            { label: "Come funzionano i viaggi Ptah", href: "/how-it-works" },
            { label: "Viaggio responsabile", href: "/responsible-travel" },
            { label: "Recensioni e accreditamenti", href: "/reviews" },
            { label: "Contatti il team", href: "/contact" },
          ],
        },
      ],
      imageCtas: [
        {
          label: "Consulenza gratuita",
          heading: "Parli con un egittologo",
          href: "/contact",
          image: { src: "/assets/activities/philae-felucca.webp", alt: "Una feluca che naviga verso il tempio di File sulle calme acque del Nilo." },
        },
        {
          label: "Esplora",
          heading: "Tutti i tour Ptah",
          href: "/tours",
          image: { src: "/assets/activities/valley-heritage.webp", alt: "Pareti dipinte di una tomba nella Valle dei Re." },
        },
        {
          label: "Ispirazione",
          heading: "Trovi idee di viaggio",
          href: "/trip-ideas",
          image: { src: "/assets/cta/plan-nile-portrait.webp", alt: "Una feluca sul Nilo, ad Assuan, tra i massi di granito." },
        },
      ],
    },
    {
      key: "tours",
      title: "Tour",
      columns: [
        {
          heading: "Per stile",
          links: [
            { label: "Egitto classico", href: "/tours?type=classic" },
            { label: "Crociere sul Nilo", href: "/tours?type=nile-cruise" },
            { label: "Mar Rosso e spiaggia", href: "/tours?type=red-sea" },
            { label: "Avventure nel deserto", href: "/tours?type=desert" },
          ],
        },
        {
          heading: "Per durata",
          links: [
            { label: "Tour di un giorno", href: "/tours?length=day" },
            { label: "Viaggi di 2–4 giorni", href: "/tours?length=short" },
            { label: "Itinerari di 5–9 giorni", href: "/tours?length=week" },
            { label: "Spedizioni di 10+ giorni", href: "/tours?length=grand" },
          ],
        },
        {
          heading: "Speciali",
          links: [
            { label: "Privati e su misura", href: "/tours?type=private" },
            { label: "Viaggi per famiglie", href: "/tours?type=family" },
            { label: "Lune di miele", href: "/tours?type=honeymoon" },
            { label: "Partenze last minute", href: "/tours?filter=departing-soon" },
          ],
        },
      ],
      imageCtas: [
        {
          label: "Viaggio simbolo",
          heading: "Egitto classico, 8 giorni",
          href: "/tours?type=classic",
          image: { src: "/assets/itineraries/giza-essentials.webp", alt: "La Grande Piramide di Giza con una guida e il suo cammello in primo piano." },
        },
        {
          label: "Sul fiume",
          heading: "Collezione crociere sul Nilo",
          href: "/tours?type=nile-cruise",
          image: { src: "/assets/tour-types/nile-cruise.webp", alt: "Mongolfiere che si alzano sulla valle del Nilo, vicino a Luxor, alle prime luci." },
        },
        {
          label: "Sott'acqua",
          heading: "Viaggi di immersione e snorkeling",
          href: "/tours?type=red-sea",
          image: { src: "/assets/activities/blue-hole-dive.webp", alt: "Un sub in snorkeling sulla piattaforma corallina al Blue Hole di Dahab." },
        },
      ],
    },
    {
      key: "journal",
      title: "Diario",
      columns: [
        {
          heading: "Inizi da qui",
          links: [
            { label: "Il periodo migliore per venire", href: "/blog/best-time-to-visit-egypt" },
            { label: "La prima crociera sul Nilo", href: "/blog/first-time-nile-cruise" },
            { label: "Itinerario di 7 giorni", href: "/blog/seven-days-in-egypt" },
            { label: "Cosa mettere in valigia", href: "/blog/what-to-pack-for-egypt" },
          ],
        },
        {
          heading: "Luoghi e racconti",
          links: [
            { label: "Il Cairo oltre la guida", href: "/blog/cairo-beyond-the-guidebook" },
            { label: "L'anima di Alessandria", href: "/blog/alexandria-mediterranean-soul" },
            { label: "Oltre Giza", href: "/blog/beyond-giza-underrated-sites" },
            { label: "Una sera a Karnak", href: "/blog/karnak-sound-and-light" },
          ],
        },
        {
          heading: "Viaggiare con criterio",
          links: [
            { label: "L'Egitto con i bambini", href: "/blog/egypt-with-kids-family-guide" },
            { label: "Galateo delle barriere del Mar Rosso", href: "/blog/red-sea-reef-etiquette" },
            { label: "Giornate lente in feluca sul Nilo", href: "/blog/slow-nile-felucca-days" },
            { label: "Tutti gli articoli del diario", href: "/blog" },
          ],
        },
      ],
      imageCtas: [
        {
          label: "Pianificazione del viaggio",
          heading: "Quando visitare l'Egitto",
          href: "/blog/best-time-to-visit-egypt",
          image: { src: "/assets/hero/hero-giza-portrait.webp", alt: "Le piramidi di Giza sotto un limpido cielo invernale." },
        },
        {
          label: "Sul fiume",
          heading: "Una prima crociera sul Nilo",
          href: "/blog/first-time-nile-cruise",
          image: { src: "/assets/cta/fifty-nile-cruise.webp", alt: "Una nave da crociera sul Nilo ormeggiata accanto a una riva verde." },
        },
        {
          label: "In famiglia",
          heading: "L'Egitto con i bambini",
          href: "/blog/egypt-with-kids-family-guide",
          image: { src: "/assets/activities/nubian-culture.webp", alt: "Un vicolo di villaggio nubiano dipinto a colori vivaci sopra il Nilo, ad Assuan." },
        },
      ],
    },
  ],
};

export const footerContentIt: typeof footerContent = {
  newsletter: {
    heading: "Si iscriva!",
    blurb:
      "Idee di viaggio, partenze stagionali e qualche dispaccio dal deserto: poche volte al mese, mai spam.",
    cta: { label: "Si iscriva alla newsletter", href: "/newsletter" },
  },
  badgeHeading: "Con il patrocinio di",
  badges: [
    { heading: "ETF", sub: "Membro 2026", href: "/about#accreditation" },
    { heading: "Travelife", sub: "Partner", href: "/responsible-travel" },
  ],
  partnersHeading: "Partner di viaggio",
  partners: [
    { name: "Egypt Air", tagline: "Vettore ufficiale partner", href: "https://www.egyptair.com" },
    { name: "IATA", tagline: "Agenzia accreditata", href: "https://www.iata.org" },
    { name: "Visit Egypt", tagline: "Ente del Turismo Egiziano", href: "https://www.experienceegypt.eg" },
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
        { label: "Chi siamo", href: "/about" },
        { label: "I nostri egittologi", href: "/about#team" },
        { label: "Lavora con noi", href: "/careers" },
        { label: "Stampa e media", href: "/press" },
        { label: "Contatti", href: "/contact" },
      ],
    },
    {
      heading: "Viaggia con noi",
      links: [
        { label: "Tutti i tour", href: "/tours" },
        { label: "Idee di viaggio", href: "/trip-ideas" },
        { label: "Crociere sul Nilo", href: "/tours?type=nile-cruise" },
        { label: "Viaggi privati", href: "/tours?type=private" },
        { label: "Viaggio responsabile", href: "/responsible-travel" },
        { label: "Galleria fotografica", href: "/gallery" },
      ],
    },
    {
      heading: "Aiuto e informazioni",
      links: [
        { label: "Quando venire", href: "/when-to-visit" },
        { label: "Visti e ingresso", href: "/visa" },
        { label: "Traccia la mia prenotazione", href: "/track-booking" },
        { label: "Salute e sicurezza", href: "/travel-tips" },
        { label: "Domande frequenti", href: "/faqs" },
      ],
    },
  ],
  legalLinks: [
    { label: "Informativa sulla privacy", href: "/privacy-policy" },
    { label: "Termini e condizioni", href: "/terms-of-service" },
    { label: "Politica sui cookie", href: "/cookie-policy" },
  ],
  copyrightLine: "© {year} Ptah Tours. Tutti i diritti riservati.",
  acknowledgement:
    "Ptah Tours ha sede al Cairo e opera in tutto l'Egitto: la valle del Nilo, il Delta, il Sinai e il Deserto Occidentale. Viaggiamo con egittologi autorizzati, retribuiamo equamente i nostri equipaggi e pianifichiamo ogni itinerario perché dia alle comunità e ai siti del patrimonio egiziano più di quanto tolga.",
  cookie: {
    heading: "Teniamo alla Sua privacy",
    copy: "Utilizziamo i cookie per migliorare la Sua esperienza di navigazione, offrire contenuti personalizzati e analizzare il nostro traffico. Facendo clic su Accetta tutto, acconsente all'uso dei cookie. Può cambiare idea in qualsiasi momento dal piè di pagina.",
    manageHeading: "Gestisca le Sue preferenze sui cookie",
    categories: [
      {
        key: "preferences",
        name: "Preferenze",
        description: "Ricordano scelte come la lingua, la valuta e i Suoi viaggi salvati.",
      },
      {
        key: "analytics",
        name: "Statistiche",
        description: "Statistiche anonime che ci aiutano a capire quali viaggi e pagine i viaggiatori preferiscono.",
      },
      {
        key: "marketing",
        name: "Marketing",
        description: "Misurano le nostre campagne e mostrano contenuti Ptah Tours più pertinenti altrove.",
      },
    ],
  },
};

export const landingContentIt: typeof landingContent = {
  hero: heroSlidesIt,
  inspiredTabs: inspiredTabsIt,
  planCta: planCtaIt,
  fiftyCtas: fiftyCtasIt,
  kbygItems: kbygItemsIt,
  tourTypes: tourTypesIt,
  stories: storiesIt,
} as const;
