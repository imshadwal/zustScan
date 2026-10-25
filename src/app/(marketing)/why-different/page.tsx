import type { Metadata } from "next";
import { PageIntro } from "@/components/home/page-intro";
import { LanguageVoiceShowcase } from "@/components/home/language-voice-showcase";
import { WhyDifferentSection } from "@/components/home/why-different-section";
import { whyDifferentPage } from "@/lib/site";

export const metadata: Metadata = {
  title: `${whyDifferentPage.eyebrow} | Zust Scan`,
  description: whyDifferentPage.description,
};

export default function WhyDifferentPage() {
  return (
    <main>
      <PageIntro
        eyebrow={whyDifferentPage.eyebrow}
        title={whyDifferentPage.title}
        description={whyDifferentPage.description}
        className="bg-white border-b border-slate-200"
      />
      <WhyDifferentSection showPageIntro />
      <LanguageVoiceShowcase />
    </main>
  );
}
