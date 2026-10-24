import Image from "next/image";

export function LogoSpinner({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const onDark = theme === "dark";
  return (
    <div
      className="flex flex-col items-center gap-4"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="relative h-24 w-24 shrink-0">
        <div
          className="absolute inset-0 animate-spin rounded-full border-2 border-blue border-t-transparent"
          aria-hidden="true"
        />
        <div className="absolute inset-3 flex items-center justify-center">
          <Image
            src={onDark ? "/logo-on-dark.png" : "/logo.png"}
            alt=""
            width={1493}
            height={675}
            className="h-auto max-h-7 w-full max-w-full object-contain"
            aria-hidden="true"
          />
        </div>
      </div>
      <p className={`text-sm font-medium ${onDark ? "text-white/70" : "text-muted"}`}>Loading…</p>
    </div>
  );
}

export function LogoSpinnerPage({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const onDark = theme === "dark";
  return (
    <div
      className={`flex min-h-dvh items-center justify-center px-4 ${onDark ? "bg-navy" : "bg-mist"}`}
    >
      <LogoSpinner theme={theme} />
    </div>
  );
}
