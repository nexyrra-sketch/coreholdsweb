"use client";

import { useState } from "react";
import { Button } from "./Button";

type Kind = "specimen-audit" | "brand-book" | "letterhead" | "proposal";

/**
 * Every downloadable document on this site is built in the browser by the
 * writer in `lib/pdf.ts`. The generators are imported lazily so their weight
 * never lands in the initial bundle of a page that only mentions them.
 */
export function DocumentDownload({
  kind,
  label,
  ground = "dark",
  size = "lg",
  variant = "primary",
}: {
  kind: Kind;
  label: string;
  ground?: "dark" | "light";
  size?: "md" | "lg";
  variant?: "primary" | "secondary";
}) {
  const [state, setState] = useState<"idle" | "working" | "done">("idle");

  const run = async () => {
    setState("working");
    try {
      if (kind === "specimen-audit") {
        const { generateSampleAudit } = await import("@/lib/sampleAuditPdf");
        generateSampleAudit(new Date());
      } else {
        const mod = await import("@/lib/brandDocs");
        if (kind === "brand-book") mod.generateBrandBook(new Date());
        if (kind === "letterhead") mod.generateLetterhead(new Date());
        if (kind === "proposal") mod.generateProposal(new Date());
      }
      setState("done");
    } catch {
      setState("idle");
    }
  };

  return (
    <Button
      type="button"
      onClick={run}
      variant={variant}
      ground={ground}
      size={size}
      disabled={state === "working"}
      trailing={<DownloadGlyph />}
    >
      {state === "working" ? "Building…" : state === "done" ? "Downloaded" : label}
    </Button>
  );
}

function DownloadGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.22,0.68,0.24,1)] group-hover:translate-y-0.5"
    >
      <path
        d="M8 1v9M4.5 6.5 8 10l3.5-3.5M2 14h12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
    </svg>
  );
}
