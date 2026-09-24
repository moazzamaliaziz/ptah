import Container from "@/components/layout/Container";
import NotFoundView from "@/components/site/NotFoundView";

/**
 * In-app 404 boundary for the public site. `notFound()` thrown by any (site)
 * page (an invalid tour/city/country slug, a missing booking) renders this
 * WITHIN the site chrome (header/footer come from (site)/layout.tsx). Truly
 * unmatched URLs hit the root src/app/not-found.tsx instead.
 *
 * No `metadata` export: the honest signal to crawlers is the HTTP 404 status
 * Next sets for this boundary, and metadata support on not-found is narrow in
 * this Next build — the layout's title template supplies a sensible default.
 */
export default function SiteNotFound() {
  return (
    <Container className="py-24">
      <NotFoundView />
    </Container>
  );
}
