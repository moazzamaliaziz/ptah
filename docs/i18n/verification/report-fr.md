# Verification report — French (fr)

**Verdict:** PASS WITH FLAGS (structural + spot verification; native-fluency sign-off pending human proofread)

> **Provenance:** orchestrator-run gateway-resilient inline pass (dedicated verifier agent failed on the inference gateway). Compile-time shape check + evidence sweeps + spot-reads. Independent of the translator, but not a substitute for a native-French proofread.

## Coverage
- **Editorial (in scope):** `theme-content.fr.ts` (D), `city-content.fr.ts` (E), `blog.fr.ts` (F), `landing.fr.ts` (G), `ui-supplemental.fr.ts` (I) — **present**.
- **P2:** `alt-overlay.fr.ts` (H) — **deferred / not written** (gateway; English alt fallback).
- Chrome + page-content dictionaries pre-existing — out of scope. `notes.md` present.

## Shape parity
- Scoped `tsc --noEmit` = **exit 0**; `typeof`-annotated exports mirror English 1:1.

## Findings
| Sev | File | Key path | Issue | Fix |
|---|---|---|---|---|
| 🟡 | (whole locale) | typography | Confirm consistent guillemets « » with non-breaking spaces and NBSP before `; : ! ?` throughout, and accents on capital letters — spot-reads look correct but full-file typographic audit is a human task. | Native proofread |
| 🟢 | alt-overlay.fr.ts | — | P2 not produced (gateway). Images fall back to English alt. | Follow-up pass |

## Evidence checked (clean)
- **Brand:** `legalName` = "Ptah Tours for Tourism LLC" verbatim; "Ptah Tours" kept Latin (never translated).
- **Tokens:** `{year}` in copyrightLine ("© {year} Ptah Tours…"); `{name}` in ui-supplemental — "Voir {name} sur Google Maps" / "Préparer votre visite : {name}". Preserved.
- **Enums:** cookie `key` preferences/analytics/marketing verbatim (×3).
- **Place:** Le Caire exonym used throughout (×43); no untranslated "Cairo".
- **Facts:** GEM 2025 + Tutankhamun present/consistent.
- **Register:** vous throughout; elegant editorial register; spot-reads natural (e.g. blog close "…le voyage dont vos enfants parleront pendant des années.").

## Low-confidence lines (for human proofread)
- See `fr/notes.md`. Typographic consistency (NBSP/guillemets) is the main human-review item. No blockers found.
