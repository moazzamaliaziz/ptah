/**
 * Renders one JSON-LD object as a <script type="application/ld+json"> tag.
 *
 * Security: we serialize with JSON.stringify then escape every "<" to its
 * unicode form (<). That makes it impossible to break out of the script
 * element (no "</script>" can ever appear), so this is safe against injection
 * even when fields contain user- or CMS-derived text.
 *
 * Server component — the tag is emitted in the initial HTML so crawlers see the
 * structured data without running JavaScript.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Safe: every "<" is escaped below, so no "</script>" can break out (see file header).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
