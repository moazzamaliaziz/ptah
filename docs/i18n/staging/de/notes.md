# German (de) — translation notes

> **Provenance:** the German translation agent completed all editorial files (`theme-content.de.ts`, `city-content.de.ts`, `blog.de.ts`, `landing.de.ts`, `ui-supplemental.de.ts`, `alt-overlay.de.ts`) but the API dropped before it authored this notes file. These notes were **reconstructed by the orchestrator from the delivered German files**, so treat the termbase list as observed-from-output, not as the translator's own commentary. The verifier should give German termbase consistency an extra-careful pass.

## Status
- All P1 modules (D theme-content, E city-content, F blog, G landing, I ui-supplemental) present and **typecheck-clean** (scoped `tsc --noEmit`, exit 0).
- P2 module H (`alt-overlay.de.ts`) present, keyed by image `src` path.
- Register: **Sie** throughout (e.g. "das Kairo, das wir lieben, ist jenes, das Sie … entdecken"). „…" German quotation style.

## Termbase (observed in the delivered files — reuse for consistency)
- Blog `author` byline: **"Das Ptah-Tours-Team"** (used consistently across all 11 posts).
- Grand Egyptian Museum → **"Großes Ägyptisches Museum"** (declined in context: "das Große Ägyptische Museum").
- Tutankhamun → **"Tutanchamun"** (conventional German scholarly form); collection = "Tutanchamun-Sammlung".
- felucca → **"Feluke"** (pl. "Feluken") — naturalized German form.
- tour / day trip → **"Tour" / "Tagesausflug"** (pl. "Tagesausflüge"); "expert-led, local" → "geführt von Experten vor Ort".
- Khan el-Khalili, Gizeh, Sphinx, Assuan, Luxor, Karnak — standard German exonyms/renderings; Khan el-Khalili kept verbatim.
- Brand "Ptah Tours" kept Latin (only "Ptah-Tours-Team" as the byline compound).

## Facts — verified preserved
- GEM opened **"am 1. November 2025 vollständig"** with the complete Tutankhamun collection — matches source; not rounded or altered.
- Tutankhamun's mummy / Valley of the Kings context preserved in city-content.
- **Unit rule (glossary §7) confirmed:** English "a two-mile trip" is rendered **"eine Fahrt von zwei Meilen"** — kept as miles, NOT converted to kilometres. (The agent had briefly converted this and corrected it before the run ended.)

## ⚠ Low-confidence / for verifier attention
- ⚠ Because the translator's own notes were lost, **every German file warrants a full accuracy pass** rather than a spot check — there is no translator self-flag list to rely on for de.
- ⚠ Confirm consistent Sie-register and „…" quotation usage across `theme-content.de.ts` and `landing.de.ts` marketing copy.
- ⚠ Confirm no over-long compound nouns were formed where a natural phrase reads better (glossary §5 de guidance).
