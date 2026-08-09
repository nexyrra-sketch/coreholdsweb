"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { stages } from "@/data/method";
import { layers } from "@/data/capabilities";
import { faq } from "@/data/faq";
import { register as registerEntries } from "@/data/register";
import { site } from "@/lib/site";

/**
 * ⌘K
 * ----------------------------------------------------------------------------
 * A studio that sells internal tools should obviously ship one. Every page,
 * every method stage, every system layer and every question is addressable
 * from the keyboard without touching the mouse.
 *
 * Built as a proper combobox/listbox: aria-activedescendant rather than moving
 * focus, arrow keys and Home/End, Escape to close, focus returned to whatever
 * had it before. No dependency, no portal library, no focus-trap package.
 */

type Entry = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  href: string;
};

function buildIndex(): Entry[] {
  return [
    { id: "p-home", group: "Pages", label: "Home", href: "/" },
    {
      id: "p-own",
      group: "Pages",
      label: "Ownership",
      hint: "The own-vs-rent argument",
      href: "/ownership",
    },
    {
      id: "p-method",
      group: "Pages",
      label: "The Method",
      hint: "Five stages, in full",
      href: "/method",
    },
    {
      id: "p-cap",
      group: "Pages",
      label: "What We Build",
      hint: "One foundation, five layers",
      href: "/capabilities",
    },
    {
      id: "p-register",
      group: "Pages",
      label: "The Register",
      hint: "Build it or rent it, across 43 categories",
      href: "/register",
    },
    {
      id: "p-specimen",
      group: "Pages",
      label: "Specimen Audit",
      hint: "A complete worked audit, published in full",
      href: "/specimen",
    },
    {
      id: "p-standard",
      group: "Pages",
      label: "The Standard",
      hint: "Our commitments and terms, versioned",
      href: "/standard",
    },
    {
      id: "p-manifesto",
      group: "Pages",
      label: "Manifesto",
      hint: "The argument in eight chapters",
      href: "/manifesto",
    },
    {
      id: "p-brand",
      group: "Pages",
      label: "Brand Standard",
      hint: "The identity, published",
      href: "/brand",
    },
    {
      id: "p-system",
      group: "Pages",
      label: "System",
      hint: "This site's own specification",
      href: "/system",
    },
    {
      id: "p-ar",
      group: "Pages",
      label: "العربية — Arabic edition",
      hint: "The site in Arabic, right to left",
      href: "/ar",
    },
    {
      id: "a-audit",
      group: "Actions",
      label: "Request a System Audit",
      hint: "Stage 01 — the front door",
      href: "/audit",
    },
    {
      id: "a-mail",
      group: "Actions",
      label: `Email ${site.email}`,
      hint: "Write to us directly",
      href: `mailto:${site.email}`,
    },
    {
      id: "a-ledger",
      group: "Actions",
      label: "Price your own stack",
      hint: "The rent ledger, and a PDF to take away",
      href: "/ledger",
    },
    ...stages.map((stage) => ({
      id: `s-${stage.code}`,
      group: "The Method",
      label: `${stage.index} · ${stage.code}`,
      hint: stage.question,
      href: `/method#${stage.code.toLowerCase().replace(/\s+/g, "-")}`,
    })),
    ...layers.map((layer) => ({
      id: `l-${layer.index}`,
      group: "System layers",
      label: `${layer.index} · ${layer.name}`,
      hint: layer.role,
      href: `/capabilities#${layer.index.toLowerCase()}`,
    })),
    ...registerEntries.map((entry) => ({
      id: `r-${entry.id}`,
      group: "The Register",
      label: `${entry.name} — ${entry.verdict}`,
      hint: entry.flips,
      href: `/register#${entry.id}`,
    })),
    ...faq.map((item, i) => ({
      id: `f-${i}`,
      group: "Questions",
      label: item.question,
      href: "/standard#faq",
    })),
  ];
}

const INDEX = buildIndex();

