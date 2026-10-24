import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin | Zust Scan",
    template: "%s | Zust Scan",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-navy text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 right-[-10%] h-80 w-80 rounded-full bg-blue/30 blur-3xl" />
        <div className="absolute bottom-0 left-[-12%] h-64 w-64 rounded-full bg-blue/15 blur-3xl" />
      </div>
      <div className="relative min-h-dvh">{children}</div>
    </div>
  );
}
