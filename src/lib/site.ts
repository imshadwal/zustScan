export const whatsappUrl = "https://wa.me/917007052267";

export function whatsappUrlWithText(text: string) {
  return `${whatsappUrl}?text=${encodeURIComponent(text)}`;
}

/** Pre-filled message when enquiring from the /events page. */
export const eventStandeeWhatsappMessage = "Hey, I want to order the standee.";
export const eventStandeeWhatsappUrl = whatsappUrlWithText(eventStandeeWhatsappMessage);
export const phoneHref = "tel:+917007052267";
export const phoneDisplay = "+91 7007052267";
export const email = "zustscan@gmail.com";
export const emailHref = "mailto:zustscan@gmail.com";
export const instagramUrl = "https://instagram.com/zustscan";
export const instagramHandle = "@zustscan";
export const facebookUrl = "https://www.facebook.com/profile.php?id=61595962884025";
export const facebookLabel = "Facebook";

/** Shown on /c/[loginId] when admin has paused the guest QR. */
export const guestQrPausedCopy = {
  eyebrow: "Account paused",
  headline: "Your account has been paused.",
  body: "Guest reviews through this QR are turned off until an administrator reactivates it. Please get in touch with Zust Scan to restore access.",
  contactLead: "Contact the administrator:",
} as const;

/** Guest path — six steps from scan to Google post. */
export const productPagePath = "/how-it-works" as const;

export const whyDifferentPagePath = "/why-different" as const;

export const whoItsForPagePath = "/who-its-for" as const;

export const eventsPagePath = "/events" as const;

/** Nav / headings for event & function standees (/events). */
export const forEventsLabel = "For events" as const;

export const otherNavLabel = "Other" as const;

export const otherNavLinks = [
  {
    href: productPagePath,
    label: "How it works",
    description: "Six steps from QR scan to Google post, and what you configure.",
  },
  {
    href: whyDifferentPagePath,
    label: "Why we are different",
    description: "Languages, voice, speed, branding, and your portal analytics.",
  },
  {
    href: whoItsForPagePath,
    label: "Who it's for",
    description: "Restaurants, hotels, retail, salons, and service businesses.",
  },
] as const;

/** Top bar — deeper product pages live under Other. */
export const navLinks = [
  { href: "/", label: "Home" },
  { href: eventsPagePath, label: forEventsLabel },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
] as const;

export const whyDifferentPage = {
  eyebrow: "Why we are different",
  title: "Built for real guest visits — not generic review spam.",
  description:
    "Multilingual drafts, natural Hindi and Hinglish voice, branded guest pages, and honest funnel counts in your portal.",
} as const;

export const whoItsForPage = {
  eyebrow: "Who it's for",
  title: "Any business a guest can review after a real visit.",
  description:
    "You name the services and products. The guest only chooses what matches their experience — at the table, counter, room, or function.",
} as const;

export const productBrochurePath = "/brochure";

/** Short guest path shown on the home timeline and footer. */
export const journeyTimeline = [
  {
    step: "01",
    title: "Scan",
    body: "The guest opens your page from the QR where the visit happens.",
  },
  {
    step: "02",
    title: "Choose",
    body: "Service, product, Good or Great or Exceptional, and the stars.",
  },
  {
    step: "03",
    title: "Draft",
    body: "An editable review built from what they picked.",
  },
  {
    step: "04",
    title: "Post",
    body: "Copy, open Google, paste, and tap Post themselves.",
  },
] as const;

export const journey = [
  {
    step: "01",
    title: "Place the QR",
    body: "Put it on a menu, table card, parcel, receipt, or the counter, where the guest already is.",
    tags: ["MENU", "TABLE CARD", "COUNTER"],
  },
  {
    step: "02",
    title: "Scan and choose",
    body: "The guest scans and picks the service that matches the visit, such as Food, Room, or Amenities.",
    tags: ["SERVICE", "PRODUCT"],
  },
  {
    step: "03",
    title: "Set how it felt",
    body: "They pick the product, then Good, Great, or Exceptional, and the star rating they want to give.",
    tags: ["GOOD · GREAT · EXCEPTIONAL", "STARS"],
  },
  {
    step: "04",
    title: "Get an editable draft",
    body: "Those choices become a short review they can read, rewrite, or extend before anything is posted.",
    tags: ["ENGLISH", "HINDI", "HINGLISH"],
  },
  {
    step: "05",
    title: "Copy and Continue",
    body: "One tap copies the draft and opens that business’s Google review page.",
    tags: ["COPY", "GOOGLE"],
  },
  {
    step: "06",
    title: "Check and post",
    body: "The guest confirms the stars and the words, then taps Post themselves.",
    tags: ["GUEST POSTS", "REAL REVIEW"],
  },
] as const;

