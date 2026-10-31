import { SkeletonLight } from "@/components/loading/skeleton-primitives";

/** Matches guest review flow layout while server data loads. */
export function GuestPageSkeleton({ stepCount = 4 }: { stepCount?: 4 | 3 }) {
  const labels =
    stepCount === 3 ? ["Experience", "Rating", "Draft"] : ["Service", "Product", "Rating", "Draft"];
  /** Event pages often list 5–8 areas; table flow can show many services/products. */
  const optionRows = stepCount === 3 ? 6 : 5;

  return (
    <div className="flex min-h-0 flex-col" data-guest-flow aria-busy="true" aria-label="Loading guest page">
      <div className="bg-navy px-5 py-7 sm:px-6 sm:py-8">
        <div className="flex items-start gap-4 sm:gap-5">
          <SkeletonLight className="h-16 w-16 shrink-0 rounded-2xl sm:h-[4.25rem] sm:w-[4.25rem]" />
          <div className="min-w-0 flex-1 space-y-3 pt-0.5">
            <SkeletonLight className="h-3 w-32" />
            <SkeletonLight className="h-9 w-full max-w-[15rem] sm:h-10" />
            <SkeletonLight className="h-4 w-4/5 max-w-xs" />
            <SkeletonLight className="h-4 w-28" />
          </div>
        </div>
      </div>

      <div className="bg-white px-4 py-4 sm:px-5">
        <ol className="flex gap-1" aria-hidden="true">
          {labels.map((label) => (
            <li key={label} className="flex-1">
              <SkeletonLight className="h-1.5 rounded-full" />
              <SkeletonLight className="mx-auto mt-2 h-2.5 w-12 max-w-full" />
            </li>
          ))}
        </ol>
      </div>

      <div className="flex min-h-[min(72vh,42rem)] flex-1 flex-col bg-white px-4 pb-5 pt-2 sm:px-5 sm:pb-6">
        <div className="rounded-2xl border border-slate-200/80 bg-[#f4f7fb] p-4 sm:p-5">
          <SkeletonLight className="h-4 w-36" />
          <SkeletonLight className="mt-2 h-3 w-52 max-w-full" />
          <ul className="mt-4 space-y-2">
            {Array.from({ length: optionRows }, (_, i) => (
              <li key={i}>
                <SkeletonLight className="h-[3.25rem] w-full rounded-xl" />
              </li>
            ))}
          </ul>
        </div>

        <div className="-mx-4 mt-5 border-t border-slate-200/90 px-4 py-4 sm:-mx-5 sm:px-5">
          <SkeletonLight className="h-[3.25rem] w-full rounded-full" />
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200/80 bg-[#f4f7fb] p-4 sm:p-5">
          <SkeletonLight className="h-3 w-24" />
          <div className="mt-3 space-y-2.5">
            <SkeletonLight className="h-3.5 w-full" />
            <SkeletonLight className="h-3.5 w-full" />
            <SkeletonLight className="h-3.5 w-[92%]" />
            <SkeletonLight className="h-3.5 w-full" />
            <SkeletonLight className="h-3.5 w-[78%]" />
          </div>
        </div>
      </div>
    </div>
  );
}
