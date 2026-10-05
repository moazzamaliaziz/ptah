/**
 * Ptah Tours' receiving bank account, shown to customers who pay by transfer.
 *
 * These are PUBLIC payment details — the same ones that would appear on an
 * invoice. They live here rather than in an env var because the bank-transfer
 * page needs them as discrete, labelled, copyable fields (an IBAN retyped by
 * hand is an IBAN mistyped by hand), which a single free-text blob cannot give.
 * `BANK_TRANSFER_INSTRUCTIONS` still works alongside this, as an extra note
 * under the table — use it for anything situational (correspondent bank,
 * branch, "send a screenshot to…") rather than for the numbers themselves.
 *
 * Pure module: no imports, safe from client components and server code alike.
 * Changing bank = edit this file.
 */

export interface BankAccountField {
  /** Stable key — the page maps it to a localized label. */
  key: "accountName" | "iban" | "accountNumber" | "bic";
  value: string;
}

export interface BankAccount {
  /** ISO-4217 code the account actually receives. */
  currency: string;
  fields: BankAccountField[];
}

/**
 * The account is USD-denominated, which matters: the site prices and charges in
 * USD (see src/content/currency.ts), so the amount quoted on the booking is the
 * amount to send, with no conversion for the customer to work out.
 */
export const BANK_ACCOUNT: BankAccount = {
  currency: "USD",
  fields: [
    { key: "accountName", value: "Refaat Michaeil" },
    { key: "iban", value: "EG320002032403240200000005313" },
    { key: "accountNumber", value: "3240200000005313" },
    { key: "bic", value: "BMISEGCXXXX" },
  ],
};

/** Group an IBAN into four-character blocks, the standard printed form. */
export function formatIban(iban: string): string {
  return iban.replace(/\s+/g, "").replace(/(.{4})/g, "$1 ").trim();
}
