# French (fr) editorial translation — staging notes

Scope: `docs/i18n/staging/fr/` only. No `src/`, no dictionaries, no other locale
was touched. English-first editorial modules are mirrored 1:1 (keys, nesting,
array order); only human-readable string VALUES are translated. Structural fields
kept verbatim: icon/image slugs, `href`, `src`/`mid`/`wide`, `wideAt`, `iconKey`,
`buttonType`, `trackingContext`, `xPct`/`yPct`, `days`/`experiences`,
`season`/`key`/`id` enums, `network`, `name`/`legalName`, `credit`,
`publishedISO`/`readMinutes`, `kind`, `{year}`, `{name}`, cookie category `key`.

## Deliverables
- `theme-content.fr.ts` → `galleryLabelsFr`, `themeContentFr`, `whenToVisitContentFr`
- `city-content.fr.ts` → `cityContentFr` (6 cities)
- `blog.fr.ts` → `postBodiesFr` (11 posts)
- `landing.fr.ts` → 11 exports mirrored with `Fr` suffix (`siteMetaFr` …
  `landingContentFr`)
- `ui-supplemental.fr.ts` → `uiSupplementalFr` (flat dotted keys, `as const`)

## Typography conventions
- Register: **vous** throughout.
- Files are authored with NATURAL spacing; a final Node pass (see below) inserts
  real U+00A0 (NBSP): inside « … », and before `;` `:` `!` `?`, plus thousands.
- Apostrophe: U+2019 (’) everywhere (l’, d’, etc.).
- œ ligature; accented capitals (À, É); em dash — kept from source where present.
- Guillemets « » used for quoted terms; BC → « av. J.-C. ».

## Numbers
- Thousands separator = NBSP (script-inserted). Units kept (km, °C, m).
- YEARS carry NO separator: 1902, 1970, 1983, 2025, 331, « années 1960 ».
- Distances stay approximate (« environ », « quelque … km ») — never rounded,
  added, or dropped.

## Facts preserved verbatim (never altered)
- Grand Musée égyptien (GEM) : ouverture complète le **1er novembre 2025**, avec
  la **collection complète de Toutânkhamon**.
- La momie de Toutânkhamon reste dans la tombe **KV62**, vallée des Rois.
- All distances kept approximate exactly as in the source.

## Term base (reused across all fr files)
- tour → circuit ; day trip → excursion à la journée ; felucca → felouque ;
  dahabiya → dahabieh ; diving → plongée ; snorkeling → snorkeling (kept).
- Le Caire, Gizeh, Louxor, Assouan, Alexandrie, Nubie, mer Rouge, vallée des
  Rois, Nouvel Empire, Sept Merveilles.
- Grand Musée égyptien ; Musée égyptien (place Tahrir) ; Musée national de la
  civilisation égyptienne. Citadelle de Saladin ; mosquée de Méhémet Ali ;
  Cité aux mille minarets ; église suspendue ; Khan el-Khalili ; Saqqarah ;
  Memphis ; Zamalek.
- Karnak / grande salle hypostyle / 134 colonnes ; temple de Louxor ; temple
  d’Hatchepsout ; Deir el-Bahari ; Médinet Habou ; Ramsès II/III ; colosses de
  Memnon ; KV62 ; Toutânkhamon.
- Abou Simbel ; lac Nasser ; temple de Philae / déesse Isis ; île d’Agilkia ;
  île Éléphantine ; île Kitchener ; haut barrage d’Assouan ; obélisque inachevé.
- Alexandre le Grand ; 331 av. J.-C. ; phare de Pharos ; Bibliotheca Alexandrina
  (kept) ; citadelle de Qaitbay ; catacombes de Kôm el-Chogafa ; colonne de
  Pompée ; Sérapéum ; Corniche ; Montaza ; aéroport de Borg El Arab.
- Île de Giftun ; Orange Bay (kept) ; désert Oriental ; désert Occidental ;
  désert Blanc ; bédouin ; El Dahar (kept) ; marina.
- Ras Mohammed ; île de Tiran ; Naama Bay (kept) ; monastère Sainte-Catherine ;
  mont Sinaï ; Moïse ; golfe d’Aqaba ; Sud-Sinaï ; Arabie saoudite ; péninsule
  du Sinaï. Charm el-Cheikh. Blue Hole / Ras Abu Galum / Dahab (kept).
- Khéops (Khufu) ; Khéphren (Khafre) ; Dendérah (Dendera) ; Kôm Ombo (Kom Ombo).

## WARN — low-confidence / coined renderings (file · key · reason)
- **WARN** theme-content.fr.ts, city-content.fr.ts, landing.fr.ts · felucca →
  « felouque » · standard FR term, applied uniformly.
- **WARN** landing.fr.ts (`tourTypesFr[2]`, `storiesFr` first-cruise),
  city-content.fr.ts · dahabiya → « dahabieh » · transliteration choice.
- **WARN** city-content.fr.ts (cairo) · Muhammad Ali → « Méhémet Ali » · French
  historical exonym for the mosque/pasha.
- **WARN** landing.fr.ts (hero giza/blue-hole, `tourTypesFr`), ui-supplemental
  (`heroOgAlt`), city-content.fr.ts · Khufu/Khafre → « Khéops »/« Khéphren » ·
  French royal-name convention.
- **WARN** city-content.fr.ts (alexandria) · Kom el-Shoqafa → « catacombes de
  Kôm el-Chogafa » · transliteration.
- **WARN** landing.fr.ts (`tourTypesFr[2]`, `siteNavFr`, `storiesFr`),
  city-content.fr.ts · Sharm El Sheikh → « Charm el-Cheikh » in VALUES, while the
  route slug/key stays latin `sharm-el-sheikh` (and hero slug
  `ras-mohammed-panoramio`) — intentional split.
- **WARN** landing.fr.ts, theme-content.fr.ts, city-content.fr.ts · « snorkeling »
  kept as the activity noun (standard FR tourism usage); « plongée » reserved for
  diving only.
- **WARN** ui-supplemental.fr.ts · `cityPlanHeading` = « Préparer votre visite :
  {name} » · colon avoids the « au Caire » contraction problem with the `{name}`
  token.
- **WARN** landing.fr.ts (`storiesFr` beyond-giza) · Dendera → « Dendérah »,
  Kom Ombo → « Kôm Ombo » · transliteration/accents.
- **WARN** landing.fr.ts (`footerContentFr.partners`) · "Egyptian Tourism
  Authority" → « Office de tourisme égyptien » · descriptor rendering, not an
  official name; partner `name`/`href` kept verbatim.
- **WARN** landing.fr.ts (`footerContentFr.acknowledgement`, `tourTypesFr[3]`) ·
  « désert Occidental » / « désert Blanc » · capitalization convention.
- **WARN** landing.fr.ts (`siteNavFr` journal column) · "Alexandria's Soul" →
  « L’âme d’Alexandrie » · condensed for menu fit (full story title differs).
- **WARN** theme-content.fr.ts · any "miles" unit · kept as-is per glossary.

## Deferrals
- P2 `alt-overlay.fr.ts` (`altOverlayFr`): see status at end of run.

<!-- MORE -->

