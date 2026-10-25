export const GUEST_TIERS = ["Good", "Great", "Exceptional"] as const;

export type GuestTier = (typeof GUEST_TIERS)[number];

/** Stars shown on Google should match how the guest felt (Good / Great / Exceptional). */
export function starsForTier(tier: GuestTier): number {
  if (tier === "Exceptional") return 5;
  if (tier === "Great") return 4;
  return 3;
}

export function isGuestTier(value: string): value is GuestTier {
  return GUEST_TIERS.includes(value as GuestTier);
}
