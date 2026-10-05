"use client";

/**
 * Travel-date calendar (P8) — the traveler picks the day that suits them
 * instead of choosing from a fixed list of departures.
 *
 * Deliberately clock-free. Every boundary arrives as a "YYYY-MM-DD" string
 * computed on the server (`firstDate`, `lastDate`, `blackoutDates`,
 * `unavailableDates`), and the grid is built from the displayed month alone, so
 * the markup is a pure function of its props: no `Date.now()`, no hydration
 * mismatch between a server in Cairo and a browser in Auckland, and no
 * disagreement with the server's own `assertSelectableDate` check. ISO dates
 * compare correctly as plain strings, which is why the whole component works in
 * strings and only touches `Date` to lay out the month.
 *
 * Accessibility: a real grid (`role="grid"`), one tab stop with arrow-key
 * roving focus per the date-picker pattern, and unavailable days rendered as
 * `aria-disabled` buttons so a screen reader can still read why a day is out.
 */
import { useMemo, useRef, useState, type JSX, type KeyboardEvent } from "react";

export interface DepartureCalendarLabels {
  /** Accessible name for the grid. */
  calendarLabel: string;
  prevMonth: string;
  nextMonth: string;
  /** Tooltip/aria suffix on a day that cannot be booked. */
  dateUnavailable: string;
  /** "Travelling on {date}" once a day is chosen. */
  dateSelected: string;
  /** Shown before anything is picked. */
  datePlaceholder: string;
  /** "Earliest date: {date}" helper under the grid. */
  earliestDate: string;
}

export interface DepartureCalendarProps {
  /** Selected day as "YYYY-MM-DD", or null before the traveler picks one. */
  value: string | null;
  onChange: (isoDate: string) => void;
  /** Inclusive first selectable day ("YYYY-MM-DD"), from the tour's lead time. */
  firstDate: string;
  /** Inclusive last selectable day, from the tour's booking window. */
  lastDate: string;
  /** Operator-closed days ("YYYY-MM-DD"). */
  blackoutDates: readonly string[];
  /** Days inside the window that are sold out or closed on an existing
   *  departure — bookable in principle, not today. */
  unavailableDates: readonly string[];
  /** BCP-47 tag for month/weekday names and the long date in the status line. */
  locale: string;
  labels: DepartureCalendarLabels;
}

