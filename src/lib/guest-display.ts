/** Format +91XXXXXXXXXX for guest-facing contact line. */
export function formatGuestContactPhone(phone: string | null | undefined) {
  if (!phone?.trim()) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone.trim();
}

/** Address line on guest header; falls back to city when address empty. */
export function guestAddressLine(
  address: string | null | undefined,
  city: string | null | undefined,
) {
  const line = address?.trim();
  if (line) return line;
  const place = city?.trim();
  return place || null;
}
