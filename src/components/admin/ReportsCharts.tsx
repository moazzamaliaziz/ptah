"use client";

/**
 * Reports charts (Wave 3) — the ONLY client component on the reports page.
 * Admin screens are server components; Recharts needs the browser, so the
 * server page passes plain, already-aggregated arrays down as props and this
 * island just renders them. No data fetching happens here.
 *
 * Money is deliberately NOT charted: the shop takes several currencies and they
 * are never summed (see server/admin/reports.ts), so a single "revenue" bar
 * would be meaningless. These charts show COUNTS only (bookings), which are
 * currency-agnostic; per-currency money stays in the tables below the charts.
 */
import type { ReactNode } from "react";
import type { ReportsChartsDict } from "@/i18n/admin/dictionary";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export interface StatusDatum {
  /** BookingStatus enum value — drives the slice colour. */
  key: string;
  name: string;
  value: number;
}
export interface BookingsDatum {
  name: string;
  bookings: number;
}

const NILE = "#1a2340";
const GOLD = "#d9822b";

/** Semantic status colours (reflect meaning, not just a cycle). */
const STATUS_COLOR: Record<string, string> = {
  CONFIRMED: "#12613a",
  PENDING_PAYMENT: GOLD,
  CANCELLED: "#6b6b6b",
  REFUNDED: "#8a1c1c",
  FAILED: "#b3541e",
};

/** Shorten a long tour/country label so vertical-axis ticks stay readable. */
function truncate(label: string, max = 22): string {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <figure className="admin-chart">
      <figcaption className="admin-chart__cap">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </figcaption>
      {children}
    </figure>
  );
}

export function ReportsCharts({
  status,
  topTours,
  countries,
  labels,
}: {
  status: StatusDatum[];
  topTours: BookingsDatum[];
  countries: BookingsDatum[];
  labels: ReportsChartsDict;
}) {
  return (
    <div className="admin-charts">
      <ChartCard title={labels.statusTitle} subtitle={labels.statusSubtitle}>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={status}
              dataKey="value"
              nameKey="name"
              innerRadius={52}
              outerRadius={84}
              paddingAngle={2}
            >
              {status.map((s) => (
                <Cell key={s.key} fill={STATUS_COLOR[s.key] ?? NILE} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title={labels.toursTitle} subtitle={labels.toursSubtitle}>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            layout="vertical"
            data={topTours}
            margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
          >
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
              tick={{ fontSize: 11 }}
              tickFormatter={(v: string) => truncate(v)}
            />
            <Tooltip />
            <Bar dataKey="bookings" name={labels.bookingsSeries} fill={GOLD} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title={labels.countriesTitle} subtitle={labels.countriesSubtitle}>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            layout="vertical"
            data={countries}
            margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
          >
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fontSize: 11 }}
              tickFormatter={(v: string) => truncate(v)}
            />
            <Tooltip />
            <Bar dataKey="bookings" name={labels.bookingsSeries} fill={NILE} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
