import "server-only";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatPriceCents } from "@/lib/utils";
import { PAX_TYPE_LABEL, type PriceBreakdown } from "@/server/booking-core";

/**
 * Server-generated booking voucher (item #3). Rendered to a PDF Buffer by the
 * /booking/voucher/[id] route handler via `renderToBuffer`. Server-only: this
 * module never runs on the client, and only ever receives the sanitized fields
 * the booking-read helpers expose — no raw contactInfo, no full PII email.
 *
 * Exported as a plain function (NOT used as `<VoucherDocument/>`): `renderToBuffer`
 * is typed to accept a `ReactElement<DocumentProps>` — the <Document> element
 * itself, not a wrapper component. The route calls `VoucherDocument(data)`.
 */
export interface VoucherData {
  /** Booking reference (the UUID booking id). */
  reference: string;
  status: string;
  tourTitle: string;
  startDate: Date;
  endDate: Date;
  seats: number;
  totalCents: number;
  currency: string;
  /**
   * Masked confirmation email (e.g. `j***@example.com`) — present for the
   * id-addressable surfaces (getBookingOutcome). Null for the track-booking
   * surface, whose lookup helper returns no email at all.
   */
  contactEmailMasked?: string | null;
  /** Frozen per-passenger-type price breakdown, or null/absent for legacy bookings. */
  pricing?: PriceBreakdown | null;
  /** P5: discount applied at checkout (minor units); 0/absent when no coupon.
   *  The breakdown lines sum to the GROSS; `totalCents` is already the NET. */
  discountCents?: number;
  /** Coupon code applied, or null — shown on the discount line. */
  couponCode?: string | null;
}

/** Brand palette lifted from src/styles/tokens.css (react-pdf needs raw hex). */
const BRAND = {
  nile: "#1a2340",
  rust: "#9a5c1b",
  ink: "#262626",
  papyrus: "#f7f2e3",
  border: "#d8d2c0",
  muted: "#6b6b6b",
  white: "#ffffff",
} as const;
const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: "Confirmed",
  PENDING_PAYMENT: "Pending payment",
  REFUNDED: "Refunded",
  CANCELLED: "Cancelled",
  FAILED: "Payment failed",
};

const STATUS_NOTE: Record<string, string> = {
  CONFIRMED: "Payment received — you're booked. Keep this voucher for your records.",
  PENDING_PAYMENT: "Nothing has been charged yet — quote this reference when you arrange payment.",
  REFUNDED: "This booking has been refunded to your original payment method.",
  CANCELLED: "This booking has been cancelled and the seats released.",
  FAILED: "Payment didn't go through, so this booking wasn't completed. Quote this reference to try again.",
};

function fmtDate(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}
const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 54,
    paddingHorizontal: 48,
    fontSize: 11,
    color: BRAND.ink,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: BRAND.nile,
    borderRadius: 8,
    paddingVertical: 18,
    paddingHorizontal: 22,
  },
  brand: { fontSize: 15, fontFamily: "Helvetica-Bold", letterSpacing: 2, color: BRAND.white },
  brandSub: { fontSize: 9, color: "#c7cbe0", marginTop: 4, letterSpacing: 1 },
  pill: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: BRAND.white,
    borderWidth: 1,
    borderColor: "#c7cbe0",
    borderStyle: "solid",
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 9,
  },
  refBlock: { marginTop: 26 },
  refLabel: { fontSize: 8, color: BRAND.rust, letterSpacing: 1 },
  refValue: { fontSize: 13, fontFamily: "Helvetica-Bold", marginTop: 3 },
  card: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: BRAND.border,
    borderStyle: "solid",
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.border,
    borderBottomStyle: "solid",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: BRAND.papyrus,
  },
  dt: { color: BRAND.muted },
  dd: { textAlign: "right" },
  ddStrong: { fontFamily: "Helvetica-Bold", textAlign: "right" },
  total: { fontFamily: "Helvetica-Bold", color: BRAND.nile, textAlign: "right" },
  note: {
    marginTop: 18,
    padding: 12,
    backgroundColor: BRAND.papyrus,
    borderRadius: 8,
  },
  footer: {
    marginTop: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BRAND.border,
    borderTopStyle: "solid",
    fontSize: 9,
    color: BRAND.muted,
  },
});
export function VoucherDocument(data: VoucherData) {
  const label = STATUS_LABEL[data.status] ?? data.status;
  const note = STATUS_NOTE[data.status] ?? "";

  return (
    <Document title={`Ptah Tours booking voucher ${data.reference}`} author="Ptah Tours">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>PTAH TOURS</Text>
            <Text style={styles.brandSub}>BOOKING VOUCHER</Text>
          </View>
          <Text style={styles.pill}>{label}</Text>
        </View>

        <View style={styles.refBlock}>
          <Text style={styles.refLabel}>BOOKING REFERENCE</Text>
          <Text style={styles.refValue}>{data.reference}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.dt}>Tour</Text>
            <Text style={styles.ddStrong}>{data.tourTitle}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.dt}>Departure</Text>
            <Text style={styles.dd}>{fmtDate(data.startDate)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.dt}>Returns</Text>
            <Text style={styles.dd}>{fmtDate(data.endDate)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.dt}>Travelers</Text>
            <Text style={styles.dd}>{String(data.seats)}</Text>
          </View>
          {data.pricing
            ? data.pricing.items.map((line) => (
                <View key={line.type} style={styles.row}>
                  <Text style={styles.dt}>{PAX_TYPE_LABEL[line.type]}</Text>
                  <Text style={styles.dd}>
                    {`${line.count} × ${formatPriceCents(line.unitCents, data.currency)}`}
                  </Text>
                </View>
              ))
            : null}
          {data.contactEmailMasked ? (
            <View style={styles.row}>
              <Text style={styles.dt}>Confirmation to</Text>
              <Text style={styles.dd}>{data.contactEmailMasked}</Text>
            </View>
          ) : null}
          {(data.discountCents ?? 0) > 0 ? (
            <View style={styles.row}>
              <Text style={styles.dt}>
                {data.couponCode ? `Discount (${data.couponCode})` : "Discount"}
              </Text>
              <Text style={styles.dd}>{`−${formatPriceCents(data.discountCents ?? 0, data.currency)}`}</Text>
            </View>
          ) : null}
          <View style={styles.totalRow}>
            <Text style={styles.dt}>Total</Text>
            <Text style={styles.total}>{formatPriceCents(data.totalCents, data.currency)}</Text>
          </View>
        </View>

        {note ? <Text style={styles.note}>{note}</Text> : null}

        <Text style={styles.footer}>
          Thank you for booking with Ptah Tours. Always quote your booking reference when you contact
          us about this trip.
        </Text>
      </Page>
    </Document>
  );
}
