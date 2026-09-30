/**
 * English (en) UI-supplemental strings — the canonical values for copy that
 * lived hardcoded in JSX/metadata (inventory §I) and is now served through the
 * localized loader. This is the shape SSOT + the English fallback. Tokens
 * {name} are preserved verbatim.
 */
export const uiSupplementalEn = {
  "cityNav.overview": "Overview",
  "cityNav.tours": "Tours",
  "cityNav.thingsToDo": "Things to do",
  "cityNav.explore": "Explore",
  "cityNav.photos": "Photos",
  "cityNav.plan": "Plan your visit",
  "cityNav.faq": "FAQ",
  "cityPlanHeading": "Plan your visit to {name}",
  "cityViewOnMaps": "View {name} on Google Maps",
  "siteMetaDescription":
    "Private and small-group journeys across Egypt — pyramids at dawn, Nile cruises, Red Sea reefs — designed end to end by the Cairo team.",
  "heroOgAlt":
    "The Great Pyramid of Khufu and the Sphinx at Giza in warm morning light.",
} as const;
