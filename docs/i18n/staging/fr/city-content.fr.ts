/**
 * City pages editorial + SEO content (French) — inventory module E.
 *
 * Mirrors `cityContent` from `src/content/city-content.ts`: same 6 city keys,
 * same nesting, same array order. Only human-readable string values are
 * translated; heroSlug / image / icon / rank / nearby slugs are kept verbatim.
 *
 * FACTS preserved exactly: the Grand Egyptian Museum opened fully on
 * 1 November 2025 with the complete Tutankhamun collection; Tutankhamun's mummy
 * remains in the Valley of the Kings (KV62); approximate distances stay approximate.
 *
 * Typography: authored with natural French punctuation (regular spaces); a final
 * Node normalization pass inserts real U+00A0 before « ; : ! ? » and inside guillemets.
 * Thousands use a (later-inserted) NBSP; years carry no separator.
 */
import { cityContent } from "@/content/city-content";

export const cityContentFr: typeof cityContent = {
  cairo: {
    seo: {
      title: "Circuits et excursions au Caire | Pyramides de Gizeh",
      description:
        "Réservez des circuits et des excursions à la journée au Caire — les pyramides de Gizeh et le Sphinx, le Grand Musée égyptien, la Citadelle et le bazar de Khan el-Khalili. Guidés par des experts locaux.",
      keywords: [
        "circuits au Caire",
        "excursions à la journée au Caire",
        "circuits aux pyramides de Gizeh",
        "Grand Musée égyptien",
        "que faire au Caire",
        "excursions au Caire",
      ],
    },
    heroSlug: "city-of-a-thousand-minarets",
    heroEyebrow: "Égypte · La capitale sur le Nil",
    h1: "Circuits et excursions à la journée au Caire",
    lede: "La capitale tentaculaire de l’Égypte — berceau des pyramides de Gizeh et de cinq mille ans d’histoire.",
    overview: [
      "Les circuits au Caire réunissent toute l’ampleur de l’histoire égyptienne dans une seule ville. Sur le plateau de Gizeh, à la lisière ouest de la capitale, se dressent les dernières des Sept Merveilles du monde antique — la grande pyramide, ses deux compagnes et le grand Sphinx. À quelques minutes de route, le Grand Musée égyptien a ouvert entièrement en novembre 2025 et présente désormais, pour la première fois, l’intégralité des trésors de Toutânkhamon.",
      "Au-delà des pharaons, Le Caire est une ville médiévale vivante. Son cœur historique — souvent appelé la Cité aux mille minarets — mêle la citadelle de Saladin, de grandes mosquées, des églises coptes et le labyrinthe du bazar de Khan el-Khalili. C’est le point de départ naturel de presque tout voyage en Égypte, et la base des excursions vers Gizeh, Saqqarah et Memphis.",
    ],
    facts: [
      { icon: "globe", value: "Vallée du Nil", label: "la région capitale de l’Égypte" },
      { icon: "star", value: "Pyramides de Gizeh", label: "la dernière merveille antique" },
      { icon: "calendar", value: "oct. – avr.", label: "les mois les plus agréables" },
      { icon: "travel", value: "Porte principale", label: "l’aéroport international du Caire" },
    ],
    highlights: {
      head: {
        eyebrow: "Sites incontournables",
        heading: "Que faire au Caire",
        intro:
          "De la dernière merveille du monde antique encore debout à une cité médiévale de minarets, voici les sites au cœur d’un voyage au Caire.",
      },
      items: [
        { rank: 1, name: "Les pyramides de Gizeh et le Sphinx", body: "Les trois pyramides et le grand Sphinx s’élèvent sur un plateau à la lisière ouest de la ville — la seule merveille antique encore debout." },
        { rank: 2, name: "Le Grand Musée égyptien", body: "Le plus grand musée au monde consacré à une seule civilisation, aux côtés des pyramides. Entièrement ouvert depuis novembre 2025, il abrite l’intégralité de la collection de Toutânkhamon." },
        { rank: 3, name: "Le Musée égyptien, place Tahrir", body: "Le musée historique de la place Tahrir présente toujours une vaste collection d’antiquités ; les momies royales reposent désormais au Musée national de la civilisation égyptienne." },
        { rank: 4, name: "La citadelle de Saladin et la mosquée de Méhémet Ali", body: "La forteresse médiévale qui couronne la ville, avec sa mosquée d’albâtre et de longues vues par-dessus les toits." },
        { rank: 5, name: "Khan el-Khalili et Le Caire islamique", body: "Un bazar fondé au XIVe siècle, enfilé à travers des rues de mosquées et de madrasas historiques." },
        { rank: 6, name: "Le Caire copte", body: "L’ancien quartier chrétien, avec l’église suspendue et des ruelles liées par la tradition au séjour de la Sainte Famille en Égypte." },
      ],
    },
    features: {
      head: {
        eyebrow: "Explorer la ville",
        heading: "Ce qui rend Le Caire incontournable",
        intro:
          "L’Égypte antique et médiévale se côtoient ici. Quelques jours suffisent pour passer des pyramides aux musées, puis à la vieille ville et au fleuve.",
      },
      rows: [
        {
          image: "cairo-museum-public-domain",
          eyebrow: "Musées",
          heading: "De Tahrir au Grand Musée égyptien",
          body: [
            "Le Caire compte désormais deux grands musées. Le Musée égyptien historique de la place Tahrir, ouvert en 1902, conserve toujours une collection d’antiquités stupéfiante.",
            "À Gizeh, le Grand Musée égyptien a ouvert entièrement le 1er novembre 2025 — le plus grand musée consacré à une seule civilisation au monde, et le premier lieu à présenter réunie l’intégralité de la collection de Toutânkhamon.",
          ],
        },
        {
          image: "khan-el-khalili-cc0",
          eyebrow: "Le vieux Caire",
          heading: "Khan el-Khalili et la cité des minarets",
          body: [
            "Le bazar de Khan el-Khalili commerce depuis le XIVe siècle, un dédale de ruelles où l’on vend épices, lampes, argent et café.",
            "Autour de lui s’étend Le Caire islamique historique, un quartier classé par l’UNESCO, de mosquées et de madrasas, qui a valu à la ville son vieux surnom de Cité aux mille minarets.",
          ],
        },
        {
          image: "cairo-nile-night",
          eyebrow: "Le fleuve",
          heading: "Le Nil à travers la capitale",
          body: [
            "Le Nil traverse Le Caire de part en part, large et animé, se divisant autour de l’île verdoyante de Zamalek.",
            "Une navigation en felouque le soir ou un dîner-croisière est la manière la plus paisible de voir la ville, avec les lumières de quelque vingt millions d’habitants le long des deux rives.",
          ],
        },
      ],
    },
    whenToGo: {
      head: { eyebrow: "Préparer votre visite", heading: "Meilleure période pour visiter Le Caire" },
      body: [
        "Le Caire se découvre au mieux d’octobre à avril, quand des journées chaudes et sèches rendent agréables les longues heures aux pyramides et dans la vieille ville.",
        "L’été, de juin à août, est chaud et brumeux mais tout à fait praticable avec des départs matinaux et des pauses à midi. Le printemps et l’automne offrent le temps le plus agréable et les ciels les plus clairs.",
      ],
    },
    gettingThere: {
      head: { eyebrow: "Se déplacer", heading: "Comment se rendre au Caire" },
      body: [
        "L’aéroport international du Caire est la principale porte d’entrée de l’Égypte, avec des vols directs depuis toute l’Europe, le Golfe, l’Afrique et au-delà.",
        "La ville est aussi le centre du réseau ferroviaire égyptien — des trains de nuit et de jour descendent vers le sud jusqu’à Louxor et Assouan, et des services rapides montent vers le nord jusqu’à Alexandrie.",
      ],
    },
    gallery: { eyebrow: "Galerie", heading: "Le Caire en images" },
    faqs: [
      { q: "Combien de jours faut-il au Caire ?", a: "Deux à trois journées pleines couvrent l’essentiel : une journée pour les pyramides de Gizeh et le Grand Musée égyptien, et une journée ou deux pour Le Caire islamique et copte, la Citadelle et le bazar." },
      { q: "Le Grand Musée égyptien est-il ouvert ?", a: "Oui. Le Grand Musée égyptien de Gizeh a ouvert entièrement le 1er novembre 2025 et présente l’intégralité de la collection de Toutânkhamon aux côtés de milliers d’autres objets." },
      { q: "Peut-on voir les pyramides lors d’une excursion à la journée ?", a: "Facilement. Le plateau de Gizeh se trouve dans l’agglomération du Caire ; les pyramides et le Sphinx sont donc à quelques minutes de route du centre et se combinent d’ordinaire avec le Grand Musée égyptien." },
      { q: "Quelle est la meilleure période pour visiter Le Caire ?", a: "D’octobre à avril, pour le temps de visite le plus agréable. L’été est chaud mais gérable avec des départs matinaux et des repos à midi." },
    ],
    creditsSummary: "Crédits et licences des images",
    nearby: ["luxor", "alexandria", "aswan"],
  },
  luxor: {
    seo: {
      title: "Circuits et excursions à Louxor | Réservez vos sorties",
      description:
        "Circuits et excursions à la journée à Louxor — Karnak, la vallée des Rois, le temple d’Hatchepsout et les vols en montgolfière à l’aube au-dessus du Nil. Guidés par des égyptologues diplômés.",
      keywords: [
        "circuits à Louxor",
        "excursions à la journée à Louxor",
        "visite de la vallée des Rois",
        "temple de Karnak",
        "que faire à Louxor",
        "excursions à Louxor",
      ],
    },
    heroSlug: "karnak-temple",
    heroEyebrow: "Haute-Égypte · L’antique Thèbes",
    h1: "Circuits et excursions à la journée à Louxor",
    lede: "Le plus grand musée à ciel ouvert du monde, bâti sur le site de l’antique Thèbes.",
    overview: [
      "Les circuits à Louxor vous mènent au cœur de l’antique Thèbes, capitale de l’Égypte du Nouvel Empire. Souvent appelée le plus grand musée à ciel ouvert du monde, Louxor rassemble une densité de monuments sans égale ailleurs — le vaste complexe du temple de Karnak, le temple de Louxor au centre-ville et, de l’autre côté du Nil, les tombes royales de la vallée des Rois.",
      "Le fleuve coupe la ville en deux : la rive orientale vivante, avec ses temples et ses marchés, et la rive occidentale des tombes et des temples funéraires où les anciens Égyptiens enterraient leurs rois. Une seule journée peut associer Karnak à la vallée des Rois, et il n’est pas de plus belle aube que celle vue d’une montgolfière dérivant au-dessus de toute la plaine thébaine.",
    ],
    facts: [
      { icon: "globe", value: "Haute-Égypte", label: "sur le Nil, l’antique Thèbes" },
      { icon: "star", value: "Vallée des Rois", label: "tombes royales du Nouvel Empire" },
      { icon: "calendar", value: "nov. – févr.", label: "les mois les plus frais pour visiter" },
      { icon: "travel", value: "~1 h de vol", label: "au sud du Caire" },
    ],
    highlights: {
      head: {
        eyebrow: "Sites incontournables",
        heading: "Que faire à Louxor",
        intro:
          "Temples, tombes royales et le Nil — Louxor concentre plus d’Égypte antique en un court séjour que partout ailleurs dans le pays.",
      },
      items: [
        { rank: 1, name: "Le temple de Karnak", body: "Une cité de temples enrichie durant plus de mille ans ; sa grande salle hypostyle rassemble 134 colonnes géantes en une forêt de pierre." },
        { rank: 2, name: "La vallée des Rois", body: "Les tombes royales rupestres du Nouvel Empire, dont celle de Toutânkhamon, dont la momie repose encore ici." },
        { rank: 3, name: "Le temple de Louxor", body: "Au cœur de la ville moderne, autrefois relié à Karnak par une allée de sphinx et magnifiquement illuminé à la nuit tombée." },
        { rank: 4, name: "Le temple d’Hatchepsout", body: "Le temple funéraire à colonnades de la plus célèbre femme pharaon d’Égypte, adossé aux falaises de la rive occidentale à Deir el-Bahari." },
        { rank: 5, name: "Médinet Habou", body: "Le grand temple funéraire de Ramsès III, célèbre pour ses reliefs sculptés éclatants et remarquablement conservés." },
        { rank: 6, name: "Un vol en montgolfière à l’aube", body: "L’expérience classique de Louxor : flotter au-dessus des temples, des tombes et des rives verdoyantes au lever du soleil." },
      ],
    },
    features: {
      head: {
        eyebrow: "Explorer la ville",
        heading: "Ce qui rend Louxor incontournable",
        intro:
          "Le Nil partage Louxor entre les temples de la rive orientale, celle des vivants, et les tombes de la rive occidentale. Les deux ont leur place dans tout itinéraire.",
      },
      rows: [
        {
          image: "valley-of-kings",
          eyebrow: "Rive occidentale",
          heading: "La vallée des Rois",
          body: [
            "Dissimulées dans une vallée désertique derrière les falaises, plus de soixante tombes royales furent creusées profondément dans la roche et peintes de textes destinés à guider les pharaons vers l’au-delà.",
            "La tombe de Toutânkhamon se trouve ici, et sa momie y repose toujours ; l’essentiel de son trésor a rejoint le Grand Musée égyptien, près du Caire.",
          ],
        },
        {
          image: "hatshepsut-temple",
          eyebrow: "Temples funéraires",
          heading: "Des temples adossés aux falaises",
          body: [
            "Le temple à terrasses d’Hatchepsout s’élève à même la roche à Deir el-Bahari, l’un des édifices les plus saisissants d’Égypte.",
            "Non loin se dressent Médinet Habou et les colosses de Memnon, deux statues assises géantes qui veillent sur la plaine depuis plus de trois mille ans.",
          ],
        },
        {
          image: "luxor-nile-sunset",
          eyebrow: "Le fleuve",
          heading: "Le Nil à Louxor",
          body: [
            "Une felouque ou un bateau à moteur relie les deux rives, et le coucher du soleil sur l’eau est un rituel de Louxor.",
            "Beaucoup de voyageurs arrivent ou repartent par une croisière sur le Nil jusqu’à Assouan, faisant du trajet entre les monuments une part du voyage.",
          ],
        },
      ],
    },
    whenToGo: {
      head: { eyebrow: "Préparer votre visite", heading: "Meilleure période pour visiter Louxor" },
      body: [
        "Louxor se situe en Haute-Égypte, où les étés sont réellement rudes — les températures dépassent régulièrement 40°C de juin à août.",
        "La fenêtre idéale va de novembre à février, avec des journées chaudes et sèches, parfaites pour de longues heures parmi les temples. Quelle que soit la saison, partez tôt et reposez-vous durant la chaleur de midi.",
      ],
    },
    gettingThere: {
      head: { eyebrow: "Se déplacer", heading: "Comment se rendre à Louxor" },
      body: [
        "Louxor s’étend sur le Nil à environ 670 km au sud du Caire — près d’une heure de vol intérieur, ou une nuit en train-couchettes.",
        "L’aéroport international de Louxor accueille des vols intérieurs et des vols internationaux saisonniers, et beaucoup de visiteurs arrivent par une croisière sur le Nil depuis Assouan, quelque 220 km plus au sud.",
      ],
    },
    gallery: { eyebrow: "Galerie", heading: "Louxor en images" },
    faqs: [
      { q: "Combien de jours faut-il à Louxor ?", a: "Deux jours permettent de couvrir la rive orientale (Karnak et le temple de Louxor) et la rive occidentale (la vallée des Rois, Hatchepsout et Médinet Habou) sans se presser. Une journée bien remplie suffit si le temps manque." },
      { q: "La tombe de Toutânkhamon est-elle toujours dans la vallée des Rois ?", a: "Oui. La momie de Toutânkhamon demeure dans sa tombe (KV62), dans la vallée des Rois. L’essentiel de son trésor est désormais exposé au Grand Musée égyptien, près du Caire." },
      { q: "Peut-on visiter Louxor en excursion à la journée depuis Hurghada ?", a: "Oui. Louxor est une longue excursion à la journée très prisée depuis Hurghada, sur la mer Rouge — en général quelques heures de route dans chaque sens, pour découvrir Karnak et la vallée des Rois." },
      { q: "Quelle est la meilleure période pour visiter Louxor ?", a: "De novembre à février, pour le temps de visite le plus frais et le plus agréable. L’été est très chaud mais plus calme, et se gère au mieux avec des départs matinaux." },
    ],
    creditsSummary: "Crédits et licences des images",
    nearby: ["aswan", "cairo", "hurghada"],
  },
  aswan: {
    seo: {
      title: "Circuits et excursions à Assouan | Abou Simbel et le Nil",
      description:
        "Circuits et excursions à la journée à Assouan — les temples de Philae et d’Abou Simbel, les felouques sur le Nil, les villages nubiens et le haut barrage. La paisible ville du sud de l’Égypte.",
      keywords: [
        "circuits à Assouan",
        "excursions à la journée à Assouan",
        "excursion à Abou Simbel",
        "temple de Philae",
        "felouque Assouan",
        "que faire à Assouan",
      ],
    },
    heroSlug: "aswan-nile-r01",
    heroEyebrow: "Haute-Égypte · Le Nil nubien",
    h1: "Circuits et excursions à la journée à Assouan",
    lede: "La paisible frontière méridionale de l’Égypte, là où le Nil est le plus beau.",
    overview: [
      "Les circuits à Assouan explorent la douce ville du sud de l’Égypte, posée là où le Nil est le plus pittoresque — îles, blocs de granit et désert doré descendant jusqu’à une eau d’un bleu éclatant. C’est la plus paisible des villes du Nil et la porte de la Nubie, avec une culture, une cuisine et une musique bien à elle.",
      "Depuis Assouan, vous pouvez naviguer jusqu’au temple insulaire de Philae, prendre une felouque autour de l’île Éléphantine et de l’île Kitchener, et faire route vers le sud jusqu’aux colossaux temples rupestres d’Abou Simbel. Le haut barrage et l’obélisque inachevé racontent l’histoire plus récente d’une ville façonnée par le fleuve qu’elle maîtrise.",
    ],
    facts: [
      { icon: "globe", value: "Nubie", label: "l’extrême sud de l’Égypte" },
      { icon: "star", value: "Abou Simbel", label: "les temples rupestres de Ramsès II" },
      { icon: "calendar", value: "nov. – févr.", label: "un temps de visite frais et clair" },
      { icon: "travel", value: "~1 h de vol", label: "au sud du Caire" },
    ],
    highlights: {
      head: {
        eyebrow: "Sites incontournables",
        heading: "Que faire à Assouan",
        intro:
          "Temples insulaires, voiliers et la route d’Abou Simbel — Assouan récompense un rythme plus lent que partout ailleurs sur le Nil.",
      },
      items: [
        { rank: 1, name: "Abou Simbel", body: "Les colossaux temples rupestres de Ramsès II, à environ 280 km au sud d’Assouan, déplacés bloc par bloc pour échapper à la montée des eaux du lac Nasser." },
        { rank: 2, name: "Le temple de Philae", body: "Le gracieux temple de la déesse Isis, transféré sur l’île d’Agilkia lors du chantier du haut barrage et accessible en bateau." },
        { rank: 3, name: "Une felouque sur le Nil", body: "Le voilier traditionnel du fleuve ; une après-midi autour de l’île Éléphantine et de l’île Kitchener est l’expérience classique d’Assouan." },
        { rank: 4, name: "Un village nubien", body: "Des maisons riveraines aux couleurs vives, la cuisine nubienne et un accueil chaleureux, que l’on rejoint d’ordinaire en bateau à travers le Nil." },
        { rank: 5, name: "Le haut barrage d’Assouan", body: "Le barrage des années 1960 qui a créé le lac Nasser, mis fin à la crue annuelle du Nil et remodelé l’Égypte moderne." },
        { rank: 6, name: "L’obélisque inachevé", body: "Abandonné dans son antique carrière de granit, il révèle exactement comment les Égyptiens taillaient leurs monuments géants." },
      ],
    },
    features: {
      head: {
        eyebrow: "Explorer la ville",
        heading: "Ce qui rend Assouan incontournable",
        intro:
          "C’est ici le Nil dans toute sa beauté, et la porte vers la Nubie et l’extrême sud de l’Égypte antique.",
      },
      rows: [
        {
          image: "philae-temple",
          eyebrow: "Temple insulaire",
          heading: "Philae, le temple d’Isis",
          body: [
            "Quand le haut barrage menaça de l’engloutir, le temple de Philae fut entièrement démonté et rebâti pierre par pierre sur les hauteurs de l’île d’Agilkia.",
            "Accessible après une courte traversée en bateau, il offre l’un des plus ravissants écrins de tous les temples d’Égypte, surtout dans la lumière douce du petit matin.",
          ],
        },
        {
          image: "felucca-aswan",
          eyebrow: "Toutes voiles dehors",
          heading: "Felouques et îles",
          body: [
            "Rien ne résume Assouan comme une après-midi sous la voile blanche d’une felouque, louvoyant entre les îles de granit tandis que le soleil décline.",
            "Le fleuve enlace ici l’île Éléphantine et les jardins botaniques de l’île Kitchener, faciles l’un et l’autre à glisser dans une navigation.",
          ],
        },
        {
          image: "aswan-high-dam",
          eyebrow: "Le Nil moderne",
          heading: "Le haut barrage et le lac Nasser",
          body: [
            "Achevé en 1970, le haut barrage d’Assouan a dompté les crues du Nil et créé le lac Nasser, l’un des plus vastes réservoirs du monde.",
            "Le projet a remodelé l’Égypte — et imposé le sauvetage épique d’Abou Simbel et de Philae, arrachés à la montée des eaux.",
          ],
        },
      ],
    },
    whenToGo: {
      head: { eyebrow: "Préparer votre visite", heading: "Meilleure période pour visiter Assouan" },
      body: [
        "Ville la plus méridionale des grandes cités d’Égypte, Assouan est chaude une bonne partie de l’année et brûlante en plein été. De novembre à février, les journées sont chaudes et les nuits fraîches et claires — idéales pour les temples et les moments sur le fleuve.",
        "La fête du Soleil d’Abou Simbel, lorsque la lumière atteint le sanctuaire intérieur, tombe le 22 février et le 22 octobre et attire une grande foule.",
      ],
    },
    gettingThere: {
      head: { eyebrow: "Se déplacer", heading: "Comment se rendre à Assouan" },
      body: [
        "Assouan s’étend sur le Nil dans l’extrême sud de l’Égypte, à environ une heure de vol du Caire ou une nuit de train.",
        "Abou Simbel se trouve à quelque 280 km plus au sud, que l’on rejoint par la route ou par un court vol intérieur. Beaucoup de visiteurs arrivent ou repartent par une croisière sur le Nil entre Assouan et Louxor.",
      ],
    },
    gallery: { eyebrow: "Galerie", heading: "Assouan en images" },
    faqs: [
      { q: "Abou Simbel vaut-il le déplacement depuis Assouan ?", a: "Pour la plupart des voyageurs, oui. Les deux temples rupestres de Ramsès II comptent parmi les monuments les plus spectaculaires d’Égypte. Le trajet fait environ 280 km dans chaque sens par la route, ou un court vol intérieur." },
      { q: "Qu’est-ce qu’une sortie en felouque à Assouan ?", a: "La felouque est un voilier de bois traditionnel. Une paisible navigation autour de l’île Éléphantine et de l’île Kitchener, surtout au coucher du soleil, est l’expérience emblématique d’Assouan." },
      { q: "Combien de jours faut-il à Assouan ?", a: "Un à deux jours couvrent Philae, une sortie en felouque et un village nubien ; ajoutez une journée si vous souhaitez faire l’excursion vers le sud jusqu’à Abou Simbel." },
      { q: "Quelle est la meilleure période pour visiter Assouan ?", a: "De novembre à février, pour le temps le plus frais. Les étés sont très chauds : des départs matinaux sont alors indispensables." },
    ],
    creditsSummary: "Crédits et licences des images",
    nearby: ["luxor", "cairo", "hurghada"],
  },
  alexandria: {
    seo: {
      title: "Circuits et excursions à Alexandrie depuis Le Caire",
      description:
        "Circuits et excursions à la journée à Alexandrie — la citadelle de Qaitbay, la Bibliotheca Alexandrina, les catacombes romaines et la corniche méditerranéenne. La ville balnéaire chargée d’histoire de l’Égypte.",
      keywords: [
        "circuits à Alexandrie",
        "excursions à la journée à Alexandrie",
        "excursion à Alexandrie depuis Le Caire",
        "Bibliotheca Alexandrina",
        "citadelle de Qaitbay",
        "que faire à Alexandrie",
      ],
    },
    heroSlug: "citadel-of-qaitbay-alexandria-egypt",
    heroEyebrow: "Égypte · La côte méditerranéenne",
    h1: "Circuits et excursions à la journée à Alexandrie",
    lede: "La ville balnéaire légendaire de l’Égypte, fondée par Alexandre le Grand.",
    overview: [
      "Les circuits à Alexandrie suivent la ville méditerranéenne fondée par Alexandre le Grand en 331 av. J.-C. Des siècles durant, elle fut l’une des grandes cités du monde antique, abritant la fabuleuse Bibliothèque et le phare de Pharos — l’une des Sept Merveilles. C’est aujourd’hui la deuxième ville d’Égypte, déroulée le long d’une corniche en courbe, avec un caractère bien à elle.",
      "La plupart des visiteurs viennent du Caire, à environ trois heures par la route ou en train à grande vitesse, ce qui fait d’Alexandrie une excursion à la journée très prisée. La citadelle de Qaitbay se dresse sur le site de l’ancien phare, et la moderne Bibliotheca Alexandrina ravive le souvenir de la Bibliothèque disparue, aux côtés des catacombes romaines, de la colonne de Pompée et des célèbres fruits de mer du front de mer.",
    ],
    facts: [
      { icon: "globe", value: "Méditerranée", label: "la deuxième ville d’Égypte" },
      { icon: "star", value: "Citadelle de Qaitbay", label: "sur le site du phare de Pharos" },
      { icon: "calendar", value: "Printemps et automne", label: "un climat côtier doux" },
      { icon: "travel", value: "~3 h", label: "par la route ou le train depuis Le Caire" },
    ],
    highlights: {
      head: {
        eyebrow: "Sites incontournables",
        heading: "Que faire à Alexandrie",
        intro:
          "L’Égypte grecque, romaine et moderne superposée le long d’un même front de mer méditerranéen — le tout à une journée confortable du Caire.",
      },
      items: [
        { rank: 1, name: "La citadelle de Qaitbay", body: "Un fort du XVe siècle veillant sur le port, bâti à l’emplacement même de l’ancien phare de Pharos." },
        { rank: 2, name: "La Bibliotheca Alexandrina", body: "Une saisissante bibliothèque et un centre culturel modernes qui font revivre l’héritage de l’antique Bibliothèque d’Alexandrie." },
        { rank: 3, name: "Les catacombes de Kôm el-Chogafa", body: "Une nécropole d’époque romaine sur plusieurs niveaux, mêlant arts égyptien, grec et romain, redécouverte par hasard en 1900." },
        { rank: 4, name: "La colonne de Pompée", body: "Une imposante colonne triomphale romaine, dressée près des ruines du temple du Sérapéum." },
        { rank: 5, name: "La Corniche et Montaza", body: "La longue promenade du front de mer, qui s’achève à l’est sur les jardins royaux et le palais de Montaza." },
        { rank: 6, name: "Les fruits de mer du front de mer", body: "Alexandrie est réputée dans toute l’Égypte pour ses fruits de mer méditerranéens frais, dégustés au bord de l’eau." },
      ],
    },
    features: {
      head: {
        eyebrow: "Explorer la ville",
        heading: "Ce qui rend Alexandrie incontournable",
        intro:
          "Une capitale méditerranéenne de la mémoire, où les fantômes du monde antique croisent un front de mer moderne et animé.",
      },
      rows: [
        {
          image: "citadel-of-qaitbay-014",
          eyebrow: "Le port",
          heading: "La citadelle de Qaitbay",
          body: [
            "La forteresse de Qaitbay garde l’entrée du port oriental, ses murs clairs s’élevant à même la mer.",
            "Elle se dresse à l’endroit exact où le phare de Pharos — l’une des Sept Merveilles du monde antique — signalait autrefois la côte aux navires.",
          ],
        },
        {
          image: "alexandria-egypt-235108463",
          eyebrow: "La ville du front de mer",
          heading: "Une capitale de la mémoire au bord de la mer",
          body: [
            "Alexandrie s’incurve sur des kilomètres le long d’une corniche balayée par la brise, ses cafés et ses villas défraîchies tournés vers la Méditerranée.",
            "La moderne Bibliotheca Alexandrina, les catacombes romaines et la colonne de Pompée maintiennent le passé grec et romain de la ville tout près de la surface.",
          ],
        },
      ],
    },
    whenToGo: {
      head: { eyebrow: "Préparer votre visite", heading: "Meilleure période pour visiter Alexandrie" },
      body: [
        "Grâce à son cadre méditerranéen, Alexandrie est plus douce que le reste de l’Égypte — agréable au printemps et en automne, chaude mais rafraîchie par la mer en été, fraîche et parfois pluvieuse en hiver.",
        "Le printemps (de mars à mai) et l’automne (de septembre à novembre) sont les périodes les plus agréables pour arpenter la corniche et explorer les sites.",
      ],
    },
    gettingThere: {
      head: { eyebrow: "Se déplacer", heading: "Comment se rendre à Alexandrie" },
      body: [
        "Alexandrie est à environ trois heures du Caire par la route ou en train à grande vitesse (quelque 220 km au nord-ouest), ce qui en fait une excursion à la journée ou d’une nuit très prisée depuis la capitale.",
        "L’aéroport de Borg El Arab, à l’ouest de la ville, accueille un nombre croissant de vols internationaux pour les voyageurs qui gagnent directement la côte.",
      ],
    },
    gallery: { eyebrow: "Galerie", heading: "Alexandrie en images" },
    faqs: [
      { q: "Peut-on visiter Alexandrie en excursion à la journée depuis Le Caire ?", a: "Oui — c’est l’une des excursions à la journée les plus prisées d’Égypte. Alexandrie est à environ trois heures du Caire par la route ou en train à grande vitesse, ce qui laisse une journée entière pour la Citadelle, la bibliothèque et les catacombes." },
      { q: "Pour quoi Alexandrie est-elle connue ?", a: "Fondée par Alexandre le Grand, elle abritait l’antique Bibliothèque et le phare de Pharos. Aujourd’hui, elle est connue pour son front de mer méditerranéen, ses sites gréco-romains et ses fruits de mer frais." },
      { q: "Combien de jours faut-il à Alexandrie ?", a: "Une seule journée pleine couvre les incontournables. Une nuit sur place permet de profiter de la corniche et des fruits de mer à un rythme plus lent." },
      { q: "Quelle est la meilleure période pour visiter Alexandrie ?", a: "Le printemps et l’automne sont idéaux. L’été est animé et chaud, mais tempéré par la mer ; l’hiver est frais et peut être pluvieux." },
    ],
    creditsSummary: "Crédits et licences des images",
    nearby: ["cairo", "luxor", "aswan"],
  },
  hurghada: {
    seo: {
      title: "Excursions et sorties à la journée à Hurghada | Mer Rouge",
      description:
        "Excursions et sorties à la journée à Hurghada — snorkeling et plongée sur les récifs de la mer Rouge, sorties en bateau vers l’île de Giftun, safaris dans le désert et longues excursions à la journée jusqu’à Louxor.",
      keywords: [
        "excursions à Hurghada",
        "sorties à la journée à Hurghada",
        "snorkeling à l’île de Giftun",
        "plongée en mer Rouge à Hurghada",
        "que faire à Hurghada",
        "sorties en bateau à Hurghada",
      ],
    },
    heroSlug: "giftun-eden-island",
    heroEyebrow: "Égypte · La Riviera de la mer Rouge",
    h1: "Excursions et sorties à la journée à Hurghada",
    lede: "La station balnéaire la plus animée de la mer Rouge en Égypte, et une porte vers les récifs des eaux chaudes.",
    overview: [
      "Les excursions à Hurghada tournent tout entières autour de la mer Rouge. D’un petit village de pêcheurs devenu la station balnéaire la plus animée d’Égypte, Hurghada s’étire le long d’une vaste étendue d’eau chaude et limpide, avec des dizaines de récifs et d’îles au large, faciles d’accès. C’est le choix classique pour une première escapade en mer Rouge, des vacances balnéaires en famille ou une parenthèse mer et soleil après les temples.",
      "Les sorties en bateau gagnent l’île de Giftun et Orange Bay pour du snorkeling au-dessus des jardins de corail, tandis que les plongeurs explorent récifs et épaves tout au long de la côte. À l’intérieur des terres, des safaris en quad ou en jeep rejoignent des campements bédouins sous les étoiles, et de longues excursions à la journée filent vers l’ouest jusqu’aux temples de Louxor.",
    ],
    facts: [
      { icon: "globe", value: "Côte de la mer Rouge", label: "l’Égypte continentale" },
      { icon: "star", value: "Île de Giftun", label: "récifs et baies de sable blanc" },
      { icon: "weather", value: "Soleil toute l’année", label: "mer chaude et ensoleillement" },
      { icon: "travel", value: "Vols charters directs", label: "plus ~1 h de vol du Caire" },
    ],
    highlights: {
      head: {
        eyebrow: "Sites incontournables",
        heading: "Que faire à Hurghada",
        intro:
          "Récifs, îles et désert — Hurghada est faite pour le temps passé sur l’eau et sous l’eau, avec les temples de Louxor accessibles en une journée.",
      },
      items: [
        { rank: 1, name: "L’île de Giftun et Orange Bay", body: "La sortie en bateau la plus prisée de Hurghada : des baies de sable blanc et des récifs peu profonds, idéaux pour le snorkeling." },
        { rank: 2, name: "Snorkeling et plongée sur les récifs", body: "Une eau chaude et limpide et des récifs pleins de coraux et de poissons en font l’une des destinations de plongée préférées au monde." },
        { rank: 3, name: "Une sortie en bateau en mer Rouge", body: "Des croisières d’une demi-journée ou d’une journée entière associent arrêts snorkeling, baignade et déjeuner au large." },
        { rank: 4, name: "Un safari dans le désert", body: "Quads, jeeps et chameaux s’enfoncent dans le désert Oriental jusqu’à des campements bédouins, pour le coucher du soleil et le dîner." },
        { rank: 5, name: "La marina et la vieille ville d’El Dahar", body: "La promenade du front de mer pour dîner et sortir le soir, et les marchés et cafés du vieux quartier." },
        { rank: 6, name: "Une excursion à la journée à Louxor", body: "Une longue mais enrichissante journée à l’intérieur des terres, vers les temples et les tombes de l’antique Thèbes." },
      ],
    },
    features: {
      head: {
        eyebrow: "Explorer la côte",
        heading: "Ce qui rend Hurghada incontournable",
        intro:
          "Tout un littoral de récifs et d’îles, avec les sites antiques de la vallée du Nil accessibles en une simple excursion à la journée.",
      },
      rows: [
        {
          image: "giftun-island-egypte-panoramio",
          eyebrow: "Les îles",
          heading: "L’île de Giftun et les récifs",
          body: [
            "Les îles au large de Hurghada sont ceinturées de récifs coralliens peu profonds et de bancs de sable d’un blanc éclatant — la mer Rouge dans sa version la plus digne d’une carte postale.",
            "Orange Bay, sur Giftun, en est l’arrêt phare, avec une eau chaude et calme qui convient autant aux débutants en snorkeling qu’aux plongeurs chevronnés.",
          ],
        },
        {
          image: "egypt-hurghada-from-plane01",
          eyebrow: "La Riviera de la mer Rouge",
          heading: "Côte de stations et lisière du désert",
          body: [
            "Hurghada se déroule sur des kilomètres le long du rivage, un ruban de stations et de marinas adossé au désert Oriental.",
            "Ce mélange permet de faire du snorkeling le matin, de dévaler les dunes en quad au coucher du soleil, et de caser malgré tout une excursion à la journée vers les temples de Louxor.",
          ],
        },
      ],
    },
    whenToGo: {
      head: { eyebrow: "Préparer votre visite", heading: "Meilleure période pour visiter Hurghada" },
      body: [
        "La côte de la mer Rouge est une destination de toute l’année — chaude et propice à la baignade en toute saison. Le printemps et l’automne sont splendides, et la température de l’eau reste agréable toute l’année.",
        "L’été est chaud mais tempéré par les brises marines et parfait pour les activités nautiques, tandis que l’hiver demeure doux et ensoleillé le jour, plus frais à la nuit tombée.",
      ],
    },
    gettingThere: {
      head: { eyebrow: "Se déplacer", heading: "Comment se rendre à Hurghada" },
      body: [
        "Hurghada se situe sur la côte de la mer Rouge, à environ une heure de vol du Caire ou quatre à cinq heures de route.",
        "L’aéroport international de Hurghada reçoit des vols réguliers et charters directs depuis de nombreuses villes européennes, ce qui en fait l’un des endroits les plus faciles d’accès d’Égypte directement depuis l’étranger.",
      ],
    },
    gallery: { eyebrow: "Galerie", heading: "Hurghada en images" },
    faqs: [
      { q: "Quelle est la meilleure excursion à Hurghada ?", a: "Une sortie en bateau vers l’île de Giftun et Orange Bay est la plus prisée, associant le snorkeling au-dessus des récifs coralliens à des moments sur des plages de sable blanc." },
      { q: "Peut-on visiter Louxor depuis Hurghada ?", a: "Oui. Louxor est une longue excursion à la journée très prisée depuis Hurghada — en général quelques heures de route dans chaque sens, pour découvrir Karnak et la vallée des Rois." },
      { q: "Hurghada est-elle propice au snorkeling et à la plongée ?", a: "Tout à fait. Les récifs du large sont chauds, limpides et riches en coraux et en poissons, adaptés aussi bien aux débutants qu’aux plongeurs expérimentés." },
      { q: "Quelle est la meilleure période pour visiter Hurghada ?", a: "À toute période de l’année. Le printemps et l’automne sont idéaux ; l’été est chaud mais parfait pour les activités nautiques ; l’hiver est doux et ensoleillé." },
    ],
    creditsSummary: "Crédits et licences des images",
    nearby: ["luxor", "cairo", "sharm-el-sheikh"],
  },
  "sharm-el-sheikh": {
    seo: {
      title: "Excursions et sorties à la journée à Charm el-Cheikh",
      description:
        "Excursions et sorties à la journée à Charm el-Cheikh — plongée et snorkeling de classe mondiale à Ras Mohammed et Tiran, safaris dans le désert et l’excursion au monastère Sainte-Catherine.",
      keywords: [
        "excursions à Charm el-Cheikh",
        "sorties à la journée à Charm el-Cheikh",
        "plongée à Ras Mohammed",
        "snorkeling à l’île de Tiran",
        "que faire à Charm el-Cheikh",
        "excursion au monastère Sainte-Catherine",
      ],
    },
    heroSlug: "ras-mohammed-panoramio",
    heroEyebrow: "Égypte · Le Sud-Sinaï",
    h1: "Excursions et sorties à la journée à Charm el-Cheikh",
    lede: "Une station du Sud-Sinaï ceinturée de quelques-uns des plus beaux récifs coralliens du monde.",
    overview: [
      "Les excursions à Charm el-Cheikh s’articulent autour des récifs extraordinaires du Sud-Sinaï. À la pointe méridionale de la péninsule, la station donne sur des eaux qui attirent plongeurs et amateurs de snorkeling du monde entier — nulle part davantage qu’au parc national de Ras Mohammed, le premier parc national d’Égypte, où des murailles de corail abruptes plongent droit dans le bleu.",
      "Au-delà des récifs, Charm el-Cheikh est un point de départ vers le désert et les montagnes de l’intérieur du Sinaï. Des sorties en bateau gagnent l’île de Tiran, et l’un des grands périples terrestres d’Égypte grimpe jusqu’au monastère Sainte-Catherine et au mont Sinaï. Naama Bay est le cœur des dîners et des sorties du soir.",
    ],
    facts: [
      { icon: "globe", value: "Sud-Sinaï", label: "la pointe de la péninsule" },
      { icon: "star", value: "Ras Mohammed", label: "le premier parc national d’Égypte" },
      { icon: "weather", value: "Soleil toute l’année", label: "une eau de mer Rouge chaude et limpide" },
      { icon: "travel", value: "Vols directs", label: "depuis l’Europe et le Golfe" },
    ],
    highlights: {
      head: {
        eyebrow: "Sites incontournables",
        heading: "Que faire à Charm el-Cheikh",
        intro:
          "Certaines des plus belles plongées de la planète sont à deux pas, avec des aventures dans le désert et la montagne à un court trajet à l’intérieur des terres.",
      },
      items: [
        { rank: 1, name: "Le parc national de Ras Mohammed", body: "Le premier parc national d’Égypte, qui protège de spectaculaires murailles de corail où plongeurs et amateurs de snorkeling croisent des nuées de poissons." },
        { rank: 2, name: "Plongée et snorkeling", body: "Charm el-Cheikh est l’un des plus grands centres de plongée au monde, avec un accès facile aux récifs pour les débutants et des sites réputés pour les experts." },
        { rank: 3, name: "L’île de Tiran", body: "Un grand classique des sorties en bateau, dans le détroit entre le Sinaï et l’Arabie, ceinturée de récifs peu profonds et colorés." },
        { rank: 4, name: "Naama Bay", body: "Le cœur animé du front de mer de la station : restaurants, cafés et vie nocturne." },
        { rank: 5, name: "Le monastère Sainte-Catherine et le mont Sinaï", body: "Un périple terrestre dans les montagnes jusqu’à un monastère du VIe siècle et au sommet traditionnellement lié à Moïse." },
        { rank: 6, name: "Un safari dans le désert", body: "Des sorties en quad, en jeep et à dos de chameau dans le désert du Sinaï, s’achevant souvent par un dîner bédouin sous les étoiles." },
      ],
    },
    features: {
      head: {
        eyebrow: "Explorer la côte",
        heading: "Ce qui rend Charm el-Cheikh incontournable",
        intro:
          "Les récifs sont la raison de venir, mais les déserts et les montagnes sacrées du Sinaï donnent à Charm el-Cheikh une seconde dimension.",
      },
      rows: [
        {
          image: "ras-mohamed-national-park-panoramio",
          eyebrow: "Le parc national",
          heading: "Les murailles de corail de Ras Mohammed",
          body: [
            "À l’extrême pointe du Sinaï, les récifs de Ras Mohammed plongent de la surface jusqu’à des eaux d’un bleu profond grouillant de poissons.",
            "Déclaré premier parc national d’Égypte en 1983, il demeure l’un des systèmes récifaux les plus beaux et les mieux protégés de la mer Rouge.",
          ],
        },
        {
          image: "divemaster-ready-to-go",
          eyebrow: "Sous la surface",
          heading: "Une capitale mondiale de la plongée",
          body: [
            "Les centres de plongée bordent le rivage, proposant des cours pour grands débutants et des plongées guidées vers des sites réputés pour les initiés.",
            "Une eau chaude et une visibilité superbe font de Charm el-Cheikh l’un des endroits les plus faciles au monde pour apprendre à plonger ou simplement découvrir un récif en snorkeling.",
          ],
        },
        {
          image: "tiran-island-sharm-el-sheikh-south-sinai-egypt",
          eyebrow: "Sorties en bateau",
          heading: "L’île de Tiran et le détroit",
          body: [
            "Les récifs autour de Tiran, dans le détroit en direction de l’Arabie saoudite, forment une excursion classique à la journée en bateau depuis Charm el-Cheikh.",
            "Jardins de corail peu profonds et tombants se côtoient de près, si bien qu’amateurs de snorkeling et plongeurs partagent certains des plus beaux sites.",
          ],
        },
      ],
    },
    whenToGo: {
      head: { eyebrow: "Préparer votre visite", heading: "Meilleure période pour visiter Charm el-Cheikh" },
      body: [
        "Abritée sur le golfe d’Aqaba, Charm el-Cheikh jouit d’un temps chaud et sec presque toute l’année. Le printemps et l’automne sont idéaux pour associer la plongée aux excursions dans le désert.",
        "L’été est chaud mais la mer reste engageante, et les journées d’hiver sont agréablement douces — même si les soirées, et l’excursion en montagne vers Sainte-Catherine, peuvent être froides.",
      ],
    },
    gettingThere: {
      head: { eyebrow: "Se déplacer", heading: "Comment se rendre à Charm el-Cheikh" },
      body: [
        "Charm el-Cheikh se trouve à la pointe méridionale de la péninsule du Sinaï. Son aéroport international reçoit des vols réguliers et charters directs de toute l’Europe et du Golfe, si bien que beaucoup de visiteurs arrivent directement de l’étranger.",
        "Par la route, c’est un long mais superbe trajet depuis Le Caire à travers le Sinaï, et des vols intérieurs la relient à la capitale en une heure environ.",
      ],
    },
    gallery: { eyebrow: "Galerie", heading: "Charm el-Cheikh en images" },
    faqs: [
      { q: "Pour quoi Charm el-Cheikh est-elle surtout connue ?", a: "Pour la plongée et le snorkeling de classe mondiale, avant tout au parc national de Ras Mohammed, ainsi que pour son ensoleillement chaud toute l’année et ses vols directs faciles depuis l’Europe." },
      { q: "Les débutants peuvent-ils plonger ou faire du snorkeling à Charm el-Cheikh ?", a: "Oui. Beaucoup de récifs sont peu profonds et proches du rivage, idéaux pour un premier snorkeling, tandis que les centres de plongée proposent des cours et des plongées guidées pour tous les niveaux." },
      { q: "L’excursion au monastère Sainte-Catherine en vaut-elle la peine ?", a: "Pour beaucoup de visiteurs, oui. C’est une longue journée par la route — ou une nuit sur place pour l’ascension du mont Sinaï au lever du soleil — dans les montagnes, jusqu’à l’un des plus anciens monastères encore en activité au monde." },
      { q: "Quelle est la meilleure période pour visiter Charm el-Cheikh ?", a: "Le printemps et l’automne sont idéaux. L’été est chaud mais parfait pour les activités nautiques, et l’hiver est doux le jour mais plus frais la nuit." },
    ],
    creditsSummary: "Crédits et licences des images",
    nearby: ["cairo", "hurghada", "luxor"],
  },
};
