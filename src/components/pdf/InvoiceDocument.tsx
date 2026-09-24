import "server-only";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatPriceCents } from "@/lib/utils";
import { PAX_TYPE_LABEL, type PriceBreakdown } from "@/server/booking-core";

/**
 * Server-generated admin invoice (item #11, Phase 2). Rendered to a PDF Buffer
 * by the /admin/bookings/[id]/invoice route via `renderToBuffer`. Server-only
 * and staff-gated at the route — unlike the customer voucher it shows full
 * (unmasked) billing details, so it must never be reachable without
 * bookings.view. Exported as a plain function called as `InvoiceDocument(data)`
 * (same contract as VoucherDocument): `renderToBuffer` takes the <Document>
 * element itself, not a wrapper component.
 */
export interface InvoicePayment {
  method: string;
  status: string;
  amountCents: number;
  currency: string;
  /** Gateway id or manually-recorded reference; null when neither exists. */
  reference: string | null;
  createdAt: Date;
}

export interface InvoiceBilling {
  line1: string;
  line2: string | null;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface InvoiceData {
  /** Booking id — doubles as the invoice number. */
  reference: string;
  status: string;
  issuedAt: Date;
  tourTitle: string;
  startDate: Date;
  endDate: Date;
  seats: number;
  totalCents: number;
  currency: string;
  /** P5: discount applied at checkout (minor units); 0 when no coupon. The
   *  price-breakdown lines below sum to the GROSS; `totalCents` is already NET. */
  discountCents: number;
  /** Coupon code applied, or null — shown on the discount line. */
  couponCode: string | null;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  billing: InvoiceBilling | null;
  /** Frozen per-passenger-type price breakdown, or null for legacy bookings. */
  pricing: PriceBreakdown | null;
  /** ISO-3166 alpha-2 the booking was made from (distinct from billing country). */
  originCountry: string | null;
  payments: InvoicePayment[];
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
  CONFIRMED: "Paid",
  PENDING_PAYMENT: "Awaiting payment",
  REFUNDED: "Refunded",
  CANCELLED: "Cancelled",
  FAILED: "Payment failed",
};

function methodLabel(method: string): string {
  if (method === "bank_transfer") return "Bank transfer";
  return method.charAt(0).toUpperCase() + method.slice(1);
}

function fmtDate(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

function fmtDateTime(d: Date): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(d);
}

/** ISO-3166 alpha-2 → English country name (built-in, no dependency); the raw
 *  code is a safe fallback if the runtime can't resolve it. Null passes through. */
function regionName(code: string | null): string | null {
  if (!code) return null;
  const trimmed = code.trim().toUpperCase();
  if (!trimmed) return null;
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(trimmed) ?? trimmed;
  } catch {
    return trimmed;
  }
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
  metaGrid: { flexDirection: "row", justifyContent: "space-between", marginTop: 24 },
  metaCol: { width: "48%" },
  metaLabel: { fontSize: 8, color: BRAND.rust, letterSpacing: 1 },
  metaValue: { fontSize: 11, marginTop: 2 },
  metaValueStrong: { fontSize: 12, fontFamily: "Helvetica-Bold", marginTop: 2 },
  sectionLabel: { fontSize: 8, color: BRAND.rust, letterSpacing: 1, marginTop: 22 },
  card: {
    marginTop: 8,
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
  rowLast: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 16,
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
  addr: { marginTop: 8, color: BRAND.ink },
  code: { fontFamily: "Courier", fontSize: 9 },
  footer: {
    marginTop: 28,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BRAND.border,
    borderTopStyle: "solid",
    fontSize: 9,
    color: BRAND.muted,
  },
});

export function InvoiceDocument(data: InvoiceData) {
  const label = STATUS_LABEL[data.status] ?? data.status;
  const b = data.billing;
  const originName = regionName(data.originCountry);

  return (
    <Document title={`Ptah Tours invoice ${data.reference}`} author="Ptah Tours">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>PTAH TOURS</Text>
            <Text style={styles.brandSub}>INVOICE</Text>
          </View>
          <Text style={styles.pill}>{label}</Text>
        </View>

        <View style={styles.metaGrid}>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>INVOICE NUMBER</Text>
            <Text style={styles.metaValueStrong}>{data.reference}</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>ISSUED</Text>
            <Text style={styles.metaValue}>{fmtDate(data.issuedAt)}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>BILL TO</Text>
        <View style={styles.card}>
          <View style={b || data.customerEmail || data.customerPhone || originName ? styles.row : styles.rowLast}>
            <Text style={styles.dt}>Name</Text>
            <Text style={styles.ddStrong}>{data.customerName ?? "—"}</Text>
          </View>
          {data.customerEmail ? (
            <View style={styles.row}>
              <Text style={styles.dt}>Email</Text>
              <Text style={styles.dd}>{data.customerEmail}</Text>
            </View>
          ) : null}
          {data.customerPhone ? (
            <View style={b || originName ? styles.row : styles.rowLast}>
              <Text style={styles.dt}>Phone</Text>
              <Text style={styles.dd}>{data.customerPhone}</Text>
            </View>
          ) : null}
          {b ? (
            <View style={originName ? styles.row : styles.rowLast}>
              <Text style={styles.dt}>Billing address</Text>
              <View style={{ textAlign: "right" }}>
                <Text style={styles.dd}>{b.line1}</Text>
                {b.line2 ? <Text style={styles.dd}>{b.line2}</Text> : null}
                <Text style={styles.dd}>
                  {[b.city, b.region, b.postalCode].filter(Boolean).join(", ")}
                </Text>
                {b.country ? <Text style={styles.dd}>{b.country}</Text> : null}
              </View>
            </View>
          ) : null}
          {originName ? (
            <View style={styles.rowLast}>
              <Text style={styles.dt}>Booked from</Text>
              <Text style={styles.dd}>{originName}</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.sectionLabel}>SUMMARY</Text>
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
          {data.discountCents > 0 ? (
            <View style={styles.row}>
              <Text style={styles.dt}>
                {data.couponCode ? `Discount (${data.couponCode})` : "Discount"}
              </Text>
              <Text style={styles.dd}>{`−${formatPriceCents(data.discountCents, data.currency)}`}</Text>
            </View>
          ) : null}
          <View style={styles.totalRow}>
            <Text style={styles.dt}>Total</Text>
            <Text style={styles.total}>{formatPriceCents(data.totalCents, data.currency)}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>PAYMENTS</Text>
        <View style={styles.card}>
          {data.payments.length === 0 ? (
            <View style={styles.rowLast}>
              <Text style={styles.dt}>No payment recorded</Text>
              <Text style={styles.dd}>—</Text>
            </View>
          ) : (
            data.payments.map((p, i) => {
              const last = i === data.payments.length - 1;
              return (
                <View key={i} style={last ? styles.rowLast : styles.row}>
                  <View>
                    <Text>{`${methodLabel(p.method)} · ${p.status}`}</Text>
                    {p.reference ? <Text style={styles.code}>{p.reference}</Text> : null}
                    <Text style={{ color: BRAND.muted, fontSize: 9 }}>{fmtDateTime(p.createdAt)}</Text>
                  </View>
                  <Text style={styles.dd}>{formatPriceCents(p.amountCents, p.currency)}</Text>
                </View>
              );
            })
          )}
        </View>

        <Text style={styles.footer}>
          Ptah Tours · Egypt tours &amp; travel. This invoice was generated for the booking above;
          always quote the invoice number when you contact us about this order.
        </Text>
      </Page>
    </Document>
  );
}



