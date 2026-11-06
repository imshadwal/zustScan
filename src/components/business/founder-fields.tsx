"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { fieldClass, primaryButtonClass, quietButtonClass } from "@/components/admin/styles";
import { FounderPhotoCrop } from "@/components/business/founder-photo-crop";
import { useToast } from "@/components/toast/toast-provider";

export function FounderFields({
  visible,
  onVisibleChange,
  name,
  onNameChange,
  role,
  onRoleChange,
  phone,
  onPhoneChange,
  email,
  onEmailChange,
  note,
  onNoteChange,
  initialPhotoUrl,
  togglePending = false,
}: {
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
  name: string;
  onNameChange: (value: string) => void;
  role: string;
  onRoleChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  email: string;
  onEmailChange: (value: string) => void;
  note: string;
  onNoteChange: (value: string) => void;
  initialPhotoUrl: string | null;
  togglePending?: boolean;
}) {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const cropUrlRef = useRef<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPhotoUrl);
  const [photoPending, setPhotoPending] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  function closeCrop() {
    if (cropUrlRef.current) {
      URL.revokeObjectURL(cropUrlRef.current);
      cropUrlRef.current = null;
    }
    setCropSrc(null);
  }

  function openCrop(source: Blob) {
    closeCrop();
    const url = URL.createObjectURL(source);
    cropUrlRef.current = url;
    setCropSrc(url);
  }

  async function uploadPhoto(file: File) {
    setPhotoPending(true);
    try {
      const form = new FormData();
      form.set("photo", file);
      const response = await fetch("/api/business/founder-photo", { method: "POST", body: form });
      const body = (await response.json().catch(() => null)) as
        | { photoUrl?: string; error?: string }
        | null;
      if (!response.ok || !body?.photoUrl) {
        toastError(body?.error ?? "Photo could not be uploaded.");
        setPhotoPending(false);
        return;
      }
      setPhotoUrl(body.photoUrl);
      closeCrop();
      success("Founder photo uploaded.");
      router.refresh();
      setPhotoPending(false);
    } catch {
      toastError("The upload could not be sent.");
      setPhotoPending(false);
    }
  }

  async function removePhoto() {
    setPhotoPending(true);
    try {
      const response = await fetch("/api/business/founder-photo", { method: "DELETE" });
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        toastError(body?.error ?? "Photo could not be removed.");
        setPhotoPending(false);
        return;
      }
      setPhotoUrl(null);
      success("Founder photo removed.");
      router.refresh();
      setPhotoPending(false);
    } catch {
      toastError("The request could not be sent.");
      setPhotoPending(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-mist/60 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-ink">Founder details</h2>
          <p className="mt-1 text-sm text-muted">
            The switch saves immediately. Guests see the card only while it is on. A name and a
            phone or email are required to turn it on.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={visible}
          aria-label="Show founder details on the guest page"
          disabled={togglePending}
          onClick={() => onVisibleChange(!visible)}
          className={`relative mt-1 h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors disabled:cursor-wait disabled:opacity-60 ${
            visible ? "bg-blue" : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${
              visible ? "left-5" : "left-0.5"
            }`}
          />
        </button>
      </div>

      <div className="mt-5">
        <p className="text-sm font-semibold text-ink">Profile photo</p>
        <p className="mt-1 text-xs text-muted">
          PNG, JPEG, or WebP. Drag and zoom to frame it before it is saved.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          {photoUrl ? (
            <div className="relative h-20 w-20 overflow-hidden rounded-full border border-slate-200 bg-white">
              <Image src={photoUrl} alt="" fill className="object-cover" unoptimized />
            </div>
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-slate-300 bg-white text-xs text-muted">
              No photo
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  if (!file.type.startsWith("image/")) {
                    toastError("Use a PNG, JPEG, or WebP image.");
                  } else if (file.size > 12 * 1024 * 1024) {
                    toastError("Choose a photo under 12 MB.");
                  } else {
                    openCrop(file);
                  }
                }
                event.target.value = "";
              }}
            />
            <button
              type="button"
              disabled={photoPending}
              className={quietButtonClass}
              onClick={() => fileRef.current?.click()}
            >
              {photoPending ? "Uploading…" : photoUrl ? "Replace photo" : "Upload photo"}
            </button>
            {photoUrl ? (
              <button
                type="button"
                disabled={photoPending}
                className={quietButtonClass}
                onClick={() => {
                  void (async () => {
                    setPhotoPending(true);
                    try {
                      const response = await fetch(photoUrl);
                      if (!response.ok) throw new Error("load");
                      openCrop(await response.blob());
                      setPhotoPending(false);
                    } catch {
                      toastError("Could not open this photo to adjust. Upload it again.");
                      setPhotoPending(false);
                    }
                  })();
                }}
              >
                Adjust
              </button>
            ) : null}
            {photoUrl ? (
              <button
                type="button"
                disabled={photoPending}
                className={quietButtonClass}
                onClick={() => void removePhoto()}
              >
                Remove
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-ink" htmlFor="founder-name">
            Name {visible ? <span className="text-red-600">*</span> : null}
          </label>
          <input
            id="founder-name"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="Anita Sharma"
            className={`${fieldClass} mt-2`}
            maxLength={80}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-ink" htmlFor="founder-role">
            Role
          </label>
          <input
            id="founder-role"
            value={role}
            onChange={(event) => onRoleChange(event.target.value)}
            placeholder="Founder"
            className={`${fieldClass} mt-2`}
            maxLength={40}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-ink" htmlFor="founder-phone">
            Contact number
          </label>
          <input
            id="founder-phone"
            inputMode="tel"
            value={phone}
            onChange={(event) => onPhoneChange(event.target.value)}
            placeholder="7007052267"
            className={`${fieldClass} mt-2`}
          />
          <p className="mt-1.5 text-xs text-muted">10-digit Indian mobile. Optional if you add an email.</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-ink" htmlFor="founder-email">
            Email
          </label>
          <input
            id="founder-email"
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="anita@example.com"
            className={`${fieldClass} mt-2`}
            maxLength={120}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-ink" htmlFor="founder-note">
            Short note
          </label>
          <textarea
            id="founder-note"
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            rows={2}
            placeholder="Happy to hear how your visit went."
            className={`${fieldClass} mt-2 resize-y`}
            maxLength={200}
          />
          <p className="mt-1.5 text-xs text-muted">Optional. Up to 200 characters.</p>
        </div>
      </div>
      {cropSrc ? (
        <FounderPhotoCrop
          imageSrc={cropSrc}
          pending={photoPending}
          onCancel={() => {
            if (!photoPending) closeCrop();
          }}
          onUse={(file) => void uploadPhoto(file)}
        />
      ) : null}
    </div>
  );
}

export function FounderForm({
  initial,
}: {
  initial: {
    founderVisible: boolean;
    founderName: string | null;
    founderRole: string | null;
    founderPhone: string | null;
    founderEmail: string | null;
    founderNote: string | null;
    founderPhotoUrl: string | null;
  };
}) {
  const { success, error: toastError } = useToast();
  const [visible, setVisible] = useState(initial.founderVisible);
  const [name, setName] = useState(initial.founderName ?? "");
  const [role, setRole] = useState(initial.founderRole ?? "");
  const [phone, setPhone] = useState(initial.founderPhone ?? "");
  const [email, setEmail] = useState(initial.founderEmail ?? "");
  const [note, setNote] = useState(initial.founderNote ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [togglePending, setTogglePending] = useState(false);

  async function save(nextVisible: boolean) {
    const response = await fetch("/api/business/founder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        founderVisible: nextVisible,
        founderName: name,
        founderRole: role,
        founderPhone: phone,
        founderEmail: email,
        founderNote: note,
      }),
    });
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    if (!response.ok) {
      return body?.error ?? "Founder details could not be saved.";
    }
    return null;
  }

  async function changeVisibility(next: boolean) {
    if (pending || togglePending || next === visible) return;
    const previous = visible;
    setVisible(next);
    setError(null);
    setTogglePending(true);
    try {
      const message = await save(next);
      if (message) {
        setVisible(previous);
        setError(message);
        toastError(message);
        setTogglePending(false);
        return;
      }
      success(next ? "Founder card is on for guests." : "Founder card is hidden from guests.");
      setTogglePending(false);
    } catch {
      setVisible(previous);
      const message = "The request could not be sent.";
      setError(message);
      toastError(message);
      setTogglePending(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      const message = await save(visible);
      if (message) {
        setError(message);
        toastError(message);
        setPending(false);
        return;
      }
      success("Founder details saved.");
      setPending(false);
    } catch {
      const message = "The request could not be sent.";
      setError(message);
      toastError(message);
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-black/5 bg-white p-6 text-ink"
    >
      <FounderFields
        visible={visible}
        onVisibleChange={(next) => void changeVisibility(next)}
        togglePending={togglePending || pending}
        name={name}
        onNameChange={setName}
        role={role}
        onRoleChange={setRole}
        phone={phone}
        onPhoneChange={setPhone}
        email={email}
        onEmailChange={setEmail}
        note={note}
        onNoteChange={setNote}
        initialPhotoUrl={initial.founderPhotoUrl}
      />
      {error ? (
        <p className="mt-4 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" className={`${primaryButtonClass} mt-6`} disabled={pending}>
        {pending ? "Saving…" : "Save founder details"}
      </button>
    </form>
  );
}
