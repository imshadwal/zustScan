import type { GuestLanguage } from "@/lib/guest-languages";

export const GUEST_VOICES = ["neutral", "female", "male"] as const;

export type GuestVoice = (typeof GUEST_VOICES)[number];

export const GUEST_VOICE_OPTIONS: {
  id: GuestVoice;
  label: string;
  hint: string;
}[] = [
  {
    id: "neutral",
    label: "Neutral",
    hint: "No raha/rahi slashes — best default",
  },
  { id: "female", label: "Female", hint: "de rahi hoon, karungi" },
  { id: "male", label: "Male", hint: "de raha hoon, karunga" },
];

export function normalizeGuestVoice(raw: unknown): GuestVoice {
  if (typeof raw !== "string") return "neutral";
  const id = raw.toLowerCase();
  if (GUEST_VOICES.includes(id as GuestVoice)) return id as GuestVoice;
  return "neutral";
}

/** English reviews ignore voice; Hindi/Hinglish use it for verb agreement. */
export function effectiveVoice(language: GuestLanguage, voice: GuestVoice): GuestVoice {
  if (language === "english") return "neutral";
  return voice;
}

export function voiceInstruction(language: GuestLanguage, voice: GuestVoice) {
  const v = effectiveVoice(language, voice);
  if (language === "english") return "";

  if (v === "neutral") {
    return (
      "Use gender-neutral first-person Hindi or Hinglish. " +
      "Never write slashes such as raha/rahi, karunga/karungi, or de raha/de rahi. " +
      "Prefer neutral patterns: past tense (maine … kiya / diye), “meri rating X stars”, “rating: X stars”, " +
      "or English verbs in Hinglish (I am giving X stars). Sound natural for a Google review."
    );
  }
  if (v === "female") {
    if (language === "hindi") {
      return (
        "Use consistent feminine first-person forms in Devanagari Hindi " +
        "(e.g. दे रही हूँ, करूँगी). No slash alternatives."
      );
    }
    return (
      "Use consistent feminine first-person forms in Hindi or Hinglish " +
      "(e.g. de rahi hoon, karungi, try kiya + feminine follow-ups where needed). No slash alternatives."
    );
  }
  if (language === "hindi") {
    return (
      "Use consistent masculine first-person forms in Devanagari Hindi " +
      "(e.g. दे रहा हूँ, करूँगा). No slash alternatives."
    );
  }
  return (
    "Use consistent masculine first-person forms in Hindi or Hinglish " +
    "(e.g. de raha hoon, karunga). No slash alternatives."
  );
}
