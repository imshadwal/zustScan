import {
  isValidBusinessName,
  isValidCity,
  isValidMapLinkInput,
  isValidPhoneInput,
  isValidWhyTrustUs,
  normalizeMapLink,
  normalizePhone,
} from "@/lib/business-validation";
import type { StandeeType } from "@/lib/standee-type";

export type EventSetupChecklist = {
  businessName: boolean;
  city: boolean;
  category: boolean;
  phone: boolean;
  mapLink: boolean;
  eventName: boolean;
  eventDate: boolean;
  hasArea: boolean;
  complete: boolean;
  missingLabels: string[];
};

export function normalizeEventName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function isValidEventName(value: string) {
  const name = normalizeEventName(value);
  return name.length >= 2 && name.length <= 120;
}

/** YYYY-MM-DD from input[type=date] or empty. */
export function normalizeEventDate(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  const date = new Date(`${trimmed}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return trimmed;
}

export function isValidEventDateInput(value: string) {
  return normalizeEventDate(value) !== null;
}

/** Empty is allowed; if filled, must be 2–120 chars. */
export function parseOptionalEventName(value: string): string | null {
  const name = normalizeEventName(value);
  if (!name) return null;
  return isValidEventName(name) ? name : null;
}

/** Empty is allowed; if filled, must be a valid date. */
export function parseOptionalEventDate(value: string): string | null {
  if (!value.trim()) return null;
  return normalizeEventDate(value);
}

export function optionalEventNameValid(value: string | null | undefined) {
  if (!value?.trim()) return true;
  return isValidEventName(value);
}

export function optionalEventDateValid(value: string | null | undefined) {
  if (!value?.trim()) return true;
  return normalizeEventDate(value) !== null;
}

export function evaluateEventSetup(input: {
  standeeType: StandeeType;
  businessName: string | null;
  city: string | null;
  phone: string | null;
  mapLink: string | null;
  eventName: string | null;
  eventDate: string | null;
  areaCount: number;
}): EventSetupChecklist {
  if (input.standeeType !== "event") {
    return {
      businessName: false,
      city: false,
      category: false,
      phone: false,
      mapLink: false,
      eventName: false,
      eventDate: false,
      hasArea: false,
      complete: false,
      missingLabels: [],
    };
  }

  const businessName = Boolean(
    input.businessName && isValidBusinessName(input.businessName),
  );
  const cityFilled = Boolean(input.city?.trim() && isValidCity(input.city));
  const city = !input.city?.trim() || cityFilled;

  const phone = Boolean(input.phone && normalizePhone(input.phone));
  const mapLink = Boolean(input.mapLink && normalizeMapLink(input.mapLink));
  const eventName = optionalEventNameValid(input.eventName);
  const eventDate = optionalEventDateValid(input.eventDate);
  const hasArea = input.areaCount >= 1;

  const missingLabels: string[] = [];
  if (!businessName) missingLabels.push("Business name");
  if (input.city?.trim() && !city) missingLabels.push("City");
  if (!phone) missingLabels.push("Phone");
  if (!mapLink) missingLabels.push("Google review link");
  if (!eventName) missingLabels.push("Event name (fix or clear)");
  if (!eventDate) missingLabels.push("Event date (fix or clear)");
  if (!hasArea) missingLabels.push("At least one guest area");

  const complete = businessName && phone && mapLink && eventName && eventDate && hasArea;

  return {
    businessName,
    city,
    category: true,
    phone,
    mapLink,
    eventName,
    eventDate,
    hasArea,
    complete,
    missingLabels,
  };
}
