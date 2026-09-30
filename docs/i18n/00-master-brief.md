# Ptah Tours — Site Translation Initiative · Master Brief

**Status:** Phase 1 (foundation). Branch `feat/i18n-russian-editorial`.
**Read order for every agent:** this brief → `01-glossary-termbase.md` → `02-source-inventory.md` → your own brief in `briefs/`.

## The goal (in plain words)

Make the Ptah Tours public website fully multilingual. Two jobs:

1. **Add Russian (`ru`) as a complete 7th language** — everything an existing language has, Russian must have too.
2. **Close the editorial gaps** — some rich page copy (theme pages, city pages, blog articles, the homepage) was written in English only and currently shows English in every language. Translate it into all six non-English languages: Arabic, French, German, Spanish, Italian, Russian.

The site already ships in English (`en`, source) + Arabic, French, German, Spanish, Italian. For those five, the **UI/chrome and page-content dictionaries are already fully translated** — do NOT redo them. The only gap for those five is the editorial content listed in the inventory. Russian is the exception: it needs the dictionaries *and* the editorial.

## Scope

**In scope (code-level, previewable on Vercel):**
- UI strings + page-content dictionaries (Russian only — the other five exist).
- English-first editorial modules: theme pages, city pages, blog article bodies, homepage sections, image alt text.
- PWA install/update strings (Russian only).

**Out of scope (do NOT touch):**
- Live-database operator/catalog content (tours, prices, operator copy).
- Admin panel, API routes, system emails — these stay English by product decision.
- Any `src/` file. Phase 1 + 2 write ONLY into `docs/i18n/staging/` and `docs/i18n/verification/`. Source code is wired up later, by the dev phase, after CEO review + user approval.

## The pipeline and its gates

```
Phase 1  Foundation docs (this)                    ← orchestrator
Phase 2  3 translation agents + 1 senior verifier  ← writes ONLY to docs/i18n/staging + /verification
── GATE: gstack CEO review (/plan-ceo-review) ── pause for user approval ──
Phase 4  2–3 dev agents wire it into src/, run tsc + lint
── GATE: Vercel preview ── merge ONLY after explicit user OK ──
```

Nothing in `src/` changes until after the CEO review passes AND the user approves. No push to `main`. No merge without the user previewing on Vercel.

## The translation team (Phase 2)

| Agent | Owns | Languages | Notes |
|-------|------|-----------|-------|
| **Agent RU** | Chrome dict + page-content + PWA + ALL editorial | Russian | Heaviest; one linguistic voice for all of Russian. |
| **Agent AR-FR-DE** | Editorial modules only | Arabic, French, German | Chrome/page-content already exist in code. |
| **Agent ES-IT** | Editorial modules only | Spanish, Italian | Same as above. |
| **Verifier** | Independent accuracy + shape review of ALL output | all 6 | Senior linguist (40+ yr). Runs after translators. Flags every low-confidence line; never rubber-stamps. |

## Non-negotiable rules (all agents)

1. **Preserve structure exactly.** Mirror the English module's keys, nesting, and array order 1:1. Translate only human-readable string *values*. A missing or renamed key breaks the compile-time `satisfies` shape check.
2. **Preserve interpolation tokens verbatim** — `{year}`, `{name}`, `{current}`, `{total}`, `{methods}`, and any `{...}`. Keep the braces and the token spelling; move them where the target grammar needs them. Never translate the token itself.
3. **Never translate** these values: `src`/image paths, `href`, url/`page` links, `slug`/`heroSlug`/`image` ids, `icon`/`iconKey` names, enum values (`band`, cookie `key`, `kind`, `buttonType`, `category`), numeric fields, license strings, credit lines (`Ptah Tours field archive`), and brand/partner proper names. See the glossary for the full list.
4. **Brand + place-name policy** — see `01-glossary-termbase.md`. "Ptah Tours" is never translated. Egyptian place names follow the per-language policy there.
5. **Facts are sacred.** This copy contains real history, dates, distances and museum facts (e.g. the Grand Egyptian Museum opened fully on 1 November 2025; Tutankhamun's mummy remains in the Valley of the Kings). Translate meaning faithfully — never add, drop, round differently, or invent a fact. If a claim is ambiguous in the target language, keep it literal and flag it for the verifier.
6. **No fabrication.** No invented quotes, statistics, attributions, or place names.
7. **Tone:** warm, expert, editorial — a knowledgeable local host, not a brochure. Match each language's natural register (formality rules per language in the glossary).
8. **When unsure, flag — don't guess.** Leave the best translation, add a `⚠` note in your `notes.md` with the file, key path, and the doubt. The verifier depends on honest flags.

## Output format

- Each translator writes real TypeScript modules into `docs/i18n/staging/<locale>/` that mirror the English source exactly (same shape, translated values). Exact filenames + export names are in your agent brief.
- Each translator writes a `notes.md` in their locale folder: decisions made, terms coined, and every `⚠` low-confidence item (file · key path · reason).
- The verifier writes `docs/i18n/verification/report-<locale>.md` per language + a `summary.md`.

## Quality bar

Target is faithful, publishable, native-quality copy. Honesty about uncertainty beats false confidence — an LLM pass is strong but is not a substitute for a native human sign-off, so every doubtful line must be visibly flagged, not silently smoothed over. The verifier's flags feed the CEO review and the eventual human proofread.
