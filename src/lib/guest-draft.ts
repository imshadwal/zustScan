import "server-only";

import type { GuestLanguage } from "@/lib/guest-languages";
import { languageInstruction } from "@/lib/guest-languages";
import { serverEnv } from "@/lib/server-env";

export type DraftInput = {
  businessName: string;
  brief: string;
  serviceNames: string[];
  productNames: string[];
  tier: "Good" | "Better" | "Best";
  stars: number;
  languages: GuestLanguage[];
};

function listPhrase(items: string[]) {
  const unique = [...new Set(items.map((item) => item.trim()).filter(Boolean))];
  if (unique.length === 0) return "";
  if (unique.length === 1) return unique[0]!;
  if (unique.length === 2) return `${unique[0]} and ${unique[1]}`;
  return `${unique.slice(0, -1).join(", ")}, and ${unique[unique.length - 1]}`;
}

function tonePhrase(tier: DraftInput["tier"]) {
  if (tier === "Best") return "exceeded expectations";
  if (tier === "Better") return "was a solid experience";
  return "was fine overall";
}

function templateDraft(input: DraftInput) {
  const name = input.businessName.trim() || "the business";
  const tone = tonePhrase(input.tier);
  const starsLabel = `${input.stars} star${input.stars === 1 ? "" : "s"}`;
  const products = listPhrase(input.productNames);
  const services = listPhrase(input.serviceNames);
  const langs = new Set(input.languages);

  if (langs.has("hindi") && langs.size === 1) {
    return (
      `मैंने ${name} पर ${products} (${services}) का अनुभव किया और यह ${tone === "exceeded expectations" ? "बहुत अच्छा" : tone === "was a solid experience" ? "अच्छा" : "ठीक"} रहा। ` +
      `मैं ${starsLabel} दे रहा/रही हूँ। ${services} की जरूरत हो तो ${name} को देखें।`
    );
  }

  if (langs.has("hinglish") || (langs.has("hindi") && langs.has("english"))) {
    return (
      `${name} pe ${products} (${services}) try kiya — experience ${tone} tha. ` +
      `Main ${starsLabel} de raha/rahi hoon. Agar ${services.toLowerCase()} chahiye ho to recommend karunga/karungi.`
    );
  }

  return (
    `I used ${products} (${services}) at ${name} and it ${tone}. ` +
    `I am giving ${starsLabel}. Would recommend them if you need ${services.toLowerCase()}.`
  );
}

async function openAiDraft(input: DraftInput) {
  const key = serverEnv("OPENAI_API_KEY");
  if (!key) return null;

  const system = [
    "You write short, natural Google review drafts for guests in India.",
    "First person, no hashtags or emojis, 2 to 4 sentences.",
    "Mention every product and service the guest selected.",
    "Do not invent facts beyond the business brief and the guest choices.",
    "Never say the review was written by AI.",
    languageInstruction(input.languages),
  ].join(" ");

  const user = [
    `Business: ${input.businessName}`,
    `Brief: ${input.brief.slice(0, 800)}`,
    `Services: ${input.serviceNames.join(", ") || "—"}`,
    `Products: ${input.productNames.join(", ") || "—"}`,
    `How it felt: ${input.tier}`,
    `Star rating: ${input.stars} out of 5`,
    "Write the review draft only.",
  ].join("\n");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!response.ok) return null;
  const body = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = body.choices?.[0]?.message?.content?.trim();
  return text || null;
}

export async function generateGuestDraft(input: DraftInput) {
  const ai = await openAiDraft(input);
  return ai ?? templateDraft(input);
}
