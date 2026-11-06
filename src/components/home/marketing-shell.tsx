"use client";

import { Contact } from "@/components/home/contact";
import { EnquiryProvider } from "@/components/home/enquiry";
import { Navbar } from "@/components/home/navbar";
import { TaglineReveal } from "@/components/home/tagline-reveal";
import { WhatsappButton } from "@/components/home/whatsapp-button";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <EnquiryProvider>
      <Navbar />
      <div id="main">{children}</div>
      <TaglineReveal
        lines={[
          "A review that sounds like the visit,",
          "posted by the guest on Google.",
        ]}
      />
      <Contact />
      <WhatsappButton />
    </EnquiryProvider>
  );
}
