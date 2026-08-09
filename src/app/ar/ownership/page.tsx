import type { Metadata } from "next";
import { ArPageHeader } from "@/components/ArPageHeader";
import { Reveal } from "@/components/Reveal";
import { ButtonLink, Arrow } from "@/components/Button";
import { arSite } from "@/data/ar";

export const metadata: Metadata = {
  title: "الملكية مقابل الاستئجار — لماذا تُعدّ ملكية الأنظمة موقفًا لا بندًا",
  description:
    "الحجّة التي تقوم عليها كورهولد: البرمجيات التي تستأجرها تكلفة لا تنتهي، والأنظمة التي تملكها أصل يتراكم. كيف تتراكم الحزم المستأجَرة، وما الذي لا تحصل عليه الشركة مقابل إنفاقها، وما لا تعنيه الملكية.",
  alternates: { canonical: "/ar/ownership" },
  openGraph: { title: "الملكية مقابل الاستئجار", url: "/ar/ownership", locale: "ar_AE" },
};

const missing: [string, string][] = [
  [
    "الشيفرة",
    "لا تراها، ولا تستطيع تدقيقها، ولا تغييرها. وإن اتّجهت خارطة الطريق إلى حيث لا تريد، ذهبت معها.",
  ],
  [
    "نموذج البيانات",
    "يُوصَف عملك بمفاهيم غيرك. ومع السنوات تعيد الشركة تشكيل نفسها لتناسب الحقول المتاحة.",
  ],
  [
    "الخروج",
    "التصدير موجود عادةً. أما التصدير بصيغة يستطيع نظام آخر استخدامها فعليًا، بعلاقاتها سليمة، فغالبًا لا.",
  ],
  [
    "موقع التفاوض",
    "التسعير والشروط وإيقاف الخدمات وعمليات الاستحواذ كلها تحدث لك. ولا توجد نسخة من هذه العلاقة تكون فيها الطرف الأقوى.",
  ],
];

const misreadings: [string, string][] = [
  [
    "الملكية ليست بناء كل شيء بنفسك",
    "لا ينبغي لأحد أن يكتب نظام محاسبته أو محرّك رواتبه أو بوابة الدفع الخاصة به. هذه مجالات منظّمة ومُشبعة، ومن الأفضل فعلًا استئجارها. الملكية تخصّ الجزء الذي يرمّز طريقة عمل شركتك تحديدًا — الجزء الذي لا يستطيع أي مورّد بيعه لك لأنه غير موجود في أي مكان آخر.",
  ],
  [
    "الملكية ليست عداءً للاشتراكات",
    "الاشتراك وسيلة جيدة لشراء مشكلة محلولة، ووسيلة رديئة للاحتفاظ بتعريف عملك. السؤال ليس «اشتراك أم تخصيص»، بل إلى أي فئة ينتمي كل جزء من عملياتك — وهو تمييز لم تجرِه معظم الشركات عن قصد.",
  ],
  [
    "الملكية ليست أرخص في اليوم الأول",
    "هي أغلى في البداية غالبًا. الحجّة تُبنى على مدى خمس سنوات، مقابل تصاعد التجديدات ونمو المستخدمين والعمل اليدوي الذي تتطلبه حزمة مبعثرة بصمت. وإن لم ينجح هذا الحساب في حالتك، فسنكون نحن من يخبرك بذلك.",
  ],
  [
    "الملكية ليست مشروعًا تنتهي منه وتنساه",
    "النظام المملوك يحتاج صيانة، تمامًا كما يحتاجها مبنى. الفرق أنك تدفع للحفاظ على أصلك في حالة جيدة، لا مقابل استمرار الإذن باستخدام أصل غيرك.",
  ],
];

