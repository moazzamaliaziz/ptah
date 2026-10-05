/**
 * The receiving bank account shown to customers paying by transfer.
 *
 * Pure module — no imports, no DB, no `server-only` — so the shaping and
 * validation here are unit-testable and usable from the admin editor (client)
 * and the public page (server) alike. The VALUES live in site settings
 * (`payments.bank*`, see src/content/settings-schema.ts) and are edited in
 * Admin → Payments; nothing is hardcoded, so changing bank is an admin task
 * rather than a deploy.
 *
 * These are public payment details, the same ones that would appear on an
 * invoice — which is why they belong in the settings table and not the
 * credentials vault.
 */

export interface BankAccountField {
  /** Stable key — the page maps it to a localized label. */
  key: "accountName" | "iban" | "accountNumber" | "bic";
  value: string;
}

export interface BankAccount {
  /** ISO-4217 code the account receives, or "" when unset. */
  currency: string;
  /** Only the fields the admin actually filled in, in display order. */
  fields: BankAccountField[];
  /** Optional free-text note (correspondent bank, branch, instructions). */
  note: string;
}

/** The raw setting values the account is built from. */
export interface BankSettings {
  accountName: string;
  iban: string;
  accountNumber: string;
  bic: string;
  currency: string;
  note: string;
}

/**
 * Shape settings into a renderable account, dropping blank fields.
 *
 * Returns null when there is nothing meaningful to show — an account with no
 * name AND no IBAN is not an account, and the page must fall back to "we'll
 * email you the details" rather than print a lone BIC and look broken.
 */
export function buildBankAccount(settings: BankSettings): BankAccount | null {
  const fields: BankAccountField[] = (
    [
      { key: "accountName", value: settings.accountName },
      { key: "iban", value: settings.iban },
      { key: "accountNumber", value: settings.accountNumber },
      { key: "bic", value: settings.bic },
    ] as const
  )
    .filter((f) => f.value.trim() !== "")
    .map((f) => ({ key: f.key, value: f.value.trim() }));

  const hasAccount =
    settings.accountName.trim() !== "" || settings.iban.trim() !== "";
  if (!hasAccount) return null;

  return { currency: settings.currency.trim(), fields, note: settings.note.trim() };
}

/** Group an IBAN into four-character blocks, the standard printed form. */
export function formatIban(iban: string): string {
  return iban.replace(/\s+/g, "").replace(/(.{4})/g, "$1 ").trim();
}

/**
 * Verify an IBAN's check digits (ISO 13616 / ISO 7064 MOD-97-10).
 *
 * Worth doing because the whole point of showing an IBAN is that a customer
 * sends money to it: a transposed digit means a payment that bounces, or
 * reaches someone else, and nobody finds out for days. The admin editor runs
 * this as a warning rather than a hard block — the checksum catches typos, but
 * refusing to save on it would also refuse any account whose format this code
 * does not anticipate.
 */
export function isValidIban(iban: string): boolean {
  const compact = iban.replace(/\s+/g, "").toUpperCase();
  if (!/^[A-Z]{2}[0-9A-Z]{13,32}$/.test(compact)) return false;
  // Move the first four characters to the end, map letters to 10-35, then take
  // the whole thing mod 97 digit by digit (the number is far beyond Number's
  // safe range).
  const rearranged = compact.slice(4) + compact.slice(0, 4);
  let remainder = 0;
  for (const ch of rearranged) {
    const code = ch.charCodeAt(0);
    const chunk =
      code >= 65 && code <= 90 ? String(code - 55) : ch; // A-Z → 10-35
    for (const digit of chunk) {
      remainder = (remainder * 10 + Number(digit)) % 97;
    }
  }
  return remainder === 1;
}
