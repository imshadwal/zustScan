import type { GuestVoice } from "@/lib/guest-voice";

export const MARKETING_DRAFT_SAMPLES: Record<
  "english" | "hindi" | "hinglish",
  string
> = {
  english:
    "I used the biryani (Food) at Lakeview Hotel and it was a solid experience. I am giving 4 stars.",
  hindi:
    "मैंने Lakeview Hotel पर biryani (Food) का अनुभव किया — कुल मिलाकर अच्छा रहा। मेरी rating 4 stars है।",
  hinglish:
    "Lakeview pe biryani (Food) try kiya — experience solid tha. Meri rating 4 stars hai.",
};

export const MARKETING_VOICE_TWEAKS: Record<
  Exclude<GuestVoice, "neutral">,
  { hindi: string; hinglish: string }
> = {
  female: {
    hindi: "मैंने biryani try ki — achha laga. Main 4 stars de rahi hoon.",
    hinglish: "Biryani try ki — achha laga. Main 4 stars de rahi hoon.",
  },
  male: {
    hindi: "मैंने biryani try ki — achha laga. Main 4 stars de raha hoon.",
    hinglish: "Biryani try ki — achha laga. Main 4 stars de raha hoon.",
  },
};
