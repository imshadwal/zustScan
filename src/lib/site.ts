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

export const planIncludes = [
  "One QR for the business",
  "Services and the products under each service",
  "Guest path from the scan to the stars",
  "An AI draft with Copy and Continue",
  "Phone, map link, and a short brief on the page",
] as const;
