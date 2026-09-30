/**
 * Arabic (ar) translation of the landing/site-chrome editorial content.
 * Mirrors src/content/landing.ts exports 1:1 with an `Ar` suffix; only
 * human-readable string values are translated. Kept verbatim: every src/mid/
 * wide/href/iconKey/buttonType/trackingContext, xPct/yPct/days/experiences,
 * cookie category `key` enums, credit ("Ptah Tours field archive[…]"),
 * partner/social/badge proper names (Egypt Air, IATA, Visit Egypt, ETF,
 * Travelife), and `name`/`legalName`. Brand in prose -> بتاح تورز. MSA.
 * Tokens preserved: {year}.
 */
import type {
  HeroSlide,
  InspiredTab,
  PlanCtaBlock,
  FiftyCta,
  KbygItem,
  TourType,
  Story,
  SiteNav,
  FooterContent,
} from "@/content/landing";

const A = "/assets" as const;

export const siteMetaAr: { name: string; legalName: string; tagline: string } = {
  name: "Ptah Tours",
  legalName: "Ptah Tours for Tourism LLC",
  tagline: "مصر، ينتقيها من يدعونها وطنًا",
};

export const heroSlidesAr: HeroSlide[] = [
  {
    id: "giza",
    season: "summer",
    title: "امشِ بين آخر عجائب العالم القديم الباقية",
    shortLabel: "أهرامات الجيزة",
    subtitle: "صباحاتٌ خاصة في الجيزة بقيادة عالم مصريات، قبل وصول الزحام.",
    image: {
      src: `${A}/hero/hero-giza-portrait.webp`,
      mid: `${A}/hero/hero-giza.webp`,
      alt: "الهرم الأكبر خوفو وأبو الهول في الجيزة تحت ضوء الصباح الدافئ، وهضبة القاهرة في الخلفية.",
      credit: "Ptah Tours field archive",
    },
    hotspots: [
      { xPct: 30, yPct: 44, label: "الهرم الأكبر خوفو", href: "/trip-ideas/panorama-of-the-pyramids" },
      { xPct: 62, yPct: 70, label: "أبو الهول العظيم", href: "/trip-ideas/panorama-of-the-pyramids" },
    ],
  },
  {
    id: "thebes",
    season: "summer",
    title: "حلّق فوق مقابر طيبة مع أول ضوء",
    shortLabel: "المنطاد فوق الأقصر",
    subtitle: "مناطيد الشروق، ووادي الملوك، والكرنك قبل حرّ النهار.",
    image: {
      src: `${A}/hero/hero-thebes-portrait.webp`,
      mid: `${A}/hero/hero-thebes.webp`,
      alt: "منطادٌ يحلّق فوق الضفّة الغربية للأقصر عند الشروق، والحزام الأخضر للنيل في الأسفل.",
      credit: "Ptah Tours field archive",
    },
    hotspots: [
      { xPct: 26, yPct: 38, label: "مناطيد عند الفجر", href: "/trip-ideas/luxor-sunrise-weekend" },
      { xPct: 68, yPct: 62, label: "وادي الملوك", href: "/trip-ideas/kings-and-queens-of-thebes" },
    ],
  },
  {
    id: "blue-hole",
    season: "summer",
    title: "اغطس في الزُّرقة: شعاب سيناء الحيّة",
    shortLabel: "ساحل الثقب الأزرق",
    subtitle: "مارس السنوركل في الثقب الأزرق ورأس أبو جالوم ورأس محمد برفقة مرشدي غوصٍ مرخَّصين.",
    image: {
      src: `${A}/hero/hero-blue-hole-portrait.webp`,
      mid: `${A}/hero/hero-blue-hole.webp`,
      alt: "الدائرة الزرقاء العميقة للثقب الأزرق في دهب من الأعلى، تحفّها حافّة شعابٍ شاحبة وجبال سيناء.",
      credit: "Ptah Tours field archive",
    },
    hotspots: [
      { xPct: 40, yPct: 46, label: "حفرة الثقب الأزرق", href: "/trip-ideas/blue-hole-sinai" },
      { xPct: 66, yPct: 30, label: "ساحل رأس أبو جالوم", href: "/trip-ideas/blue-hole-sinai" },
    ],
  },
];

