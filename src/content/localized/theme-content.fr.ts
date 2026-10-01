/**
 * French (fr) editorial translation of the five theme pages.
 * Mirrors src/content/theme-content.ts 1:1 (keys, nesting, array order).
 * Translated: eyebrow/heading/intro/label/era/body/name/value human text +
 * gallery labels. Kept verbatim: icon, image slugs, band, {current}/{total}.
 * Register: vous, literary editorial French. BC -> av. J.-C.
 * Typography (applied by the fr normalization pass): guillemets « … » with a
 * non-breaking space inside, NBSP before ; : ! ?, NBSP thousands separator
 * (5 000), oe ligature, accents on capitals. Years unseparated (1970, 2560).
 */
import { galleryLabels, themeContent, whenToVisitContent } from "@/content/theme-content";

export const galleryLabelsFr: typeof galleryLabels = {
  galleryAria: "Galerie de photos",
  lightbox: {
    close: "Fermer",
    prev: "Image précédente",
    next: "Image suivante",
    zoomIn: "Zoom avant",
    zoomOut: "Zoom arrière",
    counter: "{current} sur {total}",
  },
};

export const themeContentFr: typeof themeContent = {
  heritage: {
    facts: [
      { icon: "star", value: "7", label: "sites du patrimoine mondial de l’UNESCO" },
      { icon: "clock", value: "5 000+ ans", label: "de civilisation attestée" },
      { icon: "calendar", value: "vers 2560 av. J.-C.", label: "construction de la grande pyramide de Gizeh" },
      { icon: "globe", value: "Gizeh → Abou Simbel", label: "des monuments tout au long du Nil" },
    ],
    timeline: {
      head: {
        eyebrow: "Petite chronologie",
        heading: "Cinq mille ans, dans l’ordre",
        intro:
          "L’histoire de l’Égypte est si longue que même les pharaons étudiaient des ancêtres qui, pour eux, appartenaient déjà à un passé lointain. En voici les grandes lignes — les dates approximatives sont précédées de « vers ».",
      },
      entries: [
        {
          era: "Période thinite",
          span: "vers 3100–2686 av. J.-C.",
          body: "La Haute et la Basse-Égypte sont unifiées sous les premiers pharaons et la capitale s’établit à Memphis, près du Caire actuel.",
        },
        {
          era: "Ancien Empire",
          span: "vers 2686–2181 av. J.-C.",
          body: "L’âge des grands bâtisseurs de pyramides : la pyramide à degrés de Djéser à Saqqarah et les trois pyramides de Gizeh s’élèvent en l’espace de quelques siècles.",
        },
        {
          era: "Moyen Empire",
          span: "vers 2055–1650 av. J.-C.",
          body: "Après une période de division, l’Égypte est réunifiée. On en garde le souvenir d’un âge classique, marqué par la littérature, la sculpture et un pouvoir central fort.",
        },
        {
          era: "Nouvel Empire",
          span: "vers 1550–1069 av. J.-C.",
          body: "L’Égypte à son apogée impériale. Karnak et Louxor deviennent de vastes complexes de temples et les pharaons sont inhumés dans la Vallée des Rois, à Thèbes.",
        },
        {
          era: "Basse Époque",
          span: "vers 664–332 av. J.-C.",
          body: "Les dernières dynasties indigènes règnent, entrecoupées d’intermèdes perses, jusqu’à l’arrivée d’Alexandre le Grand.",
        },
        {
          era: "Époque ptolémaïque (gréco-romaine)",
          span: "332–30 av. J.-C.",
          body: "Alexandre fonde Alexandrie ; les Ptolémées grecs édifient des temples comme Philae et Kôm Ombo. La lignée s’éteint avec Cléopâtre VII et l’arrivée de Rome.",
        },
        {
          era: "Égypte copte et islamique",
          span: "à partir du Ier siècle apr. J.-C. environ",
          body: "Le christianisme s’enracine et laisse les églises du Caire copte ; la conquête arabe de 641 apr. J.-C. apporte l’islam, et Le Caire devient l’une des grandes villes du monde médiéval.",
        },
      ],
    },
    features: {
      head: {
        eyebrow: "Les grands monuments",
        heading: "Quatre merveilles, déchiffrées par un égyptologue",
        intro:
          "Chaque voyage patrimonial Ptah Tours est mené par un égyptologue diplômé : les parois cessent alors d’être un décor pour devenir des phrases à lire. Voici les sites qui en forment le cœur.",
      },
      rows: [
        {
          image: "giza-pyramids",
          eyebrow: "Ancien Empire",
          heading: "Les pyramides de Gizeh",
          body: [
            "Édifiées vers 2560 av. J.-C. comme tombeaux royaux, les trois pyramides de Gizeh sont la seule des sept merveilles du monde antique encore debout. La grande pyramide a détenu le record de la plus haute construction humaine pendant près de quatre mille ans.",
            "À leurs côtés, le grand Sphinx monte la garde — un corps de lion à visage de pharaon, taillé dans un seul banc de calcaire au bord du plateau désertique.",
          ],
        },
        {
          image: "karnak-temple",
          eyebrow: "Nouvel Empire",
          heading: "Karnak, le temple qui a grandi durant des siècles",
          body: [
            "Karnak n’est pas un temple mais une cité de temples, agrandie par un pharaon après l’autre pendant plus de mille ans. Sa grande salle hypostyle réunit 134 colonnes géantes en une forêt de pierre si haute que le toit semblait autrefois flotter tout là-haut.",
            "C’était le site religieux le plus important d’Égypte, dédié avant tout au dieu Amon-Rê de Thèbes.",
          ],
        },
        {
          image: "luxor-temple",
          eyebrow: "Thèbes",
          heading: "Louxor et la rive ouest thébaine",
          body: [
            "L’antique Thèbes est le Louxor d’aujourd’hui, si riche en vestiges qu’on la surnomme souvent « le plus grand musée à ciel ouvert du monde ». Le temple de Louxor se dresse au cœur de la ville, autrefois relié à Karnak par une allée de sphinx.",
            "De l’autre côté du fleuve s’étendent les nécropoles royales — dont la Vallée des Rois, où le tombeau de Toutânkhamon fut découvert presque intact en 1922.",
          ],
        },
        {
          image: "abu-simbel",
          eyebrow: "Nubie",
          heading: "Abou Simbel et le sauvetage d’un temple",
          body: [
            "Ramsès II fit tailler deux temples à même une falaise de Nubie, gardés par quatre colosses assis de plus de 20 mètres de haut. Deux fois par an, le soleil levant traverse l’entrée pour illuminer le sanctuaire le plus reculé.",
            "Lors de la construction du haut barrage d’Assouan dans les années 1960, tout le monument fut découpé en blocs et remonté plus haut dans le cadre d’une opération de sauvetage de l’UNESCO — l’une des plus vastes jamais entreprises — pour le préserver de la montée des eaux du lac.",
          ],
        },
      ],
    },
    places: {
      head: {
        eyebrow: "À voir aussi",
        heading: "Temples, tombeaux et les deux visages du Caire",
        intro:
          "Au-delà des sites phares, l’itinéraire patrimonial est jalonné de lieux qui racontent chacun leur propre chapitre de l’histoire.",
      },
      cards: [
        {
          image: "saqqara-step-pyramid",
          name: "Saqqarah",
          body: "La pyramide à degrés de Djéser, édifiée vers 2670 av. J.-C., est le plus ancien grand monument de pierre au monde — le prototype à partir duquel toutes les pyramides suivantes ont été perfectionnées.",
        },
        {
          image: "philae-temple",
          name: "Philae",
          body: "Un gracieux temple dédié à la déesse Isis, déplacé avec son île entière vers un terrain plus élevé lors de la campagne du haut barrage d’Assouan, pour qu’il ne disparaisse pas sous les eaux.",
        },
        {
          image: "kom-ombo",
          name: "Kôm Ombo",
          body: "Un rare temple double au bord du Nil, bâti à l’époque gréco-romaine et partagé à parts égales entre le dieu crocodile Sobek et le dieu faucon Horus.",
        },
        {
          image: "coptic-cairo",
          name: "Le Caire copte",
          body: "L’ancien quartier chrétien, avec l’église suspendue et des ruelles que la tradition rattache au séjour de la Sainte Famille en Égypte.",
        },
        {
          image: "islamic-cairo",
          name: "Le Caire islamique",
          body: "Une ville médiévale de minarets, de mosquées et du grand bazar Khan el-Khalili — lui-même inscrit au patrimoine mondial de l’UNESCO.",
        },
      ],
    },
    gallery: {
      eyebrow: "Galerie",
      heading: "Le patrimoine en images",
    },
    creditsSummary: "Crédits et licences des images",
  },
  "the-nile": {
    facts: [
      { icon: "globe", value: "~6 650 km", label: "l’un des plus longs fleuves du monde" },
      { icon: "travel", value: "Sud → Nord", label: "le Nil coule vers la mer" },
      { icon: "user", value: "~95%", label: "des Égyptiens vivent sur ses rives" },
      { icon: "star", value: "Louxor et Assouan", label: "les grandes villes-temples du fleuve" },
    ],
    features: {
      head: {
        eyebrow: "Le fleuve qui a fait l’Égypte",
        heading: "La vie au fil du Nil",
        intro:
          "Les anciens Grecs appelaient l’Égypte « le don du Nil ». Pendant des millénaires, la crue du fleuve a déposé le limon noir qui nourrissait tout le pays — et presque tout le monde vit encore à portée de vue de l’eau.",
      },
      rows: [
        {
          image: "aswan-feluccas",
          eyebrow: "À la voile",
          heading: "Naviguer sur le Nil en felouque",
          body: [
            "La felouque est le voilier de bois traditionnel du Nil, dont la forme n’a pas changé depuis des siècles. Autour d’Assouan, le fleuve atteint sa plus grande beauté — îles, affleurements de granit et désert descendant jusqu’à l’eau — et un après-midi à la voile en est la façon la plus ancienne et la plus paisible de le découvrir.",
          ],
        },
        {
          image: "luxor-boats-on-nile",
          eyebrow: "L’antique Thèbes",
          heading: "Louxor, une ville sur l’eau",
          body: [
            "Louxor occupe le site de l’antique Thèbes, capitale du Nouvel Empire. Le fleuve la partage en deux : la rive est, vivante, avec ses temples, et la rive ouest des tombeaux royaux, où l’on voyait le soleil mourir chaque soir. La vie du fleuve défile encore devant elle à longueur de journée.",
          ],
        },
        {
          image: "cairo-nile-skyline-sunset",
          eyebrow: "La capitale",
          heading: "Le Caire, là où le fleuve rencontre la ville",
          body: [
            "Lorsqu’il atteint Le Caire, le Nil est large et animé, se faufilant entre l’île de Zamalek et l’horizon d’une ville de quelque vingt millions d’habitants. Un peu plus au nord, il s’épanouit dans le grand Delta et se jette dans la Méditerranée.",
          ],
        },
        {
          image: "aswan-wide-nile",
          eyebrow: "Un fleuve transformé",
          heading: "Le haut barrage et la fin de la crue",
          body: [
            "Pendant des millénaires, le Nil débordait chaque été et renouvelait les champs d’Égypte. Le haut barrage d’Assouan, achevé en 1970, a mis fin pour de bon à cette crue annuelle — donnant naissance au lac Nasser, produisant de l’électricité et maîtrisant les eaux, mais bouleversant aussi un rythme que le pays suivait depuis les pharaons.",
          ],
        },
      ],
    },
    places: {
      head: {
        eyebrow: "Au fil des rives",
        heading: "Îles, villes et lumière du fleuve",
        intro:
          "Le plaisir du Nil tient autant au voyage qu’aux sites — les étendues de champs verdoyants, les oiseaux, et la façon dont la lumière change sur l’eau de l’aube au crépuscule.",
      },
      cards: [
        {
          image: "nile-riverbank-kom-ombo-edfu",
          name: "Entre les temples",
          body: "Le ruban vert de terres cultivées entre Kôm Ombo et Edfou, où le désert attend juste au-delà du dernier champ irrigué.",
        },
        {
          image: "elephantine-island",
          name: "L’île d’Éléphantine",
          body: "L’une des îles habitées du fleuve à Assouan, peuplée depuis l’Antiquité, quand elle gardait la frontière méridionale de l’Égypte.",
        },
        {
          image: "aswan-boat-egrets",
          name: "La faune du fleuve",
          body: "Des aigrettes garde-bœufs et une barque traditionnelle près d’Assouan — le Nil est une artère vitale pour les oiseaux autant que pour les hommes.",
        },
        {
          image: "cairo-nile-night",
          name: "Le Nil après la tombée du jour",
          body: "Les lumières de la ville le long des berges de Zamalek, au Caire, où le fleuve ne s’endort jamais vraiment.",
        },
        {
          image: "river-nile-near-aswan",
          name: "Le Nil nubien",
          body: "Au sud d’Assouan, le paysage devient nubien — eau étincelante, sable doré et granit sombre.",
        },
        {
          image: "nile-felucca-aswan",
          name: "Une barque et le vent",
          body: "Une felouque isolée qui capte la brise — l’image la plus simple et la plus intemporelle du fleuve.",
        },
      ],
    },
    gallery: {
      eyebrow: "Galerie",
      heading: "Le Nil en images",
    },
    creditsSummary: "Crédits et licences des images",
  },
  deserts: {
    facts: [
      { icon: "globe", value: "~95%", label: "de l’Égypte est désertique" },
      { icon: "star", value: "3 régions", label: "désert Occidental, désert Oriental et Sinaï" },
      { icon: "info", value: "UNESCO 2005", label: "Ouadi al-Hitan, la vallée des Baleines" },
      { icon: "clock", value: "VIe siècle", label: "Sainte-Catherine, un monastère vivant" },
    ],
    features: {
      head: {
        eyebrow: "L’Égypte au-delà du fleuve",
        heading: "Trois déserts, un seul pays",
        intro:
          "Quittez l’étroite vallée verdoyante et presque toute l’Égypte n’est que désert — mais « désert » recouvre ici bien des réalités : terres de craie blanche, oasis plantées de palmiers, montagnes aux couleurs vives et cimes sacrées du Sinaï.",
      },
      rows: [
        {
          image: "white-desert-alien-landscape",
          eyebrow: "Désert Occidental",
          heading: "Le désert Blanc",
          body: [
            "À quelques heures de l’oasis de Bahariya, le sol se change en craie que le vent sculpte en champignons, en tours et en étranges formes blanches qui luisent au crépuscule et sous la lune. Camper ici, sous l’un des ciels les plus sombres d’Égypte, est la nuit de safari dans le désert par excellence.",
          ],
        },
        {
          image: "siwa-oracle-temple",
          eyebrow: "Désert Occidental",
          heading: "Siwa et l’oracle d’Amon",
          body: [
            "Reculée, près de la frontière libyenne, Siwa a conservé sa langue et ses coutumes propres pendant des siècles. Son ancien oracle d’Amon était célèbre dans tout le monde antique — on raconte qu’Alexandre le Grand traversa le désert pour le consulter en 331 av. J.-C.",
          ],
        },
        {
          image: "saint-catherine-monastery",
          eyebrow: "Sinaï",
          heading: "Le monastère Sainte-Catherine et le mont Sinaï",
          body: [
            "Au pied de la montagne où la tradition situe Moïse et le buisson ardent, le monastère Sainte-Catherine est en activité depuis le VIe siècle — l’une des plus anciennes communautés chrétiennes habitées sans interruption au monde. Beaucoup de voyageurs gravissent de nuit le sommet qui le domine pour y accueillir le lever du soleil.",
          ],
        },
        {
          image: "wadi-el-hitan-fennec",
          eyebrow: "Faune",
          heading: "La vie dans le sable",
          body: [
            "Le désert est loin d’être vide. Fennecs, gazelles et oiseaux migrateurs le traversent, tandis que l’Ouadi al-Hitan — la vallée des Baleines — préserve les squelettes fossilisés de baleines anciennes, d’une époque où, il y a des millions d’années, ce désert était une mer.",
          ],
        },
      ],
    },
    places: {
      head: {
        eyebrow: "Oasis et montagnes",
        heading: "Là où le sable prend forme",
        intro:
          "Entre les grandes mers de sable se cachent des sources, des palmeraies et des montagnes — les lieux qui font d’un voyage dans le désert égyptien bien plus qu’un long horizon.",
      },
      cards: [
        {
          image: "bahariya-oasis",
          name: "L’oasis de Bahariya",
          body: "Une ville verdoyante alimentée par des sources dans le désert Occidental, point de départ habituel vers les déserts Blanc et Noir.",
        },
        {
          image: "black-desert-panorama",
          name: "Le désert Noir",
          body: "De basses collines volcaniques coiffées de pierre sombre donnent à cette région proche de Bahariya son nom et sa couleur ténébreuse.",
        },
        {
          image: "fayoum-desert",
          name: "Le Fayoum",
          body: "Une vaste dépression-oasis au sud-ouest du Caire, bordée de désert, de lacs et des fossiles de baleines de l’Ouadi al-Hitan.",
        },
        {
          image: "sinai-canyon",
          name: "Les canyons du Sinaï",
          body: "Des gorges de grès colorées serpentent à l’intérieur du Sinaï — le Canyon coloré, près de Nuweiba, est le plus connu.",
        },
        {
          image: "nuweiba-desert-road",
          name: "Routes du désert",
          body: "De longues routes désertes relient la côte à l’intérieur des terres, avec des montagnes qui dominent le sable de toutes parts.",
        },
      ],
    },
    gallery: {
      eyebrow: "Galerie",
      heading: "Les déserts en images",
    },
    creditsSummary: "Crédits et licences des images",
  },
  "red-sea": {
    facts: [
      { icon: "star", value: "200+", label: "espèces de coraux sur les récifs" },
      { icon: "info", value: "1983", label: "Ras Mohammed, premier parc national d’Égypte" },
      { icon: "weather", value: "Toute l’année", label: "eau chaude et soleil" },
      { icon: "travel", value: "Charm et Hurghada", label: "les principales portes vers les récifs" },
    ],
    features: {
      head: {
        eyebrow: "Eau chaude, murs de corail",
        heading: "L’une des grandes mers du monde",
        intro:
          "La mer Rouge est réputée parmi les plongeurs et les adeptes du snorkeling pour son eau chaude et limpide et ses récifs qui plongent droit dans le bleu. Nul besoin de plonger en bouteille pour en profiter — une grande partie des plus beaux coraux se trouve à quelques mètres seulement sous la surface.",
      },
      rows: [
        {
          image: "coral-reef-public-domain",
          eyebrow: "Le récif",
          heading: "Un mur de corail vivant",
          body: [
            "Les récifs d’Égypte abritent plus de 200 espèces de coraux durs et mous et une éblouissante distribution de poissons — poissons-clowns, poissons-anges, poissons-perroquets, parfois une tortue ou un requin de récif. Comme l’eau est chaude et calme une grande partie de l’année, la visibilité y est souvent superbe.",
          ],
        },
        {
          image: "sharm-coral",
          eyebrow: "Sinaï du Sud",
          heading: "Ras Mohammed et Charm el-Cheikh",
          body: [
            "À la pointe extrême de la péninsule du Sinaï, Ras Mohammed est devenu le premier parc national d’Égypte en 1983. Ses murs de corail abrupts et la station balnéaire voisine de Charm el-Cheikh en font l’un des plus célèbres tronçons de récif au monde.",
          ],
        },
        {
          image: "hurghada-coast",
          eyebrow: "La côte continentale",
          heading: "Hurghada, le récif au pas de la porte",
          body: [
            "Hurghada, jadis petit village de pêcheurs, est devenue la station la plus animée de la mer Rouge, offrant un accès facile en bateau à des dizaines de récifs et d’îles au large. C’est le choix classique pour un premier séjour en mer Rouge ou une escapade balnéaire après les temples.",
          ],
        },
        {
          image: "marsa-alam",
          eyebrow: "L’extrême sud",
          heading: "Marsa Alam et la côte plus tranquille",
          body: [
            "Plus au sud, la côte devient plus sauvage et moins aménagée. Marsa Alam est connue pour ses dugongs, ses dauphins et ses longs récifs, et constitue la porte d’accès à quelques-uns des plus beaux sites de plongée préservés d’Égypte.",
          ],
        },
      ],
    },
    places: {
      head: {
        eyebrow: "Côte et îles",
        heading: "Le long du rivage",
        intro:
          "Du calme de Dahab, ville de plongée, aux îles désertiques dénudées, la côte de la mer Rouge a plus d’un visage.",
      },
      cards: [
        {
          image: "dahab-panorama",
          name: "Dahab et le Blue Hole",
          body: "Un ancien village bédouin décontracté sur la côte du Sinaï, cher aux apnéistes et abritant le célèbre Blue Hole.",
        },
        {
          image: "shadwan-island",
          name: "Les îles de la mer Rouge",
          body: "Des îles nues, blanchies par le soleil, comme Shadwan, se dressent au large, cernées de récifs et d’eau libre.",
        },
        {
          image: "nuweiba-red-sea-mountains",
          name: "Nuweiba",
          body: "Sur le golfe d’Aqaba, où les montagnes du Sinaï plongent presque à la verticale dans une mer étroite d’un bleu intense.",
        },
        {
          image: "red-sea-mountains",
          name: "Là où le désert rejoint la mer",
          body: "Les montagnes de la mer Rouge s’élèvent juste en retrait de la côte, rappelant qu’ici le récif et le désert sont voisins.",
        },
        {
          image: "coral-bay-sharm",
          name: "Coral Bay",
          body: "L’une des baies abritées autour de Charm el-Cheikh, avec des platiers récifaux accessibles directement depuis la plage.",
        },
      ],
    },
    gallery: {
      eyebrow: "Galerie",
      heading: "La mer Rouge en images",
    },
    creditsSummary: "Crédits et licences des images",
  },
};

