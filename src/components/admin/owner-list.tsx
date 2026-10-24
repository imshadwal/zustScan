"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { OwnerIdentity } from "@/components/initials-badge";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  dangerButtonClass,
  fieldClass,
  primaryButtonClass,
  quietButtonClass,
} from "@/components/admin/styles";
import { displayTitle } from "@/lib/initials";
import { PasswordInput, RevealableSecret } from "@/components/password-input";

type OwnerCardData = {
  loginId: string;
  businessName: string | null;
  createdAtLabel: string;
  soldPriceLabel: string;
  setupComplete: boolean;
};

function OwnerCard({ owner, siteOrigin }: { owner: OwnerCardData; siteOrigin: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [shown, setShown] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePending, setDeletePending] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const pageUrl = `${siteOrigin}/c/${owner.loginId}`;
  const label = displayTitle(owner.businessName, owner.loginId);

  async function reset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setCopied(false);
    if (password.length < 8 || password.length > 72) {
      setError("Use a password of 8 to 72 characters.");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`/api/admin/business-owners/${owner.loginId}/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const body = (await response.json().catch(() => null)) as
        | { password?: string; error?: string }
        | null;
      if (!response.ok || !body?.password) {
        setError(body?.error ?? "The password could not be reset.");
        setPending(false);
        return;
      }
      setShown(body.password);
      setPassword("");
      setPending(false);
    } catch {
      setError("The request could not be sent.");
      setPending(false);
    }
  }

  async function copyPassword() {
    if (!shown) return;
    await navigator.clipboard.writeText(shown);
    setCopied(true);
  }

  function openDeleteDialog() {
    setDeleteError(null);
    setDeleteOpen(true);
  }

  async function confirmDelete() {
    setDeleteError(null);
    setDeletePending(true);
    try {
      const response = await fetch(`/api/admin/business-owners/${owner.loginId}`, {
        method: "DELETE",
      });
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setDeleteError(body?.error ?? "This business could not be deleted.");
        setDeletePending(false);
        return;
      }
      setDeleteOpen(false);
      setDeletePending(false);
      router.refresh();
    } catch {
      setDeleteError("The request could not be sent.");
      setDeletePending(false);
    }
  }

  return (
    <>
    <ConfirmDialog
      open={deleteOpen}
      tone="danger"
      title="Delete this business?"
      description={
        <>
          <p>
            You are about to remove <span className="font-semibold text-ink">{label}</span>{" "}
            <span className="font-mono text-ink">({owner.loginId})</span>.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>Business login and password</li>
            <li>Guest QR link and public page</li>
            <li>All services and products</li>
          </ul>
          {deleteError ? (
            <p className="mt-4 text-sm text-red-700" role="alert">
              {deleteError}
            </p>
          ) : null}
        </>
      }
      cancelLabel="Keep business"
      confirmLabel="Delete permanently"
      pending={deletePending}
      onCancel={() => {
        if (!deletePending) setDeleteOpen(false);
      }}
      onConfirm={confirmDelete}
    />
    <article className="rounded-3xl bg-white p-5 text-ink shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
      <div className="flex flex-col gap-5 sm:flex-row">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/admin/business-owners/${owner.loginId}/qr`}
          alt={`QR code linking to ${pageUrl}`}
          width={144}
          height={144}
          className="h-36 w-36 rounded-2xl border border-slate-200"
        />
        <div className="min-w-0 flex-1">
          <OwnerIdentity businessName={owner.businessName} loginId={owner.loginId} />
          <p className="mt-2 font-mono text-sm text-muted">{owner.loginId}</p>
          <p className="mt-1 text-sm text-muted">
            Sold for {owner.soldPriceLabel} · Created {owner.createdAtLabel}
            {owner.setupComplete ? " · Ready for guests" : " · Setup incomplete"}
          </p>
          <p className="mt-1 text-sm break-all text-muted">{pageUrl}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={`/api/admin/business-owners/${owner.loginId}/qr?download=1`}
              className={quietButtonClass}
            >
              Download QR
            </a>
            <button
              type="button"
              onClick={openDeleteDialog}
              disabled={deletePending || pending}
              className={dangerButtonClass}
            >
              Delete business
            </button>
          </div>
          {shown ? (
            <div className="mt-5 rounded-2xl bg-mist p-4" role="status">
              <p className="text-sm font-semibold">New password</p>
              <RevealableSecret value={shown} className="mt-1 font-mono break-all" />
              <p className="mt-2 text-sm text-muted">Shown once. It will not be displayed again.</p>
              <button type="button" onClick={copyPassword} className={`${quietButtonClass} mt-3`}>
                {copied ? "Copied" : "Copy password"}
              </button>
            </div>
          ) : (
            <form onSubmit={reset} className="mt-5">
              <label className="block text-sm font-semibold text-ink" htmlFor={`reset-${owner.loginId}`}>
                New password
              </label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <PasswordInput
                  id={`reset-${owner.loginId}`}
                  autoComplete="new-password"
                  value={password}
                  onChange={setPassword}
                  wrapperClassName="min-w-0 flex-1"
                  required
                />
                <button type="submit" className={primaryButtonClass} disabled={pending}>
                  {pending ? "Saving…" : "Reset"}
                </button>
              </div>
              {error ? (
                <p className="mt-2 text-sm text-red-700" role="alert">
                  {error}
                </p>
              ) : null}
            </form>
          )}
        </div>
      </div>
    </article>
    </>
  );
}

export function OwnerList({
  owners,
  siteOrigin,
  totalLabel,
  notice,
}: {
  owners: OwnerCardData[];
  siteOrigin: string;
  totalLabel: string;
  notice?: string | null;
}) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <section className="rounded-3xl bg-white p-6 text-ink shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
          <p className="text-sm font-semibold text-muted">Business owners</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight">{owners.length}</p>
        </section>
        <section className="rounded-3xl bg-blue p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
          <p className="text-sm font-semibold text-white/80">Made till now</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight">{totalLabel}</p>
        </section>
      </div>
      {notice ? (
        <p className="mt-4 text-sm text-red-200" role="alert">
          {notice}
        </p>
      ) : null}
      {owners.length === 0 ? (
        <div className="mt-6 rounded-3xl bg-white p-8 text-ink shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
          <p className="text-sm text-muted">
            No business owners yet. Create one to get a login and a QR.
          </p>
          <Link href="/admin/owners/new" className={`${primaryButtonClass} mt-6`}>
            New business owner
          </Link>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {owners.map((owner) => (
            <OwnerCard key={owner.loginId} owner={owner} siteOrigin={siteOrigin} />
          ))}
        </div>
      )}
    </div>
  );
}
