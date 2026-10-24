"use client";

import { useState } from "react";
import { homeCardClass, homeCardsSection } from "@/components/home/styles";
import { GUEST_VOICE_OPTIONS, type GuestVoice } from "@/lib/guest-voice";
import {
  MARKETING_DRAFT_SAMPLES,
  MARKETING_VOICE_TWEAKS,
} from "@/lib/marketing-samples";

const LANGUAGES = [
  { id: "english" as const, label: "English" },
  { id: "hindi" as const, label: "Hindi" },
  { id: "hinglish" as const, label: "Hinglish" },
];

export function LanguageVoiceShowcase() {
  const [language, setLanguage] = useState<(typeof LANGUAGES)[number]["id"]>("hinglish");
  const [voice, setVoice] = useState<GuestVoice>("neutral");

  let sample = MARKETING_DRAFT_SAMPLES[language];
  if (language !== "english" && voice !== "neutral") {
    sample = MARKETING_VOICE_TWEAKS[voice][language];
  }

  return (
    <section className={homeCardsSection}>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:py-24">
        <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">
          Hindi · Hinglish · Voice
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Drafts that sound like your guests — not a template.
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
          Pick language on the guest page. For Hindi and Hinglish, choose neutral, female, or male
          voice so verbs match how they speak.
        </p>
        <div className={`mt-10 p-6 sm:p-8 ${homeCardClass}`}>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLanguage(item.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  language === item.id
                    ? "bg-blue text-white"
                    : "border border-slate-300 bg-white text-ink hover:border-blue"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          {language !== "english" ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {GUEST_VOICE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setVoice(option.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    voice === option.id
                      ? "bg-navy text-white"
                      : "border border-slate-300 bg-mist text-ink hover:border-blue"
                  }`}
                  title={option.hint}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}
          <blockquote className="mt-6 rounded-2xl border-2 border-blue/20 bg-blue/[0.06] px-4 py-4 text-sm leading-7 text-ink sm:text-base">
            {sample}
          </blockquote>
          <p className="mt-3 text-xs text-muted">
            Sample only — real drafts use the guest&apos;s picks (service, product, stars).
          </p>
        </div>
      </div>
    </section>
  );
}
