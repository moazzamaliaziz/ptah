# Italian (it) editorial translation — notes

Scope: editorial content only (Modules D, E, F, G, I). Staging output in
`docs/i18n/staging/it/`. The shipped UI/chrome dictionary
(`src/i18n/dictionaries/it.ts`) and page dictionary (`src/i18n/pages/it.ts`) were
NOT touched and are NOT reproduced here.

## Files written
- `theme-content.it.ts` (Module D) — galleryLabelsIt, themeContentIt, whenToVisitContentIt
- `city-content.it.ts` (Module E) — cityContentIt (6 cities)
- `blog.it.ts` (Module F) — postBodiesIt
- `landing.it.ts` (Module G) — full mirror of English exports, `It` suffix
- `ui-supplemental.it.ts` (Module I) — flat object, exact §I keys
- Module H (alt-overlay.it.ts) — DEFERRED (P2); see end.

## Register and typography (locked decisions)
- Voice: **Lei** (courtesy) + impersonal editorial voice — chosen and kept consistent.
- CTA microcopy: **formal imperative** (Lei), consistently: Pianifichi, Scopra, Veda,
  Verifichi, Inizi, Progetti, Si iscriva, Ci contatti, Richieda. Company voice is "noi"
  (Viaggiamo, Inviamo, Abbineremo).
- Eras: BC → `a.C.` (NO space, Italian convention).
- Numbers: thousands WITHOUT separators; kept `~`, `%`, `40 °C` (space before °C), `+`,
  en-dash `–` for ranges (e.g. "2–4 giorni", "5–9 giorni", "10+ giorni").
- One source paragraph → one target paragraph.

## ⚠ Low-confidence / decisions to review

### TOP FLAG — register mismatch with shipped chrome
- **All editorial files · global** — Editorial voice is **Lei/formal** (per brief), but the
  shipped `src/i18n/dictionaries/it.ts` is written in **tu/informal**
  (e.g. line 46 "Pianifica il mio viaggio", 58 "Scopri l'Egitto", 104 "Pianifica il
  viaggio"). When editorial content sits next to chrome the page will mix tu (chrome) and
  Lei (editorial). Needs a project-level register decision before wiring into `src/`.
  If the house voice should be tu, all editorial CTAs/imperatives must be re-cast
  (Pianifichi→Pianifica, Scopra→Scopri, Veda→Vedi, Inizi→Inizia, Progetti→Progetta, etc.).

### landing.it.ts
- `siteMetaIt` · whole export — English `siteMeta` is `as const` (literal string types),
  so `typeof siteMeta` would reject translated values. Widened to
  `{ [K in keyof typeof siteMeta]: string }`. Values are strings, so behaviourally fine;
  the dev must accept the widening when wiring in.
- `footerContent.badgeHeading` · "Endorsed By" → "Con il patrocinio di" — interpretive.
  Literal "Approvato da" was rejected as odd for tourism-body endorsements; "patrocinio"
  (patronage/sponsorship) reads more naturally but shifts nuance slightly. Review.
- `inspiredTabs[river-sea].cards[3].title` / `stories[3].alt` · "house reefs" →
  "reef sotto costa" — "house reef" is dive jargon (shore-accessible reef); no fixed
  Italian term. Kept English "reef" + descriptive "sotto costa/costiera".
- `footerContent.socials[6].network` · "Email" kept verbatim (not "Posta"/"E-mail") —
  reads as a channel identifier alongside brand names; iconKey `mail`.
- CTA first-person object with formal verb — e.g. "Progetti il mio viaggio",
  "Pianifichi il mio viaggio": formal imperative addressed to the provider while keeping
  the source's first-person "my". Idiomatic as microcopy but worth a marketing check.
- `heroSlides`, nav, stories · **Kept untransliterated**: "Blue Hole", "Ras Abu Galum",
  "Ras Mohammed", "Khan el-Khalili", "Sharm el-Sheikh", "Dahab", "Travelife", "IATA",
  "Egypt Air", "Visit Egypt", "ETF". Brand "Ptah Tours" and `legalName` verbatim.
- `template-literal src` — English `${A}/assets/...` expanded to literal `/assets/...`
  (the `A` const is not imported in staging). `src`/`mid`/`wide` never translated.
- `footerContent.copyrightLine` — `{year}` token preserved verbatim.

## Coined / chosen Italian exonyms (consistent across all it files)
Giza, Cheope, Chefren, il Cairo, Assuan, Alessandria, File (Philae), Iside, feluca,
dahabiya, Tebe, Canyon Colorato, Santa Caterina, monte Sinai, Valle dei Re,
Biblioteca di Alessandria, Qaitbay, Abido, Kom Ombo, Dendera, Saqqara, Deserto Bianco,
Deserto Occidentale, Mar Rosso, prima cateratta.

Note: "Mar Rosso" capitalised as a proper noun (Italian convention), matching the
city-content.it.ts usage.

## Facts preserved (sacred, not rounded/invented)
- GEM fully opened 1 November 2025 with the complete Tutankhamun collection (Module E/F where present).
- Tutankhamun's mummy remains in the Valley of the Kings (KV62).
- Ras Muhammad = Egypt's first national park (1983); St Catherine's = 6th-century monastery.
- Distances/durations left approximate exactly as in source (`~`, en-dash ranges).

## Module H (P2) — DEFERRED
`alt-overlay.it.ts` (altOverlayIt: Record<string,{alt:string;caption?:string}>) not yet
produced. Deferred per P1-first priority. Requires reading media/gallery sources for the
key inventory before translating.
