import { SkeletonLight } from "@/components/loading/skeleton-primitives";

export default function BrochureLoading() {
  return (
    <div className="min-h-dvh bg-mist-deep px-4 py-12" aria-busy="true" aria-label="Loading brochure">
      <SkeletonLight className="mx-auto h-10 w-48" />
      <SkeletonLight className="mx-auto mt-10 h-[70vh] max-w-3xl rounded-2xl" />
    </div>
  );
}
