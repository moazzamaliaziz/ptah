# Verification report — Spanish (es)

**Verdict:** PASS WITH FLAGS (structural + spot verification; native-fluency sign-off pending human proofread)

> **Provenance:** orchestrator-run gateway-resilient inline pass (dedicated verifier agent failed on the inference gateway). Compile-time shape check + evidence sweeps + spot-reads. Independent of the translator, but not a substitute for a native-Spanish proofread.

## Coverage
- **Editorial (in scope):** `theme-content.es.ts` (D), `city-content.es.ts` (E), `blog.es.ts` (F), `landing.es.ts` (G), `ui-supplemental.es.ts` (I), `alt-overlay.es.ts` (H) — **all present**.
- Chrome + page-content dictionaries pre-existing — out of scope. `notes.md` present.

## Shape parity
- Scoped `tsc --noEmit` = **exit 0**; `typeof`-annotated exports mirror English 1:1. (`theme-content.es.ts` is more compactly formatted than the ar/de siblings but has all three exports and passes the `typeof` check — no missing content.)

## Findings
| Sev | File | Key path | Issue | Fix |
|---|---|---|---|---|
| 🟡 | (whole locale) | punctuation | Confirm opening ¿ and ¡ on every question/exclamation and neutral international register (no region-specific slang) across all files — spot-reads correct. | Native proofread |

## Evidence checked (clean)
- **Brand:** `legalName` = "Ptah Tours for Tourism LLC" verbatim; "Ptah Tours" kept Latin.
- **Tokens:** `{year}` in copyrightLine ("© {year} Ptah Tours. Todos los derechos reservados." style); `{name}` in ui-supplemental. Preserved.
- **Enums:** cookie `key` preferences/analytics/marketing verbatim (×3).
- **Place:** El Cairo / Guiza exonyms used throughout (×45); Tutankamón (scholarly form), Gran Museo Egipcio — consistent.
- **Facts:** GEM "abrió por completo el 1 de noviembre de 2025" + complete Tutankhamun collection — present and consistent (4 in-body mentions).
- **Register:** usted; refined editorial; spot-reads natural (e.g. "…el viaje del que sus hijos hablarán durante años.").

## Low-confidence lines (for human proofread)
- See `es/notes.md`. Punctuation completeness (¿¡) is the main human-review item. No blockers found.
