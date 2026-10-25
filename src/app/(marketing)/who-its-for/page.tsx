import type { Metadata } from "next";
import { Audiences } from "@/components/home/audiences";
import { PageIntro } from "@/components/home/page-intro";
import { whoItsForPage } from "@/lib/site";

export const metadata: Metadata = {
  title: `${whoItsForPage.eyebrow} | Zust Scan`,
  description: whoItsForPage.description,
};

export default function WhoItsForPage() {
  return (
    <main>
      <PageIntro
        eyebrow={whoItsForPage.eyebrow}
        title={whoItsForPage.title}
        description={whoItsForPage.description}
        className="bg-white border-b border-slate-200"
      />
      <Audiences showHeading={false} />
    </main>
  );
}
