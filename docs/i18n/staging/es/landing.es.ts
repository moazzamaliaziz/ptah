/**
 * Spanish (es) editorial translation of `src/content/landing.ts` (Module G).
 * Staging only. Register: usted; opening ¿/¡ where needed. Human-readable values
 * translated; `src`, `href`, `credit`, `iconKey`, `buttonType`, `trackingContext`,
 * `network`, `season`, `id`, `key`, numeric fields and cookie category `key`
 * enums mirrored 1:1. Brand "Ptah Tours" and legalName kept verbatim. `{year}`
 * token preserved. `siteMetaEs` is widened to string values because the English
 * `siteMeta` is declared `as const` (literal types); see notes.md.
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

export const siteMetaEs: { [K in keyof typeof siteMeta]: string } = {
  name: "Ptah Tours",
  legalName: "Ptah Tours for Tourism LLC",
  tagline: "Egipto, seleccionado por quienes lo llaman hogar",
};

export const heroSlidesEs: typeof heroSlides = [
  {
    id: "giza",
    season: "summer",
    title: "Camine entre la última maravilla del mundo antiguo",
    shortLabel: "las pirámides de Guiza",
    subtitle: "Mañanas privadas en Guiza con egiptólogo, antes de que lleguen las multitudes.",
    image: {
      src: "/assets/hero/hero-giza-portrait.webp",
      mid: "/assets/hero/hero-giza.webp",
      alt: "La Gran Pirámide de Keops y la Esfinge de Guiza bajo la cálida luz de la mañana, con la meseta de El Cairo al fondo.",
      credit: "Ptah Tours field archive",
    },
    hotspots: [
      { xPct: 30, yPct: 44, label: "Gran Pirámide de Keops", href: "/trip-ideas/panorama-of-the-pyramids" },
      { xPct: 62, yPct: 70, label: "La Gran Esfinge", href: "/trip-ideas/panorama-of-the-pyramids" },
    ],
  },
  {
    id: "thebes",
    season: "summer",
    title: "Sobrevuele las tumbas de Tebas con las primeras luces",
    shortLabel: "vuelo en globo sobre Luxor",
    subtitle: "Globos al amanecer, el Valle de los Reyes y Karnak antes del calor.",
    image: {
      src: "/assets/hero/hero-thebes-portrait.webp",
      mid: "/assets/hero/hero-thebes.webp",
      alt: "Un globo aerostático sobrevolando la orilla oeste de Luxor al amanecer, con el cinturón verde del Nilo abajo.",
      credit: "Ptah Tours field archive",
    },
    hotspots: [
      { xPct: 26, yPct: 38, label: "Globos aerostáticos al amanecer", href: "/trip-ideas/luxor-sunrise-weekend" },
      { xPct: 68, yPct: 62, label: "Valle de los Reyes", href: "/trip-ideas/kings-and-queens-of-thebes" },
    ],
  },
  {
    id: "blue-hole",
    season: "summer",
    title: "Descienda al azul: el arrecife vivo del Sinaí",
    shortLabel: "la costa del Blue Hole",
    subtitle: "Practique snorkel en el Blue Hole, Ras Abu Galum y Ras Mohammed con guías de buceo autorizados.",
    image: {
      src: "/assets/hero/hero-blue-hole-portrait.webp",
      mid: "/assets/hero/hero-blue-hole.webp",
      alt: "El círculo azul profundo del Blue Hole de Dahab visto desde arriba, rodeado por la pálida plataforma de arrecife y las montañas del Sinaí.",
      credit: "Ptah Tours field archive",
    },
    hotspots: [
      { xPct: 40, yPct: 46, label: "El sumidero del Blue Hole", href: "/trip-ideas/blue-hole-sinai" },
      { xPct: 66, yPct: 30, label: "Costa de Ras Abu Galum", href: "/trip-ideas/blue-hole-sinai" },
    ],
  },
];

export const inspiredTabsEs: typeof inspiredTabs = [
  {
    key: "itineraries",
    label: "Itinerarios",
    cards: [
      {
        title: "Panorama de las pirámides",
        href: "/trip-ideas/panorama-of-the-pyramids",
        days: 2,
        experiences: 6,
        image: { src: "/assets/itineraries/giza-essentials.webp", alt: "Un camello pasando frente a la Gran Pirámide de Keops en la meseta de Guiza." },
      },
      {
        title: "Fin de semana histórico en El Cairo",
        href: "/trip-ideas/cairo-heritage-weekend",
        days: 3,
        experiences: 9,
        image: { src: "/assets/itineraries/cairo-heritage.webp", alt: "Vitrinas y objetos dorados dentro del Museo Egipcio de El Cairo." },
      },
      {
        title: "Karnak de día, templo de Luxor de noche",
        href: "/trip-ideas/karnak-luxor-evening",
        days: 2,
        experiences: 7,
        image: { src: "/assets/itineraries/karnak-evening.webp", alt: "Columnas iluminadas del templo de Luxor al anochecer, resplandecientes en tono ámbar contra un cielo azul intenso." },
      },
      {
        title: "Reyes y reinas de Tebas",
        href: "/trip-ideas/kings-and-queens-of-thebes",
        days: 3,
        experiences: 8,
        image: { src: "/assets/itineraries/valley-of-kings.webp", alt: "Acantilados dorados que descienden hacia las tumbas del Valle de los Reyes." },
      },
      {
        title: "La isla de File y la Gran Presa",
        href: "/trip-ideas/philae-island-aswan",
        days: 2,
        experiences: 5,
        image: { src: "/assets/itineraries/philae-island.webp", alt: "El templo insular de File, al que se llega en barco a través de aguas azules y tranquilas." },
      },
      {
        title: "El pueblo nubio en faluca",
        href: "/trip-ideas/nubian-village-aswan",
        days: 2,
        experiences: 6,
        image: { src: "/assets/itineraries/nubian-village.webp", alt: "Una casa pintada de un pueblo nubio, en ocre y azul intensos, sobre el Nilo." },
      },
      {
        title: "Alejandría en un fin de semana",
        href: "/trip-ideas/alexandria-weekend",
        days: 2,
        experiences: 7,
        image: { src: "/assets/itineraries/alexandria-classics.webp", alt: "La cubierta curva de la moderna Biblioteca de Alejandría frente al Mediterráneo." },
      },
      {
        title: "Cumbre del Sinaí y Santa Catalina",
        href: "/trip-ideas/sinai-summit-st-catherines",
        days: 2,
        experiences: 4,
        image: { src: "/assets/itineraries/sinai-summit.webp", alt: "Excursionistas en el camino de camellos hacia el monte Sinaí bajo un cielo previo al amanecer." },
      },
    ],
  },
  {
    key: "adventure",
    label: "Aventura",
    cards: [
      {
        title: "Snorkel en el Blue Hole",
        href: "/trip-ideas/blue-hole-sinai",
        image: { src: "/assets/activities/blue-hole-dive.webp", alt: "Un practicante de snorkel flotando sobre la plataforma de coral en el borde del Blue Hole." },
      },
      {
        title: "Travesía por el Cañón de Colores",
        href: "/trip-ideas/colored-canyon-sinai",
        image: { src: "/assets/activities/colored-canyon.webp", alt: "Franjas de roca roja, dorada y crema plegándose a través del estrecho Cañón de Colores." },
      },
      {
        title: "Safari en quad al atardecer",
        href: "/trip-ideas/desert-safari-quad-sunset",
        image: { src: "/assets/activities/desert-safari.webp", alt: "Quads levantando polvo por una llanura desértica anaranjada al atardecer." },
      },
      {
        title: "Día de barco en el mar Rojo",
        href: "/trip-ideas/red-sea-boat-snorkeling",
        image: { src: "/assets/activities/boat-snorkeling.webp", alt: "Un barco de buceo blanco fondeado sobre aguas turquesas de arrecife en el mar Rojo." },
      },
    ],
  },
  {
    key: "culture",
    label: "Cultura",
    cards: [
      {
        title: "El Museo Egipcio, con guía",
        href: "/trip-ideas/egyptian-museum-guided",
        image: { src: "/assets/activities/museum-tahrir.webp", alt: "Estatuas de piedra talladas y sarcófagos dentro de las salas del Museo Egipcio." },
      },
      {
        title: "Khan el-Khalili al caer la noche",
        href: "/trip-ideas/khan-el-khalili-night",
        image: { src: "/assets/activities/khan-el-khalili.webp", alt: "Puestos de faroles encendidos dentro del bazar de Khan el-Khalili por la noche." },
      },
      {
        title: "Té con una familia nubia",
        href: "/trip-ideas/nubian-village-aswan",
        image: { src: "/assets/activities/nubian-culture.webp", alt: "Un patio nubio pintado con una familia reunida tomando té." },
      },
      {
        title: "Biblioteca de Alejandría y Qaitbay",
        href: "/trip-ideas/alexandria-weekend",
        image: { src: "/assets/activities/bibliotheca.webp", alt: "La fachada inclinada de granito de la Biblioteca de Alejandría reflejando el sol." },
      },
    ],
  },
  {
    key: "river-sea",
    label: "Río y mar",
    cards: [
      {
        title: "Faluca alrededor de File",
        href: "/trip-ideas/philae-island-aswan",
        image: { src: "/assets/activities/philae-felucca.webp", alt: "Una faluca de vela blanca deslizándose hacia el templo de File a través del Nilo." },
      },
      {
        title: "Día de barco en Ras Mohammed",
        href: "/trip-ideas/ras-mohammed-park",
        image: { src: "/assets/activities/ras-mohammed.webp", alt: "Aguas someras turquesas y arrecife visibles desde un barco en Ras Mohammed." },
      },
      {
        title: "Faluca al atardecer, Luxor",
        href: "/trip-ideas/luxor-sunrise-weekend",
        image: { src: "/assets/activities/nile-sunset-felucca.webp", alt: "La vela de una faluca captando la última luz anaranjada sobre el Nilo en Luxor." },
      },
      {
        title: "Snorkel en los arrecifes junto a la orilla",
        href: "/trip-ideas/red-sea-boat-snorkeling",
        image: { src: "/assets/activities/red-sea-boat.webp", alt: "Practicantes de snorkel flotando sobre jardines de coral a lo largo de la costa del mar Rojo." },
      },
    ],
  },
  {
    key: "heritage",
    label: "Patrimonio",
    cards: [
      {
        title: "La gran sala hipóstila",
        href: "/trip-ideas/karnak-luxor-evening",
        image: { src: "/assets/activities/karnak-hypostyle.webp", alt: "Enormes columnas con capiteles papiriformes apiñadas en la sala hipóstila de Karnak." },
      },
      {
        title: "Dentro del Valle de los Reyes",
        href: "/trip-ideas/kings-and-queens-of-thebes",
        image: { src: "/assets/activities/valley-heritage.webp", alt: "Muros pintados del corredor de una tumba resplandeciendo bajo la iluminación de conservación en el Valle de los Reyes." },
      },
      {
        title: "File: templo de Isis",
        href: "/trip-ideas/philae-island-aswan",
        image: { src: "/assets/activities/philae-temple.webp", alt: "La puerta tallada del templo de File, dedicado a la diosa Isis." },
      },
      {
        title: "Guardianes de Guiza",
        href: "/trip-ideas/panorama-of-the-pyramids",
        image: { src: "/assets/activities/sphinx-guardians.webp", alt: "La Esfinge mirando más allá de la cámara, con la pirámide de Kefrén al fondo." },
      },
    ],
  },
];

export const planCtaEs: typeof planCta = {
  title: "Planifique el viaje de sus sueños",
  copy: "Cuéntele a nuestro estudio de El Cairo con qué sueña —pirámides al amanecer, un tramo tranquilo del Nilo entre templos, una semana en el arrecife— y un diseñador de viajes dedicado construirá el itinerario con usted, mensaje a mensaje.",
  image: {
    src: "/assets/cta/plan-nile-portrait.webp",
    mid: "/assets/cta/plan-karnak-landscape.webp",
    wide: "/assets/cta/plan-karnak-landscape.webp",
    wideAt: 1440,
    alt: "Una faluca navegando junto a las palmeras del Nilo en Asuán, con las rocas de granito que marcan la primera catarata.",
  },
  credit: "Ptah Tours field archive — Aswan",
  cta: {
    type: "customButton",
    button: { buttonType: "buildATrip", trackingContext: "HomePageFullPageCTA", href: "/manage/trip-builder" },
    label: "Empezar a planificar",
  },
};

export const fiftyCtasEs: typeof fiftyCtas = [
  {
    title: "Pensado a su medida",
    copy: "Cada viaje de Ptah es privado y a medida: su guía, su ritmo, su ruta. Nada estándar.",
    cta: { label: "Diseñar mi viaje", href: "/contact" },
    image: {
      src: "/assets/cta/fifty-bespoke-journeys.webp",
      mid: "/assets/cta/fifty-bespoke-journeys.webp",
      wide: "/assets/cta/fifty-bespoke-journeys.webp",
      wideAt: 1128,
      alt: "Una vista hacia arriba entre las columnas del templo de Luxor hacia un cielo luminoso.",
    },
  },
  {
    title: "Navegue el Nilo con estilo",
    copy: "Cruceros de cuatro a siete noches entre Luxor y Asuán, con camarotes que hemos inspeccionado personalmente.",
    cta: { label: "Descubrir el Nilo", href: "/the-nile" },
    image: {
      src: "/assets/cta/fifty-nile-cruise.webp",
      mid: "/assets/cta/fifty-nile-cruise.webp",
      wide: "/assets/cta/fifty-nile-cruise.webp",
      wideAt: 1128,
      alt: "Un barco de crucero por el Nilo amarrado en la orilla oeste, cerca de Asuán, a la hora dorada.",
    },
  },
];

export const kbygItemsEs: typeof kbygItems = [
  {
    iconKey: "weather",
    title: "Cuándo viajar",
    copy: "De octubre a abril es temporada de templos; el mar Rojo brilla todo el año. Ajustaremos sus fechas al mapa adecuado.",
    cta: { label: "Ver las temporadas", href: "/when-to-visit" },
  },
  {
    iconKey: "ticket",
    title: "Entrada y visados",
    copy: "La mayoría de las nacionalidades puede obtener el visado electrónico en línea en minutos. Enviamos a cada huésped una guía de llegada paso a paso.",
    cta: { label: "Consultar requisitos", href: "/visa" },
  },
  {
    iconKey: "travel",
    title: "Cómo moverse",
    copy: "Conductores privados por defecto, tren de primera clase y vuelos internos entre los trayectos largos, y falucas para lo divertido.",
    cta: { label: "Cómo viajamos", href: "/getting-around" },
  },
  {
    iconKey: "info",
    title: "Hable con una persona",
    copy: "Veteranos del Nilo, no un centro de llamadas. WhatsApp, teléfono o correo: contactará con el equipo que planifica el viaje.",
    cta: { label: "Contáctenos", href: "/contact" },
  },
];

export const tourTypesEs: typeof tourTypes = [
  {
    title: "Egipto clásico",
    blurb: "Pirámides, templos de Luxor y los grandes museos: el circuito esencial, hecho como es debido.",
    href: "/tours?type=classic",
    image: { src: "/assets/tour-types/classic-egypt.webp", alt: "Los pilonos del templo de File reflejados en el Nilo en una mañana tranquila de Asuán." },
  },
  {
    title: "Cruceros por el Nilo",
    blurb: "Duerma sobre el río: cubiertas de Luxor a Asuán, amarres privados y paradas en templos por el camino.",
    href: "/tours?type=nile-cruise",
    image: { src: "/assets/tour-types/nile-cruise.webp", alt: "Globos aerostáticos elevándose sobre el valle del Nilo al oeste de Luxor al amanecer." },
  },
  {
    title: "Mar Rojo y playa",
    blurb: "Hurghada, Sharm y Dahab: días de arrecife, excursiones en barco y auténtico descanso.",
    href: "/tours?type=red-sea",
    image: { src: "/assets/tour-types/red-sea-escape.webp", alt: "El sol poniéndose sobre el mar Rojo con la silueta de una dahabeya frente a la costa." },
  },
  {
    title: "Aventuras en el desierto",
    blurb: "Campamentos en el Desierto Blanco, cumbres del Sinaí, rutas por los oasis: el Egipto más allá de la ribera.",
    href: "/tours?type=desert",
    image: { src: "/assets/tour-types/desert-adventure.webp", alt: "Una pista todoterreno serpenteando entre dunas anaranjadas hacia un campamento en el desierto al anochecer." },
  },
];

export const storiesEs: typeof stories = [
  {
    title: "El Cairo más allá de la guía",
    summary: "Dónde comen koshari los cairotas de verdad, la mezquita con la mejor puesta de sol de El Cairo y por qué las salas traseras del Museo Egipcio superan a la famosa galería: cinco días recorriendo la capital con nuestro equipo local.",
    href: "/blog/cairo-beyond-the-guidebook",
    image: {
      src: "/assets/stories/cairo-experience.webp",
      mid: "/assets/stories/cairo-experience.webp",
      wide: "/assets/stories/cairo-experience.webp",
      wideAt: 1440,
      alt: "El Cairo junto al Nilo al anochecer, con alminares y puentes superpuestos sobre un cielo violeta.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Una noche en Karnak, a su aire",
    summary: "El espectáculo de luz y sonido tiene mala fama; le explicamos cómo nuestros guías lo programan para que la sala hipóstila quede casi vacía, y en qué acertó el diseñador de iluminación con los obeliscos.",
    href: "/blog/karnak-sound-and-light",
    image: {
      src: "/assets/stories/karnak-sound-light.webp",
      mid: "/assets/stories/karnak-sound-light.webp",
      wide: "/assets/stories/karnak-sound-light.webp",
      wideAt: 1440,
      alt: "Las grandes columnas de Karnak iluminadas en ámbar contra un cielo azul medianoche durante el espectáculo nocturno.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Alejandría: el alma mediterránea de Egipto",
    summary: "A dos horas de El Cairo y a un mundo de distancia: marisco en la lonja, la nueva biblioteca, las catacumbas y un paseo por la corniche que explica a cada alejandrino que haya conocido.",
    href: "/blog/alexandria-mediterranean-soul",
    image: {
      src: "/assets/stories/alexandria-mediterranean.webp",
      mid: "/assets/stories/alexandria-mediterranean.webp",
      wide: "/assets/stories/alexandria-mediterranean.webp",
      wideAt: 1440,
      alt: "La corniche de Alejandría curvándose a lo largo del Mediterráneo hacia la ciudadela al amanecer.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Cómo practicar snorkel en el mar Rojo sin dañarlo",
    summary: "Consejos de flotabilidad de nuestros guías de buceo, por qué nunca alimentamos a los peces, las normas sobre protector solar en cada barco de Ptah y los tres arrecifes cerca de Sharm donde apenas verá otro grupo.",
    href: "/blog/red-sea-reef-etiquette",
    image: {
      src: "/assets/stories/red-sea-reef.webp",
      mid: "/assets/stories/red-sea-reef.webp",
      wide: "/assets/stories/red-sea-reef.webp",
      wideAt: 1440,
      alt: "Un jardín de coral con peces anthias revoloteando en las aguas someras y cristalinas de un arrecife costero del mar Rojo.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Elogio de la faluca: días lentos en el Nilo",
    summary: "Sin motor, sin un itinerario más apretado que el viento. Por qué nuestra tarde favorita en Asuán es una vela de lona, un termo de té y lo que el río decida mostrarle.",
    href: "/blog/slow-nile-felucca-days",
    image: {
      src: "/assets/stories/nile-sailing-aswan.webp",
      mid: "/assets/stories/nile-sailing-aswan.webp",
      wide: "/assets/stories/nile-sailing-aswan.webp",
      wideAt: 1440,
      alt: "Una faluca escorándose suavemente a toda vela en el Nilo, cerca de Asuán, al atardecer.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "La mejor época para visitar Egipto, mes a mes",
    summary: "Egipto tiene una temporada para cada quien: inviernos frescos y despejados para los templos, meses de temporada media más tranquilos y con mejor precio, y una forma inteligente de disfrutar incluso del calor del verano. Así se siente realmente cada mes, y cuándo ir según lo que busque.",
    href: "/blog/best-time-to-visit-egypt",
    image: {
      src: "/assets/hero/hero-giza.webp",
      mid: "/assets/hero/hero-giza.webp",
      wide: "/assets/hero/hero-giza.webp",
      wideAt: 1440,
      alt: "Las pirámides de Guiza bajo un cielo azul y despejado de invierno.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Guía para su primer crucero por el Nilo",
    summary: "Cómo es de verdad un crucero por el Nilo: los camarotes, la gastronomía, el ritmo diario de templos y navegación, en qué dirección ir y cómo elegir entre un gran barco fluvial y una dahabeya íntima.",
    href: "/blog/first-time-nile-cruise",
    image: {
      src: "/assets/cta/fifty-nile-cruise.webp",
      mid: "/assets/cta/fifty-nile-cruise.webp",
      wide: "/assets/cta/fifty-nile-cruise.webp",
      wideAt: 1440,
      alt: "Un barco de crucero por el Nilo sobre aguas tranquilas junto a una ribera verde.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Siete días en Egipto: nuestro itinerario clásico, al detalle",
    summary: "El Cairo, Luxor y Asuán en una semana sin sentir prisa: nuestra ruta clásica de siete días, día a día, con las concesiones que hacemos para que los grandes momentos luzcan y el ritmo siga siendo humano.",
    href: "/blog/seven-days-in-egypt",
    image: {
      src: "/assets/itineraries/cairo-heritage.webp",
      mid: "/assets/itineraries/cairo-heritage.webp",
      wide: "/assets/itineraries/cairo-heritage.webp",
      wideAt: 1440,
      alt: "Cúpulas y alminares del Cairo islámico histórico a la hora dorada.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Qué llevar a Egipto (y qué dejar en casa)",
    summary: "La lista breve que de verdad importa: capas para las frías noches del desierto, protección solar que respete los sitios, el calzado adecuado para las tumbas y las cosas que los primerizos siempre llevan de más. Con notas por temporada.",
    href: "/blog/what-to-pack-for-egypt",
    image: {
      src: "/assets/activities/desert-safari.webp",
      mid: "/assets/activities/desert-safari.webp",
      wide: "/assets/activities/desert-safari.webp",
      wideAt: 1440,
      alt: "Una pista del desierto que se dirige hacia las dunas bajo un amplio cielo egipcio.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Más allá de Guiza: los sitios antiguos infravalorados de Egipto",
    summary: "Una vez que haya visto las pirámides, Egipto sigue ofreciendo más: la pirámide escalonada de Saqqara, el techo pintado de Dendera, Abidos, Kom Ombo y los templos tranquilos donde puede que sea el único visitante.",
    href: "/blog/beyond-giza-underrated-sites",
    image: {
      src: "/assets/activities/philae-temple.webp",
      mid: "/assets/activities/philae-temple.webp",
      wide: "/assets/activities/philae-temple.webp",
      wideAt: 1440,
      alt: "Las columnas del templo de File alzándose sobre el Nilo, cerca de Asuán.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Egipto con niños: guía de viaje en familia",
    summary: "Egipto es un viaje estupendo con niños: momias, camellos y barcos para mantenerlos enganchados. Nuestra guía sobre el ritmo, las edades, la comida, el calor y los tours que mejor funcionan en familia.",
    href: "/blog/egypt-with-kids-family-guide",
    image: {
      src: "/assets/activities/nubian-culture.webp",
      mid: "/assets/activities/nubian-culture.webp",
      wide: "/assets/activities/nubian-culture.webp",
      wideAt: 1440,
      alt: "Un callejón de pueblo nubio pintado de vivos colores sobre el Nilo, en Asuán.",
    },
    credit: "Ptah Tours field archive",
  },
];

export const siteNavEs: typeof siteNav = {
  quickLinks: [
    { label: "Eventos y festivales", href: "/events", iconKey: "calendar" },
    { label: "Cuándo viajar", href: "/when-to-visit", iconKey: "weather" },
    { label: "Tramite su eVisa", href: "/visa", iconKey: "ticket" },
    { label: "Mi cuenta", href: "/account", iconKey: "user" },
  ],
  directLinks: [
    { label: "Destinos", href: "/cities" },
    { label: "Ideas de viaje", href: "/trip-ideas" },
    { label: "Galería", href: "/gallery" },
  ],
  buildTripCta: { label: "Planifique mi viaje", href: "/manage/trip-builder" },
  bookmarksHref: "/manage/trip-builder?tab=bookmarks",
  searchHref: "/search",
  popularSearches: [
    "Pirámides de Guiza",
    "Crucero por el Nilo",
    "Globo aerostático en Luxor",
    "Snorkel en Ras Mohammed",
    "Tour privado por El Cairo",
    "Navidad en Egipto",
  ],
  sections: [
    {
      key: "about",
      title: "Sobre Egipto",
      columns: [
        {
          heading: "Destinos",
          links: [
            { label: "El Cairo", href: "/cities/cairo" },
            { label: "Luxor", href: "/cities/luxor" },
            { label: "Asuán", href: "/cities/aswan" },
            { label: "Alejandría", href: "/cities/alexandria" },
            { label: "Hurghada", href: "/cities/hurghada" },
            { label: "Sharm el-Sheikh", href: "/cities/sharm-el-sheikh" },
          ],
        },
        {
          heading: "Conozca el territorio",
          links: [
            { label: "Historia y patrimonio", href: "/heritage" },
            { label: "Estaciones y clima", href: "/when-to-visit" },
            { label: "El Nilo", href: "/the-nile" },
            { label: "Desiertos y oasis", href: "/deserts" },
            { label: "Arrecifes del mar Rojo", href: "/red-sea" },
          ],
        },
        {
          heading: "Conviene saber",
          links: [
            { label: "Viaje responsable", href: "/responsible-travel" },
            { label: "Accesibilidad", href: "/accessibility" },
            { label: "Seguridad y asistencia", href: "/contact" },
            { label: "Historias y diario", href: "/blog" },
          ],
        },
      ],
      imageCtas: [
        {
          label: "Análisis del destino",
          heading: "La antigua Tebas",
          href: "/cities/luxor",
          image: { src: "/assets/hero/hero-thebes-portrait.webp", alt: "Un globo aerostático sobre los templos de la orilla oeste de Luxor al amanecer." },
        },
        {
          label: "Litorales",
          heading: "Descubra el mar Rojo",
          href: "/cities/sharm-el-sheikh",
          image: { src: "/assets/hero/hero-blue-hole-portrait.webp", alt: "Un practicante de snorkel flotando sobre el coral en la plataforma de arrecife del Blue Hole." },
        },
        {
          label: "Desde el terreno",
          heading: "Lea el diario",
          href: "/blog",
          image: { src: "/assets/stories/nile-sailing-aswan.webp", alt: "Una faluca a vela en el Nilo, cerca de Asuán." },
        },
      ],
    },
    {
      key: "plan",
      title: "Planifique su viaje",
      columns: [
        {
          heading: "Cómo llegar",
          links: [
            { label: "Vuelos a Egipto", href: "/getting-here" },
            { label: "Visados y entrada", href: "/visa" },
            { label: "Días de llegada, resueltos", href: "/getting-here#arrivals" },
            { label: "Cómo moverse", href: "/getting-around" },
          ],
        },
        {
          heading: "Cómo decidir",
          links: [
            { label: "Cuándo viajar", href: "/when-to-visit" },
            { label: "Cuántos días", href: "/how-many-days" },
            { label: "Presupuesto y propinas", href: "/travel-tips" },
            { label: "Viajar con niños", href: "/family-travel" },
          ],
        },
        {
          heading: "Nuestro compromiso",
          links: [
            { label: "Cómo funcionan los viajes Ptah", href: "/how-it-works" },
            { label: "Viaje responsable", href: "/responsible-travel" },
            { label: "Reseñas y acreditación", href: "/reviews" },
            { label: "Contacte con el equipo", href: "/contact" },
          ],
        },
      ],
      imageCtas: [
        {
          label: "Consulta gratuita",
          heading: "Hable con un egiptólogo",
          href: "/contact",
          image: { src: "/assets/activities/philae-felucca.webp", alt: "Una faluca navegando hacia el templo de File sobre las tranquilas aguas del Nilo." },
        },
        {
          label: "Explorar",
          heading: "Todos los tours de Ptah",
          href: "/tours",
          image: { src: "/assets/activities/valley-heritage.webp", alt: "Muros pintados de una tumba en el Valle de los Reyes." },
        },
        {
          label: "Inspiración",
          heading: "Encuentre ideas de viaje",
          href: "/trip-ideas",
          image: { src: "/assets/cta/plan-nile-portrait.webp", alt: "Una faluca en el Nilo, en Asuán, entre rocas de granito." },
        },
      ],
    },
    {
      key: "tours",
      title: "Tours",
      columns: [
        {
          heading: "Por estilo",
          links: [
            { label: "Egipto clásico", href: "/tours?type=classic" },
            { label: "Cruceros por el Nilo", href: "/tours?type=nile-cruise" },
            { label: "Mar Rojo y playa", href: "/tours?type=red-sea" },
            { label: "Aventuras en el desierto", href: "/tours?type=desert" },
          ],
        },
        {
          heading: "Por duración",
          links: [
            { label: "Tours de un día", href: "/tours?length=day" },
            { label: "Viajes de 2–4 días", href: "/tours?length=short" },
            { label: "Rutas de 5–9 días", href: "/tours?length=week" },
            { label: "Expediciones de 10+ días", href: "/tours?length=grand" },
          ],
        },
        {
          heading: "Especiales",
          links: [
            { label: "Privados y a medida", href: "/tours?type=private" },
            { label: "Viajes en familia", href: "/tours?type=family" },
            { label: "Lunas de miel", href: "/tours?type=honeymoon" },
            { label: "Salidas de última hora", href: "/tours?filter=departing-soon" },
          ],
        },
      ],
      imageCtas: [
        {
          label: "Viaje emblemático",
          heading: "Egipto clásico, 8 días",
          href: "/tours?type=classic",
          image: { src: "/assets/itineraries/giza-essentials.webp", alt: "La Gran Pirámide de Guiza con un guía y su camello en primer plano." },
        },
        {
          label: "En el río",
          heading: "Colección de cruceros por el Nilo",
          href: "/tours?type=nile-cruise",
          image: { src: "/assets/tour-types/nile-cruise.webp", alt: "Globos elevándose sobre el valle del Nilo, cerca de Luxor, con las primeras luces." },
        },
        {
          label: "Bajo el agua",
          heading: "Viajes de buceo y snorkel",
          href: "/tours?type=red-sea",
          image: { src: "/assets/activities/blue-hole-dive.webp", alt: "Un practicante de snorkel sobre la plataforma de coral en el Blue Hole de Dahab." },
        },
      ],
    },
    {
      key: "journal",
      title: "Diario",
      columns: [
        {
          heading: "Empiece aquí",
          links: [
            { label: "La mejor época para viajar", href: "/blog/best-time-to-visit-egypt" },
            { label: "Primer crucero por el Nilo", href: "/blog/first-time-nile-cruise" },
            { label: "Itinerario de 7 días", href: "/blog/seven-days-in-egypt" },
            { label: "Qué llevar", href: "/blog/what-to-pack-for-egypt" },
          ],
        },
        {
          heading: "Lugares e historias",
          links: [
            { label: "El Cairo más allá de la guía", href: "/blog/cairo-beyond-the-guidebook" },
            { label: "El alma de Alejandría", href: "/blog/alexandria-mediterranean-soul" },
            { label: "Más allá de Guiza", href: "/blog/beyond-giza-underrated-sites" },
            { label: "Una noche en Karnak", href: "/blog/karnak-sound-and-light" },
          ],
        },
        {
          heading: "Viaje con criterio",
          links: [
            { label: "Egipto con niños", href: "/blog/egypt-with-kids-family-guide" },
            { label: "Etiqueta en los arrecifes del mar Rojo", href: "/blog/red-sea-reef-etiquette" },
            { label: "Días lentos de faluca en el Nilo", href: "/blog/slow-nile-felucca-days" },
            { label: "Todas las entradas del diario", href: "/blog" },
          ],
        },
      ],
      imageCtas: [
        {
          label: "Planificación del viaje",
          heading: "Cuándo visitar Egipto",
          href: "/blog/best-time-to-visit-egypt",
          image: { src: "/assets/hero/hero-giza-portrait.webp", alt: "Las pirámides de Guiza bajo un cielo despejado de invierno." },
        },
        {
          label: "En el río",
          heading: "Un primer crucero por el Nilo",
          href: "/blog/first-time-nile-cruise",
          image: { src: "/assets/cta/fifty-nile-cruise.webp", alt: "Un barco de crucero por el Nilo amarrado junto a una ribera verde." },
        },
        {
          label: "En familia",
          heading: "Egipto con niños",
          href: "/blog/egypt-with-kids-family-guide",
          image: { src: "/assets/activities/nubian-culture.webp", alt: "Un callejón de pueblo nubio pintado de vivos colores sobre el Nilo, en Asuán." },
        },
      ],
    },
  ],
};

export const footerContentEs: typeof footerContent = {
  newsletter: {
    heading: "¡Suscríbase!",
    blurb:
      "Ideas de viaje, salidas de temporada y algún despacho ocasional desde el desierto: unas pocas veces al mes, nunca spam.",
    cta: { label: "Suscríbase a nuestro boletín", href: "/newsletter" },
  },
  badgeHeading: "Avalado por",
  badges: [
    { heading: "ETF", sub: "Miembro 2026", href: "/about#accreditation" },
    { heading: "Travelife", sub: "Socio", href: "/responsible-travel" },
  ],
  partnersHeading: "Socios de viaje",
  partners: [
    { name: "Egypt Air", tagline: "Aerolínea oficial asociada", href: "https://www.egyptair.com" },
    { name: "IATA", tagline: "Agencia acreditada", href: "https://www.iata.org" },
    { name: "Visit Egypt", tagline: "Autoridad de Turismo de Egipto", href: "https://www.experienceegypt.eg" },
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
        { label: "Sobre nosotros", href: "/about" },
        { label: "Nuestros egiptólogos", href: "/about#team" },
        { label: "Empleo", href: "/careers" },
        { label: "Prensa y medios", href: "/press" },
        { label: "Contáctenos", href: "/contact" },
      ],
    },
    {
      heading: "Viaje con nosotros",
      links: [
        { label: "Todos los tours", href: "/tours" },
        { label: "Ideas de viaje", href: "/trip-ideas" },
        { label: "Cruceros por el Nilo", href: "/tours?type=nile-cruise" },
        { label: "Viajes privados", href: "/tours?type=private" },
        { label: "Viaje responsable", href: "/responsible-travel" },
        { label: "Galería de fotos", href: "/gallery" },
      ],
    },
    {
      heading: "Ayuda e información",
      links: [
        { label: "Cuándo viajar", href: "/when-to-visit" },
        { label: "Visados y entrada", href: "/visa" },
        { label: "Seguimiento de mi reserva", href: "/track-booking" },
        { label: "Salud y seguridad", href: "/travel-tips" },
        { label: "Preguntas frecuentes", href: "/faqs" },
      ],
    },
  ],
  legalLinks: [
    { label: "Política de privacidad", href: "/privacy-policy" },
    { label: "Términos y condiciones", href: "/terms-of-service" },
    { label: "Política de cookies", href: "/cookie-policy" },
  ],
  copyrightLine: "© {year} Ptah Tours. Todos los derechos reservados.",
  acknowledgement:
    "Ptah Tours tiene su sede en El Cairo y trabaja en todo Egipto: el valle del Nilo, el Delta, el Sinaí y el Desierto Occidental. Viajamos con egiptólogos autorizados, pagamos con justicia a nuestros equipos y planificamos cada itinerario para que aporte más a las comunidades y al patrimonio de Egipto de lo que consume.",
  cookie: {
    heading: "Valoramos su privacidad",
    copy: "Utilizamos cookies para mejorar su experiencia de navegación, ofrecer contenido personalizado y analizar nuestro tráfico. Al hacer clic en Aceptar todo, consiente nuestro uso de cookies. Puede cambiar de opinión en cualquier momento desde el pie de página.",
    manageHeading: "Gestione sus preferencias de cookies",
    categories: [
      {
        key: "preferences",
        name: "Preferencias",
        description: "Recuerdan elecciones como el idioma, la moneda y sus viajes guardados.",
      },
      {
        key: "analytics",
        name: "Analítica",
        description: "Estadísticas anónimas que nos ayudan a entender qué viajes y páginas prefieren los viajeros.",
      },
      {
        key: "marketing",
        name: "Marketing",
        description: "Miden nuestras campañas y muestran contenido más relevante de Ptah Tours en otros sitios.",
      },
    ],
  },
};

export const landingContentEs: typeof landingContent = {
  hero: heroSlidesEs,
  inspiredTabs: inspiredTabsEs,
  planCta: planCtaEs,
  fiftyCtas: fiftyCtasEs,
  kbygItems: kbygItemsEs,
  tourTypes: tourTypesEs,
  stories: storiesEs,
} as const;
