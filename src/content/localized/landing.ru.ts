/**
 * Russian landing-page content (Phase 3 i18n, module G) — mirror of
 * src/content/landing.ts. Ru-suffixed exports; every key, nesting level and
 * array order matches the English source 1:1. Only human-visible prose is
 * translated. Structural fields (src/href/id/key/iconKey/network/
 * trackingContext/numeric values/target enums), photo credits ("Ptah Tours
 * field archive") and the {year} token are preserved verbatim. Brand →
 * «Птах Турс» in prose; Latin "Ptah Tours" kept in siteMeta and the
 * copyright line.
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

export const siteMetaRu = {
  name: "Ptah Tours",
  legalName: "Ptah Tours for Tourism LLC",
  tagline: "Египет глазами тех, кто зовёт его домом",
};

export const heroSlidesRu: HeroSlide[] = [
  {
    id: "giza",
    season: "summer",
    title: "Пройдитесь среди последнего чуда Древнего мира",
    shortLabel: "пирамиды Гизы",
    subtitle: "Частные утренние визиты в Гизу с египтологом — до прихода толп.",
    image: {
      src: `${A}/hero/hero-giza-portrait.webp`,
      mid: `${A}/hero/hero-giza.webp`,
      alt: "Пирамида Хеопса и Большой сфинкс в Гизе в тёплом утреннем свете, за ними — каирское плато.",
      credit: "Ptah Tours field archive",
    },
    hotspots: [
      { xPct: 30, yPct: 44, label: "Пирамида Хеопса", href: "/trip-ideas/panorama-of-the-pyramids" },
      { xPct: 62, yPct: 70, label: "Большой сфинкс", href: "/trip-ideas/panorama-of-the-pyramids" },
    ],
  },
  {
    id: "thebes",
    season: "summer",
    title: "Проплывите над гробницами Фив на рассвете",
    shortLabel: "полёт на шаре над Луксором",
    subtitle: "Воздушные шары на рассвете, Долина царей и Карнак до наступления жары.",
    image: {
      src: `${A}/hero/hero-thebes-portrait.webp`,
      mid: `${A}/hero/hero-thebes.webp`,
      alt: "Воздушный шар плывёт над западным берегом Луксора на рассвете, внизу — зелёная нильская пойма.",
      credit: "Ptah Tours field archive",
    },
    hotspots: [
      { xPct: 26, yPct: 38, label: "Воздушные шары на рассвете", href: "/trip-ideas/luxor-sunrise-weekend" },
      { xPct: 68, yPct: 62, label: "Долина царей", href: "/trip-ideas/kings-and-queens-of-thebes" },
    ],
  },
  {
    id: "blue-hole",
    season: "summer",
    title: "Погрузитесь в синеву: живой риф Синая",
    shortLabel: "побережье Голубой дыры",
    subtitle: "Снорклинг в Голубой дыре, Рас-Абу-Галуме и Рас-Мохаммеде с лицензированными дайв-гидами.",
    image: {
      src: `${A}/hero/hero-blue-hole-portrait.webp`,
      mid: `${A}/hero/hero-blue-hole.webp`,
      alt: "Тёмно-синий круг дахабской Голубой дыры сверху, окаймлённый светлым рифовым шельфом и горами Синая.",
      credit: "Ptah Tours field archive",
    },
    hotspots: [
      { xPct: 40, yPct: 46, label: "Провал Голубой дыры", href: "/trip-ideas/blue-hole-sinai" },
      { xPct: 66, yPct: 30, label: "Побережье Рас-Абу-Галума", href: "/trip-ideas/blue-hole-sinai" },
    ],
  },
];

export const inspiredTabsRu: InspiredTab[] = [
  {
    key: "itineraries",
    label: "Маршруты",
    cards: [
      {
        title: "Панорама пирамид",
        href: "/trip-ideas/panorama-of-the-pyramids",
        days: 2,
        experiences: 6,
        image: { src: `${A}/itineraries/giza-essentials.webp`, alt: "Верблюд проходит перед пирамидой Хеопса на плато Гиза." },
      },
      {
        title: "Каир: выходные среди наследия",
        href: "/trip-ideas/cairo-heritage-weekend",
        days: 3,
        experiences: 9,
        image: { src: `${A}/itineraries/cairo-heritage.webp`, alt: "Витрины и золочёные артефакты в Египетском музее в Каире." },
      },
      {
        title: "Карнак днём, Луксорский храм ночью",
        href: "/trip-ideas/karnak-luxor-evening",
        days: 2,
        experiences: 7,
        image: { src: `${A}/itineraries/karnak-evening.webp`, alt: "Подсвеченные колонны Луксорского храма в сумерках, янтарные на фоне глубокого синего неба." },
      },
      {
        title: "Цари и царицы Фив",
        href: "/trip-ideas/kings-and-queens-of-thebes",
        days: 3,
        experiences: 8,
        image: { src: `${A}/itineraries/valley-of-kings.webp`, alt: "Золотистые скалы спускаются к гробницам Долины царей." },
      },
      {
        title: "Остров Филе и Высотная плотина",
        href: "/trip-ideas/philae-island-aswan",
        days: 2,
        experiences: 5,
        image: { src: `${A}/itineraries/philae-island.webp`, alt: "К островному храму Филе подплывают на лодке по спокойной синей воде." },
      },
      {
        title: "Нубийская деревня под парусом фелуки",
        href: "/trip-ideas/nubian-village-aswan",
        days: 2,
        experiences: 6,
        image: { src: `${A}/itineraries/nubian-village.webp`, alt: "Расписной дом в нубийской деревне, яркая охра и синь над Нилом." },
      },
      {
        title: "Александрия за выходные",
        href: "/trip-ideas/alexandria-weekend",
        days: 2,
        experiences: 7,
        image: { src: `${A}/itineraries/alexandria-classics.webp`, alt: "Изогнутая крыша современной Александрийской библиотеки, обращённая к Средиземному морю." },
      },
      {
        title: "Вершина Синая и монастырь Святой Екатерины",
        href: "/trip-ideas/sinai-summit-st-catherines",
        days: 2,
        experiences: 4,
        image: { src: `${A}/itineraries/sinai-summit.webp`, alt: "Путники на верблюжьей тропе к вершине горы Синай под предрассветным небом." },
      },
    ],
  },
  {
    key: "adventure",
    label: "Приключения",
    cards: [
      {
        title: "Снорклинг в Голубой дыре",
        href: "/trip-ideas/blue-hole-sinai",
        image: { src: `${A}/activities/blue-hole-dive.webp`, alt: "Сноркелер парит над коралловым шельфом у края Голубой дыры." },
      },
      {
        title: "Поход по Цветному каньону",
        href: "/trip-ideas/colored-canyon-sinai",
        image: { src: `${A}/activities/colored-canyon.webp`, alt: "Полосы красного, золотого и кремового камня вьются по теснине Цветного каньона." },
      },
      {
        title: "Квадросафари на закате",
        href: "/trip-ideas/desert-safari-quad-sunset",
        image: { src: `${A}/activities/desert-safari.webp`, alt: "Квадроциклы поднимают шлейфы пыли на оранжевой пустынной равнине на закате." },
      },
      {
        title: "День на катере в Красном море",
        href: "/trip-ideas/red-sea-boat-snorkeling",
        image: { src: `${A}/activities/boat-snorkeling.webp`, alt: "Белый дайв-бот на якоре над бирюзовой водой рифа в Красном море." },
      },
    ],
  },
  {
    key: "culture",
    label: "Культура",
    cards: [
      {
        title: "Египетский музей с гидом",
        href: "/trip-ideas/egyptian-museum-guided",
        image: { src: `${A}/activities/museum-tahrir.webp`, alt: "Резные каменные статуи и саркофаги в залах Египетского музея." },
      },
      {
        title: "Хан-эль-Халили после заката",
        href: "/trip-ideas/khan-el-khalili-night",
        image: { src: `${A}/activities/khan-el-khalili.webp`, alt: "Лавки с фонарями светятся на базаре Хан-эль-Халили ночью." },
      },
      {
        title: "Чай в нубийской семье",
        href: "/trip-ideas/nubian-village-aswan",
        image: { src: `${A}/activities/nubian-culture.webp`, alt: "Расписной нубийский дворик, семья собралась за чаем." },
      },
      {
        title: "Александрийская библиотека и крепость Кайт-Бей",
        href: "/trip-ideas/alexandria-weekend",
        image: { src: `${A}/activities/bibliotheca.webp`, alt: "Наклонный гранитный фасад Александрийской библиотеки ловит солнце." },
      },
    ],
  },
  {
    key: "river-sea",
    label: "Река и море",
    cards: [
      {
        title: "На фелуке вокруг Филе",
        href: "/trip-ideas/philae-island-aswan",
        image: { src: `${A}/activities/philae-felucca.webp`, alt: "Фелука под белым парусом скользит к храму Филе по Нилу." },
      },
      {
        title: "День на катере в Рас-Мохаммеде",
        href: "/trip-ideas/ras-mohammed-park",
        image: { src: `${A}/activities/ras-mohammed.webp`, alt: "Прозрачное бирюзовое мелководье и риф видны с катера в Рас-Мохаммеде." },
      },
      {
        title: "Фелука на закате, Луксор",
        href: "/trip-ideas/luxor-sunrise-weekend",
        image: { src: `${A}/activities/nile-sunset-felucca.webp`, alt: "Парус фелуки ловит последний оранжевый свет над Нилом в Луксоре." },
      },
      {
        title: "Снорклинг у домашних рифов",
        href: "/trip-ideas/red-sea-boat-snorkeling",
        image: { src: `${A}/activities/red-sea-boat.webp`, alt: "Сноркелеры парят над коралловыми садами вдоль побережья Красного моря." },
      },
    ],
  },
  {
    key: "heritage",
    label: "Наследие",
    cards: [
      {
        title: "Большой гипостильный зал",
        href: "/trip-ideas/karnak-luxor-evening",
        image: { src: `${A}/activities/karnak-hypostyle.webp`, alt: "Массивные колонны в форме бутонов папируса теснятся в гипостильном зале Карнака." },
      },
      {
        title: "В Долине царей",
        href: "/trip-ideas/kings-and-queens-of-thebes",
        image: { src: `${A}/activities/valley-heritage.webp`, alt: "Расписные стены коридора гробницы светятся под музейным освещением в Долине царей." },
      },
      {
        title: "Филе: храм Исиды",
        href: "/trip-ideas/philae-island-aswan",
        image: { src: `${A}/activities/philae-temple.webp`, alt: "Резные врата храма Филе, посвящённого богине Исиде." },
      },
      {
        title: "Стражи Гизы",
        href: "/trip-ideas/panorama-of-the-pyramids",
        image: { src: `${A}/activities/sphinx-guardians.webp`, alt: "Большой сфинкс смотрит мимо камеры, за ним — пирамида Хефрена." },
      },
    ],
  },
];

export const planCtaRu: PlanCtaBlock = {
  title: "Спланируйте путешествие мечты",
  copy: "Расскажите нашей студии в Каире, о чём мечтаете, — пирамиды на рассвете, неспешный участок Нила между храмами, неделя на рифе, — и личный дизайнер путешествий выстроит маршрут вместе с вами, сообщение за сообщением.",
  image: {
    src: `${A}/cta/plan-nile-portrait.webp`,
    mid: `${A}/cta/plan-karnak-landscape.webp`,
    wide: `${A}/cta/plan-karnak-landscape.webp`,
    wideAt: 1440,
    alt: "Фелука проходит мимо пальм по Нилу в Асуане, гранитные валуны отмечают Первый порог.",
  },
  credit: "Ptah Tours field archive — Aswan",
  cta: {
    type: "customButton",
    button: { buttonType: "buildATrip", trackingContext: "HomePageFullPageCTA", href: "/manage/trip-builder" },
    label: "Начать планирование",
  },
};

export const fiftyCtasRu: [FiftyCta, FiftyCta] = [
  {
    title: "Всё под вас",
    copy: "Каждое путешествие с «Птах Турс» — индивидуальное и создаётся под вас: ваш гид, ваш темп, ваш маршрут. Ничего шаблонного.",
    cta: { label: "Составить моё путешествие", href: "/contact" },
    image: {
      src: `${A}/cta/fifty-bespoke-journeys.webp`,
      mid: `${A}/cta/fifty-bespoke-journeys.webp`,
      wide: `${A}/cta/fifty-bespoke-journeys.webp`,
      wideAt: 1128,
      alt: "Взгляд вверх сквозь колонны Луксорского храма к яркому небу.",
    },
  },
  {
    title: "Пройдите по Нилу с комфортом",
    copy: "Круизы на четыре–семь ночей между Луксором и Асуаном, каюты для которых мы проверили лично.",
    cta: { label: "Открыть Нил", href: "/the-nile" },
    image: {
      src: `${A}/cta/fifty-nile-cruise.webp`,
      mid: `${A}/cta/fifty-nile-cruise.webp`,
      wide: `${A}/cta/fifty-nile-cruise.webp`,
      wideAt: 1128,
      alt: "Круизный теплоход по Нилу пришвартован у западного берега близ Асуана в золотой час.",
    },
  },
];

export const kbygItemsRu: [KbygItem, KbygItem, KbygItem, KbygItem] = [
  {
    iconKey: "weather",
    title: "Когда приезжать",
    copy: "С октября по апрель — сезон храмов; Красное море хорошо круглый год. Мы подберём маршрут под ваши даты.",
    cta: { label: "Посмотреть сезоны", href: "/when-to-visit" },
  },
  {
    iconKey: "ticket",
    title: "Въезд и визы",
    copy: "Гражданам большинства стран электронную визу можно оформить онлайн за считаные минуты. Каждому гостю мы отправляем пошаговую памятку по прилёту.",
    cta: { label: "Проверить требования", href: "/visa" },
  },
  {
    iconKey: "travel",
    title: "Передвижение",
    copy: "По умолчанию — личные водители, поезда первого класса и внутренние перелёты на длинных отрезках, фелуки для самых приятных участков.",
    cta: { label: "Как мы путешествуем", href: "/getting-around" },
  },
  {
    iconKey: "info",
    title: "Живое общение",
    copy: "Ветераны Нила, а не колл-центр. WhatsApp, телефон или почта — вы свяжетесь с той же командой, что планирует поездку.",
    cta: { label: "Связаться с нами", href: "/contact" },
  },
];

export const tourTypesRu: [TourType, TourType, TourType, TourType] = [
  {
    title: "Классический Египет",
    blurb: "Пирамиды, храмы Луксора и великие музеи — обязательный маршрут, сделанный как следует.",
    href: "/tours?type=classic",
    image: { src: `${A}/tour-types/classic-egypt.webp`, alt: "Пилоны храма Филе отражаются в Ниле тихим асуанским утром." },
  },
  {
    title: "Круизы по Нилу",
    blurb: "Ночуйте на реке: палубы от Луксора до Асуана, отдельные стоянки и остановки у храмов по пути.",
    href: "/tours?type=nile-cruise",
    image: { src: `${A}/tour-types/nile-cruise.webp`, alt: "Воздушные шары поднимаются над долиной Нила западнее Луксора на рассвете." },
  },
  {
    title: "Красное море и пляжи",
    blurb: "Хургада, Шарм и Дахаб — дни на рифах, морские прогулки и настоящий отдых.",
    href: "/tours?type=red-sea",
    image: { src: `${A}/tour-types/red-sea-escape.webp`, alt: "Солнце садится над Красным морем, вдали виден силуэт дахабии." },
  },
  {
    title: "Приключения в пустыне",
    blurb: "Лагеря в Белой пустыне, вершины Синая, поездки по оазисам — Египет за пределами берегов реки.",
    href: "/tours?type=desert",
    image: { src: `${A}/tour-types/desert-adventure.webp`, alt: "Внедорожная колея вьётся среди оранжевых дюн к пустынному лагерю в сумерках." },
  },
];

export const storiesRu: Story[] = [
  {
    title: "Каир вне путеводителя",
    summary: "Где каирцы на самом деле едят кошари, мечеть с лучшим закатом в Каире и почему дальние залы Египетского музея интереснее знаменитого зала, — пять дней пешком по столице с нашей местной командой.",
    href: "/blog/cairo-beyond-the-guidebook",
    image: {
      src: `${A}/stories/cairo-experience.webp`,
      mid: `${A}/stories/cairo-experience.webp`,
      wide: `${A}/stories/cairo-experience.webp`,
      wideAt: 1440,
      alt: "Каир у Нила в сумерках, минареты и мосты наслаиваются на фиолетовое небо.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Вечер в Карнаке — сам по себе",
    summary: "У шоу «звук и свет» дурная слава — вот как наши гиды подбирают время, чтобы гипостильный зал был почти пуст, и что художник по свету верно понял про обелиски.",
    href: "/blog/karnak-sound-and-light",
    image: {
      src: `${A}/stories/karnak-sound-light.webp`,
      mid: `${A}/stories/karnak-sound-light.webp`,
      wide: `${A}/stories/karnak-sound-light.webp`,
      wideAt: 1440,
      alt: "Великие колонны Карнака подсвечены янтарём на фоне тёмно-синего ночного неба во время вечернего шоу.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Александрия: средиземноморская душа Египта",
    summary: "Два часа от Каира — и совсем другой мир: морепродукты на рыбном рынке, новая библиотека, катакомбы и прогулка по корнишу, объясняющая каждого александрийца, что вам встречался.",
    href: "/blog/alexandria-mediterranean-soul",
    image: {
      src: `${A}/stories/alexandria-mediterranean.webp`,
      mid: `${A}/stories/alexandria-mediterranean.webp`,
      wide: `${A}/stories/alexandria-mediterranean.webp`,
      wideAt: 1440,
      alt: "Александрийский корниш изгибается вдоль Средиземного моря к крепости на рассвете.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Как заниматься снорклингом в Красном море, не вредя ему",
    summary: "Советы по плавучести от наших дайв-гидов, почему мы никогда не кормим рыб, правила о солнцезащитном креме на каждой лодке «Птах Турс» и три рифа близ Шарма, где вы почти не встретите другую группу.",
    href: "/blog/red-sea-reef-etiquette",
    image: {
      src: `${A}/stories/red-sea-reef.webp`,
      mid: `${A}/stories/red-sea-reef.webp`,
      wide: `${A}/stories/red-sea-reef.webp`,
      wideAt: 1440,
      alt: "Коралловый сад со снующими рыбами-антиасами на прозрачном мелководье домашнего рифа Красного моря.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Похвала фелуке: неспешные дни на Ниле",
    summary: "Ни мотора, ни расписания жёстче ветра. Почему наш любимый день в Асуане — это парусина, термос чая и всё, что решит показать река.",
    href: "/blog/slow-nile-felucca-days",
    image: {
      src: `${A}/stories/nile-sailing-aswan.webp`,
      mid: `${A}/stories/nile-sailing-aswan.webp`,
      wide: `${A}/stories/nile-sailing-aswan.webp`,
      wideAt: 1440,
      alt: "Фелука мягко кренится под полным парусом на Ниле близ Асуана на закате.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Лучшее время для поездки в Египет, месяц за месяцем",
    summary: "В Египте есть сезон для каждого — ясная прохладная зима для храмов, спокойные межсезонья ради выгоды и разумный способ насладиться даже летней жарой. Вот как ощущается каждый месяц и когда ехать за чем.",
    href: "/blog/best-time-to-visit-egypt",
    image: {
      src: `${A}/hero/hero-giza.webp`,
      mid: `${A}/hero/hero-giza.webp`,
      wide: `${A}/hero/hero-giza.webp`,
      wideAt: 1440,
      alt: "Пирамиды Гизы под ясным синим зимним небом.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Круиз по Нилу: гид для новичка",
    summary: "Каков круиз по Нилу на самом деле — каюты, питание, ежедневный ритм храмов и плавания, в какую сторону идти и как выбрать между большим теплоходом и уютной дахабией.",
    href: "/blog/first-time-nile-cruise",
    image: {
      src: `${A}/cta/fifty-nile-cruise.webp`,
      mid: `${A}/cta/fifty-nile-cruise.webp`,
      wide: `${A}/cta/fifty-nile-cruise.webp`,
      wideAt: 1440,
      alt: "Круизный теплоход по Нилу на спокойной воде у зелёного берега.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Семь дней в Египте: наш классический маршрут по полочкам",
    summary: "Каир, Луксор и Асуан за неделю без спешки — наш классический семидневный маршрут по дням, с компромиссами, благодаря которым главное впечатляет, а темп остаётся человеческим.",
    href: "/blog/seven-days-in-egypt",
    image: {
      src: `${A}/itineraries/cairo-heritage.webp`,
      mid: `${A}/itineraries/cairo-heritage.webp`,
      wide: `${A}/itineraries/cairo-heritage.webp`,
      wideAt: 1440,
      alt: "Купола и минареты исторического исламского Каира в золотой час.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Что взять в Египет (и что оставить дома)",
    summary: "Короткий список того, что действительно важно, — одежда слоями для холодных ночей в пустыне, защита от солнца с уважением к святыням, правильная обувь для гробниц и вещи, которых новички всегда берут слишком много. С заметками по сезонам.",
    href: "/blog/what-to-pack-for-egypt",
    image: {
      src: `${A}/activities/desert-safari.webp`,
      mid: `${A}/activities/desert-safari.webp`,
      wide: `${A}/activities/desert-safari.webp`,
      wideAt: 1440,
      alt: "Пустынная колея уходит к дюнам под широким египетским небом.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "За пределами Гизы: недооценённые древности Египта",
    summary: "Увидев пирамиды, вы поймёте, что Египет на этом не заканчивается: ступенчатая пирамида в Саккаре, расписной потолок в Дендере, Абидос, Ком-Омбо и тихие храмы, где вы можете оказаться единственными посетителями.",
    href: "/blog/beyond-giza-underrated-sites",
    image: {
      src: `${A}/activities/philae-temple.webp`,
      mid: `${A}/activities/philae-temple.webp`,
      wide: `${A}/activities/philae-temple.webp`,
      wideAt: 1440,
      alt: "Колонны храма Филе поднимаются над Нилом близ Асуана.",
    },
    credit: "Ptah Tours field archive",
  },
  {
    title: "Египет с детьми: гид для семейных путешествий",
    summary: "Египет — отличное путешествие с детьми: мумии, верблюды и лодки не дадут им заскучать. Наш гид по темпу, возрастам, еде, жаре и турам, которые лучше всего подходят семьям.",
    href: "/blog/egypt-with-kids-family-guide",
    image: {
      src: `${A}/activities/nubian-culture.webp`,
      mid: `${A}/activities/nubian-culture.webp`,
      wide: `${A}/activities/nubian-culture.webp`,
      wideAt: 1440,
      alt: "Ярко расписанный переулок нубийской деревни над Нилом в Асуане.",
    },
    credit: "Ptah Tours field archive",
  },
];

export const siteNavRu: SiteNav = {
  quickLinks: [
    { label: "События и фестивали", href: "/events", iconKey: "calendar" },
    { label: "Когда приезжать", href: "/when-to-visit", iconKey: "weather" },
    { label: "Оформить электронную визу", href: "/visa", iconKey: "ticket" },
    { label: "Личный кабинет", href: "/account", iconKey: "user" },
  ],
  directLinks: [
    { label: "Направления", href: "/cities" },
    { label: "Идеи путешествий", href: "/trip-ideas" },
    { label: "Галерея", href: "/gallery" },
  ],
  buildTripCta: { label: "Спланировать поездку", href: "/manage/trip-builder" },
  bookmarksHref: "/manage/trip-builder?tab=bookmarks",
  searchHref: "/search",
  popularSearches: [
    "Пирамиды Гизы",
    "Круиз по Нилу",
    "Воздушный шар в Луксоре",
    "Снорклинг в Рас-Мохаммеде",
    "Индивидуальный тур по Каиру",
    "Рождество в Египте",
  ],
  sections: [
    {
      key: "about",
      title: "О Египте",
      columns: [
        {
          heading: "Направления",
          links: [
            { label: "Каир", href: "/cities/cairo" },
            { label: "Луксор", href: "/cities/luxor" },
            { label: "Асуан", href: "/cities/aswan" },
            { label: "Александрия", href: "/cities/alexandria" },
            { label: "Хургада", href: "/cities/hurghada" },
            { label: "Шарм-эль-Шейх", href: "/cities/sharm-el-sheikh" },
          ],
        },
        {
          heading: "Узнать страну",
          links: [
            { label: "История и наследие", href: "/heritage" },
            { label: "Сезоны и климат", href: "/when-to-visit" },
            { label: "Нил", href: "/the-nile" },
            { label: "Пустыни и оазисы", href: "/deserts" },
            { label: "Рифы Красного моря", href: "/red-sea" },
          ],
        },
        {
          heading: "Полезно знать",
          links: [
            {
              label: "Ответственный туризм",
              href: "/responsible-travel",
            },
            { label: "Доступность", href: "/accessibility" },
            { label: "Безопасность и поддержка", href: "/contact" },
            { label: "Истории и журнал", href: "/blog" },
          ],
        },
      ],
      imageCtas: [
        {
          label: "Погружение в направление",
          heading: "Древние Фивы",
          href: "/cities/luxor",
          image: { src: `${A}/hero/hero-thebes-portrait.webp`, alt: "Воздушный шар над храмами западного берега Луксора на рассвете." },
        },
        {
          label: "Побережья",
          heading: "Познакомьтесь с Красным морем",
          href: "/cities/sharm-el-sheikh",
          image: { src: `${A}/hero/hero-blue-hole-portrait.webp`, alt: "Сноркелер парит над кораллами на рифовом шельфе Голубой дыры." },
        },
        {
          label: "С места событий",
          heading: "Читать журнал",
          href: "/blog",
          image: { src: `${A}/stories/nile-sailing-aswan.webp`, alt: "Фелука под парусом на Ниле близ Асуана." },
        },
      ],
    },
    {
      key: "plan",
      title: "Спланируйте поездку",
      columns: [
        {
          heading: "Как добраться",
          links: [
            { label: "Рейсы в Египет", href: "/getting-here" },
            { label: "Визы и въезд", href: "/visa" },
            { label: "День прилёта без забот", href: "/getting-here#arrivals" },
            { label: "Передвижение", href: "/getting-around" },
          ],
        },
        {
          heading: "Определяемся",
          links: [
            { label: "Когда приезжать", href: "/when-to-visit" },
            { label: "Сколько дней", href: "/how-many-days" },
            { label: "Бюджет и чаевые", href: "/travel-tips" },
            { label: "Путешествие с детьми", href: "/family-travel" },
          ],
        },
        {
          heading: "Наше обещание",
          links: [
            { label: "Как устроены поездки «Птах Турс»", href: "/how-it-works" },
            { label: "Ответственный туризм", href: "/responsible-travel" },
            { label: "Отзывы и аккредитация", href: "/reviews" },
            { label: "Связаться с командой", href: "/contact" },
          ],
        },
      ],
      imageCtas: [
        {
          label: "Бесплатная консультация",
          heading: "Поговорить с египтологом",
          href: "/contact",
          image: { src: `${A}/activities/philae-felucca.webp`, alt: "Фелука идёт к храму Филе по спокойной воде Нила." },
        },
        {
          label: "Смотреть все",
          heading: "Все туры «Птах Турс»",
          href: "/tours",
          image: { src: `${A}/activities/valley-heritage.webp`, alt: "Расписные стены гробницы в Долине царей." },
        },
        {
          label: "Вдохновение",
          heading: "Идеи для путешествия",
          href: "/trip-ideas",
          image: { src: `${A}/cta/plan-nile-portrait.webp`, alt: "Фелука на Ниле в Асуане среди гранитных валунов." },
        },
      ],
    },
    {
      key: "tours",
      title: "Туры",
      columns: [
        {
          heading: "По стилю",
          links: [
            { label: "Классический Египет", href: "/tours?type=classic" },
            { label: "Круизы по Нилу", href: "/tours?type=nile-cruise" },
            { label: "Красное море и пляжи", href: "/tours?type=red-sea" },
            { label: "Приключения в пустыне", href: "/tours?type=desert" },
          ],
        },
        {
          heading: "По длительности",
          links: [
            { label: "Однодневные туры", href: "/tours?length=day" },
            { label: "Поездки на 2–4 дня", href: "/tours?length=short" },
            { label: "Путешествия на 5–9 дней", href: "/tours?length=week" },
            { label: "Экспедиции от 10 дней", href: "/tours?length=grand" },
          ],
        },
        {
          heading: "Особые",
          links: [
            { label: "Индивидуальные и под заказ", href: "/tours?type=private" },
            { label: "Семейные поездки", href: "/tours?type=family" },
            { label: "Медовый месяц", href: "/tours?type=honeymoon" },
            { label: "Горящие выезды", href: "/tours?filter=departing-soon" },
          ],
        },
      ],
      imageCtas: [
        {
          label: "Фирменное путешествие",
          heading: "Классический Египет, 8 дней",
          href: "/tours?type=classic",
          image: { src: `${A}/itineraries/giza-essentials.webp`, alt: "Пирамида Хеопса в Гизе, на переднем плане — погонщик верблюда." },
        },
        {
          label: "На реке",
          heading: "Коллекция круизов по Нилу",
          href: "/tours?type=nile-cruise",
          image: { src: `${A}/tour-types/nile-cruise.webp`, alt: "Шары поднимаются над долиной Нила близ Луксора на рассвете." },
        },
        {
          label: "Под водой",
          heading: "Дайвинг и снорклинг",
          href: "/tours?type=red-sea",
          image: { src: `${A}/activities/blue-hole-dive.webp`, alt: "Сноркелер над коралловым шельфом дахабской Голубой дыры." },
        },
      ],
    },
    {
      key: "journal",
      title: "Журнал",
      columns: [
        {
          heading: "Начните здесь",
          links: [
            { label: "Лучшее время для поездки", href: "/blog/best-time-to-visit-egypt" },
            { label: "Первый круиз по Нилу", href: "/blog/first-time-nile-cruise" },
            { label: "Маршрут на 7 дней", href: "/blog/seven-days-in-egypt" },
            { label: "Что взять с собой", href: "/blog/what-to-pack-for-egypt" },
          ],
        },
        {
          heading: "Места и истории",
          links: [
            { label: "Каир вне путеводителя", href: "/blog/cairo-beyond-the-guidebook" },
            { label: "Душа Александрии", href: "/blog/alexandria-mediterranean-soul" },
            { label: "За пределами Гизы", href: "/blog/beyond-giza-underrated-sites" },
            { label: "Вечер в Карнаке", href: "/blog/karnak-sound-and-light" },
          ],
        },
        {
          heading: "Путешествуйте с умом",
          links: [
            { label: "Египет с детьми", href: "/blog/egypt-with-kids-family-guide" },
            { label: "Этикет на рифах Красного моря", href: "/blog/red-sea-reef-etiquette" },
            { label: "Неспешные дни на фелуке", href: "/blog/slow-nile-felucca-days" },
            { label: "Все записи журнала", href: "/blog" },
          ],
        },
      ],
      imageCtas: [
        {
          label: "Планирование поездки",
          heading: "Когда ехать в Египет",
          href: "/blog/best-time-to-visit-egypt",
          image: { src: `${A}/hero/hero-giza-portrait.webp`, alt: "Пирамиды Гизы под ясным зимним небом." },
        },
        {
          label: "На реке",
          heading: "Первый круиз по Нилу",
          href: "/blog/first-time-nile-cruise",
          image: { src: `${A}/cta/fifty-nile-cruise.webp`, alt: "Круизный теплоход по Нилу пришвартован у зелёного берега." },
        },
        {
          label: "С семьёй",
          heading: "Египет с детьми",
          href: "/blog/egypt-with-kids-family-guide",
          image: { src: `${A}/activities/nubian-culture.webp`, alt: "Ярко расписанный переулок нубийской деревни над Нилом в Асуане." },
        },
      ],
    },
  ],
};

export const footerContentRu: FooterContent = {
  newsletter: {
    heading: "Подпишитесь!",
    blurb:
      "Идеи путешествий, сезонные выезды и редкие вести из пустыни — несколько раз в месяц, без спама.",
    cta: { label: "Подписаться на нашу рассылку", href: "/newsletter" },
  },
  badgeHeading: "Нас рекомендуют",
  badges: [
    { heading: "ETF", sub: "Участник, 2026", href: "/about#accreditation" },
    { heading: "Travelife", sub: "Партнёр", href: "/responsible-travel" },
  ],
  partnersHeading: "Партнёры в путешествиях",
  partners: [
    { name: "Egypt Air", tagline: "Официальный авиаперевозчик-партнёр", href: "https://www.egyptair.com" },
    { name: "IATA", tagline: "Аккредитованный агент", href: "https://www.iata.org" },
    { name: "Visit Egypt", tagline: "Управление по туризму Египта", href: "https://www.experienceegypt.eg" },
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
      heading: "Птах Турс",
      links: [
        { label: "О нас", href: "/about" },
        { label: "Наши египтологи", href: "/about#team" },
        { label: "Вакансии", href: "/careers" },
        { label: "Пресса и медиа", href: "/press" },
        { label: "Связаться с нами", href: "/contact" },
      ],
    },
    {
      heading: "Путешествуйте с нами",
      links: [
        { label: "Все туры", href: "/tours" },
        { label: "Идеи путешествий", href: "/trip-ideas" },
        { label: "Круизы по Нилу", href: "/tours?type=nile-cruise" },
        { label: "Индивидуальные путешествия", href: "/tours?type=private" },
        { label: "Ответственный туризм", href: "/responsible-travel" },
        { label: "Фотогалерея", href: "/gallery" },
      ],
    },
    {
      heading: "Помощь и информация",
      links: [
        { label: "Когда приезжать", href: "/when-to-visit" },
        { label: "Визы и въезд", href: "/visa" },
        { label: "Отследить бронирование", href: "/track-booking" },
        { label: "Здоровье и безопасность", href: "/travel-tips" },
        { label: "Частые вопросы", href: "/faqs" },
      ],
    },
  ],
  legalLinks: [
    { label: "Политика конфиденциальности", href: "/privacy-policy" },
    { label: "Условия использования", href: "/terms-of-service" },
    { label: "Политика использования файлов cookie", href: "/cookie-policy" },
  ],
  copyrightLine: "© {year} Ptah Tours. Все права защищены.",
  acknowledgement:
    "Штаб-квартира «Птах Турс» — в Каире, а работаем мы по всему Египту: в долине Нила, дельте, на Синае и в Западной пустыне. Мы путешествуем с лицензированными египтологами, честно платим нашим командам и выстраиваем каждый маршрут так, чтобы отдавать сообществам и памятникам Египта больше, чем брать.",
  cookie: {
    heading: "Мы ценим вашу приватность",
    copy: "Мы используем файлы cookie, чтобы улучшить ваш опыт просмотра, показывать персонализированный контент и анализировать трафик. Нажимая «Принять все», вы соглашаетесь на использование нами файлов cookie. Вы можете изменить своё решение в любой момент внизу страницы.",
    manageHeading: "Управление настройками файлов cookie",
    categories: [
      {
        key: "preferences",
        name: "Предпочтения",
        description: "Запоминают такие настройки, как язык, валюта и сохранённые вами поездки.",
      },
      {
        key: "analytics",
        name: "Аналитика",
        description: "Анонимная статистика, которая помогает нам понять, какие поездки и страницы нравятся путешественникам.",
      },
      {
        key: "marketing",
        name: "Маркетинг",
        description: "Оценивают наши кампании и показывают более релевантный контент «Птах Турс» на других площадках.",
      },
    ],
  },
};

/* Aggregate export shaped like the future HomePage.content[] (design.md §7.3),
   mirroring English `landingContent`. */
export const landingContentRu = {
  hero: heroSlidesRu,
  inspiredTabs: inspiredTabsRu,
  planCta: planCtaRu,
  fiftyCtas: fiftyCtasRu,
  kbygItems: kbygItemsRu,
  tourTypes: tourTypesRu,
  stories: storiesRu,
} as const;
