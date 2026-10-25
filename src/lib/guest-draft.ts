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
  tier: "Good" | "Better" | "Best";
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

const DRAFT_ANGLES = [
  "Open with the business name, then what you used.",
  "Open with the main product or service, then name the business.",
  "Open with how the visit felt, then what you used.",
  "End with the star rating only — no separate recommendation sentence.",
  "End by recommending the business to a friend in one short line (word it freshly).",
  "Split offerings: mention products in one sentence and services in the next.",
  "Keep it conversational, like a WhatsApp message to a friend.",
  "Use a slightly different tone: warm and brief, not salesy.",
  "Two short sentences only: what you used, then rating and feeling.",
  "Three sentences: setup, what went well, stars.",
  "Lead with the outcome (happy / satisfied), then explain what you bought.",
  "End with a simple recommendation or thank-you — as if speaking to future customers.",
  "Sound like Hinglish a young professional would write — simple words, no marketing jargon.",
  "Put the star count in the middle sentence, not the last word.",
  "Name the business once in the first sentence; do not repeat the business name.",
  "Start with 'Recently' or 'Last time' and keep the rest fresh.",
  "Focus on one product first, add the second product and services in the next sentence.",
  "Close with thanks or appreciation, not a conditional 'if you need X' line.",
  "Use em-dash or comma breaks; avoid copying a fill-in-the-blank template.",
  "Vary verbs (try kiya, liya, handle kiya, deliver hua) — do not reuse the same verb twice.",
] as const;

function draftAngleInstruction(seed: string) {
  return pickVariant(DRAFT_ANGLES, `${seed}:angle`);
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

async function openAiDraft(input: DraftInput): Promise<string> {
  const { key, model } = resolveOpenAiConfig();

  const system = [
    "You write short, natural review text that a guest will paste directly into Google Reviews.",
    "Write as if the review is already on Google — never mention Google, posting, uploading, copy-paste, or that you are writing a review.",
    "First person, no hashtags or emojis, 2 to 4 sentences.",
    "Include every selected product and service name at least once, spread across sentences — not one long parenthetical list.",
    "Do not invent facts beyond the business brief and the guest choices.",
    "Never say the review was written by AI.",
    "Each draft must read differently: change the opening, middle, and closing from other drafts with the same picks.",
    "Avoid stock closings like 'Agar X chahiye ho to recommend karungi/karunga' or repeating the full service list at the end.",
    "Do not use future tense about sharing feedback (avoid lines like 'main review post karungi/karunga on Google'). State the experience and recommendation in the present or past.",
    "Do not write the star number or 'out of 5' in the text — the guest picks stars separately in Google.",
    "Never use the words Good, Better, or Best; those are internal labels only. Express feeling in natural language.",
    "Prefer active first-person (maine unse kaam karwaya) over passive (samjhaya gaya) unless the brief mentions that.",
    languageInstruction(input.languages),
    voiceInstruction(input.languages[0] ?? "english", input.voice),
  ]
    .filter(Boolean)
    .join(" ");

  const user = [
    `Business: ${input.businessName}`,
    `Brief: ${input.brief.slice(0, 800)}`,
    `Services: ${input.serviceNames.join(", ") || "—"}`,
    `Products: ${input.productNames.join(", ") || "—"}`,
    `How it felt (tone only — do not quote these labels): ${input.tier}`,
    `Star rating (for tone only — do not mention stars or numbers in the review text): ${input.stars} out of 5`,
    `Variation token: ${input.variationSeed}`,
    `Structure for this draft: ${draftAngleInstruction(input.variationSeed)}`,
    "Write the review draft only.",
  ].join("\n");

  let response: Response;
  try {
    response = await fetch(OPENAI_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.95,
        presence_penalty: 0.35,
        frequency_penalty: 0.25,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
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

/** AI guest drafts via OpenAI Chat Completions. */
export async function generateGuestDraft(input: DraftInput): Promise<string> {
  return openAiDraft(input);
}
