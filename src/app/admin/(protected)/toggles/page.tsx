import type { JSX } from "react";
import { requireCapability, can } from "@/server/auth/rbac";
import { getToggles, TOGGLE_KEYS } from "@/server/toggles";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";
import { setToggleAction } from "./actions";

export default async function TogglesPage(): Promise<JSX.Element> {
  const user = await requireCapability("toggles.view");
  const editable = can(user, "toggles.edit");
  const toggles = await getToggles();
  const dict = getAdminDict(await getAdminLocale());
  const t = dict.toggles;

  return (
    <>
      <div className="admin-head">
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </div>

      {!editable ? (
        <div className="admin-alert admin-alert--ok" role="status">
          {t.viewOnlyNote}
        </div>
      ) : null}

      <div className="admin-grid">
        {TOGGLE_KEYS.map((key) => {
          const on = toggles[key];
          const meta = t.items[key];
          return (
            <div className="admin-card" key={key}>
              <div className="admin-row admin-row--between">
                <h2>{meta.label}</h2>
                <span className={`admin-badge ${on ? "admin-badge--on" : "admin-badge--off"}`}>
                  {on ? t.badgeOn : t.badgeOff}
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
                    {on ? t.disable : t.enable}
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
