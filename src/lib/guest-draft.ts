import "server-only";

import type { GuestLanguage } from "@/lib/guest-languages";
import { languageInstruction } from "@/lib/guest-languages";
import type { GuestVoice } from "@/lib/guest-voice";
import { voiceInstruction } from "@/lib/guest-voice";
import { serverEnv } from "@/lib/server-env";

export type DraftInput = {
  businessName: string;
  brief: string;
  serviceNames: string[];
  productNames: string[];
  tier: "Good" | "Great" | "Exceptional";
  stars: number;
  languages: GuestLanguage[];
  voice: GuestVoice;
  /** Changes wording when the guest picks the same items again or taps Regenerate. */
  variationSeed: string;
};

const GUEST_DRAFT_UNAVAILABLE =
  "We could not create your review draft right now. Please try again in a moment.";

const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_DRAFT_MODEL = "gpt-4o-mini";
/** Short Google reviews — cap output so the model finishes faster. */
const DRAFT_MAX_TOKENS = 220;
const OPENAI_TIMEOUT_MS = 28_000;

export class GuestDraftUnavailableError extends Error {
  readonly guestMessage: string;

  constructor(guestMessage: string = GUEST_DRAFT_UNAVAILABLE) {
    super(guestMessage);
    this.name = "GuestDraftUnavailableError";
    this.guestMessage = guestMessage;
  }
}

