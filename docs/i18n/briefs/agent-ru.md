# Agent RU — Russian, all surfaces

**You are:** the single Russian linguistic voice for the entire Ptah Tours site. One person, one register, every surface. Consistency across all your files matters as much as any single line.

**Read first, in order:** `../00-master-brief.md` → `../01-glossary-termbase.md` → `../02-source-inventory.md` → this file. The non-negotiable rules and the glossary are binding; this brief only adds Russian-specific detail and your file list.

**You own the most work of any agent:** Russian is a brand-new 7th locale, so it needs the UI dictionaries *and* all the editorial that the other two agents also do — but only in Russian.

---

## Your output files (all under `docs/i18n/staging/ru/`)

| From inventory | File | Export | Type source |
|---|---|---|---|
| A | `dictionary.ru.ts` | `export const ru = { … } satisfies Dictionary;` | `import type { Dictionary } from "@/i18n/dictionaries/en";` |
| B | `pages.ru.ts` | `export const ruPages = { … } satisfies PageContent;` | `import type { PageContent } from "@/i18n/pages/en";` |
| C | `pwa.ru.ts` | `export const pwaRu: PwaStrings = { … };` | `import type { PwaStrings } from "@/i18n/pwa";` |
| D | `theme-content.ru.ts` | `galleryLabelsRu`, `themeContentRu`, `whenToVisitContentRu` | typed against `typeof` the English exports |
| E | `city-content.ru.ts` | `cityContentRu` | `typeof cityContent` |
| F | `blog.ru.ts` | `postBodiesRu` | `typeof POST_BODIES` |
| G | `landing.ru.ts` | mirror the English exports, `Ru` suffix | `typeof` each |
| H | `alt-overlay.ru.ts` | `altOverlayRu: Record<string,{alt:string;caption?:string}>` | — |
| I | `ui-supplemental.ru.ts` | flat object, the exact keys in inventory §I | — |

Plus **`notes.md`** — every decision, coined term, and ⚠ low-confidence line (file · key path · reason).

Read the matching English source (`src/i18n/dictionaries/en.ts`, `src/i18n/pages/en.ts`, `src/i18n/pwa.ts`, `src/content/*`) before writing each file. Read the existing `fr`/`de` siblings (e.g. `dictionaries/fr.ts`, `pages/fr.ts`) as **structure examples only — never for content**. Mirror keys, nesting, and array order 1:1.

## Russian-specific rules (on top of the glossary §5 ru row)

- **Register:** polite editorial **вы** (lowercase). Natural literary Russian — never a word-for-word calque of English word order. Warm, expert, a knowledgeable Egyptian host writing for a curious traveler.
- **Punctuation:** « » guillemets for quotes; em dash — (with spaces) for dashes; proper Cyrillic typography throughout.
- **Brand:** "Ptah Tours" → **Птах Турс** in running Russian prose. But in structural fields that stay Latin (`siteMeta.name` = "Ptah Tours", `legalName` = "Ptah Tours for Tourism LLC") keep the English verbatim — see glossary §1/§3. When unsure whether a "Ptah Tours" occurrence is prose or a brand token, keep Latin and flag it.
- **Place names — transliterate to the conventional Cyrillic exonym:** Каир, Александрия, Луксор, Асуан, Хургада, Шарм-эль-Шейх, Нил, Луксор, Карнак, Гиза, Синай, Красное море, Долина царей, Абу-Симбел, Карнакский храм, Библиотека Александрина. Egyptological names use the standard scholarly Russian form (Тутанхамон, Рамсес II, Хатшепсут, Саладин, Птах, Исида). **Correct case endings** for every declined place name — this is where calques break.
- **BC/AD:** render "BC" → **до н. э.**, "AD" → **н. э.** Keep numerals and the circa convention exactly ("c. 2560 BC" → "ок. 2560 г. до н. э." — keep the number, keep "circa" as "ок.").
- **Units:** km stays km (км), °C stays, never convert. Numerals unchanged.
- **PWA `iosHint`:** English uses curly quotes; use « » in Russian.

## Priority order (if you run low on budget)

Do **P0 first** (A, B, C — these block a working Russian site), then **P1** (D, E, F, G, I), then **P2** (H alt-overlay). If you must stop before H, finish everything else and record the gap prominently in `notes.md`. Never leave a P0 file with missing keys — a missing key breaks the `satisfies` shape check.

## Facts you must not alter

Grand Egyptian Museum opened fully **1 November 2025** with the complete Tutankhamun collection; Tutankhamun's mummy remains in the **Valley of the Kings (KV62)**. Distances are approximate ("around/~"). Translate meaning faithfully; never add, drop, round, or invent. Ambiguous claim → keep literal + ⚠ flag.