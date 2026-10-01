/**
 * Italian (it) editorial translation of `src/content/theme-content.ts`.
 * Staging only — mirrors the English module's shape 1:1 with translated
 * string values. Register: Lei (courtesy) for direct address, impersonal
 * editorial voice for narration — consistent with the shipped it.ts.
 * Do NOT wire into src/ until the dev phase.
 */
import type {
  galleryLabels,
  themeContent,
  whenToVisitContent,
} from "@/content/theme-content";

export const galleryLabelsIt: typeof galleryLabels = {
  galleryAria: "Galleria fotografica",
  lightbox: {
    close: "Chiudi",
    prev: "Immagine precedente",
    next: "Immagine successiva",
    zoomIn: "Ingrandisci",
    zoomOut: "Riduci",
    counter: "{current} di {total}",
  },
};

export const themeContentIt: typeof themeContent = {
  heritage: {
    facts: [
      { icon: "star", value: "7", label: "siti del Patrimonio Mondiale dell'UNESCO" },
      { icon: "clock", value: "5000+ anni", label: "di civiltà documentata" },
      { icon: "calendar", value: "ca. 2560 a.C.", label: "costruzione della Grande Piramide di Giza" },
      { icon: "globe", value: "Giza → Abu Simbel", label: "monumenti lungo il Nilo" },
    ],
    timeline: {
      head: {
        eyebrow: "Una breve cronologia",
        heading: "Cinquemila anni, in ordine",
        intro:
          "La storia dell'Egitto è così lunga che perfino i faraoni studiavano antenati che per loro erano già antichi. Ecco la sua forma d'insieme: le date approssimative sono indicate con «ca.» (circa).",
      },
      entries: [
        { era: "Periodo Protodinastico", span: "ca. 3100–2686 a.C.", body: "L'Alto e il Basso Egitto si uniscono sotto i primi faraoni e la capitale si stabilisce a Menfi, vicino all'odierno Cairo." },
        { era: "Antico Regno", span: "ca. 2686–2181 a.C.", body: "L'era dei grandi costruttori di piramidi: la Piramide a gradoni di Djoser a Saqqara e le tre piramidi di Giza sorgono nell'arco degli stessi secoli." },
        { era: "Medio Regno", span: "ca. 2055–1650 a.C.", body: "Dopo un periodo di divisione, l'Egitto si riunifica. È ricordato come un'epoca classica di letteratura, scultura e saldo potere centrale." },
        { era: "Nuovo Regno", span: "ca. 1550–1069 a.C.", body: "L'Egitto al suo apice imperiale. Karnak e Luxor si ampliano fino a diventare vasti complessi templari e i faraoni vengono sepolti nella Valle dei Re, a Tebe." },
        { era: "Epoca Tarda", span: "ca. 664–332 a.C.", body: "Governano le ultime dinastie autoctone, con parentesi persiane, fino all'arrivo di Alessandro Magno." },
        { era: "Periodo Tolemaico (greco-romano)", span: "332–30 a.C.", body: "Alessandro fonda Alessandria; i Tolomei greci costruiscono templi come Philae e Kom Ombo. La dinastia si spegne con Cleopatra VII e l'arrivo di Roma." },
        { era: "L'Egitto copto e islamico", span: "dal I secolo d.C. ca.", body: "Il cristianesimo mette radici e lascia le chiese del Cairo copto; la conquista araba del 641 d.C. porta l'islam, e Il Cairo cresce fino a diventare una delle grandi città del mondo medievale." },
      ],
    },
    features: {
      head: {
        eyebrow: "I grandi monumenti",
        heading: "Quattro meraviglie, lette da un egittologo",
        intro:
          "Ogni viaggio dedicato al patrimonio di Ptah Tours è guidato da un egittologo abilitato, così le pareti smettono di essere decorazione e diventano frasi. Ecco i siti che ne sono il cuore.",
      },
      rows: [
        {
          image: "giza-pyramids",
          eyebrow: "Antico Regno",
          heading: "Le piramidi di Giza",
          body: [
            "Costruite intorno al 2560 a.C. come tombe reali, le tre piramidi di Giza sono l'unica delle sette meraviglie del mondo antico ancora in piedi. La Grande Piramide detenne il primato di struttura più alta mai eretta da mani umane per quasi quattromila anni.",
            "Accanto a esse veglia la Grande Sfinge: un corpo di leone con il volto di un faraone, scolpito in un'unica cresta di calcare al margine dell'altopiano desertico.",
          ],
        },
        {
          image: "karnak-temple",
          eyebrow: "Nuovo Regno",
          heading: "Karnak, il tempio che crebbe per secoli",
          body: [
            "Karnak non è un tempio, ma una città di templi, ampliata da faraone dopo faraone nell'arco di oltre mille anni. La sua Grande Sala Ipostila raccoglie 134 colonne gigantesche in una foresta di pietra così alta che il soffitto un tempo fluttuava molto al di sopra.",
            "Fu il luogo religioso più importante dell'Egitto, dedicato soprattutto al dio tebano Amon-Ra.",
          ],
        },
        {
          image: "luxor-temple",
          eyebrow: "Tebe",
          heading: "Luxor e la sponda occidentale tebana",
          body: [
            "L'antica Tebe è la moderna Luxor, così ricca di rovine da essere spesso definita il più grande museo a cielo aperto del mondo. Il tempio di Luxor sorge nel cuore della città e un tempo era collegato a Karnak da un viale di sfingi.",
            "Sull'altra sponda del fiume si trovano i cimiteri reali —tra cui la Valle dei Re—, dove la tomba di Tutankhamon fu ritrovata quasi intatta nel 1922.",
          ],
        },
        {
          image: "abu-simbel",
          eyebrow: "Nubia",
          heading: "Abu Simbel e il salvataggio di un tempio",
          body: [
            "Ramses II fece scavare due templi direttamente in una rupe nubiana, custoditi da quattro colossi seduti alti oltre 20 metri. Due volte l'anno, il sole nascente attraversa l'ingresso per illuminare il santuario più interno.",
            "Quando negli anni Sessanta fu costruita la Grande Diga di Assuan, l'intero monumento fu tagliato in blocchi e sollevato su un terreno più alto in un'operazione di salvataggio dell'UNESCO —una delle più grandi mai intraprese— per sottrarlo alla risalita del lago.",
          ],
        },
      ],
    },
    places: {
      head: {
        eyebrow: "Altro da vedere",
        heading: "Templi, tombe e due Cairo",
        intro:
          "Oltre ai siti più celebri, l'itinerario del patrimonio è costellato di luoghi che raccontano, ciascuno, il proprio capitolo di storia.",
      },
      cards: [
        { image: "saqqara-step-pyramid", name: "Saqqara", body: "La Piramide a gradoni di Djoser, eretta ca. 2670 a.C., è il più antico grande monumento in pietra del mondo: il prototipo che ogni piramide successiva avrebbe perfezionato." },
        { image: "philae-temple", name: "Philae", body: "Un aggraziato tempio dedicato alla dea Iside, trasferito —isola compresa— su un terreno più alto durante la campagna della Grande Diga di Assuan perché non andasse perduto sott'acqua." },
        { image: "kom-ombo", name: "Kom Ombo", body: "Un raro tempio doppio in riva al Nilo, costruito in epoca greco-romana e condiviso in parti uguali dal dio coccodrillo Sobek e dal dio falco Horus." },
        { image: "coptic-cairo", name: "Il Cairo copto", body: "L'antico quartiere cristiano, con la Chiesa Sospesa e vie che la tradizione lega al passaggio della Sacra Famiglia in Egitto." },
        { image: "islamic-cairo", name: "Il Cairo islamico", body: "Una città medievale di minareti, moschee e il grande bazar di Khan el-Khalili, a sua volta Patrimonio Mondiale dell'UNESCO." },
      ],
    },
    gallery: { eyebrow: "Galleria", heading: "Il patrimonio in immagini" },
    creditsSummary: "Crediti e licenze delle immagini",
  },
  "the-nile": {
    facts: [
      { icon: "globe", value: "~6650 km", label: "uno dei fiumi più lunghi del mondo" },
      { icon: "travel", value: "Sud → Nord", label: "il Nilo scorre verso il mare" },
      { icon: "user", value: "~95%", label: "degli egiziani vive lungo le sue rive" },
      { icon: "star", value: "Luxor e Assuan", label: "le grandi città templari del fiume" },
    ],
    features: {
      head: {
        eyebrow: "Il fiume che fece l'Egitto",
        heading: "La vita lungo il Nilo",
        intro:
          "Gli antichi Greci chiamavano l'Egitto «il dono del Nilo». Per migliaia di anni la piena del fiume depositava il limo nero che nutriva l'intero Paese, e quasi tutti vivono ancora in vista dell'acqua.",
      },
      rows: [
        {
          image: "aswan-feluccas",
          eyebrow: "A vela",
          heading: "Navigare il Nilo in feluca",
          body: [
            "La feluca è la tradizionale barca a vela di legno del Nilo, dalla forma immutata da secoli. Intorno ad Assuan il fiume dà il meglio di sé —isole, affioramenti di granito e deserto che scende fino all'acqua— e un pomeriggio a vela è il modo più antico e sereno di vederlo.",
          ],
        },
        {
          image: "luxor-boats-on-nile",
          eyebrow: "L'antica Tebe",
          heading: "Luxor, una città sull'acqua",
          body: [
            "Luxor sorge sul sito dell'antica Tebe, capitale del Nuovo Regno. Il fiume la divide in due: la sponda orientale viva, con i suoi templi, e la sponda occidentale delle tombe reali, dove ogni sera si vedeva morire il sole. La vita del fiume continua a scorrere accanto a tutto questo per l'intera giornata.",
          ],
        },
        {
          image: "cairo-nile-skyline-sunset",
          eyebrow: "La capitale",
          heading: "Il Cairo, dove il fiume incontra la città",
          body: [
            "Quando raggiunge Il Cairo, il Nilo è ampio e brulicante, e si fa strada tra l'isola di Zamalek e uno skyline di circa venti milioni di persone. Poco più a nord si apre nel grande Delta e sfocia nel Mediterraneo.",
          ],
        },
        {
          image: "aswan-wide-nile",
          eyebrow: "Un fiume trasformato",
          heading: "La Grande Diga e la fine della piena",
          body: [
            "Per millenni il Nilo straripava ogni estate rinnovando i campi dell'Egitto. La Grande Diga di Assuan, completata nel 1970, pose fine per sempre a quella piena annuale: creò il lago Nasser, generò elettricità e regolò l'acqua, ma mutò anche un ritmo che aveva scandito il Paese fin dai tempi dei faraoni.",
          ],
        },
      ],
    },
    places: {
      head: {
        eyebrow: "Lungo le rive",
        heading: "Isole, città e la luce del fiume",
        intro:
          "Il piacere del Nilo sta tanto nel tragitto quanto nelle mete: i tratti di campi verdi, gli uccelli e il modo in cui la luce cambia sull'acqua dall'alba al tramonto.",
      },
      cards: [
        { image: "nile-riverbank-kom-ombo-edfu", name: "Tra i templi", body: "Il nastro verde di campi coltivati tra Kom Ombo ed Edfu, dove il deserto attende appena oltre l'ultimo campo irrigato." },
        { image: "elephantine-island", name: "L'isola di Elefantina", body: "Una delle isole fluviali abitate di Assuan, popolata fin dall'antichità, quando custodiva il confine meridionale dell'Egitto." },
        { image: "aswan-boat-egrets", name: "Fauna del fiume", body: "Aironi guardabuoi e una barca tradizionale nei pressi di Assuan: il Nilo è un filo di vita tanto per gli uccelli quanto per le persone." },
        { image: "cairo-nile-night", name: "Il Nilo dopo il tramonto", body: "Le luci della città lungo la passeggiata fluviale di Zamalek, al Cairo, dove il fiume non tace mai del tutto." },
        { image: "river-nile-near-aswan", name: "Il Nilo nubiano", body: "A sud di Assuan il paesaggio si fa nubiano: acqua luminosa, sabbia dorata e granito scuro." },
        { image: "nile-felucca-aswan", name: "Una barca e il vento", body: "Un'unica feluca che cattura la brezza: l'immagine più semplice e senza tempo del fiume." },
      ],
    },
    gallery: { eyebrow: "Galleria", heading: "Il Nilo in immagini" },
    creditsSummary: "Crediti e licenze delle immagini",
  },
  deserts: {
    facts: [
      { icon: "globe", value: "~95%", label: "dell'Egitto è deserto" },
      { icon: "star", value: "3 regioni", label: "Deserto Occidentale, Deserto Orientale e Sinai" },
      { icon: "info", value: "UNESCO 2005", label: "Wadi Al-Hitan, la Valle delle Balene" },
      { icon: "clock", value: "VI secolo", label: "Santa Caterina, un monastero vivo" },
    ],
    features: {
      head: {
        eyebrow: "L'Egitto oltre il fiume",
        heading: "Tre deserti, un Paese",
        intro:
          "Lasci la sottile valle verde e quasi tutto l'Egitto è deserto; ma qui «deserto» significa molte cose: distese di creta bianca, oasi fitte di palme, montagne dipinte e le vette sacre del Sinai.",
      },
      rows: [
        {
          image: "white-desert-alien-landscape",
          eyebrow: "Deserto Occidentale",
          heading: "Il Deserto Bianco",
          body: [
            "A poche ore dall'oasi di Bahariya, il suolo si trasforma in creta scolpita dal vento in forme di funghi, torri e strane sagome bianche che risplendono al crepuscolo e al chiaro di luna. Accamparsi qui, sotto alcuni dei cieli più bui dell'Egitto, è la classica notte di safari nel deserto.",
          ],
        },
        {
          image: "siwa-oracle-temple",
          eyebrow: "Deserto Occidentale",
          heading: "Siwa e l'Oracolo di Amon",
          body: [
            "La remota Siwa, vicino al confine con la Libia, conservò per secoli la propria lingua e le proprie usanze. Il suo antico Oracolo di Amon fu celebre in tutto il mondo classico: si narra che Alessandro Magno attraversò il deserto per consultarlo nel 331 a.C.",
          ],
        },
        {
          image: "saint-catherine-monastery",
          eyebrow: "Sinai",
          heading: "Il Monastero di Santa Caterina e il Monte Sinai",
          body: [
            "Ai piedi della montagna dove la tradizione colloca Mosè e il roveto ardente, Santa Caterina è un monastero in attività dal VI secolo, una delle comunità cristiane abitate senza interruzione più antiche della Terra. Molti viaggiatori salgono al buio la vetta che si erge alle sue spalle per raggiungerla all'alba.",
          ],
        },
        {
          image: "wadi-el-hitan-fennec",
          eyebrow: "Fauna",
          heading: "Vita nella sabbia",
          body: [
            "Il deserto è tutt'altro che vuoto. Volpi fennec, gazzelle e uccelli migratori lo attraversano, mentre Wadi Al-Hitan —la Valle delle Balene— custodisce gli scheletri fossili di balene antiche di un'epoca, milioni di anni fa, in cui questo deserto era un mare.",
          ],
        },
      ],
    },
    places: {
      head: {
        eyebrow: "Oasi e catene montuose",
        heading: "Dove la sabbia prende forma",
        intro:
          "Tra i grandi mari di sabbia si nascondono sorgenti, palmeti e montagne: i luoghi che fanno di un viaggio nel deserto egiziano qualcosa di più di un lungo orizzonte.",
      },
      cards: [
        { image: "bahariya-oasis", name: "Oasi di Bahariya", body: "Un centro verde, alimentato da sorgenti, nel Deserto Occidentale, e il consueto punto di partenza verso il Deserto Bianco e il Deserto Nero." },
        { image: "black-desert-panorama", name: "Il Deserto Nero", body: "Basse colline vulcaniche coronate di pietra scura danno a questo tratto vicino a Bahariya il suo nome e il suo colore cupo." },
        { image: "fayoum-desert", name: "Il Fayyum", body: "Una vasta depressione-oasi a sud-ovest del Cairo, orlata di deserto, laghi e dei fossili di balene di Wadi Al-Hitan." },
        { image: "sinai-canyon", name: "I canyon del Sinai", body: "Gole di arenaria colorata si snodano nell'entroterra del Sinai; il Canyon Colorato, vicino a Nuweiba, è il più noto." },
        { image: "nuweiba-desert-road", name: "Strade del deserto", body: "Lunghe autostrade vuote corrono tra la costa e l'entroterra, con montagne che sorvegliano la sabbia da ogni lato." },
      ],
    },
    gallery: { eyebrow: "Galleria", heading: "I deserti in immagini" },
    creditsSummary: "Crediti e licenze delle immagini",
  },
  "red-sea": {
    facts: [
      { icon: "star", value: "200+", label: "specie di corallo sulle barriere" },
      { icon: "info", value: "1983", label: "Ras Muhammad, il primo parco nazionale d'Egitto" },
      { icon: "weather", value: "Tutto l'anno", label: "acqua calda e sole" },
      { icon: "travel", value: "Sharm e Hurghada", label: "le principali porte d'accesso alla barriera" },
    ],
    features: {
      head: {
        eyebrow: "Acqua calda, muri di corallo",
        heading: "Uno dei grandi mari del mondo",
        intro:
          "Il Mar Rosso è celebre tra subacquei e appassionati di snorkeling per le sue acque calde e cristalline e per le barriere che precipitano a picco nel blu. Non serve immergersi per goderselo: gran parte del corallo migliore è appena a qualche metro sotto la superficie.",
      },
      rows: [
        {
          image: "coral-reef-public-domain",
          eyebrow: "La barriera",
          heading: "Un muro vivo di corallo",
          body: [
            "Le barriere dell'Egitto ospitano oltre 200 specie di corallo duro e molle e un abbagliante repertorio di pesci —pesci pagliaccio, pesci angelo, pesci pappagallo— e, di tanto in tanto, una tartaruga o uno squalo di barriera. Poiché l'acqua è calda e calma per gran parte dell'anno, la visibilità è di solito eccellente.",
          ],
        },
        {
          image: "sharm-coral",
          eyebrow: "Sinai meridionale",
          heading: "Ras Muhammad e Sharm El Sheikh",
          body: [
            "Alla punta estrema della penisola del Sinai, Ras Muhammad divenne nel 1983 il primo parco nazionale d'Egitto. I suoi ripidi muri di corallo e la vicina località di Sharm El Sheikh ne fanno uno dei tratti di barriera più celebri del pianeta.",
          ],
        },
        {
          image: "hurghada-coast",
          eyebrow: "La costa continentale",
          heading: "Hurghada, la barriera davanti a casa",
          body: [
            "Hurghada è cresciuta da piccolo villaggio di pescatori alla più vivace località del Mar Rosso, con facile accesso in barca a decine di barriere e isole al largo. È la scelta classica per un primo viaggio sul Mar Rosso o per aggiungere qualche giorno di mare dopo i templi.",
          ],
        },
        {
          image: "marsa-alam",
          eyebrow: "L'estremo sud",
          heading: "Marsa Alam e la costa più tranquilla",
          body: [
            "Più a sud, la costa si fa più selvaggia e meno urbanizzata. Marsa Alam è nota per i suoi dugonghi, i delfini e le lunghe barriere, ed è la porta d'accesso ad alcuni dei fondali più incontaminati d'Egitto.",
          ],
        },
      ],
    },
    places: {
      head: {
        eyebrow: "Costa e isole",
        heading: "Lungo la riva",
        intro:
          "Dalla quiete del villaggio di immersioni di Dahab alle spoglie isole desertiche, la costa del Mar Rosso ha più di un'anima.",
      },
      cards: [
        { image: "dahab-panorama", name: "Dahab e il Blue Hole", body: "Un tranquillo ex villaggio beduino sulla costa del Sinai, amato dagli apneisti e patria del celebre Blue Hole." },
        { image: "shadwan-island", name: "Isole del Mar Rosso", body: "Isole spoglie e sbiancate dal sole, come Shadwan, punteggiano il mare aperto, cinte da barriere e acque profonde." },
        { image: "nuweiba-red-sea-mountains", name: "Nuweiba", body: "Sul golfo di Aqaba, dove le montagne del Sinai precipitano quasi a picco verso un mare stretto e di un blu intenso." },
        { image: "red-sea-mountains", name: "Dove il deserto incontra il mare", body: "Le montagne del Mar Rosso si ergono appena nell'entroterra rispetto alla costa, a ricordare che qui barriera e deserto sono vicini." },
        { image: "coral-bay-sharm", name: "Coral Bay", body: "Una delle baie riparate intorno a Sharm El Sheikh, con lastroni di barriera accessibili direttamente dalla spiaggia." },
      ],
    },
    gallery: { eyebrow: "Galleria", heading: "Il Mar Rosso in immagini" },
    creditsSummary: "Crediti e licenze delle immagini",
  },
};

