import type { Metadata } from "next";
import { Audiences } from "@/components/home/audiences";
import { PageIntro } from "@/components/home/page-intro";
import { pageMetadata } from "@/lib/page-metadata";
import { whoItsForPage, whoItsForPagePath } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: whoItsForPage.eyebrow,
  description: whoItsForPage.description,
  path: whoItsForPagePath,
});

export default function WhoItsForPage() {
  return (
    <main>
      <PageIntro
        eyebrow={whoItsForPage.eyebrow}
        title={whoItsForPage.title}
        description={whoItsForPage.description}
        className="bg-mist-deep"
      />
      <Audiences showHeading={false} />
    </main>
  );
}