export default function ArabicOwnership() {
  return (
    <>
      <ArPageHeader
        eyebrow="الموقف"
        title="الاستئجار يبقيك في المتوسط."
        titleDim="والملكية تتراكم."
        lede="هذه هي الحجّة التي بُني عليها الاستوديو كله، معروضة بوضوح ومع نقاط ضعفها. وإن اختلفت معها بعد قراءة هذه الصفحة، فنحن غالبًا لسنا الجهة المناسبة لبناء أساس عملك — وتلك نتيجة مفيدة أن نصل إليها مبكرًا."
      />

      <section className="border-t border-quarry-800 bg-quarry-950">
        <div className="shell py-24 md:py-32">
          <Reveal>
            <p className="tag text-oxide">٠١ — كيف يحدث</p>
          </Reveal>
          <Reveal delay={70}>
            <h2 className="mt-7 max-w-[22ch] text-major text-bone">
              لا أحد يقرر أن يصبح مستأجرًا.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="space-y-6 text-[0.9375rem] leading-relaxed text-quarry-400 lg:col-span-6">
              <p>
                يُنشَر الموقع على منصة لأن ذلك أسرع من بنائه. ويصل نظام إدارة
                العملاء لأن جدول البيانات توقّف عن الوفاء بالغرض. وتُضاف أداة
                أتمتة للربط بينهما لأنهما لم يُصمّما للتحدث. ثم اشتراك لمساعد ذكي،
                ونظام للدعم، وآخر للتحليلات. كل قرار رخيص بمفرده، وكل قرار يحلّ
                مشكلة حقيقية يوم اتُّخذ.
              </p>
              <p>
                بعد ثلاث سنوات تصبح معلومات الشركة موزّعة على اثني عشر مزوّدًا
                يحتفظ كل منهم بشظية منها. لا نظام واحد يعرف ما هو صحيح. ويقضي
                الموظفون ساعات أسبوعيًا في نقل السجلات بين الأدوات يدويًا.
              </p>
            </div>
            <div className="space-y-6 text-[0.9375rem] leading-relaxed text-quarry-400 lg:col-span-6">
              <p>
                تتجدّد الفواتير بهدوء. وتُضاف المقاعد كلما نما الفريق. ويتحرّك
                سعر التجديد في اتجاه واحد. ونادرًا ما يُنظر إلى المجموع كرقم واحد،
                لأنه لا يصل أصلًا كرقم واحد، بل كأربعة عشر بندًا في كشف حساب، كل
                منها أصغر من أن يستحق النقاش.
              </p>
              <p>
                وتحت ذلك كله، تكون الشركة قد أعادت تشكيل نفسها ببطء لتناسب ما
                تسمح به الأدوات. وهذا هو الجزء الذي لا يظهر في أي فاتورة، وهو
                الجزء المكلف.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-quarry-800 bg-quarry-900">
        <div className="shell py-24 md:py-32">
          <Reveal>
            <p className="tag text-oxide">٠٢ — ما لا يشتريه المال</p>
          </Reveal>
          <Reveal delay={70}>
            <h2 className="mt-7 max-w-[24ch] text-major text-bone">
              أربعة أشياء لا تحصل عليها مهما طال دفعك.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-px border border-quarry-800 bg-quarry-800 sm:grid-cols-2">
            {missing.map(([term, detail], i) => (
              <Reveal key={term} delay={i * 60} className="bg-quarry-900 p-8 lg:p-10">
                <span className="tag text-oxide">
                  {["٠١", "٠٢", "٠٣", "٠٤"][i]}
                </span>
                <h3 className="mt-5 text-minor text-bone">{term}</h3>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-quarry-400">
                  {detail}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-quarry-800 bg-limestone">
        <div className="gridfilm gridfilm--light" />
        <div className="shell relative py-24 md:py-32">
          <Reveal>
            <p className="tag text-oxide-deep">٠٣ — حدود الحجّة</p>
          </Reveal>
          <Reveal delay={70}>
            <h2 className="mt-7 max-w-[24ch] text-major text-quarry-950">
              أربعة أشياء لا يعنيها هذا الموقف.
            </h2>
          </Reveal>
          <Reveal delay={130}>
            <p className="mt-6 max-w-[62ch] text-lede text-quarry-600">
              الحجّة التي لا تستطيع ذكر حدودها شعار لا حجّة. وهذه حدودنا: المواضع
              التي لا ينطبق فيها منطق الملكية فعلًا، والتي ينبغي لمن يبيعها أن
              يخبرك بها.
            </p>
          </Reveal>

          <div className="mt-14 border-t border-limestone-line">
            {misreadings.map(([term, detail], i) => (
              <Reveal key={term} delay={i * 50}>
                <div className="grid gap-6 border-b border-limestone-line py-9 lg:grid-cols-12 lg:gap-10">
                  <div className="flex items-start gap-4 lg:col-span-5">
                    <span className="tag mt-1.5 text-oxide-deep">
                      {["٠١", "٠٢", "٠٣", "٠٤"][i]}
                    </span>
                    <h3 className="text-[1.0625rem] leading-snug font-medium text-quarry-950 sm:text-lg">
                      {term}
                    </h3>
                  </div>
                  <p className="text-[0.9375rem] leading-relaxed text-quarry-700 lg:col-span-7">
                    {detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-quarry-800 bg-quarry-950">
        <div className="shell py-24 md:py-32">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="tag text-oxide">الحجّة كلها في سطر</p>
              </Reveal>
              <Reveal delay={70}>
                <p className="mt-8 text-major text-bone">
                  المستأجر يحسّن مبنى لن يملكه أبدًا. وعند حدٍّ ما يتوقف ذلك عن
                  كونه تكلفة ويصبح قرارًا بشأن نوع الشركة التي تريدها.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-5">
              <Reveal delay={130}>
                <p className="text-[0.9375rem] leading-relaxed text-quarry-400">
                  كل عملية تحسّنها داخل أداة مستأجَرة، وكل سير عمل يتعلّمه فريقك،
                  وكل سنة من التاريخ تتراكم — كلها تحسّن أصلًا يملكه غيرك، بشروط
                  يستطيع تغييرها. البديل ليس أن تتوقف عن التحسين، بل أن تتأكد من
                  أن التحسين يستقر في مكان تملكه.
                </p>
              </Reveal>
              <Reveal delay={190}>
                <div className="mt-10">
                  <ButtonLink href={arSite.ctaHref} size="lg" trailing={<Arrow className="rotate-180" />}>
                    {arSite.cta}
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
