import Link from "next/link";
import { homeCardClass } from "@/components/home/styles";
import { otherNavLinks } from "@/lib/site";

export function HomeLearnRow() {
  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 lg:py-14">
        <p className="text-center text-xs font-semibold tracking-[0.16em] text-blue uppercase">
          Learn more
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
          {otherNavLinks.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`group flex h-full flex-col rounded-2xl px-5 py-5 transition-colors sm:px-6 sm:py-6 ${homeCardClass} hover:border-blue/35 hover:shadow-[0_12px_36px_rgba(7,20,40,0.1)]`}
              >
                <span className="text-base font-semibold text-ink group-hover:text-blue sm:text-lg">
                  {item.label}
                </span>
                <span className="mt-2 flex-1 text-sm leading-6 text-muted">{item.description}</span>
                <span className="mt-4 text-sm font-semibold text-blue" aria-hidden="true">
                  Read →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
