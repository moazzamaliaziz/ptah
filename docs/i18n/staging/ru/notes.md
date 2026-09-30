# Agent RU — translation notes & decisions

Register: polite editorial **вы** (lowercase). « » guillemets; spaced em dash —.
Brand: **Птах Турс** in all Russian prose; Latin "Ptah Tours" only in structural
fields (`siteMeta.name`, `legalName`) and flagged brand tokens.

## Global / coined conventions
- CTAs standardized: "Смотреть туры" (Browse tours), "Начать планирование"
  (Start planning), "Спланировать поездку" (Plan a trip), "Связаться с нами".
- "Trip designer" → «дизайнер путешествий»; "trip builder" → «Конструктор поездки».
- "Egyptologist" → «египтолог»; "small-group" → «небольшие групповые».
- Accreditation org names kept verbatim (ETF, Travelife, Egypt Air, IATA); their
  human descriptors translated.

## ⚠ Low-confidence / judgment calls (file · key · reason)
- pwa.ru.ts · install.iosHint · Uses outer « » with inner „ " (curly) for the
  nested label to avoid illegal guillemet nesting («…«…»…»). Deliberate.
- pages.ru.ts · press.facts[].value ("Ptah Tours") · Kept Latin — ambiguous
  whether prose or brand token; per brief "when unsure, keep Latin + flag".
- pages.ru.ts · account/register/login emailLabel etc. · "Email" kept Latin
  (standard RU UI convention; «Электронная почта» too long for labels).
- **Plural {unit} 2-form limitation:** the i18n unit system exposes only
  singular/plural, but Russian needs 3 forms (1 / 2–4 / 5+). Affected keys:
  tripBuilder.savedTour(s), tripIdeas.tourUnit(Plural), search.resultUnit(Plural),
  toursFinder.resultUnit(Plural), tourDetail.dayUnit/daysUnit. Plural form set to
  genitive plural ("туров"/"дней") — correct for 0 and 5+, imperfect for 2–4.
  Where a number sits directly beside the unit I reworded to a count-neutral or
  "Найдено N …"/"…: {count}" label form to sidestep agreement:
  tripBuilder.savedLine (drops {unit}), search.introResults, tourDetail
  .upcomingDepartures, .upcomingCount, departureList.seatsLeft.
- **{name}/{label} case-ending safety:** data supplies nominative-only tokens, so
  headings that would require an oblique case were reworded to nominative-safe
  forms using «{name}» or "Туры: {name}". Affected: tours.headingDestination,
  tours.headingTag, cityDetail.toursHeading, cityDetail.ctaHeading
  ("{name} ждёт вас. Готовы?"), cityDetail.emptyToursTitle,
  countryDetail.emptyToursTitle, .emptyCitiesBody, .ctaHeading.
  countryDetail.whyVisitHeading ("Почему стоит посетить {name}") reads correctly
  for the only current country (Египет); revisit if a feminine country name is
  added.
- pages.ru.ts · bookingTour.payStep2Template · Reworded to "Способы оплаты:
  {methods}." with nominative method words (карта / PayPal / банковский перевод)
  so the joined list is grammatical; listConjunction = " или ".
- pages.ru.ts · tourDetail.departureList.toPrefix · Set to "—" (date-range
  connector); Russian "с…по" cannot be expressed with the fixed "{a} {sep} {b}".
- pages.ru.ts · events.emptyLink/Post & tripIdeaDetail.emptyLink/Post · Split so
  the space-joined template reads without a comma inside link text.
- Legal pages (privacy/terms/cookie/etc.) title+emphasis pairs restructured so
  the emphasized trailing fragment is a natural Russian sentence tail.

## Status
- P0 done + structurally verified 1:1 vs English: A dictionary.ru.ts (72 keys),
  B pages.ru.ts (913 keys), C pwa.ru.ts (PwaStrings shape).
- P1 / P2: in progress below.
