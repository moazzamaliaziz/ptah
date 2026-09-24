import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import Container from "@/components/layout/Container";
import LogoutButton from "@/components/account/LogoutButton";
import ChangePasswordForm from "@/components/account/ChangePasswordForm";
import { requireUser } from "@/server/auth/rbac";
import { listUserBookings } from "@/server/booking-read";
import { listWishlistTours } from "@/server/wishlist";
import { formatPriceCents } from "@/lib/utils";
import { toLocale } from "@/i18n/config";
import { getPageContent } from "@/i18n/pages";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Your account | Ptah Tours",
  robots: { index: false, follow: false },
};

function fmtDate(d: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(d);
}

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: "bg-nile/10 text-nile",
  PENDING_PAYMENT: "bg-gold/15 text-rust",
  FAILED: "bg-rust/10 text-rust",
  REFUNDED: "bg-grey-300/40 text-ink/60",
  CANCELLED: "bg-grey-300/40 text-ink/60",
};

export default async function AccountPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const user = await requireUser("/account", toLocale(lang));
  const [bookings, wishlist] = await Promise.all([
    listUserBookings(user.id),
    listWishlistTours(user.id),
  ]);

  const pc = await getPageContent(toLocale(lang));
  const t = pc.account;

  return (
    <Container className="py-14">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-section-h2 font-bold text-ink">{t.heading}</h1>
            <p className="mt-1 text-body text-ink/70">
              {user.name} · {user.email}
            </p>
          </div>
          <LogoutButton labels={t} />
        </div>

        {/* Bookings */}
        <section className="mt-12">
          <h2 className="text-kbyg-h2 font-semibold text-ink">{t.bookingsHeading}</h2>
          {bookings.length === 0 ? (
            <p className="mt-3 text-body text-ink/60">
              {t.emptyBookingsPre}{" "}
              <Link href="/tours" className="font-semibold text-nile hover:underline">
                {t.emptyBookingsLink}
              </Link>
              {t.emptyBookingsPost}
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {bookings.map((b) => (
                <li key={b.id} className="rounded-2xl border border-grey-300/60 bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <Link href={`/tours/${b.tourSlug}`} className="font-semibold text-ink hover:text-nile">
                        {b.tourTitle}
                      </Link>
                      <p className="mt-0.5 text-meta text-ink/60">
                        {fmtDate(b.startDate)} · {b.seats} traveler{b.seats > 1 ? "s" : ""} ·{" "}
                        {formatPriceCents(b.totalCents, b.currency)}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${STATUS_STYLES[b.status] ?? "bg-grey-300/40 text-ink/60"}`}>
                      {b.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Wishlist */}
        <section className="mt-12">
          <h2 className="text-kbyg-h2 font-semibold text-ink">{t.savedHeading}</h2>
          {wishlist.length === 0 ? (
            <p className="mt-3 text-body text-ink/60">
              {t.savedEmpty}
            </p>
          ) : (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {wishlist.map((w) => (
                <li key={w.slug} className="rounded-2xl border border-grey-300/60 bg-white p-5">
                  <Link href={`/tours/${w.slug}`} className="font-semibold text-ink hover:text-nile">
                    {w.title}
                  </Link>
                  <p className="mt-1 line-clamp-2 text-meta text-ink/60">{w.summary}</p>
                  <p className="mt-2 text-meta font-semibold text-nile">
                    {t.savedFromLabel} {formatPriceCents(w.fromPriceCents, w.currency)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Change password */}
        <section className="mt-12 max-w-sm">
          <h2 className="text-kbyg-h2 font-semibold text-ink">{t.changePasswordHeading}</h2>
          <p className="mt-1 text-meta text-ink/60">{t.changePasswordSubtext}</p>
          <div className="mt-4">
            <ChangePasswordForm labels={t} />
          </div>
        </section>
      </div>
    </Container>
  );
}
