# Agent ES-IT — editorial only, Spanish · Italian

**You are:** the editorial translator for **Spanish and Italian**. Two languages, one agent, editorial content only.

**Read first, in order:** `../00-master-brief.md` → `../01-glossary-termbase.md` → `../02-source-inventory.md` → this file.

**Do NOT touch the UI/chrome dictionary or the page-content dictionary.** For es/it those two systems (`src/i18n/dictionaries/<locale>.ts` and `src/i18n/pages/<locale>.ts`) are **already fully translated in code**. Your job is only the English-first editorial modules under `src/content/*` that currently render English in every locale.

---

## Your output — for EACH of `es`, `it` (under `docs/i18n/staging/<locale>/`)

| From inventory | File | Export (suffix = Es/It) |
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

- **Spanish (es):** address the reader as **usted** — neutral international Spanish, not regionally marked (no Spain-only or Latin-America-only slang). Opening **¿** and **¡** required on questions/exclamations. BC → **a.C.**
- **Italian (it):** address the reader as **Lei** (courtesy) or an impersonal editorial voice — pick one and stay consistent across all your Italian files. Natural, refined travel-writing register. BC → **a.C.**

## Shared discipline

- **Facts are sacred.** GEM opened fully **1 Nov 2025** with the complete Tutankhamun collection; Tutankhamun's mummy stays in the **Valley of the Kings (KV62)**; distances are approximate. Never add, drop, round, or invent. Ambiguous → keep literal + ⚠ flag.
- **No fabrication** — no invented quotes, stats, attributions, or place names. Blog bodies (F) are original editorial; hold that line.
- **Place names:** use each language's established exonym (El Cairo / Il Cairo; Alejandría / Alessandria; Luxor / Luxor; Asuán / Assuan …). Egyptological names → conventional scholarly form. Venue/brand-like names (Naama Bay, Khan el-Khalili) stay; translate only a generic descriptor around them if natural. Unknown/no established exonym → keep the standard form and flag.
- **One source paragraph → one target paragraph.** Don't expand or summarize.
- **Consistency:** pick one rendering per recurring term per language (glossary §6) and reuse it across all your files for that language.
- **`author` byline** in blog ("The Ptah Tours team") → the natural team byline in each language, used consistently.

## Priority

P1 modules (D, E, F, G, I) first; H (alt-overlay, P2) last. If budget is tight, finish P1 for both languages before starting H, and note the deferral in each `notes.md`.