export const inspiredTabsAr: InspiredTab[] = [
  {
    key: "itineraries",
    label: "برامج الرحلات",
    cards: [
      { title: "بانوراما الأهرامات", href: "/trip-ideas/panorama-of-the-pyramids", days: 2, experiences: 6, image: { src: `${A}/itineraries/giza-essentials.webp`, alt: "جملٌ يمرّ أمام الهرم الأكبر خوفو على هضبة الجيزة." } },
      { title: "عطلة تراث القاهرة", href: "/trip-ideas/cairo-heritage-weekend", days: 3, experiences: 9, image: { src: `${A}/itineraries/cairo-heritage.webp`, alt: "خزائن العرض والقطع المذهّبة داخل المتحف المصري بالقاهرة." } },
      { title: "الكرنك نهارًا، ومعبد الأقصر ليلًا", href: "/trip-ideas/karnak-luxor-evening", days: 2, experiences: 7, image: { src: `${A}/itineraries/karnak-evening.webp`, alt: "أعمدة معبد الأقصر المضاءة عند الغسق، تتوهّج بلون الكهرمان في سماءٍ زرقاء داكنة." } },
      { title: "ملوك طيبة وملكاتها", href: "/trip-ideas/kings-and-queens-of-thebes", days: 3, experiences: 8, image: { src: `${A}/itineraries/valley-of-kings.webp`, alt: "منحدراتٌ ذهبية تنحدر نحو مقابر وادي الملوك." } },
      { title: "جزيرة فيلة والسدّ العالي", href: "/trip-ideas/philae-island-aswan", days: 2, experiences: 5, image: { src: `${A}/itineraries/philae-island.webp`, alt: "معبد فيلة الجزيري يُقصَد بالقارب عبر مياهٍ زرقاء هادئة." } },
      { title: "القرية النوبية بالفلوكة", href: "/trip-ideas/nubian-village-aswan", days: 2, experiences: 6, image: { src: `${A}/itineraries/nubian-village.webp`, alt: "بيتٌ نوبي مزخرف بالمغرة الزاهية والأزرق فوق النيل." } },
      { title: "الإسكندرية في عطلة نهاية أسبوع", href: "/trip-ideas/alexandria-weekend", days: 2, experiences: 7, image: { src: `${A}/itineraries/alexandria-classics.webp`, alt: "السقف المنحني لمكتبة الإسكندرية الحديثة يطلّ على البحر المتوسط." } },
      { title: "قمّة سيناء ودير سانت كاترين", href: "/trip-ideas/sinai-summit-st-catherines", days: 2, experiences: 4, image: { src: `${A}/itineraries/sinai-summit.webp`, alt: "متسلّقون على درب الجمال الصاعد إلى جبل سيناء تحت سماء ما قبل الفجر." } },
    ],
  },
  {
    key: "adventure",
    label: "مغامرة",
    cards: [
      { title: "سنوركل في الثقب الأزرق", href: "/trip-ideas/blue-hole-sinai", image: { src: `${A}/activities/blue-hole-dive.webp`, alt: "غطّاسٌ بالسنوركل يطفو فوق حافّة الشعاب عند طرف الثقب الأزرق." } },
      { title: "جوب الوادي الملوّن", href: "/trip-ideas/colored-canyon-sinai", image: { src: `${A}/activities/colored-canyon.webp`, alt: "طبقاتٌ من الصخر الأحمر والذهبي والكريمي تتلوّى عبر ممرّ الوادي الملوّن." } },
      { title: "سفاري الدرّاجات الرباعية عند الغروب", href: "/trip-ideas/desert-safari-quad-sunset", image: { src: `${A}/activities/desert-safari.webp`, alt: "درّاجاتٌ رباعية تثير خيوط الغبار عبر سهلٍ صحراوي برتقالي عند الغروب." } },
      { title: "يومٌ بحري في البحر الأحمر", href: "/trip-ideas/red-sea-boat-snorkeling", image: { src: `${A}/activities/boat-snorkeling.webp`, alt: "قارب غوصٍ أبيض راسٍ فوق مياه الشعاب الفيروزية في البحر الأحمر." } },
    ],
  },
  {
    key: "culture",
    label: "ثقافة",
    cards: [
      { title: "المتحف المصري بصحبة مرشد", href: "/trip-ideas/egyptian-museum-guided", image: { src: `${A}/activities/museum-tahrir.webp`, alt: "تماثيل حجرية منحوتة وتوابيت داخل قاعات المتحف المصري." } },
      { title: "خان الخليلي بعد المغيب", href: "/trip-ideas/khan-el-khalili-night", image: { src: `${A}/activities/khan-el-khalili.webp`, alt: "أكشاك الفوانيس المتوهّجة داخل بازار خان الخليلي ليلًا." } },
      { title: "شايٌ مع عائلة نوبية", href: "/trip-ideas/nubian-village-aswan", image: { src: `${A}/activities/nubian-culture.webp`, alt: "فناءٌ نوبي مزخرف تجتمع فيه عائلة على الشاي." } },
      { title: "مكتبة الإسكندرية وقلعة قايتباي", href: "/trip-ideas/alexandria-weekend", image: { src: `${A}/activities/bibliotheca.webp`, alt: "واجهة الغرانيت المائلة لمكتبة الإسكندرية تلتقط ضوء الشمس." } },
    ],
  },
  {
    key: "river-sea",
    label: "النهر والبحر",
    cards: [
      { title: "فلوكة حول فيلة", href: "/trip-ideas/philae-island-aswan", image: { src: `${A}/activities/philae-felucca.webp`, alt: "فلوكة بيضاء الشراع تنساب نحو معبد فيلة عبر النيل." } },
      { title: "يومٌ بحري في رأس محمد", href: "/trip-ideas/ras-mohammed-park", image: { src: `${A}/activities/ras-mohammed.webp`, alt: "مياهٌ ضحلة فيروزية صافية وشعابٌ تُرى من قارب في رأس محمد." } },
      { title: "فلوكة الغروب، الأقصر", href: "/trip-ideas/luxor-sunrise-weekend", image: { src: `${A}/activities/nile-sunset-felucca.webp`, alt: "شراع فلوكة يلتقط آخر ضوءٍ برتقالي فوق النيل في الأقصر." } },
      { title: "سنوركل في الشعاب الساحلية", href: "/trip-ideas/red-sea-boat-snorkeling", image: { src: `${A}/activities/red-sea-boat.webp`, alt: "غطّاسون بالسنوركل ينسابون فوق حدائق المرجان على ساحل البحر الأحمر." } },
    ],
  },
  {
    key: "heritage",
    label: "تراث",
    cards: [
      { title: "قاعة الأعمدة الكبرى", href: "/trip-ideas/karnak-luxor-evening", image: { src: `${A}/activities/karnak-hypostyle.webp`, alt: "أعمدةٌ ضخمة على هيئة براعم البردي تزدحم بها قاعة الأعمدة في الكرنك." } },
      { title: "داخل وادي الملوك", href: "/trip-ideas/kings-and-queens-of-thebes", image: { src: `${A}/activities/valley-heritage.webp`, alt: "جدران ممرّ مقبرةٍ مرسومة تتوهّج تحت إضاءة الحفظ في وادي الملوك." } },
      { title: "فيلة: معبد إيزيس", href: "/trip-ideas/philae-island-aswan", image: { src: `${A}/activities/philae-temple.webp`, alt: "البوّابة المنحوتة لمعبد فيلة المكرَّس للإلهة إيزيس." } },
      { title: "حرّاس الجيزة", href: "/trip-ideas/panorama-of-the-pyramids", image: { src: `${A}/activities/sphinx-guardians.webp`, alt: "أبو الهول يحدّق بعيدًا عن الكاميرا وهرم خفرع في الخلفية." } },
    ],
  },
];

