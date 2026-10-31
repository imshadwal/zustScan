import type { ReactNode } from "react";

export function SkeletonDark({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-white/10 ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonLight({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200/90 ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonBlock({
  label = "Loading",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <div aria-busy="true" aria-label={label}>
      {children}
    </div>
  );
}
