import { siteOrigin } from "@/lib/login-id";
import {
  email,
  eventStandeeIncludes,
  eventStandeePrice,
  eventStandeeTeaserBody,
  facebookUrl,
  instagramUrl,
  launchOfferEndsLabel,
  launchOfferFinePrint,
  listPrice,
  phoneDisplay,
  planIncludes,
  price,
  pricingFaq,
  siteDescription,
  siteName,
} from "@/lib/site";

function inrAmount(label: string) {
  return label.replace(/[^\d]/g, "");
}

function offerEndDate() {
  const match = launchOfferEndsLabel.match(/(\d{1,2}) ([A-Za-z]+) (\d{4})/);
  if (!match) return undefined;
  const [, day, monthName, year] = match;
  const month = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ].indexOf(monthName.toLowerCase());
  if (month < 0) return undefined;
  const date = new Date(Date.UTC(Number(year), month, Number(day)));
  return date.toISOString().slice(0, 10);
}

export function organizationSchema() {
  const origin = siteOrigin();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: origin,
    logo: `${origin}/logo.png`,
    description: siteDescription,
    email,
    telephone: phoneDisplay.replace(/[^\d+]/g, ""),
    sameAs: [instagramUrl, facebookUrl],
  };
}

export function everydayOfferSchema() {
  const origin = siteOrigin();
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Zust Scan QR standee",
    description: planIncludes.join(" "),
    brand: { "@type": "Brand", name: siteName },
    url: `${origin}/pricing`,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: inrAmount(price),
      url: `${origin}/pricing`,
      availability: "https://schema.org/InStock",
      priceValidUntil: offerEndDate(),
      description: `${launchOfferFinePrint} Standard price ${listPrice}.`,
    },
  };
}

export function eventOfferSchema() {
  const origin = siteOrigin();
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Zust Scan event standee",
    description: `${eventStandeeTeaserBody} ${eventStandeeIncludes.join(" ")}`,
    brand: { "@type": "Brand", name: siteName },
    url: `${origin}/events`,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: inrAmount(eventStandeePrice),
      url: `${origin}/events`,
      availability: "https://schema.org/InStock",
      description: "Per standee, print and delivery included.",
    },
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pricingFaq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