export const planCtaAr: PlanCtaBlock = {
  title: "خطّط لرحلة أحلامك",
  copy: "أخبِر استوديو القاهرة عندنا بما تحلم به — أهراماتٌ عند الفجر، وامتدادٌ متمهّل على النيل بين المعابد، وأسبوعٌ على الشعاب — وسيبني مصمّم رحلاتٍ مخصَّص الرحلةَ معك، رسالةً برسالة.",
  image: {
    src: `${A}/cta/plan-nile-portrait.webp`,
    mid: `${A}/cta/plan-karnak-landscape.webp`,
    wide: `${A}/cta/plan-karnak-landscape.webp`,
    wideAt: 1440,
    alt: "فلوكة تبحر بمحاذاة أشجار النخيل على النيل في أسوان، وصخور الغرانيت تعلّم الجندل الأول.",
  },
  credit: "Ptah Tours field archive — Aswan",
  cta: {
    type: "customButton",
    button: { buttonType: "buildATrip", trackingContext: "HomePageFullPageCTA", href: "/manage/trip-builder" },
    label: "ابدأ التخطيط",
  },
};

export const fiftyCtasAr: [FiftyCta, FiftyCta] = [
  {
    title: "مصمَّمة حولك",
    copy: "كل رحلةٍ مع بتاح خاصة ومفصَّلة على المقاس — مرشدك، وإيقاعك، ومسارك. لا شيء جاهزٌ معلَّب.",
    cta: { label: "صمّم رحلتي", href: "/contact" },
    image: {
      src: `${A}/cta/fifty-bespoke-journeys.webp`,
      mid: `${A}/cta/fifty-bespoke-journeys.webp`,
      wide: `${A}/cta/fifty-bespoke-journeys.webp`,
      wideAt: 1128,
      alt: "منظرٌ إلى الأعلى عبر أعمدة معبد الأقصر نحو سماءٍ مشرقة.",
    },
  },
  {
    title: "أبحِر في النيل بأناقة",
    copy: "رحلاتٌ نهرية من أربع إلى سبع ليالٍ بين الأقصر وأسوان، بمقصوراتٍ عايناها بأنفسنا.",
    cta: { label: "اكتشف النيل", href: "/the-nile" },
    image: {
      src: `${A}/cta/fifty-nile-cruise.webp`,
      mid: `${A}/cta/fifty-nile-cruise.webp`,
      wide: `${A}/cta/fifty-nile-cruise.webp`,
      wideAt: 1128,
      alt: "مركب رحلاتٍ نيلية راسٍ على الضفّة الغربية قرب أسوان في الساعة الذهبية.",
    },
  },
];

export const kbygItemsAr: [KbygItem, KbygItem, KbygItem, KbygItem] = [
  {
    iconKey: "weather",
    title: "متى تزور",
    copy: "من أكتوبر إلى أبريل موسم المعابد؛ والبحر الأحمر يتألّق طوال العام. سنطابق تواريخك مع الوجهة المناسبة.",
    cta: { label: "استعرض الفصول", href: "/when-to-visit" },
  },
  {
    iconKey: "ticket",
    title: "الدخول والتأشيرات",
    copy: "يمكن لمعظم الجنسيات استخراج التأشيرة الإلكترونية عبر الإنترنت في دقائق. ونرسل لكل ضيفٍ دليل وصولٍ خطوةً بخطوة.",
    cta: { label: "تحقّق من المتطلّبات", href: "/visa" },
  },
  {
    iconKey: "travel",
    title: "التنقّل",
    copy: "سائقون خاصّون افتراضيًّا، وقطاراتٌ من الدرجة الأولى ورحلاتٌ داخلية قصيرة بين المراحل الطويلة، وفلايك للأجزاء الممتعة.",
    cta: { label: "كيف نسافر", href: "/getting-around" },
  },
  {
    iconKey: "info",
    title: "تحدّث إلى إنسان",
    copy: "خبراء نيلٍ عريقون، لا مركز اتصالات. واتساب أو هاتف أو بريد إلكتروني — ستصل إلى الفريق الذي يخطّط الرحلة.",
    cta: { label: "اتّصل بنا", href: "/contact" },
  },
];

