import "server-only";

import { categoryLabel, type BusinessCategoryOption } from "@/lib/business-categories";
import { isValidWhyTrustUs, normalizeWhyTrustUs } from "@/lib/business-validation";
import { OwnerStoreError } from "@/lib/store-error";
import { serverEnv } from "@/lib/server-env";

const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_MODEL = "gpt-4o-mini";

export type WhyTrustGenerateInput = {
  businessName: string;
  city: string;
  address?: string;
  categoryId?: string;
  categoryOther?: string;
  /** When set, used instead of category (e.g. event standee venues). */
  businessTypeLabel?: string;
};

function resolveOpenAiConfig() {
  const key = serverEnv("OPENAI_API_KEY")?.trim();
  const model = serverEnv("AI_DRAFT_MODEL")?.trim() || DEFAULT_MODEL;
  if (!key?.startsWith("sk-")) {
    throw new OwnerStoreError(
      "AI generation is not configured. Add OPENAI_API_KEY on the server.",
      503,
    );
  }
  return { key, model };
}

async function callOpenAi(
  key: string,
  model: string,
  messages: { role: "system" | "user"; content: string }[],
): Promise<string> {
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
        temperature: 0.75,
        max_tokens: 120,
        messages,
      }),
    });
  } catch (error) {
    console.error("[why-trust-generate] OpenAI request failed:", error);
    throw new OwnerStoreError("AI could not be reached. Try again in a moment.", 503);
  }

  const body = (await response.json().catch(() => null)) as {
    error?: { message?: string };
    choices?: { message?: { content?: string } }[];
  } | null;

  if (!response.ok) {
    console.error("[why-trust-generate] OpenAI error:", body?.error?.message ?? response.status);
    throw new OwnerStoreError("AI generation failed. Try again in a moment.", 503);
  }

  const text = body?.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new OwnerStoreError("AI returned an empty line. Try Generate again.", 503);
  }
  return text;
}

function fitWhyTrustUs(raw: string): string | null {
  let text = normalizeWhyTrustUs(raw.replace(/^["']|["']$/g, ""));
  if (text.length > 300) {
    const cut = text.slice(0, 300);
    const lastStop = Math.max(cut.lastIndexOf("."), cut.lastIndexOf("—"), cut.lastIndexOf("!"));
    text = lastStop > 80 ? cut.slice(0, lastStop + 1).trim() : cut.trim();
  }
  return isValidWhyTrustUs(text) ? text : null;
}

function buildMessages(input: WhyTrustGenerateInput, options: BusinessCategoryOption[]) {
  const name = input.businessName.trim() || "This business";
  const city = input.city.trim();
  const typeLabel =
    input.businessTypeLabel?.trim() ||
    (input.categoryId
      ? categoryLabel(input.categoryId, options, input.categoryOther)
      : "Business");

  const system = [
    "You write one short “Why trust us” line for a business guest QR page in India.",
    "Output plain text only — no quotes, bullets, or labels.",
    "Length: 10 to 300 characters total.",
    "Tone: warm, specific, honest. Mention that guests write and post their own Google reviews (the business never posts for them).",
    "Do not invent awards, years in business, or facts not given in the user message.",
    "Use the business name once. You may mention city if provided.",
  ].join(" ");

  const user = [
    `Business name: ${name}`,
    city ? `City: ${city}` : null,
    input.address?.trim() ? `Address: ${input.address.trim()}` : null,
    `Category / type: ${typeLabel}`,
  ]
    .filter(Boolean)
    .join("\n");

  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: user },
  ];
}

/** Why trust us line via OpenAI only. */
export async function generateWhyTrustLine(
  input: WhyTrustGenerateInput,
  options: BusinessCategoryOption[],
): Promise<{ whyTrustUs: string }> {
  const { key, model } = resolveOpenAiConfig();
  const messages = buildMessages(input, options);

  let raw = await callOpenAi(key, model, messages);
  let fitted = fitWhyTrustUs(raw);

  if (!fitted) {
    raw = await callOpenAi(key, model, [
      ...messages,
      {
        role: "user" as const,
        content:
          "Your last answer was the wrong length. Reply again with one line only, between 10 and 300 characters.",
      },
    ]);
    fitted = fitWhyTrustUs(raw);
  }

  if (!fitted) {
    throw new OwnerStoreError(
      "AI returned text that did not fit 10–300 characters. Try Generate again or edit manually.",
      503,
    );
  }

  return { whyTrustUs: fitted };
}
