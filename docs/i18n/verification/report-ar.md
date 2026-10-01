# Verification report — Arabic (ar)

**Verdict:** PASS WITH FLAGS (structural + spot verification; native-fluency sign-off pending human proofread)

> **Provenance:** orchestrator-run gateway-resilient inline pass (dedicated verifier agent failed on the inference gateway). Compile-time shape check + evidence sweeps + spot-reads. Independent of the translator, but not a substitute for a native-Arabic proofread.

## Coverage
- **Editorial (in scope):** `theme-content.ar.ts` (D), `city-content.ar.ts` (E), `blog.ar.ts` (F), `landing.ar.ts` (G), `ui-supplemental.ar.ts` (I), `alt-overlay.ar.ts` (H) — **all present**.
- Chrome dictionary + page-content were already translated in `src/i18n/` before this initiative — out of scope.
- `notes.md` present (7 ⚠ items logged by translator).

## Shape parity
- Scoped `tsc --noEmit` = **exit 0**; `typeof`-annotated exports mirror English 1:1. Directional-control-character scan by the translator = 0 (no LRM/RLM/embeds) — correct, app handles RTL.

## Findings
| Sev | File | Key path | Issue | Fix |
|---|---|---|---|---|
| 🟡 | blog.ar.ts / city-content.ar.ts | proper nouns | Translator flagged 7 transliteration choices (Agilkia, Giftun, Ras Mohamed→رأس محمد, Oracle of Amun→معبد وحي آمون, Colored Canyon→الوادي الملوّن, Colossi of Memnon→تمثالا ممنون dual, team byline). All reasonable; confirm against Egyptian tourism norms. | Native proofread |
| 🟢 | alt-overlay.ar.ts | keying | Keyed by `src` path (translator corrected the "slug" wording after finding slugs aren't globally unique) — matches the corrected inventory §H. | None |

## Evidence checked (clean)
- **Brand:** بتاح تورز ×17 in Arabic prose; `legalName` = "Ptah Tours for Tourism LLC" verbatim; blog `author` → فريق بتاح تورز (consistent).
- **Tokens:** `{year}` in copyrightLine; `{name}` in ui-supplemental keys — preserved.
- **Enums:** cookie `key` preferences/analytics/marketing verbatim (×3).
- **Place:** القاهرة used throughout (×44) — no untranslated "Cairo" leaking.
- **Facts:** GEM 2025 + Tutankhamun present/consistent; Western numerals retained (dates/distances not converted to Eastern Arabic numerals) — correct for fact fidelity.
- **Register:** MSA, warm editorial; spot-reads read naturally.

## Low-confidence lines (for human proofread)
- The 7 ⚠ items in `ar/notes.md` (proper-noun transliterations + byline). No blockers found.
