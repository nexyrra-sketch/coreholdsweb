"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { useReveal } from "@/lib/useReveal";

type RevealProps = {
  children?: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  scribe?: boolean;
};

/**
 * Wraps content in the site's one reveal behaviour. `scribe` switches from a
 * rise-and-resolve to a rule that draws itself across the page.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className,
  style,
  scribe = false,
}: RevealProps) {
  const ref = useReveal<HTMLDivElement>();
  const attr = scribe ? { "data-scribe": "out" } : { "data-reveal": "out" };

  return (
    <Tag
      ref={ref}
      {...attr}
      className={className}
      style={{ ...style, ["--reveal-delay" as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
