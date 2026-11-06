import type { Metadata } from "next";
import { PortalProviders } from "@/components/portal-providers";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Zust Scan",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-dvh bg-mist-deep text-ink">
      <PortalProviders>
        <div className="min-h-dvh">{children}</div>
      </PortalProviders>
    </div>
  );
}
