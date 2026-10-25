import type { Metadata } from "next";
import { Audiences } from "@/components/home/audiences";
import { PageIntro } from "@/components/home/page-intro";

export const metadata: Metadata = {
  title: "Who it’s for | Zust Scan",
  description:
    "Restaurants, cafes, hotels, hospitality, retail, salons, and professional services — set services and products; guests review what they actually used.",
};

export default function WhoItsForPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Who it’s for"
        title="Any business a guest can review."
        description="You name the services and products. The guest only chooses the ones that match their visit."
        className="bg-white border-b border-slate-200"
      />
      <Audiences showHeading={false} />
    </main>
  );
}
