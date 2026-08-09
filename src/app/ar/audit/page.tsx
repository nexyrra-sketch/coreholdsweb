import type { Metadata } from "next";
import Link from "next/link";
import { ArPageHeader } from "@/components/ArPageHeader";
import { Reveal } from "@/components/Reveal";
import { ButtonLink, Arrow, WhatsAppGlyph } from "@/components/Button";
import { arAudit } from "@/data/ar";
import { site, whatsappHref, whatsappOpeners } from "@/lib/site";

export const metadata: Metadata = {
  title: "اطلب تدقيقًا للنظام — كورهولد، دبي",
  description:
    "كل تعاقد مع كورهولد يبدأ بتدقيق: خريطة موثّقة لطريقة عمل شركتك فعليًا، والتكلفة الحقيقية لبرمجياتك المستأجَرة على خمس سنوات، وتوصية صريحة قد تكون أحيانًا ألّا تبني شيئًا.",
  alternates: { canonical: "/ar/audit" },
  openGraph: { title: "اطلب تدقيقًا للنظام — كورهولد", url: "/ar/audit", locale: "ar_AE" },
};

export default function ArabicAudit() {
  return (
    <>
      <ArPageHeader
        eyebrow={arAudit.eyebrow}
        title={arAudit.title}
        lede={arAudit.lede}
        meta={arAudit.meta}
      />

      <section className="border-t border-quarry-800 bg-quarry-950">
        <div className="shell py-24 md:py-32">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <h2 className="text-minor text-bone">{arAudit.receiveHeading}</h2>
              </Reveal>
              <Reveal delay={70}>
                <ul className="mt-8 border-t border-quarry-800">
                  {arAudit.receive.map(([index, item]) => (
                    <li
                      key={index}
                      className="grid grid-cols-[3rem_1fr] gap-4 border-b border-quarry-800 py-5"
                    >
                      <span className="tag pt-1 text-oxide">{index}</span>
                      <span className="text-[0.9375rem] leading-relaxed text-quarry-200">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-8 max-w-[60ch] text-[0.9375rem] leading-relaxed text-quarry-400">
                  {arAudit.belongs}
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal delay={100}>
                <div className="border border-quarry-800 bg-quarry-900 p-8">
                  <p className="tag text-oxide">يستحق أن تعرفه أولًا</p>
                  <div className="mt-7 space-y-7">
                    <div>
                      <h3 className="text-[0.9375rem] font-medium text-bone">
                        {arAudit.fitHeading}
                      </h3>
                      <ul className="mt-3.5 space-y-2.5">
                        {arAudit.fit.map((item) => (
                          <li
                            key={item}
                            className="flex gap-3 text-[0.9375rem] leading-relaxed text-quarry-300"
                          >
                            <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 bg-oxide" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border-t border-quarry-800 pt-7">
                      <h3 className="text-[0.9375rem] font-medium text-bone">
                        {arAudit.noFitHeading}
                      </h3>
                      <ul className="mt-3.5 space-y-2.5">
                        {arAudit.noFit.map((item) => (
                          <li
                            key={item}
                            className="flex gap-3 text-[0.9375rem] leading-relaxed text-quarry-400"
                          >
                            <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 bg-quarry-600" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-quarry-800 bg-quarry-900">
        <div className="shell py-24 md:py-32">
          <Reveal>
            <p className="tag text-oxide">الطلب</p>
          </Reveal>
          <Reveal delay={70}>
            <h2 className="mt-7 max-w-[24ch] text-major text-bone">
              أخبرنا بما يُدار به العمل اليوم.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-7 max-w-[62ch] text-lede text-quarry-300">
              {arAudit.formNote}
            </p>
          </Reveal>

          <Reveal delay={170}>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
              <ButtonLink
                href={whatsappHref(whatsappOpeners.ar)}
                size="lg"
                trailing={<WhatsAppGlyph />}
              >
                راسلنا على واتساب
              </ButtonLink>
              <ButtonLink
                href={`mailto:${site.email}`}
                size="lg"
                variant="secondary"
                trailing={<Arrow className="rotate-180" />}
              >
                {arAudit.emailCta}
              </ButtonLink>
              <Link
                href="/audit"
                lang="en"
                className="text-[0.9375rem] text-quarry-300 underline underline-offset-4 transition-colors hover:text-bone"
              >
                Open the request form in English
              </Link>
            </div>
          </Reveal>

          <Reveal delay={210}>
            <p className="mt-8 max-w-[54ch] font-mono text-xs leading-relaxed text-quarry-500">
              نقرأ كل طلب بأنفسنا. وإن لم نكن الاستوديو المناسب لهذا العمل،
              سنقول ذلك ونخبرك بما كنا سنفعله بدلًا منه.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
