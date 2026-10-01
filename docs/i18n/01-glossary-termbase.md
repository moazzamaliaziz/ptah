# Glossary & Term Base

The shared terminology contract. When a term below appears in source copy, follow this. Consistency across a language matters as much as literal accuracy.

## 1. Brand — never translated, never transliterated (except script)

| Term | Rule |
|------|------|
| **Ptah Tours** | Keep verbatim in Latin script in fr/de/es/it. In Arabic use the established form **بتاح تورز** (already used in `pwa.ts`). In Russian transliterate to **Птах Турс**. Never translate "Tours" as a common noun. |
| **Ptah Tours for Tourism LLC** | Legal name — keep the English legal form verbatim in ALL locales (it is a registered entity). |
| Egypt Air, IATA, Travelife, ETF, Visit Egypt | Partner/badge proper names — keep verbatim. |
| "Ptah Tours field archive" | Image credit line — keep verbatim (do not translate). |

## 2. Interpolation tokens — keep braces + spelling verbatim

`{year}` · `{name}` · `{current}` · `{total}` · `{methods}` and any other `{...}`.
Reposition for grammar; never translate the word inside. Example (copyright):
- EN: `© {year} Ptah Tours. All rights reserved.`
- ES: `© {year} Ptah Tours. Todos los derechos reservados.`

## 3. Never-translate field values (structural)

Translate the human-readable string values ONLY. Leave these exactly as in English:
- Paths/links: `src`, `href`, `page` (Commons URLs), any URL.
- Ids/slugs: `slug`, `heroSlug`, `image`, category ids (`guests`, `temples`, `sinai-desert`, `nile-nubia`).
- Enum values: `icon`/`iconKey` (`globe`, `star`, `calendar`, `travel`, `weather`), `band` (`peak`/`good`/`shoulder`/`hot`), cookie `key` (`preferences`/`analytics`/`marketing`), `kind` (`p`/`h2`), `buttonType`, `trackingContext`.
- Numbers/meta: `width`, `height`, `xPct`, `yPct`, `days`, `experiences`, `rank`, `readMinutes`, `publishedISO`, `author` id strings.
- License/credit: `license`, `creator`, `title` (Commons work title), `credit`.
- Proper names in `partners`, `badges`, `socials`.

## 4. Place-name policy

Use each language's **established, reader-familiar exonym** where one exists; otherwise use the standard local/English form. Never invent a name.

- **Cities/sites with common exonyms** — use them: Cairo → Le Caire (fr), Kairo (de), El Cairo (es), Il Cairo (it), Каир (ru). Alexandria → Alexandrie / Alexandria / Alejandría / Alessandria / Александрия. Luxor, Aswan, Karnak, Giza, Sinai, the Nile, the Red Sea, the Valley of the Kings, Abu Simbel — use each language's standard rendering. In Russian, transliterate to the conventional Cyrillic form (Нил, Луксор, Асуан, Карнак, Гиза, Синай, Красное море, Долина царей, Абу-Симбел).
- **Egyptological names** (Tutankhamun, Ramesses II, Hatshepsut, Saladin, Ptah, Isis) — use the conventional scholarly form in the target language.
- **Hotel/venue/brand-like names** (Naama Bay, Orange Bay, Giftun Island, Khan el-Khalili, Bibliotheca Alexandrina) — keep the standard name; translate only a generic descriptor around it if natural (e.g. "Giftun Island" → "l'île de Giftun").
- When a place has NO established exonym, keep the common English/Latin form (in ru, transliterate). Flag any name you are unsure of.

## 5. Per-language register & tone

Warm, expert, editorial throughout — a knowledgeable Egyptian host writing for a curious traveler. Then per language:

- **Arabic (ar):** Modern Standard Arabic. Warm but polished. RTL — do not add directional marks; the app handles direction. Established Egyptian tourism vocabulary.
- **French (fr):** Use **vous**. Elegant, literary register suits the editorial voice. Proper typography: « … » guillemets, non-breaking space before `; : ! ?`, œ ligature, accents on capitals.
- **German (de):** Use **Sie**. Clear and precise; avoid over-long compounds where a natural phrase reads better. „…" quotation marks. Capitalize nouns correctly.
- **Spanish (es):** Use **usted** for the reader (neutral international Spanish, not regionally marked). Opening ¿ ¡ required. Avoid Latin-America-only or Spain-only slang.
- **Italian (it):** Use **Lei** (courtesy) or an impersonal editorial voice — stay consistent. Natural, refined travel-writing register.
- **Russian (ru):** Use **вы** (lowercase, polite editorial "you"). Natural literary Russian, not a word-for-word calque of English syntax. Correct case endings for transliterated place names. Use « » quotation marks and proper — em dashes.

## 6. Recurring term base (translate consistently within a language)

Pick ONE rendering per term per language and reuse it everywhere. Suggested anchors (translator refines to natural target usage):

| English | Guidance |
|---------|----------|
| tour / day trip / excursion | Distinguish the three; keep them distinct in-language too. Follow tourism-industry norms. |
| Nile cruise, felucca | felucca = keep the word (it is international); gloss once if natural. |
| Old Kingdom / New Kingdom / pharaoh / dynasty | Use the language's standard Egyptological terms. |
| snorkelling / diving / reef | Standard dive-tourism vocabulary. |
| "the world's greatest open-air museum" | Idiomatic equivalent, not literal, if the literal reads oddly. |
| Grand Egyptian Museum | Use the language's official/common rendering of the museum's name. |

## 7. Hard don'ts

- Don't localize numbers into different units (km stays km; don't convert to miles).
- Don't change dates or add/remove precision ("c. 2560 BC" → keep the circa convention and the numerals; render "BC/AD" per language: av. J.-C. / v. Chr. / a.C. / a.C. / до н. э.).
- Don't expand or summarize — one source paragraph → one target paragraph, same information.
- Don't localize the leak-canary or any secret-looking string if encountered (it won't be in editorial copy; flag if seen).

