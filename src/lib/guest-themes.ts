import type { CSSProperties } from "react";

/** Curated guest-page palettes — owners pick one; contrast is pre-checked. */
export const GUEST_THEME_IDS = [
  "zust-default",
  "ocean",
  "forest",
  "wine",
  "sunset",
  "royal",
] as const;

export type GuestThemeId = (typeof GUEST_THEME_IDS)[number];

export type GuestTheme = {
  id: GuestThemeId;
  label: string;
  header: string;
  accent: string;
  headerEyebrow: string;
};

export const GUEST_THEMES: Record<GuestThemeId, GuestTheme> = {
  "zust-default": {
    id: "zust-default",
    label: "Zust blue",
    header: "#071428",
    accent: "#0066ff",
    headerEyebrow: "#93c5fd",
  },
  ocean: {
    id: "ocean",
    label: "Ocean teal",
    header: "#0c3d4a",
    accent: "#0891b2",
    headerEyebrow: "#a5f3fc",
  },
  forest: {
    id: "forest",
    label: "Forest green",
    header: "#14532d",
    accent: "#16a34a",
    headerEyebrow: "#bbf7d0",
  },
  wine: {
    id: "wine",
    label: "Wine red",
    header: "#4c0519",
    accent: "#be123c",
    headerEyebrow: "#fecdd3",
  },
  sunset: {
    id: "sunset",
    label: "Warm amber",
    header: "#451a03",
    accent: "#d97706",
    headerEyebrow: "#fde68a",
  },
  royal: {
    id: "royal",
    label: "Royal purple",
    header: "#3b0764",
    accent: "#7c3aed",
    headerEyebrow: "#ddd6fe",
  },
};

export const GUEST_THEME_LIST = GUEST_THEME_IDS.map((id) => GUEST_THEMES[id]);

export function isGuestThemeId(value: string): value is GuestThemeId {
  return (GUEST_THEME_IDS as readonly string[]).includes(value);
}

export function resolveGuestTheme(id: string | null | undefined): GuestTheme {
  if (id && isGuestThemeId(id)) return GUEST_THEMES[id];
  return GUEST_THEMES["zust-default"];
}

export function guestThemeCssVars(theme: GuestTheme): CSSProperties {
  const { accent, header } = theme;
  return {
    ["--guest-header" as string]: header,
    ["--guest-accent" as string]: accent,
    ["--guest-header-eyebrow" as string]: theme.headerEyebrow,
    ["--guest-page-bg" as string]: `color-mix(in srgb, ${accent} 16%, #e5eaf2)`,
    ["--guest-surface" as string]: `color-mix(in srgb, ${accent} 9%, white)`,
    ["--guest-panel" as string]: `color-mix(in srgb, ${accent} 14%, white)`,
    ["--guest-border" as string]: `color-mix(in srgb, ${accent} 30%, #cbd5e1)`,
  };
}
