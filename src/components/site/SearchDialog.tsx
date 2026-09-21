"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, type FormEvent, type JSX } from "react";
import { Icon } from "@/components/ui/Icon";

export interface SearchDialogProps {
  popularSearches: string[];
  searchHref: string;
  onClose: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Search overlay shell (design.md §2.7). Minimal Phase-1a dialog: one input,
 * popular-search chips; full search UX ships with the search phase. z comes
 * from the CSS class (`search-dialog` = searchDialog token).
 *
 * Modal contract: `aria-modal` requires focus to stay inside while open, so a
 * Tab/Shift+Tab trap cycles within the dialog; Escape closes it and the
 * opener (SiteHeaderChrome) restores focus to the search trigger.
 */
export function SearchDialog({ popularSearches, searchHref, onClose }: SearchDialogProps): JSX.Element {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  /* Focus only — SiteHeaderChrome already holds the body scroll lock while
     `searchOpen` is true (double-locking risks a stuck `overflow: hidden`). */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const panel = dialogRef.current;
      if (!panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !panel.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = inputRef.current?.value.trim();
    if (!q) return;
    onClose();
    router.push(`${searchHref}?term=${encodeURIComponent(q)}`);
  };


  return (
    <div
      className="search-dialog"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Search Ptah Tours"
    >
      <div className="search-dialog__inner">
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close search" style={{ color: "var(--color-ink)" }}>
            <Icon name="close" size={24} />
          </button>
        </div>
        <form className="search-dialog__field" onSubmit={submit} role="search">
          <Icon name="search" size={24} />
          <input
            ref={inputRef}
            type="search"
            name="term"
            aria-label="Search trips, destinations and stories"
            placeholder="Pyramids, Nile cruise, Alexandria…"
            autoComplete="off"
            className="search-dialog__input"
          />
        </form>
        <p className="text-meta" style={{ marginTop: "2rem" }}>
          Popular searches
        </p>
        <div className="search-chips">
          {popularSearches.map((term) => (
            <Link key={term} className="search-chip" href={`${searchHref}?term=${encodeURIComponent(term)}`}>
              {term}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchDialog;