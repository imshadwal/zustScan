function upToTwoLetters(parts: string[]) {
  const letters = parts
    .map((part) => part.replace(/[^a-z0-9]/gi, "").charAt(0))
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return letters || "?";
}

export function initialsFromBusinessName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return upToTwoLetters(words);
  const word = words[0] ?? "";
  const clean = word.replace(/[^a-z0-9]/gi, "");
  if (clean.length >= 2) return clean.slice(0, 2).toUpperCase();
  return clean.charAt(0).toUpperCase() || "?";
}

export function initialsFromLoginId(loginId: string) {
  const id = loginId.trim().toLowerCase();
  if (!id) return "?";
  if (id.includes("-")) {
    const parts = id.split("-").filter(Boolean);
    const fromSegments = upToTwoLetters(parts);
    if (fromSegments !== "?") return fromSegments;
  }
  const alnum = id.replace(/[^a-z0-9]/g, "");
  if (alnum.length >= 2) return alnum.slice(0, 2).toUpperCase();
  return alnum.charAt(0).toUpperCase() || "?";
}

export function displayInitials(businessName: string | null | undefined, loginId: string) {
  const name = businessName?.trim();
  if (name) return initialsFromBusinessName(name);
  return initialsFromLoginId(loginId);
}

export function displayTitle(businessName: string | null | undefined, loginId: string) {
  const name = businessName?.trim();
  return name || loginId;
}

/** Guest page heading: business name and city, comma-separated. */
export function displayGuestBusinessTitle(
  businessName: string | null | undefined,
  loginId: string,
  city: string | null | undefined,
) {
  const base = displayTitle(businessName, loginId);
  const place = city?.trim();
  if (!place) return base;
  return `${base}, ${place}`;
}
