/**
 * Global footer (design.md §2.8): newsletter block, 3 link columns with
 * endorsement badges, Travel Partners (single-render per §8.4 I-5), social
 * row, legal bar + cookie preference trigger. Server component — the only
 * client islands are the CookieManageButton (stays in footer) and the banner.
 *
 * Phase 7 (Subsystem 3): socials, copyright line and the footer brand logo are
 * DB-driven via `getSettings()` (fallback to the content SSOT when unset). The
 * structural content (newsletter, columns, badges, partners, legal links) stays
 * in content/landing.ts.
 */
import Link from "next/link";
import type { JSX } from "react";
import { footerContent } from "@/content/landing";
import { Icon } from "@/components/ui/Icon";
import { SiteLogo } from "@/components/site/SiteLogo";
import CookieManageButton from "@/components/site/CookieManageButton";
import { getSettings } from "@/server/settings";

export async function SiteFooter(): Promise<JSX.Element> {
  const settings = await getSettings();
  const year = new Date().getFullYear();
  const copyright = settings["branding.copyrightLine"].replace("{year}", String(year));
  const socials = settings["branding.socials"];
  const footerLogoId = settings["branding.footerLogoMediaId"];
  const siteName = settings["branding.siteName"];

  return (
    <footer className="site-footer">
      <div className="footer-shell">
        {/* Newsletter block (§2.8.1) */}
        <section className="footer-newsletter" aria-label="Stay Connected">
          <div className="footer-newsletter__inner">
            <h2 className="text-newsletter-h2" style={{ margin: 0 }}>
              {footerContent.newsletter.heading}
            </h2>
            <p className="text-newsletter footer-newsletter__blurb">
              {footerContent.newsletter.blurb}
            </p>
            <Link href={footerContent.newsletter.cta.href} className="pill pill--solid footer-newsletter__cta">
              <Icon name="mail" size={22} />
              {footerContent.newsletter.cta.label}
            </Link>
          </div>
        </section>

        {/* Link columns incl. endorsements (§2.8.2/§2.8.3) */}
        <nav className="footer-columns" aria-label="Footer">
          {footerContent.columns.map((col) => (
            <div key={col.heading}>
              <h2 className="text-footer-col-h2" style={{ margin: "0 0 1rem" }}>
                {col.heading}
              </h2>
              <ul className="footer-col__links text-footer-link">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
              {col.heading === footerContent.columns[0]?.heading ? (
                <div style={{ marginTop: "1.25rem" }}>
                  <h2 className="text-footer-col-h2" style={{ margin: "0 0 1rem" }}>
                    {footerContent.badgeHeading}
                  </h2>
                  <div className="footer-badges">
                    {footerContent.badges.map((b) => (
                      <Link key={b.heading} href={b.href} className="badge-cell" aria-label={`${footerContent.badgeHeading}: ${b.heading} — ${b.sub}`}>
                        <strong>{b.heading}</strong>
                        <span>{b.sub}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        {/* Travel Partners (§2.8.4) — ONE node; CSS grid-area swaps its home */}
        <div className="footer-partners" aria-label={footerContent.partnersHeading}>
          <span className="sr-only">{footerContent.partnersHeading}</span>
          {footerContent.partners.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${p.name} — ${p.tagline} (opens in a new tab)`}
              className="partner-mark"
            >
              {p.name}
              <small>{p.tagline}</small>
            </a>
          ))}
        </div>

        {/* Social row (§2.8.5) — DB-driven (branding.socials) */}
        <div className="footer-social" aria-label={`Follow ${siteName}`}>
          {socials.map((s) => (
            <a
              key={s.label + s.href}
              href={s.href}
              aria-label={s.label}
              className="social-disc"
              {...(s.href.startsWith("mailto:") || s.href.startsWith("tel:")
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
            >
              <Icon name={s.iconKey} size={15} />
            </a>
          ))}
        </div>

        {/* Legal bar (§2.8.6) */}
        <div className="footer-legal">
          <div className="footer-legal__inner">
            <Link href="/" className="footer-legal__brand" aria-label={`${siteName} — home`}>
              {footerLogoId ? (
                // eslint-disable-next-line @next/next/no-img-element -- DB-driven footer logo (variable dimensions).
                <img src={`/api/media/${footerLogoId}`} alt={siteName} />
              ) : (
                <SiteLogo />
              )}
            </Link>
            <p className="text-legal" style={{ margin: 0 }}>
              {copyright}
            </p>
            <p className="text-meta footer-legal__ack">{footerContent.acknowledgement}</p>
            <ul className="footer-legal__links text-meta">
              {footerContent.legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
              <li>
                <CookieManageButton />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
