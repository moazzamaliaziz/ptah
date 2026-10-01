/**
 * Landing page content (French) — mirrors every exported const of
 * `src/content/landing.ts` with an `Fr` suffix. Structural fields
 * (src, href, iconKey, buttonType, trackingContext, target, wideAt,
 * numbers, enums, network, partner/badge names, credits, {year}) are
 * kept verbatim; only human-readable string values are translated.
 *
 * Typography authored natural (regular spaces, « », U+2019 apostrophes);
 * a final Node pass inserts real U+00A0 before ; : ! ? and inside « ».
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

export const siteMetaFr: { name: string; legalName: string; tagline: string } = {
  name: "Ptah Tours",
  legalName: "Ptah Tours for Tourism LLC",
  tagline: "L’Égypte, façonnée par ceux qui y sont chez eux",
};

export const heroSlidesFr: HeroSlide[] = [
  {
    id: "giza",
    season: "summer",
    title: "Marchez parmi la dernière merveille du monde antique",
    shortLabel: "les pyramides de Gizeh",
    subtitle: "Des matinées privées à Gizeh, menées par un égyptologue, avant l’arrivée de la foule.",
    image: {
      src: "/assets/hero/hero-giza-portrait.webp",
      mid: "/assets/hero/hero-giza.webp",
      alt: "La grande pyramide de Khéops et le Sphinx de Gizeh dans la lumière chaude du matin, le plateau du Caire en arrière-plan.",
      credit: "Ptah Tours field archive",
    },
    hotspots: [
      { xPct: 30, yPct: 44, label: "Grande pyramide de Khéops", href: "/trip-ideas/panorama-of-the-pyramids" },
      { xPct: 62, yPct: 70, label: "Le grand Sphinx", href: "/trip-ideas/panorama-of-the-pyramids" },
    ],
  },
  {
    id: "thebes",
    season: "summer",
    title: "Survolez les tombes de Thèbes aux premières lueurs",
    shortLabel: "la montgolfière au-dessus de Louxor",
    subtitle: "Montgolfières à l’aube, la vallée des Rois et Karnak avant la chaleur.",
    image: {
      src: "/assets/hero/hero-thebes-portrait.webp",
      mid: "/assets/hero/hero-thebes.webp",
      alt: "Une montgolfière dérivant au-dessus de la rive occidentale de Louxor au lever du soleil, la ceinture verte du Nil en contrebas.",
      credit: "Ptah Tours field archive",
    },
    hotspots: [
      { xPct: 26, yPct: 38, label: "Montgolfières à l’aube", href: "/trip-ideas/luxor-sunrise-weekend" },
      { xPct: 68, yPct: 62, label: "Vallée des Rois", href: "/trip-ideas/kings-and-queens-of-thebes" },
    ],
  },
  {
    id: "blue-hole",
    season: "summer",
    title: "Plongez dans le bleu : le récif vivant du Sinaï",
    shortLabel: "la côte du Blue Hole",
    subtitle: "Faites du snorkeling au Blue Hole, à Ras Abu Galum et à Ras Mohammed avec des guides de plongée diplômés.",
    image: {
      src: "/assets/hero/hero-blue-hole-portrait.webp",
      mid: "/assets/hero/hero-blue-hole.webp",
      alt: "Le cercle d’un bleu profond du Blue Hole de Dahab vu d’en haut, cerné par le platier clair du récif et les montagnes du Sinaï.",
      credit: "Ptah Tours field archive",
    },
    hotspots: [
      { xPct: 40, yPct: 46, label: "Le gouffre du Blue Hole", href: "/trip-ideas/blue-hole-sinai" },
      { xPct: 66, yPct: 30, label: "La côte de Ras Abu Galum", href: "/trip-ideas/blue-hole-sinai" },
    ],
  },
];

export const inspiredTabsFr: InspiredTab[] = [
  {
    key: "itineraries",
    label: "Itinéraires",
    cards: [
      { title: "Panorama des pyramides", href: "/trip-ideas/panorama-of-the-pyramids", days: 2, experiences: 6, image: { src: "/assets/itineraries/giza-essentials.webp", alt: "Un chameau passant devant la grande pyramide de Khéops sur le plateau de Gizeh." } },
      { title: "Week-end patrimoine au Caire", href: "/trip-ideas/cairo-heritage-weekend", days: 3, experiences: 9, image: { src: "/assets/itineraries/cairo-heritage.webp", alt: "Vitrines et objets dorés à l’intérieur du Musée égyptien du Caire." } },
      { title: "Karnak le jour, le temple de Louxor la nuit", href: "/trip-ideas/karnak-luxor-evening", days: 2, experiences: 7, image: { src: "/assets/itineraries/karnak-evening.webp", alt: "Les colonnes illuminées du temple de Louxor au crépuscule, ambrées sur un ciel d’un bleu profond." } },
      { title: "Rois et reines de Thèbes", href: "/trip-ideas/kings-and-queens-of-thebes", days: 3, experiences: 8, image: { src: "/assets/itineraries/valley-of-kings.webp", alt: "Des falaises dorées descendant vers les tombes de la vallée des Rois." } },
      { title: "L’île de Philae et le haut barrage", href: "/trip-ideas/philae-island-aswan", days: 2, experiences: 5, image: { src: "/assets/itineraries/philae-island.webp", alt: "Le temple insulaire de Philae abordé en bateau sur une eau bleue et calme." } },
      { title: "Le village nubien en felouque", href: "/trip-ideas/nubian-village-aswan", days: 2, experiences: 6, image: { src: "/assets/itineraries/nubian-village.webp", alt: "Une maison de village nubien peinte d’ocre vif et de bleu, au-dessus du Nil." } },
      { title: "Alexandrie en un week-end", href: "/trip-ideas/alexandria-weekend", days: 2, experiences: 7, image: { src: "/assets/itineraries/alexandria-classics.webp", alt: "Le toit incurvé de la moderne Bibliotheca Alexandrina face à la Méditerranée." } },
      { title: "Le sommet du Sinaï et Sainte-Catherine", href: "/trip-ideas/sinai-summit-st-catherines", days: 2, experiences: 4, image: { src: "/assets/itineraries/sinai-summit.webp", alt: "Des randonneurs sur le chemin des chameaux menant au sommet du mont Sinaï, sous un ciel d’avant l’aube." } },
    ],
  },
  {
    key: "adventure",
    label: "Aventure",
    cards: [
      { title: "Snorkeling au Blue Hole", href: "/trip-ideas/blue-hole-sinai", image: { src: "/assets/activities/blue-hole-dive.webp", alt: "Un adepte du snorkeling flottant au-dessus du platier corallien, au bord du Blue Hole." } },
      { title: "Randonnée dans le Canyon coloré", href: "/trip-ideas/colored-canyon-sinai", image: { src: "/assets/activities/colored-canyon.webp", alt: "Des bandes de roche rouge, or et crème ondulant à travers la gorge du Canyon coloré." } },
      { title: "Safari en quad au coucher du soleil", href: "/trip-ideas/desert-safari-quad-sunset", image: { src: "/assets/activities/desert-safari.webp", alt: "Des quads soulevant des traînées de poussière sur une plaine désertique orangée au coucher du soleil." } },
      { title: "Journée en bateau en mer Rouge", href: "/trip-ideas/red-sea-boat-snorkeling", image: { src: "/assets/activities/boat-snorkeling.webp", alt: "Un bateau de plongée blanc ancré au-dessus d’une eau de récif turquoise, en mer Rouge." } },
    ],
  },
  {
    key: "culture",
    label: "Culture",
    cards: [
      { title: "Le Musée égyptien, en visite guidée", href: "/trip-ideas/egyptian-museum-guided", image: { src: "/assets/activities/museum-tahrir.webp", alt: "Statues de pierre sculptées et sarcophages dans les galeries du Musée égyptien." } },
      { title: "Khan el-Khalili à la nuit tombée", href: "/trip-ideas/khan-el-khalili-night", image: { src: "/assets/activities/khan-el-khalili.webp", alt: "Des étals de lanternes rougeoyant dans le bazar de Khan el-Khalili, la nuit." } },
      { title: "Le thé chez une famille nubienne", href: "/trip-ideas/nubian-village-aswan", image: { src: "/assets/activities/nubian-culture.webp", alt: "Une cour nubienne peinte, une famille réunie autour du thé." } },
      { title: "La Bibliotheca Alexandrina et Qaitbay", href: "/trip-ideas/alexandria-weekend", image: { src: "/assets/activities/bibliotheca.webp", alt: "La façade de granit inclinée de la Bibliotheca Alexandrina accrochant le soleil." } },
    ],
  },
  {
    key: "river-sea",
    label: "Fleuve et mer",
    cards: [
      { title: "En felouque autour de Philae", href: "/trip-ideas/philae-island-aswan", image: { src: "/assets/activities/philae-felucca.webp", alt: "Une felouque à la voile blanche glissant vers le temple de Philae, à travers le Nil." } },
      { title: "Journée en bateau à Ras Mohammed", href: "/trip-ideas/ras-mohammed-park", image: { src: "/assets/activities/ras-mohammed.webp", alt: "Des hauts-fonds turquoise et limpides et un récif visibles depuis un bateau, à Ras Mohammed." } },
      { title: "Felouque au coucher du soleil, Louxor", href: "/trip-ideas/luxor-sunrise-weekend", image: { src: "/assets/activities/nile-sunset-felucca.webp", alt: "La voile d’une felouque captant les dernières lueurs orangées sur le Nil, à Louxor." } },
      { title: "Snorkeling sur les récifs maison", href: "/trip-ideas/red-sea-boat-snorkeling", image: { src: "/assets/activities/red-sea-boat.webp", alt: "Des adeptes du snorkeling dérivant au-dessus des jardins de corail, le long de la côte de la mer Rouge." } },
    ],
  },
  {
    key: "heritage",
    label: "Patrimoine",
    cards: [
      { title: "La grande salle hypostyle", href: "/trip-ideas/karnak-luxor-evening", image: { src: "/assets/activities/karnak-hypostyle.webp", alt: "D’immenses colonnes à chapiteaux en boutons de papyrus se pressant dans la salle hypostyle de Karnak." } },
      { title: "Au cœur de la vallée des Rois", href: "/trip-ideas/kings-and-queens-of-thebes", image: { src: "/assets/activities/valley-heritage.webp", alt: "Les parois peintes d’un couloir de tombe rougeoyant sous l’éclairage de conservation, dans la vallée des Rois." } },
      { title: "Philae : le temple d’Isis", href: "/trip-ideas/philae-island-aswan", image: { src: "/assets/activities/philae-temple.webp", alt: "Le portail sculpté du temple de Philae, dédié à la déesse Isis." } },
      { title: "Les gardiens de Gizeh", href: "/trip-ideas/panorama-of-the-pyramids", image: { src: "/assets/activities/sphinx-guardians.webp", alt: "Le Sphinx au regard perdu au-delà de l’objectif, la pyramide de Khéphren en arrière-plan." } },
    ],
  },
];

export const planCtaFr: PlanCtaBlock = {
  title: "Composez le voyage de vos rêves",
  copy: "Dites à notre studio du Caire ce dont vous rêvez — les pyramides à l’aube, une paisible boucle du Nil entre deux temples, une semaine sur le récif — et un concepteur de voyage dédié bâtira l’itinéraire avec vous, message après message.",
  image: {
    src: "/assets/cta/plan-nile-portrait.webp",
    mid: "/assets/cta/plan-karnak-landscape.webp",
    wide: "/assets/cta/plan-karnak-landscape.webp",
    wideAt: 1440,
    alt: "Une felouque glissant devant les palmiers sur le Nil, à Assouan, des blocs de granit marquant la première cataracte.",
  },
  credit: "Ptah Tours field archive — Aswan",
  cta: {
    type: "customButton",
    button: { buttonType: "buildATrip", trackingContext: "HomePageFullPageCTA", href: "/manage/trip-builder" },
    label: "Commencer à planifier",
  },
};

export const fiftyCtasFr: [FiftyCta, FiftyCta] = [
  {
    title: "Conçu autour de vous",
    copy: "Chaque voyage Ptah est privé et sur mesure — votre guide, votre rythme, votre itinéraire. Rien de standard.",
    cta: { label: "Concevoir mon voyage", href: "/contact" },
    image: {
      src: "/assets/cta/fifty-bespoke-journeys.webp",
      mid: "/assets/cta/fifty-bespoke-journeys.webp",
      wide: "/assets/cta/fifty-bespoke-journeys.webp",
      wideAt: 1128,
      alt: "Une vue en contre-plongée à travers les colonnes du temple de Louxor, vers un ciel lumineux.",
    },
  },
  {
    title: "Naviguez sur le Nil avec style",
    copy: "Des croisières de quatre à sept nuits entre Louxor et Assouan, avec des cabines que nous avons inspectées nous-mêmes.",
    cta: { label: "Explorer le Nil", href: "/the-nile" },
    image: {
      src: "/assets/cta/fifty-nile-cruise.webp",
      mid: "/assets/cta/fifty-nile-cruise.webp",
      wide: "/assets/cta/fifty-nile-cruise.webp",
      wideAt: 1128,
      alt: "Un bateau de croisière amarré sur la rive occidentale, près d’Assouan, à l’heure dorée.",
    },
  },
];

export const kbygItemsFr: [KbygItem, KbygItem, KbygItem, KbygItem] = [
  {
    iconKey: "weather",
    title: "Quand partir",
    copy: "D’octobre à avril, c’est la saison des temples ; la mer Rouge brille toute l’année. Nous accorderons vos dates à la bonne carte.",
    cta: { label: "Voir les saisons", href: "/when-to-visit" },
  },
  {
    iconKey: "ticket",
    title: "Entrée et visas",
    copy: "La plupart des nationalités peuvent obtenir un e-visa en ligne en quelques minutes. Nous envoyons à chaque voyageur un guide d’arrivée pas à pas.",
    cta: { label: "Vérifier les formalités", href: "/visa" },
  },
  {
    iconKey: "travel",
    title: "Se déplacer",
    copy: "Des chauffeurs privés par défaut, le train en première classe et des vols intérieurs sur les longs trajets, des felouques pour les moments de plaisir.",
    cta: { label: "Comment nous voyageons", href: "/getting-around" },
  },
  {
    iconKey: "info",
    title: "Parler à une vraie personne",
    copy: "Des vétérans du Nil, pas un centre d’appels. WhatsApp, téléphone ou e-mail — vous joindrez l’équipe qui conçoit le voyage.",
    cta: { label: "Nous contacter", href: "/contact" },
  },
];

export const tourTypesFr: [TourType, TourType, TourType, TourType] = [
  {
    title: "L’Égypte classique",
    blurb: "Les pyramides, les temples de Louxor et les grands musées — le circuit essentiel, fait comme il se doit.",
    href: "/tours?type=classic",
    image: { src: "/assets/tour-types/classic-egypt.webp", alt: "Les pylônes du temple de Philae se reflétant dans le Nil, par un matin calme d’Assouan." },
  },
  {
    title: "Croisières sur le Nil",
    blurb: "Dormez sur le fleuve : des ponts de Louxor à Assouan, des mouillages privés et des escales aux temples en chemin.",
    href: "/tours?type=nile-cruise",
    image: { src: "/assets/tour-types/nile-cruise.webp", alt: "Des montgolfières s’élevant au-dessus de la vallée du Nil, à l’ouest de Louxor, au lever du soleil." },
  },
  {
    title: "Mer Rouge et plage",
    blurb: "Hurghada, Charm el-Cheikh et Dahab — des journées sur le récif, des sorties en bateau et de vraies pauses.",
    href: "/tours?type=red-sea",
    image: { src: "/assets/tour-types/red-sea-escape.webp", alt: "Le soleil se couchant sur la mer Rouge, la silhouette d’une dahabieh au large." },
  },
  {
    title: "Aventures dans le désert",
    blurb: "Des campements dans le désert Blanc, des sommets du Sinaï, des virées dans les oasis — l’Égypte au-delà des rives du fleuve.",
    href: "/tours?type=desert",
    image: { src: "/assets/tour-types/desert-adventure.webp", alt: "Une piste de 4x4 serpentant dans les dunes orangées vers un campement du désert, au crépuscule." },
  },
];

export const storiesFr: Story[] = [
  {
    title: "Le Caire au-delà du guide",
    summary: "Où les Cairotes mangent vraiment le koshari, la mosquée au plus beau coucher de soleil du Caire, et pourquoi les salles du fond du Musée égyptien valent mieux que la galerie célèbre — cinq jours à arpenter la capitale avec notre équipe de terrain.",
    href: "/blog/cairo-beyond-the-guidebook",
    image: { src: "/assets/stories/cairo-experience.webp", mid: "/assets/stories/cairo-experience.webp", wide: "/assets/stories/cairo-experience.webp", wideAt: 1440, alt: "Le Caire au bord du Nil au crépuscule, minarets et ponts superposés dans un ciel violet." },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Une soirée à Karnak, rien qu’à vous",
    summary: "Le spectacle son et lumière a mauvaise réputation — voici comment nos guides le programment pour que la salle hypostyle soit presque déserte, et ce que le concepteur lumière a réussi avec les obélisques.",
    href: "/blog/karnak-sound-and-light",
    image: { src: "/assets/stories/karnak-sound-light.webp", mid: "/assets/stories/karnak-sound-light.webp", wide: "/assets/stories/karnak-sound-light.webp", wideAt: 1440, alt: "Les grandes colonnes de Karnak éclairées d’ambre sur un ciel bleu nuit, pendant le spectacle du soir." },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Alexandrie : l’âme méditerranéenne de l’Égypte",
    summary: "À deux heures du Caire et à un monde de là — les fruits de mer au marché aux poissons, la nouvelle bibliothèque, les catacombes et une promenade sur la Corniche qui explique tous les Alexandrins que vous avez pu rencontrer.",
    href: "/blog/alexandria-mediterranean-soul",
    image: { src: "/assets/stories/alexandria-mediterranean.webp", mid: "/assets/stories/alexandria-mediterranean.webp", wide: "/assets/stories/alexandria-mediterranean.webp", wideAt: 1440, alt: "La Corniche d’Alexandrie s’incurvant le long de la Méditerranée vers la citadelle, à l’aube." },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Faire du snorkeling en mer Rouge sans lui nuire",
    summary: "Les conseils de flottabilité de nos guides de plongée, pourquoi nous ne nourrissons jamais les poissons, les règles de crème solaire sur chaque bateau Ptah, et les trois récifs près de Charm el-Cheikh où vous ne croiserez presque aucun autre groupe.",
    href: "/blog/red-sea-reef-etiquette",
    image: { src: "/assets/stories/red-sea-reef.webp", mid: "/assets/stories/red-sea-reef.webp", wide: "/assets/stories/red-sea-reef.webp", wideAt: 1440, alt: "Un jardin de corail où filent des anthias, dans les eaux claires et peu profondes d’un récif maison de la mer Rouge." },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Éloge de la felouque : les journées lentes du Nil",
    summary: "Pas de moteur, pas d’itinéraire plus strict que le vent. Pourquoi notre après-midi préféré à Assouan, c’est une voile de toile, un thermos de thé et tout ce que le fleuve décide de vous montrer.",
    href: "/blog/slow-nile-felucca-days",
    image: { src: "/assets/stories/nile-sailing-aswan.webp", mid: "/assets/stories/nile-sailing-aswan.webp", wide: "/assets/stories/nile-sailing-aswan.webp", wideAt: 1440, alt: "Une felouque gîtant doucement toutes voiles dehors sur le Nil, près d’Assouan, au coucher du soleil." },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Le meilleur moment pour visiter l’Égypte, mois par mois",
    summary: "L’Égypte a une saison pour chacun — des hivers frais et limpides pour les temples, des demi-saisons calmes pour le rapport qualité-prix, et une manière avisée de profiter même de la chaleur de l’été. Voici ce que chaque mois donne vraiment, et quand partir pour quoi.",
    href: "/blog/best-time-to-visit-egypt",
    image: { src: "/assets/hero/hero-giza.webp", mid: "/assets/hero/hero-giza.webp", wide: "/assets/hero/hero-giza.webp", wideAt: 1440, alt: "Les pyramides de Gizeh sous un ciel d’hiver d’un bleu limpide." },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Le guide du débutant pour une croisière sur le Nil",
    summary: "Ce qu’est vraiment une croisière sur le Nil — les cabines, la table, le rythme quotidien entre temples et navigation, dans quel sens partir, et comment choisir entre un grand bateau fluvial et une dahabieh intime.",
    href: "/blog/first-time-nile-cruise",
    image: { src: "/assets/cta/fifty-nile-cruise.webp", mid: "/assets/cta/fifty-nile-cruise.webp", wide: "/assets/cta/fifty-nile-cruise.webp", wideAt: 1440, alt: "Un bateau de croisière sur une eau calme, au bord d’une rive verdoyante." },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Sept jours en Égypte : notre itinéraire classique, décrypté",
    summary: "Le Caire, Louxor et Assouan en une semaine sans se sentir bousculé — notre itinéraire classique de sept jours, jour après jour, avec les compromis que nous faisons pour que les temps forts marquent et que le rythme reste humain.",
    href: "/blog/seven-days-in-egypt",
    image: { src: "/assets/itineraries/cairo-heritage.webp", mid: "/assets/itineraries/cairo-heritage.webp", wide: "/assets/itineraries/cairo-heritage.webp", wideAt: 1440, alt: "Les dômes et les minarets du Caire islamique historique, à l’heure dorée." },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Que mettre dans sa valise pour l’Égypte (et que laisser)",
    summary: "La courte liste qui compte vraiment — des couches pour les nuits froides du désert, une protection solaire qui respecte les sites, les bonnes chaussures pour les tombes, et ce que les débutants emportent toujours en trop. Notes de saison incluses.",
    href: "/blog/what-to-pack-for-egypt",
    image: { src: "/assets/activities/desert-safari.webp", mid: "/assets/activities/desert-safari.webp", wide: "/assets/activities/desert-safari.webp", wideAt: 1440, alt: "Une piste du désert filant vers les dunes sous un vaste ciel égyptien." },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Au-delà de Gizeh : les sites antiques sous-estimés de l’Égypte",
    summary: "Une fois les pyramides vues, l’Égypte continue — la pyramide à degrés de Saqqarah, le plafond peint de Dendérah, Abydos, Kôm Ombo et les temples tranquilles où vous serez peut-être les seuls visiteurs.",
    href: "/blog/beyond-giza-underrated-sites",
    image: { src: "/assets/activities/philae-temple.webp", mid: "/assets/activities/philae-temple.webp", wide: "/assets/activities/philae-temple.webp", wideAt: 1440, alt: "Les colonnes du temple de Philae s’élevant au-dessus du Nil, près d’Assouan." },
    credit: "Ptah Tours field archive",
  },
  {
    title: "L’Égypte avec des enfants : guide du voyage en famille",
    summary: "L’Égypte est un superbe voyage avec des enfants — des momies, des chameaux et des bateaux pour les tenir en haleine. Notre guide sur le rythme, les âges, la nourriture, la chaleur et les circuits qui conviennent le mieux aux familles.",
    href: "/blog/egypt-with-kids-family-guide",
    image: { src: "/assets/activities/nubian-culture.webp", mid: "/assets/activities/nubian-culture.webp", wide: "/assets/activities/nubian-culture.webp", wideAt: 1440, alt: "Une ruelle de village nubien aux couleurs vives, au-dessus du Nil, à Assouan." },
    credit: "Ptah Tours field archive",
  },
];

export const siteNavFr: SiteNav = {
  quickLinks: [
    { label: "Événements et festivals", href: "/events", iconKey: "calendar" },
    { label: "Quand partir", href: "/when-to-visit", iconKey: "weather" },
    { label: "Réservez votre e-visa", href: "/visa", iconKey: "ticket" },
    { label: "Mon compte", href: "/account", iconKey: "user" },
  ],
  directLinks: [
    { label: "Destinations", href: "/cities" },
    { label: "Idées de voyage", href: "/trip-ideas" },
    { label: "Galerie", href: "/gallery" },
  ],
  buildTripCta: { label: "Composer mon voyage", href: "/manage/trip-builder" },
  bookmarksHref: "/manage/trip-builder?tab=bookmarks",
  searchHref: "/search",
  popularSearches: [
    "Pyramides de Gizeh",
    "Croisière sur le Nil",
    "Montgolfière à Louxor",
    "Snorkeling à Ras Mohammed",
    "Circuit privé au Caire",
    "Noël en Égypte",
  ],
  sections: [
    {
      key: "about",
      title: "À propos de l’Égypte",
      columns: [
        {
          heading: "Destinations",
          links: [
            { label: "Le Caire", href: "/cities/cairo" },
            { label: "Louxor", href: "/cities/luxor" },
            { label: "Assouan", href: "/cities/aswan" },
            { label: "Alexandrie", href: "/cities/alexandria" },
            { label: "Hurghada", href: "/cities/hurghada" },
            { label: "Charm el-Cheikh", href: "/cities/sharm-el-sheikh" },
          ],
        },
        {
          heading: "Connaître le pays",
          links: [
            { label: "Histoire et patrimoine", href: "/heritage" },
            { label: "Saisons et climat", href: "/when-to-visit" },
            { label: "Le Nil", href: "/the-nile" },
            { label: "Déserts et oasis", href: "/deserts" },
            { label: "Récifs de la mer Rouge", href: "/red-sea" },
          ],
        },
        {
          heading: "Bon à savoir",
          links: [
            { label: "Voyage responsable", href: "/responsible-travel" },
            { label: "Accessibilité", href: "/accessibility" },
            { label: "Sécurité et assistance", href: "/contact" },
            { label: "Récits et journal", href: "/blog" },
          ],
        },
      ],
      imageCtas: [
        { label: "Plongée dans une destination", heading: "Thèbes antique", href: "/cities/luxor", image: { src: "/assets/hero/hero-thebes-portrait.webp", alt: "Une montgolfière au-dessus des temples de la rive occidentale de Louxor, à l’aube." } },
        { label: "Littoraux", heading: "Rencontrez la mer Rouge", href: "/cities/sharm-el-sheikh", image: { src: "/assets/hero/hero-blue-hole-portrait.webp", alt: "Un adepte du snorkeling dérivant au-dessus du corail, sur le platier du Blue Hole." } },
        { label: "Depuis le terrain", heading: "Lire le journal", href: "/blog", image: { src: "/assets/stories/nile-sailing-aswan.webp", alt: "Une felouque toutes voiles dehors sur le Nil, près d’Assouan." } },
      ],
    },
    {
      key: "plan",
      title: "Préparez votre voyage",
      columns: [
        {
          heading: "S’y rendre",
          links: [
            { label: "Vols vers l’Égypte", href: "/getting-here" },
            { label: "Visas et entrée", href: "/visa" },
            { label: "Jours d’arrivée, pris en charge", href: "/getting-here#arrivals" },
            { label: "Se déplacer", href: "/getting-around" },
          ],
        },
        {
          heading: "Décider",
          links: [
            { label: "Quand partir", href: "/when-to-visit" },
            { label: "Combien de jours", href: "/how-many-days" },
            { label: "Budget et pourboires", href: "/travel-tips" },
            { label: "Voyager avec des enfants", href: "/family-travel" },
          ],
        },
        {
          heading: "Notre promesse",
          links: [
            { label: "Comment fonctionnent les voyages Ptah", href: "/how-it-works" },
            { label: "Voyage responsable", href: "/responsible-travel" },
            { label: "Avis et accréditation", href: "/reviews" },
            { label: "Contacter l’équipe", href: "/contact" },
          ],
        },
      ],
      imageCtas: [
        { label: "Consultation gratuite", heading: "Parler à un égyptologue", href: "/contact", image: { src: "/assets/activities/philae-felucca.webp", alt: "Une felouque cinglant vers le temple de Philae sur une eau calme du Nil." } },
        { label: "Parcourir", heading: "Tous les circuits Ptah", href: "/tours", image: { src: "/assets/activities/valley-heritage.webp", alt: "Les parois peintes d’une tombe dans la vallée des Rois." } },
        { label: "Inspiration", heading: "Trouver des idées de voyage", href: "/trip-ideas", image: { src: "/assets/cta/plan-nile-portrait.webp", alt: "Une felouque sur le Nil, à Assouan, entre des blocs de granit." } },
      ],
    },
    {
      key: "tours",
      title: "Circuits",
      columns: [
        {
          heading: "Par style",
          links: [
            { label: "L’Égypte classique", href: "/tours?type=classic" },
            { label: "Croisières sur le Nil", href: "/tours?type=nile-cruise" },
            { label: "Mer Rouge et plage", href: "/tours?type=red-sea" },
            { label: "Aventures dans le désert", href: "/tours?type=desert" },
          ],
        },
        {
          heading: "Par durée",
          links: [
            { label: "Excursions à la journée", href: "/tours?length=day" },
            { label: "Voyages de 2 à 4 jours", href: "/tours?length=short" },
            { label: "Voyages de 5 à 9 jours", href: "/tours?length=week" },
            { label: "Expéditions de 10 jours et plus", href: "/tours?length=grand" },
          ],
        },
        {
          heading: "Spécial",
          links: [
            { label: "Privé et sur mesure", href: "/tours?type=private" },
            { label: "Voyages en famille", href: "/tours?type=family" },
            { label: "Lunes de miel", href: "/tours?type=honeymoon" },
            { label: "Départs de dernière minute", href: "/tours?filter=departing-soon" },
          ],
        },
      ],
      imageCtas: [
        { label: "Voyage signature", heading: "L’Égypte classique, 8 jours", href: "/tours?type=classic", image: { src: "/assets/itineraries/giza-essentials.webp", alt: "La grande pyramide de Gizeh, un chamelier au premier plan." } },
        { label: "Sur le fleuve", heading: "Collection de croisières sur le Nil", href: "/tours?type=nile-cruise", image: { src: "/assets/tour-types/nile-cruise.webp", alt: "Des montgolfières s’élevant au-dessus de la vallée du Nil, près de Louxor, aux premières lueurs." } },
        { label: "Sous l’eau", heading: "Sorties plongée et snorkeling", href: "/tours?type=red-sea", image: { src: "/assets/activities/blue-hole-dive.webp", alt: "Un adepte du snorkeling au-dessus du platier corallien du Blue Hole, à Dahab." } },
      ],
    },
    {
      key: "journal",
      title: "Journal",
      columns: [
        {
          heading: "Commencer ici",
          links: [
            { label: "Le meilleur moment pour partir", href: "/blog/best-time-to-visit-egypt" },
            { label: "Première croisière sur le Nil", href: "/blog/first-time-nile-cruise" },
            { label: "Itinéraire de 7 jours", href: "/blog/seven-days-in-egypt" },
            { label: "Que mettre dans sa valise", href: "/blog/what-to-pack-for-egypt" },
          ],
        },
        {
          heading: "Lieux et récits",
          links: [
            { label: "Le Caire au-delà du guide", href: "/blog/cairo-beyond-the-guidebook" },
            { label: "L’âme d’Alexandrie", href: "/blog/alexandria-mediterranean-soul" },
            { label: "Au-delà de Gizeh", href: "/blog/beyond-giza-underrated-sites" },
            { label: "Une soirée à Karnak", href: "/blog/karnak-sound-and-light" },
          ],
        },
        {
          heading: "Voyager futé",
          links: [
            { label: "L’Égypte avec des enfants", href: "/blog/egypt-with-kids-family-guide" },
            { label: "Bonnes pratiques sur les récifs de la mer Rouge", href: "/blog/red-sea-reef-etiquette" },
            { label: "Journées lentes en felouque sur le Nil", href: "/blog/slow-nile-felucca-days" },
            { label: "Tous les articles du journal", href: "/blog" },
          ],
        },
      ],
      imageCtas: [
        { label: "Préparation du voyage", heading: "Quand visiter l’Égypte", href: "/blog/best-time-to-visit-egypt", image: { src: "/assets/hero/hero-giza-portrait.webp", alt: "Les pyramides de Gizeh sous un ciel d’hiver dégagé." } },
        { label: "Sur le fleuve", heading: "Une première croisière sur le Nil", href: "/blog/first-time-nile-cruise", image: { src: "/assets/cta/fifty-nile-cruise.webp", alt: "Un bateau de croisière amarré au bord d’une rive verdoyante." } },
        { label: "En famille", heading: "L’Égypte avec des enfants", href: "/blog/egypt-with-kids-family-guide", image: { src: "/assets/activities/nubian-culture.webp", alt: "Une ruelle de village nubien aux couleurs vives, au-dessus du Nil, à Assouan." } },
      ],
    },
  ],
};

export const footerContentFr: FooterContent = {
  newsletter: {
    heading: "Inscrivez-vous !",
    blurb:
      "Des idées de voyage, des départs saisonniers et, de temps à autre, une dépêche du désert — quelques fois par mois, jamais de spam.",
    cta: { label: "Inscrivez-vous à notre newsletter", href: "/newsletter" },
  },
  badgeHeading: "Recommandé par",
  badges: [
    { heading: "ETF", sub: "Membre 2026", href: "/about#accreditation" },
    { heading: "Travelife", sub: "Partenaire", href: "/responsible-travel" },
  ],
  partnersHeading: "Partenaires de voyage",
  partners: [
    { name: "Egypt Air", tagline: "Transporteur officiel partenaire", href: "https://www.egyptair.com" },
    { name: "IATA", tagline: "Agent accrédité", href: "https://www.iata.org" },
    { name: "Visit Egypt", tagline: "Office de tourisme égyptien", href: "https://www.experienceegypt.eg" },
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
        { label: "À propos", href: "/about" },
        { label: "Nos égyptologues", href: "/about#team" },
        { label: "Carrières", href: "/careers" },
        { label: "Presse et médias", href: "/press" },
        { label: "Nous contacter", href: "/contact" },
      ],
    },
    {
      heading: "Voyagez avec nous",
      links: [
        { label: "Tous les circuits", href: "/tours" },
        { label: "Idées de voyage", href: "/trip-ideas" },
        { label: "Croisières sur le Nil", href: "/tours?type=nile-cruise" },
        { label: "Voyages privés", href: "/tours?type=private" },
        { label: "Voyage responsable", href: "/responsible-travel" },
        { label: "Galerie photo", href: "/gallery" },
      ],
    },
    {
      heading: "Aide et infos",
      links: [
        { label: "Quand partir", href: "/when-to-visit" },
        { label: "Visas et entrée", href: "/visa" },
        { label: "Suivre ma réservation", href: "/track-booking" },
        { label: "Santé et sécurité", href: "/travel-tips" },
        { label: "FAQ", href: "/faqs" },
      ],
    },
  ],
  legalLinks: [
    { label: "Politique de confidentialité", href: "/privacy-policy" },
    { label: "Conditions générales", href: "/terms-of-service" },
    { label: "Politique relative aux cookies", href: "/cookie-policy" },
  ],
  copyrightLine: "© {year} Ptah Tours. Tous droits réservés.",
  acknowledgement:
    "Ptah Tours a son siège au Caire et opère dans toute l’Égypte — la vallée du Nil, le Delta, le Sinaï et le désert Occidental. Nous voyageons avec des égyptologues diplômés, rémunérons nos équipes équitablement et concevons chaque itinéraire pour donner aux communautés et aux sites patrimoniaux de l’Égypte plus qu’il ne leur prend.",
  cookie: {
    heading: "Nous respectons votre vie privée",
    copy: "Nous utilisons des cookies pour améliorer votre navigation, proposer des contenus personnalisés et analyser notre trafic. En cliquant sur Tout accepter, vous consentez à notre utilisation des cookies. Vous pouvez changer d’avis à tout moment depuis le pied de page.",
    manageHeading: "Gérer vos préférences de cookies",
    categories: [
      {
        key: "preferences",
        name: "Préférences",
        description: "Mémoriser des choix comme la langue, la devise et vos voyages enregistrés.",
      },
      {
        key: "analytics",
        name: "Analyses",
        description: "Des statistiques anonymes qui nous aident à comprendre quels voyages et quelles pages les voyageurs préfèrent.",
      },
      {
        key: "marketing",
        name: "Marketing",
        description: "Mesurer nos campagnes et afficher ailleurs des contenus Ptah Tours plus pertinents.",
      },
    ],
  },
};

export const landingContentFr = {
  hero: heroSlidesFr,
  inspiredTabs: inspiredTabsFr,
  planCta: planCtaFr,
  fiftyCtas: fiftyCtasFr,
  kbygItems: kbygItemsFr,
  tourTypes: tourTypesFr,
  stories: storiesFr,
} as const;
