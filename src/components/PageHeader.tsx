import type { ReactNode } from "react";
import Link from "next/link";

export function PageHeader({
  eyebrow,
  title,
  lede,
  meta,
  breadcrumb,
}: {
  eyebrow: string;
  title: ReactNode;
  lede: ReactNode;
  meta?: [string, string][];
  breadcrumb?: { label: string; href: string };
}) {
  return (
    <section className="relative overflow-hidden border-b border-quarry-800 bg-quarry-950">
      <div className="gridfilm" />
      <div className="shell relative pt-32 pb-16 md:pt-44 md:pb-20">
        {breadcrumb && (
          <nav aria-label="Breadcrumb" className="mb-9">
            <Link
              href={breadcrumb.href}
              className="tag text-quarry-500 transition-colors hover:text-oxide"
            >
              ← {breadcrumb.label}
            </Link>
          </nav>
        )}

        <p
          className="tag settle flex items-center gap-3 text-quarry-400"
          style={{ animationDelay: "40ms" }}
        >
          <span
            aria-hidden="true"
            className="inline-block h-1.5 w-1.5 bg-oxide"
          />
          {eyebrow}
        </p>

        <h1 className="type-land mt-8 max-w-[18ch] text-mega text-bone">{title}</h1>

        <div
          className="settle mt-9 max-w-[62ch] text-lede text-quarry-300"
          style={{ animationDelay: "160ms" }}
        >
          {lede}
        </div>

        {meta && (
          <dl className="mt-14 grid gap-px border border-quarry-800 bg-quarry-800 sm:grid-cols-3">
            {meta.map(([term, value], i) => (
              <div
                key={term}
                className="settle bg-quarry-950 px-6 py-6"
                style={{ animationDelay: `${240 + i * 60}ms` }}
              >
                <dt className="tag text-quarry-500">{term}</dt>
                <dd className="mt-2.5 text-[0.9375rem] text-quarry-200">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
