import { homeCardClass, homeCardsSection } from "@/components/home/styles";
import { journey } from "@/lib/site";

export function Journey({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <section id="journey" className={homeCardsSection}>
      <div
        className={`mx-auto max-w-6xl px-5 sm:px-6 ${
          showHeading ? "py-20 lg:py-24" : "pb-20 pt-0 lg:pb-24"
        }`}
      >
        {showHeading ? (
          <>
            <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">
              How it works
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
              Six steps, from the QR to the post.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              The same path works at a restaurant table, a hotel desk, a shop
              counter, or after a service visit.
            </p>
          </>
        ) : null}
        <ol
          className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${showHeading ? "mt-12" : ""}`}
        >
          {journey.map((item, index) => (
            <li
              key={item.step}
              className={`flex flex-col p-6 ${homeCardClass}`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue text-sm font-semibold text-white">
                  {item.step}
                </span>
                <span className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                  Step {index + 1} of 6
                </span>
              </div>
              <div className="mt-5 h-1 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue"
                  style={{ width: `${((index + 1) / journey.length) * 100}%` }}
                />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
