/**
 * German (de) editorial translation of src/content/theme-content.ts.
 * Staging only — mirrors keys/nesting/array order 1:1; only string VALUES translated.
 * Structural fields (icon, image, band) and interpolation tokens kept verbatim.
 */
import { galleryLabels, themeContent, whenToVisitContent } from "@/content/theme-content";

export const galleryLabelsDe: typeof galleryLabels = {
  galleryAria: "Fotogalerie",
  lightbox: {
    close: "Schließen",
    prev: "Vorheriges Bild",
    next: "Nächstes Bild",
    zoomIn: "Vergrößern",
    zoomOut: "Verkleinern",
    counter: "{current} von {total}",
  },
};

export const themeContentDe: typeof themeContent = {
  heritage: {
    facts: [
      { icon: "star", value: "7", label: "UNESCO-Welterbestätten" },
      { icon: "clock", value: "5.000+ Jahre", label: "dokumentierter Zivilisation" },
      { icon: "calendar", value: "um 2560 v. Chr.", label: "Bau der Großen Pyramide von Gizeh" },
      { icon: "globe", value: "Gizeh → Abu Simbel", label: "Monumente entlang des gesamten Nils" },
    ],
    timeline: {
      head: {
        eyebrow: "Ein kurzer Zeitstrahl",
        heading: "Fünftausend Jahre, der Reihe nach",
        intro:
          "Die Geschichte Ägyptens ist so lang, dass selbst die Pharaonen Vorfahren studierten, die schon für sie uralt waren. Hier ihre Grundzüge – ungefähre Daten sind mit „um“ (circa) gekennzeichnet.",
      },
      entries: [
        {
          era: "Frühdynastische Zeit",
          span: "um 3100–2686 v. Chr.",
          body: "Ober- und Unterägypten werden unter den ersten Pharaonen vereint, und die Hauptstadt etabliert sich in Memphis, nahe dem heutigen Kairo.",
        },
        {
          era: "Altes Reich",
          span: "um 2686–2181 v. Chr.",
          body: "Das Zeitalter der großen Pyramidenbauer: Die Djoser-Stufenpyramide in Sakkara und die drei Pyramiden von Gizeh entstehen in einer einzigen Zeitspanne von Jahrhunderten.",
        },
        {
          era: "Mittleres Reich",
          span: "um 2055–1650 v. Chr.",
          body: "Nach einer Zeit der Zersplitterung wird Ägypten wiedervereint. Man erinnert sich an diese Epoche als eine klassische Blütezeit der Literatur, der Bildhauerei und einer starken Zentralherrschaft.",
        },
        {
          era: "Neues Reich",
          span: "um 1550–1069 v. Chr.",
          body: "Ägypten auf dem Höhepunkt seiner Macht. Karnak und Luxor werden zu gewaltigen Tempelanlagen ausgebaut, und die Pharaonen werden im Tal der Könige bei Theben bestattet.",
        },
        {
          era: "Spätzeit",
          span: "um 664–332 v. Chr.",
          body: "Die letzten einheimischen Dynastien herrschen, unterbrochen von persischen Zwischenspielen, bis Alexander der Große eintrifft.",
        },
        {
          era: "Ptolemäerzeit (griechisch-römische Epoche)",
          span: "332–30 v. Chr.",
          body: "Alexander gründet Alexandria; die griechischen Ptolemäer errichten Tempel wie Philae und Kom Ombo. Die Dynastie endet mit Kleopatra VII. und der Ankunft Roms.",
        },
        {
          era: "Koptisches & islamisches Ägypten",
          span: "ab etwa dem 1. Jahrhundert n. Chr.",
          body: "Das Christentum fasst Fuß und hinterlässt die Kirchen des koptischen Kairo; die arabische Eroberung von 641 n. Chr. bringt den Islam, und Kairo wächst zu einer der großen Städte des Mittelalters heran.",
        },
      ],
    },
    features: {
      head: {
        eyebrow: "Die großen Monumente",
        heading: "Vier Wunderwerke, gedeutet von einem Ägyptologen",
        intro:
          "Jede Kulturreise von Ptah Tours wird von einem lizenzierten Ägyptologen geleitet, sodass die Wände aufhören, bloße Verzierung zu sein, und zu Sätzen werden. Dies sind die Stätten, die ihren Kern bilden.",
      },
      rows: [
        {
          image: "giza-pyramids",
          eyebrow: "Altes Reich",
          heading: "Die Pyramiden von Gizeh",
          body: [
            "Um 2560 v. Chr. als Königsgräber errichtet, sind die drei Pyramiden von Gizeh das einzige der Sieben Weltwunder der Antike, das noch steht. Die Große Pyramide hielt fast viertausend Jahre lang den Rekord als höchstes von Menschenhand geschaffenes Bauwerk.",
            "Neben ihnen wacht der Große Sphinx – ein Löwenkörper mit dem Gesicht eines Pharaos, aus einem einzigen Kalksteinrücken am Rand des Wüstenplateaus gehauen.",
          ],
        },
        {
          image: "karnak-temple",
          eyebrow: "Neues Reich",
          heading: "Karnak, der Tempel, der über Jahrhunderte wuchs",
          body: [
            "Karnak ist nicht ein einzelner Tempel, sondern eine ganze Stadt von Tempeln, über mehr als tausend Jahre von Pharao zu Pharao erweitert. Seine Große Säulenhalle drängt 134 gewaltige Säulen zu einem steinernen Wald zusammen, so hoch, dass das Dach einst weit über den Köpfen zu schweben schien.",
            "Es war die bedeutendste religiöse Stätte Ägyptens, vor allem dem Gott Amun-Re von Theben geweiht.",
          ],
        },
        {
          image: "luxor-temple",
          eyebrow: "Theben",
          heading: "Luxor und das thebanische Westufer",
          body: [
            "Das antike Theben ist das heutige Luxor – so reich an Ruinen, dass es oft das größte Freilichtmuseum der Welt genannt wird. Der Luxor-Tempel steht im Herzen der Stadt und war einst durch eine Sphinxallee mit Karnak verbunden.",
            "Jenseits des Flusses liegen die königlichen Nekropolen – darunter das Tal der Könige, wo 1922 das nahezu unversehrte Grab Tutanchamuns entdeckt wurde.",
          ],
        },
        {
          image: "abu-simbel",
          eyebrow: "Nubien",
          heading: "Abu Simbel und die Rettung eines Tempels",
          body: [
            "Ramses II. ließ zwei Tempel direkt in eine nubische Felswand schlagen, bewacht von vier sitzenden Kolossen von mehr als 20 Metern Höhe. Zweimal im Jahr dringt die aufgehende Sonne durch das Portal und erhellt das innerste Heiligtum.",
            "Als in den 1960er-Jahren der Assuan-Hochdamm gebaut wurde, zerlegte man das gesamte Monument in Blöcke und versetzte es in einer der größten je unternommenen UNESCO-Rettungsaktionen auf höheres Gelände, um es vor dem steigenden See zu bewahren.",
          ],
        },
      ],
    },
    places: {
      head: {
        eyebrow: "Mehr zu entdecken",
        heading: "Tempel, Gräber und zwei Gesichter Kairos",
        intro:
          "Jenseits der bekanntesten Stätten ist die Kulturroute mit Orten übersät, die jeder für sich ein eigenes Kapitel der Geschichte erzählen.",
      },
      cards: [
        {
          image: "saqqara-step-pyramid",
          name: "Sakkara",
          body: "Die um 2670 v. Chr. errichtete Djoser-Stufenpyramide ist das älteste große Steinmonument der Welt – der Prototyp, aus dem jede spätere Pyramide weiterentwickelt wurde.",
        },
        {
          image: "philae-temple",
          name: "Philae",
          body: "Ein anmutiger Tempel der Göttin Isis, der während des Baus des Assuan-Hochdamms samt seiner Insel auf höheres Gelände versetzt wurde, damit er nicht in den Fluten versank.",
        },
        {
          image: "kom-ombo",
          name: "Kom Ombo",
          body: "Ein seltener Doppeltempel am Nil, in griechisch-römischer Zeit erbaut und zu gleichen Teilen dem Krokodilgott Sobek und dem Falkengott Horus geweiht.",
        },
        {
          image: "coptic-cairo",
          name: "Das koptische Kairo",
          body: "Das alte christliche Viertel mit der Hängenden Kirche und Gassen, die die Überlieferung mit dem Aufenthalt der Heiligen Familie in Ägypten verbindet.",
        },
        {
          image: "islamic-cairo",
          name: "Das islamische Kairo",
          body: "Eine mittelalterliche Stadt aus Minaretten, Moscheen und dem großen Basar Khan el-Khalili – selbst UNESCO-Weltkulturerbe.",
        },
      ],
    },
    gallery: {
      eyebrow: "Galerie",
      heading: "Kulturerbe in Bildern",
    },
    creditsSummary: "Bildnachweise & Lizenzen",
  },
  "the-nile": {
    facts: [
      { icon: "globe", value: "~6.650 km", label: "einer der längsten Flüsse der Welt" },
      { icon: "travel", value: "Süden → Norden", label: "der Nil fließt dem Meer entgegen" },
      { icon: "user", value: "~95%", label: "der Ägypter leben an seinen Ufern" },
      { icon: "star", value: "Luxor & Assuan", label: "die großen Tempelstädte am Fluss" },
    ],
    features: {
      head: {
        eyebrow: "Der Fluss, der Ägypten schuf",
        heading: "Das Leben am Nil",
        intro:
          "Die alten Griechen nannten Ägypten „das Geschenk des Nils“. Jahrtausendelang lagerte die Flut des Flusses den schwarzen Boden ab, der das ganze Land ernährte – und noch heute lebt fast jeder in Sichtweite des Wassers.",
      },
      rows: [
        {
          image: "aswan-feluccas",
          eyebrow: "Unter Segeln",
          heading: "Mit der Feluke über den Nil",
          body: [
            "Die Feluke ist das traditionelle hölzerne Segelboot des Nils, in seiner Form seit Jahrhunderten unverändert. Rund um Assuan ist der Fluss am schönsten – Inseln, Granitfelsen und Wüste reichen bis ans Wasser – und ein Nachmittag unter Segeln ist die älteste und stillste Art, ihn zu erleben.",
          ],
        },
        {
          image: "luxor-boats-on-nile",
          eyebrow: "Das antike Theben",
          heading: "Luxor, eine Stadt am Wasser",
          body: [
            "Luxor liegt an der Stelle des antiken Theben, der Hauptstadt des Neuen Reiches. Der Fluss teilt es in zwei Hälften: das lebendige Ostufer mit seinen Tempeln und das Westufer der Königsgräber, wo man die Sonne allabendlich sterben sah. Den ganzen Tag über zieht das Leben des Flusses daran vorbei.",
          ],
        },
        {
          image: "cairo-nile-skyline-sunset",
          eyebrow: "Die Hauptstadt",
          heading: "Kairo, wo der Fluss auf die Stadt trifft",
          body: [
            "Wenn er Kairo erreicht, ist der Nil breit und belebt und windet sich zwischen der Insel Zamalek und der Skyline von rund zwanzig Millionen Menschen hindurch. Ein Stück weiter nördlich fächert er sich zum großen Delta auf und mündet ins Mittelmeer.",
          ],
        },
        {
          image: "aswan-wide-nile",
          eyebrow: "Ein veränderter Fluss",
          heading: "Der Hochdamm und das Ende der Flut",
          body: [
            "Jahrtausendelang trat der Nil jeden Sommer über die Ufer und erneuerte Ägyptens Felder. Der 1970 fertiggestellte Assuan-Hochdamm beendete diese jährliche Flut für immer – er schuf den Nassersee, erzeugt Strom und reguliert das Wasser, veränderte aber auch einen Rhythmus, nach dem das Land seit den Pharaonen gelebt hatte.",
          ],
        },
      ],
    },
    places: {
      head: {
        eyebrow: "Entlang der Ufer",
        heading: "Inseln, Städte und Flusslicht",
        intro:
          "Der Reiz des Nils liegt ebenso in der Reise wie in den Stätten – in den Abschnitten grüner Felder, in der Vogelwelt und darin, wie sich das Licht auf dem Wasser von der Morgen- bis zur Abenddämmerung wandelt.",
      },
      cards: [
        {
          image: "nile-riverbank-kom-ombo-edfu",
          name: "Zwischen den Tempeln",
          body: "Das grüne Band aus Ackerland zwischen Kom Ombo und Edfu, wo die Wüste gleich hinter dem letzten bewässerten Feld wartet.",
        },
        {
          image: "elephantine-island",
          name: "Insel Elephantine",
          body: "Eine der bewohnten Flussinseln von Assuan, seit der Antike besiedelt, als sie Ägyptens Südgrenze bewachte.",
        },
        {
          image: "aswan-boat-egrets",
          name: "Tierwelt am Fluss",
          body: "Kuhreiher und ein traditionelles Boot bei Assuan – der Nil ist für Vögel ebenso eine Lebensader wie für die Menschen.",
        },
        {
          image: "cairo-nile-night",
          name: "Der Nil bei Nacht",
          body: "Die Lichter der Stadt entlang des Zamalek-Ufers in Kairo, wo der Fluss nie wirklich zur Ruhe kommt.",
        },
        {
          image: "river-nile-near-aswan",
          name: "Der nubische Nil",
          body: "Südlich von Assuan wird die Landschaft nubisch – helles Wasser, goldener Sand und dunkler Granit.",
        },
        {
          image: "nile-felucca-aswan",
          name: "Ein Boot und der Wind",
          body: "Eine einzelne Feluke, die die Brise einfängt – das schlichteste und zeitloseste Bild des Flusses.",
        },
      ],
    },
    gallery: {
      eyebrow: "Galerie",
      heading: "Der Nil in Bildern",
    },
    creditsSummary: "Bildnachweise & Lizenzen",
  },
  deserts: {
    facts: [
      { icon: "globe", value: "~95%", label: "Ägyptens sind Wüste" },
      { icon: "star", value: "3 Regionen", label: "Westliche Wüste, Östliche Wüste & Sinai" },
      { icon: "info", value: "UNESCO 2005", label: "Wadi Al-Hitan, das Tal der Wale" },
      { icon: "clock", value: "6. Jahrhundert", label: "Katharinenkloster, ein lebendiges Kloster" },
    ],
    features: {
      head: {
        eyebrow: "Ägypten jenseits des Flusses",
        heading: "Drei Wüsten, ein Land",
        intro:
          "Verlässt man das schmale grüne Tal, ist fast ganz Ägypten Wüste – doch „Wüste“ bedeutet hier vielerlei: weiße Kreidelandschaften, palmengefüllte Oasen, farbige Berge und die heiligen Gipfel des Sinai.",
      },
      rows: [
        {
          image: "white-desert-alien-landscape",
          eyebrow: "Westliche Wüste",
          heading: "Die Weiße Wüste",
          body: [
            "Wenige Stunden von der Oase Bahariya entfernt wird der Boden zu Kreide, die der Wind zu Pilzen, Türmen und seltsamen weißen Formen geschliffen hat, die in der Dämmerung und im Mondlicht leuchten. Ein Nachtlager hier, unter einem der dunkelsten Himmel Ägyptens, ist die klassische Nacht einer Wüstensafari.",
          ],
        },
        {
          image: "siwa-oracle-temple",
          eyebrow: "Westliche Wüste",
          heading: "Siwa und das Amun-Orakel",
          body: [
            "Das abgelegene Siwa nahe der libyschen Grenze bewahrte über Jahrhunderte seine eigene Sprache und Bräuche. Sein antikes Amun-Orakel war in der ganzen antiken Welt berühmt – Alexander der Große soll 331 v. Chr. die Wüste durchquert haben, um es zu befragen.",
          ],
        },
        {
          image: "saint-catherine-monastery",
          eyebrow: "Sinai",
          heading: "Das Katharinenkloster und der Berg Sinai",
          body: [
            "Am Fuß des Berges, an den die Überlieferung Moses und den brennenden Dornbusch verortet, ist das Katharinenkloster seit dem 6. Jahrhundert ein tätiges Kloster – eine der ältesten durchgehend bewohnten christlichen Gemeinschaften der Erde. Viele Reisende besteigen den dahinterliegenden Gipfel im Dunkeln, um zum Sonnenaufgang oben zu sein.",
          ],
        },
        {
          image: "wadi-el-hitan-fennec",
          eyebrow: "Tierwelt",
          heading: "Leben im Sand",
          body: [
            "Die Wüste ist alles andere als leer. Fenneks, Gazellen und Zugvögel durchqueren sie, während das Wadi Al-Hitan – das Tal der Wale – die versteinerten Skelette urzeitlicher Wale aus einer Zeit vor Millionen von Jahren bewahrt, als diese Wüste ein Meer war.",
          ],
        },
      ],
    },
    places: {
      head: {
        eyebrow: "Oasen & Gebirge",
        heading: "Wo der Sand Gestalt annimmt",
        intro:
          "Zwischen den großen Sandmeeren liegen Quellen, Palmenhaine und Berge – die Orte, die eine Wüstenreise in Ägypten zu mehr machen als einem einzigen langen Horizont.",
      },
      cards: [
        {
          image: "bahariya-oasis",
          name: "Oase Bahariya",
          body: "Eine grüne, von Quellen gespeiste Ortschaft in der Westlichen Wüste und der übliche Ausgangspunkt für die Weiße und die Schwarze Wüste.",
        },
        {
          image: "black-desert-panorama",
          name: "Die Schwarze Wüste",
          body: "Niedrige vulkanische Hügel, gekrönt von dunklem Gestein, geben diesem Landstrich nahe Bahariya seinen Namen und seine düstere Farbe.",
        },
        {
          image: "fayoum-desert",
          name: "Fayum",
          body: "Eine weite Oasensenke südwestlich von Kairo, gesäumt von Wüste, Seen und den Walfossilien des Wadi Al-Hitan.",
        },
        {
          image: "sinai-canyon",
          name: "Die Canyons des Sinai",
          body: "Farbige Sandsteinschluchten winden sich durch das Innere des Sinai – der Coloured Canyon nahe Nuweiba ist der bekannteste.",
        },
        {
          image: "nuweiba-desert-road",
          name: "Wüstenstraßen",
          body: "Lange, leere Fernstraßen verlaufen zwischen der Küste und dem Landesinneren, überragt von Bergen, die auf allen Seiten über dem Sand aufragen.",
        },
      ],
    },
    gallery: {
      eyebrow: "Galerie",
      heading: "Die Wüsten in Bildern",
    },
    creditsSummary: "Bildnachweise & Lizenzen",
  },
  "red-sea": {
    facts: [
      { icon: "star", value: "200+", label: "Korallenarten an den Riffen" },
      { icon: "info", value: "1983", label: "Ras Muhammad, Ägyptens erster Nationalpark" },
      { icon: "weather", value: "Ganzjährig", label: "warmes Wasser und Sonnenschein" },
      { icon: "travel", value: "Sharm & Hurghada", label: "die wichtigsten Tore zum Riff" },
    ],
    features: {
      head: {
        eyebrow: "Warmes Wasser, Wände aus Korallen",
        heading: "Eines der großen Meere der Welt",
        intro:
          "Das Rote Meer ist bei Tauchern und Schnorchlern berühmt für warmes, klares Wasser und Riffe, die senkrecht ins Blau abfallen. Man muss nicht tauchen, um es zu genießen – ein Großteil der schönsten Korallen liegt nur wenige Meter unter der Oberfläche.",
      },
      rows: [
        {
          image: "coral-reef-public-domain",
          eyebrow: "Das Riff",
          heading: "Eine lebendige Wand aus Korallen",
          body: [
            "Ägyptens Riffe beherbergen mehr als 200 Arten von Hart- und Weichkorallen und ein schillerndes Aufgebot an Fischen – Clownfische, Kaiserfische, Papageifische, hin und wieder eine Schildkröte oder einen Riffhai. Da das Wasser einen Großteil des Jahres warm und ruhig ist, ist die Sicht oft hervorragend.",
          ],
        },
        {
          image: "sharm-coral",
          eyebrow: "Südsinai",
          heading: "Ras Muhammad und Sharm el-Sheikh",
          body: [
            "An der äußersten Spitze der Sinai-Halbinsel wurde Ras Muhammad 1983 zu Ägyptens erstem Nationalpark. Seine steilen Korallenwände und der benachbarte Ferienort Sharm el-Sheikh machen dies zu einem der berühmtesten Riffabschnitte überhaupt.",
          ],
        },
        {
          image: "hurghada-coast",
          eyebrow: "Die Festlandküste",
          heading: "Hurghada, das Riff vor der Haustür",
          body: [
            "Hurghada wuchs von einem kleinen Fischerdorf zum belebtesten Ferienort am Roten Meer heran, mit bequemem Bootszugang zu Dutzenden vorgelagerten Riffen und Inseln. Es ist die klassische Wahl für eine erste Reise ans Rote Meer oder einen Strandaufenthalt im Anschluss an die Tempel.",
          ],
        },
        {
          image: "marsa-alam",
          eyebrow: "Der tiefe Süden",
          heading: "Marsa Alam und die ruhigere Küste",
          body: [
            "Weiter südlich wird die Küste wilder und weniger erschlossen. Marsa Alam ist bekannt für Dugongs, Delfine und lange Riffe und ist das Tor zu einigen der ursprünglichsten Tauchreviere Ägyptens.",
          ],
        },
      ],
    },
    places: {
      head: {
        eyebrow: "Küste & Inseln",
        heading: "Entlang der Küste",
        intro:
          "Von der Tauchort-Ruhe Dahabs bis zu kahlen Wüsteninseln hat die Küste des Roten Meeres mehr als eine Stimmung.",
      },
      cards: [
        {
          image: "dahab-panorama",
          name: "Dahab & das Blue Hole",
          body: "Ein entspanntes ehemaliges Beduinendorf an der Küste des Sinai, bei Apnoetauchern beliebt und Heimat des berühmten Blue Hole.",
        },
        {
          image: "shadwan-island",
          name: "Inseln im Roten Meer",
          body: "Kahle, sonnengebleichte Inseln wie Shadwan liegen vor der Küste, umgeben von Riff und offenem Wasser.",
        },
        {
          image: "nuweiba-red-sea-mountains",
          name: "Nuweiba",
          body: "Am Golf von Akaba, wo die Berge des Sinai fast senkrecht in ein schmales, intensiv blaues Meer abfallen.",
        },
        {
          image: "red-sea-mountains",
          name: "Wo Wüste auf Meer trifft",
          body: "Die Berge am Roten Meer erheben sich unmittelbar landeinwärts von der Küste – eine Erinnerung daran, dass Riff und Wüste hier Nachbarn sind.",
        },
        {
          image: "coral-bay-sharm",
          name: "Coral Bay",
          body: "Eine der geschützten Buchten rund um Sharm el-Sheikh, mit Riffplateaus, die direkt vom Strand aus erreichbar sind.",
        },
      ],
    },
    gallery: {
      eyebrow: "Galerie",
      heading: "Das Rote Meer in Bildern",
    },
    creditsSummary: "Bildnachweise & Lizenzen",
  },
};

