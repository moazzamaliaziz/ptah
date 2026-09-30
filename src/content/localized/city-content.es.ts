/**
 * Spanish (es) editorial + SEO translation of `src/content/city-content.ts`.
 * Staging only. Register: usted. Facts mirrored exactly (GEM opened fully
 * 1 Nov 2025; Tutankhamun's mummy stays in the Valley of the Kings / KV62;
 * distances approximate). Keys, `heroSlug`, `image`, `icon`, `rank`, `nearby`
 * mirrored 1:1; only human-readable values translated.
 */
import type { cityContent } from "@/content/city-content";

export const cityContentEs: typeof cityContent = {
  cairo: {
    seo: {
      title: "Tours y excursiones de un día por El Cairo | Pirámides de Guiza",
      description:
        "Tours y excursiones de un día por El Cairo: Pirámides de Guiza y Esfinge, el Gran Museo Egipcio, la Ciudadela y el bazar de Khan el-Khalili, con guías locales.",
      keywords: [
        "tours por El Cairo",
        "excursiones de un día en El Cairo",
        "tours a las Pirámides de Guiza",
        "Gran Museo Egipcio",
        "qué hacer en El Cairo",
        "excursiones en El Cairo",
      ],
    },
    heroSlug: "city-of-a-thousand-minarets",
    heroEyebrow: "Egipto · La capital a orillas del Nilo",
    h1: "Tours y excursiones de un día por El Cairo",
    lede: "La extensa capital de Egipto: hogar de las Pirámides de Guiza y de cinco mil años de historia.",
    overview: [
      "Los tours por El Cairo ponen todo el arco de la historia egipcia al alcance de una sola ciudad. En la meseta de Guiza, en el extremo occidental de la capital, se alzan las últimas de las Siete Maravillas del mundo antiguo: la Gran Pirámide, sus dos compañeras y la Gran Esfinge. A poca distancia en coche, el Gran Museo Egipcio abrió por completo en noviembre de 2025 y muestra ahora, por primera vez, los tesoros completos de Tutankamón.",
      "Más allá de los faraones, El Cairo es una ciudad medieval viva. Su núcleo histórico —llamado a menudo la Ciudad de los Mil Minaretes— reúne la Ciudadela de Saladino, grandes mezquitas, iglesias coptas y el laberinto del bazar de Khan el-Khalili. Es el punto de partida natural de casi cualquier viaje a Egipto, y la base para excursiones a Guiza, Saqqara y Menfis.",
    ],
    facts: [
      { icon: "globe", value: "Valle del Nilo", label: "la región capital de Egipto" },
      { icon: "star", value: "Pirámides de Guiza", label: "la última maravilla antigua" },
      { icon: "calendar", value: "Oct – Abr", label: "los meses más agradables" },
      { icon: "travel", value: "Puerta principal", label: "Aeropuerto Internacional de El Cairo" },
    ],
    highlights: {
      head: {
        eyebrow: "Principales atractivos",
        heading: "Qué hacer en El Cairo",
        intro:
          "Desde la última maravilla en pie del mundo antiguo hasta una ciudad medieval de minaretes, estos son los lugares imprescindibles de un viaje a El Cairo.",
      },
      items: [
        {
          rank: 1,
          name: "Pirámides de Guiza y la Esfinge",
          body: "Las tres pirámides y la Gran Esfinge se asientan en una meseta al borde occidental de la ciudad: la única maravilla antigua que sigue en pie.",
        },
        {
          rank: 2,
          name: "Gran Museo Egipcio",
          body: "El mayor museo del mundo dedicado a una sola civilización, junto a las pirámides. Abierto por completo desde noviembre de 2025, alberga la colección completa de Tutankamón.",
        },
        {
          rank: 3,
          name: "El Museo Egipcio, Tahrir",
          body: "El histórico museo de la plaza Tahrir sigue exhibiendo una vasta colección de antigüedades; las momias reales descansan ahora en el Museo Nacional de la Civilización Egipcia.",
        },
        {
          rank: 4,
          name: "Ciudadela de Saladino y Mezquita de Muhammad Alí",
          body: "La fortaleza medieval que corona la ciudad, con la mezquita de alabastro y amplias vistas sobre los tejados.",
        },
        {
          rank: 5,
          name: "Khan el-Khalili y El Cairo islámico",
          body: "Un bazar fundado en el siglo XIV, enhebrado en calles de mezquitas y madrazas históricas.",
        },
        {
          rank: 6,
          name: "El Cairo copto",
          body: "El antiguo barrio cristiano, con la Iglesia Colgante y callejuelas ligadas por tradición al paso de la Sagrada Familia por Egipto.",
        },
      ],
    },
    features: {
      head: {
        eyebrow: "Explore la ciudad",
        heading: "Lo que hace de El Cairo un destino ineludible",
        intro:
          "El Egipto antiguo y el medieval conviven aquí codo con codo. Unos pocos días le permiten ir de las pirámides a los museos, a la ciudad vieja y al río.",
      },
      rows: [
        {
          image: "cairo-museum-public-domain",
          eyebrow: "Museos",
          heading: "De Tahrir al Gran Museo Egipcio",
          body: [
            "El Cairo cuenta ahora con dos grandes museos. El histórico Museo Egipcio de la plaza Tahrir, inaugurado en 1902, sigue albergando una asombrosa colección de antigüedades.",
            "En Guiza, el Gran Museo Egipcio abrió por completo el 1 de noviembre de 2025: el mayor museo de una sola civilización del mundo, y el primer lugar donde se muestra reunida la colección completa de Tutankamón.",
          ],
        },
        {
          image: "khan-el-khalili-cc0",
          eyebrow: "El Cairo viejo",
          heading: "Khan el-Khalili y la ciudad de los minaretes",
          body: [
            "El bazar de Khan el-Khalili comercia desde el siglo XIV, un dédalo de callejuelas donde se venden especias, lámparas, plata y café.",
            "A su alrededor se extiende El Cairo islámico histórico, un barrio de mezquitas y madrazas declarado Patrimonio de la Humanidad por la UNESCO, que dio a la ciudad su viejo apodo: la Ciudad de los Mil Minaretes.",
          ],
        },
        {
          image: "cairo-nile-night",
          eyebrow: "El río",
          heading: "El Nilo a través de la capital",
          body: [
            "El Nilo atraviesa El Cairo de parte a parte, ancho y bullicioso, y se abre en torno a la frondosa isla de Zamalek.",
            "Un paseo en faluca al atardecer o un crucero con cena es la forma más serena de ver la ciudad, con las luces de unos veinte millones de personas a ambas orillas.",
          ],
        },
      ],
    },
    whenToGo: {
      head: { eyebrow: "Planifique su visita", heading: "Mejor época para visitar El Cairo" },
      body: [
        "El Cairo está en su mejor momento de octubre a abril, cuando los días cálidos y secos hacen cómodas las largas horas en las pirámides y en la ciudad vieja.",
        "El verano, de junio a agosto, es caluroso y brumoso, pero perfectamente llevadero con salidas tempranas y descansos al mediodía. La primavera y el otoño traen el clima más agradable y los cielos más despejados.",
      ],
    },
    gettingThere: {
      head: { eyebrow: "Cómo moverse", heading: "Cómo llegar a El Cairo" },
      body: [
        "El Aeropuerto Internacional de El Cairo es la principal puerta de entrada de Egipto, con vuelos directos desde toda Europa, el Golfo, África y más allá.",
        "La ciudad es además el eje de la red ferroviaria de Egipto: trenes nocturnos y diurnos van al sur hacia Luxor y Asuán, y servicios rápidos al norte hacia Alejandría.",
      ],
    },
    gallery: { eyebrow: "Galería", heading: "El Cairo en fotografías" },
    faqs: [
      {
        q: "¿Cuántos días se necesitan en El Cairo?",
        a: "Dos o tres días completos cubren lo esencial: un día para las Pirámides de Guiza y el Gran Museo Egipcio, y uno o dos días para El Cairo islámico y copto, la Ciudadela y el bazar.",
      },
      {
        q: "¿Está abierto el Gran Museo Egipcio?",
        a: "Sí. El Gran Museo Egipcio de Guiza abrió por completo el 1 de noviembre de 2025 y exhibe la colección completa de Tutankamón junto a miles de piezas más.",
      },
      {
        q: "¿Se pueden ver las Pirámides en una excursión de un día?",
        a: "Con facilidad. La meseta de Guiza está dentro del área metropolitana de El Cairo, así que las pirámides y la Esfinge quedan a poca distancia en coche del centro y suelen combinarse con el Gran Museo Egipcio.",
      },
      {
        q: "¿Cuál es la mejor época para visitar El Cairo?",
        a: "De octubre a abril se disfruta del clima más cómodo para las visitas. El verano es caluroso pero llevadero con salidas tempranas y descansos al mediodía.",
      },
    ],
    creditsSummary: "Créditos y licencias de las imágenes",
    nearby: ["luxor", "alexandria", "aswan"],
  },
  luxor: {
    seo: {
      title: "Tours y excursiones de un día por Luxor | Reserve excursiones",
      description:
        "Tours y excursiones de un día por Luxor: Karnak, el Valle de los Reyes, el Templo de Hatshepsut y vuelos en globo al amanecer sobre el Nilo. Con egiptólogos titulados.",
      keywords: [
        "tours por Luxor",
        "excursiones de un día en Luxor",
        "tour del Valle de los Reyes",
        "Templo de Karnak",
        "qué hacer en Luxor",
        "excursiones en Luxor",
      ],
    },
    heroSlug: "karnak-temple",
    heroEyebrow: "Alto Egipto · La antigua Tebas",
    h1: "Tours y excursiones de un día por Luxor",
    lede: "El mayor museo al aire libre del mundo, levantado sobre el emplazamiento de la antigua Tebas.",
    overview: [
      "Los tours por Luxor lo adentran en el corazón de la antigua Tebas, la capital de Egipto en el Imperio Nuevo. Llamada a menudo el mayor museo al aire libre del mundo, Luxor concentra una densidad de monumentos sin igual: el vasto complejo del templo de Karnak, el Templo de Luxor en el centro de la ciudad y, al otro lado del Nilo, las tumbas reales del Valle de los Reyes.",
      "El río parte la ciudad en dos: la ribera oriental viva, con sus templos y mercados, y la ribera occidental de tumbas y templos funerarios donde los antiguos egipcios sepultaban a sus reyes. Un solo día puede unir Karnak con el Valle de los Reyes, y no hay amanecer más hermoso que el que se contempla desde un globo aerostático que sobrevuela toda la llanura tebana.",
    ],
    facts: [
      { icon: "globe", value: "Alto Egipto", label: "en el Nilo, la antigua Tebas" },
      { icon: "star", value: "Valle de los Reyes", label: "tumbas reales del Imperio Nuevo" },
      { icon: "calendar", value: "Nov – Feb", label: "los meses más frescos para las visitas" },
      { icon: "travel", value: "~1 h de vuelo", label: "al sur desde El Cairo" },
    ],
    highlights: {
      head: {
        eyebrow: "Principales atractivos",
        heading: "Qué hacer en Luxor",
        intro:
          "Templos, tumbas reales y el Nilo: Luxor concentra más Egipto antiguo en una estancia corta que ningún otro lugar del país.",
      },
      items: [
        {
          rank: 1,
          name: "Templo de Karnak",
          body: "Una ciudad de templos ampliada a lo largo de más de mil años; su Gran Sala Hipóstila reúne 134 columnas gigantes en un bosque de piedra.",
        },
        {
          rank: 2,
          name: "Valle de los Reyes",
          body: "Las tumbas reales excavadas en la roca del Imperio Nuevo, entre ellas la de Tutankamón, cuya momia aún descansa aquí.",
        },
        {
          rank: 3,
          name: "Templo de Luxor",
          body: "En pleno centro de la ciudad moderna, en su día unido a Karnak por una avenida de esfinges y bellamente iluminado tras el anochecer.",
        },
        {
          rank: 4,
          name: "Templo de Hatshepsut",
          body: "El templo funerario con columnatas de la faraona más famosa de Egipto, recostado contra los acantilados de la ribera occidental en Deir el-Bahari.",
        },
        {
          rank: 5,
          name: "Medinet Habu",
          body: "El gran templo funerario de Ramsés III, célebre por sus relieves tallados, vívidos y notablemente bien conservados.",
        },
        {
          rank: 6,
          name: "Un vuelo en globo al amanecer",
          body: "La experiencia clásica de Luxor: flotar sobre los templos, las tumbas y las verdes riberas mientras sale el sol.",
        },
      ],
    },
    features: {
      head: {
        eyebrow: "Explore la ciudad",
        heading: "Lo que hace de Luxor un destino ineludible",
        intro:
          "El Nilo divide Luxor entre los templos de la ribera oriental viva y las tumbas de la occidental. Ambas merecen un lugar en cualquier itinerario.",
      },
      rows: [
        {
          image: "valley-of-kings",
          eyebrow: "Ribera occidental",
          heading: "El Valle de los Reyes",
          body: [
            "Ocultas en un valle desértico tras los acantilados, más de sesenta tumbas reales se excavaron en lo hondo de la roca y se pintaron con textos que guiaban a los faraones hacia el más allá.",
            "Aquí está la tumba de Tutankamón, y su momia sigue reposando en su interior; buena parte de su tesoro se ha trasladado al Gran Museo Egipcio, cerca de El Cairo.",
          ],
        },
        {
          image: "hatshepsut-temple",
          eyebrow: "Templos funerarios",
          heading: "Templos contra los acantilados",
          body: [
            "El templo aterrazado de Hatshepsut se alza directamente desde la roca en Deir el-Bahari, uno de los edificios más impactantes de Egipto.",
            "Cerca se levantan Medinet Habu y los Colosos de Memnón, dos estatuas sedentes gigantescas que llevan más de tres mil años custodiando la llanura.",
          ],
        },
        {
          image: "luxor-nile-sunset",
          eyebrow: "El río",
          heading: "El Nilo a su paso por Luxor",
          body: [
            "Una faluca o una lancha a motor enlaza las dos riberas, y la puesta de sol sobre el agua es todo un ritual en Luxor.",
            "Muchos viajeros llegan o parten en crucero por el Nilo hacia Asuán, convirtiendo el trayecto entre los monumentos en parte del viaje.",
          ],
        },
      ],
    },
    whenToGo: {
      head: { eyebrow: "Planifique su visita", heading: "Mejor época para visitar Luxor" },
      body: [
        "Luxor está en el Alto Egipto, donde los veranos son realmente feroces: las temperaturas superan con regularidad los 40 °C de junio a agosto.",
        "La franja ideal es de noviembre a febrero, con días cálidos y secos, perfectos para largas horas entre los templos. Venga cuando venga, empiece temprano y descanse durante el calor del mediodía.",
      ],
    },
    gettingThere: {
      head: { eyebrow: "Cómo moverse", heading: "Cómo llegar a Luxor" },
      body: [
        "Luxor se asienta a orillas del Nilo, a unos 670 km al sur de El Cairo: alrededor de una hora de vuelo nacional, o un tren nocturno con literas.",
        "El Aeropuerto Internacional de Luxor gestiona vuelos nacionales e internacionales de temporada, y muchos visitantes llegan en crucero por el Nilo desde Asuán, a unos 220 km al sur.",
      ],
    },
    gallery: { eyebrow: "Galería", heading: "Luxor en fotografías" },
    faqs: [
      {
        q: "¿Cuántos días se necesitan en Luxor?",
        a: "Dos días permiten cubrir la ribera oriental (Karnak y el Templo de Luxor) y la occidental (Valle de los Reyes, Hatshepsut y Medinet Habu) sin prisas. Un día muy completo es posible si el tiempo escasea.",
      },
      {
        q: "¿Sigue la momia de Tutankamón en el Valle de los Reyes?",
        a: "Sí. La momia de Tutankamón permanece en su tumba (KV62), en el Valle de los Reyes. Buena parte de su tesoro se exhibe ahora en el Gran Museo Egipcio, cerca de El Cairo.",
      },
      {
        q: "¿Se puede visitar Luxor como excursión de un día desde Hurghada?",
        a: "Sí. Luxor es una popular excursión de un día completo desde Hurghada, en el Mar Rojo, por lo general unas horas de carretera en cada sentido, para ver Karnak y el Valle de los Reyes.",
      },
      {
        q: "¿Cuál es la mejor época para visitar Luxor?",
        a: "De noviembre a febrero, por el clima más fresco y cómodo para las visitas. El verano es muy caluroso pero más tranquilo, y se afronta mejor con salidas tempranas.",
      },
    ],
    creditsSummary: "Créditos y licencias de las imágenes",
    nearby: ["aswan", "cairo", "hurghada"],
  },
  aswan: {
    seo: {
      title: "Tours y excursiones de un día por Asuán | Abu Simbel y el Nilo",
      description:
        "Tours y excursiones de un día por Asuán: los templos de File y Abu Simbel, falucas en el Nilo, aldeas nubias y la Gran Presa. La serena ciudad del sur de Egipto.",
      keywords: [
        "tours por Asuán",
        "excursiones de un día en Asuán",
        "tour a Abu Simbel",
        "Templo de File",
        "faluca en Asuán",
        "qué hacer en Asuán",
      ],
    },
    heroSlug: "aswan-nile-r01",
    heroEyebrow: "Alto Egipto · El Nilo nubio",
    h1: "Tours y excursiones de un día por Asuán",
    lede: "La tranquila frontera sur de Egipto, donde el Nilo alcanza su mayor belleza.",
    overview: [
      "Los tours por Asuán recorren la apacible ciudad del sur de Egipto, allí donde el Nilo es más hermoso: islas, bloques de granito y desierto dorado que descienden hasta el agua de un azul brillante. Es la más relajada de las ciudades del Nilo y la puerta de Nubia, con una cultura, una gastronomía y una música propias.",
      "Desde Asuán puede navegar hasta el Templo de File, en su isla, dar un paseo en faluca alrededor de la isla Elefantina y la isla Kitchener, y emprender el viaje al sur hacia los colosales templos rupestres de Abu Simbel. La Gran Presa y el Obelisco Inacabado narran la historia más reciente de una ciudad moldeada por el río que domina.",
    ],
    facts: [
      { icon: "globe", value: "Nubia", label: "el extremo sur de Egipto" },
      { icon: "star", value: "Abu Simbel", label: "los templos rupestres de Ramsés II" },
      { icon: "calendar", value: "Nov – Feb", label: "clima fresco y despejado para las visitas" },
      { icon: "travel", value: "~1 h de vuelo", label: "al sur desde El Cairo" },
    ],
    highlights: {
      head: {
        eyebrow: "Principales atractivos",
        heading: "Qué hacer en Asuán",
        intro:
          "Templos en islas, veleros y la carretera a Abu Simbel: Asuán recompensa un ritmo más pausado que ningún otro punto del Nilo.",
      },
      items: [
        {
          rank: 1,
          name: "Abu Simbel",
          body: "Los colosales templos rupestres de Ramsés II, a unos 280 km al sur de Asuán, trasladados bloque a bloque para salvarlos de la subida de las aguas del lago Nasser.",
        },
        {
          rank: 2,
          name: "Templo de File",
          body: "El grácil templo de la diosa Isis, reubicado en la isla de Agilkia durante la campaña de la Gran Presa y al que se llega en barco.",
        },
        {
          rank: 3,
          name: "Una faluca por el Nilo",
          body: "El velero tradicional del río; una tarde en torno a la isla Elefantina y la isla Kitchener es la experiencia clásica de Asuán.",
        },
        {
          rank: 4,
          name: "Una aldea nubia",
          body: "Casas ribereñas pintadas de vivos colores, comida nubia y una cálida hospitalidad, a las que se suele llegar en barco cruzando el Nilo.",
        },
        {
          rank: 5,
          name: "La Gran Presa de Asuán",
          body: "La presa de los años sesenta que creó el lago Nasser, puso fin a la crecida anual del Nilo y transformó el Egipto moderno.",
        },
        {
          rank: 6,
          name: "El Obelisco Inacabado",
          body: "Abandonado en su antigua cantera de granito, revela con exactitud cómo tallaban los egipcios sus gigantescos monumentos.",
        },
      ],
    },
    features: {
      head: {
        eyebrow: "Explore la ciudad",
        heading: "Lo que hace de Asuán un destino ineludible",
        intro:
          "Este es el Nilo en su máxima belleza, y la puerta de Nubia y del extremo sur del Egipto antiguo.",
      },
      rows: [
        {
          image: "philae-temple",
          eyebrow: "Templo en una isla",
          heading: "File, templo de Isis",
          body: [
            "Cuando la Gran Presa amenazó con anegarlo, todo el templo de File se desmontó y se reconstruyó piedra a piedra en un terreno más alto, en la isla de Agilkia.",
            "Al que se llega en un breve trayecto en barco, ofrece uno de los emplazamientos más hermosos de cualquier templo de Egipto, sobre todo con la luz suave del amanecer.",
          ],
        },
        {
          image: "felucca-aswan",
          eyebrow: "A vela",
          heading: "Falucas y las islas",
          body: [
            "Nada capta la esencia de Asuán como una tarde bajo la vela blanca de una faluca, virando entre islas de granito mientras cae el sol.",
            "El río abraza aquí la isla Elefantina y los jardines botánicos de la isla Kitchener, ambos fáciles de incluir en una travesía a vela.",
          ],
        },
        {
          image: "aswan-high-dam",
          eyebrow: "El Nilo moderno",
          heading: "La Gran Presa y el lago Nasser",
          body: [
            "Terminada en 1970, la Gran Presa de Asuán domó las crecidas del Nilo y creó el lago Nasser, uno de los mayores embalses del mundo.",
            "El proyecto transformó Egipto, y obligó al épico rescate de Abu Simbel y File de las aguas en ascenso.",
          ],
        },
      ],
    },
    whenToGo: {
      head: { eyebrow: "Planifique su visita", heading: "Mejor época para visitar Asuán" },
      body: [
        "Por ser la más meridional de las principales ciudades de Egipto, Asuán es calurosa buena parte del año y abrasadora en pleno verano. De noviembre a febrero trae días cálidos y noches frescas y despejadas: ideal para los templos y el tiempo junto al río.",
        "El Festival del Sol de Abu Simbel, cuando la luz alcanza el santuario interior, se celebra el 22 de febrero y el 22 de octubre y atrae a grandes multitudes.",
      ],
    },
    gettingThere: {
      head: { eyebrow: "Cómo moverse", heading: "Cómo llegar a Asuán" },
      body: [
        "Asuán se asienta a orillas del Nilo, en el extremo sur de Egipto, a alrededor de una hora de vuelo desde El Cairo o un tren nocturno.",
        "Abu Simbel está unos 280 km más al sur, y se llega por carretera o en un breve vuelo nacional. Muchos visitantes llegan o parten en crucero por el Nilo entre Asuán y Luxor.",
      ],
    },
    gallery: { eyebrow: "Galería", heading: "Asuán en fotografías" },
    faqs: [
      {
        q: "¿Merece la pena la excursión a Abu Simbel desde Asuán?",
        a: "Para la mayoría de los viajeros, sí. Los dos templos rupestres de Ramsés II figuran entre los monumentos más espectaculares de Egipto. El trayecto ronda los 280 km por carretera en cada sentido, o un breve vuelo nacional.",
      },
      {
        q: "¿Qué es un paseo en faluca en Asuán?",
        a: "Una faluca es un velero tradicional de madera. Una suave travesía en torno a la isla Elefantina y la isla Kitchener, sobre todo al atardecer, es la experiencia distintiva de Asuán.",
      },
      {
        q: "¿Cuántos días se necesitan en Asuán?",
        a: "Uno o dos días cubren File, un paseo en faluca y una aldea nubia; añada un día si desea hacer la excursión al sur, a Abu Simbel.",
      },
      {
        q: "¿Cuál es la mejor época para visitar Asuán?",
        a: "De noviembre a febrero, por el clima más fresco. Los veranos son muy calurosos, así que las salidas tempranas resultan imprescindibles si viaja entonces.",
      },
    ],
    creditsSummary: "Créditos y licencias de las imágenes",
    nearby: ["luxor", "cairo", "hurghada"],
  },
  alexandria: {
    seo: {
      title: "Tours y excursiones de un día a Alejandría desde El Cairo",
      description:
        "Tours y excursiones de un día a Alejandría: la Ciudadela de Qaitbay, la Biblioteca Alexandrina, las catacumbas romanas y la corniche mediterránea.",
      keywords: [
        "tours por Alejandría",
        "excursiones de un día en Alejandría",
        "excursión de un día a Alejandría desde El Cairo",
        "Biblioteca Alexandrina",
        "Ciudadela de Qaitbay",
        "qué hacer en Alejandría",
      ],
    },
    heroSlug: "citadel-of-qaitbay-alexandria-egypt",
    heroEyebrow: "Egipto · La costa mediterránea",
    h1: "Tours y excursiones de un día a Alejandría",
    lede: "La legendaria ciudad costera de Egipto, fundada por Alejandro Magno.",
    overview: [
      "Los tours por Alejandría siguen el rastro de la ciudad mediterránea que Alejandro Magno fundó en 331 a. C. Durante siglos fue una de las grandes urbes del mundo antiguo, hogar de la fabulosa Biblioteca y del faro de Faros, una de las Siete Maravillas. Hoy es la segunda ciudad de Egipto, extendida a lo largo de una curva de paseo marítimo con un carácter muy suyo.",
      "La mayoría de los visitantes llega desde El Cairo, a unas tres horas por carretera o en tren de alta velocidad, lo que convierte a Alejandría en una popular excursión de un día. La Ciudadela de Qaitbay se alza en el emplazamiento del antiguo faro, y la moderna Biblioteca Alexandrina reaviva el recuerdo de la Biblioteca perdida, junto a las catacumbas romanas, la Columna de Pompeyo y el célebre marisco a orillas del mar.",
    ],
    facts: [
      { icon: "globe", value: "Mediterráneo", label: "la segunda ciudad de Egipto" },
      { icon: "star", value: "Ciudadela de Qaitbay", label: "en el emplazamiento del faro de Faros" },
      { icon: "calendar", value: "Primavera y otoño", label: "clima costero templado" },
      { icon: "travel", value: "~3 h", label: "por carretera o tren desde El Cairo" },
    ],
    highlights: {
      head: {
        eyebrow: "Principales atractivos",
        heading: "Qué hacer en Alejandría",
        intro:
          "El Egipto griego, romano y moderno superpuesto a lo largo de un mismo frente mediterráneo, todo ello a cómoda distancia de un día desde El Cairo.",
      },
      items: [
        {
          rank: 1,
          name: "Ciudadela de Qaitbay",
          body: "Un fuerte del siglo XV que guarda el puerto, levantado en el mismísimo emplazamiento del antiguo faro de Faros.",
        },
        {
          rank: 2,
          name: "Biblioteca Alexandrina",
          body: "Una llamativa biblioteca y centro cultural moderno que revive el legado de la antigua Biblioteca de Alejandría.",
        },
        {
          rank: 3,
          name: "Catacumbas de Kom el-Shoqafa",
          body: "Una necrópolis de época romana de varios niveles que fusiona el arte egipcio, griego y romano, redescubierta por azar en 1900.",
        },
        {
          rank: 4,
          name: "La Columna de Pompeyo",
          body: "Una imponente columna triunfal romana junto a las ruinas del templo del Serapeo.",
        },
        {
          rank: 5,
          name: "La corniche y Montaza",
          body: "El largo paseo marítimo, que termina al este en los jardines reales y el palacio de Montaza.",
        },
        {
          rank: 6,
          name: "Marisco frente al mar",
          body: "Alejandría es célebre en todo Egipto por su marisco mediterráneo fresco, degustado justo al borde del agua.",
        },
      ],
    },
    features: {
      head: {
        eyebrow: "Explore la ciudad",
        heading: "Lo que hace de Alejandría un destino ineludible",
        intro:
          "Una capital mediterránea de la memoria, donde los fantasmas del mundo antiguo se dan cita con un animado frente marítimo moderno.",
      },
      rows: [
        {
          image: "citadel-of-qaitbay-014",
          eyebrow: "El puerto",
          heading: "La Ciudadela de Qaitbay",
          body: [
            "La fortaleza de Qaitbay guarda la entrada del puerto oriental, con sus pálidos muros alzándose directamente desde el mar.",
            "Se levanta en el punto exacto donde el faro de Faros —una de las Siete Maravillas del mundo antiguo— advertía en su día a los barcos de la proximidad de la costa.",
          ],
        },
        {
          image: "alexandria-egypt-235108463",
          eyebrow: "La ciudad frente al mar",
          heading: "Una capital de la memoria junto al mar",
          body: [
            "Alejandría se curva durante kilómetros a lo largo de una corniche ventosa, con sus cafés y sus villas ajadas asomados al Mediterráneo.",
            "La moderna Biblioteca Alexandrina, las catacumbas romanas y la Columna de Pompeyo mantienen a flor de piel el pasado griego y romano de la ciudad.",
          ],
        },
      ],
    },
    whenToGo: {
      head: { eyebrow: "Planifique su visita", heading: "Mejor época para visitar Alejandría" },
      body: [
        "Por su emplazamiento mediterráneo, Alejandría es más templada que el resto de Egipto: agradable en primavera y otoño, calurosa pero refrescada por el mar en verano, y fresca y a veces lluviosa en invierno.",
        "La primavera (de marzo a mayo) y el otoño (de septiembre a noviembre) son las épocas más cómodas para pasear por la corniche y recorrer los lugares de interés.",
      ],
    },
    gettingThere: {
      head: { eyebrow: "Cómo moverse", heading: "Cómo llegar a Alejandría" },
      body: [
        "Alejandría está a unas tres horas de El Cairo por carretera o en tren de alta velocidad (unos 220 km al noroeste), lo que la convierte en una popular excursión de un día o de una noche desde la capital.",
        "El aeropuerto de Borg El Arab, al oeste de la ciudad, gestiona un número creciente de vuelos internacionales para quienes se dirigen directamente a la costa.",
      ],
    },
    gallery: { eyebrow: "Galería", heading: "Alejandría en fotografías" },
    faqs: [
      {
        q: "¿Se puede visitar Alejandría como excursión de un día desde El Cairo?",
        a: "Sí, es una de las excursiones de un día más populares de Egipto. Alejandría está a unas tres horas de El Cairo por carretera o en tren de alta velocidad, lo que deja un día completo para la Ciudadela, la biblioteca y las catacumbas.",
      },
      {
        q: "¿Por qué es conocida Alejandría?",
        a: "Fundada por Alejandro Magno, fue hogar de la antigua Biblioteca y del faro de Faros. Hoy destaca por su frente marítimo mediterráneo, sus lugares grecorromanos y su marisco fresco.",
      },
      {
        q: "¿Cuántos días se necesitan en Alejandría?",
        a: "Un solo día completo cubre lo más destacado. Pernoctar permite disfrutar de la corniche y del marisco a un ritmo más pausado.",
      },
      {
        q: "¿Cuál es la mejor época para visitar Alejandría?",
        a: "La primavera y el otoño son ideales. El verano es concurrido y cálido, pero suavizado por el mar; el invierno es fresco y puede ser lluvioso.",
      },
    ],
    creditsSummary: "Créditos y licencias de las imágenes",
    nearby: ["cairo", "luxor", "aswan"],
  },
  hurghada: {
    seo: {
      title: "Excursiones y salidas de un día en Hurghada | Mar Rojo",
      description:
        "Excursiones de un día en Hurghada: snorkel y buceo en los arrecifes del Mar Rojo, paseos en barco a la isla Giftun, safaris por el desierto y excursiones a Luxor.",
      keywords: [
        "excursiones en Hurghada",
        "excursiones de un día en Hurghada",
        "snorkel en la isla Giftun",
        "buceo en el Mar Rojo en Hurghada",
        "qué hacer en Hurghada",
        "paseos en barco en Hurghada",
      ],
    },
    heroSlug: "giftun-eden-island",
    heroEyebrow: "Egipto · La Riviera del Mar Rojo",
    h1: "Excursiones y salidas de un día en Hurghada",
    lede: "El complejo turístico más animado del Mar Rojo egipcio, y puerta de acceso a arrecifes de aguas cálidas.",
    overview: [
      "Las excursiones en Hurghada giran por completo en torno al Mar Rojo. Convertida de una pequeña aldea de pescadores en el complejo costero más animado de Egipto, Hurghada se asienta sobre un largo tramo de agua cálida y cristalina, con decenas de arrecifes e islas frente a la costa al alcance de la mano. Es la opción clásica para un primer viaje al Mar Rojo, unas vacaciones familiares de playa o un añadido de sol y mar tras los templos.",
      "Los paseos en barco zarpan hacia la isla Giftun y Orange Bay para practicar snorkel sobre jardines de coral, mientras los buceadores exploran arrecifes y pecios a lo largo de la costa. Tierra adentro, los safaris por el desierto en quad o todoterreno llegan a campamentos beduinos bajo las estrellas, y las excursiones de un día se adentran al oeste hacia los templos de Luxor.",
    ],
    facts: [
      { icon: "globe", value: "Costa del Mar Rojo", label: "el Egipto continental" },
      { icon: "star", value: "Isla Giftun", label: "arrecifes y calas de arena blanca" },
      { icon: "weather", value: "Sol todo el año", label: "mar cálido y sol" },
      { icon: "travel", value: "Vuelos chárter directos", label: "y ~1 h de vuelo desde El Cairo" },
    ],
    highlights: {
      head: {
        eyebrow: "Principales atractivos",
        heading: "Qué hacer en Hurghada",
        intro:
          "Arrecifes, islas y desierto: Hurghada está pensada para el tiempo sobre y bajo el agua, con los templos de Luxor a un día de distancia.",
      },
      items: [
        {
          rank: 1,
          name: "Isla Giftun y Orange Bay",
          body: "El paseo en barco más popular desde Hurghada: calas de arena blanca y arrecifes poco profundos, ideales para el snorkel.",
        },
        {
          rank: 2,
          name: "Snorkel y buceo en los arrecifes",
          body: "El agua cálida y cristalina y los arrecifes repletos de coral y peces hacen de este uno de los destinos de buceo favoritos del mundo.",
        },
        {
          rank: 3,
          name: "Un paseo en barco por el Mar Rojo",
          body: "Los cruceros de medio día y de día completo combinan paradas de snorkel, baños y almuerzo en el agua.",
        },
        {
          rank: 4,
          name: "Safari por el desierto",
          body: "Quads, todoterrenos y camellos se adentran en el Desierto Oriental hasta campamentos beduinos para la puesta de sol y la cena.",
        },
        {
          rank: 5,
          name: "La marina y el casco viejo de El Dahar",
          body: "El paseo marítimo para cenar y salir por la noche, y los mercados y cafés del barrio más antiguo.",
        },
        {
          rank: 6,
          name: "Excursión de un día a Luxor",
          body: "Una jornada larga pero gratificante tierra adentro, hacia los templos y las tumbas de la antigua Tebas.",
        },
      ],
    },
    features: {
      head: {
        eyebrow: "Explore la costa",
        heading: "Lo que hace de Hurghada un destino ineludible",
        intro:
          "Toda una costa de arrecifes e islas, con los enclaves antiguos del valle del Nilo a un cómodo día de distancia.",
      },
      rows: [
        {
          image: "giftun-island-egypte-panoramio",
          eyebrow: "Las islas",
          heading: "La isla Giftun y los arrecifes",
          body: [
            "Las islas frente a Hurghada están rodeadas de arrecifes de coral poco profundos y de blanquísimos bancos de arena: el Mar Rojo en su versión más de postal.",
            "Orange Bay, en Giftun, es la parada estelar, con aguas cálidas y tranquilas que convienen tanto a quien practica snorkel por primera vez como a los buceadores expertos.",
          ],
        },
        {
          image: "egypt-hurghada-from-plane01",
          eyebrow: "La Riviera del Mar Rojo",
          heading: "Costa de complejos y borde del desierto",
          body: [
            "Hurghada se extiende durante kilómetros a lo largo de la orilla, una franja de complejos y marinas respaldada por el Desierto Oriental.",
            "Esa mezcla le permite practicar snorkel por la mañana, recorrer las dunas en quad al atardecer y aún así encajar una excursión de un día a los templos de Luxor.",
          ],
        },
      ],
    },
    whenToGo: {
      head: { eyebrow: "Planifique su visita", heading: "Mejor época para visitar Hurghada" },
      body: [
        "La costa del Mar Rojo es un destino para todo el año: cálida y apta para el baño en cualquier temporada. La primavera y el otoño son espléndidos, y la temperatura del agua se mantiene agradable durante todo el año.",
        "El verano es caluroso, pero suavizado por la brisa marina y perfecto para el tiempo en el agua, mientras que el invierno se mantiene templado y soleado de día, y más fresco al caer la noche.",
      ],
    },
    gettingThere: {
      head: { eyebrow: "Cómo moverse", heading: "Cómo llegar a Hurghada" },
      body: [
        "Hurghada se asienta en la costa del Mar Rojo, a alrededor de una hora de vuelo desde El Cairo o unas cuatro o cinco horas en coche.",
        "El Aeropuerto Internacional de Hurghada recibe vuelos regulares y chárter directos desde numerosas ciudades europeas, lo que lo convierte en uno de los lugares de Egipto más fáciles de alcanzar directamente desde el extranjero.",
      ],
    },
    gallery: { eyebrow: "Galería", heading: "Hurghada en fotografías" },
    faqs: [
      {
        q: "¿Cuál es la mejor excursión en Hurghada?",
        a: "Un paseo en barco a la isla Giftun y Orange Bay es el más popular, pues combina el snorkel sobre arrecifes de coral con el tiempo en playas de arena blanca.",
      },
      {
        q: "¿Se puede visitar Luxor desde Hurghada?",
        a: "Sí. Luxor es una popular excursión de un día completo desde Hurghada, por lo general unas horas de carretera en cada sentido, para ver Karnak y el Valle de los Reyes.",
      },
      {
        q: "¿Es Hurghada buena para el snorkel y el buceo?",
        a: "Mucho. Los arrecifes frente a la costa son cálidos, cristalinos y ricos en coral y peces, aptos tanto para principiantes como para buceadores experimentados.",
      },
      {
        q: "¿Cuál es la mejor época para visitar Hurghada?",
        a: "Cualquier época del año. La primavera y el otoño son ideales; el verano es caluroso pero estupendo para el agua; el invierno es templado y soleado.",
      },
    ],
    creditsSummary: "Créditos y licencias de las imágenes",
    nearby: ["luxor", "cairo", "sharm-el-sheikh"],
  },
  "sharm-el-sheikh": {
    seo: {
      title: "Excursiones y salidas de un día en Sharm el-Sheikh",
      description:
        "Excursiones en Sharm el-Sheikh: buceo y snorkel de primer nivel en Ras Muhammad y Tirán, safaris por el desierto y la excursión al Monasterio de Santa Catalina.",
      keywords: [
        "excursiones en Sharm el-Sheikh",
        "excursiones de un día en Sharm el-Sheikh",
        "buceo en Ras Muhammad",
        "snorkel en la isla de Tirán",
        "qué hacer en Sharm el-Sheikh",
        "excursión al Monasterio de Santa Catalina",
      ],
    },
    heroSlug: "ras-mohammed-panoramio",
    heroEyebrow: "Egipto · Sinaí del Sur",
    h1: "Excursiones y salidas de un día en Sharm el-Sheikh",
    lede: "Un complejo del sur del Sinaí rodeado de algunos de los arrecifes de coral más bellos del mundo.",
    overview: [
      "Las excursiones en Sharm el-Sheikh se centran en los extraordinarios arrecifes del sur del Sinaí. En el extremo meridional de la península, el complejo se asoma a unas aguas que atraen a buceadores y aficionados al snorkel de todo el mundo, en ningún lugar tanto como en el Parque Nacional de Ras Muhammad, el primer parque nacional de Egipto, donde escarpadas paredes de coral se precipitan directamente hacia el azul.",
      "Más allá de los arrecifes, Sharm es una base para el desierto y las montañas del interior del Sinaí. Los paseos en barco zarpan hacia la isla de Tirán, y uno de los grandes viajes por tierra de Egipto asciende hasta el Monasterio de Santa Catalina y el monte Sinaí. Naama Bay es el epicentro para cenar y salir por la noche.",
    ],
    facts: [
      { icon: "globe", value: "Sinaí del Sur", label: "el extremo de la península" },
      { icon: "star", value: "Ras Muhammad", label: "el primer parque nacional de Egipto" },
      { icon: "weather", value: "Sol todo el año", label: "agua cálida y cristalina del Mar Rojo" },
      { icon: "travel", value: "Vuelos directos", label: "desde Europa y el Golfo" },
    ],
    highlights: {
      head: {
        eyebrow: "Principales atractivos",
        heading: "Qué hacer en Sharm el-Sheikh",
        intro:
          "Algunos de los mejores fondos de buceo del planeta están al alcance de la mano, con aventuras de desierto y montaña a un corto trayecto tierra adentro.",
      },
      items: [
        {
          rank: 1,
          name: "Parque Nacional de Ras Muhammad",
          body: "El primer parque nacional de Egipto, que protege espectaculares paredes de coral donde buceadores y aficionados al snorkel se cruzan con bancos de peces.",
        },
        {
          rank: 2,
          name: "Buceo y snorkel",
          body: "Sharm es uno de los principales centros de buceo del mundo, con arrecifes de fácil acceso para principiantes y célebres puntos de inmersión para expertos.",
        },
        {
          rank: 3,
          name: "Isla de Tirán",
          body: "Una de las favoritas para los paseos en barco, en el estrecho entre el Sinaí y Arabia, rodeada de arrecifes poco profundos y llenos de color.",
        },
        {
          rank: 4,
          name: "Naama Bay",
          body: "El animado epicentro del complejo, frente al mar, con restaurantes, cafés y vida nocturna.",
        },
        {
          rank: 5,
          name: "El Monasterio de Santa Catalina y el monte Sinaí",
          body: "Un viaje por tierra hasta las montañas, a un monasterio del siglo VI y a la cima tradicionalmente vinculada a Moisés.",
        },
        {
          rank: 6,
          name: "Safari por el desierto",
          body: "Salidas en quad, todoterreno y camello por el desierto del Sinaí, que a menudo terminan con una cena beduina bajo las estrellas.",
        },
      ],
    },
    features: {
      head: {
        eyebrow: "Explore la costa",
        heading: "Lo que hace de Sharm el-Sheikh un destino ineludible",
        intro:
          "Los arrecifes son el motivo para venir, pero los desiertos y las montañas sagradas del Sinaí dan a Sharm una segunda dimensión.",
      },
      rows: [
        {
          image: "ras-mohamed-national-park-panoramio",
          eyebrow: "El parque nacional",
          heading: "Las paredes de coral de Ras Muhammad",
          body: [
            "En el mismísimo extremo del Sinaí, los arrecifes de Ras Muhammad se hunden desde la superficie hacia unas aguas de azul profundo rebosantes de peces.",
            "Declarado en 1983 primer parque nacional de Egipto, sigue siendo uno de los sistemas de arrecifes más bellos y protegidos del Mar Rojo.",
          ],
        },
        {
          image: "divemaster-ready-to-go",
          eyebrow: "Bajo la superficie",
          heading: "Una capital mundial del buceo",
          body: [
            "Los centros de buceo jalonan la orilla, con cursos para principiantes absolutos e inmersiones guiadas a puntos célebres para los experimentados.",
            "El agua cálida y la excelente visibilidad hacen de Sharm uno de los lugares más fáciles del mundo para aprender a bucear o, sencillamente, hacer snorkel en un arrecife.",
          ],
        },
        {
          image: "tiran-island-sharm-el-sheikh-south-sinai-egypt",
          eyebrow: "Paseos en barco",
          heading: "La isla de Tirán y el estrecho",
          body: [
            "Los arrecifes que rodean Tirán, en el estrecho que mira hacia Arabia Saudí, son una excursión clásica en barco desde Sharm.",
            "Los jardines de coral poco profundos y los cortados submarinos se hallan muy próximos entre sí, de modo que buceadores y aficionados al snorkel comparten algunos de los mejores puntos.",
          ],
        },
      ],
    },
    whenToGo: {
      head: { eyebrow: "Planifique su visita", heading: "Mejor época para visitar Sharm el-Sheikh" },
      body: [
        "Resguardada en el golfo de Áqaba, Sharm el-Sheikh disfruta de un clima cálido y seco casi todo el año. La primavera y el otoño son ideales para combinar el buceo con salidas al desierto.",
        "El verano es caluroso, pero el mar sigue siendo tentador, y los días de invierno son agradablemente cálidos, aunque las noches, y la excursión de montaña a Santa Catalina, pueden ser frías.",
      ],
    },
    gettingThere: {
      head: { eyebrow: "Cómo moverse", heading: "Cómo llegar a Sharm el-Sheikh" },
      body: [
        "Sharm el-Sheikh se asienta en el extremo sur de la península del Sinaí. Su aeropuerto internacional recibe vuelos regulares y chárter directos desde toda Europa y el Golfo, de modo que muchos visitantes llegan directamente desde el extranjero.",
        "Por tierra, es un trayecto largo pero pintoresco desde El Cairo a través del Sinaí, y los vuelos nacionales lo conectan con la capital en alrededor de una hora.",
      ],
    },
    gallery: { eyebrow: "Galería", heading: "Sharm el-Sheikh en fotografías" },
    faqs: [
      {
        q: "¿Por qué es más conocida Sharm el-Sheikh?",
        a: "Por el buceo y el snorkel de nivel mundial, sobre todo en el Parque Nacional de Ras Muhammad, además de su sol cálido todo el año y sus cómodos vuelos directos desde Europa.",
      },
      {
        q: "¿Pueden bucear o hacer snorkel los principiantes en Sharm?",
        a: "Sí. Muchos arrecifes son poco profundos y están cerca de la orilla, ideales para quienes practican snorkel por primera vez, mientras que los centros de buceo ofrecen cursos e inmersiones guiadas para todos los niveles.",
      },
      {
        q: "¿Merece la pena la excursión al Monasterio de Santa Catalina?",
        a: "Para muchos visitantes, sí. Es una larga jornada por tierra —o una noche para el ascenso al monte Sinaí y el amanecer— hacia las montañas, hasta uno de los monasterios en activo más antiguos del mundo.",
      },
      {
        q: "¿Cuál es la mejor época para visitar Sharm el-Sheikh?",
        a: "La primavera y el otoño son ideales. El verano es caluroso pero estupendo para el agua, y el invierno es templado de día aunque más fresco por la noche.",
      },
    ],
    creditsSummary: "Créditos y licencias de las imágenes",
    nearby: ["cairo", "hurghada", "luxor"],
  },
};
