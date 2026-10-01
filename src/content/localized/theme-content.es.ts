/**
 * Spanish (es) editorial translation of `src/content/theme-content.ts`.
 * Staging only — mirrors the English module's shape 1:1 with translated
 * string values. Register: usted (see ../notes.md; note the register
 * mismatch with the shipped tú page dictionary flagged there).
 * Do NOT wire into src/ until the dev phase.
 */
import type {
  galleryLabels,
  themeContent,
  whenToVisitContent,
} from "@/content/theme-content";

export const galleryLabelsEs: typeof galleryLabels = {
  galleryAria: "Galería de fotos",
  lightbox: {
    close: "Cerrar",
    prev: "Imagen anterior",
    next: "Imagen siguiente",
    zoomIn: "Acercar",
    zoomOut: "Alejar",
    counter: "{current} de {total}",
  },
};

export const themeContentEs: typeof themeContent = {
  heritage: {
    facts: [
      { icon: "star", value: "7", label: "sitios del Patrimonio Mundial de la UNESCO" },
      { icon: "clock", value: "5000+ años", label: "de civilización documentada" },
      { icon: "calendar", value: "ca. 2560 a.C.", label: "construcción de la Gran Pirámide de Guiza" },
      { icon: "globe", value: "Guiza → Abu Simbel", label: "monumentos a lo largo del Nilo" },
    ],
    timeline: {
      head: {
        eyebrow: "Una breve cronología",
        heading: "Cinco mil años, en orden",
        intro:
          "La historia de Egipto es tan larga que hasta los faraones estudiaban a antepasados que ya eran antiguos para ellos. Esta es su forma general: las fechas aproximadas se marcan con «ca.» (circa).",
      },
      entries: [
        { era: "Período Dinástico Temprano", span: "ca. 3100–2686 a.C.", body: "El Alto y el Bajo Egipto se unifican bajo los primeros faraones y la capital se fija en Menfis, cerca de la actual El Cairo." },
        { era: "Imperio Antiguo", span: "ca. 2686–2181 a.C.", body: "La era de los grandes constructores de pirámides: la Pirámide Escalonada de Zóser en Saqqara y las tres pirámides de Guiza se levantan en un mismo lapso de siglos." },
        { era: "Imperio Medio", span: "ca. 2055–1650 a.C.", body: "Tras un período de división, Egipto se reunifica. Se lo recuerda como una época clásica de literatura, escultura y sólido poder central." },
        { era: "Imperio Nuevo", span: "ca. 1550–1069 a.C.", body: "Egipto en su apogeo imperial. Karnak y Luxor crecen hasta convertirse en vastos complejos de templos y los faraones se entierran en el Valle de los Reyes, en Tebas." },
        { era: "Baja Época", span: "ca. 664–332 a.C.", body: "Gobiernan las últimas dinastías autóctonas, con interludios persas, hasta la llegada de Alejandro Magno." },
        { era: "Período Ptolemaico (grecorromano)", span: "332–30 a.C.", body: "Alejandro funda Alejandría; los Ptolomeos griegos levantan templos como File y Kom Ombo. La estirpe termina con Cleopatra VII y la llegada de Roma." },
        { era: "El Egipto copto e islámico", span: "desde ca. el siglo I d.C.", body: "El cristianismo arraiga y deja las iglesias del Cairo copto; la conquista árabe del 641 d.C. trae el islam, y El Cairo crece hasta convertirse en una de las grandes ciudades del mundo medieval." },
      ],
    },
    features: {
      head: {
        eyebrow: "Los grandes monumentos",
        heading: "Cuatro maravillas, leídas por un egiptólogo",
        intro:
          "Cada viaje de patrimonio de Ptah Tours va guiado por un egiptólogo titulado, de modo que los muros dejan de ser decoración y se convierten en frases. Estos son los sitios que están en su corazón.",
      },
      rows: [
        {
          image: "giza-pyramids",
          eyebrow: "Imperio Antiguo",
          heading: "Las pirámides de Guiza",
          body: [
            "Construidas hacia el 2560 a.C. como tumbas reales, las tres pirámides de Guiza son la única de las siete maravillas del mundo antiguo que sigue en pie. La Gran Pirámide ostentó el récord de estructura más alta levantada por manos humanas durante casi cuatro mil años.",
            "Junto a ellas, la Gran Esfinge monta guardia: un cuerpo de león con rostro de faraón, tallado en una sola cresta de piedra caliza al borde de la meseta desértica.",
          ],
        },
        {
          image: "karnak-temple",
          eyebrow: "Imperio Nuevo",
          heading: "Karnak, el templo que creció durante siglos",
          body: [
            "Karnak no es un templo, sino una ciudad de templos, ampliada por faraón tras faraón a lo largo de más de mil años. Su Gran Sala Hipóstila reúne 134 columnas gigantes en un bosque de piedra tan alto que el techo llegó a flotar muy por encima.",
            "Fue el sitio religioso más importante de Egipto, dedicado sobre todo al dios tebano Amón-Ra.",
          ],
        },
        {
          image: "luxor-temple",
          eyebrow: "Tebas",
          heading: "Luxor y la ribera occidental tebana",
          body: [
            "La antigua Tebas es la Luxor moderna, tan rica en ruinas que suele llamarse el mayor museo al aire libre del mundo. El templo de Luxor se alza en el corazón de la ciudad y en su día se unía a Karnak por una avenida de esfinges.",
            "Al otro lado del río están los cementerios reales —el Valle de los Reyes entre ellos—, donde la tumba de Tutankamón apareció casi intacta en 1922.",
          ],
        },
        {
          image: "abu-simbel",
          eyebrow: "Nubia",
          heading: "Abu Simbel y el rescate de un templo",
          body: [
            "Ramsés II excavó dos templos directamente en un acantilado nubio, custodiados por cuatro colosos sentados de más de 20 metros de altura. Dos veces al año, el sol naciente atraviesa la entrada para iluminar el santuario más interior.",
            "Cuando se construyó la Gran Presa de Asuán en la década de 1960, todo el monumento se cortó en bloques y se elevó a un terreno más alto en una operación de rescate de la UNESCO —una de las mayores jamás emprendidas— para salvarlo de la subida del lago.",
          ],
        },
      ],
    },
    places: {
      head: {
        eyebrow: "Más para ver",
        heading: "Templos, tumbas y dos Cairos",
        intro:
          "Más allá de los sitios más célebres, la ruta del patrimonio está salpicada de lugares que narran, cada uno, su propio capítulo de la historia.",
      },
      cards: [
        { image: "saqqara-step-pyramid", name: "Saqqara", body: "La Pirámide Escalonada de Zóser, levantada ca. 2670 a.C., es el monumento de piedra de gran tamaño más antiguo del mundo: el prototipo que toda pirámide posterior fue perfeccionando." },
        { image: "philae-temple", name: "File", body: "Un grácil templo dedicado a la diosa Isis, trasladado —isla incluida— a un terreno más alto durante la campaña de la Gran Presa de Asuán para que no se perdiera bajo el agua." },
        { image: "kom-ombo", name: "Kom Ombo", body: "Un raro templo doble a orillas del Nilo, construido en época grecorromana y compartido a partes iguales por el dios cocodrilo Sobek y el dios halcón Horus." },
        { image: "coptic-cairo", name: "El Cairo copto", body: "El antiguo barrio cristiano, con la Iglesia Colgante y calles que la tradición vincula al paso de la Sagrada Familia por Egipto." },
        { image: "islamic-cairo", name: "El Cairo islámico", body: "Una ciudad medieval de minaretes, mezquitas y el gran bazar de Khan el-Khalili, que es en sí mismo Patrimonio Mundial de la UNESCO." },
      ],
    },
    gallery: { eyebrow: "Galería", heading: "El patrimonio en imágenes" },
    creditsSummary: "Créditos y licencias de las imágenes",
  },
  "the-nile": {
    facts: [
      { icon: "globe", value: "~6650 km", label: "uno de los ríos más largos del mundo" },
      { icon: "travel", value: "Sur → Norte", label: "el Nilo fluye hacia el mar" },
      { icon: "user", value: "~95%", label: "de los egipcios vive en sus orillas" },
      { icon: "star", value: "Luxor y Asuán", label: "las grandes ciudades de templos del río" },
    ],
    features: {
      head: {
        eyebrow: "El río que hizo Egipto",
        heading: "La vida a orillas del Nilo",
        intro:
          "Los antiguos griegos llamaban a Egipto «el regalo del Nilo». Durante miles de años, la crecida del río depositó el limo negro que alimentó a todo el país, y casi todo el mundo sigue viviendo a la vista del agua.",
      },
      rows: [
        {
          image: "aswan-feluccas",
          eyebrow: "A vela",
          heading: "Navegar el Nilo en faluca",
          body: [
            "La faluca es el tradicional velero de madera del Nilo, de forma inalterada durante siglos. En torno a Asuán el río está en su momento más hermoso —islas, afloramientos de granito y desierto que baja hasta el agua— y una tarde a vela es la manera más antigua y serena de verlo.",
          ],
        },
        {
          image: "luxor-boats-on-nile",
          eyebrow: "La antigua Tebas",
          heading: "Luxor, una ciudad sobre el agua",
          body: [
            "Luxor se asienta sobre el emplazamiento de la antigua Tebas, capital del Imperio Nuevo. El río la parte en dos: la ribera oriental viva, con sus templos, y la ribera occidental de tumbas reales, donde se veía morir el sol cada atardecer. La vida del río sigue transcurriendo junto a todo ello durante todo el día.",
          ],
        },
        {
          image: "cairo-nile-skyline-sunset",
          eyebrow: "La capital",
          heading: "El Cairo, donde el río se encuentra con la ciudad",
          body: [
            "Cuando llega a El Cairo, el Nilo es ancho y bullicioso, y se abre paso entre la isla de Zamalek y un horizonte de unos veinte millones de personas. Un poco más al norte se abre en el gran Delta y desemboca en el Mediterráneo.",
          ],
        },
        {
          image: "aswan-wide-nile",
          eyebrow: "Un río transformado",
          heading: "La Gran Presa y el fin de la crecida",
          body: [
            "Durante milenios, el Nilo se desbordaba cada verano y renovaba los campos de Egipto. La Gran Presa de Asuán, terminada en 1970, puso fin para siempre a aquella crecida anual: creó el lago Nasser, generó electricidad y controló el agua, pero también alteró un ritmo por el que el país se había regido desde los faraones.",
          ],
        },
      ],
    },
    places: {
      head: {
        eyebrow: "A lo largo de las orillas",
        heading: "Islas, ciudades y la luz del río",
        intro:
          "El placer del Nilo está tanto en el trayecto como en los destinos: los tramos de campos verdes, las aves y el modo en que la luz cambia sobre el agua del alba al ocaso.",
      },
      cards: [
        { image: "nile-riverbank-kom-ombo-edfu", name: "Entre los templos", body: "La cinta verde de tierras de cultivo entre Kom Ombo y Edfú, donde el desierto aguarda justo más allá del último campo de regadío." },
        { image: "elephantine-island", name: "La isla Elefantina", body: "Una de las islas fluviales habitadas de Asuán, poblada desde la antigüedad, cuando custodiaba la frontera meridional de Egipto." },
        { image: "aswan-boat-egrets", name: "Fauna del río", body: "Garcillas bueyeras y una barca tradicional cerca de Asuán: el Nilo es un cordón de vida tanto para las aves como para las personas." },
        { image: "cairo-nile-night", name: "El Nilo al caer la noche", body: "Las luces de la ciudad a lo largo del paseo fluvial de Zamalek, en El Cairo, donde el río nunca llega a callar del todo." },
        { image: "river-nile-near-aswan", name: "El Nilo nubio", body: "Al sur de Asuán el paisaje se torna nubio: agua luminosa, arena dorada y granito oscuro." },
        { image: "nile-felucca-aswan", name: "Una barca y el viento", body: "Una única faluca atrapando la brisa: la imagen más sencilla y atemporal del río." },
      ],
    },
    gallery: { eyebrow: "Galería", heading: "El Nilo en imágenes" },
    creditsSummary: "Créditos y licencias de las imágenes",
  },
  deserts: {
    facts: [
      { icon: "globe", value: "~95%", label: "de Egipto es desierto" },
      { icon: "star", value: "3 regiones", label: "Desierto Occidental, Desierto Oriental y Sinaí" },
      { icon: "info", value: "UNESCO 2005", label: "Wadi Al-Hitan, el Valle de las Ballenas" },
      { icon: "clock", value: "siglo VI", label: "Santa Catalina, un monasterio vivo" },
    ],
    features: {
      head: {
        eyebrow: "Egipto más allá del río",
        heading: "Tres desiertos, un país",
        intro:
          "Deje atrás el estrecho valle verde y casi todo Egipto es desierto; pero aquí «desierto» significa muchas cosas: páramos de creta blanca, oasis poblados de palmeras, montañas pintadas y las cumbres sagradas del Sinaí.",
      },
      rows: [
        {
          image: "white-desert-alien-landscape",
          eyebrow: "Desierto Occidental",
          heading: "El Desierto Blanco",
          body: [
            "A pocas horas del oasis de Bahariya, el suelo se convierte en creta esculpida por el viento en forma de setas, torres y extrañas siluetas blancas que resplandecen al anochecer y bajo la luna. Acampar aquí, bajo algunos de los cielos más oscuros de Egipto, es la clásica noche de safari por el desierto.",
          ],
        },
        {
          image: "siwa-oracle-temple",
          eyebrow: "Desierto Occidental",
          heading: "Siwa y el Oráculo de Amón",
          body: [
            "La remota Siwa, cerca de la frontera con Libia, conservó su propia lengua y sus costumbres durante siglos. Su antiguo Oráculo de Amón fue célebre en todo el mundo clásico: se dice que Alejandro Magno cruzó el desierto para consultarlo en el 331 a.C.",
          ],
        },
        {
          image: "saint-catherine-monastery",
          eyebrow: "Sinaí",
          heading: "El Monasterio de Santa Catalina y el monte Sinaí",
          body: [
            "Al pie de la montaña donde la tradición sitúa a Moisés y la zarza ardiente, Santa Catalina es un monasterio en activo desde el siglo VI, una de las comunidades cristianas habitadas de forma continua más antiguas de la Tierra. Muchos viajeros ascienden en la oscuridad el pico que se alza tras él para alcanzar la cumbre al amanecer.",
          ],
        },
        {
          image: "wadi-el-hitan-fennec",
          eyebrow: "Fauna",
          heading: "Vida en la arena",
          body: [
            "El desierto dista mucho de estar vacío. Zorros fénec, gacelas y aves migratorias lo cruzan, mientras que Wadi Al-Hitan —el Valle de las Ballenas— protege los esqueletos fósiles de ballenas antiguas de una época, hace millones de años, en que este desierto era un mar.",
          ],
        },
      ],
    },
    places: {
      head: {
        eyebrow: "Oasis y cordilleras",
        heading: "Donde la arena toma forma",
        intro:
          "Entre los grandes mares de arena se esconden manantiales, palmerales y montañas: los lugares que hacen de un viaje por el desierto egipcio algo más que un largo horizonte.",
      },
      cards: [
        { image: "bahariya-oasis", name: "Oasis de Bahariya", body: "Una localidad verde, alimentada por manantiales, en el Desierto Occidental, y el punto de partida habitual hacia el Desierto Blanco y el Desierto Negro." },
        { image: "black-desert-panorama", name: "El Desierto Negro", body: "Bajas colinas volcánicas coronadas de piedra oscura dan a este tramo cercano a Bahariya su nombre y su color sombrío." },
        { image: "fayoum-desert", name: "El Fayún", body: "Una vasta depresión-oasis al suroeste de El Cairo, bordeada de desierto, lagos y los fósiles de ballenas de Wadi Al-Hitan." },
        { image: "sinai-canyon", name: "Los cañones del Sinaí", body: "Gargantas de arenisca de colores serpentean por el interior del Sinaí; el Cañón de Colores, cerca de Nuweiba, es el más conocido." },
        { image: "nuweiba-desert-road", name: "Carreteras del desierto", body: "Largas autopistas vacías discurren entre la costa y el interior, con montañas que vigilan la arena por todas partes." },
      ],
    },
    gallery: { eyebrow: "Galería", heading: "Los desiertos en imágenes" },
    creditsSummary: "Créditos y licencias de las imágenes",
  },
  "red-sea": {
    facts: [
      { icon: "star", value: "200+", label: "especies de coral en los arrecifes" },
      { icon: "info", value: "1983", label: "Ras Muhammad, el primer parque nacional de Egipto" },
      { icon: "weather", value: "Todo el año", label: "agua cálida y sol" },
      { icon: "travel", value: "Sharm y Hurghada", label: "las principales puertas al arrecife" },
    ],
    features: {
      head: {
        eyebrow: "Agua cálida, muros de coral",
        heading: "Uno de los grandes mares del mundo",
        intro:
          "El Mar Rojo es célebre entre buceadores y aficionados al snorkel por sus aguas cálidas y cristalinas y por arrecifes que se hunden en vertical hacia el azul. No hace falta bucear para disfrutarlo: buena parte del mejor coral está apenas a unos metros bajo la superficie.",
      },
      rows: [
        {
          image: "coral-reef-public-domain",
          eyebrow: "El arrecife",
          heading: "Un muro vivo de coral",
          body: [
            "Los arrecifes de Egipto albergan más de 200 especies de coral duro y blando y un deslumbrante elenco de peces —peces payaso, peces ángel, peces loro— y, de vez en cuando, una tortuga o un tiburón de arrecife. Como el agua es cálida y está en calma buena parte del año, la visibilidad suele ser excelente.",
          ],
        },
        {
          image: "sharm-coral",
          eyebrow: "Sur del Sinaí",
          heading: "Ras Muhammad y Sharm el Sheij",
          body: [
            "En el extremo mismo de la península del Sinaí, Ras Muhammad se convirtió en 1983 en el primer parque nacional de Egipto. Sus escarpados muros de coral y la vecina ciudad turística de Sharm el Sheij hacen de este uno de los tramos de arrecife más célebres del planeta.",
          ],
        },
        {
          image: "hurghada-coast",
          eyebrow: "La costa continental",
          heading: "Hurghada, el arrecife a la puerta de casa",
          body: [
            "Hurghada pasó de pequeño pueblo pesquero a la ciudad turística más animada del Mar Rojo, con fácil acceso en barco a decenas de arrecifes e islas de mar adentro. Es la opción clásica para un primer viaje al Mar Rojo o para sumar unos días de playa después de los templos.",
          ],
        },
        {
          image: "marsa-alam",
          eyebrow: "El extremo sur",
          heading: "Marsa Alam y la costa más tranquila",
          body: [
            "Más al sur, la costa se vuelve más agreste y menos urbanizada. Marsa Alam es conocida por sus dugongos, delfines y largos arrecifes, y es la puerta de acceso a algunos de los fondos más vírgenes de Egipto.",
          ],
        },
      ],
    },
    places: {
      head: {
        eyebrow: "Costa e islas",
        heading: "A lo largo de la orilla",
        intro:
          "Desde la calma del pueblo de buceo de Dahab hasta las islas desérticas peladas, la costa del Mar Rojo tiene más de un estado de ánimo.",
      },
      cards: [
        { image: "dahab-panorama", name: "Dahab y el Blue Hole", body: "Un relajado antiguo pueblo beduino en la costa del Sinaí, querido por los apneístas y hogar del famoso Blue Hole." },
        { image: "shadwan-island", name: "Islas del Mar Rojo", body: "Islas peladas y blanqueadas por el sol, como Shadwan, salpican el mar adentro, ceñidas por arrecifes y aguas abiertas." },
        { image: "nuweiba-red-sea-mountains", name: "Nuweiba", body: "En el golfo de Aqaba, donde las montañas del Sinaí caen casi en vertical hacia un mar estrecho y de un azul intenso." },
        { image: "red-sea-mountains", name: "Donde el desierto se encuentra con el mar", body: "Las montañas del Mar Rojo se alzan justo tierra adentro desde la costa, un recordatorio de que aquí arrecife y desierto son vecinos." },
        { image: "coral-bay-sharm", name: "Coral Bay", body: "Una de las bahías resguardadas en torno a Sharm el Sheij, con placas de arrecife accesibles directamente desde la playa." },
      ],
    },
    gallery: { eyebrow: "Galería", heading: "El Mar Rojo en imágenes" },
    creditsSummary: "Créditos y licencias de las imágenes",
  },
};