export const tourTypesAr: [TourType, TourType, TourType, TourType] = [
  {
    title: "مصر الكلاسيكية",
    blurb: "الأهرامات ومعابد الأقصر والمتاحف الكبرى — المسار الأساسي، مصنوعًا كما ينبغي.",
    href: "/tours?type=classic",
    image: { src: `${A}/tour-types/classic-egypt.webp`, alt: "صروح معبد فيلة تنعكس في النيل في صباحٍ ساكن بأسوان." },
  },
  {
    title: "رحلات النيل النهرية",
    blurb: "نَم على النهر: أسطحٌ من الأقصر إلى أسوان، ومراسٍ خاصة ومحطّات معابد في الطريق.",
    href: "/tours?type=nile-cruise",
    image: { src: `${A}/tour-types/nile-cruise.webp`, alt: "مناطيد ترتفع فوق وادي النيل غرب الأقصر عند الشروق." },
  },
  {
    title: "البحر الأحمر والشاطئ",
    blurb: "الغردقة وشرم الشيخ ودهب — أيام شعابٍ ورحلات قوارب وراحةٌ حقيقية.",
    href: "/tours?type=red-sea",
    image: { src: `${A}/tour-types/red-sea-escape.webp`, alt: "الشمس تغرب فوق البحر الأحمر وطيف دهبيةٍ في عرض الماء." },
  },
  {
    title: "مغامرات الصحراء",
    blurb: "مخيّمات الصحراء البيضاء، وقمم سيناء، ورحلات الواحات — مصر خلف ضفّة النهر.",
    href: "/tours?type=desert",
    image: { src: `${A}/tour-types/desert-adventure.webp`, alt: "مسارٌ لسيّارات الدفع الرباعي يتلوّى بين كثبانٍ برتقالية نحو مخيّمٍ صحراوي عند الغسق." },
  },
];

