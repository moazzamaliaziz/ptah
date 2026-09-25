import type { JSX } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCapability, can } from "@/server/auth/rbac";
import { getContactMessage, markContactRead } from "@/server/contact";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";
import { formatAdminDate } from "@/i18n/admin/format";
import { setEnquiryStatusAction, deleteEnquiryAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function EnquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<JSX.Element> {
  const user = await requireCapability("enquiries.view");
  const { id } = await params;
  const message = await getContactMessage(id);
  if (!message) notFound();

  // Opening a NEW enquiry marks it READ (idempotent; no-op if already handled).
  if (message.status === "NEW") await markContactRead(id);

  const locale = await getAdminLocale();
  const dict = getAdminDict(locale);
  const t = dict.enquiries;
  const canManage = can(user, "enquiries.manage");
  const mailtoSubject = encodeURIComponent(message.subject ? `${t.replyPrefix} ${message.subject}` : t.replyFallback);

  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>{message.subject ?? t.fallbackTitle}</h1>
            <p>{t.from} <strong>{message.name}</strong> · {formatAdminDate(message.createdAt, locale, { dateStyle: "full", timeStyle: "short" })}</p>
          </div>
          <Link className="admin-btn admin-btn--ghost" href="/admin/enquiries">{t.backToList}</Link>
        </div>
      </div>

      <section className="admin-card">
        <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.5rem 1.25rem", margin: 0 }}>
          <dt className="admin-card__meta">{t.fieldName}</dt>
          <dd style={{ margin: 0 }}>{message.name}</dd>
          <dt className="admin-card__meta">{t.fieldEmail}</dt>
          <dd style={{ margin: 0 }}><a className="link-inline" href={`mailto:${message.email}?subject=${mailtoSubject}`}>{message.email}</a></dd>
          {message.phone ? (
            <>
              <dt className="admin-card__meta">{t.fieldPhone}</dt>
              <dd style={{ margin: 0 }}><a className="link-inline" href={`tel:${message.phone}`}>{message.phone}</a></dd>
            </>
          ) : null}
          {message.subject ? (
            <>
              <dt className="admin-card__meta">{t.fieldSubject}</dt>
              <dd style={{ margin: 0 }}>{message.subject}</dd>
            </>
          ) : null}
        </dl>
        <div style={{ marginTop: "1rem" }}>
          <p className="admin-card__meta">{t.messageLabel}</p>
          <p style={{ whiteSpace: "pre-line", marginTop: "0.35rem" }}>{message.message}</p>
        </div>
      </section>

      {/* Status controls */}
      <div className="admin-card">
        <div className="admin-row" style={{ gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <span className="admin-card__meta">{t.statusPrefix} <strong>{t.statusLabel[message.status] ?? message.status}</strong></span>
          {message.status !== "ARCHIVED" ? (
            <form action={setEnquiryStatusAction}>
              <input type="hidden" name="id" value={message.id} />
              <input type="hidden" name="status" value="ARCHIVED" />
              <button className="admin-btn admin-btn--ghost" type="submit">{t.archive}</button>
            </form>
          ) : (
            <form action={setEnquiryStatusAction}>
              <input type="hidden" name="id" value={message.id} />
              <input type="hidden" name="status" value="READ" />
              <button className="admin-btn admin-btn--ghost" type="submit">{t.restoreToRead}</button>
            </form>
          )}
        </div>
      </div>

      {canManage ? (
        <section className="admin-card" style={{ borderColor: "rgba(154,92,27,0.4)" }}>
          <h2>{t.deleteHeading}</h2>
          <p className="admin-card__meta">{t.deleteHint}</p>
          <form action={deleteEnquiryAction} style={{ marginTop: "0.5rem" }}>
            <input type="hidden" name="id" value={message.id} />
            <ConfirmSubmitButton confirm={t.deleteConfirm(message.name)} pendingLabel={dict.common.deleting}>
              {dict.common.deletePermanently}
            </ConfirmSubmitButton>
          </form>
        </section>
      ) : null}
    </>
  );
}
