import type { Metadata } from "next";
import { ArPageHeader } from "@/components/ArPageHeader";
import { Reveal } from "@/components/Reveal";
import { ButtonLink, Arrow } from "@/components/Button";
import { arLayers, arSite } from "@/data/ar";

export const metadata: Metadata = {
  title: "ما نبنيه — العمليات والأتمتة والذكاء والأدوات الداخلية ومنصات العملاء",
  description:
    "تبني كورهولد نظامًا واحدًا متصلًا عبر خمس طبقات: نواة العمليات، والأتمتة، والذكاء الاصطناعي المطبَّق، والأدوات الداخلية، ومنصات العملاء. برمجيات مخصّصة لشركات الإمارات والعالم، يملكها العميل بالكامل.",
  alternates: { canonical: "/ar/capabilities" },
  openGraph: { title: "ما تبنيه كورهولد", url: "/ar/capabilities", locale: "ar_AE" },
};

const notThis = [
  "لسنا وكالة تسويق ألحقت بها فريق تطوير.",
  "لسنا ترتيبًا لتوظيف المهندسين بالساعة.",
  "لا نعيد بيع منصة شركة أخرى باسمنا.",
  "لا نستضيف نظامك على بنيتنا التحتية ونفوترك مقابل ذلك.",
  "لا نقبل تعاقدات أكثر مما نستطيع إدارته على الوجه الصحيح.",
];

export default function ArabicCapabilities() {
  return (
    <>
      <ArPageHeader
        eyebrow="ما نبنيه"
        title="أساس واحد."
        titleDim="وخمس طبقات فوقه."
        lede="تتسرّب الحزمة المستأجَرة لأن كل أداة تحتفظ بنسختها الخاصة من الحقيقة، فيضطر أحدهم إلى التوفيق بينها يدويًا. نبني نواة واحدة تُوصَف فيها الشركة، ثم يقرأ كل ما فوقها منها بدل أن يتزامن معها. اقرأ الطبقات من الأسفل إلى الأعلى، كما تُقرأ تفصيلة أساسات."
        meta={[
          ["يُسلَّم كـ", "نظام واحد على مراحل، لا خمسة مشاريع"],
          ["مسجَّل باسم", "مؤسستك، منذ أول سطر"],
          ["مبنيّ على", "لغات وبنية تحتية قياسية"],
        ]}
      />

      {arLayers.map((layer, i) => (
        <section
          key={layer.index}
          className={`border-t border-quarry-800 ${i % 2 === 0 ? "bg-quarry-950" : "bg-quarry-900"}`}
        >
          <div className="shell py-20 md:py-28">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-4">
                <Reveal>
                  <div className="flex items-baseline gap-4">
                    <span className="tag text-oxide latin">{layer.index}</span>
                    <span className="h-px w-12 bg-quarry-700" />
                  </div>
                  <h2 className="mt-6 text-major text-bone">{layer.name}</h2>
                  <p className="mt-5 max-w-[30ch] text-lede text-quarry-400">
                    {layer.role}
                  </p>
                </Reveal>
              </div>

              <div className="lg:col-span-8">
                <Reveal delay={70}>
                  <p className="max-w-[62ch] text-lede text-quarry-200">
                    {layer.body}
                  </p>
                </Reveal>
                <Reveal delay={130}>
                  <p className="mt-10 max-w-[58ch] border-s-2 border-oxide ps-5 font-mono text-xs leading-relaxed text-quarry-400">
                    <span className="text-quarry-500">يستبدل عادةً — </span>
                    {layer.replaces}
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="border-t border-quarry-800 bg-quarry-950">
        <div className="shell py-24 md:py-32">
          <Reveal>
            <p className="tag text-oxide">الموقف التقني</p>
          </Reveal>
          <Reveal delay={70}>
            <h2 className="mt-7 max-w-[24ch] text-major text-bone">
              تقنية مملّة، بمعيار غير معقول.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="space-y-6 text-[0.9375rem] leading-relaxed text-quarry-400 lg:col-span-6">
              <p>
                لغات قياسية بسوق توظيف عميق. قواعد بيانات علائقية قياسية. بنية
                تحتية من مزوّدين يعرفهم مديرك المالي، في حسابات مسجّلة باسم شركتك
                ومفوترة عليك مباشرة. لا بيئة تشغيل خاصة بكورهولد، ولا إطار عمل من
                اختراعنا، ولا اعتمادية سيتخلّى عنها صاحبها خلال ثلاث سنوات.
              </p>
              <p>
                وحيث ينتمي الذكاء الاصطناعي إلى النظام، يُطبَّق على بياناتك داخل
                حدودك أنت — لا بإرسال تاريخ عمليات الشركة إلى منصة تحتفظ به.
              </p>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <p className="tag text-quarry-500">وبالمقابل، ما لسنا عليه</p>
              <ul className="mt-6 space-y-4">
                {notThis.map((item) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-3.5 text-[0.9375rem] leading-relaxed text-quarry-200"
                  >
                    <span aria-hidden="true" className="relative top-[-1px] h-px w-4 shrink-0 bg-oxide" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Reveal delay={80}>
            <div className="mt-16 border-t border-quarry-800 pt-12">
              <ButtonLink href={arSite.ctaHref} size="lg" trailing={<Arrow className="rotate-180" />}>
                {arSite.cta}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