export const storiesAr: Story[] = [
  {
    title: "القاهرة أبعد من الدليل السياحي",
    summary: "حيث يأكل أهل القاهرة الكشري فعلًا، والمسجد صاحب أجمل غروبٍ في القاهرة، ولماذا تتفوّق الغرف الخلفية للمتحف المصري على القاعة الشهيرة — خمسة أيامٍ سيرًا في العاصمة مع فريقنا الميداني.",
    href: "/blog/cairo-beyond-the-guidebook",
    image: { src: `${A}/stories/cairo-experience.webp`, mid: `${A}/stories/cairo-experience.webp`, wide: `${A}/stories/cairo-experience.webp`, wideAt: 1440, alt: "القاهرة على ضفّة النيل عند الغسق، مآذنُ وجسورٌ تتراكب في سماءٍ بنفسجية." },
    credit: "Ptah Tours field archive",
  },
  {
    title: "أمسيةٌ في الكرنك، على انفراد",
    summary: "لعرض الصوت والضوء سمعةٌ سيّئة — وإليك كيف يُوقِّته مرشدونا لتكون قاعة الأعمدة شبه خالية، وما أصابه مصمّم الإضاءة في شأن المسلّات.",
    href: "/blog/karnak-sound-and-light",
    image: { src: `${A}/stories/karnak-sound-light.webp`, mid: `${A}/stories/karnak-sound-light.webp`, wide: `${A}/stories/karnak-sound-light.webp`, wideAt: 1440, alt: "أعمدة الكرنك الكبرى مضاءةٌ بلون الكهرمان في سماءٍ بلون منتصف الليل خلال العرض المسائي." },
    credit: "Ptah Tours field archive",
  },
  {
    title: "الإسكندرية: روح مصر المتوسطية",
    summary: "على بُعد ساعتين من القاهرة وعالمٍ بأكمله — أطايب البحر في سوق السمك، والمكتبة الجديدة، والسراديب، ومشيةٌ على الكورنيش تفسّر كل إسكندرانيٍّ قابلته يومًا.",
    href: "/blog/alexandria-mediterranean-soul",
    image: { src: `${A}/stories/alexandria-mediterranean.webp`, mid: `${A}/stories/alexandria-mediterranean.webp`, wide: `${A}/stories/alexandria-mediterranean.webp`, wideAt: 1440, alt: "كورنيش الإسكندرية ينحني بمحاذاة البحر المتوسط نحو القلعة عند الفجر." },
    credit: "Ptah Tours field archive",
  },
  {
    title: "كيف تمارس السنوركل في البحر الأحمر دون أن تؤذيه",
    summary: "نصائح الطفو من مرشدي الغوص عندنا، ولماذا لا نُطعم الأسماك أبدًا، وقواعد واقي الشمس على متن كل قوارب بتاح، والشعاب الثلاث قرب شرم الشيخ حيث لا تكاد ترى مجموعةً أخرى.",
    href: "/blog/red-sea-reef-etiquette",
    image: { src: `${A}/stories/red-sea-reef.webp`, mid: `${A}/stories/red-sea-reef.webp`, wide: `${A}/stories/red-sea-reef.webp`, wideAt: 1440, alt: "حديقة مرجانٍ بأسماك الأنثياس المندفعة في المياه الضحلة الصافية لشعابٍ ساحلية بالبحر الأحمر." },
    credit: "Ptah Tours field archive",
  },
  {
    title: "في مديح الفلوكة: أيام النيل المتمهّلة",
    summary: "لا محرّك، ولا برنامج أضيق من الريح. لماذا أصيلنا المفضّل في أسوان شراعٌ من قماش، وتُرمُس شاي، وما يقرّر النهر أن يريَك إيّاه.",
    href: "/blog/slow-nile-felucca-days",
    image: { src: `${A}/stories/nile-sailing-aswan.webp`, mid: `${A}/stories/nile-sailing-aswan.webp`, wide: `${A}/stories/nile-sailing-aswan.webp`, wideAt: 1440, alt: "فلوكة تميل برفقٍ تحت شراعها الكامل على النيل قرب أسوان عند الغروب." },
    credit: "Ptah Tours field archive",
  },
  {
    title: "أفضل وقتٍ لزيارة مصر، شهرًا بشهر",
    summary: "لمصر موسمٌ يناسب الجميع — شتاءٌ صافٍ بارد للمعابد، وأشهر كتفٍ هادئة للقيمة، وطريقةٌ ذكية للاستمتاع حتى بحرّ الصيف. وإليك كيف يبدو كل شهرٍ فعلًا، ومتى تذهب ولأي غرض.",
    href: "/blog/best-time-to-visit-egypt",
    image: { src: `${A}/hero/hero-giza.webp`, mid: `${A}/hero/hero-giza.webp`, wide: `${A}/hero/hero-giza.webp`, wideAt: 1440, alt: "أهرامات الجيزة تحت سماء شتاءٍ زرقاء صافية." },
    credit: "Ptah Tours field archive",
  },
  {
    title: "دليل المبتدئ للرحلة النيلية",
    summary: "كيف هي الرحلة النيلية حقًّا — المقصورات، والطعام، والإيقاع اليومي بين المعابد والإبحار، وأيّ اتجاهٍ تسلك، وكيف تختار بين سفينةٍ نهرية كبيرة ودهبيةٍ حميمة.",
    href: "/blog/first-time-nile-cruise",
    image: { src: `${A}/cta/fifty-nile-cruise.webp`, mid: `${A}/cta/fifty-nile-cruise.webp`, wide: `${A}/cta/fifty-nile-cruise.webp`, wideAt: 1440, alt: "سفينة رحلاتٍ نيلية على ماءٍ هادئ بجوار ضفّةٍ خضراء." },
    credit: "Ptah Tours field archive",
  },
  {
    title: "سبعة أيام في مصر: مسارنا الكلاسيكي، مشروحًا",
    summary: "القاهرة والأقصر وأسوان في أسبوعٍ دون شعورٍ بالعجلة — مسارنا الكلاسيكي في سبعة أيام، يومًا بيوم، والمقايضات التي نجريها كي تستقرّ المعالم البارزة ويبقى الإيقاع إنسانيًّا.",
    href: "/blog/seven-days-in-egypt",
    image: { src: `${A}/itineraries/cairo-heritage.webp`, mid: `${A}/itineraries/cairo-heritage.webp`, wide: `${A}/itineraries/cairo-heritage.webp`, wideAt: 1440, alt: "قبابٌ ومآذن القاهرة الإسلامية التاريخية في الساعة الذهبية." },
    credit: "Ptah Tours field archive",
  },
  {
    title: "ماذا تحزم لمصر (وماذا تترك وراءك)",
    summary: "القائمة القصيرة التي تهمّ فعلًا — طبقاتٌ لليالي الصحراء الباردة، وسترٌ من الشمس يحترم المواقع، والحذاء المناسب للمقابر، والأشياء التي يفرط القادمون لأول مرة في حزمها دائمًا. مع ملاحظاتٍ عن الفصول.",
    href: "/blog/what-to-pack-for-egypt",
    image: { src: `${A}/activities/desert-safari.webp`, mid: `${A}/activities/desert-safari.webp`, wide: `${A}/activities/desert-safari.webp`, wideAt: 1440, alt: "مسارٌ صحراوي يمتدّ نحو الكثبان تحت سماءٍ مصرية واسعة." },
    credit: "Ptah Tours field archive",
  },
  {
    title: "أبعد من الجيزة: مواقع مصر القديمة المغمورة",
    summary: "حين ترى الأهرامات، تظلّ مصر ماضيةً — هرم سقارة المدرّج، وسقف دندرة المرسوم، وأبيدوس، وكوم أمبو، والمعابد الهادئة حيث قد تكون الزائر الوحيد.",
    href: "/blog/beyond-giza-underrated-sites",
    image: { src: `${A}/activities/philae-temple.webp`, mid: `${A}/activities/philae-temple.webp`, wide: `${A}/activities/philae-temple.webp`, wideAt: 1440, alt: "أعمدة معبد فيلة ترتفع فوق النيل قرب أسوان." },
    credit: "Ptah Tours field archive",
  },
  {
    title: "مصر مع الأطفال: دليل السفر العائلي",
    summary: "مصر رحلةٌ رائعة مع الأطفال — مومياوات وجِمال وقوارب تُبقيهم مشدودين. دليلنا للإيقاع والأعمار والطعام والحرّ والرحلات الأنسب للعائلات.",
    href: "/blog/egypt-with-kids-family-guide",
    image: { src: `${A}/activities/nubian-culture.webp`, mid: `${A}/activities/nubian-culture.webp`, wide: `${A}/activities/nubian-culture.webp`, wideAt: 1440, alt: "زقاقٌ في قريةٍ نوبية زاهية الألوان فوق النيل بأسوان." },
    credit: "Ptah Tours field archive",
  },
];

