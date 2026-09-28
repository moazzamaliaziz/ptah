"use client";

/**
 * Interactive global chrome (design.md §2). One client island owning:
 *   - desktop quick-links bar + primary bar (42px / 102px)
 *   - 3 mega-menu flyouts (22-col grid, headline stagger, bezier close)
 *   - search dialog shell
 *   - mobile 73px bar + full-viewport curtain (exact §2.2 bezier pair)
 *   - hide-on-scroll backdrop behavior (§2.4) + on-dark/on-light theme swap (§2.1.3)
 *   - bookmarks pill wired to the localStorage wishlist adapter
 *
 * Markup swaps between mobile/desktop variants at 70.5em (1128px — see
 * MQ_HEADER_DESKTOP) via matchMedia (§5.2 rule 2 — never CSS-hidden
 * duplicates). The full desktop primary bar (logo + 7 nav items + 6 action
 * controls in one non-wrapping row) cannot fit below ~1128px, so tablets get
 * the hamburger curtain — which carries the identical nav — up to 1127px.
 * Before hydration a 73px placeholder bar renders (deterministic, no thrash).
 *
 * Server wrapper: SiteHeader.tsx reads the content module and passes plain
 * props, so nav copy never ships in the client manifest beyond this island.
 */
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { usePathname } from "next/navigation";
import { stripLocalePrefix } from "@/i18n/routing";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type JSX,
  type CSSProperties,
} from "react";
import type { SiteNav } from "@/content/landing";
import { Icon } from "@/components/ui/Icon";
import MultiCropImage from "@/components/site/MultiCropImage";
import SiteLogo from "@/components/site/SiteLogo";
import BookmarkPill from "@/components/site/BookmarkPill";
import SearchDialog from "@/components/site/SearchDialog";
import InstallButton from "@/components/pwa/InstallButton";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import type { HeaderChromeStrings } from "@/i18n/chrome";
import { MQ_HEADER_DESKTOP, useMediaQuery } from "@/hooks/use-media-query";

type ScrollState = "top" | "up" | "down";

export interface SiteHeaderChromeProps {
  nav: SiteNav;
  /** Localized chrome strings (aria labels, search + bookmark copy). */
  t: HeaderChromeStrings;
  /** DB-driven header logo src ("/api/media/<id>"); null → built-in SVG wordmark. */
  logoSrc?: string | null;
  /** Site name for the logo's alt text (DB-driven). */
  siteName?: string;
}

