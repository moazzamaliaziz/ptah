"use client";

/**
 * The receiving bank account, as discrete copyable rows.
 *
 * Copy buttons are the point, not decoration: a 29-character IBAN retyped by
 * hand is a payment that bounces or lands somewhere else, and the customer only
 * finds out days later. Each value is also rendered in a monospace face with
 * the IBAN grouped in fours, so anyone transcribing it manually has the best
 * chance of getting it right.
 *
 * Degrades honestly: if the Clipboard API refuses (permission denied, or a
 * non-secure context) the button does not claim a copy that did not happen —
 * the value stays on screen, selectable, as the fallback.
 */
import { useEffect, useState, type JSX } from "react";
import { BANK_ACCOUNT, formatIban, type BankAccountField } from "@/content/bank-details";

export interface BankDetailsLabels {
  accountName: string;
  iban: string;
  accountNumber: string;
  bic: string;
  currencyLabel: string;
  copy: string;
  copied: string;
}

function displayValue(field: BankAccountField): string {
  return field.key === "iban" ? formatIban(field.value) : field.value;
}

function CopyButton({ value, labels }: { value: string; labels: BankDetailsLabels }): JSX.Element {
  const [copied, setCopied] = useState(false);

  // Reset the confirmation after a beat. Scheduling in an effect (rather than
  // setting state inside it) keeps this off React's cascading-render path.
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          // Copy the raw value, never the spaced display form — a grouped IBAN
          // pasted into a banking form is usually rejected.
          await navigator.clipboard.writeText(value);
          setCopied(true);
        } catch {
          // Permission denied, or a non-secure context with no Clipboard API.
          // The value stays on screen and selectable, so there is still a way
          // to take it; we just don't claim a copy that did not happen.
          setCopied(false);
        }
      }}
      className="shrink-0 rounded-full border border-nile/25 px-3 py-1 text-[11px] font-semibold text-nile transition-colors hover:border-nile hover:bg-nile/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nile"
    >
      {copied ? labels.copied : labels.copy}
    </button>
  );
}

export default function BankDetails({ labels }: { labels: BankDetailsLabels }): JSX.Element {
  return (
    <dl className="mt-4 divide-y divide-grey-300/50 border-y border-grey-300/50">
      {BANK_ACCOUNT.fields.map((field) => (
        <div key={field.key} className="flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <dt className="text-[11px] uppercase tracking-wide text-ink/50">{labels[field.key]}</dt>
            <dd className="mt-0.5 break-all font-mono text-meta font-semibold text-ink">
              {displayValue(field)}
            </dd>
          </div>
          <CopyButton value={field.value} labels={labels} />
        </div>
      ))}
      <div className="flex items-center justify-between gap-4 py-3">
        <dt className="text-[11px] uppercase tracking-wide text-ink/50">{labels.currencyLabel}</dt>
        <dd className="font-mono text-meta font-semibold text-ink">{BANK_ACCOUNT.currency}</dd>
      </div>
    </dl>
  );
}
