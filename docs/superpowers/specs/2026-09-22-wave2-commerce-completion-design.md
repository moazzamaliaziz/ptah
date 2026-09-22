# Wave 2 — Commerce Completion Design

**Date:** 2026-09-22
**Status:** Approved (in-chat) — build authorized ("complete all the tasks and remaining works")

## Context

Wave 1 (all public pages, zero 404s) is complete and committed on `feat/wave1-pages`.
An audit of the existing codebase found the payment/booking/email/security layer is
**substantially pre-built** (Phases 3–7):

- **Stripe hosted checkout** — server-side session creation, server-computed prices,
  never trusts the client, never stores card/CVV. (`src/server/booking.ts`, `src/lib/stripe.ts`)
- **Webhook state machine** — signature verify + replay guard (`WebhookEvent.eventId`
  unique) + idempotent status-guarded transitions (confirm / fail+release / refund).
  (`src/app/api/webhooks/stripe/route.ts`)
- **Race-safe seat claim** — conditional `updateMany` inside `$transaction`.
  (`src/server/booking-core.ts`)
- **Provider-agnostic mailer** — SendGrid / SES / Mandrill, vault-driven; templates for
  password reset, email verification, booking confirmation, contact. (`src/server/email/*`)
- **RBAC** — capability matrix already defines **`bookings.view`** (all staff) and
  **`bookings.edit`** (SUPER_ADMIN/ADMIN) — currently unused. (`src/server/auth/capabilities.ts`)
- **Integrations vault** — AES-256-GCM; **PAYPAL** (CLIENT_ID/CLIENT_SECRET) and Paymob are
  already registered. (`src/server/integrations.ts`)
- **Audit log**, **rate limiting**, **CSP/HSTS proxy** — all present.

So Wave 2 is **audit-and-complete**, not build-from-scratch. Three genuine gaps remain,
built as three sub-projects (value-first order, each its own testable deliverable).

## Global constraints (apply to every sub-project)

- **Money = integer `*Cents` + `currency CHAR(3)`.** Never a float, never Decimal.
- **Never store card/CVV.** Card data stays with the gateway (hosted checkout / redirect).
- **All state transitions are status-guarded** `updateMany` so redeliveries/double-clicks
  can never double-confirm, double-release, or double-refund seats.
- **Design tokens:** `text-ink/nile/rust/white`, `text-section-h2/body/trip-h3/card-title/meta/eyebrow`,
  `bg-nile/white/papyrus`, `border-grey-300/60`. Admin pages use the existing `admin-*` CSS
  classes. **Banned:** charcoal/burgundy/font-display/hex.
- **Do not fabricate business facts** — bank-transfer instructions come from config/admin,
  never invented account numbers.
- **Server Actions are CSRF-safe** by Next's same-origin encrypted-action-id design; mutations
  additionally `requireCapability(...)` and `writeAudit(...)`.

---

## Sub-project 1 — Admin Orders & Refunds UI

**Goal:** Staff can see every booking, inspect one, and (admins) refund or cancel it.

**Capabilities:** reuse existing `bookings.view` (list/detail) and `bookings.edit` (refund/cancel).

**Refund ↔ webhook coexistence (the one hard problem) — Approach B:**
the admin action calls the gateway refund API **and** immediately runs the DB transition
(`refundBooking`). The later `charge.refunded` webhook calls `refundBooking` again but it is a
**guaranteed no-op** (status-guarded: already `REFUNDED` → `flip.count !== 1` → return). Instant
UI feedback; webhook remains the safety net and the sole path for Stripe-dashboard refunds.

**Full refunds only** (all seats released, whole amount). No partial refunds (would need a new
data model). **Cancel + release** for stuck `PENDING_PAYMENT` bookings (no gateway call — nothing
was captured). No resend-email, no staff-notes (→ no schema change).

**Files:**
- `src/server/admin/orders-admin.ts` — `listBookingsForAdmin({status?,q?})`, `getBookingForAdmin(id)`,
  `adminRefundBooking({bookingId,actorId})` (gateway refund dispatched by `payment.method`, then
  `refundBooking`), delegating cancel to booking.ts.
- Add to `src/server/booking.ts`: `cancelAndReleaseBooking({bookingId, actorId})` — status-guarded
  `PENDING_PAYMENT → CANCELLED` + seat release + audit; `refundStripePayment(intentId)` helper.