export function SiteHeaderChrome({ nav, t, logoSrc = null, siteName = "Ptah Tours" }: SiteHeaderChromeProps): JSX.Element {
  const pathname = usePathname();
  const isDesktop = useMediaQuery(MQ_HEADER_DESKTOP);
  // Locale-agnostic home check: the home route is `/{locale}` (e.g. /en, /ar),
  // never bare `/`, so strip the locale prefix before comparing (drives the
  // on-dark hero theme swap in §2.1.3).
  const isHome = stripLocalePrefix(pathname) === "/";

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [menuClosing, setMenuClosing] = useState(false);
  const [menuEntered, setMenuEntered] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [curtainSection, setCurtainSection] = useState<string | null>(null);
  const [scrollState, setScrollState] = useState<ScrollState>("top");

  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const searchTriggerRef = useRef<HTMLElement | null>(null);
  const curtainRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<number | null>(null);

  const anyOverlay = openMenu !== null || searchOpen || curtainOpen;

  /* DB-driven brand mark (Phase 7 S3): custom logo image when set, else the
     built-in cartouche SVG wordmark. Rendered identically in all header slots. */
  const brandMark = logoSrc ? (
    // eslint-disable-next-line @next/next/no-img-element -- DB-driven header logo (variable dimensions).
    <img src={logoSrc} alt={siteName} />
  ) : (
    <SiteLogo />
  );

  /* ---- hide-on-scroll driver (§2.4): show on scroll-up / menu open,
     slide away on scroll-down; at the top the header is transparent over
     the hero (theme swap below). ---------------------------------------- */
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < 24) setScrollState("top");
        else if (y < lastY - 4) setScrollState("up");
        else if (y > lastY + 4) setScrollState("down");
        lastY = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---- Close chrome state on navigation (§ chrome: render-time reset) */
  const [closedPathname, setClosedPathname] = useState(pathname);
  if (pathname !== closedPathname) {
    setClosedPathname(pathname);
    setOpenMenu(null);
    setMenuClosing(false);
    setMenuEntered(false);
    setSearchOpen(false);
    setCurtainOpen(false);
    setCurtainSection(null);
  }

  /* ---- Body scroll lock while the curtain (or search) is open ---------- */
  useEffect(() => {
    if (!curtainOpen && !searchOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [curtainOpen, searchOpen]);

  /* ---- When the viewport crosses 1128px, reset transient chrome state -- */
  const [handledDesktop, setHandledDesktop] = useState<boolean | null>(isDesktop);
  if (isDesktop !== handledDesktop) {
    setHandledDesktop(isDesktop);
    setOpenMenu(null);
    setMenuClosing(false);
    setMenuEntered(false);
    setCurtainOpen(false);
    setCurtainSection(null);
  }

  /* Close search and restore focus to the control that opened it (§6.3 flow). */
  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    if (searchTriggerRef.current?.isConnected) searchTriggerRef.current.focus();
  }, []);

  /* ---- Mega-menu open/close with the §2.3 motion contract -------------- */
  const openSection = (key: string) => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setMenuClosing(false);
    setOpenMenu(key);
    setMenuEntered(false);
    // two rAFs: mount in closed pose, then flip data-open so the CSS
    // transition (not an animation) performs the entrance.
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setMenuEntered(true));
    });
  };

  const closeMenu = useCallback((moveFocus: boolean) => {
    setMenuClosing(true);
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setOpenMenu(null);
      setMenuClosing(false);
      setMenuEntered(false);
      closeTimer.current = null;
    }, 220); // 0.2s close curve + margin
    if (moveFocus && openMenu) {
      triggerRefs.current[openMenu]?.focus();
    }
  }, [openMenu]);

  const toggleMenu = (key: string) => {
    if (openMenu === key) closeMenu(true);
    else openSection(key);
  };

  /* Escape closes the open flyout and returns focus to its trigger */
  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openMenu, closeMenu]);

  /* ---- Curtain keyboard contract (§6.3): Esc closes, focus returns ----- */
  useEffect(() => {
    if (!curtainOpen) return;
    const panel = curtainRef.current;
    panel?.querySelector<HTMLElement>("button, a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCurtainOpen(false);
        hamburgerRef.current?.focus();
        return;
      }
      // Focus trap: the curtain is a full-viewport overlay without aria-modal,
      // so keep Tab cycling inside it until it closes (§6.3).
      if (e.key !== "Tab" || !panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) return;
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (activeEl === firstEl || !panel.contains(activeEl)) {
          e.preventDefault();
          lastEl.focus();
        }
      } else if (activeEl === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [curtainOpen]);

  /* Clear a pending flyout-close timer if this island unmounts mid-close. */
  useEffect(
    () => () => {
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    },
    [],
  );

  const backdropShown =
    anyOverlay || scrollState === "up";
  const headerHidden = scrollState === "down" && !anyOverlay;
  const onDark = isHome && scrollState === "top" && !anyOverlay;

  const headerData = {
    "data-theme": onDark ? "on-dark" : "on-light",
    "data-backdrop": backdropShown ? "shown" : "hidden",
    "data-hidden": headerHidden ? true : undefined,
    "data-expanded": openMenu !== null || searchOpen ? true : undefined,
    "data-curtain": curtainOpen ? "open" : undefined,
  } as const;

  /* Pre-hydration: deterministic 73px placeholder bar (brand only). The
     reference's SSR header shell is similarly minimal (§2.1). */
  if (isDesktop === null) {
    return (
      <header className="site-header" data-theme="on-dark">
        <span className="site-header__backdrop" aria-hidden="true" />
        <div className="mobile-bar hd">
          <Link href="/" className="brand-logo" aria-label={`${siteName} — ${t.home}`}>
            {brandMark}
          </Link>
        </div>
      </header>
    );
  }

  const active = openMenu ? nav.sections.find((s) => s.key === openMenu) : null;

  return (
    <header className="site-header" {...headerData}>
      <span className="site-header__backdrop" aria-hidden="true" />

      {isDesktop ? (
        <>
          {/* Quick-links bar (§2.1.1) */}
          <nav className="quick-links hd text-quick-link" aria-label={t.header.quickLinksAria}>
            {nav.quickLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Icon name={link.iconKey} size={14} />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Primary nav row (§2.1.2) */}
          <div className="primary-bar hd">
            <Link href="/" className="brand-logo" aria-label={`${siteName} — ${t.home}`}>
              {brandMark}
            </Link>

            <nav className="primary-nav text-nav" aria-label={t.header.primaryAria}>
              {nav.sections.map((section) => (
                <button
                  key={section.key}
                  type="button"
                  ref={(el) => {
                    triggerRefs.current[section.key] = el;
                  }}
                  className="nav-item"
                  aria-haspopup="true"
                  aria-expanded={openMenu === section.key}
                  aria-controls={`megamenu-${section.key}`}
                  onClick={() => toggleMenu(section.key)}
                  onMouseEnter={() => {
                    // hover-switch only once a panel is already open
                    if (openMenu !== null && openMenu !== section.key) openSection(section.key);
                  }}
                >
                  <span className="nav-item__label">{section.title}</span>
                  <Icon name="chevron" size={12} style={{ transform: "rotate(90deg)" }} />
                </button>
              ))}
              {nav.directLinks.map((link) => (
                <Link key={link.href} href={link.href} className="nav-item">
                  <span className="nav-item__label">{link.label}</span>
                </Link>
              ))}
            </nav>

            <div className="primary-bar__actions">
              <LocaleSwitcher />
              <button
                type="button"
                className="icon-button icon-button--dip"
                aria-label={t.search.triggerAria}
                onClick={(e) => {
                  searchTriggerRef.current = e.currentTarget;
                  setSearchOpen(true);
                }}
              >
                <Icon name="search" size={20} />
              </button>
              <InstallButton variant="header" className="icon-button icon-button--dip" />
              <Link
                href="/track-booking"
                className="icon-button icon-button--dip"
                aria-label={t.header.trackBooking}
              >
                <Icon name="ticket" size={20} />
              </Link>
              <BookmarkPill href={nav.bookmarksHref} labels={t.bookmarks} />
              <Link href={nav.buildTripCta.href} className="pill build-pill text-btn">
                {nav.buildTripCta.label}
              </Link>
            </div>
          </div>

          {/* Mega-menu flyout (§2.3) */}
          {active ? (
            <div className="megamenu hd" onMouseLeave={() => closeMenu(false)}>
              <div
                className="megamenu__panel"
                id={`megamenu-${active.key}`}
                data-open={menuEntered && !menuClosing}
                role="region"
                aria-label={`${active.title} menu`}
              >
                <div className="megamenu__grid">
                  {active.columns.map((col, i) => (
                    <div className="mega-col mega-anim" style={{ "--i": i } as CSSProperties & Record<string, number>} key={col.heading}>
                      <h2 className="mega-col__h2">{col.heading}</h2>
                      <ul className="mega-col__list">
                        {col.links.map((link) => (
                          <li key={link.href + link.label}>
                            <Link href={link.href}>{link.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {active.imageCtas.map((cta, i) => (
                    <div
                      key={cta.heading}
                      className={`mega-cta mega-anim${i === 0 ? " mega-cta--first" : ""}`}
                      style={{ "--i": active.columns.length + i } as CSSProperties & Record<string, number>}
                    >
                      <Link href={cta.href} className="mega-cta__card hover-card">
                        <MultiCropImage
                          src={cta.image.src}
                          alt={cta.image.alt}
                          ratio={{ w: 4, h: 3 }}
                          sizes="(min-width: 1128px) 15vw, 25vw"
                          imgClassName="card-zoom"
                        />
                        <span className="mega-cta__label">{cta.label}</span>
                        <span className="mega-cta__heading">{cta.heading}</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <>
          {/* Mobile bar (§2.2, 73px) */}
          <div className="mobile-bar hd">
            <Link href="/" className="brand-logo" aria-label={`${siteName} — ${t.home}`}>
              {brandMark}
            </Link>
            <button
              type="button"
              className="icon-button"
              aria-label={t.search.triggerAria}
              onClick={(e) => {
                searchTriggerRef.current = e.currentTarget;
                setSearchOpen(true);
              }}
            >
              <Icon name="search" size={20} />
            </button>
            <Link
              href={nav.bookmarksHref}
              className="icon-button"
              aria-label={t.header.viewBookmarks}
            >
              <Icon name="bookmark" size={20} />
            </Link>
            <InstallButton variant="header" />
            <button
              type="button"
              ref={hamburgerRef}
              className="icon-button"
              aria-label={curtainOpen ? t.header.closeMenu : t.header.openMenu}
              aria-expanded={curtainOpen}
              aria-controls="primary-nav-panel"
              onClick={() => setCurtainOpen((v) => !v)}
            >
              <Icon name={curtainOpen ? "close" : "menu"} size={24} />
            </button>
          </div>

          {/* Curtain (§2.2) — full-viewport white veil, spec beziers */}
          <div className="curtain" id="primary-nav-panel" data-open={curtainOpen} aria-hidden={!curtainOpen}>
            <div className="curtain__scroll" ref={curtainRef}>
              <nav aria-label={t.header.mobileNavAria}>
                {nav.sections.map((section) => (
                  <div className="curtain-accordion" key={section.key}>
                    <button
                      type="button"
                      className="curtain-accordion__button"
                      aria-expanded={curtainSection === section.key}
                      aria-controls={`curtain-panel-${section.key}`}
                      onClick={() =>
                        setCurtainSection((v) => (v === section.key ? null : section.key))
                      }
                    >
                      {section.title}
                      <span className="curtain-accordion__chev">
                        <Icon name="chevron" size={18} />
                      </span>
                    </button>
                    {curtainSection === section.key ? (
                      <div className="curtain-accordion__panel" id={`curtain-panel-${section.key}`}>
                        {section.columns.map((col) => (
                          <ul className="curtain-accordion__list" key={col.heading}>
                            {col.links.map((link) => (
                              <li key={link.href + link.label}>
                                <Link href={link.href}>{link.label}</Link>
                              </li>
                            ))}
                          </ul>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
                {nav.directLinks.map((link) => (
                  <div className="curtain-accordion" key={link.href}>
                    <Link href={link.href} className="curtain-accordion__button">
                      {link.label}
                    </Link>
                  </div>
                ))}
              </nav>

              <nav className="curtain__quicklinks" aria-label={t.header.quickLinksAria}>
                {nav.quickLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <Icon name={link.iconKey} size={16} />
                    {link.label}
                  </Link>
                ))}
                <Link href="/track-booking">
                  <Icon name="ticket" size={16} />
                  {t.header.trackBooking}
                </Link>
              </nav>

              <LocaleSwitcher variant="inline" />

              <div style={{ marginTop: "1.75rem" }}>
                <Link href={nav.buildTripCta.href} className="pill build-pill text-btn">
                  {nav.buildTripCta.label}
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {searchOpen ? (
        <SearchDialog
          popularSearches={nav.popularSearches}
          searchHref={nav.searchHref}
          labels={t.search}
          onClose={closeSearch}
        />
      ) : null}
    </header>
  );
}

export default SiteHeaderChrome;
