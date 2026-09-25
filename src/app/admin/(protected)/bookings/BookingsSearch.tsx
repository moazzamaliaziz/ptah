"use client";

import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";

/**
 * Orders search box. Progressive enhancement: it is a plain GET form (works on
 * Enter / button with no JS), enhanced to auto-submit ~400ms after the admin
 * stops typing so the list filters as-you-type without hammering the DB on
 * every keystroke. Submitting drops the `page` param, so results reset to
 * page 1 — the current status filter is preserved via a hidden field.
 */
export default function BookingsSearch({
  status,
  defaultValue,
  hiddenLabel,
  placeholder,
  ariaLabel,
  buttonLabel,
}: {
  status?: string;
  defaultValue: string;
  hiddenLabel: string;
  placeholder: string;
  ariaLabel: string;
  buttonLabel: string;
}): JSX.Element {
  const [value, setValue] = useState(defaultValue);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirty = useRef(false);

  useEffect(() => {
    // Don't auto-submit on first render or when the value matches the URL.
    if (!dirty.current || value.trim() === defaultValue.trim()) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const el = inputRef.current;
      if (el) {
        // Native GET submit reloads the page and drops focus; remember the caret
        // so the restore effect can put the cursor back after the reload.
        sessionStorage.setItem(
          "admin.bookingsSearch.caret",
          String(el.selectionStart ?? el.value.length),
        );
      }
      formRef.current?.requestSubmit();
    }, 400);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value, defaultValue]);

  useEffect(() => {
    // After an as-you-type navigation, return focus + caret to the search box so
    // typing isn't interrupted. Only fires when THIS box triggered the reload.
    const raw = sessionStorage.getItem("admin.bookingsSearch.caret");
    if (raw === null) return;
    sessionStorage.removeItem("admin.bookingsSearch.caret");
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    const caret = Number.isFinite(Number(raw)) ? Number(raw) : el.value.length;
    try {
      el.setSelectionRange(caret, caret);
    } catch {
      /* setSelectionRange unsupported on this input type — focus alone is enough */
    }
  }, []);

  return (
    <form ref={formRef} method="get" className="admin-row" role="search">
      {status ? <input type="hidden" name="status" value={status} /> : null}
      <label className="admin-field" style={{ margin: 0, flex: "1 1 260px" }}>
        <span className="admin-visually-hidden">{hiddenLabel}</span>
        <input
          ref={inputRef}
          type="search"
          name="q"
          value={value}
          onChange={(e) => {
            dirty.current = true;
            setValue(e.target.value);
          }}
          className="admin-input"
          placeholder={placeholder}
          autoComplete="off"
          aria-label={ariaLabel}
        />
      </label>
      <button type="submit" className="admin-btn admin-btn--ghost">
        {buttonLabel}
      </button>
    </form>
  );
}
