import { siteOrigin } from "@/lib/login-id";
import {
  additionalOutletPrice,
  email,
  eventStandeePrice,
  eventsPagePath,
  facebookUrl,
  instagramUrl,
  launchOfferEndsLabel,
  listPrice,
  phoneDisplay,
  price,
  productBrochurePath,
  productPagePath,
  siteDescription,
  siteName,
  whoItsForPagePath,
  whyDifferentPagePath,
} from "@/lib/site";

export function GET() {
  const origin = siteOrigin();
  const body = `# ${siteName}

> ${siteDescription}

${siteName} does not post Google reviews. The guest edits the draft and taps Post on Google.

## Prices
- Everyday QR standee: ${price} for one business, including setup and standee delivery. Standard price ${listPrice} after ${launchOfferEndsLabel}.
- Extra outlet: ${additionalOutletPrice}.
- Event standee: ${eventStandeePrice} per standee, print and delivery included.

## Pages
- Home: ${origin}/
- How it works: ${origin}${productPagePath}
- Why we are different: ${origin}${whyDifferentPagePath}
- Who it's for: ${origin}${whoItsForPagePath}
- Events: ${origin}${eventsPagePath}
- Pricing: ${origin}/pricing
- Contact: ${origin}/contact
- Brochure: ${origin}${productBrochurePath}

## Contact
- Email: ${email}
- Phone: ${phoneDisplay}
- Instagram: ${instagramUrl}
- Facebook: ${facebookUrl}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