function hashSeed(seed: string) {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pickVariant<T>(items: readonly T[], seed: string) {
  return items[hashSeed(seed) % items.length]!;
}

const DRAFT_ANGLES_ENGLISH_HINGLISH = [
  "Open with the business name, then what you used.",
  "Open with the main product or service, then name the business.",
  "Open with how the visit felt, then what you used.",
  "End by recommending the business to a friend in one short line (word it freshly).",
  "Split offerings: mention products in one sentence and services in the next.",
  "Keep it conversational, like a WhatsApp message to a friend.",
  "Two short sentences only: what you used, then rating and feeling.",
  "Three sentences: setup, what went well, then recommendation.",
  "Lead with the outcome (happy / satisfied), then explain what you used.",
  "Name the business once in the first sentence; do not repeat the business name.",
  "Focus on one product first, add the second product and services in the next sentence.",
  "Close with thanks or appreciation, not a conditional 'if you need X' line.",
] as const;

const DRAFT_ANGLES_HINDI = [
  "पहले व्यवसाय का नाम, फिर कौन-सी सेवा/प्रोडक्ट ली — पूरा पाठ देवनागरी में।",
  "पहले किसी प्रोडक्ट या सेवा के नाम से शुरू करें (सूची से), फिर व्यवसाय का नाम।",
  "पहले अनुभव/संतुष्टि, फिर क्या लिया — केवल देवनागरी।",
  "एक वाक्य में प्रोडक्ट, अगले में सेवाएँ — देवनागरी हिंदी।",
  "अंत में छोटी सिफ़ारिश (सिफ़ारिश करूँगी/करूँगा) — Roman शब्द नहीं।",
  "तीन वाक्य: जरूरत, अनुभव, सिफ़ारिश — सब देवनागरी।",
] as const;

function draftAngleInstruction(seed: string, language: GuestLanguage) {
  const pool =
    language === "hindi" ? DRAFT_ANGLES_HINDI : DRAFT_ANGLES_ENGLISH_HINGLISH;
  return pickVariant(pool, `${seed}:angle`);
}

const OPENING_RULES_ENGLISH_HINGLISH = [
  "First sentence must start with the business name.",
  "First sentence must start with one exact product name from the Products list.",
  "First sentence must start with one exact service name from the Services list.",
  "Do not start with I, We, My, Maine, or Mujhe — open with the business name or an offering name instead.",
  "Open with one specific outcome (visibility, leads, quality, support) in the first clause, then name offerings.",
  "Open mid-story: what you needed first, then who helped.",
] as const;

const OPENING_RULES_HINDI = [
  "पहला वाक्य देवनागरी में — व्यवसाय के नाम या सूची की सेवा/प्रोडक्ट से शुरू करें।",
  "पहला वाक्य देवनागरी में — पहले परिणाम/अनुभव, फिर नाम।",
  "Roman/Latin में कोई हिंदी शब्द नहीं (no mujhe/maine/karungi in Latin).",
] as const;

const LENGTH_RULES = [
  "Write exactly 2 sentences.",
  "Write exactly 3 sentences.",
  "Write 4 sentences maximum; stay under 75 words.",
  "Write 4 sentences maximum; stay under 90 words.",
] as const;

function isHindiOnly(languages: GuestLanguage[]) {
  return languages.length === 1 && languages[0] === "hindi";
}

function variationInstructions(seed: string, language: GuestLanguage) {
  const openings =
    language === "hindi" ? OPENING_RULES_HINDI : OPENING_RULES_ENGLISH_HINGLISH;
  return [
    `Structure: ${draftAngleInstruction(seed, language)}`,
    `Opening rule: ${pickVariant(openings, `${seed}:open`)}`,
    `Length: ${pickVariant(LENGTH_RULES, `${seed}:len`)}`,
  ].join("\n");
}

const ROMAN_HINDI_PATTERN =
  /\b(mujhe|maine|karungi|karunga|bahut|accha|madad|zaroor|sampark|prabhav|recommend|liye|liya|kiya)\b/i;

function hindiDraftNeedsRetry(text: string) {
  if (!/[\u0900-\u097F]/.test(text)) return true;
  let devanagari = 0;
  let latin = 0;
  for (const ch of text) {
    if (/[\u0900-\u097F]/.test(ch)) devanagari++;
    else if (/[a-zA-Z]/.test(ch)) latin++;
  }
  if (ROMAN_HINDI_PATTERN.test(text)) return true;
  return devanagari < Math.max(24, latin);
}

function resolveOpenAiConfig() {
  const key = serverEnv("OPENAI_API_KEY")?.trim();
  const model = serverEnv("AI_DRAFT_MODEL")?.trim() || DEFAULT_DRAFT_MODEL;
  if (!key?.startsWith("sk-")) {
    console.error(
      "[guest-draft] OPENAI_API_KEY is missing or invalid (must start with sk-).",
    );
    throw new GuestDraftUnavailableError();
  }
  return { key, model };
}

export function guestDraftModel(): string {
  return resolveOpenAiConfig().model;
}

const STAR_MENTION_PATTERN =
  /\b\d\s*stars?\b|\bout of 5\b|\bstar rating\b|\bmy rating\b|★|⭐|रेटिंग|सितार|स्टार|star/i;

function draftMentionsStars(text: string) {
  return STAR_MENTION_PATTERN.test(text);
}

function redactStarMentions(text: string): string {
  if (!draftMentionsStars(text)) return text;
  const parts = text.split(/(?<=[.!?।])\s+/);
  const kept = parts.filter((part) => part.trim() && !draftMentionsStars(part));
  const joined = kept.join(" ").trim();
  return joined.length >= 24 && !draftMentionsStars(joined) ? joined : text;
}

async function callOpenAiChat(
  key: string,
  model: string,
  messages: { role: "system" | "user" | "assistant"; content: string }[],
): Promise<string> {
  let response: Response;
  try {
    response = await fetch(OPENAI_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(OPENAI_TIMEOUT_MS),
      body: JSON.stringify({
        model,
        temperature: 0.88,
        max_tokens: DRAFT_MAX_TOKENS,
        presence_penalty: 0.35,
        frequency_penalty: 0.25,
        messages,
      }),
    });
  } catch (error) {
    console.error("[guest-draft] OpenAI request failed:", error);
    throw new GuestDraftUnavailableError();
  }

  const body = (await response.json().catch(() => null)) as {
    error?: { message?: string; type?: string; code?: string };
    choices?: { message?: { content?: string } }[];
  } | null;

  if (!response.ok) {
    const detail = body?.error?.message ?? response.statusText;
    const code = body?.error?.code ?? "";
    console.error(
      `[guest-draft] OpenAI HTTP ${response.status}${code ? ` (${code})` : ""}: ${detail}`,
    );
    throw new GuestDraftUnavailableError();
  }

  const text = body?.choices?.[0]?.message?.content?.trim();
  if (!text) {
    console.error("[guest-draft] OpenAI returned empty content.");
    throw new GuestDraftUnavailableError();
  }
  return text;
}

