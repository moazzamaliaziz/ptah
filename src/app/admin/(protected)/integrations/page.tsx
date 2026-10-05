import type { JSX } from "react";
import { requireCapability, can } from "@/server/auth/rbac";
import {
  listIntegrationsForAdmin,
  type IntegrationCategory,
  type IntegrationView,
} from "@/server/integrations";
import { saveIntegrationAction } from "./actions";
import PaypalTest from "./PaypalTest";
import AdminHint from "@/components/admin/AdminHint";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict, type IntegrationsDict } from "@/i18n/admin/dictionary";

const CATEGORY_ORDER: IntegrationCategory[] = [
  "analytics", "payments", "security", "email", "sms", "maps", "reviews", "monitoring", "automation",
];

function IntegrationCard({ item, canManage, labels, helpLabel }: { item: IntegrationView; canManage: boolean; labels: IntegrationsDict; helpLabel: string }): JSX.Element {
  return (
    <div className="admin-card">
      <div className="admin-row admin-row--between">
        <h3>{item.label}</h3>
        <span className={`admin-badge ${item.enabled ? "admin-badge--on" : "admin-badge--off"}`}>
          {item.enabled ? labels.badgeEnabled : labels.badgeOff}
        </span>
      </div>
      <p className="admin-card__meta" style={{ margin: "0.15rem 0 0.75rem" }}>
        {item.configured ? labels.configured : labels.notConfigured}
      </p>

      <form action={saveIntegrationAction}>
        <input type="hidden" name="key" value={item.key} />
        <label className="admin-switch" style={{ marginBottom: "0.75rem" }}>
          <input type="checkbox" name="enabled" defaultChecked={item.enabled} disabled={!canManage} />
          <span>{labels.enabledSwitch}</span>
        </label>

        {item.fields.map((f) => (
          <label className="admin-field" key={f.name}>
            <span>
              {f.label}
              {f.help ? <AdminHint text={f.help} helpLabel={helpLabel} /> : null}
              {f.secret ? (
                <em style={{ fontWeight: 400, opacity: 0.6 }}> · {f.isSet ? labels.secretSet : labels.secretNotSet}</em>
              ) : null}
            </span>
            <input
              className="admin-input"
              type={f.secret ? "password" : "text"}
              name={f.name}
              defaultValue={f.value}
              placeholder={f.secret ? (f.isSet ? "••••••••" : f.placeholder ?? "") : f.placeholder ?? ""}
              autoComplete="off"
              disabled={!canManage}
            />
          </label>
        ))}

        {canManage ? (
          <button className="admin-btn" type="submit">
            {labels.save}
          </button>
        ) : null}
      </form>

      {/* PayPal only: a checkout that will not start is otherwise invisible
          here — the card happily reads "Enabled / Configured" while PayPal
          refuses every order. */}
      {item.key === "PAYPAL" && canManage ? <PaypalTest labels={labels.paypalTest} /> : null}
    </div>
  );
}

export default async function IntegrationsPage(): Promise<JSX.Element> {
  const user = await requireCapability("integrations.view");
  const canManage = can(user, "integrations.manage");
  const all = await listIntegrationsForAdmin();
  const dict = getAdminDict(await getAdminLocale());
  const t = dict.integrations;

  const byCategory = new Map<IntegrationCategory, IntegrationView[]>();
  for (const item of all) {
    const list = byCategory.get(item.category) ?? [];
    list.push(item);
    byCategory.set(item.category, list);
  }

  return (
    <>
      <div className="admin-head">
        <h1>{t.title}</h1>
        <p>{t.intro(all.length)}</p>
      </div>

      {CATEGORY_ORDER.map((cat) => {
        const items = byCategory.get(cat);
        if (!items || items.length === 0) return null;
        return (
          <section key={cat}>
            <h2 className="admin-cat">{t.categories[cat]}</h2>
            <div className="admin-grid">
              {items.map((item) => (
                <IntegrationCard key={item.key} item={item} canManage={canManage} labels={t} helpLabel={dict.common.help} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
