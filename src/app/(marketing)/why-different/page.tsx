import type { Metadata } from "next";
import { PageIntro } from "@/components/home/page-intro";
import { LanguageVoiceShowcase } from "@/components/home/language-voice-showcase";
import { WhyDifferentSection } from "@/components/home/why-different-section";
import { pageMetadata } from "@/lib/page-metadata";
import { whyDifferentPage, whyDifferentPagePath } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: whyDifferentPage.eyebrow,
  description: whyDifferentPage.description,
  path: whyDifferentPagePath,
});

export default function WhyDifferentPage() {
  return (
    <main>
      <PageIntro
        eyebrow={whyDifferentPage.eyebrow}
        title={whyDifferentPage.title}
        description={whyDifferentPage.description}
        className="bg-mist-deep"
      />
      <WhyDifferentSection showPageIntro />
      <LanguageVoiceShowcase />
    </main>
  );
}