function buildDraftMessages(input: DraftInput) {
  const language = input.languages[0] ?? "english";
  const hindiOnly = isHindiOnly(input.languages);

  const system = [
    "You write short, natural review text that a guest will paste directly into Google Reviews.",
    "Write as if the review is already on Google — never mention Google, posting, uploading, copy-paste, or that you are writing a review.",
    "First person, no hashtags or emojis, 2 to 4 sentences.",
    "Include every selected product and service name verbatim at least once — do not substitute generic terms like 'digital marketing' for listed services.",
    "Spread names across sentences — not one long parenthetical list.",
    "Do not invent facts beyond the business context and the guest choices.",
    "Never say the review was written by AI.",
    "Each request has a unique variation token — write a fresh review unlike typical prior drafts (new opening, new rhythm, new closing).",
    "Avoid clichés and filler: couldn't be happier, highly recommend, top-notch, smooth and effective, attentive and knowledgeable, enhance your online presence, I recently worked with.",
    "Do not write the star number or 'out of 5' in the text — the guest picks stars separately in Google.",
    "Never use the words Good, Great, or Exceptional; those are internal labels only. Express feeling in natural language.",
    hindiOnly
      ? "CRITICAL: Every Hindi word must be in Devanagari script. Never write Hindi in Roman letters (no mujhe, maine, karungi, bahut in Latin). English product/service titles and brand names may stay in Latin."
      : "Prefer active first-person over passive unless the business context suggests otherwise.",
    hindiOnly
      ? "Do not use English words such as recommend — use Hindi in Devanagari (e.g. सिफ़ारिश करूँगी)."
      : "Do not use future tense about sharing feedback on Google.",
    languageInstruction(input.languages),
    voiceInstruction(language, input.voice),
  ]
    .filter(Boolean)
    .join(" ");

  const user = [
    `Business: ${input.businessName}`,
    `Business context (Why trust us): ${input.brief.slice(0, 400)}`,
    `Services: ${input.serviceNames.join(", ") || "—"}`,
    `Products: ${input.productNames.join(", ") || "—"}`,
    `How it felt (tone only — do not quote these labels): ${input.tier}`,
    `Star rating (for tone only — do not mention stars or numbers in the review text): ${input.stars} out of 5`,
    `Variation token (must change wording from any other token): ${input.variationSeed}`,
    variationInstructions(input.variationSeed, language),
    hindiOnly
      ? "Output ONLY the review in Devanagari Hindi. No English explanation."
      : "Write the review draft only.",
  ].join("\n");

  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: user },
  ];
}

async function openAiDraft(input: DraftInput): Promise<string> {
  const { key, model } = resolveOpenAiConfig();
  const messages = buildDraftMessages(input);
  let text = await callOpenAiChat(key, model, messages);

  if (isHindiOnly(input.languages) && hindiDraftNeedsRetry(text)) {
    console.warn("[guest-draft] Hindi draft used Roman script — retrying once.");
    text = await callOpenAiChat(key, model, [
      ...messages,
      { role: "assistant", content: text },
      {
        role: "user",
        content:
          "Wrong script. Rewrite the entire review in Devanagari Hindi only. " +
          "Do not use Roman Hindi (no mujhe, maine, karungi in Latin). " +
          "Keep the same facts and listed product/service names. Review text only.",
      },
    ]);
  }

  if (isHindiOnly(input.languages) && hindiDraftNeedsRetry(text)) {
    console.error("[guest-draft] Hindi draft still not Devanagari after retry.");
  }

  return text;
}

/** AI guest drafts via OpenAI Chat Completions. */
export async function generateGuestDraft(input: DraftInput): Promise<string> {
  return openAiDraft(input);
}

export type EventDraftInput = {
  businessName: string;
  city: string | null;
  brief: string;
  eventName: string | null;
  eventDate: string | null;
  areaNames: string[];
  tier: "Good" | "Great" | "Exceptional";
  stars: number;
  languages: DraftInput["languages"];
  voice: DraftInput["voice"];
  variationSeed: string;
};