export const whenToVisitContentDe: typeof whenToVisitContent = {
  facts: [
    { icon: "weather", value: "Okt.–Apr.", label: "die kühleren, angenehmsten Monate" },
    { icon: "calendar", value: "22. Feb. & 22. Okt.", label: "das Sonnenfest von Abu Simbel" },
    { icon: "travel", value: "Ganzjährig", label: "die Küste des Roten Meeres bleibt warm" },
    { icon: "info", value: "40°C+", label: "sommerliche Höchstwerte in Luxor & Assuan" },
  ],
  climate: {
    head: {
      eyebrow: "Monat für Monat",
      heading: "Wann Sie kommen sollten – und wie es sich anfühlt",
      intro:
        "Ägypten ist ein ganzjähriges Reiseziel, doch das Erlebnis wandelt sich stark mit der Jahreszeit. Der Winter ist mild und stark besucht; der Hochsommer ist im Landesinneren sehr heiß, an der Küste aber weiterhin angenehm. Die folgenden Kategorien sind ein grober Anhaltspunkt für das Besichtigungswetter.",
    },
    months: [
      { month: "Januar", abbr: "Jan", band: "peak", note: "Kühle, sonnige Tage und frische Nächte – bestes Besichtigungswetter und zugleich die Hauptsaison." },
      { month: "Februar", abbr: "Feb", band: "peak", note: "Mild und klar; das Sonnenfest von Abu Simbel fällt auf den 22. Februar." },
      { month: "März", abbr: "Mär", band: "peak", note: "Warm und schön, vor der Sommerhitze noch angenehm für lange Tempeltage." },
      { month: "April", abbr: "Apr", band: "good", note: "Warm und herrlich; an einzelnen Tagen kann ein kurzer Chamsin-Wind Staub aufwirbeln." },
      { month: "Mai", abbr: "Mai", band: "good", note: "Im Landesinneren heiß, an der Küste des Roten Meeres aber hervorragend und mit weniger Andrang." },
      { month: "Juni", abbr: "Jun", band: "hot", note: "Der Hochsommer beginnt – sehr heiß in Luxor und Assuan, am besten früh und spät am Tag zu genießen." },
      { month: "Juli", abbr: "Jul", band: "hot", note: "Größte Hitze im Landesinneren; die Küste und eine klimatisierte Nilkreuzfahrt sind die angenehmen Alternativen." },
      { month: "August", abbr: "Aug", band: "hot", note: "Im Landesinneren weiterhin sehr heiß, mit warmen Wassertemperaturen am Roten Meer." },
      { month: "September", abbr: "Sep", band: "good", note: "Die brütende Hitze lässt allmählich nach – ein guter Übergangsmonat mit weniger Besuchern." },
      { month: "Oktober", abbr: "Okt", band: "peak", note: "Überall wieder angenehm; das zweite Sonnenfest von Abu Simbel fällt auf den 22. Oktober." },
      { month: "November", abbr: "Nov", band: "peak", note: "Warme Tage und kühle Abende – einer der allerbesten Reisemonate." },
      { month: "Dezember", abbr: "Dez", band: "peak", note: "Kühl und sonnig; viel Betrieb um Weihnachten und Neujahr." },
    ],
    legend: [
      { band: "peak", label: "Bestes Besichtigungswetter" },
      { band: "good", label: "Gut – warm bis heiß" },
      { band: "hot", label: "Sehr heiß im Landesinneren" },
    ],
  },
  regions: {
    head: {
      eyebrow: "Es kommt darauf an, wohin Sie reisen",
      heading: "Verschiedene Ägypten, verschiedene Jahreszeiten",
      intro:
        "Die beste Reisezeit hängt auch davon ab, welches Ägypten Sie suchen – das Niltal, die Küste des Roten Meeres und die tiefe Wüste haben jeweils ihr eigenes ideales Zeitfenster.",
    },
    rows: [
      {
        image: "aswan-nile",
        eyebrow: "Niltal",
        heading: "Luxor, Assuan & die Tempel",
        body: [
          "Für die großen Monumente ist Oktober bis April ideal: warme, trockene Tage, die lange Stunden zwischen den Tempeln zum Vergnügen machen. Der Sommer ist hier wirklich unerbittlich – planen Sie daher einen frühen Start und Mittagsruhe ein, wenn Sie zwischen Juni und August kommen.",
        ],
      },
      {
        image: "red-sea-soma-bay",
        eyebrow: "Die Küste",
        heading: "Das Rote Meer",
        body: [
          "Die Küste ist die Ausnahme vom Kalender – fast das ganze Jahr über warm und zum Baden geeignet. Frühjahr und Herbst sind herrlich, und selbst der Hochsommer, im Landesinneren unerträglich, bleibt hier dank Meeresbrise und angenehmem Wasser erträglich.",
        ],
      },
      {
        image: "white-desert-rock",
        eyebrow: "Die Sahara",
        heading: "Die Westliche Wüste & die Oasen",
        body: [
          "Wüstensafaris und Oasenausflüge sind von Oktober bis April am besten, wenn die Tageshitze erträglich ist und die Wüstennächte klar und sternenklar werden. Den Hochsommer in der offenen Wüste meidet man besser.",
        ],
      },
    ],
  },
  gallery: {
    eyebrow: "Galerie",
    heading: "Ägypten im Lauf des Jahres",
  },
  creditsSummary: "Bildnachweise & Lizenzen",
};
