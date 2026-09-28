import type { Dictionary } from "./en";

/**
 * Arabic (Modern Standard Arabic) chrome dictionary — renders right-to-left (RTL).
 * Machine-translated UI-chrome strings that mirror en.ts by index: every key,
 * nested object and array length matches en.ts exactly; only the values change.
 */
export const ar = {
  common: {
    /** Appended to the brand mark aria-label: `${siteName} — home`. */
    home: "الرئيسية",
    openInNewTab: "يفتح في علامة تبويب جديدة",
  },
  skip: {
    toContent: "تخطَّ إلى المحتوى الرئيسي",
  },
  header: {
    quickLinksAria: "روابط سريعة",
    primaryAria: "التنقل الرئيسي",
    mobileNavAria: "الموقع (الجوال)",
    openMenu: "افتح القائمة",
    closeMenu: "أغلق القائمة",
    trackBooking: "تتبّع حجزك",
    viewBookmarks: "اعرض إشاراتك المرجعية",
  },
  search: {
    triggerAria: "بحث",
    dialogAria: "ابحث في Ptah Tours",
    closeAria: "أغلق البحث",
    inputAria: "ابحث في الرحلات والوجهات والقصص",
    placeholder: "الأهرامات، رحلة نيلية، الإسكندرية…",
    popular: "عمليات البحث الشائعة",
  },
  bookmarks: {
    title: "اعرض إشاراتك المرجعية",
    /** Exactly one bookmark. */
    one: "لديك إشارة مرجعية واحدة",
    /** Zero or many — `{count}` is replaced with the number. */
    other: "لديك {count} إشارة مرجعية",
  },
  nav: {
    /** Quick-links bar, in order: Events, When to Visit, eVisa, My Account. */
    quickLinks: ["الفعاليات والمهرجانات", "أفضل وقت للزيارة", "احجز تأشيرتك الإلكترونية", "حسابي"],
    /** Direct nav links, in order: Destinations, Trip Ideas. */
    directLinks: ["الوجهات", "أفكار للرحلات", "معرض الصور"],
    buildTrip: "خطّط لرحلتي",
    popularSearches: [
      "أهرامات الجيزة",
      "رحلة نيلية",
      "منطاد الأقصر",
      "الغطس في رأس محمد",
      "جولة خاصة في القاهرة",
      "الكريسماس في مصر",
    ],
    /** Mega-menu sections, in order: About Egypt, Plan Your Trip, Tours. */
    sections: [
      {
        title: "عن مصر",
        columns: [
          { heading: "الوجهات", links: ["القاهرة", "الأقصر", "أسوان", "الإسكندرية", "الغردقة", "شرم الشيخ"] },
          { heading: "اعرف البلد", links: ["التاريخ والتراث", "الفصول والمناخ", "النيل", "الصحاري والواحات", "شعاب البحر الأحمر"] },
          { heading: "معلومات مفيدة", links: ["السياحة المسؤولة", "سهولة الوصول", "الأمان والدعم", "القصص والمدونة"] },
        ],
        imageCtas: [
          { label: "استكشاف الوجهة عن قرب", heading: "طيبة القديمة" },
          { label: "السواحل", heading: "تعرّف على البحر الأحمر" },
          { label: "من الميدان", heading: "اقرأ المدونة" },
        ],
      },
      {
        title: "خطّط لرحلتك",
        columns: [
          { heading: "الوصول إلى هناك", links: ["رحلات الطيران إلى مصر", "التأشيرات والدخول", "أيام الوصول، نتكفّل بها", "التنقل"] },
          { heading: "اتخاذ القرار", links: ["أفضل وقت للزيارة", "كم عدد الأيام", "الميزانية والإكراميات", "السفر مع الأطفال"] },
          { heading: "وعدنا", links: ["كيف تعمل رحلات Ptah", "السياحة المسؤولة", "المراجعات والاعتمادات", "تواصل مع الفريق"] },
        ],
        imageCtas: [
          { label: "استشارة مجانية", heading: "تحدّث مع خبير في علم المصريات" },
          { label: "تصفّح", heading: "كل جولات Ptah Tours" },
          { label: "إلهام", heading: "احصل على أفكار للرحلات" },
        ],
      },
      {
        title: "الجولات",
        columns: [
          { heading: "حسب النمط", links: ["مصر الكلاسيكية", "رحلات النيل", "البحر الأحمر والشواطئ", "مغامرات الصحراء"] },
          { heading: "حسب المدة", links: ["جولات يومية", "رحلات من 2–4 أيام", "رحلات من 5–9 أيام", "رحلات استكشافية 10 أيام فأكثر"] },
          { heading: "خاص", links: ["خاصة ومُصمّمة حسب الطلب", "رحلات عائلية", "شهر العسل", "رحلات اللحظة الأخيرة"] },
        ],
        imageCtas: [
          { label: "الرحلة المميّزة", heading: "مصر الكلاسيكية، 8 أيام" },
          { label: "على النهر", heading: "مجموعة الرحلات النيلية" },
          { label: "تحت الماء", heading: "رحلات الغوص والغطس" },
        ],
      },
      {
        title: "المدوّنة",
        columns: [
          { heading: "ابدأ من هنا", links: ["أفضل وقت للزيارة", "أول رحلة نيلية", "برنامج 7 أيام", "ماذا تحزم"] },
          { heading: "أماكن وقصص", links: ["القاهرة خارج الدليل", "روح الإسكندرية", "ما وراء الجيزة", "أمسية في الكرنك"] },
          { heading: "سافر بذكاء", links: ["مصر مع الأطفال", "آداب الشعاب المرجانية", "أيام الفلوكة على النيل", "كل مقالات المدوّنة"] },
        ],
        imageCtas: [
          { label: "تخطيط الرحلة", heading: "متى تزور مصر" },
          { label: "على النهر", heading: "أول رحلة نيلية" },
          { label: "مع العائلة", heading: "مصر مع الأطفال" },
        ],
      },
    ],
  },
  footer: {
    newsletterAria: "ابقَ على تواصل",
    columnsAria: "تذييل الصفحة",
    /** Social row aria — `{siteName}` is replaced with the site name. */
    followAria: "تابِع {siteName}",
    newsletter: {
      heading: "اشترك الآن!",
      blurb: "أفكار للرحلات، ومواعيد المغادرة الموسمية، ورسالة من الصحراء بين الحين والآخر — بضع مرات في الشهر، ودون أي إزعاج.",
      ctaLabel: "اشترك في نشرتنا الإخبارية الإلكترونية",
    },
    /** Footer link columns, in order: (brand), Travel With Us, Help & Info. */
    columns: [
      { heading: "Ptah Tours", links: ["من نحن", "خبراء علم المصريات لدينا", "الوظائف", "الصحافة والإعلام", "اتصل بنا"] },
      { heading: "سافِر معنا", links: ["كل الجولات", "أفكار للرحلات", "رحلات النيل", "رحلات خاصة", "السياحة المسؤولة", "معرض الصور"] },
      { heading: "المساعدة والمعلومات", links: ["أفضل وقت للزيارة", "التأشيرات والدخول", "تتبّع حجزي", "الصحة والسلامة", "الأسئلة الشائعة"] },
    ],
    badgeHeading: "معتمَد من",
    /** Badge sub-labels, in order: ETF, Travelife (badge names stay as-is). */
    badgeSubs: ["عضو 2026", "شريك"],
    partnersHeading: "شركاء السفر",
    /** Partner taglines, in order: Egypt Air, IATA, Visit Egypt (names stay). */
    partnerTaglines: ["شريك الطيران الرسمي", "وكيل معتمَد", "هيئة تنشيط السياحة المصرية"],
    /** Legal links, in order: Privacy, Terms, Cookie Policy. */
    legalLinks: ["سياسة الخصوصية", "الشروط والأحكام", "سياسة ملفات تعريف الارتباط"],
    /** Keep `{year}` and the brand "Ptah Tours" verbatim. */
    copyrightLine: "© {year} Ptah Tours. جميع الحقوق محفوظة.",
    acknowledgement:
      "يقع المقر الرئيسي لـ Ptah Tours في القاهرة، ونعمل في جميع أنحاء مصر — وادي النيل والدلتا وسيناء والصحراء الغربية. نسافر برفقة خبراء معتمَدين في علم المصريات، وندفع لطواقمنا أجورًا عادلة، ونخطّط كل برنامج رحلة بحيث يمنح مجتمعات مصر ومواقعها التراثية أكثر مما يأخذ منها.",
  },
  cookie: {
    regionAria: "الموافقة على ملفات تعريف الارتباط",
    heading: "نحن نقدّر خصوصيتك",
    copy: "نستخدم ملفات تعريف الارتباط لتحسين تجربة تصفّحك، وتقديم محتوى مخصّص، وتحليل حركة الزيارات. بالنقر على «قبول الكل»، فإنك توافق على استخدامنا لملفات تعريف الارتباط. ويمكنك تغيير رأيك في أي وقت من تذييل الصفحة.",
    manageHeading: "إدارة تفضيلات ملفات تعريف الارتباط",
    acceptAll: "قبول الكل",
    manage: "إدارة",
    rejectAll: "رفض الكل",
    saveChoices: "حفظ اختياراتي",
    necessaryName: "ضرورية للغاية",
    necessaryDesc: "مطلوبة للأمان وتخزين الموافقة وعمليات الحجز الأساسية. مُفعّلة دائمًا.",
    /** Categories, in order: preferences, analytics, marketing. */
    categories: [
      { name: "التفضيلات", description: "تتذكّر خياراتك مثل اللغة والعملة ورحلاتك المحفوظة في الإشارات المرجعية." },
      { name: "التحليلات", description: "إحصاءات مجهولة الهوية تساعدنا على معرفة الرحلات والصفحات التي يحبّها المسافرون." },
      { name: "التسويق", description: "قياس أداء حملاتنا وعرض محتوى أكثر صلة من Ptah Tours في أماكن أخرى." },
    ],
    /** Footer trigger: long prefix ("Manage Your ") hidden on narrow screens. */
    manageButtonLong: "إدارة ",
    manageButtonShort: "ملفات تعريف الارتباط",
  },
} satisfies Dictionary;
