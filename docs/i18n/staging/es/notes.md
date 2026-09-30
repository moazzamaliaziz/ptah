# Spanish (es) editorial translation — notes

Scope: editorial content only (Modules D, E, F, G, I). Staging output in
`docs/i18n/staging/es/`. The shipped UI/chrome dictionary
(`src/i18n/dictionaries/es.ts`) and page dictionary (`src/i18n/pages/es.ts`)
were NOT touched and are NOT reproduced here.

## Files written
- `theme-content.es.ts` (Module D) — galleryLabelsEs, themeContentEs, whenToVisitContentEs
- `city-content.es.ts` (Module E) — cityContentEs (6 cities)
- `blog.es.ts` (Module F) — postBodiesEs
- `landing.es.ts` (Module G) — full mirror of English exports, `Es` suffix
- `ui-supplemental.es.ts` (Module I) — flat object, exact §I keys
- Module H (alt-overlay.es.ts) — DEFERRED (P2); see end.

## Register and typography (locked decisions)
- Voice: **usted** (courtesy), neutral international Spanish.
- CTA microcopy: usted imperative / infinitive per slot (Planifique, Descubra,
  Consultar requisitos, Diseñar mi viaje). Team byline reads as impersonal "nuestro equipo".
- Opening punctuation `¿` / `¡` used on every question/exclamation.
- Eras: BC → `a. C.` (WITH thin space, per brief). AD omitted unless in source.
- Numbers: thousands WITHOUT separators; kept `~`, `%`, `40 °C` (space before °C),
  `+`, en-dash `–` for ranges (e.g. "2–4 días").
- One source paragraph → one target paragraph (no splitting/merging).

## ⚠ Low-confidence / decisions to review

### TOP FLAG — register mismatch with shipped chrome
- **All editorial files · global** — Editorial voice is **usted** (per brief), but the
  shipped `src/i18n/dictionaries/es.ts` is written in **tú/informal**
  (e.g. line 39 "Reserva tu eVisa", 41 "Planifica mi viaje", 60 "Descubre el mar Rojo",
  65 "Planifica tu viaje"). When editorial content sits next to chrome the page will
  mix tú (chrome) and usted (editorial). Needs a project-level register decision before
  wiring into `src/`. If the house voice should be tú, all editorial CTAs/imperatives
  must be re-cast.

### landing.es.ts
- `siteMetaEs` · whole export — English `siteMeta` is `as const` (literal string types),
  so `typeof siteMeta` would reject translated values. Widened to
  `{ [K in keyof typeof siteMeta]: string }`. Behaviourally fine (values are strings) but
  it is a type widening the dev must accept when wiring in.
- `inspiredTabs[river-sea].cards[3].title` / `stories[3].alt` · "house reefs" →
  "arrecifes junto a la orilla" — "house reef" is dive jargon (a reef accessible from
  shore); no fixed Spanish term. Chose descriptive "junto a la orilla / costero".
- `footerContent.socials[6].network` · "Email" kept verbatim (not "Correo") — reads as a
  channel identifier alongside brand names; iconKey `mail`.
- `heroSlides`, nav, stories · **Kept untransliterated**: "Blue Hole", "Ras Abu Galum",
  "Ras Mohammed", "Khan el-Khalili", "Sharm el-Sheikh", "Dahab", "Travelife", "IATA",
  "Egypt Air", "Visit Egypt", "ETF". Brand "Ptah Tours" and `legalName` verbatim.
- `template-literal src` — English uses `${A}/assets/...` (A = "/assets"); the `A` const
  is not imported in staging, so paths were expanded to plain string literals
  `/assets/...`. `src`/`mid`/`wide` never translated.
- `footerContent.copyrightLine` — `{year}` token preserved verbatim.

## Coined / chosen Spanish exonyms (consistent across all es files)
Guiza, Keops, Kefrén, El Cairo, Asuán, Alejandría, File (Philae), Isis, faluca,
dahabeya, Tebas, Cañón de Colores, Santa Catalina, monte Sinaí, Valle de los Reyes,
Biblioteca de Alejandría, Qaitbay, Abidos, Kom Ombo, Dendera, Saqqara, Desierto Blanco,
Desierto Occidental, mar Rojo, primera catarata.

## Facts preserved (sacred, not rounded/invented)
- GEM fully opened 1 November 2025 with the complete Tutankhamun collection (Module E/F where present).
- Tutankhamun's mummy remains in the Valley of the Kings (KV62).
- Ras Muhammad = Egypt's first national park (1983); St Catherine's = 6th-century monastery.
- Distances/durations left approximate exactly as in source (`~`, en-dash ranges).

## Module H (P2) — DEFERRED
`alt-overlay.es.ts` (altOverlayEs: Record<string,{alt:string;caption?:string}>) not yet
produced. Deferred per P1-first priority. Requires reading media/gallery sources for the
key inventory before translating.
