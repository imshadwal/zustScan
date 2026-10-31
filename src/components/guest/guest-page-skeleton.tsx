import { SkeletonLight } from "@/components/loading/skeleton-primitives";

/** Matches guest review flow layout while server data loads. */
export function GuestPageSkeleton({ stepCount = 4 }: { stepCount?: 4 | 3 }) {
  const labels = stepCount === 3 ? ["Experience", "Rating", "Draft"] : ["Service", "Product", "Rating", "Draft"];

  return (
    <div className="flex min-h-0 flex-col" data-guest-flow aria-busy="true" aria-label="Loading guest page">
      <div className="bg-navy px-5 py-7 sm:px-6 sm:py-8">
        <div className="flex items-start gap-4">
          <SkeletonLight className="h-16 w-16 shrink-0 rounded-2xl" />
          <div className="min-w-0 flex-1 space-y-3 pt-1">
            <SkeletonLight className="h-3 w-28" />
            <SkeletonLight className="h-8 w-full max-w-[14rem]" />
            <SkeletonLight className="h-4 w-3/4 max-w-xs" />
          </div>
        </div>
      </div>

      <div className="bg-white px-4 py-4 sm:px-5">
        <ol className="flex gap-1" aria-hidden="true">
          {labels.map((label) => (
            <li key={label} className="flex-1">
              <SkeletonLight className="h-1.5 rounded-full" />
              <SkeletonLight className="mx-auto mt-2 h-2 w-10" />
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-1 flex-col gap-3 bg-white px-4 pb-6 pt-2 sm:px-5">
        <div className="rounded-2xl border border-slate-200/80 bg-[#f4f7fb] p-4 sm:p-5">
          <SkeletonLight className="h-4 w-32" />
          <SkeletonLight className="mt-2 h-3 w-48" />
          <ul className="mt-4 space-y-2">
            {[1, 2, 3].map((i) => (
              <li key={i}>
                <SkeletonLight className="h-12 w-full rounded-xl" />
              </li>
            ))}
          </ul>
        </div>
        <SkeletonLight className="h-12 w-full rounded-full" />
      </div>
    </div>
  );
}