export const whyDifferent = [
  {
    id: "languages",
    step: "01",
    title: "Reviews in multiple languages",
    body: "Guests pick the language on your page. Drafts match — not a one-size English template.",
    chips: ["English", "Hindi", "Hinglish"],
  },
  {
    id: "voice",
    step: "02",
    title: "Gender-based review voice",
    body: "For Hindi and Hinglish, neutral, female, or male voice so verbs sound natural when they post.",
    chips: ["Neutral", "Female", "Male"],
  },
  {
    id: "analytics",
    step: "03",
    title: "Analytics & setup checklist",
    body: "Your portal tracks setup progress plus anonymous funnel counts — scans, drafts, and Copy & Continue. No guest names or review text stored.",
    chips: ["Setup checklist", "Scans", "Copy & Continue"],
  },
  {
    id: "speed",
    step: "04",
    title: "10 sec scan to publish",
    body: "QR → service → stars → copy → Google. Built for speed at the table or counter.",
    highlight: "10 sec",
  },
  {
    id: "no-app",
    step: "05",
    title: "100% zero app required",
    body: "Mobile browser only. No store download, no guest login — scan and go.",
    highlight: "0 apps",
  },
  {
    id: "branding",
    step: "06",
    title: "Your brand on the guest page",
    body: "Logo upload, six colour themes, and a proper first screen — business name, city, address, contact, and Why trust us before guests pick services.",
    chips: ["Logo", "6 themes", "Trust line"],
  },
  {
    id: "category",
    step: "07",
    title: "Category-smart profile",
    body: "Hotels, Cafe, Hospitality, Digital Marketing, Others, and more. AI Generate writes a Why trust us line from your category — it also feeds review drafts.",
    chips: ["Categories", "AI Generate", "Others OK"],
  },
] as const;

export const audiences = [
  {
    title: "Restaurant & cafe",
    body: "Table card, menu, or counter QR. Guests pick what they ordered and how the visit felt.",
    tags: ["Food", "Service", "Ambience"],
  },
  {
    title: "Hotels & hospitality",
    body: "Lobby or room card. Break the stay into Food, Room, Amenities — or your own services.",
    tags: ["Stay", "Food", "Service"],
  },
  {
    title: "Retail & salon",
    body: "Receipt, checkout, or appointment follow-up. Reviews mention the product or service they got.",
    tags: ["Product", "Staff", "Visit"],
  },
  {
    title: "Digital & professional",
    body: "Agencies, clinics, education, real estate — pick a category and AI-generate a Why trust us line on your profile.",
    tags: ["Projects", "Clients", "Visits"],
  },
] as const;

export const businessSets = [
  "Services, and the products inside each one",
  "Category (Hotels, Cafe, Hospitality, and more — or Others with your own type)",
  "Business name, city, address, phone, and Google review link",
  "Why trust us — AI Generate from your category, then edit (also used for review drafts)",
  "Guest page look: logo upload and one of six colour themes",
] as const;

export const guestDecides = [
  "Which service and product to mention",
  "Good, Great, or Exceptional, and the stars",
  "The wording, including any edits",
  "The final tap on Post",
] as const;

export const listPrice = "₹5,499";
export const price = "₹3,499";
export const launchOfferSavings = "₹2,000";
export const launchOfferHeadline = "Festive Offer — save ₹2,000";
export const launchOfferEndsLabel = "31 December 2026";
export const launchOfferFinePrint =
  "Festive price for new businesses while offer slots last in your city. Standard price returns to ₹5,499 after the offer ends.";

export const eventStandeePrice = "₹5,999/-";
export const eventStandeeImagePath = "/images/event-standee-sign.jpg";
export const eventStandeeCaption =
  "Customised QR on a wooden easel standee — floor display and delivery included";
export const eventStandeeTeaserBody =
  "A QR and guest page built for your function — guests review the night they had, not a generic blurb.";
export const eventStandeeEnquiryLead =
  "Tell us your event, venue, and date — we customise the QR, standee, and guest path, then deliver before the function.";
export const eventStandeeHeroHighlights = [
  "Custom QR and standee for weddings, birthdays, and corporate nights",
  "Guest page tuned to food, hall, staff, and ambience — reviews fit the event",
  "Drafts in English, Hindi, or Hinglish; guests post on Google themselves",
] as const;
export const eventStandeeIncludes = [
  "Customised QR and standee print",
  "Branded guest page for the function",
  "Setup, delivery, and placement guide",
] as const;
export const additionalOutletPrice = "₹2,499";
export const referralDiscountAmount = "₹500";
export const referralProgramSummary =
  "Refer another business: when their setup goes live, you both get ₹500 off your next invoice or add-on.";
export const multiLocationSummary = `Second outlet (same brand): ${additionalOutletPrice} add-on — separate QR and guest page, one shared setup call.`;

/** Illustrative funnel numbers for marketing / brochure (not live data). */
export const marketingAnalyticsDemo = {
  pageViews: 2,
  draftsGenerated: 2,
  copyContinueTaps: 2,
} as const;

