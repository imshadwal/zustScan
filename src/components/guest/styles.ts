/** Primary actions on themed guest pages (uses CSS variables from guestThemeCssVars). */
export const guestPrimaryButtonClass =
  "inline-flex cursor-pointer items-center justify-center rounded-full bg-[var(--guest-accent)] px-3 py-2 text-base font-semibold text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export const guestSelectedChipClass = "bg-[var(--guest-accent)] text-white";

export const guestAccentTextClass = "text-[var(--guest-accent)]";

export const guestPanelClass =
  "rounded-2xl border border-[var(--guest-border,#cbd5e1)] bg-[var(--guest-panel,#f4f7fb)] p-4";

export const guestChipClass =
  "rounded-xl border border-[var(--guest-border,#cbd5e1)] bg-white text-ink transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[var(--guest-accent)]";

export const guestFlowFooterClass = "mt-6";
