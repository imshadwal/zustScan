import { businessSets, guestDecides } from "@/lib/site";

function Column({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: readonly string[];
}) {
  return (
    <div className="rounded-[28px] bg-white p-6 sm:p-8">
      <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">
        {eyebrow}
      </p>
      <h3 className="mt-3 text-2xl font-semibold text-ink">{title}</h3>
      <ol className="mt-6 space-y-4">
        {items.map((item, index) => (
          <li key={item} className="flex gap-4">
            <span className="mt-0.5 text-sm font-semibold text-blue">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-base leading-7 text-ink">{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Split() {
  return (
    <section className="bg-mist">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:py-24">
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
          The business sets the choices. The guest writes the review.
        </h2>
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <Column
            eyebrow="The business configures"
            title="What goes on the page"
            items={businessSets}
          />
          <Column
            eyebrow="The guest decides"
            title="What stays in their hands"
            items={guestDecides}
          />
        </div>
      </div>
    </section>
  );
}
