import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { ButtonLink, Arrow } from "@/components/Button";
import { Faq } from "@/components/Faq";
import { FaqSchema } from "@/components/JsonLd";
import { arHome, arSite, arStages } from "@/data/ar";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "كورهولد — امتلك النظام الذي تُدار به شركتك | استوديو أنظمة في دبي",
  description:
    "توقّف عن استئجار البرمجيات التي تعتمد عليها شركتك. كورهولد استوديو أنظمة ذكية في دبي يستبدل حزم الاشتراكات بنظام واحد تملكه بالكامل — العمليات والذكاء الاصطناعي والأتمتة والأدوات الداخلية — ثم يسلّمك الشيفرة والبيانات والتوثيق.",
  alternates: { canonical: "/ar" },
  openGraph: {
    title: "كورهولد — امتلك النظام الذي تُدار به شركتك",
    description:
      "استوديو أنظمة ذكية في دبي. نظام واحد تملكه بدل حزمة اشتراكات مستأجرة.",
    url: "/ar",
    locale: "ar_AE",
  },
};

export default function ArabicHome() {
  return (
    <>
      {/* ---------------------------------------------------------- hero -- */}
      <section className="relative overflow-hidden border-b border-quarry-800">
        <div className="gridfilm" />
        <div className="shell relative">
          <div className="grid items-center gap-16 pt-32 pb-20 md:pt-44 md:pb-28 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="tag settle flex items-center gap-3 text-quarry-400">
                <span
                  className="datum-pulse inline-block h-1.5 w-1.5 bg-oxide"
                  aria-hidden="true"
                />
                {arSite.eyebrow}
              </p>

              <h1 className="mt-8 text-mega text-bone">
                {arHome.title}
                <span className="mt-2 block text-quarry-500">
                  {arHome.titleDim}
                </span>
              </h1>

              <p className="settle mt-9 max-w-[62ch] text-lede text-quarry-300">
                {arHome.lede}
              </p>

              <div className="settle mt-11 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href={arSite.ctaHref} size="lg" trailing={<Arrow className="rotate-180" />}>
                  {arSite.cta}
                </ButtonLink>
                <ButtonLink href="/ar/method" size="lg" variant="secondary">
                  اطّلع على المنهجية
                </ButtonLink>
              </div>

              <p className="settle mt-6 font-mono text-xs leading-relaxed text-quarry-500">
                {arHome.note}
              </p>
            </div>
          </div>
        </div>

        <div className="relative border-t border-quarry-800">
          <div className="shell">
            <dl className="grid grid-cols-2 sm:grid-cols-4">
              {arHome.specs.map(([term, value], i) => (
                <div
                  key={term}
                  className={`py-6 sm:py-7 ${i > 0 ? "sm:border-e sm:border-quarry-800 sm:pe-6" : ""}`}
                >
                  <dt className="tag text-quarry-500">{term}</dt>
                  <dd className="mt-2.5 text-[0.9375rem] text-quarry-200">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- ledger -- */}
      <Section ground="light" film>
        <div className="lg:grid lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <Reveal className="flex items-center gap-4">
              <span className="tag text-oxide-deep">{arHome.ledger.index}</span>
              <span className="h-px max-w-[7rem] flex-1 bg-limestone-line" />
              <span className="tag text-quarry-600">{arHome.ledger.label}</span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-7 max-w-[22ch] text-major text-quarry-950">
                {arHome.ledger.heading}
                <span className="block text-quarry-600">
                  {arHome.ledger.headingDim}
                </span>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-6 max-w-[62ch] text-lede text-quarry-600">
                {arHome.ledger.lede}
              </p>
            </Reveal>
          </div>
          <Reveal delay={200} className="mt-10 lg:col-span-3 lg:col-start-10 lg:mt-0 lg:self-end">
            <div className="h-px w-full bg-limestone-line" />
            <p className="mt-4 font-mono text-xs leading-relaxed text-quarry-600">
              {arHome.ledger.note}
            </p>
          </Reveal>
        </div>

        <Reveal>
          <ul className="mt-14 divide-y divide-limestone-line/70 border-y border-limestone-line">
            {arHome.ledger.rows.map(([label, amount]) => (
              <li
                key={label}
                className="flex items-center justify-between gap-6 py-4"
              >
                <span className="text-[0.9375rem] text-quarry-900">{label}</span>
                <span className="tabular font-mono text-[0.9375rem] text-quarry-950">
                  {amount} <span className="text-quarry-600">درهم / شهريًا</span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          <dl className="mt-10 grid gap-8 border-t-2 border-quarry-950 pt-8 sm:grid-cols-3">
            {arHome.ledger.totals.map(([term, value], i) => (
              <div
                key={term}
                className={i > 0 ? "sm:border-e sm:border-limestone-line sm:pe-8" : ""}
              >
                <dt className={`tag ${i === 2 ? "text-oxide-deep" : "text-quarry-600"}`}>
                  {term}
                </dt>
                <dd
                  className={`tabular mt-3 ${i === 2 ? "text-major leading-none text-oxide-deep" : "text-minor text-quarry-950"}`}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-9 max-w-[52ch] text-lede text-quarry-900">
            {arHome.ledger.kicker}
          </p>
          <p className="mt-6 max-w-[62ch] font-mono text-xs leading-relaxed text-quarry-600">
            {arHome.ledger.interactive}{" "}
            <Link href="/#ledger" lang="en" className="underline underline-offset-4">
              Open the interactive ledger
            </Link>
          </p>
        </Reveal>
      </Section>

      {/* ------------------------------------------------------ position -- */}
      <Section ground="dark">
        <div className="lg:grid lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <Reveal className="flex items-center gap-4">
              <span className="tag text-oxide">{arHome.position.index}</span>
              <span className="h-px max-w-[7rem] flex-1 bg-quarry-700" />
              <span className="tag text-quarry-400">{arHome.position.label}</span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-7 max-w-[22ch] text-major text-bone">
                {arHome.position.heading}
                <span className="block text-quarry-500">
                  {arHome.position.headingDim}
                </span>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-6 max-w-[62ch] text-lede text-quarry-400">
                {arHome.position.lede}
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal className="cmp mt-14">
          <table className="w-full border-collapse text-start">
            <caption className="sr-only">
              مقارنة بين استئجار البرمجيات وامتلاك النظام عبر سبعة محاور
            </caption>
            <thead>
              <tr>
                <th scope="col" className="tag w-[24%] pb-4 text-quarry-500">
                  المحور
                </th>
                <th scope="col" className="tag w-[38%] pb-4 text-quarry-500">
                  مستأجَر
                </th>
                <th scope="col" className="tag w-[38%] pb-4 text-oxide">
                  مملوك
                </th>
              </tr>
            </thead>
            <tbody>
              {arHome.position.rows.map(([dimension, rented, owned]) => (
                <tr key={dimension}>
                  <th scope="row" className="align-top text-[0.9375rem] font-medium text-bone">
                    {dimension}
                  </th>
                  <td data-col="مستأجَر" className="align-top text-[0.9375rem] leading-relaxed text-quarry-400">
                    {rented}
                  </td>
                  <td data-col="مملوك" className="align-top text-[0.9375rem] leading-relaxed text-quarry-200">
                    {owned}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-14 grid gap-10 border-t border-quarry-800 pt-12 lg:grid-cols-12">
            <p className="text-minor text-bone lg:col-span-6">
              {arHome.position.kicker}
            </p>
            <div className="lg:col-span-5 lg:col-start-8">
              <Link
                href="/ar/ownership"
                className="group inline-flex items-center gap-3 text-[0.9375rem] text-oxide transition-colors hover:text-oxide-bright"
              >
                اقرأ الحجّة كاملة
                <Arrow className="rotate-180" />
              </Link>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* -------------------------------------------------------- layers -- */}
      <Section ground="raised">
        <div className="lg:grid lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <Reveal className="flex items-center gap-4">
              <span className="tag text-oxide">{arHome.layers.index}</span>
              <span className="h-px max-w-[7rem] flex-1 bg-quarry-700" />
              <span className="tag text-quarry-400">{arHome.layers.label}</span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-7 max-w-[22ch] text-major text-bone">
                {arHome.layers.heading}
                <span className="block text-quarry-500">
                  {arHome.layers.headingDim}
                </span>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-6 max-w-[62ch] text-lede text-quarry-400">
                {arHome.layers.lede}
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-14 border-t border-quarry-800">
          {arHome.layers.items.map(([code, name, role], i) => (
            <Reveal key={code} delay={i * 40}>
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-b border-quarry-800 py-5">
                <span className="tag w-10 text-oxide latin">{code}</span>
                <span className="text-lg text-bone">{name}</span>
                <span className="text-[0.9375rem] text-quarry-400">{role}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={80}>
          <Link
            href="/ar/capabilities"
            className="group mt-12 inline-flex items-center gap-3 text-[0.9375rem] text-oxide transition-colors hover:text-oxide-bright"
          >
            التفاصيل الكاملة لكل طبقة
            <Arrow className="rotate-180" />
          </Link>
        </Reveal>
      </Section>

      {/* -------------------------------------------------------- method -- */}
      <Section ground="dark">
        <div className="lg:grid lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <Reveal className="flex items-center gap-4">
              <span className="tag text-oxide">{arHome.method.index}</span>
              <span className="h-px max-w-[7rem] flex-1 bg-quarry-700" />
              <span className="tag text-quarry-400">{arHome.method.label}</span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-7 max-w-[22ch] text-major text-bone">
                {arHome.method.heading}
                <span className="block text-quarry-500">
                  {arHome.method.headingDim}
                </span>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-6 max-w-[62ch] text-lede text-quarry-400">
                {arHome.method.lede}
              </p>
            </Reveal>
          </div>
        </div>

        <ol className="relative mt-14">
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-2 end-[7px] w-px bg-quarry-700"
          />
          {arStages.map((stage, i) => (
            <Reveal as="li" key={stage.code} delay={i * 60} className="group relative pb-12 last:pb-0">
              <div className="relative pe-8">
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 end-0 h-[15px] w-[15px] border border-quarry-600 bg-quarry-950 transition-colors duration-700 group-data-[reveal=in]:border-oxide group-data-[reveal=in]:bg-oxide"
                />
                <h3 className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="tag text-oxide">{stage.index}</span>
                  <span className="text-2xl font-semibold text-bone sm:text-[1.75rem]">
                    {stage.code}
                  </span>
                  <span className="font-mono text-xs text-quarry-500">
                    {stage.duration}
                  </span>
                </h3>
                <p className="mt-3 max-w-[52ch] text-lede text-quarry-200">
                  {stage.title}
                </p>
                <p className="mt-5 max-w-[58ch] border-s border-quarry-700 ps-4 font-mono text-xs leading-relaxed text-quarry-400">
                  {stage.edge}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={80}>
          <Link
            href="/ar/method"
            className="group mt-12 inline-flex items-center gap-3 text-[0.9375rem] text-oxide transition-colors hover:text-oxide-bright"
          >
            المنهجية كاملة
            <Arrow className="rotate-180" />
          </Link>
        </Reveal>
      </Section>

      {/* ------------------------------------------------------ handover -- */}
      <Section ground="light" film>
        <div className="lg:grid lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <Reveal className="flex items-center gap-4">
              <span className="tag text-oxide-deep">{arHome.handover.index}</span>
              <span className="h-px max-w-[7rem] flex-1 bg-limestone-line" />
              <span className="tag text-quarry-600">{arHome.handover.label}</span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-7 max-w-[22ch] text-major text-quarry-950">
                {arHome.handover.heading}
                <span className="block text-quarry-600">
                  {arHome.handover.headingDim}
                </span>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-6 max-w-[62ch] text-lede text-quarry-600">
                {arHome.handover.lede}
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <ul className="border-t border-limestone-line">
              {arHome.handover.received.map(([term, detail], i) => (
                <li
                  key={term}
                  className="grid grid-cols-[3rem_1fr] gap-x-4 border-b border-limestone-line py-5"
                >
                  <span className="tag pt-1 text-quarry-600 latin">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block text-[1.0625rem] font-medium text-quarry-950">
                      {term}
                    </span>
                    <span className="mt-1.5 block text-[0.9375rem] leading-relaxed text-quarry-700">
                      {detail}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-5">
            <div className="border border-quarry-950/25 bg-quarry-950 p-8 sm:p-10">
              <p className="tag text-quarry-400">مستبعَد عمدًا</p>
              <ul className="mt-7 space-y-4">
                {arHome.handover.excluded.map((item) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-3.5 text-[0.9375rem] text-bone"
                  >
                    <span aria-hidden="true" className="relative top-[-1px] h-px w-4 shrink-0 bg-oxide" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ------------------------------------------------------- refusal -- */}
      <section className="relative overflow-hidden border-t border-quarry-800 bg-quarry-950">
        <div className="shell py-28 md:py-36 lg:py-44">
          <Reveal scribe className="h-px w-full origin-right bg-oxide" />
          <div className="grid gap-12 pt-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="tag text-quarry-500">{arHome.refusal.label}</p>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="mt-8 max-w-[20ch] text-major text-bone">
                  {arHome.refusal.heading}
                </h2>
              </Reveal>
            </div>
            <div className="lg:col-span-5">
              <Reveal delay={140}>
                <p className="text-lede text-quarry-300">{arHome.refusal.lede}</p>
              </Reveal>
              {arHome.refusal.body.map((para, i) => (
                <Reveal key={para} delay={190 + i * 50}>
                  <p className="mt-6 text-[0.9375rem] leading-relaxed text-quarry-400">
                    {para}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- faq -- */}
      <Section ground="raised">
        <Reveal className="flex items-center gap-4">
          <span className="tag text-oxide">٠٦</span>
          <span className="h-px max-w-[7rem] flex-1 bg-quarry-700" />
          <span className="tag text-quarry-400">{arHome.faqLabel}</span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-7 max-w-[22ch] text-major text-bone">
            {arHome.faqHeading}
          </h2>
        </Reveal>
        <Faq
          items={arHome.faq.map(([question, answer]) => ({ question, answer }))}
        />
      </Section>

      {/* ----------------------------------------------------------- cta -- */}
      <section className="relative overflow-hidden border-t border-quarry-800 bg-quarry-900">
        <div className="gridfilm" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-oxide/50" />
        <div className="shell relative py-24 md:py-32">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="tag text-oxide">{arHome.ctaBand.eyebrow}</p>
              </Reveal>
              <Reveal delay={70}>
                <h2 className="mt-7 max-w-[18ch] text-major text-bone">
                  {arHome.ctaBand.heading}
                </h2>
              </Reveal>
              <Reveal delay={130}>
                <p className="mt-7 max-w-[58ch] text-lede text-quarry-300">
                  {arHome.ctaBand.body}
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-5">
              <Reveal delay={180} className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <ButtonLink href={arSite.ctaHref} size="lg" trailing={<Arrow className="rotate-180" />}>
                  {arSite.cta}
                </ButtonLink>
                <ButtonLink href={`mailto:${site.email}`} size="lg" variant="secondary">
                  راسلنا مباشرة
                </ButtonLink>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <FaqSchema
        items={arHome.faq.map(([question, answer]) => ({ question, answer }))}
      />
    </>
  );
}
