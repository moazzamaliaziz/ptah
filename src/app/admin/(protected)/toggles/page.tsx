import type { JSX } from "react";
import { requireCapability, can } from "@/server/auth/rbac";
import { getToggles, TOGGLE_KEYS, type ToggleKey } from "@/server/toggles";
import { setToggleAction } from "./actions";

const META: Record<ToggleKey, { label: string; description: string }> = {
  SIGNUP_ENABLED: { label: "Customer sign-up", description: "Allow new customer account registration (enforced by the auth phase)." },
  LOGIN_ENABLED: { label: "Customer login", description: "Allow existing customers to sign in (enforced by the auth phase). Admin login is never affected." },
  PAYMENTS_STRIPE_ENABLED: { label: "Stripe payments", description: "Enable Stripe checkout (requires Stripe integration credentials + webhook)." },
  PAYMENTS_PAYPAL_ENABLED: { label: "PayPal payments", description: "Enable PayPal checkout (requires PayPal integration credentials + webhook ID)." },
  PAYMENTS_BANK_TRANSFER_ENABLED: { label: "Bank transfer", description: "Offer offline bank transfer at checkout. Set the instructions via BANK_TRANSFER_INSTRUCTIONS; staff confirm each payment manually in Orders." },
  MAINTENANCE_MODE: { label: "Maintenance mode", description: "Show a maintenance page to non-admin visitors. Admins keep full access." },
};

export default async function TogglesPage(): Promise<JSX.Element> {
  const user = await requireCapability("toggles.view");
  const editable = can(user, "toggles.edit");
  const toggles = await getToggles();

  return (
    <>
      <div className="admin-head">
        <h1>Site toggles</h1>
        <p>Runtime feature flags. The database is the source of truth; changes take effect within seconds.</p>
      </div>

      {!editable ? (
        <div className="admin-alert admin-alert--ok" role="status">
          Your role can view toggles but not change them.
        </div>
      ) : null}

      <div className="admin-grid">
        {TOGGLE_KEYS.map((key) => {
          const on = toggles[key];
          const meta = META[key];
          return (
            <div className="admin-card" key={key}>
              <div className="admin-row admin-row--between">
                <h2>{meta.label}</h2>
                <span className={`admin-badge ${on ? "admin-badge--on" : "admin-badge--off"}`}>
                  {on ? "On" : "Off"}
                </span>
              </div>
              <p className="admin-card__meta" style={{ margin: "0.35rem 0 0.9rem" }}>
                {meta.description}
              </p>
              <p className="admin-card__meta" style={{ marginBottom: "0.75rem", fontFamily: "monospace" }}>{key}</p>
              {editable ? (
                <form action={setToggleAction}>
                  <input type="hidden" name="key" value={key} />
                  <input type="hidden" name="value" value={on ? "false" : "true"} />
                  <button
                    className={`admin-btn ${on ? "admin-btn--danger" : ""}`}
                    type="submit"
                  >
                    {on ? "Disable" : "Enable"}
                  </button>
                </form>
              ) : null}
            </div>
          );
        })}
      </div>
    </>
  );
}
