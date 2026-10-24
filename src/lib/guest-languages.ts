export const GUEST_LANGUAGES = ["english", "hindi", "hinglish"] as const;

export type GuestLanguage = (typeof GUEST_LANGUAGES)[number];

export const GUEST_LANGUAGE_OPTIONS: { id: GuestLanguage; label: string; hint: string }[] = [
  { id: "english", label: "English", hint: "Full English review" },
  { id: "hindi", label: "हिंदी", hint: "Devanagari Hindi" },
  { id: "hinglish", label: "Hinglish", hint: "Hindi + English mix" },
];

export function normalizeGuestLanguages(raw: unknown): GuestLanguage[] {
  if (typeof raw === "string") {
    const id = raw.toLowerCase();
    if (GUEST_LANGUAGES.includes(id as GuestLanguage)) return [id as GuestLanguage];
    return ["english"];
  }
  if (!Array.isArray(raw)) return ["english"];
  const picked: GuestLanguage[] = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const id = item.toLowerCase();
    if (GUEST_LANGUAGES.includes(id as GuestLanguage) && !picked.includes(id as GuestLanguage)) {
      picked.push(id as GuestLanguage);
    }
  }
  return picked.length === 1 ? picked : picked.length > 1 ? [picked[0]!] : ["english"];
}

export function languageInstruction(languages: GuestLanguage[]) {
  const labels = languages.map((lang) => {
    if (lang === "english") return "English";
    if (lang === "hindi") return "Hindi in Devanagari script";
    return "Hinglish (Roman script, natural Hindi–English mix)";
  });

  if (languages.length === 1) {
    return `Write the entire review in ${labels[0]}.`;
  }

  return (
    `The guest selected multiple language styles: ${labels.join(", ")}. ` +
    "Write one cohesive review that naturally blends those choices (for example Hinglish when English and Hindi are both selected). " +
    "Use Devanagari only where Hindi is included and it reads naturally; otherwise prefer Roman Hinglish."
  );
}
