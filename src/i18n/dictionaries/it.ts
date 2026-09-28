/**
 * Italian (it) chrome dictionary — UI chrome for Ptah Tours, machine-translated.
 * Mirrors en.ts exactly by key order and array index; only the string values
 * differ. See en.ts for the source shape, placeholders and translator notes.
 */
import type { Dictionary } from "./en";

export const it = {
  common: {
    /** Appended to the brand mark aria-label: `${siteName} — home`. */
    home: "pagina iniziale",
    openInNewTab: "si apre in una nuova scheda",
  },
  skip: {
    toContent: "Vai al contenuto principale",
  },
  header: {
    quickLinksAria: "Link rapidi",
    primaryAria: "Principale",
    mobileNavAria: "Sito (mobile)",
    openMenu: "Apri il menu",
    closeMenu: "Chiudi il menu",
    trackBooking: "Tracci la sua prenotazione",
    viewBookmarks: "Visualizzi i suoi segnalibri",
  },
  search: {
    triggerAria: "Cerca",
    dialogAria: "Cerca su Ptah Tours",
    closeAria: "Chiudi la ricerca",
    inputAria: "Cerca viaggi, destinazioni e racconti",
    placeholder: "Piramidi, crociera sul Nilo, Alessandria…",
    popular: "Ricerche popolari",
  },
  bookmarks: {
    title: "Visualizzi i suoi segnalibri",
    /** Exactly one bookmark. */
    one: "Ha 1 segnalibro",
    /** Zero or many — `{count}` is replaced with the number. */
    other: "Ha {count} segnalibri",
  },
  nav: {
    /** Quick-links bar, in order: Events, When to Visit, eVisa, My Account. */
    quickLinks: ["Eventi e festival", "Quando andare", "Prenoti il suo eVisa", "Il mio account"],
    /** Direct nav links, in order: Destinations, Trip Ideas. */
    directLinks: ["Destinazioni", "Idee di viaggio", "Galleria"],
    buildTrip: "Pianifica il mio viaggio",
    popularSearches: [
      "Piramidi di Giza",
      "Crociera sul Nilo",
      "Mongolfiera a Luxor",
      "Snorkeling a Ras Mohammed",
      "Tour privato del Cairo",
      "Natale in Egitto",
    ],
    /** Mega-menu sections, in order: About Egypt, Plan Your Trip, Tours. */
    sections: [
      {
        title: "Scopri l'Egitto",
        columns: [
          { heading: "Destinazioni", links: ["Il Cairo", "Luxor", "Assuan", "Alessandria", "Hurghada", "Sharm el-Sheikh"] },
          { heading: "Conoscere il territorio", links: ["Storia e patrimonio", "Stagioni e clima", "Il Nilo", "Deserti e oasi", "Barriere del Mar Rosso"] },
          { heading: "Buono a sapersi", links: ["Viaggio responsabile", "Accessibilità", "Sicurezza e assistenza", "Storie e diario"] },
        ],
        imageCtas: [
          { label: "Approfondimento sulla destinazione", heading: "L'antica Tebe" },
          { label: "Coste", heading: "Alla scoperta del Mar Rosso" },
          { label: "Dal campo", heading: "Leggi il diario" },
        ],
      },
      {
        title: "Organizza il viaggio",
        columns: [
          { heading: "Come arrivare", links: ["Voli per l'Egitto", "Visti e ingresso", "Arrivo senza pensieri", "Come muoversi"] },
          { heading: "Decidere", links: ["Quando andare", "Quanti giorni", "Budget e mance", "Viaggiare con i bambini"] },
          { heading: "La nostra promessa", links: ["Come funzionano i viaggi Ptah", "Viaggio responsabile", "Recensioni e accreditamenti", "Contatta il team"] },
        ],
        imageCtas: [
          { label: "Consulenza gratuita", heading: "Parla con un egittologo" },
          { label: "Esplora", heading: "Tutti i tour di Ptah Tours" },
          { label: "Ispirazione", heading: "Trova idee di viaggio" },
        ],
      },
      {
        title: "Tour",
        columns: [
          { heading: "Per stile", links: ["Egitto classico", "Crociere sul Nilo", "Mar Rosso e spiaggia", "Avventure nel deserto"] },
          { heading: "Per durata", links: ["Tour giornalieri", "Viaggi di 2–4 giorni", "Viaggi di 5–9 giorni", "Spedizioni di 10+ giorni"] },
          { heading: "Speciali", links: ["Privati e su misura", "Viaggi per famiglie", "Viaggi di nozze", "Partenze last-minute"] },
        ],
        imageCtas: [
          { label: "Viaggio esclusivo", heading: "Egitto classico, 8 giorni" },
          { label: "Sul fiume", heading: "Collezione crociere sul Nilo" },
          { label: "Sott'acqua", heading: "Viaggi di immersione e snorkeling" },
        ],
      },
      {
        title: "Diario",
        columns: [
          { heading: "Per iniziare", links: ["Quando andare", "Prima crociera sul Nilo", "Itinerario di 7 giorni", "Cosa mettere in valigia"] },
          { heading: "Luoghi e racconti", links: ["Il Cairo oltre la guida", "L'anima di Alessandria", "Oltre Giza", "Una sera a Karnak"] },
          { heading: "Viaggia bene", links: ["L'Egitto con i bambini", "Rispetto per la barriera", "Giorni di feluca sul Nilo", "Tutti gli articoli"] },
        ],
        imageCtas: [
          { label: "Pianifica il viaggio", heading: "Quando visitare l'Egitto" },
          { label: "Sul fiume", heading: "Prima crociera sul Nilo" },
          { label: "In famiglia", heading: "L'Egitto con i bambini" },
        ],
      },
    ],
  },
  footer: {
    newsletterAria: "Restiamo in contatto",
    columnsAria: "Piè di pagina",
    /** Social row aria — `{siteName}` is replaced with the site name. */
    followAria: "Segui {siteName}",
    newsletter: {
      heading: "Iscriviti!",
      blurb: "Idee di viaggio, partenze stagionali e qualche racconto dal deserto — poche volte al mese, mai spam.",
      ctaLabel: "Iscriviti alla nostra e-newsletter",
    },
    /** Footer link columns, in order: (brand), Travel With Us, Help & Info. */
    columns: [
      { heading: "Ptah Tours", links: ["Chi siamo", "I nostri egittologi", "Lavora con noi", "Stampa e media", "Contattaci"] },
      { heading: "Viaggia con noi", links: ["Tutti i tour", "Idee di viaggio", "Crociere sul Nilo", "Viaggi privati", "Viaggio responsabile", "Galleria fotografica"] },
      { heading: "Aiuto e informazioni", links: ["Quando andare", "Visti e ingresso", "Traccia la mia prenotazione", "Salute e sicurezza", "Domande frequenti"] },
    ],
    badgeHeading: "Riconosciuto da",
    /** Badge sub-labels, in order: ETF, Travelife (badge names stay as-is). */
    badgeSubs: ["Membro 2026", "Partner"],
    partnersHeading: "Partner di viaggio",
    /** Partner taglines, in order: Egypt Air, IATA, Visit Egypt (names stay). */
    partnerTaglines: ["Compagnia aerea partner ufficiale", "Agente accreditato", "Ente del Turismo Egiziano"],
    /** Legal links, in order: Privacy, Terms, Cookie Policy. */
    legalLinks: ["Informativa sulla privacy", "Termini e condizioni", "Informativa sui cookie"],
    /** Keep `{year}` and the brand "Ptah Tours" verbatim. */
    copyrightLine: "© {year} Ptah Tours. Tutti i diritti riservati.",
    acknowledgement:
      "Ptah Tours ha sede al Cairo e opera in tutto l'Egitto — la Valle del Nilo, il Delta, il Sinai e il Deserto Occidentale. Viaggiamo con egittologi autorizzati, retribuiamo equamente i nostri collaboratori e pianifichiamo ogni itinerario per restituire alle comunità e ai siti del patrimonio egiziano più di quanto riceviamo.",
  },
  cookie: {
    regionAria: "Consenso ai cookie",
    heading: "Teniamo alla sua privacy",
    copy: "Utilizziamo i cookie per migliorare la sua esperienza di navigazione, offrire contenuti personalizzati e analizzare il nostro traffico. Cliccando su Accetta tutti, acconsente al nostro utilizzo dei cookie. Può cambiare idea in qualsiasi momento dal piè di pagina.",
    manageHeading: "Gestione delle sue preferenze sui cookie",
    acceptAll: "Accetta tutti",
    manage: "Gestisci",
    rejectAll: "Rifiuta tutti",
    saveChoices: "Salva le mie scelte",
    necessaryName: "Strettamente necessari",
    necessaryDesc: "Necessari per la sicurezza, la memorizzazione del consenso e i flussi di prenotazione principali. Sempre attivi.",
    /** Categories, in order: preferences, analytics, marketing. */
    categories: [
      { name: "Preferenze", description: "Ricordano scelte come la lingua, la valuta e i suoi viaggi salvati." },
      { name: "Statistiche", description: "Statistiche anonime che ci aiutano a capire quali viaggi e pagine amano i viaggiatori." },
      { name: "Marketing", description: "Misurano le nostre campagne e mostrano contenuti di Ptah Tours più pertinenti su altri siti." },
    ],
    /** Footer trigger: long prefix ("Manage Your ") hidden on narrow screens. */
    manageButtonLong: "Gestisci i ",
    manageButtonShort: "Cookie",
  },
} satisfies Dictionary;
