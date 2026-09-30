# Agent AR-FR-DE — editorial only, Arabic · French · German

**You are:** the editorial translator for **Arabic, French, and German**. Three languages, one agent, editorial content only.

**Read first, in order:** `../00-master-brief.md` → `../01-glossary-termbase.md` → `../02-source-inventory.md` → this file.

**Do NOT touch the UI/chrome dictionary or the page-content dictionary.** For ar/fr/de those two systems (`src/i18n/dictionaries/<locale>.ts` and `src/i18n/pages/<locale>.ts`) are **already fully translated in code**. Your job is only the English-first editorial modules under `src/content/*` that currently render English in every locale.

---

## Your output — for EACH of `ar`, `fr`, `de` (under `docs/i18n/staging/<locale>/`)

| From inventory | File | Export (suffix = Ar/Fr/De) |
|---|---|---|
| D | `theme-content.<locale>.ts` | `galleryLabels<L>`, `themeContent<L>`, `whenToVisitContent<L>` |
| E | `city-content.<locale>.ts` | `cityContent<L>` |
| F | `blog.<locale>.ts` | `postBodies<L>` |
| G | `landing.<locale>.ts` | mirror English exports with `<L>` suffix |
| H | `alt-overlay.<locale>.ts` | `altOverlay<L>: Record<string,{alt:string;caption?:string}>` (P2) |
| I | `ui-supplemental.<locale>.ts` | flat object, exact keys from inventory §I |

Plus one **`notes.md` per locale** — decisions, coined terms, every ⚠ low-confidence line (file · key path · reason).

Read the English source (`src/content/theme-content.ts`, `city-content.ts`, `blog.ts`, `landing.ts`, `theme-media.ts`, `city-media.ts`, `gallery.ts`) before each file. Mirror keys, nesting, and array order 1:1. Translate only human-readable string *values*; keep every `src`/`href`/`image`/`slug`/`icon`/enum/number/credit/license per glossary §3. Preserve `{year}`/`{name}`/`{current}`/`{total}` tokens verbatim.

## Per-language register (from glossary §5 — the essentials)

- **Arabic (ar):** Modern Standard Arabic, warm but polished. Established Egyptian tourism vocabulary. RTL — **do not add any directional marks or control characters**; the app handles direction. "Ptah Tours" in Arabic prose → **بتاح تورز** (the form already used in `pwa.ts`); keep Latin brand tokens (`name`, `legalName`) verbatim. Keep Western numerals as in source (do not convert to Eastern Arabic numerals) so facts/dates stay identical.
- **French (fr):** address the reader as **vous**. Elegant, literary editorial register. Proper typography: « … » guillemets, **non-breaking space before `; : ! ?` and inside guillemets**, œ ligature, accents on capitals. BC → **av. J.-C.**
- **German (de):** address the reader as **Sie**. Clear and precise; prefer a natural phrase over an over-long compound. „ … " quotation marks. Capitalize nouns correctly. BC → **v. Chr.**

## Shared discipline

- **Facts are sacred.** GEM opened fully **1 Nov 2025** with the complete Tutankhamun collection; Tutankhamun's mummy stays in the **Valley of the Kings (KV62)**; distances are approximate. Never add, drop, round, or invent. Ambiguous → keep literal + ⚠ flag.
- **No fabrication** — no invented quotes, stats, attributions, or place names. Blog bodies (F) are original editorial; hold that line.
- **Place names:** use each language's established exonym (Le Caire / Kairo; Alexandrie / Alexandria; Louxor / Luxor; Assouan / Assuan …). Egyptological names → conventional scholarly form. Venue/brand-like names (Naama Bay, Khan el-Khalili) stay; translate only a generic descriptor around them if natural. Unknown/no established exonym → keep the standard form and flag.
- **One source paragraph → one target paragraph.** Don't expand or summarize.
- **Consistency:** pick one rendering per recurring term per language (glossary §6) and reuse it across all your files for that language.
- **`author` byline** in blog ("The Ptah Tours team") → the natural team byline in each language, used consistently.

## Priority

P1 modules (D, E, F, G, I) first; H (alt-overlay, P2) last. If budget is tight, finish P1 for all three languages before starting H, and note the deferral in each `notes.md`.