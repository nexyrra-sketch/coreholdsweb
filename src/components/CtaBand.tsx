import { Reveal } from "./Reveal";
import { ButtonLink, Arrow } from "./Button";
import { ctaHref, ctaLabel } from "@/lib/site";

export function CtaBand({
  eyebrow = "Next step",
  heading = "Find out what you're actually renting.",
  body = "Every engagement starts the same way: we map what runs your business today, and we put a number against what it costs to keep renting it. Some of those audits end with us telling you to change nothing. That is a real outcome, and it is on the table before you write to us.",
  secondary,
}: {
  eyebrow?: string;
  heading?: string;
  body?: string;
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="relative overflow-hidden border-t border-quarry-800 bg-quarry-900">
      <div className="gridfilm" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-oxide/50"
      />
      <div className="shell relative py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="tag text-oxide">{eyebrow}</p>
            </Reveal>
            <Reveal delay={70}>
              <h2 className="mt-7 max-w-[16ch] text-major text-bone">
                {heading}
              </h2>
            </Reveal>
            <Reveal delay={130}>
              <p className="mt-7 max-w-[58ch] text-lede text-quarry-300">
                {body}
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal
              delay={180}
              className="flex flex-col gap-3 sm:flex-row lg:justify-end"
            >
              <ButtonLink href={ctaHref} size="lg" trailing={<Arrow />}>
                {ctaLabel}
              </ButtonLink>
              {secondary && (
                <ButtonLink
                  href={secondary.href}
                  size="lg"
                  variant="secondary"
                >
                  {secondary.label}
                </ButtonLink>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
