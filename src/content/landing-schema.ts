/**
 * Runtime (zod) mirrors of the landing content shapes declared in landing.ts.
 *
 * Phase 2 CMS: a DB `ContentSection` override for a landing section is parsed
 * through the matching schema here before it is trusted. A parse failure makes
 * `getLandingContent` fall back to the typed SSOT default (src/content/landing)
 * — so a malformed/edited row can never crash the landing page or violate the
 * component prop contracts. Keep these in lock-step with the interfaces in
 * landing.ts; the section schemas below are exactly the shapes page.tsx passes
 * to each section component.
 */
import { z } from "zod";

/** Must mirror IconName in components/ui/Icon.tsx. */
const iconName = z.enum([
  "arrow-right", "chevron", "clock", "close", "menu", "plus", "search", "tag",
  "mail", "bookmark", "calendar", "weather", "ticket", "travel", "info",
  "facebook", "instagram", "threads", "youtube", "pinterest", "tiktok", "x",
]);

/**
 * Navigation URL guard (Phase 2 audit, Loop 2 — CMS stored-XSS hardening).
 *
 * CMS payloads are edited by staff (content.edit) but must still be safe if that
 * account is compromised: React renders `<a href="javascript:…">` verbatim
 * (dev-warns only), so a bare `z.string()` href is a stored-XSS sink. Restrict
 * link targets to schemes that cannot execute script:
 *   - relative paths ("/tours", "/about#team", "/tours?type=classic")
 *   - absolute https:// (external links in nav/footer)
 *   - mailto: / tel:
 * Protocol-relative "//host" is rejected (open-redirect / scheme-inherit).
 * Applied to href fields only; image src/mid/wide render on <img>/next-image,
 * which never execute a "javascript:" URL.
 */
const SAFE_URL_RE = /^(?:\/(?!\/)|https:\/\/|mailto:|tel:)/i;
const safeUrl = z
  .string()
  .refine((v) => SAFE_URL_RE.test(v), {
    message: "URL must be a relative path (/…), https://, mailto:, or tel:",
  });

const imageRef = z.object({
  src: z.string(),
  alt: z.string(),
  credit: z.string().optional(),
});

const cropImage = imageRef.extend({
  mid: z.string().optional(),
  wide: z.string().optional(),
  wideAt: z.union([z.literal(1128), z.literal(1440)]).optional(),
});

const ctaLink = z.object({
  label: z.string(),
  href: safeUrl,
  target: z.enum(["_self", "_blank"]).optional(),
});

const cta = z.discriminatedUnion("type", [
  z.object({ type: z.literal("link"), link: ctaLink }),
  z.object({
    type: z.literal("customButton"),
    button: z.object({
      buttonType: z.literal("buildATrip"),
      trackingContext: z.string(),
      href: safeUrl,
    }),
    label: z.string(),
  }),
]);

const heroSlide = z.object({
  id: z.string(),
  season: z.enum(["summer", "winter"]),
  title: z.string(),
  shortLabel: z.string(),
  subtitle: z.string().optional(),
  image: cropImage,
  hotspots: z.array(
    z.object({ xPct: z.number(), yPct: z.number(), label: z.string(), href: safeUrl }),
  ),
});

const inspiredCard = z.object({
  title: z.string(),
  href: safeUrl,
  days: z.number().optional(),
  experiences: z.number().optional(),
  image: imageRef,
});

const inspiredTab = z.object({
  key: z.string(),
  label: z.string(),
  cards: z.array(inspiredCard),
});

const planCtaBlock = z.object({
  title: z.string(),
  copy: z.string(),
  image: cropImage,
  credit: z.string(),
  cta,
});

const fiftyCta = z.object({
  title: z.string(),
  copy: z.string(),
  cta: ctaLink,
  image: cropImage,
});

const kbygItem = z.object({
  iconKey: iconName,
  title: z.string(),
  copy: z.string(),
  cta: ctaLink,
});

const tourType = z.object({
  title: z.string(),
  blurb: z.string(),
  href: safeUrl,
  image: imageRef,
});

const story = z.object({
  title: z.string(),
  summary: z.string(),
  href: safeUrl,
  image: cropImage,
  credit: z.string(),
});

/** Per-section schemas — keyed exactly like the landing content keys. */
export const landingSchemas = {
  hero: z.array(heroSlide).min(1),
  getInspired: z.array(inspiredTab).min(1),
  planCta: planCtaBlock,
  fiftyCtas: z.array(fiftyCta).length(2),
  kbyg: z.array(kbygItem).length(4),
  tourTypes: z.array(tourType).length(4),
  stories: z.array(story).min(1),
} as const;

export type LandingSectionKey = keyof typeof landingSchemas;
