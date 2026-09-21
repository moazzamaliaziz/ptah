/**
 * Site chrome logo — cartouche-mark wordmark. Colors ride the header theme:
 * the ring is always gold; the letters track --hdr-fg (white over the hero).
 */
import type { JSX } from "react";

export function SiteLogo(): JSX.Element {
  return (
    <svg viewBox="0 0 64 78" aria-hidden="true" focusable="false">
      {/* cartouche ring */}
      <rect
        x="4"
        y="4"
        width="56"
        height="70"
        rx="27"
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth="2.5"
      />
      {/* cartouche base tie-knot */}
      <line x1="16" y1="74" x2="48" y2="74" stroke="var(--color-gold)" strokeWidth="2.5" />
      <text
        x="32"
        y="33"
        textAnchor="middle"
        fontSize="17"
        fontWeight="700"
        letterSpacing="0.06em"
        fill="currentColor"
      >
        PTAH
      </text>
      <text
        x="32"
        y="52"
        textAnchor="middle"
        fontSize="9.5"
        fontWeight="600"
        letterSpacing="0.24em"
        fill="currentColor"
      >
        TOURS
      </text>
    </svg>
  );
}

export default SiteLogo;
