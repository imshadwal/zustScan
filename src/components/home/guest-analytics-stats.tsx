export type GuestAnalyticsDisplay = {
  pageViews: number;
  draftsGenerated: number;
  copyContinueTaps: number;
};

export function GuestAnalyticsStats({
  counts,
  variant = "light",
  compact = false,
}: {
  counts: GuestAnalyticsDisplay;
  variant?: "light" | "dark" | "admin";
  compact?: boolean;
}) {
  const items = [
    { label: "Scans", value: counts.pageViews, hint: "Guest page opens" },
    { label: "Drafts", value: counts.draftsGenerated, hint: "AI drafts created" },
    { label: "Copy & Continue", value: counts.copyContinueTaps, hint: "Clipboard + Google" },
  ] as const;

  const grid = compact ? "grid grid-cols-3 gap-2" : "grid grid-cols-3 gap-3 sm:gap-4";

  if (variant === "dark") {
    return (
      <dl className={grid}>
        {items.map((item) => (
          <div key={item.label} className="rounded-2xl bg-white/10 px-3 py-3 text-center">
            <dt className="text-[10px] font-semibold tracking-wide text-white/65 uppercase">
              {item.label}
            </dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums text-white">{item.value}</dd>
          </div>
        ))}
      </dl>
    );
  }

  if (variant === "admin") {
    return (
      <dl className={`${grid} text-left`}>
        {items.map((item) => (
          <div key={item.label} className="rounded-2xl bg-mist px-3 py-2.5">
            <dt className="text-[10px] font-semibold text-muted uppercase">{item.label}</dt>
            <dd className="mt-0.5 text-lg font-semibold tabular-nums text-ink">{item.value}</dd>
            <dd className="text-[10px] text-muted">{item.hint}</dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <dl className={grid}>
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
          <dt className="text-[10px] font-semibold tracking-wide text-muted uppercase">
            {item.label}
          </dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums text-ink">{item.value}</dd>
          <dd className="mt-0.5 text-[10px] leading-snug text-muted">{item.hint}</dd>
        </div>
      ))}
    </dl>
  );
}
