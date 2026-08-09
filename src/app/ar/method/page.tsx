import type { Metadata } from "next";
import { ArPageHeader } from "@/components/ArPageHeader";
import { Reveal } from "@/components/Reveal";
import { ButtonLink, Arrow } from "@/components/Button";
import { arStages, arSite } from "@/data/ar";

export const metadata: Metadata = {
  title: "منهجية كورهولد — تدقيق، تشخيص، هندسة، بناء، تسليم",
  description:
    "البروتوكول المكوّن من خمس مراحل خلف كل تعاقد مع كورهولد: تدقيق طريقة عمل الشركة فعليًا، وتشخيص مواضع تسرّب المال والوقت، وهندسة أصغر نظام يُحدث أكبر أثر، وبناؤه ليُحتفظ به عقدًا، ثم تسليم الشيفرة والبيانات والتوثيق كاملة.",
  alternates: { canonical: "/ar/method" },
  openGraph: { title: "منهجية كورهولد", url: "/ar/method", locale: "ar_AE" },
};

export default function ArabicMethod() {
  return (
    <>
      <ArPageHeader
        eyebrow="منهجية كورهولد"
        title="خمس مراحل."
        titleDim="ولا اختصارات تُباع."
        lede="لا نبدأ بالبناء أبدًا، ولا نتلقّى طلبات لميزات. كل تعاقد يمرّ بالبروتوكول ذاته وبالترتيب ذاته، لأن قيمة المراحل الثلاث الأخيرة تتوقف كليًا على أداء الأوليين بأمانة. وما يلي هو البروتوكول كاملًا، بما في ذلك الأجزاء التي تكلّفنا عملًا."
        meta={[
          ["التسلسل", "ثابت. لا تُتخطّى مرحلة من أجل السرعة."],
          ["نقطة القرار", "نهاية المرحلة ٠٢، قبل بناء أي شيء."],
          ["ينتهي بـ", "فريقك وهو يشغّل النظام دوننا."],
        ]}
      />

      {arStages.map((stage, i) => (
        <section
          key={stage.code}
          className={`border-t border-quarry-800 ${i % 2 === 1 ? "bg-quarry-900" : "bg-quarry-950"}`}
        >
          <div className="shell py-20 md:py-28">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-4">
                <Reveal>
                  <p className="tag text-oxide">المرحلة {stage.index}</p>
                  <h2 className="mt-4 text-major text-bone">{stage.code}</h2>
                  <p className="mt-4 font-mono text-xs text-quarry-400">
                    {stage.duration}
                  </p>
                </Reveal>
              </div>

              <div className="lg:col-span-8">
                <Reveal delay={60}>
                  <p className="tag text-quarry-500">السؤال</p>
                  <p className="mt-4 max-w-[30ch] text-minor text-bone">
                    {stage.question}
                  </p>
                </Reveal>

                <Reveal delay={110}>
                  <p className="mt-10 max-w-[62ch] text-lede text-quarry-200">
                    {stage.body}
                  </p>
                </Reveal>

                <Reveal delay={160}>
                  <div className="mt-12">
                    <p className="tag text-quarry-500">
                      ما الذي يوجد في نهاية هذه المرحلة
                    </p>
                    <ul className="mt-6 border-t border-quarry-800">
                      {stage.deliverables.map((item, k) => (
                        <li
                          key={item}
                          className="grid grid-cols-[3rem_1fr] gap-4 border-b border-quarry-800 py-4"
                        >
                          <span className="tag pt-1 text-quarry-500 latin">
                            {stage.index.replace(/[٠-٩]/g, (d) =>
                              String("٠١٢٣٤٥٦٧٨٩".indexOf(d)),
                            )}
                            .{k + 1}
                          </span>
                          <span className="text-[0.9375rem] leading-relaxed text-quarry-200">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>

                <Reveal delay={210}>
                  <p className="mt-9 max-w-[62ch] border-s-2 border-oxide ps-5 text-[0.9375rem] leading-relaxed text-quarry-300">
                    {stage.edge}
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="border-t border-quarry-800 bg-quarry-900">
        <div className="shell py-24 md:py-32">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="tag text-oxide">ابدأ من المرحلة الأولى</p>
              </Reveal>
              <Reveal delay={70}>
                <h2 className="mt-7 max-w-[20ch] text-major text-bone">
                  التدقيق هو الباب الوحيد.
                </h2>
              </Reveal>
              <Reveal delay={130}>
                <p className="mt-7 max-w-[58ch] text-lede text-quarry-300">
                  لا مدخل آخر لأي تعاقد مع كورهولد. نرسم خريطة طريقة عمل شركتك،
                  ونضع رقمًا مقابل تكلفة الوضع الحالي، ونخبرك بوضوح بما سنفعله —
                  بما في ذلك، أحيانًا، ألّا نفعل شيئًا.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-5">
              <Reveal delay={180} className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <ButtonLink href={arSite.ctaHref} size="lg" trailing={<Arrow className="rotate-180" />}>
                  {arSite.cta}
                </ButtonLink>
                <ButtonLink href="/ar/capabilities" size="lg" variant="secondary">
                  ما نبنيه
                </ButtonLink>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
