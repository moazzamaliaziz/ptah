/**
 * Italian (it) editorial + SEO translation of `src/content/city-content.ts`.
 * Staging only. Register: Lei (courtesy) + impersonal editorial voice. Facts
 * mirrored exactly (GEM opened fully 1 Nov 2025; Tutankhamon's mummy stays in
 * the Valley of the Kings / KV62; distances approximate). Keys, `heroSlug`,
 * `image`, `icon`, `rank`, `nearby` mirrored 1:1; only human-readable values translated.
 */
import type { cityContent } from "@/content/city-content";

export const cityContentIt: typeof cityContent = {
  cairo: {
    seo: {
      title: "Tour ed escursioni giornaliere al Cairo | Piramidi di Giza",
      description:
        "Tour ed escursioni giornaliere al Cairo: le Piramidi di Giza e la Sfinge, il Grande Museo Egizio, la Cittadella e il bazar di Khan el-Khalili. Con guide locali.",
      keywords: [
        "tour del Cairo",
        "escursioni giornaliere al Cairo",
        "tour delle Piramidi di Giza",
        "Grande Museo Egizio",
        "cosa fare al Cairo",
        "escursioni al Cairo",
      ],
    },
    heroSlug: "city-of-a-thousand-minarets",
    heroEyebrow: "Egitto · La capitale sul Nilo",
    h1: "Tour ed escursioni giornaliere al Cairo",
    lede: "La vasta capitale dell'Egitto: patria delle Piramidi di Giza e di cinquemila anni di storia.",
    overview: [
      "I tour del Cairo racchiudono in un'unica città l'intero arco della storia egizia. Sull'altopiano di Giza, all'estremità occidentale della capitale, si ergono le ultime delle Sette Meraviglie del mondo antico: la Grande Piramide, le sue due compagne e la Grande Sfinge. A breve distanza in auto, il Grande Museo Egizio ha aperto completamente nel novembre 2025 e ora espone, per la prima volta, i tesori completi di Tutankhamon.",
      "Oltre ai faraoni, il Cairo è una città medievale viva. Il suo nucleo storico —spesso chiamato la Città dei Mille Minareti— riunisce la Cittadella di Saladino, grandi moschee, chiese copte e il labirinto del bazar di Khan el-Khalili. È il punto di partenza naturale di quasi ogni viaggio in Egitto, e la base per le escursioni a Giza, Saqqara e Menfi.",
    ],
    facts: [
      { icon: "globe", value: "Valle del Nilo", label: "la regione della capitale egizia" },
      { icon: "star", value: "Piramidi di Giza", label: "l'ultima meraviglia antica" },
      { icon: "calendar", value: "Ott – Apr", label: "i mesi più confortevoli" },
      { icon: "travel", value: "Porta principale", label: "Aeroporto Internazionale del Cairo" },
    ],
    highlights: {
      head: {
        eyebrow: "Attrazioni principali",
        heading: "Cosa fare al Cairo",
        intro:
          "Dall'ultima meraviglia superstite del mondo antico a una città medievale di minareti, ecco i luoghi imperdibili di un viaggio al Cairo.",
      },
      items: [
        {
          rank: 1,
          name: "Piramidi di Giza e la Sfinge",
          body: "Le tre piramidi e la Grande Sfinge sorgono su un altopiano all'estremità occidentale della città: l'unica meraviglia antica ancora in piedi.",
        },
        {
          rank: 2,
          name: "Grande Museo Egizio",
          body: "Il più grande museo al mondo dedicato a un'unica civiltà, accanto alle piramidi. Completamente aperto dal novembre 2025, custodisce la collezione completa di Tutankhamon.",
        },
        {
          rank: 3,
          name: "Il Museo Egizio, Tahrir",
          body: "Lo storico museo di piazza Tahrir espone tuttora una vasta collezione di antichità; le mummie reali riposano ora al Museo Nazionale della Civiltà Egizia.",
        },
        {
          rank: 4,
          name: "Cittadella di Saladino e Moschea di Muhammad Ali",
          body: "La fortezza medievale che corona la città, con la moschea di alabastro e ampie vedute sui tetti.",
        },
        {
          rank: 5,
          name: "Khan el-Khalili e il Cairo islamico",
          body: "Un bazar fondato nel XIV secolo, intessuto tra vie di moschee e madrase storiche.",
        },
        {
          rank: 6,
          name: "Il Cairo copto",
          body: "L'antico quartiere cristiano, con la Chiesa Sospesa e vicoli legati per tradizione al passaggio della Sacra Famiglia in Egitto.",
        },
      ],
    },
    features: {
      head: {
        eyebrow: "Esplora la città",
        heading: "Ciò che rende il Cairo imperdibile",
        intro:
          "L'Egitto antico e quello medievale convivono qui fianco a fianco. Pochi giorni Le permettono di passare dalle piramidi ai musei, alla città vecchia e al fiume.",
      },
      rows: [
        {
          image: "cairo-museum-public-domain",
          eyebrow: "Musei",
          heading: "Da Tahrir al Grande Museo Egizio",
          body: [
            "Il Cairo dispone ora di due grandi musei. Lo storico Museo Egizio di piazza Tahrir, inaugurato nel 1902, custodisce ancora una straordinaria collezione di antichità.",
            "A Giza, il Grande Museo Egizio ha aperto completamente il 1º novembre 2025: il più grande museo di un'unica civiltà al mondo, e il primo luogo in cui la collezione completa di Tutankhamon è esposta riunita.",
          ],
        },
        {
          image: "khan-el-khalili-cc0",
          eyebrow: "Il Cairo vecchio",
          heading: "Khan el-Khalili e la città dei minareti",
          body: [
            "Il bazar di Khan el-Khalili commercia dal XIV secolo, un dedalo di vicoli dove si vendono spezie, lampade, argento e caffè.",
            "Tutt'intorno si estende il Cairo islamico storico, un quartiere di moschee e madrase iscritto al Patrimonio dell'Umanità dell'UNESCO, che diede alla città il suo vecchio soprannome: la Città dei Mille Minareti.",
          ],
        },
        {
          image: "cairo-nile-night",
          eyebrow: "Il fiume",
          heading: "Il Nilo attraverso la capitale",
          body: [
            "Il Nilo attraversa il Cairo da parte a parte, ampio e animato, e si divide attorno alla verdeggiante isola di Zamalek.",
            "Una veleggiata in feluca al tramonto o una crociera con cena è il modo più sereno di vedere la città, con le luci di circa venti milioni di persone lungo entrambe le rive.",
          ],
        },
      ],
    },
    whenToGo: {
      head: { eyebrow: "Pianifichi la visita", heading: "Il periodo migliore per visitare il Cairo" },
      body: [
        "Il Cairo dà il meglio di sé da ottobre ad aprile, quando le giornate calde e asciutte rendono confortevoli le lunghe ore alle piramidi e nella città vecchia.",
        "L'estate, da giugno ad agosto, è calda e velata di foschia, ma perfettamente affrontabile con partenze mattutine e pause a mezzogiorno. La primavera e l'autunno portano il clima più piacevole e i cieli più limpidi.",
      ],
    },
    gettingThere: {
      head: { eyebrow: "Come spostarsi", heading: "Come arrivare al Cairo" },
      body: [
        "L'Aeroporto Internazionale del Cairo è la principale porta d'accesso dell'Egitto, con voli diretti da tutta Europa, dal Golfo, dall'Africa e oltre.",
        "La città è inoltre il fulcro della rete ferroviaria egizia: treni notturni e diurni scendono a sud verso Luxor e Assuan, e servizi veloci salgono a nord verso Alessandria.",
      ],
    },
    gallery: { eyebrow: "Galleria", heading: "Il Cairo in fotografia" },
    faqs: [
      {
        q: "Quanti giorni servono al Cairo?",
        a: "Due o tre giornate intere coprono l'essenziale: un giorno per le Piramidi di Giza e il Grande Museo Egizio, e uno o due giorni per il Cairo islamico e copto, la Cittadella e il bazar.",
      },
      {
        q: "Il Grande Museo Egizio è aperto?",
        a: "Sì. Il Grande Museo Egizio di Giza ha aperto completamente il 1º novembre 2025 ed espone la collezione completa di Tutankhamon accanto a migliaia di altri reperti.",
      },
      {
        q: "Si possono vedere le Piramidi in un'escursione giornaliera?",
        a: "Con facilità. L'altopiano di Giza rientra nell'area metropolitana del Cairo, così le piramidi e la Sfinge distano una breve corsa in auto dal centro e di solito si abbinano al Grande Museo Egizio.",
      },
      {
        q: "Qual è il periodo migliore per visitare il Cairo?",
        a: "Da ottobre ad aprile si gode del clima più confortevole per le visite. L'estate è calda ma gestibile con partenze mattutine e pause a mezzogiorno.",
      },
    ],
    creditsSummary: "Crediti e licenze delle immagini",
    nearby: ["luxor", "alexandria", "aswan"],
  },
  luxor: {
    seo: {
      title: "Tour ed escursioni giornaliere a Luxor | Prenoti escursioni",
      description:
        "Tour ed escursioni giornaliere a Luxor: Karnak, la Valle dei Re, il Tempio di Hatshepsut e voli in mongolfiera all'alba sul Nilo. Con egittologi qualificati.",
      keywords: [
        "tour di Luxor",
        "escursioni giornaliere a Luxor",
        "tour della Valle dei Re",
        "Tempio di Karnak",
        "cosa fare a Luxor",
        "escursioni a Luxor",
      ],
    },
    heroSlug: "karnak-temple",
    heroEyebrow: "Alto Egitto · L'antica Tebe",
    h1: "Tour ed escursioni giornaliere a Luxor",
    lede: "Il più grande museo a cielo aperto del mondo, sorto sul sito dell'antica Tebe.",
    overview: [
      "I tour di Luxor La conducono nel cuore dell'antica Tebe, la capitale egizia del Nuovo Regno. Spesso definita il più grande museo a cielo aperto del mondo, Luxor racchiude una densità di monumenti senza pari: il vasto complesso templare di Karnak, il Tempio di Luxor nel centro cittadino e, sull'altra sponda del Nilo, le tombe reali della Valle dei Re.",
      "Il fiume divide la città in due: la vivace sponda orientale, con i suoi templi e i suoi mercati, e la sponda occidentale di tombe e templi funerari dove gli antichi egizi seppellivano i loro re. Una sola giornata può abbinare Karnak alla Valle dei Re, e non c'è alba più bella di quella che si ammira da una mongolfiera che sorvola l'intera piana tebana.",
    ],
    facts: [
      { icon: "globe", value: "Alto Egitto", label: "sul Nilo, l'antica Tebe" },
      { icon: "star", value: "Valle dei Re", label: "tombe reali del Nuovo Regno" },
      { icon: "calendar", value: "Nov – Feb", label: "i mesi più freschi per le visite" },
      { icon: "travel", value: "~1 h di volo", label: "a sud del Cairo" },
    ],
    highlights: {
      head: {
        eyebrow: "Attrazioni principali",
        heading: "Cosa fare a Luxor",
        intro:
          "Templi, tombe reali e il Nilo: Luxor concentra in un breve soggiorno più Egitto antico di qualsiasi altro luogo del Paese.",
      },
      items: [
        {
          rank: 1,
          name: "Tempio di Karnak",
          body: "Una città di templi ampliata nell'arco di oltre mille anni; la sua Grande Sala Ipostila riunisce 134 colonne giganti in una foresta di pietra.",
        },
        {
          rank: 2,
          name: "Valle dei Re",
          body: "Le tombe reali scavate nella roccia del Nuovo Regno, tra cui quella di Tutankhamon, la cui mummia riposa ancora qui.",
        },
        {
          rank: 3,
          name: "Tempio di Luxor",
          body: "Nel cuore della città moderna, un tempo collegato a Karnak da un viale di sfingi e splendidamente illuminato dopo il tramonto.",
        },
        {
          rank: 4,
          name: "Tempio di Hatshepsut",
          body: "Il tempio funerario colonnato della più celebre faraona d'Egitto, addossato alle rupi della sponda occidentale a Deir el-Bahari.",
        },
        {
          rank: 5,
          name: "Medinet Habu",
          body: "Il grande tempio funerario di Ramses III, celebre per i suoi rilievi scolpiti, vividi e straordinariamente ben conservati.",
        },
        {
          rank: 6,
          name: "Un volo in mongolfiera all'alba",
          body: "L'esperienza classica di Luxor: fluttuare sui templi, sulle tombe e sulle verdi rive del fiume mentre sorge il sole.",
        },
      ],
    },
    features: {
      head: {
        eyebrow: "Esplora la città",
        heading: "Ciò che rende Luxor imperdibile",
        intro:
          "Il Nilo divide Luxor tra i templi della vivace sponda orientale e le tombe di quella occidentale. Entrambe meritano un posto in qualsiasi itinerario.",
      },
      rows: [
        {
          image: "valley-of-kings",
          eyebrow: "Sponda occidentale",
          heading: "La Valle dei Re",
          body: [
            "Nascoste in una valle desertica dietro le rupi, oltre sessanta tombe reali furono scavate in profondità nella roccia e dipinte con testi che guidavano i faraoni nell'aldilà.",
            "Qui si trova la tomba di Tutankhamon, e la sua mummia giace ancora al suo interno; gran parte del suo tesoro è stata trasferita al Grande Museo Egizio, vicino al Cairo.",
          ],
        },
        {
          image: "hatshepsut-temple",
          eyebrow: "Templi funerari",
          heading: "Templi contro le rupi",
          body: [
            "Il tempio a terrazze di Hatshepsut si erge direttamente dalla roccia a Deir el-Bahari, uno degli edifici più suggestivi d'Egitto.",
            "Poco distanti sorgono Medinet Habu e i Colossi di Memnone, due colossali statue sedute che vegliano sulla piana da oltre tremila anni.",
          ],
        },
        {
          image: "luxor-nile-sunset",
          eyebrow: "Il fiume",
          heading: "Il Nilo a Luxor",
          body: [
            "Una feluca o un motoscafo collega le due sponde, e il tramonto sull'acqua è un rito a Luxor.",
            "Molti viaggiatori arrivano o partono con una crociera sul Nilo verso Assuan, trasformando il tragitto tra i monumenti in parte del viaggio.",
          ],
        },
      ],
    },
    whenToGo: {
      head: { eyebrow: "Pianifichi la visita", heading: "Il periodo migliore per visitare Luxor" },
      body: [
        "Luxor si trova nell'Alto Egitto, dove le estati sono davvero torride: le temperature superano regolarmente i 40 °C da giugno ad agosto.",
        "La finestra ideale va da novembre a febbraio, con giornate calde e asciutte, perfette per lunghe ore tra i templi. In qualunque periodo venga, parta presto e riposi durante la calura di mezzogiorno.",
      ],
    },
    gettingThere: {
      head: { eyebrow: "Come spostarsi", heading: "Come arrivare a Luxor" },
      body: [
        "Luxor sorge sul Nilo a circa 670 km a sud del Cairo: circa un'ora di volo nazionale, oppure un treno notturno con cuccette.",
        "L'Aeroporto Internazionale di Luxor gestisce voli nazionali e internazionali stagionali, e molti visitatori arrivano con una crociera sul Nilo da Assuan, a circa 220 km più a sud.",
      ],
    },
    gallery: { eyebrow: "Galleria", heading: "Luxor in fotografia" },
    faqs: [
      {
        q: "Quanti giorni servono a Luxor?",
        a: "Due giorni consentono di coprire la sponda orientale (Karnak e il Tempio di Luxor) e quella occidentale (Valle dei Re, Hatshepsut e Medinet Habu) senza fretta. Una giornata molto intensa è possibile se il tempo è poco.",
      },
      {
        q: "La tomba di Tutankhamon è ancora nella Valle dei Re?",
        a: "Sì. La mummia di Tutankhamon rimane nella sua tomba (KV62), nella Valle dei Re. Gran parte del suo tesoro è ora esposta al Grande Museo Egizio, vicino al Cairo.",
      },
      {
        q: "Si può visitare Luxor in giornata da Hurghada?",
        a: "Sì. Luxor è una popolare escursione di un'intera giornata da Hurghada, sul Mar Rosso, di norma alcune ore di strada per ciascun tragitto, per vedere Karnak e la Valle dei Re.",
      },
      {
        q: "Qual è il periodo migliore per visitare Luxor?",
        a: "Da novembre a febbraio, per il clima più fresco e confortevole per le visite. L'estate è molto calda ma più tranquilla, e si affronta meglio con partenze mattutine.",
      },
    ],
    creditsSummary: "Crediti e licenze delle immagini",
    nearby: ["aswan", "cairo", "hurghada"],
  },
  aswan: {
    seo: {
      title: "Tour ed escursioni giornaliere ad Assuan | Abu Simbel e il Nilo",
      description:
        "Tour ed escursioni giornaliere ad Assuan: i templi di File e Abu Simbel, feluche sul Nilo, villaggi nubiani e la Grande Diga. La serena città del sud dell'Egitto.",
      keywords: [
        "tour di Assuan",
        "escursioni giornaliere ad Assuan",
        "tour di Abu Simbel",
        "Tempio di File",
        "feluca ad Assuan",
        "cosa fare ad Assuan",
      ],
    },
    heroSlug: "aswan-nile-r01",
    heroEyebrow: "Alto Egitto · Il Nilo nubiano",
    h1: "Tour ed escursioni giornaliere ad Assuan",
    lede: "La tranquilla frontiera meridionale dell'Egitto, dove il Nilo raggiunge la sua massima bellezza.",
    overview: [
      "I tour di Assuan esplorano la placida città del sud dell'Egitto, adagiata là dove il Nilo è più scenografico: isole, massi di granito e deserto dorato che scendono fino all'acqua di un azzurro brillante. È la più rilassata delle città del Nilo e la porta della Nubia, con una cultura, una cucina e una musica tutte sue.",
      "Da Assuan può navigare fino al Tempio di File, sulla sua isola, fare un giro in feluca attorno all'isola Elefantina e all'isola Kitchener, e intraprendere il viaggio verso sud fino ai colossali templi rupestri di Abu Simbel. La Grande Diga e l'Obelisco Incompiuto raccontano la storia più recente di una città plasmata dal fiume che domina.",
    ],
    facts: [
      { icon: "globe", value: "Nubia", label: "l'estremo sud dell'Egitto" },
      { icon: "star", value: "Abu Simbel", label: "i templi rupestri di Ramses II" },
      { icon: "calendar", value: "Nov – Feb", label: "clima fresco e limpido per le visite" },
      { icon: "travel", value: "~1 h di volo", label: "a sud del Cairo" },
    ],
    highlights: {
      head: {
        eyebrow: "Attrazioni principali",
        heading: "Cosa fare ad Assuan",
        intro:
          "Templi su isole, barche a vela e la strada per Abu Simbel: Assuan ricompensa un ritmo più lento di qualsiasi altro punto del Nilo.",
      },
      items: [
        {
          rank: 1,
          name: "Abu Simbel",
          body: "I colossali templi rupestri di Ramses II, a circa 280 km a sud di Assuan, spostati blocco per blocco per sottrarli alle acque crescenti del lago Nasser.",
        },
        {
          rank: 2,
          name: "Tempio di File",
          body: "Il grazioso tempio della dea Iside, ricollocato sull'isola di Agilkia durante la campagna della Grande Diga e raggiungibile in barca.",
        },
        {
          rank: 3,
          name: "Una feluca sul Nilo",
          body: "La barca a vela tradizionale del fiume; un pomeriggio attorno all'isola Elefantina e all'isola Kitchener è l'esperienza classica di Assuan.",
        },
        {
          rank: 4,
          name: "Un villaggio nubiano",
          body: "Case rivierasche dai colori vivaci, cucina nubiana e calda ospitalità, di solito raggiunte in barca attraverso il Nilo.",
        },
        {
          rank: 5,
          name: "La Grande Diga di Assuan",
          body: "La diga degli anni Sessanta che creò il lago Nasser, pose fine alla piena annuale del Nilo e trasformò l'Egitto moderno.",
        },
        {
          rank: 6,
          name: "L'Obelisco Incompiuto",
          body: "Abbandonato nella sua antica cava di granito, rivela con esattezza come gli egizi tagliavano i loro giganteschi monumenti.",
        },
      ],
    },
    features: {
      head: {
        eyebrow: "Esplora la città",
        heading: "Ciò che rende Assuan imperdibile",
        intro:
          "Questo è il Nilo nella sua massima bellezza, e la soglia della Nubia e dell'estremo sud dell'Egitto antico.",
      },
      rows: [
        {
          image: "philae-temple",
          eyebrow: "Tempio su un'isola",
          heading: "File, tempio di Iside",
          body: [
            "Quando la Grande Diga minacciò di sommergerlo, l'intero tempio di File fu smontato e ricostruito pietra per pietra su un terreno più elevato, sull'isola di Agilkia.",
            "Raggiungibile con un breve tragitto in barca, offre una delle cornici più incantevoli di qualsiasi tempio d'Egitto, soprattutto nella luce tenue del primo mattino.",
          ],
        },
        {
          image: "felucca-aswan",
          eyebrow: "A vela",
          heading: "Feluche e isole",
          body: [
            "Nulla racchiude l'essenza di Assuan come un pomeriggio sotto la vela bianca di una feluca, bordeggiando tra isole di granito mentre il sole cala.",
            "Qui il fiume avvolge l'isola Elefantina e i giardini botanici dell'isola Kitchener, entrambi facili da inserire in una veleggiata.",
          ],
        },
        {
          image: "aswan-high-dam",
          eyebrow: "Il Nilo moderno",
          heading: "La Grande Diga e il lago Nasser",
          body: [
            "Completata nel 1970, la Grande Diga di Assuan domò le piene del Nilo e creò il lago Nasser, uno dei più grandi bacini artificiali del mondo.",
            "Il progetto trasformò l'Egitto, e impose l'epico salvataggio di Abu Simbel e File dalle acque crescenti.",
          ],
        },
      ],
    },
    whenToGo: {
      head: { eyebrow: "Pianifichi la visita", heading: "Il periodo migliore per visitare Assuan" },
      body: [
        "Essendo la più meridionale delle principali città egizie, Assuan è calda per gran parte dell'anno e rovente in piena estate. Da novembre a febbraio porta giornate calde e notti fresche e limpide: ideale per i templi e per il tempo lungo il fiume.",
        "Il Festival del Sole di Abu Simbel, quando la luce raggiunge il santuario interno, cade il 22 febbraio e il 22 ottobre e richiama grandi folle.",
      ],
    },
    gettingThere: {
      head: { eyebrow: "Come spostarsi", heading: "Come arrivare ad Assuan" },
      body: [
        "Assuan sorge sul Nilo, nell'estremo sud dell'Egitto, a circa un'ora di volo dal Cairo o con un treno notturno.",
        "Abu Simbel si trova circa 280 km più a sud, e si raggiunge su strada o con un breve volo nazionale. Molti visitatori arrivano o partono con una crociera sul Nilo tra Assuan e Luxor.",
      ],
    },
    gallery: { eyebrow: "Galleria", heading: "Assuan in fotografia" },
    faqs: [
      {
        q: "Vale la pena l'escursione ad Abu Simbel da Assuan?",
        a: "Per la maggior parte dei viaggiatori, sì. I due templi rupestri di Ramses II sono tra i monumenti più spettacolari d'Egitto. Il tragitto è di circa 280 km per ciascun senso su strada, oppure un breve volo nazionale.",
      },
      {
        q: "Che cos'è un giro in feluca ad Assuan?",
        a: "La feluca è una tradizionale barca a vela di legno. Una tranquilla veleggiata attorno all'isola Elefantina e all'isola Kitchener, soprattutto al tramonto, è l'esperienza distintiva di Assuan.",
      },
      {
        q: "Quanti giorni servono ad Assuan?",
        a: "Uno o due giorni coprono File, una veleggiata in feluca e un villaggio nubiano; aggiunga un giorno se desidera fare l'escursione verso sud fino ad Abu Simbel.",
      },
      {
        q: "Qual è il periodo migliore per visitare Assuan?",
        a: "Da novembre a febbraio, per il clima più fresco. Le estati sono molto calde, perciò le partenze mattutine sono indispensabili se viaggia in quel periodo.",
      },
    ],
    creditsSummary: "Crediti e licenze delle immagini",
    nearby: ["luxor", "cairo", "hurghada"],
  },
  alexandria: {
    seo: {
      title: "Tour ed escursioni giornaliere ad Alessandria dal Cairo",
      description:
        "Tour ed escursioni giornaliere ad Alessandria: la Cittadella di Qaitbay, la Bibliotheca Alexandrina, le catacombe romane e il lungomare mediterraneo.",
      keywords: [
        "tour di Alessandria",
        "escursioni giornaliere ad Alessandria",
        "escursione giornaliera ad Alessandria dal Cairo",
        "Bibliotheca Alexandrina",
        "Cittadella di Qaitbay",
        "cosa fare ad Alessandria",
      ],
    },
    heroSlug: "citadel-of-qaitbay-alexandria-egypt",
    heroEyebrow: "Egitto · La costa mediterranea",
    h1: "Tour ed escursioni giornaliere ad Alessandria",
    lede: "La leggendaria città di mare dell'Egitto, fondata da Alessandro Magno.",
    overview: [
      "I tour di Alessandria ripercorrono la città mediterranea che Alessandro Magno fondò nel 331 a.C. Per secoli fu una delle grandi città del mondo antico, patria della favolosa Biblioteca e del faro di Faro, una delle Sette Meraviglie. Oggi è la seconda città dell'Egitto, distesa lungo un curvo lungomare con un carattere tutto suo.",
      "La maggior parte dei visitatori arriva dal Cairo, a circa tre ore su strada o in treno ad alta velocità, il che rende Alessandria una popolare meta giornaliera. La Cittadella di Qaitbay sorge sul sito dell'antico faro, e la moderna Bibliotheca Alexandrina fa rivivere il ricordo della Biblioteca perduta, accanto alle catacombe romane, alla Colonna di Pompeo e al celebre pesce fresco sul mare.",
    ],
    facts: [
      { icon: "globe", value: "Mediterraneo", label: "la seconda città dell'Egitto" },
      { icon: "star", value: "Cittadella di Qaitbay", label: "sul sito del faro di Faro" },
      { icon: "calendar", value: "Primavera e autunno", label: "clima costiero mite" },
      { icon: "travel", value: "~3 h", label: "su strada o in treno dal Cairo" },
    ],
    highlights: {
      head: {
        eyebrow: "Attrazioni principali",
        heading: "Cosa fare ad Alessandria",
        intro:
          "L'Egitto greco, romano e moderno stratificato lungo un unico lungomare mediterraneo, il tutto a comoda distanza di una giornata dal Cairo.",
      },
      items: [
        {
          rank: 1,
          name: "Cittadella di Qaitbay",
          body: "Una fortezza del XV secolo a guardia del porto, edificata proprio sul sito dell'antico faro di Faro.",
        },
        {
          rank: 2,
          name: "Bibliotheca Alexandrina",
          body: "Una suggestiva biblioteca e centro culturale moderno che fa rivivere l'eredità dell'antica Biblioteca di Alessandria.",
        },
        {
          rank: 3,
          name: "Catacombe di Kom el-Shoqafa",
          body: "Una necropoli di epoca romana su più livelli che fonde arte egizia, greca e romana, riscoperta per caso nel 1900.",
        },
        {
          rank: 4,
          name: "La Colonna di Pompeo",
          body: "Un'imponente colonna trionfale romana accanto alle rovine del tempio del Serapeo.",
        },
        {
          rank: 5,
          name: "Il lungomare e Montaza",
          body: "La lunga passeggiata sul mare, che termina a est nei giardini reali e nel palazzo di Montaza.",
        },
        {
          rank: 6,
          name: "Pesce fresco sul mare",
          body: "Alessandria è celebre in tutto l'Egitto per il pesce mediterraneo fresco, gustato proprio in riva all'acqua.",
        },
      ],
    },
    features: {
      head: {
        eyebrow: "Esplora la città",
        heading: "Ciò che rende Alessandria imperdibile",
        intro:
          "Una capitale mediterranea della memoria, dove i fantasmi del mondo antico incontrano un vivace lungomare moderno.",
      },
      rows: [
        {
          image: "citadel-of-qaitbay-014",
          eyebrow: "Il porto",
          heading: "La Cittadella di Qaitbay",
          body: [
            "La fortezza di Qaitbay sorveglia l'ingresso del porto orientale, con le sue pallide mura che si ergono direttamente dal mare.",
            "Si erge nel punto esatto in cui il faro di Faro —una delle Sette Meraviglie del mondo antico— un tempo segnalava alle navi la vicinanza della costa.",
          ],
        },
        {
          image: "alexandria-egypt-235108463",
          eyebrow: "La città sul mare",
          heading: "Una capitale della memoria in riva al mare",
          body: [
            "Alessandria si curva per chilometri lungo un ventoso lungomare, con i suoi caffè e le sue ville sbiadite affacciati sul Mediterraneo.",
            "La moderna Bibliotheca Alexandrina, le catacombe romane e la Colonna di Pompeo mantengono a fior di pelle il passato greco e romano della città.",
          ],
        },
      ],
    },
    whenToGo: {
      head: { eyebrow: "Pianifichi la visita", heading: "Il periodo migliore per visitare Alessandria" },
      body: [
        "Grazie alla sua posizione mediterranea, Alessandria è più mite del resto dell'Egitto: gradevole in primavera e in autunno, calda ma rinfrescata dal mare in estate, e fresca e a tratti piovosa in inverno.",
        "La primavera (da marzo a maggio) e l'autunno (da settembre a novembre) sono i periodi più confortevoli per passeggiare sul lungomare ed esplorare i siti.",
      ],
    },
    gettingThere: {
      head: { eyebrow: "Come spostarsi", heading: "Come arrivare ad Alessandria" },
      body: [
        "Alessandria dista circa tre ore dal Cairo su strada o in treno ad alta velocità (all'incirca 220 km a nord-ovest), il che ne fa una popolare meta di una giornata o di una notte dalla capitale.",
        "L'aeroporto di Borg El Arab, a ovest della città, gestisce un numero crescente di voli internazionali per chi si dirige direttamente sulla costa.",
      ],
    },
    gallery: { eyebrow: "Galleria", heading: "Alessandria in fotografia" },
    faqs: [
      {
        q: "Si può visitare Alessandria in giornata dal Cairo?",
        a: "Sì, è una delle escursioni giornaliere più popolari d'Egitto. Alessandria dista circa tre ore dal Cairo su strada o in treno ad alta velocità, il che lascia un'intera giornata per la Cittadella, la biblioteca e le catacombe.",
      },
      {
        q: "Per che cosa è nota Alessandria?",
        a: "Fondata da Alessandro Magno, fu patria dell'antica Biblioteca e del faro di Faro. Oggi è nota per il suo lungomare mediterraneo, i suoi siti greco-romani e il suo pesce fresco.",
      },
      {
        q: "Quanti giorni servono ad Alessandria?",
        a: "Un'unica giornata intera copre i punti salienti. Un pernottamento consente di godersi il lungomare e il pesce a un ritmo più lento.",
      },
      {
        q: "Qual è il periodo migliore per visitare Alessandria?",
        a: "La primavera e l'autunno sono ideali. L'estate è affollata e calda, ma temperata dal mare; l'inverno è fresco e può essere piovoso.",
      },
    ],
    creditsSummary: "Crediti e licenze delle immagini",
    nearby: ["cairo", "luxor", "aswan"],
  },
  hurghada: {
    seo: {
      title: "Escursioni e gite giornaliere a Hurghada | Mar Rosso",
      description:
        "Escursioni e gite giornaliere a Hurghada: snorkeling e immersioni sui reef del Mar Rosso, gite in barca all'isola di Giftun, safari nel deserto e gite a Luxor.",
      keywords: [
        "escursioni a Hurghada",
        "gite giornaliere a Hurghada",
        "snorkeling all'isola di Giftun",
        "immersioni nel Mar Rosso a Hurghada",
        "cosa fare a Hurghada",
        "gite in barca a Hurghada",
      ],
    },
    heroSlug: "giftun-eden-island",
    heroEyebrow: "Egitto · La Riviera del Mar Rosso",
    h1: "Escursioni e gite giornaliere a Hurghada",
    lede: "La località più vivace del Mar Rosso egiziano, e porta d'accesso ai reef di acque calde.",
    overview: [
      "Le escursioni a Hurghada ruotano interamente attorno al Mar Rosso. Cresciuta da piccolo villaggio di pescatori fino a diventare la località costiera più vivace dell'Egitto, Hurghada si affaccia su un lungo tratto di acqua calda e cristallina, con decine di reef e isole al largo a portata di mano. È la scelta classica per un primo viaggio al Mar Rosso, una vacanza al mare in famiglia o un'aggiunta di sole e mare dopo i templi.",
      "Le gite in barca salpano verso l'isola di Giftun e Orange Bay per lo snorkeling sui giardini di corallo, mentre i sub esplorano reef e relitti lungo tutta la costa. Nell'entroterra, i safari nel deserto in quad o fuoristrada raggiungono accampamenti beduini sotto le stelle, e le gite giornaliere si spingono a ovest fino ai templi di Luxor.",
    ],
    facts: [
      { icon: "globe", value: "Costa del Mar Rosso", label: "l'Egitto continentale" },
      { icon: "star", value: "Isola di Giftun", label: "reef e baie di sabbia bianca" },
      { icon: "weather", value: "Sole tutto l'anno", label: "mare caldo e sole" },
      { icon: "travel", value: "Charter diretti", label: "e ~1 h di volo dal Cairo" },
    ],
    highlights: {
      head: {
        eyebrow: "Attrazioni principali",
        heading: "Cosa fare a Hurghada",
        intro:
          "Reef, isole e deserto: Hurghada è fatta per il tempo sopra e sotto l'acqua, con i templi di Luxor raggiungibili in giornata.",
      },
      items: [
        {
          rank: 1,
          name: "Isola di Giftun e Orange Bay",
          body: "La gita in barca più popolare da Hurghada: baie di sabbia bianca e reef poco profondi, ideali per lo snorkeling.",
        },
        {
          rank: 2,
          name: "Snorkeling e immersioni sui reef",
          body: "L'acqua calda e cristallina e i reef ricchi di corallo e pesci fanno di questa una delle mete di immersione preferite al mondo.",
        },
        {
          rank: 3,
          name: "Una gita in barca nel Mar Rosso",
          body: "Le crociere di mezza giornata e di un'intera giornata combinano soste per lo snorkeling, bagni e pranzo in acqua.",
        },
        {
          rank: 4,
          name: "Safari nel deserto",
          body: "Quad, fuoristrada e cammelli si addentrano nel Deserto Orientale fino agli accampamenti beduini per il tramonto e la cena.",
        },
        {
          rank: 5,
          name: "La marina e il centro storico di El Dahar",
          body: "La passeggiata sul mare per cenare e uscire la sera, e i mercati e i caffè del quartiere più antico.",
        },
        {
          rank: 6,
          name: "Gita giornaliera a Luxor",
          body: "Una giornata lunga ma appagante nell'entroterra, verso i templi e le tombe dell'antica Tebe.",
        },
      ],
    },
    features: {
      head: {
        eyebrow: "Esplora la costa",
        heading: "Ciò che rende Hurghada imperdibile",
        intro:
          "Un'intera costa di reef e isole, con i siti antichi della Valle del Nilo a comoda distanza di una giornata.",
      },
      rows: [
        {
          image: "giftun-island-egypte-panoramio",
          eyebrow: "Le isole",
          heading: "L'isola di Giftun e i reef",
          body: [
            "Le isole al largo di Hurghada sono cinte da reef corallini poco profondi e da candidi banchi di sabbia: il Mar Rosso nella sua versione più da cartolina.",
            "Orange Bay, su Giftun, è la tappa di punta, con acqua calda e calma adatta tanto a chi fa snorkeling per la prima volta quanto ai sub esperti.",
          ],
        },
        {
          image: "egypt-hurghada-from-plane01",
          eyebrow: "La Riviera del Mar Rosso",
          heading: "Costa di resort e limite del deserto",
          body: [
            "Hurghada si estende per chilometri lungo la riva, una fascia di resort e marine alle spalle della quale si apre il Deserto Orientale.",
            "Questo mix Le consente di fare snorkeling al mattino, percorrere le dune in quad al tramonto e riuscire comunque a inserire una gita giornaliera ai templi di Luxor.",
          ],
        },
      ],
    },
    whenToGo: {
      head: {
        eyebrow: "Pianifichi la visita",
        heading: "Il periodo migliore per visitare Hurghada",
      },
      body: [
        "La costa del Mar Rosso è una meta per tutto l'anno: calda e balneabile in ogni stagione. La primavera e l'autunno sono splendidi, e la temperatura dell'acqua resta gradevole tutto l'anno.",
        "L'estate è calda ma temperata dalle brezze marine e perfetta per il tempo in acqua, mentre l'inverno resta mite e soleggiato di giorno, più fresco dopo il tramonto.",
      ],
    },
    gettingThere: {
      head: {
        eyebrow: "Come spostarsi",
        heading: "Come arrivare a Hurghada",
      },
      body: [
        "Hurghada sorge sulla costa del Mar Rosso, a circa un'ora di volo dal Cairo o circa quattro o cinque ore di auto.",
        "L'Aeroporto Internazionale di Hurghada riceve voli di linea e charter diretti da numerose città europee, il che ne fa uno dei luoghi d'Egitto più facili da raggiungere direttamente dall'estero.",
      ],
    },
    gallery: { eyebrow: "Galleria", heading: "Hurghada in fotografia" },
    faqs: [
      {
        q: "Qual è la migliore escursione a Hurghada?",
        a: "Una gita in barca all'isola di Giftun e a Orange Bay è la più popolare, poiché combina lo snorkeling sui reef corallini con il tempo su spiagge di sabbia bianca.",
      },
      {
        q: "Si può visitare Luxor da Hurghada?",
        a: "Sì. Luxor è una popolare escursione di un'intera giornata da Hurghada, di norma alcune ore di strada per ciascun tragitto, per vedere Karnak e la Valle dei Re.",
      },
      {
        q: "Hurghada è adatta allo snorkeling e alle immersioni?",
        a: "Moltissimo. I reef al largo sono caldi, cristallini e ricchi di corallo e pesci, adatti sia ai principianti sia ai sub esperti.",
      },
      {
        q: "Qual è il periodo migliore per visitare Hurghada?",
        a: "Qualsiasi periodo dell'anno. La primavera e l'autunno sono ideali; l'estate è calda ma ottima per l'acqua; l'inverno è mite e soleggiato.",
      },
    ],
    creditsSummary: "Crediti e licenze delle immagini",
    nearby: ["luxor", "cairo", "sharm-el-sheikh"],
  },
  "sharm-el-sheikh": {
    seo: {
      title: "Escursioni e gite giornaliere a Sharm el-Sheikh",
      description:
        "Escursioni e gite giornaliere a Sharm el-Sheikh: immersioni e snorkeling di livello mondiale a Ras Muhammad e Tiran, safari nel deserto e la gita al monastero di Santa Caterina.",
      keywords: [
        "escursioni a Sharm el-Sheikh",
        "gite giornaliere a Sharm el-Sheikh",
        "immersioni a Ras Muhammad",
        "snorkeling all'isola di Tiran",
        "cosa fare a Sharm el-Sheikh",
        "gita al monastero di Santa Caterina",
      ],
    },
    heroSlug: "ras-mohammed-panoramio",
    heroEyebrow: "Egitto · Sinai del Sud",
    h1: "Escursioni e gite giornaliere a Sharm el-Sheikh",
    lede: "Una località del Sinai del Sud cinta da alcune delle più belle barriere coralline del mondo.",
    overview: [
      "Le escursioni a Sharm el-Sheikh ruotano attorno agli straordinari reef del Sinai del Sud. All'estremità meridionale della penisola, la località si affaccia su acque che attirano sub e appassionati di snorkeling da tutto il mondo, e in nessun luogo più che nel Parco Nazionale di Ras Muhammad, il primo parco nazionale d'Egitto, dove ripide pareti di corallo sprofondano dritte nel blu.",
      "Oltre ai reef, Sharm è una base per il deserto e le montagne dell'entroterra sinaitico. Le gite in barca raggiungono l'isola di Tiran, e uno dei grandi viaggi via terra dell'Egitto sale al monastero di Santa Caterina e al monte Sinai. Naama Bay è il fulcro per la cena e le serate fuori.",
    ],
    facts: [
      { icon: "globe", value: "Sinai del Sud", label: "l'estremità della penisola" },
      { icon: "star", value: "Ras Muhammad", label: "il primo parco nazionale d'Egitto" },
      { icon: "weather", value: "Sole tutto l'anno", label: "acqua calda e cristallina del Mar Rosso" },
      { icon: "travel", value: "Voli diretti", label: "dall'Europa e dal Golfo" },
    ],
    highlights: {
      head: {
        eyebrow: "Attrazioni principali",
        heading: "Cosa fare a Sharm el-Sheikh",
        intro:
          "Alcune delle immersioni migliori del pianeta sono a portata di mano, con avventure nel deserto e in montagna a breve distanza nell'entroterra.",
      },
      items: [
        {
          rank: 1,
          name: "Parco Nazionale di Ras Muhammad",
          body: "Il primo parco nazionale d'Egitto, che protegge spettacolari pareti di corallo dove sub e appassionati di snorkeling incontrano nuvole di pesci.",
        },
        {
          rank: 2,
          name: "Immersioni e snorkeling",
          body: "Sharm è uno dei principali centri d'immersione al mondo, con facile accesso ai reef per i principianti e siti celebri per gli esperti.",
        },
        {
          rank: 3,
          name: "Isola di Tiran",
          body: "Una meta prediletta delle gite in barca, nello stretto tra il Sinai e l'Arabia, cinta da reef poco profondi e variopinti.",
        },
        {
          rank: 4,
          name: "Naama Bay",
          body: "Il vivace lungomare della località, con ristoranti, caffè e vita notturna.",
        },
        {
          rank: 5,
          name: "Monastero di Santa Caterina e monte Sinai",
          body: "Una gita via terra tra le montagne, verso un monastero del VI secolo e la vetta tradizionalmente legata a Mosè.",
        },
        {
          rank: 6,
          name: "Safari nel deserto",
          body: "Gite in quad, fuoristrada e cammello nel deserto del Sinai, che spesso si concludono con una cena beduina sotto le stelle.",
        },
      ],
    },
    features: {
      head: {
        eyebrow: "Esplora la costa",
        heading: "Ciò che rende Sharm el-Sheikh imperdibile",
        intro:
          "I reef sono la ragione per venire, ma i deserti e le montagne sacre del Sinai danno a Sharm una seconda dimensione.",
      },
      rows: [
        {
          image: "ras-mohamed-national-park-panoramio",
          eyebrow: "Il parco nazionale",
          heading: "Le pareti di corallo di Ras Muhammad",
          body: [
            "All'estremità del Sinai, i reef di Ras Muhammad precipitano dalla superficie nell'acqua di un blu profondo, brulicante di pesci.",
            "Dichiarato primo parco nazionale d'Egitto nel 1983, resta uno dei sistemi di reef più belli e protetti del Mar Rosso.",
          ],
        },
        {
          image: "divemaster-ready-to-go",
          eyebrow: "Sotto la superficie",
          heading: "Una capitale mondiale delle immersioni",
          body: [
            "I centri d'immersione costeggiano la riva e propongono corsi per principianti assoluti e immersioni guidate ai siti più celebri per gli esperti.",
            "L'acqua calda e l'eccellente visibilità fanno di Sharm uno dei luoghi più facili al mondo per imparare a immergersi o semplicemente fare snorkeling su un reef.",
          ],
        },
        {
          image: "tiran-island-sharm-el-sheikh-south-sinai-egypt",
          eyebrow: "Gite in barca",
          heading: "L'isola di Tiran e lo stretto",
          body: [
            "I reef attorno a Tiran, nello stretto verso l'Arabia Saudita, sono una classica gita in barca di un giorno da Sharm.",
            "Giardini di corallo poco profondi e pareti a strapiombo si trovano vicini, così che chi fa snorkeling e chi si immerge condivide alcuni dei siti migliori.",
          ],
        },
      ],
    },
    whenToGo: {
      head: {
        eyebrow: "Pianifichi la visita",
        heading: "Il periodo migliore per visitare Sharm el-Sheikh",
      },
      body: [
        "Riparata sul Golfo di Aqaba, Sharm el-Sheikh gode di un clima caldo e secco quasi tutto l'anno. La primavera e l'autunno sono ideali per abbinare le immersioni alle gite nel deserto.",
        "L'estate è calda ma il mare resta invitante, e le giornate invernali sono piacevolmente miti, anche se le sere, e la gita in montagna a Santa Caterina, possono essere fredde.",
      ],
    },
    gettingThere: {
      head: {
        eyebrow: "Come spostarsi",
        heading: "Come arrivare a Sharm el-Sheikh",
      },
      body: [
        "Sharm el-Sheikh si trova all'estremità meridionale della penisola del Sinai. Il suo aeroporto internazionale riceve voli di linea e charter diretti da tutta Europa e dal Golfo, così molti visitatori arrivano direttamente dall'estero.",
        "Via terra è un viaggio lungo ma panoramico dal Cairo attraverso il Sinai, e voli interni la collegano alla capitale in circa un'ora.",
      ],
    },
    gallery: { eyebrow: "Galleria", heading: "Sharm el-Sheikh in fotografia" },
    faqs: [
      {
        q: "Per cosa è più famosa Sharm el-Sheikh?",
        a: "Per le immersioni e lo snorkeling di livello mondiale, soprattutto nel Parco Nazionale di Ras Muhammad, oltre al sole caldo tutto l'anno e ai comodi voli diretti dall'Europa.",
      },
      {
        q: "I principianti possono immergersi o fare snorkeling a Sharm?",
        a: "Sì. Molti reef sono poco profondi e vicini alla riva, ideali per chi fa snorkeling per la prima volta, mentre i centri d'immersione propongono corsi e immersioni guidate per tutti i livelli.",
      },
      {
        q: "Vale la pena la gita al monastero di Santa Caterina?",
        a: "Per molti visitatori sì. È una lunga giornata via terra, o un pernottamento per la salita al monte Sinai all'alba, tra le montagne, verso uno dei monasteri ancora attivi più antichi al mondo.",
      },
      {
        q: "Qual è il periodo migliore per visitare Sharm el-Sheikh?",
        a: "La primavera e l'autunno sono ideali. L'estate è calda ma perfetta per l'acqua, e l'inverno è mite di giorno ma più fresco di notte.",
      },
    ],
    creditsSummary: "Crediti e licenze delle immagini",
    nearby: ["cairo", "hurghada", "luxor"],
  },
};