export const ownerAnalyticsTitle = "See the funnel in your portal";
export const ownerAnalyticsBody =
  "Your business dashboard tracks setup progress, plus anonymous counts — scans, drafts, and Copy & Continue — without storing guest names or review text.";

export const roiPricingPoints = [
  {
    title: "One-time setup",
    amount: price,
    body: "Includes standee delivery, branded guest page (category, trust line, theme), services/products, and AI drafts in English, Hindi, or Hinglish.",
  },
  {
    title: "Compare to ads",
    amount: "₹3,000–₹8,000/mo",
    body: "Many local businesses spend this much on Meta or Google ads without a single new Google review.",
  },
  {
    title: "One strong review",
    amount: "Priceless locally",
    body: "A specific 4★ review about your biryani or room helps the next guest choose you — Zust Scan makes that easier at the table.",
  },
] as const;

/** Standalone offerings beyond the everyday counter/table QR plan. */
export const otherProductsPage = {
  eyebrow: forEventsLabel,
  title: "Customised QR for weddings, corporate events, and more.",
  description:
    "Your everyday Zust Scan works at the table or counter. For any function or gathering, we tailor the QR, standee art, and guest page to your event — so reviews describe the night your guests actually attended.",
} as const;

export const otherProducts = [
  {
    id: "event-standee",
    title: "Event & function standee",
    price: eventStandeePrice,
    badge: "Custom event QR · AI draft",
    priceNote: "Per standee — customised QR, guest page, print, and delivery for your event.",
    tagline: "Lawns, hotels, and banquet halls — weddings, birthdays, corporate nights.",
    body:
      "We customise the QR and standee for your event — services, theme, and what you want guests to mention. Place it at the exit, near billing, or beside the favours table. Guests scan once, pick what mattered that evening (food, hall, staff, ambience), and get an editable review draft that matches their visit — in English, Hindi, or Hinglish — then post on Google themselves.",
    idealFor: [
      "Banquet halls and marriage lawns",
      "Hotel banquet and rooftop events",
      "Large birthday and anniversary functions",
    ],
    howItWorks: [
      {
        title: "Brief your event",
        detail:
          "Tell us the function type and what guests should see — e.g. Food, Hall, Staff, Décor.",
      },
      {
        title: "We customise QR & page",
        detail:
          "Your standee art, QR, and guest path are built for that night — same honest flow as the main plan.",
      },
      {
        title: "Deliver & place",
        detail:
          "We print and ship the easel standee; staff set it where guests pause with their phones.",
      },
      {
        title: "Reviews that match",
        detail:
          "Guests scan, pick what mattered, edit the draft, and post on Google. Pause the QR after the event if you like.",
      },
    ],
    placement: [
      "Exit gate or staircase — natural pause after the function",
      "Near billing or reception — while waiting for car or invoice",
      "Favours / gift table — guests already have phones out",
    ],
    note: "Reviews should reflect a real visit. Customised QR helps guests write about the event they joined — food, hall, and hospitality they experienced at your venue.",
  },
] as const;

export const pricingFaq = [
  {
    question: "Do you post Google reviews for us?",
    answer:
      "No. The guest picks stars and words, edits the draft, and taps Post themselves on Google. Zust Scan never submits a review.",
  },
  {
    question: "Is this allowed by Google?",
    answer:
      "Yes when it stays honest: guests write their own review. We only help with a draft they can change or ignore.",
  },
  {
    question: "Google opened blank — what now?",
    answer:
      "That is normal. After Copy & Continue, paste the text and set the same star rating on Google’s form. Our guest screen walks them through it.",
  },
  {
    question: "How long until we are live?",
    answer:
      "Usually a few days after we have your Google review link, services/products list, and standee delivery address.",
  },
  {
    question: "What do you need from us?",
    answer:
      "Business name, category, phone, Google review link (g.page), address, a Why trust us line (AI Generate in your portal), and services/products for guests to pick. Logo and guest page theme are optional extras.",
  },
  {
    question: "Hidden fees or monthly rent?",
    answer: `One plan at ${price} for the first location includes setup and standee delivery. Optional second outlet: ${additionalOutletPrice}. Referral credit: ${referralDiscountAmount} each when both businesses activate.`,
  },
] as const;

/** Shown on pricing, brochure, and key marketing blocks. */
export const setupStandeeTitle = "Complete setup, standee delivered";
export const setupStandeeLine =
  "We handle the full setup for you — services, products, guest page, and QR — and deliver your standee to your address once setup is done.";

export const planIncludes = [
  "Complete setup and QR standee delivered to your address",
  "One QR for the business",
  "Services and the products under each service",
  "Branded guest page: city, address, contact, Why trust us, logo, theme",
  "Category-aware profile with optional Others and generated trust copy",
  "Guest path from scan to stars, language, and AI draft with Copy & Continue",
  "Owner dashboard with scan, draft, and Copy & Continue counts",
] as const;
