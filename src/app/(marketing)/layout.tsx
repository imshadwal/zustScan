import { JsonLd } from "@/components/home/json-ld";
import { MarketingShell } from "@/components/home/marketing-shell";
import { organizationSchema } from "@/lib/site-schema";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <MarketingShell>{children}</MarketingShell>
    </>
  );
}
