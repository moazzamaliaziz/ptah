"use client";

import { useState, useTransition, type JSX } from "react";
import { testPaypalAction, type PaypalTestResult } from "./actions";
import type { PaypalTestDict } from "@/i18n/admin/dictionary";

/**
 * "Test connection" for PayPal.
 *
 * The booking funnel can only ever tell a customer "could not start PayPal
 * checkout" — correct for them, useless for whoever has to fix it, who would
 * otherwise be reading server logs. This runs the real calls and names the
 * cause, including PayPal's own response text, which is usually the one piece
 * of information that resolves it.
 */
export default function PaypalTest({ labels }: { labels: PaypalTestDict }): JSX.Element {
  const [result, setResult] = useState<PaypalTestResult | null>(null);
  const [pending, startTest] = useTransition();

  const summary = (r: PaypalTestResult): { tone: "ok" | "error"; text: string } => {
    if (r.ok) return { tone: "ok", text: labels.okText.replace("{environment}", r.environment) };
    switch (r.code) {
      case "NOT_CONFIGURED":
        return { tone: "error", text: labels.notConfigured };
      case "AUTH_REJECTED":
        return {
          tone: "error",
          text: labels.authRejected
            .replace("{status}", String(r.status ?? "?"))
            .replace("{environment}", r.environment ?? "?"),
        };
      case "ORDER_REJECTED":
        return {
          tone: "error",
          text: labels.orderRejected
            .replace("{status}", String(r.status ?? "?"))
            .replace("{currency}", r.currency),
        };
      case "NETWORK":
        return { tone: "error", text: labels.network };
    }
  };

  const view = result ? summary(result) : null;

  return (
    <div style={{ marginTop: "0.75rem", borderTop: "1px solid rgba(26,35,64,0.12)", paddingTop: "0.75rem" }}>
      <button
        className="admin-btn admin-btn--ghost"
        type="button"
        disabled={pending}
        onClick={() => startTest(async () => setResult(await testPaypalAction()))}
      >
        {pending ? labels.testing : labels.test}
      </button>
      <p className="admin-card__meta" style={{ margin: "0.4rem 0 0" }}>{labels.testHint}</p>

      {view ? (
        <div
          className={`admin-alert ${view.tone === "ok" ? "admin-alert--ok" : "admin-alert--error"}`}
          role="status"
          style={{ marginTop: "0.6rem" }}
        >
          {view.text}
          {/* PayPal's verbatim response — the detail that usually resolves it.
              Kept raw and scrollable rather than summarised, because a guess at
              what PayPal meant is worse than PayPal's own words. */}
          {!result?.ok && result?.detail ? (
            <pre
              style={{
                margin: "0.5rem 0 0",
                maxHeight: "9rem",
                overflow: "auto",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontSize: "0.75rem",
                opacity: 0.85,
              }}
            >
              {result.detail}
            </pre>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
