import { homeCardClass } from "@/components/home/styles";
import { setupStandeeLine, setupStandeeTitle } from "@/lib/site";

export function SetupStandeeCallout({
  className = "",
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "onDark";
}) {
  if (variant === "onDark") {
    return (
      <div
        className={`flex max-w-md gap-3 text-white ${className}`}
        role="note"
      >
        <span
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue/25 text-blue"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            stroke="currentColor"
            strokeWidth="1.75"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 7h11v8H3V7zm11 2h2l3 3v3h-5V9zm-7 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm8 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
            />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-snug text-white">
            {setupStandeeTitle}
          </p>
          <p className="mt-1.5 text-sm leading-6 text-white/80">{setupStandeeLine}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 sm:p-8 ${homeCardClass} ${className}`} role="note">
      <p className="caption-1 text-blue">
        {setupStandeeTitle}
      </p>
      <p className="body-3 mt-1.5 text-ink">{setupStandeeLine}</p>
    </div>
  );
}
