import { homeCardClass, homeCardsSection } from "@/components/home/styles";
import { price, roiPricingPoints } from "@/lib/site";

export function RoiSection() {
  return (
    <section className={homeCardsSection}>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:py-24">
        <p className="caption-1 text-muted">
          Value in rupees
        </p>
        <h2 className="heading-3 mt-3 max-w-2xl text-ink">
          {price} once — not another monthly ad bill.
        </h2>
        <p className="body-1 mt-4 max-w-2xl text-muted">
          We are not promising a review count. We are making it easier for happy guests to write
          one that sounds like them — in English, Hindi, or Hinglish.
        </p>
        <ul className="mt-10 grid gap-4 lg:grid-cols-3">
          {roiPricingPoints.map((point) => (
            <li key={point.title} className={`flex flex-col p-6 sm:p-8 ${homeCardClass}`}>
              <p className="caption-1 text-blue">
                {point.title}
              </p>
              <p className="subheading-2 mt-3 text-ink">{point.amount}</p>
              <p className="body-3 mt-3 flex-1 text-muted">{point.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
