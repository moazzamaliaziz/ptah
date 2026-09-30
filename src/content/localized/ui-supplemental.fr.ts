/**
 * UI supplemental strings (French) — flat, dotted keys.
 *
 * These are currently hardcoded English in JSX/metadata (inventory section I).
 * The dev phase extracts them into page-content keys; values are supplied here.
 *
 * Typography note: this file is authored with natural French punctuation
 * (regular spaces). A final Node normalization pass inserts real U+00A0
 * (non-breaking spaces) before « ; : ! ? » and inside guillemets.
 * Interpolation tokens like {name} are kept verbatim.
 */
export const uiSupplementalFr = {
  "cityNav.overview": "Aperçu",
  "cityNav.tours": "Circuits",
  "cityNav.thingsToDo": "À faire",
  "cityNav.explore": "Explorer",
  "cityNav.photos": "Photos",
  "cityNav.plan": "Préparer votre visite",
  "cityNav.faq": "FAQ",
  cityPlanHeading: "Préparer votre visite : {name}",
  cityViewOnMaps: "Voir {name} sur Google Maps",
  siteMetaDescription:
    "Des voyages privés et en petit groupe à travers l’Égypte — pyramides à l’aube, croisières sur le Nil, récifs de la mer Rouge — conçus de bout en bout par notre équipe du Caire.",
  heroOgAlt:
    "La grande pyramide de Khéops et le Sphinx de Gizeh dans la lumière chaude du matin.",
} as const;
