# Verification report — Italian (it)

**Verdict:** PASS WITH FLAGS (structural + spot verification; native-fluency sign-off pending human proofread)

> **Provenance:** orchestrator-run gateway-resilient inline pass (dedicated verifier agent failed on the inference gateway). Compile-time shape check + evidence sweeps + spot-reads. Independent of the translator, but not a substitute for a native-Italian proofread.

## Coverage
- **Editorial (in scope):** `theme-content.it.ts` (D), `city-content.it.ts` (E), `blog.it.ts` (F), `landing.it.ts` (G), `ui-supplemental.it.ts` (I) — **present**.
- **P2:** `alt-overlay.it.ts` (H) — **partial** (~48 of ~158 image keys; ends at a `/*__TAIL__*/` marker before the closing brace). Present entries are valid; remaining keys fall back to English alt.
- Chrome + page-content dictionaries pre-existing — out of scope. `notes.md` present.

## Shape parity
- Scoped `tsc --noEmit` = **exit 0**; `typeof`-annotated exports mirror English 1:1. The partial `alt-overlay.it.ts` is a `Record` (partial by design, English fallback) so it compiles cleanly despite covering a subset.

## Findings
| Sev | File | Key path | Issue | Fix |
|---|---|---|---|---|
| 🟡 | (whole locale) | register | Confirm the courtesy voice is consistent — the file uses Lei (e.g. "…di cui i Suoi figli parleranno per anni."); verify it never drifts to tu or an impersonal voice mid-file. | Native proofread |
| 🟢 | alt-overlay.it.ts | — | Partial coverage (gateway). Missing image keys fall back to English alt. | Follow-up pass to complete + remove `/*__TAIL__*/` marker |

## Evidence checked (clean)
- **Brand:** `legalName` = "Ptah Tours for Tourism LLC" verbatim; "Ptah Tours" kept Latin.
- **Tokens:** `{year}` in copyrightLine ("© {year} Ptah Tours. Tutti i diritti riservati."); `{name}` in ui-supplemental. Preserved.
- **Enums:** cookie `key` preferences/analytics/marketing verbatim (×3).
- **Place:** Il Cairo / Giza exonyms throughout (×45); consistent Egyptological forms.
- **Facts:** GEM 2025 + Tutankhamun present/consistent.
- **Register:** Lei courtesy voice; refined travel-writing register; spot-reads natural.

## Low-confidence lines (for human proofread)
- See `it/notes.md`. Register consistency (Lei) + completing the P2 alt-overlay are the human/follow-up items. No blockers found.
