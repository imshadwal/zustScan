import { SkeletonBlock, SkeletonLight } from "@/components/loading/skeleton-primitives";

/** Generic marketing page while navigating (hero + sections). */
export function MarketingPageSkeleton() {
  return (
    <SkeletonBlock label="Loading page">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
        <SkeletonLight className="mx-auto h-4 w-32" />
        <SkeletonLight className="mx-auto mt-4 h-12 w-full max-w-2xl" />
        <SkeletonLight className="mx-auto mt-4 h-12 w-full max-w-xl" />
        <SkeletonLight className="mx-auto mt-8 h-11 w-40 rounded-full" />
      </div>
      <div className="border-y border-slate-200/80 bg-white py-14">
        <div className="mx-auto max-w-6xl px-5 text-center sm:px-6">
          <SkeletonLight className="mx-auto h-8 w-72" />
          <SkeletonLight className="mx-auto mt-3 h-4 w-96 max-w-full" />
        </div>
        <div className="mx-auto mt-10 flex max-w-6xl gap-4 overflow-hidden px-5">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonLight key={i} className="h-24 w-52 shrink-0 rounded-2xl" />
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-6xl space-y-6 px-5 py-16 sm:px-6">
        <SkeletonLight className="h-64 rounded-3xl" />
        <SkeletonLight className="h-48 rounded-3xl" />
      </div>
    </SkeletonBlock>
  );
}

export function TrustedPartnersStripSkeleton() {
  return (
    <section className="border-y border-slate-200/80 bg-white py-14 sm:py-16" aria-busy="true">
      <div className="mx-auto max-w-6xl px-5 text-center sm:px-6">
        <SkeletonLight className="mx-auto h-8 w-80 max-w-full" />
        <SkeletonLight className="mx-auto mt-3 h-4 w-96 max-w-full" />
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl gap-5 overflow-hidden px-5 sm:gap-6 sm:px-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonLight key={i} className="h-24 w-44 shrink-0 rounded-2xl sm:w-52" />
        ))}
      </div>
    </section>
  );
}

export function BusinessCardsStripSkeleton() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:py-16" aria-busy="true">
      <SkeletonLight className="h-3 w-24" />
      <SkeletonLight className="mt-3 h-8 w-72 max-w-full" />
      <SkeletonLight className="mt-2 h-4 w-80 max-w-full" />
      <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <li key={i}>
            <SkeletonLight className="h-20 rounded-2xl" />
          </li>
        ))}
      </ul>
    </section>
  );
}
