import { homeCardClass, homeCardsSection } from "@/components/home/styles";
import { pricingFaq } from "@/lib/site";

export function FaqSection({ className = "" }: { className?: string }) {
  return (
    <section id="faq" className={`${homeCardsSection} ${className}`}>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:py-24">
        <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">FAQ</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Common questions before you enquire.
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
          Straight answers on Google policy, setup, pricing, and what guests actually do.
        </p>
        <ul className="mt-10 space-y-3">
          {pricingFaq.map((item) => (
            <li key={item.question}>
              <details className={`group p-5 sm:p-6 ${homeCardClass}`}>
                <summary className="cursor-pointer list-none text-base font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-4">
                    {item.question}
                    <span
                      className="mt-0.5 shrink-0 text-blue transition-transform group-open:rotate-45"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-7 text-muted">{item.answer}</p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
