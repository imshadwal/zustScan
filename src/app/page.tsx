import { Audiences } from "@/components/home/audiences";
import { Contact } from "@/components/home/contact";
import { EnquiryProvider } from "@/components/home/enquiry";
import { Hero } from "@/components/home/hero";
import { Journey } from "@/components/home/journey";
import { Navbar } from "@/components/home/navbar";
import { Pricing } from "@/components/home/pricing";
import { Showcase } from "@/components/home/showcase";
import { Split } from "@/components/home/split";
import { WhatsappButton } from "@/components/home/whatsapp-button";

export default function Home() {
  return (
    <EnquiryProvider>
      <Navbar />
      <main>
        <Hero />
        <Showcase />
        <Journey />
        <Audiences />
        <Split />
        <Pricing />
        <Contact />
      </main>
      <WhatsappButton />
    </EnquiryProvider>
  );
}
