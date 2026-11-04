/** Public founder card. Null means the guest page must not show contact details. */
export type GuestFounder = {
  name: string;
  role: string | null;
  phone: string | null;
  email: string | null;
  note: string | null;
  photoUrl: string | null;
};

type FounderSource = {
  founder_visible?: boolean | null;
  founder_name?: string | null;
  founder_role?: string | null;
  founder_phone?: string | null;
  founder_email?: string | null;
  founder_note?: string | null;
};

/** Returns a card only when the owner turned it on and saved a name plus phone or email. */
export function guestFounderOrNull(
  row: FounderSource,
  photoUrl: string | null,
): GuestFounder | null {
  if (row.founder_visible !== true) return null;
  const name = row.founder_name?.trim().replace(/\s+/g, " ") ?? "";
  if (name.length < 2) return null;
  const phone = row.founder_phone?.trim() || null;
  const email = row.founder_email?.trim() || null;
  if (!phone && !email) return null;
  return {
    name,
    role: row.founder_role?.trim() || null,
    phone,
    email,
    note: row.founder_note?.trim() || null,
    photoUrl,
  };
}
