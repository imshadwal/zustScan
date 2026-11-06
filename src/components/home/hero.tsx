import { EnquiryButton } from "@/components/home/enquiry";
import { brochureProof } from "@/lib/site";

const path = [
  ["Service", "Food"],
  ["Product", "Biryani"],
  ["How it felt", "Great, 4 stars"],
];

export function Hero() {
  return (
    <section id="top" className="bg-mist-deep text-ink">
      <div className="mx-auto grid max-w-6xl items-center gap-16 px-4 pt-32 pb-24 sm:pt-40 lg:grid-cols-[1.1fr_0.9fr] lg:pt-48">
        <div>
          <p className="caption-1 text-muted">QR standee for Google reviews</p>
          <h1 className="heading-1 mt-4 max-w-[680px]">
            <span className="hero-heading">
              Google reviews
              <br />
              from the table
            </span>
          </h1>
          <p className="body-1 mt-6 max-w-[680px] text-muted">
            Guests scan the QR where the visit happens, pick what they used, and
            edit a draft in English, Hindi, or Hinglish. They post it themselves
            on your Google page.
          </p>
          <div className="mt-8">
            <EnquiryButton className="btn-primary">Send an enquiry</EnquiryButton>
          </div>
          <p className="caption-1 mt-8 text-muted">
            {brochureProof.businesses} businesses · {brochureProof.scans} scans ·{" "}
            {brochureProof.drafts} drafts · {brochureProof.copyContinue} continued to Google
          </p>
        </div>
        <div className="rounded-2xl bg-white/70 p-4">
          <p className="caption-1 px-2 text-muted">A guest path</p>
          <ol className="mt-4 space-y-2">
            {path.map(([label, value], index) => (
              <li key={label} className="flex items-center gap-4 rounded-xl bg-white px-4 py-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue text-white button-md">
                  {index + 1}
                </span>
                <span>
                  <span className="caption-5 block text-muted">{label}</span>
                  <span className="subheading-3 block">{value}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
