"use client";

import { useEffect, useId, useRef } from "react";
import { ChevronDown } from "lucide-react";

export default function NavDropdown({
  label,
  open,
  onToggle,
  onClose,
  dark,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  dark: boolean;
  children: React.ReactNode;
}) {
  const panelId = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className={`flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          dark
            ? "text-white/90 hover:bg-white/10 hover:text-white"
            : "text-charcoal/80 hover:bg-cream-soft hover:text-charcoal"
        }`}
      >
        {label}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          id={panelId}
          role="menu"
          className="absolute left-1/2 top-full z-50 mt-3 w-max -translate-x-1/2 rounded-2xl border border-border bg-white-warm p-4 shadow-[0_20px_50px_-20px_rgba(34,28,25,0.35)]"
        >
          {children}
        </div>
      )}
    </div>
  );
}
