import "server-only";

import { normalizePhone } from "@/lib/business-validation";
import { isValidLoginId, normalizeLoginId } from "@/lib/login-id";
import { OwnerStoreError } from "@/lib/store-error";
import { supabaseAdmin } from "@/lib/supabase/admin";

function clean(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function founderName(value: string) {
  const name = clean(value);
  return name.length >= 2 && name.length <= 80 ? name : null;
}

function founderRole(value: string) {
  const role = clean(value);
  return role.length >= 2 && role.length <= 40 ? role : null;
}

function founderNote(value: string) {
  const note = clean(value);
  return note.length >= 1 && note.length <= 200 ? note : null;
}

function founderEmail(value: string) {
  const email = value.trim().toLowerCase();
  if (!email || email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

export type FounderDetailsInput = {
  founderVisible: boolean;
  founderName: string;
  founderRole: string;
  founderPhone: string;
  founderEmail: string;
  founderNote: string;
};

function founderPatch(input: FounderDetailsInput) {
  const visible = input.founderVisible === true;
  const nameRaw = input.founderName.trim();
  let name: string | null = null;
  if (nameRaw) {
    name = founderName(nameRaw);
    if (!name) {
      throw new OwnerStoreError("Use a founder name of 2 to 80 characters.", 400);
    }
  } else if (visible) {
    throw new OwnerStoreError(
      "Enter the founder's name to show founder details on the guest page.",
      400,
    );
  }

  const roleRaw = input.founderRole.trim();
  let role: string | null = null;
  if (roleRaw) {
    role = founderRole(roleRaw);
    if (!role) {
      throw new OwnerStoreError("Founder role must be 2 to 40 characters, or leave it blank.", 400);
    }
  }

  const phoneRaw = input.founderPhone.trim();
  let founderPhone: string | null = null;
  if (phoneRaw) {
    founderPhone = normalizePhone(phoneRaw);
    if (!founderPhone) {
      throw new OwnerStoreError(
        "Enter a valid 10-digit mobile for the founder, or leave it blank.",
        400,
      );
    }
  }

  const emailRaw = input.founderEmail.trim();
  let email: string | null = null;
  if (emailRaw) {
    email = founderEmail(emailRaw);
    if (!email) {
      throw new OwnerStoreError("Enter a valid founder email, or leave it blank.", 400);
    }
  }

  if (visible && !founderPhone && !email) {
    throw new OwnerStoreError("Add a founder phone or email to show founder details.", 400);
  }

  const noteRaw = input.founderNote.trim();
  let note: string | null = null;
  if (noteRaw) {
    note = founderNote(noteRaw);
    if (!note) {
      throw new OwnerStoreError("Founder note must be 200 characters or fewer.", 400);
    }
  }

  return {
    founder_visible: visible,
    founder_name: name,
    founder_role: role,
    founder_phone: founderPhone,
    founder_email: email,
    founder_note: note,
  };
}

export async function updateBusinessFounder(loginId: string, input: FounderDetailsInput) {
  const id = normalizeLoginId(loginId);
  if (!isValidLoginId(id)) {
    throw new OwnerStoreError("That business owner was not found.", 404);
  }

  const { data: owner, error: lookupError } = await supabaseAdmin()
    .from("business_owners")
    .select("id")
    .eq("login_id", id)
    .maybeSingle();
  if (lookupError) {
    throw new OwnerStoreError("The business owner could not be saved.", 500);
  }
  if (!owner?.id) throw new OwnerStoreError("That business owner was not found.", 404);

  const { error } = await supabaseAdmin()
    .from("business_owners")
    .update({ ...founderPatch(input), updated_at: new Date().toISOString() })
    .eq("id", owner.id);
  if (error) {
    console.error("[founder-profile] save:", error);
    if (
      error.code === "42703" ||
      error.code === "PGRST204" ||
      /founder_|schema cache/i.test(error.message ?? "")
    ) {
      throw new OwnerStoreError(
        "Database schema is out of date. Run supabase/business-founder.sql in the Supabase SQL editor, then reload the API schema.",
        503,
      );
    }
    throw new OwnerStoreError("Founder details could not be saved.", 500);
  }
  return { ok: true as const };
}
