import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BookingForm, {
  type BookingCalendarConfig,
  type BookingDepartureOption,
  type PaymentMethod,
} from "@/components/commerce/BookingForm";
import { getTourDetail } from "@/server/catalog";
import { dateWindowBounds, isDateSelectable, toIsoDate } from "@/server/booking-core";
import { getToggles } from "@/server/toggles";
import { toLocale } from "@/i18n/config";
import { getPageContent } from "@/i18n/pages";
import type { PageContent } from "@/i18n/pages/en";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; tourSlug: string }>;
}): Promise<Metadata> {
  const { lang, tourSlug } = await params;
  const tour = await getTourDetail(tourSlug, toLocale(lang));
  return {
    title: tour ? `Book ${tour.title} | Ptah Tours` : "Book | Ptah Tours",
    description: tour?.summary,
    robots: { index: false, follow: false }, // booking funnel is not indexable
  };
}

function departureLabel(start: Date, end: Date): string {
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(d);
  return start.getTime() === end.getTime() ? fmt(start) : `${fmt(start)} – ${fmt(end)}`;
}

// Aside copy derived from the actually-enabled payment methods (no hardcoded
// gateway). `step2` explains how the customer pays; `footer` carries the
// per-method trust/processing note. All display strings come from the localized
// bookingTour dictionary slice; only the method-list assembly logic lives here.
function paymentCopy(
  methods: PaymentMethod[],
  t: PageContent["bookingTour"],
): { step2: string; footer: string } {
  const has = (m: PaymentMethod) => methods.includes(m);
  const labels: Record<PaymentMethod, string> = {
    stripe: t.methodCard,
    paypal: t.methodPaypal,
    bank_transfer: t.methodBankTransfer,
  };
  const list = methods.map((m) => labels[m]);
  const human =
    list.length <= 1
      ? list[0] ?? t.methodCard
      : `${list.slice(0, -1).join(t.listSeparator)}${t.listConjunction}${list[list.length - 1]}`;

  const onlyBank = methods.length === 1 && has("bank_transfer");
  const step2 = onlyBank ? t.payStep2BankOnly : t.payStep2Template.replace("{methods}", human);

  const notes: string[] = [];
  if (has("stripe")) notes.push(t.noteStripe);
  if (has("paypal")) notes.push(t.notePaypal);
  if (has("bank_transfer")) notes.push(t.noteBankTransfer);

  return { step2, footer: notes.join(" ") };
}

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; tourSlug: string }>;
  searchParams: Promise<{ departure?: string; date?: string }>;
}) {
  const { lang, tourSlug } = await params;
  const { departure, date } = await searchParams;
  const locale = toLocale(lang);
  const [tour, pc] = await Promise.all([
    getTourDetail(tourSlug, locale),
    getPageContent(locale),
  ]);
  if (!tour) notFound();
  const t = pc.bookingTour;

  const options: BookingDepartureOption[] = tour.departures.map((d) => ({
    id: d.id,
    label: departureLabel(d.startDate, d.endDate),
    priceCents: d.priceCents,
    currency: d.currency,
    remainingCapacity: d.remainingCapacity,
  }));

  // P8: when the tour takes customer-chosen dates the funnel shows a calendar
  // instead of this list. Its bounds are computed HERE, on the server, and
  // handed down as plain "YYYY-MM-DD" strings — the component never reads a
  // clock, so the rendered grid can't disagree with the server's own check.
  const calendar: BookingCalendarConfig | null = tour.onRequestDates
    ? (() => {
        const { first, last } = dateWindowBounds(tour.dateWindow);
        // Days the operator already has a departure for that is full or closed:
        // inside the window, but not actually bookable today.
        const unavailableDates = tour.departures
          .filter((d) => d.soldOut)
          .map((d) => toIsoDate(d.startDate));
        return {
          tourSlug: tour.slug,
          firstDate: toIsoDate(first),
          lastDate: toIsoDate(last),
          blackoutDates: [...tour.dateWindow.blackoutDates],
          unavailableDates,
          capacity: tour.requestCapacity,
          // Honour a `?date=` deep link only if it is genuinely bookable.
          initialDate:
            date && isDateSelectable(date, tour.dateWindow) && !unavailableDates.includes(date)
              ? date
              : undefined,
        };
      })()
    : null;

  // With a calendar there is always something to book, so the "no seats" state
  // only applies to the fixed-departure funnel.
  const anyBookable = calendar != null || options.some((o) => o.remainingCapacity > 0);

  // Payment methods offered are the enabled runtime toggles. Falls back to card
  // so the funnel still renders (and gracefully routes to manual follow-up) when
  // nothing is configured yet.
  const toggles = await getToggles();
  const enabledMethods: PaymentMethod[] = [];
  if (toggles.PAYMENTS_STRIPE_ENABLED) enabledMethods.push("stripe");
  if (toggles.PAYMENTS_PAYPAL_ENABLED) enabledMethods.push("paypal");
  if (toggles.PAYMENTS_BANK_TRANSFER_ENABLED) enabledMethods.push("bank_transfer");
  const methods: PaymentMethod[] = enabledMethods.length > 0 ? enabledMethods : ["stripe"];
  const payCopy = paymentCopy(methods, t);

  return (
    <Container className="py-12">
      <Breadcrumbs
        items={[
          { label: pc.common.home, href: "/" },
          { label: t.breadcrumbTours, href: "/tours" },
          { label: tour.title, href: `/tours/${tour.slug}` },
          { label: t.breadcrumbBook },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-rust">{t.eyebrow}</p>
          <h1 className="mt-2 text-section-h2 font-bold text-ink">{tour.title}</h1>
          <p className="mt-3 text-body text-ink/65">{tour.summary}</p>

          <div className="mt-8">
            {tour.bookingClosed ? (
              <div className="rounded-xl border border-grey-300/60 bg-papyrus/50 p-8 text-center">
                <p className="text-card-title font-semibold text-ink">{t.closedTitle}</p>
                <p className="mt-2 text-body text-ink/60">
                  {t.closedPre}{" "}
                  <Link href="/contact" className="font-semibold text-rust hover:underline">
                    {t.closedLink}
                  </Link>{" "}
                  {t.closedPost}
                </p>
              </div>
            ) : anyBookable ? (
              <BookingForm
                departures={options}
                initialDepartureId={departure}
                methods={methods}
                labels={t.form}
                childPriceCents={tour.childPriceCents}
                infantPriceCents={tour.infantPriceCents}
                calendar={calendar ?? undefined}
                basePriceCents={tour.basePriceCents}
                priceTiers={tour.priceTiers}
                currency={tour.currency}
              />
            ) : (
              <div className="rounded-xl border border-grey-300/60 bg-papyrus/50 p-8 text-center">
                <p className="text-card-title font-semibold text-ink">{t.noSeatsTitle}</p>
                <p className="mt-2 text-body text-ink/60">
                  {t.noSeatsPre}{" "}
                  <Link href="/contact" className="font-semibold text-rust hover:underline">
                    {t.noSeatsLink}
                  </Link>{" "}
                  {t.noSeatsPost}
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className="lg:col-span-2">
          <div className="rounded-2xl border border-grey-300/60 bg-white p-6">
            <h2 className="text-card-title font-bold text-ink">{t.nextHeading}</h2>
            <ol className="mt-4 space-y-3 text-meta text-ink/70">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-nile/10 text-[11px] font-bold text-nile">1</span>
                {t.step1}
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-nile/10 text-[11px] font-bold text-nile">2</span>
                {payCopy.step2}
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-nile/10 text-[11px] font-bold text-nile">3</span>
                {t.step3}
              </li>
            </ol>
            <p className="mt-5 border-t border-grey-300/50 pt-4 text-[11px] text-ink/45">
              {payCopy.footer}
            </p>
          </div>
        </aside>
      </div>
    </Container>
  );
}