function score(entry: Entry, query: string) {
  const q = query.toLowerCase();
  const label = entry.label.toLowerCase();
  const hint = (entry.hint ?? "").toLowerCase();
  if (label.startsWith(q)) return 0;
  if (label.includes(q)) return 1;
  if (hint.includes(q)) return 2;
  if (entry.group.toLowerCase().includes(q)) return 3;
  return -1;
}

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  const results = useMemo(() => {
    if (!query.trim()) return INDEX;
    return INDEX.map((entry) => ({ entry, s: score(entry, query.trim()) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => a.s - b.s)
      .map((r) => r.entry);
  }, [query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setCursor(0);
    restoreTo.current?.focus();
  }, []);

  const go = useCallback(
    (entry: Entry) => {
      close();
      if (entry.href.startsWith("mailto:")) {
        window.location.href = entry.href;
      } else {
        router.push(entry.href);
      }
    },
    [close, router],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const isToggle =
        (event.key === "k" || event.key === "K") &&
        (event.metaKey || event.ctrlKey);
      if (!isToggle) return;
      event.preventDefault();
      setOpen((current) => {
        if (!current) restoreTo.current = document.activeElement as HTMLElement;
        return !current;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => {
      document.body.style.overflow = previous;
      window.clearTimeout(id);
    };
  }, [open]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector(`[data-i="${cursor}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [cursor, open]);

  if (!open) return <PaletteHint onOpen={() => setOpen(true)} />;

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setCursor((c) => (results.length ? (c + 1) % results.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setCursor((c) =>
        results.length ? (c - 1 + results.length) % results.length : 0,
      );
    } else if (event.key === "Home") {
      event.preventDefault();
      setCursor(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setCursor(Math.max(0, results.length - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const entry = results[cursor];
      if (entry) go(entry);
    } else if (event.key === "Tab") {
      // Two focusable nodes only; keep the ring inside the dialog.
      event.preventDefault();
    }
  };

  let lastGroup = "";

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]">
      <button
        type="button"
        aria-label="Close command palette"
        onClick={close}
        className="absolute inset-0 cursor-default bg-quarry-950/80 backdrop-blur-[2px]"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Go to"
        onKeyDown={onKeyDown}
        className="settle relative w-full max-w-[38rem] border border-quarry-700 bg-quarry-900 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.9)]"
      >
        <div className="flex items-center gap-4 border-b border-quarry-800 px-5">
          <span aria-hidden="true" className="tag text-oxide">
            GO
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-autocomplete="list"
            aria-activedescendant={
              results[cursor] ? `palette-${results[cursor].id}` : undefined
            }
            placeholder="Jump to a page, a stage, a layer, a question…"
            className="h-14 flex-1 bg-transparent text-[0.9375rem] text-bone outline-none placeholder:text-quarry-500"
          />
          <kbd className="tag hidden text-quarry-500 sm:block">ESC</kbd>
        </div>

        <ul
          ref={listRef}
          id="palette-list"
          role="listbox"
          aria-label="Destinations"
          className="max-h-[46vh] overflow-y-auto py-2"
        >
          {results.length === 0 && (
            <li className="px-5 py-6 text-sm text-quarry-400">
              Nothing matches that. Everything Corehold publishes is in this
              list — try “audit”, “handover”, or “own”.
            </li>
          )}

          {results.map((entry, i) => {
            const header = entry.group !== lastGroup ? entry.group : null;
            lastGroup = entry.group;
            return (
              <li key={entry.id}>
                {header && (
                  <p className="tag px-5 pt-4 pb-2 text-quarry-500">{header}</p>
                )}
                <div
                  id={`palette-${entry.id}`}
                  role="option"
                  data-i={i}
                  aria-selected={i === cursor}
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => go(entry)}
                  className={`flex cursor-pointer items-baseline gap-4 px-5 py-2.5 ${
                    i === cursor ? "bg-quarry-800" : ""
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-px w-3 shrink-0 ${i === cursor ? "bg-oxide" : "bg-quarry-700"}`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.9375rem] text-bone">
                      {entry.label}
                    </span>
                    {entry.hint && (
                      <span className="mt-0.5 block truncate text-xs text-quarry-400">
                        {entry.hint}
                      </span>
                    )}
                  </span>
                  {i === cursor && (
                    <span aria-hidden="true" className="tag text-quarry-500">
                      ↵
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <p className="flex items-center justify-between gap-4 border-t border-quarry-800 px-5 py-3 font-mono text-[10px] tracking-[0.1em] text-quarry-500 uppercase">
          <span>↑ ↓ to move · ↵ to open</span>
          <span>{results.length} destinations</span>
        </p>
      </div>
    </div>
  );
}

/** The affordance. Desktop only — it is a keyboard feature. */
function PaletteHint({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group fixed right-6 bottom-6 z-40 hidden items-center gap-2.5 rounded-[2px] border border-quarry-700 bg-quarry-900/85 px-3.5 py-2.5 backdrop-blur-sm transition-colors duration-200 hover:border-oxide lg:flex"
    >
      <span className="tag text-quarry-400 transition-colors group-hover:text-bone">
        Go to
      </span>
      <kbd className="tag rounded-[2px] border border-quarry-700 px-1.5 py-1 text-quarry-500">
        ⌘K
      </kbd>
    </button>
  );
}
