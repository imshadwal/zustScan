import { homeCardClass, homeCardsSection } from "@/components/home/styles";
import { price, roiPricingPoints } from "@/lib/site";

export function RoiSection() {
  return (
    <section className={`${homeCardsSection} bg-mist`}>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:py-24">
        <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">
          Value in rupees
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {price} once — not another monthly ad bill.
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
          We are not promising a review count. We are making it easier for happy guests to write
          one that sounds like them — in English, Hindi, or Hinglish.
        </p>
        <ul className="mt-10 grid gap-4 lg:grid-cols-3">
          {roiPricingPoints.map((point) => (
            <li key={point.title} className={`flex flex-col p-6 sm:p-8 ${homeCardClass}`}>
              <p className="text-xs font-semibold tracking-[0.14em] text-blue uppercase">
                {point.title}
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-ink">{point.amount}</p>
              <p className="mt-3 flex-1 text-sm leading-7 text-muted">{point.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
