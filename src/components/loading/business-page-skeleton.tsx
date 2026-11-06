import { SkeletonBlock, SkeletonLight } from "@/components/loading/skeleton-primitives";

export function BusinessHeaderSkeleton() {
  return (
    <header className="px-4 pt-4">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <SkeletonLight className="h-11 w-11 shrink-0 rounded-xl" />
          <div className="min-w-0 space-y-2">
            <SkeletonLight className="h-4 w-36" />
            <SkeletonLight className="h-3 w-24" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SkeletonLight className="h-10 w-20 rounded-full" />
          <SkeletonLight className="h-10 w-24 rounded-full" />
          <SkeletonLight className="h-10 w-24 rounded-full" />
        </div>
      </div>
    </header>
  );
}

function DashboardBodySkeleton() {
  return (
    <>
      <SkeletonLight className="h-8 w-52" />
      <SkeletonLight className="mt-2 h-4 w-80 max-w-full" />
      <SkeletonLight className="mt-8 h-40 rounded-2xl" />
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <SkeletonLight key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <SkeletonLight className="mt-6 h-48 rounded-2xl" />
    </>
  );
}

function FormBodySkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <SkeletonLight className="h-8 w-40" />
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="space-y-2">
          <SkeletonLight className="h-3 w-28" />
          <SkeletonLight className="h-11 w-full rounded-xl" />
        </div>
      ))}
      <SkeletonLight className="mt-4 h-11 w-40 rounded-full" />
    </div>
  );
}

function ServicesBodySkeleton() {
  return (
    <>
      <SkeletonLight className="h-8 w-44" />
      <SkeletonLight className="mt-2 h-4 w-96 max-w-full" />
      <SkeletonLight className="mt-6 h-12 rounded-xl" />
      <ul className="mt-6 space-y-4">
        {[1, 2].map((i) => (
          <li key={i}>
            <SkeletonLight className="h-44 rounded-2xl" />
          </li>
        ))}
      </ul>
    </>
  );
}

export function BusinessLoginSkeleton() {
  return (
    <SkeletonBlock label="Loading sign in">
      <div className="flex min-h-dvh items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-ink shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <div className="mx-auto h-10 w-32 animate-pulse rounded-lg bg-slate-200/90" />
          <div className="mt-6 space-y-4">
            <div className="h-11 w-full animate-pulse rounded-xl bg-slate-200/90" />
            <div className="h-11 w-full animate-pulse rounded-xl bg-slate-200/90" />
          </div>
          <div className="mt-8 h-11 w-full animate-pulse rounded-full bg-slate-200/90" />
        </div>
      </div>
    </SkeletonBlock>
  );
}

export type BusinessPageSkeletonVariant = "dashboard" | "form" | "services" | "login";

export function BusinessPageSkeleton({
  variant = "dashboard",
}: {
  variant?: BusinessPageSkeletonVariant;
}) {
  if (variant === "login") return <BusinessLoginSkeleton />;

  return (
    <SkeletonBlock label="Loading business portal">
      <BusinessHeaderSkeleton />
      <main className="mx-auto max-w-5xl px-4 py-8">
        {variant === "dashboard" ? <DashboardBodySkeleton /> : null}
        {variant === "form" ? <FormBodySkeleton /> : null}
        {variant === "services" ? <ServicesBodySkeleton /> : null}
      </main>
    </SkeletonBlock>
  );
}
