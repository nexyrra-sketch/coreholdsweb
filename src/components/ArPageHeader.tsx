import type { ReactNode } from "react";
import Link from "next/link";

/** Page furniture for the Arabic edition, mirrored and untracked. */
export function ArPageHeader({
  eyebrow,
  title,
  titleDim,
  lede,
  meta,
}: {
  eyebrow: string;
  title: string;
  titleDim?: string;
  lede: ReactNode;
  meta?: [string, string][];
}) {
  return (
    <section className="relative overflow-hidden border-b border-quarry-800 bg-quarry-950">
      <div className="gridfilm" />
      <div className="shell relative pt-32 pb-16 md:pt-44 md:pb-20">
        <nav aria-label="مسار التنقل" className="mb-9">
          <Link
            href="/ar"
            className="tag text-quarry-500 transition-colors hover:text-oxide"
          >
            → الرئيسية
          </Link>
        </nav>

        <p className="tag settle flex items-center gap-3 text-quarry-400">
          <span aria-hidden="true" className="inline-block h-1.5 w-1.5 bg-oxide" />
          {eyebrow}
        </p>

        <h1 className="mt-8 max-w-[20ch] text-mega text-bone">
          {title}
          {titleDim && <span className="block text-quarry-500">{titleDim}</span>}
        </h1>

        <div className="settle mt-9 max-w-[64ch] text-lede text-quarry-300">
          {lede}
        </div>

        {meta && (
          <dl className="mt-14 grid gap-px border border-quarry-800 bg-quarry-800 sm:grid-cols-3">
            {meta.map(([term, value]) => (
              <div key={term} className="settle bg-quarry-950 px-6 py-6">
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
