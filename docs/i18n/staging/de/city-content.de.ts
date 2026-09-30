/**
 * German (de) editorial translation of src/content/city-content.ts.
 * Staging only — mirrors keys/nesting/array order 1:1; only string VALUES translated.
 * heroSlug/image/icon/rank/nearby kept verbatim. Facts preserved exactly.
 */
import { cityContent } from "@/content/city-content";

export const cityContentDe: typeof cityContent = {
  cairo: {
    seo: {
      title: "Kairo-Touren & Tagesausflüge | Pyramiden von Gizeh",
      description:
        "Kairo-Touren und Tagesausflüge: die Pyramiden von Gizeh und der Sphinx, das Große Ägyptische Museum, die Zitadelle und der Khan el-Khalili – geführt von Experten vor Ort.",
      keywords: [
        "Kairo Touren",
        "Kairo Tagesausflüge",
        "Pyramiden von Gizeh Tour",
        "Großes Ägyptisches Museum",
        "Kairo Sehenswürdigkeiten",
        "Kairo Ausflüge",
      ],
    },
    heroSlug: "city-of-a-thousand-minarets",
    heroEyebrow: "Ägypten · Die Hauptstadt am Nil",
    h1: "Kairo-Touren & Tagesausflüge",
    lede: "Die weitläufige Hauptstadt Ägyptens – Heimat der Pyramiden von Gizeh und von fünftausend Jahren Geschichte.",
    overview: [
      "Kairo-Touren rücken die gesamte Spanne der ägyptischen Geschichte in eine einzige Stadt. Auf dem Gizeh-Plateau am Westrand der Hauptstadt steht das letzte der Sieben Weltwunder der Antike – die Große Pyramide, ihre beiden Begleiterinnen und der Große Sphinx. Nur eine kurze Fahrt entfernt eröffnete im November 2025 das Große Ägyptische Museum vollständig und zeigt nun erstmals die vollständigen Schätze Tutanchamuns.",
      "Jenseits der Pharaonen ist Kairo eine lebendige mittelalterliche Stadt. Ihr historischer Kern – oft die Stadt der tausend Minarette genannt – vereint die Zitadelle Saladins, große Moscheen, koptische Kirchen und das Labyrinth des Basars Khan el-Khalili. Dies ist der natürliche Ausgangspunkt für nahezu jede Ägypten-Reise und die Basis für Tagesausflüge nach Gizeh, Sakkara und Memphis.",
    ],
    facts: [
      { icon: "globe", value: "Niltal", label: "Ägyptens Hauptstadtregion" },
      { icon: "star", value: "Pyramiden von Gizeh", label: "das letzte antike Weltwunder" },
      { icon: "calendar", value: "Okt.–Apr.", label: "die angenehmsten Monate" },
      { icon: "travel", value: "Wichtigstes Tor", label: "Flughafen Kairo International" },
    ],
    highlights: {
      head: {
        eyebrow: "Top-Attraktionen",
        heading: "Sehenswertes in Kairo",
        intro:
          "Vom letzten noch stehenden Weltwunder der Antike bis zur mittelalterlichen Stadt der Minarette – dies sind die Sehenswürdigkeiten im Herzen eines Kairo-Aufenthalts.",
      },
      items: [
        {
          rank: 1,
          name: "Pyramiden von Gizeh & der Sphinx",
          body: "Die drei Pyramiden und der Große Sphinx liegen auf einem Plateau am Westrand der Stadt – das einzige antike Weltwunder, das noch steht.",
        },
        {
          rank: 2,
          name: "Großes Ägyptisches Museum",
          body: "Das weltweit größte Museum, das einer einzigen Zivilisation gewidmet ist, direkt neben den Pyramiden. Seit November 2025 vollständig geöffnet, beherbergt es die komplette Tutanchamun-Sammlung.",
        },
        {
          rank: 3,
          name: "Das Ägyptische Museum am Tahrir-Platz",
          body: "Das historische Museum am Tahrir-Platz zeigt weiterhin eine riesige Sammlung von Altertümern; die Königsmumien ruhen inzwischen im Nationalmuseum der Ägyptischen Zivilisation.",
        },
        {
          rank: 4,
          name: "Zitadelle Saladins & Muhammad-Ali-Moschee",
          body: "Die mittelalterliche Festung, die die Stadt krönt, mit der Alabastermoschee und weiten Ausblicken über die Dächer.",
        },
        {
          rank: 5,
          name: "Khan el-Khalili & das islamische Kairo",
          body: "Ein im 14. Jahrhundert gegründeter Basar, eingebettet in Straßen voller historischer Moscheen und Madrasas.",
        },
        {
          rank: 6,
          name: "Das koptische Kairo",
          body: "Das alte christliche Viertel mit der Hängenden Kirche und Gassen, die die Überlieferung mit dem Aufenthalt der Heiligen Familie in Ägypten verbindet.",
        },
      ],
    },
    features: {
      head: {
        eyebrow: "Die Stadt erkunden",
        heading: "Was Kairo unverzichtbar macht",
        intro:
          "Das antike und das mittelalterliche Ägypten liegen hier nebeneinander. Wenige Tage genügen, um von den Pyramiden zu den Museen, in die Altstadt und an den Fluss zu wechseln.",
      },
      rows: [
        {
          image: "cairo-museum-public-domain",
          eyebrow: "Museen",
          heading: "Vom Tahrir-Platz zum Großen Ägyptischen Museum",
          body: [
            "Kairo hat heute zwei große Museen. Das historische Ägyptische Museum am Tahrir-Platz, 1902 eröffnet, beherbergt weiterhin eine überwältigende Sammlung von Altertümern.",
            "Draußen in Gizeh eröffnete am 1. November 2025 das Große Ägyptische Museum vollständig – das größte Museum einer einzigen Zivilisation überhaupt und der erste Ort, an dem die komplette Tutanchamun-Sammlung gemeinsam gezeigt wird.",
          ],
        },
        {
          image: "khan-el-khalili-cc0",
          eyebrow: "Das alte Kairo",
          heading: "Khan el-Khalili und die Stadt der Minarette",
          body: [
            "Der Basar Khan el-Khalili treibt seit dem 14. Jahrhundert Handel – ein Gewirr von Gassen, in denen Gewürze, Lampen, Silber und Kaffee verkauft werden.",
            "Rundherum liegt das historische islamische Kairo, ein von der UNESCO gelistetes Viertel aus Moscheen und Madrasas, das der Stadt ihren alten Beinamen gab: die Stadt der tausend Minarette.",
          ],
        },
        {
          image: "cairo-nile-night",
          eyebrow: "Der Fluss",
          heading: "Der Nil mitten durch die Hauptstadt",
          body: [
            "Der Nil zieht sich mitten durch Kairo, breit und belebt, und teilt sich um die grüne Insel Zamalek.",
            "Eine abendliche Feluken-Fahrt oder eine Dinner-Kreuzfahrt ist die ruhigste Art, die Stadt zu erleben, mit den Lichtern von rund zwanzig Millionen Menschen an beiden Ufern.",
          ],
        },
      ],
    },
    whenToGo: {
      head: { eyebrow: "Planen Sie Ihren Besuch", heading: "Beste Reisezeit für Kairo" },
      body: [
        "Kairo zeigt sich von Oktober bis April von seiner besten Seite, wenn warme, trockene Tage lange Stunden an den Pyramiden und in der Altstadt angenehm machen.",
        "Der Sommer, von Juni bis August, ist heiß und dunstig, aber mit frühem Aufbruch und Mittagspausen problemlos machbar. Frühjahr und Herbst bringen das angenehmste Wetter und den klarsten Himmel.",
      ],
    },
    gettingThere: {
      head: { eyebrow: "Vor Ort unterwegs", heading: "Anreise nach Kairo" },
      body: [
        "Der Flughafen Kairo International ist Ägyptens wichtigstes Tor, mit Direktflügen aus ganz Europa, der Golfregion, Afrika und darüber hinaus.",
        "Die Stadt ist zudem der Knotenpunkt des ägyptischen Schienennetzes – Nacht- und Tageszüge fahren südwärts nach Luxor und Assuan, schnelle Verbindungen nordwärts nach Alexandria.",
      ],
    },
    gallery: { eyebrow: "Galerie", heading: "Kairo in Bildern" },
    faqs: [
      {
        q: "Wie viele Tage braucht man für Kairo?",
        a: "Zwei bis drei volle Tage decken das Wesentliche ab: ein Tag für die Pyramiden von Gizeh und das Große Ägyptische Museum sowie ein bis zwei Tage für das islamische und das koptische Kairo, die Zitadelle und den Basar.",
      },
      {
        q: "Ist das Große Ägyptische Museum geöffnet?",
        a: "Ja. Das Große Ägyptische Museum in Gizeh wurde am 1. November 2025 vollständig eröffnet und zeigt die komplette Tutanchamun-Sammlung neben Tausenden weiteren Artefakten.",
      },
      {
        q: "Kann man die Pyramiden bei einem Tagesausflug besichtigen?",
        a: "Problemlos. Das Gizeh-Plateau liegt im Großraum Kairo, sodass die Pyramiden und der Sphinx nur eine kurze Fahrt vom Zentrum entfernt sind und meist mit dem Großen Ägyptischen Museum verbunden werden.",
      },
      {
        q: "Wann ist die beste Reisezeit für Kairo?",
        a: "Oktober bis April bietet das angenehmste Besichtigungswetter. Der Sommer ist heiß, aber mit frühem Aufbruch und Mittagsruhe gut zu bewältigen.",
      },
    ],
    creditsSummary: "Bildnachweise & Lizenzen",
    nearby: ["luxor", "alexandria", "aswan"],
  },
  luxor: {
    seo: {
      title: "Luxor-Touren & Tagesausflüge | Ausflüge buchen",
      description:
        "Luxor-Touren und Tagesausflüge: Karnak, das Tal der Könige, der Hatschepsut-Tempel und Ballonfahrten im Morgengrauen über dem Nil – geführt von lizenzierten Ägyptologen.",
      keywords: [
        "Luxor Touren",
        "Luxor Tagesausflüge",
        "Tal der Könige Tour",
        "Karnak-Tempel",
        "Luxor Sehenswürdigkeiten",
        "Luxor Ausflüge",
      ],
    },
    heroSlug: "karnak-temple",
    heroEyebrow: "Oberägypten · Das antike Theben",
    h1: "Luxor-Touren & Tagesausflüge",
    lede: "Das größte Freilichtmuseum der Welt, erbaut an der Stätte des antiken Theben.",
    overview: [
      "Luxor-Touren führen Sie ins Herz des antiken Theben, der Hauptstadt Ägyptens im Neuen Reich. Oft als das größte Freilichtmuseum der Welt bezeichnet, weist Luxor eine Dichte an Monumenten auf, die nirgendwo sonst erreicht wird – die weitläufige Tempelanlage von Karnak, den Luxor-Tempel im Stadtzentrum und, jenseits des Nils, die Königsgräber im Tal der Könige.",
      "Der Fluss teilt die Stadt in zwei Hälften: das lebendige Ostufer mit seinen Tempeln und Märkten und das Westufer mit Gräbern und Totentempeln, wo die alten Ägypter ihre Könige bestatteten. Ein einziger Tag kann Karnak mit dem Tal der Könige verbinden, und es gibt keinen schöneren Sonnenaufgang als jenen aus einem Heißluftballon, der über die gesamte thebanische Ebene gleitet.",
    ],
    facts: [
      { icon: "globe", value: "Oberägypten", label: "am Nil, das antike Theben" },
      { icon: "star", value: "Tal der Könige", label: "Königsgräber des Neuen Reiches" },
      { icon: "calendar", value: "Nov.–Feb.", label: "die kühlsten Monate für Touren" },
      { icon: "travel", value: "~1 Std. Flug", label: "südlich von Kairo" },
    ],
    highlights: {
      head: {
        eyebrow: "Top-Attraktionen",
        heading: "Sehenswertes in Luxor",
        intro:
          "Tempel, Königsgräber und der Nil – Luxor bündelt mehr vom alten Ägypten in einem kurzen Aufenthalt als jeder andere Ort des Landes.",
      },
      items: [
        {
          rank: 1,
          name: "Karnak-Tempel",
          body: "Eine Stadt von Tempeln, über mehr als tausend Jahre erweitert; seine Große Säulenhalle drängt 134 gewaltige Säulen zu einem steinernen Wald zusammen.",
        },
        {
          rank: 2,
          name: "Tal der Könige",
          body: "Die in den Fels gehauenen Königsgräber des Neuen Reiches, darunter das Grab Tutanchamuns, dessen Mumie noch heute hier ruht.",
        },
        {
          rank: 3,
          name: "Luxor-Tempel",
          body: "Im Herzen der heutigen Stadt, einst durch eine Sphinxallee mit Karnak verbunden und nach Einbruch der Dunkelheit wunderschön angestrahlt.",
        },
        {
          rank: 4,
          name: "Tempel der Hatschepsut",
          body: "Der von Kolonnaden gesäumte Totentempel der berühmtesten Pharaonin Ägyptens, vor die Felsen des Westufers bei Deir el-Bahari gesetzt.",
        },
        {
          rank: 5,
          name: "Medinet Habu",
          body: "Der große Totentempel Ramses’ III., berühmt für seine lebendigen, bemerkenswert gut erhaltenen Reliefs.",
        },
        {
          rank: 6,
          name: "Eine Ballonfahrt im Morgengrauen",
          body: "Das klassische Luxor-Erlebnis: über Tempel, Gräber und grüne Flussufer zu schweben, während die Sonne aufgeht.",
        },
      ],
    },
    features: {
      head: {
        eyebrow: "Die Stadt erkunden",
        heading: "Was Luxor unverzichtbar macht",
        intro:
          "Der Nil teilt Luxor in die Tempel des lebendigen Ostufers und die Gräber des Westens. Beide gehören auf jede Reiseroute.",
      },
      rows: [
        {
          image: "valley-of-kings",
          eyebrow: "Das Westufer",
          heading: "Das Tal der Könige",
          body: [
            "Verborgen in einem Wüstental hinter den Klippen wurden mehr als sechzig Königsgräber tief in den Fels getrieben und mit Texten bemalt, die die Pharaonen ins Jenseits geleiten sollten.",
            "Das Grab Tutanchamuns liegt hier, und seine Mumie ruht noch immer darin; ein Großteil seines Schatzes ist inzwischen ins Große Ägyptische Museum bei Kairo umgezogen.",
          ],
        },
        {
          image: "hatshepsut-temple",
          eyebrow: "Totentempel",
          heading: "Tempel vor den Klippen",
          body: [
            "Der terrassenförmige Tempel der Hatschepsut erhebt sich bei Deir el-Bahari unmittelbar aus dem Fels – eines der eindrucksvollsten Bauwerke Ägyptens.",
            "In der Nähe stehen Medinet Habu und die Memnonkolosse, zwei riesige sitzende Statuen, die die Ebene seit über dreitausend Jahren bewachen.",
          ],
        },
        {
          image: "luxor-nile-sunset",
          eyebrow: "Der Fluss",
          heading: "Der Nil bei Luxor",
          body: [
            "Eine Überfahrt mit Feluke oder Motorboot verbindet die beiden Ufer, und der Sonnenuntergang über dem Wasser ist ein Luxor-Ritual.",
            "Viele Reisende kommen oder fahren mit einer Nilkreuzfahrt nach Assuan an und ab und machen so die Fahrt zwischen den Monumenten zum Teil der Reise.",
          ],
        },
      ],
    },
    whenToGo: {
      head: { eyebrow: "Planen Sie Ihren Besuch", heading: "Beste Reisezeit für Luxor" },
      body: [
        "Luxor liegt in Oberägypten, wo die Sommer wirklich unerbittlich sind – von Juni bis August klettern die Temperaturen regelmäßig über 40°C.",
        "Das ideale Zeitfenster reicht von November bis Februar, mit warmen, trockenen Tagen, die sich perfekt für lange Stunden zwischen den Tempeln eignen. Wann immer Sie kommen: brechen Sie früh auf und ruhen Sie während der Mittagshitze.",
      ],
    },
    gettingThere: {
      head: { eyebrow: "Vor Ort unterwegs", heading: "Anreise nach Luxor" },
      body: [
        "Luxor liegt am Nil, rund 670 km südlich von Kairo – etwa ein einstündiger Inlandsflug oder eine Fahrt mit dem Nachtzug.",
        "Der Flughafen Luxor International bedient Inlands- und saisonale Auslandsflüge, und viele Besucher reisen per Nilkreuzfahrt aus Assuan an, das rund 220 km weiter südlich liegt.",
      ],
    },
    gallery: { eyebrow: "Galerie", heading: "Luxor in Bildern" },
    faqs: [
      {
        q: "Wie viele Tage braucht man für Luxor?",
        a: "Zwei Tage genügen, um das Ostufer (Karnak und den Luxor-Tempel) und das Westufer (Tal der Könige, Hatschepsut und Medinet Habu) ohne Hast zu erkunden. Bei knapper Zeit ist auch ein sehr voller Tag möglich.",
      },
      {
        q: "Liegt das Grab Tutanchamuns noch im Tal der Könige?",
        a: "Ja. Die Mumie Tutanchamuns ruht weiterhin in seinem Grab (KV62) im Tal der Könige. Ein Großteil seines Schatzes wird inzwischen im Großen Ägyptischen Museum bei Kairo gezeigt.",
      },
      {
        q: "Kann man Luxor bei einem Tagesausflug von Hurghada aus besuchen?",
        a: "Ja. Luxor ist ein beliebter langer Tagesausflug von Hurghada am Roten Meer, meist einige Stunden pro Strecke über Land, mit Karnak und dem Tal der Könige.",
      },
      {
        q: "Wann ist die beste Reisezeit für Luxor?",
        a: "November bis Februar bietet das kühlste und angenehmste Besichtigungswetter. Der Sommer ist sehr heiß, aber ruhiger und am besten mit frühem Aufbruch zu bewältigen.",
      },
    ],
    creditsSummary: "Bildnachweise & Lizenzen",
    nearby: ["aswan", "cairo", "hurghada"],
  },
  aswan: {
    seo: {
      title: "Assuan-Touren & Tagesausflüge | Abu Simbel & Nil",
      description:
        "Assuan-Touren und Tagesausflüge: die Tempel von Philae und Abu Simbel, Feluken auf dem Nil, nubische Dörfer und der Hochdamm. Ägyptens beschauliche Stadt im Süden.",
      keywords: [
        "Assuan Touren",
        "Assuan Tagesausflüge",
        "Abu Simbel Tour",
        "Philae-Tempel",
        "Feluke Assuan",
        "Assuan Sehenswürdigkeiten",
      ],
    },
    heroSlug: "aswan-nile-r01",
    heroEyebrow: "Oberägypten · Der nubische Nil",
    h1: "Assuan-Touren & Tagesausflüge",
    lede: "Ägyptens ruhige Südgrenze, wo der Nil sich von seiner schönsten Seite zeigt.",
    overview: [
      "Assuan-Touren erkunden Ägyptens sanfte Stadt im Süden, dort gelegen, wo der Nil am malerischsten ist – Inseln, Granitfelsen und goldene Wüste, die bis ans leuchtend blaue Wasser reichen. Es ist die entspannteste der Nilstädte und das Tor zu Nubien, mit einer eigenen Kultur, Küche und Musik.",
      "Von Assuan aus segeln Sie zum Inseltempel von Philae, unternehmen eine Feluken-Fahrt um die Insel Elephantine und die Kitchener-Insel und reisen südwärts zu den kolossalen Felsentempeln von Abu Simbel. Der Hochdamm und der Unvollendete Obelisk erzählen die jüngere Geschichte einer Stadt, die vom Fluss geprägt ist, den sie bändigt.",
    ],
    facts: [
      { icon: "globe", value: "Nubien", label: "Ägyptens tiefer Süden" },
      { icon: "star", value: "Abu Simbel", label: "Ramses’ II. Felsentempel" },
      { icon: "calendar", value: "Nov.–Feb.", label: "kühles, klares Reisewetter" },
      { icon: "travel", value: "~1 Std. Flug", label: "südlich von Kairo" },
    ],
    highlights: {
      head: {
        eyebrow: "Top-Attraktionen",
        heading: "Sehenswertes in Assuan",
        intro:
          "Inseltempel, Segelboote und die Straße nach Abu Simbel – Assuan belohnt ein gemächlicheres Tempo als jeder andere Ort am Nil.",
      },
      items: [
        {
          rank: 1,
          name: "Abu Simbel",
          body: "Die kolossalen Felsentempel Ramses’ II., rund 280 km südlich von Assuan, die Block für Block versetzt wurden, um den steigenden Wassern des Nassersees zu entgehen.",
        },
        {
          rank: 2,
          name: "Philae-Tempel",
          body: "Der anmutige Tempel der Göttin Isis, während der Hochdamm-Kampagne auf die Insel Agilkia versetzt und per Boot erreichbar.",
        },
        {
          rank: 3,
          name: "Eine Feluke auf dem Nil",
          body: "Das traditionelle Segelboot des Flusses; ein Nachmittag rund um die Inseln Elephantine und Kitchener ist das klassische Assuan-Erlebnis.",
        },
        {
          rank: 4,
          name: "Ein nubisches Dorf",
          body: "Bunt bemalte Häuser am Flussufer, nubische Küche und herzliche Gastfreundschaft, meist per Boot über den Nil erreicht.",
        },
        {
          rank: 5,
          name: "Der Assuan-Hochdamm",
          body: "Der Damm aus den 1960er-Jahren, der den Nassersee schuf, die alljährliche Nilflut beendete und das moderne Ägypten prägte.",
        },
        {
          rank: 6,
          name: "Der Unvollendete Obelisk",
          body: "In seinem antiken Granitsteinbruch zurückgelassen, zeigt er genau, wie die Ägypter ihre gewaltigen Monumente aus dem Fels lösten.",
        },
      ],
    },
    features: {
      head: {
        eyebrow: "Die Stadt erkunden",
        heading: "Was Assuan unverzichtbar macht",
        intro:
          "Hier zeigt sich der Nil von seiner schönsten Seite – das Tor nach Nubien und in den tiefen Süden des alten Ägypten.",
      },
      rows: [
        {
          image: "philae-temple",
          eyebrow: "Inseltempel",
          heading: "Philae, der Tempel der Isis",
          body: [
            "Als der Hochdamm ihn zu überfluten drohte, wurde der gesamte Tempel von Philae zerlegt und Stein für Stein auf der höher gelegenen Insel Agilkia wieder aufgebaut.",
            "Nach einer kurzen Bootsfahrt erreicht, bietet er eine der lieblichsten Kulissen aller Tempel Ägyptens, besonders im weichen Licht des frühen Morgens.",
          ],
        },
        {
          image: "felucca-aswan",
          eyebrow: "Unter Segeln",
          heading: "Feluken und die Inseln",
          body: [
            "Nichts fängt Assuan so ein wie ein Nachmittag unter dem weißen Segel einer Feluke, die zwischen Granitinseln kreuzt, während die Sonne sinkt.",
            "Der Fluss umschließt hier die Insel Elephantine und die botanischen Gärten der Kitchener-Insel, die sich beide leicht in eine Segeltour einbinden lassen.",
          ],
        },
        {
          image: "aswan-high-dam",
          eyebrow: "Der moderne Nil",
          heading: "Der Hochdamm und der Nassersee",
          body: [
            "1970 fertiggestellt, bändigte der Assuan-Hochdamm die Nilfluten und schuf den Nassersee, einen der größten Stauseen der Welt.",
            "Das Projekt prägte Ägypten neu – und erzwang die epische Rettung von Abu Simbel und Philae vor dem steigenden Wasser.",
          ],
        },
      ],
    },
    whenToGo: {
      head: { eyebrow: "Planen Sie Ihren Besuch", heading: "Beste Reisezeit für Assuan" },
      body: [
        "Als südlichste der großen Städte Ägyptens ist Assuan einen Großteil des Jahres heiß und im Hochsommer glühend. Von November bis Februar bringt es warme Tage und kühle, klare Nächte – ideal für Tempel und Zeit am Fluss.",
        "Das Sonnenfest von Abu Simbel, wenn das Sonnenlicht das innerste Heiligtum erreicht, fällt auf den 22. Februar und den 22. Oktober und zieht große Menschenmengen an.",
      ],
    },
    gettingThere: {
      head: { eyebrow: "Vor Ort unterwegs", heading: "Anreise nach Assuan" },
      body: [
        "Assuan liegt am Nil im tiefen Süden Ägyptens, etwa ein einstündiger Flug von Kairo entfernt oder eine Nacht im Zug.",
        "Abu Simbel liegt rund 280 km weiter südlich und ist über die Straße oder mit einem kurzen Inlandsflug erreichbar. Viele Besucher reisen mit einer Nilkreuzfahrt zwischen Assuan und Luxor an oder ab.",
      ],
    },
    gallery: { eyebrow: "Galerie", heading: "Assuan in Bildern" },
    faqs: [
      {
        q: "Lohnt sich der Ausflug von Assuan nach Abu Simbel?",
        a: "Für die meisten Reisenden ja. Die beiden Felsentempel Ramses’ II. gehören zu den spektakulärsten Monumenten Ägyptens. Die Fahrt beträgt rund 280 km pro Strecke über die Straße oder einen kurzen Inlandsflug.",
      },
      {
        q: "Was ist eine Feluken-Fahrt in Assuan?",
        a: "Eine Feluke ist ein traditionelles hölzernes Segelboot. Eine gemächliche Fahrt rund um die Inseln Elephantine und Kitchener, besonders bei Sonnenuntergang, ist das prägende Assuan-Erlebnis.",
      },
      {
        q: "Wie viele Tage braucht man für Assuan?",
        a: "Ein bis zwei Tage decken Philae, eine Feluken-Fahrt und ein nubisches Dorf ab; planen Sie einen weiteren Tag ein, wenn Sie den Ausflug südwärts nach Abu Simbel machen möchten.",
      },
      {
        q: "Wann ist die beste Reisezeit für Assuan?",
        a: "November bis Februar für das kühlste Wetter. Die Sommer sind sehr heiß, daher ist ein früher Aufbruch unerlässlich, wenn Sie dann reisen.",
      },
    ],
    creditsSummary: "Bildnachweise & Lizenzen",
    nearby: ["luxor", "cairo", "hurghada"],
  },
  alexandria: {
    seo: {
      title: "Alexandria-Touren & Tagesausflüge ab Kairo",
      description:
        "Alexandria-Touren und Tagesausflüge: die Zitadelle von Qaitbay, die Bibliotheca Alexandrina, römische Katakomben und die Mittelmeer-Corniche. Ägyptens historische Küstenstadt.",
      keywords: [
        "Alexandria Touren",
        "Alexandria Tagesausflüge",
        "Alexandria Tagesausflug ab Kairo",
        "Bibliotheca Alexandrina",
        "Zitadelle von Qaitbay",
        "Alexandria Sehenswürdigkeiten",
      ],
    },
    heroSlug: "citadel-of-qaitbay-alexandria-egypt",
    heroEyebrow: "Ägypten · Die Mittelmeerküste",
    h1: "Alexandria-Touren & Tagesausflüge",
    lede: "Ägyptens geschichtsträchtige Küstenstadt, gegründet von Alexander dem Großen.",
    overview: [
      "Alexandria-Touren folgen den Spuren der Mittelmeerstadt, die Alexander der Große 331 v. Chr. gründete. Jahrhundertelang war sie eine der großen Städte der Antike, Heimat der legendären Bibliothek und des Leuchtturms Pharos – eines der Sieben Weltwunder. Heute ist sie Ägyptens zweite Stadt, an einer geschwungenen Uferpromenade aufgereiht, mit einem ganz eigenen Charakter.",
      "Die meisten Besucher kommen aus Kairo, rund drei Stunden mit dem Auto oder dem Hochgeschwindigkeitszug entfernt, was Alexandria zu einem beliebten Tagesausflug macht. Die Zitadelle von Qaitbay steht an der Stelle des antiken Leuchtturms, und die moderne Bibliotheca Alexandrina lässt die Erinnerung an die verlorene Bibliothek wieder aufleben – neben römischen Katakomben, der Pompeiussäule und berühmten Meeresfrüchten am Wasser.",
    ],
    facts: [
      { icon: "globe", value: "Mittelmeer", label: "Ägyptens zweite Stadt" },
      { icon: "star", value: "Zitadelle von Qaitbay", label: "an der Stelle des Pharos" },
      { icon: "calendar", value: "Frühjahr & Herbst", label: "mildes Küstenwetter" },
      { icon: "travel", value: "~3 Std.", label: "mit Auto oder Zug ab Kairo" },
    ],
    highlights: {
      head: {
        eyebrow: "Top-Attraktionen",
        heading: "Sehenswertes in Alexandria",
        intro:
          "Griechisches, römisches und modernes Ägypten, geschichtet entlang einer Mittelmeerküste – alles bequem an einem Tag von Kairo aus.",
      },
      items: [
        {
          rank: 1,
          name: "Zitadelle von Qaitbay",
          body: "Eine Festung aus dem 15. Jahrhundert, die den Hafen bewacht, errichtet genau an der Stelle des antiken Leuchtturms Pharos.",
        },
        {
          rank: 2,
          name: "Bibliotheca Alexandrina",
          body: "Eine markante moderne Bibliothek und Kulturstätte, die das Erbe der antiken Bibliothek von Alexandria wiederbelebt.",
        },
        {
          rank: 3,
          name: "Katakomben von Kom el-Shoqafa",
          body: "Eine mehrstöckige Nekropole aus römischer Zeit, die ägyptische, griechische und römische Kunst vereint und 1900 durch Zufall wiederentdeckt wurde.",
        },
        {
          rank: 4,
          name: "Pompeiussäule",
          body: "Eine aufragende römische Triumphsäule neben den Ruinen des Serapeum-Tempels.",
        },
        {
          rank: 5,
          name: "Die Corniche & Montaza",
          body: "Die lange Uferpromenade, die im Osten an den königlichen Gärten und dem Palast von Montaza endet.",
        },
        {
          rank: 6,
          name: "Meeresfrüchte am Meer",
          body: "Alexandria ist in ganz Ägypten berühmt für frische Meeresfrüchte aus dem Mittelmeer, direkt am Wasser genossen.",
        },
      ],
    },
    features: {
      head: {
        eyebrow: "Die Stadt erkunden",
        heading: "Was Alexandria unverzichtbar macht",
        intro:
          "Eine Mittelmeerhauptstadt der Erinnerung, in der die Geister der Antike auf eine lebendige moderne Uferpromenade treffen.",
      },
      rows: [
        {
          image: "citadel-of-qaitbay-014",
          eyebrow: "Der Hafen",
          heading: "Die Zitadelle von Qaitbay",
          body: [
            "Die Festung von Qaitbay bewacht die Einfahrt zum Osthafen, ihre bleichen Mauern steigen unmittelbar aus dem Meer auf.",
            "Sie steht genau an der Stelle, wo einst der Leuchtturm Pharos – eines der Sieben Weltwunder der Antike – die Schiffe vor der Küste warnte.",
          ],
        },
        {
          image: "alexandria-egypt-235108463",
          eyebrow: "Die Küstenstadt",
          heading: "Eine Hauptstadt der Erinnerung am Meer",
          body: [
            "Alexandria zieht sich meilenweit an einer luftigen Corniche entlang, ihre Cafés und verblichenen Villen blicken über das Mittelmeer.",
            "Die moderne Bibliotheca Alexandrina, die römischen Katakomben und die Pompeiussäule halten die griechische und römische Vergangenheit der Stadt dicht unter der Oberfläche.",
          ],
        },
      ],
    },
    whenToGo: {
      head: { eyebrow: "Planen Sie Ihren Besuch", heading: "Beste Reisezeit für Alexandria" },
      body: [
        "Mit ihrer Lage am Mittelmeer ist Alexandria milder als der Rest Ägyptens – angenehm im Frühjahr und Herbst, heiß, aber vom Meer gekühlt im Sommer und kühl und mitunter regnerisch im Winter.",
        "Frühjahr (März bis Mai) und Herbst (September bis November) sind die angenehmsten Zeiten, um die Corniche zu erwandern und die Sehenswürdigkeiten zu erkunden.",
      ],
    },
    gettingThere: {
      head: { eyebrow: "Vor Ort unterwegs", heading: "Anreise nach Alexandria" },
      body: [
        "Alexandria liegt rund drei Stunden von Kairo entfernt, mit dem Auto oder dem Hochgeschwindigkeitszug (etwa 220 km nordwestlich), was es zu einem beliebten Tagesausflug oder einer Übernachtung ab der Hauptstadt macht.",
        "Der Flughafen Borg El Arab westlich der Stadt bedient eine wachsende Zahl internationaler Flüge für Reisende, die direkt an die Küste wollen.",
      ],
    },
    gallery: { eyebrow: "Galerie", heading: "Alexandria in Bildern" },
    faqs: [
      {
        q: "Kann man Alexandria bei einem Tagesausflug von Kairo aus besuchen?",
        a: "Ja – es ist einer der beliebtesten Tagesausflüge Ägyptens. Alexandria liegt etwa drei Stunden von Kairo entfernt, mit dem Auto oder dem Hochgeschwindigkeitszug, sodass ein ganzer Tag für die Zitadelle, die Bibliothek und die Katakomben bleibt.",
      },
      {
        q: "Wofür ist Alexandria bekannt?",
        a: "Von Alexander dem Großen gegründet, war es Heimat der antiken Bibliothek und des Leuchtturms Pharos. Heute ist es für seine Mittelmeer-Uferpromenade, seine griechisch-römischen Stätten und frische Meeresfrüchte bekannt.",
      },
      {
        q: "Wie viele Tage braucht man für Alexandria?",
        a: "Ein einziger voller Tag deckt die Höhepunkte ab. Eine Übernachtung erlaubt es, die Corniche und die Meeresfrüchte in Ruhe zu genießen.",
      },
      {
        q: "Wann ist die beste Reisezeit für Alexandria?",
        a: "Frühjahr und Herbst sind ideal. Der Sommer ist belebt und warm, aber vom Meer gemildert; der Winter ist kühl und kann regnerisch sein.",
      },
    ],
    creditsSummary: "Bildnachweise & Lizenzen",
    nearby: ["cairo", "luxor", "aswan"],
  },
  hurghada: {
    seo: {
      title: "Hurghada-Ausflüge & Tagestouren | Rotes Meer",
      description:
        "Hurghada-Ausflüge und Tagestouren: Schnorcheln und Tauchen an den Riffen des Roten Meeres, Bootstouren zur Insel Giftun, Wüstensafaris und lange Tagesausflüge nach Luxor.",
      keywords: [
        "Hurghada Ausflüge",
        "Hurghada Tagestouren",
        "Schnorcheln Insel Giftun",
        "Tauchen Rotes Meer Hurghada",
        "Hurghada Sehenswürdigkeiten",
        "Hurghada Bootstouren",
      ],
    },
    heroSlug: "giftun-eden-island",
    heroEyebrow: "Ägypten · Die Riviera am Roten Meer",
    h1: "Hurghada-Ausflüge & Tagestouren",
    lede: "Ägyptens belebtestes Resort am Roten Meer und ein Tor zu warmen Riffen.",
    overview: [
      "Bei Hurghada-Ausflügen dreht sich alles um das Rote Meer. Aus einem kleinen Fischerdorf zu Ägyptens belebtestem Küstenresort gewachsen, liegt Hurghada an einem langen Abschnitt warmen, klaren Wassers mit Dutzenden vorgelagerten Riffen und Inseln in leichter Reichweite. Es ist die klassische Wahl für eine erste Reise ans Rote Meer, einen Familien-Strandurlaub oder eine Sonne-und-Meer-Ergänzung nach den Tempeln.",
      "Bootstouren fahren hinaus zur Insel Giftun und zur Orange Bay zum Schnorcheln über Korallengärten, während Taucher Riffe und Wracks entlang der Küste erkunden. Im Landesinneren erreichen Wüstensafaris mit Quad oder Jeep Beduinencamps unter den Sternen, und lange Tagesausflüge fahren westwärts zu den Tempeln von Luxor.",
    ],
    facts: [
      { icon: "globe", value: "Küste am Roten Meer", label: "das ägyptische Festland" },
      { icon: "star", value: "Insel Giftun", label: "Riffe und weiße Sandbuchten" },
      { icon: "weather", value: "Sonne das ganze Jahr", label: "warmes Meer und Sonnenschein" },
      { icon: "travel", value: "Direkte Charterflüge", label: "plus ~1 Std. Flug ab Kairo" },
    ],
    highlights: {
      head: {
        eyebrow: "Top-Attraktionen",
        heading: "Sehenswertes in Hurghada",
        intro:
          "Riffe, Inseln und Wüste – Hurghada ist für Zeit auf und unter dem Wasser gemacht, mit den Tempeln von Luxor in Reichweite eines Tages.",
      },
      items: [
        {
          rank: 1,
          name: "Insel Giftun & Orange Bay",
          body: "Die beliebteste Bootstour ab Hurghada: weiße Sandbuchten und flache Riffe, ideal zum Schnorcheln.",
        },
        {
          rank: 2,
          name: "Schnorcheln & Tauchen an den Riffen",
          body: "Warmes, klares Wasser und Riffe voller Korallen und Fische machen dies zu einem der beliebtesten Tauchziele der Welt.",
        },
        {
          rank: 3,
          name: "Eine Bootstour auf dem Roten Meer",
          body: "Halb- und ganztägige Fahrten verbinden Schnorchelstopps, Baden und Mittagessen draußen auf dem Wasser.",
        },
        {
          rank: 4,
          name: "Wüstensafari",
          body: "Quads, Jeeps und Kamele ziehen in die Östliche Wüste zu Beduinencamps für Sonnenuntergang und Abendessen.",
        },
        {
          rank: 5,
          name: "Die Marina & die Altstadt El Dahar",
          body: "Die Uferpromenade zum Essen und für Abende und die Märkte und Cafés des älteren Viertels.",
        },
        {
          rank: 6,
          name: "Tagesausflug nach Luxor",
          body: "Ein langer, aber lohnender Tag ins Landesinnere zu den Tempeln und Gräbern des antiken Theben.",
        },
      ],
    },
    features: {
      head: {
        eyebrow: "Die Küste erkunden",
        heading: "Was Hurghada unverzichtbar macht",
        intro:
          "Eine ganze Küstenlinie aus Riffen und Inseln, mit den antiken Stätten des Niltals als leichtem Tagesausflug.",
      },
      rows: [
        {
          image: "giftun-island-egypte-panoramio",
          eyebrow: "Die Inseln",
          heading: "Die Insel Giftun und die Riffe",
          body: [
            "Die Inseln vor Hurghada sind von flachen Korallenriffen und leuchtend weißen Sandbänken gesäumt – das Rote Meer, wie es postkartenschöner nicht sein könnte.",
            "Die Orange Bay auf Giftun ist der Hauptstopp, mit warmem, ruhigem Wasser, das Schnorchel-Anfängern ebenso zusagt wie erfahrenen Tauchern.",
          ],
        },
        {
          image: "egypt-hurghada-from-plane01",
          eyebrow: "Die Riviera am Roten Meer",
          heading: "Resortküste und Wüstenrand",
          body: [
            "Hurghada erstreckt sich meilenweit entlang der Küste, ein Streifen aus Resorts und Yachthäfen, im Rücken die Östliche Wüste.",
            "Diese Mischung bedeutet: Sie können morgens schnorcheln, bei Sonnenuntergang mit dem Quad über die Dünen fahren und trotzdem noch einen Tagesausflug zu den Tempeln von Luxor unterbringen.",
          ],
        },
      ],
    },
    whenToGo: {
      head: { eyebrow: "Planen Sie Ihren Besuch", heading: "Beste Reisezeit für Hurghada" },
      body: [
        "Die Küste am Roten Meer ist ein Ganzjahresziel – warm und zum Baden geeignet in jeder Saison. Frühjahr und Herbst sind herrlich, und die Wassertemperaturen bleiben das ganze Jahr über angenehm.",
        "Der Sommer ist heiß, aber von Meeresbrisen gemildert und perfekt für Zeit im Wasser, während der Winter tagsüber mild und sonnig bleibt und nach Einbruch der Dunkelheit kühler wird.",
      ],
    },
    gettingThere: {
      head: { eyebrow: "Vor Ort unterwegs", heading: "Anreise nach Hurghada" },
      body: [
        "Hurghada liegt an der Küste des Roten Meeres, etwa ein einstündiger Flug von Kairo entfernt oder rund vier bis fünf Stunden mit dem Auto.",
        "Der Flughafen Hurghada International empfängt direkte Linien- und Charterflüge aus vielen europäischen Städten und ist damit einer der am einfachsten direkt aus dem Ausland erreichbaren Orte Ägyptens.",
      ],
    },
    gallery: { eyebrow: "Galerie", heading: "Hurghada in Bildern" },
    faqs: [
      {
        q: "Was ist der beste Ausflug in Hurghada?",
        a: "Eine Bootstour zur Insel Giftun und zur Orange Bay ist die beliebteste und verbindet Schnorcheln über Korallenriffen mit Zeit an weißen Sandstränden.",
      },
      {
        q: "Kann man von Hurghada aus Luxor besuchen?",
        a: "Ja. Luxor ist ein beliebter langer Tagesausflug von Hurghada, meist einige Stunden pro Strecke über Land, mit Karnak und dem Tal der Könige.",
      },
      {
        q: "Eignet sich Hurghada zum Schnorcheln und Tauchen?",
        a: "Sehr. Die vorgelagerten Riffe sind warm, klar und reich an Korallen und Fischen, geeignet für Anfänger wie erfahrene Taucher gleichermaßen.",
      },
      {
        q: "Wann ist die beste Reisezeit für Hurghada?",
        a: "Zu jeder Jahreszeit. Frühjahr und Herbst sind ideal; der Sommer ist heiß, aber großartig für das Wasser; der Winter ist mild und sonnig.",
      },
    ],
    creditsSummary: "Bildnachweise & Lizenzen",
    nearby: ["luxor", "cairo", "sharm-el-sheikh"],
  },
  "sharm-el-sheikh": {
    seo: {
      title: "Sharm-el-Sheikh-Ausflüge & Tagestouren",
      description:
        "Sharm-el-Sheikh-Ausflüge und Tagestouren: erstklassiges Tauchen und Schnorcheln bei Ras Muhammad und Tiran, Wüstensafaris und der Ausflug zum Katharinenkloster.",
      keywords: [
        "Sharm-el-Sheikh Ausflüge",
        "Sharm-el-Sheikh Tagestouren",
        "Tauchen Ras Muhammad",
        "Schnorcheln Insel Tiran",
        "Sharm-el-Sheikh Sehenswürdigkeiten",
        "Ausflug zum Katharinenkloster",
      ],
    },
    heroSlug: "ras-mohammed-panoramio",
    heroEyebrow: "Ägypten · Südsinai",
    h1: "Sharm-el-Sheikh-Ausflüge & Tagestouren",
    lede: "Ein Resort im Südsinai, umringt von einigen der schönsten Korallenriffe der Welt.",
    overview: [
      "Sharm-el-Sheikh-Ausflüge kreisen um die außergewöhnlichen Riffe des Südsinai. An der Südspitze der Halbinsel blickt das Resort über ein Wasser, das Taucher und Schnorchler aus aller Welt anzieht – nirgends mehr als im Ras-Muhammad-Nationalpark, Ägyptens erstem Nationalpark, wo steile Korallenwände senkrecht ins Blau abfallen.",
      "Jenseits der Riffe ist Sharm ein Ausgangspunkt für die Wüste und die Berge des Sinai-Hinterlands. Bootstouren fahren zur Insel Tiran, und eine der großen Überlandreisen Ägyptens führt hinauf zum Katharinenkloster und zum Berg Sinai. Die Naama Bay ist das Zentrum zum Essen und für die Abende.",
    ],
    facts: [
      { icon: "globe", value: "Südsinai", label: "die Spitze der Halbinsel" },
      { icon: "star", value: "Ras Muhammad", label: "Ägyptens erster Nationalpark" },
      { icon: "weather", value: "Sonne das ganze Jahr", label: "warmes, klares Wasser des Roten Meeres" },
      { icon: "travel", value: "Direktflüge", label: "aus Europa und der Golfregion" },
    ],
    highlights: {
      head: {
        eyebrow: "Top-Attraktionen",
        heading: "Sehenswertes in Sharm el-Sheikh",
        intro:
          "Einige der besten Tauchreviere der Welt liegen vor der Tür, mit Wüsten- und Bergabenteuern eine kurze Fahrt landeinwärts.",
      },
      items: [
        {
          rank: 1,
          name: "Ras-Muhammad-Nationalpark",
          body: "Ägyptens erster Nationalpark, der spektakuläre Korallenwände schützt, wo Taucher und Schnorchler auf Fischschwärme treffen.",
        },
        {
          rank: 2,
          name: "Tauchen & Schnorcheln",
          body: "Sharm ist eines der weltweit führenden Tauchzentren, mit leichtem Riffzugang für Anfänger und berühmten Spots für Profis.",
        },
        {
          rank: 3,
          name: "Insel Tiran",
          body: "Ein Bootstour-Favorit in der Meerenge zwischen Sinai und Arabien, gesäumt von flachen, farbenprächtigen Riffen.",
        },
        {
          rank: 4,
          name: "Naama Bay",
          body: "Das lebhafte Uferzentrum des Resorts mit Restaurants, Cafés und Nachtleben.",
        },
        {
          rank: 5,
          name: "Katharinenkloster & Berg Sinai",
          body: "Ein Überlandausflug in die Berge zu einem Kloster aus dem 6. Jahrhundert und dem Gipfel, der überlieferungsgemäß mit Moses verbunden ist.",
        },
        {
          rank: 6,
          name: "Wüstensafari",
          body: "Ausflüge mit Quad, Jeep und Kamel in die Sinai-Wüste, die oft mit einem Beduinen-Abendessen unter den Sternen enden.",
        },
      ],
    },
    features: {
      head: {
        eyebrow: "Die Küste erkunden",
        heading: "Was Sharm el-Sheikh unverzichtbar macht",
        intro:
          "Die Riffe sind der Grund zu kommen, aber die Wüsten und heiligen Berge des Sinai geben Sharm eine zweite Dimension.",
      },
      rows: [
        {
          image: "ras-mohamed-national-park-panoramio",
          eyebrow: "Der Nationalpark",
          heading: "Die Korallenwände von Ras Muhammad",
          body: [
            "An der äußersten Spitze des Sinai stürzen die Riffe von Ras Muhammad von der Oberfläche in tiefblaues, von Fischen belebtes Wasser.",
            "1983 zu Ägyptens erstem Nationalpark erklärt, bleibt es eines der schönsten und am besten geschützten Riffsysteme des Roten Meeres.",
          ],
        },
        {
          image: "divemaster-ready-to-go",
          eyebrow: "Unter der Oberfläche",
          heading: "Eine Welthauptstadt des Tauchens",
          body: [
            "Tauchbasen säumen die Küste und bieten Kurse für völlige Anfänger sowie geführte Tauchgänge zu berühmten Spots für Erfahrene.",
            "Warmes Wasser und hervorragende Sicht machen Sharm zu einem der einfachsten Orte überhaupt, um tauchen zu lernen oder einfach ein Riff zu schnorcheln.",
          ],
        },
        {
          image: "tiran-island-sharm-el-sheikh-south-sinai-egypt",
          eyebrow: "Bootstouren",
          heading: "Die Insel Tiran und die Meerenge",
          body: [
            "Die Riffe rund um Tiran, in der Meerenge Richtung Saudi-Arabien, sind ein klassischer Tagesausflug per Boot ab Sharm.",
            "Flache Korallengärten und Steilabfälle liegen dicht beieinander, sodass Schnorchler und Taucher sich einige der besten Spots teilen.",
          ],
        },
      ],
    },
    whenToGo: {
      head: { eyebrow: "Planen Sie Ihren Besuch", heading: "Beste Reisezeit für Sharm el-Sheikh" },
      body: [
        "Geschützt am Golf von Akaba, genießt Sharm el-Sheikh fast das ganze Jahr über warmes, trockenes Wetter. Frühjahr und Herbst sind ideal, um Tauchen mit Wüstenausflügen zu verbinden.",
        "Der Sommer ist heiß, doch das Meer bleibt einladend, und die Wintertage sind angenehm warm – auch wenn die Abende und der Bergausflug zum Katharinenkloster kalt sein können.",
      ],
    },
    gettingThere: {
      head: { eyebrow: "Vor Ort unterwegs", heading: "Anreise nach Sharm el-Sheikh" },
      body: [
        "Sharm el-Sheikh liegt an der Südspitze der Sinai-Halbinsel. Sein internationaler Flughafen empfängt direkte Linien- und Charterflüge aus ganz Europa und der Golfregion, sodass viele Besucher direkt aus dem Ausland anreisen.",
        "Über Land ist es eine lange, aber landschaftlich reizvolle Fahrt von Kairo über den Sinai, und Inlandsflüge verbinden es in etwa einer Stunde mit der Hauptstadt.",
      ],
    },
    gallery: { eyebrow: "Galerie", heading: "Sharm el-Sheikh in Bildern" },
    faqs: [
      {
        q: "Wofür ist Sharm el-Sheikh am bekanntesten?",
        a: "Für erstklassiges Tauchen und Schnorcheln, allen voran im Ras-Muhammad-Nationalpark, dazu warmen Sonnenschein das ganze Jahr über und bequeme Direktflüge aus Europa.",
      },
      {
        q: "Können Anfänger in Sharm tauchen oder schnorcheln?",
        a: "Ja. Viele Riffe sind flach und küstennah, ideal für Schnorchel-Anfänger, während Tauchbasen Kurse und geführte Tauchgänge für alle Niveaus anbieten.",
      },
      {
        q: "Lohnt sich der Ausflug zum Katharinenkloster?",
        a: "Für viele Besucher ja. Es ist ein langer Überlandtag – oder eine Übernachtung für den Sonnenaufgangsaufstieg auf den Berg Sinai – in die Berge zu einem der ältesten noch aktiven Klöster der Welt.",
      },
      {
        q: "Wann ist die beste Reisezeit für Sharm el-Sheikh?",
        a: "Frühjahr und Herbst sind ideal. Der Sommer ist heiß, aber großartig für das Wasser, und der Winter ist tagsüber mild, wenn auch nachts kühler.",
      },
    ],
    creditsSummary: "Bildnachweise & Lizenzen",
    nearby: ["cairo", "hurghada", "luxor"],
  },
};
