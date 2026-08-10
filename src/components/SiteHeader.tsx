"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SoundToggle } from "./SoundToggle";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { ButtonLink, Arrow } from "./Button";
import { ctaHref, ctaLabel, primaryNav } from "@/lib/site";
import { arNav, arSite } from "@/data/ar";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  /** The Arabic edition swaps the furniture rather than mirroring the English. */
  const arabic = pathname === "/ar" || pathname.startsWith("/ar/");
  const nav = arabic ? arNav : primaryNav;
  const cta = arabic
    ? { href: arSite.ctaHref, label: arSite.cta }
    : { href: ctaHref, label: ctaLabel };
  const homeHref = arabic ? "/ar" : "/";
  const language = arabic
    ? { href: "/", label: "English" }
    : { href: "/ar", label: "العربية" };

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 12);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ease-[cubic-bezier(0.22,0.68,0.24,1)] ${
        scrolled || open
          ? "border-b border-quarry-800 bg-quarry-950/88 backdrop-blur-md supports-[not(backdrop-filter:blur(0))]:bg-quarry-950"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="shell">
        <div className="flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
          <Link
            href={homeHref}
            className="rounded-[2px] py-2"
            aria-label={arabic ? "كورهولد — الصفحة الرئيسية" : "Corehold — home"}
          >
            <Logo />
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-8 md:flex"
          >
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative py-2 text-[0.9375rem] tracking-[-0.01em] transition-colors duration-200 ${
                    active
                      ? "text-bone"
                      : "text-quarry-300 hover:text-bone"
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-oxide transition-transform duration-300 ease-[cubic-bezier(0.22,0.68,0.24,1)] ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-6 md:flex">
            <SoundToggle />
            <Link
              href={language.href}
              lang={arabic ? "en" : "ar"}
              className="text-[0.9375rem] text-quarry-400 transition-colors duration-200 hover:text-bone"
            >
              {language.label}
            </Link>
            <ButtonLink href={cta.href} size="md" trailing={<Arrow />}>
              {cta.label}
            </ButtonLink>
          </div>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-[2px] text-bone md:hidden"
          >
            <span className="sr-only">
              {arabic
                ? open
                  ? "إغلاق القائمة"
                  : "فتح القائمة"
                : open
                  ? "Close menu"
                  : "Open menu"}
            </span>
            <span aria-hidden="true" className="relative block h-3 w-5">
              <span
                className={`absolute left-0 block h-px w-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,0.68,0.24,1)] ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,0.68,0.24,1)] ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        ref={panelRef}
        hidden={!open}
        className="border-t border-quarry-800 bg-quarry-950 md:hidden"
      >
        <div className="shell py-4">
          <ul className="divide-y divide-quarry-800">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-baseline gap-4 py-5"
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  <span className="tag text-oxide">{item.index}</span>
                  <span className="flex-1">
                    <span className="block text-minor tracking-[-0.02em] text-bone">
                      {item.label}
                    </span>
                    <span className="mt-1.5 block text-sm text-quarry-400">
                      {item.blurb}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-4 pt-6 pb-2">
            <ButtonLink
              href={cta.href}
              size="lg"
              className="w-full"
              trailing={<Arrow />}
            >
              {cta.label}
            </ButtonLink>
            <Link
              href={language.href}
              lang={arabic ? "en" : "ar"}
              className="py-2 text-center text-[0.9375rem] text-quarry-300 transition-colors hover:text-bone"
            >
              {language.label}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