export const siteNavAr: SiteNav = {
  quickLinks: [
    { label: "الفعاليات والمهرجانات", href: "/events", iconKey: "calendar" },
    { label: "متى تزور", href: "/when-to-visit", iconKey: "weather" },
    { label: "احجز تأشيرتك الإلكترونية", href: "/visa", iconKey: "ticket" },
    { label: "حسابي", href: "/account", iconKey: "user" },
  ],
  directLinks: [
    { label: "الوجهات", href: "/cities" },
    { label: "أفكار للرحلات", href: "/trip-ideas" },
    { label: "معرض الصور", href: "/gallery" },
  ],
  buildTripCta: { label: "خطّط رحلتي", href: "/manage/trip-builder" },
  bookmarksHref: "/manage/trip-builder?tab=bookmarks",
  searchHref: "/search",
  popularSearches: [
    "أهرامات الجيزة",
    "رحلة نيلية",
    "منطاد الأقصر",
    "سنوركل رأس محمد",
    "جولة خاصة في القاهرة",
    "الكريسماس في مصر",
  ],
  sections: [
    {
      key: "about",
      title: "عن مصر",
      columns: [
        {
          heading: "الوجهات",
          links: [
            { label: "القاهرة", href: "/cities/cairo" },
            { label: "الأقصر", href: "/cities/luxor" },
            { label: "أسوان", href: "/cities/aswan" },
            { label: "الإسكندرية", href: "/cities/alexandria" },
            { label: "الغردقة", href: "/cities/hurghada" },
            { label: "شرم الشيخ", href: "/cities/sharm-el-sheikh" },
          ],
        },
        {
          heading: "اعرف البلد",
          links: [
            { label: "التاريخ والتراث", href: "/heritage" },
            { label: "الفصول والمناخ", href: "/when-to-visit" },
            { label: "النيل", href: "/the-nile" },
            { label: "الصحارى والواحات", href: "/deserts" },
            { label: "شعاب البحر الأحمر", href: "/red-sea" },
          ],
        },
        {
          heading: "معلوماتٌ مفيدة",
          links: [
            { label: "السفر المسؤول", href: "/responsible-travel" },
            { label: "إمكانية الوصول", href: "/accessibility" },
            { label: "الأمان والدعم", href: "/contact" },
            { label: "القصص والمدوّنة", href: "/blog" },
          ],
        },
      ],
      imageCtas: [
        { label: "تعمّق في الوجهة", heading: "طيبة القديمة", href: "/cities/luxor", image: { src: `${A}/hero/hero-thebes-portrait.webp`, alt: "منطادٌ فوق معابد الضفّة الغربية للأقصر عند الفجر." } },
        { label: "السواحل", heading: "تعرّف إلى البحر الأحمر", href: "/cities/sharm-el-sheikh", image: { src: `${A}/hero/hero-blue-hole-portrait.webp`, alt: "غطّاسٌ بالسنوركل ينساب فوق المرجان عند حافّة شعاب الثقب الأزرق." } },
        { label: "من الميدان", heading: "اقرأ المدوّنة", href: "/blog", image: { src: `${A}/stories/nile-sailing-aswan.webp`, alt: "فلوكة مبحرةٌ على النيل قرب أسوان." } },
      ],
    },
    {
      key: "plan",
      title: "خطّط لرحلتك",
      columns: [
        {
          heading: "الوصول إلى هناك",
          links: [
            { label: "الطيران إلى مصر", href: "/getting-here" },
            { label: "التأشيرات والدخول", href: "/visa" },
            { label: "أيام الوصول، مُدبَّرة", href: "/getting-here#arrivals" },
            { label: "التنقّل", href: "/getting-around" },
          ],
        },
        {
          heading: "اتّخاذ القرار",
          links: [
            { label: "متى تزور", href: "/when-to-visit" },
            { label: "كم يومًا", href: "/how-many-days" },
            { label: "الميزانية والبقشيش", href: "/travel-tips" },
            { label: "السفر مع الأطفال", href: "/family-travel" },
          ],
        },
        {
          heading: "وعدنا",
          links: [
            { label: "كيف تعمل رحلات بتاح", href: "/how-it-works" },
            { label: "السفر المسؤول", href: "/responsible-travel" },
            { label: "التقييمات والاعتمادات", href: "/reviews" },
            { label: "تواصل مع الفريق", href: "/contact" },
          ],
        },
      ],
      imageCtas: [
        { label: "استشارة مجانية", heading: "تحدّث إلى عالم مصريات", href: "/contact", image: { src: `${A}/activities/philae-felucca.webp`, alt: "فلوكة تبحر نحو معبد فيلة على ماء النيل الهادئ." } },
        { label: "تصفّح", heading: "كل رحلات بتاح", href: "/tours", image: { src: `${A}/activities/valley-heritage.webp`, alt: "جدران مقابر مرسومة داخل وادي الملوك." } },
        { label: "إلهام", heading: "احصل على أفكار للرحلات", href: "/trip-ideas", image: { src: `${A}/cta/plan-nile-portrait.webp`, alt: "فلوكة على النيل في أسوان بين صخور الغرانيت." } },
      ],
    },
    {
      key: "tours",
      title: "الرحلات",
      columns: [
        {
          heading: "حسب النمط",
          links: [
            { label: "مصر الكلاسيكية", href: "/tours?type=classic" },
            { label: "رحلات النيل النهرية", href: "/tours?type=nile-cruise" },
            { label: "البحر الأحمر والشاطئ", href: "/tours?type=red-sea" },
            { label: "مغامرات الصحراء", href: "/tours?type=desert" },
          ],
        },
        {
          heading: "حسب المدّة",
          links: [
            { label: "جولات يومية", href: "/tours?length=day" },
            { label: "رحلات 2–4 أيام", href: "/tours?length=short" },
            { label: "رحلات 5–9 أيام", href: "/tours?length=week" },
            { label: "رحلات 10 أيام فأكثر", href: "/tours?length=grand" },
          ],
        },
        {
          heading: "خاصة",
          links: [
            { label: "خاصة ومفصَّلة على المقاس", href: "/tours?type=private" },
            { label: "رحلات عائلية", href: "/tours?type=family" },
            { label: "شهر العسل", href: "/tours?type=honeymoon" },
            { label: "رحلات اللحظة الأخيرة", href: "/tours?filter=departing-soon" },
          ],
        },
      ],
      imageCtas: [
        { label: "رحلة مميّزة", heading: "مصر الكلاسيكية، 8 أيام", href: "/tours?type=classic", image: { src: `${A}/itineraries/giza-essentials.webp`, alt: "الهرم الأكبر بالجيزة وقائد جملٍ في المقدّمة." } },
        { label: "على النهر", heading: "مجموعة رحلات النيل", href: "/tours?type=nile-cruise", image: { src: `${A}/tour-types/nile-cruise.webp`, alt: "مناطيد ترتفع فوق وادي النيل قرب الأقصر مع أول ضوء." } },
        { label: "تحت الماء", heading: "رحلات الغوص والسنوركل", href: "/tours?type=red-sea", image: { src: `${A}/activities/blue-hole-dive.webp`, alt: "غطّاسٌ بالسنوركل فوق حافّة الشعاب في الثقب الأزرق بدهب." } },
      ],
    },
    {
      key: "journal",
      title: "المدوّنة",
      columns: [
        {
          heading: "ابدأ من هنا",
          links: [
            { label: "أفضل وقتٍ للزيارة", href: "/blog/best-time-to-visit-egypt" },
            { label: "أول رحلة نيلية", href: "/blog/first-time-nile-cruise" },
            { label: "مسار 7 أيام", href: "/blog/seven-days-in-egypt" },
            { label: "ماذا تحزم", href: "/blog/what-to-pack-for-egypt" },
          ],
        },
        {
          heading: "أماكن وقصص",
          links: [
            { label: "القاهرة أبعد من الدليل السياحي", href: "/blog/cairo-beyond-the-guidebook" },
            { label: "روح الإسكندرية", href: "/blog/alexandria-mediterranean-soul" },
            { label: "أبعد من الجيزة", href: "/blog/beyond-giza-underrated-sites" },
            { label: "أمسية في الكرنك", href: "/blog/karnak-sound-and-light" },
          ],
        },
        {
          heading: "سافر بذكاء",
          links: [
            { label: "مصر مع الأطفال", href: "/blog/egypt-with-kids-family-guide" },
            { label: "آداب شعاب البحر الأحمر", href: "/blog/red-sea-reef-etiquette" },
            { label: "أيام النيل المتمهّلة بالفلوكة", href: "/blog/slow-nile-felucca-days" },
            { label: "كل مقالات المدوّنة", href: "/blog" },
          ],
        },
      ],
      imageCtas: [
        { label: "تخطيط الرحلة", heading: "متى تزور مصر", href: "/blog/best-time-to-visit-egypt", image: { src: `${A}/hero/hero-giza-portrait.webp`, alt: "أهرامات الجيزة تحت سماء شتاءٍ صافية." } },
        { label: "على النهر", heading: "أول رحلة نيلية", href: "/blog/first-time-nile-cruise", image: { src: `${A}/cta/fifty-nile-cruise.webp`, alt: "سفينة رحلاتٍ نيلية راسيةٌ بجوار ضفّةٍ خضراء." } },
        { label: "مع العائلة", heading: "مصر مع الأطفال", href: "/blog/egypt-with-kids-family-guide", image: { src: `${A}/activities/nubian-culture.webp`, alt: "زقاقٌ في قريةٍ نوبية زاهية الألوان فوق النيل بأسوان." } },
      ],
    },
  ],
};

