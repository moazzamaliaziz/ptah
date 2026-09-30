# Source Inventory — every translation surface

Line counts are of the **English source**. "All 6" = ar, fr, de, es, it, ru. "ru only" = the other five already exist in code.

| # | Surface | Source file | Lines | Locales needed | Priority | Owner |
|---|---------|-------------|-------|----------------|----------|-------|
| A | Chrome/UI dictionary | `src/i18n/dictionaries/en.ts` | 178 | **ru only** | P0 | Agent RU |
| B | Page-content dictionary | `src/i18n/pages/en.ts` | 1370 | **ru only** | P0 | Agent RU |
| C | PWA strings | `src/i18n/pwa.ts` | 102 | **ru only** | P0 | Agent RU |
| D | Theme pages editorial | `src/content/theme-content.ts` | 582 | All 6 | P1 | RU / AR-FR-DE / ES-IT |
| E | City pages editorial | `src/content/city-content.ts` | 890 | All 6 | P1 | RU / AR-FR-DE / ES-IT |
| F | Blog article bodies | `src/content/blog.ts` | 279 | All 6 | P1 | RU / AR-FR-DE / ES-IT |
| G | Homepage editorial | `src/content/landing.ts` | 1042 | All 6 | P1 | RU / AR-FR-DE / ES-IT |
| H | Image alt/caption overlays | `theme-media.ts` · `city-media.ts` · `gallery.ts` | 763/914/99 | All 6 | **P2** | RU / AR-FR-DE / ES-IT |
| I | UI supplemental (hardcoded JSX/meta) | see §I | — | All 6 | P1 | all translators |

Priority: **P0** = blocks a working Russian site. **P1** = the actual editorial gap this initiative exists to fix. **P2** = accessibility/SEO polish; may be deferred at CEO review without blocking P0/P1.

---

## A. Chrome/UI dictionary (`src/i18n/dictionaries/en.ts`) — ru only

- Shape SSOT: `export type Dictionary = typeof en`. 8 namespaces of global UI chrome (header, footer, nav, cookie, forms, common, etc. — read the file).
- **Output:** `docs/i18n/staging/ru/dictionary.ru.ts` → `export const ru = { ... } satisfies Dictionary;` (import the type: `import type { Dictionary } from "@/i18n/dictionaries/en";`).
- Mirror every key. Preserve tokens. This is the same shape the five existing `dictionaries/<locale>.ts` files already fill — you may read `dictionaries/fr.ts` as a worked example of structure (NOT for content).

## B. Page-content dictionary (`src/i18n/pages/en.ts`) — ru only

- Shape SSOT: `export type PageContent = typeof enPages`. ~57 namespaces of static page copy: headings, editorial copy, form labels, empty states, breadcrumbs, `cityDetail`, `cities`, `gallery.filters`, etc.
- **Output:** `docs/i18n/staging/ru/pages.ru.ts` → `export const ruPages = { ... } satisfies PageContent;` (`import type { PageContent } from "@/i18n/pages/en";`).
- Largest single file. Mirror every namespace and key. `gallery.filters` here supplies the localized gallery category labels (so the gallery tabs are covered by this, not by module H). Read `pages/fr.ts` as a structure example only.

## C. PWA strings (`src/i18n/pwa.ts`) — ru only

- `Record<Locale, PwaStrings>`; `PwaStrings` = `{ install: {title, body, action, short, dismiss, iosHint}, update: {body, action, dismiss} }`.
- **Output:** `docs/i18n/staging/ru/pwa.ru.ts` → `export const pwaRu: PwaStrings = { ... };` (`import type { PwaStrings } from "@/i18n/pwa";`). iosHint uses “curly quotes” — keep that style in Russian («…» is fine).

---

## D. Theme pages editorial (`src/content/theme-content.ts`) — All 6

