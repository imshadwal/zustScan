"use client";

import { useState } from "react";
import { quietButtonClass } from "@/components/admin/styles";
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

function SelectedMark() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
      <path
        d="M5 10.5l3 3 7-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LanguageVoiceShowcase() {
  const [language, setLanguage] = useState<(typeof LANGUAGES)[number]["id"]>("hinglish");
  const [voice, setVoice] = useState<GuestVoice>("neutral");

  let sample = MARKETING_DRAFT_SAMPLES[language];
  if (language !== "english" && voice !== "neutral") {
    sample = MARKETING_VOICE_TWEAKS[voice][language];
  }

  return (
    <section className={homeCardsSection}>
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-8 sm:px-6 lg:pt-20 lg:pb-10">
        <p className="caption-1 text-muted">
          Hindi · Hinglish · Voice
        </p>
        <h2 className="heading-3 mt-3 max-w-2xl text-ink">
          Drafts that sound like your guests — not a template.
        </h2>
        <p className="body-1 mt-4 max-w-2xl text-muted">
          Pick language on the guest page. For Hindi and Hinglish, choose neutral, female, or male
          voice so verbs match how they speak.
        </p>
        <div className={`mt-10 p-6 sm:p-8 ${homeCardClass}`}>
          <div role="group" aria-label="Draft language" className="flex flex-wrap gap-2">
            {LANGUAGES.map((item) => {
              const selected = language === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setLanguage(item.id)}
                  className={selected ? "btn-primary gap-2" : quietButtonClass}
                >
                  {selected ? <SelectedMark /> : null}
                  {item.label}
                </button>
              );
            })}
          </div>
          {language !== "english" ? (
            <div role="group" aria-label="Draft voice" className="mt-4 flex flex-wrap gap-2">
              {GUEST_VOICE_OPTIONS.map((option) => {
                const selected = voice === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setVoice(option.id)}
                    className={selected ? "btn-primary gap-2" : quietButtonClass}
                    title={option.hint}
                  >
                    {selected ? <SelectedMark /> : null}
                    {option.label}
                  </button>
                );
              })}
            </div>
          ) : null}
          <blockquote className="body-2 mt-6 rounded-2xl border border-slate-200 bg-mist px-4 py-4 text-ink">
            {sample}
          </blockquote>
          <p className="body-3 mt-3 text-muted">
            Sample only — real drafts use the guest&apos;s picks (service, product, stars).
          </p>
        </div>
      </div>
    </section>
  );
}
