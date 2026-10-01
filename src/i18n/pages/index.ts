/**
 * Page-content dictionary loader (Phase 3 i18n, Track C). Sibling of the chrome
 * loader in `@/i18n/dictionaries` but for the STATIC strings baked into public
 * page bodies (headings, editorial copy, form labels, empty states) — the copy
 * that is neither global chrome nor DB-driven catalog content.
 *
 * Same mechanics as the chrome loader: English is the in-bundle source and shape
 * SSOT; every non-English module `satisfies PageContent`, so the compiler
 * guarantees an identical shape. Non-English locales are code-split behind
 * dynamic imports, so a render only pulls the active locale's strings.
 *
 * Server-only. Pages that hold a Locale (they read `params.lang`) pass it
 * explicitly; server components rendered without params can call with no arg and
 * rely on the `[lang]` root param. root-params never resolves in Client
 * Components, Server Actions or Route Handlers.
 */
import "server-only";
import { lang } from "next/root-params";
import { toLocale, type Locale } from "@/i18n/config";
import { enPages, type PageContent } from "./en";

export type { PageContent };

const pageDictionaries: Record<Locale, () => Promise<PageContent>> = {
  en: () => Promise.resolve(enPages),
  ar: () => import("./ar").then((m) => m.arPages),
  fr: () => import("./fr").then((m) => m.frPages),
  de: () => import("./de").then((m) => m.dePages),
  es: () => import("./es").then((m) => m.esPages),
  it: () => import("./it").then((m) => m.itPages),
  ru: () => import("./ru").then((m) => m.ruPages),
};

/**
 * Resolve the active page-content dictionary. Pass an explicit `locale` when the
 * caller already has one (the common case for pages); otherwise the `[lang]`
 * root param is read and `toLocale` falls back to the default locale.
 */
export async function getPageContent(locale?: Locale): Promise<PageContent> {
  const resolved = locale ?? toLocale(await lang());
  return pageDictionaries[resolved]();
}