export const whenToVisitContentEs: typeof whenToVisitContent = {
  facts: [
    { icon: "weather", value: "oct – abr", label: "los meses más frescos y agradables" },
    { icon: "calendar", value: "22 feb y 22 oct", label: "el Festival Solar de Abu Simbel" },
    { icon: "travel", value: "Todo el año", label: "la costa del Mar Rojo se mantiene cálida" },
    { icon: "info", value: "40°C+", label: "máximas de verano en Luxor y Asuán" },
  ],
  climate: {
    head: {
      eyebrow: "Mes a mes",
      heading: "Cuándo venir y qué se siente",
      intro:
        "Egipto es un destino para todo el año, pero la experiencia cambia mucho según la estación. El invierno es suave y concurrido; pleno verano resulta muy caluroso en el interior, pero sigue siendo agradable en la costa. Las bandas de abajo son una guía general del clima para las visitas.",
    },
    months: [
      { month: "Enero", abbr: "Ene", band: "peak", note: "Días frescos y soleados y noches frías: clima ideal para las visitas y la temporada más concurrida." },
      { month: "Febrero", abbr: "Feb", band: "peak", note: "Suave y despejado; el Festival Solar de Abu Simbel cae el 22 de febrero." },
      { month: "Marzo", abbr: "Mar", band: "peak", note: "Cálido y agradable, todavía cómodo para largas jornadas de templos antes del calor del verano." },
      { month: "Abril", abbr: "Abr", band: "good", note: "Cálido y precioso; un breve viento khamsin puede levantar polvo algún día suelto." },
      { month: "Mayo", abbr: "May", band: "good", note: "Caluroso en el interior, pero excelente en la costa del Mar Rojo y con menos gente." },
      { month: "Junio", abbr: "Jun", band: "hot", note: "Comienza pleno verano: muy caluroso en Luxor y Asuán, que se disfrutan mejor a primera y última hora del día." },
      { month: "Julio", abbr: "Jul", band: "hot", note: "Calor máximo en el interior; la costa y un crucero por el Nilo con aire acondicionado son las opciones cómodas." },
      { month: "Agosto", abbr: "Ago", band: "hot", note: "Todavía muy caluroso en el interior, con aguas cálidas en el Mar Rojo." },
      { month: "Septiembre", abbr: "Sep", band: "good", note: "El calor intenso empieza a ceder: un buen mes de transición y con menos visitantes." },
      { month: "Octubre", abbr: "Oct", band: "peak", note: "Cómodo de nuevo en todas partes; el segundo Festival Solar de Abu Simbel cae el 22 de octubre." },
      { month: "Noviembre", abbr: "Nov", band: "peak", note: "Días cálidos y tardes frescas: uno de los mejores meses para viajar." },
      { month: "Diciembre", abbr: "Dic", band: "peak", note: "Fresco y soleado; concurrido en torno a las fiestas de Navidad y Año Nuevo." },
    ],
    legend: [
      { band: "peak", label: "Clima ideal para las visitas" },
      { band: "good", label: "Bueno: de cálido a caluroso" },
      { band: "hot", label: "Muy caluroso en el interior" },
    ],
  },
  regions: {
    head: {
      eyebrow: "Depende de adónde vaya",
      heading: "Distintos Egiptos, distintas estaciones",
      intro:
        "El mejor momento para viajar también depende de qué Egipto busque: el valle del Nilo, la costa del Mar Rojo y el desierto profundo tienen, cada uno, su propia ventana ideal.",
    },
    rows: [
      {
        image: "aswan-nile",
        eyebrow: "El valle del Nilo",
        heading: "Luxor, Asuán y los templos",
        body: [
          "Para los grandes monumentos, de octubre a abril es ideal: días cálidos y secos que convierten las largas horas entre templos en un placer. El verano aquí es realmente feroz, así que planifique salidas tempranas y descansos al mediodía si viene entre junio y agosto.",
        ],
      },
      {
        image: "red-sea-soma-bay",
        eyebrow: "La costa",
        heading: "El Mar Rojo",
        body: [
          "La costa es la excepción al calendario: cálida y apta para el baño casi todo el año. La primavera y el otoño son gloriosos, e incluso pleno verano, insoportable en el interior, se mantiene agradable aquí con la brisa marina y el baño fácil.",
        ],
      },
      {
        image: "white-desert-rock",
        eyebrow: "El Sáhara",
        heading: "El Desierto Occidental y los oasis",
        body: [
          "Los safaris por el desierto y las excursiones a los oasis son mejores de octubre a abril, cuando el calor diurno es manejable y las noches del desierto se vuelven frescas y estrelladas. Conviene evitar pleno verano en el desierto abierto.",
        ],
      },
    ],
  },
  gallery: {
    eyebrow: "Galería",
    heading: "Egipto a lo largo del año",
  },
  creditsSummary: "Créditos y licencias de las imágenes",
};

