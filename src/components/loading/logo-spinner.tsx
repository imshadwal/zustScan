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
      <div className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center">
        <div
          className="absolute inset-0 animate-spin rounded-full border-2 border-blue border-t-transparent"
          aria-hidden="true"
        />
        <Image
          src={onDark ? "/logo-on-dark.png" : "/logo.png"}
          alt=""
          width={1493}
          height={675}
          className="relative h-8 w-auto"
          aria-hidden="true"
        />
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
