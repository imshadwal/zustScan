import Link from "next/link";
import { GuestLinkCopy } from "@/components/business/guest-link-copy";
import {
  GuestAnalyticsStats,
  type GuestAnalyticsDisplay,
} from "@/components/home/guest-analytics-stats";
import { OwnerIdentity } from "@/components/initials-badge";
import { primaryButtonClass, quietButtonClass } from "@/components/admin/styles";
import type { SetupChecklist } from "@/lib/business-validation";

const checklistItems = [
  { key: "businessName" as const, label: "Business name", href: "/business/profile" },
  { key: "city" as const, label: "City", href: "/business/profile" },
  { key: "category" as const, label: "Category", href: "/business/profile" },
  { key: "phone" as const, label: "Phone", href: "/business/profile" },
  { key: "mapLink" as const, label: "Google review link", href: "/business/profile" },
  { key: "hasService" as const, label: "At least one service", href: "/business/services" },
  {
    key: "everyServiceHasProduct" as const,
    label: "A product on every service",
    href: "/business/services",
  },
];

function progress(checklist: SetupChecklist) {
  const done = checklistItems.filter((item) => checklist[item.key]).length;
  return { done, total: checklistItems.length };
}

export function DashboardHome({
  businessName,
  loginId,
  logoUrl,
  checklist,
  serviceCount,
  productCount,
  guestUrl,
  guestAnalytics,
}: {
  businessName: string | null;
  loginId: string;
  logoUrl: string | null;
  checklist: SetupChecklist;
  serviceCount: number;
  productCount: number;
  guestUrl: string;
  guestAnalytics: GuestAnalyticsDisplay;
}) {
  const { done, total } = progress(checklist);
  const percent = Math.round((done / total) * 100);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white/70">Welcome back</p>
            <div className="mt-3">
              <OwnerIdentity
                businessName={businessName}
                loginId={loginId}
                logoUrl={logoUrl}
                size="xl"
              />
            </div>
            <p className="mt-3 text-sm text-white/60">
              Login id <span className="font-mono text-white/80">{loginId}</span>
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-sm font-semibold text-white/80">Setup progress</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">
              {done}
              <span className="text-lg text-white/50">/{total}</span>
            </p>
          </div>
        </div>
        <div className="mt-6">
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-blue transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-white/70">
            {checklist.complete
              ? "All steps complete — guests can use your QR."
              : percent === 0
                ? "Start with your profile, then add services guests can pick from."
                : `${total - done} step${total - done === 1 ? "" : "s"} left before your QR is ready for guests.`}
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {checklist.complete ? (
            <section className="rounded-3xl bg-blue p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
                Ready for guests
              </p>
              <p className="mt-2 text-base font-semibold leading-snug sm:text-lg">
                Setup is complete. Guests can scan your QR and use the review path on your page.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <p className="text-sm text-white/85">
                  {serviceCount} service{serviceCount === 1 ? "" : "s"} · {productCount} product
                  {productCount === 1 ? "" : "s"}
                </p>
                <Link
                  href={`/c/${loginId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white/35 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
                >
                  Preview guest page
                </Link>
              </div>
            </section>
          ) : null}

          <section className="rounded-3xl bg-white p-6 text-ink shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-8">
            <h2 className="text-lg font-semibold">Setup checklist</h2>
            <p className="mt-2 text-sm text-muted">
              {checklist.complete
                ? "All setup steps are done. You can still open any item to update your profile or catalog."
                : "Guests cannot use your QR for reviews until every item is complete."}
            </p>
            <ul className="mt-6 space-y-2">
              {checklistItems.map((item) => {
                const complete = checklist[item.key];
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors ${
                        complete
                          ? "bg-blue/5 ring-1 ring-blue/15 hover:bg-blue/10"
                          : "bg-mist hover:bg-blue/5 hover:ring-2 hover:ring-blue/20"
                      }`}
                    >
                      <span
                        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          complete ? "bg-blue text-white" : "border-2 border-slate-300 text-muted"
                        }`}
                      >
                        {complete ? "✓" : ""}
                      </span>
                      <span
                        className={`text-sm ${complete ? "font-medium text-muted line-through" : "font-semibold"}`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <aside className="flex flex-col gap-4">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white backdrop-blur-sm">
            <h2 className="text-sm font-semibold text-white/80">Guest activity</h2>
            <p className="mt-1 text-xs text-white/60">
              Anonymous counts — no guest names or review text stored.
            </p>
            <div className="mt-4">
              <GuestAnalyticsStats variant="dark" counts={guestAnalytics} />
            </div>
          </section>

          <section className="rounded-3xl bg-white p-5 text-ink shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
            <h2 className="text-sm font-semibold text-muted">Quick actions</h2>
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/business/profile" className={primaryButtonClass}>
                Business profile
              </Link>
              <Link href="/business/services" className={primaryButtonClass}>
                Services & products
              </Link>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Profile covers category, name, city, address, contact, Why trust us, Google review link,
              logo, and theme. Services are what guests choose after they
              scan.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white backdrop-blur-sm">
            <h2 className="text-sm font-semibold text-white/80">Guest QR link</h2>
            <p className="mt-2 text-xs text-white/65">
              Same URL as in your QR. Guests open this after they scan.
            </p>
            <GuestLinkCopy url={guestUrl} onDark />
          </section>

          <section className="rounded-3xl bg-white p-5 text-ink shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
            <h2 className="text-sm font-semibold text-muted">Catalog</h2>
            <dl className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-mist px-3 py-3">
                <dt className="text-xs font-semibold text-muted">Services</dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums">{serviceCount}</dd>
              </div>
              <div className="rounded-2xl bg-mist px-3 py-3">
                <dt className="text-xs font-semibold text-muted">Products</dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums">{productCount}</dd>
              </div>
            </dl>
            {serviceCount === 0 ? (
              <Link href="/business/services" className={`${quietButtonClass} mt-4 w-full`}>
                Add your first service
              </Link>
            ) : null}
          </section>
        </aside>
      </div>
    </div>
  );
}
