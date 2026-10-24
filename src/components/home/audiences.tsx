import { audiences } from "@/lib/site";

const icons = [
  <path
    key="restaurant"
    d="M8 3v7M8 10v11M5 3v4a3 3 0 006 0V3M16 3v18M16 8h4"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
  />,
  <path
    key="hotel"
    d="M4 20V10l8-6 8 6v10M9 20v-6h6v6"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinejoin="round"
    strokeLinecap="round"
  />,
  <path
    key="retail"
    d="M6 8h12l-1 12H7L6 8zM9 8V6a3 3 0 016 0v2"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  />,
  <path
    key="service"
    d="M14.5 5.5l4 4L8 20H4v-4L14.5 5.5z"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinejoin="round"
  />,
];

export function Audiences() {
  return (
    <section id="who" className="bg-white">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:py-24">
        <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">
          Who it’s for
        </p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            Any business a guest can review.
          </h2>
          <p className="max-w-sm text-base leading-7 text-muted lg:pb-1">
            You name the services and products. The guest only chooses the ones
            that match their visit.
          </p>
        </div>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2">
          {audiences.map((item, index) => (
            <li
              key={item.title}
              className="rounded-[28px] border border-[#e4edf7] bg-gradient-to-b from-[#f7faff] to-white p-6 shadow-[0_16px_40px_rgba(16,32,68,0.05)] sm:p-7"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue text-white shadow-[0_10px_24px_rgba(0,96,240,0.28)]">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
                    {icons[index]}
                  </svg>
                </span>
                <span className="text-sm font-semibold text-blue/70">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-ink">{item.title}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-muted">{item.body}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-blue/10 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-blue uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
