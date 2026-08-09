"use client";

import { useEffect, useRef, useState } from "react";

/** Deterministic PRNG. Nothing on this site is randomly different per load. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp = (v: number, min = 0, max = 1) =>
  v < min ? min : v > max ? max : v;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Maps v from [inMin,inMax] onto [0,1], clamped. */
export const range = (v: number, inMin: number, inMax: number) =>
  clamp((v - inMin) / (inMax - inMin));

/** The site's one easing curve, in code as well as in CSS. */
export const easeStructural = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

export const easeOut = (t: number) => 1 - (1 - t) ** 3;

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

/**
 * Scroll progress through an element, 0 when its top reaches the bottom of the
 * viewport, 1 when its bottom reaches the top. Written to a ref rather than
 * state so that reading it inside a rAF loop never triggers a React render —
 * the whole point of the pattern.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const progress = useRef(0);
  const active = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      progress.current = total <= 0 ? 0 : clamp(-rect.top / total);
    };

    const onScroll = () => {
      if (frame || !active.current) return;
      frame = window.requestAnimationFrame(measure);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        active.current = entry.isIntersecting;
        if (entry.isIntersecting) measure();
      },
      { rootMargin: "20% 0px" },
    );

    observer.observe(node);
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return { ref, progress, active };
}

/**
 * Runs a rAF loop only while `active` is true. Every canvas piece on this site
 * shares it, so nothing animates off-screen and nothing animates at all when
 * the visitor has asked for stillness.
 */
export function useRafLoop(
  callback: (time: number) => void,
  active: React.RefObject<boolean>,
  enabled = true,
) {
  const saved = useRef(callback);
  saved.current = callback;

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    let running = true;

    const tick = (time: number) => {
      if (!running) return;
      if (active.current) saved.current(time);
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
    };
  }, [active, enabled]);
}

/** Reads a resolved font-family off the DOM so canvas can use the real face. */
export function resolvedFont(element: HTMLElement | null, fallback: string) {
  if (!element) return fallback;
  const family = window.getComputedStyle(element).fontFamily;
  return family || fallback;
}

/** Canvas sizing that survives DPR changes and container resizes. */
export function useCanvasSize(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onResize?: (w: number, h: number) => void,
) {
  const size = useRef({ width: 0, height: 0, dpr: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const apply = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      size.current = { width, height, dpr };
      onResize?.(width, height);
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(canvas);
    window.addEventListener("resize", apply);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", apply);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef]);

  return size;
}
