"use client";

/**
 * Inline SVG locale flags for the language switcher.
 *
 * Emoji flags render as bare two-letter text on Windows (the system fonts have
 * no regional-indicator glyphs), so each flag is a hand-built inline SVG —
 * dependency-free and identical on every platform. Flags are decorative: the
 * switcher always shows the locale name beside them, so the wrapper is
 * aria-hidden and the SVG is kept out of the tab order.
 *
 * `en` uses the Union Jack (UK English); `ar` uses the Egyptian tricolour (the
 * operator is Cairo-based). The Union Jack's counterchange clip-path ID is made
 * unique with useId() because the switcher mounts this flag in two variants.
 */
import { useId, type CSSProperties, type JSX } from "react";
import type { Locale } from "@/i18n/config";

/* Uniform 21×14 box (= the 60×40 viewBox scaled by 0.35, so no distortion).
   Border uses currentColor so it stays subtle on light and dark chrome. */
const BOX: CSSProperties = {
  display: "inline-block",
  inlineSize: "21px",
  blockSize: "14px",
  borderRadius: "3px",
  overflow: "hidden",
  border: "1px solid color-mix(in srgb, currentColor 20%, transparent)",
  marginInlineEnd: "8px",
  verticalAlign: "middle",
  flex: "0 0 auto",
  lineHeight: 0,
};

/** Equal horizontal ("h") or vertical ("v") colour bands across the 60×40 box. */
function Stripes({ dir, colors }: { dir: "h" | "v"; colors: string[] }): JSX.Element {
  const n = colors.length;
  return (
    <>
      {colors.map((c, i) =>
        dir === "h" ? (
          <rect key={i} x="0" y={(40 / n) * i} width="60" height={40 / n} fill={c} />
        ) : (
          <rect key={i} x={(60 / n) * i} y="0" width={60 / n} height="40" fill={c} />
        ),
      )}
    </>
  );
}
/** Decorative flag for `locale`, sized to a uniform rounded box. */
export function Flag({ locale }: { locale: Locale }): JSX.Element {
  const uid = useId();
  return (
    <span aria-hidden="true" style={BOX}>
      <svg
        viewBox="0 0 60 40"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        focusable={false}
      >
        {flagBody(locale, uid)}
      </svg>
    </span>
  );
}

function flagBody(locale: Locale, uid: string): JSX.Element {
  switch (locale) {
    case "fr":
      return <Stripes dir="v" colors={["#0055A4", "#FFFFFF", "#EF4135"]} />;
    case "it":
      return <Stripes dir="v" colors={["#009246", "#FFFFFF", "#CE2B37"]} />;
    case "de":
      return <Stripes dir="h" colors={["#000000", "#DD0000", "#FFCE00"]} />;
    case "ru":
      return <Stripes dir="h" colors={["#FFFFFF", "#0039A6", "#D52B1E"]} />;
    case "ar":
      // Egyptian tricolour; the Eagle of Saladin is illegible at icon size.
      return <Stripes dir="h" colors={["#CE1126", "#FFFFFF", "#000000"]} />;
    case "es":
      // Red / wide gold centre / red; the arms are dropped at icon size.
      return (
        <>
          <rect x="0" y="0" width="60" height="40" fill="#AA151B" />
          <rect x="0" y="10" width="60" height="20" fill="#F1BF00" />
        </>
      );
    case "en":
    default:
      return <UnionJack uid={uid} />;
  }
}
/**
 * Union Jack. The red St Patrick saltire is counterchanged against the white
 * St Andrew saltire by clipping it to the classic four-triangle "pinwheel"
 * diamond, so each red diagonal shows on only one side of the white one.
 */
function UnionJack({ uid }: { uid: string }): JSX.Element {
  const diag = `uj-${uid}`;
  return (
    <>
      <defs>
        <clipPath id={diag}>
          <path d="M30,20 h30 v20 z v20 h-30 z h-30 v-20 z v-20 h30 z" />
        </clipPath>
      </defs>
      <rect x="0" y="0" width="60" height="40" fill="#012169" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#FFFFFF" strokeWidth="8" />
      <path
        d="M0,0 L60,40 M60,0 L0,40"
        clipPath={`url(#${diag})`}
        stroke="#C8102E"
        strokeWidth="5"
      />
      <path d="M30,0 V40 M0,20 H60" stroke="#FFFFFF" strokeWidth="13" />
      <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="8" />
    </>
  );
}

export default Flag;
