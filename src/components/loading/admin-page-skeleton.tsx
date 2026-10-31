import { SkeletonBlock, SkeletonDark } from "@/components/loading/skeleton-primitives";

export function AdminHeaderSkeleton() {
  return (
    <header className="border-b border-white/10">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <SkeletonDark className="h-10 w-28" />
        <div className="flex items-center gap-2">
          <SkeletonDark className="h-10 w-24 rounded-full" />
          <SkeletonDark className="h-10 w-36 rounded-full" />
          <SkeletonDark className="h-10 w-20 rounded-full" />
        </div>
      </div>
    </header>
  );
}

function OwnersListBodySkeleton() {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <SkeletonDark className="h-8 w-48" />
          <SkeletonDark className="h-4 w-64" />
        </div>
        <SkeletonDark className="h-10 w-32 rounded-full" />
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <SkeletonDark key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
      <ul className="mt-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <li key={i}>
            <SkeletonDark className="h-36 rounded-2xl sm:h-32" />
          </li>
        ))}
      </ul>
    </>
  );
}

function FormBodySkeleton() {
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <SkeletonDark className="h-8 w-56" />
      <SkeletonDark className="h-4 w-full max-w-md" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="space-y-2">
          <SkeletonDark className="h-3 w-24" />
          <SkeletonDark className="h-11 w-full rounded-xl" />
        </div>
      ))}
      <SkeletonDark className="mt-6 h-11 w-full rounded-full" />
    </div>
  );
}

function CategoriesBodySkeleton() {
  return (
    <>
      <SkeletonDark className="h-8 w-40" />
      <SkeletonDark className="mt-2 h-4 w-72" />
      <ul className="mt-8 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <li key={i}>
            <SkeletonDark className="h-14 rounded-xl" />
          </li>
        ))}
      </ul>
    </>
  );
}

export function AdminLoginSkeleton() {
  return (
    <SkeletonBlock label="Loading sign in">
      <div className="flex min-h-dvh items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <div className="mx-auto h-10 w-32 animate-pulse rounded-lg bg-slate-200/90" />
          <div className="mt-6 space-y-2">
            <div className="h-3 w-16 animate-pulse rounded bg-slate-200/90" />
            <div className="h-11 w-full animate-pulse rounded-xl bg-slate-200/90" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 w-20 animate-pulse rounded bg-slate-200/90" />
            <div className="h-11 w-full animate-pulse rounded-xl bg-slate-200/90" />
          </div>
          <div className="mt-8 h-11 w-full animate-pulse rounded-full bg-slate-200/90" />
        </div>
      </div>
    </SkeletonBlock>
  );
}

export type AdminPageSkeletonVariant = "owners" | "form" | "categories" | "login";

export function AdminPageSkeleton({ variant = "owners" }: { variant?: AdminPageSkeletonVariant }) {
  if (variant === "login") return <AdminLoginSkeleton />;

  return (
    <SkeletonBlock label="Loading admin page">
      <AdminHeaderSkeleton />
      <main className="mx-auto max-w-5xl px-4 py-8">
        {variant === "owners" ? <OwnersListBodySkeleton /> : null}
        {variant === "form" ? <FormBodySkeleton /> : null}
        {variant === "categories" ? <CategoriesBodySkeleton /> : null}
      </main>
    </SkeletonBlock>
  );
}