export const whenToVisitContentIt: typeof whenToVisitContent = {
  facts: [
    { icon: "weather", value: "ott – apr", label: "i mesi più freschi e piacevoli" },
    { icon: "calendar", value: "22 feb e 22 ott", label: "il Festival del Sole di Abu Simbel" },
    { icon: "travel", value: "Tutto l'anno", label: "la costa del Mar Rosso resta calda" },
    { icon: "info", value: "40°C+", label: "massime estive a Luxor e Assuan" },
  ],
  climate: {
    head: {
      eyebrow: "Mese per mese",
      heading: "Quando venire, e che cosa si prova",
      intro:
        "L'Egitto è una meta per tutto l'anno, ma l'esperienza cambia molto con la stagione. L'inverno è mite e affollato; la piena estate è molto calda nell'entroterra ma resta gradevole sulla costa. Le fasce qui sotto sono una guida generale al clima per le visite.",
    },
    months: [
      { month: "Gennaio", abbr: "Gen", band: "peak", note: "Giornate fresche e soleggiate e notti fredde: clima ideale per le visite, e la stagione più affollata." },
      { month: "Febbraio", abbr: "Feb", band: "peak", note: "Mite e limpido; il Festival del Sole di Abu Simbel cade il 22 febbraio." },
      { month: "Marzo", abbr: "Mar", band: "peak", note: "Caldo e piacevole, ancora comodo per lunghe giornate tra i templi prima del caldo estivo." },
      { month: "Aprile", abbr: "Apr", band: "good", note: "Caldo e splendido; un breve vento khamsin può sollevare polvere in qualche giornata isolata." },
      { month: "Maggio", abbr: "Mag", band: "good", note: "Caldo nell'entroterra ma eccellente sulla costa del Mar Rosso, con meno folla." },
      { month: "Giugno", abbr: "Giu", band: "hot", note: "Inizia la piena estate: molto caldo a Luxor e Assuan, da godersi meglio alle prime e alle ultime ore del giorno." },
      { month: "Luglio", abbr: "Lug", band: "hot", note: "Caldo massimo nell'entroterra; la costa e una crociera sul Nilo con aria condizionata sono le scelte comode." },
      { month: "Agosto", abbr: "Ago", band: "hot", note: "Ancora molto caldo nell'entroterra, con acque calde nel Mar Rosso." },
      { month: "Settembre", abbr: "Set", band: "good", note: "Il caldo intenso inizia ad attenuarsi: un buon mese di mezza stagione con meno visitatori." },
      { month: "Ottobre", abbr: "Ott", band: "peak", note: "Di nuovo confortevole ovunque; il secondo Festival del Sole di Abu Simbel cade il 22 ottobre." },
      { month: "Novembre", abbr: "Nov", band: "peak", note: "Giornate calde e serate fresche: uno dei mesi migliori in assoluto per viaggiare." },
      { month: "Dicembre", abbr: "Dic", band: "peak", note: "Fresco e soleggiato; affollato intorno alle festività di Natale e Capodanno." },
    ],
    legend: [
      { band: "peak", label: "Clima ideale per le visite" },
      { band: "good", label: "Buono: da caldo a molto caldo" },
      { band: "hot", label: "Molto caldo nell'entroterra" },
    ],
  },
  regions: {
    head: {
      eyebrow: "Dipende da dove va",
      heading: "Egitti diversi, stagioni diverse",
      intro:
        "Il momento migliore per viaggiare dipende anche da quale Egitto cerca: la valle del Nilo, la costa del Mar Rosso e il deserto profondo hanno ciascuno la propria finestra ideale.",
    },
    rows: [
      {
        image: "aswan-nile",
        eyebrow: "La valle del Nilo",
        heading: "Luxor, Assuan e i templi",
        body: [
          "Per i grandi monumenti, da ottobre ad aprile è ideale: giornate calde e asciutte che rendono un piacere le lunghe ore tra i templi. L'estate qui è davvero feroce, quindi pianifichi partenze all'alba e soste a metà giornata se viene tra giugno e agosto.",
        ],
      },
      {
        image: "red-sea-soma-bay",
        eyebrow: "La costa",
        heading: "Il Mar Rosso",
        body: [
          "La costa è l'eccezione al calendario: calda e balneabile quasi tutto l'anno. Primavera e autunno sono splendidi, e perfino la piena estate, insopportabile nell'entroterra, resta gradevole qui grazie alla brezza marina e all'acqua facile.",
        ],
      },
      {
        image: "white-desert-rock",
        eyebrow: "Il Sahara",
        heading: "Il Deserto Occidentale e le oasi",
        body: [
          "I safari nel deserto e le escursioni alle oasi danno il meglio da ottobre ad aprile, quando il caldo diurno è gestibile e le notti del deserto si fanno frizzanti e stellate. La piena estate nel deserto aperto è meglio evitarla.",
        ],
      },
    ],
  },
  gallery: {
    eyebrow: "Galleria",
    heading: "L'Egitto nel corso dell'anno",
  },
  creditsSummary: "Crediti e licenze delle immagini",
};

