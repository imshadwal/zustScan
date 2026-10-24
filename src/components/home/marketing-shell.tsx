"use client";

import { Contact } from "@/components/home/contact";
import { EnquiryProvider } from "@/components/home/enquiry";
import { Navbar } from "@/components/home/navbar";
import { WhatsappButton } from "@/components/home/whatsapp-button";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <EnquiryProvider>
      <Navbar />
      {children}
      <Contact />
      <WhatsappButton />
    </EnquiryProvider>
  );
}
