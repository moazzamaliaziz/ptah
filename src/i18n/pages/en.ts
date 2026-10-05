/**
 * English page-content dictionary (Phase 3 i18n, Track C) — the SOURCE and shape
 * SSOT for STATIC strings inside public page bodies: headings, editorial copy,
 * form labels, empty states and CTAs. Global chrome lives in
 * `@/i18n/dictionaries`; DB-driven catalog copy (tours, destinations, events,
 * homepage sections) is the DB translation layer. This file is neither.
 *
 * TRANSLATOR NOTES for ar/fr/de/es/it (each `satisfies PageContent`):
 *  - Keep every key and every array length identical to this file.
 *  - Keep placeholders like {count}, {name}, {price} and the brand "Ptah Tours"
 *    verbatim. City/site proper nouns may use the standard localized exonym.
 *  - Arabic (ar) renders right-to-left; write natural RTL Arabic, not transliteration.
 *  - Grouped by page; a "// ── <group> ──" comment heads each section.
 */
export const enPages = {
  // ── Shared across pages ──
  common: {
    /** Breadcrumb root label. */
    home: "Home",
  },

  // ── Editorial theme hubs (ThemeHub component: the-nile / red-sea / heritage / deserts) ──
  themeHub: {
    toursHeading: "Tours to explore",
    /** Empty state renders as: "{emptyPre} {emptyLink} {emptyPost}". */
    emptyPre: "We're still curating tours for this theme.",
    emptyLink: "Tell us what you have in mind",
    emptyPost: "and we'll tailor one.",
    ctaHeading: "Want it your way?",
    ctaBody: "Every trip can be made private and shaped around your dates, pace, and interests.",
    ctaPrimary: "Plan a custom version",
    ctaSecondary: "See all tours",
    /** Shown in place of a missing hero image. */
    heroFallback: "Egypt",
  },

  theNile: {
    title: "The Nile",
    eyebrow: "Explore by theme",
    lede: "Egypt is the gift of the Nile — and the river is still the best way to understand it. From the temples of Luxor to the islands of Aswan, our Nile journeys follow the water south.",
    intro: [
      "For thousands of years, life in Egypt has clung to this thin green ribbon through the desert. Follow it and the country unfolds in order: the mighty temples of Karnak and Luxor, the tombs of the Theban west bank, and further south the calmer, Nubian-flavoured world of Aswan, with Philae temple rising from the water.",
      "Between the great sites, the river slows you down in the best way. A felucca sail at Aswan — no engine, just canvas and the wind — is the afternoon travelers remember most. We build our Nile trips around both: the monuments by morning, the river by evening.",
    ],
    heroAlt: "A felucca under full sail on the Nile near Aswan at golden hour.",
  },

  redSea: {
    title: "Red Sea & Reefs",
    eyebrow: "Explore by theme",
    lede: "Some of the finest coral reefs on the planet sit a short boat ride off Egypt's Red Sea coast — warm, clear, and alive with colour almost every day of the year.",
    intro: [
      "From Hurghada and Sharm El Sheikh, the reefs begin almost at the shoreline. Slip in over a coral garden and you're among clouds of anthias, gliding turtles, and the occasional curious reef shark. Whether it's your first mask-and-snorkel or your hundredth dive, there's water here for you.",
      "We work with licensed dive guides and hold to reef-safe practices on every boat — no touching, no feeding, reef-safe sunscreen only. The Red Sea pairs beautifully with a few days of temples inland: history in the morning, coral in the afternoon.",
    ],
    heroAlt: "Snorkelers drifting above a vivid coral garden in the clear shallows of the Red Sea.",
  },

  heritage: {
    title: "Heritage & History",
    eyebrow: "Explore by theme",
    lede: "Five thousand years of civilization, told properly. Our heritage tours put a licensed Egyptologist beside you at the sites that made Egypt legendary.",
    intro: [
      "This is the Egypt of the schoolbooks made real — the Great Pyramid and the Sphinx at Giza, the columned halls of Karnak, the painted tombs of the Valley of the Kings, and the treasures of the Egyptian Museum. But seeing them and understanding them are two different trips.",
      "On every heritage journey, your guide reads the walls for you: the story in a relief, why a temple faces the sunrise, what a cartouche actually says. We time each visit around the light and the crowds, so the monuments feel monumental — not like a queue.",
    ],
    heroAlt: "Golden cliffs descending toward the tombs of the Valley of the Kings.",
  },

  deserts: {
    title: "Deserts & Sinai",
    eyebrow: "Explore by theme",
    lede: "Past the last stretch of green lies most of Egypt: an ocean of sand, wind-carved rock, and a silence you can hear. Our desert tours take you into it, safely and well.",
    intro: [
      "The desert is where Egypt gets quiet and vast. Ride out into the dunes as the light turns gold, watch the stars come out with nothing to dim them, and share sweet tea around a fire with Bedouin hosts who have crossed these sands for generations.",
      "In the Sinai, the desert climbs. We can guide you up to St Catherine's Monastery beneath Mount Sinai, or out along the Red Sea's desert coast. Wherever the sand takes you, you'll go with guides who read the terrain and plan every trip around your comfort and safety.",
    ],
    heroAlt: "A four-wheel-drive tracing a ridge of golden dunes under a wide desert sky.",
  },

  // ── Privacy Policy (/privacy-policy) ──
  privacyPolicy: {
    eyebrow: "Privacy Policy",
    title: "How we handle your information.",
    emphasis: "transparently.",
    description: "Ptah Tours is committed to protecting your personal data. This policy explains what we collect, why we collect it, and how you can control it.",
    collectHeading: "What data we collect",
    collectBody: "We collect information you provide directly to us when you book a tour, subscribe to our newsletter, or contact us. This includes your name, email address, phone number, travel dates, and any special requirements you share with us. We also automatically collect browsing information such as your IP address, browser type, and pages visited through cookies and similar tracking technologies.",
    useHeading: "How we use your data",
    useBody: "We use your information to process and manage your bookings, communicate with you about your tours, send administrative updates, and improve our website and services. We may also use aggregated, anonymized data for analytics and marketing insights to better understand how our visitors engage with the site.",
    useItems: [
      "Itinerary planning and booking management",
      "Targeted communications and service updates",
      "Website analytics and performance improvement",
    ],
    sharingHeading: "Data sharing and disclosure",
    sharingBody: "We do not sell your personal data. We share information only with our trusted partners when necessary to fulfill your bookings such as local guides, drivers, accommodations, and transport providers in your destination. We may also disclose your data if required by law, to protect our rights and safety, or to respond to valid legal requests.",
    retentionHeading: "Data retention",
    retentionBody: "We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Booking records are retained for at least seven years to comply with accounting and tax regulations.",
    cookiesHeading: "Cookies and tracking",
    cookiesBody: "Our website uses essential cookies to enable core functionality and improve your browsing experience. You can control and manage cookies through your browser settings. For more details, please see our separate Cookie Policy.",
    rightsHeading: "Your rights",
    rightsBody: "You have the right to access, correct, or delete your personal data held by us. You may also request to restrict or object to certain processing activities. To make a data request or to unsubscribe from marketing communications, contact us using the details below and we will respond within a reasonable timeframe.",
    rightsItems: [
      "Request access to the personal data we hold about you",
      "Request correction of inaccurate or incomplete information",
      "Request deletion of your data where retention is no longer necessary",
      "Object to or restrict certain uses of your information",
    ],
    contactHeading: "Contact us",
    contactPre: "If you have any questions about this Privacy Policy or how we handle your personal data, please contact us at",
    contactPost: ". We will respond to your inquiry as soon as possible.",
    backToHome: "Back to home",
    breadcrumb: "Privacy Policy",
  },

  // ── Terms of Service (/terms-of-service) ──
  termsOfService: {
    eyebrow: "Terms of Service",
    title: "The rules for booking and travelling with us.",
    emphasis: "together.",
    description: "These terms govern your use of the Ptah Tours website and any booking you make. Please read them carefully before confirming a reservation.",
    bookingHeading: "Booking and confirmation",
    bookingBody: "When you place a booking through our website or with one of our team members, you are making an offer to purchase the services listed. We will confirm your booking by email, which constitutes acceptance of these terms. You must be at least 18 years old to make a booking.",
    bookingItems: [
      "All bookings require a valid payment method at the time of reservation",
      "Confirmation is sent via email and acts as your receipt",
      "Changes to your booking may be subject to availability and additional fees",
    ],
    paymentHeading: "Payment terms",
    paymentBody: "We accept major credit cards and other payment methods displayed at checkout. A deposit is required to secure your booking, with the balance due no later than 30 days before your scheduled start date. Late payments may result in cancellation of the reservation without refund.",
    paymentItems: [
      "A non-refundable deposit secures your spot on the tour",
      "Full balance is due 30 days before departure",
      "Prices are quoted in the local currency and include applicable taxes",
    ],
    cancellationHeading: "Cancellation policy",
    cancellationBody: "Our cancellation policy is tiered based on the amount of notice you provide. Full details are set out in our Refunds & Cancellation page. In summary, cancellations made more than 48 hours before departure are eligible for a full refund, while those made within 48 hours may incur partial or full charges.",
    responsibilitiesHeading: "Your responsibilities",
    responsibilitiesBody: "You are responsible for ensuring you have all necessary travel documents, visas, vaccinations, and insurance coverage required for your destination. You must also adhere to the local laws and customs of the countries you visit, and follow all reasonable instructions given by our guides and drivers during the tour.",
    responsibilitiesItems: [
      "Valid passport with at least six months remaining validity",
      "Required visas, vaccinations, and travel insurance",
      "Compliance with local laws and guide instructions",
    ],
    liabilityHeading: "Limitation of liability",
    liabilityBody: "To the fullest extent permitted by law, Ptah Tours excludes all warranties, representations, conditions, and terms not expressly set out in these terms. We shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of our services, even if we have been advised of the possibility of such damages.",
    forceMajeureHeading: "Force majeure",
    forceMajeureBody: "We are not liable for any failure or delay in performing our obligations under these terms where such failure or delay is caused by events beyond our reasonable control, including but not limited to acts of God, war, terrorism, riots, embargoes, government orders, natural disasters, or strikes.",
    changesHeading: "Changes to these terms",
    changesBody: "We may update these terms from time to time. Any changes will be posted on this page with an updated effective date. Your continued use of the website and services after any changes constitutes acceptance of the revised terms. For material changes affecting an existing booking, we will notify you directly.",
    backToHome: "Back to home",
    breadcrumb: "Terms of Service",
  },

  // ── Cookie Policy (/cookie-policy) ──
  cookiePolicy: {
    eyebrow: "Cookie Policy",
    title: "How we use cookies and tracking.",
    emphasis: "technologies.",
    description: "This cookie policy explains what cookies and similar tracking technologies we use, why we use them, and how you can control them.",
    whatHeading: "What are cookies?",
    whatBody: "Cookies are small text files stored on your device when you visit a website. They help websites remember information about your visit, such as your language preference or login status. We also use similar tracking technologies such as web beacons, pixels, and local storage.",
    typesHeading: "Types of cookies we use",
    typesBody: "We categorize our cookies based on their purpose:",
    typesItems: [
      "Essential cookies — necessary for core website functionality, such as maintaining your session and securing your account.",
      "Performance cookies — collect anonymous data about how visitors use our site, helping us understand which pages are popular and optimize performance.",
      "Functional cookies — remember your preferences, such as language, region, and display settings, to provide enhanced personalization.",
      "Targeting cookies — used by our advertising partners to deliver relevant ads based on your interests and browsing behavior.",
    ],
    thirdPartyHeading: "Third-party cookies",
    thirdPartyBody: "We work with trusted third parties who may set cookies on our site, including analytics providers like Google Analytics and advertising networks. These third parties have their own privacy and cookie policies governing their use of cookies. We are not responsible for the cookie practices of these parties.",
    manageHeading: "How to manage cookies",
    manageBody: "You can control and manage cookies through your browser settings. Most browsers allow you to view, disable, or delete cookies. Please note that disabling essential cookies may impact the functionality of our site.",
    manageItems: [
      "Browser cookie settings — adjust your preferences in Chrome, Firefox, Safari, or Edge.",
      "Opt-out tools — use industry platforms like the Network Advertising Initiative or the Digital Advertising Alliance.",
    ],
    dntHeading: "Do Not Track signals",
    dntBody: "Some browsers transmit Do Not Track signals to websites. Our site does not currently respond to these signals, but you can manage your cookie preferences directly through your browser settings as described above.",
    backToHome: "Back to home",
    breadcrumb: "Cookie Policy",
  },

  // ── Disclaimer (/disclaimer) ──
  disclaimer: {
    eyebrow: "Disclaimer",
    title: "Information on this site is provided",
    emphasis: "as-is.",
    description: "The content on the Ptah Tours website is provided for general information purposes only. While we strive for accuracy, we cannot guarantee completeness or timeliness.",
    accuracyHeading: "Website content accuracy",
    accuracyBody: "While we endeavor to ensure that the information on this website is accurate and up to date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or availability of the content. Any reliance you place on the information is strictly at your own risk.",
    accuracyItems: [
      "Tour descriptions and itineraries are subject to change",
      "Activity details may be modified for safety or operational reasons",
      "We do not guarantee that the website will be uninterrupted or error-free",
    ],
    pricingHeading: "Pricing and availability",
    pricingBody: "All prices displayed on our website are subject to availability and may change without notice. We reserve the right to adjust prices due to currency fluctuations, seasonal demand, or supplier cost changes. Availability is confirmed only upon receipt of your deposit and our written confirmation.",
    linksHeading: "Third-party links",
    linksBody: "Our website may contain links to external websites, services, or third-party content that are not owned or controlled by Ptah Tours. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites.",
    ugcHeading: "User-generated content",
    ugcBody: "Visitors may be able to submit reviews, comments, or other content to our website. We do not endorse or verify the accuracy of user-generated content and are not responsible for any content posted by users. We reserve the right to remove any content at our sole discretion.",
    liabilityHeading: "Limitation of liability",
    liabilityBody: "To the fullest extent permitted by law, Ptah Tours, its directors, employees, partners, and agents exclude all liability for any direct, indirect, incidental, special, or consequential loss or damage arising out of or in connection with your use of the website or services.",
    governingHeading: "Governing law",
    governingBody: "These terms and any dispute arising from your use of this website or our services shall be governed by and construed in accordance with the laws of Egypt, without regard to its conflict of law principles. Any legal action or proceeding shall be subject to the exclusive jurisdiction of the courts in Cairo, Egypt.",
    backToHome: "Back to home",
    breadcrumb: "Disclaimer",
  },

  // ── Refunds & Cancellation (/refunds-cancellation) ──
  refundsCancellation: {
    eyebrow: "Refunds & Cancellation",
    title: "What happens if plans change.",
    emphasis: "here.",
    description: "We understand that plans can shift. Here's how our cancellation and refund policy works, based on how much notice you give us.",
    tiersHeading: "Cancellation tiers",
    tiersBody: "The amount of notice you give determines the refund you receive. All cancellations must be submitted in writing to our team, and refunds are processed within 14 business days of approval.",
    tiersItems: [
      "Cancellations made 48 hours or more before departure receive a full refund minus any non-refundable deposit fees.",
      "Cancellations made between 24 and 48 hours before departure receive a partial refund of 50 percent.",
      "Cancellations made less than 24 hours before departure or no-shows are not eligible for a refund.",
    ],
    specialHeading: "Special circumstances",
    specialBody: "If we need to cancel a tour due to severe weather, a guide unavailability, or any other operational reason, you will receive a full refund or the option to rebook on an alternative date. We will notify you as soon as possible if this situation arises.",
    processingHeading: "Refund processing",
    processingBody: "Once your cancellation is approved, the refund will be credited back to the original payment method used at the time of booking. Please allow 5 to 10 business days for the refund to appear on your statement, depending on your bank or card issuer.",
    noShowHeading: "No-shows and deposits",
    noShowBody: "If you fail to arrive for your scheduled tour without prior notice, the deposit paid at the time of booking will be forfeited. The same applies to late arrivals that cause us to miss the scheduled departure.",
    forceMajeureHeading: "Force majeure exceptions",
    forceMajeureBody: "In the event of a force majeure situation such as natural disasters, government travel restrictions, or civil unrest, standard cancellation penalties do not apply. You will be offered a full refund, a travel credit, or the option to rebook on a future date, depending on the circumstances.",
    backToHome: "Back to home",
    breadcrumb: "Refunds & Cancellation",
  },

  // ── How It Works (/how-it-works) ──
  howItWorks: {
    eyebrow: "How it works",
    title: "Booking a trip with us, step by step",
    lede: "Planning a trip to Egypt shouldn't feel like a second job. Here's exactly how it works with Ptah Tours — from the first browse to the day you're standing in front of the pyramids with a guide who knows their history cold.",
    stepsHeading: "Six simple steps",
    steps: [
      { title: "1. Browse and choose", body: "Explore our tours by destination, length, and style. Every listing shows the full route, what's included, and all-in pricing in USD and EGP — so you know exactly what you're booking before you commit." },
      { title: "2. Enquire or book online", body: "Ready to go? Book directly on the site. Still deciding? Send an enquiry and tell us what you have in mind — dates, group size, the sites you can't miss — and we'll come back with options." },
      { title: "3. We confirm the details", body: "Our Cairo team reviews your request, confirms availability, and matches you with a licensed Egyptologist guide. We'll flag anything worth knowing — timing, site closures, or a smarter order to see things." },
      { title: "4. Pay securely", body: "Once the plan is set, you pay through our secure checkout. Pricing stays transparent and all-in: entrance fees, transfers, and the specifics are laid out with no surprise line items at the temple gate." },
      { title: "5. Receive your itinerary", body: "You'll get a clear day-by-day itinerary with your guide's details, pickup times, and practical notes. Everything you need for the trip lives in one place, ready before you fly." },
      { title: "6. Travel with local support", body: "On the ground, your guide runs the day. Behind them, a Cairo phone line is on call 24/7 — so if plans shift, someone who knows the ground is there to sort it out." },
    ],
    privateHeading: "Private or small-group — your call",
    privateBody: "Most of our journeys default to private departures: just your party, your guide, and a pace that bends to you. Prefer to travel alongside a few like-minded people and keep costs down? Our small-group options cap numbers so the experience never feels like a crowd. Either way, you get a licensed Egyptologist and the same all-in pricing.",
    customHeading: "Make it your own",
    customBody: "Our published itineraries are a starting point, not a straitjacket. Want an extra day in Luxor, a slower morning at Giza, a hot-air balloon at dawn, or to swap a museum for a market? Tell us during the enquiry and we'll reshape the route around what matters to you — then confirm the details and any change in price before you pay.",
    afterHeading: "What happens after you book",
    afterBody: "Booking is the beginning, not the end of the conversation. You'll have your written itinerary, your guide's introduction, and a single point of contact in Cairo. In the days before travel we confirm pickups and timings, and while you're here our team stays reachable around the clock. If a tomb closes or the weather turns, we adjust the day so you don't miss out.",
    ctaHeading: "Ready to start planning?",
    ctaBody: "Browse our tours to find your route, or tell us what you have in mind and we'll shape the trip around you.",
    ctaPrimary: "Browse tours",
    ctaSecondary: "Start planning",
    breadcrumb: "How it works",
  },

  // ── When to Visit (/when-to-visit) ──
  whenToVisit: {
    eyebrow: "When to go",
    title: "The best time to visit Egypt",
    lede: "There's no single perfect month — it depends on where you're headed and what you can handle heat-wise. Here's how the year breaks down, from the cool, crowded peak to the quiet, sun-baked summer, so you can choose the season that suits your trip.",
    seasonsHeading: "Egypt by season",
    seasons: [
      { title: "October–April — peak season", body: "The classic window. Days are warm and comfortable, evenings cool, and Upper Egypt — Luxor, Aswan, Abu Simbel — is at its most pleasant for temple-hopping. It's the busiest and priciest time, so popular dates book up early." },
      { title: "May–September — summer", body: "Hot, and genuinely so in the south, where Luxor and Aswan can push past 40°C. But crowds thin, prices soften, and the Red Sea coast comes into its own. With early starts and shaded afternoons, summer travel is very doable." },
      { title: "Shoulder months — October & April/May", body: "The edges of peak season often hit the sweet spot: pleasant weather, thinner crowds than midwinter, and slightly gentler pricing. If you want the best of both, aim for these transitional weeks." },
    ],
    heatHeading: "Heat in Upper Egypt and the desert",
    heatBody: "Luxor, Aswan, and the Western Desert get seriously hot from late spring through early autumn. It's not a reason to stay away — just to travel smart. We schedule the big sites for early morning, build in shaded downtime through the middle of the day, and keep water close. If you wilt in heat, the cooler October-to-April window will be far more comfortable in the south.",
    redSeaHeading: "The Red Sea is a year-round exception",
    redSeaBody: "Hurghada and Sharm El Sheikh stay warm and inviting almost all year, with sea temperatures that make diving and snorkelling a pleasure even when Cairo cools off. Summer is high season on the coast precisely because it's a comfortable base when inland Egypt is at its hottest — a natural pairing with a few days on the reefs.",
    ramadanHeading: "Travelling during Ramadan",
    ramadanBody: "Ramadan, the Islamic month of fasting, moves through the calendar year by year. It's a special time to visit — evenings come alive after sunset — but daytime hours can be quieter and some cafés and shops keep shorter schedules. Sites and tours run as normal, and travellers are warmly welcomed; a little sensitivity around eating and drinking in public during the day goes a long way. If you'd prefer to plan around it, just ask and we'll flag the dates for your year.",
    ctaHeading: "Pick your season, then your route",
    ctaBody: "Whatever time of year suits you, we'll build a trip that works around the weather. Browse tours or tell us your dates.",
    ctaPrimary: "Browse tours",
    ctaSecondary: "Start planning",
    breadcrumb: "When to visit",
  },

  // ── Getting Here (/getting-here) ──
  gettingHere: {
    eyebrow: "Getting here",
    title: "Flying into Egypt",
    lede: "Egypt is well connected, with several international airports to choose from depending on where your trip begins. Here's a look at the main gateways and what to expect when you touch down — plus how we make the arrival itself painless.",
    gatewaysHeading: "Main international gateways",
    gateways: [
      { title: "Cairo (CAI)", body: "The main international hub and the natural starting point for most trips. Direct flights from Europe, the Gulf, North America, and beyond land here, minutes from Giza and the heart of the city." },
      { title: "Luxor (LXR)", body: "The gateway to Upper Egypt, with seasonal and regional connections. Handy if you want to start in the south among the temples and the Valley of the Kings before heading elsewhere." },
      { title: "Hurghada (HRG)", body: "The Red Sea's busiest airport, well served by charter and scheduled flights from Europe. Ideal if beaches, diving, and the reef are high on your list." },
      { title: "Sharm El Sheikh (SSH)", body: "The southern Sinai gateway on the Red Sea, popular for resort stays and world-class diving. A comfortable base for the coast, with connections across the region." },
      { title: "Aswan (ASW)", body: "The far-south gateway, useful for Nile journeys and the trip to Abu Simbel. Often paired with Luxor as the two ends of a classic Upper Egypt route." },
    ],
    arrivalsHeading: "Arriving at the airport",
    arrivalsIntro: "The first hour in a new country sets the tone. Here's what to expect on arrival, and how we smooth it out.",
    meetHeading: "Meet and greet",
    meetBody: "When your trip includes an airport transfer, a representative meets you in the arrivals hall with a name board, helps with any arrival formalities, and walks you to your vehicle. No hunting for a taxi, no haggling at the curb after a long flight.",
    immigrationHeading: "Immigration and customs",
    immigrationBody: "Have your passport, any pre-arranged visa documentation, and your onward details ready. Lines can be busy when several flights land together, so build in a little patience — and see our visa guidance for what to sort out before you fly.",
    currencyHeading: "Currency and a local SIM",
    currencyBody: "Airports have ATMs and exchange desks if you want some Egyptian pounds in hand, and SIM cards from local mobile operators are usually available in the arrivals area. It's worth grabbing a little cash for tips and small purchases, and a SIM if you want data from the moment you land.",
    transfersHeading: "Private transfers, arranged",
    transfersBody: "We arrange private airport transfers as part of most trips — a clean, air-conditioned vehicle and a driver who knows the way to your hotel. Tell us your flight details and we'll have someone waiting, whatever the hour.",
    ctaHeading: "We'll be there when you land",
    ctaBody: "Book a tour with transfers included, or tell us your flights and we'll arrange the welcome.",
    ctaPrimary: "Browse tours",
    ctaSecondary: "Start planning",
    breadcrumb: "Getting here",
  },

  // ── Getting Around (/getting-around) ──
  gettingAround: {
    eyebrow: "Getting around",
    title: "Getting around Egypt",
    lede: "Egypt is a big country, and how you move between its highlights shapes the whole trip. Here are your options — from a quick domestic flight to a slow sail down the Nile — and a clear line on what we take care of versus what's worth knowing if you head out on your own.",
    modesHeading: "Ways to travel",
    modes: [
      { title: "Domestic flights", body: "EgyptAir and others link Cairo with Luxor, Aswan, and the Red Sea in about an hour. Flying is the fastest way to cover Egypt's long distances and the easiest way to fit the south into a shorter trip." },
      { title: "Trains", body: "The Nile Valley line runs Cairo–Luxor–Aswan, with comfortable sleeper services that turn the long southbound journey into an overnight. A scenic, characterful alternative to flying for those with time." },
      { title: "Private drivers", body: "For flexibility on the ground, a private car with a driver is hard to beat — door to door, on your schedule, with someone who knows the roads. This is how we move guests around within a destination." },
      { title: "Nile boats and feluccas", body: "Between Luxor and Aswan, the river is the road. Multi-day cruise boats and traditional sail-powered feluccas let you travel the Nile itself, with temples appearing along the banks as you go." },
      { title: "Ride-hailing in cities", body: "In Cairo and other big cities, ride-hailing apps make short hops simple and remove the need to negotiate fares. Handy for independent evenings out when you're not with your guide." },
      { title: "On foot", body: "The best way to feel a place. Old Cairo's lanes, Luxor's east-bank streets, and the temple complexes themselves reward slow walking — always with sun protection and water in the warmer months." },
    ],
    handleHeading: "What we handle",
    handleBody: "On our tours, transport is one less thing to think about. We arrange private, air-conditioned vehicles with vetted drivers for your sightseeing days, coordinate domestic flights and train legs where they make sense, and sort your Nile cruise or felucca time as part of the itinerary. Everything is timed to link up, so you're never left working out how to get from one place to the next.",
    independentHeading: "Tips for independent travel",
    independentBody: "Striking out on your own between tour days? A few pointers help. Agree fares before you set off if you use a metered or negotiated taxi, or lean on a ride-hailing app in the cities to keep things simple. Carry small notes for tips and short trips, book longer-distance trains and flights ahead in peak season, and keep your hotel's address written in Arabic for the return journey. Your guide is always happy to point you to the safe, sensible option.",
    mixHeading: "Getting the mix right",
    mixBody: "The best trips blend modes: fly to save time on the long hops, take the train or a cruise where the journey is part of the experience, and keep a private driver for the days packed with sites. Tell us your priorities and we'll build the right combination into your route.",
    ctaHeading: "Leave the logistics to us",
    ctaBody: "Browse tours with transport built in, or tell us your plans and we'll connect the dots.",
    ctaPrimary: "Browse tours",
    ctaSecondary: "Start planning",
    breadcrumb: "Getting around",
  },

  // ── How Many Days (/how-many-days) ──
  howManyDays: {
    eyebrow: "Trip length",
    title: "How many days do you need in Egypt?",
    lede: "It depends on what you want to see and how you like to travel — but there are natural rhythms to a trip here. Here's an honest guide to what each length gives you, so you can match your time to your ambitions.",
    oneDayHeading: "Got just one day?",
    oneDayPre: "If you're passing through Cairo on a layover or squeezing in a side trip from the Red Sea, a single well-planned day still goes a long way — the Giza plateau in the morning, the Egyptian Museum after. Browse our",
    oneDayLink: "day tours",
    oneDayPost: "to see what fits.",
    guideHeading: "A guide by trip length",
    durations: [
      { title: "3–4 days — the essentials", body: "Enough for Cairo and Giza done properly: the pyramids, the Sphinx, the Egyptian Museum, and a wander through Islamic or Coptic Cairo. It's a taster, not the whole story, but it delivers the icons without feeling rushed.", linkLabel: "See short trips" },
      { title: "5–7 days — the classic", body: "The sweet spot for a first visit. Pair Cairo and Giza with the south — the temples of Luxor and Karnak, the Valley of the Kings, and often a stretch of the Nile down to Aswan. You leave feeling you've truly seen Egypt.", linkLabel: "See week-long tours" },
      { title: "8–10 days — the full Nile", body: "Room to slow down and go deeper. Add a proper Nile cruise between Luxor and Aswan, the temples at Edfu and Kom Ombo, and the unforgettable early start to Abu Simbel near the Sudanese border.", linkLabel: "See grand journeys" },
      { title: "10+ days — the grand tour", body: "Time to combine it all. Layer in the Red Sea for diving and downtime, Alexandria's Mediterranean history, or a desert excursion to the Western oases and White Desert. This is Egypt without compromise.", linkLabel: "See grand journeys" },
    ],
    notOnlyHeading: "It's not only about the number of days",
    notOnlyBody: "Egypt's distances are real: the flight or overnight train between Cairo and Luxor eats into a short trip, and Abu Simbel is a long way south. The more time you have, the less each day has to carry — which usually means a better trip, not just a longer one. If your dates are tight, we'd rather help you see fewer places well than sprint through all of them.",
    notSureHeading: "Not sure where you land?",
    notSureBody: "Tell us your dates and what you most want to see, and we'll suggest a length and a route that fit. Because most of our journeys are private, we can stretch, trim, or reshape any itinerary to match the time you actually have.",
    ctaHeading: "Find the trip that fits your days",
    ctaBody: "Browse tours by length, or tell us your dates and we'll build the right route around them.",
    ctaPrimary: "Browse tours",
    ctaSecondary: "Start planning",
    breadcrumb: "How many days",
  },

  // ── Travel Tips (/travel-tips) ──
  travelTips: {
    eyebrow: "Travel smart",
    title: "Health & safety tips",
    lede: "A little preparation makes Egypt an easy, comfortable place to travel. Here's the practical guidance we share with our own travelers — on staying well in the heat, eating happily, and keeping your trip smooth from arrival to departure.",
    healthHeading: "Staying healthy",
    health: [
      { title: "Beat the heat", body: "Egypt runs hot, especially in the south from spring to autumn. Start sightseeing early, rest through the hottest hours, and drink more water than you think you need. Light, loose, long clothing keeps you cooler than bare skin." },
      { title: "Food & water", body: "Stick to bottled or filtered water, including for brushing teeth, and enjoy freshly cooked, hot food. Egyptian cuisine is a highlight of any trip — a little sensible caution just means you enjoy it without interruption." },
      { title: "Sun protection", body: "The sun is stronger than it feels near the water or in the desert. Pack a high-SPF sunscreen, a wide-brimmed hat, and good sunglasses, and reapply often. A reef-safe sunscreen is a must if you're snorkeling." },
      { title: "Talk to a professional", body: "Before you travel, check current vaccination and health recommendations with a travel clinic or your doctor. This page is general guidance only — it is not medical advice, and your own health needs come first." },
    ],
    safetyHeading: "Staying safe",
    safety: [
      { title: "Money & valuables", body: "Carry small amounts of cash for tips and markets, keep the rest and your passport in your hotel safe, and use a card where you can. A cross-body bag that closes properly is your friend in busy places." },
      { title: "Getting around", body: "Use hotel-arranged or reputable transport rather than flagging cars at random, agree fares before you set off, and keep our local number handy. On our tours, your transfers and drivers are arranged for you." },
      { title: "Respect local customs", body: "Egypt is a warm, welcoming, and largely conservative country. Modest dress at religious sites, asking before photographing people, and a friendly greeting go a long way. A few words of Arabic are always appreciated." },
      { title: "Check official advice", body: "Before and during your trip, review your own government's travel advice for Egypt, and follow any guidance from your guides on the ground. We plan around official information and keep a Cairo team on call throughout your trip." },
    ],
    disclaimer: "This page offers general travel guidance only and is not medical, legal, or safety advice. Conditions change — always confirm current health recommendations with a qualified professional and check your own government's official travel advice before you go.",
    ctaHeading: "Traveling with us?",
    ctaBody: "We handle the logistics so you can focus on the trip. Have a specific health or access need? Tell us and we'll plan around it.",
    ctaPrimary: "Browse tours",
    ctaSecondary: "Ask about your needs",
    breadcrumb: "Health & Safety",
  },

  // ── Family Travel (/family-travel) ──
  familyTravel: {
    eyebrow: "Travel with kids",
    title: "Family travel in Egypt",
    lede: "Egypt might be the best family trip you never expected. It's adventurous without being difficult, endlessly fascinating for every age, and — with the right pacing and a private guide — genuinely relaxing for the grown-ups too.",
    whyHeading: "Why families love Egypt",
    why: [
      { title: "It brings history to life", body: "Pyramids you can walk up to, tombs painted in colour, mummies behind glass — Egypt turns the pages of a schoolbook into something kids can actually stand in front of. It's the rare trip that thrills every age at once." },
      { title: "Adventure at every turn", body: "A camel ride at Giza, a horse-drawn caleche in Luxor, a felucca sail on the Nile, snorkeling over a coral reef — the days are full of the kind of moments children remember for years." },
      { title: "A warm welcome for families", body: "Egyptian culture adores children, and families are welcomed everywhere with genuine warmth. Traveling with kids often opens doors — and conversations — that solo travelers never see." },
    ],
    howHeading: "How we plan family trips",
    how: [
      { title: "Pacing built for younger legs", body: "We keep sightseeing to the cooler morning hours, build in pool time and rest, and never cram a day. A great family trip has white space in it — time to just be somewhere remarkable." },
      { title: "Private by default", body: "Private guides and transport mean the day flexes to your family's mood and nap schedule, not a coach timetable. Need to head back early? No problem." },
      { title: "Guides who are great with kids", body: "We match families with guides who know how to tell a story a ten-year-old will lean into — turning hieroglyphs into a code to crack and gods into characters worth meeting." },
      { title: "The right places to stay", body: "We choose hotels with family rooms and pools, and we're happy to arrange cots, connecting rooms, and early check-ins where they're available. Tell us your ages and we'll tailor everything." },
    ],
    ctaHeading: "Planning a family trip?",
    ctaBody: "Tell us your children's ages and what they love, and we'll shape a private itinerary that keeps everyone happy — including you.",
    ctaPrimary: "See family tours",
    ctaSecondary: "Plan a family trip",
    breadcrumb: "Family travel",
  },

  // ── Responsible Travel (/responsible-travel) ──
  responsibleTravel: {
    eyebrow: "Travel with care",
    title: "Responsible travel",
    lede: "We live here, so this isn't abstract for us. Protecting Egypt's heritage and supporting the communities who steward it is simply how we want to run a travel company — and how we'd want others to travel in our home.",
    commitmentsHeading: "Our commitments",
    commitments: [
      { title: "Protecting the sites", body: "Egypt's monuments have to outlast all of us. We follow site rules to the letter, keep groups small to limit wear, and never encourage touching carvings or straying from marked paths. The photo is never worth the damage." },
      { title: "Supporting local communities", body: "We employ Egyptian guides, drivers, and teams, buy from local suppliers, and build in visits to family-run workshops and eateries where your spending stays in the community rather than leaking out of it." },
      { title: "Fair work for guides", body: "Our guides are licensed professionals, paid fairly and treated as the experts they are. A trip that runs on underpaid labour isn't a trip we're willing to sell." },
      { title: "Lighter on the environment", body: "We cut single-use plastic where we can, favour reef-safe practices on the Red Sea, and plan efficient routes to reduce needless travel. Small choices, made on every trip, add up." },
    ],
    helpHeading: "How you can help",
    help: [
      { title: "Refill, don't buy", body: "Bring a reusable bottle — we'll help you refill safely rather than working through a case of plastic each day." },
      { title: "Choose reef-safe", body: "On the coast, pack reef-safe sunscreen, keep your distance from coral, and never touch or feed marine life. Our dive guides will show you how." },
      { title: "Buy well", body: "Support genuine local craft over mass-produced souvenirs, and never buy anything claiming to be a genuine antiquity — it's illegal and it fuels looting." },
      { title: "Travel with respect", body: "Ask before photographing people, dress modestly at religious sites, and meet the warmth of Egyptian hospitality with your own. Good travel is a two-way street." },
    ],
    ctaHeading: "Travel that gives back",
    ctaBody: "Every Ptah trip is built to tread lightly and support the people who make Egypt what it is. Come see it the right way.",
    ctaPrimary: "Browse tours",
    ctaSecondary: "Ask about our approach",
    breadcrumb: "Responsible travel",
  },

  // ── Accessibility (/accessibility) ──
  accessibility: {
    eyebrow: "Accessible travel",
    title: "Accessibility",
    lede: "We want Egypt to be open to as many travelers as possible — on this website and on the ground. Here's where we stand today, and how to tell us what you need so we can plan the right trip for you.",
    websiteHeading: "This website",
    website: [
      { title: "How we build this site", body: "We aim to follow recognised web accessibility guidance: clear structure and headings, meaningful alternative text, keyboard-navigable menus and controls, visible focus states, and colour contrast chosen for readability." },
      { title: "An ongoing effort", body: "Accessibility is never finished. We keep testing and improving, and we know some corners will fall short. If something on this site is hard to use with your device or assistive technology, we want to hear about it." },
    ],
    tripsHeading: "Accessible trips",
    trips: [
      { title: "Tell us early", body: "The more we know, the better we plan. Share your access needs when you enquire — mobility, vision, hearing, dietary, or anything else — and we'll build the trip around them rather than bolting them on at the end." },
      { title: "The reality on the ground", body: "Egypt's ancient sites vary widely: some have ramps and smooth paths, while others involve uneven ground, steps, or narrow tomb passages. We'll be honest about what each site involves so you can decide what's right for you." },
      { title: "Private, adaptable pacing", body: "Private guides and transport let us slow the pace, add rest, choose step-free routes where they exist, and swap a demanding site for a rewarding alternative. Your day flexes to you." },
      { title: "Practical support", body: "We can advise on accessible hotels, arrange suitable vehicles, and plan around mobility aids and medical needs. Where we can't make something fully accessible, we'll say so plainly and suggest the best alternative." },
    ],
    feedbackHeading: "Found a problem, or have a need to share?",
    feedbackBody: "If any part of this site is difficult to use, or you'd like to talk through access needs for a trip, please get in touch. We'll respond personally and do our best to help — and to fix anything on the site that's getting in your way.",
    ctaHeading: "Let's plan a trip that works for you",
    ctaBody: "Tell us what you need and we'll be honest about what's possible — then build the best trip around it.",
    ctaPrimary: "Talk to us",
    ctaSecondary: "Browse tours",
    breadcrumb: "Accessibility",
  },

  // ── Visa & Entry (/visa) ──
  visa: {
    eyebrow: "Entry & visa",
    title: "Egypt visa & entry guidance",
    lede: "Most visitors need a visa to enter Egypt, and for many nationalities the process is straightforward. The notes below are a general orientation only — entry rules change often and vary by passport, so treat this as a starting point, not the final word.",
    disclaimerHeading: "Please read first",
    disclaimerBody: "Entry requirements change — always confirm current rules with official Egyptian government sources and your local embassy or consulate before you travel. Ptah Tours can point you in the right direction, but we can't issue visas or guarantee entry, and nothing here should be taken as legal or immigration advice.",
    portalHeading: "The official e-Visa portal",
    portalPre: "Egypt operates an official online visa system where eligible travellers can apply before they fly. It's the safest, most reliable route — apply directly through the government portal at",
    portalLink: "visa2egypt.gov.eg",
    portalPost: "and be wary of third-party sites that copy its look and charge extra. Check your eligibility and processing times there well ahead of your trip.",
    arrivalHeading: "Visa on arrival",
    arrivalPre: "Travellers of many nationalities have historically been able to obtain a visa on arrival at major Egyptian airports. Whether this applies to you, and under what conditions, depends on your passport and can change — so confirm your specific situation with",
    arrivalLink: "the official portal",
    arrivalPost: "or your embassy before relying on it. When in doubt, applying online in advance removes the guesswork.",
    validityHeading: "Passport validity",
    validityBody: "As a general rule, plan to hold a passport with at least six months' validity beyond your date of entry, plus a blank page or two for stamps. Requirements differ by nationality, so verify the exact rules for your passport with your local embassy or consulate before you book flights.",
    zonesHeading: "Special zones and regions",
    zonesBody: "Some regions and resort areas have had their own entry arrangements in the past, and rules for specific ports of entry or overland crossings can differ from the standard tourist visa. If your trip involves anything beyond the usual airport arrival, confirm the details for your exact route with official sources — and feel free to ask us what to check.",
    confirmHeading: "Where to confirm — every time",
    confirmPre: "Before you travel, verify your requirements against two authoritative sources: Egypt's official e-Visa portal at",
    confirmLink: "visa2egypt.gov.eg",
    confirmPost: "and your own country's embassy or consulate for Egypt. Rules can shift with little notice, so check close to your departure rather than relying on older information — including this page.",
    ctaHeading: "Sorted on paperwork? Let's plan the trip",
    ctaBody: "Once your entry is squared away, we'll handle the rest. Browse tours or tell us what you have in mind.",
    ctaPrimary: "Browse tours",
    ctaSecondary: "Start planning",
    breadcrumb: "Visa",
  },

  // ── FAQs (/faqs) ──
  faqs: {
    eyebrow: "Good to know",
    title: "Frequently asked questions",
    lede: "The questions we hear most, answered plainly. Can't find what you're after? Reach out — a real person on our Cairo team will get back to you.",
    groups: [
      {
        heading: "Booking & payment",
        items: [
          { q: "How do I book a tour?", a: "Pick a tour and a departure date, then follow the booking steps. If you'd rather talk it through first — or want a private, tailored version — start a conversation on our contact page and we'll take it from there." },
          { q: "How far in advance should I book?", a: "For the cool October-to-April peak, we suggest booking a few months ahead, since the best guides and departures fill up. Off-peak and last-minute trips are often possible too — ask and we'll tell you honestly what's still open." },
          { q: "Can I change or cancel my booking?", a: "Yes. Changes and cancellations are handled per the terms shown at checkout and on our refunds and cancellation page. If your plans shift, get in touch early and we'll do what we can to help." },
        ],
      },
      {
        heading: "Before you go",
        items: [
          { q: "Do I need a visa?", a: "Most visitors do. Many nationalities can obtain an e-visa or a visa on arrival, but rules change and depend on your passport. See our visa guide for general guidance, and always confirm with an official Egyptian government source or your nearest embassy before you travel." },
          { q: "Is Egypt safe to visit?", a: "The tourist regions we operate in — Cairo, Luxor, Aswan, and the Red Sea coast — routinely welcome visitors from around the world. We plan around official guidance, keep a local team on call, and share practical health and safety tips ahead of every trip. Check your own government's travel advice as well." },
          { q: "When is the best time to visit?", a: "October to April is the classic window — warm days, cool evenings, and comfortable temple weather in the south. Summer is hotter but quieter and better value, and the Red Sea is a year-round exception. Our when-to-visit guide breaks it down by season." },
        ],
      },
      {
        heading: "On the tour",
        items: [
          { q: "What's included in the price?", a: "Each tour page lists exactly what's included and what isn't — typically your guiding, listed transfers, and stated entrance fees, with international flights and personal extras kept separate. The price you see is the price you pay; there are no surprise line items at the gate." },
          { q: "How big are the groups?", a: "We cap group sizes and default to private departures, so the pace bends to you. If you prefer to travel just with your own party, most tours can be made fully private — just ask." },
          { q: "Are your guides licensed?", a: "Yes. Every tour is led by a licensed Egyptologist guide who reads the sites for you rather than reciting a script, and who times each visit so you see it at its best, not its busiest." },
          { q: "Can you tailor an itinerary for me?", a: "That's our favorite kind of trip. Tell us your dates, interests, and pace, and we'll shape a private itinerary around them — adding a felucca afternoon, a slow morning at Giza, or a few days on the reef." },
        ],
      },
    ],
    ctaHeading: "Still have a question?",
    ctaBody: "Ask us anything — from dietary needs to accessibility to the best week to travel. We're happy to help you plan.",
    ctaPrimary: "Ask a question",
    ctaSecondary: "Browse tours",
    breadcrumb: "FAQs",
  },

  // ── About (/about) ──
  about: {
    eyebrow: "About Ptah Tours",
    title: "Egypt, curated by the people who call it home",
    intro: "Ptah Tours is a Cairo-based team of Egyptologists, guides, and trip designers. We build private and small-group journeys across Egypt — from the pyramids of Giza to the temples of the south and the quiet of the Nile — for travelers who want more than a photo stop.",
    storyHeading: "Our story",
    storyParagraphs: [
      "Ptah Tours began with a simple frustration: too many people were leaving Egypt having seen the monuments but never really understood them. Rushed coaches, crowded noon visits, guides reading from a laminated card — the country deserved better, and so did the people who traveled so far to see it.",
      "So we built the company we wished existed. Named for Ptah, the Memphite god of craftsmen and makers, we treat every itinerary as something to be crafted — sequenced around light and crowds, led by people who have spent their lives with these sites, and paced so there is room to actually take it in.",
      "Today we welcome travelers from around the world, but the heart of the company hasn't moved: it's still a team in Cairo who love this place and want you to love it too.",
    ],
    promisesHeading: "What we promise",
    promises: [
      { title: "Licensed Egyptologist guides", body: "Every tour is led by a licensed Egyptologist — not a script. They read the walls, answer the hard questions, and time each site so you see it at its best, not its busiest." },
      { title: "Honest, all-in pricing", body: "The price you see is the price you pay. Entrance fees, transfers, and the details are laid out before you book — no surprise line items at the temple gate." },
      { title: "Small groups, private by default", body: "We cap group sizes and default to private departures so the pace bends to you. Slow mornings at Giza, an extra hour in the Valley of the Kings — the day is yours." },
      { title: "Local, year-round", body: "We live here. When plans shift — a strike, a heatwave, a closed tomb — a Cairo phone number picks up, and someone who knows the ground sorts it out." },
    ],
    valuesHeading: "How we travel",
    values: [
      { title: "Respect for the places we visit", body: "Egypt's heritage outlasts all of us. We travel in ways that protect the sites and support the communities who steward them." },
      { title: "Depth over checklists", body: "We would rather you understand one temple than photograph ten. Our itineraries leave room to linger, ask, and actually remember the day." },
      { title: "Care in the details", body: "The right guide, the cool side of the coach, water when you need it. Good travel is a thousand small decisions made on your behalf." },
    ],
    teamHeading: "Our Egyptologists",
    teamIntro: "Every Ptah journey is led by a licensed Egyptologist — a professional guide trained in Egypt's history and archaeology, and licensed by the Ministry of Tourism and Antiquities. They're the reason a visit becomes an understanding.",
    team: [
      { title: "Licensed Egyptologist guides", body: "Our guides trained in Egyptology and hold official guiding licences. They read the sites for you — the stories in the reliefs, the reasons behind the ruins — rather than reciting a script." },
      { title: "Trip designers", body: "Behind every itinerary is a planner who sequences your days around light and crowds, matches you to the right guide, and sweats the logistics so the trip feels effortless." },
      { title: "On-the-ground support", body: "A Cairo-based team keeps every trip running and stays reachable throughout — the local number that always picks up when plans need to flex." },
    ],
    accreditationsHeading: "Accreditations & partners",
    accreditationsIntro: "We hold ourselves to recognised industry standards and work with established travel partners — so the people you trust with your trip are accountable to more than just us.",
    accreditations: [
      { name: "ETF", note: "Member 2026" },
      { name: "Travelife", note: "Partner" },
      { name: "Egypt Air", note: "Official carrier partner" },
      { name: "IATA", note: "Accredited agent" },
    ],
    accreditationsNote: "See these partners referenced across our site footer. For verification details, contact us any time.",
    ctaHeading: "Ready to see Egypt properly?",
    ctaBody: "Browse our tours or tell us what you have in mind — we'll help you shape the trip.",
    ctaPrimary: "Browse tours",
    ctaSecondary: "Start planning",
    /** Photo band inserted after the Values section (real-trip photography). */
    photoBand: {
      eyebrow: "In the field",
      heading: "Real journeys, real faces",
      blurb:
        "A few photographs from recent Ptah trips — our travelers, their guides, and the Egypt they came to see.",
      cta: "See all photos",
    },
    breadcrumb: "About",
  },

  // ── Careers (/careers) ──
  careers: {
    eyebrow: "Join the team",
    title: "Careers at Ptah Tours",
    intro: "We're a Cairo-based team who love this country and want travelers to love it too. If that sounds like your kind of work, we'd like to hear from you — even when we're not actively hiring.",
    rolesHeading: "The roles we hire for",
    rolesIntro: "These describe the kinds of people we look for. We're not always actively recruiting for each, but we always want to meet good ones.",
    roles: [
      { title: "Egyptologist guides", body: "Licensed guides who can read a temple wall and hold a room — turning three thousand years of history into a day people never forget. Fluency in a second language beyond Arabic is a real plus." },
      { title: "Trip designers", body: "Detail-obsessed planners who craft private itineraries: sequencing sites around light and crowds, matching guides to travelers, and sweating the logistics so the trip feels effortless." },
      { title: "Travel support & operations", body: "The people on the ground and on the phone who keep trips running — coordinating transfers and hotels, solving the unexpected, and being the calm Cairo voice that always picks up." },
      { title: "Content & storytelling", body: "Writers, photographers, and editors who can capture Egypt honestly and make our journal and tour pages sing — without ever overselling the place." },
    ],
    valuesHeading: "Why work with us",
    values: [
      { title: "Local expertise, valued", body: "We're an Egyptian company that pays and treats its team as the experts they are. Guiding here is a profession, not a gig." },
      { title: "Care over volume", body: "We'd rather run fewer, better trips. If you take pride in the details, you'll fit right in." },
      { title: "Room to grow", body: "As we grow, our team grows with us. We back people who want to deepen their craft and take on more." },
    ],
    ctaHeading: "Introduce yourself",
    ctaBody: "Tell us who you are, what you do, and why Egypt. Send a note through our contact page and it'll reach the right person.",
    ctaPrimary: "Get in touch",
    ctaSecondary: "About Ptah Tours",
    breadcrumb: "Careers",
  },

  // ── Press (/press) ──
  press: {
    eyebrow: "Press & media",
    title: "Media resources",
    intro: "Writing about Egyptian travel, guiding, or responsible tourism? We're glad to help with accurate information, imagery, and interviews. Here's where to start.",
    factsHeading: "Company at a glance",
    facts: [
      { label: "Company", value: "Ptah Tours" },
      { label: "Based in", value: "Cairo, Egypt" },
      { label: "What we do", value: "Private & small-group tours across Egypt" },
      { label: "Guiding", value: "Licensed Egyptologist guides" },
    ],
    kitHeading: "In the media kit",
    kit: [
      { title: "Company background", body: "A concise overview of who we are, how we work, and the story behind the name — everything you need for an accurate mention or profile." },
      { title: "Imagery", body: "A selection of high-resolution photography from our own field archive, cleared for editorial use with credit. Tell us what you need and we'll send suitable selects." },
      { title: "Spokespeople", body: "Our team can speak to Egyptian travel, guiding, responsible tourism, and destination trends. We're happy to arrange interviews and provide quotes on request." },
    ],
    ctaHeading: "Press enquiries",
    ctaBody: "Request the media kit, high-resolution imagery, or an interview through our contact page — mark your message “Press” and we'll route it to the right person and reply promptly.",
    ctaPrimary: "Contact our press team",
    ctaSecondary: "About Ptah Tours",
    breadcrumb: "Press",
  },

  // ── Reviews (/reviews) ──
  reviews: {
    eyebrow: "Trust & reviews",
    title: "Reviews & accreditations",
    intro: "The best measure of a trip is how travelers describe it afterwards. Here's what people tell us — and the industry bodies whose standards we hold ourselves to.",
    testimonialsHeading: "What travelers say",
    testimonials: [
      { quote: "Our guide read the temples like a book — we came away actually understanding what we'd seen, not just photographing it. The private pace made all the difference with two tired kids.", attribution: "A family, United Kingdom" },
      { quote: "Everything was arranged before we arrived, right down to the early starts that kept us ahead of the crowds and the heat. Honest pricing, no surprises, and a local number that always picked up.", attribution: "A couple, Canada" },
      { quote: "The felucca afternoon in Aswan was the highlight of three weeks across the region. Someone clearly builds these trips because they love the place, not just to sell them.", attribution: "A solo traveler, Australia" },
    ],
    accreditationsHeading: "Accreditations & partners",
    accreditations: [
      { name: "ETF", note: "Member 2026" },
      { name: "Travelife", note: "Partner" },
      { name: "Egypt Air", note: "Official carrier partner" },
      { name: "IATA", note: "Accredited agent" },
    ],
    ctaHeading: "Traveled with us?",
    ctaBody: "We'd love to hear how it went — your feedback shapes every trip that follows.",
    ctaPrimary: "Share your experience",
    ctaSecondary: "Browse tours",
    breadcrumb: "Reviews",
  },

  // ── Newsletter (/newsletter) ──
  newsletter: {
    eyebrow: "Stay in touch",
    title: "The Ptah Tours newsletter",
    intro: "A little Egypt in your inbox. Sign up for stories from our team, seasonal travel tips, and the rare quiet-season offer — sent sparingly, never as spam.",
    perksHeading: "What you'll get",
    perks: [
      { title: "Stories worth reading", body: "Field notes from our team — the places we love, the ones we keep quiet, and how to get the most from both." },
      { title: "Seasonal know-how", body: "When to go where, what's opening, and the practical tips that make an Egypt trip smoother." },
      { title: "The occasional offer", body: "Now and then, a quiet-season departure or a small deal — sent sparingly, only when it's genuinely good." },
    ],
    subscribeHeading: "Subscribe",
    subscribeSubtext: "Enter your email and you're in.",
    breadcrumb: "Newsletter",
  },

  // ── Login (/login) ──
  login: {
    heading: "Welcome back",
    subtext: "Sign in to continue your journey with Ptah Tours.",
    disabledMessage: "Sign-in is temporarily unavailable. Please check back shortly.",
    emailLabel: "Email",
    passwordLabel: "Password",
    forgotPasswordLink: "Forgot password?",
    submit: "Log in",
    signupPromptPre: "Don't have an account?",
    signupPromptLink: "Sign up",
    /** Server-action error/pending strings (returned by loginAction). */
    errorDisabled: "Sign-in is temporarily unavailable. Please try again later.",
    errorRateLimit: "Too many attempts. Please wait a minute and try again.",
    errorGeneric: "Email or password is incorrect.",
    errorUnverified: "Please confirm your email before signing in. Check your inbox for the confirmation link, or request a new one.",
    working: "Please wait…",
  },

  // ── Register (/register) ──
  register: {
    heading: "Create your account",
    subtext: "Join Ptah Tours and start planning your next journey.",
    disabledMessage: "New account registration is temporarily unavailable. Please check back shortly.",
    nameLabel: "Full name",
    emailLabel: "Email",
    passwordLabel: "Password",
    confirmPasswordLabel: "Confirm password",
    submit: "Create account",
    loginPromptPre: "Already have an account?",
    loginPromptLink: "Log in",
    /** Server-action error/pending strings (returned by registerAction). */
    errorDisabled: "New account registration is temporarily unavailable.",
    errorRateLimit: "Too many attempts. Please wait a minute and try again.",
    errorPasswordMismatch: "Passwords don't match",
    errorCheckDetails: "Please check your details.",
    errorGeneric: "We couldn't create your account. If you already have one, try logging in or resetting your password.",
    working: "Please wait…",
  },

  // ── Forgot Password (/forgot-password) ──
  forgotPassword: {
    heading: "Reset your password",
    subtext: "Enter your email and we'll send you a link to set a new password.",
    doneMessage: "If an account exists for that email, we've sent a link to reset your password. The link expires in one hour.",
    backToLoginLink: "Back to login",
    emailLabel: "Email",
    submit: "Send reset link",
    loginPromptPre: "Remembered it?",
    loginPromptLink: "Log in",
    /** Server-action error/pending strings (returned by forgotPasswordAction). */
    errorRateLimit: "Too many requests. Please wait a minute and try again.",
    working: "Please wait…",
  },

  // ── Reset Password (/reset-password) ──
  resetPassword: {
    heading: "Set a new password",
    subtext: "Choose a new password for your account.",
    invalidMessage: "This reset link is missing or malformed. Please request a new one.",
    requestLink: "Request a reset link",
    doneMessage: "Your password has been reset and you've been signed out of all devices. You can now log in with your new password.",
    loginLink: "Go to login",
    passwordLabel: "New password",
    confirmPasswordLabel: "Confirm new password",
    submit: "Reset password",
    /** Server-action error/pending strings (returned by resetPasswordAction). */
    errorRateLimit: "Too many attempts. Please wait a minute and try again.",
    errorPasswordMismatch: "Passwords don't match",
    errorCheckDetails: "Please check your details.",
    errorTokenInvalid: "This reset link is invalid or has expired. Please request a new one.",
    working: "Please wait…",
  },

  // ── Verify Email (/verify-email) ──
  verifyEmail: {
    heading: "Confirm your email",
    subtext: "We've sent a confirmation link to your inbox. Click it to activate your account. Didn't get it? Enter your email below and we'll send another.",
    successHeading: "Email confirmed",
    successBody: "Your email is confirmed — you can now sign in to your account.",
    continueLink: "Continue to login",
    errorHeading: "Link expired or invalid",
    doneMessage: "If your account still needs confirming, we've sent a fresh link. It expires in 24 hours.",
    backToLoginLink: "Back to login",
    emailLabel: "Email",
    submit: "Resend confirmation link",
    loginPromptPre: "Already confirmed?",
    loginPromptLink: "Log in",
    /** Server-action / page error + pending strings (resendVerificationAction, verify page). */
    errorRateLimit: "Too many requests. Please wait a minute and try again.",
    errorTokenInvalid: "This confirmation link is invalid or has expired. Enter your email below and we'll send a fresh one.",
    working: "Please wait…",
  },

  // ── Account (/account) ──
  account: {
    heading: "Your account",
    bookingsHeading: "Your bookings",
    emptyBookingsPre: "No bookings yet.",
    emptyBookingsLink: "Browse tours",
    emptyBookingsPost: ".",
    savedHeading: "Saved tours",
    savedEmpty: "Nothing saved yet. Tap the heart on any tour to save it here.",
    savedFromLabel: "From",
    changePasswordHeading: "Change password",
    changePasswordSubtext: "Updating your password signs you out of all other devices.",
    logout: "Log out",
    currentPasswordLabel: "Current password",
    newPasswordLabel: "New password",
    confirmPasswordLabel: "Confirm new password",
    passwordUpdatedMessage: "Password updated. Other devices have been signed out.",
    changePasswordSubmit: "Update password",
  },

  // ── Track Booking (/track-booking) ──
  trackBooking: {
    eyebrow: "Track booking",
    heading: "Track your booking",
    intro: "Enter your booking reference and the email you used to book. We'll show your trip and its latest status.",
    referenceLabel: "Booking reference",
    referencePlaceholder: "e.g. 3f9c1a7e-2b6d-4085-a1f0-…",
    emailLabel: "Email used to book",
    emailPlaceholder: "you@example.com",
    searching: "Searching…",
    submit: "Find my booking",
    tourLabel: "Tour",
    departureLabel: "Departure",
    travelersLabel: "Travelers",
    totalLabel: "Total",
    bookedOnLabel: "Booked on",
    downloadVoucher: "Download voucher (PDF)",
    viewTour: "View tour",
    needHelp: "Need help?",
  },

  // ── Booking Success (/booking/success) ──
  bookingSuccess: {
    confirmedHeading: "You're booked!",
    receivedHeading: "Payment received",
    confirmedBody: "Your booking is confirmed. Keep this receipt — you'll need the reference to manage or track your trip.",
    receivedBody: "Thanks — your payment went through. We're finalizing your confirmation now. Keep this receipt handy.",
    receiptLabel: "Booking receipt",
    referenceLabel: "Booking reference",
    tourLabel: "Tour",
    departureLabel: "Departure",
    returnsLabel: "Returns",
    travelersLabel: "Travelers",
    subtotalLabel: "Subtotal",
    discountLabel: "Discount",
    totalPaidLabel: "Total paid",
    totalDueLabel: "Total due",
    confirmationToLabel: "Confirmation to",
    footerPre: "Thank you for booking with Ptah Tours. Questions about your trip?",
    footerLink: "Contact us",
    footerPost: "and quote your booking reference.",
    downloadVoucher: "Download voucher (PDF)",
    trackBooking: "Track this booking",
    viewTour: "View this tour",
  },

  // ── Booking Pending (/booking/pending) ──
  bookingPending: {
    heading: "Booking request received",
    body: "We've reserved your seats and our team will be in touch to arrange secure payment. Nothing has been charged yet — quote the request reference below when you contact us.",
    requestReferenceLabel: "Request reference",
    tourLabel: "Tour",
    departureLabel: "Departure",
    travelersLabel: "Travelers",
    estimatedTotalLabel: "Estimated total",
    downloadVoucher: "Download voucher (PDF)",
    browseMoreTours: "Browse more tours",
  },

  // ── Booking Cancelled (/booking/cancelled) ──
  bookingCancelled: {
    heading: "Checkout cancelled",
    body: "No payment was taken. Your seats aren't reserved — the held seats are released automatically, so you can try again whenever you're ready.",
    tryAgain: "Try booking again",
    browseTours: "Browse tours",
    needHelp: "Need help? Contact us",
  },

  // ── Booking Bank Transfer (/booking/bank-transfer) ──
  bookingBankTransfer: {
    eyebrow: "Almost there",
    heading: "Complete your booking by bank transfer",
    intro: "We've reserved your seats. Transfer the total below quoting your booking reference, and we'll confirm your place as soon as the funds arrive. Nothing has been charged automatically.",
    referenceLabel: "Booking reference",
    tourLabel: "Tour",
    departureLabel: "Departure",
    travelersLabel: "Travelers",
    amountToTransferLabel: "Amount to transfer",
    transferDetailsHeading: "Transfer details",
    /** Receiving bank account rows (BankDetails component). */
    accountNameLabel: "Account name",
    accountNumberLabel: "Account number",
    ibanLabel: "IBAN",
    bicLabel: "BIC / SWIFT",
    bankCurrencyLabel: "Account currency",
    copyLabel: "Copy",
    copiedLabel: "Copied",
    transferHelpPre: "Transfers usually clear within one to three business days. If anything looks unclear,",
    transferHelpPost: "and we'll walk you through it.",
    noInstructionsPre: "Our team will email you the bank account details for this booking shortly. If you don't receive them within one business day,",
    noInstructionsLink: "contact us",
    noInstructionsPost: "quoting your booking reference above.",
    reminderPre: "Always include your booking reference",
    reminderPost: "so we can match your payment. Your seats are held while you arrange the transfer.",
    downloadVoucher: "Download voucher (PDF)",
    browseMoreTours: "Browse more tours",
  },

  // ── Booking (/booking/[tourSlug]) ──
  bookingTour: {
    breadcrumbTours: "Tours",
    breadcrumbBook: "Book",
    eyebrow: "Booking",
    noSeatsTitle: "No seats available right now.",
    /** No-seats block renders as: "{noSeatsPre} {noSeatsLink} {noSeatsPost}". */
    noSeatsPre: "All upcoming departures are full.",
    noSeatsLink: "Contact us",
    noSeatsPost: "to arrange a private date.",
    nextHeading: "What happens next",
    step1: "Pick your date and travelers, then enter your details.",
    step3: "Get instant confirmation and a receipt by email.",
    /**
     * Payment "step 2" copy is assembled from the enabled methods. The method
     * words below are joined with {listSeparator}/{listConjunction} into a
     * human list that replaces {methods} in payStep2Template. When only bank
     * transfer is enabled, payStep2BankOnly is used verbatim instead.
     */
    methodCard: "card",
    methodPaypal: "PayPal",
    methodBankTransfer: "bank transfer",
    listSeparator: ", ",
    listConjunction: " or ",
    payStep2Template: "Pay by {methods}. Your seats are held while you complete checkout.",
    payStep2BankOnly: "Get our bank details and pay by transfer. Your seats are held until we confirm receipt.",
    noteStripe: "Card payments are processed securely by Stripe — Ptah Tours never sees your card details.",
    notePaypal: "PayPal payments are completed on PayPal's secure pages.",
    noteBankTransfer: "Bank transfers are confirmed once funds are received.",
    /** Shown in place of the booking form when the tour has online booking
     *  paused (Tour.bookingClosed). Renders as "{closedPre} {closedLink} {closedPost}". */
    closedTitle: "Online booking is paused",
    closedPre: "This tour isn't taking online bookings right now.",
    closedLink: "Contact us",
    closedPost: "to arrange your trip.",
    /** Static labels inside the BookingForm client island. */
    form: {
      departureLegend: "Choose your departure",
      soldOut: "Sold out",
      remaining: "{count} left",
      /** P8 calendar: shown instead of the departure list when the tour takes
       *  customer-chosen dates. */
      dateLegend: "Choose your travel date",
      dateHelp: "Pick any date that suits you. We confirm your guide and pickup time for that morning.",
      calendarLabel: "Travel date calendar",
      prevMonth: "Previous month",
      nextMonth: "Next month",
      dateUnavailable: "Not available",
      /** "{date}" is the long-form chosen date. */
      dateSelected: "Travelling on {date}",
      datePlaceholder: "No date chosen yet — pick a day above.",
      /** "{date}" is the earliest bookable date. */
      earliestDate: "Earliest available date: {date}",
      /** Submit is blocked until a day is picked. */
      dateRequired: "Choose your travel date to continue.",
      travelersLegend: "Travelers",
      /** Per-passenger-type stepper labels. Children/infants only appear when the
       *  tour prices them. Price per person is appended from the tour data. */
      adultsLabel: "Adults",
      childrenLabel: "Children",
      infantsLabel: "Infants",
      perPerson: "per person",
      free: "Free",
      /** Stepper aria labels: {label} = the passenger-type label above. */
      decrease: "Decrease {label}",
      increase: "Increase {label}",
      upTo: "Up to {max} on this departure",
      /** P8 calendar mode: capacity is per-date, so the cap is about party size. */
      upToParty: "Up to {max} travelers on one booking",
      selectDeparture: "Select a departure",
      /** P8 group-size pricing table inside the form. */
      groupPricing: {
        heading: "Price per person by group size",
        note: "Your rate follows your party size — the more of you travel, the less each person pays.",
        sizeColumn: "Group size",
        priceColumn: "Per person",
        single: "{min} traveler",
        range: "{min}–{max} travelers",
        rangeOpen: "{min}+ travelers",
        activeBadge: "Your rate",
      },
      detailsLegend: "Your details",
      fullName: "Full name",
      email: "Email",
      phone: "Phone",
      notes: "Notes",
      optional: "(optional)",
      notesPlaceholder: "Dietary needs, accessibility, arrival details…",
      pickupLabel: "Pickup point",
      pickupPlaceholder: "Hotel or address for pickup",
      billingLegend: "Billing address",
      addressLine1: "Address line 1",
      addressLine2: "Address line 2",
      city: "City",
      region: "State / region",
      postalCode: "Postal / ZIP code",
      country: "Country",
      selectCountry: "Select a country",
      paymentLegend: "Payment method",
      methodCardLabel: "Card",
      methodCardBlurb: "Pay securely by card via Stripe.",
      methodPaypalLabel: "PayPal",
      methodPaypalBlurb: "Pay with your PayPal account.",
      methodBankLabel: "Bank transfer",
      methodBankBlurb: "Get bank details and pay by transfer; we confirm on receipt.",
      summaryBankNote: "Your seats are held while you arrange the transfer; we confirm on receipt.",
      summaryOnlineNote: "Full payment is taken now via secure checkout.",
      /** Discount-code block (P5). The Apply button previews the code against the
       *  chosen departure + travelers; the server re-checks it when you pay. */
      couponLegend: "Discount code",
      couponPlaceholder: "Enter a code",
      couponApply: "Apply",
      couponApplying: "Applying…",
      couponRemove: "Remove",
      couponApplied: "Code applied.",
      /** Summary line for the applied discount: {code} = the coupon code. */
      couponSummaryLabel: "Discount ({code})",
      totalAfterDiscount: "Total",
      /** SubmitButton renders "{label} · {total}" (total appended in code). */
      continueToBank: "Continue to bank details",
      continueToPayment: "Continue to payment",
      working: "Working…",
      footerBank: "We'll show you the bank details and your booking reference next. Your seats are held while you transfer.",
      footerOnline: "You'll be redirected to complete payment. Your seats are held while you check out.",
    },
  },

  // ── Trip Builder (/manage/trip-builder) ──
  tripBuilder: {
    breadcrumbTitle: "Trip builder",
    eyebrow: "Plan with us",
    heading: "Trip builder",
    intro: "Your Egypt trip starts as a shortlist. Save the tours that speak to you, review them here, and we'll weave them into one private journey.",
    tablistLabel: "Trip builder",
    tabPlan: "Plan a trip",
    tabBookmarks: "Bookmarks",
    planHeading: "Build your Egypt trip",
    planIntro: "Start by browsing our tours and bookmarking the ones that catch your eye — they'll gather under the Bookmarks tab. When you're ready, send us your shortlist and we'll shape a single private itinerary around it, tuned to your dates, pace, and interests.",
    planSteps: [
      "Browse tours and tap the bookmark icon to save any you like.",
      "Open the Bookmarks tab to review your shortlist in one place.",
      "Send it to us — we'll turn it into one seamless, private trip.",
    ],
    browseTours: "Browse tours",
    talkToDesigner: "Talk to a trip designer",
    bookmarksHeading: "Your bookmarks",
    /** Saved-count line renders as: "{savedLine} {sendShortlist}." with {unit} = savedTour/savedTours. */
    savedTour: "tour",
    savedTours: "tours",
    savedLine: "{count} saved {unit}. Ready to plan?",
    sendShortlist: "Send us your shortlist",
    emptyBody: "You haven't saved any tours yet. Browse the catalog and tap the bookmark icon on any tour to add it here.",
  },

  // ── Tours listing (/tours) ──
  tours: {
    breadcrumb: "Tours",
    eyebrow: "All tours",
    headingDefault: "Find your Egypt journey",
    /** Destination heading: {name} = the destination name. */
    headingDestination: "Tours in {name}",
    /** Tag heading: {label} = the tour-type label. */
    headingTag: "{label} tours",
    /** Used for both the heading and the active-filter chip. */
    departingSoon: "Departing soon",
    intro: "Private and small-group departures with licensed Egyptologist guides. Prices are per person; seats update live as travelers book.",
    filteredBy: "Filtered by",
    removeFilter: "(remove filter)",
    clearAll: "Clear all",
    allDestinations: "All destinations",
    /** aria-label for the destination-filter nav. */
    filterByDestination: "Filter by destination",
    emptyTitle: "No tours match this filter.",
    /** Empty state renders as: "{emptyPre} {emptyLink}{emptyPost}". */
    emptyPre: "Try a different combination, or",
    emptyLink: "browse everything",
    emptyPost: ".",
  },

  // ── Cities listing (/cities) ──
  cities: {
    breadcrumb: "Cities",
    eyebrow: "Cities",
    title: "Every city on our",
    emphasis: "map.",
    description: "All six currently sit within Egypt — more will be added as our other country programs launch.",
  },

  // ── Countries listing (/countries) ──
  countries: {
    breadcrumb: "Countries",
    eyebrow: "Destinations",
    title: "Every country we",
    emphasis: "operate in.",
    description: "Egypt is where our itineraries run deepest today. The rest of the region is opening up one city at a time.",
  },

  // ── Events listing (/events) ──
  events: {
    breadcrumb: "Events",
    eyebrow: "Events & festivals",
    heading: "Egypt's cultural calendar",
    intro: "From the twice-yearly sun alignment at Abu Simbel to local moulids and seasonal celebrations, these are the moments worth planning a trip around. Ask us to build any of them into your itinerary.",
    /** Shown in place of a missing event image. */
    heroFallback: "Egypt",
    emptyTitle: "No events published yet.",
    /** Empty state renders as: "{emptyPre} {emptyLink} {emptyPost}". */
    emptyPre: "Check back soon, or",
    emptyLink: "ask us",
    emptyPost: "what's happening during your travel dates.",
  },

  // ── Trip Ideas listing (/trip-ideas) ──
  tripIdeas: {
    breadcrumb: "Trip ideas",
    eyebrow: "Trip ideas",
    heading: "Ways to see Egypt",
    intro: "Every traveler is different. These are our favorite ways into Egypt — each one a short guide paired with the real tours that bring it to life.",
    /** Shown in place of a missing trip-idea image. */
    heroFallback: "Egypt",
    /** Per-card count: singular/plural of "tour". */
    tourUnit: "tour",
    tourUnitPlural: "tours",
    emptyTitle: "No trip ideas published yet.",
    /** Empty state renders as: "{emptyPre} {emptyLink}{emptyPost}". */
    emptyPre: "In the meantime,",
    emptyLink: "browse every tour",
    emptyPost: ".",
  },

  // ── Blog / Journal listing (/blog) ──
  blog: {
    breadcrumb: "Journal",
    eyebrow: "The journal",
    heading: "Stories from Egypt",
    intro: "Field notes from our team on the ground — the places we send travelers, the ones we keep for ourselves, and how to get the most out of both.",
    latest: "Latest",
    /** Shown in place of a missing post image. */
    heroFallback: "Egypt",
    /** Reading-time suffix: renders as "{minutes} min read". */
    minRead: "min read",
  },

  // ── Search results (/search) ──
  search: {
    breadcrumb: "Search",
    eyebrow: "Search",
    /** Results heading: {query} = the search term. */
    headingResults: "Results for “{query}”",
    headingDefault: "Search Ptah Tours",
    /** Count line: {count} = number, {unit} = resultUnit/resultUnitPlural. */
    resultUnit: "tour",
    resultUnitPlural: "tours",
    introResults: "{count} {unit} match your search.",
    introDefault: "Search our journeys by name, destination, or theme.",
    inputAriaLabel: "Search trips and destinations",
    inputPlaceholder: "Pyramids, Nile cruise, Alexandria…",
    submit: "Search",
    /** No-results title: {query} = the search term. */
    noResultsTitle: "No tours match “{query}”.",
    /** No-results block renders as: "{noResultsPre} {noResultsLink}{noResultsPost}". */
    noResultsPre: "Try a broader term, or",
    noResultsLink: "browse every tour",
    noResultsPost: ".",
  },

  // ── Advanced tours finder (shared filter/sort/paginate UI on /tours + /search) ──
  toursFinder: {
    /** Accessible label for the whole filter form. */
    formLabel: "Filter and sort tours",
    searchLabel: "Search",
    searchPlaceholder: "Pyramids, Nile cruise, Alexandria…",
    destinationLabel: "Destination",
    anyDestination: "Any destination",
    typeLabel: "Tour type",
    anyType: "Any type",
    lengthLabel: "Trip length",
    anyLength: "Any length",
    difficultyLabel: "Difficulty",
    anyDifficulty: "Any difficulty",
    difficultyEasy: "Easy",
    difficultyModerate: "Moderate",
    difficultyChallenging: "Challenging",
    priceMinLabel: "Min price",
    priceMaxLabel: "Max price",
    departingSoonLabel: "Departing soon",
    sortLabel: "Sort by",
    sortFeatured: "Featured",
    sortPriceAsc: "Price: low to high",
    sortPriceDesc: "Price: high to low",
    sortDurationAsc: "Duration: short to long",
    sortDurationDesc: "Duration: long to short",
    sortSoonest: "Departing soonest",
    applyButton: "Apply",
    clearAll: "Clear all",
    resultUnit: "tour",
    resultUnitPlural: "tours",
    /** Results summary: {from}–{to} of {total} {unit}. */
    resultsRange: "Showing {from}–{to} of {total} {unit}",
    emptyTitle: "No tours match your filters.",
    emptyBody: "Try removing a filter or broadening your search.",
    /** Accessible label for the pagination nav. */
    paginationLabel: "Search results pages",
    prev: "Previous",
    next: "Next",
    /** Per-page-link label: {n} = page number. */
    pageAria: "Go to page {n}",
  },

  // ── Tour detail (/tours/[slug]) ──
  tourDetail: {
    breadcrumbTours: "Tours",
    /** Shown in place of a missing hero image. */
    heroFallback: "Egypt",
    /** Gallery alt text: {title} = tour title, {n} = image number. */
    galleryAlt: "{title} — view {n}",
    /** Duration unit: singular/plural of "day". */
    dayUnit: "day",
    daysUnit: "days",
    difficultyEasy: "Easy",
    difficultyModerate: "Moderate",
    difficultyChallenging: "Challenging",
    /** Meta row: {count} = number of upcoming departures. */
    upcomingDepartures: "{count} upcoming departures",
    overview: "Overview",
    itinerary: "Itinerary",
    included: "What's included",
    notIncluded: "Not included",
    goodToKnow: "Good to know",
    availability: "Availability & departures",
    availabilityIntro: "Choose a date to book. Seats update live.",
    /** Notice in the availability section when online booking is paused tour-wide. */
    bookingPausedNotice: "Online booking is paused for this tour right now. Contact us and we'll arrange your dates directly.",
    faqHeading: "Frequently asked questions",
    fromLabel: "From",
    perPerson: "/person",
    durationLabel: "Duration",
    difficultyLabel: "Difficulty",
    departuresLabel: "Departures",
    /** Sidebar departures value: {count} = number upcoming. */
    upcomingCount: "{count} upcoming",
    seeDatesBook: "See dates & book",
    enquireDates: "Enquire about dates",
    paymentNote: "Full payment at secure checkout. Free cancellation policies vary by tour.",
    /** Departure availability list (rendered by DepartureList). */
    departureList: {
      empty: "No scheduled departures right now. Contact us and we'll arrange a private date for your group.",
      toPrefix: "to",
      soldOut: "Sold out",
      onlyLeft: "Only {count} left",
      seatsLeft: "{count} seats left",
      perPerson: "/person",
      bookThisDate: "Book this date",
      /** Shown on a departure's button when online booking is paused tour-wide. */
      bookingPaused: "Booking paused",
      /** P8: replaces the list for tours that run on the traveler's own dates. */
      onRequestTitle: "Travel on your own dates",
      onRequestBody: "This tour runs on request. Pick the date that suits you at checkout and we'll confirm your guide for that morning.",
      onRequestCta: "Choose your date",
      /** Shown alongside the list when scheduled dates exist AND dates are also
       *  on request — the traveler can do either. */
      onRequestAlso: "Prefer a different day? You can pick your own date at checkout.",
    },
    /** P8 group-size pricing table on the tour detail page. */
    groupPricing: {
      heading: "Price per person by group size",
      note: "Rates are per person. Larger groups pay less each — your party size picks the rate automatically at checkout.",
      sizeColumn: "Group size",
      priceColumn: "Per person",
      single: "{min} traveler",
      range: "{min}–{max} travelers",
      rangeOpen: "{min}+ travelers",
      activeBadge: "Your rate",
    },
  },

  // ── City detail (/cities/[slug]) ──
  cityDetail: {
    breadcrumbCountries: "Countries",
    /** Eyebrow fallback when the city's country is unknown. */
    destinationFallback: "Destination",
    /** Section heading: {name} = city name. */
    toursHeading: "Tours in {name}",
    /** Empty-tours state: {name} = city name. */
    emptyToursTitle: "{name} journeys are coming soon.",
    emptyToursBody: "We haven't published tours here yet — explore other Egypt destinations in the meantime.",
    popularExperiences: "Popular experiences",
    thingsToDo: "Things to do",
    bestTimeToVisit: "Best time to visit",
    gettingThere: "Getting there",
    faqHeading: "Frequently asked questions",
    relatedCities: "Related cities",
    /** CTA heading: {name} = city name. */
    ctaHeading: "Ready to explore {name}?",
    browseTours: "Browse Tours",
    askQuestion: "Ask us a question",
  },

  // ── Country detail (/countries/[slug]) ──
  countryDetail: {
    breadcrumbCountries: "Countries",
    overview: "Overview",
    popularCities: "Popular cities",
    emptyCitiesTitle: "City guides are coming soon.",
    /** Empty-cities state: {name} = country name. */
    emptyCitiesBody: "We're still building out {name}'s city pages. In the meantime, explore where our itineraries already run.",
    exploreEgypt: "Explore Egypt",
    featuredTours: "Featured tours",
    /** Empty-tours state: {name} = country name. */
    emptyToursTitle: "{name} tours are coming soon.",
    emptyToursBody: "We're finalizing itineraries for this destination — check back shortly, or explore tours already running in Egypt.",
    browseAllTours: "Browse all tours",
    /** Section heading: {name} = country name. */
    whyVisitHeading: "Why visit {name}",
    thingsToDo: "Things to do",
    bestTimeToVisit: "Best time to visit",
    gettingThere: "Getting there",
    faqHeading: "Frequently asked questions",
    /** CTA heading: {name} = country name. */
    ctaHeading: "Explore {name} tours",
    ctaBody: "Tell us your dates and we'll put together an itinerary, or browse what's already running.",
    browseTours: "Browse Tours",
    talkToUs: "Talk to us",
  },

  // ── Event detail (/events/[slug]) ──
  eventDetail: {
    breadcrumbEvents: "Events",
    /** Shown in place of a missing hero image. */
    heroFallback: "Egypt",
    /** Date suffix for recurring events; renders as " · {heldAnnually}". */
    heldAnnually: "held annually",
    ctaHeading: "Want to be there?",
    ctaBody: "Tell us your dates and we'll build this event into a private itinerary — guides, transfers, and the best vantage points sorted.",
    planTrip: "Plan a trip around this",
    browseTours: "Browse tours",
  },

  // ── Trip idea detail (/trip-ideas/[slug]) ──
  tripIdeaDetail: {
    breadcrumbTripIdeas: "Trip ideas",
    /** Shown in place of a missing hero image. */
    heroFallback: "Egypt",
    eyebrow: "Trip idea",
    toursHeading: "Tours for this trip",
    /** Empty state renders as: "{emptyPre} {emptyLink} {emptyPost}". */
    emptyPre: "We're still curating tours for this idea.",
    emptyLink: "Tell us what you have in mind",
    emptyPost: "and we'll tailor one.",
    ctaHeading: "Want it your way?",
    ctaBody: "Every trip can be made private and shaped around your dates, pace, and interests.",
    ctaPrimary: "Plan a custom version",
    ctaSecondary: "See all tours",
  },

  // ── Blog / Journal post detail (/blog/[slug]) ──
  blogDetail: {
    breadcrumbJournal: "Journal",
    /** Shown in place of a missing hero image. */
    heroFallback: "Egypt",
    eyebrow: "Journal",
    /** Byline renders as: "{byPrefix} {author} · {date} · {minutes} {minRead}". */
    byPrefix: "By",
    minRead: "min read",
    /** Image credit renders as: "{imageCreditPrefix} {credit}". */
    imageCreditPrefix: "Image:",
    ctaHeading: "Want to see it for yourself?",
    ctaBody: "We build private and small-group trips around exactly these kinds of days. Tell us what caught your eye.",
    ctaPrimary: "Browse tours",
    ctaSecondary: "Start planning",
    backToJournal: "← Back to the journal",
  },

  // ── Gallery (/gallery) + landing "Real travelers" showcase ──
  gallery: {
    eyebrow: "Real travelers, real moments",
    title: "The Ptah Tours gallery",
    intro:
      "Real photographs from recent journeys — our travelers and their guides at the temples, deserts and Nile villages of Egypt. No stock imagery, just the trips as they happened.",
    breadcrumb: "Gallery",
    /** Masonry grid + filter + lightbox control labels (GalleryGrid island). */
    grid: {
      galleryAria: "Photo gallery",
      filterGroupAria: "Filter photos by category",
      filters: {
        all: "All photos",
        guests: "Our travelers",
        temples: "Temples & monuments",
        sinaiDesert: "Sinai & Bedouin nights",
        nileNubia: "Nile & Nubia",
      },
      /** counter is a "{current} of {total}" template. */
      lightbox: {
        close: "Close",
        prev: "Previous photo",
        next: "Next photo",
        zoomIn: "Zoom in",
        zoomOut: "Zoom out",
        counter: "{current} of {total}",
      },
    },
    /** Landing-page filmstrip carousel over the featured photos. */
    showcase: {
      eyebrow: "Real travelers, real moments",
      title: "Moments from real Ptah journeys",
      blurb:
        "Not stock photos — actual guests and the Egypt they came to see. Swipe through a few, then browse the full gallery.",
      cta: "See all photos",
      prev: "Previous slide",
      next: "Next slide",
    },
  },

  landing: {
    /** Homepage Luxor & Aswan tour grid (FocusTours). */
    focusTours: {
      heading: "Luxor & Aswan Tours",
      intro: "Guided days through Upper Egypt's temples, tombs and islands — priced per person, bookable on the date that suits you.",
      cta: "View all tours",
    },
    journalCta: "Read the journal",
    faqsCta: "See all FAQs",
  },

  // APPEND_MARKER
} ;

export type PageContent = typeof enPages;
