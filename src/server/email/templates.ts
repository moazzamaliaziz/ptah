/**
 * Transactional email templates (Phase 5). Server-only pure builders: given the
 * data, return a normalized EmailMessage (subject + plain text + HTML). No I/O,
 * no vendor coupling — the mailer picks the provider.
 *
 * Both a text and an HTML part are always produced. The HTML is deliberately
 * inline-styled and table-free-simple (email clients are hostile to modern CSS);
 * brand hexes are inlined here rather than referencing token utilities, which
 * do not exist in an email context. All interpolated user/content values are
 * HTML-escaped in the HTML part to prevent injection into the markup.
 */
import "server-only";

/** Escape the five HTML-significant characters for safe interpolation. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const NILE = "#1a2340";
const RUST = "#9a5c1b";
const INK = "#262626";

/** Shared HTML shell — a centered card with the wordmark and a footer. */
function shell(bodyHtml: string): string {
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f7f2e3;font-family:Arial,Helvetica,sans-serif;color:${INK};">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5ddc7;">
    <div style="background:${NILE};padding:20px 28px;">
      <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:0.04em;">PTAH TOURS</span>
    </div>
    <div style="padding:28px;line-height:1.5;font-size:15px;">
      ${bodyHtml}
    </div>
    <div style="padding:18px 28px;border-top:1px solid #eee;font-size:12px;color:rgba(38,38,38,0.55);">
      Ptah Tours · Curated journeys across Egypt
    </div>
  </div>
</body></html>`;
}

function button(href: string, label: string): string {
  return `<a href="${esc(href)}" style="display:inline-block;background:${NILE};color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:9999px;font-weight:600;font-size:14px;">${esc(label)}</a>`;
}

export interface BuiltEmail {
  subject: string;
  text: string;
  html: string;
}

/** Password reset link email. `resetUrl` is trusted (server-minted). */
export function passwordResetEmail(resetUrl: string): BuiltEmail {
  const subject = "Reset your Ptah Tours password";
  const text = [
    "We received a request to reset your Ptah Tours password.",
    "",
    "Reset it using the link below (valid for one hour):",
    resetUrl,
    "",
    "If you didn't request this, you can safely ignore this email — your password won't change.",
  ].join("\n");
  const html = shell(
    `<p style="margin:0 0 16px;">We received a request to reset your Ptah Tours password.</p>
     <p style="margin:0 0 24px;">Use the button below to choose a new one. This link is valid for one hour.</p>
     <p style="margin:0 0 24px;">${button(resetUrl, "Reset password")}</p>
     <p style="margin:0;font-size:13px;color:rgba(38,38,38,0.6);">If you didn't request this, you can safely ignore this email — your password won't change.</p>`,
  );
  return { subject, text, html };
}

/** Email-verification link email. `verifyUrl` is trusted (server-minted). */
export function emailVerificationEmail(verifyUrl: string): BuiltEmail {
  const subject = "Confirm your Ptah Tours email";
  const text = [
    "Welcome to Ptah Tours! Please confirm your email address to finish setting up your account.",
    "",
    "Confirm using the link below (valid for 24 hours):",
    verifyUrl,
    "",
    "If you didn't create an account, you can safely ignore this email.",
  ].join("\n");
  const html = shell(
    `<p style="margin:0 0 16px;">Welcome to Ptah Tours! Please confirm your email address to finish setting up your account.</p>
     <p style="margin:0 0 24px;">This link is valid for 24 hours.</p>
     <p style="margin:0 0 24px;">${button(verifyUrl, "Confirm email")}</p>
     <p style="margin:0;font-size:13px;color:rgba(38,38,38,0.6);">If you didn't create an account, you can safely ignore this email.</p>`,
  );
  return { subject, text, html };
}

export interface BookingConfirmationData {
  bookingId: string;
  tourTitle: string;
  tourSlug: string;
  /** Human-readable departure date, e.g. "Monday, March 3, 2026". */
  departureLabel: string;
  seats: number;
  /** Pre-formatted localized total, e.g. "$2,400.00". */
  totalFormatted: string;
  /** Absolute URL where the traveler can view/track this booking. */
  manageUrl: string;
}

/** Booking-confirmed email. All values are escaped in the HTML part. */
export function bookingConfirmationEmail(data: BookingConfirmationData): BuiltEmail {
  const subject = `Your Ptah Tours booking is confirmed — ${data.tourTitle}`;
  const text = [
    `You're booked! Here are your trip details.`,
    "",
    `Tour: ${data.tourTitle}`,
    `Departure: ${data.departureLabel}`,
    `Travelers: ${data.seats}`,
    `Total paid: ${data.totalFormatted}`,
    `Booking reference: ${data.bookingId}`,
    "",
    `Manage your booking: ${data.manageUrl}`,
    "",
    "We can't wait to show you Egypt.",
  ].join("\n");
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 0;color:rgba(38,38,38,0.55);">${esc(label)}</td><td style="padding:6px 0;text-align:right;font-weight:600;color:${INK};">${esc(value)}</td></tr>`;
  const html = shell(
    `<p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${RUST};">Booking confirmed</p>
     <h1 style="margin:0 0 20px;font-size:22px;color:${NILE};">You're booked!</h1>
     <table style="width:100%;border-collapse:collapse;font-size:14px;">
       ${row("Tour", data.tourTitle)}
       ${row("Departure", data.departureLabel)}
       ${row("Travelers", String(data.seats))}
       ${row("Total paid", data.totalFormatted)}
       ${row("Reference", data.bookingId)}
     </table>
     <p style="margin:24px 0;">${button(data.manageUrl, "Manage your booking")}</p>
     <p style="margin:0;font-size:13px;color:rgba(38,38,38,0.6);">We can't wait to show you Egypt.</p>`,
  );
  return { subject, text, html };
}

export interface ContactMessageData {
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
}

/**
 * Admin notification for a new contact-form submission. All customer-supplied
 * values are escaped in the HTML part; the reply-to is set to the sender's
 * address by the caller so the admin can reply directly.
 */
export function contactMessageEmail(data: ContactMessageData): BuiltEmail {
  const subjectLine = data.subject ? `New enquiry: ${data.subject}` : "New enquiry from the website";
  const text = [
    "You have a new contact-form enquiry.",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    ...(data.phone ? [`Phone: ${data.phone}`] : []),
    ...(data.subject ? [`Subject: ${data.subject}`] : []),
    "",
    "Message:",
    data.message,
  ].join("\n");
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 0;color:rgba(38,38,38,0.55);vertical-align:top;">${esc(label)}</td><td style="padding:6px 0;text-align:right;font-weight:600;color:${INK};">${esc(value)}</td></tr>`;
  const html = shell(
    `<p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${RUST};">New enquiry</p>
     <h1 style="margin:0 0 20px;font-size:20px;color:${NILE};">${esc(data.subject ?? "Website contact form")}</h1>
     <table style="width:100%;border-collapse:collapse;font-size:14px;">
       ${row("Name", data.name)}
       ${row("Email", data.email)}
       ${data.phone ? row("Phone", data.phone) : ""}
     </table>
     <p style="margin:20px 0 6px;font-weight:600;color:${INK};">Message</p>
     <p style="margin:0;white-space:pre-line;color:rgba(38,38,38,0.85);">${esc(data.message)}</p>`,
  );
  return { subject: subjectLine, text, html };
}
