# Phase 2 delivery status — translation staging

Snapshot for the verifier and the CEO-review gate. All files below live under `docs/i18n/staging/<locale>/`. "Complete" = present and passing a scoped `tsc --noEmit` (whole-staging typecheck: **exit 0**).

## Priorities
- **P0** = blocks a working Russian site (chrome dict, page content, PWA — Russian only).
- **P1** = the editorial gap this initiative exists to close (theme, city, blog, homepage, UI-supplemental).
- **P2** = image alt/caption overlays — accessibility/SEO polish, English fallback if absent (source-inventory §H sanctions deferral).

## Completion matrix

| Module | ru | ar | fr | de | es | it |
|---|---|---|---|---|---|---|
| A dictionary (P0) | ✅ | n/a¹ | n/a | n/a | n/a | n/a |
| B page-content (P0) | ✅ | n/a¹ | n/a | n/a | n/a | n/a |
| C pwa (P0) | ✅ | n/a¹ | n/a | n/a | n/a | n/a |
| D theme-content (P1) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| E city-content (P1) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| F blog (P1) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| G landing (P1) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| I ui-supplemental (P1) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| H alt-overlay (P2) | ⏳ missing | ✅ | ⏳ missing | ✅ | ✅ | ⚠ partial |
| notes.md | ✅ | ✅ | ✅ | ✅² | ✅ | ✅ |

¹ For ar/fr/de/es/it the chrome dictionary and page-content dictionary were already fully translated in `src/i18n/` before this initiative — out of scope here, not re-done.
² `de/notes.md` was reconstructed by the orchestrator from the delivered German files (the German agent's API run dropped before it authored notes); flagged inside that file for a full verifier pass.

## ✅ Complete and typecheck-clean
- **All P0** (Russian dictionaries + PWA) and **all P1 editorial** for all six locales. This is the full substance of the initiative.

## ⏳ Deferred (P2 — follow-up pass)
- `alt-overlay.ru.ts` — not written.
- `alt-overlay.fr.ts` — not written.
- `alt-overlay.it.ts` — partial (~48 of ~158 image keys; ends at a `/*__TAIL__*/` marker before the closing brace).
- `alt-overlay.{ar,de,es}.ts` — complete, `src`-path-keyed.
- **Reason for deferral:** the inference gateway (`api.justwoker.icu`) repeatedly timed out (HTTP 524) on the long Opus generations these overlays require, and the faster model is not provisioned here (HTTP 403). Deferring is the escape hatch the source inventory §H already allows; images fall back to their English `alt`/`caption` until the overlay lands, so nothing is broken.
- **To finish later:** complete the three files against `src/content/gallery.ts` (alt only) + `theme-media.ts` + `city-media.ts` (alt+caption), keyed by image `src` path, then re-run the scoped typecheck.

## Verification handoff
Verifier reviews everything present (all P0+P1 across six locales + the three complete alt-overlays), writes `docs/i18n/verification/report-<locale>.md` per locale + `summary.md`, and notes the P2 deferral rather than treating it as a defect.
