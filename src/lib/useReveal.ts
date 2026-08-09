"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Structural reveal.
 *
 * A single IntersectionObserver per element, disconnected the moment the
 * element has resolved. No animation library, no scroll listeners, no layout
 * reads on the main thread during scroll — the entire motion system on this
 * site costs zero kilobytes of JavaScript beyond this file.
 */
export function useReveal<T extends HTMLElement>(
  options?: { threshold?: number; rootMargin?: string },
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const attr = node.hasAttribute("data-scribe") ? "data-scribe" : "data-reveal";

    if (reduce || typeof IntersectionObserver === "undefined") {
      node.setAttribute(attr, "in");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute(attr, "in");
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: options?.threshold ?? 0.12,
        rootMargin: options?.rootMargin ?? "0px 0px -8% 0px",
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options?.threshold, options?.rootMargin]);

  return ref;
}