export const footerContentAr: FooterContent = {
  newsletter: {
    heading: "اشترك!",
    blurb:
      "أفكار رحلات، ورحلاتٌ موسمية، ورسالةٌ صحراوية من حينٍ لآخر — بضع مرّاتٍ في الشهر، دون إزعاج أبدًا.",
    cta: { label: "اشترك في نشرتنا الإلكترونية", href: "/newsletter" },
  },
  badgeHeading: "بإشادةٍ من",
  badges: [
    { heading: "ETF", sub: "عضو 2026", href: "/about#accreditation" },
    { heading: "Travelife", sub: "شريك", href: "/responsible-travel" },
  ],
  partnersHeading: "شركاء السفر",
  partners: [
    { name: "Egypt Air", tagline: "شريك الطيران الرسمي", href: "https://www.egyptair.com" },
    { name: "IATA", tagline: "وكيل معتمَد", href: "https://www.iata.org" },
    { name: "Visit Egypt", tagline: "هيئة تنشيط السياحة المصرية", href: "https://www.experienceegypt.eg" },
  ],
  socials: [
    { network: "Facebook", href: "https://www.facebook.com/ptahtours", iconKey: "facebook" },
    { network: "Instagram", href: "https://www.instagram.com/ptahtours", iconKey: "instagram" },
    { network: "Threads", href: "https://www.threads.net/@ptahtours", iconKey: "threads" },
    { network: "YouTube", href: "https://www.youtube.com/@ptahtours", iconKey: "youtube" },
    { network: "Pinterest", href: "https://www.pinterest.com/ptahtours", iconKey: "pinterest" },
    { network: "X", href: "https://x.com/ptahtours", iconKey: "x" },
    { network: "Email", href: "mailto:hello@ptahtours.com", iconKey: "mail" },
  ],
  columns: [
    {
      heading: "بتاح تورز",
      links: [
        { label: "من نحن", href: "/about" },
        { label: "علماء المصريات لدينا", href: "/about#team" },
        { label: "وظائف", href: "/careers" },
        { label: "الصحافة والإعلام", href: "/press" },
        { label: "اتّصل بنا", href: "/contact" },
      ],
    },
    {
      heading: "سافر معنا",
      links: [
        { label: "كل الرحلات", href: "/tours" },
        { label: "أفكار للرحلات", href: "/trip-ideas" },
        { label: "رحلات النيل النهرية", href: "/tours?type=nile-cruise" },
        { label: "رحلات خاصة", href: "/tours?type=private" },
        { label: "السفر المسؤول", href: "/responsible-travel" },
        { label: "معرض الصور", href: "/gallery" },
      ],
    },
    {
      heading: "المساعدة والمعلومات",
      links: [
        { label: "متى تزور", href: "/when-to-visit" },
        { label: "التأشيرات والدخول", href: "/visa" },
        { label: "تتبّع حجزي", href: "/track-booking" },
        { label: "الصحة والسلامة", href: "/travel-tips" },
        { label: "الأسئلة الشائعة", href: "/faqs" },
      ],
    },
  ],
  legalLinks: [
    { label: "سياسة الخصوصية", href: "/privacy-policy" },
    { label: "الشروط والأحكام", href: "/terms-of-service" },
    { label: "سياسة ملفات تعريف الارتباط", href: "/cookie-policy" },
  ],
  copyrightLine: "© {year} بتاح تورز. جميع الحقوق محفوظة.",
  acknowledgement:
    "يقع مقرّ بتاح تورز في القاهرة، وتعمل في أنحاء مصر — وادي النيل والدلتا وسيناء والصحراء الغربية. نسافر برفقة علماء مصريات مرخَّصين، وندفع لأطقمنا أجورًا عادلة، ونخطّط كل مسارٍ ليمنح مجتمعات مصر ومواقع تراثها أكثر ممّا يأخذ.",
  cookie: {
    heading: "نحترم خصوصيتك",
    copy: "نستخدم ملفات تعريف الارتباط لتحسين تجربة تصفّحك، وتقديم محتوًى مخصَّص، وتحليل زياراتنا. وبالنقر على قبول الكل، توافق على استخدامنا لملفات تعريف الارتباط. ويمكنك تغيير رأيك في أي وقتٍ من تذييل الصفحة.",
    manageHeading: "إدارة تفضيلات ملفات تعريف الارتباط",
    categories: [
      {
        key: "preferences",
        name: "التفضيلات",
        description: "تذكّر خيارات مثل اللغة والعملة ورحلاتك المحفوظة.",
      },
      {
        key: "analytics",
        name: "التحليلات",
        description: "إحصاءاتٌ مجهولة الهوية تساعدنا على فهم أي الرحلات والصفحات يحبّها المسافرون.",
      },
      {
        key: "marketing",
        name: "التسويق",
        description: "قياس حملاتنا وعرض محتوى بتاح تورز الأكثر صلةً في أماكن أخرى.",
      },
    ],
  },
};

export const landingContentAr = {
  hero: heroSlidesAr,
  inspiredTabs: inspiredTabsAr,
  planCta: planCtaAr,
  fiftyCtas: fiftyCtasAr,
  kbygItems: kbygItemsAr,
  tourTypes: tourTypesAr,
  stories: storiesAr,
} as const;