export const whenToVisitContentFr: typeof whenToVisitContent = {
  facts: [
    { icon: "weather", value: "oct. – avr.", label: "les mois les plus frais et agréables" },
    { icon: "calendar", value: "22 févr. et 22 oct.", label: "la fête du Soleil d’Abou Simbel" },
    { icon: "travel", value: "Toute l’année", label: "la côte de la mer Rouge reste chaude" },
    { icon: "info", value: "40°C+", label: "maximales estivales à Louxor et Assouan" },
  ],
  climate: {
    head: {
      eyebrow: "Mois par mois",
      heading: "Quand venir, et ce que l’on ressent",
      intro:
        "L’Égypte se visite toute l’année, mais l’expérience change beaucoup selon la saison. L’hiver est doux et fréquenté ; le plein été est très chaud dans les terres mais reste agréable sur la côte. Les bandes colorées ci-dessous donnent une idée générale du temps qu’il fait pour les visites.",
    },
    months: [
      { month: "Janvier", abbr: "janv.", band: "peak", note: "Journées fraîches et ensoleillées, nuits froides — le temps idéal pour les visites, et la saison la plus fréquentée." },
      { month: "Février", abbr: "févr.", band: "peak", note: "Doux et dégagé ; la fête du Soleil d’Abou Simbel tombe le 22 février." },
      { month: "Mars", abbr: "mars", band: "peak", note: "Chaud et agréable, encore confortable pour de longues journées dans les temples avant la chaleur estivale." },
      { month: "Avril", abbr: "avr.", band: "good", note: "Chaud et charmant ; un bref vent de khamsin peut soulever la poussière certains jours." },
      { month: "Mai", abbr: "mai", band: "good", note: "Chaud dans les terres mais excellent sur la côte de la mer Rouge, avec moins de monde." },
      { month: "Juin", abbr: "juin", band: "hot", note: "Le plein été commence — très chaud à Louxor et Assouan, à savourer de préférence tôt le matin et en fin de journée." },
      { month: "Juillet", abbr: "juil.", band: "hot", note: "Chaleur maximale dans les terres ; la côte et une croisière climatisée sur le Nil sont les options confortables." },
      { month: "Août", abbr: "août", band: "hot", note: "Toujours très chaud dans les terres, avec une eau chaude en mer Rouge." },
      { month: "Septembre", abbr: "sept.", band: "good", note: "La chaleur intense commence à faiblir — un bon mois d’intersaison, avec moins de visiteurs." },
      { month: "Octobre", abbr: "oct.", band: "peak", note: "De nouveau agréable partout ; la seconde fête du Soleil d’Abou Simbel tombe le 22 octobre." },
      { month: "Novembre", abbr: "nov.", band: "peak", note: "Journées chaudes et soirées fraîches — l’un des tout meilleurs mois pour voyager." },
      { month: "Décembre", abbr: "déc.", band: "peak", note: "Frais et ensoleillé ; très fréquenté autour des fêtes de Noël et du Nouvel An." },
    ],
    legend: [
      { band: "peak", label: "Temps idéal pour les visites" },
      { band: "good", label: "Bon — de chaud à très chaud" },
      { band: "hot", label: "Très chaud dans les terres" },
    ],
  },
  regions: {
    head: {
      eyebrow: "Tout dépend de votre destination",
      heading: "Des Égypte différentes, des saisons différentes",
      intro:
        "Le meilleur moment pour voyager dépend aussi de l’Égypte que vous recherchez — la vallée du Nil, la côte de la mer Rouge et le désert profond ont chacun leur fenêtre idéale.",
    },
    rows: [
      {
        image: "aswan-nile",
        eyebrow: "La vallée du Nil",
        heading: "Louxor, Assouan et les temples",
        body: [
          "Pour les grands monuments, d’octobre à avril, c’est idéal : des journées chaudes et sèches qui font des longues heures parmi les temples un plaisir. L’été y est réellement rude, alors prévoyez des départs matinaux et des repos en milieu de journée si vous venez entre juin et août.",
        ],
      },
      {
        image: "red-sea-soma-bay",
        eyebrow: "La côte",
        heading: "La mer Rouge",
        body: [
          "La côte échappe au calendrier — chaude et propice à la baignade presque toute l’année. Le printemps et l’automne y sont splendides, et même le plein été, insupportable dans les terres, y reste confortable grâce à la brise marine et à une eau accueillante.",
        ],
      },
      {
        image: "white-desert-rock",
        eyebrow: "Le Sahara",
        heading: "Le désert Occidental et les oasis",
        body: [
          "Les safaris dans le désert et les excursions dans les oasis sont au mieux d’octobre à avril, quand la chaleur du jour reste supportable et que les nuits du désert deviennent vives et étoilées. Le cœur de l’été en plein désert est à éviter.",
        ],
      },
    ],
  },
  gallery: {
    eyebrow: "Galerie",
    heading: "L’Égypte au fil de l’année",
  },
  creditsSummary: "Crédits et licences des images",
};