- Exports: `galleryLabels` (`galleryAria`, `lightbox.{close,prev,next,zoomIn,zoomOut}`, `counter:"{current} of {total}"`), `themeContent` (`Record` keyed `heritage`, `the-nile`, `deserts`, `red-sea`), `whenToVisitContent`.
- Types: `SectionHead{eyebrow,heading,intro?}`, `FactItem{icon,value,label}`, `TimelineEntry{era,span,body}`, `FeatureRow{image,eyebrow?,heading,body[]}`, `PlaceCard{image,name,body}`.
- **Translate:** all `eyebrow`, `heading`, `intro`, `label`, `era`, `body` (string + string[]), `name`, `galleryAria`, lightbox labels, and the human text of `value`.
- **Keep:** `icon`, `image`, `band`; `{current}`/`{total}`.
- **`value`/`span` nuance:** numerals + units — keep the number, translate/keep the unit sensibly ("5,000+ yrs" → localize "yrs"; "c. 2560 BC" → keep numerals + circa + localized "BC"; "~6,650 km" → keep "km"; "40°C+" → keep). `span` date ranges ("c. 3100–2686 BC"): keep numerals + en-dash, localize "BC".
- **Output per locale:** `docs/i18n/staging/<locale>/theme-content.<locale>.ts` exporting `galleryLabels<Locale>`, `themeContent<Locale>`, `whenToVisitContent<Locale>` typed against `typeof` the English exports.

## E. City pages editorial (`src/content/city-content.ts`) — All 6

- `cityContent: Record<CitySlug, CityContent>` for 6 cities: cairo, luxor, aswan, alexandria, hurghada, sharm-el-sheikh.
- Per city translate: `seo.title`, `seo.description` (~150–160 chars — keep length sensible), `seo.keywords[]` (translate to natural target-language search terms, keep count), `heroEyebrow`, `h1`, `lede`, `overview[]`, `facts[].value`+`.label`, `highlights.head.*` + `items[].name`+`.body`, `features.head.*` + `rows[].eyebrow`+`.heading`+`.body[]`, `whenToGo.head.*`+`.body[]`, `gettingThere.head.*`+`.body[]`, `gallery.{eyebrow,heading}`, `faqs[].q`+`.a`, `creditsSummary`.
- **Keep:** `heroSlug`, `image`, `icon`, `facts[].icon`, `rank`, `nearby[]` slugs.
- **Facts:** GEM opened 1 Nov 2025; Tutankhamun's mummy stays in KV62/Valley of the Kings; distances are approximate ("around/~") — preserve exactly.
- **Output:** `docs/i18n/staging/<locale>/city-content.<locale>.ts` exporting `cityContent<Locale>`.

## F. Blog article bodies (`src/content/blog.ts`) — All 6

- `POST_BODIES: Record<slug, BlogPostMeta>` — 11 posts. Each: `body: BlogBlock[]` where `BlogBlock = {kind:"p"|"h2", text}`.
- **Translate:** every `body[].text`. (Card title/summary/image alt come from `landing.ts` `stories` — module G — not here.)
- **Keep:** `kind`, `author` ("The Ptah Tours team" → translate to the natural team-byline in each language, consistently), `publishedISO`, `readMinutes`, slugs/keys.
- Header rule from source: bodies are original editorial — no fabricated quotes/stats/attributions. Hold that line in translation.
- **Output:** `docs/i18n/staging/<locale>/blog.<locale>.ts` exporting `postBodies<Locale>`.

## G. Homepage editorial (`src/content/landing.ts`) — All 6

- Exports incl.: `siteMeta{name,legalName,tagline}`, `heroSlides[]`, `inspiredTabs[]`, `planCta`, `fiftyCtas[]`, `kbygItems[]`, `tourTypes[]`, `stories[]` (11 blog cards: title/summary/image.alt/credit), `siteNav` (quickLinks/directLinks/buildTripCta/popularSearches + mega-menu `sections`), `footerContent` (newsletter/badges/partners/socials/columns/legalLinks/copyrightLine/acknowledgement/cookie).
- **Translate:** all human labels/titles/subtitles/summaries/blurbs/`alt` text/headings/link labels/CTA text/newsletter copy/`acknowledgement`/`copyrightLine` (keep `{year}`)/cookie copy.
- **Keep:** `name`="Ptah Tours", `legalName` verbatim; all `src`/`href`/`iconKey`/`buttonType`/`trackingContext`; `credit`="Ptah Tours field archive"; social/partner URLs + names; badge org names (ETF, Travelife); numeric `xPct`/`yPct`/`days`/`experiences`; cookie category `key` enums.
- **Output:** `docs/i18n/staging/<locale>/landing.<locale>.ts` mirroring the exports (translated values).