/** UTC midnight for a "YYYY-MM-DD" string. */
function parse(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

/** A Date as its UTC "YYYY-MM-DD" string. */
function format(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** `{ y, m }` of the month `iso` falls in (m is 0-based, like Date). */
function monthOf(iso: string): { y: number; m: number } {
  const d = parse(iso);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth() };
}

function addMonths({ y, m }: { y: number; m: number }, delta: number): { y: number; m: number } {
  const total = y * 12 + m + delta;
  return { y: Math.floor(total / 12), m: ((total % 12) + 12) % 12 };
}

/** Is this month entirely before/after the bookable range? */
function monthBefore(a: { y: number; m: number }, b: { y: number; m: number }): boolean {
  return a.y * 12 + a.m < b.y * 12 + b.m;
}

/**
 * The 7-column grid for a month: leading nulls for the days before the 1st, one
 * entry per day, trailing nulls to fill the final week. `weekStart` is the
 * locale's first weekday (0 = Sunday).
 */
function monthGrid(y: number, m: number, weekStart: number): (string | null)[] {
  const first = new Date(Date.UTC(y, m, 1));
  const daysInMonth = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const lead = (first.getUTCDay() - weekStart + 7) % 7;
  const cells: (string | null)[] = Array.from({ length: lead }, () => null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(format(new Date(Date.UTC(y, m, day))));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

/**
 * The locale's first day of the week. `Intl.Locale.weekInfo` knows this (Sunday
 * in the US, Monday across most of Europe, Saturday in Egypt) but is not in
 * every runtime, so an unsupported environment falls back to Sunday rather
 * than throwing.
 */
function firstWeekday(locale: string): number {
  try {
    const info = (new Intl.Locale(locale) as Intl.Locale & { weekInfo?: { firstDay?: number } })
      .weekInfo;
    const firstDay = info?.firstDay;
    // weekInfo counts Monday = 1 … Sunday = 7; Date counts Sunday = 0.
    return typeof firstDay === "number" ? firstDay % 7 : 0;
  } catch {
    return 0;
  }
}

export default function DepartureCalendar({
  value,
  onChange,
  firstDate,
  lastDate,
  blackoutDates,
  unavailableDates,
  locale,
  labels,
}: DepartureCalendarProps): JSX.Element {
  const weekStart = useMemo(() => firstWeekday(locale), [locale]);
  const minMonth = useMemo(() => monthOf(firstDate), [firstDate]);
  const maxMonth = useMemo(() => monthOf(lastDate), [lastDate]);
  // Open on the chosen day's month, else on the first bookable month.
  const [month, setMonth] = useState(() => monthOf(value ?? firstDate));
  // Which day owns the grid's single tab stop (roving focus).
  const [focusedDate, setFocusedDate] = useState(() => value ?? firstDate);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const blocked = useMemo(
    () => new Set([...blackoutDates, ...unavailableDates]),
    [blackoutDates, unavailableDates],
  );

  const monthFmt = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }),
    [locale],
  );
  const dayFmt = useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }),
    [locale],
  );
  const longFmt = useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }),
    [locale],
  );
  // Weekday headers, taken from a known week so they follow `weekStart`.
  const weekdays = useMemo(() => {
    const narrow = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
    // 2024-01-07 is a Sunday, so +i lands on weekday (weekStart + i) % 7.
    return Array.from({ length: 7 }, (_, i) =>
      narrow.format(new Date(Date.UTC(2024, 0, 7 + ((weekStart + i) % 7)))),
    );
  }, [locale, weekStart]);

  const selectable = (iso: string) => iso >= firstDate && iso <= lastDate && !blocked.has(iso);

  const cells = useMemo(() => monthGrid(month.y, month.m, weekStart), [month, weekStart]);
  const canGoBack = !monthBefore(addMonths(month, -1), minMonth);
  const canGoForward = !monthBefore(maxMonth, addMonths(month, 1));

  /** Move the roving tab stop by `days`, following it across month boundaries. */
  const moveFocus = (days: number) => {
    const next = format(new Date(parse(focusedDate).getTime() + days * 86_400_000));
    const clamped = next < firstDate ? firstDate : next > lastDate ? lastDate : next;
    setFocusedDate(clamped);
    const target = monthOf(clamped);
    if (target.y !== month.y || target.m !== month.m) setMonth(target);
    // Focus lands on the newly rendered button on the next paint.
    requestAnimationFrame(() => {
      gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${clamped}"]`)?.focus();
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const steps: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
      PageUp: -28,
      PageDown: 28,
    };
    const step = steps[event.key];
    if (step === undefined) return;
    event.preventDefault();
    moveFocus(step);
  };

  return (
    <div className="rounded-xl border border-grey-300/60 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => canGoBack && setMonth(addMonths(month, -1))}
          disabled={!canGoBack}
          aria-label={labels.prevMonth}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-grey-300/70 text-nile transition-colors hover:bg-nile/5 disabled:opacity-35"
        >
          ‹
        </button>
        <p aria-live="polite" className="text-body font-semibold text-ink">
          {monthFmt.format(new Date(Date.UTC(month.y, month.m, 1)))}
        </p>
        <button
          type="button"
          onClick={() => canGoForward && setMonth(addMonths(month, 1))}
          disabled={!canGoForward}
          aria-label={labels.nextMonth}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-grey-300/70 text-nile transition-colors hover:bg-nile/5 disabled:opacity-35"
        >
          ›
        </button>
      </div>

      <div
        ref={gridRef}
        role="grid"
        aria-label={labels.calendarLabel}
        onKeyDown={onKeyDown}
        className="mt-3"
      >
        <div role="row" className="grid grid-cols-7 gap-1">
          {weekdays.map((day, i) => (
            <div
              key={i}
              role="columnheader"
              aria-label={day}
              className="py-1 text-center text-[11px] font-semibold uppercase tracking-wide text-ink/45"
            >
              {day}
            </div>
          ))}
        </div>
        {Array.from({ length: cells.length / 7 }, (_, week) => (
          <div key={week} role="row" className="grid grid-cols-7 gap-1">
            {cells.slice(week * 7, week * 7 + 7).map((iso, i) => {
              if (!iso) return <div key={i} role="gridcell" aria-hidden="true" className="h-10" />;
              const open = selectable(iso);
              const chosen = iso === value;
              return (
                <div key={iso} role="gridcell" aria-selected={chosen}>
                  <button
                    type="button"
                    data-date={iso}
                    // One tab stop for the whole grid; arrows move within it.
                    tabIndex={iso === focusedDate ? 0 : -1}
                    aria-disabled={!open}
                    aria-label={open ? dayFmt.format(parse(iso)) : `${dayFmt.format(parse(iso))} — ${labels.dateUnavailable}`}
                    onFocus={() => setFocusedDate(iso)}
                    onClick={() => {
                      // `aria-disabled` (not `disabled`) keeps the day readable
                      // and focusable, so the click has to be refused here.
                      if (!open) return;
                      setFocusedDate(iso);
                      onChange(iso);
                    }}
                    className={`h-10 w-full rounded-lg text-body transition-colors ${
                      chosen
                        ? "bg-nile font-semibold text-white"
                        : open
                          ? "text-ink hover:bg-nile/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nile"
                          : "cursor-not-allowed text-ink/25 line-through"
                    }`}
                  >
                    {parse(iso).getUTCDate()}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <p className="mt-3 border-t border-grey-300/50 pt-3 text-meta text-ink/70" aria-live="polite">
        {value
          ? labels.dateSelected.replace("{date}", longFmt.format(parse(value)))
          : labels.datePlaceholder}
      </p>
      <p className="mt-1 text-[11px] text-ink/45">
        {labels.earliestDate.replace("{date}", longFmt.format(parse(firstDate)))}
      </p>
    </div>
  );
}
