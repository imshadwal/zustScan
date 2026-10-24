import "server-only";

import { serverEnv } from "@/lib/server-env";

export type DraftInput = {
  businessName: string;
  brief: string;
  serviceName: string;
  productName: string;
  tier: "Good" | "Better" | "Best";
  stars: number;
};

function templateDraft(input: DraftInput) {
  const name = input.businessName.trim() || "the business";
  const tone =
    input.tier === "Best"
      ? "exceeded expectations"
      : input.tier === "Better"
        ? "was a solid experience"
        : "was fine overall";
  return (
    `I used ${input.productName} (${input.serviceName}) at ${name} and it ${tone}. ` +
    `I am giving ${input.stars} star${input.stars === 1 ? "" : "s"}. ` +
    `Would recommend checking them out if you need ${input.serviceName.toLowerCase()}.`
  );
}

async function openAiDraft(input: DraftInput) {
  const key = serverEnv("OPENAI_API_KEY");
  if (!key) return null;

  const system = [
    "You write short, natural Google review drafts for guests.",
    "Use plain English, first person, no hashtags or emojis.",
    "Keep 2 to 4 sentences. Mention the product and service chosen.",
    "Do not invent facts beyond the business brief and the guest choices.",
    "Never say the review was written by AI.",
  ].join(" ");

  const user = [
    `Business: ${input.businessName}`,
    `Brief: ${input.brief.slice(0, 800)}`,
    `Service: ${input.serviceName}`,
    `Product: ${input.productName}`,
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
