"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mark } from "./Logo";
import { site, primaryNav, ctaHref, ctaLabel } from "@/lib/site";
import { arNav, arSite } from "@/data/ar";
import { Arrow, ButtonLink } from "./Button";

const year = new Date().getFullYear();

const EN_EXTRA = [
  { href: "/ledger", label: "The Ledger" },
  { href: "/register", label: "The Register" },
  { href: "/specimen", label: "Specimen Audit" },
  { href: "/standard", label: "The Standard" },
  { href: "/manifesto", label: "Manifesto" },
  { href: "/brand", label: "Brand" },
  { href: "/system", label: "System" },
];

export function SiteFooter() {
  const pathname = usePathname();
  const arabic = pathname === "/ar" || pathname.startsWith("/ar/");

  const nav = arabic ? arNav : primaryNav;
  const cta = arabic
    ? { href: arSite.ctaHref, label: arSite.cta }
    : { href: ctaHref, label: ctaLabel };

  return (
    <footer className="relative border-t border-quarry-800 bg-quarry-950">
      <div className="shell">
        <div className="grid gap-14 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-5">
            <Mark className="h-7 w-7 text-oxide" title="Corehold" />
            <p className="mt-6 max-w-[34ch] text-minor tracking-[-0.02em] text-bone">
              {arabic ? arSite.tagline : "Own the system your business runs on."}
            </p>
            <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-quarry-400">
              {arabic
                ? "استوديو أنظمة ذكية في دبي، يعمل مع شركات في الإمارات وحول العالم. نستقبل عددًا محدودًا من التعاقدات سنويًا، عن قصد."
                : `An intelligent systems studio in ${site.city}, building for companies across the ${site.countryName} and worldwide. We take on a small number of engagements a year, deliberately.`}
            </p>
            <div className="mt-8">
              <ButtonLink href={cta.href} variant="secondary" trailing={<Arrow />}>
                {cta.label}
              </ButtonLink>
            </div>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <h2 className="tag text-quarry-500">
              {arabic ? "الموقع" : "Site"}
            </h2>
            <ul className="mt-6 space-y-3.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[0.9375rem] text-quarry-200 transition-colors hover:text-oxide"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {!arabic &&
                EN_EXTRA.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[0.9375rem] text-quarry-200 transition-colors hover:text-oxide"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              <li>
                <Link
                  href={cta.href}
                  className="text-[0.9375rem] text-quarry-200 transition-colors hover:text-oxide"
                >
                  {arabic ? "اطلب تدقيقًا" : "Request an Audit"}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h2 className="tag text-quarry-500">
              {arabic ? "التواصل" : "Contact"}
            </h2>
            <ul className="mt-6 space-y-3.5 text-[0.9375rem] text-quarry-200">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="latin transition-colors hover:text-oxide"
                >
                  {site.email}
                </a>
              </li>
              <li className="text-quarry-400">
                {arabic ? "دبي، الإمارات العربية المتحدة" : `${site.city}, ${site.countryName}`}
              </li>
              <li className="text-quarry-400">
                {arabic
                  ? "نعمل بتوقيت الخليج، مع عملاء في كل المناطق الزمنية"
                  : "Working GST+4, with clients on every timezone"}
              </li>
              <li>
                <Link
                  href={arabic ? "/" : "/ar"}
                  lang={arabic ? "en" : "ar"}
                  className="text-quarry-200 underline underline-offset-4 transition-colors hover:text-oxide"
                >
                  {arabic ? "English" : "العربية"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-quarry-800 py-8 text-xs text-quarry-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono tracking-[0.04em]">
            © {year} {site.legalName}.{" "}
            {arabic ? "أنظمة تُبنى لتُسلَّم." : "Systems built to be handed over."}
          </p>
          <p className="font-mono tracking-[0.04em]">
            {arabic
              ? "لا رخص. لا ارتهان. لا مالك."
              : "No licences. No lock-in. No landlord."}
          </p>
        </div>
      </div>
    </footer>
  );
}