## H. Image alt/caption overlays (P2) — All 6

- `theme-media.ts` (~50 imgs) + `city-media.ts` (~60, GENERATED) + `gallery.ts` (~47): each image has `alt` + (media files) `caption`. Many are proper-noun labels ("Karnak Temple") that stay ~identical; descriptive ones ("Carved columns of the Great Hypostyle Hall…") translate.
- **Mechanism (do NOT edit the generated files):** produce a per-locale overlay `Record<string,{alt:string; caption?:string}>` **keyed by the image `src` path** (NOT slug — slugs are not globally unique across theme/city media, e.g. `red-sea-mountains` appears under both `deserts` and `red-sea`, and gallery photos have no slug). Dev phase merges it in the image resolver by `src` with English fallback.
- **Output:** `docs/i18n/staging/<locale>/alt-overlay.<locale>.ts`. Keep `credit`/`creator`/`license`/`page`/`src` OUT — alt + caption only.
- If budget is tight, translators do P0/P1 first and leave H for a follow-up pass; note it in `notes.md`.

## I. UI supplemental — hardcoded English in JSX/metadata (All 6)

These live in code today, not in any dictionary. The DEV phase extracts them into page-content keys; translators supply the values now so dev can wire them in one pass. Produce `docs/i18n/staging/<locale>/ui-supplemental.<locale>.ts` exporting a flat object with EXACTLY these keys (English canonical shown):

```
cityNav.overview      = "Overview"
cityNav.tours         = "Tours"
cityNav.thingsToDo    = "Things to do"
cityNav.explore       = "Explore"
cityNav.photos        = "Photos"
cityNav.plan          = "Plan your visit"
cityNav.faq           = "FAQ"
cityPlanHeading       = "Plan your visit to {name}"      // keep {name}
cityViewOnMaps        = "View {name} on Google Maps"      // keep {name}
siteMetaDescription   = "Private and small-group journeys across Egypt — pyramids at dawn, Nile cruises, Red Sea reefs — designed end to end by the Cairo team."
heroOgAlt             = "The Great Pyramid of Khufu and the Sphinx at Giza in warm morning light."
```

Source refs (dev phase): `cities/[slug]/page.tsx` navSections (L139–147), "Plan your visit to {city.name}" (L237), "View … on Google Maps" (L268); `[lang]/layout.tsx` generateMetadata description (L42–43) + hero OG alt (L52). For Russian these can instead be folded into `pages.ru.ts` if the dev phase adds the keys to `enPages`; produce the file anyway for parity.

---

## DEV-phase notes (not translation work — recorded so nothing is missed)

- Build the **editorial localization mechanism**: per-locale content modules mirroring each English module + a `get<Module>(locale)` loader with English fallback, matching the existing `getDictionary`/`getPageContent` idiom (`satisfies` shape check + dynamic import code-split).
- **Add `ru`** to `src/i18n/config.ts`: `locales` array, `localeNames` ("Русский"), `localeHtmlLang` ("ru"), `localeOgLocale` ("ru_RU"). Do NOT add to `rtlLocales`. `en` stays first.
- **Cyrillic fonts** (`src/lib/fonts.ts`): Cabin + Playfair are `subsets:["latin"]` only → add `"cyrillic"` so Russian doesn't fall back to Arial.
- Register `ru` loaders in `dictionaries/index.ts`, `pages/index.ts`, and add the `ru` entry to `pwa.ts`.
- Fix `formatBlogDate` (`blog.ts`) — hardcodes `Intl.DateTimeFormat("en-US")`; make it locale-aware.
- No change needed (iterate locales dynamically): `proxy.ts`, `routing.ts`, `sitemap.ts`, `robots.ts`, `LocaleSwitcher`, `generateStaticParams`.

