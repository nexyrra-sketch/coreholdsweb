import type { Metadata } from "next";
import Link from "next/link";
import { Mark } from "@/components/Logo";
import { ButtonLink, Arrow } from "@/components/Button";
import { primaryNav } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-quarry-950">
      <div className="gridfilm" />
      <div className="shell relative flex min-h-[78vh] flex-col justify-center py-32">
        <Mark className="h-8 w-8 text-oxide" title="Corehold" />
        <p className="tag mt-10 text-quarry-500">Error 404</p>
        <h1 className="mt-6 max-w-[20ch] text-major text-bone">
          Nothing is held at this address.
        </h1>
        <p className="mt-7 max-w-[52ch] text-lede text-quarry-400">
          The page you asked for does not exist. Everything Corehold publishes
          is listed below — or start where every engagement starts.
        </p>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/audit" size="lg" trailing={<Arrow />}>
            Request a System Audit
          </ButtonLink>
          <ButtonLink href="/" size="lg" variant="secondary">
            Back to the homepage
          </ButtonLink>
        </div>

        <nav aria-label="Site sections" className="mt-16 border-t border-quarry-800">
          <ul>
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex items-baseline gap-5 border-b border-quarry-800 py-5 transition-colors hover:bg-quarry-900"
                >
                  <span className="tag text-quarry-500 group-hover:text-oxide">
                    {item.index}
                  </span>
                  <span className="flex-1">
                    <span className="block text-lg tracking-[-0.02em] text-bone">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-sm text-quarry-400">
                      {item.blurb}
                    </span>
                  </span>
                  <Arrow className="text-quarry-500 group-hover:text-oxide" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
