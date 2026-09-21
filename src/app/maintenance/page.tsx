import type { JSX } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "We'll be right back",
  robots: { index: false, follow: false },
};

/* Standalone (no site chrome): the proxy rewrites public traffic here while
   MAINTENANCE_MODE is on. Staff continue to reach /admin normally. */
export default function MaintenancePage(): JSX.Element {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        background: "#1a2340",
        color: "#f7f2e3",
        fontFamily: "var(--font-cabin, system-ui, sans-serif)",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 520 }}>
        <p style={{ letterSpacing: "0.2em", textTransform: "uppercase", fontSize: "0.8rem", opacity: 0.7 }}>
          Ptah Tours
        </p>
        <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 2.6rem)", margin: "0.5rem 0 1rem" }}>
          We&rsquo;ll be right back
        </h1>
        <p style={{ fontSize: "1.05rem", lineHeight: 1.6, opacity: 0.85 }}>
          Our site is briefly down for scheduled maintenance. Please check back shortly —
          your journey across Egypt is worth the short wait.
        </p>
      </div>
    </div>
  );
}
