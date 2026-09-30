/**
 * Russian UI-supplemental strings (Phase 3 i18n, module I) — hardcoded English
 * currently living in JSX/metadata (see docs/i18n/02-source-inventory.md §I).
 * Flat object with the exact canonical keys; the dev phase wires these into
 * page-content keys. Tokens {name} preserved verbatim. Brand → Птах Турс.
 */
export const uiSupplementalRu = {
  "cityNav.overview": "Обзор",
  "cityNav.tours": "Туры",
  "cityNav.thingsToDo": "Чем заняться",
  "cityNav.explore": "Знакомство",
  "cityNav.photos": "Фото",
  "cityNav.plan": "Планирование визита",
  "cityNav.faq": "Частые вопросы",
  // {name} = city name — kept nominative-safe (data supplies nominative only)
  cityPlanHeading: "Планирование визита: {name}",
  cityViewOnMaps: "Посмотреть на Google Maps: {name}",
  siteMetaDescription:
    "Индивидуальные и небольшие групповые путешествия по Египту — пирамиды на рассвете, круизы по Нилу, рифы Красного моря — продуманные от начала до конца командой из Каира.",
  heroOgAlt:
    "Великая пирамида Хеопса и Большой сфинкс в Гизе в тёплом утреннем свете.",
} as const;
