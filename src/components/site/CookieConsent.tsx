/**
 * Server wrapper for the cookie consent banner (Phase 3 i18n). CookieBanner is
 * a client island and cannot call getDictionary itself, so this component
 * resolves the active locale's dictionary at request time and passes the
 * localized cookie copy + control labels down as plain-string props.
 *
 * Mounted in the `(site)` layout in place of the old direct <CookieBanner/>.
 */
import type { JSX } from "react";
import CookieBanner from "@/components/site/CookieBanner";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeFooter, cookieLabels } from "@/i18n/chrome";

export async function CookieConsent(): Promise<JSX.Element> {
  const dict = await getDictionary();
  return <CookieBanner content={localizeFooter(dict).cookie} labels={cookieLabels(dict)} />;
}

export default CookieConsent;
