import type { Dictionary } from "./en";

/**
 * French (fr) chrome dictionary — machine-translated from en.ts.
 * Mirrors en.ts exactly by key order and array index (`satisfies Dictionary`);
 * the placeholders {count}, {year}, {siteName} and the brand "Ptah Tours" stay verbatim.
 */
export const fr = {
  common: {
    home: "accueil",
    openInNewTab: "ouvre dans un nouvel onglet",
  },
  skip: {
    toContent: "Aller au contenu principal",
  },
  header: {
    quickLinksAria: "Liens rapides",
    primaryAria: "Principale",
    mobileNavAria: "Site (mobile)",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    trackBooking: "Suivre votre réservation",
    viewBookmarks: "Voir vos favoris",
  },
  search: {
    triggerAria: "Rechercher",
    dialogAria: "Rechercher sur Ptah Tours",
    closeAria: "Fermer la recherche",
    inputAria: "Rechercher des voyages, des destinations et des récits",
    placeholder: "Pyramides, croisière sur le Nil, Alexandrie…",
    popular: "Recherches populaires",
  },
  bookmarks: {
    title: "Voir vos favoris",
    one: "Vous avez 1 favori",
    other: "Vous avez {count} favoris",
  },
  nav: {
    quickLinks: ["Événements et festivals", "Quand partir", "Réserver votre eVisa", "Mon compte"],
    directLinks: ["Destinations", "Idées de voyage", "Galerie"],
    buildTrip: "Planifier mon voyage",
    popularSearches: [
      "Pyramides de Gizeh",
      "Croisière sur le Nil",
      "Montgolfière à Louxor",
      "Plongée avec tuba à Ras Mohammed",
      "Visite privée du Caire",
      "Noël en Égypte",
    ],
    sections: [
      {
        title: "À propos de l'Égypte",
        columns: [
          { heading: "Destinations", links: ["Louxor", "Assouan", "Le Caire", "Alexandrie", "Hurghada", "Charm el-Cheikh"] },
          { heading: "Connaître le pays", links: ["Histoire et patrimoine", "Saisons et climat", "Le Nil", "Déserts et oasis", "Récifs de la mer Rouge"] },
          { heading: "Bon à savoir", links: ["Voyage responsable", "Accessibilité", "Sécurité et assistance", "Récits et journal"] },
        ],
        imageCtas: [
          { label: "Zoom sur une destination", heading: "Thèbes antique" },
          { label: "Littoraux", heading: "Découvrez la mer Rouge" },
          { label: "Du terrain", heading: "Lire le journal" },
        ],
      },
      {
        title: "Planifiez votre voyage",
        columns: [
          { heading: "Comment s'y rendre", links: ["Vols vers l'Égypte", "Visas et entrée", "Jours d'arrivée, pris en charge", "Se déplacer"] },
          { heading: "Notre promesse", links: ["Comment fonctionnent les voyages Ptah", "Voyage responsable", "Avis et accréditations", "Contacter l'équipe"] },
        ],
        imageCtas: [
          { label: "Consultation gratuite", heading: "Parlez à un égyptologue" },
          { label: "Parcourir", heading: "Tous les circuits Ptah Tours" },
          { label: "Inspiration", heading: "Trouvez des idées de voyage" },
        ],
      },
      {
        title: "Circuits",
        columns: [
          { heading: "Circuits à Louxor", links: ["Tous les circuits à Louxor", "Temples et tombeaux", "Croisières sur le Nil au départ de Louxor", "Découvrir Louxor"] },
          { heading: "Circuits à Assouan", links: ["Tous les circuits à Assouan", "Abou Simbel et Philae", "Croisières sur le Nil au départ d'Assouan", "Découvrir Assouan"] },
          { heading: "Par style", links: ["Égypte classique", "Croisières sur le Nil", "Mer Rouge et plage", "Aventures dans le désert"] },
        ],
        imageCtas: [
          { label: "Rive ouest", heading: "Louxor, du temple au tombeau" },
          { label: "Sur le fleuve", heading: "Collection croisières sur le Nil" },
          { label: "En amont", heading: "Assouan et Abou Simbel" },
        ],
      },
    ],
  },
  footer: {
    newsletterAria: "Restez connecté",
    columnsAria: "Pied de page",
    followAria: "Suivez {siteName}",
    newsletter: {
      heading: "Inscrivez-vous !",
      blurb: "Des idées de voyage, des départs saisonniers et, de temps à autre, des nouvelles du désert — quelques fois par mois, jamais de spam.",
      ctaLabel: "Inscrivez-vous à notre newsletter",
    },
    columns: [
      { heading: "Ptah Tours", links: ["À propos de nous", "Nos égyptologues", "Carrières", "Presse et médias", "Nous contacter"] },
      { heading: "Voyagez avec nous", links: ["Tous les circuits", "Idées de voyage", "Croisières sur le Nil", "Voyages privés", "Voyage responsable", "Galerie photo"] },
      { heading: "Aide et infos", links: ["Quand partir", "Visas et entrée", "Suivre ma réservation", "Santé et sécurité", "FAQ"] },
    ],
    badgeHeading: "Approuvé par",
    badgeSubs: ["Membre 2026", "Partenaire"],
    partnersHeading: "Partenaires de voyage",
    partnerTaglines: ["Transporteur partenaire officiel", "Agent accrédité", "Office du tourisme égyptien"],
    legalLinks: ["Politique de confidentialité", "Conditions générales", "Politique relative aux cookies"],
    copyrightLine: "© {year} Ptah Tours. Tous droits réservés.",
    acknowledgement:
      "Ptah Tours a son siège au Caire et opère dans toute l'Égypte — la vallée du Nil, le Delta, le Sinaï et le désert Occidental. Nous voyageons avec des égyptologues diplômés, rémunérons équitablement nos équipes et concevons chaque itinéraire pour apporter davantage aux communautés et aux sites patrimoniaux d'Égypte que nous n'en retirons.",
  },
  cookie: {
    regionAria: "Consentement aux cookies",
    heading: "Nous respectons votre vie privée",
    copy: "Nous utilisons des cookies pour améliorer votre expérience de navigation, proposer du contenu personnalisé et analyser notre trafic. En cliquant sur Tout accepter, vous consentez à notre utilisation des cookies. Vous pouvez changer d'avis à tout moment depuis le pied de page.",
    manageHeading: "Gérer vos préférences de cookies",
    acceptAll: "Tout accepter",
    manage: "Gérer",
    rejectAll: "Tout refuser",
    saveChoices: "Enregistrer mes choix",
    necessaryName: "Strictement nécessaires",
    necessaryDesc: "Nécessaires à la sécurité, à l'enregistrement du consentement et aux principaux parcours de réservation. Toujours actifs.",
    categories: [
      { name: "Préférences", description: "Mémorisent des choix tels que la langue, la devise et vos voyages favoris." },
      { name: "Statistiques", description: "Statistiques anonymes qui nous aident à comprendre quels voyages et quelles pages les voyageurs préfèrent." },
      { name: "Marketing", description: "Mesurent nos campagnes et affichent du contenu Ptah Tours plus pertinent ailleurs." },
    ],
    manageButtonLong: "Gérer vos ",
    manageButtonShort: "Cookies",
  },
} satisfies Dictionary;
