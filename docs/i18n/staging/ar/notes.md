# Arabic (ar) editorial translation — notes

Scope: editorial content only. Files in this folder mirror the English SSOT
modules 1:1 (keys, nesting, array order); only human-readable string VALUES are
translated. The UI dictionary (`src/i18n/dictionaries/ar.ts`) and page dictionary
(`src/i18n/pages/ar.ts`) are already translated in code and were NOT touched.

## Deliverables (all typecheck-clean under the project tsconfig)

- `theme-content.ar.ts` — `galleryLabelsAr`, `themeContentAr`, `whenToVisitContentAr`
- `city-content.ar.ts` — `cityContentAr`
- `blog.ar.ts` — `postBodiesAr` (11 posts)
- `landing.ar.ts` — full landing mirror (`siteMetaAr`, `heroSlidesAr`,
  `inspiredTabsAr`, `planCtaAr`, `fiftyCtasAr`, `kbygItemsAr`, `tourTypesAr`,
  `storiesAr`, `siteNavAr`, `footerContentAr`, `landingContentAr`)
- `ui-supplemental.ar.ts` — `uiSupplementalAr` (flat, exact inventory keys)
- `alt-overlay.ar.ts` — `altOverlayAr` (P2)

## Register / conventions applied

- Modern Standard Arabic; warm, polished editorial tone; `vous`-equivalent formality.
- RTL text only — NO directional marks or control chars (LRM/RLM/embeds/isolates/
  ALM/BOM). Verified programmatically: 0 across all ar files.
- Western (Arabic-Indic-free) numerals kept, e.g. `2025`, `62`, distances/counts.
- Tokens preserved verbatim: `{year} {name} {current} {total}`.
- Brand handling: "Ptah Tours" → بتاح تورز in prose; kept Latin in structured
  fields `name` ("Ptah Tours"), `legalName` ("Ptah Tours for Tourism LLC"), and in
  every `credit` string ("Ptah Tours field archive …"). Team byline → فريق بتاح تورز.
- Never translated (kept verbatim): src/href/image/heroSlug/slug/icon/iconKey,
  enums (band, cookie keys, kind, buttonType, trackingContext), numeric fields
  (xPct/yPct/days/experiences/wideAt/width/height), license/credit/creator/page,
  partner + badge + social proper names (Egypt Air, IATA, Travelife, ETF,
  Visit Egypt). "Google" kept Latin; "Maps" → خرائط (→ "خرائط Google").
- Era: BC → ق.م. Guillemets not used (Arabic quotation handled inline).
- Fixed facts kept exactly, never rounded/invented: GEM opened fully 1 November
  2025 with the complete Tutankhamun collection; Tutankhamun's mummy in the Valley
  of the Kings (KV62); distances left approximate as in source.

## Coined / standardized terms (consistency contract, reused across all ar files)

- felucca → فلوكة (pl. فلايك); dahabiya → دهبية; snorkelling → السنوركل; diving → الغوص.
- Place/name base: القاهرة، الجيزة، الأقصر، أسوان، الإسكندرية، الكرنك، سيناء، النيل،
  البحر الأحمر، وادي الملوك، أبو سمبل، الغردقة، شرم الشيخ، طيبة، سقارة، معبد فيلة،
  كوم أمبو، إدفو، دندرة، النوبة، رأس محمد، دير سانت كاترين، جبل سيناء، خان الخليلي،
  قلعة قايتباي، الثقب الأزرق، دهب، الجندل الأول، المتحف المصري الكبير (GEM)، أبو الهول،
  خوفو، خفرع، حتشبسوت، رمسيس الثاني، زوسر، واحة سيوة، الواحات البحرية، الصحراء البيضاء،
  الصحراء السوداء، وادي الحيتان.

## Structural decision (deviation flag) — alt-overlay keying

The inventory (§H) describes the alt-overlay as "slug-keyed". I keyed `altOverlayAr`
by each image's `src` path instead, because slugs are NOT globally unique across the
source media modules — e.g. slug `red-sea-mountains` appears in BOTH
`themeMedia.deserts` and `themeMedia.red-sea` with different images/alt — and the
gallery photos (`src/content/gallery.ts`) carry no slug at all. The `src` path is the
only globally unique, stable key spanning all three sources. Values contain only
`{ alt, caption? }`; credit/creator/license/page/src are kept out of the values, per §H.
- Gallery entries: `{ alt }` only (source has no caption field).
- theme-media + city-media entries: `{ alt, caption }` (source alt === caption; kept identical).
- Coverage: 158 images = 48 gallery + 50 theme-media + 60 city-media.
  (Note: gallery has 48 photos in source — guests 18, temples 21, nile-nubia 6,
  sinai-desert 3 — not the ~47 estimated in an earlier planning note.)

## Low-confidence items (⚠) — file · key · reason

- ⚠ alt-overlay.ar.ts · /assets/cities/aswan/03-philae-temple.webp · "Agilkia Island"
  → "جزيرة أجيلكيا": transliteration; Arabic spelling varies (أجيلكيا / أجيليكا).
- ⚠ alt-overlay.ar.ts · /assets/cities/hurghada/02..10 · "Giftun Island" → "جزيرة الجفتون":
  transliteration; also seen as الغفتون. Chose الجفتون (more common).
- ⚠ alt-overlay.ar.ts · /assets/cities/sharm-el-sheikh/03,04,05 · "Ras Mohamed" /
  "Ras Mohammed" (two Latin spellings in source for one place) → unified "رأس محمد";
  "…National Park" → "محمية رأس محمد".
- ⚠ alt-overlay.ar.ts · /assets/themes/deserts/04-siwa-oracle-temple.webp ·
  "Oracle of Amun" → "معبد وحي آمون": descriptive rendering (alt: معبد التنبّؤ).
- ⚠ alt-overlay.ar.ts · /assets/gallery/sinai-desert-01.webp · "Colored Canyon"
  → "الوادي الملوّن": also known as الكانيون الملوّن.
- ⚠ "Colossi of Memnon" → "تمثالا ممنون" (Arabic dual): standard but flagged as a
  non-literal number form (source "Colossi" plural).
- ⚠ blog.ar.ts · every post · `author` → "فريق بتاح تورز": coined byline consistent
  with the team-byline convention (source author values were the English team byline).
