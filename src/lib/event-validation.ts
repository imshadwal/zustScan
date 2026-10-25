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
  const eventName = Boolean(input.eventName && isValidEventName(input.eventName));
  const eventDate = Boolean(input.eventDate && normalizeEventDate(input.eventDate));
  const hasArea = input.areaCount >= 1;

  const missingLabels: string[] = [];
  if (!businessName) missingLabels.push("Business name");
  if (input.city?.trim() && !city) missingLabels.push("City");
  if (!phone) missingLabels.push("Phone");
  if (!mapLink) missingLabels.push("Google review link");
  if (!eventName) missingLabels.push("Event name");
  if (!eventDate) missingLabels.push("Event date");
  if (!hasArea) missingLabels.push("At least one area (Food, Hall, …)");

  const complete =
    businessName && phone && mapLink && eventName && eventDate && hasArea;

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
