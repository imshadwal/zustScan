function isGoogleMapsUrl(url: URL) {
  const host = url.hostname.toLowerCase();
  if (host === "maps.app.goo.gl") return true;
  if (host === "goo.gl" && url.pathname.startsWith("/maps")) return true;
  if (host === "maps.google.com") return true;
  if (host === "share.google.com" || host === "share.google") return true;
  if (host === "google.com" || host === "www.google.com") {
    return url.pathname.startsWith("/maps");
  }
  if (host.endsWith(".google.com") && url.pathname.startsWith("/maps")) return true;
  return false;
}

export function normalizeBusinessName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function isValidBusinessName(value: string) {
  const name = normalizeBusinessName(value);
  return name.length >= 2 && name.length <= 80;
}

export function normalizePhone(value: string) {
  const digits = value.replace(/[^\d+]/g, "");
  if (digits.startsWith("+91")) {
    const rest = digits.slice(3).replace(/\D/g, "");
    return rest.length === 10 ? `+91${rest}` : null;
  }
  const only = digits.replace(/\D/g, "");
  if (only.length === 10) return `+91${only}`;
  if (only.length === 12 && only.startsWith("91")) return `+${only}`;
  return null;
}

export function isValidPhoneInput(value: string) {
  return normalizePhone(value) !== null;
}

export function normalizeMapLink(value: string) {
  let trimmed = value.trim();
  if (!trimmed) return null;
  if (/^share\.google\//i.test(trimmed)) {
    trimmed = `https://share.google.com/${trimmed.replace(/^https?:\/\//i, "").replace(/^share\.google\/?/i, "")}`;
  }
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") return null;
    if (!isGoogleMapsUrl(url)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function isValidMapLinkInput(value: string) {
  return normalizeMapLink(value) !== null;
}

export function normalizeBrief(value: string) {
  return value.trim();
}

export function isValidBrief(value: string) {
  const brief = normalizeBrief(value);
  return brief.length >= 20 && brief.length <= 2000;
}

export function normalizeCatalogName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function isValidCatalogName(value: string) {
  const name = normalizeCatalogName(value);
  return name.length >= 1 && name.length <= 80;
}

export const MAX_SERVICES = 20;
export const MAX_PRODUCTS_PER_SERVICE = 50;

export type SetupChecklist = {
  businessName: boolean;
  phone: boolean;
  mapLink: boolean;
  brief: boolean;
  hasService: boolean;
  everyServiceHasProduct: boolean;
  complete: boolean;
  missingLabels: string[];
};

export function evaluateSetup(input: {
  businessName: string | null;
  phone: string | null;
  mapLink: string | null;
  brief: string | null;
  services: { productCount: number }[];
}): SetupChecklist {
  const businessName = Boolean(
    input.businessName && isValidBusinessName(input.businessName),
  );
  const phone = Boolean(input.phone && normalizePhone(input.phone));
  const mapLink = Boolean(input.mapLink && normalizeMapLink(input.mapLink));
  const brief = Boolean(input.brief && isValidBrief(input.brief));
  const hasService = input.services.length >= 1;
  const everyServiceHasProduct =
    hasService && input.services.every((service) => service.productCount >= 1);

  const missingLabels: string[] = [];
  if (!businessName) missingLabels.push("Business name");
  if (!phone) missingLabels.push("Phone");
  if (!mapLink) missingLabels.push("Google Maps link");
  if (!brief) missingLabels.push("Brief");
  if (!hasService) missingLabels.push("At least one service");
  if (hasService && !everyServiceHasProduct) {
    missingLabels.push("At least one product on every service");
  }

  const complete =
    businessName && phone && mapLink && brief && hasService && everyServiceHasProduct;

  return {
    businessName,
    phone,
    mapLink,
    brief,
    hasService,
    everyServiceHasProduct,
    complete,
    missingLabels,
  };
}
