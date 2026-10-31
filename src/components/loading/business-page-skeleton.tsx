import { SkeletonBlock, SkeletonDark } from "@/components/loading/skeleton-primitives";

export function BusinessHeaderSkeleton() {
  return (
    <header className="border-b border-white/10">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <SkeletonDark className="h-11 w-11 shrink-0 rounded-xl" />
          <div className="min-w-0 space-y-2">
            <SkeletonDark className="h-4 w-36" />
            <SkeletonDark className="h-3 w-24" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SkeletonDark className="h-10 w-20 rounded-full" />
          <SkeletonDark className="h-10 w-24 rounded-full" />
          <SkeletonDark className="h-10 w-24 rounded-full" />
        </div>
      </div>
    </header>
  );
}

function DashboardBodySkeleton() {
  return (
    <>
      <SkeletonDark className="h-8 w-52" />
      <SkeletonDark className="mt-2 h-4 w-80 max-w-full" />
      <SkeletonDark className="mt-8 h-40 rounded-2xl" />
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <SkeletonDark key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <SkeletonDark className="mt-6 h-48 rounded-2xl" />
    </>
  );
}

function FormBodySkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <SkeletonDark className="h-8 w-40" />
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="space-y-2">
          <SkeletonDark className="h-3 w-28" />
          <SkeletonDark className="h-11 w-full rounded-xl" />
        </div>
      ))}
      <SkeletonDark className="mt-4 h-11 w-40 rounded-full" />
    </div>
  );
}

function ServicesBodySkeleton() {
  return (
    <>
      <SkeletonDark className="h-8 w-44" />
      <SkeletonDark className="mt-2 h-4 w-96 max-w-full" />
      <SkeletonDark className="mt-6 h-12 rounded-xl" />
      <ul className="mt-6 space-y-4">
        {[1, 2].map((i) => (
          <li key={i}>
            <SkeletonDark className="h-44 rounded-2xl" />
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
