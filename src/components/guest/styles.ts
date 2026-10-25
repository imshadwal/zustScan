/** Primary actions on themed guest pages (uses CSS variables from guestThemeCssVars). */
export const guestPrimaryButtonClass =
  "inline-flex cursor-pointer items-center justify-center rounded-full bg-[var(--guest-accent)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";

export const guestSelectedChipClass =
  "bg-[var(--guest-accent)] text-white shadow-md";

export const guestAccentTextClass = "text-[var(--guest-accent)]";

export const guestPanelClass =
  "rounded-2xl border-2 border-[var(--guest-border,#cbd5e1)] bg-[var(--guest-panel,#f4f7fb)] p-4 shadow-[0_2px_8px_rgba(7,20,40,0.06)]";

export const guestChipClass =
  "border-2 border-[var(--guest-border,#cbd5e1)] bg-[var(--guest-panel,#fff)] text-ink shadow-[0_1px_3px_rgba(7,20,40,0.08)] hover:border-[color-mix(in_srgb,var(--guest-accent)_45%,#cbd5e1)]";

export const guestFlowFooterClass =
  "border-t-2 border-[var(--guest-border,#e2e8f0)] bg-[color-mix(in_srgb,var(--guest-accent)_10%,var(--guest-surface,#f4f7fb))]";
