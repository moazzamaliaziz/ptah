/**
 * Chrome dictionary loader (Phase 3 i18n). Server-only: resolves the active
 * locale from the `[lang]` root param via `next/root-params` (the canonical
 * Next 16 pattern) and returns that locale's chrome dictionary. Non-English
 * dictionaries are code-split behind dynamic imports so only the active
 * locale's strings ship in a given render.
 *
 * Callers that already hold a Locale (pages/layouts reading `params`) can pass
 * it explicitly; chrome components rendered without params (header, footer,
 * skip link, cookie banner) call it with no argument and rely on root-params.
 *
 * root-params works in Server Components and server utilities only — never in
 * Client Components, Server Actions or Route Handlers.
 */
import "server-only";
import { lang } from "next/root-params";
import { toLocale, type Locale } from "@/i18n/config";
import { en, type Dictionary } from "./en";

export type { Dictionary };

/**
 * Per-locale loaders. English is the in-bundle source; the rest are dynamically
 * imported. Every non-English module `satisfies Dictionary`, guaranteeing the
 * same shape as `en` at build time.
 */
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => Promise.resolve(en),
  ar: () => import("./ar").then((m) => m.ar),
  fr: () => import("./fr").then((m) => m.fr),
  de: () => import("./de").then((m) => m.de),
  es: () => import("./es").then((m) => m.es),
  it: () => import("./it").then((m) => m.it),
};

/**
 * Resolve the active chrome dictionary. Pass an explicit `locale` when the
 * caller already has one; otherwise the `[lang]` root param is read. With
 * multiple root layouts `lang()` can be `undefined` (e.g. an admin/system
 * subtree) — `toLocale` then falls back to the default locale.
 */
export async function getDictionary(locale?: Locale): Promise<Dictionary> {
  const resolved = locale ?? toLocale(await lang());
  return dictionaries[resolved]();
}
