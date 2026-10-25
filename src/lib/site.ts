export const whatsappUrl = "https://wa.me/917007052267";
export const phoneHref = "tel:+917007052267";
export const phoneDisplay = "+91 7007052267";
export const email = "zustscan@gmail.com";
export const emailHref = "mailto:zustscan@gmail.com";
export const instagramUrl = "https://instagram.com/zustscan";
export const instagramHandle = "@zustscan";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/who-its-for", label: "Who it’s for" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
] as const;

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
    body: "Service, product, Good or Better or Best, and the stars.",
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
  },
  {
    step: "02",
    title: "Scan and choose",
    body: "The guest scans and picks the service that matches the visit, such as Food, Room, or Amenities.",
  },
  {
    step: "03",
    title: "Set how it felt",
    body: "They pick the product, then Good, Better, or Best, and the star rating they want to give.",
  },
  {
    step: "04",
    title: "Get an editable draft",
    body: "Those choices become a short review they can read, rewrite, or extend before anything is posted.",
  },
  {
    step: "05",
    title: "Copy and Continue",
    body: "One tap copies the draft and opens that business’s Google review page.",
  },
  {
    step: "06",
    title: "Check and post",
    body: "The guest confirms the stars and the words, then taps Post themselves.",
  },
] as const;

export const audiences = [
  {
    title: "Restaurant",
    body: "A table card, menu, or takeaway bag. Guests pick what they ordered and how the visit felt.",
    tags: ["Food", "Service", "Ambience"],
  },
  {
    title: "Hotel",
    body: "The stay is broken into the services you set up. Food, Room, and Amenities are the usual start.",
    tags: ["Food", "Room", "Amenities"],
  },
  {
    title: "Retail",
    body: "A counter card, receipt, or shelf display. Guests review the product and the checkout.",
    tags: ["Product", "Staff", "Checkout"],
  },
  {
    title: "Service",
    body: "A receipt, follow-up, or job sheet after the work. Guests describe that visit in their own words.",
    tags: ["Visit", "Work", "Follow-up"],
  },
] as const;

export const businessSets = [
  "Services, and the products inside each one",
  "Contact number",
  "Google review link",
  "A short brief of the business",
] as const;

export const guestDecides = [
  "Which service and product to mention",
  "Good, Better, or Best, and the stars",
  "The wording, including any edits",
  "The final tap on Post",
] as const;

export const listPrice = "₹5,499";
export const price = "₹3,499";
export const launchOfferSavings = "₹2,000";
export const launchOfferHeadline = "Launch offer — save ₹2,000";
export const launchOfferEndsLabel = "31 December 2026";
export const launchOfferFinePrint =
  "Intro price for new businesses while launch slots last in your city. Standard price returns to ₹5,499 after the offer ends.";

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
  "Your business dashboard shows anonymous counts — scans, drafts, and Copy & Continue — so you know guests are using the QR without storing names or review text.";

export const roiPricingPoints = [
  {
    title: "One-time setup",
    amount: price,
    body: "Includes standee delivery, guest page, services/products, and AI drafts in English, Hindi, or Hinglish.",
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
      "Business name, phone, Google review link (g.page), a short brief, and what guests should pick (Food, Room, products, etc.). We do the rest.",
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
  "Guest path from the scan to the stars",
  "An AI draft with Copy and Continue",
  "Phone, map link, and a short brief on the page",
  "Owner dashboard with scan, draft, and Copy & Continue counts",
] as const;