- `src/app/admin/(protected)/bookings/page.tsx` — list, status filter, search by ref/email.
- `src/app/admin/(protected)/bookings/[id]/page.tsx` — detail + action forms.
- `src/app/admin/(protected)/bookings/actions.ts` — refund + cancel actions.
- Edit `src/app/admin/(protected)/layout.tsx` — nav link gated on `bookings.view`.

**Known edge (documented):** admin cancels a `PENDING_PAYMENT` at the instant the customer pays.
Status guards mean no double-release; cancel is only *offered* while status is still
`PENDING_PAYMENT` (a landed payment already flipped it to `CONFIRMED`).

---

## Sub-project 2 — Bank transfer (offline)

**Goal:** Customer can choose "pay by bank transfer"; admin marks paid when funds arrive.

**Flow:** BookingForm gains a payment-method choice. Bank transfer → create `PENDING_PAYMENT`
booking + `Payment{method:"bank_transfer",status:PENDING}` → redirect to
`/booking/bank-transfer?booking=<id>` showing the booking reference + instructions. The order
appears in SP1's admin list; an admin clicks **Mark as paid** → `PENDING_PAYMENT → CONFIRMED`,
payment `SUCCEEDED`, confirmation email sent (reusing the existing template/mailer).

**Feature flag:** `PAYMENTS_BANK_TRANSFER_ENABLED` (SiteToggle + `FEATURE_BANK_TRANSFER_ENABLED`
env default, off). **Instructions** come from `env.BANK_TRANSFER_INSTRUCTIONS` (optional free text);
if the flag is on but instructions unset, the page shows a safe "we'll email you the bank details"
message — **no fabricated account numbers.**

**Files:**
- Add to `src/server/booking.ts`: `startBankTransfer(bookingId)`, `confirmBankTransferBooking({bookingId,actorId})`.
- `src/app/(site)/booking/bank-transfer/page.tsx` — reference + instructions.
- Edit `BookingForm.tsx` + `booking/[tourSlug]/actions.ts` — method selector + branch.
- Edit `bookings/actions.ts` + detail page — "Mark as paid" for bank-transfer pending.
- Extend toggles (`TOGGLE_KEYS`, defaults, admin toggles page) + env + seed.

---

## Sub-project 3 — PayPal + payment-provider seam

**Goal:** PayPal as a second online processor, behind a light dispatch seam (no heavy class
hierarchy — YAGNI). PayPal credentials already exist in the vault.

**Seam:** a `startCheckout(bookingId, method)` dispatcher and a `method`-switch in the refund path.
Stripe/PayPal/bank-transfer are the three methods. No behavior change to the Stripe path.

**PayPal (Orders v2, server-side redirect — mirrors Stripe hosted checkout, so no client SDK and
no CSP change):** OAuth token → create order (intent CAPTURE) → redirect to the approve link →
on return, capture server-side → confirm booking. A signed webhook (`PAYMENT.CAPTURE.COMPLETED`,
`.DENIED`, `.REFUNDED`) is the idempotent safety net, verified via PayPal's
verify-webhook-signature API using a vault `WEBHOOK_ID`.

**Vault additions to the PAYPAL def:** `ENVIRONMENT` (sandbox|live, non-secret), `WEBHOOK_ID`
(non-secret). Feature flag `PAYMENTS_PAYPAL_ENABLED`.

**Files:**
- `src/server/payments/paypal.ts` — REST client: token, createOrder, captureOrder, refundCapture,
  verifyWebhook.
- Add to `src/server/booking.ts`: `startPaypalCheckout(bookingId)`, `capturePaypalReturn(orderId)`,
  PayPal branch in refund dispatch.
- `src/app/(site)/booking/paypal-return/route.ts` — GET: capture then redirect to success/cancelled.
- `src/app/api/webhooks/paypal/route.ts` — verify + replay-guard + idempotent transitions.
- Edit `BookingForm.tsx` — PayPal option; extend `integrations.ts` PAYPAL fields; toggles + env + seed.

---

## Verification

- `npm run typecheck` (exit 0) after SP1 and after SP3.
- Full `npm run build` (exit 0) at the end — all routes present, no banned tokens.
- Idempotency is the core correctness property: every transition re-run is a no-op.