function buildEventDraftMessages(input: EventDraftInput) {
  const language = input.languages[0] ?? "english";
  const hindiOnly = isHindiOnly(input.languages);
  const placeLine = input.city
    ? `${input.businessName}, ${input.city}`
    : input.businessName;
  const system = [
    "You write short, natural review text that a guest will paste directly into Google Reviews.",
    input.eventName
      ? "The guest attended a specific function or event at a venue — frame the visit around that event, not a random weekday meal."
      : "The guest visited this venue for a function or gathering — frame the visit naturally without inventing an event name.",
    "Write as if the review is already on Google — never mention Google, posting, uploading, copy-paste, or that you are writing a review.",
    "First person, no hashtags or emojis, 2 to 4 sentences.",
    input.eventName
      ? "Include the venue/business name and event name naturally once."
      : "Include the venue/business name naturally once.",
    "Include every selected area name verbatim (e.g. Food, Hall, Staff) — spread across sentences.",
    "Do not invent facts beyond the venue context, event, and guest choices.",
    "Never say the review was written by AI.",
    "Never use the words Good, Great, or Exceptional; those are internal labels only. Express feeling in natural language.",
    "Do not write the star number, star count, or 'out of 5' in the text — the guest picks stars separately in Google.",
    "Never write sentences about your rating or stars (not in English, not in Hindi — no 'my rating', no 'चार सितारे', no 'रेटिंग').",
    hindiOnly
      ? "CRITICAL: Every Hindi word must be in Devanagari script. Never write Hindi in Roman letters."
      : "Prefer active first-person over passive unless the context suggests otherwise.",
    hindiOnly
      ? "Do not use English words such as recommend — use Hindi in Devanagari (e.g. सिफ़ारिश करूँगी)."
      : "Do not use future tense about sharing feedback on Google.",
    languageInstruction(input.languages),
    voiceInstruction(language, input.voice),
  ]
    .filter(Boolean)
    .join(" ");

  const user = [
    `Venue on Google: ${placeLine}`,
    input.eventName ? `Event: ${input.eventName}` : null,
    input.eventDate ? `Event date: ${input.eventDate}` : null,
    `Why trust us (context): ${input.brief.slice(0, 400)}`,
    `What mattered to the guest (areas): ${input.areaNames.join(", ")}`,
    `How it felt (tone only — do not quote these labels): ${input.tier}`,
    `Star rating (for tone only — do not mention stars, ratings, or numbers in the review text): ${input.stars} out of 5`,
    `Variation token (must change wording from any other token): ${input.variationSeed}`,
    variationInstructions(input.variationSeed, language),
    input.eventName
      ? "Example framing (do not copy verbatim): I took part in {event} at {venue}; {area} stood out…"
      : "Example framing (do not copy verbatim): We visited {venue}; {area} stood out…",
    hindiOnly ? "Output ONLY the review in Devanagari Hindi. No English explanation." : "Write the review draft only.",
  ]
    .filter(Boolean)
    .join("\n");

  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: user },
  ];
}

async function openAiEventDraft(input: EventDraftInput): Promise<string> {
  const { key, model } = resolveOpenAiConfig();
  const messages = buildEventDraftMessages(input);
  let text = await callOpenAiChat(key, model, messages);
  const hindiOnly = isHindiOnly(input.languages);

  if (hindiOnly && hindiDraftNeedsRetry(text)) {
    console.warn("[guest-draft] Event Hindi draft used Roman script — retrying once.");
    text = await callOpenAiChat(key, model, [
      ...messages,
      { role: "assistant", content: text },
      {
        role: "user",
        content:
          "Wrong script. Rewrite the entire review in Devanagari Hindi only. " +
          "Keep the same facts and names. Review text only.",
      },
    ]);
  }

  if (draftMentionsStars(text)) {
    const redacted = redactStarMentions(text);
    if (!draftMentionsStars(redacted)) {
      text = redacted;
    } else {
      console.warn("[guest-draft] Event draft mentioned stars — retrying once.");
      text = await callOpenAiChat(key, model, [
        ...messages,
        { role: "assistant", content: text },
        {
          role: "user",
          content:
            "Remove any mention of stars, star count, rating, or 'out of 5' from the review. " +
            "The guest sets stars on Google separately. Rewrite the review text only, same facts and language.",
        },
      ]);
    }
  }

  return text;
}

export async function generateEventGuestDraft(input: EventDraftInput): Promise<string> {
  return openAiEventDraft(input);
}
