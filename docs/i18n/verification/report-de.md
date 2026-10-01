# Verification report — German (de)

**Verdict:** PASS WITH FLAGS (structural + spot verification; native-fluency sign-off pending human proofread — extra attention warranted, see below)

> **Provenance:** orchestrator-run gateway-resilient inline pass (dedicated verifier agent failed on the inference gateway). Compile-time shape check + evidence sweeps + spot-reads. Independent of the translator, but not a substitute for a native-German proofread. **German warrants a fuller human pass than the others** because the German translator agent's API run dropped before it authored its own `notes.md` — that file was reconstructed by the orchestrator from the delivered files, so there is no translator self-flag list to lean on.

## Coverage
- **Editorial (in scope):** `theme-content.de.ts` (D), `city-content.de.ts` (E), `blog.de.ts` (F), `landing.de.ts` (G), `ui-supplemental.de.ts` (I), `alt-overlay.de.ts` (H) — **all present**.
- Chrome + page-content dictionaries pre-existing — out of scope. `notes.md` present (reconstructed).

## Shape parity
- Scoped `tsc --noEmit` = **exit 0**; `typeof`-annotated exports mirror English 1:1.

## Findings
| Sev | File | Key path | Issue | Fix |
|---|---|---|---|---|
| 🟡 | (whole locale) | — | No translator notes → recommend full sentence-level pass, not spot check. | Native proofread |
| 🟡 | (whole locale) | style | Confirm consistent Sie-register and „…" quotation style across marketing copy; watch for over-long compounds where a natural phrase reads better. | Native proofread |

## Evidence checked (clean)
- **Unit rule (glossary §7):** English "a two-mile trip" → "eine Fahrt von zwei Meilen" — **kept as miles, not converted to km**. (Agent had briefly converted and corrected it.) ✅
- **Brand:** `legalName` = "Ptah Tours for Tourism LLC" verbatim; byline "Das Ptah-Tours-Team" consistent across 11 posts.
- **Tokens:** `{year}` in copyrightLine; `{name}` in ui-supplemental. Preserved.
- **Enums:** cookie `key` preferences/analytics/marketing verbatim (×3).
- **Place:** Kairo exonym throughout (×45); Tutanchamun (scholarly form), Großes Ägyptisches Museum, Feluke — consistent.
- **Facts:** GEM "am 1. November 2025 vollständig eröffnet" + complete Tutankhamun collection; content-equal to the Spanish reference (4 in-body mentions each). ✅

## Low-confidence lines (for human proofread)
- See `de/notes.md` (reconstructed; lists the three ⚠ attention areas). No blockers found, but German gets the most careful human review of the six.
