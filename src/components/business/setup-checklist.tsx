import Link from "next/link";
import type { SetupChecklist } from "@/lib/business-validation";
import { primaryButtonClass } from "@/components/admin/styles";

const items = [
  { key: "businessName" as const, label: "Business name" },
  { key: "city" as const, label: "City" },
  { key: "phone" as const, label: "Phone" },
  { key: "mapLink" as const, label: "Google review link" },
  { key: "brief" as const, label: "Brief" },
  { key: "hasService" as const, label: "At least one service" },
  {
    key: "everyServiceHasProduct" as const,
    label: "At least one product on every service",
  },
];

export function SetupChecklistCard({ checklist }: { checklist: SetupChecklist }) {
  if (checklist.complete) {
    return (
      <section className="rounded-3xl bg-blue p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <p className="text-sm font-semibold text-white/90">Ready for guests</p>
        <p className="mt-2 text-lg font-semibold">
          Setup is complete. Your guest page is live.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl bg-white p-6 text-ink shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
      <h2 className="text-lg font-semibold">Finish setup</h2>
      <p className="mt-2 text-sm text-muted">
        Guests cannot use your QR for reviews until every item below is done.
      </p>
      <ul className="mt-5 space-y-3">
        {items.map((item) => {
          const done = checklist[item.key];
          return (
            <li key={item.key} className="flex items-center gap-3 text-sm">
              <span
                className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  done ? "bg-blue text-white" : "bg-mist text-muted"
                }`}
                aria-hidden="true"
              >
                {done ? "✓" : "·"}
              </span>
              <span className={done ? "text-muted line-through" : "font-medium"}>{item.label}</span>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/business/profile" className={primaryButtonClass}>
          Edit profile
        </Link>
        <Link href="/business/services" className={primaryButtonClass}>
          Manage services
        </Link>
      </div>
    </section>
  );
}
