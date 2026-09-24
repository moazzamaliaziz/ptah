/**
 * RBAC negative-authorization check (Phase 2 gate). Pure — no DB/Next.
 * Run: npx tsx scripts/rbac-check.mts
 */
import { can, isStaff, type Capability } from "../src/server/auth/capabilities";
import type { Role } from "@prisma/client";

type Expect = Record<Capability, boolean>;

const EXPECT: Record<Role, { staff: boolean; caps: Expect }> = {
  SUPER_ADMIN: {
    staff: true,
    caps: {
      "admin.access": true, "content.view": true, "content.edit": true,
      "toggles.view": true, "toggles.edit": true, "integrations.view": true,
      "integrations.manage": true, "bookings.view": true, "bookings.edit": true,
      "users.manage": true, "audit.view": true,
      "catalog.view": true, "catalog.edit": true, "media.view": true, "media.manage": true,
      "branding.view": true, "branding.edit": true, "widgets.view": true, "widgets.edit": true,
      "events.view": true, "events.edit": true, "tripideas.view": true, "tripideas.edit": true,
      "enquiries.view": true, "enquiries.manage": true,
      "coupons.view": true, "coupons.edit": true,
      "reports.view": true,
    },
  },
  ADMIN: {
    staff: true,
    caps: {
      "admin.access": true, "content.view": true, "content.edit": true,
      "toggles.view": true, "toggles.edit": true, "integrations.view": true,
      "integrations.manage": true, "bookings.view": true, "bookings.edit": true,
      "users.manage": false, "audit.view": true,
      "catalog.view": true, "catalog.edit": true, "media.view": true, "media.manage": true,
      "branding.view": true, "branding.edit": true, "widgets.view": true, "widgets.edit": true,
      "events.view": true, "events.edit": true, "tripideas.view": true, "tripideas.edit": true,
      "enquiries.view": true, "enquiries.manage": true,
      "coupons.view": true, "coupons.edit": true,
      "reports.view": true,
    },
  },
  EDITOR: {
    staff: true,
    caps: {
      "admin.access": true, "content.view": true, "content.edit": true,
      "toggles.view": false, "toggles.edit": false, "integrations.view": false,
      "integrations.manage": false, "bookings.view": true, "bookings.edit": false,
      "users.manage": false, "audit.view": false,
      "catalog.view": true, "catalog.edit": true, "media.view": true, "media.manage": true,
      "branding.view": false, "branding.edit": false, "widgets.view": false, "widgets.edit": false,
      "events.view": true, "events.edit": true, "tripideas.view": true, "tripideas.edit": true,
      "enquiries.view": false, "enquiries.manage": false,
      "coupons.view": true, "coupons.edit": false,
      "reports.view": false,
    },
  },
  SUPPORT: {
    staff: true,
    caps: {
      "admin.access": true, "content.view": true, "content.edit": false,
      "toggles.view": true, "toggles.edit": false, "integrations.view": false,
      "integrations.manage": false, "bookings.view": true, "bookings.edit": false,
      "users.manage": false, "audit.view": false,
      "catalog.view": true, "catalog.edit": false, "media.view": true, "media.manage": false,
      "branding.view": false, "branding.edit": false, "widgets.view": false, "widgets.edit": false,
      "events.view": true, "events.edit": false, "tripideas.view": true, "tripideas.edit": false,
      "enquiries.view": true, "enquiries.manage": false,
      "coupons.view": true, "coupons.edit": false,
      "reports.view": false,
    },
  },
  USER: {
    staff: false,
    caps: {
      "admin.access": false, "content.view": false, "content.edit": false,
      "toggles.view": false, "toggles.edit": false, "integrations.view": false,
      "integrations.manage": false, "bookings.view": false, "bookings.edit": false,
      "users.manage": false, "audit.view": false,
      "catalog.view": false, "catalog.edit": false, "media.view": false, "media.manage": false,
      "branding.view": false, "branding.edit": false, "widgets.view": false, "widgets.edit": false,
      "events.view": false, "events.edit": false, "tripideas.view": false, "tripideas.edit": false,
      "enquiries.view": false, "enquiries.manage": false,
      "coupons.view": false, "coupons.edit": false,
      "reports.view": false,
    },
  },
};

let pass = 0;
let fail = 0;
const failures: string[] = [];

for (const role of Object.keys(EXPECT) as Role[]) {
  const spec = EXPECT[role];
  const user = { role };
  if (isStaff(user) !== spec.staff) {
    fail++; failures.push(`${role}: isStaff expected ${spec.staff}`);
  } else pass++;
  for (const cap of Object.keys(spec.caps) as Capability[]) {
    const got = can(user, cap);
    if (got !== spec.caps[cap]) {
      fail++; failures.push(`${role} × ${cap}: expected ${spec.caps[cap]}, got ${got}`);
    } else pass++;
  }
}

// Null user is denied everything.
if (can(null, "admin.access") || isStaff(null)) {
  fail++; failures.push("null user was granted access");
} else pass++;

console.log(`RBAC matrix checks — pass: ${pass}, fail: ${fail}`);
if (failures.length) {
  console.error("FAILURES:\n" + failures.map((f) => "  ✗ " + f).join("\n"));
  process.exit(1);
}
console.log("✓ All role × capability negative/positive checks passed.");
